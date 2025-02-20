
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
    function getConfig() {
      return {
        consentManagementEnabled: false,  // This will be used to enable/disable the consent management                       
        processCompleted: false,          // This Flag will use to identify if finding compliance to aplly process is completed.
        cmpPresent: false,                    // CMP present on the page or not false - Not Present, true - Present 
        complianceSupport: [],            // CMP's compliance supported,  1: GDPR, 2: USP, 3: GPP
        cmpId: 0,                         // CMP ID: Consent Management Platform Id, default - 0
        enforcedConsentBasisOn: CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE,   // This will be used to enforce the consent basis on Possible values: CMP, GEO, NONE
        readGeoDataFrom: CONSENT_CONSTANTS.READ_GEO_DATA_FROM.NONE,                 // This will be used to identify whether geo info retrieved from Cache or from service: LOCALSTORAGE, GEO_SERVICE, NONE
        geoInfo: {                        // This will be used to store the geo information
          cc: undefined,                  // Country Code Already being passed in the request     
          sc: undefined,                  // State Code
          gc: undefined,                  // Regulation to apply,  1: GDPR, 2: USP, 3: GPP
          gsId: undefined                 // GPP section ID
        },
        geoMatchWithCMP: 2,               // This will be used to identify the geo match with CMP Possible values: 0 - Not Matched,1 - Matched, 2 - Not Concluded(default)
        prebidCMConfig: {}                // This will be used to apply the consentManagement config to the Prebid instance
      };
    }

    var config = getConfig();

    return {
      getConsentManagementEnabled: function () {
        return config.consentManagementEnabled;
      },
      getProcessCompleted: function () {
        return config.processCompleted;
      },
      getComplianceSupport: function () {
        return config.complianceSupport;
      },
      getPrebidCMConfig: function () {
        return config.prebidCMConfig;
      },
      setConsentManagementEnabled: function (consentManagementEnabled) {
        config.consentManagementEnabled = consentManagementEnabled
      },
      setCmpPresent: function (cmpPresent) {
        config.cmpPresent = cmpPresent || false;
      },
      setCmpId: function (cmpId) {
        config.cmpId = cmpId || 0;
      },
      setProcessCompleted: function (processCompleted) {
        config.processCompleted = processCompleted;
      },
      setEnforcedConsentBasisOn: function (enforcedConsentBasisOn) {
        config.enforcedConsentBasisOn = enforcedConsentBasisOn;
      },
      setGeoMatchWithCMP: function () {
        if (config.geoInfo.gc && config.complianceSupport.length > 0) { // Add this condition as to check if CMP is present and what compliance it support. So that we can compare
          config.geoMatchWithCMP = config.complianceSupport.includes(config.geoInfo.gc) ? 1 : 0;
        }
      },
      setGeoInfo: function (readFrom, geoInfo) {
        config.geoInfo = geoInfo;
        config.readGeoDataFrom = readFrom;
        this.setGeoMatchWithCMP();
      },
      setPrebidCMConfig: function (key, conf) {
        config.prebidCMConfig[key] = conf;
      },
      setComplianceSupport: function (compliance) {
        config.complianceSupport.push(compliance);
      },
      getProperties: function () {
        return {
          ccme: config.consentManagementEnabled ? 1 : 0,
          ccmp: config.cmpPresent ? 1 : 0,
          ccmps: config.complianceSupport,
          ccmpid: config.cmpId,
          csc: config.geoInfo.sc,
          cecbo: config.enforcedConsentBasisOn,
          crgdf: config.readGeoDataFrom,
          cgm: config.geoMatchWithCMP
        }
      },
      reset: function () {
        config = getConfig(); // Reset the config object
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
  };
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
    crConfig.setCmpPresent(true);
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

function getCMPCheckTimeout() {
  return (commonUtil.getGlobalOwObject() && commonUtil.isNumber(commonUtil.getGlobalOwObject().cmpCheckTimeout))
    ? commonUtil.getGlobalOwObject().cmpCheckTimeout
    : CONSENT_CONSTANTS.DEFAULT_CMP_CHECK_TIMEOUT;
}

/**
 * Get the consent management configuration
 */
function getConsentManagementConfig(callbackToSetConfig) {
  var isCallbackExecuted = false;
  var timeoutId;

  function executeCallback(enforcedConsentBasisOn) {
    if (!isCallbackExecuted) {
      clearTimeout(timeoutId);
      isCallbackExecuted = true;
      timeMetrics.recordExitTime("CONSENT_CONFIG_RESOLVER_TIME");
      callbackToSetConfig(crConfig.getPrebidCMConfig());
      crConfig.setEnforcedConsentBasisOn(enforcedConsentBasisOn);
      crConfig.setProcessCompleted(true);
    }
  }

  function proceedToFallbackExecution() {
    console.log("Resolver: Proceeding to fallback execution");
    setCMPTime(true);           // Record CMP timing metrics

    var consent = null;
    var globalObj = commonUtil.getGlobalOwObject();
    if (!globalObj || !globalObj.CC || !globalObj.CC.gc) {
      console.log("Resolver: No global object or CC configuration found");
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
      return;
    }

    // Get compliance type based on geo location
    var compliance = commonUtil.getKeyByValue(CONSENT_CONSTANTS.COMPLIANCE_MAP, globalObj.CC.gc);
    if (compliance) {
      CMP_APIs[compliance].prepareConfig();                 // Configure consent based on geo location
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.GEO);
    } else {
      console.log("Resolver: No gc configuration found");
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
    }
  }

  function checkCmpRecursively() {
    if (isCallbackExecuted) {
      return;
    }
    checkCMPsPresentOnPage();
    if (crConfig.getComplianceSupport().length > 0) {
      console.log("Resolver: CMP found");
      crConfig.setGeoMatchWithCMP();
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.CMP);
    } else {
      setTimeout(checkCmpRecursively, 50);
    }
  }

  try {
    console.log("Resolver: Initializing configuration");
    timeMetrics.recordEntryTime("CONSENT_CONFIG_RESOLVER_TIME");

    if (!COMMON_CONFIG.consentManagentEnabled()) {
      executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
      return;
    }

    crConfig.setConsentManagementEnabled(true);
    getGeoInfoWrapper();
    timeoutId = setTimeout(proceedToFallbackExecution, getCMPCheckTimeout()); //timeout for checking CMP presence
    checkCmpRecursively();
  } catch (error) {
    console.error("Resolver: Error: ", error);
    executeCallback(CONSENT_CONSTANTS.CONSENT_MANAGEMENT_SOURCE.NONE);
  }
}
exports.getConsentManagementConfig = getConsentManagementConfig;
