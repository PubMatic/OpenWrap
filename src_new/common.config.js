// NOTE: This file will contains only common code/function used in OW and IDHUB.

var config = require("./conf.js");
var CONSTANTS = require("./constants.js");

exports.consentManagementEnabled = function () {
  return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CONSENT_MANAGEMENT_ENABLED] === "1";
}

exports.getCmpApi = function (cmpApi) {
	return config[CONSTANTS.CONFIG.COMMON][cmpApi] || "iab";
};

exports.getTimeout = function (timeoutField, defaultTimeout) {
	var timeout = config[CONSTANTS.CONFIG.COMMON][timeoutField];
	return timeout ? window.parseInt(timeout) : defaultTimeout;
};

// needed
exports.isUserIdModuleEnabled = function(){
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID] || CONSTANTS.CONFIG.DEFAULT_USER_ID_MODULE);
};
exports.isIdentityOnly = function () {
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] || CONSTANTS.CONFIG.DEFAULT_IDENTITY_ONLY);
};


