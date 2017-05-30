/*
	TODO:
		latency should be calculated ccording to mentioned in PB reponse
		on refresh or in some cases PB is not returning bids asap, using full timeout
		read adapter level params and set to PB params accrdingly
			keep map of known adapter-level params, pass every other param in PB param
		PubMatic special handliing
*/
var CONFIG = require('../config.js');
var CONSTANTS = require('../constants.js');
var BID = require('../bid.js');
var util = require('../util.js');
var bidManager = require('../bidManager.js');
var adapterManager = require('../adapterManager.js');

var adapterID = 'prebid';
var pbPrefix = 'PB_';
var kgpvMap = {};
var adapterConfigMandatoryParams = [CONSTANTS.CONFIG.KEY_GENERATION_PATTERN, CONSTANTS.CONFIG.KEY_LOOKUP_MAP];

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
						setAdHtml(bid.ad).
						setWidth(bid.width).
						setHeight(bid.height).
						setKeyValuePairs(bid.adserverTargeting || null);
					bidManager.setBidFromBidder(kgpvMap[responseID].divID, theBid);
				}
			}
		}
	}
}

function generatePbConf(pbAdapterID, adapterConfig, activeSlots, adUnits){

	var adapterIdInPreBid = pbAdapterID.replace(pbPrefix, ''); // todo move to a function

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
			
			var code, sizes;

			if(kgpConsistsWidthAndHeight){
				code = currentSlot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID] + '@' + adapterIdInPreBid + '@' + currentWidth + 'X' + currentHeight;
				sizes = [[currentWidth, currentHeight]];
			}else{
				code = currentSlot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID];
				sizes = currentSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES];
			}

			kgpvMap [ code ] = {
				kgpv: generatedKey,
				divID: currentSlot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID]	
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
};

function fetchBids(activeSlots, impressionID){

	if(! window.pbjs){
		util.log('PreBid js is not loaded');	
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

	if(adUnitsArray.length > 0 && pbjs){

		if(util.isFunction(pbjs.setBidderSequence)){
			pbjs.setBidderSequence('random');
		}

		if(util.isFunction(pbjs.requestBids)){
			//pbjs.addAdUnits(adUnitsArray);
			pbjs.requestBids({
				adUnits: adUnitsArray,
                bidsBackHandler: function(bidResponses) {
					handleBidResponses(bidResponses);
                },
                timeout: CONFIG.getTimeout()-150
			});
		}
	}
};

exports.register = function(){
	return {
		fB: fetchBids,
		ID: function(){
			return adapterID;
		}
	};
};