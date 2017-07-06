var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");
var bmEntry = require("./bmEntry.js")
//PWT.bidIdMap = {}; // bidID => {slotID, adapterID}

var refThis = this;

function createBidEntry(divID){ // TDD done
	if(! util.isOwnProperty(window.PWT.bidMap, divID) ){
		window.PWT.bidMap[divID] = bmEntry.createBMEntry(divID);
	}
}

/* start-test-block */
exports.createBidEntry = createBidEntry;
/* end-test-block */

exports.setSizes = function(divID, slotSizes){ // TDD done
	refThis.createBidEntry(divID);
	window.PWT.bidMap[divID].setSizes(slotSizes);
};

exports.setCallInitTime = function(divID, adapterID){ // TDD done
	refThis.createBidEntry(divID);
	window.PWT.bidMap[divID].setAdapterEntry(adapterID);
};

exports.setBidFromBidder = function(divID, bidDetails){ // TDD done

	var bidderID = bidDetails.getAdapterID();
	var bidID = bidDetails.getBidID();
	var bidMapEntry = window.PWT.bidMap[divID];

	if(!util.isOwnProperty(window.PWT.bidMap, divID)){
		util.log("BidManager is not expecting bid for "+ divID +", from " + bidderID);
		return;
	}

	var isPostTimeout = (bidMapEntry.getCreationTime()+CONFIG.getTimeout()) < bidDetails.getReceivedTime() ? true : false,
		latency = bidDetails.getReceivedTime() - bidMapEntry.getCreationTime();

	refThis.createBidEntry(divID); // TODO : remove this call

	util.log("BdManagerSetBid: divID: "+divID+", bidderID: "+bidderID+", ecpm: "+bidDetails.getGrossEcpm() + ", size: " + bidDetails.getWidth()+"x"+bidDetails.getHeight() + ", postTimeout: "+isPostTimeout);
	
	if(isPostTimeout === true){
		bidDetails.setPostTimeoutStatus();
	}

	var lastBidID = bidMapEntry.getLastBidIDForAdapter(bidderID);
	if(lastBidID != ""){

		var lastBid = bidMapEntry.getBid(bidderID, lastBidID), //todo: what if the lastBid is null
			lastBidWasDefaultBid = lastBid.getDefaultBidStatus() === 1
			;

		if( lastBidWasDefaultBid || !isPostTimeout){				

			if(lastBidWasDefaultBid){
				util.log(CONSTANTS.MESSAGES.M23);
			}

			if( lastBidWasDefaultBid || lastBid.getNetEcpm() < bidDetails.getNetEcpm() ){
				util.log(CONSTANTS.MESSAGES.M12+lastBid.getNetEcpm()+CONSTANTS.MESSAGES.M13+bidDetails.getNetEcpm()+CONSTANTS.MESSAGES.M14);
				refThis.storeBidInBidMap(divID, bidderID, bidDetails, latency);				
			}else{
				util.log(CONSTANTS.MESSAGES.M12+lastBid.getNetEcpm()+CONSTANTS.MESSAGES.M15+bidDetails.getNetEcpm()+CONSTANTS.MESSAGES.M16);
			}				
		}else{
			util.log(CONSTANTS.MESSAGES.M17);
		}
	}else{
		util.log(CONSTANTS.MESSAGES.M18);
		refThis.storeBidInBidMap(divID, bidderID, bidDetails, latency);		
	}		
};

function storeBidInBidMap(slotID, adapterID, theBid, latency){ // TDD done
	window.PWT.bidMap[slotID].setNewBid(adapterID, theBid);
	window.PWT.bidIdMap[theBid.getBidID()] = {
		s: slotID,
		a: adapterID
	};

	if(theBid.getDefaultBidStatus() === 0){
		util.vLogInfo(slotID, {
			type: "bid",
			bidder: adapterID + (CONFIG.getBidPassThroughStatus(adapterID) !== 0 ? '(Passthrough)' : ''),
			bidDetails: theBid,
			latency: latency
		});
	}
}

/* start-test-block */
exports.storeBidInBidMap = storeBidInBidMap;
/* end-test-block */

exports.resetBid = function(divID, impressionID){ // TDD done
	util.vLogInfo(divID, {type: "hr"});
	delete window.PWT.bidMap[divID];
	refThis.createBidEntry(divID);
	window.PWT.bidMap[divID].setImpressionID(impressionID);
};

function auctionBids(bmEntry){	
	var winningBid = null,
		keyValuePairs = {}
	;

	util.forEachOnObject(bmEntry.adapters, function(adapterID, adapterEntry){
		if(adapterEntry.getLastBidID() != ""){
			util.forEachOnObject(adapterEntry.bids, function(bidID, theBid){
				// do not consider post-timeout bids
				if(theBid.getPostTimeoutStatus() === true){
					return;
				}

				//	if bidPassThrough is not enabled and ecpm > 0
				//		then only append the key value pairs from partner bid				
				if(CONFIG.getBidPassThroughStatus(adapterID) === 0 && theBid.getNetEcpm() > 0){
					util.copyKeyValueObject(keyValuePairs, theBid.getKeyValuePairs());
				}

				//BidPassThrough: Do not participate in auction)
				if(CONFIG.getBidPassThroughStatus(adapterID) !== 0){
					util.copyKeyValueObject(keyValuePairs, theBid.getKeyValuePairs());
					return;
				}

				if(winningBid == null){
					winningBid = theBid;
				}else if(winningBid.getNetEcpm() < theBid.getNetEcpm()){
					winningBid = theBid;
				}
			});
		}
	});

	return {
		wb: winningBid,
		kvp: keyValuePairs
	};
}


/* start-test-block */
exports.auctionBids = auctionBids;
/* end-test-block */

exports.getBid = function(divID){ // TDD done

	var winningBid = null;
	var keyValuePairs = null;	
	// console.log("window.PWT.bidMap ==>", window.PWT.bidMap);

	if( util.isOwnProperty(window.PWT.bidMap, divID) ){
		var data = refThis.auctionBids(window.PWT.bidMap[divID]);
		// console.log("data ==>", data);
		winningBid = data.wb;
		keyValuePairs = data.kvp;
		// console.log("window.PWT.bidMap[divID] ==>", window.PWT.bidMap[divID]);
		window.PWT.bidMap[divID].setAnalyticEnabled();//Analytics Enabled

		if(winningBid && winningBid.getNetEcpm() > 0){
			winningBid.setStatus(1);
			winningBid.setWinningBidStatus();
			util.vLogInfo(divID, {
				type: "win-bid",
				bidDetails: winningBid
			});
		}else{
			util.vLogInfo(divID, {
				type: "win-bid-fail",
			});
		}
	}

	return {wb: winningBid, kvp: keyValuePairs};
};

exports.getBidById = function(bidID) { // TDD done

    if (!util.isOwnProperty(window.PWT.bidIdMap, bidID)) {
        util.log("Bid details not found for bidID: " + bidID);
        return null;
    }

    var divID = window.PWT.bidIdMap[bidID].s;
    var adapterID = window.PWT.bidIdMap[bidID].a;


    if (util.isOwnProperty(window.PWT.bidMap, divID)) {
        util.log("BidID: " + bidID + ", DivID: " + divID + CONSTANTS.MESSAGES.M19 + adapterID);
        var theBid = window.PWT.bidMap[divID].getBid(adapterID, bidID);

        if (theBid == null) {
            return null;
        }

        return {
            bid: theBid,
            slotid: divID
        };
    }

    util.log("Bid details not found for bidID: " + bidID);
    return null;
};


exports.displayCreative = function(theDocument, bidID){ // TDD done
	var bidDetails = refThis.getBidById(bidID);
	if(bidDetails){
		var theBid = bidDetails.bid,
			divID = bidDetails.slotid
		;
		util.displayCreative(theDocument, theBid);
		util.vLogInfo(divID, {type: 'disp', adapter: theBid.getAdapterID()});
		refThis.executeMonetizationPixel(divID, theBid);
	}
};

exports.executeAnalyticsPixel = function(){
	var outputObj = {
			s: []
		},
		pixelURL = CONFIG.getAnalyticsPixelURL(),
		impressionIDMap = {} // impID => slots[]
		;

	if(!pixelURL){
		return;
	}

	pixelURL = util.metaInfo.protocol + pixelURL + 'pubid=' + CONFIG.getPublisherId() +'&json=';

	outputObj[CONSTANTS.CONFIG.PUBLISHER_ID] = CONFIG.getPublisherId();
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMEOUT] = ""+CONFIG.getTimeout();
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.PAGE_URL] = decodeURIComponent(util.metaInfo.pageURL);
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMESTAMP] = util.getCurrentTimestamp();
	outputObj[CONSTANTS.CONFIG.PROFILE_ID] = CONFIG.getProfileID();
	outputObj[CONSTANTS.CONFIG.PROFILE_VERSION_ID] = CONFIG.getProfileDisplayVersionID();

	util.forEachOnObject(PWT.bidMap, function(slotID, bmEntry){
		var startTime = bmEntry.getCreationTime();
		if(bmEntry.getAnalyticEnabledStatus() && !bmEntry.getExpiredStatus()){			
			var slotObject = {
				"sn": slotID,
				"sz": bmEntry.getSizes(),
				"ps": []
			};

			bmEntry.setExpired();
			var impressionID = bmEntry.getImpressionID();
			impressionIDMap[ impressionID ]	= impressionIDMap[ impressionID ] || [];

			util.forEachOnObject(bmEntry.adapters, function(adapterID, adapterEntry){

				if(CONFIG.getBidPassThroughStatus(adapterID) == 1){
					return;
				}

				util.forEachOnObject(adapterEntry.bids, function(bidID, theBid){
					var endTime = theBid.getReceivedTime();
					//todo: take all these key names from constants
					slotObject["ps"].push({
						"pn": adapterID,
						"bidid": bidID,
						"db": theBid.getDefaultBidStatus(),
						"kgpv": theBid.getKGPV(),
						"psz": theBid.getWidth() + "x" + theBid.getHeight(),
						"eg": theBid.getGrossEcpm(),
						"en": theBid.getNetEcpm(),
						"di": theBid.getDealID(),
						"dc": theBid.getDealChannel(),
						"l1": endTime - startTime,
						"l2": 0,
						"t": theBid.getPostTimeoutStatus() === false ? 0 : 1,
						"wb": theBid.getWinningBidStatus() === true ? 1 : 0
					});
				})
			});

			impressionIDMap[ impressionID ].push(slotObject);
		}
	});

	util.forEachOnObject(impressionIDMap, function(impressionID, slots){
		if(slots.length > 0){
			outputObj.s = slots;
			outputObj[CONSTANTS.COMMON.IMPRESSION_ID] = window.encodeURIComponent(impressionID);
			(new window.Image()).src = pixelURL + window.encodeURIComponent(JSON.stringify(outputObj));
		}
	});
};

exports.executeMonetizationPixel = function(slotID, theBid){ // TDD done
	var pixelURL = CONFIG.getMonetizationPixelURL();
	
	if(!pixelURL){
		return;
	}

	pixelURL += "pubid=" + CONFIG.getPublisherId();
	pixelURL += "&purl=" + window.encodeURIComponent(util.metaInfo.pageURL);
	pixelURL += "&tst=" + util.getCurrentTimestamp();
	pixelURL += "&iid=" + window.encodeURIComponent(window.PWT.bidMap[slotID].getImpressionID());
	pixelURL += "&bidid=" + window.encodeURIComponent(theBid.getBidID());
	pixelURL += "&pid=" + window.encodeURIComponent(CONFIG.getProfileID());
	pixelURL += "&pdvid=" + window.encodeURIComponent(CONFIG.getProfileDisplayVersionID());
	pixelURL += "&slot=" + window.encodeURIComponent(slotID);
	pixelURL += "&pn=" + window.encodeURIComponent(theBid.getAdapterID());
	pixelURL += "&en=" + window.encodeURIComponent(theBid.getNetEcpm());
	pixelURL += "&eg=" + window.encodeURIComponent(theBid.getGrossEcpm());
	pixelURL += "&kgpv=" + window.encodeURIComponent(theBid.getKGPV());

	// console.log("pixelURL ==>", pixelURL);
	refThis.setImageSrcToPixelURL(pixelURL);
	// (new window.Image()).src = util.metaInfo.protocol + pixelURL; // TODO : extract this a separate function so we can test that proper pixelURL is generated and is passed tot he extracted function
};



exports.setImageSrcToPixelURL = function (pixelURL) { // TDD done
	(new window.Image()).src = util.metaInfo.protocol + pixelURL;
};

//todo
// check if all bid comparisons are made on netEcpm
// check data types in logger pixel