var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");
// var GDPR = require("./gdpr.js");
var bmEntry = require("./bmEntry.js");

var refThis = this;
var storedObject;
var frequencyDepth;
const PREFIX = 'PROFILE_AUCTION_INFO_';

const TRACKER_METHODS = {
	img: 1,
	js: 2,
	1: 'img',
	2: 'js'
}
  
const TRACKER_EVENTS = {
	impression: 1,
	'viewable-mrc50': 2,
	'viewable-mrc100': 3,
	'viewable-video50': 4,
}
  
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

// Returns property from localstorages slotlevel object
exports.getSlotLevelFrequencyDepth = function (frequencyDepth, prop, adUnit) {
	var freqencyValue; 
	if(Object.keys(frequencyDepth).length && frequencyDepth.slotLevelFrquencyDepth) {
		freqencyValue = frequencyDepth.slotLevelFrquencyDepth[adUnit] && frequencyDepth.slotLevelFrquencyDepth[adUnit][prop];
	}
	return freqencyValue;
}
/**
 * Prepare meta object to pass in logger call
 * @param {*} meta 
 */
function getMetadata(meta) {
	if (!meta || util.isEmptyObject(meta)) return;
	const metaObj = {};
	if (meta.networkId) metaObj.nwid = meta.networkId;
	if (meta.advertiserId) metaObj.adid = meta.advertiserId;
	if (meta.networkName) metaObj.nwnm = meta.networkName;
	if (meta.primaryCatId) metaObj.pcid = meta.primaryCatId;
	if (meta.advertiserName) metaObj.adnm = meta.advertiserName;
	if (meta.agencyId) metaObj.agid = meta.agencyId;
	if (meta.agencyName) metaObj.agnm = meta.agencyName;
	if (meta.brandId) metaObj.brid = meta.brandId;
	if (meta.brandName) metaObj.brnm = meta.brandName;
	if (meta.dchain) metaObj.dc = meta.dchain;
	if (meta.demandSource) metaObj.ds = meta.demandSource;
	if (meta.secondaryCatIds) metaObj.scids = meta.secondaryCatIds;

	if (util.isEmptyObject(metaObj)) return;
	return metaObj;
}

exports.getMetadata = getMetadata;

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


