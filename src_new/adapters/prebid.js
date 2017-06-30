/*
	Note:
		Whenever we support a new PB adapter, we need to check if it needs actual sizes to be passed, 
			if so we will need to add special handling

	TODO:
		PubMatic special handliing
		We are not doing mandatory param check as PB does it
			does PB logs if mandatory param is missing		
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
						setDealChannel(bid.dealChannel).
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

function generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID){
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
			
			var slotParams = {};
			util.forEachOnObject(keyConfig, function(key, value){
				slotParams[key] = value;
			});			

			// processing for each partner
			switch(adapterID){
				case "pubmatic":
					slotParams["publisherId"] = adapterConfig["publisherId"];
					slotParams["adSlot"] = generatedKey;
					slotParams["wiid"] = impressionID;
					slotParams["profId"] = CONFIG.getProfileID();
					if(window.PWT.udpv){
						slotParams["verId"] = CONFIG.getProfileDisplayVersionID();
					}
					adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
					break;

				case "pulsepoint":					
					util.forEachOnArray(sizes, function(index, size){
						slotParams["cf"] = size[0] + "x" + size[1];
						adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
					});
					break;

				default:
					adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
					break;	 
			}
		},
		true
	);
}

function fetchBids(activeSlots, impressionID){

	if(! window.pbjs){
		util.log("PreBid js is not loaded");	
		return;
	}

	var adUnits = {};// create ad-units for prebid

	CONFIG.forEachAdapter(function(adapterID, adapterConfig){
		if(adapterID !== parentAdapterID){
			console.log(adapterConfig);
			generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);	
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