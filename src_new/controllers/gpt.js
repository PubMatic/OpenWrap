var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
var GDPR = require("../gdpr.js");
var adapterManager = require("../adapterManager.js");
var SLOT = require("../slot.js");
var prebid = require("../adapters/prebid.js");


var displayHookIsAdded = false;

/* start-test-block */
exports.displayHookIsAdded = displayHookIsAdded;
/* end-test-block */
var disableInitialLoadIsSet = false;
var sendTargetingInfoIsSet = true;

//todo: combine these maps
var wrapperTargetingKeys = {}; // key is div id

/* start-test-block */
exports.wrapperTargetingKeys = wrapperTargetingKeys;
/* end-test-block */
var slotsMap = {}; // key is div id, stores the mapping of divID ==> googletag.slot

/* start-test-block */
exports.slotsMap = slotsMap;
/* end-test-block */

var GPT_targetingMap = {};
var windowReference = null;

var refThis = this;

function setWindowReference(win) { // TDD, i/o: done
    if (util.isObject(win)) {
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

function getAdUnitIndex(currentGoogleSlot) { // TDD, i/o : done
    var index = 0;
    try {
        var adUnitIndexString = currentGoogleSlot.getSlotId().getId().split("_");
        index = parseInt(adUnitIndexString[adUnitIndexString.length - 1]);
    } catch (ex) {} // eslint-disable-line no-empty
    return index;
}

exports.getAdUnitIndex = getAdUnitIndex;

function getAdSlotSizesArray(divID, currentGoogleSlot) { // TDD, i/o : doness
    var adslotSizesArray = [];
    /* istanbul ignore else  */
    if (util.isFunction(currentGoogleSlot.getSizes)) {
        // googleSlot.getSizes() returns applicable sizes as per sizemapping if we pass current available view-port width and height
        util.forEachOnArray(currentGoogleSlot.getSizes(window.innerWidth, window.innerHeight), function(index, sizeObj) {
            /* istanbul ignore else  */
            if (util.isFunction(sizeObj.getWidth) && util.isFunction(sizeObj.getHeight)) {
                adslotSizesArray.push([sizeObj.getWidth(), sizeObj.getHeight()]);
            } else {
                util.logWarning(divID + ", size object does not have getWidth and getHeight method. Ignoring: ");
                util.logWarning(sizeObj);
            }
        });
    }

    return adslotSizesArray;
}

/* start-test-block */
exports.getAdSlotSizesArray = getAdSlotSizesArray;
/* end-test-block */

function setDisplayFunctionCalledIfRequired(slot, arg) { // TDD, i/o : done
    /* istanbul ignore else */
    if (util.isObject(slot) && util.isFunction(slot.getDivID)) {
        /* istanbul ignore else */
        if (util.isArray(arg) && arg[0] && arg[0] == slot.getDivID()) {
            slot.setDisplayFunctionCalled(true);
            slot.setArguments(arg);
        }
    }
}

/* start-test-block */
exports.setDisplayFunctionCalledIfRequired = setDisplayFunctionCalledIfRequired;
/* end-test-block */

function storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow) { // TDD, i/o : done
    // note: here dmSlotName is actually the DivID
    if (!util.isOwnProperty(refThis.slotsMap, dmSlotName)) {
        var slot = SLOT.createSlot(dmSlotName);
        slot.setDivID(dmSlotName);
        slot.setPubAdServerObject(currentGoogleSlot);
        slot.setAdUnitID(currentGoogleSlot.getAdUnitPath());
        slot.setAdUnitIndex(refThis.getAdUnitIndex(currentGoogleSlot));
        slot.setSizes(refThis.getAdSlotSizesArray(dmSlotName, currentGoogleSlot));
        slot.setStatus(CONSTANTS.SLOT_STATUS.CREATED);
        // todo: find and set position
        /* istanbul ignore else */
        if (sendTargetingInfoIsSet && util.isObject(JSON) && util.isFunction(JSON.stringify)) {
            util.forEachOnArray(currentGoogleSlot.getTargetingKeys(), function(index, value) {
                slot.setKeyValue(value, currentGoogleSlot.getTargeting(value));
            });
        }

        refThis.slotsMap[dmSlotName] = slot;
        // googleSlot.getSizes() returns applicable sizes as per sizemapping if we pass current available view-port width and height
        util.createVLogInfoPanel(dmSlotName, slot.getSizes(window.innerWidth, window.innerHeight));
    } else {
        /* istanbul ignore else */
        if (!isDisplayFlow) {
            refThis.slotsMap[dmSlotName].setSizes(refThis.getAdSlotSizesArray(dmSlotName, currentGoogleSlot));
        }
    }
}

/* start-test-block */
exports.storeInSlotsMap = storeInSlotsMap;
/* end-test-block */

function generateSlotName(googleSlot) { // TDD, i/o : done
    if (util.isObject(googleSlot) && util.isFunction(googleSlot.getSlotId)) {
        var slotID = googleSlot.getSlotId();
        /* istanbul ignore else */
        if (slotID && util.isFunction(slotID.getDomId)) {
            return slotID.getDomId();
        }
    }
    return "";
}

/* start-test-block */
exports.generateSlotName = generateSlotName;
/* end-test-block */

function updateSlotsMapFromGoogleSlots(googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow) { // TDD, i/o : done
    util.log("Generating slotsMap");

    util.forEachOnArray(googleSlotsArray, function(index, currentGoogleSlot) {
        var dmSlotName = refThis.generateSlotName(currentGoogleSlot);
        refThis.storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow);
        if (isDisplayFlow && util.isOwnProperty(refThis.slotsMap, dmSlotName)) {
            refThis.setDisplayFunctionCalledIfRequired(refThis.slotsMap[dmSlotName], argumentsFromCallingFunction);
        }
    });
    util.log(refThis.slotsMap);
}

/* start-test-block */
exports.updateSlotsMapFromGoogleSlots = updateSlotsMapFromGoogleSlots;
/* end-test-block */

//todo: pass slotsMap in every function that uses it
function getStatusOfSlotForDivId(divID) { // TDD, i/o : done
    /* istanbul ignore else */
    if (util.isOwnProperty(refThis.slotsMap, divID)) {
        return refThis.slotsMap[divID].getStatus();
    }
    return CONSTANTS.SLOT_STATUS.DISPLAYED;
}

/* start-test-block */
exports.getStatusOfSlotForDivId = getStatusOfSlotForDivId;
/* end-test-block */

function updateStatusAfterRendering(divID, isRefreshCall) { // TDD, i/o : done
    /* istanbul ignore else */
    if (util.isOwnProperty(refThis.slotsMap, divID)) {
        refThis.slotsMap[divID].updateStatusAfterRendering(isRefreshCall);
    }
}

/* start-test-block */
exports.updateStatusAfterRendering = updateStatusAfterRendering;
/* end-test-block */

function getSlotNamesByStatus(statusObject) { // TDD, i/o : done
    var slots = [];
    util.forEachOnObject(refThis.slotsMap, function(key, slot) {
        /* istanbul ignore else */
        if (util.isOwnProperty(statusObject, slot.getStatus())) {
            slots.push(key);
        }
    });
    return slots;
}

/* start-test-block */
exports.getSlotNamesByStatus = getSlotNamesByStatus;
/* end-test-block */

function removeDMTargetingFromSlot(key) { // TDD, i/o : done
    var currentGoogleSlot;
    var targetingMap = {};
    /* istanbul ignore else */
    if (util.isOwnProperty(refThis.slotsMap, key)) {
        currentGoogleSlot = refThis.slotsMap[key].getPubAdServerObject();
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
    }
}

/* start-test-block */
exports.removeDMTargetingFromSlot = removeDMTargetingFromSlot;
/* end-test-block */

function updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall) { // TDD : done
    util.forEachOnArray(slotNames, function(index, slotName) {
        /* istanbul ignore else */
        if (util.isOwnProperty(refThis.slotsMap, slotName)) {
            var slot = refThis.slotsMap[slotName];
            slot.setStatus(CONSTANTS.SLOT_STATUS.PARTNERS_CALLED);
            /* istanbul ignore else */
            if (isRefreshCall) {
                refThis.removeDMTargetingFromSlot(slotName);
                slot.setRefreshFunctionCalled(true);
                slot.setArguments(argumentsFromCallingFunction);
            }
        }
    });
}

/* start-test-block */
exports.updateStatusOfQualifyingSlotsBeforeCallingAdapters = updateStatusOfQualifyingSlotsBeforeCallingAdapters;
/* end-test-block */

function arrayOfSelectedSlots(slotNames) { // TDD, i/o : done
    var output = [];
    util.forEachOnArray(slotNames, function(index, slotName) {
        output.push(refThis.slotsMap[slotName]);
    });
    return output;
}

/* start-test-block */
exports.arrayOfSelectedSlots = arrayOfSelectedSlots;
/* end-test-block */

function defineWrapperTargetingKeys(object) { // TDD, i/o : done
    var output = {};
    util.forEachOnObject(object, function(key, value) {
        output[value] = "";
    });
    return output;
}
/* start-test-block */
exports.defineWrapperTargetingKeys = defineWrapperTargetingKeys;
/* end-test-block */

function findWinningBidAndApplyTargeting(divID) { // TDD, i/o : done
    var data = bidManager.getBid(divID);
    var winningBid = data.wb || null;
    var keyValuePairs = data.kvp || {};
    var wbKeyValuePairs = null;
    var googleDefinedSlot = refThis.slotsMap[divID].getPubAdServerObject();
    var ignoreTheseKeys = CONSTANTS.IGNORE_PREBID_KEYS;

    util.log("DIV: " + divID + " winningBid: ");
    util.log(winningBid);

    /* istanbul ignore else*/
    if (winningBid && winningBid.getNetEcpm() > 0) {
        refThis.slotsMap[divID].setStatus(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
        bidManager.setStandardKeys(winningBid, keyValuePairs);
    };

    
    // Hook to modify key-value-pairs generated, google-slot object is passed so that consumer can get details about the AdSlot
    // this hook is not needed in custom controller
    util.handleHook(CONSTANTS.HOOKS.POST_AUCTION_KEY_VALUES, [keyValuePairs, googleDefinedSlot]);
    if(CONFIG.isUserIdModuleEnabled() && CONFIG.getIdentityConsumers().indexOf(CONSTANTS.COMMON.GAM)>-1){
        util.setUserIdTargeting();
    }
    // attaching keyValuePairs from adapters
    util.forEachOnObject(keyValuePairs, function(key, value) {
        /* istanbul ignore else*/
        if (!util.isOwnProperty(ignoreTheseKeys, key)) {
            googleDefinedSlot.setTargeting(key, value);
            // adding key in wrapperTargetingKeys as every key added by OpenWrap should be removed before calling refresh on slot
            refThis.defineWrapperTargetingKey(key);
        }
    });
}

/* start-test-block */
exports.findWinningBidAndApplyTargeting = findWinningBidAndApplyTargeting;
/* end-test-block */


function defineWrapperTargetingKey(key) { // TDD, i/o : done
    /* istanbul ignore else */
    if (!util.isObject(refThis.wrapperTargetingKeys)) {
        refThis.wrapperTargetingKeys = {};
    }
    refThis.wrapperTargetingKeys[key] = "";
}

/* start-test-block */
exports.defineWrapperTargetingKey = defineWrapperTargetingKey;
/* end-test-block */

// Hooks related functions

function newDisableInitialLoadFunction(theObject, originalFunction) { // TDD, i/o : done
   
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        return function() {
            /* istanbul ignore next */
            disableInitialLoadIsSet = true;
            /* istanbul ignore next */
            util.log("Disable Initial Load is called");
            if(CONFIG.isIdentityOnly()){
                util.log(CONSTANTS.MESSAGES.IDENTITY.M5, " DisableInitial Load function");
                return originalFunction.apply(theObject, arguments);
            }
            /* istanbul ignore next */
            return originalFunction.apply(theObject, arguments);
        };
    } else {
        util.logError("disableInitialLoad: originalFunction is not a function");
        return null;
    }
}


/* start-test-block */
exports.newDisableInitialLoadFunction = newDisableInitialLoadFunction;
/* end-test-block */

function newEnableSingleRequestFunction(theObject, originalFunction) { // TDD, i/o : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        return function() {
            /* istanbul ignore next */
            util.log("enableSingleRequest is called");
            //addHookOnGoogletagDisplay();// todo
            /* istanbul ignore next */
            return originalFunction.apply(theObject, arguments);
        };
    } else {
        util.log("enableSingleRequest: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newEnableSingleRequestFunction = newEnableSingleRequestFunction;
/* end-test-block */

/*
    setTargeting is implemented by
        googletag.pubads().setTargeting(key, value);
            we are only intresetd in this one
    googletag.PassbackSlot.setTargeting(key, value);
        we do not care about it
    slot.setTargeting(key, value);
        we do not care, as it has a get method
*/
function newSetTargetingFunction(theObject, originalFunction) { // TDD, i/o : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        if(CONFIG.isIdentityOnly()){
            util.log(CONSTANTS.MESSAGES.IDENTITY.M5, " Original Set Targeting function");
            return function() {
	            return originalFunction.apply(theObject, arguments);
            }
        }
        else{
            return function() {
                /* istanbul ignore next */
                var arg = arguments,
                    key = arg[0] ? arg[0] : null;
                //addHookOnGoogletagDisplay();//todo
                /* istanbul ignore if */
                if (key != null) {
                    /* istanbul ignore if */
                    if (!util.isOwnProperty(GPT_targetingMap, key)) {
                        GPT_targetingMap[key] = [];
                    }
                    /* istanbul ignore next */
                    GPT_targetingMap[key] = GPT_targetingMap[key].concat(arg[1]);
                }
                /* istanbul ignore next */
                return originalFunction.apply(theObject, arguments);
            };
        }
    } else {
        util.log("setTargeting: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newSetTargetingFunction = newSetTargetingFunction;
/* end-test-block */

function newDestroySlotsFunction(theObject, originalFunction) { // TDD, i/o : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        return function() {
            var slots = arguments[0] || window.googletag.pubads().getSlots();
            /* istanbul ignore next */
            util.forEachOnArray(slots, function(index, slot) {
                delete slotsMap[refThis.generateSlotName(slot)];
            });
            /* istanbul ignore next */
            return originalFunction.apply(theObject, arguments);
        };
    } else {
        util.log("destroySlots: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newDestroySlotsFunction = newDestroySlotsFunction;
/* end-test-block */

function newAddAdUnitFunction(theObject, originalFunction) { // TDD, i/o : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        return function() {
            var adUnits = arguments[0];
            adUnits.forEach(function(adUnit){
                adUnit.bids.forEach(function(bid){
                    bid["userId"] = util.getUserIds();
                });
            });
            return originalFunction.apply(theObject, arguments);
        };
    } else {
        util.log("newAddAunitfunction: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newAddAdUnitFunction = newAddAdUnitFunction;
/* end-test-block */

function updateStatusAndCallOriginalFunction_Display(message, theObject, originalFunction, arg) { // TDD, i/o : done
    util.log(message);
    util.log(arg);
    refThis.updateStatusAfterRendering(arg[0], false);
    originalFunction.apply(theObject, arg);
}

/* start-test-block */
exports.updateStatusAndCallOriginalFunction_Display = updateStatusAndCallOriginalFunction_Display;
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

function processDisplayCalledSlot(theObject, originalFunction, arg){
    if (refThis.getStatusOfSlotForDivId(arg[0]) != CONSTANTS.SLOT_STATUS.DISPLAYED) {
        //refThis.findWinningBidAndApplyTargeting(arg[0]);
        refThis.updateStatusAndCallOriginalFunction_Display(
            "Calling original display function after timeout with arguments, ",
            theObject,
            originalFunction,
            arg
        );
    } else {
        util.log("AdSlot already rendered");
    }
}

/* start-test-block */
exports.processDisplayCalledSlot = processDisplayCalledSlot;
/* end-test-block */


function executeDisplay(timeout, divIds, callback) {
    var timeoutTicker = 0; // here we will calculate time elapsed
    var timeoutIncrementer = 10; // in ms
    var intervalId = window.setInterval(function() {
        if ( ( util.getExternalBidderStatus(divIds) && bidManager.getAllPartnersBidStatuses(window.PWT.bidMap, divIds) ) || timeoutTicker >= timeout) {
            window.clearInterval(intervalId);
            util.resetExternalBidderStatus(divIds); //Quick fix to reset flag so that the notification flow happens only once per page load            
            callback();
        }
        timeoutTicker += timeoutIncrementer;
    }, timeoutIncrementer);
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
            refThis.executeDisplay(CONFIG.getTimeout(), Object.keys(refThis.slotsMap), function() {
               util.forEachOnObject(refThis.slotsMap, function(key, slot) {
                   refThis.findWinningBidIfRequired_Display(key, slot);
               });
               refThis.processDisplayCalledSlot(theObject, originalFunction, arg);
            });
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

function newDisplayFunction(theObject, originalFunction) { // TDD, i/o : done
    // Initiating getUserConsentDataFromCMP method to get the updated consentData
    GDPR.getUserConsentDataFromCMP();

    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        if(CONFIG.isIdentityOnly()){
            util.log(CONSTANTS.MESSAGES.IDENTITY.M5, " Original Display function");
            return function() {
                if(CONFIG.isUserIdModuleEnabled() && CONFIG.getIdentityConsumers().indexOf(CONSTANTS.COMMON.GAM)>-1){
                    util.setUserIdTargeting(theObject);
                }
	            return originalFunction.apply(theObject, arguments);
            }
        }
        else{
        // Todo : change structure to take out the anonymous function for better unit test cases
            return function() {
                /* istanbul ignore next */
                util.log("In display function, with arguments: ");

            
                /* istanbul ignore next */
                util.log(arguments);
                /* istanbul ignore next */
                /* istanbul ignore if */
                if (disableInitialLoadIsSet) {
                    util.log("DisableInitialLoad was called, Nothing to do");
                    return originalFunction.apply(theObject, arguments);
                }
                /* istanbul ignore next */
                refThis.updateSlotsMapFromGoogleSlots(theObject.pubads().getSlots(), arguments, true);

                /* istanbul ignore next */
                refThis.displayFunctionStatusHandler(getStatusOfSlotForDivId(arguments[0]), theObject, originalFunction, arguments);
                var statusObj = {};
                statusObj[CONSTANTS.SLOT_STATUS.CREATED] = "";
                /* istanbul ignore next */
                // Todo: need to add reThis whilwe calling getSlotNamesByStatus
                refThis.forQualifyingSlotNamesCallAdapters(getSlotNamesByStatus(statusObj), arguments, false);
                /* istanbul ignore next */
                var divID = arguments[0];
                /* istanbul ignore next */
                setTimeout(function() {
                    util.realignVLogInfoPanel(divID);
                    bidManager.executeAnalyticsPixel();
                }, 2000 + CONFIG.getTimeout());

                //return originalFunction.apply(theObject, arguments);
            };
        }
    } else {
        util.log("display: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newDisplayFunction  = newDisplayFunction;
/* end-test-block */

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

function newAddHookOnGoogletagDisplay(localGoogletag) { // TDD, i/o : done
    if (refThis.displayHookIsAdded) {
        return;
    }
    refThis.displayHookIsAdded = true;
    util.log("Adding hook on googletag.display.");
    util.addHookOnFunction(localGoogletag, false, "display", this.newDisplayFunction);
}

/* start-test-block */
exports.newAddHookOnGoogletagDisplay = newAddHookOnGoogletagDisplay;
/* end-test-block */

function findWinningBidIfRequired_Refresh(slotName, divID, currentFlagValue) { // TDD, i/o : done
    if (util.isOwnProperty(refThis.slotsMap, slotName) && refThis.slotsMap[slotName].isRefreshFunctionCalled() === true && refThis.slotsMap[slotName].getStatus() !== CONSTANTS.SLOT_STATUS.DISPLAYED) {

        refThis.findWinningBidAndApplyTargeting(divID);
        refThis.updateStatusAfterRendering(divID, true);
        return true;
    }
    return currentFlagValue;
}

/* start-test-block */
exports.findWinningBidIfRequired_Refresh = findWinningBidIfRequired_Refresh;
/* end-test-block */

function postRederingChores(divID, dmSlot){
    // googleSlot.getSizes() returns applicable sizes as per sizemapping if we pass current available view-port width and height
    util.createVLogInfoPanel(divID, refThis.slotsMap[dmSlot].getSizes(window.innerWidth, window.innerHeight));
    util.realignVLogInfoPanel(divID);
    bidManager.executeAnalyticsPixel();
}

/* start-test-block */
exports.postRederingChores = postRederingChores;
/* end-test-block */

function postTimeoutRefreshExecution(qualifyingSlotNames, theObject, originalFunction, arg) { // TDD, i/o : done
    util.log("Executing post timeout events, arguments: ");
    util.log(arg);
    var yesCallRefreshFunction = false;
    util.forEachOnArray(qualifyingSlotNames, function(index, dmSlot) {
        var divID = refThis.slotsMap[dmSlot].getDivID();
        yesCallRefreshFunction = refThis.findWinningBidIfRequired_Refresh(dmSlot, divID, yesCallRefreshFunction);
        window.setTimeout(function() {
            refThis.postRederingChores(divID, dmSlot);
        }, 2000);
    });
    this.callOriginalRefeshFunction(yesCallRefreshFunction, theObject, originalFunction, arg);
}

/* start-test-block */
exports.postTimeoutRefreshExecution = postTimeoutRefreshExecution;
/* end-test-block */

function callOriginalRefeshFunction(flag, theObject, originalFunction, arg) { // TDD, i/o : done
    if (flag === true) {
        util.log("Calling original refresh function post timeout");
        originalFunction.apply(theObject, arg);
    } else {
        util.log("AdSlot already rendered");
    }
}

/* start-test-block */
exports.callOriginalRefeshFunction = callOriginalRefeshFunction;
/* end-test-block */

function getQualifyingSlotNamesForRefresh(arg, theObject) { // TDD, i/o : done
    var qualifyingSlotNames = [],
        slotsToConsider = [];
    // handeling case googletag.pubads().refresh(null, {changeCorrelator: false});
    slotsToConsider = arg.length == 0 || arg[0] == null ? theObject.getSlots() : arg[0];
    util.forEachOnArray(slotsToConsider, function(index, slot) {
        var slotName = refThis.generateSlotName(slot);
        if(slotName.length>0){
            qualifyingSlotNames = qualifyingSlotNames.concat(slotName);
        }
    });
    return qualifyingSlotNames;
}

/* start-test-block */
exports.getQualifyingSlotNamesForRefresh = getQualifyingSlotNamesForRefresh;
/* end-test-block */

/*
    there are many ways of calling refresh
        1. googletag.pubads().refresh([slot1]);
        2. googletag.pubads().refresh([slot1, slot2]);
        3. googletag.pubads().refresh();
        4. googletag.pubads().refresh(null, {changeCorrelator: false});
*/
function newRefreshFuncton(theObject, originalFunction) { // TDD, i/o : done // Note : not covering the function currying atm , if need be will add istanbul ignore
    // Initiating getUserConsentDataFromCMP method to get the updated consentData
    GDPR.getUserConsentDataFromCMP();

    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        if(CONFIG.isIdentityOnly()){
            util.log("Identity Only Enabled. No Process Need. Calling Original Display function");
            return function() {
                return originalFunction.apply(theObject, arguments);
            }
        }
        else{
        // var refThis = this;
            return function() {
                /* istanbul ignore next */
                util.log("In Refresh function");
            
                /* istanbul ignore next */
                refThis.updateSlotsMapFromGoogleSlots(theObject.getSlots(), arguments, false);
                /* istanbul ignore next */
                var qualifyingSlotNames = getQualifyingSlotNamesForRefresh(arguments, theObject);
                /* istanbul ignore next */
                refThis.forQualifyingSlotNamesCallAdapters(qualifyingSlotNames, arguments, true);
                /* istanbul ignore next */
                util.log("Intiating Call to original refresh function with Timeout: " + CONFIG.getTimeout() + " ms");
              
                var arg = arguments;
                refThis.executeDisplay(CONFIG.getTimeout(), qualifyingSlotNames, function() {
                    refThis.postTimeoutRefreshExecution(qualifyingSlotNames, theObject, originalFunction, arg);
                });        
            };
    } else {
        util.log("refresh: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newRefreshFuncton = newRefreshFuncton;
/* end-test-block */

function addHooks(win) { // TDD, i/o : done

    if (util.isObject(win) && util.isObject(win.googletag) && util.isFunction(win.googletag.pubads)) {
        var localGoogletag = win.googletag;

        var localPubAdsObj = localGoogletag.pubads();

        if (!util.isObject(localPubAdsObj)) {
            return false;
        }

        util.addHookOnFunction(localPubAdsObj, false, "disableInitialLoad", refThis.newDisableInitialLoadFunction);
        util.addHookOnFunction(localPubAdsObj, false, "enableSingleRequest", refThis.newEnableSingleRequestFunction);
        refThis.newAddHookOnGoogletagDisplay(localGoogletag);
        util.addHookOnFunction(localPubAdsObj, false, "refresh", refThis.newRefreshFuncton);
        util.addHookOnFunction(localPubAdsObj, false, "setTargeting", refThis.newSetTargetingFunction);
        util.addHookOnFunction(localGoogletag, false, "destroySlots", refThis.newDestroySlotsFunction);
        return true;
    } else {
        return false;
    }
}

/* start-test-block */
exports.addHooks = addHooks;
/* end-test-block */

function defineGPTVariables(win) { // TDD, i/o : done
    // define the command array if not already defined
    if (util.isObject(win)) {
        win.googletag = win.googletag || {};
        win.googletag.cmd = win.googletag.cmd || [];
        return true;
    }
    return false;
}
/* start-test-block */
exports.defineGPTVariables = defineGPTVariables;
/* end-test-block */

function addHooksIfPossible(win) { // TDD, i/o : done
    if(CONFIG.isUserIdModuleEnabled()  ){
        //TODO : Check for Prebid loaded and debug logs 
        prebid.register().sC();
        if(CONFIG.isIdentityOnly() && CONFIG.getIdentityConsumers().indexOf(CONSTANTS.COMMON.PREBID)>-1 && !util.isUndefined(win.pbjs) && !util.isUndefined(win.pbjs.que)){
            pbjs.que.unshift(function(){
                util.log("Adding Hook on pbjs.addAddUnits()");
                var theObject = window.pbjs;
                var functionName = "addAdUnits"
                util.addHookOnFunction(theObject, false, functionName, refThis.newAddAdUnitFunction);
            });
            util.log("Identity Only Enabled and setting config");
        }else{
            util.logWarning("Window.pbjs is undefined")
        }
    }
    if (util.isUndefined(win.google_onload_fired) && util.isObject(win.googletag) && util.isArray(win.googletag.cmd) && util.isFunction(win.googletag.cmd.unshift)) {
        util.log("Succeeded to load before GPT");//todo
        var refThis = this; // TODO : check whether the global refThis works here
        win.googletag.cmd.unshift(function() {
            /* istanbul ignore next */
            util.log("OpenWrap initialization started");
            /* istanbul ignore next */
            refThis.addHooks(win);
            /* istanbul ignore next */
            util.log("OpenWrap initialization completed");
        });
        return true;
    } else {
        util.logError("Failed to load before GPT");
        return false;
    }
}
/* start-test-block */
exports.addHooksIfPossible = addHooksIfPossible;
/* end-test-block */

function callJsLoadedIfRequired(win) { // TDD, i/o : done
    if (util.isObject(win) && util.isObject(win.PWT) && util.isFunction(win.PWT.jsLoaded)) {
        win.PWT.jsLoaded();
        return true;
    }
    return false;
}
/* start-test-block */
exports.callJsLoadedIfRequired = callJsLoadedIfRequired;
/* end-test-block */


function initSafeFrameListener(theWindow){ // TDD, i/o : done
    if(!theWindow.PWT.safeFrameMessageListenerAdded){
        util.addMessageEventListenerForSafeFrame(theWindow);
        theWindow.PWT.safeFrameMessageListenerAdded = true;
    }
}
/* start-test-block */
exports.initSafeFrameListener = initSafeFrameListener;
/* end-test-block */

exports.init = function(win) { // TDD, i/o : done
	CONFIG.initConfig();
    if (util.isObject(win)) {
        refThis.setWindowReference(win);
        refThis.initSafeFrameListener(win);
        refThis.wrapperTargetingKeys = refThis.defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
        refThis.defineGPTVariables(win);
        adapterManager.registerAdapters();
        refThis.addHooksIfPossible(win);
        refThis.callJsLoadedIfRequired(win);
        return true;
    } else {
        return false;
    }
};
