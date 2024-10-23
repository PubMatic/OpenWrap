var CONSTANTS = require("./constants.js");
var conf = require("./conf.js");

function getPbNameSpace() {
  return parseInt(conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] || CONSTANTS.CONFIG.DEFAULT_IDENTITY_ONLY)
    ? CONSTANTS.COMMON.IH_NAMESPACE
    : CONSTANTS.COMMON.PREBID_NAMESPACE;
}

exports.getGeoInfo = function() {
	var PREFIX = 'UINFO';
	var LOCATION_INFO_VALIDITY =  172800000; // 2 * 24 * 60 * 60 * 1000 - 2 days
	// var geoDetectionURL = 'https://ut.pubmatic.com/geo?pubid=' +
	var geoDetectionURL = 'https://hbopenbid.pubmatic.com/getgeo?pubid=' +
		conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.PUBLISHER_ID];

	var info = window[getPbNameSpace()].getDataFromLocalStorage(PREFIX, LOCATION_INFO_VALIDITY);
	if(info && JSON.parse(info).cc) {	// Got valid data
		window.PWT.CC = JSON.parse(info);
	} else {
		window[getPbNameSpace()].detectLocation(geoDetectionURL,
		function(loc) {
			window[getPbNameSpace()].setAndStringifyToLocalStorage(PREFIX, loc);
			window.PWT.CC = loc;
		});
	}
}