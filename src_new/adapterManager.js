var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");
var bidManager = require("./bidManager.js");
// todo: how we can do it optionally (include only iff required) ?
var prebid = require("./adapters/prebid.js");

var registeredAdapters = {};

exports.callAdapters = function(activeSlots){	
	var impressionID = util.generateUUID();
	resetSlots(activeSlots, impressionID);
	callAdapter(registeredAdapters, activeSlots, impressionID);
};

function getRandomNumberBelow100(){
	return Math.floor(Math.random()*100);
}

// todo: give better name to this function
function callAdapter(adapters, slots, impressionID){
	var randomNumberBelow100 = getRandomNumberBelow100();
	util.forEachOnObject(adapters, function(adapterID, theAdapter){
		if(throttleAdapter(randomNumberBelow100, adapterID) == false){
			setInitTimeForSlotsForAdapter(slots, adapterID);
			theAdapter.fB(slots, impressionID);
		}else{
			util.log(adapterID+CONSTANTS.MESSAGES.M2);
		}
	});
}

// todo: where this function should go ? move to bidManager
function resetSlots(slots, impressionID){
	util.forEachOnObject(slots, function(key, slot){
		var divID = slot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID];
		bidManager.resetBid(divID, impressionID);
		bidManager.setSizes(divID, util.generateSlotNamesFromPattern(slot, "_W_x_H_"));	
	});
}

function throttleAdapter(randomNumber, adapterID){
	return !(randomNumber >= CONFIG.getAdapterThrottle(adapterID));
}

// todo: where this function should go ? move to bidManager
function setInitTimeForSlotsForAdapter(slots, adapterID){
	util.forEachOnObject(slots, function(j, slot){
		bidManager.setCallInitTime(slot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], adapterID);
	});
}

function registerAdapter(bidAdaptor) {
	if (bidAdaptor) {
		var adapterID = bidAdaptor.ID();
		if (util.isFunction(bidAdaptor.fB)){
			registeredAdapters[adapterID] = bidAdaptor;
		} else {
			util.log(adapterID + CONSTANTS.MESSAGES.M3);
		}
	}
}

exports.registerAdapters = function(){
	registerAdapter(prebid.register());
};