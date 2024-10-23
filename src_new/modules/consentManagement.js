var COMMON_CONFIG = require("../common.config.js");
var CONSTANTS = require("../constants.js");
var commonUtil = require("../common.util.js");

var CONSENT_MANAGEMENT_SOURCE = {
  CMP: "CMP",
  GEO: "GEO",
  NONE: "NONE"
};

window.PWT = window.PWT || {}; 
window.PWT.cmConfig = { 
  cmProcessDone: false, // This Flag will use to resume the CMP execution
  enforcedConsentBasisOn: CONSENT_MANAGEMENT_SOURCE.NONE, // This will be used to enforce the consent basis on Possible values: CMP, GEO, NONE
  // cmpSupport: {         // This will store the CMP support status which can be use for logging purpose
  //   gdpr: {
  //     found: 0,
  //   },
  //   usp: {
  //     found: 0,
  //   },
  //   gpp:{
  //     found: 0,
  //   }
  // },
  prebidCMConfig: {}
};

var CMP_APIs = {
  GDPR: { apiName: "__tcfapi", getConfig: getGDPRConfig, complianceName: "gdpr" },
  USP: { apiName: "__uspapi", getConfig: getUSPConfig, complianceName: "usp" },
  GPP: { apiName: "__gpp", getConfig: getGPPConfig, complianceName: "gpp" }
};

function getGDPRConfig() {
  var conf = {};
  conf.gdpr = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.GDPR_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GDPR_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT),
    // allowAuctionWithoutConsent: COMMON_CONFIG.getAwc(), // Auction without consent IMP : Not required now
    defaultGdprScope: true
  };
  var gdprActionTimeout = COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT, 0);
  if (gdprActionTimeout) {
    util.log("GDPR IS ENABLED, TIMEOUT: " + conf['gdpr']['timeout'] + ", ACTION TIMEOUT: " + gdprActionTimeout);
    conf.gdpr.actionTimeout = gdprActionTimeout;
  }
  return conf;
}

function getUSPConfig() {
  var conf = {};
  conf.usp = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.CCPA_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.CCPA_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT),
  };
  return conf;
}

function getGPPConfig() {
  var conf = {};
  conf.gpp = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.GPP_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GPP_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_GPP_TIMEOUT),
  };
  return conf;
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
          //cmps[name] = 1;
          cmps = Object.assign(cmps, CMP_APIs[name].getConfig());
        }
      }
    } catch (e) {
    }

    if (f === window.top) break;
    f = f.parent;
  }
  return cmps;
}

// function setConsentManagementConfigToPWT(config) {
//   // This Will prepare Config and set it to the PWT.consentManagementConfig for logging purpose
//   window.PWT.consentManagementConfig = config; // Setting to PWT for visibility
// }


function anyCMPPresent(cmpsFound) {
  return Object.keys(cmpsFound).length > 0;
}

function getConsentManagementConfig(callback) {
  var isCallbackExecuted = false;
  
  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  commonUtil.getGeoInfo();

  function executeCallback(enforcedConsentBasisOn, config) {
    window.PWT.cmConfig.enforcedConsentBasisOn = enforcedConsentBasisOn;
    window.PWT.cmConfig.prebidCMConfig = config;
    if (!isCallbackExecuted) {
      isCallbackExecuted = true;
      callback(config);
      window.PWT.cmConfig.cmProcessDone = true;
    }
  }

  // Timeout added till the time we check for CMP is loaded or to be loaded
  var timeoutId = setTimeout(function () {
    // Once timed out, check for geo location has regulation to apply
    if (window.PWT.CC && window.PWT.CC.compliance) { // This will set by the Util.getGeoInfo
      executeCallback(CONSENT_MANAGEMENT_SOURCE.GEO, CMP_APIs[window.PWT.CC.compliance].getConfig());
    } else {
      executeCallback(CONSENT_MANAGEMENT_SOURCE.NONE, null);
    }
  }, 2000);

  function checkCmpRecursively() {
    if (isCallbackExecuted) {
      clearTimeout(timeoutId);
      return;
    }

    var cmpsFound = getCMPsPresentOnPage();
    if (anyCMPPresent(cmpsFound)) {
      clearTimeout(timeoutId);
      executeCallback(CONSENT_MANAGEMENT_SOURCE.CMP, cmpsFound);
    } else {
      setTimeout(checkCmpRecursively, 1000);
    }
  }
  //CMP check recursively
  checkCmpRecursively();
}

exports.getConsentManagementConfig = getConsentManagementConfig;



