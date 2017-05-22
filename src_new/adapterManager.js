var CONFIG = require('./config.js');
var CONSTANTS = require('./constants.js');
var util = require('./util.js');
var bidManager = require('./bidManager.js');

// how we can do it optionally (include only iff required) ?
var prebid = require('./adapters/prebid.js');

var registeredAdapters = {};

exports.callAdapters = function(activeSlots){

	var randomNumberBelow100 = Math.floor(Math.random()*100);	
	var impressionID = util.generateUUID();

	for(var i in activeSlots){
		if(util.isOwnProperty(activeSlots, i) && activeSlots[i]){
			bidManager.resetBid(activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], impressionID);
			bidManager.setSizes(activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], util.generateSlotNamesFromPattern(activeSlots[i], '_W_x_H_'));
		}
	}

	for(var anAdapter in registeredAdapters){
		if( util.isOwnProperty(registeredAdapters, anAdapter) ){			
			if(randomNumberBelow100 >= CONFIG.getAdapterThrottle(anAdapter)){
				for(var j in activeSlots){
					if(util.isOwnProperty(activeSlots, j) && activeSlots[j]){
						bidManager.setCallInitTime(activeSlots[j][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], anAdapter);
					}
				}
				registeredAdapters[anAdapter].fB(activeSlots, impressionID);
			}else{
				util.log(anAdapter+CONSTANTS.MESSAGES.M2);
			}				
		}
	}
};

function registerAdapter(bidAdaptor) {
	if (bidAdaptor) {
		var adapterID = bidAdaptor.ID();
		if (util.isFunction(bidAdaptor.fB)) {
			registeredAdapters[adapterID] = bidAdaptor;
		} else {
			util.log(adapterID + CONSTANTS.MESSAGES.M3);
		}
	}
};

exports.registerAdapters = function(){
	registerAdapter(prebid.register());
};
