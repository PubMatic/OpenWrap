var CONFIG = require('./config.js');
var CONSTANTS = require('./constants.js');
var util = require('./util.js');
var BID = require('./bid.js');

//PWT.bidIdMap = {}; // bidID => {slotID, adapterID}

var bid = 'bid';
var bids = 'bidsFromBidders';
var constCommonLastBidID = 'lastbidid';

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
	var timestamp = util.getCurrentTimestampInMs();
	PWT.bidMap[divID][bids][bidderID][CONSTANTS.BID_ATTRIBUTES.CALL_INITIATED_TIME] = timestamp;
	util.log(CONSTANTS.MESSAGES.M4+divID + ' '+bidderID+' '+timestamp);
};

exports.setBidFromBidder = function(divID, bidDetails){

	var bidderID = bidDetails.getAdapterID();
	var bidID = bidDetails.getBidID();

	if(!util.isOwnProperty(PWT.bidMap, divID)){
		util.log('BidManager is not expecting bid for '+ divID +', from ' + bidderID);
		return;
	}

	var currentTime = util.getCurrentTimestampInMs(),
		isPostTimeout = (PWT.bidMap[divID][CONSTANTS.BID_ATTRIBUTES.CREATION_TIME]+CONFIG.getTimeout()) < currentTime ? true : false
	;

	createBidEntry(divID);

	if(! util.isOwnProperty(PWT.bidMap[divID][bids], bidderID) ){
		PWT.bidMap[divID][bids][bidderID] = {};
	}		

	util.log('BdManagerSetBid: divID: '+divID+', bidderID: '+bidderID+', ecpm: '+bidDetails.getGrossEcpm() + ', size: ' + bidDetails.getWidth()+'x'+bidDetails.getHeight() + ', '+ CONSTANTS.BID_ATTRIBUTES.POST_TIMEOUT + ': '+isPostTimeout);
	//util.log(CONSTANTS.MESSAGES.M6+ util.isOwnProperty(PWT.bidMap[divID][bids][bidderID], bid));


	// todo: move following validations to a function
	var grossEcpm = bidDetails.getGrossEcpm();

	if(grossEcpm === null){
		util.log(CONSTANTS.MESSAGES.M10);
		return;
	}

	if(util.isString(grossEcpm)){
		grossEcpm = grossEcpm.replace(/\s/g, '');
		if(grossEcpm.length === 0){
			util.log(CONSTANTS.MESSAGES.M20);
			return;
		}
		grossEcpm = bidDetails.setGrossEcpm(grossEcpm).getGrossEcpm();
	}
	
	if(isNaN(grossEcpm)){
		util.log(CONSTANTS.MESSAGES.M11+grossEcpm);
		return;
	}

	//todo: add validation, html / url should be present and should be a string

	// updaate bid ecpm according to revShare	
	grossEcpm = bidDetails.setGrossEcpm(parseFloat(grossEcpm)).getGrossEcpm();
	
	// if adapter is not a BidPassThrough and ecpm is <= 0 then reject the bid
	//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
	//	util.log(CONSTANTS.MESSAGES.M22+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	//	return;
	//}

	bidDetails.setNetEcpm(parseFloat(grossEcpm * CONFIG.getAdapterRevShare(bidderID)).toFixed(CONSTANTS.COMMON.BID_PRECISION));

	//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
	//	util.log(CONSTANTS.MESSAGES.M22+' Post revshare and CONSTANTS.COMMON.BID_PRECISION. '+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
	//	return;
	//}

	bidDetails.setReceivedTime(currentTime);
	if(isPostTimeout === true){
		bidDetails.setPostTimeoutStatus();
	}

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
			lastBid = PWT.bidMap[divID][bids][bidderID][bid][lastBidID],
			lastBidWasDefaultBid = lastBid.getDefaultBidStatus() === 1
		;

		if( lastBidWasDefaultBid || !isPostTimeout){				

			if(lastBidWasDefaultBid){
				util.log(CONSTANTS.MESSAGES.M23);
			}				

			//if( lastBidWasDefaultBid || PWT.bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] < bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
			if( lastBidWasDefaultBid || lastBid.getNetEcpm() < bidDetails.getNetEcpm() ){

				util.log(CONSTANTS.MESSAGES.M12+lastBid.getNetEcpm()+CONSTANTS.MESSAGES.M13+bidDetails.getNetEcpm()+CONSTANTS.MESSAGES.M14);
				delete PWT.bidMap[divID][bids][bidderID][bid][lastBidID];
				PWT.bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
				PWT.bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
				PWT.bidIdMap[bidID] = {
					s: divID,
					a: bidderID
				};

				if(bidDetails.getDefaultBidStatus() === 0){
					/*utilVLogInfo(divID, {
						type: bid,
						bidder: bidderID + (CONFIG.getBidPassThroughStatus(bidderID) !== 0 ? '(PT)' : ''),
						bidDetails: bidDetails,
						startTime: PWT.bidMap[divID][CONSTANTS.BID_ATTRIBUTES.CREATION_TIME],
						endTime: currentTime
					});*/
				}

			}else{
				util.log(CONSTANTS.MESSAGES.M12+lastBid.getNetEcpm()+CONSTANTS.MESSAGES.M15+bidDetails.getNetEcpm()+CONSTANTS.MESSAGES.M16);
			}				
		}else{
			util.log(CONSTANTS.MESSAGES.M17);
		}
	}else{

		util.log(CONSTANTS.MESSAGES.M18);
		// todo following 6 lines should be moved to a func
		PWT.bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
		PWT.bidMap[divID][bids][bidderID][bid] = {};
		PWT.bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
		PWT.bidIdMap[bidID] = {
			s: divID,
			a: bidderID
		};
		if(bidDetails.getDefaultBidStatus() === 0){
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
	var winningBid = null,
		keyValuePairs = {}
	;

	for(var adapter in bids){
		if(bids[adapter] 
			&& bids[adapter].bid
			){

			for(var bidID in bids[adapter].bid){

				if(! util.isOwnProperty(bids[adapter].bid, bidID)){
					continue;
				}

				var theBid = bids[adapter].bid[bidID];

				// do not consider post-timeout bids
				if(theBid.getPostTimeoutStatus() === true){
					continue;
				}
				
				/*
					if bidPassThrough is not enabled and ecpm > 0
						then only append the key value pairs from partner bid
				*/
				if(CONFIG.getBidPassThroughStatus(adapter) === 0 && theBid.getNetEcpm() > 0){
					util.copyKeyValueObject(keyValuePairs, theBid.getKeyValuePairs());
				}					

				//BidPassThrough: Do not participate in auction)
				if(CONFIG.getBidPassThroughStatus(adapter) !== 0){
					util.copyKeyValueObject(keyValuePairs, theBid.getKeyValuePairs());
					continue;
				}

				if(winningBid == null){
					winningBid = theBid;
				}else if(winningBid.getNetEcpm() < theBid.getNetEcpm()){
					winningBid = theBid;
				}
			}
		}
	}

	return {
		wb: winningBid,
		kvp: keyValuePairs
	};
}

exports.getBid = function(divID, auctionFunction){

	var winningBid = null;
	var keyValuePairs = null;
	//winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = 0;

	if( util.isOwnProperty(PWT.bidMap, divID) ){		
		var data = auctionBids(PWT.bidMap[divID][bids]);
		winningBid = data.wb;
		keyValuePairs = data.kvp;

		
		PWT.bidMap[divID]['ae'] = true; // Analytics Enabled

		if(winningBid && winningBid.getNetEcpm() > 0){
			winningBid.setStatus(1);
			winningBid.setWinningBidStatus();
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

	return {wb: winningBid, kvp: keyValuePairs};
};

exports.getBid_OLD = function(divID, auctionFunction){

	//todo: create a new bid object

	var winningBid = {};
	winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = 0;

	if( util.isOwnProperty(PWT.bidMap, divID) ){		

		// if a custom auctionFunction is passed , let it evaluate the bids
		if(util.isFunction(auctionFunction)){
			return auctionFunction(PWT.bidMap[divID][bids]);
		}
		
		winningBid = auctionBids(PWT.bidMap[divID][bids]);
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS] = 1;// todo: do we need this ?
		PWT.bidMap[divID]['ae'] = true; // Analytics Enabled

		if(winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0){
			// todo: mark the bid as winning bid
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

exports.getBidById = function(bidID){

	if(!util.isOwnProperty(bidIdMap, bidID)){
		util.log('Bid details not found for bidID: ' + bidID);
		return null;
	}

	var divID = PWT.bidIdMap[bidID]['s'];
	var adapterID = PWT.bidIdMap[bidID]['a'];

	if( util.isOwnProperty(PWT.bidMap, divID) ){	
		if( util.isOwnProperty(PWT.bidMap[divID][bids], adapterID) ){
			util.log(bidID+': '+divID+CONSTANTS.MESSAGES.M19+ adapterID);
			var theBid = PWT.bidMap[divID][bids][adapterID][bid][bidID];
			return {
				bid: theBid,
				slotid: divID
			};
		}
	}

	util.log('Bid details not found for bidID: ' + bidID);
	return null;
};

exports.displayCreative = function(theDocument, bidID){

	var bidDetails = this.etBidById(bidID);

	if(bidDetails){
		var theBid = bidDetails.bid,
			divID = bidDetails.slotid
		;
		util.displayCreative(theDocument, theBid);
		//utilVLogInfo(divID, {type: 'disp', adapter: adapterID});
		this.executeMonetizationPixel(divID, theBid);
	}
};

// todo: accept PWT.bidMap as parameter
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
						var endTime = theBid.getReceivedTime();
						slotObject['ps'].push({
							'pn': adapter,
							'bidid': bidID,
							'db': theBid.getDefaultBidStatus(),
							'kgpv': theBid.getKGPV(),
							'psz': theBid.getWidth() + 'x' + theBid.getHeight(),
							'eg': theBid.getGrossEcpm(),
							'en': theBid.getNetEcpm(),
							'di': theBid.getDealID(),
							'dc': theBid.getDealChannel(),
							'l1': endTime - startTime,
							'l2': 0,
							't': theBid.getPostTimeoutStatus() === false ? 0 : 1,
							'wb': theBid.getWinningBidStatus() === true ? 1 : 0
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

exports.executeMonetizationPixel = function(slotID, theBid){

	var pixelURL = CONFIG.getMonetizationPixelURL();

	if(!pixelURL){
		return;
	}

	pixelURL += 'pubid=' + CONFIG.getPublisherId();
	pixelURL += '&purl=' + utilMetaInfo.u;
	pixelURL += '&tst=' + util.getCurrentTimestamp();
	pixelURL += '&iid=' + encodeURIComponent(PWT.bidMap[slotID][constImpressionID]); // todo
	pixelURL += '&bidid=' + encodeURIComponent(theBid.getBidID());
	pixelURL += '&pid=' + encodeURIComponent(CONFIG.getProfileID());
	pixelURL += '&pdvid=' + encodeURIComponent(CONFIG.getProfileDisplayVersionID());
	pixelURL += '&slot=' + encodeURIComponent(slotID);
	pixelURL += '&pn=' + encodeURIComponent(theBid.getAdapterID());
	pixelURL += '&en=' + encodeURIComponent(theBid.getNetEcpm());
	pixelURL += '&eg=' + encodeURIComponent(theBid.getGrossEcpm());
	pixelURL += '&kgpv=' + encodeURIComponent(theBid.getKGPV());

	(new Image()).src = util.protocol + pixelURL;
};

//todo
// check if all bid comparisons are made on netEcpm
// data types in logger pixel