/*global Set*/

var CONFIG = require("./config.idhub.js");
var CONSTANTS = require("./constants.js");
var debugLogIsEnabled = false;

/* start-test-block */
exports.debugLogIsEnabled = debugLogIsEnabled;
/* end-test-block */

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

exports.isUndefined = function (object) {
	return typeof object === "undefined";
};

exports.enableDebugLog = function () {
	refThis.debugLogIsEnabled = true;
};

exports.isDebugLogEnabled = function () {
	return refThis.debugLogIsEnabled;
};

exports.enableVisualDebugLog = function () {
	refThis.debugLogIsEnabled = true;
	refThis.visualDebugLogIsEnabled = true;
};

exports.isEmptyObject = function (object) {
	return refThis.isObject(object) && Object.keys(object).length === 0;
};

//todo: move...
var constDebugInConsolePrependWith = "[OpenWrap] : ";
var constErrorInConsolePrependWith = "[OpenWrap] : [Error]";


exports.log = function (data) {
	if (refThis.debugLogIsEnabled && console && this.isFunction(console.log)) { // eslint-disable-line no-console
		if (this.isString(data)) {
			console.log((new Date()).getTime() + " : " + constDebugInConsolePrependWith + data); // eslint-disable-line no-console
		} else {
			console.log(data); // eslint-disable-line no-console
		}
	}
};

exports.logError = function (data) {
	if (refThis.debugLogIsEnabled && console && this.isFunction(console.log)) { // eslint-disable-line no-console
		if (this.isString(data)) {
			console.error((new Date()).getTime() + " : " + constDebugInConsolePrependWith + data); // eslint-disable-line no-console
		} else {
			console.error(data); // eslint-disable-line no-console
		}
	}
};

exports.logWarning = function (data) {
	if (refThis.debugLogIsEnabled && console && this.isFunction(console.log)) { // eslint-disable-line no-console
		if (this.isString(data)) {
			console.warn((new Date()).getTime() + " : " + constDebugInConsolePrependWith + data); // eslint-disable-line no-console
		} else {
			console.warn(data); // eslint-disable-line no-console
		}
	}
};

exports.error = function (data) {
	console.log((new Date()).getTime() + " : " + constErrorInConsolePrependWith, data); // eslint-disable-line no-console
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

exports.getTopFrameOfSameDomain = function (cWin) {
	try {
		/* istanbul ignore else */
		if (cWin.parent.document != cWin.document) {
			return refThis.getTopFrameOfSameDomain(cWin.parent);
		}
	} catch (e) {
		// continue regardless of error
	}
	return cWin;
};

exports.metaInfo = {};

exports.getMetaInfo = function (cWin) {
	var obj = {},
		MAX_PAGE_URL_LEN = 512,
		frame;

	obj.pageURL = "";
	obj.refURL = "";
	obj.protocol = "https://";
	obj.secure = 1;
	obj.isInIframe = refThis.isIframe(cWin);

	try {
		frame = refThis.getTopFrameOfSameDomain(cWin);
		obj.refURL = (frame.refurl || frame.document.referrer || "").substr(0, MAX_PAGE_URL_LEN);
		obj.pageURL = (frame !== window.top && frame.document.referrer != "" ? frame.document.referrer : frame.location.href).substr(0, MAX_PAGE_URL_LEN);

		obj.protocol = (function (frame) {
			/* istanbul ignore else */
			if (frame.location.protocol === "http:") {
				obj.secure = 0;
				return "http://";
			}
			obj.secure = 1;
			return "https://";
		})(frame);

	} catch (e) {
		// continue regardless of error
	}

	obj.pageDomain = refThis.getDomainFromURL(obj.pageURL);

	refThis.metaInfo = obj;

	return obj;
};

exports.isIframe = function (theWindow) {
	try {
		return theWindow.self !== theWindow.top;
	} catch (e) {
		return false;
	}
};

exports.findQueryParamInURL = function (url, name) {
	return refThis.isOwnProperty(refThis.parseQueryParams(url), name);
};

exports.parseQueryParams = function (url) {
	var parser = refThis.createDocElement(window, "a");
	parser.href = url;
	var params = {};

	/* istanbul ignore else */
	if (parser.search) {
		var queryString = parser.search.replace("?", "");
		queryString = queryString.split("&");
		refThis.forEachOnArray(queryString, function (index, keyValue) {
			keyValue = keyValue.split("=");
			var key = keyValue[0] || "";
			var value = keyValue[1] || "";
			params[key] = value;
		});
	}

	return params;
};


exports.createDocElement = function (win, elementName) {
	return win.document.createElement(elementName);
};

exports.addHookOnFunction = function (theObject, useProto, functionName, newFunction) {
	var callMethodOn = theObject;
	theObject = useProto ? theObject.__proto__ : theObject;
	if (refThis.isObject(theObject) && refThis.isFunction(theObject[functionName])) {
		var originalFunction = theObject[functionName];
		theObject[functionName] = newFunction(callMethodOn, originalFunction);
	} else {
		refThis.logWarning("in assignNewDefination: oldReference is not a function");
	}
};

exports.getUserIdConfiguration = function () {
	var userIdConfs = [];
	refThis.forEachOnObject(CONFIG.getIdentityPartners(), function (parterId, partnerValues) {
		if (!CONSTANTS.EXCLUDE_PARTNER_LIST.includes(parterId)) {
			userIdConfs.push(refThis.getUserIdParams(partnerValues));
		}
	});
	refThis.log(CONSTANTS.MESSAGES.IDENTITY.M4 + JSON.stringify(userIdConfs));
	return userIdConfs;
};

exports.getUserIdParams = function (params) {
	var userIdParams = {};
	refThis.applyDataTypeChangesIfApplicable(params);
	refThis.applyCustomParamValuesfApplicable(params);
	owpbjs.onSSOLogin({});
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
			refThis.logWarning(CONSTANTS.MESSAGES.IDENTITY.M3, ex);
		}
	}
	if (userIdParams && userIdParams.params && userIdParams.params["loadATS"] == "true") {
		refThis.initLiveRampAts(userIdParams); 
	}
	if(userIdParams && userIdParams.params && userIdParams.params['loadIDP'] == 'true'){
		refThis.initZeoTapJs(userIdParams);
	}
	return userIdParams;
};

exports.getUserIds = function () {
	if (refThis.isFunction(window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIds)) {
		return window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIds();
	} else {
		refThis.logWarning("getUserIds" + CONSTANTS.MESSAGES.IDENTITY.M6);
	}
};

exports.getDomainFromURL = function (url) {
	var a = window.document.createElement("a");
	a.href = url;
	return a.hostname;
};

exports.handleHook = function (hookName, arrayOfDataToPass) {
	// Adding a hook for publishers to modify the data we have
	if (refThis.isFunction(window.PWT[hookName])) {
		refThis.log("For Hook-name: " + hookName + ", calling window.PWT." + hookName + "function.");
		window.PWT[hookName].apply(window.PWT, arrayOfDataToPass);
	}
	// else {
	// 	refThis.log('Hook-name: '+hookName+', window.PWT.'+hookName+' is not a function.' );
	// }
};

exports.forEachOnArray = function (theArray, callback) {
	/* istanbul ignore else */
	if (!refThis.isArray(theArray)) {
		return;
	}

	/* istanbul ignore else */
	if (!refThis.isFunction(callback)) {
		return;
	}

	for (var index = 0, arrayLength = theArray.length; index < arrayLength; index++) {
		callback(index, theArray[index]);
	}
};

exports.getUserIdsAsEids = function () {
	if (refThis.isFunction(window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIdsAsEids)) {
		return window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIdsAsEids();
	} else {
		refThis.logWarning("getUserIdsAsEids" + CONSTANTS.MESSAGES.IDENTITY.M6);
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
			break;
		case 'direct':
			var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
			atsObject.emailHashes = emailHash && [emailHash['MD5'], emailHash['SHA1'], emailHash['SHA256']] || undefined;
			/* do we want to keep sso data under direct option?
			if yes, if sso is enabled and 'direct' is selected as detection mechanism, sso emails will be sent to ats script.
			if sso is disabled, and 'direct' is selected as detection mechanism, we will look for publisher provided email ids, and if available the hashes will be sent to ats script.
			*/
			if (enableCustomId && refThis.isFunction(owpbjs.getUserIdentities) && owpbjs.getUserIdentities() !== undefined) {
				atsObject.customerID = owpbjs.getUserIdentities().customerID || undefined;
			}
			break;
	};
	return atsObject;
};

exports.initLiveRampAts = function (params) {
	function addATS() {
		var atsScript = document.createElement("script");
		var atsObject = refThis.getLiverampParams(params);
		atsScript.onload = function () {
			console.log("object sent to ats script - ", atsObject);
			window.ats.start(atsObject);
		};
		atsScript.src = "https://ats.rlcdn.com/ats.js";
		document.body.appendChild(atsScript);
	}
	if (document.readyState == 'complete') {
		addATS();
	} else {
		window.addEventListener("load", function () {
			setTimeout(addATS, 1000);
		});
	}
};

exports.initZeoTapJs = function(params) {
	function addZeoTapJs() {
		var n = document, t = window;
		var userIdentity = owpbjs.getUserIdentities() || {};
		var userIdentityObject = {
			email: userIdentity.emailHash || ""
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

exports.updateAdUnits = function (adUnits) {
	if (refThis.isArray(adUnits)) {
		adUnits.forEach(function (adUnit) {
			adUnit.bids.forEach(function (bid) {
				refThis.updateUserIds(bid);
			});
		});
	} else if (!refThis.isEmptyObject(adUnits)) {
		adUnits.bids.forEach(function (bid) {
			refThis.updateUserIds(bid);
		});
	}
};

exports.updateUserIds = function (bid) {
	// refThis.idsAppendedToAdUnits =true;
	if (refThis.isUndefined(bid.userId)) {
		bid["userId"] = refThis.getUserIds();
	} else if (bid.userId) {
		/* istanbul ignore next */
		bid.userId = Object.assign(bid.userId, refThis.getUserIds());
	}
	if (refThis.isUndefined(bid.userIdAsEids)) {
		bid["userIdAsEids"] = refThis.getUserIdsAsEids();
	} else if (refThis.isArray(bid.userIdAsEids)) {
		var idsPresent = new Set();
		var ids = refThis.getUserIdsAsEids().concat(bid.userIdAsEids);
		if (refThis.isArray(ids) && ids.length > 0) {
			ids = ids.filter(function (id) {
				if (id.source) {
					if (idsPresent.has(id.source)) {
						return false;
					}
					idsPresent.add(id.source);
				}
				return true;

			});
		}
		bid.userIdAsEids = ids;
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

exports.getOWConfig = function(){
	var obj = {
		"openwrap_version": CONFIG[CONSTANTS.COMMON.OWVERSION],
		"prebid_version":CONFIG[CONSTANTS.COMMON.PBVERSION],
		"profileId": CONFIG.getProfileID(),
		"profileVersionId": CONFIG.getProfileDisplayVersionID()
	};
	return obj;
};
