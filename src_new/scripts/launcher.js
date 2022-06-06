exports.initLauncherJs = function(params) {
	var self = this;
	window.cnvr_launcher_options = {
		lid: params.params.launcher_id
	};
	return {
		src: "https://secure.cdn.fastclick.net/js/cnvr-launcher/latest/launcher-stub.min.js",
		async: true,
		onload: function(){
			var launchObject = self.getPublinkLauncherParams(params);
			window.conversant.getLauncherObject = function(){
				return launchObject;
			}
			window.conversant && window.conversant.launch('publink', 'start', launchObject);
		}
	}
}

exports.getPublinkLauncherParams = function(params) {
	if (params.params.cssSelectors && params.params.cssSelectors.length > 0) {
		params.params.cssSelectors = params.params.cssSelectors.split(",");
	}
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
			var userIdentity = owpbjs.getUserIdentities() || {};
			var enableSSO = false; // CONFIG.isSSOEnabled() || false;
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
