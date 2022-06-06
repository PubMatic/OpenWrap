

var CONFIG = require("../config.idhub.js");
var CONSTANTS = require("./constants.js");


var typeArray = "Array";
var typeString = "String";
var typeFunction = "Function";
var typeNumber = "Number";
var toString = Object.prototype.toString;
var refThis = this;
refThis.idsAppendedToAdUnits = false;

function isA(object, testForType) {
	return toString.call(object) === "[object " + testForType + "]";
}

var thirdPartyScripts = [];

/* start-test-block */
exports.isA = isA;
/* end-test-block */

exports.isFunction = function (object) {
	return refThis.isA(object, typeFunction);
};

exports.isString = function (object) {
	return refThis.isA(object, typeString);
};

exports.isArray = function (object) {
	return refThis.isA(object, typeArray);
};

exports.isNumber = function (object) {
	return refThis.isA(object, typeNumber);
};

exports.isObject = function (object) {
	return typeof object === "object" && object !== null;
};

exports.isOwnProperty = function (theObject, proertyName) {
	/* istanbul ignore else */
	if (refThis.isObject(theObject) && theObject.hasOwnProperty) {
		// return theObject.hasOwnProperty(proertyName);
		return Object.prototype.hasOwnProperty.call(theObject, proertyName);
	}
	return false;
};


exports.forEachOnObject = function (theObject, callback) {
	/* istanbul ignore else */
	if (!refThis.isObject(theObject)) {
		return;
	}

	/* istanbul ignore else */
	if (!refThis.isFunction(callback)) {
		return;
	}

	for (var key in theObject) {
		/* istanbul ignore else */
		if (refThis.isOwnProperty(theObject, key)) {
			callback(key, theObject[key]);
		}
	}
};

exports.getNestedObjectFromArray = function (sourceObject, sourceArray, valueOfLastNode) {
	var convertedObject = sourceObject;
	var referenceForNesting = convertedObject;
	for (var i = 0; i < sourceArray.length - 1; i++) {
		if (!referenceForNesting[sourceArray[i]]) {
			referenceForNesting[sourceArray[i]] = {};
		}
		referenceForNesting = referenceForNesting[sourceArray[i]];
	}
	referenceForNesting[sourceArray[sourceArray.length - 1]] = valueOfLastNode;
	return convertedObject;
};

exports.getNestedObjectFromString = function (sourceObject, separator, key, value) {
	var splitParams = key.split(separator);
	if (splitParams.length == 1) {
		sourceObject[key] = value;
	} else {
		sourceObject = refThis.getNestedObjectFromArray(sourceObject, splitParams, value);
	}
	return sourceObject;
};

exports.getUserIdConfiguration = function () {
	var userIdConfs = [];
	refThis.forEachOnObject(CONFIG.getIdentityPartners(), function (parterId, partnerValues) {
		if (!CONSTANTS.EXCLUDE_PARTNER_LIST.includes(parterId)) {
			userIdConfs.push(refThis.getUserIdParams(partnerValues));
		}
	});
	return userIdConfs;
};

exports.getUserIdParams = function (params) {
	var userIdParams = {};
	refThis.applyDataTypeChangesIfApplicable(params);
	refThis.applyCustomParamValuesfApplicable(params);
	for (var key in params) {
		try {
			if (CONSTANTS.EXCLUDE_IDENTITY_PARAMS.indexOf(key) == -1) {
				if (CONSTANTS.TOLOWERCASE_IDENTITY_PARAMS.indexOf(key) > -1) {
					params[key] = params[key].toLowerCase();
				}
				if (CONSTANTS.JSON_VALUE_KEYS.indexOf(key) > -1) {
					params[key] = JSON.parse(params[key]);
				}
				userIdParams = refThis.getNestedObjectFromString(userIdParams, ".", key, params[key]);
			}
		} catch (ex) {
			//refThis.logWarning(CONSTANTS.MESSAGES.IDENTITY.M3, ex);
		}
	}
	
    if (userIdParams && userIdParams.params && userIdParams.params["loadATS"] == "true") {
		thirdPartyScripts.push(userIdParams.name);
	}
	if(userIdParams && userIdParams.params && userIdParams.params['loadIDP'] == 'true'){
		thirdPartyScripts.push(userIdParams.name);
	}
	if (userIdParams && userIdParams.params && userIdParams.params["loadLauncher"] == "true") {
		thirdPartyScripts.push(userIdParams.name);
	}
	return userIdParams;
};


exports.getLiverampParams = function(params) {
	if (params.params.cssSelectors && params.params.cssSelectors.length > 0) {
		params.params.cssSelectors = params.params.cssSelectors.split(",");
	}
	// var userIdentity = owpbjs.getUserIdentities() || {};
	// var enableSSO = CONFIG.isSSOEnabled() || false;
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
			break;
		case 'direct':
			// var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
			// atsObject.emailHashes = emailHash && [emailHash['MD5'], emailHash['SHA1'], emailHash['SHA256']] || undefined;
			// /* do we want to keep sso data under direct option?
			// if yes, if sso is enabled and 'direct' is selected as detection mechanism, sso emails will be sent to ats script.
			// if sso is disabled, and 'direct' is selected as detection mechanism, we will look for publisher provided email ids, and if available the hashes will be sent to ats script.
			// */
			// if (enableCustomId && refThis.isFunction(owpbjs.getUserIdentities) && owpbjs.getUserIdentities() !== undefined) {
			// 	atsObject.customerID = owpbjs.getUserIdentities().customerID || undefined;
			// }
			break;
	};
	return atsObject;
};



exports.initLiveRampAts = function (params) {
	var atsObject = refThis.getLiverampParams(params);
	return {
		url: "https://ats.rlcdn.com/ats.js",
		params: atsObject,
		onload: function(){
			window.ats && window.ats.start(atsObject);
		}
	}
};


exports.applyDataTypeChangesIfApplicable = function(params) {
	var value;
	if(params.name in CONSTANTS.SPECIAL_CASE_ID_PARTNERS) {
		for(partnerName in CONSTANTS.SPECIAL_CASE_ID_PARTNERS) {
			if (partnerName === params.name) {
				for(key in CONSTANTS.SPECIAL_CASE_ID_PARTNERS[partnerName]) {
					var paramValue = params[key];
					switch (CONSTANTS.SPECIAL_CASE_ID_PARTNERS[partnerName][key]) {
						case 'number':
							if(paramValue && typeof paramValue !== 'number') {
								value = parseInt(paramValue)
								isNaN(value) ?
									refThis.logError(partnerName + ": Invalid parameter value '" + paramValue + "' for parameter " + key) :
									params[key] = value;
							}
							break;
						case 'array': 
							if (paramValue) {
								if (typeof paramValue === 'string') {
									var arr = paramValue.split(",").map(function(item) {
										return item.trim();
									});
									//var arr = params[key].split(",");
									if (arr.length > 0) {
										params[key] = arr;
									}
								} else if (typeof paramValue === 'number') {
									params[key] = [paramValue];
								}
							}
						default:
							return;
					}
				}
			}
		}
	}
}

exports.applyCustomParamValuesfApplicable = function(params) {
	if (params.name in CONSTANTS.ID_PARTNERS_CUSTOM_VALUES) {
		var partnerValues = CONSTANTS.ID_PARTNERS_CUSTOM_VALUES[params.name];
		var i = 0;
		for (;i<partnerValues.length;i++) {
			params[partnerValues[i]["key"]] = partnerValues[i]["value"];
		}
	}
};


exports.getThirdPartyScripts = function (){
	return thirdPartyScripts;
}