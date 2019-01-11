var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
var GDPR = require("../gdpr.js");
var adapterManager = require("../adapterManager.js");
var SLOT = require("../slot.js");

//ToDo: add a functionality / API to remove extra added wrpper keys
var wrapperTargetingKeys = {}; // key is div id
/* start-test-block */
exports.wrapperTargetingKeys = wrapperTargetingKeys;
/* end-test-block */

//ToDo: is this required in first phase?
var slotSizeMapping = {}; // key is div id
/* start-test-block */
exports.slotSizeMapping = slotSizeMapping;
/* end-test-block */

var windowReference = null;
var refThis = this;


function setWindowReference(win) {
	if (util.isObject(win)) {
		windowReference = win;
	}
}
/* start-test-block */
exports.setWindowReference = setWindowReference;
/* end-test-block */

function getWindowReference() {
	return windowReference;
}
/* start-test-block */
exports.getWindowReference = getWindowReference;
/* end-test-block */

// ToDo: this function may not be needed
function defineWrapperTargetingKey(key) {
	/* istanbul ignore else */
	if (!util.isObject(refThis.wrapperTargetingKeys)) {
		refThis.wrapperTargetingKeys = {};
	}
	refThis.wrapperTargetingKeys[key] = "";
}

/* start-test-block */
exports.defineWrapperTargetingKey = defineWrapperTargetingKey;
/* end-test-block */

function defineWrapperTargetingKeys(object) {
	var output = {};
	util.forEachOnObject(object, function(key, value) {
		output[value] = "";
	});
	return output;
}
/* start-test-block */
exports.defineWrapperTargetingKeys = defineWrapperTargetingKeys;
/* end-test-block */

function callJsLoadedIfRequired(win) {
	if (util.isObject(win) && util.isObject(win.PWT) && util.isFunction(win.PWT.jsLoaded)) {
		win.PWT.jsLoaded();
		return true;
	}
	return false;
}
/* start-test-block */
exports.callJsLoadedIfRequired = callJsLoadedIfRequired;
/* end-test-block */

function initSafeFrameListener(theWindow) {
	if (!theWindow.PWT.safeFrameMessageListenerAdded) {
		util.addMessageEventListenerForSafeFrame(theWindow);
		theWindow.PWT.safeFrameMessageListenerAdded = true;
	}
}
/* start-test-block */
exports.initSafeFrameListener = initSafeFrameListener;
/* end-test-block */

function validateAdUnitObject(anAdUnitObject) {
	if (!util.isObject(anAdUnitObject)) {
		util.error("An AdUnitObject should be an object", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.code)) {
		util.error("An AdUnitObject should have a property named code and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.divId)) {
		util.error("An AdUnitObject should have a property named divId and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.adUnitId)) {
		util.error("An AdUnitObject should have a property named adUnitId and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.adUnitIndex)) {
		util.error("An AdUnitObject should have a property named adUnitIndex and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isObject(anAdUnitObject.mediaTypes)) {
		util.error("An AdUnitObject should have a property named mediaTypes and it should be an object", anAdUnitObject);
		return false;
	}

	// ToDo: in future we need to support native as well

	if (!util.isObject(anAdUnitObject.mediaTypes.banner)) {
		util.error("An anAdUnitObject.mediaTypes should have a property named banner and it should be an object", anAdUnitObject);
		return false;
	}

	if (!util.isArray(anAdUnitObject.mediaTypes.banner.sizes)) {
		util.error("An anAdUnitObject.mediaTypes.banner should have a property named sizes and it should be an array", anAdUnitObject);
		return false;
	}

	return true;
}
/* start-test-block */
exports.validateAdUnitObject = validateAdUnitObject;
/* end-test-block */

function getAdSlotSizesArray(dmSlotName, anAdUnitObject) {
	//ToDo: need to habdle fluid sizes
	// ToDo: for now supporting only banner sizes, need to support native as well
	if (anAdUnitObject.mediaTypes && anAdUnitObject.mediaTypes.banner && util.isArray(anAdUnitObject.mediaTypes.banner.sizes)) {
		return anAdUnitObject.mediaTypes.banner.sizes;
	}
	return [];
}
/* start-test-block */
exports.getAdSlotSizesArray = getAdSlotSizesArray;
/* end-test-block */

function findWinningBidAndGenerateTargeting(divId) {
	var data = bidManager.getBid(divId);
	var winningBid = data.wb || null;
	var keyValuePairs = data.kvp || null;
	var ignoreTheseKeys = CONSTANTS.IGNORE_PREBID_KEYS;

	/* istanbul ignore else*/
	if (winningBid && winningBid.getNetEcpm() > 0) {
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID] = winningBid.getBidID();
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS] = winningBid.getStatus();
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] = winningBid.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION);
		var dealID = winningBid.getDealID();
		if (dealID) {
			keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID] = dealID;
		}
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID] = winningBid.getAdapterID();
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID] = CONFIG.getPublisherId();
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID] = CONFIG.getProfileID();
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID] = CONFIG.getProfileDisplayVersionID();
		keyValuePairs[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_SIZE] = winningBid.width + "x" + winningBid.height;
	}

	// attaching keyValuePairs from adapters
	util.forEachOnObject(keyValuePairs, function(key) {
		/* istanbul ignore else*/
		if (util.isOwnProperty(ignoreTheseKeys, key)) {
			delete keyValuePairs[key];
		}
		refThis.defineWrapperTargetingKey(key);
	});

	var wb = {};
	if (winningBid) {
		wb.adHtml = winningBid.adHtml;
		wb.adapterID = winningBid.adapterID;
		wb.grossEcpm = winningBid.grossEcpm;
		wb.netEcpm = winningBid.netEcpm;
		wb.height = winningBid.height;
		wb.width = winningBid.width;
	}

	return {
		wb: wb,
		kvp: keyValuePairs
	};
}

/* start-test-block */
exports.findWinningBidAndGenerateTargeting = findWinningBidAndGenerateTargeting;
/* end-test-block */

/*
	Input: 
		arrayOfAdUnits
			[
				anAdUnitObject
				{
					code: "some-pub-friendly-unique-name", // mandatory
					divId: "div-id-where-slot-will-render", // mandatory
					adUnitId: "ad_unit-id-from-DFP", // mandatory
					adUnitIndex: "ad-unit-index", // necessary in case of PubMatic, can be derrived by our code by simply incrementing used adUnitIds
					mediaTypes: { // mandatory
						banner: { // mandatory in first phase? or atleast one type of mediaTypes should be present
							sizes: [ [300, 250], [300, 300] ] // array of sizes
						}
					}
				}
			]
		callbackFunction
			a function that accepts response
*/
function customServerExposedAPI(arrayOfAdUnits, callbackFunction) {

	GDPR.getUserConsentDataFromCMP();

	if (!util.isArray(arrayOfAdUnits)) {
		util.error("First argument to PWT.requestBids API, arrayOfAdUnits is mandatory and it should be an array.");
		return;
	}

	if (!util.isFunction(callbackFunction)) {
		util.error("Second argument to PWT.requestBids API, callBackFunction is mandatory and it should be a function.");
		return;
	}

	var qualifyingSlots = [];
	var mapOfDivToCode = {};
	var qualifyingSlotDivIds = [];
	util.forEachOnArray(arrayOfAdUnits, function(index, anAdUnitObject) {
		if (refThis.validateAdUnitObject(anAdUnitObject)) { // returns true for valid adUnit
			var dmSlotName = anAdUnitObject.code;
			var slot = SLOT.createSlot(dmSlotName);
			// IMPORTANT:: bidManager stores all data at divId level but in custom controller, divId is not mandatory.
			// so we woll set value of code to divId if divId is not present
			// also we will pass array of divId to the bidManager.getAllPartnersBidStatuses API 
			slot.setDivID(anAdUnitObject.divId || dmSlotName);
			slot.setPubAdServerObject(anAdUnitObject);
			slot.setAdUnitID(anAdUnitObject.adUnitId || "");
			slot.setAdUnitIndex(anAdUnitObject.adUnitIndex || 0);
			slot.setSizes(refThis.getAdSlotSizesArray(dmSlotName, anAdUnitObject));
			qualifyingSlots.push(slot);
			mapOfDivToCode[slot.getDivID()] = slot.getName();
			qualifyingSlotDivIds.push(slot.getDivID());
		}
	});

	/*
		Note:
			- No need to handle external bidders

		ToDo:
			- check if we have considered all the flags?                  
			- GDPR
	*/

	if (qualifyingSlots.length == 0) {
		util.error("There are no qualifyingSlots, so not calling bidders.");
		return;
	}

	// calling adapters
	adapterManager.callAdapters(qualifyingSlots);

	var timeoutTicker = 0; // here we will calculate time elapsed
	// Note: some time has already elapsed since we started 
	var timeoutIncrementer = 10; // in ms
	var intervalId = window.setInterval(function() {
		// todo: can we move this code to a function?
		if (bidManager.getAllPartnersBidStatuses(window.PWT.bidMap, qualifyingSlotDivIds) || timeoutTicker >= CONFIG.getTimeout()) {

			clearInterval(intervalId);
			// after some time call fire the analytics pixel
			setTimeout(function() {
				bidManager.executeAnalyticsPixel();
			}, 2000);

			var winningBids = {}; // object:: { code : response bid or just key value pairs }
			// we should loop on qualifyingSlotDivIds to avoid confusion if two parallel calls are fired to our PWT.requestBids 
			util.forEachOnArray(qualifyingSlotDivIds, function(index, divId) {
				var code = mapOfDivToCode[divId];
				winningBids[code] = refThis.findWinningBidAndGenerateTargeting(divId, code);
			});

			// for each adUnit in arrayOfAdUnits find the winningBids, we need to return this updated arrayOfAdUnits
			util.forEachOnArray(arrayOfAdUnits, function(index, anAdUnitObject) {
				if (winningBids.hasOwnProperty(anAdUnitObject.code)) {
					anAdUnitObject.bidData = winningBids[anAdUnitObject.code];
				}
			});

			callbackFunction(arrayOfAdUnits);
		}
		timeoutTicker += timeoutIncrementer;
	}, timeoutIncrementer);

	// calling adapters
	//adapterManager.callAdapters(qualifyingSlots);
}
/* start-test-block */
exports.customServerExposedAPI = customServerExposedAPI;
/* end-test-block */

/*
	this function will generate the required config for our APIs
	Input:
		Expects an array of GoogleTagSlots
	Output:
		array of object in required format
*/
function generateConfForGPT(arrayOfGPTSlots) {
	var gptConfArray = [];

	if (!util.isArray(arrayOfGPTSlots)) {
		util.error("first argument to generateConfForGPT should be an array");
		return gptConfArray;
	}

	util.forEachOnArray(arrayOfGPTSlots, function(index, googleSlot) {
		var adUnitId = "";
		var adUnitIndex = "";
		var divId = "";
		var sizes = [];
		var code = "";

		if (util.isObject(googleSlot)) {

			if (util.isFunction(googleSlot.getAdUnitPath)) {
				adUnitId = googleSlot.getAdUnitPath();
			}

			if (util.isFunction(googleSlot.getSlotId)) {
				var slotID = googleSlot.getSlotId();
				var adUnitIndexString = slotID.getId().split("_");
				adUnitIndex = (adUnitIndexString[adUnitIndexString.length - 1]);

				// TODO: move to GPT specific code to small functions
				/* istanbul ignore else */
				if (slotID && util.isFunction(slotID.getDomId)) {
					divId = slotID.getDomId();
					code = divId;
				}
			}

			if (util.isFunction(googleSlot.getSizes)) {
				util.forEachOnArray(googleSlot.getSizes(), function(index, sizeObj) {
					/* istanbul ignore else  */
					if (util.isFunction(sizeObj.getWidth) && util.isFunction(sizeObj.getHeight)) {
						sizes.push([sizeObj.getWidth(), sizeObj.getHeight()]);
					} else {
						util.log(divId + ", size object does not have getWidth and getHeight method. Ignoring: ");
						util.log(sizeObj);
					}
				});
			}
		}

		gptConfArray.push({
			code: code,
			divId: divId,
			adUnitId: adUnitId,
			adUnitIndex: adUnitIndex,
			mediaTypes: {
				banner: {
					sizes: sizes
				}
			}
		});
	});

	return gptConfArray;
}
/* start-test-block */
exports.generateConfForGPT = generateConfForGPT;
/* end-test-block */

function addKeyValuePairsOnSlotsForGPT(arrayOfAdUnits) {
	if (!util.isArray(arrayOfAdUnits)) {
		util.error("array is expected");
	}

	// ToDo: add check
	var arrayOfGPTSlots = window.googletag.pubads().getSlots();

	var mapOfDivIdToGoogleSlot = {};
	util.forEachOnArray(arrayOfGPTSlots, function(index, googleSlot) {
		if (util.isFunction(googleSlot.getSlotId)) {
			var slotID = googleSlot.getSlotId();
			if (slotID && util.isFunction(slotID.getDomId)) {
				mapOfDivIdToGoogleSlot[slotID.getDomId()] = googleSlot;
			} else {
				util.error("slotID.getDomId is not a function");
			}
		} else {
			util.error("googleSlot.getSlotId is not a function");
		}
	});

	util.forEachOnArray(arrayOfAdUnits, function(index, adUnit) {
		if (util.isOwnProperty(mapOfDivIdToGoogleSlot, adUnit.divId)) {
			var googleSlot = mapOfDivIdToGoogleSlot[adUnit.divId];
			util.forEachOnObject(adUnit.bidData.kvp, function(key, value) {
				googleSlot.setTargeting(key, [value]);
			});
		} else {
			util.error("GPT-Slot not found for divId: " + adUnit.divId);
		}
	});
}
/* start-test-block */
exports.addKeyValuePairsOnSlotsForGPT = addKeyValuePairsOnSlotsForGPT;
/* end-test-block */

function removeOpenWrapKeyValuePairsFromSlotsForGPT(arrayOfGPTSlots) {    
    //ToDo: need some fail-safe validations/checks
    /* istanbul ignore else */
    util.forEachOnArray(arrayOfGPTSlots, function(index, currentGoogleSlot){
    	var targetingMap = {};
        util.forEachOnArray(currentGoogleSlot.getTargetingKeys(), function(index, key) {
            targetingMap[key] = currentGoogleSlot.getTargeting(key);
        });
        // now clear all targetings
        currentGoogleSlot.clearTargeting();
        // now set all settings from backup
        util.forEachOnObject(targetingMap, function(key, value) {
            if (!util.isOwnProperty(refThis.wrapperTargetingKeys, key)) {
                currentGoogleSlot.setTargeting(key, value);
            }
        });
    });
}

/* start-test-block */
exports.removeOpenWrapKeyValuePairsFromSlotsForGPT = removeOpenWrapKeyValuePairsFromSlotsForGPT;
/* end-test-block */

exports.init = function(win) {
	CONFIG.initConfig();
	if (util.isObject(win)) {
		refThis.setWindowReference(win);
		refThis.initSafeFrameListener(win);
		win.PWT.requestBids = refThis.customServerExposedAPI;
		win.PWT.generateConfForGPT = refThis.generateConfForGPT;
		win.PWT.addKeyValuePairsOnSlotsForGPT = addKeyValuePairsOnSlotsForGPT;
		win.PWT.removeOpenWrapKeyValuePairsFromSlotsForGPT = removeOpenWrapKeyValuePairsFromSlotsForGPT;
		refThis.wrapperTargetingKeys = refThis.defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
		adapterManager.registerAdapters();
		refThis.callJsLoadedIfRequired(win);
		return true;
	} else {
		return false;
	}
};