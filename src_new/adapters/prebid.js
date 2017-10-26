/*
	Note:
		Whenever we support a new PB adapter, we need to check if it needs actual sizes to be passed, 
			if so we will need to add special handling
		PreBid does not do mandatory parameters checking		
*/
var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var BID = require("../bid.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
var adapterManager = require("../adapterManager.js");
var CONF = require("../conf.js");

var parentAdapterID = CONSTANTS.COMMON.PARENT_ADAPTER_PREBID;

var pbNameSpace = "pbjs";
var pbNameSpaceCounter = 0;

/* start-test-block */
exports.parentAdapterID = parentAdapterID;
/* end-test-block */
var kgpvMap = {};

/* start-test-block */
exports.kgpvMap = kgpvMap;
/* end-test-block */

var refThis = this;

function transformPBBidToOWBid(bid, kgpv){
	var theBid = BID.createBid(bid.bidderCode, kgpv);
	theBid.setGrossEcpm(bid.cpm);
	theBid.setDealID(bid.dealId);
	theBid.setDealChannel(bid.dealChannel);
	theBid.setAdHtml(bid.ad || "");
	theBid.setAdUrl(bid.adUrl || "");
	theBid.setWidth(bid.width);
	theBid.setHeight(bid.height);
	theBid.setReceivedTime(bid.responseTimestamp);

	util.forEachOnObject(bid.adserverTargeting, function(key, value){
		theBid.setKeyValuePair(key, value);
	});
	return theBid;
}

/* start-test-block */
exports.transformPBBidToOWBid = transformPBBidToOWBid;
/* end-test-block */

function pbBidStreamHandler(pbBid){
	var responseID = pbBid.adUnitCode || "";
	/* istanbul ignore else */
	if(util.isOwnProperty(refThis.kgpvMap, responseID)){
		/* istanbul ignore else */
		if(pbBid.bidderCode){
			bidManager.setBidFromBidder(
				refThis.kgpvMap[responseID].divID, 
				refThis.transformPBBidToOWBid(pbBid, refThis.kgpvMap[responseID].kgpv)
			);
		}
	}
}

/* start-test-block */
exports.pbBidStreamHandler = pbBidStreamHandler;
/* end-test-block */

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
					bidManager.setBidFromBidder(refThis.kgpvMap[responseID].divID, transformPBBidToOWBid(bid, refThis.kgpvMap[responseID].kgpv));
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
		code = divID + "@" + adapterID;
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

		case "adg":
			util.forEachOnArray(sizes, function(index, size){
				slotParams["width"] = size[0];
				slotParams["height"] = size[1];
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
	
	/* istanbul ignore else */
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

	var newPBNameSpace = pbNameSpace + pbNameSpaceCounter++;
	window.pwtCreatePrebidNamespace(newPBNameSpace);

	/* istanbul ignore else */
	if(! window[newPBNameSpace]){ // todo: move this code to initial state of adhooks
		util.log("PreBid js is not loaded");	
		return;
	}


	if(util.isFunction(window[newPBNameSpace].onEvent)){
		window[newPBNameSpace].onEvent('bidResponse', refThis.pbBidStreamHandler);
	} else {
		util.log("PreBid js onEvent method is not available");	
		return;
	}

	window[newPBNameSpace].logging = util.isDebugLogEnabled();

	var adUnits = {};// create ad-units for prebid
	var randomNumberBelow100 = adapterManager.getRandomNumberBelow100();
	CONFIG.forEachAdapter(function(adapterID, adapterConfig){
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
	if(adUnitsArray.length > 0 && window[newPBNameSpace]){

		try{
			/* istanbul ignore else */
			if(util.isFunction(window[newPBNameSpace].setBidderSequence)){
				window[newPBNameSpace].setBidderSequence("random");
			}
			/* istanbul ignore else */
			if(util.isFunction(window[newPBNameSpace].requestBids)){				
				window[newPBNameSpace].requestBids({
					adUnits: adUnitsArray,
					// Note: Though we are not doing anything in the bidsBackHandler, it is required by PreBid
					bidsBackHandler: function(bidResponses) {
						util.log("In PreBid bidsBackHandler with bidResponses: ");
						util.log(bidResponses);
						//refThis.handleBidResponses(bidResponses);
					},
					timeout: CONFIG.getTimeout()-50 //todo is it higher ?: major pre and post processing time and then 
				});
			} else {
				util.log("PreBid js requestBids function is not available");	
				return;
			}
		} catch (e) {
			util.log('Error occured in calling PreBid.');
			util.log(e);
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