var CONFIG = require('./config.js');
var CONSTANTS = require('./constants.js');
var UTIL = require('./util.js');

function Bid(adapterID, kgpv){
	this.adapterID = adapterID;
	this.kgpv = kgpv;
	this.bidID = UTIL.getUniqueIdentifierStr();
	this.grossEcpm = 0; // one given by bidder
	this.netEcpm = 0; // one after bid adjustment
	this.defaultBid = 0;
	this.adHtml = '';
	this.adUrl = '';
	this.height = 0;
	this.width = 0;	
	this.creativeID = ''; //todo, is it needed ?
	this.keyValuePairs = null;
	this.isPostTimeout = false;
	this.receivedTime = 0;
	this.dealID = '';
	this.dealChannel = '';
	this.isWinningBid = false;
	this.status = 0;
}

Bid.prototype.getAdapterID = function(){
	return this.adapterID;
};

Bid.prototype.getBidID = function(){
	return this.bidID;
};

Bid.prototype.setGrossEcpm = function(ecpm){

	if(ecpm === null){
		UTIL.log(CONSTANTS.MESSAGES.M10);
		UTIL.log(this);
		return this;
	}

	if(UTIL.isString(ecpm)){
		ecpm = ecpm.replace(/\s/g, '');
		if(ecpm.length === 0){
			UTIL.log(CONSTANTS.MESSAGES.M20);
			UTIL.log(this);
			return this;
		}
	}

	ecpm = parseFloat(ecpm);

	if(isNaN(ecpm)){
		UTIL.log(CONSTANTS.MESSAGES.M11+ecpm);
		UTIL.log(this);
		return;
	}

	this.grossEcpm = ecpm;
	this.netEcpm = parseFloat(this.grossEcpm * CONFIG.getAdapterRevShare(this.getAdapterID()).toFixed(CONSTANTS.COMMON.BID_PRECISION));

	return this;
};

Bid.prototype.getGrossEcpm = function(){
	return this.grossEcpm;
};

Bid.prototype.getNetEcpm = function(){
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

Bid.prototype.getKGPV = function(){
	return this.kgpv;
};

Bid.prototype.setKeyValuePairs = function(keyValuePairs){
	this.keyValuePairs = keyValuePairs;
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
	this.dealID = dealID ? (''+dealID) : '';
	return this;
};

Bid.prototype.getDealID = function(){
	return this.dealID;
};

Bid.prototype.setDealChannel = function(dealChannel){
	this.dealChannel = this.dealID && dealChannel ? (''+dealChannel) : '';
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

exports.createBid = function(adapterID, kgpv){
	return new Bid(adapterID, kgpv);
};

//todo:
// how to support PMPG key-value-pair as we are setting bidID internally
	// auto set the PMPG key value