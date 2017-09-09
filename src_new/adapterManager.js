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

exports.getRandomNumberBelow100 = getRandomNumberBelow100;

function callAdapter(adapters, slots, impressionID){
	util.forEachOnObject(adapters, function(adapterID, theAdapter){
		//Note: if you have any other parent-adapter like prebid, and 
		//		want to add throttling on the parent-adapters then 
		//		you will need to add throttling logic here as well
		refThis.setInitTimeForSlotsForAdapter(slots, adapterID);
		theAdapter.fB(slots, impressionID);
	});
}

/* start-test-block */
exports.callAdapter = callAdapter;
/* end-test-block */

function resetSlots(slots, impressionID){
	util.forEachOnArray(slots, function(key, slot){
		var divID = slot.getDivID();
		bidManager.resetBid(divID, impressionID);
		bidManager.setSizes(divID, util.generateSlotNamesFromPattern(slot, "_W_x_H_"));
	});
}

/* start-test-block */
exports.resetSlots = resetSlots;
/* end-test-block */

function throttleAdapter(randomNumber, adapterID){
	return !(randomNumber >= CONFIG.getAdapterThrottle(adapterID));
}

exports.throttleAdapter = throttleAdapter;

function setInitTimeForSlotsForAdapter(slots, adapterID){
	util.forEachOnObject(slots, function(j, slot){
		bidManager.setCallInitTime(slot.getDivID(), adapterID);
	});
}

exports.setInitTimeForSlotsForAdapter = setInitTimeForSlotsForAdapter;

function registerAdapter(bidAdaptor) {
	if (bidAdaptor) {
		var adapterID = bidAdaptor.ID();
		if (util.isFunction(bidAdaptor.fB)){
			refThis.registeredAdapters[adapterID] = bidAdaptor;
		} else {
			util.log(adapterID + CONSTANTS.MESSAGES.M3);
		}
	} else {
		util.log(CONSTANTS.MESSAGES.M3);
		util.log(bidAdaptor);
	}
}

/* start-test-block */
exports.registerAdapter = registerAdapter;
/* end-test-block */

function registerAdapters(){
	refThis.registerAdapter(prebid.register());
};


exports.registerAdapters = registerAdapters;
