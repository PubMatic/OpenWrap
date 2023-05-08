// removeIf(removeIdHubOnlyRelatedCode)
// tdod: we can still reduce the build size for idhub by,
// 			- create a separate constants.js with limited required functions

var CONFIG = require("../config.idhub.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.idhub.js");
var owIdhubCommon = require("../owIdhubCommon.js");
var refThis = this;
var pbNameSpace = CONFIG.isIdentityOnly() ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE;

var isPubmaticIHAnalyticsEnabled = CONFIG.isPubMaticIHAnalyticsEnabled();

refThis.enablePubMaticIdentityAnalyticsIfRequired = function(){
	window.IHPWT.ihAnalyticsAdapterExpiry = CONFIG.getIHAnalyticsAdapterExpiry();
	if(isPubmaticIHAnalyticsEnabled && util.isFunction(window[pbNameSpace].enableAnalytics)){
		window[pbNameSpace].enableAnalytics({
			provider: "pubmaticIH",
			options: {
				publisherId: CONFIG.getPublisherId(),
				profileId: CONFIG.getProfileID(),
				profileVersionId: CONFIG.getProfileDisplayVersionID(),
				identityOnly: CONFIG.isUserIdModuleEnabled() ? CONFIG.isIdentityOnly() ? 2 : 1 : 0,
				domain: util.getDomainFromURL() 
			}
		});
	}
}

refThis.setConfig = function(){
	if(util.isFunction(window[pbNameSpace].setConfig) || typeof window[pbNameSpace].setConfig == "function") {
		if(CONFIG.isIdentityOnly()) {
			var prebidConfig = {
				debug: util.isDebugLogEnabled(),
				userSync: {
					syncDelay: 2000,
					auctionDelay: 1,
				}
			};

			if (CONFIG.getGdpr()) {
				if(!prebidConfig["consentManagement"]){
					prebidConfig["consentManagement"] = {};
				}
				prebidConfig["consentManagement"]['gdpr'] = {
					cmpApi: CONFIG.getCmpApi(),
					timeout: CONFIG.getGdprTimeout(),
					allowAuctionWithoutConsent: CONFIG.getAwc(),
					defaultGdprScope: true
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

			// Set Gpp consent config
			if (CONFIG.getGppConsent()) {
				prebidConfig = owIdhubCommon.setConsentConfig(prebidConfig, "gpp", CONFIG.getGppCmpApi(), CONFIG.getGppTimeout());
			}

			window.IHPWT.ssoEnabled = CONFIG.isSSOEnabled() || false;
			if(CONFIG.isUserIdModuleEnabled()){
				prebidConfig["userSync"]["userIds"] = util.getUserIdConfiguration();
			}
			// Adding a hook for publishers to modify the Prebid Config we have generated
			util.handleHook(CONSTANTS.HOOKS.PREBID_SET_CONFIG, [ prebidConfig ]);
			window[pbNameSpace].setConfig(prebidConfig);
		}
		if (CONFIG.isUserIdModuleEnabled() && CONFIG.isIdentityOnly()) {
			refThis.enablePubMaticIdentityAnalyticsIfRequired();
		}
		util.isFunction(window[pbNameSpace].firePubMaticIHLoggerCall) && window[pbNameSpace].firePubMaticIHLoggerCall();
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
					// todo: check the oldest pbjs version in use, do we still need this check?
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
						// todo: check the oldest pbjs version in use, do we still need this check?
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
// endRemoveIf(removeIdHubOnlyRelatedCode)
