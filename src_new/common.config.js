var config = require("./conf.js");
var CONSTANTS = require("./constants.js");
var refThis = this;

exports.getGdprActionTimeout = function() {
	var gdprActionTimeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT];
	return gdprActionTimeout ? window.parseInt(gdprActionTimeout) : 0;
};

exports.isCCPAConsentDenied = function() {
	var retValue = true;
	var consentStr = window.consentData || "";
	if (consentStr === undefined || consentStr.length === 0 || consentStr === '1---' || consentStr === '1NNN' || consentStr === '1YNN')
		retValue = true;
	else if (consentStr === '1YYY' || consentStr === '1YYN')
		retValue = false;
	return retValue;
}

exports.assignAllowActivitiesConfig = function(configs) {
	configs.allowActivities = {
		enrichEids: {
			rules: [{
				condition: refThis.isCCPAConsentDenied,
				allow: false
			}]
		}
	}
}