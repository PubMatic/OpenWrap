//todo
//  pageURL refURL protocol related functions
// forEachOnArray

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
	if(theObject.hasOwnProperty){
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

//todo: move...
var constDebugInConsolePrependWith = "[OpenWrap] : ";



exports.log = function(data){
	if( refThis.debugLogIsEnabled && console && this.isFunction(console.log) ){ // eslint-disable-line no-console
		if(this.isString(data)){
			console.log( (new Date()).getTime()+ " : " + constDebugInConsolePrependWith + data ); // eslint-disable-line no-console
		}else{
			console.log(data); // eslint-disable-line no-console
		}
	}
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

exports.generateSlotNamesFromPattern = function(activeSlot, pattern){
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
		sizeArrayLength = sizeArray.length;
		/* istanbul ignore else */
		if( sizeArrayLength > 0){
			for(i = 0; i < sizeArrayLength; i++){
				/* istanbul ignore else */
				if(sizeArray[i][0] && sizeArray[i][1]){

					slotName = pattern;
					slotName = slotName.replace(constCommonMacroForAdUnitIDRegExp, activeSlot.getAdUnitID())
                    .replace(constCommonMacroForWidthRegExp, sizeArray[i][0])
                    .replace(constCommonMacroForHeightRegExp, sizeArray[i][1])
                    .replace(constCommonMacroForAdUnitIndexRegExp, activeSlot.getAdUnitIndex())
                    .replace(constCommonMacroForIntegerRegExp, refThis.getIncrementalInteger())
                    .replace(constCommonMacroForDivRegExp, activeSlot.getDivID());

                    /* istanbul ignore else */
					if(! refThis.isOwnProperty(slotNamesObj, slotName)){
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
	/* istanbul ignore else */
	if(!object || !refThis.isObject(object) || refThis.isArray(object)){
		refThis.log(adapterID + "provided object is invalid.");
		return error;
	}
	/* istanbul ignore else */
	if(!refThis.isArray(keys)){
		refThis.log(adapterID + "provided keys must be in an array.");
		return error;
	}

	var arrayLength = keys.length;
	/* istanbul ignore else */
	if(arrayLength == 0){
		return success;
	}

	// can not change following for loop to refThis.forEachOnArray
	for(var i=0; i<arrayLength; i++){
		/* istanbul ignore else */
		if(!refThis.isOwnProperty(object, keys[i])){
			refThis.log(adapterID + ": "+keys[i]+", mandatory parameter not present.");
			return error;
		}
	}

	return success;
};

exports.forEachGeneratedKey = function(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, activeSlots, keyGenerationPattern, keyLookupMap, handlerFunction, addZeroBids){
	var activeSlotsLength = activeSlots.length,
		i,
		j,
		generatedKeys,
		generatedKeysLength,
		kgpConsistsWidthAndHeight
		;

	/* istanbul ignore else */
	if(activeSlotsLength > 0 && keyGenerationPattern.length > 3){
		kgpConsistsWidthAndHeight = keyGenerationPattern.indexOf(CONSTANTS.MACROS.WIDTH) >= 0 && keyGenerationPattern.indexOf(CONSTANTS.MACROS.HEIGHT) >= 0;
		for(i = 0; i < activeSlotsLength; i++){
			var activeSlot = activeSlots[i];
			generatedKeys = refThis.generateSlotNamesFromPattern( activeSlot, keyGenerationPattern );
			generatedKeysLength = generatedKeys.length;
			for(j = 0; j < generatedKeysLength; j++){
				var generatedKey = generatedKeys[j],
					keyConfig = null,
					callHandlerFunction = false,
					sizeArray = activeSlot.getSizes()
					;

				if(keyLookupMap == null){
					callHandlerFunction = true;
				}else{
					keyConfig = keyLookupMap[generatedKey];
					if(!keyConfig){
						refThis.log(adapterID+": "+generatedKey+CONSTANTS.MESSAGES.M8);
					}else if(!refThis.checkMandatoryParams(keyConfig, slotConfigMandatoryParams, adapterID)){
						refThis.log(adapterID+": "+generatedKey+CONSTANTS.MESSAGES.M9);
					}else{
						callHandlerFunction = true;
					}
				}

				/* istanbul ignore else */
				if(callHandlerFunction){

					if(addZeroBids == true){
						var bid = BID.createBid(adapterID, generatedKey);
						bid.setDefaultBidStatus(1).setReceivedTime(refThis.getCurrentTimestampInMs());
						bidManager.setBidFromBidder(activeSlot.getDivID(), bid);
					}

					handlerFunction(
						adapterID,
						adUnits,
						adapterConfig,
						impressionID,
						generatedKey,
						kgpConsistsWidthAndHeight,
						activeSlot,
						keyLookupMap ? keyLookupMap[generatedKey] : null,
						sizeArray[j][0],
						sizeArray[j][1]
					);
				}
			}
		}
	}
};

exports.resizeWindow = function(theDocument, width, height){
	/* istanbul ignore else */
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
	refThis.resizeWindow(theDocument, bid.width, bid.height);
	if(bid.adHtml){
		theDocument.write(bid.adHtml);
	}else if(bid.adUrl){
		refThis.writeIframe(theDocument, bid.adUrl, bid.width, bid.height, "");
	}else{
		refThis.log("creative details are not found");
		refThis.log(bid);
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

exports.findInString = function(theString, find){
	return theString.indexOf(find) >= 0;
};

exports.findQueryParamInURL = function(url, name){
	return refThis.isOwnProperty(refThis.parseQueryParams(url), name);
};

exports.parseQueryParams = function(url){
	var parser = window.document.createElement('a');
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

exports.addHookOnFunction = function(theObject, useProto, functionName, newFunction){
	var callMethodOn = theObject;
	theObject = useProto ? theObject.__proto__ : theObject;
	if(refThis.isObject(theObject) && refThis.isFunction(theObject[functionName])){
		var originalFunction = theObject[functionName];
		theObject[functionName] = newFunction(callMethodOn, originalFunction);
	}else{
		refThis.log("in assignNewDefination: oldReference is not a function");
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

exports.createInvisibleIframe = function() {
	var f = window.document.createElement('iframe');
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
	f.src = 'about:self';//todo: test by setting empty src on safari
	f.style = 'display:none';
	return f;
}

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
}

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
					var theBid = bidDetails.bid,
						adapterID = theBid.getAdapterID(),
						divID = bidDetails.slotid,
						newMsgData = {
							pwt_type: 2,
							pwt_bid: theBid
						}
					;
					refThis.vLogInfo(divID, {type: 'disp', adapter: adapterID});
					bidManager.executeMonetizationPixel(divID, theBid);
					msg.source.postMessage(window.JSON.stringify(newMsgData), msgData.pwt_origin);
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
					refThis.resizeWindow(window.document, theBid.height, theBid.width);

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
							refThis.log('Error in rendering creative in safe frame.');
							refThis.log(e);
							refThis.log('Rendering synchronously.');
							refThis.displayCreative(window.document, msgData.pwt_bid);
						}

					}else if(theBid.adUrl){
						refThis.writeIframe(window.document, theBid.adUrl, theBid.width, theBid.height, "");
					}else{
						refThis.log("creative details are not found");
						refThis.log(theBid);
					}
				}
				break;
		}
	}catch(e){}
}

exports.addMessageEventListenerForSafeFrame = function(theWindow){
	refThis.addMessageEventListener(theWindow, refThis.safeFrameCommunicationProtocol);
};

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
					/* istanbul ignore else */
					if(latency < 0){
						latency = 0;
					}
					message = "Bid: " + infoObject.bidder + (infoObject.s2s ? "(s2s)" : "") + ": " + bidDetails.getNetEcpm() + "(" + bidDetails.getGrossEcpm() + "): " + latency + "ms";
					/* istanbul ignore else */
					if(bidDetails.getPostTimeoutStatus()){
						message += ": POST-TIMEOUT";
					}
					break;

				case "win-bid":
					var bidDetails = infoObject.bidDetails;
					message = "Winning Bid: " + bidDetails.getAdapterID() + ": " + bidDetails.getNetEcpm();
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
