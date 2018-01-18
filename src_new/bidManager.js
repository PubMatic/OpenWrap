var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");
var bmEntry = require("./bmEntry.js");

var refThis = this;

function createBidEntry(divID){ // TDD, i/o : done
	/* istanbul ignore else */
	if(! util.isOwnProperty(window.PWT.bidMap, divID) ){
		window.PWT.bidMap[divID] = bmEntry.createBMEntry(divID);
	}
}

/* start-test-block */
exports.createBidEntry = createBidEntry;
/* end-test-block */

exports.setSizes = function(divID, slotSizes){ // TDD, i/o : done
	refThis.createBidEntry(divID);
	window.PWT.bidMap[divID].setSizes(slotSizes);
};

exports.setCallInitTime = function(divID, adapterID){ // TDD, i/o : done
	refThis.createBidEntry(divID);
	window.PWT.bidMap[divID].setAdapterEntry(adapterID);
};

exports.setBidFromBidder = function(divID, bidDetails){ // TDD done

	var bidderID = bidDetails.getAdapterID();
	var bidID = bidDetails.getBidID();
	var bidMapEntry = window.PWT.bidMap[divID];
	/* istanbul ignore else */
	if(!util.isOwnProperty(window.PWT.bidMap, divID)){
		util.log("BidManager is not expecting bid for "+ divID +", from " + bidderID);
		return;
	}

	var isPostTimeout = (bidMapEntry.getCreationTime()+CONFIG.getTimeout()) < bidDetails.getReceivedTime() ? true : false,
		latency = bidDetails.getReceivedTime() - bidMapEntry.getCreationTime();

	refThis.createBidEntry(divID);

	util.log("BdManagerSetBid: divID: "+divID+", bidderID: "+bidderID+", ecpm: "+bidDetails.getGrossEcpm() + ", size: " + bidDetails.getWidth()+"x"+bidDetails.getHeight() + ", postTimeout: "+isPostTimeout + ", defaultBid: " + bidDetails.getDefaultBidStatus());
	/* istanbul ignore else */
	if(isPostTimeout === true){
		bidDetails.setPostTimeoutStatus();
	}

	var lastBidID = bidMapEntry.getLastBidIDForAdapter(bidderID);
	if(lastBidID != ""){

		var lastBid = bidMapEntry.getBid(bidderID, lastBidID), //todo: what if the lastBid is null
			lastBidWasDefaultBid = lastBid.getDefaultBidStatus() === 1
			;

		if( lastBidWasDefaultBid || !isPostTimeout){
			/* istanbul ignore else */
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

function storeBidInBidMap(slotID, adapterID, theBid, latency){ // TDD, i/o : done
	window.PWT.bidMap[slotID].setNewBid(adapterID, theBid);
	window.PWT.bidIdMap[theBid.getBidID()] = {
		s: slotID,
		a: adapterID
	};

	/* istanbul ignore else */
	if(theBid.getDefaultBidStatus() === 0){
		util.vLogInfo(slotID, {
			type: "bid",
			bidder: adapterID + (CONFIG.getBidPassThroughStatus(adapterID) !== 0 ? '(Passthrough)' : ''),
			bidDetails: theBid,
			latency: latency,
			s2s: CONFIG.isServerSideAdapter(adapterID)
		});
	}
}

/* start-test-block */
exports.storeBidInBidMap = storeBidInBidMap;
/* end-test-block */

exports.resetBid = function(divID, impressionID){ // TDD, i/o : done
	util.vLogInfo(divID, {type: "hr"});
	delete window.PWT.bidMap[divID];
	refThis.createBidEntry(divID);
	window.PWT.bidMap[divID].setImpressionID(impressionID);
};

function createMetaDataKey(pattern, bmEntry, keyValuePairs){
	var output = "",
		validBidCount = 0,
		partnerCount = 0,
		macros = CONSTANTS.METADATA_MACROS,
		macroRegexFlag = "g";

		util.forEachOnObject(bmEntry.adapters, function(adapterID, adapterEntry) {
        if (adapterEntry.getLastBidID() != "") {
					// If pubmaticServerBidAdapter then don't increase partnerCount
					(adapterID !== "pubmaticServer") && partnerCount++;

					util.forEachOnObject(adapterEntry.bids, function(bidID, theBid) {
        		if(theBid.getDefaultBidStatus() == 1 || theBid.getPostTimeoutStatus() == 1){
        			return;
        		}
		        validBidCount++;
		        output += replaceMetaDataMacros(pattern, theBid);
        	});
        }
    });

		if(output.length == 0){
    	output = pattern;
    }
    output = output.replace(new RegExp(macros.BID_COUNT, macroRegexFlag), validBidCount);
    output = output.replace(new RegExp(macros.PARTNER_COUNT, macroRegexFlag), partnerCount);
    keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.META_DATA] = encodeURIComponent(output);
}

/* start-test-block */
exports.createMetaDataKey = createMetaDataKey;
/* end-test-block */

function replaceMetaDataMacros(pattern, theBid){
	var macros = CONSTANTS.METADATA_MACROS,
		macroRegexFlag = "g"
	;
	return pattern
		.replace(new RegExp(macros.PARTNER, macroRegexFlag), theBid.getAdapterID())
		.replace(new RegExp(macros.WIDTH, macroRegexFlag), theBid.getWidth())
		.replace(new RegExp(macros.HEIGHT, macroRegexFlag), theBid.getHeight())
		.replace(new RegExp(macros.GROSS_ECPM, macroRegexFlag), theBid.getGrossEcpm())
		.replace(new RegExp(macros.NET_ECPM, macroRegexFlag), theBid.getNetEcpm());
}
/* start-test-block */
exports.replaceMetaDataMacros = replaceMetaDataMacros;
/* end-test-block */


function auctionBids(bmEntry) { // TDD, i/o : done
    var winningBid = null,
        keyValuePairs = {};

    util.forEachOnObject(bmEntry.adapters, function(adapterID, adapterEntry) {
        var obj = refThis.auctionBidsCallBack(adapterID, adapterEntry, keyValuePairs, winningBid);
        winningBid  = obj.winningBid;
        keyValuePairs = obj.keyValuePairs;
    });

    if(CONFIG.getMataDataPattern() !== null){
    	createMetaDataKey(CONFIG.getMataDataPattern(), bmEntry, keyValuePairs);
    }

    return {
        wb: winningBid,
        kvp: keyValuePairs
    };
}

/* start-test-block */
exports.auctionBids = auctionBids;
/* end-test-block */

function auctionBidsCallBack(adapterID, adapterEntry, keyValuePairs, winningBid) { // TDD, i/o : done
    if (adapterEntry.getLastBidID() != "") {
        util.forEachOnObject(adapterEntry.bids, function(bidID, theBid) {
            // do not consider post-timeout bids
            /* istanbul ignore else */
            if (theBid.getPostTimeoutStatus() === true) {
                return { winningBid: winningBid , keyValuePairs: keyValuePairs };
            }

            /* istanbul ignore else */
			if(theBid.getDefaultBidStatus() !== 1 && CONFIG.getSendAllBidsStatus() == 1){
				theBid.setSendAllBidsKeys();
			}

            //	if bidPassThrough is not enabled and ecpm > 0
            //		then only append the key value pairs from partner bid
            /* istanbul ignore else */
            if (CONFIG.getBidPassThroughStatus(adapterID) === 0 /*&& theBid.getNetEcpm() > 0*/) {
                util.copyKeyValueObject(keyValuePairs, theBid.getKeyValuePairs());
            }

            //BidPassThrough: Do not participate in auction)
            /* istanbul ignore else */
            if (CONFIG.getBidPassThroughStatus(adapterID) !== 0) {
                util.copyKeyValueObject(keyValuePairs, theBid.getKeyValuePairs());
                return { winningBid: winningBid , keyValuePairs: keyValuePairs };
            }

            if (winningBid == null) {
                winningBid = theBid;
            } else if (winningBid.getNetEcpm() < theBid.getNetEcpm()) {
                winningBid = theBid;
            }
        });
        return { winningBid: winningBid , keyValuePairs: keyValuePairs };
    } else {
    	return { winningBid: winningBid , keyValuePairs: keyValuePairs };
    }
}

/* start-test-block */
exports.auctionBidsCallBack = auctionBidsCallBack;
/* end-test-block */

exports.getBid = function(divID){ // TDD, i/o : done

	var winningBid = null;
	var keyValuePairs = null;
	/* istanbul ignore else */
	if( util.isOwnProperty(window.PWT.bidMap, divID) ){
		var data = refThis.auctionBids(window.PWT.bidMap[divID]);
		winningBid = data.wb;
		keyValuePairs = data.kvp;

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

exports.getBidById = function(bidID) { // TDD, i/o : done
	/* istanbul ignore else */
    if (!util.isOwnProperty(window.PWT.bidIdMap, bidID)) {
        util.log(CONSTANTS.MESSAGES.M25 + bidID);
        return null;
    }

    var divID = window.PWT.bidIdMap[bidID].s;
    var adapterID = window.PWT.bidIdMap[bidID].a;

    /* istanbul ignore else */
    if (util.isOwnProperty(window.PWT.bidMap, divID)) {
        util.log("BidID: " + bidID + ", DivID: " + divID + CONSTANTS.MESSAGES.M19 + adapterID);
        var theBid = window.PWT.bidMap[divID].getBid(adapterID, bidID);
        /* istanbul ignore else */
        if (theBid == null) {
            return null;
        }

        return {
            bid: theBid,
            slotid: divID
        };
    }

    util.log(CONSTANTS.MESSAGES.M25 + bidID);
    return null;
};


exports.displayCreative = function(theDocument, bidID){ // TDD, i/o : done
	var bidDetails = refThis.getBidById(bidID);
	/* istanbul ignore else */
	if(bidDetails){
		var theBid = bidDetails.bid,
			divID = bidDetails.slotid
		;
		util.displayCreative(theDocument, theBid);
		util.vLogInfo(divID, {type: 'disp', adapter: theBid.getAdapterID()});
		refThis.executeMonetizationPixel(divID, theBid);
	}
};

exports.executeAnalyticsPixel = function(){ // TDD, i/o : done
	var outputObj = {
			s: []
		},
		pixelURL = CONFIG.getAnalyticsPixelURL(),
		impressionIDMap = {} // impID => slots[]
		;
	/* istanbul ignore else */
	if(!pixelURL){
		return;
	}

	pixelURL = util.metaInfo.protocol + pixelURL + 'pubid=' + CONFIG.getPublisherId() +'&json=';

	outputObj[CONSTANTS.CONFIG.PUBLISHER_ID] = CONFIG.getPublisherId();
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMEOUT] = ""+CONFIG.getTimeout();
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.PAGE_URL] = window.decodeURIComponent(util.metaInfo.pageURL);
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMESTAMP] = util.getCurrentTimestamp();
	outputObj[CONSTANTS.CONFIG.PROFILE_ID] = CONFIG.getProfileID();
	outputObj[CONSTANTS.CONFIG.PROFILE_VERSION_ID] = CONFIG.getProfileDisplayVersionID();

	util.forEachOnObject(window.PWT.bidMap, function (slotID, bmEntry) {
		refThis.analyticalPixelCallback(slotID, bmEntry, impressionIDMap);
	});

	util.forEachOnObject(impressionIDMap, function(impressionID, slots){ /* istanbul ignore next */
		/* istanbul ignore else */
		if(slots.length > 0){
			outputObj.s = slots;
			outputObj[CONSTANTS.COMMON.IMPRESSION_ID] = window.encodeURIComponent(impressionID);
			(new window.Image()).src = pixelURL + window.encodeURIComponent(JSON.stringify(outputObj));
		}
	});
};

exports.executeMonetizationPixel = function(slotID, theBid){ // TDD, i/o : done
	var pixelURL = CONFIG.getMonetizationPixelURL();

	/* istanbul ignore else */
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

	refThis.setImageSrcToPixelURL(pixelURL);
};

function analyticalPixelCallback(slotID, bmEntry, impressionIDMap) { // TDD, i/o : done
    var startTime = bmEntry.getCreationTime();
    /* istanbul ignore else */
    if (bmEntry.getAnalyticEnabledStatus() && !bmEntry.getExpiredStatus()) {
        var slotObject = {
            "sn": slotID,
            "sz": bmEntry.getSizes(),
            "ps": []
        };

        bmEntry.setExpired();
        var impressionID = bmEntry.getImpressionID();
        impressionIDMap[impressionID] = impressionIDMap[impressionID] || [];

        util.forEachOnObject(bmEntry.adapters, function(adapterID, adapterEntry) {
        	/* istanbul ignore else */
            if (CONFIG.getBidPassThroughStatus(adapterID) == 1) {
                return;
            }

						if (adapterID === "pubmaticServer") {
								return;
						}

            util.forEachOnObject(adapterEntry.bids, function(bidID, theBid) {

            		if(CONFIG.getAdapterMaskBidsStatus(adapterID) == 1){
					        	if(theBid.getWinningBidStatus() === false){
					        			return;
					        	}
			        	}

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

        impressionIDMap[impressionID].push(slotObject);
    }
}

/* start-test-block */
exports.analyticalPixelCallback = analyticalPixelCallback;
/* end-test-block */



exports.setImageSrcToPixelURL = function (pixelURL) { // TDD, i/o : done
	var img = new window.Image();
	img.src = util.metaInfo.protocol + pixelURL;
};


exports.getAllPartnersBidStatuses = function (bidMaps, divIds) {
	var status = true;

	util.forEachOnArray(divIds, function (key, divId) {
		bidMaps[divId] && util.forEachOnObject(bidMaps[divId].adapters, function (adapterID, adapter) {
			util.forEachOnObject(adapter.bids, function (bidId, theBid) {
				status = status && (theBid.getDefaultBidStatus() === 0);
			});
		});
	});

	return status;
};
