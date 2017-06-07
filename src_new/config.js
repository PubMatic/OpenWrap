var CONSTANTS = require("./constants.js");
var util = require("./util.js");

exports.config = {
	global: {
		pwt: {
			t: "3000",
			pid: "46",
			gcv: "11",
			pdvid: "4",
			pubid: "9999",
			dataURL: "t.pubmatic.com/wl?",
			winURL: "t.pubmatic.com/wt?"
		},
		adapters: {
			pubmatic: {
				pub_id: "9999",
				rev_share: "0.0",
				timeout: "2000",
				throttle: "100",
				kgp: "_AU_@_W_x_H_:_AUI_",
				sk: "true"
			}
			,prebid: {
				rev_share: "0.0",
				timeout: "2000",
				throttle: "100",
				kgp: "_DIV_",
				klm: {								
				}
			},
			PB_sekindoUM: {
				rev_share: "0.0",
				timeout: "2000",
				throttle: "100",
				kgp: "_DIV_",
				klm: {
					"Div_1": {
						spaceId: 14071
					},
					"Div-2": {
						spaceId: 14071
					}
				}
			},
			PB_appnexus: {
				rev_share: "0.0",
				timeout: "2000",
				throttle: "100",
				kgp: "_DIV_",
				klm: {
					"Div_1": {
						placementId: "8801674"
					},
					"Div-2": {
						placementId: "8801685"
					}
				}
			}
		}
	}
};

// TODO

// remove config references from other code
// remove them from other code parts

exports.getPublisherId = function(){
	return util.trim(this.config.global.pwt.pubid) || "0";
};

exports.getTimeout = function(){
	return parseInt(this.config.global.t) || 1000;
};

exports.getAdapterRevShare = function(adapterID){
	var adapterConfig = this.config.global.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.REV_SHARE)){
		return (1 - parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.REV_SHARE])/100);
	}
	return 1;
};

exports.getAdapterThrottle = function(adapterID){
	var adapterConfig = this.config.global.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.THROTTLE)){
		return 100 - parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.THROTTLE]);
	}
	return 0;
};

exports.getBidPassThroughStatus = function(adapterID){
	var adapterConfig = this.config.global.adapters;
	if(util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.BID_PASS_THROUGH)){
		return parseInt(adapterConfig[adapterID][CONSTANTS.CONFIG.BID_PASS_THROUGH]);
	}
	return 0;
};

exports.getProfileID = function(){
	return util.trim(this.config.global.pwt[CONSTANTS.CONFIG.PROFILE_ID]) || "0";
};

exports.getProfileDisplayVersionID = function(){
	return util.trim(this.config.global.pwt[CONSTANTS.CONFIG.PROFILE_VERSION_ID]) || "0";
};

exports.getAnalyticsPixelURL = function(){
	return this.config.global.pwt[CONSTANTS.CONFIG.LOGGER_URL] || false;
};

exports.getMonetizationPixelURL = function(){
	return this.config.global.pwt[CONSTANTS.CONFIG.TRACKER_URL] || false;
};

exports.forEachAdapter = function(callback){
	util.forEachOnObject(this.config.global.adapters, callback);
};

/*
exports.getAdapterKgp = function(adapterID){
	if(util.isOwnProperty(this.config.global.adapters, adapterID)){
		return this.config.global.adapters[adapterID][CONSTANTS.CONFIG.KEY_GENERATION_PATTERN] || '';
	}
	return '';
};

exports.getAdapterKlm = function(adapterID){
	if(util.isOwnProperty(this.config.global.adapters, adapterID)){
		return this.config.global.adapters[adapterID][CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || {};
	}
	return {};
};
*/