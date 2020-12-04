var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");
var GDPR = require("./gdpr.js");
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

exports.setAllPossibleBidsReceived = function(divID){
	window.PWT.bidMap[divID].setAllPossibleBidsReceived();
};

exports.setBidFromBidder = function(divID, bidDetails){ // TDD done

	var bidderID = bidDetails.getAdapterID();
	var bidID = bidDetails.getBidID();
	var bidMapEntry = window.PWT.bidMap[divID];
	/* istanbul ignore else */
	if(!util.isOwnProperty(window.PWT.bidMap, divID)){
		util.logWarning("BidManager is not expecting bid for "+ divID +", from " + bidderID);
		return;
	}

	var isPostTimeout = (bidMapEntry.getCreationTime()+CONFIG.getTimeout()) < bidDetails.getReceivedTime() ? true : false,
		latency = bidDetails.getReceivedTime() - bidMapEntry.getCreationTime();

	refThis.createBidEntry(divID);

	util.log("BdManagerSetBid: divID: "+divID+", bidderID: "+bidderID+", ecpm: "+bidDetails.getGrossEcpm() + ", size: " + bidDetails.getWidth()+"x"+bidDetails.getHeight() + ", postTimeout: "+isPostTimeout + ", defaultBid: " + bidDetails.getDefaultBidStatus());
	/* istanbul ignore else */
	if(isPostTimeout === true /*&& !bidDetails.isServerSide*/){
		bidDetails.setPostTimeoutStatus();
	}

	var lastBidID = bidMapEntry.getLastBidIDForAdapter(bidderID);
	if(lastBidID != ""){

		var lastBid = bidMapEntry.getBid(bidderID, lastBidID), //todo: what if the lastBid is null
			lastBidWasDefaultBid = lastBid.getDefaultBidStatus() === 1,
			lastBidWasErrorBid = lastBid.getDefaultBidStatus() === -1
			;

		if( lastBidWasDefaultBid || !isPostTimeout || lastBidWasErrorBid){
			/* istanbul ignore else */
			if(lastBidWasDefaultBid){
				util.log(CONSTANTS.MESSAGES.M23 + bidderID);
			}

			if( lastBidWasDefaultBid || lastBid.getNetEcpm() < bidDetails.getNetEcpm() || lastBidWasErrorBid){
				util.log(CONSTANTS.MESSAGES.M12+lastBid.getNetEcpm()+CONSTANTS.MESSAGES.M13+bidDetails.getNetEcpm()+CONSTANTS.MESSAGES.M14 + bidderID);
				refThis.storeBidInBidMap(divID, bidderID, bidDetails, latency);
			}else{
				util.log(CONSTANTS.MESSAGES.M12+lastBid.getNetEcpm()+CONSTANTS.MESSAGES.M15+bidDetails.getNetEcpm()+CONSTANTS.MESSAGES.M16 +  bidderID);
			}
		}else{
			util.log(CONSTANTS.MESSAGES.M17);
		}
	}else{
		util.log(CONSTANTS.MESSAGES.M18 + bidderID);
		refThis.storeBidInBidMap(divID, bidderID, bidDetails, latency);
	}
	if (isPostTimeout) {
      //explicitly trigger user syncs since its a post timeout bid
      setTimeout(window[CONSTANTS.COMMON.PREBID_NAMESPACE].triggerUserSyncs, 10);
    }
};

function storeBidInBidMap(slotID, adapterID, theBid, latency){ // TDD, i/o : done

	// Adding a hook for publishers to modify the bid we have to store
	// we should not call the hook for defaultbids and post-timeout bids
	// Here slotID, adapterID, and latency are read-only and theBid can be modified
	// if(theBid.getDefaultBidStatus() === 0 && theBid.getPostTimeoutStatus() === false){
	// 	util.handleHook(CONSTANTS.HOOKS.BID_RECEIVED, [slotID, adapterID, theBid, latency]);
	// }

	window.PWT.bidMap[slotID].setNewBid(adapterID, theBid);
	window.PWT.bidIdMap[theBid.getBidID()] = {
		s: slotID,
		a: adapterID
	};

	/* istanbul ignore else */
	if(theBid.getDefaultBidStatus() === 0 && theBid.adapterID !== "pubmaticServer"){
		util.vLogInfo(slotID, {
			type: "bid",
			bidder: adapterID + (CONFIG.getBidPassThroughStatus(adapterID) !== 0 ? '(Passthrough)' : ''),
			bidDetails: theBid,
			latency: latency,
			s2s: CONFIG.isServerSideAdapter(adapterID),
			adServerCurrency: util.getCurrencyToDisplay()
		});
	}
}

/* start-test-block */
exports.storeBidInBidMap = storeBidInBidMap;
/* end-test-block */

function resetBid(divID, impressionID){ // TDD, i/o : done
	util.vLogInfo(divID, {type: "hr"});
	delete window.PWT.bidMap[divID];
	refThis.createBidEntry(divID);
	window.PWT.bidMap[divID].setImpressionID(impressionID);
}

/* start-test-block */
exports.resetBid = resetBid;
/* end-test-block */

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
				// Description-> adapterID == "pubmatic" && theBid.netEcpm == 0 this check is put because from pubmaticBidAdapter in prebid we are
				// passing zero bid when there are no bid under timout for latency reports and this caused issue to have zero bids in pwtm key
				// so put this check which will not log zero bids for pubmatic. Note : From prebid 1.x onwards we do not get zero bids in case of no bids.
				if(theBid.getDefaultBidStatus() == 1 || theBid.getPostTimeoutStatus() == 1 || theBid.getGrossEcpm() == 0){
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

function updateNativeTargtingKeys(keyValuePairs) {
	for(var key in keyValuePairs) {
		if (key.indexOf("native") >= 0 && key.split("_").length === 3) {
			delete keyValuePairs[key];
		}
	}
}

/* start-test-block */
exports.updateNativeTargtingKeys = updateNativeTargtingKeys;
/* end-test-block */


function auctionBidsCallBack(adapterID, adapterEntry, keyValuePairs, winningBid) { // TDD, i/o : done
	var refThis = this;
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

			if (winningBid !== null ) {
				if (winningBid.getNetEcpm() < theBid.getNetEcpm()) {
					// i.e. the current bid is the winning bid, so remove the native keys from keyValuePairs
					refThis.updateNativeTargtingKeys(keyValuePairs);
				} else {
					// i.e. the current bid is not the winning bid, so remove the native keys from theBid.keyValuePairs
					var bidKeyValuePairs = theBid.getKeyValuePairs();
					refThis.updateNativeTargtingKeys(bidKeyValuePairs);
					theBid.keyValuePairs = bidKeyValuePairs;
				}
			}
            util.copyKeyValueObject(keyValuePairs, theBid.getKeyValuePairs());

            /* istanbul ignore else */
            if (CONFIG.getBidPassThroughStatus(adapterID) !== 0) {
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
				bidDetails: winningBid,
				adServerCurrency: util.getCurrencyToDisplay()
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
		pubId = CONFIG.getPublisherId(),
		// gdprData = GDPR.getUserConsentDataFromLS(),
		// consentString = "",
		pixelURL = CONFIG.getAnalyticsPixelURL(),
		impressionIDMap = {} // impID => slots[]
		;
	/* istanbul ignore else */
	if(!pixelURL){
		return;
	}

	pixelURL = CONSTANTS.COMMON.PROTOCOL + pixelURL + "pubid=" + pubId;

	outputObj[CONSTANTS.CONFIG.PUBLISHER_ID] = CONFIG.getPublisherId();
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMEOUT] = ""+CONFIG.getTimeout();
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.PAGE_URL] = window.decodeURIComponent(util.metaInfo.pageURL);
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.PAGE_DOMAIN] = util.metaInfo.pageDomain;
	outputObj[CONSTANTS.LOGGER_PIXEL_PARAMS.TIMESTAMP] = util.getCurrentTimestamp();
	outputObj[CONSTANTS.CONFIG.PROFILE_ID] = CONFIG.getProfileID();
	outputObj[CONSTANTS.CONFIG.PROFILE_VERSION_ID] = CONFIG.getProfileDisplayVersionID();
	outputObj["tgid"] = (function() {
	    var testGroupId = parseInt(PWT.testGroupId || 0);
	    if (testGroupId <= 15 && testGroupId >= 0) {
	      return testGroupId;
	    }
	    return 0;
	})();

	// As discussed we won't be seding gdpr data to logger
	// if (CONFIG.getGdpr()) {
	// 	consentString = gdprData && gdprData.c ? encodeURIComponent(gdprData.c) : "";

	// 	outputObj[CONSTANTS.CONFIG.GDPR_CONSENT] = gdprData && gdprData.g;
	// 	outputObj[CONSTANTS.CONFIG.CONSENT_STRING] = consentString;

	// 	pixelURL += "&gdEn=" + (CONFIG.getGdpr() ? 1 : 0);
	// }

	util.forEachOnObject(window.PWT.bidMap, function (slotID, bmEntry) {
		refThis.analyticalPixelCallback(slotID, bmEntry, impressionIDMap);
	});
	util.forEachOnObject(impressionIDMap, function(impressionID, slots){ /* istanbul ignore next */
		/* istanbul ignore else */
		if(slots.length > 0){
			outputObj.s = slots;
			outputObj[CONSTANTS.COMMON.IMPRESSION_ID] = window.encodeURIComponent(impressionID);
			outputObj.psl = slots.psl;
			outputObj.dvc = { "plt": util.getDevicePlatform()}
			// (new window.Image()).src = pixelURL + "&json=" + window.encodeURIComponent(JSON.stringify(outputObj));
			util.ajaxRequest(pixelURL, function(){}, "json=" + window.encodeURIComponent(JSON.stringify(outputObj)), {
				contentType : "application/x-www-form-urlencoded", // as per https://inside.pubmatic.com:8443/confluence/pages/viewpage.action?spaceKey=Products&title=POST+support+for+logger+in+Wrapper-tracker
				withCredentials : true
			});
		}
	});
};

exports.executeMonetizationPixel = function(slotID, theBid){ // TDD, i/o : done
	var pixelURL = util.generateMonetizationPixel(slotID,theBid);
	if(!pixelURL){
		return;
	}
	refThis.setImageSrcToPixelURL(pixelURL);
};

function analyticalPixelCallback(slotID, bmEntry, impressionIDMap) { // TDD, i/o : done
	var startTime = bmEntry.getCreationTime() || 0;
	var pslTime = undefined;
	var impressionID = bmEntry.getImpressionID();
	const isAnalytics = true; // this flag is required to get grossCpm and netCpm in dollars instead of adserver currency
    /* istanbul ignore else */
    if (bmEntry.getAnalyticEnabledStatus() && !bmEntry.getExpiredStatus()) {
        var slotObject = {
            "sn": slotID,
            "sz": bmEntry.getSizes(),
            "ps": []
        };

        bmEntry.setExpired();
        impressionIDMap[impressionID] = impressionIDMap[impressionID] || [];

        util.forEachOnObject(bmEntry.adapters, function(adapterID, adapterEntry) {
        	/* istanbul ignore else */
            if (CONFIG.getBidPassThroughStatus(adapterID) == 1) {
                return;
            }

			util.forEachOnObject(adapterEntry.bids, function(bidID, theBid) {
				var endTime = theBid.getReceivedTime();
				if (adapterID === "pubmaticServer") {
					if ((util.isOwnProperty(window.PWT.owLatency, impressionID)) &&
						(util.isOwnProperty(window.PWT.owLatency[impressionID], "startTime")) &&
							(util.isOwnProperty(window.PWT.owLatency[impressionID], "endTime"))) {
						pslTime = (window.PWT.owLatency[impressionID].endTime - window.PWT.owLatency[impressionID].startTime);
					} else {
						pslTime = 0;
						util.log("Logging pubmaticServer latency as 0 for impressionID: " + impressionID);
					}
					util.log("PSL logging: time logged for id " +impressionID+ " is " + pslTime);
					return;
				}

				if(CONFIG.getAdapterMaskBidsStatus(adapterID) == 1){
					if(theBid.getWinningBidStatus() === false){
						return;
					}
				}
				/* if serverside adapter and
                     db == 0 and
                     getServerSideResponseTime returns -1, it means that server responded with error code 1/2/6
                     hence do not add entry in logger.
                     keeping the check for responseTime on -1 since there could be a case where:
						ss status = 1, db status = 0, and responseTime is 0, but error code is 4, i,e. no bid. And for error code 4,
						we want to log the data not skip it.
                  */
	            if (theBid.getServerSideStatus()) {
	              if (theBid.getDefaultBidStatus() === -1 &&
	                theBid.getServerSideResponseTime() === -1) {
	                return;
	              }
				}
				// Logic : if adapter is pubmatic and bid falls under two condition :
				/**
				 *  1.timeout zero bids
				 *  2.no response from translator
				 * Then we don't log it for pubmatic
				 * Reason : Logging timeout zero bids causing reports to show more zero in comparision to other bidders
				 * Originally we started logging this for latency purposes.
				 * Future Scope : Remove below check to log with appt. value(s)
				*/
				/*istanbul ignore else*/
				if( (adapterID === "pubmatic" || adapterID === "pubmatic2") && (theBid.getDefaultBidStatus() ||  (theBid.getPostTimeoutStatus() && theBid.getGrossEcpm(isAnalytics) == 0))){
					return;
				}
				//todo: take all these key names from constants
                slotObject["ps"].push({
                    "pn": adapterID,
                    "bidid": bidID,
                    "db": theBid.getDefaultBidStatus(),
                    "kgpv": theBid.getKGPV(),
                    "kgpsv": theBid.getKGPV(true),
                    "psz": theBid.getWidth() + "x" + theBid.getHeight(),
                    "eg": theBid.getGrossEcpm(isAnalytics),
                    "en": theBid.getNetEcpm(isAnalytics),
                    "di": theBid.getDealID(),
                    "dc": theBid.getDealChannel(),
                    "l1": theBid.getServerSideStatus() ? theBid.getServerSideResponseTime() : (endTime - startTime),
                    "l2": 0,
					"ss": theBid.getServerSideStatus(),
                    "t": theBid.getPostTimeoutStatus() === false ? 0 : 1,
                    "wb": theBid.getWinningBidStatus() === true ? 1 : 0,
					"mi": theBid.getServerSideStatus() ? theBid.getMi() : undefined,
					"af": theBid.getAdFormat(),
					"ocpm": CONFIG.getAdServerCurrency() ? theBid.getOriginalCpm() : theBid.getGrossEcpm(),
					"ocry": CONFIG.getAdServerCurrency() ? theBid.getOriginalCurrency() : CONSTANTS.COMMON.ANALYTICS_CURRENCY,
					"piid": theBid.getsspID()
				});
            })
        });

        impressionIDMap[impressionID].push(slotObject);
		if (pslTime !== undefined) {
			impressionIDMap[impressionID].psl = pslTime;
		}
    }
}

/* start-test-block */
exports.analyticalPixelCallback = analyticalPixelCallback;
/* end-test-block */



/**
 * function which takes url and creates an image and executes them
 * used to execute trackers
 * @param {*} pixelURL
 * @param {*} useProtocol
 * @returns
 */
exports.setImageSrcToPixelURL = function (pixelURL, useProtocol) { // TDD, i/o : done
	var img = new window.Image();
	if(useProtocol != undefined && !useProtocol){
		img.src = pixelURL;
		return;
	}
	if(String(pixelURL).trim().substring(0,8) != CONSTANTS.COMMON.PROTOCOL){
		pixelURL = CONSTANTS.COMMON.PROTOCOL + pixelURL;
	}
	img.src = pixelURL;
};


exports.getAllPartnersBidStatuses = function (bidMaps, divIds) {
	var status = true;

	util.forEachOnArray(divIds, function (key, divId) {
		// OLD APPROACH: check if we have got bids per bidder for each slot
		// bidMaps[divId] && util.forEachOnObject(bidMaps[divId].adapters, function (adapterID, adapter) {
		// 	util.forEachOnObject(adapter.bids, function (bidId, theBid) {
		// 		status = status && (theBid.getDefaultBidStatus() === 0);
		// 	});
		// });
		// NEW APPROACH: check allPossibleBidsReceived flag which is set when pbjs.requestBids->bidsBackHandler is executed
		if(bidMaps[divId]){
			status = status && (bidMaps[divId].hasAllPossibleBidsReceived() === true);
		}
	});
	return status;
};


// removeIf(removeNativeRelatedCode)
/**
 * This function is used to execute trackers on event
 * in case of native. On click of native create element
 * @param {*} event
 */
exports.loadTrackers = function(event){
	var bidId = util.getBidFromEvent(event);
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "3",
			pwt_bidID: bidId,
			pwt_origin: CONSTANTS.COMMON.PROTOCOL + window.location.hostname,
			pwt_action:"click"
		}),
		"*"
	);
};
// endRemoveIf(removeNativeRelatedCode)

/**
 * function takes bidID and post a message to parent pwt.js to execute monetization pixels.
 * @param {*} bidID
 */
exports.executeTracker = function(bidID){
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "3",
			pwt_bidID: bidID,
			pwt_origin: CONSTANTS.COMMON.PROTOCOL + window.location.hostname,
			pwt_action:"imptrackers"
		}),
		"*"
	);
};

/**
 * based on action it executes either the clickTrackers or
 * impressionTrackers and javascriptTrackers.
 * Javascript trackers is a valid html, urls already wrapped in script tagsand its guidelines can be found at
 * iab spec document.
 * @param {*} bidDetails
 * @param {*} action
 */
exports.fireTracker = function(bidDetails, action) {
	var trackers;

	if (action === "click") {
		trackers = bidDetails["native"] && bidDetails["native"].clickTrackers;
	} else if(action === "imptrackers") {
		trackers = bidDetails["native"] && bidDetails["native"].impressionTrackers;
		if (bidDetails['native'] && bidDetails['native'].javascriptTrackers) {
			var iframe = util.createInvisibleIframe();
			/* istanbul ignore else */
			if(!iframe){
				throw {message: 'Failed to create invisible frame for native javascript trackers'};
			}
			/* istanbul ignore else */
			if(!iframe.contentWindow){
				throw {message: 'Unable to access frame window for native javascript trackers'};
			}
			window.document.body.appendChild(iframe);
			iframe.contentWindow.document.open();
			iframe.contentWindow.document.write(bidDetails['native'].javascriptTrackers);
			iframe.contentWindow.document.close();
		}
	}
	(trackers || []).forEach(function(url){refThis.setImageSrcToPixelURL(url,false);});
};


// this function generates all satndard key-value pairs for a given bid and setup, set these key-value pairs in an object
// todo: write unit test cases
exports.setStandardKeys = function(winningBid, keyValuePairs){
	if (winningBid) {
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID ] = winningBid.getBidID();
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS ] = winningBid.getStatus();
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM ] = winningBid.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION);
        var dealID = winningBid.getDealID();
        if(dealID){
            keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID ] = dealID;
        }
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID ] = winningBid.getAdapterID();
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID ] = CONFIG.getPublisherId();
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID ] = CONFIG.getProfileID();
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID ] = CONFIG.getProfileDisplayVersionID();
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_SIZE ] = winningBid.width + 'x' + winningBid.height;
        keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.PLATFORM_KEY ] = winningBid.getAdFormat() == CONSTANTS.FORMAT_VALUES.VIDEO ? CONSTANTS.PLATFORM_VALUES.VIDEO : (winningBid.getNative() ? CONSTANTS.PLATFORM_VALUES.NATIVE : CONSTANTS.PLATFORM_VALUES.DISPLAY);
		if(winningBid.getAdFormat() == CONSTANTS.FORMAT_VALUES.VIDEO){
			keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.CACHE_PATH ] = CONSTANTS.CONFIG.CACHE_PATH;
			keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.CACHE_URL ] = CONSTANTS.CONFIG.CACHE_URL;
			keyValuePairs[ CONSTANTS.WRAPPER_TARGETING_KEYS.CACHE_ID ] = winningBid.getcacheUUID();
		}
	} else {
    	util.logWarning('Not generating key-value pairs as invalid winningBid object passed. WinningBid: ');
    	util.logWarning(winningBid);
    }
}
