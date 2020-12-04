var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
// var GDPR = require("../gdpr.js");
var SLOT = require("../slot.js");
var prebid = require("../adapters/prebid.js");
var isPrebidPubMaticAnalyticsEnabled = CONFIG.isPrebidPubMaticAnalyticsEnabled();
var usePrebidKeys = CONFIG.isUsePrebidKeysEnabled();
// removeIf(removeIdHubRelatedCode)
var IdHub = require("../controllers/idhub.js");
// endRemoveIf(removeIdHubRelatedCode)

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

function getAdUnitIndex(currentGoogleSlot) { // TDD, i/o : done
	var index = 0;
	try {
		var adUnitIndexString = currentGoogleSlot.getSlotId().getId().split("_");
		index = parseInt(adUnitIndexString[adUnitIndexString.length - 1]);
	} catch (ex) {} // eslint-disable-line no-empty
	return index;
}
/* start-test-block */
exports.getAdUnitIndex = getAdUnitIndex;
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

// removeIf(removeLegacyAnalyticsRelatedCode)
function initSafeFrameListener(theWindow) {
	if (!theWindow.PWT.safeFrameMessageListenerAdded) {
		util.addMessageEventListenerForSafeFrame(theWindow);
		theWindow.PWT.safeFrameMessageListenerAdded = true;
	}
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
/* start-test-block */
exports.initSafeFrameListener = initSafeFrameListener;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

function validateAdUnitObject(anAdUnitObject) {
	if (!util.isObject(anAdUnitObject)) {
		util.logError("An AdUnitObject should be an object", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.code)) {
		util.logError("An AdUnitObject should have a property named code and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.divId)) {
		util.logError("An AdUnitObject should have a property named divId and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.adUnitId)) {
		util.logError("An AdUnitObject should have a property named adUnitId and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isString(anAdUnitObject.adUnitIndex)) {
		util.logError("An AdUnitObject should have a property named adUnitIndex and it should be a string", anAdUnitObject);
		return false;
	}

	if (!util.isObject(anAdUnitObject.mediaTypes)) {
		util.logError("An AdUnitObject should have a property named mediaTypes and it should be an object", anAdUnitObject);
		return false;
	}

	if (!util.isObject(anAdUnitObject.mediaTypes.banner) && !util.isObject(anAdUnitObject.mediaTypes.native) && !util.isObject(anAdUnitObject.mediaTypes.video)) {
		util.logError("An anAdUnitObject.mediaTypes should atleast have a property named banner or native or video and it should be an object", anAdUnitObject);
		return false;
	}

	if (util.isObject(anAdUnitObject.mediaTypes.banner) && !util.isArray(anAdUnitObject.mediaTypes.banner.sizes)) {
		util.logError("An anAdUnitObject.mediaTypes.banner should have a property named sizes and it should be an array", anAdUnitObject);
		return false;
	}

	return true;
}
/* start-test-block */
exports.validateAdUnitObject = validateAdUnitObject;
/* end-test-block */

function getAdSlotSizesArray(anAdUnitObject) {
	//ToDo: need to habdle fluid sizes
	// ToDo: for now supporting only banner sizes, need to support native as well
	if (anAdUnitObject && anAdUnitObject.mediaTypes){
		if(anAdUnitObject.mediaTypes.banner && util.isArray(anAdUnitObject.mediaTypes.banner.sizes)) {
			return anAdUnitObject.mediaTypes.banner.sizes;
		}
		//TODO : Confirm about the below configuration and correct if needed
		// Commenting below code to remove custom handling of sizes and will be handled using adSlot.sizes
		// Uncommenting and making behaviour same as to have player size or w and h as mandatory.
		if(anAdUnitObject.mediaTypes.video) {
			if(!util.isArray(anAdUnitObject.mediaTypes.video.playerSize) && !(anAdUnitObject.mediaTypes.video.w && anAdUnitObject.mediaTypes.video.h)){
				util.logError("For slot video playersize or w,h is not defined and may not request bids from SSP for this slot. " + JSON.stringify(anAdUnitObject));
				return [];
			}
		}
		if(anAdUnitObject.mediaTypes.native || anAdUnitObject.mediaTypes.video){
			return anAdUnitObject.sizes;
		}
		//TODO : Also handle native only configuration
	}
	return [];
}
/* start-test-block */
exports.getAdSlotSizesArray = getAdSlotSizesArray;
/* end-test-block */

function findWinningBidAndGenerateTargeting(divId) {
	var data;
	if(isPrebidPubMaticAnalyticsEnabled === true){
		data = prebid.getBid(divId);
		//todo: we might need to change some proprty names in wb (from PBJS)
	} else {
		// removeIf(removeLegacyAnalyticsRelatedCode)
		data = bidManager.getBid(divId);
		// endRemoveIf(removeLegacyAnalyticsRelatedCode)
	}
	var winningBid = data.wb || null;
	var keyValuePairs = data.kvp || null;
	var ignoreTheseKeys = !usePrebidKeys ? CONSTANTS.IGNORE_PREBID_KEYS : {};

	// removeIf(removeLegacyAnalyticsRelatedCode)
	/* istanbul ignore else*/
	if (isPrebidPubMaticAnalyticsEnabled === false && winningBid && winningBid.getNetEcpm() > 0) {		
		bidManager.setStandardKeys(winningBid, keyValuePairs);		
	}
	// endRemoveIf(removeLegacyAnalyticsRelatedCode)

	// attaching keyValuePairs from adapters
	util.forEachOnObject(keyValuePairs, function(key) {
		// if winning bid is not pubmatic then remove buyId targeting key. Ref : UOE-5277
		/* istanbul ignore else*/ 
		if (util.isOwnProperty(ignoreTheseKeys, key) || (winningBid && winningBid.adapterID !== "pubmatic" && util.isOwnProperty({"hb_buyid_pubmatic":1,"pwtbuyid_pubmatic":1}, key))) {
			delete keyValuePairs[key];
		}
		else {
			refThis.defineWrapperTargetingKey(key);
		}
	});

	var wb = null;
	if (winningBid) {
		wb = {};
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

	//GDPR.getUserConsentDataFromCMP(); // Commenting this as GDPR will be handled by Prebid and we won't be seding GDPR info to tracker and logger

	if (!util.isArray(arrayOfAdUnits)) {
		util.error("First argument to PWT.requestBids API, arrayOfAdUnits is mandatory and it should be an array.");
		callbackFunction(arrayOfAdUnits);
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
			slot.setSizes(refThis.getAdSlotSizesArray(anAdUnitObject));
			qualifyingSlots.push(slot);
			mapOfDivToCode[slot.getDivID()] = slot.getName();
			qualifyingSlotDivIds.push(slot.getDivID());
			util.createVLogInfoPanel(slot.getDivID(), slot.getSizes());
		}
	});

	if (qualifyingSlots.length == 0) {
		util.error("There are no qualifyingSlots, so not calling bidders.");
		callbackFunction(arrayOfAdUnits);
		return;
	}

	// new approach without adapter-managers
	prebid.fetchBids(qualifyingSlots);

	var posTimeoutTime = Date.now() + CONFIG.getTimeout(); // post timeout condition
	var intervalId = window.setInterval(function() {
		// todo: can we move this code to a function?
		if (bidManager.getAllPartnersBidStatuses(window.PWT.bidMap, qualifyingSlotDivIds) || Date.now() >= posTimeoutTime) {

			clearInterval(intervalId);
			// removeIf(removeLegacyAnalyticsRelatedCode)
			if(isPrebidPubMaticAnalyticsEnabled === false){
				// after some time call fire the analytics pixel
				setTimeout(function() {
					bidManager.executeAnalyticsPixel();
				}, 2000);	
			}
			// endRemoveIf(removeLegacyAnalyticsRelatedCode)

			var winningBids = {}; // object:: { code : response bid or just key value pairs }
			// we should loop on qualifyingSlotDivIds to avoid confusion if two parallel calls are fired to our PWT.requestBids 
			util.forEachOnArray(qualifyingSlotDivIds, function(index, divId) {
				var code = mapOfDivToCode[divId];				
				winningBids[code] = refThis.findWinningBidAndGenerateTargeting(divId);
				// we need to delay the realignment as we need to do it post creative rendering :)
				// delaying by 1000ms as creative rendering may tke time
				setTimeout(util.realignVLogInfoPanel, 1000, divId);
			});

			// for each adUnit in arrayOfAdUnits find the winningBids, we need to return this updated arrayOfAdUnits
			util.forEachOnArray(arrayOfAdUnits, function(index, anAdUnitObject) {
				if (winningBids.hasOwnProperty(anAdUnitObject.code)) {
					anAdUnitObject.bidData = winningBids[anAdUnitObject.code];
				}
			});

			callbackFunction(arrayOfAdUnits);
		}
	}, 10); // check every 10 milliseconds if we have all bids or timeout has been happened.
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
				adUnitIndex = "" + refThis.getAdUnitIndex(googleSlot);

				// TODO: move to GPT specific code to small functions
				/* istanbul ignore else */
				if (slotID && util.isFunction(slotID.getDomId)) {
					divId = slotID.getDomId();
					code = divId;
				}
			}

			if (util.isFunction(googleSlot.getSizes)) {
				/*
					The DFP API, googleSlot.getSizes(window.innerWidth, window.innerHeight) upon passing the two arguments, returns applied sizes as per size-mapping.
				 */
				util.forEachOnArray(googleSlot.getSizes(window.innerWidth, window.innerHeight), function(index, sizeObj) {
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
			mediaTypes: util.getAdUnitConfig(sizes, googleSlot).mediaTypeObject,
			sizes: sizes
		});
	});

	return gptConfArray;
}
/* start-test-block */
exports.generateConfForGPT = generateConfForGPT;
/* end-test-block */

function addKeyValuePairsToGPTSlots(arrayOfAdUnits) {
	if (!util.isArray(arrayOfAdUnits)) {
		util.error("array is expected");
	}

	var arrayOfGPTSlots = [];
	if(util.isObject(window.googletag) && util.isFunction(window.googletag.pubads)){
		arrayOfGPTSlots = window.googletag.pubads().getSlots();	
	}

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
			if(util.isObject(adUnit) && util.isObject(adUnit.bidData) && util.isObject(adUnit.bidData.kvp)){
				util.forEachOnObject(adUnit.bidData.kvp, function(key, value) {
					googleSlot.setTargeting(key, [value]);
				});
			}			
		} else {
			util.error("GPT-Slot not found for divId: " + adUnit.divId);
		}
	});
}
/* start-test-block */
exports.addKeyValuePairsToGPTSlots = addKeyValuePairsToGPTSlots;
/* end-test-block */

function removeKeyValuePairsFromGPTSlots(arrayOfGPTSlots) {    
	//ToDo: need some fail-safe validations/checks
	/* istanbul ignore else */
	util.forEachOnArray(arrayOfGPTSlots, function(index, currentGoogleSlot){
		var targetingMap = {};
		if(util.isFunction(currentGoogleSlot.getTargetingKeys)){
			util.forEachOnArray(currentGoogleSlot.getTargetingKeys(), function(index, key) {
				targetingMap[key] = currentGoogleSlot.getTargeting(key);
			});
		}
		// now clear all targetings
		if(util.isFunction(currentGoogleSlot.clearTargeting)){
			currentGoogleSlot.clearTargeting();
		}
		// now set all settings from backup
		util.forEachOnObject(targetingMap, function(key, value) {
			if (!util.isOwnProperty(refThis.wrapperTargetingKeys, key)) {
				if(util.isFunction(currentGoogleSlot.setTargeting)){
					currentGoogleSlot.setTargeting(key, value);
				}
			}
		});
	});
}

/* start-test-block */
exports.removeKeyValuePairsFromGPTSlots = removeKeyValuePairsFromGPTSlots;
/* end-test-block */

exports.init = function(win) {
	CONFIG.initConfig();
	if (util.isObject(win)) {
		refThis.setWindowReference(win);

		// removeIf(removeLegacyAnalyticsRelatedCode)
		if(!isPrebidPubMaticAnalyticsEnabled){
			refThis.initSafeFrameListener(win);
		}
		// endRemoveIf(removeLegacyAnalyticsRelatedCode)
		prebid.initPbjsConfig();
		win.PWT.requestBids = refThis.customServerExposedAPI;
		win.PWT.generateConfForGPT = refThis.generateConfForGPT;
		win.PWT.addKeyValuePairsToGPTSlots = addKeyValuePairsToGPTSlots;
		win.PWT.removeKeyValuePairsFromGPTSlots = removeKeyValuePairsFromGPTSlots;
		refThis.wrapperTargetingKeys = refThis.defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
		// removeIf(removeIdHubRelatedCode)
		IdHub.initIdHub(win);		
		// endRemoveIf(removeIdHubRelatedCode)
		return true;
	} else {
		return false;
	}
};