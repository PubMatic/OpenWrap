var commonUtil = require("../common.util.js");
var util = require("../util.js");
var timeMetrics = require("./timeMetrics.js");

var CMP_CHECK_TIMEOUT = 1500;

var CONSENT_MANAGEMENT_SOURCE = {
  CMP: "CMP",
  GEO: "GEO",
  NONE: "NONE"
};

var COMPLIANCE_MAP = {
  GDPR: 1,
  USP: 2,
  GPP: 3
};

var READ_GEO_DATA_FROM = {
  LOCALSTORAGE: "LS",
  GEO_SERVICE: "GS",
  NONE: "NONE"
};

var CMP_APIs = {
  GDPR: { apiName: "__tcfapi", complianceName: "gdpr", cmpCommandListner: gdprHandler },
  USP: { apiName: "__uspapi", complianceName: "usp"},
  GPP: { apiName: "__gpp", complianceName: "gpp", cmpCommandListner: gppHandler }
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

/**
 * Initializes the consent management configuration object.
 */
function initializeCMConfig(allStatsAvailable, cmpPresent, complianceSupport, cmpId) {
  var cmConf = {
    allStatsAvailable: allStatsAvailable,
    cmpPresent: cmpPresent, // ccmp - CMP present or not, default not present i.e. 0
    complianceSupport: complianceSupport, // ccmps -  CMP supported,  1: GDPR, 2: USP, 3: GPP
    cmpId: cmpId, // ccmpId -  CMP ID: Standard Consent Management Platform ID, default - 0
    geoInfo: {
      cc: undefined, // Country Code Already being passed in the request
      sc: undefined, // State Code
    }
  };
  commonUtil.getGlobalOwObject().cmConfig = Object.assign({}, getCMConfigObject(), cmConf);
}

/**
 * Set the time taken by CMP to load
 * @param {*} timeExceeded : If time exceeded then set the default timeout value
 */
function setCMPTime(timeExceeded) {
  // If time taken by CMP is not set then set the default timeout value
  if (!commonUtil.getGlobalOwObject().getDurationOf("CMP_CALLING_TIME")) {
    timeExceeded
      ? timeMetrics.recordExitTime("CMP_CALLING_TIME", CMP_CHECK_TIMEOUT)
      : timeMetrics.recordExitTime("CMP_CALLING_TIME");
  }
}

function gdprHandler(pingReturnData, success) {
  if (pingReturnData && pingReturnData.cmpId) {
    getCMConfigObject().cmpId = pingReturnData.cmpId;
  }
}

function gppHandler(pingReturnData, success) {
  if (pingReturnData && pingReturnData.pingData && pingReturnData.pingData.cmpId) {
    getCMConfigObject().cmpId = pingReturnData.pingData.cmpId;
  }
}

/**
 * Get the CMPs present on the page
 * 
 * @returns Object : CMPs present on the page
 */
function getCMPsPresentOnPage() {
  var cmps = {};
  var currentWindow = window;
  var cmConfig = getCMConfigObject();

  // Helper function to check for CMP presence and execute commands
  function checkAndExecuteCMP(name, frame) {
    var cmpApi = CMP_APIs[name];
    var apiExists = typeof frame[cmpApi.apiName] === 'function' || frame.frames[cmpApi.apiName + "Locator"];
    
    if (apiExists) {
      cmConfig.cmpPresent = 1;
      setCMPTime(false);
      cmConfig.complianceSupport.push(COMPLIANCE_MAP[name]);

      if (name === 'GDPR') {
        frame[cmpApi.apiName]('addEventListener', 2, cmpApi.cmpCommandListner);
      } else if (name === 'GPP') {
        frame[cmpApi.apiName]('addEventListener', cmpApi.cmpCommandListner);
      }
    }
  }

  // Iterate through window frames to find CMPs
  while (currentWindow) {
    try {
      for (var name in CMP_APIs) {
        checkAndExecuteCMP(name, currentWindow);
      }
    } catch (e) {} // Handle errors silently

    if (currentWindow === window.top) break;
    currentWindow = currentWindow.parent;
  }

  return cmps;
}

/**
 * Get the geo information from the service
 */
function getGeoInfoWrapper() {
  timeMetrics.recordEntryTime("GEO_CALLING_TIME", 1500); // Setting default timeout of 1500 ms in case service fails or didn't respond
  commonUtil.getGeoInfo(READ_GEO_DATA_FROM, function (readFrom, uInfo) {
    timeMetrics.recordExitTime("GEO_CALLING_TIME");
    getCMConfigObject().geoInfo.cc = uInfo.cc;
    getCMConfigObject().geoInfo.sc = uInfo.sc;
  });
}
exports.getGeoInfoWrapper = getGeoInfoWrapper;

/**
 * Get the consent management configuration
 */
function getConsentManagementConfig() {
  initializeCMConfig(true, 0, [], 0);
  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  getGeoInfoWrapper();

  var cmpTimeoutReached = false;
  var timeoutId;

  // Handle CMP check timeout
  function handleCMPCheckTimeout() {
    cmpTimeoutReached = true;
    clearTimeout(timeoutId);
    setCMPTime(true);
  }
  // Set a timeout for checking CMP presence
  timeoutId = setTimeout(handleCMPCheckTimeout, CMP_CHECK_TIMEOUT);

  function checkCmpRecursively() {
    try {
      if (cmpTimeoutReached) return;
      getCMPsPresentOnPage();

      getCMConfigObject().complianceSupport.length > 0
        ? clearTimeout(timeoutId)
        : setTimeout(checkCmpRecursively, 50);
    } catch (error) {
      clearTimeout(timeoutId);
    }
  }
  checkCmpRecursively();
}
exports.getConsentManagementConfig = getConsentManagementConfig;

/**
 * Initialize the consent management configuration
 */
function init() {
  // Initialize the cmConfig object with undefined or null values
  initializeCMConfig(false);
  // This filed will be useful for the QA automation to check if all the logger stats are available or not (based on random number it will change)
  var allowTrafficRate = commonUtil.getGlobalOwObject().allowTrafficRate;
  allowTrafficRate = util.isNumber(allowTrafficRate) ? allowTrafficRate : 5;
  // Check if we need to procced for the getting all stats by checking runtime throttle (i.e. 5%)
  if (!commonUtil.shouldThrottle(allowTrafficRate)) {
    getConsentManagementConfig();
  } else {
    getGeoInfoWrapper();
  }
}
exports.init = init;