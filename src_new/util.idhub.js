//todo
//  pageURL refURL protocol related functions
// forEachOnArray
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

exports.isNumber = function(object) {
	return refThis.isA(object, typeNumber);
};

exports.isObject = function(object){
	return typeof object === "object" && object !== null;
};

exports.isOwnProperty = function(theObject, proertyName){
	/* istanbul ignore else */
	if(refThis.isObject(theObject) && theObject.hasOwnProperty){
		return theObject.hasOwnProperty(proertyName);
	}
	return false;
};

exports.isUndefined = function(object){
	return typeof object === "undefined";
};

exports.enableDebugLog = function(){
	refThis.debugLogIsEnabled = true;
};

exports.isDebugLogEnabled = function(){
	return refThis.debugLogIsEnabled;
};

exports.enableVisualDebugLog = function(){
	refThis.debugLogIsEnabled = true;
	refThis.visualDebugLogIsEnabled = true;
};

exports.isEmptyObject= function(object){
	return refThis.isObject(object) && Object.keys(object).length === 0;
};

//todo: move...
var constDebugInConsolePrependWith = "[OpenWrap] : ";
var constErrorInConsolePrependWith = "[OpenWrap] : [Error]";


exports.log = function(data){
	if( refThis.debugLogIsEnabled && console && this.isFunction(console.log) ){ // eslint-disable-line no-console
		if(this.isString(data)){
			console.log( (new Date()).getTime()+ " : " + constDebugInConsolePrependWith + data ); // eslint-disable-line no-console
		}else{
			console.log(data); // eslint-disable-line no-console
		}
	}
};

exports.logError = function(data){
	if( refThis.debugLogIsEnabled && console && this.isFunction(console.log) ){ // eslint-disable-line no-console
		if(this.isString(data)){
			console.error( (new Date()).getTime()+ " : " + constDebugInConsolePrependWith + data ); // eslint-disable-line no-console
		}else{
			console.error(data); // eslint-disable-line no-console
		}
	}
};

exports.logWarning = function(data){
	if( refThis.debugLogIsEnabled && console && this.isFunction(console.log) ){ // eslint-disable-line no-console
		if(this.isString(data)){
			console.warn( (new Date()).getTime()+ " : " + constDebugInConsolePrependWith + data ); // eslint-disable-line no-console
		}else{
			console.warn(data); // eslint-disable-line no-console
		}
	}
};

exports.error = function(data){
	console.log( (new Date()).getTime()+ " : " + constErrorInConsolePrependWith, data ); // eslint-disable-line no-console
};

exports.forEachOnObject = function(theObject, callback){
	/* istanbul ignore else */
	if(!refThis.isObject(theObject)){
		return;
	}

	/* istanbul ignore else */
	if(!refThis.isFunction(callback)){
		return;
	}

	for(var key in theObject){
		/* istanbul ignore else */
		if(refThis.isOwnProperty(theObject, key)){
			callback(key, theObject[key]);
		}
	}
};

exports.getTopFrameOfSameDomain = function(cWin) {
	try {
		/* istanbul ignore else */
		if (cWin.parent.document != cWin.document){
		  return refThis.getTopFrameOfSameDomain(cWin.parent);
		}
	} catch(e) {}
	return cWin;
};

exports.metaInfo = {};

exports.getMetaInfo = function(cWin){
	var  obj = {}
		, MAX_PAGE_URL_LEN = 512
		, frame
		;

	obj.pageURL = "";
	obj.refURL = "";
	obj.protocol = "https://";
	obj.secure = 1;
	obj.isInIframe = refThis.isIframe(cWin);

	try{
		frame = refThis.getTopFrameOfSameDomain(cWin);
		obj.refURL = ( frame.refurl || frame.document.referrer || '' ).substr( 0, MAX_PAGE_URL_LEN );
		obj.pageURL = ( frame !== window.top && frame.document.referrer != ""  ? frame.document.referrer : frame.location.href).substr(0, MAX_PAGE_URL_LEN );

		obj.protocol = (function(frame){
			/* istanbul ignore else */
			if(frame.location.protocol ===  "http:"){
				obj.secure = 0;
				return "http://";
			}
			obj.secure = 1;
			return "https://";
		})(frame);

	}catch(e){}

	obj.pageDomain = refThis.getDomainFromURL(obj.pageURL);

	refThis.metaInfo = obj;

	return obj;
};

exports.isIframe = function(theWindow){
	try{
		return theWindow.self !== theWindow.top;
	}catch(e){
		return false;
	}
};

exports.findQueryParamInURL = function(url, name){
	return refThis.isOwnProperty(refThis.parseQueryParams(url), name);
};

exports.parseQueryParams = function(url){
	var parser = refThis.createDocElement(window, 'a');
	parser.href = url;
	var params = {};

	/* istanbul ignore else */
	if(parser.search){
		var queryString = parser.search.replace('?', '');
		queryString = queryString.split('&');
		refThis.forEachOnArray(queryString, function(index, keyValue){
			var keyValue = keyValue.split('=');
			var key = keyValue[0] || '';
			var value = keyValue [1] || '';
			params[key] = value;
		});
	}

	return params;
};


exports.createDocElement = function(win, elementName) {
	return win.document.createElement(elementName);
};

exports.addHookOnFunction = function(theObject, useProto, functionName, newFunction){
	var callMethodOn = theObject;
	theObject = useProto ? theObject.__proto__ : theObject;
	if(refThis.isObject(theObject) && refThis.isFunction(theObject[functionName])){
		var originalFunction = theObject[functionName];
		theObject[functionName] = newFunction(callMethodOn, originalFunction);
	}else{
		refThis.logWarning("in assignNewDefination: oldReference is not a function");
	}
};

exports.getUserIdConfiguration = function(){
	var userIdConfs = [];
	refThis.forEachOnObject(CONFIG.getIdentityPartners(),function(parterId, partnerValues){
		userIdConfs.push(refThis.getUserIdParams(partnerValues));
	});
	refThis.log(CONSTANTS.MESSAGES.IDENTITY.M4+ JSON.stringify(userIdConfs));
	return userIdConfs;
};

exports.getUserIdParams = function(params){
	var userIdParams= {};
	for(var key in params){
		try{
			if(CONSTANTS.EXCLUDE_IDENTITY_PARAMS.indexOf(key) == -1) {
				if(CONSTANTS.TOLOWERCASE_IDENTITY_PARAMS.indexOf(key)>-1){
					params[key] = params[key].toLowerCase();
				}
				if(CONSTANTS.JSON_VALUE_KEYS.indexOf(key)>-1){
					params[key] = JSON.parse(params[key]);
				}
				userIdParams = refThis.getNestedObjectFromString(userIdParams,".",key,params[key]);
			}
		}
		catch(ex){
			refThis.logWarning(CONSTANTS.MESSAGES.IDENTITY.M3, ex);
		}
	}	
	if(userIdParams && userIdParams.params && userIdParams.params['loadATS'] == 'true'){
		refThis.initLiveRampAts(userIdParams);
	}
	return userIdParams;
};

exports.getUserIds = function(){
	if(refThis.isFunction(window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIds)) {
		return window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIds();
	} else{
		refThis.logWarning("getUserIds" + CONSTANTS.MESSAGES.IDENTITY.M6);
	};
};
