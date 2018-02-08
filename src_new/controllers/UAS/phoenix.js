var CONSTANTS = require("../../constants.js");
var UTIL = require("../../util.js");
var PHOENIX_UTIL = require("./phoenix-utils.js");
var EQ = require("./executionQueue.js");
var SO = require("./slotObject.js");

function PhoenixClass() {
    this.singleRequestCall = false;
    this.isSingleRequestCallAlreadyFired = false; // not used
    this.req_type = 219;
    // some common data-storages
    this.commonKeywordsAnding = 0;
    this.commonTargetings = {};
    this.commonKeywords = [];
    this.customInfo = {};
    this.slotStorage = {}; // will store map of divid ==> slotObject
    this.queryParams = {}; // todo can we use UTIL function here ?

    // this.EQ = new EQ.EexecutionQueue(window);
}

PhoenixClass.prototype.EQ = new EQ.EexecutionQueue(window);

PhoenixClass.prototype.setRequestType = function(value){
	if(! isNaN(value)){
		this.req_type = value;
	}
};

PhoenixClass.prototype.enableSingleRequestCallMode = function(){
	this.singleRequestCall = true;
};

PhoenixClass.prototype.enableCommonKeywordsAnding = function(){
	this.commonKeywordsAnding = 1;
};

// sets common targeting applicable to all slots
PhoenixClass.prototype.setCommonTargeting = function(key, value) {
  var oThis = this;

  // check type of value , always maintain an array of values against a key
	if(!oThis.commonTargetings.hasOwnProperty(key)){
		oThis.commonTargetings[key] = [];
	}

	if(UTIL.isArray(value)){
		UTIL.forEachOnArray(value, function(index, val) {
			oThis.commonTargetings[key].push(val);
		});
	} else {
		oThis.commonTargetings[key].push(value);
	}
};

// return array of all common targeting keys
PhoenixClass.prototype.getCommonTargetingKeys = function(){
	var returnArray = [];

	UTIL.forEachOnObject(this.commonTargetings, function(key, val) {
		if(!UTIL.isUndefined(key)){
			returnArray.push(key);
		}
	});

	return returnArray;
};

// return the common targeting values set against the given key
PhoenixClass.prototype.getCommonTargeting = function(key){
	return this.commonTargetings.hasOwnProperty(key) ? this.commonTargetings[key] : "";
};

// set the common keywords , always pass array of keywords
PhoenixClass.prototype.setCommonKeywords = function(arrayOfKeywords){
  var oThis = this;

  if(UTIL.isArray(arrayOfKeywords)) {
		UTIL.forEachOnArray(arrayOfKeywords, function(key, val) {
			oThis.commonKeywords.push(val);
		});
	}
};

// get the common keywords
PhoenixClass.prototype.getCommonKeywords = function(){
	return this.commonKeywords;
};

//Useful to set custom params
PhoenixClass.prototype.setInfo = function(key, value){
	var newKey = '',
		tempValue = ''; // use this variable if you need to process value variable

	//todo: we should have "_" used in words
	switch(key){
		case 'PAGEURL':
			newKey = 'dpurl';
			break;
		case 'LAT':
			newKey = 'lat';
			break;
		case 'LON':
			newKey = 'lon';
			break;
		case 'SEC':
			secure = (secure == 1 ? secure : value);
			newKey = '';
			break;
		case 'ACCID':
			accountID = value;
			newKey = '';
			break;
		case 'LOC_SRC':
			newKey = 'lsrc';
			break;
	}

	if(newKey != "" && value != ""){
		this.customInfo[newKey] = encodeURIComponent(value);
	}
};

// to generate a slot
PhoenixClass.prototype.defineAdSlot = function(adUnit, dimensionArray, divElement) {
	//todo: need a check like if div already exists in dom or not
	//todo: need a check like if div is already present in map
	var newSlotObject = new SO.SlotObject(adUnit, dimensionArray, divElement);

	// push the newSlotObject in slotStorage
	this.slotStorage[ divElement ] = newSlotObject;

	return newSlotObject;
};

PhoenixClass.prototype.getSlots = function() {
	var tempArray = [];

	UTIL.forEachOnObject(this.slotStorage, function(key, val) {
		tempArray.push(val);
	});
	return tempArray;
};

PhoenixClass.prototype.display = function(DivID){
	var adServerRequestCall,
		element,
		filterSlotsByStaus = {},
		arrayOfSlots = [];

	var currentSlot = PHOENIX_UTIL.getSlotByDivId(DivID, this.slotStorage);
	if(currentSlot !== null){
		currentSlot.setDisplayFunctionCalled(true);
		if(currentSlot.getStatus() === CONSTANTS.SLOT_STATUS.DISPLAYED){
			//console.log('display the creative now for '+ DivID);
			var response = currentSlot.getResponse();
			if(response !== null){
				PHOENIX_UTIL.createFriendlyIframeAndRenderCreative(DivID, response);
				currentSlot.setResponse(null);
				currentSlot.setDisplayFunctionCalled(false);
				UTIL.log('Rendering the creative for the slot '+ DivID);
			} else {
				UTIL.log('No cached response found for the slot '+ DivID);
			}
		} else {
			UTIL.log('Already displayed the slot: '+ DivID);
		}
	}

	if(this.singleRequestCall) {
		filterSlotsByStaus[ CONSTANTS.SLOT_STATUS.CREATED ] = "";
		arrayOfSlots = PHOENIX_UTIL.getSlotsFilteredByStatus(filterSlotsByStaus, this.slotStorage);

		if(arrayOfSlots.length > 0) {
			adServerRequestCall = PHOENIX_UTIL.generateAdServerCall(arrayOfSlots, this.req_type, this.customInfo, this.queryParams);
			PHOENIX_UTIL.createFriendlyIframeAndTriggerAdServerCall( DivID, adServerRequestCall );
		}
	} else {
		//todo: following check may be problem for out of page slot
		//element = window.document.getElementById( DivID );
		// only if element exists
		if(this.slotStorage.hasOwnProperty(DivID)) {
			arrayOfSlots.push(this.slotStorage[DivID]);
			adServerRequestCall = PHOENIX_UTIL.generateAdServerCall(arrayOfSlots, this.req_type, this.customInfo, this.queryParams);
			PHOENIX_UTIL.createFriendlyIframeAndTriggerAdServerCall(DivID, adServerRequestCall);
		}
	}
};

PhoenixClass.prototype.callback = function(response){
  var oThis = this;
	//todo: response requires the div-id as key , need to define new key too
	// problem with out-of page, can there be case where div-id is not passed
	if(response.bids) {
		UTIL.forEachOnObject(response.bids, function(key, eachBid) {
			if(eachBid.isNative == 1 ){
				// special treatment calls 58:c1ee99e0-b26a-46a1-bc77-8913f0cfe732
				UTIL.log('Native creative found...');
				return;
			}

			if(eachBid.ct && eachBid.ct.length != 0 /*&& eachBid.h != 0 && eachBid.w != 0*/) {
				UTIL.log('Creative found for ' + eachBid.id);
				var currentSlot = PHOENIX_UTIL.getSlotByDivId(eachBid.id, oThis.slotStorage);

				if(currentSlot !== null) {
					if(currentSlot.getDisplayFunctionCalled() === true) {
						PHOENIX_UTIL.createFriendlyIframeAndRenderCreative(eachBid.id, eachBid);
						currentSlot.setDisplayFunctionCalled(false);
					} else {
						// store the response for slot
						currentSlot.setResponse(eachBid);
					}
				} else {
					UTIL.log('Invalid slot, no slot found defined for div: '+ eachBid.id);
				}
			} else {
				UTIL.log('Creative NOT found for ' + eachBid.id);
			}
		});
	}
};

exports.PhoenixClass = PhoenixClass;
