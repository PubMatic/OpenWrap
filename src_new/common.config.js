var config = require("./conf.js");
var CONSTANTS = require("./constants.js");

exports.getGdprActionTimeout = function() {
	var gdprActionTimeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT];
	return gdprActionTimeout ? window.parseInt(gdprActionTimeout) : 0;
};