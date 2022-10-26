exports.getLiverampParams = function(params) {
	if (params.params.cssSelectors && params.params.cssSelectors.length > 0) {
		params.params.cssSelectors = params.params.cssSelectors.split(",");
	}
	var userIdentity = owpbjs.getUserIdentities() || {};
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
			atsObject.triggerElements = params.params.triggerElements;
			break;
		case 'direct':
			var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
			atsObject.emailHashes = emailHash && [emailHash['MD5'], emailHash['SHA1'], emailHash['SHA256']] || undefined;
			/* do we want to keep sso data under direct option?
			if yes, if sso is enabled and 'direct' is selected as detection mechanism, sso emails will be sent to ats script.
			if sso is disabled, and 'direct' is selected as detection mechanism, we will look for publisher provided email ids, and if available the hashes will be sent to ats script.
			*/
			if (enableCustomId && typeof owpbjs.getUserIdentities === "function" && owpbjs.getUserIdentities() !== undefined) {
				atsObject.customerID = owpbjs.getUserIdentities().customerID || undefined;
			}
			break;
	};
	return atsObject;
};

exports.initLiveRampAts = function(params) {
	var self = this;
	return {
		src: "https://ats.rlcdn.com/ats.js",
		async: true,
		onload: function(){
			var atsObject = self.getLiverampParams(params);
			window.ats && window.ats.start(atsObject);
		}
	}
}

exports.getEmailHashes = function(pbNameSpace){
	var userIdentity = window[pbNameSpace].getUserIdentities() || {};
	var enableSSO = CONFIG.isSSOEnabled() || false;
	var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
	return emailHash && [emailHash['MD5'], emailHash['SHA1'], emailHash['SHA256']] || undefined;
}

exports.initLiveRampLaunchPad = function (params, pbNameSpace) {
	var lpURL = "https://launchpad-wrapper.privacymanager.io/"+params.custom.configurationId+"/launchpad-liveramp.js";
	return {
		src: lpURL,
		async: true,
		onload: function(){
			__launchpad('addEventListener', 1, function(){
				var isDirectMode = !(ats.outputCurrentConfiguration()['DETECTION_MODULE_INFO']) ||
									ats.outputCurrentConfiguration()['ENVELOPE_MODULE_INFO']['ENVELOPE_MODULE_CONFIG']['startWithExternalId'];
				if(isDirectMode){ // If direct or detect/direct mode
					var emailHashes = refThis.getEmailHashes(pbNameSpace);
					emailHashes && window.ats.setAdditionalData({'type': 'emailHashes','id': emailHashes});
				}
			}, ['atsWrapperLoaded']);
		}
	}
};