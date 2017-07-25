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
var adapterManager = require("../adapterManager.js");
var CONF = require("../conf.js");

var parentAdapterID = CONSTANTS.COMMON.PARENT_ADAPTER_PREBID;

/* start-test-block */
exports.parentAdapterID = parentAdapterID;
/* end-test-block */
var kgpvMap = {};

/* start-test-block */
exports.kgpvMap = kgpvMap;
/* end-test-block */

var refThis = this;


function handleBidResponses(bidResponses){
	for(var responseID in bidResponses){
		/* istanbul ignore else */
		if(util.isOwnProperty(bidResponses, responseID) && util.isOwnProperty(refThis.kgpvMap, responseID)){
			var bidObject = bidResponses[responseID];
			var bids = bidObject.bids || [];

			for(var i = 0; i<bids.length; i++){
				var bid = bids[i];
				/* istanbul ignore else */
				if(bid.bidderCode){

					var theBid = BID.createBid(bid.bidderCode, refThis.kgpvMap[responseID].kgpv);
					theBid.setGrossEcpm(bid.cpm);
					theBid.setDealID(bid.dealId);
					theBid.setDealChannel(bid.dealChannel);
					theBid.setAdHtml(bid.ad || "");
					theBid.setWidth(bid.width);
					theBid.setHeight(bid.height);
					theBid.setReceivedTime(bid.responseTimestamp);
					//todo: does any PB partner passes URL as creative ?	
					util.forEachOnObject(bid.adserverTargeting, function(key, value){
						theBid.setKeyValuePair(key, value);
					});
					bidManager.setBidFromBidder(refThis.kgpvMap[responseID].divID, theBid);
				}
			}
		}
	}
}

/* start-test-block */
exports.handleBidResponses = handleBidResponses;
/* end-test-block */

function generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){					
			
	var code, sizes, divID = currentSlot.getDivID();

	if(kgpConsistsWidthAndHeight){
		code = divID + "@" + adapterID + "@" + currentWidth + "X" + currentHeight;
		sizes = [[currentWidth, currentHeight]];
	}else{
		//todo will it create issue if two partners do not have kgp w/o W n H
		// one of the partner 
		code = divID;
		sizes = currentSlot.getSizes();
	}

	refThis.kgpvMap [ code ] = {
		kgpv: generatedKey,
		divID: divID	
	};

	/* istanbul ignore else */
	if(!util.isOwnProperty(adUnits, code)){
		adUnits[code] = {
			code: code,
			sizes: sizes,
			bids: []
		};
	}
	
	var slotParams = {};
	util.forEachOnObject(keyConfig, function(key, value){
		/* istanbul ignore next */
		slotParams[key] = value;
	});			
	
	// processing for each partner
	switch(adapterID){
		case "pubmatic":
			slotParams["publisherId"] = adapterConfig["publisherId"];
			slotParams["adSlot"] = generatedKey;
			slotParams["wiid"] = impressionID;
			slotParams["profId"] = CONFIG.getProfileID();
			/* istanbul ignore else*/
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
			adUnits[code].bids.push({ bidder: adapterID, params: slotParams });
			break;	 
	}
};

/* start-test-block */
exports.generatedKeyCallback = generatedKeyCallback;
/* end-test-block */


function generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID){
	util.log(adapterID+CONSTANTS.MESSAGES.M1);
	
	if(!adapterConfig){
		return;
	}

	util.forEachGeneratedKey(
		adapterID,
		adUnits,
		adapterConfig,
		impressionID,
		[],
		activeSlots, 
		adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN], 
		adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || null, 
		refThis.generatedKeyCallback,
		true
	);
}

/* start-test-block */
exports.generatePbConf = generatePbConf;
/* end-test-block */

function fetchBids(activeSlots, impressionID){
	if(! window.pbjs){ // todo: move this code to initial state of adhooks
		util.log("PreBid js is not loaded");	
		return;
	}

	var adUnits = {};// create ad-units for prebid
	var randomNumberBelow100 = adapterManager.getRandomNumberBelow100();

	CONFIG.forEachAdapter(function(adapterID, adapterConfig){
		console.log("adapterID, adapterConfig ==>", adapterID, adapterConfig);
		// Assumption: all partners are running through PreBid,
		//				if we add any new parent-adapter, then code changes will be required
		/* istanbul ignore else */
		if(adapterID !== refThis.parentAdapterID){
			/* istanbul ignore if */
			if(adapterManager.throttleAdapter(randomNumberBelow100, adapterID) == false){
				adapterManager.setInitTimeForSlotsForAdapter(activeSlots, adapterID);
				refThis.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
			}else{
				util.log(adapterID+CONSTANTS.MESSAGES.M2);
			}
		}
	});

	// adUnits is object create array from it
	var adUnitsArray = [];
	for(var code in adUnits){
		/* istanbul ignore else */
		if(util.isOwnProperty(adUnits, code)){
			adUnitsArray.push(adUnits[code]);
		}
	}
	
	/* istanbul ignore else */
	if(adUnitsArray.length > 0 && window.pbjs){
		/* istanbul ignore else */
		if(util.isFunction(window.pbjs.setBidderSequence)){
			window.pbjs.setBidderSequence("random");
		}
		/* istanbul ignore else */
		if(util.isFunction(window.pbjs.requestBids)){
			window.pbjs.logging = true;//todo: enable optionally
			window.pbjs.requestBids({
				adUnits: adUnitsArray,
				bidsBackHandler: function(bidResponses) {
					refThis.handleBidResponses(bidResponses);
				},
				timeout: CONFIG.getTimeout()-50 //todo is it higher ?: major pre and post processing time and then 
			});
		}
	}
}

/* start-test-block */
exports.fetchBids = fetchBids;
/* end-test-block */


function getParenteAdapterID() {
	return refThis.parentAdapterID;
}

/* start-test-block */
exports.getParenteAdapterID = getParenteAdapterID;
/* end-test-block */

exports.register = function(){
	return {
		fB: refThis.fetchBids,
		ID: refThis.getParenteAdapterID
	};
};