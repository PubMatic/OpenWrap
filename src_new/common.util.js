var CONSTANTS = require("./constants.js");
var conf = require("./conf.js");

/**
 * Retrieves the global Prebid object, creating it if it doesn't exist. Example: owpbjs
 *
 * @returns {Object} - The global Prebid object from the window namespace.
 */
function getGlobalPbObject() {
	let pbNameSpace = conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.PB_GLOBAL_VAR_NAMESPACE]
		|| (conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] === "1" ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE);

	// Create the global Prebid object if it doesn't exist.
	window[pbNameSpace] = window[pbNameSpace] || {};
	return window[pbNameSpace];
}
exports.getGlobalPbObject = getGlobalPbObject;


/**
 * Retrieves the global OpenWrap object, creating it if it doesn't exist. Example: PWT
 *
 * @returns {Object} - The global OpenWrap object from the window namespace.
 */
function getGlobalOwObject() {
	let owNameSpace = conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.OW_GLOBAL_VAR_NAMESPACE]
		|| (conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] === "1"
			? CONSTANTS.COMMON.IH_OW_NAMESPACE
			: CONSTANTS.COMMON.OPENWRAP_NAMESPACE);

	// Create the global OpenWrap object if it doesn't exist.
	window[owNameSpace] = window[owNameSpace] || {};
	return window[owNameSpace];
}
exports.getGlobalOwObject = getGlobalOwObject;


/**
 * Determines whether an action should be throttled based on a given percentage.
 *
 * @param {number} throttleRate - The percentage rate at which throttling is applied (0-100).
 * @param {number} maxRandomValue - The upper bound for generating a random number (default is 100).
 * @returns {boolean} - Returns true if the action should be throttled, false otherwise.
 */
function shouldThrottle(throttleRate, maxRandomValue) {
	maxRandomValue = maxRandomValue || 100;
	// Determine throttling based on the throttle rate and a random value
	return Math.floor(Math.random() * maxRandomValue) > throttleRate;
};
exports.shouldThrottle = shouldThrottle;

/**
 * Retrieves geographic information, either from local storage or by detecting it via a geo service.
 *
 * @param {Object} readFrom - An object containing possible sources of geo information (e.g., LOCALSTORAGE, GEO_SERVICE).
 * @param {Function} callback - A callback function to execute once the geo information is retrieved.
 */
function getGeoInfo(readFrom, callback) {
	var PREFIX = 'UINFO'; // Prefix used for storing and retrieving geo information in local storage
	var LOCATION_INFO_VALIDITY = 172800000; // Validity period for stored geo information (2 days in milliseconds)

	// Construct the URL for the geo-detection service with the publisher ID from the configuration
	var geoDetectionURL = 'https://ut.pubmatic.com/geo?pubid=' +
		conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.PUBLISHER_ID];

	// Attempt to retrieve geo information from local storage
	var info = getGlobalPbObject().getDataFromLocalStorage(PREFIX, LOCATION_INFO_VALIDITY);

	// Check if valid geo information is found in local storage
	if (info && JSON.parse(info).cc) { // If valid data is present
		// Set the global object with the country code from local storage
		getGlobalOwObject().CC = JSON.parse(info);
		// If a callback is provided, execute it with the source being local storage
		if (callback) callback(readFrom.LOCALSTORAGE);
	} else {
		// If no valid data is found, use the geo-detection service to get the location
		getGlobalPbObject().detectLocation(geoDetectionURL, function (loc, success) {
			// Check if the location was successfully detected
			if (loc && success) {
				// If a callback is provided, execute it with the source being the geo service
				if (callback) callback(readFrom.GEO_SERVICE, loc);

				// Store the detected location in local storage for future use
				getGlobalPbObject().setAndStringifyToLocalStorage(PREFIX, loc);

				// Set the global object with the newly detected location
				getGlobalOwObject().CC = loc;
			}
		});
	}
}
exports.getGeoInfo = getGeoInfo;
