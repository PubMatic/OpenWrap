var CONFIG = require("./config.js");
var UTIL = require("./util.js");

function Bid(adapterID, kgpv){
	this.adapterID = adapterID;
	this.kgpv = kgpv;
	this.bidID = UTIL.getUniqueIdentifierStr();
	this.grossEcpm = 0; // one given by bidder
	this.netEcpm = 0; // one after bid adjustment
	this.defaultBid = 0;
	this.height = 0;
	this.width = 0;
	this.creativeID = ""; //todo, is it needed ?
	this.keyValuePairs = {};
	this.isPostTimeout = false;
	this.receivedTime = 0;
	this.dealID = "";
	this.dealChannel = "";
	this.isWinningBid = false;
	this.status = 0;
	this.originalCpm = 0;
	this.analyticsGrossCpm = 0;
	this.analyticsNetCpm = 0;
	this.renderer = undefined;
}

Bid.prototype.getAdapterID = function(){
	return this.adapterID;
};

Bid.prototype.getBidID = function(){
	return this.bidID;
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

Bid.prototype.getHeight = function(){
	return this.height;
};

Bid.prototype.getWidth = function(){
	return this.width;
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

/* start-test-block */
module.exports.Bid = Bid;
/* end-test-block */


exports.createBid = function(adapterID, kgpv){
	return new Bid(adapterID, kgpv);
};

//todo:
// add validations
