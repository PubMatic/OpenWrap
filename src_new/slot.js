var CONSTANTS = require("./constants.js");

function Slot(name){
	this.name = name;
	this.status = CONSTANTS.SLOT_STATUS.CREATED;
	this.divID = "";
	this.adUnitID = "";
	this.adUnitIndex = 0;
	this.sizes = [];
	this.keyValues = {};
	this.arguments = [];
	this.pubAdServerObject = null;
	this.displayFunctionCalled = false;
	this.refreshFunctionCalled = false;	
}

Slot.prototype.getName = function(){
	return this.name;
};

Slot.prototype.setStatus = function(status){
	//check is it a valid status
	this.status = status;
	return this;
};

Slot.prototype.getStatus = function(){
	return this.status;
};

Slot.prototype.setDivID = function(divID){
	//check is it a valid divID, string
	this.divID = divID;
	return this;
};

Slot.prototype.getDivID = function(){
	return this.divID;
};

Slot.prototype.setAdUnitID = function(value){
	//check is it a valid divID, string
	this.adUnitID = value;
	return this;
};

Slot.prototype.getAdUnitID = function(){
	return this.adUnitID;
};

Slot.prototype.setAdUnitIndex = function(value){
	//check is it a valid divID, string or number 
	this.adUnitIndex = value;
	return this;
};

Slot.prototype.getAdUnitIndex = function(){
	return this.adUnitIndex;
};

Slot.prototype.setSizes = function(value){
	//check is it a valid value, array
	this.sizes = value;
	return this;
};

Slot.prototype.getSizes = function(){
	return this.sizes;
};

Slot.prototype.setKeyValue = function(key, value){
	//check is it a valid value, array
	this.keyValues[key] = value;
	return this;
};

Slot.prototype.setKeyValues = function(value){
	//check is it a valid value, array
	this.keyValues = value;
	return this;
};

Slot.prototype.getkeyValues = function(){
	return this.keyValues;
};

Slot.prototype.setArguments = function(value){
	//check is it a valid value, array
	this.arguments = value;
	return this;
};

Slot.prototype.getArguments = function(){
	return this.arguments;
};

Slot.prototype.setPubAdServerObject = function(value){
	//check is it a valid value, array
	this.pubAdServerObject = value;
	return this;
};

Slot.prototype.getPubAdServerObject = function(){
	return this.pubAdServerObject;
};

Slot.prototype.setDisplayFunctionCalled = function(value){
	this.displayFunctionCalled = value;
	return this;
};

Slot.prototype.isDisplayFunctionCalled = function(){
	return this.displayFunctionCalled;
};

Slot.prototype.setRefreshFunctionCalled = function(value){
	this.refreshFunctionCalled = value;
	return this;
};

Slot.prototype.isRefreshFunctionCalled = function(){
	return this.refreshFunctionCalled;
};


Slot.prototype.updateStatusAfterRendering = function(isRefreshCalled){
	this.status = CONSTANTS.SLOT_STATUS.DISPLAYED;
	this.arguments = [];
	if(isRefreshCalled){
		this.refreshFunctionCalled = false;
	}else{
		this.displayFunctionCalled = false;
	}

};

/* start-test-block */
module.exports.Slot = Slot;
/* end-test-block */

exports.createSlot = function(name){
	return new Slot(name);
};