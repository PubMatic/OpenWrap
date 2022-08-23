var hasOwnProperty = Object.prototype.hasOwnProperty,

	utilIsIframe = function(){
	    try{
	        return window.self !== window.top;
	    }catch(e){
	        return false;
	    }
	},

	getIndexInPageURL = function(findString){

		if(utilIsIframe()){
			return win.document.referrer.indexOf( findString );
		}

		return win.location.href.indexOf( findString );
	},

	utilEnableDebugLog	= (function(){
		try{
			return getIndexInPageURL( constDebugInConsoleKeyword ) >= 0 ? true : false;
		}catch(ex){}
		
		return false;
	})(),

	utilEnableVLog	= (function(){		
		try{
			if(getIndexInPageURL( constDebugInOverlay ) >= 0){
				utilEnableDebugLog = true;
				return true;
			}					
		}catch(ex){}				
		return false;
	})(),

	utilUsingDifferentProfileVersionID = (function(){
		try{
			if(getIndexInPageURL( 'pwtv=' ) >= 0){
				return true;
			}
		}catch(ex){}
		return false;
	})(),

	utilCreateVLogInfoPanel = function(divID, dimensionArray){
		var element,
			infoPanelElement,
			infoPanelElementID
		;	

		if(utilEnableVLog){
			element = doc.getElementById(divID);
			if(element && dimensionArray.length && dimensionArray[0][0] && dimensionArray[0][1]){
				infoPanelElementID = divID + '-pwtc-info';
				if(!utilIsUndefined(doc.getElementById(infoPanelElementID))){
					var pos = utilGetElementLocation(element);
					infoPanelElement = doc.createElement('div');
					infoPanelElement.id = infoPanelElementID;					
					infoPanelElement.style = 'position: absolute; /*top: '+pos.y+'px;*/ left: '+pos.x+'px; width: '+dimensionArray[0][0]+'px; height: '+dimensionArray[0][1]+'px; border: 1px solid rgb(255, 204, 52); padding-left: 11px; background: rgb(247, 248, 224) none repeat scroll 0% 0%; overflow: auto; z-index: 9999997; visibility: hidden;opacity:0.9;font-size:13px;font-family:monospace;';

					var closeImage = doc.createElement('img');
					closeImage.src = utilMetaInfo.protocol+"ads.pubmatic.com/AdServer/js/pwt/close.png";
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
	},

	utilRealignVLogInfoPanel = function(divID){
		var element,
			infoPanelElement,
			infoPanelElementID
		;

		if(utilEnableVLog){
			element = doc.getElementById(divID);
			if(element){
				infoPanelElementID = divID + '-pwtc-info';
				infoPanelElement = doc.getElementById(infoPanelElementID);
				if(infoPanelElement){
					var pos = utilGetElementLocation(element);
					
					infoPanelElement.style.visibility = 'visible';
					infoPanelElement.style.left = pos.x + 'px';
					infoPanelElement.style.height = element.clientHeight + 'px';
				}
			}
		}
	},

	utilVLogInfo = function(divID, infoObject){
		var infoPanelElement,
			message
		;
		if(utilEnableVLog){		
			var infoPanelElementID = divID + '-pwtc-info';
			infoPanelElement = doc.getElementById(infoPanelElementID);
			if( infoPanelElement ){
				switch(infoObject.type){
					case "bid":
						var latency = infoObject.endTime - infoObject.startTime;
						if(latency < 0){
							latency = 0;
						}
						message = "Bid: " + infoObject.bidder + ": " + infoObject.bidDetails[constTargetingEcpm] + "(" + infoObject.bidDetails[constTargetingActualEcpm] + "): " + latency + "ms";
						if( (TIMEOUT + infoObject.startTime) < infoObject.endTime){
							message += ": POST-TIMEOUT";
						}
						break;

					case "win-bid":
						message = "Winning Bid: " + infoObject.bidDetails[constTargetingAdapterID] + ": " + infoObject.bidDetails[constTargetingEcpm];
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
				infoPanelElement.appendChild(doc.createElement('br'));
			}
		}
	},
	
	utilHasOwnProperty = function(theObject, proertyName){
		return theObject.hasOwnProperty(proertyName);
	},

	utilGetTopFrameOfSameDomain = function(cWin) {
		try {
			if (cWin.parent.document != cWin.document){
			  return utilGetTopFrameOfSameDomain(cWin.parent);
			}
		} catch(e) {}
		return cWin;		
	},

	utilGetElementLocation = function( el ) {

		var   pos
			, rect
			, x = 0
			, y = 0
			;

		if(utilIsFn(el.getBoundingClientRect)) {
			
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
		pos = {
			x: x,
			y: y
		};

		return pos;
	},

	utilGetIncrementalInteger = (function() {
		var count = 0;
		return function() {
			count++;
			return count;
		};
	})(),

	utilGetUniqueIdentifierStr = function() {
		return utilGetIncrementalInteger() + Math.random().toString(16).substr(2);
	},
	
	utilLog = function( data ){	
		if( utilEnableDebugLog && console && utilIsFn(console.log) ){
			utilIsStr(data) ? console.log( (new Date()).getTime()+ ' : ' + constDebugInConsolePrependWith + data ) : console.log(data);
		}
	},

	utilCreateInvisibleIframe = function() {
		var f = document.createElement('iframe');
		f.id = utilGetUniqueIdentifierStr();
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
	},
	
	utilCreateAndInsertFrame = function (theDocument, src, height, width, style){			
		theDocument.write('<iframe'                   
				+ ' frameborder="0" allowtransparency="true" marginheight="0" marginwidth="0" scrolling="no" width="'
				+ width  + '" hspace="0" vspace="0" height="'
				+ height + '"' 
				+ (style ?  ' style="'+ style+'"' : '' )
				+ ' src="' + src + '"'        
				+ '></ifr' + 'ame>');
	},

	utilFindPosition = function(elementID){
		var element = doc.getElementById( elementID );
		
		if(element){
			var pos = utilGetElementLocation( element );
			return pos.y + 'x' + pos.x;
		}
		return '-1x-1';
	},

	utilGetCurrentTimestamp = function(){
		return Math.round( (new Date).getTime()/1000 );
	},

	utilGetCurrentTimestampInMs = function(){
		return (new Date).getTime();
	},	

	utilLoadScript = function(tagSrc, callback) {
		
		if(!utilIsStr(tagSrc)){
			return;
		}

		var jptScript = doc.createElement('script');
		jptScript.type = 'text/javascript';
		jptScript.async = true;
		jptScript.src = tagSrc;

		if (callback && utilIsFn(callback)) {
			if (jptScript.readyState) {
				jptScript.onreadystatechange = function() {
					if (jptScript.readyState == "loaded" || jptScript.readyState == "complete") {
						jptScript.onreadystatechange = null;
						callback();
					}
				};
			} else {
				jptScript.onload = function() {
					callback();
				};
			}
		}
		document.getElementsByTagName("script")[0].parentNode.appendChild(jptScript);
	},

	utilToUrlParams = function ( obj ){
		var   values = []
			, key
			, value
			;
		
		for(key in obj ){
			
			value=obj[ key ];
			
			if ( utilHasOwnProperty(obj, key) && value != undefined && value !== ''  ) { //NOTE: keep value !== '' , as ( ( 0 != '' )  == true ) 					
				values.push(key + '=' + utilEncodeIfRequired( value ) );
			} 
		}
		
		return values.join( '&' );
	},

	utilEncodeIfRequired = function( s ){
		var encodeURIC	= window.encodeURIComponent,
			decodeURIC	= window.decodeURIComponent
		;
		
		try{		
			s = utilIsStr(s) ? s : ''+s; //Make sure that this is string
			s = decodeURIC(s) === s ? encodeURIC(s) : s;
			if(s.indexOf('&') >=0 || s.indexOf('=') >=0 || s.indexOf('?') >=0 ){
				s = encodeURIC(s);
			}			
			return s;
		}catch(ex){
			return "";
		}		
	},	

	utilLoadGlobalConfigForAdapter = function(configObject, adapterID, mandatoryParams){		
		if(	utilHasOwnProperty(configObject, constCommonGlobal) 
			&& utilHasOwnProperty(configObject[constCommonGlobal], constCommonAdapters)
			&& utilHasOwnProperty(configObject[constCommonGlobal][constCommonAdapters], adapterID)){

			var adapterConfig = configObject[constCommonGlobal][constCommonAdapters][adapterID];

			// if mandatory params are not present then return false
			if(!utilCheckMandatoryParams(adapterConfig, mandatoryParams, adapterID)){
				utilLog(adapterID+constCommonMessage07);
				return false;
			}

			return configObject[constCommonGlobal][constCommonAdapters][adapterID];
		}
		return false;
	},

	utilGenerateSlotNamesFromPattern = function(activeSlot, pattern){
		
		var slotNames = [],
			slotName,
			slotNamesObj = {},
			sizeArrayLength,
			i
			;
		
		if(activeSlot && activeSlot[constAdSlotSizes]){
			sizeArrayLength = activeSlot[constAdSlotSizes].length;
			if( sizeArrayLength > 0){
				for(i = 0; i < sizeArrayLength; i++){
					if(activeSlot[constAdSlotSizes][i][0] && activeSlot[constAdSlotSizes][i][1]){

						slotName = pattern;
						slotName = slotName.replace(constCommonMacroForAdUnitIDRegExp, activeSlot[constAdUnitID])
											.replace(constCommonMacroForWidthRegExp, activeSlot[constAdSlotSizes][i][0])
											.replace(constCommonMacroForHeightRegExp, activeSlot[constAdSlotSizes][i][1])
											.replace(constCommonMacroForAdUnitIndexRegExp, activeSlot[constAdUnitIndex])
											.replace(constCommonMacroForIntegerRegExp, utilGetIncrementalInteger())
											.replace(constCommonMacroForDivRegExp, activeSlot[constCommonDivID]);

						if(! utilHasOwnProperty(slotNamesObj, slotName)){
							slotNamesObj[slotName] = '';
							slotNames.push(slotName);
						}
					}
				}
			}
		}

		return slotNames;
	},

	utilResizeWindow = function(theDocument, height, width){
		if(height && width){
			try{
				var fr = theDocument.defaultView.frameElement;
				fr.width = width;
				fr.height = height;
			}catch(e){}
		}
	},

	utilDisplayCreative = function(theDocument, bidDetails){
		utilResizeWindow(theDocument, bidDetails[constTargetingHeight], bidDetails[constTargetingWidth]);

		if(bidDetails[constTargetingAdHTML]){
			theDocument.write(bidDetails[constTargetingAdHTML]);
		}else if(bidDetails[constTargetingAdUrl]){
			utilCreateAndInsertFrame(
				theDocument,
				bidDetails[constTargetingAdUrl], 
				bidDetails[constTargetingHeight] , bidDetails[constTargetingWidth] , 
				""
			);
		}else{
			utilLog("creative details are not found");
			utilLog(bidDetails);
		}
		
		theDocument.close();
	},

	utilGenerateUUID = function() {
	    var d = new Date().getTime(),
	    	url = decodeURIComponent(utilMetaInfo.u).toLowerCase().replace(/[^a-z,A-Z,0-9]/gi, ''),
	    	urlLength = url.length
	    ;
	    if(win.performance && utilIsFn(win.performance.now)){
	        d += performance.now();
	    }
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-zzzzz'.replace(/[xyz]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        //var op;
	        switch(c){
	        	case 'x':
	        		op = r;
	        		break;
	        	case 'z':
	        		op = url[Math.floor(Math.random()*urlLength)];
	        		break;
	        	default:
	        		op = (r&0x3|0x8);
	        }

	        return op.toString(16);
	    });
	    return uuid;
	},

	utilIsA = function (object, _t) {
		var toString = Object.prototype.toString;    
	    return toString.call(object) === '[object ' + _t + ']';
	},

	utilIsFn = function (object) {
	    return utilIsA(object, 'Function');
	},

	utilIsStr = function (object) {
	    return utilIsA(object, 'String');
	},

	utilIsArray = function (object) {
	    return utilIsA(object, 'Array');
	},

	utilIsNumber = function(object) {
		return utilIsA(object, 'Number');
	},

	utilIsObject = function(object){
		return typeof object === "object";
	},

	utilIsUndefined = function(object){
		return typeof object === "undefined";
	},

	utilIsEmpty = function (object) {
	    if (!object) return true;
	    if (utilIsArray(object) || utilIsStr(object)) return !(object.length > 0);
	    for (var k in object) {
	        if (hasOwnProperty.call(object, k)) return false;
	    }
	    return true;
	},

	utilEach = function (object, fn) {
	    if (utilIsEmpty(object)) return;
	    if (utilIsFn(object.forEach)) return object.forEach(fn);

	    var k = 0,
	        l = object.length;

	    if (l > 0) {
	        for (; k < l; k++) fn(object[k], k, object);
	    } else {
	        for (k in object) {
	            if (hasOwnProperty.call(object, k)) fn(object[k], k, object);
	        }
	    }
	},

	utilCheckMandatoryParams = function(object, keys, adapterID){
		var error = false,
			success = true
		;

		if(!object || !utilIsObject(object) || utilIsArray(object)){
			utilLog(adapterID + 'provided object is invalid.');
			return error;
		}

		if(!utilIsArray(keys)){
			utilLog(adapterID + 'provided keys must be in an array.');
			return error;
		}

		var arrayLength = keys.length;
		if(arrayLength == 0){
			return success;
		}

		for(var i=0; i<arrayLength; i++){
			if(!utilHasOwnProperty(object, keys[i])){
				utilLog(adapterID + ': '+keys[i]+', mandatory parameter not present.');
				return error;
			}
		}

		return success;
	},

	utilForEachGeneratedKey = function(adapterID, slotConfigMandatoryParams, activeSlots, keyGenerationPattern, keyLookupMap, handlerFunction, addZeroBids){
		var activeSlotsLength = activeSlots.length,
			i,
			j,
			generatedKeys,
			generatedKeysLength,
			kgpConsistsWidthAndHeight
		;

		if(activeSlotsLength > 0 && keyGenerationPattern.length > 3){
			kgpConsistsWidthAndHeight = keyGenerationPattern.indexOf(constCommonMacroForWidth) >= 0 && keyGenerationPattern.indexOf(constCommonMacroForHeight) >= 0;
			for(i = 0; i < activeSlotsLength; i++){
				generatedKeys = utilGenerateSlotNamesFromPattern( activeSlots[i], keyGenerationPattern );
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
							utilLog(adapterID+': '+generatedKey+constCommonMessage08);
						}else if(!utilCheckMandatoryParams(keyConfig, slotConfigMandatoryParams, adapterID)){
							utilLog(adapterID+': '+generatedKey+constCommonMessage09);
						}else{
							callHandlerFunction = true;
						}
					}

					if(callHandlerFunction){

						if(addZeroBids == true){
							bidManagerSetBidFromBidder(
								activeSlots[i][constCommonDivID], 
								adapterID, 
								bidManagerCreateBidObject(
									0,
									bidManagerCreateDealObject(),
									"",
									"",
									"",
									0,
									0,
									generatedKey,
									null,
									1
								), 
								utilGetUniqueIdentifierStr()
							);
						}

						handlerFunction(
							generatedKey, 
							kgpConsistsWidthAndHeight, 
							activeSlots[i], 
							keyLookupMap ? keyLookupMap[generatedKey] : null, 
							activeSlots[i][constAdSlotSizes][j][0], 
							activeSlots[i][constAdSlotSizes][j][1]
						);
					}	
				}
			}
		}
	},

	utilMetaInfo = (function(){
		var  obj = {}
			, MAX_PAGE_URL_LEN = 512
			, frame
		;
		
		obj.u = "";
		obj.r = "";
		
		try{
			frame = utilGetTopFrameOfSameDomain(win);				
			obj.r = ( frame.refurl || frame.document.referrer || '' ).substr( 0, MAX_PAGE_URL_LEN );
			obj.u = ( frame !== top && frame.document.referrer != ""  ? frame.document.referrer : frame.location.href).substr(0, MAX_PAGE_URL_LEN );
			
			obj.u = utilEncodeIfRequired( obj.u );
			obj.r = utilEncodeIfRequired( obj.r );
			
		}catch(e){}

		obj.protocol = (function(){
			var frame = utilGetTopFrameOfSameDomain(win);
			if(frame.location.protocol ===  "https:"){
				obj.secure = 1;
				return "https://";
			}
			obj.secure = 0;
			return "http://";
		})();		

		return obj;
	})(),

	utilCopyKeyValueObject = function(copyTo, copyFrom){
		for(var key in copyFrom){
			
			copyFrom[key] = utilIsArray(copyFrom[key]) ? copyFrom[key] : [copyFrom[key]];

			if(utilHasOwnProperty(copyFrom, key)){
				if(utilHasOwnProperty(copyTo, key)){
					copyTo[key].push.apply(copyTo[key], copyFrom[key])	;
				}else{
					copyTo[key] = copyFrom[key];
				}
			}
		}
	},

	utilAjaxCall = function(url, callback, data, options) {
		try {

			options = options || {};

			var x,
				XHR_DONE = 4,				
				ajaxSupport = true,
				method = options.method || (data ? 'POST' : 'GET')
			;

			if(!window.XMLHttpRequest){
				ajaxSupport = false;
			}else{
				x = new window.XMLHttpRequest();
				if(utilIsUndefined(x.responseType)){
					ajaxSupport = false;
				}
			}

			if(!ajaxSupport){
				utilLog('Ajax is not supported');
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
				x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			}

			x.setRequestHeader('Content-Type', options.contentType || 'text/plain');		
			x.send(method === 'POST' && data);

		}catch(error){
			utilLog('Failed in Ajax');
			utilLog(error);
		}
	},

	utilGetDealChannelValue = function(map, key){
		if(!utilIsObject(map)){
			return constDealChannelPMP;
		}
		return utilHasOwnProperty(map, key) ? map[key] : constDealChannelPMP;
	},

	utilTrim = function(s){
		if(!utilIsStr(s)){
			return s;
		}else{
			return s.replace(/^\s+/g,'').replace(/\s+$/g,'');
		}
	},

	utilAddMessageEventListener = function(eventHandler){

		if(typeof eventHandler !== "function"){
			utilLog("EventHandler should be a function");
			return false;
		}

		if(window.addEventListener){
			window.addEventListener("message", eventHandler, false);
		}else{
			window.attachEvent("onmessage", eventHandler);
		}

		return true;
	},

	utilGetBididForPMP = function(values, priorityArray){

		values = values.split(',');

		var valuesLength = values.length,
			priorityArrayLength = priorityArray.length,
			selectedPMPDeal = '',
			bidID = ''
		;

		if(valuesLength == 0){
			utilLog('Error: Unable to find bidID as values array is empty.');
			return;
		}
		
		for(var i = 0; i < priorityArrayLength; i++){

			for(var j = 0; j < valuesLength; j++){
				if(values[j].indexOf(priorityArray[i]) >= 0){
					selectedPMPDeal = values[j];
					break;
				}
			}

			if(selectedPMPDeal != ''){
				break;
			}
		}
		
		if(selectedPMPDeal == ''){
			selectedPMPDeal = values[0];
			utilLog('No PMP-Deal was found matching PriorityArray, So Selecting first PMP-Deal: '+ selectedPMPDeal);		
		}else{
			utilLog('Selecting PMP-Deal: '+ selectedPMPDeal);	
		}

		var temp = selectedPMPDeal.split(constDealKeyValueSeparator);
		if(temp.length == 3){
			bidID = temp[2];
		}

		if(!bidID){
			utilLog('Error: bidID not found in PMP-Deal: '+ selectedPMPDeal);
			return;
		}

		return bidID;
	},

	utilSafeFrameCommunicationProtocol = function(msg){
		try{
			msgData = JSON.parse(msg.data);
			
			if(!msgData.pwt_type){
				return;
			}

			switch(parseInt(msgData.pwt_type)){

				case 1:
					if(inSafeFrame){
						return;
					}
					
					var bidDetails = bidManagerGetBidById(msgData.pwt_bidID);
					if(bidDetails){
						var theBid = bidDetails.bid,
							adapterID = bidDetails.adapter,
							divID = bidDetails.slotid,
							newMsgData = {
								pwt_type: 2,
								pwt_bid: theBid
							}
						;
						utilVLogInfo(divID, {type: 'disp', adapter: adapterID});
						bidManagerExecuteMonetizationPixel(divID, adapterID, theBid, msgData.pwt_bidID);
						msg.source.postMessage(JSON.stringify(newMsgData), msgData.pwt_origin);
					}

					break;					

				case 2:
					if(!inSafeFrame){
						return;
					}
					
					if(msgData.pwt_bid){
						//utilDisplayCreative(window.document, msgData.pwt_bid);

						//new code
						var theBid = msgData.pwt_bid;
						utilResizeWindow(window.document, theBid[constTargetingHeight], theBid[constTargetingWidth]);

						if(theBid[constTargetingAdHTML]){
							/*var iframe = utilCreateInvisibleIframe();
							iframe.setAttribute('width', theBid[constTargetingWidth]);
	        				iframe.setAttribute('height', theBid[constTargetingHeight]);
	        				iframe.style = '';
	        				window.document.body.appendChild(iframe);
							iframe.contentDocument.open();
							var creative = "<script>var $sf = window.parent.$sf;<\/script>" + 
								"<script>setInterval(function(){try{var fr = window.document.defaultView.frameElement;fr.width = window.parent.document.defaultView.innerWidth;fr.height = window.parent.document.defaultView.innerHeight;}catch(e){}}, 200);</script>" + 
								theBid[constTargetingAdHTML];
							iframe.contentDocument.write(creative);
							iframe.contentDocument.close();*/

							try{
								var iframe = utilCreateInvisibleIframe();
								if(!iframe){
									throw {message: 'Failed to create invisible frame.', name:""};
								}

								iframe.setAttribute('width', theBid[constTargetingWidth]);
	        					iframe.setAttribute('height', theBid[constTargetingHeight]);
	        					iframe.style = '';

								window.document.body.appendChild(iframe);

								if(!iframe.contentWindow){
									throw {message: 'Unable to access frame window.', name:""};
								}

								var iframeDoc = iframe.contentWindow.document;
								if(!iframeDoc){
									throw {message: 'Unable to access frame window document.', name:""};
								}

								var content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><scr' + 'ipt>inDapIF=true;</scr' + 'ipt></head>';
									content += '<body>';
									content += "<script>var $sf = window.parent.$sf;<\/script>";
									content += "<script>setInterval(function(){try{var fr = window.document.defaultView.frameElement;fr.width = window.parent.document.defaultView.innerWidth;fr.height = window.parent.document.defaultView.innerHeight;}catch(e){}}, 200);</script>";
									content += theBid[constTargetingAdHTML];
									content += '</body></html>';

								iframeDoc.write(content);
								iframeDoc.close();
								
							}catch(e){
								utilLog('Error in rendering creative in safe frame.');
								//utilLog(e);
								utilLog('Rendering synchronously.');
								utilDisplayCreative(window.document, msgData.pwt_bid);
							}

						}else if(theBid[constTargetingAdUrl]){
							utilCreateAndInsertFrame(
								window.document,
								theBid[constTargetingAdUrl], 
								theBid[constTargetingHeight] , theBid[constTargetingWidth] , 
								""
							);
						}else{
							utilLog("creative details are not found");
							utilLog(theBid);
						}											
					}

					break;
			}
		}catch(e){}
	},

	utilAddMessageEventListenerForSafeFrame = function(isInSafeFrame){
		inSafeFrame = isInSafeFrame;
		if(!safeFrameMessageListenerAdded){
			utilAddMessageEventListener(utilSafeFrameCommunicationProtocol);
			safeFrameMessageListenerAdded = true;
		}
	}
;