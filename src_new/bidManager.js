var CONFIG = require('./config.js');
var CONSTANTS = require('./constants.js');
var util = require('./util.js');
var BID = require('./bid.js');

//PWT.bidIdMap = {}; // bidID => {slotID, adapterID}

var bid = 'bid';
var bids = 'bidsFromBidders';
var constCommonLastBidID = 'lastbidid';


// todo: may need to delete
exports.createDealObject = function(dealID, dealChannel){
	var dealDetailsObj = {};
	dealDetailsObj[CONSTANTS.DEAL.ID] = dealID ? (''+dealID) : '';
	dealDetailsObj[CONSTANTS.DEAL.CHANNEL] = dealID && dealChannel ? (''+dealChannel) : '';
	return dealDetailsObj;
};

exports.createBidObject = function(ecpm, dealDetails, creativeID, creativeHTML, creativeURL, width, height, kgpv, keyValuePairs, defaultBid){
	var bidObject = {};		
	//todo: add adapter-id, bid-id as well
	bidObject[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = ecpm;
	bidObject[CONSTANTS.BID_ATTRIBUTES.DEAL] = dealDetails;
	bidObject[CONSTANTS.BID_ATTRIBUTES.AD_HTML] = creativeHTML;
	bidObject[CONSTANTS.BID_ATTRIBUTES.AD_URL] = creativeURL;
	bidObject[CONSTANTS.BID_ATTRIBUTES.CREATIVE_ID] = creativeID;
	bidObject[CONSTANTS.COMMON.HEIGHT] = height;
	bidObject[CONSTANTS.COMMON.WIDTH] = width;
	bidObject[CONSTANTS.COMMON.KEY_GENERATION_PATTERN_VALUE] = kgpv;
	bidObject[CONSTANTS.COMMON.KEY_VALUE_PAIRS] = keyValuePairs || null;
	bidObject[CONSTANTS.BID_ATTRIBUTES.DEFAULT_BID] = defaultBid || 0;
	return bidObject;
};

function createBidEntry(divID){
	var temp;
	if(! util.isOwnProperty(PWT.bidMap, divID) ){		
		temp = {};
		temp[bids] = {};
		temp[CONSTANTS.SLOT_ATTRIBUTES.SIZES] = [];
		temp[CONSTANTS.BID_ATTRIBUTES.CREATION_TIME] = util.getCurrentTimestampInMs();
		PWT.bidMap[divID] = temp;
	}
}

exports.setSizes = function(divID, slotSizes){
	createBidEntry(divID);
	PWT.bidMap[divID][CONSTANTS.SLOT_ATTRIBUTES.SIZES] = slotSizes;
};

exports.setCallInitTime = function(divID, bidderID){
	createBidEntry(divID);
	if(! util.isOwnProperty(PWT.bidMap[divID][bids], bidderID) ){
		PWT.bidMap[divID][bids][bidderID] = {};
	}
	PWT.bidMap[divID][bids][bidderID][CONSTANTS.BID_ATTRIBUTES.CALL_INITIATED_TIME] = util.getCurrentTimestampInMs();	

	util.log(CONSTANTS.MESSAGES.M4+divID + ' '+bidderID+' '+PWT.bidMap[divID][bids][bidderID][CONSTANTS.BID_ATTRIBUTES.CALL_INITIATED_TIME]);
};

exports.setBidFromBidder = function(divID, bidderID, bidDetails, bidID){

	if(!util.isOwnProperty(PWT.bidMap, divID)){
		util.log('BidManager is not expecting bid for '+ divID +', from ' + bidderID);
		return;
	}

	var currentTime = util.getCurrentTimestampInMs(),
		isPostTimeout = (PWT.bidMap[divID][CONSTANTS.BID_ATTRIBUTES.CREATION_TIME]+CONFIG.getTimeout()) < currentTime ? true : false
	;

	bidID = bidID || util.getUniqueIdentifierStr();

	createBidEntry(divID);

	if(! util.isOwnProperty(PWT.bidMap[divID][bids], bidderID) ){
		PWT.bidMap[divID][bids][bidderID] = {};
	}		

	util.log('BdManagerSetBid: divID: '+divID+', bidderID: '+bidderID+', ecpm: '+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] + ', size: ' + bidDetails[CONSTANTS.COMMON.WIDTH]+'x'+bidDetails[CONSTANTS.COMMON.HEIGHT] + ', '+ CONSTANTS.BID_ATTRIBUTES.POST_TIMEOUT + ': '+isPostTimeout);
	//util.log(CONSTANTS.MESSAGES.M6+ util.isOwnProperty(PWT.bidMap[divID][bids][bidderID], bid));

	if(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] === null){
		util.log(CONSTANTS.MESSAGES.M10);
		return;
	}

	if(util.isString(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM])){
		bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM].replace(/\s/g, '');
		if(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM].length === 0){
			util.log(CONSTANTS.MESSAGES.M20);
			return;
		}
	}
	
	if(isNaN(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM])){
		util.log(CONSTANTS.MESSAGES.M11+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
		return;
	}

	//todo: add validation, html / url should be present and should be a string

	// updaate bid ecpm according to revShare
	bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = parseFloat(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	
	// if adapter is not a BidPassThrough and ecpm is <= 0 then reject the bid
	//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
	//	util.log(CONSTANTS.MESSAGES.M22+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	//	return;
	//}

	bidDetails[CONSTANTS.BID_ATTRIBUTES.ACTUAL_ECPM] = parseFloat(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = parseFloat((bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] * CONFIG.getAdapterRevShare(bidderID)).toFixed(CONSTANTS.COMMON.BID_PRECISION));

	//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
	//	util.log(CONSTANTS.MESSAGES.M22+' Post revshare and CONSTANTS.COMMON.BID_PRECISION. '+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	//	return;
	//}

	bidDetails[CONSTANTS.BID_ATTRIBUTES.BID_RECEIVED_TIME] = currentTime;
	bidDetails[CONSTANTS.BID_ATTRIBUTES.POST_TIMEOUT] = isPostTimeout;

	// un-comment following block when we can pass multiple bids from a partner for a slot
	/*
	if(! util.isOwnProperty(PWT.bidMap[divID][bids][bidderID], bid) ){
		PWT.bidMap[divID][bids][bidderID][bid] = {};	
	}

	PWT.bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;

	utilVLogInfo(divID, {
		type: bid,
		bidder: bidderID,
		bidDetails: bidDetails,
		startTime: PWT.bidMap[divID][CONSTANTS.BID_ATTRIBUTES.CREATION_TIME],
		endTime: currentTime,
	});

	PWT.bidIdMap[bidID] = {
		s: divID,
		a: bidderID
	};
	*/		

	// comment following block when we can pass multiple bids from a partner for a slot
	if(util.isOwnProperty(PWT.bidMap[divID][bids][bidderID], bid)){

		var lastBidID = PWT.bidMap[divID][bids][bidderID][constCommonLastBidID],
			lastBidWasDefaultBid = PWT.bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.BID_ATTRIBUTES.DEFAULT_BID] == 1
		;

		if( lastBidWasDefaultBid || !isPostTimeout){				

			if(lastBidWasDefaultBid){
				util.log(CONSTANTS.MESSAGES.M23);
			}				
							
			if( lastBidWasDefaultBid || PWT.bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] < bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){

				util.log(CONSTANTS.MESSAGES.M12+PWT.bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+CONSTANTS.MESSAGES.M13+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+CONSTANTS.MESSAGES.M14);
				delete PWT.bidMap[divID][bids][bidderID][bid][lastBidID];
				PWT.bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
				PWT.bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
				PWT.bidIdMap[bidID] = {
					s: divID,
					a: bidderID
				};

				if(bidDetails[CONSTANTS.BID_ATTRIBUTES.DEFAULT_BID] === 0){
					/*utilVLogInfo(divID, {
						type: bid,
						bidder: bidderID + (CONFIG.getBidPassThroughStatus(bidderID) !== 0 ? '(PT)' : ''),
						bidDetails: bidDetails,
						startTime: PWT.bidMap[divID][CONSTANTS.BID_ATTRIBUTES.CREATION_TIME],
						endTime: currentTime
					});*/
				}

			}else{
				util.log(CONSTANTS.MESSAGES.M12+PWT.bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+CONSTANTS.MESSAGES.M15+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]+CONSTANTS.MESSAGES.M16);
			}				
		}else{
			util.log(CONSTANTS.MESSAGES.M17);
		}
	}else{

		util.log(CONSTANTS.MESSAGES.M18);
		PWT.bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
		PWT.bidMap[divID][bids][bidderID][bid] = {};
		PWT.bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
		PWT.bidIdMap[bidID] = {
			s: divID,
			a: bidderID
		};

		if(bidDetails[CONSTANTS.BID_ATTRIBUTES.DEFAULT_BID] === 0){
			/*utilVLogInfo(divID, {
				type: bid,
				bidder: bidderID + (CONFIG.getBidPassThroughStatus(bidderID) !== 0 ? '(PT)' : ''),
				bidDetails: bidDetails,
				startTime: PWT.bidMap[divID][CONSTANTS.BID_ATTRIBUTES.CREATION_TIME],
				endTime: currentTime
			});*/
		}	
	}		
};

exports.resetBid = function(divID, impressionID){
	//utilVLogInfo(divID, {type: "hr"});//todo
	delete PWT.bidMap[divID];
	createBidEntry(divID);	
	PWT.bidMap[divID][CONSTANTS.COMMON.IMPRESSION_ID] = impressionID;
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
			// commenting this condition as CONSTANTS.BID_ATTRIBUTES.POST_TIMEOUT flag is now set at bid level
			//&& bids[adapter][CONSTANTS.BID_ATTRIBUTES.POST_TIMEOUT] == false
			){

			for(var bidID in bids[adapter].bid){

				if(! util.isOwnProperty(bids[adapter].bid, bidID)){
					continue;
				}

				var theBid = bids[adapter].bid[bidID];

				// do not consider post-timeout bids
				if(theBid[CONSTANTS.BID_ATTRIBUTES.POST_TIMEOUT]){
					continue;
				}
				
				/*
					if bidPassThrough is not enabled and ecpm > 0
						then only append the key value pairs from partner bid
				*/
				if(CONFIG.getBidPassThroughStatus(adapter) === 0 && theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0){
					if(theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]){
						util.copyKeyValueObject(keyValuePairs, theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]);
					}
				}					

				//BidPassThrough: Do not participate in auction)
				if(CONFIG.getBidPassThroughStatus(adapter) !== 0){
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
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID] = winningBidAdapter;
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID] = winningBidID;
	}

	winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS] = keyValuePairs;
	return winningBid;
}

exports.getBid = function(divID, auctionFunction){

	var winningBid = {};
	winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = 0;

	if( util.isOwnProperty(PWT.bidMap, divID) ){		

		// if a custom auctionFunction is passed , let it evaluate the bids
		if(util.isFunction(auctionFunction)){
			return auctionFunction(PWT.bidMap[divID][bids]);
		}
		
		winningBid = auctionBids(PWT.bidMap[divID][bids]);
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS] = 1;
		PWT.bidMap[divID]['ae'] = true; // Analytics Enabled

		if(winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0){
			PWT.bidMap[divID][bids][ winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID] ][bid][winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID]].win = true;
			
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

// todo can we remove this one ?
exports.displayCreative = function(theDocument, bidID){

	if(!util.isOwnProperty(PWT.bidIdMap, bidID)){
		util.log('Bid details not found for bidID: ' + bidID);
		return;
	}

	var divID = PWT.bidIdMap[bidID]['s'];
	var adapterID = PWT.bidIdMap[bidID]['a'];

	if( util.isOwnProperty(PWT.bidMap, divID) ){	
		util.log(divID+CONSTANTS.MESSAGES.M19+ adapterID);
		var theBid = PWT.bidMap[divID][bids][adapterID][bid][bidID];

		// unnecessary check move this check before getting theBid
		if( util.isOwnProperty(PWT.bidMap[divID][bids], adapterID) ){
			util.displayCreative(theDocument, theBid);
			//utilVLogInfo(divID, {type: 'disp', adapter: adapterID}); //todo

			//todo: change strings to constants
			this.executeMonetizationPixel({
				'slt': divID,
				'adp': adapterID,
				'en': theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM],
				'eg': theBid[CONSTANTS.BID_ATTRIBUTES.ACTUAL_ECPM],
				'iid': PWT.bidMap[divID][CONSTANTS.COMMON.IMPRESSION_ID],
				'kgpv': theBid[CONSTANTS.COMMON.KEY_GENERATION_PATTERN_VALUE],
				'bidid': bidID
			});
		}
	}		
};

exports.executeAnalyticsPixel = function(){

	var selectedInfo = {},
		outputObj = {},
		firePixel = false,
		impressionID = '',
		pixelURL = CONFIG.getAnalyticsPixelURL()
	;

	if(!pixelURL){
		return;
	}

	outputObj['s'] = [];

	for(var key in PWT.bidMap){

		if(! util.isOwnProperty(PWT.bidMap, key)){
			continue;
		}

		var startTime = PWT.bidMap[key][CONSTANTS.BID_ATTRIBUTES.CREATION_TIME];
		if(util.isOwnProperty(PWT.bidMap, key) && PWT.bidMap[key].exp !== false && PWT.bidMap[key]['ae'] === true ){

			PWT.bidMap[key].exp = false;

			var slotObject = {
				'sn': key,
				'sz': PWT.bidMap[key][CONSTANTS.SLOT_ATTRIBUTES.SIZES],
				'ps': []
			};

			selectedInfo[key] = {};

			var bidsArray = PWT.bidMap[key][bids];
			impressionID = PWT.bidMap[key][CONSTANTS.COMMON.IMPRESSION_ID];

			for(var adapter in bidsArray){

				//if bid-pass-thru is set then do not log the bids
				// 1: do NOT log, do NOT auction
				// 2: do log, do NOT auction
				if(CONFIG.getBidPassThroughStatus(adapter) === 1){
					continue;
				}

				if(bidsArray[adapter] && bidsArray[adapter].bid ){

					for(var bidID in bidsArray[adapter].bid){
						if(! util.isOwnProperty(bidsArray[adapter].bid, bidID)){
							continue;
						}
						var theBid = bidsArray[adapter].bid[bidID];
						var endTime = theBid[CONSTANTS.BID_ATTRIBUTES.BID_RECEIVED_TIME];
						slotObject['ps'].push({
							'pn': adapter,
							'bidid': bidID,
							'db': theBid[CONSTANTS.BID_ATTRIBUTES.DEFAULT_BID],
							'kgpv': theBid[CONSTANTS.COMMON.KEY_GENERATION_PATTERN_VALUE],
							'psz': theBid[CONSTANTS.COMMON.WIDTH] + 'x' + theBid[CONSTANTS.COMMON.HEIGHT],
							'eg': theBid[CONSTANTS.BID_ATTRIBUTES.ACTUAL_ECPM],
							'en': theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM],
							'di': theBid[CONSTANTS.BID_ATTRIBUTES.DEAL][CONSTANTS.DEAL.ID],
							'dc': theBid[CONSTANTS.BID_ATTRIBUTES.DEAL][CONSTANTS.DEAL.CHANNEL],
							'l1': endTime - startTime,
							'l2': 0,
							't': theBid[CONSTANTS.BID_ATTRIBUTES.POST_TIMEOUT] === false ? 0 : 1,
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
		outputObj[CONSTANTS.CONFIG.PUBLISHER_ID] = CONFIG.getPublisherId();
		outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMEOUT] = CONFIG.getTimeout();
		outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.PAGE_URL] = decodeURIComponent(util.pageURL);//todo change it 
		outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMESTAMP] = util.getCurrentTimestamp();
		outputObj[CONSTANTS.COMMON.IMPRESSION_ID] = encodeURIComponent(impressionID);
		outputObj[CONSTANTS.CONFIG.PROFILE_ID] = CONFIG.getProfileID();
		outputObj[CONSTANTS.CONFIG.PROFILE_VERSION_ID] = CONFIG.getProfileDisplayVersionID();

		pixelURL += 'pubid=' + CONFIG.getPublisherId()+'&json=' + encodeURIComponent(JSON.stringify(outputObj));
	}

	if(firePixel){
		(new Image()).src = util.protocol + pixelURL;
		//utilAjaxCall(
		//	utilMetaInfo.protocol + pixelURL + 'pubid=' + CONFIG.getPublisherId(),
		//	function(){},
		//	JSON.stringify(outputObj),
		//	{} // todo later
		//);
	}
};

exports.executeMonetizationPixel = function(bidInfo){

	var pixelURL = CONFIG.getMonetizationPixelURL();

	if(!pixelURL){
		return;
	}

	pixelURL += 'pubid=' + CONFIG.getPublisherId();
	pixelURL += '&purl=' + utilMetaInfo.u;
	pixelURL += '&tst=' + util.getCurrentTimestamp();
	pixelURL += '&iid=' + encodeURIComponent(bidInfo[CONSTANTS.COMMON.IMPRESSION_ID]);
	pixelURL += '&bidid=' + encodeURIComponent(bidInfo['bidid']);
	pixelURL += '&pid=' + encodeURIComponent(CONFIG.getProfileID());
	pixelURL += '&pdvid=' + encodeURIComponent(CONFIG.getProfileDisplayVersionID());
	pixelURL += '&slot=' + encodeURIComponent(bidInfo[constBidInfoSlot]);
	pixelURL += '&pn=' + encodeURIComponent(bidInfo[constBidInfoAdapter]);
	pixelURL += '&en=' + encodeURIComponent(bidInfo[constBidInfoNetEcpm]);
	pixelURL += '&eg=' + encodeURIComponent(bidInfo[constBidInfoGrossEcpm]);
	pixelURL += '&kgpv=' + encodeURIComponent(bidInfo[CONSTANTS.COMMON.KEY_GENERATION_PATTERN_VALUE]);

	(new Image()).src = util.protocol + pixelURL;
};