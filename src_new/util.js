//todo
//  pageURL refURL protocol related functions
// forEachOnArray
var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
var conf = require("./conf.js");
var BID = require("./bid.js");
var bidManager = require("./bidManager.js");

var debugLogIsEnabled = false;

/* start-test-block */
exports.debugLogIsEnabled = debugLogIsEnabled;
/* end-test-block */
var visualDebugLogIsEnabled = false;

/* start-test-block */
exports.visualDebugLogIsEnabled = visualDebugLogIsEnabled;
/* end-test-block */
var typeArray = "Array";
var typeString = "String";
var typeFunction = "Function";
var typeNumber = "Number";
var toString = Object.prototype.toString;
var refThis = this;
refThis.idsAppendedToAdUnits = false;
var mediaTypeConfigPerSlot = {};
exports.mediaTypeConfig = mediaTypeConfigPerSlot;
var pbNameSpace = parseInt(conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] || CONSTANTS.CONFIG.DEFAULT_IDENTITY_ONLY) ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE;
exports.pbNameSpace = pbNameSpace;
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

exports.getCurrentTimestampInMs = function(){
	var date = new window.Date();
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

/* start-test-block */
exports.utilGetIncrementalInteger = utilGetIncrementalInteger;
/* end-test-block */

exports.getUniqueIdentifierStr = function() {
	return utilGetIncrementalInteger() + window.Math.random().toString(16).substr(2);
};

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.copyKeyValueObject = function(copyTo, copyFrom){
	/* istanbul ignore else */
	if(refThis.isObject(copyTo) && refThis.isObject(copyFrom)){
		var utilRef = refThis;
		refThis.forEachOnObject(copyFrom, function(key, value){
			copyFrom[key] = utilRef.isArray(value) ? value : [value];
			if(utilRef.isOwnProperty(copyTo, key)){
				// copyTo[key].push.apply(copyTo[key], value);
				if (!refThis.isArray(copyTo[key])) {
					var temp = copyTo[key];
					copyTo[key] = [temp];
				}
				copyTo[key].push(value);
			}else{
				copyTo[key] = [value];
			}
		});
	}
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

exports.getIncrementalInteger = (function() {
	var count = 0;
	return function() {
		count++;
		return count;
	};
})();

exports.generateUUID = function(){
	var d = new window.Date().getTime(),
      // todo: this.pageURL ???
		url = window.decodeURIComponent(this.pageURL).toLowerCase().replace(/[^a-z,A-Z,0-9]/gi, ""),
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

var macroRegexFlag = "g";
var constCommonMacroForWidthRegExp = new RegExp(CONSTANTS.MACROS.WIDTH, macroRegexFlag);
var constCommonMacroForHeightRegExp = new RegExp(CONSTANTS.MACROS.HEIGHT, macroRegexFlag);
var constCommonMacroForAdUnitIDRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_ID, macroRegexFlag);
var constCommonMacroForAdUnitIndexRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_INDEX, macroRegexFlag);
var constCommonMacroForIntegerRegExp = new RegExp(CONSTANTS.MACROS.INTEGER, macroRegexFlag);
var constCommonMacroForDivRegExp = new RegExp(CONSTANTS.MACROS.DIV, macroRegexFlag);

exports.generateSlotNamesFromPattern = function(activeSlot, pattern, shouldCheckMappingForVideo, videoSlotName){
	var slotNames = [],
		slotName,
		slotNamesObj = {},
		sizeArray,
		sizeArrayLength,
		i
		;
  	/* istanbul ignore else */
	if(refThis.isObject(activeSlot) && refThis.isFunction(activeSlot.getSizes)){
		sizeArray = activeSlot.getSizes();
		var divId = refThis.isFunction(activeSlot.getDivID) ? activeSlot.getDivID() : activeSlot.getSlotId().getDomId();		
		if(shouldCheckMappingForVideo){
			//TODO: remove below line and update above live for assigning sizeArray after remove phantom js and including chromeheadless
			// This adds an size 0x0 to sizes so that multiple kgpvs can be generated
			sizeArray = [].concat(activeSlot.getSizes());
			var config = refThis.mediaTypeConfig[divId];
			if(config && config.video){
				sizeArray.unshift([0,0]);
			}
		}
		sizeArrayLength = sizeArray.length;
		/* istanbul ignore else */
		if( sizeArrayLength > 0){
			for(i = 0; i < sizeArrayLength; i++){
				/* istanbul ignore else */
				if((sizeArray[i].length == 2 && (sizeArray[i][0] && sizeArray[i][1]) || (sizeArray[i][0] == 0 && sizeArray[i][1] ==0)) || (refThis.isFunction(sizeArray[i].getWidth) && refThis.isFunction(sizeArray[i].getHeight))){					var adUnitId = refThis.isFunction(activeSlot.getAdUnitID) ? activeSlot.getAdUnitID() : activeSlot.getSlotId().getAdUnitPath();
					var divId = refThis.isFunction(activeSlot.getDivID) ? activeSlot.getDivID() : activeSlot.getSlotId().getDomId();
					var adUnitIndex = refThis.isFunction(activeSlot.getAdUnitIndex) ? activeSlot.getAdUnitIndex() : activeSlot.getSlotId().getId().split("_")[1];
					var width = sizeArray[i][0] == 0 ? 0 : sizeArray[i][0] || sizeArray[i].getWidth();
					var height = sizeArray[i][1] == 0 ? 0 : sizeArray[i][1] || sizeArray[i].getHeight();
					slotName = pattern;
					slotName = slotName.replace(constCommonMacroForAdUnitIDRegExp, adUnitId)
                    .replace(constCommonMacroForAdUnitIndexRegExp, adUnitIndex)
                    .replace(constCommonMacroForIntegerRegExp, refThis.getIncrementalInteger())
					.replace(constCommonMacroForDivRegExp, divId)
					.replace(constCommonMacroForWidthRegExp, width)
					.replace(constCommonMacroForHeightRegExp, height);
					
					// if size is 0x0 then we don't want to add it in slotNames since it will be looped in another function
					// we just want to check the config for 0x0 mapping hence updating it in videoSlotName
					/* istanbul ignore else */
					if(width == 0 && height == 0){
						videoSlotName[0] = slotName;
								  /* istanbul ignore else */
					}
					else if(! refThis.isOwnProperty(slotNamesObj, slotName)){ 
						slotNamesObj[slotName] = "";
						slotNames.push(slotName);
					}
				}
			}
		}
	}
	return slotNames;
};

/**
 * todo:
 * 		if direct mapping is not found 
 * 		then look for regex mapping
 * 			separate function to handle regex mapping
 * 			kgp: "" // should be filled with whatever value
 * 			klm: {} // should be filled with records if required else leave it as an empty object {}
 * 			kgp_rx: "" // regex pattern
 * 			klm_rx: [
 * 				{
 * 					rx: "ABC123*",
 * 					rx_config: {} // here goes adapyter config
 * 				}, 
 * 
 * 				{
 * 					rx: "*",
 * 					rx_config: {}
 * 				}
 * 			]
 */

 /**
  *  Algo for Regex and Normal Flow
  * 1. Check for kgp key 
  *   a). If KGP is present for partner then proceed with old flow and no change in that
  *   b). If KGP is not present and kgp_rx is present it is regex flow and proceed with regex flow as below
  * 2. Regex Flow
  * 	a. Generate KGPV's with kgp as _AU_@_DIV_@_W_x_H_
  * 	b. Regex Match each KGPV with KLM_rx 
  * 	c. Get config for the partner 
  *     d. Send the config to prebid and log the same kgpv in logger
  * 
  * Special Case for Pubmatic
  *  1. In case of regex flow we will have hashed keys which will be sent to translator for matching
  *  2. These hashed keys could be same for multiple slot on the page and hence need to check how to send it to prebid for 
  *     identification in prebid resposne.
  */

exports.forEachGeneratedKey = function(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, activeSlots, handlerFunction, addZeroBids){
	var activeSlotsLength = activeSlots.length,
		keyGenerationPattern = adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN] || adapterConfig[CONSTANTS.CONFIG.REGEX_KEY_GENERATION_PATTERN] || "";
	/* istanbul ignore else */
	if(activeSlotsLength > 0 && keyGenerationPattern.length > 3){
		refThis.forEachOnArray(activeSlots, function(i, activeSlot){
			var videoSlotName = [];
			// We are passing videoSlotName because we don't want to update the sizes and just check for 0x0 config if video and banner is both enabeld
			var generatedKeys = refThis.generateSlotNamesFromPattern( activeSlot, keyGenerationPattern, true, videoSlotName);
			if(generatedKeys.length > 0){
				refThis.callHandlerFunctionForMapping(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, generatedKeys, activeSlot, handlerFunction, addZeroBids, keyGenerationPattern, videoSlotName);
			} 		
		});
	}
};

// private
function callHandlerFunctionForMapping(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, generatedKeys, activeSlot, handlerFunction, addZeroBids,keyGenerationPattern, videoSlotName){
	var keyLookupMap = adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || adapterConfig[CONSTANTS.CONFIG.REGEX_KEY_LOOKUP_MAP] || null,
		kgpConsistsWidthAndHeight = keyGenerationPattern.indexOf(CONSTANTS.MACROS.WIDTH) >= 0 && keyGenerationPattern.indexOf(CONSTANTS.MACROS.HEIGHT) >= 0;
	var isRegexMapping = adapterConfig[CONSTANTS.CONFIG.REGEX_KEY_LOOKUP_MAP] ? true : false;
	var regexPattern = undefined;
	const adapterNameForAlias = CONFIG.getAdapterNameForAlias(adapterID);
	var isPubMaticAlias = CONSTANTS.PUBMATIC_ALIASES.indexOf(adapterNameForAlias) > - 1 ? true : false;
	var regExMappingWithNoConfig = false;
	refThis.forEachOnArray(generatedKeys, function(j, generatedKey){
		var keyConfig = null,
			callHandlerFunction = false,
			sizeArray = activeSlot.getSizes()			
			;

		if(keyLookupMap == null){
			// This block executes for pubmatic only where there are no KLM's 
			// Adding this check for pubmatic only to send the correct tagId for Size Level mapping. UOE-6156
			if(videoSlotName && videoSlotName.length == 1){
				generatedKey = videoSlotName[0];
			}
			callHandlerFunction = true;
		}else{
			if(isRegexMapping){
				refThis.debugLogIsEnabled && refThis.log(console.time("Time for regexMatching for key " + generatedKey));
				var config = refThis.getConfigFromRegex(keyLookupMap,generatedKey);
				refThis.debugLogIsEnabled && refThis.log(console.timeEnd("Time for regexMatching for key " + generatedKey));

				if(config){
					keyConfig = config.config;
					regexPattern = config.regexPattern;
				}else{
					// if klm_rx dosen't return any config and if partner is PubMatic alias we need to restrict call to handlerFunction
					// so adding flag regExMappingWithNoConfig below
					regExMappingWithNoConfig = isPubMaticAlias ? true : false;
				}
			}
			else{
				// Added Below Check Because of UOE-5600
				if(videoSlotName && videoSlotName.length == 1){
					// Commented out normal lookup and added below check to remove case sensitive check on videoSlotName[0].
					// keyConfig = keyLookupMap[videoSlotName[0]];
					// keyConfig = keyLookupMap[Object.keys(keyLookupMap).find(key => key.toLowerCase() === videoSlotName[0].toLowerCase())];
					keyConfig = keyLookupMap[Object.keys(keyLookupMap).filter(function(key) {
						return key.toLowerCase() === videoSlotName[0].toLowerCase()
					})];
					// We are updating the generatedKey because we want to log kgpv as 0x0 in case of video 
					if(keyConfig){
						generatedKey = videoSlotName[0];
					}
				}
				if(!keyConfig){
					// Commented out normal lookup and added below check to remove case sensitive check on generatedKey.
					// keyConfig = keyLookupMap[generatedKey];
					keyConfig = keyLookupMap[Object.keys(keyLookupMap).filter(function(key) {
						return key.toLowerCase() === generatedKey.toLowerCase()
					})[0]];
				}
			}
			// condition (!keyConfig && !isPubMaticAlias) will check if keyCofig is undefined and partner is not PubMatic alias then log message to console 
			// with "adapterID+": "+generatedKey+ config not found"
			// regExMappingWithNoConfig will be true only if klm_rx dosen't return config and partner is PubMatic alias then log message to console
			// with "adapterID+": "+generatedKey+ config not found" 
			if((!keyConfig && !isPubMaticAlias) || regExMappingWithNoConfig){
				refThis.log(adapterID+": "+generatedKey+CONSTANTS.MESSAGES.M8);
			}else{
				callHandlerFunction = true;
			}
		}

		/* istanbul ignore else */
		if(callHandlerFunction){
			/* istanbul ignore else */
			if(addZeroBids == true){
				var bid = BID.createBid(adapterID, generatedKey);
				bid.setDefaultBidStatus(1).setReceivedTime(refThis.getCurrentTimestampInMs());
				bidManager.setBidFromBidder(activeSlot.getDivID(), bid);
				bid.setRegexPattern(regexPattern);
			}	
			handlerFunction(
				adapterID,
				adUnits,
				adapterConfig,
				impressionID,
				generatedKey,
				kgpConsistsWidthAndHeight,
				activeSlot,
				refThis.getPartnerParams(keyConfig),
				sizeArray[j][0],
				sizeArray[j][1],
				regexPattern
			);
		}
	});
}
/* start-test-block */
exports.callHandlerFunctionForMapping = callHandlerFunctionForMapping;
/* end-test-block */

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.resizeWindow = function(theDocument, width, height, divId){
	/* istanbul ignore else */
	if(height && width){
		try{
			var defaultViewFrame = theDocument.defaultView.frameElement;
			var elementArray=[];
			if(divId){
				var adSlot = document.getElementById(divId);
				var adSlot_Div = adSlot.querySelector("div");
				elementArray.push(adSlot_Div);
				elementArray.push(adSlot_Div.querySelector("iframe"));
				defaultViewFrame = adSlot.querySelector("iframe");
			}
			elementArray.push(defaultViewFrame);
			elementArray.forEach(function(ele){
				if(ele){
					ele.width ="" +  width;
					ele.height ="" + height;
					ele.style.width = "" + width + "px";
					ele.style.height = "" + height + "px";
				}
			});
		}catch(e){
			refThis.logError("Creative-Resize; Error in resizing creative");
		} // eslint-disable-line no-empty
	}
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.writeIframe = function(theDocument, src, width, height, style){
	theDocument.write("<iframe"
    + " frameborder=\"0\" allowtransparency=\"true\" marginheight=\"0\" marginwidth=\"0\" scrolling=\"no\" width=\""
    + width  + "\" hspace=\"0\" vspace=\"0\" height=\""
    + height + "\""
    + (style ?  " style=\""+ style+"\"" : "" )
    + " src=\"" + src + "\""
    + "></ifr" + "ame>");
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.displayCreative = function(theDocument, bid){
	if(bid && bid.pbbid && bid.pbbid.mediaType == "video" && bid.renderer && refThis.isObject(bid.renderer)){
		if(refThis.isFunction(bid.renderer.render)){
			bid.renderer.render(bid.getPbBid());
		}
	}
	else{
		refThis.resizeWindow(theDocument, bid.width, bid.height);
		if(bid.adHtml){
			bid.adHtml = refThis.replaceAuctionPrice(bid.adHtml, bid.getGrossEcpm());
			theDocument.write(bid.adHtml);
		}else if(bid.adUrl){
			bid.adUrl = refThis.replaceAuctionPrice(bid.adUrl, bid.getGrossEcpm());
			refThis.writeIframe(theDocument, bid.adUrl, bid.width, bid.height, "");
		}else{
			refThis.logError("creative details are not found");
			refThis.logError(bid);
		}
	}
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// todo: how about accepting array of arguments to be passed to callback function after key, value, arrayOfArguments
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

exports.forEachOnArray = function(theArray, callback){
	/* istanbul ignore else */
	if(!refThis.isArray(theArray)){
		return;
	}

	/* istanbul ignore else */
	if(!refThis.isFunction(callback)){
		return;
	}

	for(var index=0, arrayLength= theArray.length; index<arrayLength; index++){
		callback(index, theArray[index]);
	}
};

exports.trim = function(s){
	if(!refThis.isString(s)){
		return s;
	}else{
		return s.replace(/^\s+/g,"").replace(/\s+$/g,"");
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

exports.getBididForPMP = function(values, priorityArray){
	values = values.split(',');

	var valuesLength = values.length,
		priorityArrayLength = priorityArray.length,
		selectedPMPDeal = '',
		bidID = ''
		;

	/* istanbul ignore else */
	if(valuesLength == 0){
		this.log('Error: Unable to find bidID as values array is empty.');
		return;
	}

	for(var i = 0; i < priorityArrayLength; i++){

		for(var j = 0; j < valuesLength; j++){
			if(values[j].indexOf(priorityArray[i]) >= 0){
				selectedPMPDeal = values[j];
				break;
			}
		}

		/* istanbul ignore else */
		if(selectedPMPDeal != ''){
			break;
		}
	}

	if(selectedPMPDeal == ''){
		selectedPMPDeal = values[0];
		this.log('No PMP-Deal was found matching PriorityArray, So Selecting first PMP-Deal: '+ selectedPMPDeal);
	}else{
		this.log('Selecting PMP-Deal: '+ selectedPMPDeal);
	}

	var temp = selectedPMPDeal.split(CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR);
	/* istanbul ignore else */
	if(temp.length == 3){
		bidID = temp[2];
	}

	/* istanbul ignore else */
	if(!bidID){
		this.log('Error: bidID not found in PMP-Deal: '+ selectedPMPDeal);
		return;
	}

	return bidID;
};

function insertElement(elm, doc, target, asLastChildChild) {
	doc = doc || document;
	var parentEl;
	if (target) {
	  parentEl = doc.getElementsByTagName(target);
	} else {
	  parentEl = doc.getElementsByTagName('head');
	}
	try {
	  parentEl = parentEl.length ? parentEl : doc.getElementsByTagName('body');
	  if (parentEl.length) {
		parentEl = parentEl[0];
		var insertBeforeEl = asLastChildChild ? null : parentEl.firstChild;
		return parentEl.insertBefore(elm, insertBeforeEl);
	  }
	} catch (e) {}
}

exports.insertHtmlIntoIframe = function(htmlCode) {
	if (!htmlCode) {
	  return;
	}
  
	var iframe = document.createElement('iframe');
	iframe.id = refThis.getUniqueIdentifierStr();
	iframe.width = 0;
	iframe.height = 0;
	iframe.hspace = '0';
	iframe.vspace = '0';
	iframe.marginWidth = '0';
	iframe.marginHeight = '0';
	iframe.style.display = 'none';
	iframe.style.height = '0px';
	iframe.style.width = '0px';
	iframe.scrolling = 'no';
	iframe.frameBorder = '0';
	iframe.allowtransparency = 'true';
  
	insertElement(iframe, document, 'body');
  
	iframe.contentWindow.document.open();
	iframe.contentWindow.document.write(htmlCode);
	iframe.contentWindow.document.close();
}
  
// removeIf(removeNativeRelatedCode)
exports.createInvisibleIframe = function() {
	var f = refThis.createDocElement(window, 'iframe');
	f.id = refThis.getUniqueIdentifierStr();
	f.height = 0;
	f.width = 0;
	f.border = '0px';
	f.hspace = '0';
	f.vspace = '0';
	f.marginWidth = '0';
	f.marginHeight = '0';
	f.style.border = '0';
	f.scrolling = 'no';
	f.frameBorder = '0';
	//f.src = 'about:self';//todo: test by setting empty src on safari
	f.style = 'display:none';
	return f;
}
// endRemoveIf(removeNativeRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.addMessageEventListener = function(theWindow, eventHandler){
	/* istanbul ignore else */
	if(typeof eventHandler !== "function"){
		refThis.log("EventHandler should be a function");
		return false;
	}

	if(theWindow.addEventListener){
		theWindow.addEventListener("message", eventHandler, false);
	}else{
		theWindow.attachEvent("onmessage", eventHandler);
	}
	return true;
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.safeFrameCommunicationProtocol = function(msg){
	try{
		var bidSlotId;
		msgData = window.JSON.parse(msg.data);
		/* istanbul ignore else */
		if(!msgData.pwt_type){
			return;
		}

		switch(window.parseInt(msgData.pwt_type)){

		case 1:
				/* istanbul ignore else */
			if(window.PWT.isSafeFrame){
					return;
				}

			var bidDetails = bidSlotId = bidManager.getBidById(msgData.pwt_bidID);
				/* istanbul ignore else */
			if(bidDetails){
					var theBid = bidDetails.bid;
					var	adapterID = theBid.getAdapterID(),
						divID = bidDetails.slotid,
						newMsgData = {
							pwt_type: 2,
							pwt_bid: theBid
						};
					refThis.vLogInfo(divID, {type: 'disp', adapter: adapterID});
					bidManager.executeMonetizationPixel(divID, theBid);
					// outstream video renderer for safe frame.
					if(theBid && theBid.pbbid && theBid.pbbid.mediaType == "video"  && theBid.renderer && refThis.isObject(theBid.renderer)){
						if(refThis.isFunction(theBid.renderer.render)){
							theBid.renderer.render(theBid.getPbBid());
						}
					}else{
						refThis.resizeWindow(window.document, theBid.width, theBid.height, divID);
						msg.source.postMessage(window.JSON.stringify(newMsgData), msgData.pwt_origin);
					}
				}
			break;

		case 2:
				/* istanbul ignore else */
			if(!window.PWT.isSafeFrame){
					return;
				}

				/* istanbul ignore else */
			if(msgData.pwt_bid){
					var theBid = msgData.pwt_bid;
					if(theBid.adHtml){
						try{
							var iframe = refThis.createInvisibleIframe(window.document);
							/* istanbul ignore else */
							if(!iframe){
								throw {message: 'Failed to create invisible frame.', name:""};
							}

							iframe.setAttribute('width', theBid.width);
							iframe.setAttribute('height', theBid.height);
							iframe.style = '';

							window.document.body.appendChild(iframe);

							/* istanbul ignore else */
							if(!iframe.contentWindow){
								throw {message: 'Unable to access frame window.', name:""};
							}

							var iframeDoc = iframe.contentWindow.document;
							/* istanbul ignore else */
							if(!iframeDoc){
								throw {message: 'Unable to access frame window document.', name:""};
							}

							var content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><scr' + 'ipt>inDapIF=true;</scr' + 'ipt></head>';
							content += '<body>';
							content += "<script>var $sf = window.parent.$sf;<\/script>";
							content += "<script>setInterval(function(){try{var fr = window.document.defaultView.frameElement;fr.width = window.parent.document.defaultView.innerWidth;fr.height = window.parent.document.defaultView.innerHeight;}catch(e){}}, 200);</script>";
							content += theBid.adHtml;
							content += '</body></html>';

							iframeDoc.write(content);
							iframeDoc.close();

						}catch(e){
							refThis.logError('Error in rendering creative in safe frame.');
							refThis.log(e);
							refThis.log('Rendering synchronously.');
							refThis.displayCreative(window.document, msgData.pwt_bid);
						}

					}else if(theBid.adUrl){
						refThis.writeIframe(window.document, theBid.adUrl, theBid.width, theBid.height, "");
					}else{
						refThis.logWarning("creative details are not found");
						refThis.log(theBid);
					}
				}
			break;
		
		// removeIf(removeNativeRelatedCode)	
		case 3:
			if(CONFIG.isPrebidPubMaticAnalyticsEnabled()){
				var msg = { message: 'Prebid Native', adId: msgData.pwt_bidID, action: msgData.pwt_action };
				window.postMessage(JSON.stringify(msg), "*");
			}else{
				var bidDetails = bidSlotId = bidManager.getBidById(msgData.pwt_bidID);
				/* istanbul ignore else */
				if(bidDetails){
					var theBid = bidDetails.bid,
						adapterID = theBid.getAdapterID(),
						divID = bidDetails.slotid;
					refThis.vLogInfo(divID, {type: 'disp', adapter: adapterID});
					if(msgData.pwt_action && msgData.pwt_action == "imptrackers"){
						bidManager.executeMonetizationPixel(divID, theBid);
					}
					bidManager.fireTracker(theBid,msgData.pwt_action);							
				}
			}
			break;
		// endRemoveIf(removeNativeRelatedCode)	
		}

		// Check if browsers local storage has auction related data and update impression served count accordingly.
	    var frequencyDepth = JSON.parse(localStorage.getItem('PROFILE_AUCTION_INFO_' + window.location.hostname)) || {};
		if (frequencyDepth !== null && frequencyDepth.slotLevelFrquencyDepth) {
			frequencyDepth.slotLevelFrquencyDepth[frequencyDepth.codeAdUnitMap[bidSlotId && bidSlotId.slotid]].impressionServed = frequencyDepth.slotLevelFrquencyDepth[frequencyDepth.codeAdUnitMap[bidSlotId && bidSlotId.slotid]].impressionServed + 1; 
			frequencyDepth.impressionServed = frequencyDepth.impressionServed + 1;
		}
		localStorage.setItem('PROFILE_AUCTION_INFO_' + window.location.hostname, JSON.stringify(frequencyDepth));		
	}catch(e){}
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.addMessageEventListenerForSafeFrame = function(theWindow){
	refThis.addMessageEventListener(theWindow, refThis.safeFrameCommunicationProtocol);
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

exports.getElementLocation = function( el ) {
	var rect,
		x = 0,
		y = 0
		;

	if(refThis.isFunction(el.getBoundingClientRect)) {
		rect = el.getBoundingClientRect();
		x 	 = Math.floor(rect.left);
		y 	 = Math.floor(rect.top);
	} else {
		while(el) {
			x += el.offsetLeft;
			y += el.offsetTop;
			el = el.offsetParent;
		}
	}
	return { x: x, y: y	};
}

exports.createVLogInfoPanel = function(divID, dimensionArray){
	var element,
		infoPanelElement,
		infoPanelElementID,
		doc = window.document
		;

	/* istanbul ignore else */
	if(refThis.visualDebugLogIsEnabled){
		element = doc.getElementById(divID);
		/* istanbul ignore else */
		if(element && dimensionArray.length && dimensionArray[0][0] && dimensionArray[0][1]){
			infoPanelElementID = divID + '-pwtc-info';
			/* istanbul ignore else */
			if(!refThis.isUndefined(doc.getElementById(infoPanelElementID))){
				var pos = refThis.getElementLocation(element);
				infoPanelElement = doc.createElement('div');
				infoPanelElement.id = infoPanelElementID;
				infoPanelElement.style = 'position: absolute; /*top: '+pos.y+'px;*/ left: '+pos.x+'px; width: '+dimensionArray[0][0]+'px; height: '+dimensionArray[0][1]+'px; border: 1px solid rgb(255, 204, 52); padding-left: 11px; background: rgb(247, 248, 224) none repeat scroll 0% 0%; overflow: auto; z-index: 9999997; visibility: hidden;opacity:0.9;font-size:13px;font-family:monospace;';

				var closeImage = doc.createElement('img');
				closeImage.src = refThis.metaInfo.protocol+"ads.pubmatic.com/AdServer/js/pwt/close.png";
				closeImage.style = 'cursor:pointer; position: absolute; top: 2px; left: '+(pos.x+dimensionArray[0][0]-16-15)+'px; z-index: 9999998;';
				closeImage.title = 'close';
				closeImage.onclick = function(){
					infoPanelElement.style.display = "none";
				};
				infoPanelElement.appendChild(closeImage);
				infoPanelElement.appendChild(doc.createElement('br'));

				var text = 'Slot: '+divID+' | ';
				for(var i=0; i<dimensionArray.length; i++){
					text += (i != 0 ? ', ' : '') + dimensionArray[i][0] + 'x' + dimensionArray[i][1];
				}
				infoPanelElement.appendChild(doc.createTextNode(text));
				infoPanelElement.appendChild(doc.createElement('br'));
				element.parentNode.insertBefore(infoPanelElement, element);
			}
		}
	}
};

exports.realignVLogInfoPanel = function(divID){
	var element,
		infoPanelElement,
		infoPanelElementID,
		doc = window.document
		;

	/* istanbul ignore else */
	if(refThis.visualDebugLogIsEnabled){
		element = doc.getElementById(divID);
		/* istanbul ignore else */
		if(element){
			infoPanelElementID = divID + '-pwtc-info';
			infoPanelElement = doc.getElementById(infoPanelElementID);
			/* istanbul ignore else */
			if(infoPanelElement){
				var pos = refThis.getElementLocation(element);
				infoPanelElement.style.visibility = 'visible';
				infoPanelElement.style.left = pos.x + 'px';
				infoPanelElement.style.height = element.clientHeight + 'px';
			}
		}
	}
};

exports.vLogInfo = function(divID, infoObject){
	var infoPanelElement,
		message,
		doc = window.document
		;
	/* istanbul ignore else */
	if(refThis.visualDebugLogIsEnabled){
		var infoPanelElementID = divID + "-pwtc-info";
		infoPanelElement = doc.getElementById(infoPanelElementID);
		/* istanbul ignore else */
		if( infoPanelElement ){
			switch(infoObject.type){
			case "bid":
				var latency = infoObject.latency;
				var bidDetails = infoObject.bidDetails;
				var currencyMsg = "";
					/* istanbul ignore else */
				if(latency < 0){
						latency = 0;
					}
				if (infoObject.hasOwnProperty("adServerCurrency") && infoObject["adServerCurrency"] !== undefined) {
						if (infoObject.adServerCurrency == 0) {
							currencyMsg = 'USD';
						} else {
							currencyMsg = infoObject.adServerCurrency;
						}
					} else {
						currencyMsg = 'USD';
					}
				message = "Bid: " + infoObject.bidder + (infoObject.s2s ? "(s2s)" : "") + ": " + bidDetails.getNetEcpm() + "(" + bidDetails.getGrossEcpm() + ")" + currencyMsg + " :" + latency + "ms";
					/* istanbul ignore else */
				if(bidDetails.getPostTimeoutStatus()){
						message += ": POST-TIMEOUT";
					}
				break;

			case "win-bid":
				var bidDetails = infoObject.bidDetails;
				var currencyMsg = "";
				if (infoObject.hasOwnProperty("adServerCurrency") && infoObject["adServerCurrency"] !== undefined) {
						if (infoObject.adServerCurrency == 0) {
							currencyMsg = 'USD';
						} else {
							currencyMsg = infoObject.adServerCurrency;
						}
					} else {
						currencyMsg = 'USD';
					}
				message = "Winning Bid: " + bidDetails.getAdapterID() + ": " + bidDetails.getNetEcpm() + currencyMsg;
				break;

			case "win-bid-fail":
				message = "There are no bids from PWT";
				break;

			case "hr":
				message = "----------------------";
				break;

			case "disp":
				message = "Displaying creative from "+ infoObject.adapter;
				break;
			}
			infoPanelElement.appendChild(doc.createTextNode(message));
			infoPanelElement.appendChild(doc.createElement("br"));
		}
	}
};

exports.getExternalBidderStatus = function(divIds) {
	var status = true;
	refThis.forEachOnArray(divIds, function (key, divId) {
		status =  window.OWT.externalBidderStatuses[divId]
							? status && window.OWT.externalBidderStatuses[divId].status
							: status;
	});
	return status;
};

exports.resetExternalBidderStatus = function(divIds) {
	refThis.forEachOnArray(divIds, function (key, divId) {
		refThis.log("resetExternalBidderStatus: " + divId);
		window.OWT.externalBidderStatuses[divId] = undefined;
	});
};

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.ajaxRequest = function(url, callback, data, options) {
	try {

		options = options || {};

		var x,
			XHR_DONE = 4,				
			ajaxSupport = true,
			method = options.method || (data ? "POST" : "GET")
			;

		if(!window.XMLHttpRequest){
			ajaxSupport = false;
		}else{
			x = new window.XMLHttpRequest();
			if(refThis.isUndefined(x.responseType)){
				ajaxSupport = false;
			}
		}

		if(!ajaxSupport){
			refThis.log("Ajax is not supported");
			return;
		}

		x.onreadystatechange = function (){
			if(x.readyState === XHR_DONE && callback){
				callback(x.responseText, x);
			}
		};

		x.open(method, url);
		
		if(options.withCredentials){
			x.withCredentials = true;
		}

		if(options.preflight){
			x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}

		x.setRequestHeader("Content-Type", options.contentType || "text/plain");		
		x.send(method === "POST" && data);

	}catch(error){
		refThis.log("Failed in Ajax");
		refThis.log(error);
	}
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

function addFloorConfigIfPresent(config, adUnitConfig, defaultFloor) {
	if(config.floors || defaultFloor){
		adUnitConfig["floors"] = config.floors || defaultFloor;
	}	
}
exports.addFloorConfigIfPresent = addFloorConfigIfPresent;

// Returns mediaTypes for adUnits which are sent to prebid
exports.getAdUnitConfig = function(sizes, currentSlot){
	function iskgpvpresent() {
		if(kgpv) {
			return Object.keys(slotConfig['config']).toString().toLowerCase().indexOf(kgpv.toLowerCase()) > -1 ? true : false;
		}
	}
	// checks if regex is present and enabled
	function isregexEnabled() {
		return slotConfig && (slotConfig[CONSTANTS.COMMON.MCONF_REGEX] == true) ? true : false;
	}
	// Returns regex-matched config for kgpv, if not found returns undefined
	function isAdunitRegex() {
		var regexKeys = Object.keys(slotConfig['config']);
		var matchedRegex;
		regexKeys.forEach(function (exp) {
			try {
				// Ignores "default" key and RegExp performs case insensitive check
				if (exp.length > 0 && exp != CONSTANTS.COMMON.DEFAULT && kgpv.match(new RegExp(exp, "i"))) {
					matchedRegex = exp;
					return;
				}
			} catch (ex) {
				refThis.log(CONSTANTS.MESSAGES.M32 + JSON.stringify(exp));
			}
		})
		if (matchedRegex) {
			return slotConfig["config"][matchedRegex];
		} else {
			return undefined;
		}
	}
	// returns selected MediaConfig
	function selectSlotConfig() {
		//exact-match else regex check
		if (iskgpvpresent()) {
			return slotConfig["config"][kgpv];
		} else if (isregexEnabled()) {
			return isAdunitRegex();
		}
	}

	var adUnitConfig = {};
	var mediaTypeObject = {};
	var slotConfig = CONFIG.getSlotConfiguration();
	if(slotConfig){
		if((slotConfig.configPattern && slotConfig.configPattern.trim() != '') || (slotConfig["configPattern"] = "_AU_")){
			var kgp = slotConfig.configPattern;
			var isVideo = true;
			var isNative = true;
			var isBanner = true;
			var config = undefined;
			var defaultFloor = undefined;
			var divId = refThis.isFunction(currentSlot.getDivID) ? currentSlot.getDivID() : currentSlot.getSlotId().getDomId();

			// TODO: Have to write logic if required in near future to support multiple kgpvs, right now 
			// as we are only supporting div and ad unit, taking the first slot name.
			// Implemented as per code review and discussion. 

			var kgpv = refThis.generateSlotNamesFromPattern(currentSlot, kgp, false)[0];
			// Global Default Enable is false then disable each 
			if(refThis.isOwnProperty(slotConfig['config'] ,CONSTANTS.COMMON.DEFAULT)){
				if(slotConfig['config'][CONSTANTS.COMMON.DEFAULT].banner && refThis.isOwnProperty(slotConfig['config'][CONSTANTS.COMMON.DEFAULT].banner, 'enabled') && !slotConfig['config'][CONSTANTS.COMMON.DEFAULT].banner.enabled){
					isBanner =false;
				}
				if(slotConfig['config'][CONSTANTS.COMMON.DEFAULT].native && refThis.isOwnProperty(slotConfig['config'][CONSTANTS.COMMON.DEFAULT].native, 'enabled') && !slotConfig['config'][CONSTANTS.COMMON.DEFAULT].native.enabled){
					isNative =false;
				}
				if(slotConfig['config'][CONSTANTS.COMMON.DEFAULT].video && refThis.isOwnProperty(slotConfig['config'][CONSTANTS.COMMON.DEFAULT].video, 'enabled') &&  !slotConfig['config'][CONSTANTS.COMMON.DEFAULT].video.enabled){
					isVideo =false;
				}
				config = slotConfig["config"][CONSTANTS.COMMON.DEFAULT];
				defaultFloor = config && config["floors"];
				if(config.renderer && !refThis.isEmptyObject(config.renderer)){
					adUnitConfig['renderer'] = config.renderer;
				}
			}
			if (refThis.isOwnProperty(slotConfig['config'], kgpv) || iskgpvpresent() || isregexEnabled()) {
				//populating slotlevel config 
				const slConfig = selectSlotConfig();
				// if SLConfig present then override default config
				if (slConfig) {
					config = slConfig;
				}

				if(!config) {
					config = slotConfig["config"][Object.keys(slotConfig["config"]).filter(function(key){
						return key.toLocaleLowerCase() === kgpv.toLowerCase();
					})]
				}
				refThis.log("Config" + JSON.stringify(config)  +" found for adSlot: " +  JSON.stringify(currentSlot));
			}
			else{
				refThis.log("Considering Default Config for " +  JSON.stringify(currentSlot));
			}
			if(config){
				if(isNative && config.native && (!refThis.isOwnProperty(config.native, 'enabled') || config.native.enabled)){
					if(config.native["config"]){
						mediaTypeObject["native"] = config.native["config"];
					}
					else{
						refThis.logWarning("Native Config will not be considered as no config has been provided for slot" + JSON.stringify(currentSlot) + " or there is no configuration defined in default.");
					}
				}
				if(isVideo && config.video && (!refThis.isOwnProperty(config.video, 'enabled') || config.video.enabled)){
					if(CONFIG.getAdServer() != CONSTANTS.AD_SERVER.DFP){
						if(config.video["config"]){
							mediaTypeObject["video"] = config.video["config"];
							if(config.video["partnerConfig"]){
								mediaTypeObject["partnerConfig"] = config.video["partnerConfig"];
							}
						}
						else{
							refThis.logWarning("Video Config will not be considered as no config has been provided for slot" + JSON.stringify(currentSlot) + " or there is no configuration defined in default.");
						}
					}
					else{
						refThis.logWarning("Video Config will not be considered with DFP selected as AdServer.");
					}  
				}
				if(config.renderer && !refThis.isEmptyObject(config.renderer)){
					adUnitConfig['renderer'] = config.renderer;
				}
				if(config.ortb2Imp && !refThis.isEmptyObject(config.ortb2Imp)){
					adUnitConfig['ortb2Imp'] = config.ortb2Imp;
				}
				if(!isBanner ||  (config.banner && (refThis.isOwnProperty(config.banner, 'enabled') && !config.banner.enabled))){
					refThis.mediaTypeConfig[divId] = mediaTypeObject;  
					adUnitConfig['mediaTypeObject'] = mediaTypeObject
					refThis.addFloorConfigIfPresent(config, adUnitConfig, defaultFloor);
					return adUnitConfig;      
				}
				refThis.addFloorConfigIfPresent(config, adUnitConfig, defaultFloor);
			}
			else{
				refThis.log("Config not found for adSlot: " +  JSON.stringify(currentSlot));
			}
		} else{
			refThis.logWarning("Slot Type not found in config. Please provide slotType in configuration");
		}
	}
	mediaTypeObject["banner"] = {
		sizes: sizes
	};
	refThis.mediaTypeConfig[divId] = mediaTypeObject;
	adUnitConfig['mediaTypeObject'] = mediaTypeObject
	return adUnitConfig;
};

// removeIf(removeNativeRelatedCode)
exports.addEventListenerForClass = function(theWindow, theEvent, theClass, eventHandler){

	if(typeof eventHandler !== "function"){
		refThis.log("EventHandler should be a function");
		return false;
	}
	var elems = refThis.findElementsByClass(theWindow, theClass);
	if(!theWindow.addEventListener){
		theEvent = "on"+theEvent;
	}
	for (var i = 0; i < elems.length; i++) {
		elems[i].addEventListener(theEvent, eventHandler, true);
	}
	return true;
};
// endRemoveIf(removeNativeRelatedCode)

// removeIf(removeNativeRelatedCode) 
exports.findElementsByClass = function(theWindow, theClass){
	return theWindow.document.getElementsByClassName(theClass) || [];
};
// endRemoveIf(removeNativeRelatedCode)

// removeIf(removeNativeRelatedCode)
exports.getBidFromEvent = function (theEvent) {
	return (theEvent && theEvent.target && theEvent.target.attributes &&  theEvent.target.attributes[CONSTANTS.COMMON.BID_ID] && theEvent.target.attributes[CONSTANTS.COMMON.BID_ID].value) || "";
};
// endRemoveIf(removeNativeRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.getAdFormatFromBidAd = function(ad){
	var format = undefined;
	if(ad && refThis.isString(ad)){
		//TODO: Uncomment below code once video has been implemented 
		try{
			var videoRegex = new RegExp(/VAST\s+version/); 
			if(videoRegex.test(ad)){
				format = CONSTANTS.FORMAT_VALUES.VIDEO;
			}
			else{
				var adStr = JSON.parse(ad.replace(/\\/g, ""));
				if (adStr && adStr.native) {
					format = CONSTANTS.FORMAT_VALUES.NATIVE;
				}
			}
		}
		catch(ex){
			format = CONSTANTS.FORMAT_VALUES.BANNER;
		}
		// }
	}
	return format;
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// This common function can be used add hooks for publishers to make changes in flows
exports.handleHook = function(hookName, arrayOfDataToPass) {
	// Adding a hook for publishers to modify the data we have
	if(refThis.isFunction(window.PWT[hookName])){
		refThis.log('For Hook-name: '+hookName+', calling window.PWT.'+hookName+'function.' );
		window.PWT[hookName].apply(window.PWT, arrayOfDataToPass);
	} 
	// else {
	// 	refThis.log('Hook-name: '+hookName+', window.PWT.'+hookName+' is not a function.' );
	// }
};

exports.getCurrencyToDisplay = function(){
	var defaultCurrency = CONFIG.getAdServerCurrency();
	if(defaultCurrency == 0){
		defaultCurrency = 'USD';
	}
	if(CONFIG.getAdServerCurrency()){
		if(window[CONSTANTS.COMMON.PREBID_NAMESPACE] && refThis.isFunction(window[CONSTANTS.COMMON.PREBID_NAMESPACE].getConfig)){
			var pbConf = window[CONSTANTS.COMMON.PREBID_NAMESPACE].getConfig();
			if(pbConf && pbConf.currency && pbConf.currency.adServerCurrency){
				return pbConf.currency.adServerCurrency;
			}
		}
	}
	return defaultCurrency;
};

exports.getConfigFromRegex = function(klmsForPartner, generatedKey){
	// This function will return the config for the partner for specific slot.
	// KGP would always be AU@DIV@WXH
	// KLM would be an array of regex Config and regex pattern pairs where key would be regex pattern to match 
	// and value would be the config for that slot to be considered.
	/* Algo to match regex pattern 
		Start regex parttern matching  pattern -> ["ADUNIT", "DIV", "SIZE"]
		Then match the slot adUnit with pattern 
		if successful the match the div then size
		if all are true then return the config else match the next avaiable pattern
		if none of the pattern match then return the error config not found */
	var rxConfig = null;
	var keys = generatedKey.split("@");
	for (var i = 0; i < klmsForPartner.length; i++) {
		var klmv = klmsForPartner[i];
		var rxPattern = klmv.rx;
		if(keys.length == 3){ // Only execute if generated key length is 3 .
			try{
				// Added second parameter to RegExp to make case insenitive check on AU & DIV parameters. 
				if(keys[0].match(new RegExp(rxPattern.AU, "i")) && keys[1].match(new RegExp(rxPattern.DIV, "i")) && keys[2].match(new RegExp(rxPattern.SIZE, "i"))){
					rxConfig = {
						config : klmv.rx_config,
						regexPattern : rxPattern.AU + "@" + rxPattern.DIV + "@" + rxPattern.SIZE
					};
					break;
				}
			}
			catch(ex){
				refThis.logError(CONSTANTS.MESSAGES.M27 + JSON.stringify(rxPattern));
			}
		} else {
			refThis.logWarning(CONSTANTS.MESSAGES.M28 + generatedKey);
		}
	}
	return rxConfig;
};

// removeIf(removeUserIdRelatedCode)
exports.getUserIdConfiguration = function(){
	var userIdConfs = [];
	window[pbNameSpace].onSSOLogin({});
	refThis.forEachOnObject(CONFIG.getIdentityPartners(),function(parterId, partnerValues){
		if (CONSTANTS.EXCLUDE_PARTNER_LIST.indexOf(parterId) < 0) {
			userIdConfs.push(refThis.getUserIdParams(partnerValues));
		}
	});
	refThis.log(CONSTANTS.MESSAGES.IDENTITY.M4+ JSON.stringify(userIdConfs));
	return userIdConfs;
};
// endRemoveIf(removeUserIdRelatedCode)

// removeIf(removeUserIdRelatedCode)
exports.getUserIds = function(){
	if(refThis.isFunction(window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIds)) {
		return window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIds();
	} else{
		refThis.logWarning("getUserIds" + CONSTANTS.MESSAGES.IDENTITY.M6);
	};
};
// endRemoveIf(removeUserIdRelatedCode)

// removeIf(removeUserIdRelatedCode)
exports.getUserIdsAsEids = function(){
	if(refThis.isFunction(window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIdsAsEids)) {
		return window[CONSTANTS.COMMON.PREBID_NAMESPACE].getUserIdsAsEids();
	} else {
		refThis.logWarning("getUserIdsAsEids" + CONSTANTS.MESSAGES.IDENTITY.M6);
	};
};
// endRemoveIf(removeUserIdRelatedCode)

exports.getNestedObjectFromArray = function(sourceObject,sourceArray, valueOfLastNode){
	var convertedObject = sourceObject;
	var referenceForNesting = convertedObject;
	for(var i=0;i<sourceArray.length-1;i++){
		if(!referenceForNesting[sourceArray[i]]){
			referenceForNesting[sourceArray[i]] = {};
		}
		referenceForNesting = referenceForNesting[sourceArray[i]];
	}
	referenceForNesting[sourceArray[sourceArray.length-1]] = valueOfLastNode;
	return convertedObject;	
};

exports.getNestedObjectFromString = function(sourceObject,separator, key, value){
	var splitParams = key.split(separator);
	if(splitParams.length == 1){
		sourceObject[key] = value;
	} else{
		sourceObject = refThis.getNestedObjectFromArray(sourceObject,splitParams,value);
	}
	return sourceObject;
};

exports.deleteCustomParams = function(params){
	delete params.custom;
	return params;
}

exports.getUserIdParams = function(params){
	var userIdParams= {};
	refThis.applyDataTypeChangesIfApplicable(params);
	refThis.applyCustomParamValuesfApplicable(params);
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
	if (userIdParams && userIdParams.params && userIdParams.params["loadATS"] == "true") {
    	refThis.initLiveRampAts(userIdParams);
	}
	if(userIdParams && userIdParams.params && userIdParams.params['loadIDP'] == 'true'){
        refThis.initZeoTapJs(userIdParams);
	}
	if (userIdParams && userIdParams.params && userIdParams.params["loadLauncher"] == "true") {
		refThis.initLauncherJs(userIdParams); 
	}
	if (userIdParams && userIdParams.custom && userIdParams.custom["loadLaunchPad"] == "true") {
		refThis.initLiveRampLaunchPad(userIdParams); 
	}
	return refThis.deleteCustomParams(userIdParams);
};

exports.getPartnerParams = function(params){
	var pparams= {};
	for(var key in params){
		try{
			pparams = refThis.getNestedObjectFromString(pparams,".",key,params[key]);
		}
		catch(ex){
			refThis.logWarning(CONSTANTS.MESSAGES.M29, ex);
		}
	}	
	return pparams;
};

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.getAdDomain = function(bidResponse) {
	if (bidResponse.meta && bidResponse.meta.advertiserDomains && bidResponse.meta.advertiserDomains.length > 0) {
		var adomain = bidResponse.meta.advertiserDomains[0];

		if (adomain) {
			try {
				var hostname = new URL(adomain);
				return hostname.hostname.replace('www.', '');
			} catch (e) {
				refThis.log("Adomain URL (Not a proper URL):"+ adomain);
				return adomain.split('/')[0].replace('www.', '');
			}
		}
	}
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.getTgid = function() {
	var testGroupId = parseInt(PWT.testGroupId || 0);
	if (testGroupId <= 15 && testGroupId >= 0) {
	  return testGroupId;
	}
	return 0;
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.generateMonetizationPixel = function(slotID, theBid){
	var pixelURL = CONFIG.getMonetizationPixelURL(),
		pubId = CONFIG.getPublisherId();
	var netEcpm, grossEcpm, kgpv, bidId, adapterId, adapterName,adUnitId;
	var sspID = "";
	const isAnalytics = true; // this flag is required to get grossCpm and netCpm in dollars instead of adserver currency
	const prebidBidId = (theBid.pbbid && theBid.pbbid.prebidBidId) || (theBid.prebidBidId);

	/* istanbul ignore else */
	if(!pixelURL){
		return;
	}

	if(refThis.isFunction(theBid.getGrossEcpm)) {
		grossEcpm = theBid.getGrossEcpm(isAnalytics);
	}
	else{
		if(CONFIG.getAdServerCurrency() &&  refThis.isFunction(theBid.getCpmInNewCurrency)){
			grossEcpm = window.parseFloat(theBid.getCpmInNewCurrency(CONSTANTS.COMMON.ANALYTICS_CURRENCY));
		}
		else {
			if(CONFIG.isPrebidPubMaticAnalyticsEnabled() && theBid.originalCpm){
				grossEcpm = theBid.originalCpm;
			}else{
				grossEcpm = theBid.cpm;
			}
		}
	}
	if(refThis.isFunction(theBid.getAdapterID)){
		adapterId = theBid.getAdapterID()
	}
	else{
		adapterId = theBid.bidderCode
	}
	//Uncomment below code in case hybrid profile is supported 
	if(adapterId == "pubmaticServer"){
		adapterId = theBid.originalBidder || "pubmatic"; // in case of pubmaticServer we will get originalBidder, assigning pubmatic just in case originalBidder is not there.
	}

	adapterName = CONFIG.getAdapterNameForAlias(adapterId);

	// Do we need all checks or we can just use one check
	if(refThis.isFunction(theBid.getNetEcpm)) {
		netEcpm = theBid.getNetEcpm(isAnalytics)
	}
	else{
		// else would be executed in case this function is called from prebid for vast updation
		netEcpm = window.parseFloat((grossEcpm * CONFIG.getAdapterRevShare(adapterId)).toFixed(CONSTANTS.COMMON.BID_PRECISION))
	}
	
	if(refThis.isFunction(theBid.getBidID)){
		bidId = theBid.getBidID()
	}
	else{
		if(CONFIG.isPrebidPubMaticAnalyticsEnabled() && theBid.adId){
			bidId = theBid.adId;
		}
		else{
			bidId = window.PWT.bidMap[slotID].adapters[adapterId].bids[Object.keys(window.PWT.bidMap[slotID].adapters[adapterId].bids)[0]].bidID;
		}
	}
	if(refThis.isFunction(theBid.getKGPV)) {
		kgpv = theBid.getKGPV()
	}
	else {
		kgpv = window.PWT.bidMap[slotID].adapters[adapterId].bids[Object.keys(window.PWT.bidMap[slotID].adapters[adapterId].bids)[0]].getKGPV(false, theBid.mediaType);
	}
	if(refThis.isFunction(theBid.getsspID)){
		sspID = theBid.getsspID();
	}else{
		sspID = theBid.sspID || "";	
	}

	var origAdUnit = bidManager.getAdUnitInfo(slotID);
	adUnitId = origAdUnit.adUnitId || slotID;
	var iiid = window.PWT.bidMap[slotID].getImpressionID();
	var isRefreshed = (window.PWT.newAdUnits && window.PWT.newAdUnits[iiid] && window.PWT.newAdUnits[iiid][slotID] && window.PWT.newAdUnits[iiid][slotID]['pubmaticAutoRefresh'] && window.PWT.newAdUnits[iiid][slotID]['pubmaticAutoRefresh']['isRefreshed']) ? 1 : 0;
	// var impressionID = PWT.bidMap[slotID].impressionID;
	const adv = refThis.getAdDomain(theBid.pbbid || theBid) || undefined;
	const fskp = window.PWT.floorData ?
		(window.PWT.floorData[iiid] ?
			(window.PWT.floorData[iiid].floorRequestData ?
				(window.PWT.floorData[iiid].floorRequestData.skipped == false ? 0 : 1) :
				undefined)
			: undefined)
		: undefined;

	pixelURL += "pubid=" + pubId;
	pixelURL += "&purl=" + window.encodeURIComponent(refThis.metaInfo.pageURL);
	pixelURL += "&tst=" + refThis.getCurrentTimestamp();
	pixelURL += "&iid=" + window.encodeURIComponent(window.PWT.bidMap[slotID].getImpressionID());
	pixelURL += "&bidid=" + (prebidBidId ? window.encodeURIComponent(prebidBidId) : window.encodeURIComponent(bidId));
	pixelURL += "&origbidid=" + window.encodeURIComponent(bidId);
	pixelURL += "&pid=" + window.encodeURIComponent(CONFIG.getProfileID());
	pixelURL += "&pdvid=" + window.encodeURIComponent(CONFIG.getProfileDisplayVersionID());
	pixelURL += "&slot=" + window.encodeURIComponent(slotID);
	pixelURL += "&au=" + window.encodeURIComponent(adUnitId);
	pixelURL += "&bc=" + window.encodeURIComponent(adapterId);
	pixelURL += "&pn=" + window.encodeURIComponent(adapterName);
	pixelURL += "&en=" + window.encodeURIComponent(netEcpm);
	pixelURL += "&eg=" + window.encodeURIComponent(grossEcpm);
	pixelURL += "&kgpv=" + window.encodeURIComponent(kgpv);
	pixelURL += "&piid=" + window.encodeURIComponent(sspID);
	pixelURL += "&rf=" + window.encodeURIComponent(isRefreshed);
	pixelURL += "&di=" + window.encodeURIComponent(theBid.getDealID() || "-1");

	pixelURL += '&plt=' + window.encodeURIComponent(refThis.getDevicePlatform());
	pixelURL += (refThis.isFunction(theBid.getWidth) && refThis.isFunction(theBid.getHeight)) ?
		('&psz=' + window.encodeURIComponent(theBid.getWidth() + 'x' + theBid.getHeight())) :
			((refThis.isFunction(theBid.getSize)) ? 
				('&psz=' + window.encodeURIComponent(theBid.getSize())) :
					'&psz=' + window.encodeURIComponent(theBid.width + 'x' + theBid.height));
	pixelURL += '&tgid=' + window.encodeURIComponent(refThis.getTgid());
	adv && (pixelURL += '&adv=' + window.encodeURIComponent(adv));
	pixelURL += '&orig=' + window.encodeURIComponent((refThis.metaInfo && refThis.metaInfo.pageDomain) || '');
	pixelURL += '&ss=' + window.encodeURIComponent(refThis.isFunction(theBid.getServerSideStatus) ?
		(theBid.getServerSideStatus() ? 1 : 0) :
		(CONFIG.isServerSideAdapter(adapterId) ? 1 : 0));
	(fskp != undefined) && (pixelURL += '&fskp=' + window.encodeURIComponent(fskp));
	pixelURL += '&af=' + window.encodeURIComponent(refThis.isFunction(theBid.getAdFormat) ?
		theBid.getAdFormat() : (theBid.mediaType || undefined));

	return CONSTANTS.COMMON.PROTOCOL + pixelURL;
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.UpdateVastWithTracker= function(bid, vast){
	try{
		var domParser = new DOMParser();
		var parsedVast = domParser.parseFromString(vast,"application/xml");
		var impEle = parsedVast.createElement("Impression");
		impEle.innerHTML =	CONFIG.isPrebidPubMaticAnalyticsEnabled() ? "" : "<![CDATA["+ refThis.generateMonetizationPixel(bid.adUnitCode, bid)+"]]>";
		if(parsedVast.getElementsByTagName('Wrapper').length == 1){
			parsedVast.getElementsByTagName('Wrapper')[0].appendChild(impEle);
		}
		else if(parsedVast.getElementsByTagName('InLine').length == 1){
			parsedVast.getElementsByTagName('InLine')[0].appendChild(impEle);
		}
		return new XMLSerializer().serializeToString(parsedVast);
	}
	catch(ex){
		return vast;
	}
    
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

exports.getDomainFromURL = function(url){
	var a = window.document.createElement("a");
	a.href = url;
	return a.hostname;
};

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.replaceAuctionPrice = function(str, cpm) {
	if (!str) return;
	return str.replace(/\$\{AUCTION_PRICE\}/g, cpm);
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeInStreamRelatedCode)
exports.getCustomParamsForDFPVideo = function(customParams, bid){
	const adserverTargeting = (bid && bid.adserverTargeting) || {};
	var targetingKeys = {}
	for(var key in adserverTargeting){
		if(refThis.isOwnProperty(adserverTargeting,key)){
			if(refThis.isArray(adserverTargeting[key])){
				targetingKeys[key] = adserverTargeting[key].join();
			} else {
				targetingKeys[key] = adserverTargeting[key];
			}
		}
	}
	var customParams = Object.assign({},
		targetingKeys,
		customParams);
	return customParams;
};
// endRemoveIf(removeInStreamRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.getDevicePlatform = function(){
	var deviceType = 3;
	try{
		var ua = navigator.userAgent;
		if(ua && refThis.isString(ua) && ua.trim() != ""){
			ua = ua.toLowerCase().trim();
			var isMobileRegExp = new RegExp("(mobi|tablet|ios).*");
			if(ua.match(isMobileRegExp)){
				deviceType=2;
			}
			else{
				deviceType=1;
			}
		}
	}
	catch(ex){
		refThis.logError("Unable to get device platform" , ex);
	}
	return deviceType;
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

exports.getOWConfig = function(){
	var obj = {
		"timeout":CONFIG.getTimeout(),
		"openwrap_version": CONFIG[CONSTANTS.COMMON.OWVERSION],
		"prebid_version":CONFIG[CONSTANTS.COMMON.PBVERSION],
		"profileId": CONFIG.getProfileID(),
		"profileVersionId": CONFIG.getProfileDisplayVersionID()
	};
	return obj;
}

// removeIf(removeIdHubOnlyRelatedCode)
exports.updateAdUnits = function(adUnits){
	if(refThis.isArray(adUnits)){
		adUnits.forEach(function(adUnit){
			adUnit.bids.forEach(function(bid){
				refThis.updateUserIds(bid);
			});
		});
	} else if(!refThis.isEmptyObject(adUnits)){
		adUnits.bids.forEach(function(bid){
			refThis.updateUserIds(bid);
		});
	}
};
// endRemoveIf(removeIdHubOnlyRelatedCode)

// removeIf(removeIdHubOnlyRelatedCode)
exports.updateUserIds = function(bid){
	// refThis.idsAppendedToAdUnits =true;
	if(refThis.isUndefined(bid.userId)){
		bid["userId"] = refThis.getUserIds();
	}
	else if(bid.userId){
		/* istanbul ignore next */
		bid.userId = Object.assign(bid.userId, refThis.getUserIds());
	}
	if(refThis.isUndefined(bid.userIdAsEids)){
		bid["userIdAsEids"] = refThis.getUserIdsAsEids();
	}
	else if(refThis.isArray(bid.userIdAsEids)){
		var idsPresent = new Set();
		var ids = refThis.getUserIdsAsEids().concat(bid.userIdAsEids);
		if(refThis.isArray(ids) && ids.length > 0){
			ids = ids.filter(function(id){
				if(id.source){
					if(idsPresent.has(id.source)){
						return false;
					}
					idsPresent.add(id.source);
				}
				return true;
				
			})
		}
		bid.userIdAsEids = ids;
	}
};
// endRemoveIf(removeIdHubOnlyRelatedCode)
exports.getLiverampParams = function(params) {
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
			atsObject.emailHashes = undefined;
			if (window.PWT && (window.PWT.OVERRIDES_SCRIPT_BASED_MODULES && window.PWT.OVERRIDES_SCRIPT_BASED_MODULES.includes("identityLink")) || window.PWT.OVERRIDES_SCRIPT_BASED_MODULES === undefined) {
				var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
				atsObject.emailHashes = emailHash && [emailHash['MD5'], emailHash['SHA1'], emailHash['SHA256']] || undefined;
			} 
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

exports.getEmailHashes = function(){
	var userIdentity = window[pbNameSpace].getUserIdentities() || {};
	var enableSSO = CONFIG.isSSOEnabled() || false;
	var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
	var emailHashArr = [];
	refThis.forEachOnObject(emailHash, function (keyName, keyValue) {
		if (keyValue !== undefined) {
			emailHashArr.push(keyValue);
		}
	});
	return emailHashArr.length > 0 ? emailHashArr : undefined;
}

exports.initLiveRampLaunchPad = function (params) {
	var lpURL = "https://launchpad-wrapper.privacymanager.io/"+params.custom.configurationId+"/launchpad-liveramp.js";
	function addLaunchPad() {
		var launchPadScript = document.createElement("script");
		launchPadScript.onload = function () {
			__launchpad('addEventListener', 1, function(){
				var isDirectMode = !(ats.outputCurrentConfiguration()['DETECTION_MODULE_INFO']) ||
									ats.outputCurrentConfiguration()['ENVELOPE_MODULE_INFO']['ENVELOPE_MODULE_CONFIG']['startWithExternalId'];
				if(isDirectMode){ // If direct or detect/direct mode
					if (window.PWT && (window.PWT.OVERRIDES_SCRIPT_BASED_MODULES && window.PWT.OVERRIDES_SCRIPT_BASED_MODULES.includes("identityLink")) || window.PWT.OVERRIDES_SCRIPT_BASED_MODULES === undefined) {
						var emailHashes = refThis.getEmailHashes();
						emailHashes && window.ats.setAdditionalData({'type': 'emailHashes','id': emailHashes});
					}
				}
			}, ['atsWrapperLoaded']);
		};
		launchPadScript.src = lpURL;
		document.body.appendChild(launchPadScript);
	}
	addLaunchPad();
};

exports.getPublinkLauncherParams = function(params) {
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
			if (window.PWT && (window.PWT.OVERRIDES_SCRIPT_BASED_MODULES && window.PWT.OVERRIDES_SCRIPT_BASED_MODULES.includes("publinkId")) || window.PWT.OVERRIDES_SCRIPT_BASED_MODULES === undefined) {
				var emailHash = enableSSO && userIdentity.emailHash ? userIdentity.emailHash : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash : undefined; 
				lnchObject.emailHashes = emailHash && [emailHash['MD5'], emailHash['SHA256']] || undefined;
			}
			/* do we want to keep sso data under direct option?
			if yes, if sso is enabled and 'direct' is selected as detection mechanism, sso emails will be sent to ats script.
			if sso is disabled, and 'direct' is selected as detection mechanism, we will look for publisher provided email ids, and if available the hashes will be sent to ats script.
			*/
		break;
	};
	return lnchObject;
};

exports.initLiveRampAts = function (params) {
	function addATS() {
		var atsScript = document.createElement("script");
		var atsObject = refThis.getLiverampParams(params);
		atsScript.onload = function () {
			window.ats && window.ats.start(atsObject);
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
		var userIdentity = window[pbNameSpace].getUserIdentities() || {};
		var enableSSO = CONFIG.isSSOEnabled() || false;
		var userIdentityObject = {};
		if (window.PWT && (window.PWT.OVERRIDES_SCRIPT_BASED_MODULES && window.PWT.OVERRIDES_SCRIPT_BASED_MODULES.includes("zeotapIdPlus")) || window.PWT.OVERRIDES_SCRIPT_BASED_MODULES === undefined) {
			userIdentityObject = {
				email: enableSSO && userIdentity.emailHash ? userIdentity.emailHash['SHA256'] : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash['SHA256'] : undefined
			};
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

exports.initLauncherJs = function (params) {
	window.cnvr_launcher_options={lid: params.params.launcher_id};
	function loadLauncher() {
		var launchScript = document.createElement("script");
		var launchObject = refThis.getPublinkLauncherParams(params);
		launchScript.onload = function () {
			window.conversant.getLauncherObject = function(){
				return launchObject;
			}
			window.conversant && window.conversant.launch('publink', 'start', launchObject);
		};
		launchScript.src = "https://secure.cdn.fastclick.net/js/cnvr-launcher/latest/launcher-stub.min.js";
		document.body.appendChild(launchScript);
		
	}
	if (document.readyState == 'complete') {
		loadLauncher();
	} else {
		window.addEventListener("load", function () {
			setTimeout(loadLauncher, 1000);
		});
	}
};

exports.getRandomNumberBelow100 = function(){
	return Math.floor(Math.random()*100);
};

exports.getUpdatedKGPVForVideo = function(kgpv, adFormat){
	if(adFormat == CONSTANTS.FORMAT_VALUES.VIDEO){
		var videoKgpv = ["","0x0"];
		var splitKgpv = kgpv.split("@");
		// Adding this check for Div Mapping Only
		if(splitKgpv.length>1){
			if(splitKgpv.length == 2){
				if(splitKgpv[1].indexOf(":") > -1){
					var kgpvIndex = splitKgpv[1].split(":");
					videoKgpv[1] = videoKgpv[1] + ":" + kgpvIndex[1];
				}
				videoKgpv[0] = splitKgpv[0];
			}
			kgpv = videoKgpv.join("@");
		}
	}
	return kgpv;
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
									if (arr.length > 0) {
										params[key] = arr;
									}
								} else if (typeof paramValue === 'number') {
									params[key] = [paramValue];
								}
							}
							break;
						case "customObject":
							if (paramValue) {
								if (key === "params.requestedAttributesOverrides") {
									params[key] = {'uid2': (paramValue === "true" || paramValue === "1")}
								}
							}
							break;
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
			if(!params[partnerValues[i]["key"]]){
				params[partnerValues[i]["key"]] = partnerValues[i]["value"];	
			}
		}
	}
}

exports.getBrowserDetails = function() {
	return bidManager.getBrowser().toString();
}
exports.getPltForFloor = function() {
	return refThis.getDevicePlatform().toString();
}

exports.getGeoInfo = function() {
	var PREFIX = 'UINFO';
	var LOCATION_INFO_VALIDITY =  172800000; // 2 * 24 * 60 * 60 * 1000 - 2 days
	var geoDetectionURL = 'https://ut.pubmatic.com/geo?pubid=' +
		conf[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.PUBLISHER_ID];

	var info = window[pbNameSpace].getDataFromLocalStorage(PREFIX, LOCATION_INFO_VALIDITY);
	if(info && JSON.parse(info).cc) {	// Got valid data
		window.PWT.CC = JSON.parse(info);
	} else {
		window[pbNameSpace].detectLocation(geoDetectionURL,
		function(loc) {
			window[pbNameSpace].setAndStringifyToLocalStorage(PREFIX, loc);
			window.PWT.CC = loc;
		});
	}
}

exports.getCDSTargetingData = function(obj = {}) {
	var cdsData = window[CONSTANTS.COMMON.PREBID_NAMESPACE].getConfig('cds');
    cdsData && Object.keys(cdsData).map(function(key) {
      if((cdsData[key].sendtoGAM !== false)) {
        var val = cdsData[key].value;
        val = (!Array.isArray(val) && typeof val !== 'object' &&
            typeof val !== 'function' && typeof val !== 'undefined') ? val : '';
        obj[key] = val;
      }
    });
	return obj;
}
