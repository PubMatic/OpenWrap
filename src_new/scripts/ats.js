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