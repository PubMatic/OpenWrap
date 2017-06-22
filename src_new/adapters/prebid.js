/*
	Note:
		
	TODO:
		Latency calculation by prebid data
			DONE		
		on refresh or in some cases PB is not returning bids asap, using full timeout
			DONE		
		read adapter level params and set to PB params accrdingly
			keep map of known adapter-level params, pass every other param in PB param
		PubMatic special handliing
		OpenX special handling
			deldomain param
		PulsePoint
			cf is mandatory , WxH
		RubiconFastlane		
		we are not doing mandatory param check as PB does it
			does PB logs if mandatory param is missing
*/
var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var BID = require("../bid.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");

var adapterID = "prebid";
var pbPrefix = "PB_";
var kgpvMap = {};
//var adapterConfigMandatoryParams = [CONSTANTS.CONFIG.KEY_GENERATION_PATTERN, CONSTANTS.CONFIG.KEY_LOOKUP_MAP];

function handleBidResponses(bidResponses){
	for(var responseID in bidResponses){
		if(util.isOwnProperty(bidResponses, responseID) && util.isOwnProperty(kgpvMap, responseID)){
			var bidObject = bidResponses[responseID];
			var bids = bidObject.bids || [];

			for(var i = 0; i<bids.length; i++){
				var bid = bids[i];
				if(bid.bidderCode){

					var theBid = BID.createBid(pbPrefix + bid.bidderCode, kgpvMap[responseID].kgpv);
					theBid.
						setGrossEcpm(bid.cpm).
						setDealID(bid.dealId).
						setDealChannel("NA").
						setAdHtml(bid.ad || "").
						setWidth(bid.width).
						setHeight(bid.height).
						setKeyValuePairs(bid.adserverTargeting || null).
						setReceivedTime(bid.responseTimestamp);
					bidManager.setBidFromBidder(kgpvMap[responseID].divID, theBid);
				}
			}
		}
	}
}

function generatePbConf(pbAdapterID, adapterConfig, activeSlots, adUnits){

	var adapterIdInPreBid = pbAdapterID.replace(pbPrefix, ""); // todo move to a function

	util.log(pbAdapterID+CONSTANTS.MESSAGES.M1);
	
	if(!adapterConfig){
		return;
	}	

	util.forEachGeneratedKey(
		pbAdapterID,
		[],
		activeSlots, 
		adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN], 
		adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP], 
		function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){					
			
			var code, sizes, divID = currentSlot.getDivID();

			if(kgpConsistsWidthAndHeight){
				code = divID + "@" + adapterIdInPreBid + "@" + currentWidth + "X" + currentHeight;
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

			adUnits[ code ].bids.push({
				bidder: adapterIdInPreBid,
				params: keyConfig
			});
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
		if(adapterID.indexOf(pbPrefix) == 0){
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
			//pbjs.addAdUnits(adUnitsArray);
			window.pbjs.logging = true;//todo: enable optionally
			window.pbjs.requestBids({
				adUnits: adUnitsArray,
				bidsBackHandler: function(bidResponses) {
					handleBidResponses(bidResponses);
				},
				timeout: CONFIG.getTimeout()-150 //todo is it higher ?
			});
		}
	}
}

exports.register = function(){
	return {
		fB: fetchBids,
		ID: function(){
			return adapterID;
		}
	};
};