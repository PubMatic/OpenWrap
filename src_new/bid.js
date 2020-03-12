var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var UTIL = require("./util.js");

function Bid(adapterID, kgpv){
	this.adapterID = adapterID;
	this.kgpv = kgpv;
	this.bidID = UTIL.getUniqueIdentifierStr();
	this.grossEcpm = 0; // one given by bidder
	this.netEcpm = 0; // one after bid adjustment
	this.defaultBid = 0;
	this.adHtml = "";
	this.adUrl = "";
	this.height = 0;
	this.width = 0;
	this.creativeID = ""; //todo, is it needed ?
	this.keyValuePairs = {};
	this.isPostTimeout = false;
	this.receivedTime = 0;
	this.isServerSide = CONFIG.isServerSideAdapter(adapterID) ? 1 : 0;
	this.dealID = "";
	this.dealChannel = "";
	this.isWinningBid = false;
	this.status = 0;
	this.serverSideResponseTime = 0;
	this.mi = undefined;
	this.originalCpm = 0;
	this.originalCurrency = "";
	this.analyticsGrossCpm = 0;
	this.analyticsNetCpm = 0;
	this.native = undefined;
	this.adFormat = undefined;
	this.regexPattern = undefined;
	this.cacheUUID = undefined;
}

var getNetECPM = function(grossEcpm, adapterID){
	return window.parseFloat((grossEcpm * CONFIG.getAdapterRevShare(adapterID)).toFixed(CONSTANTS.COMMON.BID_PRECISION));
};

Bid.prototype.setServerSideResponseTime = function (ssResponseTime) {
	this.serverSideResponseTime = ssResponseTime;
};

Bid.prototype.getServerSideResponseTime = function () {
	return this.serverSideResponseTime;
};

Bid.prototype.getServerSideStatus = function () {
	return this.isServerSide;
};

Bid.prototype.setServerSideStatus = function (isServerSide) {
	this.isServerSide = isServerSide;
};

Bid.prototype.getAdapterID = function(){
	return this.adapterID;
};

Bid.prototype.getBidID = function(){
	return this.bidID;
};

Bid.prototype.setGrossEcpm = function(ecpm){
	/* istanbul ignore else */
	if(ecpm === null){
		UTIL.log(CONSTANTS.MESSAGES.M10);
		UTIL.log(this);
		return this;
	}
	/* istanbul ignore else */
	if(UTIL.isString(ecpm)){
		ecpm = ecpm.replace(/\s/g, "");
		/* istanbul ignore else */
		if(ecpm.length === 0){
			UTIL.log(CONSTANTS.MESSAGES.M20);
			UTIL.log(this);
			return this;
		}
	}

	/* istanbul ignore else */
	if(window.isNaN(ecpm)){
		UTIL.log(CONSTANTS.MESSAGES.M11+ecpm);
		UTIL.log(this);
		return this;
	}

	ecpm = window.parseFloat(ecpm.toFixed(CONSTANTS.COMMON.BID_PRECISION));

	this.grossEcpm = ecpm;
	this.netEcpm = getNetECPM(this.grossEcpm, this.getAdapterID());

	return this;
};

Bid.prototype.getGrossEcpm = function(forAnalytics){
	// Check config if currency module is enabled.
	if(CONFIG.getAdServerCurrency() && this.analyticsGrossCpm && forAnalytics){
		return this.analyticsGrossCpm;
	}
	return this.grossEcpm;
};

Bid.prototype.getNetEcpm = function(forAnalytics){
	if(CONFIG.getAdServerCurrency() && this.analyticsNetCpm && forAnalytics){
		return this.analyticsNetCpm;
	}
	return this.netEcpm;
};

Bid.prototype.setDefaultBidStatus = function(status){
	this.defaultBid = status;
	return this;
};

Bid.prototype.getDefaultBidStatus = function(){
	return this.defaultBid;
};

Bid.prototype.setAdHtml = function(adHtml){
	this.adHtml = adHtml;
	this.setAdFormat(adHtml);
	return this;
};

Bid.prototype.getAdHtml = function(){
	return this.adHtml;
};

Bid.prototype.setAdUrl = function(adUrl){
	this.adUrl = adUrl;
	return this;
};

Bid.prototype.getAdUrl = function(){
	return this.adUrl;
};

Bid.prototype.setHeight = function(height){
	this.height = height;
	return this;
};

Bid.prototype.getHeight = function(){
	return this.height;
};

Bid.prototype.setWidth = function(width){
	this.width = width;
	return this;
};

Bid.prototype.getWidth = function(){
	return this.width;
};

Bid.prototype.getKGPV = function(isActualValueRequired){
	if(!isActualValueRequired && this.regexPattern){
		return this.regexPattern;
	}
	return this.kgpv;
};

Bid.prototype.setKeyValuePair = function(key, value){
	// max length of key is restricted to 20 characters
	this.keyValuePairs[key.substr(0, 20)] = value;
	return this;
};

Bid.prototype.getKeyValuePairs = function(){
	return this.keyValuePairs;
};

Bid.prototype.setPostTimeoutStatus = function(){
	this.isPostTimeout = true;
	return this;
};

Bid.prototype.getPostTimeoutStatus = function(){
	return this.isPostTimeout;
};

Bid.prototype.setReceivedTime = function(receivedTime){
	this.receivedTime = receivedTime;
	return this;
};

Bid.prototype.getReceivedTime = function(){
	return this.receivedTime;
};

Bid.prototype.setDealID = function(dealID){
	/* istanbul ignore else */
	if(dealID){
		this.dealID = dealID;
		this.dealChannel = this.dealChannel || "PMP";
		this.setKeyValuePair(
			CONSTANTS.COMMON.DEAL_KEY_FIRST_PART+this.adapterID,
			this.dealChannel + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.dealID + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.bidID
		);
	}
	return this;
};

Bid.prototype.getDealID = function(){
	return this.dealID;
};

Bid.prototype.setDealChannel = function(dealChannel){
	/* istanbul ignore else */
	if(this.dealID && dealChannel){
		this.dealChannel = dealChannel;
		this.setKeyValuePair(
			CONSTANTS.COMMON.DEAL_KEY_FIRST_PART+this.adapterID,
			this.dealChannel + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.dealID + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.bidID
		);
	}
	return this;
};

Bid.prototype.getDealChannel = function(){
	return this.dealChannel;
};

Bid.prototype.setWinningBidStatus = function(){
	this.isWinningBid = true;
	return this;
};

Bid.prototype.getWinningBidStatus = function(){
	return this.isWinningBid;
};

Bid.prototype.setStatus = function(status){
	this.status = status;
	return this;
};

Bid.prototype.getStatus = function(){
	return this.status;
};

Bid.prototype.setSendAllBidsKeys = function(){
	this.setKeyValuePair(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID+'_'+this.adapterID, this.bidID);
	this.setKeyValuePair(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS+'_'+this.adapterID, this.getNetEcpm() > 0 ? 1 : 0);
	this.setKeyValuePair(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM+'_'+this.adapterID, this.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));
	this.setKeyValuePair(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_SIZE+'_'+this.adapterID, this.width + 'x' + this.height);
	if (this.native) {
		var keyValues = this.keyValuePairs;
		var globalThis = this;
		UTIL.forEachOnObject(keyValues, function(key, value) {
			if (key.indexOf("native") >= 0) {
				globalThis.setKeyValuePair(key + "_" + globalThis.adapterID, value);
			}
		});
	}
};

Bid.prototype.setMi = function(mi){
	this.mi = mi;
	return this;
};

Bid.prototype.getMi = function(){
	return this.mi;
};

Bid.prototype.setOriginalCpm = function(originalCpm){
	this.originalCpm = window.parseFloat(originalCpm.toFixed(CONSTANTS.COMMON.BID_PRECISION));
	return this;
};

Bid.prototype.getOriginalCpm = function(){
	return this.originalCpm;
};


Bid.prototype.setOriginalCurrency = function(originalCurrency){
	this.originalCurrency = originalCurrency;
	return this;
};

Bid.prototype.getOriginalCurrency = function(){
	return this.originalCurrency;
};


Bid.prototype.setAnalyticsCpm = function(analyticsCpm){
	this.analyticsGrossCpm = window.parseFloat(analyticsCpm.toFixed(CONSTANTS.COMMON.BID_PRECISION));
	this.analyticsNetCpm = getNetECPM(this.analyticsGrossCpm,this.getAdapterID());
	return this;
};

Bid.prototype.getAnalyticsCpm = function(){
	return this.analyticsGrossCpm;
};

Bid.prototype.getNative = function(){
	return this.native;
};

Bid.prototype.setNative = function(native){
	this.native = native;
	return this;
};

Bid.prototype.getAdFormat = function(){
	return this.adFormat;
};

Bid.prototype.setAdFormat = function(ad){
	this.adFormat = UTIL.getAdFormatFromBidAd(ad);
	return this;
};

Bid.prototype.getRegexPattern = function(){
	return this.regexPattern;
};

Bid.prototype.setRegexPattern = function(pattern){
	this.regexPattern = pattern;
	return this;
};

Bid.prototype.getcacheUUID = function(){
	return this.cacheUUID;
};

Bid.prototype.setcacheUUID = function(cacheUUID){
	this.cacheUUID = cacheUUID;
	if(!this.adFormat){
		this.adFormat = CONSTANTS.FORMAT_VALUES.VIDEO;
	}
	return this;
};


// This function is used to update the bid in case of video bid
// this should only be called if bid is video so that there is no discrepancy in tracker and logger for bid Id
Bid.prototype.updateBidId = function(slotID){
	if(window.PWT.bidMap[slotID] && window.PWT.bidMap[slotID].adapters && Object.keys(window.PWT.bidMap[slotID].adapters).length>0){
		var bidId = window.PWT.bidMap[slotID].adapters[this.adapterID].bids[Object.keys(window.PWT.bidMap[slotID].adapters[this.adapterID].bids)[0]].bidID;
		if(bidId && this.adFormat == CONSTANTS.FORMAT_VALUES.VIDEO){
			this.bidID = bidId;
		}
	}
	else {
		UTIL.logWarning("Error in Updating BidId. It might be possible singleImpressionEnabled is false");
		console.warn("Setup for video might not be correct. Try setting up Optimize MultiSize AdSlot to true.");
	}
	return this;
};

/* start-test-block */
module.exports.Bid = Bid;
/* end-test-block */


exports.createBid = function(adapterID, kgpv){
	return new Bid(adapterID, kgpv);
};

//todo:
// add validations
