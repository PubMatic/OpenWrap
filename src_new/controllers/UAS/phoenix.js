var CONSTANTS = require("../../constants.js");
var UTIL = require("../../util.js");
var EQ = require("./executionQueue.js");
var SO = require("./slotObject.js");

exports.PhoenixClass = function(){
	var singleRequestCall = false,
		isSingleRequestCallAlreadyFired = false, // not used
		req_type = 219,
		// some common data-storages
		commonKeywordsAnding = 0,
		commonTargetings = {},
		commonKeywords = [],
		customInfo = {},
		slotStorage = {}, // will store map of divid ==> slotObject
		queryParams = {}, // todo can we use util function here ?
		serevr_path = "ae.pubmatic.com/ad?"
	;

	// todo: public
	var generateAdServerCall = function(arrayOfSlots){
		var queryString = [],
			currTime = new Date(),
			key,

			combineGlobalTargetings = function(){
				var targetinKey,
					output = ''
				;

				for(targetingKey in commonTargetings){
					output += targetingKey + '=' + commonTargetings[ targetingKey ].join() + '&'
				}
				output = output.substr(0, output.length -1 );

				return output;
			},

			//combineSlotsData = function(dataAttribute, divId){
			combineSlotsData = function(dataAttribute, arrayOfSlots){
				var theSlot,
					output = "",
					index,
					aSlot,
					defaultDataAttributeCombiner = "|",
					//mention only exceptions for different dataAttributeCombiner
					dataAttributeCombiner = {
						//'adUnit'	: '-'  //example: as it's different from default
					};

				for(index in arrayOfSlots){
					aSlot = arrayOfSlots[ index ];
					output += combineSlotSpecificData(dataAttribute, aSlot) + (dataAttributeCombiner.hasOwnProperty(dataAttribute) ? dataAttributeCombiner[dataAttribute]: defaultDataAttributeCombiner);
					aSlot.setStatus( CONSTANTS.SLOT_STATUS.DISPLAYED );
				}
				output = output.substr(0, output.length -1 );

				return output;
			},

			combineSlotSpecificData = function(dataAttribute, theSlot){
				var //theSlot,
					temp,
					i,
					len,
					output = '',
					dataAttributeFunctionMap = {
						'adUnit'			: 'getAdUnit',
						'adDiv'				: 'getDivElement',
						'adSizes'			: 'getDimensions',
						'keywords'			: 'getKeywords',
						'keywordsOperation'	: 'getKeywordsOperation',
						'targetings'		: 'getTargetingKeys',
						'targetingByKey'	: 'getTargeting',
						'nativeTemplateID'	: 'getNativeTemplateID',
						'visibility':	'getVisibility',
						'extraParameters': 'getExtraPatameterKeys',
						'extraPatameterByKey': 'getExtraParameters'
					}
				;

					switch(dataAttribute){
						case 'adUnit':
						case 'adDiv':
						case 'nativeTemplateID':
						case 'visibility':
							if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){// todo: this if bracket can be taken above switch
								output = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
							}
							break;

						//todo: what to do if adunit is targeted at all sizes ?
						//		empty array should be passed []
						//		but then what should be passed ?
						case 'adSizes':
							if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){
								// temp will contain an array of sizes
								temp = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
								len = temp.length;
								for(i=0; i<len; i++){
									if(temp[i][0] && temp[i][1]){
										output += temp[i][0] + 'x' + temp[i][1] + ','
									}
								}
								output = output.substr(0, output.length -1 );
							}
							break;

						case 'keywords':
							if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){
								output = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
								output = output.join();
							}
							break;

						case 'keywordsOperation':
							if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){
								output = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
							}
							break;

							case 'targetings':
							case 'extraParameters':
								if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){

									// temp will contain list of keys first
									temp = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
									len = temp.length;
									for(i=0; i<len; i++){

										switch(dataAttribute) {
											case 'targetings':
												output += temp[i] + '=' + (theSlot[ dataAttributeFunctionMap[ 'targetingByKey' ] ]( temp[i] )).join() + '&';
												break;

											case 'extraParameters':
												output += temp[i] + '=' + (theSlot[ dataAttributeFunctionMap[ 'extraPatameterByKey' ] ]( temp[i] )).join() + '&';
												break;
										}

									}
									output = output.substr(0, output.length -1 );
								}
								break;
					}

				return output;
			}
		;

		queryString.push(

			'req_type=' + req_type,
			'sec=' + window.PWT.secure,

			'res_format=2',

			//Callback function
			'cback=window.parent.Phoenix.callback', // todo: window.parent ??  we may need to rethink

			//Random Number
			'rndn='			+ Math.random(),

			'purl='			+ encodeURIComponent(window.PWT.pageURL),
			'rurl='			+ encodeURIComponent(window.PWT.refURL),

			//In Iframe
			'iifr='			+ (self === top ? '0' : '1'),

			//Screen Resolution
			'scrn='			+ encodeURIComponent( screen.width + 'x' + screen.height ),

			//Timezone
			'tz='			+ encodeURIComponent( currTime.getTimezoneOffset()/60  * -1 ),

			//Timestamp
			'kltstamp='		+ encodeURIComponent( currTime.getFullYear() + "-" + (currTime.getMonth() + 1) + "-" + currTime.getDate() + " " + currTime.getHours() + ":" + currTime.getMinutes() + ":" + currTime.getSeconds() ),

			//Slot(s) adUnit Id
			'au='			+ encodeURIComponent( combineSlotsData('adUnit', arrayOfSlots) ),

			//getDivElement
			// Slot(s) adDiv
			'iid='		+ encodeURIComponent( combineSlotsData('adDiv', arrayOfSlots) ),

			// Slot(s) adSize(s)
			'asz='		+ encodeURIComponent( combineSlotsData('adSizes', arrayOfSlots) ),

			//Slot(s) keywords
			//'slt_kwd='		+ encodeURIComponent( combineSlotsData('keywords', arrayOfSlots) ),

			//'slt_kwd_op='	+ encodeURIComponent( combineSlotsData('keywordsOperation', arrayOfSlots) ),

			//Slot(s) targetings
			'slt_kv='		+ encodeURIComponent( combineSlotsData('targetings', arrayOfSlots) ),

			'ntid='			+ encodeURIComponent( combineSlotsData('nativeTemplateID', arrayOfSlots) ),

			'visi='			+ encodeURIComponent( combineSlotsData('visibility', arrayOfSlots) ),

			//Global Keywords
			//'g_kwd='		+ encodeURIComponent( commonKeywords.join() ),

			//Global Keywords Operation
			//'g_kwd_op='		+ commonKeywordsAnding,

			//Global Targetings / key-values
			'gkv='			+ encodeURIComponent( combineGlobalTargetings() ), // temporary code
			//Slot(s) extra parameters
			'slt_param=' + encodeURIComponent( combineSlotsData('extraParameters', arrayOfSlots) )
		);

		// also adding customInfo
		for(key in customInfo){
			if(customInfo.hasOwnProperty(key)){
				queryString.push(key + '=' + customInfo[key]);
			}
		}

		if(PubMatic.pm_uid_bc){
			queryString.push('bcuid=' + PubMatic.pm_uid_bc);
		}

		// add Test Params
		for(key in queryParams){
			if(queryParams.hasOwnProperty(key) && testParams.hasOwnProperty(key)){
				queryString.push(key + '=' + queryParams[key]);
			}
		}

		return window.PWT.protocol + serevr_path + queryString.join('&');
	};

	// todo: public
	// todo: split in smaller parts
	var createFriendlyIframeAndTriggerAdServerCall = function( addIframeToElementID, adServerRequestCall ){
		var addIframeToElement,
			iframeElement
		;

		addIframeToElement = window.document.getElementById( addIframeToElementID );
		if(addIframeToElement){
			iframeElement = window.document.createElement('iframe');
			iframeElement.id = addIframeToElementID + '_adCall';

			iframeElement.src = 'javascript:document.open();';
			iframeElement.src += 'document.write("<script type=\'text/javascript\' src=\''+ encodeURIComponent(adServerRequestCall) +'\'><\/script>");';
			iframeElement.src += 'document.close();';

			iframeElement.height = 0;
			iframeElement.width = 0;
			iframeElement.scrolling="no";
			//iframeElement.marginwidth="0";
			//iframeElement.marginheight="0";
			iframeElement.frameborder="0";
			//todo: check about src
			//iframeElement.src="javascript:<html><body style='background:transparent'></body></html>";
			iframeElement.style.cssText="border: 0px; vertical-align: bottom; visibility: hidden; display: none;";

			addIframeToElement.appendChild( iframeElement );

			/*iframeElement = window.document.getElementById( addIframeToElementID + '_adCall' );
			if(iframeElement){

				iframeElement.contentWindow.document.write('<script type="text/javascript" src="'+adServerRequestCall+'"><\/script>');

			}*/
		}
	};

	// todo: public
	// todo: split in smaller parts
	var createFriendlyIframeAndRenderCreative = function( addIframeToElementID, responseObject ){
		var addIframeToElement,
			iframeDoc,
			iframeElement,
			content,
			trackers,
			trackersLength,
			i
		;

		addIframeToElement = window.document.getElementById( addIframeToElementID );
		if(addIframeToElement){
			iframeElement = window.document.createElement('iframe');
			iframeElement.id = addIframeToElementID + '_adDisplay';
			iframeElement.height = responseObject.h;
			iframeElement.width = responseObject.w;
			iframeElement.scrolling="no";
			iframeElement.marginwidth="0";
			iframeElement.marginheight="0";
			iframeElement.frameborder="0";
			//iframeElement.src="javascript:<html><body style='background:transparent'><\/body><\/html>";
			iframeElement.style.cssText="border: 0px; vertical-align: bottom;";

			addIframeToElement.appendChild( iframeElement );

			iframeElement = window.document.getElementById( addIframeToElementID + '_adDisplay' );
			if(iframeElement){

				content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><scr' + 'ipt>inDapIF=true;</scr' + 'ipt></head>';
				content += '<body><style>body{margin:0px;padding:0px;}</style>';
				content += '<scr' + 'ipt>';
				content += 'document.write(decodeURIComponent("'+responseObject.ct+'"));';
				if(responseObject.tr){
				trackers = responseObject.tr;
				trackersLength = trackers.length;
				for(i=0; i<trackersLength; i++){
						content += 'document.write("<iframe src=\''+ trackers[i] +'\' style=\'border: 0px; vertical-align: bottom;visibility: hidden; display: none;\'></iframe>");';
					}
				}
				content += '</scr' + 'ipt>';
				content += '</body></html>';

				iframeDoc = iframeElement.contentWindow.document;
				iframeDoc.write(content);
				iframeDoc.close();
			}
		}
	};

	// todo: public
	var getSlotsFilteredByStatus = function(statusObject){
		var tempArray = [],
			iid,
			theSlot
		;

		for(iid in slotStorage){
			theSlot = slotStorage[ iid ];
			if( statusObject.hasOwnProperty( theSlot.getStatus() ) ){
				tempArray.push( theSlot );
			}
		}

		return tempArray;
	};

	// todo: public
	var getSlotByDivId = function(divID){
		if(slotStorage.hasOwnProperty(divID)){
			return slotStorage[ divID ];
		}
		return null;
	};

	this.EQ = new EQ.EexecutionQueue();

	/*this.setPageURL = function(url){
		dynamicPageURL = url;
	};*/

	this.setRequestType = function(value){
		if(! isNaN(value)){
			req_type = value;
		}
	},

	this.enableSingleRequestCallMode = function(){
		singleRequestCall = true;
	};

	// is it required ?
	this.enableCommonKeywordsAnding = function(){
		commonKeywordsAnding = 1;
	};

	// sets common targeting applicable to all slots
	this.setCommonTargeting = function(key, value){
		var i, len;
		// check type of value , always maintain an array of values against a key
		if( ! commonTargetings.hasOwnProperty(key) ){
			commonTargetings[key] = [];
		}

		if(UTIL.isArray(value)){
			len = value.length;
			for(i=0; i<len; i++){
				commonTargetings[key].push( value[i] );
			}
		}else{
			commonTargetings[key].push( value );
		}
	};

	// return array of all common targeting keys
	this.getCommonTargetingKeys = function(){
		var returnArray = [];

		for(key in commonTargetings){
			if( !isUndefined(key) ){
				returnArray.push(key);
			}
		}
		return returnArray;
	};

	// return the common targeting values set against the given key
	this.getCommonTargeting = function(key){
		var returnValue = '';

		if( commonTargetings.hasOwnProperty(key) ){
			returnValue = commonTargetings[key];
		}

		return returnValue;
	};

	// set the common keywords , always pass array of keywords
	this.setCommonKeywords = function(arrayOfKeywords){
		var i, len;
		if( UTIL.isArray(arrayOfKeywords) ){
			len = arrayOfKeywords.length;
			for(i=0; i<len; i++){
				commonKeywords.push( arrayOfKeywords[i] );
			}
		}
	};

	// get the common keywords
	this.getCommonKeywords = function(){
		return commonKeywords;
	};

	//Useful to set custom params
	this.setInfo = function(key, value){
		var newKey = '',
			tempValue = '' // use this variable if you need to process value variable
		;

		//todo: we should have "_" used in words
		switch(key){
			case 'PAGEURL':
				newKey = 'dpurl';
				break;
			case 'LAT':
				newKey = 'lat';
				break;
			case 'LON':
				newKey = 'lon';
				break;
			case 'SEC':
				secure = (secure == 1 ? secure : value);
				newKey = '';
				break;
			case 'ACCID':
				accountID = value;
				newKey = '';
				break;
			case 'LOC_SRC':
				newKey = 'lsrc';
				break;
		};

		if(newKey != "" && value != ""){
			customInfo[newKey] = encodeURIComponent(value);
		}
	};

	// to generate a slot
	this.defineAdSlot = function(adUnit, dimensionArray, divElement){

		//todo: need a check like if div already exists in dom or not
		//todo: need a check like if div is already present in map

		var newSlotObject = new SO.SlotObject(adUnit, dimensionArray, divElement);

		// push the newSlotObject in slotStorage
		slotStorage[ divElement ] = newSlotObject;

		return newSlotObject;
	};

	this.getSlots = function(){
		var tempArray = [],
			iid
		;

		for(iid in slotStorage){
			tempArray.push( slotStorage[ iid ] );
		}

		return tempArray;
	};

	this.display = function(DivID){
		var adServerRequestCall,
			element,
			filterSlotsByStaus = {},
			arrayOfSlots = []
		;

		/*
			get slots with status zero
			send the array to generateAdServerCall
			set status to 1 in generateAdServerCall

			remove functionality of isSingleRequestCallAlreadyFired

			todo: how to differentiate a refresh call from display call ?
				which was last line-item served ...
		*/

		var currentSlot = getSlotByDivId(DivID);
		if(currentSlot !== null){
			currentSlot.setDisplayFunctionCalled(true);
			if(currentSlot.getStatus() === CONSTANTS.SLOT_STATUS.DISPLAYED){
				//console.log('display the creative now for '+ DivID);
				var response = currentSlot.getResponse();
				if(response !== null){
					createFriendlyIframeAndRenderCreative(DivID, response);
					currentSlot.setResponse(null);
					currentSlot.setDisplayFunctionCalled(false);
				}else{
					console.log('No cached response found for the slot '+ DivID);
				}
			}
		}

		if(singleRequestCall){

			filterSlotsByStaus[ CONSTANTS.SLOT_STATUS.CREATED ] = '';
			arrayOfSlots = getSlotsFilteredByStatus( filterSlotsByStaus );

			if(arrayOfSlots.length > 0){
				adServerRequestCall = generateAdServerCall(arrayOfSlots);
				createFriendlyIframeAndTriggerAdServerCall( DivID, adServerRequestCall );
			}

		}else{
			//todo: following check may be problem for out of page slot
			//element = window.document.getElementById( DivID );
			// only if element exists
			if( slotStorage.hasOwnProperty(DivID) ){
				arrayOfSlots.push( slotStorage[ DivID ] );
				adServerRequestCall = generateAdServerCall(arrayOfSlots);
				createFriendlyIframeAndTriggerAdServerCall( DivID, adServerRequestCall );
			}
		}
	};

	this.callback = function(response){
		//todo: response requires the div-id as key , need to define new key too
		//		problem with out-of page, can there be case where div-id is not passed
		var eachBid, index;
		if(response.bids){
			for(index in response.bids){
				eachBid = response.bids[index];

				if(eachBid.isNative == 1 ){
					// special treatment calls 58:c1ee99e0-b26a-46a1-bc77-8913f0cfe732
					console.log('Native creative found...');
					continue;
				}

				if(eachBid.ct && eachBid.ct.length != 0 /*&& eachBid.h != 0 && eachBid.w != 0*/){
					console.log('Creative found for ' + eachBid.id);
					var currentSlot = getSlotByDivId(eachBid.id);

					if(currentSlot !== null){
						if(currentSlot.getDisplayFunctionCalled() === true){
							createFriendlyIframeAndRenderCreative(eachBid.id, eachBid);
							currentSlot.setDisplayFunctionCalled(false);
						}else{
							// store the response for slot
							currentSlot.setResponse(eachBid);
						}
					}else{
						console.log('Invalid slot, no slot found defined for div: '+ eachBid.id);
					}
				}else{
					console.log('Creative NOT found for ' + eachBid.id)
				}
			}
		}
	};

};
