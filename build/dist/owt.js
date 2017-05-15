/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ ((function(module, exports, __webpack_require__) {

	'use strict';

	var CONFIG = __webpack_require__(1);
	var CONSTANTS = __webpack_require__(2);
	var util = __webpack_require__(3);
	var controller = __webpack_require__(4);

	util.enableDebugLog();

	window.PWT = window.PWT || {};
	controller.init(CONFIG.config, window);

	/*

	TODO:
		config how to store and read ?
		any issue with bidManager/adapterManager being called from many files
			does it keeps all data together OR creates many new versions
		common name-space
			how to add callbacks in common namespace
		first adapter:
			Prebid
			PubMatic
		COMPARE FEATURES FROM LATEST CODE	
			safeframe
				these changes are required in bidManager
	*/

/***/ })),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	exports.config = {
		global: {
			pwt: {
				t: "3000",
				pid: "46",
				gcv: "11",
				pdvid: "4",
				pubid: "9999",
				dataURL: "t.pubmatic.com/wl?",
				winURL: "t.pubmatic.com/wt?"
			},
			adapters: {
				pubmatic: {
					pub_id: "9999",
					rev_share: "0.0",
					timeout: "2000",
					throttle: "100",
					kgp: "_AU_@_W_x_H_:_AUI_",
					sk: "true"
				},
				prebid: {
					rev_share: "0.0",
					timeout: "2000",
					throttle: "100",
					kgp: "_DIV_",
					klm: {}
				},
				PB_sekindoUM: {
					rev_share: "0.0",
					timeout: "2000",
					throttle: "100",
					kgp: "_DIV_",
					klm: {
						"div-gpt-ad-12345678-1": {
							spaceId: 14071
						},
						"div-gpt-ad-12345678-2": {
							spaceId: 14071
						}
					}
				}
			}
		}
	};

	// step 1: copy paste config here as it is now and pass to owt.js

	// step 2: all methods over config should stay here only
	//			remove them from other code parts

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	exports.COMMON = {
		"BID_PRECISION": 4,
		"CONFIG": "config",
		"DIV_ID": "divID",
		"PARAMS": "params",
		"SIZES": "sizes",
		"HEIGHT": "height",
		"WIDTH": "width",
		"SLOTS": "slots",
		"KEY_GENERATION_PATTERN_VALUE": "kgpv",
		"KEY_VALUE_PAIRS": "kvp",
		"IMPRESSION_ID": "iid"
	};

	exports.CONFIG = {
		"GLOBAL": "global",
		"ADAPTERS": "adapters",
		"COMMON": "pwt",
		"TIMEOUT": "t",
		"KEY_GENERATION_PATTERN": "kgp",
		"KEY_LOOKUP_MAP": "klm",
		"SERVER_SIDE_KEY": "sk",
		"PUBLISHER_ID": "pubid",
		"PROFILE_ID": "pid",
		"PROFILE_VERSION_ID": "pdvid",
		"LOGGER_URL": "dataURL",
		"TRACKER_URL": "winURL",
		"REV_SHARE": "rev_share",
		"THROTTLE": "throttle",
		"BID_PASS_THROUGH": "pt",
		"GLOBAL_KEY_VALUE": "gkv"
	};

	exports.MACROS = {
		"WIDTH": "_W_",
		"HEIGHT": "_H_",
		"AD_UNIT_ID": "_AU_",
		"AD_UNIT_INDEX": "_AUI_",
		"INTEGER": "_I_",
		"DIV": "_DIV_"
	};

	exports.SLOT_STATUS = {
		"CREATED": 0,
		"PARTNERS_CALLED": 1,
		"TARGETING_ADDED": 2,
		"DISPLAYED": 3
	};

	exports.SLOT_ATTRIBUTES = {
		"SLOT_OBJECT": "adSlot",
		"SIZES": "adSlotSizes",
		"AD_UNIT_ID": "adUnitID",
		"AD_UNIT_INDEX": "adUnitIndex",
		"DIV_ID": "divID",
		"STATUS": "status",
		"DISPLAY_FUNCTION_CALLED": "displayFunctionCalled",
		"REFRESH_FUNCTION_CALLED": "refreshFunctionCalled",
		"ARGUMENTS": "arguments",
		"POSITION": "position",
		"KEY_VALUE": "skv"
	};

	exports.DEAL = {
		"ID": "id",
		"CHANNEL": "channel",
		"KEY_FIRST_PART": "pwtdeal_",
		"KEY_VALUE_SEPARATOR": "_-_",
		"CHANNEL_PMP": "PMP",
		"CHANNEL_PMPG": "PMPG",
		"CHANNEL_PREF": "PREF"
	};

	exports.WRAPPER_TARGETING_KEYS = {
		"BID_ID": "pwtsid",
		"BID_STATUS": "pwtbst",
		"BID_ECPM": "pwtecp",
		"BID_DEAL_ID": "pwtdid",
		"BID_ADAPTER_ID": "pwtpid"
	};

	exports.BID_ATTRIBUTES = {
		"CREATION_TIME": "creationTime"
	};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var CONSTANTS = __webpack_require__(2);

	var debugLogIsEnabled = false;
	var typeArray = 'Array';
	var typeString = 'String';
	var typeFunction = 'Function';
	var typeNumber = 'Number';
	var toString = Object.prototype.toString;

	function isA(object, testForType) {
	  return toString.call(object) === '[object ' + testForType + ']';
	}

	exports.isFunction = function (object) {
	  return isA(object, typeFunction);
	};

	exports.isString = function (object) {
	  return isA(object, typeString);
	};

	exports.isArray = function (object) {
	  return isA(object, typeArray);
	};

	exports.isNumber = function (object) {
	  return isA(object, typeNumber);
	};

	exports.isOwnProperty = function (theObject, proertyName) {
	  if (theObject.hasOwnProperty) {
	    return theObject.hasOwnProperty(proertyName);
	  }
	  return false;
	};

	exports.isUndefined = function (object) {
	  return typeof object === "undefined";
	};

	exports.getTimeout = function (config) {

	  var defaultTimeout = 1000;

	  if (this.isOwnProperty(config, CONSTANTS.CONFIG.GLOBAL) && this.isOwnProperty(config[CONSTANTS.CONFIG.GLOBAL], CONSTANTS.CONFIG.COMMON) && this.isOwnProperty(config[CONSTANTS.CONFIG.GLOBAL][CONSTANTS.CONFIG.COMMON], CONSTANTS.CONFIG.TIMEOUT)) {

	    return parseInt(config[CONSTANTS.CONFIG.GLOBAL][CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.TIMEOUT]) || defaultTimeout;
	  }

	  return defaultTimeout;
	};

	exports.enableDebugLog = function () {
	  debugLogIsEnabled = true;
	};

	//todo: move...
	var constDebugInConsolePrependWith = '-------------------------';

	exports.log = function (data) {
	  if (debugLogIsEnabled && console && this.isFunction(console.log)) {
	    if (this.isString(data)) {
	      console.log(constDebugInConsolePrependWith + data);
	    } else {
	      console.log(data);
	    }
	  }
	};

	exports.getCurrentTimestampInMs = function () {
	  var date = new Date();
	  return date.getTime();
	};

	exports.getCurrentTimestamp = function () {
	  var date = new Date();
	  return Math.round(date.getTime() / 1000);
	};

	var utilGetIncrementalInteger = (function () {
	  var count = 0;
	  return function () {
	    count++;
	    return count;
	  };
	})();

	exports.getUniqueIdentifierStr = function () {
	  return utilGetIncrementalInteger() + Math.random().toString(16).substr(2);
	};

	exports.copyKeyValueObject = function (copyTo, copyFrom) {
	  for (var key in copyFrom) {
	    copyFrom[key] = this.isArray(copyFrom[key]) ? copyFrom[key] : [copyFrom[key]];
	    if (this.isOwnProperty(copyFrom, key)) {
	      if (this.isOwnProperty(copyTo, key)) {
	        copyTo[key].push.apply(copyTo[key], copyFrom[key]);
	      } else {
	        copyTo[key] = copyFrom[key];
	      }
	    }
	  }
	};

	exports.protocol = "https://"; //todo need a set method
	exports.pageURL = "http://abc.com/ljljl/abc";

	exports.getIncrementalInteger = (function () {
	  var count = 0;
	  return function () {
	    count++;
	    return count;
	  };
	})();

	exports.generateUUID = function () {
	  var d = new Date().getTime(),

	  // todo: this.pageURL ???
	  url = decodeURIComponent(this.pageURL).toLowerCase().replace(/[^a-z,A-Z,0-9]/gi, ''),
	      urlLength = url.length;

	  //todo: uncomment it,  what abt performance
	  //if(win.performance && this.isFunction(win.performance.now)){
	  //    d += performance.now();
	  //}

	  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-zzzzz'.replace(/[xyz]/g, (function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    var op;
	    switch (c) {
	      case 'x':
	        op = r;
	        break;
	      case 'z':
	        op = url[Math.floor(Math.random() * urlLength)];
	        break;
	      default:
	        op = r & 0x3 | 0x8;
	    }

	    return op.toString(16);
	  }));

	  return uuid;
	};

	var macroRegexFlag = macroRegexFlag;
	var constCommonMacroForWidthRegExp = new RegExp(CONSTANTS.MACROS.WIDTH, macroRegexFlag);
	var constCommonMacroForHeightRegExp = new RegExp(CONSTANTS.MACROS.HEIGHT, macroRegexFlag);
	var constCommonMacroForAdUnitIDRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_ID, macroRegexFlag);
	var constCommonMacroForAdUnitIndexRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_INDEX, macroRegexFlag);
	var constCommonMacroForIntegerRegExp = new RegExp(CONSTANTS.MACROS.INTEGER, macroRegexFlag);
	var constCommonMacroForDivRegExp = new RegExp(CONSTANTS.MACROS.DIV, macroRegexFlag);

	exports.generateSlotNamesFromPattern = function (activeSlot, pattern) {
	  var slotNames = [],
	      slotName,
	      slotNamesObj = {},
	      sizeArrayLength,
	      i;

	  if (activeSlot && activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES]) {
	    sizeArrayLength = activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES].length;
	    if (sizeArrayLength > 0) {
	      for (i = 0; i < sizeArrayLength; i++) {
	        if (activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][0] && activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][1]) {

	          slotName = pattern;
	          slotName = slotName.replace(constCommonMacroForAdUnitIDRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_ID]).replace(constCommonMacroForWidthRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][0]).replace(constCommonMacroForHeightRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][1]).replace(constCommonMacroForAdUnitIndexRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_INDEX]).replace(constCommonMacroForIntegerRegExp, this.getIncrementalInteger()).replace(constCommonMacroForDivRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID]);

	          if (!this.isOwnProperty(slotNamesObj, slotName)) {
	            slotNamesObj[slotName] = '';
	            slotNames.push(slotName);
	          }
	        }
	      }
	    }
	  }

	  return slotNames;
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var CONSTANTS = __webpack_require__(2);
	var util = __webpack_require__(3);
	var bidManager = __webpack_require__(5);
	var adapterManager = __webpack_require__(6);

	var SEND_TARGETING_INFO = true;
	var displayHookIsAdded = false;
	var disableInitialLoadIsSet = false;
	var sendTargetingInfoIsSet = true;
	var sraIsSet = false;
	var configObject = {}; // todo: save config in a json file
	var configTimeout = 1000; // refer dirctly from Config

	//todo: combine these maps
	var wrapperTargetingKeys = {}; // key is div id
	var slotSizeMapping = {}; // key is div id
	var slotsMap = {}; // key is div id,  stores the mapping of divID ==> googletag.slot

	var GPT_targetingMap = {};

	var localGoogletag;
	var localPubAdsObj;
	var original_display;
	var original_refresh;
	var original_disableInitialLoad;
	var original_setTargeting;
	var original_enableSingleRequest;
	var original_destroySlots;

	function getAdUnitIndex(currentGoogleSlot) {
		var index = 0;
		try {
			adUnitIndexString = currentGoogleSlot.getSlotId().getId().split('_');
			index = adUnitIndexString[adUnitIndex.length - 1];
		} catch (ex) {}
		return index;
	}

	//todo: move to util
	function getScreenWidth(win) {
		var screenWidth = -1;
		win.innerHeight ? screenWidth = win.innerWidth : win.document && win.document.documentElement && win.document.documentElement.clientWidth ? screenWidth = win.document.documentElement.clientWidth : win.document.body && (screenWidth = win.document.body.clientWidth);
		return screenWidth;
	}

	//todo: move to util
	function getScreenHeight(win) {
		var screenHeight = -1;
		win.innerHeight ? screenHeight = win.innerHeight : win.document && win.document.documentElement && win.document.documentElement.clientHeight ? screenHeight = win.document.documentElement.clientHeight : win.document.body && (screenHeight = win.document.body.clientHeight);
		return screenHeight;
	}

	function getSizeFromSizeMapping(divID, slotSizeMapping, win) {
		/*
	 	Ref: https://support.google.com/dfp_premium/answer/3423562?hl=en
	 	The adslot.defineSizeMapping() method will receive an array of mappings in the following form: 
	 		[ [ [ 1024, 768 ], [ [ 970, 250 ] ] ], [ [ 980, 600 ], [ [ 728, 90 ], [ 640, 480 ] ] ], ...],  
	 		which should be ordered from highest to lowest priority. 
	 	The builder syntax is a more readable way of defining the mappings that orders them automatically. 
	 	However, you have the option of using different priority ordering by bypassing the builder and constructing the array of mappings manually.
	 */

		if (!util.isOwnProperty(slotSizeMapping, divID)) {
			return false;
		}

		var sizeMapping = slotSizeMapping[divID];
		var screenWidth = getScreenWidth(win);
		var screenHeight = getScreenHeight(win);

		util.log(divID + ': responsiveSizeMapping found: screenWidth: ' + screenWidth + ', screenHeight: ' + screenHeight);
		util.log(sizeMapping);

		if (!util.isArray(sizeMapping)) {
			return false;
		}

		for (var i = 0, l = sizeMapping.length; i < l; i++) {
			if (sizeMapping[i].length == 2 && sizeMapping[i][0].length == 2) {
				var currentWidth = sizeMapping[i][0][0],
				    currentHeight = sizeMapping[i][0][1];

				if (screenWidth >= currentWidth && screenHeight >= currentHeight) {
					if (sizeMapping[i][1].length != 0 && !util.isArray(sizeMapping[i][1][0])) {
						if (sizeMapping[i][1].length == 2 && util.isNumber(sizeMapping[i][1][0]) && util.isNumber(sizeMapping[i][1][1])) {
							return [sizeMapping[i][1]];
						} else {
							util.log(divID + ': Unsupported mapping template.');
							util.log(sizeMapping);
						}
					}
					return sizeMapping[i][1];
				}
			}
		}

		return false;
	}

	function getAdSlotSizesArray(divID, currentGoogleSlot, win) {
		var sizeMapping = getSizeFromSizeMapping(divID, slotSizeMapping, win);

		if (sizeMapping !== false) {
			util.log(divID + ': responsiveSizeMapping applied: ');
			util.log(sizeMapping);
			return sizeMapping;
		}

		var adslotSizesArray = [];

		if (util.isFunction(currentGoogleSlot.getSizes)) {
			var sizeArray = currentGoogleSlot.getSizes();
			var sizeArrayLength = sizeArray.length;
			for (var index = 0; index < sizeArrayLength; index++) {
				var sizeObj = sizeArray[index];
				//todo: check on methods
				adslotSizesArray.push([sizeObj.getWidth(), sizeObj.getHeight()]);
			}
		}

		return adslotSizesArray;
	}

	function storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow, win) {
		// note: here dmSlotName is actually the DivID
		if (!util.isOwnProperty(slotsMap, dmSlotName)) {
			slotsMap[dmSlotName] = {};
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID] = dmSlotName;
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SLOT_OBJECT] = currentGoogleSlot;
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_ID] = currentGoogleSlot.getAdUnitPath();
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_INDEX] = getAdUnitIndex(currentGoogleSlot);
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SIZES] = getAdSlotSizesArray(dmSlotName, currentGoogleSlot, win);
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.STATUS] = CONSTANTS.SLOT_STATUS.CREATED;
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DISPLAY_FUNCTION_CALLED] = false;
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED] = false;
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS] = [];
			//slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.POSITION]					= utilFindPosition(dmSlotName);//todo

			if (SEND_TARGETING_INFO && JSON && typeof JSON.stringify == "function") {
				var targetKeys = currentGoogleSlot.getTargetingKeys();
				var targetKeysLength = targetKeys.length;
				slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.KEY_VALUE] = {};
				for (var k = 0; k < targetKeysLength; k++) {
					var targetKey = targetKeys[k];
					slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.KEY_VALUE][targetKey] = currentGoogleSlot.getTargeting(targetKey);
				}
			}

			//todo
			//utilCreateVLogInfoPanel(dmSlotName, slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SIZES]);
		} else {
			if (!isDisplayFlow) {
				slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SIZES] = getAdSlotSizesArray(dmSlotName, currentGoogleSlot, win);
			}
		}
	}

	function updateSlotsMapFromGoogleSlots(win, googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow) {

		var googleSlotsArrayLength, currentGoogleSlot, dmSlotName, divIdFromDisplayFunction;

		googleSlotsArray = win.googletag.pubads().getSlots();
		googleSlotsArrayLength = googleSlotsArray.length;

		for (var i = 0; i < googleSlotsArrayLength; i++) {
			currentGoogleSlot = googleSlotsArray[i];
			dmSlotName = currentGoogleSlot.getSlotId().getDomId(); // here divID will be the key
			storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow, win);
			if (isDisplayFlow && util.isOwnProperty(slotsMap, dmSlotName)) {
				divIdFromDisplayFunction = argumentsFromCallingFunction[0];
				// if display function is called for this slot only
				if (divIdFromDisplayFunction && divIdFromDisplayFunction == slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID]) {
					// mark that display function for this slot has been called
					slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DISPLAY_FUNCTION_CALLED] = true;
					slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS] = argumentsFromCallingFunction;
				}
			}
		}
	}

	//todo: pass slotsMap in every function that uses it
	function getStatusOfSlotForDivId(divID) {
		if (util.isOwnProperty(slotsMap, divID)) {
			return slotsMap[divID][CONSTANTS.SLOT_ATTRIBUTES.STATUS];
		}
		return CONSTANTS.SLOT_STATUS.DISPLAYED;
	}

	function updateStatusAfterRendering(divID, isRefreshCall) {
		var settings = {};
		settings[CONSTANTS.SLOT_ATTRIBUTES.STATUS] = CONSTANTS.SLOT_STATUS.DISPLAYED;
		settings[CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS] = [];
		settings[isRefreshCall ? CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED : CONSTANTS.SLOT_ATTRIBUTES.DISPLAY_FUNCTION_CALLED] = false;
		setKeyValueOfSlotForDivId(divID, settings);
	}

	//todo: this function can be made generic
	function setKeyValueOfSlotForDivId(divID, keyValueObject) {
		var kv;

		if (util.isOwnProperty(slotsMap, divID)) {
			for (kv in keyValueObject) {
				if (util.isOwnProperty(keyValueObject, kv)) {
					slotsMap[divID][kv] = keyValueObject[kv];
				}
			}
		}
	}

	function getSlotNamesByStatus(statusObject) {
		var key;
		var slots = [];
		for (key in slotsMap) {
			if (util.isOwnProperty(statusObject, slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.STATUS])) {
				slots.push(key);
			}
		}
		return slots;
	}

	// i am here....
	function removeDMTargetingFromSlot(key) {
		var currenGoogleSlot;
		var targetingKeys;
		var targetingKey;
		var targetingMap;
		var len;
		var i;

		if (util.isOwnProperty(slotsMap, key)) {

			targetingKeys = [];
			targetingMap = {};
			currenGoogleSlot = slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.SLOT_OBJECT];
			targetingKeys = currenGoogleSlot.getTargetingKeys();
			len = targetingKeys.length;

			// take backup of all targetings, except those set by DM
			for (i = 0; i < len; i++) {
				targetingKey = targetingKeys[i];
				if (!util.isOwnProperty(wrapperTargetingKeys, targetingKey)) {
					targetingMap[targetingKey] = currenGoogleSlot.getTargeting(targetingKey);
				}
			}

			// now clear all targetings
			currenGoogleSlot.clearTargeting();

			// now set all settings from backup
			for (targetingKey in targetingMap) {
				if (util.isOwnProperty(targetingMap, targetingKey)) {
					currenGoogleSlot.setTargeting(targetingKey, targetingMap[targetingKey]);
				}
			}
		}
	}

	function updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall) {

		var slotNamesLength = slotNames.length;
		var index;
		var key;

		if (slotNamesLength > 0) {
			for (index = 0; index < slotNamesLength; index++) {
				key = slotNames[index];
				slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.STATUS] = CONSTANTS.SLOT_STATUS.PARTNERS_CALLED;
				if (isRefreshCall) {
					removeDMTargetingFromSlot(key);
					slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED] = true;
					slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS] = argumentsFromCallingFunction;
				}
			}
		}
	}

	function arrayOfSelectedSlots(slotNames) {
		var slotNamesLength = slotNames.length;
		var index;
		var output = [];

		if (slotNamesLength > 0) {
			for (index = 0; index < slotNamesLength; index++) {
				output.push(slotsMap[slotNames[index]]);
			}
		}

		return output;
	}

	function findWinningBidAndApplyTargeting(divID) {
		var winningBid = bidManager.getBid(divID);
		var googleDefinedSlot = slotsMap[divID][CONSTANTS.SLOT_ATTRIBUTES.SLOT_OBJECT];

		util.log('DIV: ' + divID + ' winningBid: ');
		util.log(winningBid);

		if (winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0) {
			slotsMap[divID][CONSTANTS.SLOT_ATTRIBUTES.STATUS] = CONSTANTS.SLOT_STATUS.TARGETING_ADDED;
			googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID, winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID]);
			googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS, winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS]);
			googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM, winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM].toFixed(bidPrecision));
			winningBid[constTargetingDeal][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID] && googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID, winningBid[constTargetingDeal][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID]);
			googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID, winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID]);
		}

		// attaching keyValuePairs from adapters
		for (var key in winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]) {
			if (util.isOwnProperty(winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS], key)) {
				googleDefinedSlot.setTargeting(key, winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS][key]);
				// adding key in wrapperTargetingKeys as every key added by OpenWrap should be removed before calling refresh on slot
				wrapperTargetingKeys[key] = '';
			}
		}
	}

	function defineWrapperTargetingKeys(object) {
		var output = {};

		for (var key in object) {
			if (util.isOwnProperty(object, key)) {
				output[object[key]] = '';
			}
		}

		return output;
	}

	function defineWrapperTargetingKey(key) {
		wrapperTargetingKeys[key] = '';
	}

	// Hooks related functions

	//todo: can  we localise these variables
	function addHookOnGooglePubAdsDisableInitialLoad() {
		if (original_disableInitialLoad = localPubAdsObj && localPubAdsObj.disableInitialLoad) {
			localPubAdsObj.disableInitialLoad = function () {
				disableInitialLoadIsSet = true;
				util.log('Disable Initial Load is called');
				var arg = arguments;
				return original_disableInitialLoad.apply(this, arg);
			};
		}
	}

	function addHookOnGooglePubAdsEnableSingleRequest() {
		if (original_enableSingleRequest = localPubAdsObj && localPubAdsObj.enableSingleRequest) {
			localPubAdsObj.enableSingleRequest = function () {
				util.log('enableSingleRequest is called');
				var arg = arguments;
				sraIsSet = true;
				addHookOnGoogletagDisplay();
				return original_enableSingleRequest.apply(this, arg);
			};
		}
	}

	function addHookOnGooglePubAdsSetTargeting() {
		if (original_setTargeting = localPubAdsObj && localPubAdsObj.setTargeting) {
			localPubAdsObj.setTargeting = function () {
				var arg = arguments,
				    key = arg[0] ? arg[0] : null;
				addHookOnGoogletagDisplay();
				if (key != null) {
					if (!util.isOwnProperty(GPT_targetingMap, key)) {
						GPT_targetingMap[key] = [];
					}
					GPT_targetingMap[key] = GPT_targetingMap[key].concat(arg[1]);
				}
				return original_setTargeting.apply(localPubAdsObj, arg);
			};
		}
	}

	function addHookOnGoogletagDestroySlots(win) {
		localGoogletag.destroySlots = function (arrayOfSlots) {
			for (var i = 0, l = arrayOfSlots.length; i < l; i++) {
				var divID = arrayOfSlots[i].getSlotId().getDomId();
				delete slotsMap[divID];
			}
			original_destroySlots.apply(win.googletag, arguments);
		};
	}

	// display
	function addHookOnGoogletagDisplay(win) {
		if (displayHookIsAdded) {
			return;
		}

		/*
	 	there are many types of display methods
	 		1. googletag.display('div-1');
	 			this one is only covered
	 			
	 		// following approach can be re-written as 1st					
	 		2. googletag.pubads().display('/1234567/sports', [728, 90], 'div-1');						
	 			we can not support this as, above methode will generate adslot object internally and then displays, 
	 			btw it does not supports single reqest approach
	 			also slot level targeting can not be set on it
	 			https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_display
	 								
	 		3. googletag.pubads().definePassback('/1234567/sports', [468, 60]).display();
	 			we are not going to support this one as well as third-party partners use this and they wont have setup required to render our bids
	 */

		displayHookIsAdded = true;

		util.log('Adding hook on googletag.display');

		localGoogletag.display = function () {

			util.log('In display function, with arguments: ');
			util.log(arguments);

			var arg = arguments,
			    oldStatus,
			    qualifyingSlotNames,
			    qualifyingSlots = [];

			// If AdVanced GPT mode is enabled, no need to do anything in display function
			if (disableInitialLoadIsSet) {
				util.log('DisableInitialLoad was called, Nothing to do');
				return original_display.apply(this, arg);
			} else {

				util.log('Generating slotsMap');
				updateSlotsMapFromGoogleSlots(win, win.googletag.pubads().getSlots(), arg, true);
				util.log(slotsMap);

				oldStatus = getStatusOfSlotForDivId(arg[0]);
				switch (oldStatus) {

					// display method was called for this slot
					case CONSTANTS.SLOT_STATUS.CREATED:
					// dm flow is already intiated for this slot
					// just intitate the configTimeout now
					case CONSTANTS.SLOT_STATUS.PARTNERS_CALLED:
						setTimeout((function () {

							util.log('PostTimeout.. back in display function');

							//todo: move this function out of here
							var tempFunc = function tempFunc(key) {
								if (util.isOwnProperty(slotsMap, key) && slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.STATUS] != CONSTANTS.SLOT_STATUS.DISPLAYED && slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.STATUS] != CONSTANTS.SLOT_STATUS.TARGETING_ADDED) {

									findWinningBidAndApplyTargeting(key);
								}
							};

							for (var key in slotsMap) {
								tempFunc(key);
							}

							var status = getStatusOfSlotForDivId(arg[0]);
							// check status of the slot, if not displayed/
							if (status != CONSTANTS.SLOT_STATUS.DISPLAYED) {

								util.log('calling original display function after configTimeout with arguments, ');
								util.log(arg);
								updateStatusAfterRendering(arg[0], false);
								original_display.apply(win.googletag, arg);
							} else {
								util.log('AdSlot already rendered');
							}
						}), configTimeout);
						break;

					// call the original function now
					case CONSTANTS.SLOT_STATUS.TARGETING_ADDED:
						util.log('As DM processing is already done, Calling original display function with arguments');
						util.log(arg);
						updateStatusAfterRendering(arg[0], false);
						original_display.apply(win.googletag, arg);
						break;

					case CONSTANTS.SLOT_STATUS.DISPLAYED:
						updateStatusAfterRendering(arg[0], false);
						original_display.apply(win.googletag, arg);
						break;
				}

				qualifyingSlotNames = getSlotNamesByStatus({ 0: '' });
				if (qualifyingSlotNames.length > 0) {
					updateStatusOfQualifyingSlotsBeforeCallingAdapters(qualifyingSlotNames, arg, false);
					qualifyingSlots = arrayOfSelectedSlots(qualifyingSlotNames);
					adapterManager.callAdapters(configObject, qualifyingSlots);
				}

				setTimeout((function () {
					//utilRealignVLogInfoPanel(arg[0]);
					bidManager.executeAnalyticsPixel();
				}), 2000 + configTimeout);
			}
		};
	}

	// refresh
	function addHookOnGooglePubAdsRefresh(win) {
		/*
	 	there are many ways of calling refresh
	 		1. googletag.pubads().refresh([slot1]);
	 		2. googletag.pubads().refresh([slot1, slot2]);
	 		3. googletag.pubads().refresh();					
	 		4. googletag.pubads().refresh(null, {changeCorrelator: false});		
	 */
		if (original_refresh = localPubAdsObj && localPubAdsObj.refresh) {

			localPubAdsObj.refresh = function () {

				var arg = arguments,
				    slotsToConsider = win.googletag.pubads().getSlots(),
				    slotsToConsiderLength,
				    qualifyingSlotNames = [],
				    qualifyingSlots,
				    index;

				util.log('In Refresh function');

				updateSlotsMapFromGoogleSlots(win, slotsToConsider, arg, false);

				if (arg.length != 0) {
					// handeling case googletag.pubads().refresh(null, {changeCorrelator: false});
					slotsToConsider = arg[0] == null ? win.googletag.pubads().getSlots() : arg[0];
				}

				slotsToConsiderLength = slotsToConsider.length;
				for (index = 0; index < slotsToConsiderLength; index++) {
					qualifyingSlotNames = qualifyingSlotNames.concat(slotsToConsider[index].getSlotId().getDomId());
				}

				if (qualifyingSlotNames.length > 0) {
					updateStatusOfQualifyingSlotsBeforeCallingAdapters(qualifyingSlotNames, arg, true);
					qualifyingSlots = arrayOfSelectedSlots(qualifyingSlotNames);
					adapterManager.callAdapters(configObject, qualifyingSlots);
				}

				util.log('Intiating Call to original refresh function with configTimeout: ' + configTimeout + ' ms');
				setTimeout((function () {

					util.log('Executing post configTimeout events, arguments: ');
					util.log(arg);

					var index,
					    dmSlot,
					    divID,
					    yesCallRefreshFunction = false,
					    qualifyingSlotNamesLength;

					qualifyingSlotNamesLength = qualifyingSlotNames.length;
					for (index = 0; index < qualifyingSlotNamesLength; index++) {

						dmSlot = qualifyingSlotNames[index];
						divID = slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID];

						if (util.isOwnProperty(slotsMap, dmSlot) && slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED] == true && slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.STATUS] != CONSTANTS.SLOT_STATUS.DISPLAYED) {

							findWinningBidAndApplyTargeting(divID);
							updateStatusAfterRendering(divID, true);
							yesCallRefreshFunction = true;
						}
					}

					setTimeout((function () {
						for (index = 0; index < qualifyingSlotNamesLength; index++) {
							var dmSlot = qualifyingSlotNames[index];
							//utilCreateVLogInfoPanel(slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.SIZES]);						
							//utilRealignVLogInfoPanel(slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID]);	
						}
					}), 2000 + configTimeout);

					bidManager.executeAnalyticsPixel();

					if (yesCallRefreshFunction) {
						util.log('Calling original refresh function from configTimeout');
						original_refresh.apply(win.googletag.pubads(), arg);
					} else {
						util.log('AdSlot already rendered');
					}
				}), configTimeout);
			};
		}
	}

	function addHooks(win) {

		localGoogletag = win.googletag;
		localPubAdsObj = localGoogletag.pubads();

		//todo: move to a function
		var s1 = localGoogletag.defineSlot('/Harshad', [[728, 90]], 'Harshad-02051986');
		if (s1 && s1.__proto__ && s1.__proto__.defineSizeMapping) {
			var originalDefineSizeMapping = s1.__proto__.defineSizeMapping;
			s1.__proto__.defineSizeMapping = function () {
				slotSizeMapping[this.getSlotId().getDomId()] = arguments[0];
				return originalDefineSizeMapping.apply(this, arguments);
			};
		}
		localGoogletag.destroySlots([s1]);

		original_display = localGoogletag && localGoogletag.display;
		original_destroySlots = localGoogletag && localGoogletag.destroySlots;

		addHookOnGooglePubAdsDisableInitialLoad();
		addHookOnGooglePubAdsEnableSingleRequest();
		addHookOnGoogletagDisplay(win);
		addHookOnGooglePubAdsRefresh(win);
		//	setTargeting is implemented by
		//		googletag.pubads().setTargeting(key, value);
		//			we are only intresetd in this one
		//		googletag.PassbackSlot.setTargeting(key, value);
		//			we do not care about it
		//		slot.setTargeting(key, value);
		//			we do not care, as it has a get method
		addHookOnGooglePubAdsSetTargeting();
		addHookOnGoogletagDestroySlots(win);
	}

	function defineGPTVariables(win) {
		// define the command array if not already defined
		win.googletag = win.googletag || {};
		win.googletag.cmd = win.googletag.cmd || [];
	}

	exports.init = function (config, win) {

		console.log(config);

		configObject = config;
		configTimeout = util.getTimeout(configObject);
		wrapperTargetingKeys = defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
		defineGPTVariables(win);

		if (util.isUndefined(win.google_onload_fired) && win.googletag.cmd.unshift) {
			util.log('Succeeded to load before GPT');
			win.googletag.cmd.unshift((function () {
				util.log('OpenWrap initialization started');
				addHooks(win);
				util.log('OpenWrap initialization completed');
			}));
		} else {
			util.log('Failed to load before GPT');
		}

		if (util.isFunction(win.PWT.jsLoaded)) {
			win.PWT.jsLoaded();
		}
	};

	// todo: export all functions in test scenario for unit testing
	// todo: create a slot class

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var CONSTANTS = __webpack_require__(2);
	var util = __webpack_require__(3);

	var bidMap = {};
	var bidIdMap = {}; // bidID => {slotID, adapterID}
	var bidManagerPwtConf = {};

	//todo: combine following maps OR add these methods in adapterManager
	var adapterRevShareMap = {};
	var adapterThrottleMap = {};
	var adapterBidPassThrough = {};

	var bid = 'bid';
	var bids = 'bidsFromBidders';
	var postTimeout = 'post_timeout';
	var creationTime = 'creationTime';
	var callInitiatedTime = 'callInitiatedTime';
	var bidReceivedTime = 'bidReceivedTime';

	exports.createDealObject = function (dealID, dealChannel) {
		var dealDetailsObj = {};
		dealDetailsObj[CONSTANTS.DEAL.ID] = dealID ? '' + dealID : '';
		dealDetailsObj[CONSTANTS.DEAL.CHANNEL] = dealID && dealChannel ? '' + dealChannel : '';
		return dealDetailsObj;
	};

	exports.createBidObject = function (ecpm, dealDetails, creativeID, creativeHTML, creativeURL, width, height, kgpv, keyValuePairs, defaultBid) {
		var bidObject = {};

		bidObject[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = ecpm;
		bidObject[constTargetingDeal] = dealDetails;
		bidObject[constTargetingAdHTML] = creativeHTML;
		bidObject[constTargetingAdUrl] = creativeURL;
		bidObject[constTargetingCreativeID] = creativeID;
		bidObject[constTargetingHeight] = height;
		bidObject[constTargetingWidth] = width;
		bidObject[constCommonKeyGenerationPatternValue] = kgpv;
		bidObject[CONSTANTS.COMMON.KEY_VALUE_PAIRS] = keyValuePairs || null;
		bidObject[constCommonDefaultBid] = defaultBid || 0;
		return bidObject;
	};

	function createBidEntry(divID) {
		var temp;
		if (!util.isOwnProperty(bidMap, divID)) {
			temp = {};
			temp[bids] = {};
			temp[CONSTANTS.COMMON.CONFIG] = {};
			temp[CONSTANTS.SLOT_ATTRIBUTES.SIZES] = [];
			temp[creationTime] = util.getCurrentTimestampInMs();
			bidMap[divID] = temp;
		}
	}

	exports.setConfig = function (divID, config) {
		createBidEntry(divID);
		bidMap[divID][CONSTANTS.COMMON.CONFIG] = config;
	};

	exports.setSizes = function (divID, slotSizes) {
		createBidEntry(divID);
		bidMap[divID][CONSTANTS.SLOT_ATTRIBUTES.SIZES] = slotSizes;
	};

	exports.setCallInitTime = function (divID, bidderID) {
		createBidEntry(divID);
		if (!util.isOwnProperty(bidMap[divID][bids], bidderID)) {
			bidMap[divID][bids][bidderID] = {};
		}
		bidMap[divID][bids][bidderID][callInitiatedTime] = util.getCurrentTimestampInMs();

		util.log(constCommonMessage04 + divID + ' ' + bidderID + ' ' + bidMap[divID][bids][bidderID][callInitiatedTime]);
	};

	exports.setBidFromBidder = function (divID, bidderID, bidDetails, bidID) {

		if (!util.isOwnProperty(bidMap, divID)) {
			util.log('BidManager is not expecting bid for ' + divID + ', from ' + bidderID);
			return;
		}

		var currentTime = util.getCurrentTimestampInMs(),
		    isPostTimeout = bidMap[divID][creationTime] + TIMEOUT < currentTime ? true : false;

		bidID = bidID || util.getUniqueIdentifierStr();

		createBidEntry(divID);

		if (!util.isOwnProperty(bidMap[divID][bids], bidderID)) {
			bidMap[divID][bids][bidderID] = {};
		}

		util.log('BdManagerSetBid: divID: ' + divID + ', bidderID: ' + bidderID + ', ecpm: ' + bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] + ', size: ' + bidDetails[constTargetingWidth] + 'x' + bidDetails[constTargetingHeight] + ', postTimeout: ' + isPostTimeout);
		//util.log(constCommonMessage06+ util.isOwnProperty(bidMap[divID][bids][bidderID], bid));

		if (bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] === null) {
			util.log(constCommonMessage10);
			return;
		}

		if (utilIsStr(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM])) {
			bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM].replace(/\s/g, '');
			if (bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM].length === 0) {
				util.log(constCommonMessage20);
				return;
			}
		}

		if (isNaN(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM])) {
			util.log(constCommonMessage11 + bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
			return;
		}

		//todo: add validation, html / url should be present and should be a string

		// updaate bid ecpm according to revShare
		bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = parseFloat(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);

		// if adapter is not a BidPassThrough and ecpm is <= 0 then reject the bid
		//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
		//	util.log(constCommonMessage22+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
		//	return;
		//}

		bidDetails[constTargetingActualEcpm] = parseFloat(bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
		bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = parseFloat((bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] * bidManagerGetAdapterRevShare(bidderID)).toFixed(bidPrecision));

		//if(!adapterBidPassThrough[bidderID] && 0 >= bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]){
		//	util.log(constCommonMessage22+' Post revshare and bidPrecision. '+bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]);
		//	return;
		//}

		bidDetails[bidReceivedTime] = currentTime;
		bidDetails[postTimeout] = isPostTimeout;

		// un-comment following block when we can pass multiple bids from a partner for a slot
		/*
	 if(! util.isOwnProperty(bidMap[divID][bids][bidderID], bid) ){
	 	bidMap[divID][bids][bidderID][bid] = {};	
	 }
	 
	 bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
	 
	 utilVLogInfo(divID, {
	 	type: bid,
	 	bidder: bidderID,
	 	bidDetails: bidDetails,
	 	startTime: bidMap[divID][creationTime],
	 	endTime: currentTime,
	 });
	 
	 bidIdMap[bidID] = {
	 	s: divID,
	 	a: bidderID
	 };
	 */

		// comment following block when we can pass multiple bids from a partner for a slot
		if (util.isOwnProperty(bidMap[divID][bids][bidderID], bid)) {

			var lastBidID = bidMap[divID][bids][bidderID][constCommonLastBidID],
			    lastBidWasDefaultBid = bidMap[divID][bids][bidderID][bid][lastBidID][constCommonDefaultBid] == 1;

			if (lastBidWasDefaultBid || !isPostTimeout) {

				if (lastBidWasDefaultBid) {
					util.log(constCommonMessage23);
				}

				if (lastBidWasDefaultBid || bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] < bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]) {

					util.log(constCommonMessage12 + bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] + constCommonMessage13 + bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] + constCommonMessage14);
					delete bidMap[divID][bids][bidderID][bid][lastBidID];
					bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
					bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
					bidIdMap[bidID] = {
						s: divID,
						a: bidderID
					};

					if (bidDetails[constCommonDefaultBid] === 0) {
						utilVLogInfo(divID, {
							type: bid,
							bidder: bidderID + (adapterBidPassThrough[bidderID] ? '(PT)' : ''),
							bidDetails: bidDetails,
							startTime: bidMap[divID][creationTime],
							endTime: currentTime
						});
					}
				} else {
					util.log(constCommonMessage12 + bidMap[divID][bids][bidderID][bid][lastBidID][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] + constCommonMessage15 + bidDetails[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] + constCommonMessage16);
				}
			} else {
				util.log(constCommonMessage17);
			}
		} else {

			util.log(constCommonMessage18);
			bidMap[divID][bids][bidderID][constCommonLastBidID] = bidID;
			bidMap[divID][bids][bidderID][bid] = {};
			bidMap[divID][bids][bidderID][bid][bidID] = bidDetails;
			bidIdMap[bidID] = {
				s: divID,
				a: bidderID
			};

			if (bidDetails[constCommonDefaultBid] === 0) {
				utilVLogInfo(divID, {
					type: bid,
					bidder: bidderID + (adapterBidPassThrough[bidderID] ? '(PT)' : ''),
					bidDetails: bidDetails,
					startTime: bidMap[divID][creationTime],
					endTime: currentTime
				});
			}
		}
	};

	exports.resetBid = function (divID, impressionID) {
		//utilVLogInfo(divID, {type: "hr"});//todo
		delete bidMap[divID];
		createBidEntry(divID);
		bidMap[divID][CONSTANTS.COMMON.IMPRESSION_ID] = impressionID;
	};

	function auctionBids(bids) {
		var winningBidID = '',
		    winningBidAdapter = '',
		    winningBid = {},
		    keyValuePairs = {};
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = 0;

		for (var adapter in bids) {
			if (bids[adapter] && bids[adapter].bid
			// commenting this condition as we need to pass kvp for all bids and bids which should not be part of auction will have zero ecpm
			//&& bids[adapter].bid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]
			// commenting this condition as postTimeout flag is now set at bid level
			//&& bids[adapter][postTimeout] == false
			) {

					for (var bidID in bids[adapter].bid) {

						if (!util.isOwnProperty(bids[adapter].bid, bidID)) {
							continue;
						}

						var theBid = bids[adapter].bid[bidID];

						// do not consider post-timeout bids
						if (theBid[postTimeout]) {
							continue;
						}

						/*
	     	if bidPassThrough is not enabled and ecpm > 0
	     		then only append the key value pairs from partner bid
	     */
						if (!adapterBidPassThrough[adapter] && theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0) {
							if (theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]) {
								util.copyKeyValueObject(keyValuePairs, theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]);
							}
						}

						//BidPassThrough: Do not participate in auction)
						if (adapterBidPassThrough[adapter]) {
							util.copyKeyValueObject(keyValuePairs, theBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]);
							continue;
						}

						if (winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] < theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]) {
							winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM];
							winningBidID = bidID;
							winningBidAdapter = adapter;
						}
					}
				}
		}

		if (winningBidID && winningBidAdapter) {
			winningBid = bids[winningBidAdapter][bid][winningBidID];
			winningBid[constTargetingAdapterID] = winningBidAdapter;
			winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID] = winningBidID;
		}

		winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS] = keyValuePairs;
		return winningBid;
	}

	exports.getBid = function (divID, auctionFunction) {

		var winningBid = {};
		winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = 0;

		if (util.isOwnProperty(bidMap, divID)) {

			// if a custom auctionFunction is passed , let it evaluate the bids
			if (util.isFunction(auctionFunction)) {
				return auctionFunction(bidMap[divID][bids]);
			}

			winningBid = auctionBids(bidMap[divID][bids]);
			winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS] = 1;
			bidMap[divID]['ae'] = true; // Analytics Enabled

			if (winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0) {
				bidMap[divID][bids][winningBid[constTargetingAdapterID]][bid][winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID]].win = true;

				//todo
				/*utilVLogInfo(divID, {
	   	type: "win-bid",
	   	bidDetails: winningBid
	   });*/
			} else {
					//todo
					/*utilVLogInfo(divID, {
	    	type: "win-bid-fail",
	    });*/
				}
		}

		return winningBid;
	};

	exports.displayCreative = function (theDocument, bidID) {

		if (!util.isOwnProperty(bidIdMap, bidID)) {
			util.log('Bid details not found for bidID: ' + bidID);
			return;
		}

		var divID = bidIdMap[bidID]['s'];
		var adapterID = bidIdMap[bidID]['a'];

		if (util.isOwnProperty(bidMap, divID)) {
			//var adapterID = '';
			// find the winning adapter
			/*
	  for(var adapter in bidMap[divID][bids]){
	  	if( util.isOwnProperty(bidMap[divID][bids], adapter) && bidMap[divID][bids][adapter].win ){
	  		adapterID = adapter;
	  		break;		
	  	}
	  }
	  */

			util.log(divID + constCommonMessage19 + adapterID);
			var theBid = bidMap[divID][bids][adapterID][bid][bidID];

			if (util.isOwnProperty(bidMap[divID][bids], adapterID)) {
				//todo: deprecate it
				/*adapterManagerDisplayCreative(
	   	theDocument, adapterID, theBid
	   );*/
				//utilVLogInfo(divID, {type: 'disp', adapter: adapterID}); //todo
				this.executeMonetizationPixel({
					'slt': divID,
					'adp': adapterID,
					'en': theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM],
					'eg': theBid[constTargetingActualEcpm],
					'iid': bidMap[divID][CONSTANTS.COMMON.IMPRESSION_ID],
					'kgpv': theBid[constCommonKeyGenerationPatternValue],
					'bidid': bidID
				});
			}
		}
	};

	exports.setGlobalConfig = function (config) {
		if (util.isOwnProperty(config, CONSTANTS.CONFIG.GLOBAL) && util.isOwnProperty(config[CONSTANTS.CONFIG.GLOBAL], 'pwt')) {
			bidManagerPwtConf = config[CONSTANTS.CONFIG.GLOBAL]['pwt'];
		}
		this.setAdapterConfig(config);
	};

	exports.getProfileID = function () {
		return bidManagerPwtConf[CONSTANTS.CONFIG.PROFILE_ID] || "0";
	};

	exports.getProfileDisplayVersionID = function () {
		return bidManagerPwtConf[CONSTANTS.CONFIG.PROFILE_VERSION_ID] || "0";
	};

	function getAnalyticsPixelURL() {
		return bidManagerPwtConf[CONSTANTS.CONFIG.LOGGER_URL] || false;
	}

	function getMonetizationPixelURL() {
		return bidManagerPwtConf[CONSTANTS.CONFIG.TRACKER_URL] || false;
	}

	function getAdapterConfig(configObject) {
		if (util.isOwnProperty(configObject, CONSTANTS.CONFIG.GLOBAL) && util.isOwnProperty(configObject[CONSTANTS.CONFIG.GLOBAL], CONSTANTS.CONFIG.ADAPTERS)) {

			var adapterConfig = configObject[CONSTANTS.CONFIG.GLOBAL][CONSTANTS.CONFIG.ADAPTERS];

			for (var adapter in adapterConfig) {
				if (util.isOwnProperty(adapterConfig, adapter)) {
					if (util.isOwnProperty(adapterConfig[adapter], CONSTANTS.COMMON.REV_SHARE)) {
						adapterRevShareMap[adapter] = 1 - parseFloat(adapterConfig[adapter][CONSTANTS.COMMON.REV_SHARE]) / 100;
					}

					if (util.isOwnProperty(adapterConfig[adapter], CONSTANTS.CONFIG.THROTTLE)) {
						adapterThrottleMap[adapter] = 100 - parseFloat(adapterConfig[adapter][CONSTANTS.CONFIG.THROTTLE]);
					}

					if (util.isOwnProperty(adapterConfig[adapter], CONSTANTS.CONFIG.BID_PASS_THROUGH)) {
						adapterBidPassThrough[adapter] = parseInt(adapterConfig[adapter][CONSTANTS.CONFIG.BID_PASS_THROUGH]);
					}
				}
			}
		}
	}

	function getAdapterRevShare(adapterID) {
		if (util.isOwnProperty(adapterRevShareMap, adapterID)) {
			return adapterRevShareMap[adapterID];
		}
		return 1;
	}

	function getAdapterThrottle(adapterID) {
		if (util.isOwnProperty(adapterThrottleMap, adapterID)) {
			return adapterThrottleMap[adapterID];
		}
		return 0;
	}

	exports.executeAnalyticsPixel = function () {

		var selectedInfo = {},
		    outputObj = {},
		    firePixel = false,
		    impressionID = '',
		    pixelURL = getAnalyticsPixelURL();

		if (!pixelURL) {
			return;
		}

		outputObj['s'] = [];

		for (var key in bidMap) {

			if (!util.isOwnProperty(bidMap, key)) {
				continue;
			}

			var startTime = bidMap[key][creationTime];
			if (util.isOwnProperty(bidMap, key) && bidMap[key].exp !== false && bidMap[key]['ae'] === true) {

				bidMap[key].exp = false;

				var slotObject = {
					'sn': key,
					'sz': bidMap[key][CONSTANTS.SLOT_ATTRIBUTES.SIZES],
					'ps': []
				};

				selectedInfo[key] = {};

				var bidsArray = bidMap[key][bids];
				impressionID = bidMap[key][CONSTANTS.COMMON.IMPRESSION_ID];

				for (var adapter in bidsArray) {

					//if bid-pass-thru is set then do not log the bids
					if (adapterBidPassThrough[adapter]) {
						continue;
					}

					if (bidsArray[adapter] && bidsArray[adapter].bid) {

						for (var bidID in bidsArray[adapter].bid) {
							if (!util.isOwnProperty(bidsArray[adapter].bid, bidID)) {
								continue;
							}
							var theBid = bidsArray[adapter].bid[bidID];
							var endTime = theBid[bidReceivedTime];
							slotObject['ps'].push({
								'pn': adapter,
								'bidid': bidID,
								'db': theBid[constCommonDefaultBid],
								'kgpv': theBid[constCommonKeyGenerationPatternValue],
								'psz': theBid[constTargetingWidth] + 'x' + theBid[constTargetingHeight],
								'eg': theBid[constTargetingActualEcpm],
								'en': theBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM],
								'di': theBid[constTargetingDeal][CONSTANTS.DEAL.ID],
								'dc': theBid[constTargetingDeal][CONSTANTS.DEAL.CHANNEL],
								'l1': endTime - startTime,
								'l2': 0,
								't': theBid[postTimeout] === false ? 0 : 1,
								'wb': theBid['win'] === true ? 1 : 0
							});
							firePixel = true;
						}
					}
				}

				outputObj['s'].push(slotObject);
			}
		}

		if (firePixel) {
			outputObj[constConfigPublisherID] = bidManagerPwtConf[constConfigPublisherID];
			outputObj['to'] = bidManagerPwtConf['t'];
			outputObj['purl'] = decodeURIComponent(utilMetaInfo.u);
			outputObj[constBidInfoTimestamp] = util.getCurrentTimestamp();
			outputObj[CONSTANTS.COMMON.IMPRESSION_ID] = encodeURIComponent(impressionID);
			outputObj[CONSTANTS.CONFIG.PROFILE_ID] = bidManagerGetProfileID();
			outputObj[CONSTANTS.CONFIG.PROFILE_VERSION_ID] = bidManagerGetProfileDisplayVersionID();

			pixelURL += 'pubid=' + bidManagerPwtConf[constConfigPublisherID] + '&json=' + encodeURIComponent(JSON.stringify(outputObj));
		}

		if (firePixel) {
			new Image().src = util.protocol + pixelURL;
			//utilAjaxCall(
			//	utilMetaInfo.protocol + pixelURL + 'pubid=' + bidManagerPwtConf[constConfigPublisherID],
			//	function(){},
			//	JSON.stringify(outputObj),
			//	{} // todo later
			//);
		}
	};

	exports.executeMonetizationPixel = function (bidInfo) {

		var pixelURL = getMonetizationPixelURL();

		if (!pixelURL) {
			return;
		}

		pixelURL += 'pubid=' + bidManagerPwtConf[constConfigPublisherID];
		pixelURL += '&purl=' + utilMetaInfo.u;
		pixelURL += '&tst=' + util.getCurrentTimestamp();
		pixelURL += '&iid=' + encodeURIComponent(bidInfo[CONSTANTS.COMMON.IMPRESSION_ID]);
		pixelURL += '&bidid=' + encodeURIComponent(bidInfo['bidid']);
		pixelURL += '&pid=' + encodeURIComponent(bidManagerGetProfileID());
		pixelURL += '&pdvid=' + encodeURIComponent(bidManagerGetProfileDisplayVersionID());
		pixelURL += '&slot=' + encodeURIComponent(bidInfo[constBidInfoSlot]);
		pixelURL += '&pn=' + encodeURIComponent(bidInfo[constBidInfoAdapter]);
		pixelURL += '&en=' + encodeURIComponent(bidInfo[constBidInfoNetEcpm]);
		pixelURL += '&eg=' + encodeURIComponent(bidInfo[constBidInfoGrossEcpm]);
		pixelURL += '&kgpv=' + encodeURIComponent(bidInfo[CONSTANTS.COMMON.KEY_GENERATION_PATTERN_VALUE]);

		new Image().src = util.protocol + pixelURL;
	};

/***/ }),
/* 6 */
/***/ ((function(module, exports, __webpack_require__) {

	'use strict';

	var CONSTANTS = __webpack_require__(2);
	var util = __webpack_require__(3);
	var bidManager = __webpack_require__(5);

	var registeredAdapters = {};

	exports.callAdapters = function (configObject, activeSlots) {

		var randomNumberBelow100 = Math.floor(Math.random() * 100);
		var impressionID = util.generateUUID();
		//configObject.global.pwt.wiid = impressionID;// todo use constants

		for (var i in activeSlots) {
			if (util.isOwnProperty(activeSlots, i) && activeSlots[i]) {
				bidManager.resetBid(activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], impressionID);
				bidManager.setConfig(activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], configObject);
				bidManager.setSizes(activeSlots[i][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], util.generateSlotNamesFromPattern(activeSlots[i], '_W_x_H_'));
			}
		}

		for (var anAdapter in registeredAdapters) {
			if (util.isOwnProperty(registeredAdapters, anAdapter)) {
				if (randomNumberBelow100 >= bidManager.getAdapterThrottle(anAdapter)) {
					for (var j in activeSlots) {
						if (util.isOwnProperty(activeSlots, j) && activeSlots[j]) {
							bidManager.setCallInitTime(activeSlots[j][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], anAdapter);
						}
					}
					registeredAdapters[anAdapter].fB(configObject, activeSlots);
				} else {
					util.log(anAdapter + constCommonMessage02);
				}
			}
		}
	};

	exports.registerAdapter = function (bidAdaptor) {
		if (bidAdaptor) {
			var adapterID = bidAdaptor.ID();
			if (util.isFunction(bidAdaptor.fB)) {
				registeredAdapters[adapterID] = bidAdaptor;
			} else {
				util.log(adapterID + constCommonMessage03);
			}
		}
	};

	// todo: deprecate
	exports.displayCreative = function (theDocument, adapterID, bidDetails) {
		if (util.isOwnProperty(registeredAdapters, adapterID)) {
			registeredAdapters[adapterID].dC(theDocument, bidDetails);
		}
	};

/***/ }))
/******/ ]);