var CONSTANTS = require("./constants.js");
var util = require("./util.js");
var AdapterEntry = require("./adapterEntry").AdapterEntry;

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
	/* istanbul ignore else */
	if(!util.isOwnProperty(this.adapters, adapterID)){
		/* istanbul ignore next */
		this.adapters[adapterID] = new AdapterEntry(adapterID);
	}
	/* istanbul ignore next */
	this.adapters[adapterID].setNewBid(theBid);
};

BMEntry.prototype.getBid = function(adapterID, bidID){
	/* istanbul ignore else */
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
	/* istanbul ignore else */
	if(!util.isOwnProperty(this.adapters, adapterID)){
		this.adapters[adapterID] = new AdapterEntry(adapterID);
		util.log(CONSTANTS.MESSAGES.M4+this.name + " "+adapterID+" "+this.adapters[adapterID].getCallInitiatedTime());
	}
	return this;
};

BMEntry.prototype.getLastBidIDForAdapter = function(adapterID){
	/* istanbul ignore else */
	if(util.isOwnProperty(this.adapters, adapterID)){
		return this.adapters[adapterID].getLastBidID();
	}
	return "";
};


/* start-test-block */
module.exports.BMEntry = BMEntry;
/* end-test-block */

exports.createBMEntry = function(name){
	return new BMEntry(name);
};