var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var refThis = this;
var pbNameSpace = CONSTANTS.COMMON.PREBID_NAMESPACE;

refThis.setConfig = function(){
	if(util.isFunction(window[pbNameSpace].setConfig) || typeof window[pbNameSpace].setConfig == "function") {
		if(CONFIG.isIdentityOnly()) {
			var prebidConfig = {
				debug: util.isDebugLogEnabled(),
				userSync: {
					syncDelay: 2000
				}
			};

			if (CONFIG.getGdpr()) {
				prebidConfig["consentManagement"] = {
					cmpApi: CONFIG.getCmpApi(),
					timeout: CONFIG.getGdprTimeout(),
					allowAuctionWithoutConsent: CONFIG.getAwc()
				};
			}

			if (CONFIG.getCCPA()) {
				if(!prebidConfig["consentManagement"]){
					prebidConfig["consentManagement"] = {};
				}
				prebidConfig["consentManagement"]["usp"] = {
					cmpApi: CONFIG.getCCPACmpApi(),
					timeout: CONFIG.getCCPATimeout(),
				};
			}

			if(CONFIG.isUserIdModuleEnabled()){
				prebidConfig["userSync"]["userIds"] = util.getUserIdConfiguration();
			}
		
			// Adding a hook for publishers to modify the Prebid Config we have generated
			util.handleHook(CONSTANTS.HOOKS.PREBID_SET_CONFIG, [ prebidConfig ]);
			window[pbNameSpace].setConfig(prebidConfig);
		}
		window[pbNameSpace].requestBids([]);
	}
};


exports.initIdHub = function(win){
	if(CONFIG.isUserIdModuleEnabled()){
		//TODO : Check for Prebid loaded and debug logs 
		refThis.setConfig();
		if(CONFIG.isIdentityOnly()){
			if(CONFIG.getIdentityConsumers().indexOf(CONSTANTS.COMMON.PREBID)>-1 && !util.isUndefined(win[CONFIG.PBJS_NAMESPACE]) && !util.isUndefined(win[CONFIG.PBJS_NAMESPACE].que)){
				win[CONFIG.PBJS_NAMESPACE].que.unshift(function(){
					var vdetails = win[CONFIG.PBJS_NAMESPACE].version.split("."); 
					if(vdetails.length===3 && (+vdetails[0].split("v")[1] > 3 || (vdetails[0] === "v3" && +vdetails[1] >= 3))){
						util.log("Adding On Event " + win[CONFIG.PBJS_NAMESPACE] + ".addAddUnits()");						
						win[CONFIG.PBJS_NAMESPACE].onEvent("addAdUnits", function () {
							util.updateAdUnits(win[CONFIG.PBJS_NAMESPACE]["adUnits"]);
						});
						win[CONFIG.PBJS_NAMESPACE].onEvent("beforeRequestBids", function (adUnits) {
							util.updateAdUnits(adUnits);
						});
					}
					else{
						util.log("Adding Hook on" + win[CONFIG.PBJS_NAMESPACE] + ".addAddUnits()");
						var theObject = win[CONFIG.PBJS_NAMESPACE];
						var functionName = "addAdUnits";
						util.addHookOnFunction(theObject, false, functionName, refThis.newAddAdUnitFunction);
					}
				});
				util.log("Identity Only Enabled and setting config");
			}else{
				util.logWarning("window.pbjs is undefined");
			}
		}
	}
};

exports.init = function(win) { 
	if (util.isObject(win)) {
		refThis.initIdHub(win);
		return true;
	} else {
		return false;
	}
};
