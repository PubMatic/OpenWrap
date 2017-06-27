var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");
var bidManager = require("./bidManager.js");
// todo: how we can do it optionally (include only iff required) ?
var prebid = require("./adapters/prebid.js");

var registeredAdapters = {};

/* start-test-block */
exports.registeredAdapters = registeredAdapters;
/* end-test-block */

var refThis = this;

exports.callAdapters = function(activeSlots){	
	var impressionID = util.generateUUID();
	refThis.resetSlots(activeSlots, impressionID);
	refThis.callAdapter(registeredAdapters, activeSlots, impressionID);
};

function getRandomNumberBelow100(){
	return Math.floor(Math.random()*100);
}

/* start-test-block */
exports.getRandomNumberBelow100 = getRandomNumberBelow100;
/* end-test-block */

// todo: give better name to this function
function callAdapter(adapters, slots, impressionID){
	var randomNumberBelow100 = refThis.getRandomNumberBelow100();
	util.forEachOnObject(adapters, function(adapterID, theAdapter){
		if(refThis.throttleAdapter(randomNumberBelow100, adapterID) == false){
			refThis.setInitTimeForSlotsForAdapter(slots, adapterID);
			theAdapter.fB(slots, impressionID);
		}else{
			util.log(adapterID+CONSTANTS.MESSAGES.M2);
		}
	});
}

/* start-test-block */
exports.callAdapter = callAdapter;
/* end-test-block */

// todo: where this function should go ? move to bidManager
function resetSlots(slots, impressionID){
	util.forEachOnObject(slots, function(key, slot){
		var divID = slot.getDivID();
		bidManager.resetBid(divID, impressionID);
		bidManager.setSizes(divID, util.generateSlotNamesFromPattern(slot, "_W_x_H_"));
		//todo: why don't we pass the sizes array as it is
	});
}

/* start-test-block */
exports.resetSlots = resetSlots;
/* end-test-block */

function throttleAdapter(randomNumber, adapterID){
	return !(randomNumber >= CONFIG.getAdapterThrottle(adapterID));
}

/* start-test-block */
exports.throttleAdapter = throttleAdapter;
/* end-test-block */

// todo: where this function should go ? move to bidManager
function setInitTimeForSlotsForAdapter(slots, adapterID){
	util.forEachOnObject(slots, function(j, slot){
		bidManager.setCallInitTime(slot.getDivID(), adapterID);
	});
}

/* start-test-block */
exports.setInitTimeForSlotsForAdapter = setInitTimeForSlotsForAdapter;
/* end-test-block */

function registerAdapter(bidAdaptor) {
	if (bidAdaptor) {
		var adapterID = bidAdaptor.ID();
		if (util.isFunction(bidAdaptor.fB)){
			refThis.registeredAdapters[adapterID] = bidAdaptor;
		} else {
			util.log(adapterID + CONSTANTS.MESSAGES.M3);
		}
	} else {
		util.log("passsed argument is not a bidAdaptor");
	}
}

/* start-test-block */
exports.registerAdapter = registerAdapter;
/* end-test-block */

function registerAdapters(){
	refThis.registerAdapter(prebid.register());
};


exports.registerAdapters = registerAdapters;
