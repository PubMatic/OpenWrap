/*global Set*/

var CONFIG = require("./config.idhub.js");
var CONSTANTS = require("./constants.js");
var USERID_MODULE_PARAMS = require("./build.conf.js");
var SCRIPTS = require("./thirdparty/scripts.js")
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
var pbNameSpace = CONFIG.isIdentityOnly() ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE;
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

exports.getUserIdBuildConfiguration = function () {
	var userIdConfs = Object.values(USERID_MODULE_PARAMS.buildConfig.userIdConfigs);
	window[pbNameSpace].onSSOLogin({});
	refThis.callThirdPartyScripts();
	refThis.log(CONSTANTS.MESSAGES.IDENTITY.M4 + JSON.stringify(userIdConfs));
	return userIdConfs;
};

exports.callThirdPartyScripts = function () {
	var scripts = [];
	USERID_MODULE_PARAMS.buildConfig.userIdModuleScripts.forEach(function (configParams) {
		var userIdModule = configParams.name;
		switch (userIdModule) {
			case "identityLink":
				SCRIPTS && configParams.params.loadATS === "true" && scripts.push(SCRIPTS.initLiveRampAts(configParams, pbNameSpace))
				SCRIPTS && configParams.custom && configParams.custom.loadLaunchPad === "true" && scripts.push(SCRIPTS.initLiveRampLaunchPad(configParams, pbNameSpace))
				break;
			case "publinkId":
				SCRIPTS && scripts.push(SCRIPTS.initLauncherJs(configParams, pbNameSpace))
				break;
			case "zeoTap":
				SCRIPTS && SCRIPTS.initZeoTapJs(configParams, pbNameSpace);
			default:
		}
	});
	if (document.readyState == 'complete') {
		refThis.loadScripts(scripts);
	} else {
		window.addEventListener("load", function () {
			setTimeout(refThis.loadScripts.bind(null, scripts), 1000);
		})
	}
}

exports.loadScript = function (script) {
	(function (e, document) {
		var r = document.createElement("script")
		r.type = "text/javascript"
		for (var attr in script) {
			var val = script[attr]
			if (typeof val === "boolean") {
				if (val) r.setAttribute(attr, val)
			} else if (typeof val === "string") {
				r.setAttribute(attr, val)
			} else if (typeof val === "function") {
				r.setAttribute(attr, val)
			}
		}
		document.body.appendChild(r)
		if (script.onload && typeof script.onload === "function") {
			r.onload = script.onload
		}
	})(window, document)
}

exports.loadScripts = function (scripts) {
	for (var index in scripts) {
		var script = scripts[index]
		refThis.loadScript(script)
	}
};
exports.getUserIds = function () {
	if (refThis.isFunction(window[pbNameSpace].getUserIds)) {
		return window[pbNameSpace].getUserIds();
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
	if (refThis.isFunction(window.IHPWT[hookName])) {
		refThis.log("For Hook-name: " + hookName + ", calling window.IHPWT." + hookName + "function.");
		window.IHPWT[hookName].apply(window.IHPWT, arrayOfDataToPass);
	}
	// else {
	// 	refThis.log('Hook-name: '+hookName+', window.IHPWT.'+hookName+' is not a function.' );
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
	if (refThis.isFunction(window[pbNameSpace].getUserIdsAsEids)) {
		return window[pbNameSpace].getUserIdsAsEids();
	} else {
		refThis.logWarning("getUserIdsAsEids" + CONSTANTS.MESSAGES.IDENTITY.M6);
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

exports.getOWConfig = function () {
	var obj = {
		"openwrap_version": CONFIG[CONSTANTS.COMMON.OWVERSION],
		"prebid_version": CONFIG[CONSTANTS.COMMON.PBVERSION],
		"profileId": CONFIG.getProfileID(),
		"profileVersionId": CONFIG.getProfileDisplayVersionID()
	};
	return obj;
};
