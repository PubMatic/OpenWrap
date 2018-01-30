var UTIL = require("../../util.js");

function SlotObject(adUnit, dimensionArray, divElement){
	this.adUnit = adUnit;
	this.dimensionArray = dimensionArray;
	this.divElement = divElement;
	this.slotTargetings = {};
	this.slotExtraParameters = {};
	this.slotKeywords = []; // new
	this.keywordsOperation = 0;// new but is it required ?
	this.status = 0;
	this.isNative = false; // new
	this.nativeTemplateID = 0; // new // Todo: need to check if multiple values are reuired
	this.nativeReqestObject = null; // new
	this.nativeRenderingFunction = null; // new
	this.id = divElement; // new ??? repeating
	this.isDisplayFunctionCalled = false; // new ???
	this.response = null; // new
	this.visibility = 0; // new
}

SlotObject.prototype.setResponse = function(resp){
	this.response = resp;
	return this;
};

SlotObject.prototype.getResponse = function(){
	return this.response;
};

SlotObject.prototype.getDisplayFunctionCalled = function(){
	return this.isDisplayFunctionCalled;
};

SlotObject.prototype.setDisplayFunctionCalled = function(flag){
	this.isDisplayFunctionCalled = flag;
	return this;
};

SlotObject.prototype.getStatus = function(){
	return this.status;
};

SlotObject.prototype.setStatus = function(statusValue){
	this.status = statusValue;
	return this;
};

SlotObject.prototype.getId = function(){
	return this.id;
};

SlotObject.prototype.getAdUnit = function(){
	return this.adUnit;
};

SlotObject.prototype.getDimensions = function(){
	return this.dimensionArray;
};

SlotObject.prototype.getDivElement = function(){
	return this.divElement;
};

// sets common targeting applicable to all slots
SlotObject.prototype.setTargeting = function(key, value){
	return this.setSlotPairs(this.slotTargetings, key, value);
};

// return array of all common targeting keys
SlotObject.prototype.getTargetingKeys = function(){
	return this.getKeysFromSlotPairs(this.slotTargetings);
};

// return the common targeting values set against the given key
SlotObject.prototype.getTargeting = function(key){
	var returnValue = '';

	if( this.slotTargetings.hasOwnProperty(key) ){
		returnValue = this.slotTargetings[key];
	}

	return returnValue;
};

SlotObject.prototype.setKeywords = function(arrayOfKeywords){
	var i, len;
	if( UTIL.isArray(arrayOfKeywords) ){
		len = arrayOfKeywords.length;
		for(i=0; i<len; i++){
			this.slotKeywords.push( arrayOfKeywords[i] );
		}
	}
	return this;
};

SlotObject.prototype.getKeywords = function(){
	return this.slotKeywords;
};

// is it required ?
SlotObject.prototype.enableKeywordsAnding = function(){
	this.keywordsOperation = 1;
	return this;
};

// is it required ?
SlotObject.prototype.getKeywordsOperation = function(){
	return this.keywordsOperation;
};

// is it required ?
SlotObject.prototype.setNativeTemplateID = function(templateID){
	this.isNative = true;
	this.nativeTemplateID = templateID;
	return this;
};

// is it required ?
SlotObject.prototype.getNativeTemplateID = function(){
	return this.nativeTemplateID;
};

// is it required ? //todo: not yet implemented by AdEngine
SlotObject.prototype.setNativeRequestObject = function(requestObject){
	this.isNative = true;
	this.nativeReuestObject = requestObject;
	return this;
};

// is it required ?
SlotObject.prototype.setNativeRenderingFunction = function(renderingFunction){
	if(typeof renderingFunction == "function"){
		this.isNative = true;
		this.nativeRenderingFunction = renderingFunction;
	}
	return this;
};

SlotObject.prototype.setVisibility = function(value){
	var validData = {0:0, 1:1, 2:2, 3:3};
	this.visibility = validData[value] || 0;
	return this;
};

SlotObject.prototype.getVisibility = function(){
	return this.visibility;
};


// sets xtra parameters applicable to specific slots
SlotObject.prototype.setExtraParameters = function(key, value){
	return this.setSlotPairs(this.slotExtraParameters, key, value);
};

// return the slot specific values set against the given parameter
SlotObject.prototype.getExtraParameters = function(key){
	return this.getKeysFromSlotPairs(this.slotExtraParameters, key);
};

// return array of all common targeting keys
SlotObject.prototype.getExtraPatameterKeys = function(){
	return this.getKeysFromSlotPairs(this.slotExtraParameters);
};

// common function - set key value at slots level
SlotObject.prototype.setSlotPairs = function(slotVar, key, value){
	var i, len;

	// check type of value , always maintain an array of values against a key
	if( ! slotVar.hasOwnProperty(key) ){
		slotVar[key] = [];
	}

	if(UTIL.isArray(value)){
		len = value.length;
		for(i=0; i<len; i++){
			slotVar[key].push( value[i] );
		}
	}else{
		slotVar[key].push( value );
	}
};

SlotObject.prototype.getKeyValuesFromSlotPairs = function(slotVar, key){
	var returnValue = "";

	if( slotVar.hasOwnProperty(key) ){
		returnValue = slotVar[key];
	}

	return returnValue;
};

SlotObject.prototype.getKeysFromSlotPairs = function(slotVar){
	var returnArray = [];

	for(var key in slotVar){
		if( !UTIL.isUndefined(key) ){
			returnArray.push(key);
		}
	}
	return returnArray;
};


exports.SlotObject = SlotObject;
