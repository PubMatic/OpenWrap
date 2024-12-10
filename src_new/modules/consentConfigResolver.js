var COMMON_CONFIG = require("../common.config.js");
var CONSTANTS = require("../constants.js");
var commonUtil = require("../common.util.js");

var CONSENT_MANAGEMENT_SOURCE = {
  CMP: "CMP",
  GEO: "GEO",
  NONE: "NONE"
};

var COMPLIANCE_MAP = {
  NOT_FOUND: 0,
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
  GDPR: { apiName: "__tcfapi", getConfig: getGDPRConfig, complianceName: "gdpr", cmpCommandListner: pingReturnHandler, },
  USP: { apiName: "__uspapi", getConfig: getUSPConfig, complianceName: "usp", cmpCommandListner: pingReturnHandler },
  GPP: { apiName: "__gpp", getConfig: getGPPConfig, complianceName: "gpp", cmpCommandListner: pingReturnHandler }
};

// Phase 1.5

// let a = {
//   cmd: {
//     cmpp: 1,
//     gst: 200,
//     cc: "US",
//     sc: "CA",
//     cmps: [{
//       id: 15,
//       s: 1,  // 1: GDPR, 2: USP, 3: GPP
//       t: 1000,
//     },
//     {
//       id: 25,
//       s: 2,
//       t: 1000,
//     },
//     {
//       id: 35,
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
    //cmProcessDone: false, 
    //enforcedConsentBasisOn: CONSENT_MANAGEMENT_SOURCE.NONE,
    // readGeoDataFrom: READ_GEO_DATA_FROM.NONE, 
    cmpPresent: 0, // ccmp - CMP present or not, default not present i.e. 0
    complianceSupport: 0, // ccmps -  CMP supported, 0: NOTFOUND, 1: GDPR, 2: USP, 3: GPP
    cmpId: undefined, // ccmpId -  CMP ID: Standard Consent Management Platform ID
    metrics: {
      timeTakenByGeoService: null,       
      timeTakenByCMP: null,              
      // timeout: 2000,                  
    },
    geoInfo: {
      cc: undefined, // Country Code
      sc: undefined, // State Code
    },
    //prebidCMConfig: {}
  };
}

function pingReturnHandler(pingReturnData, success) {
  if (pingReturnData.cmpId) {
    commonUtil.getGlobalOwObject().cmConfig.cmpId = pingReturnData.cmpId;
  }
}

function getCMPsPresentOnPage() {
  var cmps = {};
  var f = window;
  while (f) {
    try {
      for (var name in CMP_APIs) {
        if ((typeof f[CMP_APIs[name].apiName] === 'function' || f.frames[CMP_APIs[name].apiName + "Locator"])) {
          // Going with latest GDPR version support i.e. 2
          commonUtil.getGlobalOwObject().cmConfig.cmpPresent = 1;
          switch (name) {
            case 'GDPR':
              commonUtil.getGlobalOwObject().cmConfig.complianceSupport = COMPLIANCE_MAP.GDPR;
              [CMP_APIs[name].apiName]('ping', 2, CMP_APIs[name].cmpCommandListner);
              break;            
            case 'USP': 
              commonUtil.getGlobalOwObject().cmConfig.complianceSupport = COMPLIANCE_MAP.USP;
              break;
            case 'GPP': 
              commonUtil.getGlobalOwObject().cmConfig.complianceSupport = COMPLIANCE_MAP.GPP;
              [CMP_APIs[name].apiName]('ping', CMP_APIs[name].cmpCommandListner);
              break;
            default:
              break;
          }
          //TODO: Confirm with Antoine do we want to break if we found
          break;
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
  commonUtil.getGeoInfo(READ_GEO_DATA_FROM, function(readFrom, uInfo) {
    commonUtil.getGlobalOwObject().cmConfig.metrics.timeTakenByGeoService = new Date().getTime() - startTime;
    commonUtil.getGlobalOwObject().cmConfig.geoInfo.cc = uInfo.cc;
    commonUtil.getGlobalOwObject().cmConfig.geoInfo.sc = uInfo.sc;
    // commonUtil.getGlobalOwObject().cmConfig.readGeoDataFrom = readFrom;
  });
}

function getConsentManagementConfig(callback) {
  initializeCMConfig();
  
  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  getGeoInfoWrapper();
  getCMPsPresentOnPage();

}

getConsentManagementConfig();
//exports.getConsentManagementConfig = getConsentManagementConfig;



