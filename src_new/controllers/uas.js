var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var UTIL = require("../util.js");
var adapterManager = require("../adapterManager.js");
var bidManager = require("../bidManager.js");
var SLOT = require("../slot.js");
var PHOENIX = require("uas-adclient");

var slotsMap = {}; // key is div id, stores the mapping of divID ==> googletag.slot
/* start-test-block */
exports.slotsMap = slotsMap;
/* end-test-block */

var windowReference = null;
var refThis = this;

function setWindowReference(win) {
    if (UTIL.isObject(win)) {
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

function storeInSlotsMap(dmSlotName, currentPhoenixSlot, isDisplayFlow) {
    // note: here dmSlotName is actually the DivID
    if (!UTIL.isOwnProperty(refThis.slotsMap, dmSlotName)) {
        var slot = SLOT.createSlot(dmSlotName);
        slot.setDivID(dmSlotName);
        slot.setPubAdServerObject(currentPhoenixSlot);
        slot.setAdUnitID(currentPhoenixSlot.getAdUnit());
        slot.setAdUnitIndex(0);
        slot.setSizes(currentPhoenixSlot.getDimensions());
        slot.setStatus(CONSTANTS.SLOT_STATUS.CREATED);

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
    var ignoreTheseKeys = CONSTANTS.IGNORE_PREBID_KEYS;

    UTIL.log("DIV: " + divID + " winningBid: ");
    UTIL.log(winningBid);

    /* istanbul ignore else*/
    if (winningBid && winningBid.getNetEcpm() > 0) {
        refThis.slotsMap[divID].setStatus(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID, winningBid.getBidID());
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS, winningBid.getStatus());
        phoenixDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM, winningBid.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));
        phoenixDefinedSlot.setWrapperEcpm(winningBid.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));
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
        UTIL.resetExternalBidderStatus(divIds);
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

function displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg) {
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

function initiateDisplay(win) {
  win.Phoenix.registerPreDisplayHandler(function(taskDone, divId){
    var phoenixObj = window.Phoenix || {};

    /* istanbul ignore next */
    refThis.updateSlotsMapFromPhoenixSlots(phoenixObj.getSlots(), [divId], true);

    /* istanbul ignore next */
    refThis.displayFunctionStatusHandler(getStatusOfSlotForDivId(divId), {}, taskDone, [divId]);

    var statusObj = {};
    statusObj[CONSTANTS.SLOT_STATUS.CREATED] = "";

    refThis.forQualifyingSlotNamesCallAdapters(getSlotNamesByStatus(statusObj), [divId], false);

    /* istanbul ignore next */
    setTimeout(function() {
      UTIL.realignVLogInfoPanel(divId);
      bidManager.executeAnalyticsPixel();
    }, 2000 + CONFIG.getTimeout());

  });
}
/* start-test-block */
exports.initiateDisplay = initiateDisplay;
/* end-test-block */

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


function initPhoenixScript(win) {
    if (UTIL.isUndefined(win.Phoenix.isJSLoaded) && UTIL.isObject(win.Phoenix) && UTIL.isArray(win.Phoenix.EQ)) {
        UTIL.log("Succeeded to load before UAS");
        var refThis = this;

        win.Phoenix.EQ.unshift(function () {
            /* istanbul ignore next */
            UTIL.log("OpenWrap initialization started");
            /* istanbul ignore next */
            refThis.initiateDisplay(win);
            /* istanbul ignore next */
            UTIL.log("OpenWrap initialization completed");
        });
        PHOENIX.init(win);
        return true;
    } else {
        UTIL.log("Failed to load before UAS");
        return false;
    }
}
/* start-test-block */
exports.initPhoenixScript = initPhoenixScript;
/* end-test-block */

exports.init = function(win) { // TDD, i/o : done
	CONFIG.initConfig();
    if (UTIL.isObject(win)) {
        refThis.setWindowReference(win);
        adapterManager.registerAdapters();
        refThis.initPhoenixScript(win);
        refThis.callJsLoadedIfRequired(win);
        return true;
    } else {
        return false;
    }
};
