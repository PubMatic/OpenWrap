var CONSTANTS = require("../../constants.js");
var UTIL = require("../../util.js");
var EQ = require("./executionQueue.js");
var SO = require("./slotObject.js");

var serevr_path = "ae.pubmatic.com/ad?";

function combineGlobalTargetings(commonTargetings) {
	var output = "";

	UTIL.forEachOnObject(commonTargetings, function(targetingKey, value) {
		output += targetingKey + "=" + value.join() + "&";
	});
	output = output.substr(0, output.length -1 );

	return output;
}

function combineSlotSpecificData(dataAttribute, theSlot){
	var temp,
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
    };

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
				UTIL.forEachOnArray(temp, function(key, val) {
					if(val[0] && val[1]){
            output += val[0] + 'x' + val[1] + ',';
          }
				});

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

				UTIL.forEachOnArray(temp, function(key, val){
					var dataAttributeVal = "";

          switch(dataAttribute) {
            case 'targetings':
              dataAttributeVal = 'targetingByKey';
              break;

            case 'extraParameters':
              dataAttributeVal = 'extraPatameterByKey';
              break;
          }
					output += val + '=' + (theSlot[ dataAttributeFunctionMap[dataAttributeVal] ](val)).join() + '&';
				});

				output = output.substr(0, output.length -1 );
      }
      break;
  }

  return output;
}

function combineSlotsData(dataAttribute, arrayOfSlots) {
  var theSlot,
    output = "",
    defaultDataAttributeCombiner = "|",
    dataAttributeCombiner = {}; //mention only exceptions for different dataAttributeCombiner

	UTIL.forEachOnArray(arrayOfSlots, function (key, aSlot) {
    output += combineSlotSpecificData(dataAttribute, aSlot) + (dataAttributeCombiner.hasOwnProperty(dataAttribute) ? dataAttributeCombiner[dataAttribute]: defaultDataAttributeCombiner);
    aSlot.setStatus( CONSTANTS.SLOT_STATUS.DISPLAYED );
	});

	return output.substr(0, output.length -1 );
}

function generateAdServerCall(arrayOfSlots, req_type, customInfo, queryParams){
  var queryString = [],
    currTime = new Date();

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
    // Slot(s) adDiv
    'iid='		+ encodeURIComponent( combineSlotsData('adDiv', arrayOfSlots) ),
    // Slot(s) adSize(s)
    'asz='		+ encodeURIComponent( combineSlotsData('adSizes', arrayOfSlots) ),
    //Slot(s) targetings
    'slt_kv='		+ encodeURIComponent( combineSlotsData('targetings', arrayOfSlots) ),
    'ntid='			+ encodeURIComponent( combineSlotsData('nativeTemplateID', arrayOfSlots) ),
    'visi='			+ encodeURIComponent( combineSlotsData('visibility', arrayOfSlots) ),
    //Global Targetings / key-values
    'gkv='			+ encodeURIComponent( combineGlobalTargetings() ), // temporary code
    //Slot(s) extra parameters
    'slt_param=' + encodeURIComponent( combineSlotsData('extraParameters', arrayOfSlots) )
  );

  // also adding customInfo
	UTIL.forEachOnObject(customInfo, function (key, val) {
		if(customInfo.hasOwnProperty(key)){
      queryString.push(key + '=' + val);
    }
	});

  PubMatic.pm_uid_bc && queryString.push('bcuid=' + PubMatic.pm_uid_bc);

  // add Test Params
	UTIL.forEachOnObject(queryParams, function (key, val) {
		if(queryParams.hasOwnProperty(key) && testParams.hasOwnProperty(key)){
      queryString.push(key + '=' + val);
    }
	});

  return window.PWT.protocol + serevr_path + queryString.join('&');
}

function createFriendlyIframeAndTriggerAdServerCall( addIframeToElementID, adServerRequestCall ){
  var addIframeToElement,
    iframeElement;

  addIframeToElement = window.document.getElementById( addIframeToElementID );
  if(addIframeToElement){
    iframeElement = UTIL.createDocElement(window, 'iframe');
    iframeElement.id = addIframeToElementID + '_adCall';

    iframeElement.src = 'javascript:document.open();';
    iframeElement.src += 'document.write("<script type=\'text/javascript\' src=\''+ encodeURIComponent(adServerRequestCall) + '\'><\/script>");';
    iframeElement.src += 'document.close();';

    iframeElement.height = 0;
    iframeElement.width = 0;
    iframeElement.scrolling="no";
    iframeElement.frameborder="0";
    iframeElement.style.cssText="border: 0px; vertical-align: bottom; visibility: hidden; display: none;";

    addIframeToElement.appendChild( iframeElement );
  }
}

function createFriendlyIframeAndRenderCreative( addIframeToElementID, responseObject ){
  var addIframeToElement,
    iframeDoc,
    iframeElement,
    content;

  addIframeToElement = window.document.getElementById( addIframeToElementID );
  if(addIframeToElement){
    iframeElement = UTIL.createDocElement(window, 'iframe');
    iframeElement.id = addIframeToElementID + '_adDisplay';
    iframeElement.height = responseObject.h;
    iframeElement.width = responseObject.w;
    iframeElement.scrolling="no";
    iframeElement.marginwidth="0";
    iframeElement.marginheight="0";
    iframeElement.frameborder="0";
    iframeElement.style.cssText="border: 0px; vertical-align: bottom;";

    addIframeToElement.appendChild(iframeElement);

    iframeElement = window.document.getElementById(addIframeToElementID + '_adDisplay');
    if(iframeElement){

      content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><scr' + 'ipt>inDapIF=true;</scr' + 'ipt></head>';
      content += '<body><style>body{margin:0px;padding:0px;}</style>';
      content += '<scr' + 'ipt>';
      content += 'document.write(decodeURIComponent("' + responseObject.ct + '"));';
      if(responseObject.tr) {
					UTIL.forEachOnArray(responseObject.tr, function (key, val) {
							content += 'document.write("<iframe src=\''+ val +'\' style=\'border: 0px; vertical-align: bottom;visibility: hidden; display: none;\'></iframe>");';
					});
		      content += '</script>';
		      content += '</body></html>';

		      iframeDoc = iframeElement.contentWindow.document;
		      iframeDoc.write(content);
		      iframeDoc.close();
    	}
    }
  }
}

function getSlotsFilteredByStatus(statusObject, slotStorage){
  var tempArray = [];

	UTIL.forEachOnObject(slotStorage, function(key, theSlot) {
		if(statusObject.hasOwnProperty(theSlot.getStatus())){
      tempArray.push(theSlot);
    }
	});

  return tempArray;
}

// todo: public
function getSlotByDivId(divID, slotStorage){
  if(slotStorage.hasOwnProperty(divID)){
    return slotStorage[ divID ];
  }
  return null;
}

function PhoenixClass() {
    this.singleRequestCall = false;
    this.isSingleRequestCallAlreadyFired = false; // not used
    this.req_type = 219;
    // some common data-storages
    this.commonKeywordsAnding = 0;
    this.commonTargetings = {};
    this.commonKeywords = [];
    this.customInfo = {};
    this.slotStorage = {}; // will store map of divid ==> slotObject
    this.queryParams = {}; // todo can we use util function here ?

    this.EQ = new EQ.EexecutionQueue(window);

  	this.setRequestType = function(value){
  		if(! isNaN(value)){
  			this.req_type = value;
  		}
  	};

  	this.enableSingleRequestCallMode = function(){
  		this.singleRequestCall = true;
  	};

  	this.enableCommonKeywordsAnding = function(){
  		this.commonKeywordsAnding = 1;
  	};

  	// sets common targeting applicable to all slots
  	this.setCommonTargeting = function(key, value) {
      var oThis = this;

      // check type of value , always maintain an array of values against a key
  		if(!oThis.commonTargetings.hasOwnProperty(key)){
  			oThis.commonTargetings[key] = [];
  		}

  		if(UTIL.isArray(value)){
				UTIL.forEachOnArray(value, function(index, val) {
					oThis.commonTargetings[key].push(val);
				});
  		} else {
  			oThis.commonTargetings[key].push( value );
  		}
  	};

  	// return array of all common targeting keys
  	this.getCommonTargetingKeys = function(){
  		var returnArray = [];

			UTIL.forEachOnObject(this.commonTargetings, function(key, val) {
				if(!UTIL.isUndefined(key)){
  				returnArray.push(key);
  			}
			});

			return returnArray;
  	};

  	// return the common targeting values set against the given key
  	this.getCommonTargeting = function(key){
  		return this.commonTargetings.hasOwnProperty(key) ? this.commonTargetings[key] : "";
  	};

  	// set the common keywords , always pass array of keywords
  	this.setCommonKeywords = function(arrayOfKeywords){
      var oThis = this;

      if(UTIL.isArray(arrayOfKeywords)) {
				UTIL.forEachOnArray(arrayOfKeywords, function(key, val) {
					oThis.commonKeywords.push(val);
				});
  		}
  	};

  	// get the common keywords
  	this.getCommonKeywords = function(){
  		return this.commonKeywords;
  	};

  	//Useful to set custom params
  	this.setInfo = function(key, value){
  		var newKey = '',
  			tempValue = ''; // use this variable if you need to process value variable

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
  		}

  		if(newKey != "" && value != ""){
  			this.customInfo[newKey] = encodeURIComponent(value);
  		}
  	};

  	// to generate a slot
  	this.defineAdSlot = function(adUnit, dimensionArray, divElement) {
  		//todo: need a check like if div already exists in dom or not
  		//todo: need a check like if div is already present in map
  		var newSlotObject = new SO.SlotObject(adUnit, dimensionArray, divElement);

  		// push the newSlotObject in slotStorage
  		this.slotStorage[ divElement ] = newSlotObject;

  		return newSlotObject;
  	};

  	this.getSlots = function() {
			var tempArray = [];

			UTIL.forEachOnObject(this.slotStorage, function(key, val) {
				tempArray.push(val);
			});
			return tempArray;
  	};

  	this.display = function(DivID){
  		var adServerRequestCall,
  			element,
  			filterSlotsByStaus = {},
  			arrayOfSlots = [];

  		var currentSlot = getSlotByDivId(DivID, this.slotStorage);
  		if(currentSlot !== null){
  			currentSlot.setDisplayFunctionCalled(true);
  			if(currentSlot.getStatus() === CONSTANTS.SLOT_STATUS.DISPLAYED){
  				//console.log('display the creative now for '+ DivID);
  				var response = currentSlot.getResponse();
  				if(response !== null){
  					createFriendlyIframeAndRenderCreative(DivID, response);
  					currentSlot.setResponse(null);
  					currentSlot.setDisplayFunctionCalled(false);
  					UTIL.log('Rendering the creative for the slot '+ DivID);
  				} else {
  					UTIL.log('No cached response found for the slot '+ DivID);
  				}
  			} else {
  				UTIL.log('Already displayed the slot: '+ DivID);
  			}
  		}

  		if(this.singleRequestCall) {
  			filterSlotsByStaus[ CONSTANTS.SLOT_STATUS.CREATED ] = '';
  			arrayOfSlots = getSlotsFilteredByStatus(filterSlotsByStaus, this.slotStorage);

  			if(arrayOfSlots.length > 0) {
  				adServerRequestCall = generateAdServerCall(arrayOfSlots, this.req_type, this.customInfo, this.queryParams);
  				createFriendlyIframeAndTriggerAdServerCall( DivID, adServerRequestCall );
  			}
  		} else {
  			//todo: following check may be problem for out of page slot
  			//element = window.document.getElementById( DivID );
  			// only if element exists
  			if(this.slotStorage.hasOwnProperty(DivID)) {
  				arrayOfSlots.push(this.slotStorage[DivID]);
  				adServerRequestCall = generateAdServerCall(arrayOfSlots, this.req_type, this.customInfo, this.queryParams);
  				createFriendlyIframeAndTriggerAdServerCall(DivID, adServerRequestCall);
  			}
  		}
  	};

	  this.callback = function(response){
      var oThis = this;
  		//todo: response requires the div-id as key , need to define new key too
  		// problem with out-of page, can there be case where div-id is not passed
  		if(response.bids) {
  			UTIL.forEachOnObject(response.bids, function(key, eachBid) {
  				if(eachBid.isNative == 1 ){
  					// special treatment calls 58:c1ee99e0-b26a-46a1-bc77-8913f0cfe732
  					UTIL.log('Native creative found...');
  					return;
  				}

  				if(eachBid.ct && eachBid.ct.length != 0 /*&& eachBid.h != 0 && eachBid.w != 0*/) {
  					UTIL.log('Creative found for ' + eachBid.id);
  					var currentSlot = getSlotByDivId(eachBid.id, oThis.slotStorage);

  					if(currentSlot !== null) {
  						if(currentSlot.getDisplayFunctionCalled() === true) {
  							createFriendlyIframeAndRenderCreative(eachBid.id, eachBid);
  							currentSlot.setDisplayFunctionCalled(false);
  						} else {
  							// store the response for slot
  							currentSlot.setResponse(eachBid);
  						}
  					} else {
  						UTIL.log('Invalid slot, no slot found defined for div: '+ eachBid.id);
  					}
  				} else {
  					UTIL.log('Creative NOT found for ' + eachBid.id);
  				}
  			});
  		}
  	};
}

exports.PhoenixClass = PhoenixClass;
