var CONFIG = require("../config.idhub.js");
var CONSTANTS = require("./constants.js");

var typeFunction = "Function";
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
	var userIdConfs = {};
	refThis.forEachOnObject(CONFIG.getIdentityPartners(), function (parterId, partnerValues) {
		if (!CONSTANTS.EXCLUDE_PARTNER_LIST.includes(parterId)) {
			userIdConfs[parterId] = refThis.getUserIdParams(partnerValues)
		}
	});
	return userIdConfs;
};

exports.deleteCustomParams = function(params){
	delete params.custom;
	return params;
}

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
		thirdPartyScripts.push(userIdParams);
	}
	if(userIdParams && userIdParams.params && userIdParams.params['loadIDP'] == 'true'){
		thirdPartyScripts.push(userIdParams);
	}
	if (userIdParams && userIdParams.params && userIdParams.params["loadLauncher"] == "true") {
		thirdPartyScripts.push(userIdParams);
	}
	if (userIdParams && userIdParams.custom && userIdParams.custom["loadLaunchPad"] == "true") {
		thirdPartyScripts.push(userIdParams);
	}
	return refThis.deleteCustomParams(userIdParams);
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