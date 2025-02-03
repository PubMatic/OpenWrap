
var commonUtil = require("../common.util.js");
var util = require("../util.js");
var timeMetrics = require("./timeMetrics.js");
var COMMON_CONFIG = require("../common.config.js");
var CONSTANTS = require("../constants.js");

var CONSENT_CONSTANTS = {
  CMP_CHECK_TIMEOUT: 1500,
  CONSENT_MANAGEMENT_SOURCE: {
    CMP: "CMP",
    GEO: "GEO",
    NONE: "NONE"
  },
  COMPLIANCE_MAP: {
    GDPR: 1,
    USP: 2,
    GPP: 3
  },
  READ_GEO_DATA_FROM: {
    LOCALSTORAGE: "LS",
    GEO_SERVICE: "GS",
    NONE
  }
}

var CMP_APIs = {
  GDPR: { apiName: "__tcfapi", complianceName: "gdpr", prepareConfig: configureGDPR, cmpCommandListner: handleGDPR },
  USP: { apiName: "__uspapi", complianceName: "usp", prepareConfig: configureUSP},
  GPP: { apiName: "__gpp", complianceName: "gpp", prepareConfig: configureGPP, cmpCommandListner: handleGPP }
};

/**
 * Get the consent management configuration object
 * @returns Object : Consent management configuration object ie. window.PWT.cmConfig
 */
function getCMConfigObject() {
  commonUtil.getGlobalOwObject().cmConfig = commonUtil.getGlobalOwObject().cmConfig || {};
  return commonUtil.getGlobalOwObject().cmConfig;
}
exports.getCMConfigObject = getCMConfigObject;


/** Example of cmConfig object
  window.PWT = {
    cmConfig: {
      "allStatsAvailable": allStatsAvailable,
      "cmProcessDone": true,            // This Flag will use to resume the CMP execution
      "cmpPresent": cmpPresent, // ccmp - CMP present or not, default not present i.e. 0
      "complianceSupport": complianceSupport, // ccmps -  CMP supported,  1: GDPR, 2: USP, 3: GPP
      "cmpId": cmpId, // ccmpId -  CMP ID: Standard Consent Management Platform ID, default - 0
      "enforcedConsentBasisOn": "GEO",  // This will be used to enforce the consent basis on Possible values: CMP, GEO, NONE
      "readGeoDataFrom": "LS",// This will be used to identify whether geo info retrieved from Cache or from service: LOCALSTORAGE, GEO_SERVICE, NONE
      "geoInfo": {
        "cc": undefined, // Country Code Already being passed in the request
        "sc": undefined, // State Code
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



/**
 * Initializes the consent management configuration object.
 */
function initializeCMConfig(allStatsAvailable, cmpPresent, complianceSupport, cmpId) {
  var initialConfig = {
    allStatsAvailable: allStatsAvailable,
    cmProcessDone: false,
    cmpPresent: cmpPresent, 
    complianceSupport: complianceSupport, 
    cmpId: cmpId,
    enforcedConsentBasisOn: CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE,
    readGeoDataFrom: CONSENT_CONSTANTS.READ_GEO_DATA_FROM.NONE,
    geoInfo: {
      cc: undefined, 
      sc: undefined, 
    },
    prebidCMConfig: {}
  };
  commonUtil.getGlobalOwObject().cmConfig = Object.assign({}, getCMConfigObject(), initialConfig);
}

/**
 * Set the time taken by CMP to load
 * @param {*} timeExceeded : If time exceeded then set the default timeout value
 */
function setCMPTime(timeExceeded) {
  // If time taken by CMP is not set then set the default timeout value
  if (!commonUtil.getGlobalOwObject().getDurationOf("CMP_CALLING_TIME")) {
    timeMetrics.recordExitTime("CMP_CALLING_TIME", timeExceeded ? 1500 : null);
  }
}

function handleGDPR(pingReturnData, success) {
  if (pingReturnData && pingReturnData.cmpId) {
    getCMConfigObject().cmpId = pingReturnData.cmpId;
  }
}

function handleGPP(pingReturnData, success) {
  if (pingReturnData && pingReturnData.pingData && pingReturnData.pingData.cmpId) {
    getCMConfigObject().cmpId = pingReturnData.pingData.cmpId;
  }
}

function configureGDPR() {
  var gdpr = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.GDPR_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GDPR_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT),
    // allowAuctionWithoutConsent: COMMON_CONFIG.getAwc(), // Auction without consent IMP : Not required now
    defaultGdprScope: true
  };
  var gdprActionTimeout = COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT, 0);
  if (gdprActionTimeout) {
    util.log("GDPR IS ENABLED, TIMEOUT: " + gdpr.timeout + ", ACTION TIMEOUT: " + gdprActionTimeout);
    gdpr.actionTimeout = gdprActionTimeout;
  }
  getCMConfigObject().prebidCMConfig.gdpr = gdpr;
}

function configureUSP() {
  var usp = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.CCPA_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.CCPA_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT),
  };
  getCMConfigObject().prebidCMConfig.usp = usp;
}

function configureGPP() {
  var gpp = {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.GPP_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.GPP_TIMEOUT, CONSTANTS.CONFIG.DEFAULT_GPP_TIMEOUT),
  };
  getCMConfigObject().prebidCMConfig.gpp = gpp;
}

/**
 * Get the CMPs present on the page
 * 
 * @returns Object : CMPs present on the page
 */
function checkCMPsPresentOnPage() {
  var currentWindow = window;
  var cmConfig = getCMConfigObject();

  function checkCMPInWindow(frame) {
    for (var name in CMP_APIs) {
      if(CMP_APIs.hasOwnProperty(name)) {
        var cmpApi = CMP_APIs[name];
        if(isCMPApiPresent(cmpApi, frame)) {
          executeCMPCommands(cmpApi, name, frame);
        }
      }
      //checkAndExecuteCMP(name, currentWindow);
    }
  }

  function isCMPApiPresent(cmpApi, frame) {
    return typeof frame[cmpApi.apiName] === 'function' || frame.frames[cmpApi.apiName + "Locator"];
  }

  // Helper function to check for CMP presence and execute commands
  function executeCMPCommands(cmpApi, name, frame) {
      if (name === 'GDPR') {
        frame[cmpApi.apiName]('addEventListener', 2, cmpApi.cmpCommandListner);
      } else if (name === 'GPP') {
        frame[cmpApi.apiName]('addEventListener', cmpApi.cmpCommandListner);
      }
      cmConfig.cmpPresent = 1;
      setCMPTime(false);
      cmConfig.complianceSupport.push(CONSENT_CONSTANTS.COMPLIANCE_MAP[name]);
      cmpApi.prepareConfig();
  }

  // Iterate through window frames to find CMPs
  while (currentWindow) {
    try {
      checkCMPInWindow(currentWindow);
    } catch (e) {} // Handle errors silently

    if (currentWindow === window.top) break;
    currentWindow = currentWindow.parent;
  }
}

/**
 * Get the geo information from the service
 */
function getGeoInfoWrapper() {
  timeMetrics.recordEntryTime("GEO_CALLING_TIME", 1500); // Setting default timeout of 1500 ms in case service fails or didn't respond
  commonUtil.getGeoInfo(CONSENT_CONSTANTS.READ_GEO_DATA_FROM, function (readFrom, uInfo) {
    getCMConfigObject().geoInfo.cc = uInfo.cc;
    getCMConfigObject().geoInfo.sc = uInfo.sc;
    timeMetrics.recordExitTime("GEO_CALLING_TIME");
  });
}
exports.getGeoInfoWrapper = getGeoInfoWrapper;

/**
 * Get the consent management configuration
 */
function getConsentManagementConfig() {
  initializeCMConfig(true, 0, [], 0);
  var isCallbackExecuted = false;
  var timeoutId;
  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  getGeoInfoWrapper();

  function executeCallback(enforcedConsentBasisOn) {
    var cmConfig = getCMConfigObject();
    cmConfig.enforcedConsentBasisOn = enforcedConsentBasisOn;
    if (!isCallbackExecuted) {
      isCallbackExecuted = true;
      callback(cmConfig.prebidCMConfig);
      cmConfig.cmProcessDone = true;
    }
  }

  // Handle CMP check timeout
  function handleCMPCheckTimeout() {
    isCallbackExecuted = true;
    clearTimeout(timeoutId);
    setCMPTime(true);
    // Once timed out, check for geo location has regulation to apply
    var globalObj = commonUtil.getGlobalOwObject();
    if (globalObj.CC && globalObj.CC.compliance) { // This will set by the Util.getGeoInfo
      CMP_APIs[globalObj.CC.compliance].prepareConfig();
      executeCallback(CONSENT_MANAGEMENT_SOURCE.GEO);
    } else {
      executeCallback(CONSENT_MANAGEMENT_SOURCE.NONE);
    }
  }
  // Set a timeout for checking CMP presence
  timeoutId = setTimeout(handleCMPCheckTimeout, CONSENT_CONSTANTS.CMP_CHECK_TIMEOUT);

  function checkCmpRecursively() {
    try {
      if (isCallbackExecuted) {
        clearTimeout(timeoutId);
        return;
      }
      checkCMPsPresentOnPage();
      if (getCMConfigObject().complianceSupport.length > 0) {
        clearTimeout(timeoutId);
        executeCallback(CONSENT_MANAGEMENT_SOURCE.CMP);
      } else {
        setTimeout(checkCmpRecursively, 50);
      }
    } catch (error) {
      clearTimeout(timeoutId);
    }
  }
  checkCmpRecursively();
}
exports.getConsentManagementConfig = getConsentManagementConfig;
