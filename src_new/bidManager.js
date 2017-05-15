var CONSTANTS = require('./constants.js');
var util = require('./util.js');

var bidMap = {};
var bidIdMap = {}; // bidID => {slotID, adapterID}
var bidManagerPwtConf = {};

//todo: combine following maps OR add these methods in adapterManager
var adapterRevShareMap = {};
var adapterThrottleMap = {};
var adapterBidPassThrough = {};

var bid = 'bid';
var bids = 'bidsFromBidders';
var postTimeout = 'post_timeout';
var creationTime = 'creationTime';
var callInitiatedTime = 'callInitiatedTime';
var bidReceivedTime = 'bidReceivedTime';

exports.createDealObject = function(dealID, dealChannel){
	var dealDetailsObj = {};
	dealDetailsObj[CONSTANTS.DEAL.ID] = dealID ? (''+dealID) : '';
	dealDetailsObj[CONSTANTS.DEAL.CHANNEL] = dealID && dealChannel ? (''+dealChannel) : '';
	return dealDetailsObj;
};

exports.createBidObject = function(ecpm, dealDetails, creativeID, creativeHTML, creativeURL, width, height, kgpv, keyValuePairs, defaultBid){
	var bidObject = {};		

	bidObject[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = ecpm;
	bidObject[constTargetingDeal] = dealDetails;
	bidObject[constTargetingAdHTML] = creativeHTML;
	bidObject[constTargetingAdUrl] = creativeURL;
	bidObject[constTargetingCreativeID] = creativeID;
	bidObject[constTargetingHeight] = height;
	bidObject[constTargetingWidth] = width;
	bidObject[constCommonKeyGenerationPatternValue] = kgpv;
	bidObject[CONSTANTS.COMMON.KEY_VALUE_PAIRS] = keyValuePairs || null;
	bidObject[constCommonDefaultBid] = defaultBid || 0;
	return bidObject;
};
	
function createBidEntry(divID){
	var temp;
	if(! util.isOwnProperty(bidMap, divID) ){		
		temp = {};
		temp[bids] = {};
		temp[CONSTANTS.COMMON.CONFIG] = {};
		temp[CONSTANTS.SLOT_ATTRIBUTES.SIZES] = [];
		temp[creationTime] = util.getCurrentTimestampInMs();
		bidMap[divID] = temp;
	}
}

exports.setConfig = function(divID, config){
	createBidEntry(divID);
	bidMap[divID][CONSTANTS.COMMON.CONFIG] = config;
};

exports.setSizes = function(divID, slotSizes){
	createBidEntry(divID);
	bidMap[divID][CONSTANTS.SLOT_ATTRIBUTES.SIZES] = slotSizes;
};

exports.setCallInitTime = function(divID, bidderID){
	createBidEntry(divID);
	if(! util.isOwnProperty(bidMap[divID][bids], bidderID) ){
		bidMap[divID][bids][bidderID] = {};
	}
	bidMap[divID][bids][bidderID][callInitiatedTime] = util.getCurrentTimestampInMs();	

	util.log(constCommonMessage04+divID + ' '+bidderID+' '+bidMap[divID][bids][bidderID][callInitiatedTime]);
};

exports.setBidFromBidder = function(divID, bidderID, bidDetails, bidID){

	if(!util.isOwnProperty(bidMap, divID)){
		util.log('BidManager is not expecting bid for '+ divID +', from ' + bidderID);
		return;
	}

	var currentTime = util.getCurrentTimestampInMs(),
		isPostTimeout = (bidMap[divID][creationTime]+TIMEOUT) < currentTime ? true : false
	;

	bidID = bidID || util.getUniqueIdentifierStr();

	createBidEntry(divID);

	if(! util.isOwnProperty(bidMap[divID][bids], bidderID) ){
		bidMap[divID][bids][bidderID] = {};
	}		

	util.log('BdManagerSetBid: divID: '+divID+', bidderID: '+bidderID+', ecpm: '+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] + ', size: ' + bidDetails[constTargetingWidth]+'x'+bidDetails[constTargetingHeight] + ', postTimeout: '+isPostTimeout);
	//util.log(constCommonMessage06+ util.isOwnProperty(bidMap[divID][bids][bidderID], bid));

	if(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] === null){
		util.log(constCommonMessage10);
		return;
	}

	if(utilIsStr(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM])){
		bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM].replace(/\s/g, '');
		if(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM].length === 0){
			util.log(constCommonMessage20);
			return;
		}
	}
	
	if(isNaN(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM])){
		util.log(constCommonMessage11+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
		return;
	}

	//todo: add validation, html / url should be present and should be a string

	// updaate bid ecpm according to revShare
	bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = parseFloat(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	
	// if adapter is not a BidPassThrough and ecpm is <= 0 then reject the bid
	//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
	//	util.log(constCommonMessage22+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	//	return;
	//}

	bidDetails[constTargetingActualEcpm] = parseFloat(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = parseFloat((bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] * bidManagerGetAdapterRevShare(bidderID)).toFixed(bidPrecision));

	//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
	//	util.log(constCommonMessage22+' Post revshare and bidPrecision. '+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	//	return;
	//}

	bidDetails[bidReceivedTime] = currentTime;
	bidDetails[postTimeout] = isPostTimeout;

	// un-comment following block when we can pass multiple bids from a partner for a slot
	/*
	if(! util.isOwnProperty(bidMap[divID][bids][bidderID], bid) ){
		bidMap[divID][bids][bidderID][bid] = {};	
	}

	bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;

	utilVLogInfo(divID, {
		type: bid,
		bidder: bidderID,
		bidDetails: bidDetails,
		startTime: bidMap[divID][creationTime],
		endTime: currentTime,
	});

	bidIdMap[bidID] = {
		s: divID,
		a: bidderID
	};
	*/		

	// comment following block when we can pass multiple bids from a partner for a slot
	if(util.isOwnProperty(bidMap[divID][bids][bidderID], bid)){

		var lastBidID = bidMap[divID][bids][bidderID][constCommonLastBidID],
			lastBidWasDefaultBid = bidMap[divID][bids][bidderID][bid][lastBidID][constCommonDefaultBid] == 1
		;

		if( lastBidWasDefaultBid || !isPostTimeout){				

			if(lastBidWasDefaultBid){
				util.log(constCommonMessage23);
			}				
							
			if( lastBidWasDefaultBid || bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] < bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){

				util.log(constCommonMessage12+bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+constCommonMessage13+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+constCommonMessage14);
				delete bidMap[divID][bids][bidderID][bid][lastBidID];
				bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
				bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
				bidIdMap[bidID] = {
					s: divID,
					a: bidderID
				};

				if(bidDetails[constCommonDefaultBid] === 0){
					utilVLogInfo(divID, {
						type: bid,
						bidder: bidderID + (adapterBidPassThrough[bidderID] ? '(PT)' : ''),
						bidDetails: bidDetails,
						startTime: bidMap[divID][creationTime],
						endTime: currentTime
					});
				}

			}else{
				util.log(constCommonMessage12+bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+constCommonMessage15+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+constCommonMessage16);
			}				
		}else{
			util.log(constCommonMessage17);
		}
	}else{

		util.log(constCommonMessage18);
		bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
		bidMap[divID][bids][bidderID][bid] = {};
		bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
		bidIdMap[bidID] = {
			s: divID,
			a: bidderID
		};

		if(bidDetails[constCommonDefaultBid] === 0){
			utilVLogInfo(divID, {
				type: bid,
				bidder: bidderID + (adapterBidPassThrough[bidderID] ? '(PT)' : ''),
				bidDetails: bidDetails,
				startTime: bidMap[divID][creationTime],
				endTime: currentTime
			});
		}	
	}		
};

exports.resetBid = function(divID, impressionID){
	//utilVLogInfo(divID, {type: "hr"});//todo
	delete bidMap[divID];
	createBidEntry(divID);	
	bidMap[divID][CONSTANTS.COMMON.IMPRESSION_ID] = impressionID;
};

function auctionBids(bids){
	var winningBidID = '',
		winningBidAdapter = '',
		winningBid = {},
		keyValuePairs = {}
	;
	winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = 0;

	for(var adapter in bids){
		if(bids[adapter] 
			&& bids[adapter].bid
			// commenting this condition as we need to pass kvp for all bids and bids which should not be part of auction will have zero ecpm
			//&& bids[adapter].bid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]
			// commenting this condition as postTimeout flag is now set at bid level
			//&& bids[adapter][postTimeout] == false
			){

			for(var bidID in bids[adapter].bid){

				if(! util.isOwnProperty(bids[adapter].bid, bidID)){
					continue;
				}

				var theBid = bids[adapter].bid[bidID];

				// do not consider post-timeout bids
				if(theBid[postTimeout]){
					continue;
				}
				
				/*
					if bidPassThrough is not enabled and ecpm > 0
						then only append the key value pairs from partner bid
				*/
				if(!adapterBidPassThrough[adapter] && theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0){
					if(theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]){
						util.copyKeyValueObject(keyValuePairs, theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]);
					}
				}					

				//BidPassThrough: Do not participate in auction)
				if(adapterBidPassThrough[adapter]){
					util.copyKeyValueObject(keyValuePairs, theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]);
					continue;
				}

				if(winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] < theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
					winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM];
					winningBidID = bidID;
					winningBidAdapter = adapter;
				}
			}
		}
	}

	if(winningBidID && winningBidAdapter){
		winningBid = bids[winningBidAdapter][bid][winningBidID];
		winningBid[constTargetingAdapterID] = winningBidAdapter;
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID] = winningBidID;
	}

	winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS] = keyValuePairs;
	return winningBid;
}

exports.getBid = function(divID, auctionFunction){

	var winningBid = {};
	winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = 0;

	if( util.isOwnProperty(bidMap, divID) ){		

		// if a custom auctionFunction is passed , let it evaluate the bids
		if(util.isFunction(auctionFunction)){
			return auctionFunction(bidMap[divID][bids]);
		}
		
		winningBid = auctionBids(bidMap[divID][bids]);
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS] = 1;
		bidMap[divID]['ae'] = true; // Analytics Enabled

		if(winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0){
			bidMap[divID][bids][ winningBid[constTargetingAdapterID] ][bid][winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID]].win = true;
			
			//todo
			/*utilVLogInfo(divID, {
				type: "win-bid",
				bidDetails: winningBid
			});*/

		}else{
			//todo
			/*utilVLogInfo(divID, {
				type: "win-bid-fail",
			});*/
		}
	}		

	return winningBid;
};

exports.displayCreative = function(theDocument, bidID){

	if(!util.isOwnProperty(bidIdMap, bidID)){
		util.log('Bid details not found for bidID: ' + bidID);
		return;
	}

	var divID = bidIdMap[bidID]['s'];
	var adapterID = bidIdMap[bidID]['a'];

	if( util.isOwnProperty(bidMap, divID) ){
		//var adapterID = '';
		// find the winning adapter
		/*
		for(var adapter in bidMap[divID][bids]){
			if( util.isOwnProperty(bidMap[divID][bids], adapter) && bidMap[divID][bids][adapter].win ){
				adapterID = adapter;
				break;		
			}
		}
		*/
		
		util.log(divID+constCommonMessage19+ adapterID);
		var theBid = bidMap[divID][bids][adapterID][bid][bidID];

		if( util.isOwnProperty(bidMap[divID][bids], adapterID) ){
			//todo: deprecate it
			/*adapterManagerDisplayCreative(
				theDocument, adapterID, theBid
			);*/
			//utilVLogInfo(divID, {type: 'disp', adapter: adapterID}); //todo
			this.executeMonetizationPixel({
				'slt': divID,
				'adp': adapterID,
				'en': theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM],
				'eg': theBid[constTargetingActualEcpm],
				'iid': bidMap[divID][CONSTANTS.COMMON.IMPRESSION_ID],
				'kgpv': theBid[constCommonKeyGenerationPatternValue],
				'bidid': bidID
			});
		}
	}		
};

exports.setGlobalConfig = function(config){
	if(util.isOwnProperty(config, CONSTANTS.CONFIG.GLOBAL) && util.isOwnProperty(config[CONSTANTS.CONFIG.GLOBAL], 'pwt')){
		bidManagerPwtConf = config[CONSTANTS.CONFIG.GLOBAL]['pwt'];
	}
	this.setAdapterConfig(config);
};

exports.getProfileID = function(){
	return bidManagerPwtConf[CONSTANTS.CONFIG.PROFILE_ID] || "0";
};

exports.getProfileDisplayVersionID = function(){
	return bidManagerPwtConf[CONSTANTS.CONFIG.PROFILE_VERSION_ID] || "0";
};

function getAnalyticsPixelURL(){
	return bidManagerPwtConf[CONSTANTS.CONFIG.LOGGER_URL] || false;
}

function getMonetizationPixelURL(){
	return bidManagerPwtConf[CONSTANTS.CONFIG.TRACKER_URL] || false;
}

function getAdapterConfig(configObject){
	if(	util.isOwnProperty(configObject, CONSTANTS.CONFIG.GLOBAL) 
		&& util.isOwnProperty(configObject[CONSTANTS.CONFIG.GLOBAL], CONSTANTS.CONFIG.ADAPTERS)){

		var adapterConfig = configObject[CONSTANTS.CONFIG.GLOBAL][CONSTANTS.CONFIG.ADAPTERS];

		for(var adapter in adapterConfig){
			if( util.isOwnProperty(adapterConfig, adapter) ){
				if(util.isOwnProperty(adapterConfig[adapter], CONSTANTS.COMMON.REV_SHARE)){
					adapterRevShareMap[adapter] = (1 - parseFloat(adapterConfig[adapter][CONSTANTS.COMMON.REV_SHARE])/100);	
				}

				if(util.isOwnProperty(adapterConfig[adapter], CONSTANTS.CONFIG.THROTTLE)){
					adapterThrottleMap[adapter] = 100 - parseFloat(adapterConfig[adapter][CONSTANTS.CONFIG.THROTTLE]);	
				}

				if(util.isOwnProperty(adapterConfig[adapter], CONSTANTS.CONFIG.BID_PASS_THROUGH)){
					adapterBidPassThrough[adapter] = parseInt(adapterConfig[adapter][CONSTANTS.CONFIG.BID_PASS_THROUGH]);
				}
			}
		}
	}		
}

function getAdapterRevShare(adapterID){
	if(util.isOwnProperty(adapterRevShareMap, adapterID)){
		return adapterRevShareMap[adapterID];
	}
	return 1;
}

function getAdapterThrottle(adapterID){
	if(util.isOwnProperty(adapterThrottleMap, adapterID)){
		return adapterThrottleMap[adapterID];
	}
	return 0;
}

exports.executeAnalyticsPixel = function(){

	var selectedInfo = {},
		outputObj = {},
		firePixel = false,
		impressionID = '',
		pixelURL = getAnalyticsPixelURL()
	;

	if(!pixelURL){
		return;
	}

	outputObj['s'] = [];

	for(var key in bidMap){

		if(! util.isOwnProperty(bidMap, key)){
			continue;
		}

		var startTime = bidMap[key][creationTime];
		if(util.isOwnProperty(bidMap, key) && bidMap[key].exp !== false && bidMap[key]['ae'] === true ){

			bidMap[key].exp = false;

			var slotObject = {
				'sn': key,
				'sz': bidMap[key][CONSTANTS.SLOT_ATTRIBUTES.SIZES],
				'ps': []
			};

			selectedInfo[key] = {};

			var bidsArray = bidMap[key][bids];
			impressionID = bidMap[key][CONSTANTS.COMMON.IMPRESSION_ID];

			for(var adapter in bidsArray){

				//if bid-pass-thru is set then do not log the bids
				if(adapterBidPassThrough[adapter]){
					continue;
				}

				if(bidsArray[adapter] && bidsArray[adapter].bid ){

					for(var bidID in bidsArray[adapter].bid){
						if(! util.isOwnProperty(bidsArray[adapter].bid, bidID)){
							continue;
						}
						var theBid = bidsArray[adapter].bid[bidID];
						var endTime = theBid[bidReceivedTime];
						slotObject['ps'].push({
							'pn': adapter,
							'bidid': bidID,
							'db': theBid[constCommonDefaultBid],
							'kgpv': theBid[constCommonKeyGenerationPatternValue],
							'psz': theBid[constTargetingWidth] + 'x' + theBid[constTargetingHeight],
							'eg': theBid[constTargetingActualEcpm],
							'en': theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM],
							'di': theBid[constTargetingDeal][CONSTANTS.DEAL.ID],
							'dc': theBid[constTargetingDeal][CONSTANTS.DEAL.CHANNEL],
							'l1': endTime - startTime,
							'l2': 0,
							't': theBid[postTimeout] === false ? 0 : 1,
							'wb': theBid['win'] === true ? 1 : 0
						});
						firePixel = true;
					}
					
				}
			}

			outputObj['s'].push(slotObject);
		}
	}

	if(firePixel){			
		outputObj[constConfigPublisherID] = bidManagerPwtConf[constConfigPublisherID];
		outputObj['to'] = bidManagerPwtConf['t'];
		outputObj['purl'] = decodeURIComponent(utilMetaInfo.u);
		outputObj[constBidInfoTimestamp] = util.getCurrentTimestamp();
		outputObj[CONSTANTS.COMMON.IMPRESSION_ID] = encodeURIComponent(impressionID);
		outputObj[CONSTANTS.CONFIG.PROFILE_ID] = bidManagerGetProfileID();
		outputObj[CONSTANTS.CONFIG.PROFILE_VERSION_ID] = bidManagerGetProfileDisplayVersionID();

		pixelURL += 'pubid=' + bidManagerPwtConf[constConfigPublisherID]+'&json=' + encodeURIComponent(JSON.stringify(outputObj));
	}

	if(firePixel){
		(new Image()).src = util.protocol + pixelURL;
		//utilAjaxCall(
		//	utilMetaInfo.protocol + pixelURL + 'pubid=' + bidManagerPwtConf[constConfigPublisherID],
		//	function(){},
		//	JSON.stringify(outputObj),
		//	{} // todo later
		//);
	}
};

exports.executeMonetizationPixel = function(bidInfo){

	var pixelURL = getMonetizationPixelURL();

	if(!pixelURL){
		return;
	}

	pixelURL += 'pubid=' + bidManagerPwtConf[constConfigPublisherID];
	pixelURL += '&purl=' + utilMetaInfo.u;
	pixelURL += '&tst=' + util.getCurrentTimestamp();
	pixelURL += '&iid=' + encodeURIComponent(bidInfo[CONSTANTS.COMMON.IMPRESSION_ID]);
	pixelURL += '&bidid=' + encodeURIComponent(bidInfo['bidid']);
	pixelURL += '&pid=' + encodeURIComponent(bidManagerGetProfileID());
	pixelURL += '&pdvid=' + encodeURIComponent(bidManagerGetProfileDisplayVersionID());
	pixelURL += '&slot=' + encodeURIComponent(bidInfo[constBidInfoSlot]);
	pixelURL += '&pn=' + encodeURIComponent(bidInfo[constBidInfoAdapter]);
	pixelURL += '&en=' + encodeURIComponent(bidInfo[constBidInfoNetEcpm]);
	pixelURL += '&eg=' + encodeURIComponent(bidInfo[constBidInfoGrossEcpm]);
	pixelURL += '&kgpv=' + encodeURIComponent(bidInfo[CONSTANTS.COMMON.KEY_GENERATION_PATTERN_VALUE]);

	(new Image()).src = util.protocol + pixelURL;
};