var CONSTANTS = require("./constants.js");
var conf = require("./conf.js");

// This will return global Prebid object
function getGloablPbObject() {
	let pbNameSpace = conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.PB_GLOBAL_VAR_NAMESPACE]
		|| (conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] === "1" ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE);
	window[pbNameSpace] = window[pbNameSpace] || {};
	return window[pbNameSpace];
}
exports.getGloablPbObject = getGloablPbObject;

// This will return global OpenWrap object
function getGlobalOwObject() {
	let owNameSpace = conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.OW_GLOBAL_VAR_NAMESPACE]
		|| (conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] === "1" ? CONSTANTS.COMMON.IH_OW_NAMESPACE : CONSTANTS.COMMON.OPENWRAP_NAMESPACE);
	window[owNameSpace] = window[owNameSpace] || {};
	return window[owNameSpace];
}

exports.getGlobalOwObject = getGlobalOwObject;

// This will return geo Info object but it has dependency on 'geoDetection' module from PrebidJs repo
function getGeoInfo(readFrom, callback) {
	var PREFIX = 'UINFO';
	var LOCATION_INFO_VALIDITY =  172800000; // 2 * 24 * 60 * 60 * 1000 - 2 days
	// var geoDetectionURL pubma= 'https://ut.pubmatic.com/geo?pubid=' +
	var geoDetectionURL = 'https://ut.pubmatic.com/geo?pubid=' +
		conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.PUBLISHER_ID];

	var info = getGloablPbObject().getDataFromLocalStorage(PREFIX, LOCATION_INFO_VALIDITY);
	if(info && JSON.parse(info).cc) {	// Got valid data
		getGlobalOwObject().CC = JSON.parse(info);
		if(callback) callback(readFrom.LOCALSTORAGE);
	} else {
		getGloablPbObject().detectLocation(geoDetectionURL,
		function(loc) {
			if(loc) {
				if(callback) callback(readFrom.GEO_SERVICE, loc);
				getGloablPbObject().setAndStringifyToLocalStorage(PREFIX, loc);
				getGlobalOwObject().CC = loc;
			}
		});
	}
}

exports.getGeoInfo = getGeoInfo;