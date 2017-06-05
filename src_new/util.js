//todo
//  pageURL refURL protocol related functions

var CONSTANTS = require("./constants.js");
var BID = require("./bid.js");
var bidManager = require("./bidManager.js");

var debugLogIsEnabled = false;
var typeArray = "Array";
var typeString = "String";
var typeFunction = "Function";
var typeNumber = "Number";
var toString = Object.prototype.toString;

function isA(object, testForType) {
	return toString.call(object) === "[object " + testForType + "]";
}

/* start-test-block */
exports.isA = isA;
/* end-test-block */

exports.isFunction = function (object) {
	return isA(object, typeFunction);
};

exports.isString = function (object) {
	return isA(object, typeString);
};

exports.isArray = function (object) {
	return isA(object, typeArray);
};

exports.isNumber = function(object) {
	return isA(object, typeNumber);
};

exports.isObject = function(object){
	return typeof object === "object" && object !== null;
};

exports.isOwnProperty = function(theObject, proertyName){
	if(theObject.hasOwnProperty){
		return theObject.hasOwnProperty(proertyName);	
	}
	return false;
};

exports.isUndefined = function(object){
	return typeof object === "undefined";
};

exports.enableDebugLog = function(){
	debugLogIsEnabled = true;
};

//todo: move...
var constDebugInConsolePrependWith = "-------------------------";

exports.log = function(data){
	if( debugLogIsEnabled && console && this.isFunction(console.log) ){ // eslint-disable-line no-console
		if(this.isString(data)){
			console.log( (new Date()).getTime()+ " : " + constDebugInConsolePrependWith + data ); // eslint-disable-line no-console
		}else{
			console.log(data); // eslint-disable-line no-console
		}
	}
};

exports.getCurrentTimestampInMs = function(){
	var date = new Date();
	return date.getTime();
};

exports.getCurrentTimestamp = function(){
	var date = new Date();
	return Math.round( date.getTime()/1000 );
};

var utilGetIncrementalInteger = (function() {
	var count = 0;
	return function() {
		count++;
		return count;
	};
})();

exports.getUniqueIdentifierStr = function() {
	return utilGetIncrementalInteger() + Math.random().toString(16).substr(2);
};

exports.copyKeyValueObject = function(copyTo, copyFrom){
	if(this.isObject(copyTo) && this.isObject(copyFrom)){
		for(var key in copyFrom){    
			copyFrom[key] = this.isArray(copyFrom[key]) ? copyFrom[key] : [copyFrom[key]];
			if(this.isOwnProperty(copyFrom, key)){
				if(this.isOwnProperty(copyTo, key)){
					copyTo[key].push.apply(copyTo[key], copyFrom[key])  ;
				}else{
					copyTo[key] = copyFrom[key];
				}
			}
		}
	}
};

exports.protocol = "https://"; //todo need a set method
exports.pageURL = "http://abc.com/ljljl/abc"; //todo removed

exports.getIncrementalInteger = (function() {
	var count = 0;
	return function() {
		count++;
		return count;
	};
})();

exports.generateUUID = function(){
	var d = new Date().getTime(),
      // todo: this.pageURL ???
		url = decodeURIComponent(this.pageURL).toLowerCase().replace(/[^a-z,A-Z,0-9]/gi, ""),
		urlLength = url.length
		;

    //todo: uncomment it,  what abt performance
    //if(win.performance && this.isFunction(win.performance.now)){
    //    d += performance.now();
    //}

	var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-zzzzz".replace(/[xyz]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		var op;
		switch(c){
		case "x":
			op = r;
			break;
		case "z":
			op = url[Math.floor(Math.random()*urlLength)];
			break;
		default:
			op = (r&0x3|0x8);
		}

		return op.toString(16);
	});

	return uuid;
};

var macroRegexFlag = macroRegexFlag;
var constCommonMacroForWidthRegExp = new RegExp(CONSTANTS.MACROS.WIDTH, macroRegexFlag);
var constCommonMacroForHeightRegExp = new RegExp(CONSTANTS.MACROS.HEIGHT, macroRegexFlag);
var constCommonMacroForAdUnitIDRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_ID, macroRegexFlag);
var constCommonMacroForAdUnitIndexRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_INDEX, macroRegexFlag);
var constCommonMacroForIntegerRegExp = new RegExp(CONSTANTS.MACROS.INTEGER, macroRegexFlag);
var constCommonMacroForDivRegExp = new RegExp(CONSTANTS.MACROS.DIV, macroRegexFlag);

exports.generateSlotNamesFromPattern = function(activeSlot, pattern){  
	var slotNames = [],
		slotName,
		slotNamesObj = {},
		sizeArrayLength,
		i
		;
  
	if(activeSlot && activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES]){
		sizeArrayLength = activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES].length;
		if( sizeArrayLength > 0){
			for(i = 0; i < sizeArrayLength; i++){
				if(activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][0] && activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][1]){

					slotName = pattern;
					slotName = slotName.replace(constCommonMacroForAdUnitIDRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_ID])
                    .replace(constCommonMacroForWidthRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][0])
                    .replace(constCommonMacroForHeightRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][1])
                    .replace(constCommonMacroForAdUnitIndexRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_INDEX])
                    .replace(constCommonMacroForIntegerRegExp, this.getIncrementalInteger())
                    .replace(constCommonMacroForDivRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID]);

					if(! this.isOwnProperty(slotNamesObj, slotName)){
						slotNamesObj[slotName] = "";
						slotNames.push(slotName);
					}
				}
			}
		}
	}

	return slotNames;
};

//todo: is it required ?
exports.checkMandatoryParams = function(object, keys, adapterID){
	var error = false,
		success = true
	;

	if(!object || !this.isObject(object) || this.isArray(object)){
		this.log(adapterID + "provided object is invalid.");
		return error;
	}

	if(!this.isArray(keys)){
		this.log(adapterID + "provided keys must be in an array.");
		return error;
	}

	var arrayLength = keys.length;
	if(arrayLength == 0){
		return success;
	}

	for(var i=0; i<arrayLength; i++){
		if(!this.isOwnProperty(object, keys[i])){
			this.log(adapterID + ": "+keys[i]+", mandatory parameter not present.");
			return error;
		}
	}

	return success;
};

exports.forEachGeneratedKey = function(adapterID, slotConfigMandatoryParams, activeSlots, keyGenerationPattern, keyLookupMap, handlerFunction, addZeroBids){
	var activeSlotsLength = activeSlots.length,
		i,
		j,
		generatedKeys,
		generatedKeysLength,
		kgpConsistsWidthAndHeight
		;

	if(activeSlotsLength > 0 && keyGenerationPattern.length > 3){
		kgpConsistsWidthAndHeight = keyGenerationPattern.indexOf(CONSTANTS.MACROS.WIDTH) >= 0 && keyGenerationPattern.indexOf(CONSTANTS.MACROS.HEIGHT) >= 0;
		for(i = 0; i < activeSlotsLength; i++){
			generatedKeys = this.generateSlotNamesFromPattern( activeSlots[i], keyGenerationPattern );
			generatedKeysLength = generatedKeys.length;
			for(j = 0; j < generatedKeysLength; j++){
				var generatedKey = generatedKeys[j],
					keyConfig = null,
					callHandlerFunction = false
					;

				if(keyLookupMap == null){
					callHandlerFunction = true;
				}else{
					keyConfig = keyLookupMap[generatedKey];
					if(!keyConfig){
						this.log(adapterID+": "+generatedKey+CONSTANTS.MESSAGES.M8);
					}else if(!this.checkMandatoryParams(keyConfig, slotConfigMandatoryParams, adapterID)){
						this.log(adapterID+": "+generatedKey+CONSTANTS.MESSAGES.M9);
					}else{
						callHandlerFunction = true;
					}
				}

				if(callHandlerFunction){

					if(addZeroBids == true){
						var bid = BID.createBid(adapterID, generatedKey);
						bid.setDefaultBidStatus(1);
						bidManager.setBidFromBidder(activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], bid);
					}

					handlerFunction(
            generatedKey, 
            kgpConsistsWidthAndHeight, 
            activeSlots[i], 
            keyLookupMap ? keyLookupMap[generatedKey] : null, 
            activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.SIZES][j][0], 
            activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.SIZES][j][1]
          );
				} 
			}
		}
	}
};

exports.resizeWindow = function(theDocument, width, height){
	if(height && width){
		try{
			var fr = theDocument.defaultView.frameElement;
			fr.width = width;
			fr.height = height;
		}catch(e){} // eslint-disable-line no-empty
	}
};

exports.writeIframe = function(theDocument, src, width, height, style){     
	theDocument.write("<iframe"                   
    + " frameborder=\"0\" allowtransparency=\"true\" marginheight=\"0\" marginwidth=\"0\" scrolling=\"no\" width=\""
    + width  + "\" hspace=\"0\" vspace=\"0\" height=\""
    + height + "\"" 
    + (style ?  " style=\""+ style+"\"" : "" )
    + " src=\"" + src + "\""        
    + "></ifr" + "ame>");
};

exports.displayCreative = function(theDocument, bid){
	this.resizeWindow(theDocument, bid.getWidth(), bid.getHeight());
	if(bid.getAdHtml()){
		theDocument.write(bid.getAdHtml());
	}else if(bid.getAdUrl()){
		this.writeIframe(theDocument, bid.getAdUrl(), bid.getWidth(), bid.getHeight(), "");
	}else{
		this.log("creative details are not found");
		this.log(bid);
	}
};

exports.getScreenWidth = function(win){
	var screenWidth = -1;
	win.innerHeight ? (screenWidth = win.innerWidth) : win.document && win.document.documentElement && win.document.documentElement.clientWidth ? (screenWidth = win.document.documentElement.clientWidth) : win.document.body && (screenWidth = win.document.body.clientWidth);
	return screenWidth;
};

exports.getScreenHeight = function(win){
	var screenHeight = -1;
	win.innerHeight ? (screenHeight = win.innerHeight) : win.document && win.document.documentElement && win.document.documentElement.clientHeight ? (screenHeight = win.document.documentElement.clientHeight) : win.document.body && (screenHeight = win.document.body.clientHeight);
	return screenHeight;
};

// todo: how about accepting array of arguments to be passed to callback function after key, value, arrayOfArguments
exports.forEachOnObject = function(theObject, callback){
	if(!this.isObject(theObject)){
		return;
	}

	if(!this.isFunction(callback)){
		return;
	}

	for(var key in theObject){
		if(this.isOwnProperty(theObject, key)){
			callback(key, theObject[key]);
		}
	}
};

exports.trim = function(s){
	if(!this.isString(s)){
		return s;
	}else{
		return s.replace(/^\s+/g,"").replace(/\s+$/g,"");
	}
};

exports.isIframe = function(theWindow){
	try{
		return theWindow.self !== theWindow.top;
	}catch(e){
		return false;
	}
};

exports.getProtocol = function(theWindow){
	if(theWindow.location.protocol ===  "https:"){
		return "https://";
	}
	return "http://";
};

exports.getPageURL = function(theWindow){
	return "";
};

exports.findInString = function(theString, find){
	return theString.indexOf(find) >= 0;
};

exports.addHookOnFunction = function(theObject, useProto, functionName, newFunction){  
	var callMethodOn = theObject;
	theObject = useProto ? theObject.__proto__ : theObject;
	if(this.isObject(theObject) && this.isFunction(theObject[functionName])){
		var originalFunction = theObject[functionName];
		theObject[functionName] = newFunction(callMethodOn, originalFunction);
	}else{
		this.log("in assignNewDefination: oldReference is not a function");
	}
};