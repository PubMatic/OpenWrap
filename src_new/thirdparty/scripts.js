var CONFIG = require("../config.idhub.js");

exports.getLiverampParams = function(params,pbNameSpace) {
	if (params.params.cssSelectors && params.params.cssSelectors.length > 0) {
		params.params.cssSelectors = params.params.cssSelectors.split(",");
	}
	var userIdentity = window[pbNameSpace].getUserIdentities() || {};
	var enableSSO = CONFIG.isSSOEnabled() || false;
	var detectionMechanism = params.params.detectionMechanism;
	var enableCustomId = params.params.enableCustomId === "true" ? true : false;
	var atsObject = {
		"placementID": params.params.pid,
		"storageType": params.params.storageType,
		"logging": params.params.logging //"error"
	};
	if (enableCustomId) {
		atsObject.accountID = params.params.accountID;
		atsObject.customerIDRegex = params.params.customerIDRegex;
		atsObject.detectionSubject = "customerIdentifier";
	}

	switch (detectionMechanism) {
		case undefined:
		case 'detect':
			atsObject.detectionType = params.params.detectionType;
			atsObject.urlParameter = params.params.urlParameter;
			atsObject.cssSelectors = params.params.cssSelectors;
			atsObject.detectDynamicNodes = params.params.detectDynamicNodes;
			atsObject.detectionEventType = params.params.detectionEventType;
			if (params.params.triggerElements && params.params.triggerElements.length > 0) {
				params.params.triggerElements = params.params.triggerElements.split(",");
				atsObject.triggerElements = params.params.triggerElements;
			}
			break;
		case 'direct':
			var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
			atsObject.emailHashes = emailHash && [emailHash['MD5'], emailHash['SHA1'], emailHash['SHA256']] || undefined;
			/* do we want to keep sso data under direct option?
			if yes, if sso is enabled and 'direct' is selected as detection mechanism, sso emails will be sent to ats script.
			if sso is disabled, and 'direct' is selected as detection mechanism, we will look for publisher provided email ids, and if available the hashes will be sent to ats script.
			*/
			if (enableCustomId && refThis.isFunction(window[pbNameSpace].getUserIdentities) && window[pbNameSpace].getUserIdentities() !== undefined) {
				atsObject.customerID = window[pbNameSpace].getUserIdentities().customerID || undefined;
			}
			break;
	};
	return atsObject;
};

exports.initLiveRampAts = function(params, pbNameSpace) {
	var self = this;
	return {
		src: "https://ats.rlcdn.com/ats.js",
		async: true,
		onload: function(){
			var atsObject = self.getLiverampParams(params, pbNameSpace);
			window.ats && window.ats.start(atsObject);
		}
	}
}


exports.initLauncherJs = function(params,pbNameSpace) {
	var self = this;
	window.cnvr_launcher_options = {
		lid: params.params.launcher_id
	};
	return {
		src: "https://secure.cdn.fastclick.net/js/cnvr-launcher/latest/launcher-stub.min.js",
		async: true,
		onload: function(){
			var launchObject = self.getPublinkLauncherParams(params,pbNameSpace);
			window.conversant.getLauncherObject = function(){
				return launchObject;
			}
			window.conversant && window.conversant.launch('publink', 'start', launchObject);
		}
	}
}

exports.getPublinkLauncherParams = function(params,pbNameSpace) {
	if (params.params.cssSelectors && params.params.cssSelectors.length > 0) {
		params.params.cssSelectors = params.params.cssSelectors.split(",");
	}
	var userIdentity = window[pbNameSpace].getUserIdentities() || {};
	var enableSSO = CONFIG.isSSOEnabled() || false;
	var detectionMechanism = params.params.detectionMechanism;
	var lnchObject = {
		"apiKey": params.params.api_key,
		"siteId": params.params.site_id,
	};
	
	switch (detectionMechanism) {
		case undefined:
		case 'detect':
			lnchObject.urlParameter = params.params.urlParameter;
			lnchObject.cssSelectors = params.params.cssSelectors;
			lnchObject.detectionSubject = "email";
			break;
		case 'direct':
			var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
			lnchObject.emailHashes = emailHash && [emailHash['MD5'], emailHash['SHA256']] || undefined;
			/* do we want to keep sso data under direct option?
			if yes, if sso is enabled and 'direct' is selected as detection mechanism, sso emails will be sent to ats script.
			if sso is disabled, and 'direct' is selected as detection mechanism, we will look for publisher provided email ids, and if available the hashes will be sent to ats script.
			*/
		break;
	};
	return lnchObject;
};


exports.initZeoTapJs = function(params, pbNameSpace) {
	function addZeoTapJs() {
		var n = document, t = window;
		var userIdentity = window[pbNameSpace].getUserIdentities() || {};
		var enableSSO = CONFIG.isSSOEnabled() || false;
		var userIdentityObject = {
			email: enableSSO && userIdentity.emailHash ? userIdentity.emailHash['SHA256'] : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash['SHA256'] : undefined
		};
		var e=n.createElement("script");
		e.type="text/javascript",
		e.crossorigin="anonymous"
		e.async=!0 ,
		e.src="https://content.zeotap.com/sdk/idp.min.js",
		e.onload=function(){};
		n=n.getElementsByTagName("script")[0];
		var initialsationObject = {
			partnerId:params.partnerId,
			allowIDP: true,
			useConsent: (CONFIG.getCCPA() || CONFIG.getGdpr()),
			checkForCMP: (CONFIG.getCCPA() || CONFIG.getGdpr())
		};
		n.parentNode.insertBefore(e,n);

		n=t.zeotap||{_q:[],_qcmp:[]};

		!function(n,t,e) {
			for( var o=0 ;o<t.length;o++)
				!function(t) {
					n[t]=function(){
						n[e].push([t].concat(Array.prototype.slice.call(arguments, 0 )))
					}
				}(t[o])
		}(n,["callMethod"],"_q"),
		t.zeotap=n,
		t.zeotap.callMethod("init",initialsationObject),
		t.zeotap.callMethod("setUserIdentities",userIdentityObject, true);
	}

	if (document.readyState == 'complete') {
		addZeoTapJs();
	} else {
		window.addEventListener("load", function () {
			setTimeout(addZeoTapJs, 1000);
		});
	}
};
