var CONSTANTS = require("./constants.js");
var util = require("./util.js");

///////////////////////////////

function AdapterEntry(adapterID){
	this.adapterID = adapterID;
	this.callInitiatedTime = util.getCurrentTimestampInMs();
	this.bids = {};
	this.lastBidID = "";
}

AdapterEntry.prototype.getCallInitiatedTime = function(){
	return this.callInitiatedTime;
};

AdapterEntry.prototype.getLastBidID = function(){
	return this.lastBidID;
};

AdapterEntry.prototype.getBid = function(bidID){
	if(util.isOwnProperty(this.bids, bidID)){
		return this.bids[ bidID ];
	}
	return null;
};

AdapterEntry.prototype.setNewBid = function(theBid){
	delete this.bids[this.lastBidID];
	var bidID = theBid.getBidID();
	this.bids[bidID] = theBid;
	this.lastBidID = bidID;
}

///////////////////////////////

function BMEntry(name){
	this.name = name;
	this.sizes = [];
	this.adapters = {};
	this.creationTime = util.getCurrentTimestampInMs();
	this.impressionID = "";
	this.analyticsEnabled = false;
	this.expired = false;
}

BMEntry.prototype.setExpired = function(){
	this.expired = true;
	return this;
};

BMEntry.prototype.getExpiredStatus = function(){
	return this.expired;
};

BMEntry.prototype.setAnalyticEnabled = function(){
	this.analyticsEnabled = true;
	return this;
};

BMEntry.prototype.getAnalyticEnabledStatus = function(){
	return this.analyticsEnabled;
};

BMEntry.prototype.setNewBid = function(adapterID, theBid){
	if(!util.isOwnProperty(this.adapters, adapterID)){
		this.adapters[adapterID] = new AdapterEntry(adapterID);
	}
	this.adapters[adapterID].setNewBid(theBid);
};

BMEntry.prototype.getBid = function(adapterID, bidID){
	if(util.isOwnProperty(this.adapters, adapterID)){
		return this.adapters[adapterID].getBid(bidID);
	}
};

BMEntry.prototype.getName = function(){
	return this.name;
};

BMEntry.prototype.getCreationTime = function(){
	return this.creationTime;
};

BMEntry.prototype.setImpressionID = function(value){
	this.impressionID = value;
	return this;
};

BMEntry.prototype.getImpressionID = function(){
	return this.impressionID;
};

BMEntry.prototype.setSizes = function(sizes){
	this.sizes = sizes;
	return this;
};

BMEntry.prototype.getSizes = function(){
	return this.sizes;
};

BMEntry.prototype.setAdapterEntry = function(adapterID){
	if(!util.isOwnProperty(this.adapters, adapterID)){
		this.adapters[adapterID] = new AdapterEntry(adapterID);
		util.log(CONSTANTS.MESSAGES.M4+this.name + " "+adapterID+" "+this.adapters[adapterID].getCallInitiatedTime());
	}
	return this;
};

BMEntry.prototype.getLastBidIDForAdapter = function(adapterID){
	if(util.isOwnProperty(this.adapters, adapterID)){
		return this.adapters[adapterID].getLastBidID();
	}
	return "";
};

exports.createBMEntry = function(name){
	return new BMEntry(name);
};