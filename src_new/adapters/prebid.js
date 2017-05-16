/*
	TODO:
		latency should be calculated ccording to mentioned in PB reponse
		on refresh or in some cases PB is not returning bids asap, using full timeout
*/

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

function generatePbConf(pbAdapterID, configObject, activeSlots, adUnits){

	var adapterIdInPreBid = pbAdapterID.replace(pbPrefix, ''); // todo move to a function

	util.log(pbAdapterID+CONSTANTS.MESSAGES.M1);

	var adapterConfig = util.loadGlobalConfigForAdapter(configObject, pbAdapterID, adapterConfigMandatoryParams);
	if(!adapterConfig){
		return;
	}
	
	var keyGenerationPattern = adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN];
	var keyLookupMap = adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP];

	util.forEachGeneratedKey(
		pbAdapterID,
		[],
		activeSlots, 
		keyGenerationPattern, 
		keyLookupMap, 
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

			var adUnit = adUnits[ code ],
				bid = {
					bidder: adapterIdInPreBid,
					params: keyConfig
				}
			;
			adUnit.bids.push(bid);					
		},
		true
	);
};

function fetchBids(configObject, activeSlots){

	if(! window.pbjs){
		util.log('PreBid js is not loaded');	
		return;
	}

	/* read own config, anything to read ? */
	//todo add a farzi conf param

	var adUnits = {};// create ad-units for prebid

	for(var pbAdapterID in configObject['global']['adapters']){
		if(util.isOwnProperty(configObject['global']['adapters'], pbAdapterID) && pbAdapterID.indexOf(pbPrefix) == 0){
			generatePbConf(pbAdapterID, configObject, activeSlots, adUnits);
		}
	}

	console.log('prebid adUnits:', adUnits);

	// adUnits is object create array from it
	var adUnitsArray = [];
	for(var code in adUnits){
		if(util.isOwnProperty(adUnits, code)){
			adUnitsArray.push(adUnits[code]);
		}
	}

	if(adUnitsArray.length > 0){
		if(pbjs && util.isFunction(pbjs.addAdUnits)){
			pbjs.addAdUnits(adUnitsArray);
			pbjs.requestBids({
                bidsBackHandler: function(bidResponses) {
					handleBidResponses(bidResponses);							
                },
                timeout: (2500)// T-150
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