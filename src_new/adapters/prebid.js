/*
	Note:
		
	TODO:
		PubMatic special handliing
		PulsePoint
			cf is mandatory , WxH
		RubiconFastlane
		we are not doing mandatory param check as PB does it
			does PB logs if mandatory param is missing
		Following partners require W,H to be passed 
			Piximedia	optional
			PubMatic	depends on KGP
			Sovrn		optional
			PulsePoint	cf mandatory
		Can we 	
*/
var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var BID = require("../bid.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");

var parentAdapterID = "prebid";
var kgpvMap = {};

function handleBidResponses(bidResponses){
	for(var responseID in bidResponses){
		if(util.isOwnProperty(bidResponses, responseID) && util.isOwnProperty(kgpvMap, responseID)){
			var bidObject = bidResponses[responseID];
			var bids = bidObject.bids || [];

			for(var i = 0; i<bids.length; i++){
				var bid = bids[i];
				if(bid.bidderCode){

					var theBid = BID.createBid(bid.bidderCode, kgpvMap[responseID].kgpv);
					theBid.
						setGrossEcpm(bid.cpm).
						setDealID(bid.dealId).
						setAdHtml(bid.ad || "").
						setWidth(bid.width).
						setHeight(bid.height).
						setReceivedTime(bid.responseTimestamp);
					//todo: does any PB partner passes URL as creative ?	
					util.forEachOnObject(bid.adserverTargeting, function(key, value){
						theBid.setKeyValuePair(key, value);
					});
					bidManager.setBidFromBidder(kgpvMap[responseID].divID, theBid);
				}
			}
		}
	}
}

function generatePbConf(adapterID, adapterConfig, activeSlots, adUnits){
	util.log(adapterID+CONSTANTS.MESSAGES.M1);
	
	if(!adapterConfig){
		return;
	}

	util.forEachGeneratedKey(
		adapterID,
		[],
		activeSlots, 
		adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN], 
		adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || null, 
		function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){					
			
			var code, sizes, divID = currentSlot.getDivID();

			if(kgpConsistsWidthAndHeight){
				code = divID + "@" + adapterID + "@" + currentWidth + "X" + currentHeight;
				sizes = [[currentWidth, currentHeight]];
			}else{
				code = divID;
				sizes = currentSlot.getSizes();
			}

			kgpvMap [ code ] = {
				kgpv: generatedKey,
				divID: divID	
			};
		
			if(!util.isOwnProperty(adUnits, code)){
				adUnits[ code ] = {
					code: code,
					sizes: sizes,
					bids: []
				};
			}

			// processing for each partner
				// 1 PubMatic
				// 2 Piximedia
				// 3 Sovrn
				// 4 PulsePoint				

			//todo we can loop on sizes
			//	then we can have special handling per adapter
			if(keyConfig){
				adUnits[ code ].bids.push({
					bidder: adapterID,
					params: keyConfig
				});
			}
		},
		true
	);
}

function fetchBids(activeSlots){

	if(! window.pbjs){
		util.log("PreBid js is not loaded");	
		return;
	}

	var adUnits = {};// create ad-units for prebid

	CONFIG.forEachAdapter(function(adapterID, adapterConfig){
		if(adapterID !== parentAdapterID){
			console.log(adapterConfig);
			generatePbConf(adapterID, adapterConfig, activeSlots, adUnits);	
		}
	});

	// adUnits is object create array from it
	var adUnitsArray = [];
	for(var code in adUnits){
		if(util.isOwnProperty(adUnits, code)){
			adUnitsArray.push(adUnits[code]);
		}
	}

	if(adUnitsArray.length > 0 && window.pbjs){

		if(util.isFunction(window.pbjs.setBidderSequence)){
			window.pbjs.setBidderSequence("random");
		}

		if(util.isFunction(window.pbjs.requestBids)){
			window.pbjs.logging = true;//todo: enable optionally
			window.pbjs.requestBids({
				adUnits: adUnitsArray,
				bidsBackHandler: function(bidResponses) {
					handleBidResponses(bidResponses);
				},
				timeout: CONFIG.getTimeout()-50 //todo is it higher ?: major pre and post processing time and then 
			});
		}
	}
}

exports.register = function(){
	return {
		fB: fetchBids,
		ID: function(){
			return parentAdapterID;
		}
	};
};