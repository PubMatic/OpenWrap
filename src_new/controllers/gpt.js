var CONSTANTS = require('../constants.json');
var util = require('../util.js');

var displayHookIsAdded = false,	
	disableInitialLoadIsSet = false,
	sendTargetingInfoIsSet = true
	sraIsSet = false,
	configObject = {},
	configTimeout = 0,
	wrapperTargetingKeys = {}
;

function defineWrapperTargetingKeys(object){
	var output = {};

	for(var key in object){
		if(util.isOwnProperty(object, key)){
			output[ object[key] ] = '';
		}
	}

	return output;
}

function defineWrapperTargetingKey(key){
	wrapperTargetingKeys[key] = '';
}

function defineGPTVariables(win){
	// define the command array if not already defined
	win.googletag = win.googletag || {};
	win.googletag.cmd = win.googletag.cmd || [];
}

exports.init = function(config, win){
	configObject = config;
	configTimeout = util.getTimeout(configObject);
	wrapperTargetingKeys = defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
	defineGPTVariables(win);	
};