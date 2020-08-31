var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var prebid = require("../adapters/prebid.js");
var refThis = this;

refThis.initIdHub = function(win){
	if(CONFIG.isUserIdModuleEnabled()  ){
        //TODO : Check for Prebid loaded and debug logs 
		prebid.register().sC();
		if(CONFIG.isIdentityOnly()){
			if(CONFIG.getIdentityConsumers().indexOf(CONSTANTS.COMMON.PREBID)>-1 && !util.isUndefined(win[CONFIG.PBJS_NAMESPACE]) && !util.isUndefined(win[CONFIG.PBJS_NAMESPACE].que)){
				win[CONFIG.PBJS_NAMESPACE].que.unshift(function(){
					var vdetails = win[CONFIG.PBJS_NAMESPACE].version.split("."); 
					if(vdetails.length===3 && (+vdetails[0].split("v")[1] > 3 || (vdetails[0].includes("v3") && +vdetails[1] >= 3))){
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

	CONFIG.initConfig();
	if (util.isObject(win)) {
		refThis.initIdHub(win);
		refThis.callJsLoadedIfRequired(win);
		return true;
	} else {
		return false;
	}
};