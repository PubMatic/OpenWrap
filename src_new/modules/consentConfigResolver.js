/**
 * Consent Configuration Resolver Module
 * Refactored into multiple components for better maintainability and scalability
 */

// Dependencies
var commonUtil = require("../common.util.js");
var timeMetrics = require("./timeMetrics.js");
var COMMON_CONFIG = require("../common.config.js");
var CONSTANTS = require("../constants.js");
var prebid = require("../adapters/prebid.js");

// ===========================================
// Constants Module
// ===========================================
var ConsentConstants = {
  DEFAULT_CMP_LOOK_UP_TIMEOUT: 1000,
  CONTINUOUS_CMP_CHECK_TIMEOUT: 15000,
  CONSENT_MANAGEMENT_SOURCE: {    // 1 -> CMP, 2 -> GEO, 0 -> NONE
    CMP: 1,
    GEO: 2,
    NONE: 0
  },
  COMPLIANCE_MAP: {
    GDPR: 1,
    USP: 2,
    GPP: 3
  },
  READ_GEO_DATA_FROM: {          // 1 -> LOCALSTORAGE, 2 -> GEO_SERVICE, 0 -> NONE
    LOCALSTORAGE: 1,
    GEO_SERVICE: 2,
    NONE: 0
  }
};

// ===========================================
// Configuration Manager Module
// ===========================================
var ConsentConfigManager = (function () {
  var instance;

  function createInstance() {
    function getConfig() {
      return {
        consentManagementEnabled: false,  // This will be used to enable/disable the consent management                       
        processCompleted: false,          // This Flag will use to identify if finding compliance to apply process is completed.
        cmpPresent: false,                // CMP present on the page or not false - Not Present, true - Present 
        complianceSupport: [],            // CMP's compliance supported,  1: GDPR, 2: USP, 3: GPP
        cmpId: 0,                         // CMP ID: Consent Management Platform Id, default - 0
        enforcedConsentBasisOn: ConsentConstants.CONSENT_MANAGEMENT_SOURCE.NONE,   // This will be used to enforce the consent basis on Possible values: 1 (CMP), 2 (GEO), 0 (NONE)
        readGeoDataFrom: ConsentConstants.READ_GEO_DATA_FROM.NONE,                 // This will be used to identify the source of geo data read from Possible values: 1 (LOCALSTORAGE), 2 (GEO_SERVICE), 0 (NONE)
        geoInfo: {                        // This will be used to store the geo information
          cc: undefined,                  // Country Code Already being passed in the request     
          sc: undefined,                  // State Code
          gc: undefined,                  // Regulation to apply,  1: GDPR, 2: USP, 3: GPP
          gsId: undefined                 // GPP section ID
        },
        geoMatchWithCMP: 2,               // This will be used to identify the geo match with CMP Possible values: 0 - Not Matched,1 - Matched, 2 - Not Concluded(default)
        prebidCMConfig: {},               // This will be used to apply the consentManagement config to the Prebid instance
        callbackFunctions: [],            // Functions to be called after the process is completed
        continuousCmpCheck: {
          enabled: false,         // Continuous CMP checking enabled
          timeout: ConsentConstants.CONTINUOUS_CMP_CHECK_TIMEOUT,         // Continuous CMP checking timeout         
          startTime: 0            // Continuous CMP checking start time
        }
      };
    }
    var config = getConfig();

    return {
      getConsentManagementEnabled: function () {
        return config.consentManagementEnabled;
      },
      getProcessCompleted: function (callbackFn) {
        if (config.processCompleted) {
          callbackFn();
          return;
        }
        if (commonUtil.isFunction(callbackFn))
          config.callbackFunctions.push(callbackFn);
      },
      getComplianceSupport: function () {
        return config.complianceSupport;
      },
      getPrebidCMConfig: function () {
        return config.prebidCMConfig;
      },
      setConsentManagementEnabled: function (consentManagementEnabled) {
        config.consentManagementEnabled = consentManagementEnabled;
      },
      setCmpPresent: function (cmpPresent) {
        config.cmpPresent = cmpPresent;
      },
      setProcessCompleted: function (processCompleted) {
        config.processCompleted = processCompleted;
        if (processCompleted) {
          this.executeCallbackFunctions();
        }
      },
      executeCallbackFunctions: function () {
        while (config.callbackFunctions.length > 0) {
          var fn = config.callbackFunctions.shift();
          if (commonUtil.isFunction(fn)) {
            fn();
          }
        }
      },
      setCmpId: function (cmpId) {
        config.cmpId = cmpId;
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
      resetPrebidCMConfig: function () {
        config.prebidCMConfig = {};
      },
      setPrebidCMConfig: function (key, conf) {
        config.prebidCMConfig[key] = conf;
      },
      setComplianceSupport: function (compliance) {
        if(!config.complianceSupport.includes(compliance)) {
          config.complianceSupport.push(compliance);
        }
      },
      getContinuousCmpCheckEnabled: function () {
        return config.continuousCmpCheck.enabled;
      },
      setContinuousCmpCheckEnabled: function (enabled) {
        config.continuousCmpCheck.enabled = enabled;
      },
      getContinuousCmpCheckTimeout: function () {
        return config.continuousCmpCheck.timeout;
      },
      getContinuousCmpCheckStartTime: function () {
        return config.continuousCmpCheck.startTime;
      },
      setContinuousCmpCheckStartTime: function (time) {
        config.continuousCmpCheck.startTime = time;
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
          cgm: config.geoMatchWithCMP,
          cccce: config.continuousCmpCheck.enabled,
          cccct: config.continuousCmpCheck.timeout,
          ccccst: config.continuousCmpCheck.startTime
        };
      },
      reset: function () {
        config = getConfig();
      }
    };
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

var crConfig = ConsentConfigManager.getInstance();


// ===========================================
// Compliance API Configuration Module
// ===========================================
var ComplianceApiConfig = (function () {
  // Private configuration
  var apiConfig = {
    GDPR: {
      apiName: "__tcfapi",
      complianceName: "gdpr",
      prepareConfig: null // Will be set after ComplianceHandler is defined
    },
    USP: {
      apiName: "__uspapi",
      complianceName: "usp",
      prepareConfig: null // Will be set after ComplianceHandler is defined
    },
    GPP: {
      apiName: "__gpp",
      complianceName: "gpp",
      prepareConfig: null // Will be set after ComplianceHandler is defined
    }
  };

  return {
    getApiConfig: function () {
      return apiConfig;
    },
    setConfigHandlers: function (gdprHandler, uspHandler, gppHandler) {
      apiConfig.GDPR.prepareConfig = gdprHandler;
      apiConfig.USP.prepareConfig = uspHandler;
      apiConfig.GPP.prepareConfig = gppHandler;
    }
  };
})();

// ===========================================
// Compliance Handler Module
// ===========================================
var ComplianceHandler = (function () {
  function configureGDPR() {
    var gdprConfig = {
      cmpApi: COMMON_CONFIG.getCmpApi(),
      timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.CONSENT_MANAGEMENT_TIMEOUT, 1000),
      defaultGdprScope: true,
    };

    var gdprActionTimeout = commonUtil.getGlobalOwObject().actionTimeout || undefined;
    if (gdprActionTimeout && commonUtil.isNumber(gdprActionTimeout)) {
      gdprConfig.actionTimeout = gdprActionTimeout;
    }
    crConfig.setPrebidCMConfig("gdpr", gdprConfig);
  }

  function configureUSP() {
    var uspConfig = {
      cmpApi: COMMON_CONFIG.getCmpApi(),
      timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.CONSENT_MANAGEMENT_TIMEOUT, 1000)
    };

    crConfig.setPrebidCMConfig("usp", uspConfig);
  }

  function configureGPP() {
    var gppConfig = {
      cmpApi: COMMON_CONFIG.getCmpApi(),
      timeout: COMMON_CONFIG.getTimeout(CONSTANTS.CONFIG.CONSENT_MANAGEMENT_TIMEOUT, 1000)
    };

    crConfig.setPrebidCMConfig("gpp", gppConfig);
  }

  // Set the compliance handlers in the ComplianceApiConfig
  ComplianceApiConfig.setConfigHandlers(configureGDPR, configureUSP, configureGPP);
})();


// ===========================================
// Geo Service Module
// ===========================================
var GeoService = (function () {
  function getGeoInfoWrapper() {
    timeMetrics.recordEntryTime("GEO_CALLING_TIME", 1500); // Setting default timeout of 1500 ms in case service fails or didn't respond
    commonUtil.getGeoInfo(ConsentConstants.READ_GEO_DATA_FROM, function (readFrom, geoInfo) {
      crConfig.setGeoInfo(readFrom, geoInfo);
      timeMetrics.recordExitTime("GEO_CALLING_TIME");
    });
  }

  return {
    getGeoInfoWrapper: getGeoInfoWrapper
  };
})();

// ===========================================
// CMP Detector Module
// ===========================================
var CmpDetector = (function () {

  function checkCMPInWindow(frame) {
    var cmpApis = ComplianceApiConfig.getApiConfig();
    var detectedCmps = [];

    for (var compliance in cmpApis) {
      if (cmpApis.hasOwnProperty(compliance)) {
        var apiName = cmpApis[compliance].apiName;
        if (typeof frame[apiName] === 'function') {
          detectedCmps.push({
            compliance: compliance,
            api: frame[apiName],
            prepareConfig: cmpApis[compliance].prepareConfig
          });
        }
      }
    }
    return detectedCmps;
  }

  function getCMPsPresentOnPage() {
    var detectedCmps = [];
    var currentWindow = window;

    // Iterate through window frames to find CMPs
    while (currentWindow) {
      detectedCmps = detectedCmps.concat(checkCMPInWindow(currentWindow));
      if (currentWindow === window.top) break;
      currentWindow = currentWindow.parent;
    }
    return detectedCmps;
  }

  return {
    getCMPsPresentOnPage: getCMPsPresentOnPage
  };
})();


// ===========================================
// Consent Setter For Continuous CMP Check Module
// ===========================================
var ConsentSetterForContinuousCMPCheck = (function () {
  function setConsentManagementConfig() {
    crConfig.setGeoMatchWithCMP();
    crConfig.setEnforcedConsentBasisOn(ConsentConstants.CONSENT_MANAGEMENT_SOURCE.CMP);

    // Update Prebid configuration with CMP-based settings
    commonUtil.getGlobalPbObject().setConfig({
      consentManagement: crConfig.getPrebidCMConfig()
    });

    // Set for OW+IH, IH
    if (COMMON_CONFIG.isUserIdModuleEnabled()) {
      commonUtil.getGlobalPbObject().refreshUserIds();
    }
  }

  function checkForCMPPresence() {
    // Check for CMP presence
    var detectedCmps = CmpDetector.getCMPsPresentOnPage();
    if (detectedCmps.length > 0) {
      ConsentResolver.setConsentResolverConfig(detectedCmps);
      crConfig.resetPrebidCMConfig();
      for (var i = 0; i < detectedCmps.length; i++) {
        detectedCmps[i].prepareConfig();
      }
      return true;
    }
    return false;
  }

  function shouldContinueCheckingForCMP() {
    var currentTime = Date.now();
    var config = crConfig.getProperties();

    if (config.ccmp || (currentTime - crConfig.getContinuousCmpCheckStartTime() > crConfig.getContinuousCmpCheckTimeout())) {
      return false;
    }
    return true;
  }

  function handleForOW() {
    // Add a hook to the fetchBids function
    var originalFetchBids = prebid.fetchBids;

    function resetFetchBids() {
      prebid.fetchBids = originalFetchBids;
    }

    prebid.fetchBids = function (activeSlots, callback) {
      // Check for CMP presence before proceeding with fetchBids
      if (!shouldContinueCheckingForCMP()) {
        resetFetchBids();
      } else {
        if(checkForCMPPresence()) {
          resetFetchBids();
          setConsentManagementConfig();
        }
      }
      timeMetrics.recordExitTime("CONSENT_CONFIG_RESOLVER_TIME");
      // Call the original fetchBids function
      return originalFetchBids.call(prebid, activeSlots, callback);
    };
  }

  function handleForIH() {
    var eventHandlerId = 'continuousCmpCheckIHEventId';
    function offEvent() {
      commonUtil.getIHPrebidNameSpace().offEvent("auctionInit", handler, eventHandlerId);
    }
    function handler() {
      if(!shouldContinueCheckingForCMP()){
        offEvent();
        timeMetrics.recordExitTime("CONSENT_CONFIG_RESOLVER_TIME");
        return;
      }
      if(checkForCMPPresence()) {
        offEvent();
        setConsentManagementConfig();
      }
      timeMetrics.recordExitTime("CONSENT_CONFIG_RESOLVER_TIME");
    }
    commonUtil.getIHPrebidNameSpace().onEvent("auctionInit", handler, eventHandlerId);
  }

  function proceedToContinuousCmpCheck() {
    // Enable continuous CMP checking
    crConfig.setContinuousCmpCheckEnabled(true);
    crConfig.setContinuousCmpCheckStartTime(Date.now());

    if (COMMON_CONFIG.isIdentityOnly()) {
      handleForIH();
    } else {
      handleForOW();
    }
  }

  return {
    proceedToContinuousCmpCheck: proceedToContinuousCmpCheck
  };
})();

// ===========================================
// Consent Resolver Module (Main Orchestrator)
// ===========================================
var ConsentResolver = (function () {
  function setCMPTime(timeExceeded) {
    // If time taken by CMP is not set then set the default timeout value
    if (!timeMetrics.getDurationOf("CMP_CALLING_TIME")) {
      timeMetrics.recordExitTime("CMP_CALLING_TIME", timeExceeded ? 1500 : null);
    }
  }

  function getCMPLookUpTimeout() {
    return (commonUtil.getGlobalOwObject() && commonUtil.isNumber(commonUtil.getGlobalOwObject().cmpLookUpTimeout))
      ? commonUtil.getGlobalOwObject().cmpLookUpTimeout
      : ConsentConstants.DEFAULT_CMP_LOOK_UP_TIMEOUT;
  }

  function handleGDPR(pingReturnData, success) {
    if (success && pingReturnData && pingReturnData.cmpId) {
      crConfig.setCmpId(pingReturnData.cmpId);
    }
  }

  function handleGPP(pingReturnData, success) {
    crConfig.setCmpId(pingReturnData && pingReturnData.pingData && pingReturnData.pingData.cmpId);
  }

  function setConsentResolverConfig(detectedCmps) {
    // If GDPR CMP is detected, get CMP ID
    for (var j = 0; j < detectedCmps.length; j++) {
      setCMPTime(false);
      crConfig.setComplianceSupport(ConsentConstants.COMPLIANCE_MAP[detectedCmps[j].compliance]);
      crConfig.setCmpPresent(true);
      if (detectedCmps[j].compliance === "GDPR") {
        detectedCmps[j].api("addEventListener", 2, handleGDPR);
      } else if (detectedCmps[j].compliance === "GPP") {
        detectedCmps[j].api("addEventListener", handleGPP);
      }
    }
  }

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
      setCMPTime(true); // Record CMP timing metrics

      var globalObj = commonUtil.getGlobalOwObject();
      if (!globalObj || !globalObj.CC || !globalObj.CC.gc) {
        executeCallback(ConsentConstants.CONSENT_MANAGEMENT_SOURCE.NONE);
        return;
      }

      // Get compliance type based on geo location
      var compliance = commonUtil.getKeyByValue(ConsentConstants.COMPLIANCE_MAP, globalObj.CC.gc);
      if (compliance) {
        ComplianceApiConfig.getApiConfig()[compliance].prepareConfig(); // Configure consent based on geo location
        ConsentSetterForContinuousCMPCheck.proceedToContinuousCmpCheck();
        executeCallback(ConsentConstants.CONSENT_MANAGEMENT_SOURCE.GEO);
      } else {
        executeCallback(ConsentConstants.CONSENT_MANAGEMENT_SOURCE.NONE);
      }
    }

    function checkCmpRecursively() {
      if (isCallbackExecuted) {
        return;
      }
      var detectedCmps = CmpDetector.getCMPsPresentOnPage();
      if (detectedCmps.length === 0) {
        setTimeout(checkCmpRecursively, 50);
      } else {
        setConsentResolverConfig(detectedCmps);
        for (var i = 0; i < detectedCmps.length; i++) {
          detectedCmps[i].prepareConfig();
        }
        crConfig.setGeoMatchWithCMP();
        executeCallback(ConsentConstants.CONSENT_MANAGEMENT_SOURCE.CMP);
      }
    }

    // Main execution flow
    timeMetrics.recordEntryTime("CONSENT_CONFIG_RESOLVER_TIME");

    if (!COMMON_CONFIG.consentManagementEnabled()) {
      executeCallback(ConsentConstants.CONSENT_MANAGEMENT_SOURCE.NONE);
      return;
    }

    crConfig.setConsentManagementEnabled(true);
    GeoService.getGeoInfoWrapper();
    timeoutId = setTimeout(proceedToFallbackExecution, getCMPLookUpTimeout()); // Timeout for checking CMP presence
    checkCmpRecursively();
  }

  return {
    getConsentManagementConfig: getConsentManagementConfig,
    setConsentResolverConfig: setConsentResolverConfig
  };
})();

// ===========================================
// Module Exports
// ===========================================
exports.getConsentManagementConfig = ConsentResolver.getConsentManagementConfig;
exports.getGeoInfoWrapper = GeoService.getGeoInfoWrapper;
exports.getInstance = function () {
  return crConfig;
};
commonUtil.getGlobalOwObject().getConsentResolverConfig = function getConsentResolverConfig() {
  return crConfig.getProperties();
};