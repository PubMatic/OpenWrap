var config = require("./conf.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");

var refThis = null;

refThis = this;

exports.getPublisherId = function(){
	return util.trim(config.pwt.pubid) || "0";
};

exports.getTimeout = function(){
	return window.parseInt(config.pwt.t) || 1000;
};

exports.getAdapterRevShare = function(adapterID){
	var adapterConfig = config.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.REV_SHARE)){
		return (1 - window.parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.REV_SHARE])/100);
	}
	return 1;
};

exports.getAdapterThrottle = function(adapterID){
	var adapterConfig = config.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.THROTTLE)){
		return 100 - window.parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.THROTTLE]);
	}
	return 0;
};

exports.getAdapterMaskBidsStatus = function(adapterID){
	var adapterConfig = config.adapters;
	var tempSettings = {
		'audienceNetwork': 1
	};

	if(util.isOwnProperty(tempSettings, adapterID)){
		return tempSettings[adapterID];
	}

	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.MASK_BIDS)){
		return window.parseInt(adapterConfig[adapterID][CONSTANTS.CONFIG.MASK_BIDS]) || 0;
	}
	return 0;
}

exports.getBidPassThroughStatus = function(adapterID){
	var adapterConfig = config.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.BID_PASS_THROUGH)){
		return window.parseInt(adapterConfig[adapterID][CONSTANTS.CONFIG.BID_PASS_THROUGH]);
	}
	return 0;
};

exports.getProfileID = function(){
	return util.trim(config.pwt[CONSTANTS.CONFIG.PROFILE_ID]) || "0";
};

exports.getProfileDisplayVersionID = function(){
	return util.trim(config.pwt[CONSTANTS.CONFIG.PROFILE_VERSION_ID]) || "0";
};

exports.getAnalyticsPixelURL = function(){
	return config.pwt[CONSTANTS.CONFIG.LOGGER_URL] || false;
};

exports.getMonetizationPixelURL = function(){
	return config.pwt[CONSTANTS.CONFIG.TRACKER_URL] || false;
};

exports.forEachAdapter = function(callback){
	util.forEachOnObject(config.adapters, callback);
};

exports.getNumberOfAdapters = function() {
	return Object.keys(config.adapters).length;
};

function addPrebidAdapter(){
	var preBidAdapter = CONSTANTS.COMMON.PARENT_ADAPTER_PREBID;
	if(!util.isOwnProperty(config.adapters, preBidAdapter)){
		var adapterConfig = {};
		adapterConfig[CONSTANTS.CONFIG.REV_SHARE] = "0.0";
		adapterConfig[CONSTANTS.CONFIG.THROTTLE] = "100";
		adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN]	= "_DIV_";
		adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] = {};
		config.adapters[preBidAdapter] = adapterConfig;
	}
}

/* start-test-block */
exports.addPrebidAdapter = addPrebidAdapter;
/* end-test-block */

exports.initConfig = function(){
	refThis.addPrebidAdapter();

	var ignoreAdapterLevelParams = {};
	util.forEachOnObject(CONSTANTS.CONFIG, function(key, value){
		ignoreAdapterLevelParams[value] = "";
	});

	util.forEachOnObject(config.adapters, function(adapterID, adapterConfig){
		var adapterLevelParams = {};
		util.forEachOnObject(adapterConfig, function(key, value){
			if(!util.isOwnProperty(ignoreAdapterLevelParams, key)){
				adapterLevelParams[ key ] = value;
			}
		});
		util.forEachOnObject(adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP], function(kgpv, slotLevelParams){
			util.forEachOnObject(adapterLevelParams, function(key, value){
				slotLevelParams[ key ] = value;
			});
		});
	});
};
