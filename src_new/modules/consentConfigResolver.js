var commonUtil = require("../common.util.js");

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
  GDPR: { apiName: "__tcfapi", getConfig: getGDPRConfig, complianceName: "gdpr", cmpCommandListner: pingReturnHandler, },
  USP: { apiName: "__uspapi", getConfig: getUSPConfig, complianceName: "usp", cmpCommandListner: pingReturnHandler },
  GPP: { apiName: "__gpp", getConfig: getGPPConfig, complianceName: "gpp", cmpCommandListner: pingReturnHandler }
};

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

function getCMConfigObject() {
  commonUtil.getGlobalOwObject().cmConfig = commonUtil.getGlobalOwObject().cmConfig || {};
  return commonUtil.getGlobalOwObject().cmConfig;
}

function initializeCMConfig() {
   // Initializing the cmConfig object
  let cmConf = {
    cmpStartTime: 0, // This will have a value when PWT starts executing (inside owt.js) 
    //cmProcessDone: false, 
    //enforcedConsentBasisOn: CONSENT_MANAGEMENT_SOURCE.NONE,
    // readGeoDataFrom: READ_GEO_DATA_FROM.NONE, 
    cmpPresent: 0, // ccmp - CMP present or not, default not present i.e. 0
    complianceSupport: [], // ccmps -  CMP supported,  1: GDPR, 2: USP, 3: GPP
    cmpId: undefined, // ccmpId -  CMP ID: Standard Consent Management Platform ID
    metrics: {
      timeTakenByGeoService: undefined,       
      timeTakenByCMP: undefined,              
      // timeout: 2000,                  
    },
    geoInfo: {
      cc: undefined, // Country Code
      sc: undefined, // State Code
    }
    //prebidCMConfig: {}
  };
  commonUtil.getGlobalOwObject().cmConfig =  Object.assign({}, cmConf, getCMConfigObject());
}

function pingReturnHandler(pingReturnData, success) {
  if (pingReturnData.cmpId) {
    getCMConfigObject().cmpId = pingReturnData.cmpId;
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
          getCMConfigObject().cmpPresent = 1;
          // If not present then only add it first time
          if(!getCMConfigObject().metrics.timeTakenByCMP) {
            getCMConfigObject().metrics.timeTakenByCMP = new Date().getTime() - getCMConfigObject().cmpStartTime;
          }
          switch (name) {
            case 'GDPR':
              getCMConfigObject().complianceSupport.push(COMPLIANCE_MAP.GDPR);
              [CMP_APIs[name].apiName]('ping', 2, CMP_APIs[name].cmpCommandListner);
              break;            
            case 'USP': 
              getCMConfigObject().complianceSupport.push(COMPLIANCE_MAP.USP);
              break;
            case 'GPP': 
              getCMConfigObject().complianceSupport.push(COMPLIANCE_MAP.GPP);
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


function getGeoInfoWrapper() {
  let startTime = new Date().getTime();
  commonUtil.getGeoInfo(READ_GEO_DATA_FROM, function(readFrom, uInfo) {
    getCMConfigObject().metrics.timeTakenByGeoService = new Date().getTime() - startTime;
    getCMConfigObject().geoInfo.cc = uInfo.cc;
    getCMConfigObject().geoInfo.sc = uInfo.sc;
    // commonUtil.getGlobalOwObject().cmConfig.readGeoDataFrom = readFrom;
  });
}

function getConsentManagementConfig() {
  initializeCMConfig();
  
  // Calling geo info to get the country, state level information and regulation to apply information. This will be stored under PWT.CC
  getGeoInfoWrapper();

  // Timeout added till the time we check for CMP is loaded or to be loaded
  var timeoutId = setTimeout(function () {
    clearTimeout(timeoutId);
  }, 1500);  // Cofnirmed as we have delay in 2000 ms in logger execution so we are waiting here for 1500 ms


  function checkCmpRecursively() {
    getCMPsPresentOnPage();
    if (getCMConfigObject().complianceSupport.length > 0) {
      clearTimeout(timeoutId);
    } else {
      setTimeout(checkCmpRecursively, 50);
    }
  }

  checkCmpRecursively();

}

getConsentManagementConfig();
//exports.getConsentManagementConfig = getConsentManagementConfig;