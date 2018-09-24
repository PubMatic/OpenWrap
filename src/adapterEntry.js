var util = require("./util.js");

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
	/* istanbul ignore else */
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

module.exports.AdapterEntry =  AdapterEntry;