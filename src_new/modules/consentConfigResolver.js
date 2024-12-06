var COMMON_CONFIG = require("../common.config.js");
var CONSTANTS = require("../constants.js");
var commonUtil = require("../common.util.js");

var CONSENT_MANAGEMENT_SOURCE = {
  CMP: "CMP",
  GEO: "GEO",
  NONE: "NONE"
};

var READ_GEO_DATA_FROM = {
  LOCALSTORAGE: "LS",
  GEO_SERVICE: "GS",
  NONE: "NONE"
};

var CMP_APIs = {
  GDPR: { apiName: "__tcfapi", getConfig: getGDPRConfig, complianceName: "gdpr" },
  USP: { apiName: "__uspapi", getConfig: getUSPConfig, complianceName: "usp" },
  GPP: { apiName: "__gpp", getConfig: getGPPConfig, complianceName: "gpp" }
};

// Phase 1.5

// let a = {
//   cmd: {
//     cmpp: 1,
//     gst: 200,
//     cc: "US",
//     sc: "CA",
//     cmps: [{
//       vid: 15,
//       s: 1,  // 1: GDPR, 2: USP, 3: GPP
//       t: 1000,
//     },
//     {
//       vid: 15,
//       s: 2,
//       t: 1000,
//     },
//     {
//       vid: 15,
//       s: 3,
//       t: 1000,
//     }]
//   }
// }

/** Example of cmConfig object
  window.PWT = {
    cmConfig: {
      "cmProcessDone": true,            // This Flag will use to resume the CMP execution
      "enforcedConsentBasisOn": "GEO",  // This will be used to enforce the consent basis on Possible values: CMP, GEO, NONE
      "readGeoDataFrom": "LS",// This will be used to identify whether geo info retrieved from Cache or from service: LOCALSTORAGE, GEO_SERVICE, NONE
      "metrics": {
        timeTakenByGeoService: 0,       // Time taken by the Geo service to find out what compliance to enforce
        timeTakenByCMP: 0,              // Time taken to find out the CMP's presence
        timeout: 2000,                  // Given time, to find out what compliance to enforce
      },
      "prebidCMConfig": {               // This will be used to apply the consentManagement config to the Prebid instance
          "gdpr": {
              "cmpApi": "iab",
              "timeout": 10000,
              "defaultGdprScope": true
          },
          "usp": {
              "cmpApi": "iab",
              "timeout": 10000
          },
          "gpp": {
              "cmpApi": "iab",
              "timeout": 10000
          }
      }
    }
  }
 */

function initializeCMConfig() {
   // Initializing the cmConfig object
  commonUtil.getGlobalOwObject().cmConfig = { 
    cmProcessDone: false, 
    enforcedConsentBasisOn: CONSENT_MANAGEMENT_SOURCE.NONE,
    readGeoDataFrom: READ_GEO_DATA_FROM.NONE, 
    metrics: {
      timeTakenByGeoService: null,       
      timeTakenByCMP: null,              
      timeout: 2000,                  
    },
    prebidCMConfig: {}
  };
}

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


function getGeoInfoWrapper() {
  let startTime = new Date().getTime();
  commonUtil.getGeoInfo(READ_GEO_DATA_FROM, function(readFrom) {
    commonUtil.getGlobalOwObject().cmConfig.metrics.timeTakenByGeoService = new Date().getTime() - startTime;
    commonUtil.getGlobalOwObject().cmConfig.readGeoDataFrom = readFrom;
  });
}

function getConsentManagementConfig(callback) {
  initializeCMConfig();
  var isCallbackExecuted = false;
  var cmpTime = 0;
  
  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  getGeoInfoWrapper();

  function executeCallback(enforcedConsentBasisOn, config) {
    commonUtil.getGlobalOwObject().cmConfig.enforcedConsentBasisOn = enforcedConsentBasisOn;
    commonUtil.getGlobalOwObject().cmConfig.prebidCMConfig = config;
    if (!isCallbackExecuted) {
      isCallbackExecuted = true;
      callback(config);
      commonUtil.getGlobalOwObject().cmConfig.cmProcessDone = true;
    }
  }

  // Timeout added till the time we check for CMP is loaded or to be loaded
  var timeoutId = setTimeout(function () {
    // Once timed out, check for geo location has regulation to apply
    if (commonUtil.getGlobalOwObject().CC && commonUtil.getGlobalOwObject().CC.compliance) { // This will set by the Util.getGeoInfo
      executeCallback(CONSENT_MANAGEMENT_SOURCE.GEO, CMP_APIs[commonUtil.getGlobalOwObject().CC.compliance].getConfig());
    } else {
      executeCallback(CONSENT_MANAGEMENT_SOURCE.NONE, null);
    }
  }, 2000);  //TODO: Finalize the timeout ? user specified or we can decide? configurable?


  function checkCmpRecursively() {
    if (isCallbackExecuted) {
      clearTimeout(timeoutId);
      return;
    }

    var cmpsFound = getCMPsPresentOnPage();
    if (anyCMPPresent(cmpsFound)) {
      clearTimeout(timeoutId);
      commonUtil.getGlobalOwObject().cmConfig.metrics.timeTakenByCMP = new Date().getTime() - cmpTime;
      executeCallback(CONSENT_MANAGEMENT_SOURCE.CMP, cmpsFound);
    } else {
      setTimeout(checkCmpRecursively, 100);
    }
  }
  //CMP check recursively
  cmpTime = new Date().getTime();
  checkCmpRecursively();
}

exports.getConsentManagementConfig = getConsentManagementConfig;



