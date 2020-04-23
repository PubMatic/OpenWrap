var util = require("./util.js");
var controller = require("%%PATH_TO_CONTROLLER%%");
var bidManager = require("./bidManager.js");
var CONSTANTS = require("./constants.js");

var metaInfo = util.getMetaInfo(window);
window.PWT = window.PWT || {};
window.PWT.bidMap = window.PWT.bidMap || {};
window.PWT.bidIdMap = window.PWT.bidIdMap || {};
window.PWT.isIframe = window.PWT.isIframe || metaInfo.isInIframe;
window.PWT.protocol = window.PWT.protocol || metaInfo.protocol;
window.PWT.secure = window.PWT.secure || metaInfo.secure;
window.PWT.pageURL = window.PWT.pageURL || metaInfo.pageURL;
window.PWT.refURL = window.PWT.refURL || metaInfo.refURL;
window.PWT.isSafeFrame = window.PWT.isSafeFrame || false;
window.PWT.safeFrameMessageListenerAdded = window.PWT.safeFrameMessageListenerAdded || false;
// usingDifferentProfileVersion
window.PWT.udpv = window.PWT.udpv || util.findQueryParamInURL(metaInfo.isIframe ? metaInfo.refURL : metaInfo.pageURL, "pwtv");

util.findQueryParamInURL(metaInfo.isIframe ? metaInfo.refURL : metaInfo.pageURL, "pwtc") && util.enableDebugLog();
util.findQueryParamInURL(metaInfo.isIframe ? metaInfo.refURL : metaInfo.pageURL, "pwtvc") && util.enableVisualDebugLog();

window.PWT.displayCreative = function(theDocument, bidID){
	util.log("In displayCreative for: " + bidID);
	bidManager.displayCreative(theDocument, bidID);
};

window.PWT.displayPMPCreative = function(theDocument, values, priorityArray){
	util.log("In displayPMPCreative for: " + values);
	var bidID = util.getBididForPMP(values, priorityArray);
	bidID && bidManager.displayCreative(theDocument, bidID);
};

window.PWT.sfDisplayCreative = function(theDocument, bidID){
	util.log("In sfDisplayCreative for: " + bidID);
	this.isSafeFrame = true;
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "1",
			pwt_bidID: bidID,
			pwt_origin: CONSTANTS.COMMON.PROTOCOL+window.location.hostname
		}),
		"*"
	);
};

window.PWT.sfDisplayPMPCreative = function(theDocument, values, priorityArray){
	util.log("In sfDisplayPMPCreative for: " + values);
	this.isSafeFrame = true;
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "1",
			pwt_bidID: util.getBididForPMP(values, priorityArray),
			pwt_origin: CONSTANTS.COMMON.PROTOCOL+window.location.hostname
		}),
		"*"
	);
};

window.PWT.initNativeTrackers = function(theDocument,bidID){
	util.log("In startTrackers for: " + bidID);
	util.addEventListenerForClass(window,"click", CONSTANTS.COMMON.OW_CLICK_NATIVE,bidManager.loadTrackers);
	bidManager.executeTracker(bidID);
};

window.PWT.getUserIds = function(){
	return util.getUserIds();
};

window.OWT = {
	notifyCount: 0, // To maintain the id which should be return after externalBidder registered
	externalBidderStatuses: {}
};

window.OWT.registerExternalBidders = function(divIds) {
	window.OWT.notifyCount++;

	util.forEachOnArray(divIds, function (key, divId) {
		util.log("registerExternalBidders: " + divId);
		window.OWT.externalBidderStatuses[divId] = {
			id: window.OWT.notifyCount,
			status: false
		};
	});

	return window.OWT.notifyCount;
};

window.OWT.notifyExternalBiddingComplete = function(notifyId) {
	util.forEachOnObject(window.OWT.externalBidderStatuses, function (key, obj) {
		if(obj && (obj.id === notifyId)) {
			util.log("notify externalBidding complete: " + key);
			window.OWT.externalBidderStatuses[key] = {
				id: obj.id,
				status: true
			};
		}
	});
};

window.PWT.UpdateVastWithTracker = function(bid, vast){
	return util.UpdateVastWithTracker(bid, vast);
};

window.PWT.generateDFPURL= function(adUnit,cust_params){
	var dfpurl = "";
	if(!adUnit || !util.isObject(adUnit)) {
		util.logError("An AdUnit should be an Object", adUnit);
	}
	if(adUnit.bidData && adUnit.bidData.wb && adUnit.bidData.kvp){
		adUnit.bid = adUnit.bidData.wb;
		adUnit.bid["adserverTargeting"] = adUnit.bidData.kvp;
	}
	else{
		util.logWarning("No bid found for given adUnit");
		return;
	}
	var params = {
		adUnit: adUnit,
		params: {
			iu: adUnit.adUnitId,
			cust_params: cust_params,
			output: "vast"
		}
	};
	if(adUnit.bid){
		params["bid"] = adUnit.bid;
	}
	dfpurl = window.owpbjs.adServers.dfp.buildVideoUrl(params);
	return dfpurl;
};

window.PWT.getCustomParamsForDFPVideo = function(customParams, bid){
	return util.getCustomParamsForDFPVideo(customParams, bid);
};

window.PWT.getOWConfig= function(){
	return util.getOWConfig();
};

controller.init(window);
