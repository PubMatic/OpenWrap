// NOTE: This file will contains only common code/function used in OW and IDHUB.

var config = require("./conf.js");
var CONSTANTS = require("./constants.js");

exports.consentManagentEnabled = function () {
 return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CONSENT_MANAGEMENT_ENABLED] === "1";
}

exports.getCmpApi = function (cmpApi) {
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG[cmpApi]] || "iab";
};

exports.getTimeout = function (timeoutField, defaultTimeout) {
	var timeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG[timeoutField]];
	return timeout ? window.parseInt(timeout) : defaultTimeout;
};

exports.setConsentConfig = function (prebidConfig, key, cmpApi, timeout) {
  prebidConfig = prebidConfig || {};
  if (!prebidConfig["consentManagement"]) {
    prebidConfig["consentManagement"] = {};
  }
  prebidConfig["consentManagement"][key] = {
    cmpApi: cmpApi,
    timeout: timeout
  };
  return prebidConfig;
};