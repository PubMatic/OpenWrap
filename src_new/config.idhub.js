var config = require("./conf.js");
var CONSTANTS = require("./constants.js");

// needed
exports.getGdpr = function () {
	var gdpr = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] || CONSTANTS.CONFIG.DEFAULT_GDPR_CONSENT;
	return gdpr === "1";
};

// needed
exports.getCmpApi = function () {
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CMPAPI] || CONSTANTS.CONFIG.DEFAULT_GDPR_CMPAPI;
};

// needed
exports.getGdprTimeout = function() {
	var gdprTimeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_TIMEOUT];
	return gdprTimeout ? window.parseInt(gdprTimeout) : CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT;
};

// needed
exports.getAwc = function () {
	var awc = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_AWC] || CONSTANTS.CONFIG.DEFAULT_GDPR_AWC;
	return awc === "1" ;
};

// needed
exports.isUserIdModuleEnabled = function(){
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID] || CONSTANTS.CONFIG.DEFAULT_USER_ID_MODULE);
};

// needed
exports.getIdentityPartners = function(){
	return config[CONSTANTS.COMMON.IDENTITY_PARTNERS];
};

// needed
exports.isIdentityOnly = function(){
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY]|| CONSTANTS.CONFIG.DEFAULT_IDENTITY_ONLY);
};

// needed
exports.getIdentityConsumers = function(){
	return (config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS] || "").toLowerCase();
};

// needed
exports.getCCPA = function () {
	var ccpa = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] || CONSTANTS.CONFIG.DEFAULT_CCPA_CONSENT;
	return ccpa === "1";
};

// needed
exports.getCCPACmpApi = function () {
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CMPAPI] || CONSTANTS.CONFIG.DEFAULT_CCPA_CMPAPI;
};

// needed
exports.getCCPATimeout = function() {
	var ccpaTimeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_TIMEOUT];
	return ccpaTimeout ? window.parseInt(ccpaTimeout) : CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT;
};

exports.getProfileID = function () {
	return util.trim(config.pwt[CONSTANTS.CONFIG.PROFILE_ID]) || "0";
};

exports.getProfileDisplayVersionID = function () {
	return util.trim(config.pwt[CONSTANTS.CONFIG.PROFILE_VERSION_ID]) || "0";
};

exports.PBJS_NAMESPACE = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.PBJS_NAMESPACE] || "pbjs";