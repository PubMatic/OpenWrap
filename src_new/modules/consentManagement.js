var COMMON_CONFIG = require("../common.config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");

var cmpConsentManagementConf = {}

window.PWT = window.PWT || {};
var CMP_APIs = {
  GDPR: { apiName: "__tcfapi", setConfig: setGDPRConfig },
  CCPA: { apiName: "__uspapi", setConfig: setCCPAConfig },
  GPP: { apiName: "__gpp", setConfig: setGPPConfig }
};

function setGDPRConfig() {
  cmpConsentManagementConf.gdpr = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.GDPR_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GDPR_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT),
    // allowAuctionWithoutConsent: COMMON_CONFIG.getAwc(), // Auction without consent IMP : Not required now
    defaultGdprScope: true
  };
  var gdprActionTimeout = COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT, 0);
  if (gdprActionTimeout) {
    util.log("GDPR IS ENABLED, TIMEOUT: " + cmpConsentManagementConf['gdpr']['timeout'] + ", ACTION TIMEOUT: " + gdprActionTimeout);
    cmpConsentManagementConf.gdpr.actionTimeout = gdprActionTimeout;
  }
}

function setCCPAConfig() {
  cmpConsentManagementConf.usp = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.CCPA_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.CCPA_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT),
  };
}

function setGPPConfig() {
  cmpConsentManagementConf.gpp = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.GPP_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GPP_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_GPP_TIMEOUT),
  };
}

// var PREFIX = 'UINFO';
// var LOCATION_INFO_VALIDITY = 172800000; // 2 * 24 * 60 * 60 * 1000 - 2 days
// var GEO_URL = 'https://ut.pubmatic.com/geo?pubid=';

// function getPbNameSpace() {
//   return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] || CONSTANTS.CONFIG.DEFAULT_IDENTITY_ONLY) ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE;
// }

// function consentManagementConfigEnabled() {
//   return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CONSENT_MANAGEMENT_ENABLED] == "1";
// }

// function getGeoInfo(callback) {
//   var pbNameSpace = getPbNameSpace();
//   var geoDetectionURL = GEO_URL + config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.PUBLISHER_ID];
//   var info = window[pbNameSpace].getDataFromLocalStorage(PREFIX, LOCATION_INFO_VALIDITY);
//   if (info && JSON.parse(info).cc) {	// Got valid data
//     callback(JSON.parse(info));
//   } else {
//     window[pbNameSpace].detectLocation(geoDetectionURL, function (loc) {
//       window[pbNameSpace].setAndStringifyToLocalStorage(PREFIX, loc);
//       callback(loc);
//     });
//   }
// }

// function setUserInfo(info) {
//   window.PWT.CC = info;
// }

function getCMPsPresentOnPage() {
  var cmps = {};
  var f = window;
  while (f) {
    try {
      for (var name in CMP_APIs) {
        if (!cmps[name] && (typeof f[CMP_APIs[name].apiName] === 'function' || f.frames[CMP_APIs[name].apiName + "Locator"])) {
          cmps[name] = 1;
          CMP_APIs[name].setConfig();
        }
      }
    } catch (e) {
    }

    if (f === window.top) break;
    f = f.parent;
  }
  return cmps;
}

function setConsentManagementConfigToPWT(config) {
  // This Will prepare Config and set it to the PWT.consentManagementConfig for logging purpose
  window.PWT.consentManagementConfig = config; // Setting to PWT for visibility
}

function setFallbackIfPresent() {
  if (window.PWT.CC && window.PWT.CC.compliance) { // This will set by the Util.getGeoInfo
    CMP_APIs[window.PWT.CC.compliance].setConfig();
  }
}

function anyCMPPresent() {
  return Object.keys(cmpConsentManagementConf).length > 0;
}

function getConsentManagementConfig(callback) {
  var isCallbackExecuted = false;
  // Calling geo info to get the country code and compliance Information
  util.getGeoInfo();

  function executeCallback() {
    if (!isCallbackExecuted) {
      isCallbackExecuted = true;
      setConsentManagementConfigToPWT(cmpConsentManagementConf);
      callback(cmpConsentManagementConf);
    }
  }

  // Timeout added till the time we check for CMP is loaded or to be loaded
  var timeoutId = setTimeout(function () {
    setFallbackIfPresent();
    executeCallback();
  }, 2000);

  function checkCmpRecursively() {
    if (isCallbackExecuted) {
      clearTimeout(timeoutId);
      return;
    }

    getCMPsPresentOnPage();
    if (anyCMPPresent()) {
      executeCallback();
    } else {
      setTimeout(checkCmpRecursively, 1000);
    }
  }
  //CMP check recursively
  checkCmpRecursively();
}

exports.getConsentManagementConfig = getConsentManagementConfig;



