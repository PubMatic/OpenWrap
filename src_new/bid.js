function Bid(){
	this.adapterID = '';
	this.bidID = '';
	this.grossEcpm = 0;
	this.netEcpm = 0;
	this.defaultBid = 0;
	this.adHtml = '';
	this.adUrl = '';
	this.height = 0;
	this.width = 0;
	this.kgpv = '';
	this.creativeID = ''; //todo, is it needed ?
	this.keyValuePairs = null;
	this.isPostTimeout = false;
	this.receivedTime = 0;
	this.dealID = '';
	this.dealChannel = '';
	this.isWinningBid = false;
}

Bid.prototype.setAdapterID = function(adapterID){
	this.adapterID = adapterID;
	return this;
};

Bid.prototype.getAdapterID = function(){
	return this.adapterID;
};

Bid.prototype.setBidID = function(bidID){
	this.bidID = bidID;
	return this;
};

Bid.prototype.getBidID = function(){
	return this.bidID;
};

Bid.prototype.setGrossEcpm = function(ecpm){
	this.grossEcpm = ecpm;
	return this;
};

Bid.prototype.getGrossEcpm = function(){
	return this.grossEcpm;
};

Bid.prototype.setNetEcpm = function(ecpm){
	this.netEcpm = ecpm;
	return this;
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

Bid.prototype.setKGPV = function(kgpv){
	this.kgpv = kgpv;
	return this;
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
	this.dealID = dealID;
	return this;
};

Bid.prototype.getDealID = function(){
	return this.dealID;
};

Bid.prototype.setDealChannel = function(dealChannel){
	this.dealChannel = dealChannel;
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

exports.createBid = function(){
	return new Bid();
}