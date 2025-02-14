
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
  USP: { apiName: "__uspapi", complianceName: "usp", prepareConfig: configureUSP },
  GPP: { apiName: "__gpp", complianceName: "gpp", prepareConfig: configureGPP, cmpCommandListner: handleGPP }
};

// Initializes the consent management configuration object.
var ConsentResolverConfig = (function () {
  var instance;

  function createInstance() {
    var conifg = {
      consentManagementEnabled: false,  // This will be used to enable/disable the consent management                       
      processCompleted: false,          // This Flag will use to identify if finding compliance to aplly process is completed.
      cmpPresent: 0,                    // CMP present on the page or not 0 - Not Present, 1 - Present 
      complianceSupport: [],            // CMP's compliance supported,  1: GDPR, 2: USP, 3: GPP
      cmpId: 0,                         // CMP ID: Consent Management Platform Id, default - 0
      enforcedConsentBasisOn: CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE,   // This will be used to enforce the consent basis on Possible values: CMP, GEO, NONE
      readGeoDataFrom: CONSENT_CONSTANTS.READ_GEO_DATA_FROM.NONE,                 // This will be used to identify whether geo info retrieved from Cache or from service: LOCALSTORAGE, GEO_SERVICE, NONE
      geoInfo: {                        // This will be used to store the geo information
        cc: undefined,                  // Country Code Already being passed in the request     
        sc: undefined,                  // State Code
        gc: undefined,                  // Regulation to apply
        gsId: undefined                 // GPP section ID
      },
      geoMatchWithCMP: 2,               // This will be used to identify the geo match with CMP Possible values: 0 - Not Matched,1 - Matched, 2 - Not Concluded(default)
      prebidCMConfig: {}                // This will be used to apply the consentManagement config to the Prebid instance
    };

    return {
      getConsentManagementEnabled: function () {
        return conifg.consentManagementEnabled;
      },
      getProcessCompleted: function () {
        return conifg.processCompleted;
      },
      getComplianceSupport: function () {
        return conifg.complianceSupport;
      },
      getPrebidCMConfig: function () {
        return conifg.prebidCMConfig;
      },
      setConsentManagementEnabled: function (consentManagementEnabled) {
        conifg.consentManagementEnabled = consentManagementEnabled
      },
      setCmpPresent: function (cmpPresent) {
        conifg.cmpPresent = cmpPresent || 0;
      },
      setCmpId: function (cmpId) {
        conifg.cmpId = cmpId || 0;
      },
      setProcessCompleted: function (processCompleted) {
        conifg.processCompleted = processCompleted;
      },
      setEnforcedConsentBasisOn: function (enforcedConsentBasisOn) {
        conifg.enforcedConsentBasisOn = enforcedConsentBasisOn;
      },
      setGeoMatchWithCMP: function () {
        if (conifg.geoInfo.gc && conifg.complianceSupport.length > 0) { // Add this condition as to check if CMP is present and what compliance it support. So that we can compare
          conifg.geoMatchWithCMP = conifg.complianceSupport.includes(conifg.geoInfo.gc) ? 1 : 0;
        }
      },
      setGeoInfo: function (readFrom, geoInfo) {
        conifg.geoInfo = geoInfo;
        conifg.readGeoDataFrom = readFrom;
        this.setGeoMatchWithCMP();
      },
      setPrebidCMConfig: function (key, config) {
        conifg.prebidCMConfig[key] = config;
      },
      setComplianceSupport: function (compliance) {
        conifg.complianceSupport.push(compliance);
      },
      getProperties: function () {
        return {
          ccme: conifg.consentManagementEnabled ? 1 : 0,
          ccmp: conifg.cmpPresent,
          ccmps: conifg.complianceSupport,
          ccmpid: conifg.cmpId,
          csc: conifg.geoInfo.sc,
          cecbo: conifg.enforcedConsentBasisOn,
          crgdf: conifg.readGeoDataFrom,
          cgm: conifg.geoMatchWithCMP
        }
      }
    }
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

var crConfig = ConsentResolverConfig.getInstance();

exports.getInstance = function () {
  return crConfig;
};
commonUtil.getGlobalOwObject().getConsentResolverConfig = function getConsentResolverConfig() {
  return crConfig.getProperties();
};

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
  crConfig.setCmpId(pingReturnData && pingReturnData.cmpId);
}

/**
 * Handle GPP commands
 * @param {Object} pingReturnData - Data returned from the CMP
 * @param {boolean} success - Indicates if the command was successful
 */
function handleGPP(pingReturnData, success) {
  crConfig.setCmpId(pingReturnData && pingReturnData.pingData && pingReturnData.pingData.cmpId);
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
  crConfig.setPrebidCMConfig("gdpr", gdpr);
}

/**
 * Configure USP settings
 */
function configureUSP() {
  crConfig.setPrebidCMConfig("usp", getCmpApiAndTimeout());
}

/**
 * Configure GPP settings
 */
function configureGPP() {
  crConfig.setPrebidCMConfig("gpp", getCmpApiAndTimeout());
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
      if (CMP_APIs.hasOwnProperty(key)) {
        var cmpApi = CMP_APIs[key];
        if (isCMPApiPresent(cmpApi, frame)) {
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
    crConfig.setComplianceSupport(CONSENT_CONSTANTS.COMPLIANCE_MAP[key]);
    if (key === 'GDPR') {
      frame[cmpApi.apiName]('addEventListener', 2, cmpApi.cmpCommandListner);
    } else if (key === 'GPP') {
      frame[cmpApi.apiName]('addEventListener', cmpApi.cmpCommandListner);
    }
    crConfig.setCmpPresent(1);
    setCMPTime(false);
    cmpApi.prepareConfig();
  }

  // Iterate through window frames to find CMPs
  while (currentWindow) {
    try {
      checkCMPInWindow(currentWindow);
    } catch (e) { } // Handle errors silently
    if (currentWindow === window.top) break;
    currentWindow = currentWindow.parent;
  }
}

/**
 * Get the geo information from the service
 */
function getGeoInfoWrapper() {
  timeMetrics.recordEntryTime("GEO_CALLING_TIME", 1500); // Setting default timeout of 1500 ms in case service fails or didn't respond
  commonUtil.getGeoInfo(CONSENT_CONSTANTS.READ_GEO_DATA_FROM, function (readFrom, geoInfo) {
    crConfig.setGeoInfo(readFrom, geoInfo);
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

  if (COMMON_CONFIG.consentManagentEnabled()) {
    crConfig.setConsentManagementEnabled(true);
  } else {
    executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
    return;
  }

  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  getGeoInfoWrapper();
  // Set a timeout for checking CMP presence
  timeoutId = setTimeout(proceedToFallbackExecution, getCMPCheckTimeout());
  checkCmpRecursively();

  function getCMPCheckTimeout() {
    return commonUtil.isNumber(commonUtil.getGlobalOwObject().cmpCheckTimeout)
      ? commonUtil.getGlobalOwObject().cmpCheckTimeout
      : CONSENT_CONSTANTS.DEFAULT_CMP_CHECK_TIMEOUT;
  }

  function executeCallback(enforcedConsentBasisOn) {
    if (!isCallbackExecuted) {
      clearTimeout(timeoutId);
      isCallbackExecuted = true;
      timeMetrics.recordExitTime("CONSENT_CONFIG_RESOLVER_TIME");
      callbackToSetConfig(crConfig.getPrebidCMConfig());
      crConfig.setProcessCompleted(true);
      crConfig.setEnforcedConsentBasisOn(enforcedConsentBasisOn);
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
    if (crConfig.getComplianceSupport().length > 0) {
      crConfig.setGeoMatchWithCMP();
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.CMP);
    } else {
      setTimeout(checkCmpRecursively, 50);
    }
  }
}
exports.getConsentManagementConfig = getConsentManagementConfig;
