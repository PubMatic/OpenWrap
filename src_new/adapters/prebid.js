/*
	TODO:
		latency should be calculated ccording to mentioned in PB reponse
		on refresh or in some cases PB is not returning bids asap, using full timeout
*/
var CONFIG = require('../config.js');
var CONSTANTS = require('../constants.js');
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
					bidManager.setBidFromBidder(
						kgpvMap[responseID].divID, 
						pbPrefix + bid.bidderCode, 
						bidManager.createBidObject(
							bid.cpm,
							bidManager.createDealObject(bid.dealId, "NA"),
							"",
							bid.ad,
							"",
							bid.width,
							bid.height,
							kgpvMap[responseID].kgpv,
							bid.adserverTargeting || null
						), 
						util.getUniqueIdentifierStr()
					);
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

			/*
			var adUnit = adUnits[ code ],
				bid = {
					bidder: adapterIdInPreBid,
					params: keyConfig
				}
			;
			adUnit.bids.push(bid);
			*/
		},
		true
	);
};

function fetchBids(activeSlots, impressionID){

	if(! window.pbjs){
		util.log('PreBid js is not loaded');	
		return;
	}

	// todo: dont we need to register ever adapter ?

	var adUnits = {};// create ad-units for prebid

	// todo: move to config, forEachAdapter, accepts callback
	/*
	for(var pbAdapterID in configObject['global']['adapters']){
		if(util.isOwnProperty(configObject['global']['adapters'], pbAdapterID) && pbAdapterID.indexOf(pbPrefix) == 0){
			generatePbConf(pbAdapterID, configObject, activeSlots, adUnits);
		}
	}
	*/

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

	if(adUnitsArray.length > 0){
		if(pbjs && util.isFunction(pbjs.addAdUnits)){
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
		dC: util.displayCreative,
		ID: function(){
			return adapterID;
		}
	};
};