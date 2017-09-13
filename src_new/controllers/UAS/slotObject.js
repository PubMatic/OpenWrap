var UTIL = require("../../util.js");

function SlotObject(adUnit, dimensionArray, divElement){
	this.adUnit = adUnit;
	this.dimensionArray = dimensionArray;
	this.divElement = divElement;
	this.slotTargetings = {};
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
	var i, len;
	// check type of value , always maintain an array of values against a key
	if( ! this.slotTargetings.hasOwnProperty(key) ){
		this.slotTargetings[key] = [];
	}
	
	if(UTIL.isArray(value)){
		len = value.length;
		for(i=0; i<len; i++){
			this.slotTargetings[key].push( value[i] );
		}
	}else{
		this.slotTargetings[key].push( value );
	}			
};

// return array of all common targeting keys
SlotObject.prototype.getTargetingKeys = function(){
	var returnArray = [];
	
	for(var key in this.slotTargetings){
		if( !UTIL.isUndefined(key) ){
			returnArray.push(key);
		}
	}
	return returnArray;
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

exports.SlotObject = SlotObject;
