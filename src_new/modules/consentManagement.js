var config = require("../conf.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");

var cmpConsentManagementConf = {}

window.PWT = window.PWT || {};
var CMP_APIs = {
  GDPR: {
    apiName: "__tcfapi",
    setConfig: setGDPRConfig
  },
  CCPA: {
    apiName: "__uspapi",
    setConfig: setCCPAConfig
  },
  GPP: {
    apiName: "__gpp",
    setConfig: setGPPConfig
  }
};

function setGDPRConfig() {
  cmpConsentManagementConf['gdpr'] = {
    cmpApi: COMMON_CONFIG.getCmpApi(),
    timeout: COMMON_CONFIG.getGdprTimeout(),
    // allowAuctionWithoutConsent: COMMON_CONFIG.getAwc(), // Auction without consent IMP : Not required now
    defaultGdprScope: true
  };
  var gdprActionTimeout = COMMON_CONFIG.getGdprActionTimeout();
  if (gdprActionTimeout) {
    util.log("GDPR IS ENABLED, TIMEOUT: " + cmpConsentManagementConf['gdpr']['timeout'] +", ACTION TIMEOUT: "+ gdprActionTimeout);
    cmpConsentManagementConf['gdpr']['actionTimeout'] = gdprActionTimeout;
  }
}
function setCCPAConfig() {
  cmpConsentManagementConf["usp"] = {
    cmpApi: COMMON_CONFIG.getCCPACmpApi(),
    timeout: COMMON_CONFIG.getCCPATimeout()
  };
}

function setGPPConfig() {
  cmpConsentManagementConf[key] = {
    cmpApi: COMMON_CONFIG.getGPPCmpApi(),
    timeout: COMMON_CONFIG.getGPPTimeout()
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
  var f = win;
  while (f != null) {
    try {
      for (var apiName of CMP_APIs) {
        if (!cmps[apiName] && (typeof f[apiName] === 'function' || f.frames[`${apiName}Locator`])) {
          cmps[apiName] = 1;
          CMP_APIs[apiName].setConfig();
        }
      }
    } catch (e) {
    }

    if (f === win.top) break;
    f = f.parent;
  }
  return cmps;
}

function setConsentManagementConfigToPWT(config) {
  // This Will prepare Config and set it to the PWT.consentManagementConfig
  window.PWT.consentManagementConfig = config; // Setting to PWT for visibility
}


function getConsentManagementConfig(callback) {
  var isConsentAlreadySet = false;
  
  function executeCallback() {
    callback(window.PWT.consentManagementConfig);
  }

  function anyCMPPresent(cmpConsentManagementConf) {
    return Object.keys(cmpConsentManagementConf).length > 0;
  }

  function fallbackExecution() {
    if (window.PWT.CC.compliance) { // This will set by the Util.getGeoInfo
      isConsentAlreadySet = true;
      CMP_APIs[window.PWT.CC.compliance].setConfig();
      setConsentManagementConfigToPWT(cmpConsentManagementConf);
    }
  }

  function checkForCMPs() {
    getCMPsPresentOnPage();
    if (anyCMPPresent(cmpConsentManagementConf)) {
      isConsentAlreadySet = true;
      setConsentManagementConfigToPWT(cmpConsentManagementConf);
      executeCallback();
    }
  }

  // Calling geo info to get the country code and compliance Information
  util.getGeoInfo();

  // Timeout added till the time we check for CMP is loaded or to be loaded
  var timeout = setTimeout(function () {
    if(!isConsentAlreadySet) {
      fallbackExecution();
      executeCallback();
    }
  }, 2000);

  var interval = setInterval(function () {
    if(isConsentAlreadySet) {
      clearTimeout(timeout);
      clearInterval(interval);
    }
    checkForCMPs();
  }, 50); // Check every 50ms (adjust as necessary)
}


exports.getConsentManagementConfig = getConsentManagementConfig;



