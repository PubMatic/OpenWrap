// NOTE: This file will contains only common code/function used in OW and IDHUB.
// Do not import any other file into it.


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