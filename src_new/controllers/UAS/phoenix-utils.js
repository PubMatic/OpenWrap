var CONSTANTS = require("../../constants.js");
var UTIL = require("../../util.js");
var CONFIG = require("../../config.js");
var bidManager = require("../../bidManager.js");
var adapterManager = require("../../adapterManager.js");


var serevr_path = "ae.pubmatic.com/ad?";

function combineGlobalTargetings(commonTargetings) {
	var output = "";

	UTIL.forEachOnObject(commonTargetings, function(targetingKey, value) {
		output += targetingKey + "=" + value.join() + "&";
	});
	output = output.substr(0, output.length -1 );

	return output;
}

/* start-test-block */
exports.combineGlobalTargetings = combineGlobalTargetings;
/* end-test-block */

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

/* start-test-block */
exports.combineSlotSpecificData = combineSlotSpecificData;
/* end-test-block */

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

/* start-test-block */
exports.combineSlotsData = combineSlotsData;
/* end-test-block */

// function getSlotSpecificPWTECP(arrayOfSlots) {
// 	UTIL.forEachOnArray(arrayOfSlots, function(key, aSlot) {
//
// 	});
// }

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

/* start-test-block */
exports.generateAdServerCall = generateAdServerCall;
/* end-test-block */

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

/* start-test-block */
exports.createFriendlyIframeAndTriggerAdServerCall = createFriendlyIframeAndTriggerAdServerCall;
/* end-test-block */

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

/* start-test-block */
exports.createFriendlyIframeAndRenderCreative = createFriendlyIframeAndRenderCreative;
/* end-test-block */

function getSlotsFilteredByStatus(statusObject, slotStorage){
  var tempArray = [];

	UTIL.forEachOnObject(slotStorage, function(key, theSlot) {
		if(statusObject.hasOwnProperty(theSlot.getStatus())){
      tempArray.push(theSlot);
    }
	});

  return tempArray;
}

/* start-test-block */
exports.getSlotsFilteredByStatus = getSlotsFilteredByStatus;
/* end-test-block */

function getSlotByDivId(divID, slotStorage){
  if(slotStorage.hasOwnProperty(divID)){
    return slotStorage[ divID ];
  }
  return null;
}

/* start-test-block */
exports.getSlotByDivId = getSlotByDivId;
/* end-test-block */
