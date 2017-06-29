var config = require("./conf.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");

exports.getPublisherId = function(){
	return util.trim(config.pwt.pubid) || "0";
};

exports.getTimeout = function(){
	return parseInt(config.pwt.t) || 1000;
};

exports.getAdapterRevShare = function(adapterID){
	var adapterConfig = config.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.REV_SHARE)){
		return (1 - parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.REV_SHARE])/100);
	}
	return 1;
};

exports.getAdapterThrottle = function(adapterID){
	var adapterConfig = config.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.THROTTLE)){
		return 100 - parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.THROTTLE]);
	}
	return 0;
};

exports.getBidPassThroughStatus = function(adapterID){
	var adapterConfig = config.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.BID_PASS_THROUGH)){
		return parseInt(adapterConfig[adapterID][CONSTANTS.CONFIG.BID_PASS_THROUGH]);
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

exports.initConfig = function(){
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