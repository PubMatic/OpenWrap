var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var UTIL = require("../util.js");
var adapterManager = require("../adapterManager.js");
var bidManager = require("../bidManager.js");
var SLOT = require("../slot.js");
var PHOENIX = require("uas-adclient");

var wrapperTargetingKeys = {}; // key is div id
/* start-test-block */
exports.wrapperTargetingKeys = wrapperTargetingKeys;
/* end-test-block */
var slotSizeMapping = {}; // key is div id
/* start-test-block */
exports.slotSizeMapping = slotSizeMapping;
/* end-test-block */
var slotsMap = {}; // key is div id, stores the mapping of divID ==> googletag.slot

/* start-test-block */
exports.slotsMap = slotsMap;
/* end-test-block */

//todo: we might need to move this into Phoenix class as well
var windowReference = null;
var refThis = this;

function setWindowReference(win) { // TDD, i/o: done
    if (UTIL.isObject(win)) {
        windowReference = win;
    }
}
/* start-test-block */
exports.setWindowReference = setWindowReference;
/* end-test-block */

function getWindowReference() { // TDD, i/o: done
    return windowReference;
}
/* start-test-block */
exports.getWindowReference = getWindowReference;
/* end-test-block */

function defineWrapperTargetingKeys(object) { // TDD, i/o : done
    var output = {};
    UTIL.forEachOnObject(object, function(key, value) {
        output[value] = "";
    });
    return output;
}
/* start-test-block */
exports.defineWrapperTargetingKeys = defineWrapperTargetingKeys;
/* end-test-block */

// --------------------------------------New Code Added------------------------------------------------------
function setDisplayFunctionCalledIfRequired(slot, arg) { // TDD, i/o : done
    /* istanbul ignore else */
    if (UTIL.isObject(slot) && UTIL.isFunction(slot.getDivID)) {
        /* istanbul ignore else */
        if (UTIL.isArray(arg) && arg[0] && arg[0] == slot.getDivID()) {
            slot.setDisplayFunctionCalled(true);
            slot.setArguments(arg);
        }
    }
}

/* start-test-block */
exports.setDisplayFunctionCalledIfRequired = setDisplayFunctionCalledIfRequired;
/* end-test-block */

function storeInSlotsMap(dmSlotName, currentPhoenixSlot, isDisplayFlow) { // TDD, i/o : done
    // note: here dmSlotName is actually the DivID
    if (!UTIL.isOwnProperty(refThis.slotsMap, dmSlotName)) {
        var slot = SLOT.createSlot(dmSlotName);
        slot.setDivID(dmSlotName);
        slot.setPubAdServerObject(currentPhoenixSlot);
        slot.setAdUnitID(currentPhoenixSlot.getAdUnit());
        slot.setAdUnitIndex(0); // TODO: refThis.getAdUnitIndex(currentPhoenixSlot)
        slot.setSizes(currentPhoenixSlot.getDimensions()); // TODO: refThis.getAdSlotSizesArray(dmSlotName, currentPhoenixSlot)
        slot.setStatus(CONSTANTS.SLOT_STATUS.CREATED);

				// todo: find and set position
				// Removing sendTargetingInfoIsSet as its just set once to true
        /* istanbul ignore else */
				// NOTE: Don't need this as we are not adding hook on "setTargeting"
        // if (UTIL.isObject(JSON) && UTIL.isFunction(JSON.stringify)) {
        //     UTIL.forEachOnArray(currentPhoenixSlot.getTargetingKeys(), function(index, value) {
        //         slot.setKeyValue(value, currentPhoenixSlot.getTargeting(value));
        //     });
        // }

        refThis.slotsMap[dmSlotName] = slot;
        UTIL.createVLogInfoPanel(dmSlotName, slot.getSizes());
    }
}

/* start-test-block */
exports.storeInSlotsMap = storeInSlotsMap;
/* end-test-block */

function updateSlotsMapFromPhoenixSlots(phoenixSlotsArray, argumentsFromCallingFunction, isDisplayFlow) { // TDD, i/o : done
    UTIL.log("Generating slotsMap");
    UTIL.forEachOnArray(phoenixSlotsArray, function(index, currentPhoenixSlot) {
        var dmSlotName = currentPhoenixSlot.getId();
        refThis.storeInSlotsMap(dmSlotName, currentPhoenixSlot, isDisplayFlow);
        if (isDisplayFlow && UTIL.isOwnProperty(refThis.slotsMap, dmSlotName)) {
            refThis.setDisplayFunctionCalledIfRequired(refThis.slotsMap[dmSlotName], argumentsFromCallingFunction);
        }
    });
    UTIL.log(refThis.slotsMap);
}

/* start-test-block */
exports.updateSlotsMapFromPhoenixSlots = updateSlotsMapFromPhoenixSlots;
/* end-test-block */

//todo: pass slotsMap in every function that uses it
function getStatusOfSlotForDivId(divID) { // TDD, i/o : done
    /* istanbul ignore else */
    if (UTIL.isOwnProperty(refThis.slotsMap, divID)) {
        return refThis.slotsMap[divID].getStatus();
    }
    return CONSTANTS.SLOT_STATUS.DISPLAYED;
}

/* start-test-block */
exports.getStatusOfSlotForDivId = getStatusOfSlotForDivId;
/* end-test-block */

function updateStatusAfterRendering(divID, isRefreshCall) {
    /* istanbul ignore else */
    if (UTIL.isOwnProperty(refThis.slotsMap, divID)) {
        refThis.slotsMap[divID].updateStatusAfterRendering(isRefreshCall);
    }
}

/* start-test-block */
exports.updateStatusAfterRendering = updateStatusAfterRendering;
/* end-test-block */

function findWinningBidAndApplyTargeting(divID) { // TDD, i/o : done
    var data = bidManager.getBid(divID);
    var winningBid = data.wb || null;
    var keyValuePairs = data.kvp || null;
    var phoenixDefinedSlot = refThis.slotsMap[divID].getPubAdServerObject();
    // var phoenixDefinedSlot = refThis.slotsMap[divID];
    var ignoreTheseKeys = CONSTANTS.IGNORE_PREBID_KEYS;

    UTIL.log("DIV: " + divID + " winningBid: ");
    UTIL.log(winningBid);

    console.log("phoenixDefinedSlot:", phoenixDefinedSlot, " bid-ecpm: ", winningBid.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));

    /* istanbul ignore else*/
    if (winningBid && winningBid.getNetEcpm() > 0) {
        refThis.slotsMap[divID].setStatus(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID, winningBid.getBidID());
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS, winningBid.getStatus());
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM, winningBid.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));
        var dealID = winningBid.getDealID();
        if(dealID){
            phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID, dealID);
        }
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID, winningBid.getAdapterID());
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID, CONFIG.getPublisherId());
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID, CONFIG.getProfileID());
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID, CONFIG.getProfileDisplayVersionID());
    }

    // attaching keyValuePairs from adapters
    UTIL.forEachOnObject(keyValuePairs, function(key, value) {
        /* istanbul ignore else*/
        if (!UTIL.isOwnProperty(ignoreTheseKeys, key)) {
            phoenixDefinedSlot.setTargeting(key, value);
            // adding key in wrapperTargetingKeys as every key added by OpenWrap should be removed before calling refresh on slot
            refThis.defineWrapperTargetingKey(key);
        }
    });
}

/* start-test-block */
exports.findWinningBidAndApplyTargeting = findWinningBidAndApplyTargeting;
/* end-test-block */

function findWinningBidIfRequired_Display(key, slot) { // TDD, i/o : done
    var status = slot.getStatus();
    if (status != CONSTANTS.SLOT_STATUS.DISPLAYED && status != CONSTANTS.SLOT_STATUS.TARGETING_ADDED) {
        refThis.findWinningBidAndApplyTargeting(key);
    }
}

/* start-test-block */
exports.findWinningBidIfRequired_Display = findWinningBidIfRequired_Display;
/* end-test-block */

// TODO: remove unnecessary theObject dependancy from flow, pass resolve object as originalFunction
function updateStatusAndCallOriginalFunction_Display(message, theObject, originalFunction, arg) {
    UTIL.log(message);
    UTIL.log(arg);
    refThis.updateStatusAfterRendering(arg[0], false);
    originalFunction(arg[0]);
}

/* start-test-block */
exports.updateStatusAndCallOriginalFunction_Display = updateStatusAndCallOriginalFunction_Display;
/* end-test-block */

function processDisplayCalledSlot(theObject, originalFunction, arg){
    if (refThis.getStatusOfSlotForDivId(arg[0]) != CONSTANTS.SLOT_STATUS.DISPLAYED) {
        refThis.updateStatusAndCallOriginalFunction_Display(
            "Calling original display function after timeout with arguments, ",
            theObject,
            originalFunction,
            arg
        );
    } else {
        UTIL.log("AdSlot already rendered");
    }
}

/* start-test-block */
exports.processDisplayCalledSlot = processDisplayCalledSlot;
/* end-test-block */

function arrayOfSelectedSlots(slotNames) { // TDD, i/o : done
    var output = [];
    UTIL.forEachOnArray(slotNames, function(index, slotName) {
        output.push(refThis.slotsMap[slotName]);
    });
    return output;
}

/* start-test-block */
exports.arrayOfSelectedSlots = arrayOfSelectedSlots;
/* end-test-block */

function getSlotNamesByStatus(statusObject) {
    var slots = [];
    UTIL.forEachOnObject(refThis.slotsMap, function(key, slot) {
        /* istanbul ignore else */
        if (UTIL.isOwnProperty(statusObject, slot.getStatus())) {
            slots.push(key);
        }
    });
    return slots;
}

/* start-test-block */
exports.getSlotNamesByStatus = getSlotNamesByStatus;
/* end-test-block */

function updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall) { // TDD : done
    UTIL.forEachOnArray(slotNames, function(index, slotName) {
        /* istanbul ignore else */
        if (UTIL.isOwnProperty(refThis.slotsMap, slotName)) {
            var slot = refThis.slotsMap[slotName];
            slot.setStatus(CONSTANTS.SLOT_STATUS.PARTNERS_CALLED);
            /* istanbul ignore else */
            // if (isRefreshCall) {
            //     refThis.removeDMTargetingFromSlot(slotName);
            //     slot.setRefreshFunctionCalled(true);
            //     slot.setArguments(argumentsFromCallingFunction);
            // }
        }
    });
}

/* start-test-block */
exports.updateStatusOfQualifyingSlotsBeforeCallingAdapters = updateStatusOfQualifyingSlotsBeforeCallingAdapters;
/* end-test-block */

function forQualifyingSlotNamesCallAdapters(qualifyingSlotNames, arg, isRefreshCall) { // TDD, i/o : done
    if (qualifyingSlotNames.length > 0) {
        refThis.updateStatusOfQualifyingSlotsBeforeCallingAdapters(qualifyingSlotNames, arg, isRefreshCall);
        var qualifyingSlots = refThis.arrayOfSelectedSlots(qualifyingSlotNames);
        adapterManager.callAdapters(qualifyingSlots);
    }
}

/* start-test-block */
exports.forQualifyingSlotNamesCallAdapters = forQualifyingSlotNamesCallAdapters;
/* end-test-block */

function executeDisplay(timeout, divIds, callback) {
    if (UTIL.getExternalBidderStatus(divIds) && bidManager.getAllPartnersBidStatuses(window.PWT.bidMap, divIds)) {
        UTIL.resetExternalBidderStatus(divIds); //Quick fix to reset flag so that the notification flow happens only once per page load
        callback();
    } else {
        (timeout > 0) && window.setTimeout(function() {
          refThis.executeDisplay(timeout - 10, divIds, callback);
        }, 10);
    }
}

/* start-test-block */
exports.executeDisplay = executeDisplay;
/* end-test-block */

function displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg) { // TDD, i/o : done
    switch (oldStatus) {
        // display method was called for this slot
        /* istanbul ignore next */
        case CONSTANTS.SLOT_STATUS.CREATED:
            // dm flow is already intiated for this slot
            // just intitate the CONFIG.getTimeout() now
            // eslint-disable-line no-fallthrough
        /* istanbul ignore next */
        case CONSTANTS.SLOT_STATUS.PARTNERS_CALLED:
            var divIds = Object.keys(refThis.slotsMap);

            if (typeof window.OWT.externalBidderStatuses[arg[0]] === "object" && window.OWT.externalBidderStatuses[arg[0]]) {
               refThis.executeDisplay(CONFIG.getTimeout(), divIds, function() {
                   UTIL.forEachOnObject(refThis.slotsMap, function(key, slot) {
                       refThis.findWinningBidIfRequired_Display(key, slot);
                   });
                   refThis.processDisplayCalledSlot(theObject, originalFunction, arg);
                });
            }

            setTimeout(function() {
              UTIL.log("PostTimeout.. back in display function");
              UTIL.forEachOnObject(refThis.slotsMap, function(key, slot) {
                  refThis.findWinningBidIfRequired_Display(key, slot);
              });
              refThis.processDisplayCalledSlot(theObject, originalFunction, arg);
            }, CONFIG.getTimeout());

            break;
            // call the original function now
        case CONSTANTS.SLOT_STATUS.TARGETING_ADDED:
            refThis.updateStatusAndCallOriginalFunction_Display(
                "As DM processing is already done, Calling original display function with arguments",
                theObject,
                originalFunction,
                arg
            );
            break;

        case CONSTANTS.SLOT_STATUS.DISPLAYED:
            refThis.updateStatusAndCallOriginalFunction_Display(
                "As slot is already displayed, Calling original display function with arguments",
                theObject,
                originalFunction,
                arg
            );
            break;
    }
}

/* start-test-block */
exports.displayFunctionStatusHandler = displayFunctionStatusHandler;
/* end-test-block */

// ---------------------------------End New Code----------------------------------------------------

PHOENIX.prototype.preDisplay = function (divId) {
  // Inside OpenWrap, Adding hederbidding stuff
  console.log("Inside before Display");

  var phoenixObj = window.Phoenix || {};

  var p1 = new Promise(function(resolve, reject) {
    // setTimeout(function () {
    //   console.log("executing")
    //   resolve();
    // }, 10000);

    /* istanbul ignore next */
    refThis.updateSlotsMapFromPhoenixSlots(phoenixObj.getSlots(), [divId], true);

    /* istanbul ignore next */
    refThis.displayFunctionStatusHandler(getStatusOfSlotForDivId(divId), {}, resolve, [divId]);
    var statusObj = {};
    statusObj[CONSTANTS.SLOT_STATUS.CREATED] = "";
    /* istanbul ignore next */
    // Todo: need to add reThis whilwe calling getSlotNamesByStatus
    refThis.forQualifyingSlotNamesCallAdapters(getSlotNamesByStatus(statusObj), [divId], false);

    /* istanbul ignore next */
    setTimeout(function() {
        UTIL.realignVLogInfoPanel(divId);
        bidManager.executeAnalyticsPixel();
    }, 2000 + CONFIG.getTimeout());

  });

  return p1;
};


function callJsLoadedIfRequired(win) { // TDD, i/o : done
    if (UTIL.isObject(win) && UTIL.isObject(win.PWT) && UTIL.isFunction(win.PWT.jsLoaded)) {
        win.PWT.jsLoaded();
        return true;
    }
    return false;
}
/* start-test-block */
exports.callJsLoadedIfRequired = callJsLoadedIfRequired;
/* end-test-block */

function createPhoenixNamespace(win){
	// if Phoenix.isJSLoaded is undefined then it means,
	// this is first time our JS is loaded on page
	var Phoenix = win.Phoenix;
	if( UTIL.isUndefined(Phoenix) || UTIL.isUndefined(Phoenix.isJSLoaded) ){
		win.Phoenix = new PHOENIX(CONFIG.getTimeout());
	}
	return win.Phoenix;
}
/* start-test-block */
exports.createPhoenixNamespace = createPhoenixNamespace;
/* end-test-block */

function initPhoenix(win){
	if(Phoenix.isJSLoaded == true){
		return;
	}
	Phoenix = refThis.createPhoenixNamespace(win);
	Phoenix.isJSLoaded = true;
  UTIL.log("Phoenix.js is loaded successfully.")
	//setURLs();
	Phoenix.EQ.executeQ();
}
/* start-test-block */
exports.initPhoenix = initPhoenix;
/* end-test-block */

function createPubMaticNamespace(win){
	win.PubMatic = win.PubMatic || {};

  win.PubMatic._uidCB = function(response){
		PubMatic.pm_uid_bc = response.u;
		initPhoenix(win);
	};

	setTimeout(function(){
		initPhoenix(win);
	}, 500);
}
/* start-test-block */
exports.createPubMaticNamespace = createPubMaticNamespace;
/* end-test-block */

//todo: change variable names
function generateBCUID(win){
	var c = UTIL.createDocElement(win, "script"),
		e = win.document.getElementsByTagName("script")[0];

  c.type = "text/javascript";
	c.async = true;
	c.src = win.PWT.protocol + "image6.pubmatic.com/AdServer/UCookieSetPug?oid=2&cb=PubMatic._uidCB";
	e.parentNode.insertBefore(c,e);
}
/* start-test-block */
exports.generateBCUID = generateBCUID;
/* end-test-block */

exports.init = function(win) { // TDD, i/o : done
	CONFIG.initConfig();
    if (UTIL.isObject(win)) {
        refThis.setWindowReference(win);
        //refThis.initSafeFrameListener(win);// todo document
        refThis.wrapperTargetingKeys = refThis.defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
        adapterManager.registerAdapters();
        refThis.createPubMaticNamespace(win);
        refThis.generateBCUID(win);
        refThis.callJsLoadedIfRequired(win);
        return true;
    } else {
        return false;
    }
};
