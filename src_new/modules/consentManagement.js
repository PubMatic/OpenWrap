var config = require("../conf.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");

var CMP_APIS = ["__tcfapi", "__uspapi", "__gpp"];
var PREFIX = 'UINFO';
var LOCATION_INFO_VALIDITY = 172800000; // 2 * 24 * 60 * 60 * 1000 - 2 days
var GEO_URL = 'https://ut.pubmatic.com/geo?pubid=';
window.PWT = window.PWT || {};

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
      for (var i = 0; i < CMP_APIS.length; i++) {
        if (!cmps[CMP_APIS[i]] && (typeof f[CMP_APIS[i]] === 'function' || f.frames[`${CMP_APIS[i]}Locator`])) {
          cmps[CMP_APIS[i]] = 1;
        }
      }
    } catch (e) {
    }

    if (f === win.top) break;
    f = f.parent;
  }
  return cmps;
}

function prepareConsentManagementConfig(presentCmps) {
  // This Will prepare Config and set it to the PWT.consentManagementConfig
}


function getConsentManagementConfig(callback) {
  var isConsentAlreadySet = false;
  
  function executeCallback() {
    callback(window.PWT.consentManagementConfig);
  }

  function anyCMPPresent(presentCMPs) {
    return Object.keys(presentCMPs).length > 0;
  }

  function fallbackExecution() {
    if (window.PWT.CC.compliance) { // This will set by the Util.getGeoInfo
      isConsentAlreadySet = true;
      prepareConsentManagementConfig({ [window.PWT.CC.compliance]: 1 });
    }
  }

  function checkForCMPs() {
    var presentCMPs = getCMPsPresentOnPage();
    if (anyCMPPresent(presentCMPs)) {
      isConsentAlreadySet = true;
      prepareConsentManagementConfig(presentCMPs);
      executeCallback();
    }
  }

  // Calling geo info to get the country code and compliance Information
  util.getGeoInfo();

  // Timeout added till the time we check for CMP is loaded or to be loaded
  var timeout = setTimeout(function () {
    fallbackExecution();
    executeCallback();
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



