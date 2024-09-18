// NOTE: This file will contains only common code/function used in OW and IDHUB.

var config = require("./conf.js");
var CONSTANTS = require("./constants.js");

exports.getGdprActionTimeout = function() {
	var gdprActionTimeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT];
	return gdprActionTimeout ? window.parseInt(gdprActionTimeout) : 0;
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