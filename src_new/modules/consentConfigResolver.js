
var commonUtil = require("../common.util.js");
var timeMetrics = require("./timeMetrics.js");
var COMMON_CONFIG = require("../common.config.js");
var CONSTANTS = require("../constants.js");

// Constants for consent management
var CONSENT_CONSTANTS = {
  DEFAULT_CMP_CHECK_TIMEOUT: 500,
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
    NONE: "NONE"
  }
}

// CMP APIs configuration
var CMP_APIs = {
  GDPR: { apiName: "__tcfapi", complianceName: "gdpr", prepareConfig: configureGDPR, cmpCommandListner: handleGDPR },
  USP: { apiName: "__uspapi", complianceName: "usp", prepareConfig: configureUSP},
  GPP: { apiName: "__gpp", complianceName: "gpp", prepareConfig: configureGPP, cmpCommandListner: handleGPP }
};

/** Example of consentResolverConfig object
  consentResolverConfig: {
    "consentManagementEnabled": false, // This will be used to enable/disable the consent management
    loggedDataBy: {                   // This indicates whether the data is logged by tracker or logger for first auction.
      "auction-id" : {
        tracker: false,
        logger: false
      }
    },
    "processCompleted": true,            // This Flag will use to identify if finding compliance to aplly process is completed.
    "cmpPresent": cmpPresent, // ccmp - CMP present or not, default not present i.e. 0
    "complianceSupport": complianceSupport, // ccmps -  CMP supported,  1: GDPR, 2: USP, 3: GPP
    "cmpId": cmpId, // ccmpId -  CMP ID: Standard Consent Management Platform ID, default - 0
    "enforcedConsentBasisOn": "GEO",  // This will be used to enforce the consent basis on Possible values: CMP, GEO, NONE
    "readGeoDataFrom": "LS",// This will be used to identify whether geo info retrieved from Cache or from service: LOCALSTORAGE, GEO_SERVICE, NONE
    "geoInfo": {
      "cc": undefined, // Country Code Already being passed in the request
      "sc": undefined, // State Code
    },    
    geoMatchWithCMP: 0, // This will be used to identify the geo match with CMP Possible values: 0 - Not Matched,1 - Matched, 2 - Not Concluded(default)  
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
*/
var consentResolverConfig = {};

// Get consentResolverConfig object by PWT.getConsentManagementConfig() function
function getConsentResolverConfig() {
  return consentResolverConfig;
}
exports.getConsentResolverConfig = getConsentResolverConfig;
commonUtil.getGlobalOwObject().getConsentResolverConfig = getConsentResolverConfig;

function setLoggedDataBy(auctionId, loggingFor) {
  // If no consent management is enabled then return will not pass anything
  if(!consentResolverConfig.consentManagementEnabled) {
    return;
  }

  var loggedDataBy = consentResolverConfig.loggedDataBy;  
  // Initialize first time at auction Init as we required auction ID
  if(!commonUtil.isEmptyObject(loggedDataBy)) {
    loggedDataBy[auctionId] = {
      tracker: false,
      logger: false
    };
    return;
  }

  // set if same auctionId is present.
  if(loggedDataBy[auctionId]) {
    loggedDataBy[auctionId][loggingFor] = true;
  }
}
exports.setLoggedDataBy = setLoggedDataBy;
commonUtil.getGlobalOwObject().setLoggedDataBy = setLoggedDataBy;

/**
 * Initializes the consent management configuration object.
 */
function initializeCMConfig(consentManagementEnabled) {
  var initialConfig = {
    consentManagementEnabled: consentManagementEnabled,
    loggedDataBy: {},
    processCompleted: false,
    cmpPresent: 0, 
    complianceSupport: [], 
    cmpId: 0,
    enforcedConsentBasisOn: CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE,
    readGeoDataFrom: CONSENT_CONSTANTS.READ_GEO_DATA_FROM.NONE,
    geoInfo: {
      cc: undefined, 
      sc: undefined, 
    },
    geoMatchWithCMP: 2, 
    prebidCMConfig: {}
  };
  consentResolverConfig = Object.assign({}, getConsentResolverConfig(), initialConfig);
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

/**
 * Handle GDPR commands
 * @param {Object} pingReturnData - Data returned from the CMP
 * @param {boolean} success - Indicates if the command was successful
 */
function handleGDPR(pingReturnData, success) {
  if (pingReturnData && pingReturnData.cmpId) {
    getConsentResolverConfig().cmpId = pingReturnData.cmpId;
  }
}

/**
 * Handle GPP commands
 * @param {Object} pingReturnData - Data returned from the CMP
 * @param {boolean} success - Indicates if the command was successful
 */
function handleGPP(pingReturnData, success) {
  if (pingReturnData && pingReturnData.pingData && pingReturnData.pingData.cmpId) {
    getConsentResolverConfig().cmpId = pingReturnData.pingData.cmpId;
  }
}

/**
 * Get CMP API and timeout configuration
 * @returns {Object} - CMP API and timeout configuration
 */
function getCmpApiAndTimeout() {
  return {
    cmpApi: COMMON_CONFIG.getCmpApi(CONSTANTS.CONFIG.CONSENT_MANAGEMENT_CMPAPI),
    timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.CONSENT_MANAGEMENT_TIMEOUT, 1000)
  }
}

/**
 * Configure GDPR settings
 */
function configureGDPR() {
  var gdpr = {
    // allowAuctionWithoutConsent: COMMON_CONFIG.getAwc(), // Auction without consent IMP : Not required now
    defaultGdprScope: true
  }
  Object.assign(gdpr, getCmpApiAndTimeout());
  var gdprActionTimeout = commonUtil.getGlobalOwObject().actionTimeout || undefined;
  if (gdprActionTimeout && commonUtil.isNumber(gdprActionTimeout)) {
    gdpr.actionTimeout = gdprActionTimeout;
  }
  getConsentResolverConfig().prebidCMConfig.gdpr = gdpr;
}

/**
 * Configure USP settings
 */
function configureUSP() {
  getConsentResolverConfig().prebidCMConfig.usp = getCmpApiAndTimeout();
}

/**
 * Configure GPP settings
 */
function configureGPP() {
  getConsentResolverConfig().prebidCMConfig.gpp = getCmpApiAndTimeout();
}

/**
 * Get the CMPs present on the page
 * 
 * @returns Object : CMPs present on the page
 */
function checkCMPsPresentOnPage() {
  var currentWindow = window;

  // Get the CMPs present on the page
  function checkCMPInWindow(frame) {
    for (var key in CMP_APIs) {
      if(CMP_APIs.hasOwnProperty(key)) {
        var cmpApi = CMP_APIs[key];
        if(isCMPApiPresent(cmpApi, frame)) {
          prepareCMPDataAndConfig(cmpApi, key, frame);
        }
      }
      //checkAndExecuteCMP(name, currentWindow);
    }
  }

  // Check if CMP APIs are present in the given frame
  function isCMPApiPresent(cmpApi, frame) {
    return typeof frame[cmpApi.apiName] === 'function' || frame.frames[cmpApi.apiName + "Locator"];
  }

  // Helper function to check for CMP presence and execute commands
  function prepareCMPDataAndConfig(cmpApi, key, frame) {
      var crConfig = getConsentResolverConfig();
      crConfig.complianceSupport.push(CONSENT_CONSTANTS.COMPLIANCE_MAP[key]);
      if (key === 'GDPR') {
        frame[cmpApi.apiName]('addEventListener', 2, cmpApi.cmpCommandListner);
      } else if (key === 'GPP') {
        frame[cmpApi.apiName]('addEventListener', cmpApi.cmpCommandListner);
      }
      crConfig.cmpPresent = 1;
      setCMPTime(false);
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
  
  function setGeoInfo(readFrom, geoInfo) {
    var crConfig = getConsentResolverConfig();
    crConfig.geoInfo.cc = geoInfo.cc;
    crConfig.geoInfo.sc = geoInfo.sc;
    crConfig.readGeoDataFrom = readFrom;
    if(crConfig.complianceSupport.length > 0) { // Add this condition as to check if CMP is present and what compliance it support. So that we can compare
      crConfig.geoMatchWithCMP = crConfig.complianceSupport.includes(geoInfo.gc) ? 1 : 0;
    }
  }  
  commonUtil.getGeoInfo(CONSENT_CONSTANTS.READ_GEO_DATA_FROM, function (readFrom, geoInfo) {
    setGeoInfo(readFrom, geoInfo);
    timeMetrics.recordExitTime("GEO_CALLING_TIME");
  });
}
exports.getGeoInfoWrapper = getGeoInfoWrapper;

/**
 * Get the consent management configuration
 */
function getConsentManagementConfig(callbackToSetConfig) {
  timeMetrics.recordEntryTime("CONSENT_CONFIG_RESOLVER_TIME");
  var isCallbackExecuted = false;
  var timeoutId;

  if (!COMMON_CONFIG.consentManagentEnabled()) {
    initializeCMConfig(false);
    executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
    return;
  }

  initializeCMConfig(true);
  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  getGeoInfoWrapper();
  // Set a timeout for checking CMP presence
  timeoutId = setTimeout(proceedToFallbackExecution, getCMPCheckTimeout());
  checkCmpRecursively();

  function getCMPCheckTimeout(){
    return commonUtil.isNumber(commonUtil.getGlobalOwObject().cmpCheckTimeout)
      ? commonUtil.getGlobalOwObject().cmpCheckTimeout
      : CONSENT_CONSTANTS.DEFAULT_CMP_CHECK_TIMEOUT;
  }

  function executeCallback(enforcedConsentBasisOn) {
    if (!isCallbackExecuted) {
      clearTimeout(timeoutId);
      isCallbackExecuted = true;
      timeMetrics.recordExitTime("CONSENT_CONFIG_RESOLVER_TIME");
      var crConfig = getConsentResolverConfig();
      callbackToSetConfig(crConfig.prebidCMConfig);
      crConfig.processCompleted = true;
      crConfig.enforcedConsentBasisOn = enforcedConsentBasisOn;
    }
  }

  function proceedToFallbackExecution() {
    // Record CMP timing metrics
    setCMPTime(true);

    var consent = null;
    var globalObj = commonUtil.getGlobalOwObject();
    if (!globalObj || !globalObj.CC || !globalObj.CC.gc) {
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
      return;
    }

    try {
      // Get compliance type based on geo location
      var compliance = commonUtil.getKeyByValue(CMP_APIs, globalObj.CC.gc);
      if (compliance) {
        // Configure consent based on geo location
        CMP_APIs[compliance].prepareConfig();
        executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.GEO);
      } else {
        executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
      }
    } catch (error) {
      // Fallback, in case of errors
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
    }
  }

  function checkCmpRecursively() {
    if (isCallbackExecuted) {
      return;
    }
    checkCMPsPresentOnPage();
    if (getConsentResolverConfig().complianceSupport.length > 0) {
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.CMP);
    } else {
      setTimeout(checkCmpRecursively, 50);
    }    
  }
}
exports.getConsentManagementConfig = getConsentManagementConfig;
