//todo
//  pageURL refURL protocol related functions
// forEachOnArray
var CONFIG = require("./config.js");
var CONSTANTS = require("./constants.js");
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
				}
			}
			else{
				// Added Below Check Because of UOE-5600
				if(videoSlotName && videoSlotName.length == 1){
					keyConfig = keyLookupMap[videoSlotName[0]];
					// We are updating the generatedKey because we want to log kgpv as 0x0 in case of video 
					if(keyConfig){
						generatedKey = videoSlotName[0];
					}
				}
				if(!keyConfig){
					keyConfig = keyLookupMap[generatedKey];
				}
			}
			if(!keyConfig){
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
			if(bid.getAdapterID().toLowerCase() == "appier"){
				bid.adHtml = refThis.replaceAuctionPrice(bid.adHtml, bid.getGrossEcpm());
			}
			theDocument.write(bid.adHtml);
		}else if(bid.adUrl){
			if(bid.getAdapterID().toLowerCase() == "appier"){
				bid.adUrl = refThis.replaceAuctionPrice(bid.adUrl, bid.getGrossEcpm());
			}
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

			var bidDetails = bidManager.getBidById(msgData.pwt_bidID);
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
				var bidDetails = bidManager.getBidById(msgData.pwt_bidID);
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

// Returns mediaTypes for adUnits which are sent to prebid
exports.getAdUnitConfig = function(sizes, currentSlot){
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
				if(config.renderer && !refThis.isEmptyObject(config.renderer)){
					adUnitConfig['renderer'] = config.renderer;
				}
			}
			if(refThis.isOwnProperty(slotConfig['config'], kgpv)){
				config = slotConfig["config"][kgpv];
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
				if(!isBanner ||  (config.banner && (refThis.isOwnProperty(config.banner, 'enabled') && !config.banner.enabled))){
					refThis.mediaTypeConfig[divId] = mediaTypeObject;  
					adUnitConfig['mediaTypeObject'] = mediaTypeObject
					return adUnitConfig;      
				}
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
				if(keys[0].match(new RegExp(rxPattern.AU)) && keys[1].match(new RegExp(rxPattern.DIV)) && keys[2].match(new RegExp(rxPattern.SIZE))){
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
	refThis.forEachOnObject(CONFIG.getIdentityPartners(),function(parterId, partnerValues){
		userIdConfs.push(refThis.getUserIdParams(partnerValues));
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
	if(userIdParams && userIdParams.params && userIdParams.params['loadATS'] == 'true'){
		refThis.initLiveRampAts(userIdParams);
	}
	return userIdParams;
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
exports.generateMonetizationPixel = function(slotID, theBid){
	var pixelURL = CONFIG.getMonetizationPixelURL(),
		pubId = CONFIG.getPublisherId();
	var netEcpm, grossEcpm, kgpv, bidId, adapterId, adapterName;
	var sspID = "";
	const isAnalytics = true; // this flag is required to get grossCpm and netCpm in dollars instead of adserver currency

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

	pixelURL += "pubid=" + pubId;
	pixelURL += "&purl=" + window.encodeURIComponent(refThis.metaInfo.pageURL);
	pixelURL += "&tst=" + refThis.getCurrentTimestamp();
	pixelURL += "&iid=" + window.encodeURIComponent(window.PWT.bidMap[slotID].getImpressionID());
	pixelURL += "&bidid=" + window.encodeURIComponent(bidId);
	pixelURL += "&pid=" + window.encodeURIComponent(CONFIG.getProfileID());
	pixelURL += "&pdvid=" + window.encodeURIComponent(CONFIG.getProfileDisplayVersionID());
	pixelURL += "&slot=" + window.encodeURIComponent(slotID);
	pixelURL += "&bc=" + window.encodeURIComponent(adapterId);
	pixelURL += "&pn=" + window.encodeURIComponent(adapterName);
	pixelURL += "&en=" + window.encodeURIComponent(netEcpm);
	pixelURL += "&eg=" + window.encodeURIComponent(grossEcpm);
	pixelURL += "&kgpv=" + window.encodeURIComponent(kgpv);
	pixelURL += "&piid=" + window.encodeURIComponent(sspID);

	return CONSTANTS.COMMON.PROTOCOL + pixelURL;
};
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
exports.UpdateVastWithTracker= function(bid, vast){
	try{
		var domParser = new DOMParser();
		var parsedVast = domParser.parseFromString(vast,"application/xml");
		var impEle = parsedVast.createElement("Impression");
		impEle.innerHTML =	"<![CDATA["+ refThis.generateMonetizationPixel(bid.adUnitCode, bid)+"]]>";
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

exports.initLiveRampAts = function(params){
	function addATS() {
		var atsScript = document.createElement('script');
		if(params.params.cssSelectors && params.params.cssSelectors.length>0){
			params.params.cssSelectors = params.params.cssSelectors.split(',');
		}
		atsScript.onload = function() {
		  window.ats.start(        {
			  "placementID": params.params.pid,
			  "storageType":params.params.storageType,
			  "detectionType": params.params.detectionType,
			  "urlParameter": params.params.urlParameter,
			  "cssSelectors":params.params.cssSelectors,// ["input[type=text]", "input[type=email]"],
			  "logging": params.params.logging, //"error"
			  "detectDynamicNodes": params.params.detectDynamicNodes
			});
		};
		atsScript.src = 'https://ats.rlcdn.com/ats.js';
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
			for(key in CONSTANTS.SPECIAL_CASE_ID_PARTNERS[partnerName]) {
				switch (CONSTANTS.SPECIAL_CASE_ID_PARTNERS[partnerName][key]) {
					case 'number':
						if(params[key] && typeof params[key] !== 'number') {
							value = parseInt(params[key])
							isNaN(value) ?
								refThis.logError(partnerName + ": Invalid parameter value '" + params[key] + "' for parameter " + key) :
								params[key] = value;
						}
						break;
					default:
						return;
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
}
