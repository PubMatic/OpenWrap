var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
var adapterManager = require("../adapterManager.js");
var SLOT = require("../slot.js");

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
var slotSizeMapping = {}; // key is div id
/* start-test-block */
exports.slotSizeMapping = slotSizeMapping;
/* end-test-block */
var slotsMap = {}; // key is div id, stores the mapping of divID ==> googletag.slot

/* start-test-block */
exports.slotsMap = slotsMap;
/* end-test-block */

var GPT_targetingMap = {};
var windowReference = null;

var refThis = this; 

function setWindowReference(win) { // TDD : done
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

function getAdUnitIndex(currentGoogleSlot) { // TDD : done
    var index = 0;
    try {
        var adUnitIndexString = currentGoogleSlot.getSlotId().getId().split("_");
        index = parseInt(adUnitIndexString[adUnitIndexString.length - 1]);
    } catch (ex) {} // eslint-disable-line no-empty
    return index;
}
exports.getAdUnitIndex = getAdUnitIndex;


//todo:// remove dependency of win being passed
function getSizeFromSizeMapping(divID, slotSizeMapping) {
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
    var screenWidth = util.getScreenWidth(refThis.getWindowReference());
    var screenHeight = util.getScreenHeight(refThis.getWindowReference());

    util.log(divID + ": responsiveSizeMapping found: screenWidth: " + screenWidth + ", screenHeight: " + screenHeight);
    util.log(sizeMapping);
    /* istanbul ignore else */
    if (!util.isArray(sizeMapping)) {
        return false;
    }

    for (var i = 0, l = sizeMapping.length; i < l; i++) {
        /* istanbul ignore if */
        if (sizeMapping[i].length == 2 && sizeMapping[i][0].length == 2) {
            var currentWidth = sizeMapping[i][0][0],
                currentHeight = sizeMapping[i][0][1];

            /* istanbul ignore if */
            if (screenWidth >= currentWidth && screenHeight >= currentHeight) {
                /* istanbul ignore if */
                if (sizeMapping[i][1].length != 0 && !util.isArray(sizeMapping[i][1][0])) {
                    /* istanbul ignore if */
                    if (sizeMapping[i][1].length == 2 && util.isNumber(sizeMapping[i][1][0]) && util.isNumber(sizeMapping[i][1][1])) {
                        return [sizeMapping[i][1]];
                    } else {
                        util.log(divID + ": Unsupported mapping template.");
                        util.log(sizeMapping);
                    }
                }
                return sizeMapping[i][1];
            }
        }
    }

    return false;
}

/* start-test-block */
exports.getSizeFromSizeMapping = getSizeFromSizeMapping;
/* end-test-block */

function getAdSlotSizesArray(divID, currentGoogleSlot) { // TDD : done
    var sizeMapping = refThis.getSizeFromSizeMapping(divID, refThis.slotSizeMapping);

    if (sizeMapping !== false) {
        util.log(divID + ": responsiveSizeMapping applied: ");
        util.log(sizeMapping);
        return sizeMapping;
    }
    var adslotSizesArray = [];
    /* istanbul ignore else  */
    if (util.isFunction(currentGoogleSlot.getSizes)) {
        util.forEachOnArray(currentGoogleSlot.getSizes(), function(index, sizeObj) {
            /* istanbul ignore else  */
            if (util.isFunction(sizeObj.getWidth) && util.isFunction(sizeObj.getHeight)) {
                adslotSizesArray.push([sizeObj.getWidth(), sizeObj.getHeight()]);
            } else {
                util.log(divID + ", size object does not have getWidth and getHeight method. Ignoring: ");
                util.log(sizeObj);
            }
        });
    }

    return adslotSizesArray;
}

/* start-test-block */
exports.getAdSlotSizesArray = getAdSlotSizesArray;
/* end-test-block */

function setDisplayFunctionCalledIfRequired(slot, arg) { // TDD : done
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

function storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow) {
    // note: here dmSlotName is actually the DivID
    if (!util.isOwnProperty(slotsMap, dmSlotName)) {

        var slot = SLOT.createSlot(dmSlotName);
        slot
            .setDivID(dmSlotName)
            .setPubAdServerObject(currentGoogleSlot)
            .setAdUnitID(currentGoogleSlot.getAdUnitPath())
            .setAdUnitIndex(getAdUnitIndex(currentGoogleSlot))
            .setSizes(getAdSlotSizesArray(dmSlotName, currentGoogleSlot))
            .setStatus(CONSTANTS.SLOT_STATUS.CREATED);
        // todo: find and set position

        if (sendTargetingInfoIsSet && util.isObject(JSON) && util.isFunction(JSON.stringify)) {
            util.forEachOnArray(currentGoogleSlot.getTargetingKeys(), function(index, value) {
                slot.setKeyValue(value, currentGoogleSlot.getTargeting(value));
            });
        }

        slotsMap[dmSlotName] = slot;
        util.createVLogInfoPanel(dmSlotName, slot.getSizes());
    } else {
        if (!isDisplayFlow) {
            slotsMap[dmSlotName].setSizes(getAdSlotSizesArray(dmSlotName, currentGoogleSlot));
        }
    }
}

/* start-test-block */
exports.storeInSlotsMap = storeInSlotsMap;
/* end-test-block */

function generateSlotName(googleSlot) {
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

function updateSlotsMapFromGoogleSlots(googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow) {
    util.log("Generating slotsMap");
    // var refThis = this;
    util.forEachOnArray(googleSlotsArray, function(index, currentGoogleSlot) {
        var dmSlotName = generateSlotName(currentGoogleSlot);
        storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow);
        if (isDisplayFlow && util.isOwnProperty(slotsMap, dmSlotName)) {
            setDisplayFunctionCalledIfRequired(slotsMap[dmSlotName], argumentsFromCallingFunction);
        }
    });
    util.log(slotsMap);
}

/* start-test-block */
exports.updateSlotsMapFromGoogleSlots = updateSlotsMapFromGoogleSlots;
/* end-test-block */

//todo: pass slotsMap in every function that uses it
function getStatusOfSlotForDivId(divID) { // TDD : done
    /* istanbul ignore else */
    if (util.isOwnProperty(refThis.slotsMap, divID)) {
        return refThis.slotsMap[divID].getStatus();
    }
    return CONSTANTS.SLOT_STATUS.DISPLAYED;
}

/* start-test-block */
exports.getStatusOfSlotForDivId = getStatusOfSlotForDivId;
/* end-test-block */

function updateStatusAfterRendering(divID, isRefreshCall) {
    /* istanbul ignore else */
    if (util.isOwnProperty(slotsMap, divID)) {
        slotsMap[divID].updateStatusAfterRendering(isRefreshCall);
    }
}

/* start-test-block */
exports.updateStatusAfterRendering = updateStatusAfterRendering;
/* end-test-block */

function getSlotNamesByStatus(statusObject) { // TDD : done
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

function removeDMTargetingFromSlot(key) { // TDD : done
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
            currentGoogleSlot.setTargeting(key, value);
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

function arrayOfSelectedSlots(slotNames) { // TDD : done
    var output = [];
    util.forEachOnArray(slotNames, function(index, slotName) {
        output.push(refThis.slotsMap[slotName]);
    });
    return output;
}

/* start-test-block */
exports.arrayOfSelectedSlots = arrayOfSelectedSlots;
/* end-test-block */

function defineWrapperTargetingKeys(object) { // TDD : done
    var output = {};
    util.forEachOnObject(object, function(key, value) {
        output[value] = "";
    });
    return output;
}
/* start-test-block */
exports.defineWrapperTargetingKeys = defineWrapperTargetingKeys;
/* end-test-block */

function findWinningBidAndApplyTargeting(divID) {
    var data = bidManager.getBid(divID);
    var winningBid = data.wb || null;
    var keyValuePairs = data.kvp || null;
    var googleDefinedSlot = slotsMap[divID].getPubAdServerObject();
    var ignoreTheseKeys = CONSTANTS.IGNORE_PREBID_KEYS;

    util.log("DIV: " + divID + " winningBid: ");    
    util.log(winningBid);

    if (winningBid && winningBid.getNetEcpm() > 0) {
        slotsMap[divID].setStatus(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID, winningBid.getBidID());
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS, winningBid.getStatus());
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM, winningBid.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));        
        //todo: there was a check for a dealID value exists, is it required now ?, we are setting it empty string by default
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID, winningBid.getDealID());
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID, winningBid.getAdapterID());
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID, CONFIG.getPublisherId());
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID, CONFIG.getProfileID());
        googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID, CONFIG.getProfileDisplayVersionID());
    }
    // var refThis = this;
    // attaching keyValuePairs from adapters    
    util.forEachOnObject(keyValuePairs, function(key, value) {
        if (!util.isOwnProperty(ignoreTheseKeys, key)) {
            googleDefinedSlot.setTargeting(key, value);
            // adding key in wrapperTargetingKeys as every key added by OpenWrap should be removed before calling refresh on slot
            defineWrapperTargetingKey(key);
        }
    });
}

/* start-test-block */
exports.findWinningBidAndApplyTargeting = findWinningBidAndApplyTargeting;
/* end-test-block */


function defineWrapperTargetingKey(key) { // TDD : done
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

function newDisableInitialLoadFunction(theObject, originalFunction) { // TDD : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        return function() {
            /* istanbul ignore next */
            disableInitialLoadIsSet = true;
            /* istanbul ignore next */
            util.log("Disable Initial Load is called");
            /* istanbul ignore next */
            return originalFunction.apply(theObject, arguments);
        };
    } else {
        util.log("disableInitialLoad: originalFunction is not a function");
        return null;
    }
}


/* start-test-block */
exports.newDisableInitialLoadFunction = newDisableInitialLoadFunction;
/* end-test-block */

function newEnableSingleRequestFunction(theObject, originalFunction) { // TDD : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        return function() {
            /* istanbul ignore next */
            util.log("enableSingleRequest is called");
            //addHookOnGoogletagDisplay();// todo
            /* istanbul ignore next */
            return originalFunction.apply(theObject, arguments);
        };
    } else {
        util.log("disableInitialLoad: originalFunction is not a function");
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
function newSetTargetingFunction(theObject, originalFunction) { // TDD : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
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
    } else {
        util.log("setTargeting: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newSetTargetingFunction = newSetTargetingFunction;
/* end-test-block */

function newDestroySlotsFunction(theObject, originalFunction) { // TDD : done
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

function updateStatusAndCallOriginalFunction_Display(message, theObject, originalFunction, arg) { // TDD : done
    util.log(message);
    util.log(arg);
    refThis.updateStatusAfterRendering(arg[0], false);
    originalFunction.apply(theObject, arg);
}

/* start-test-block */
exports.updateStatusAndCallOriginalFunction_Display = updateStatusAndCallOriginalFunction_Display;
/* end-test-block */

function findWinningBidIfRequired_Display(key, slot) { // TDD : done
    var status = slot.getStatus();
    if (status != CONSTANTS.SLOT_STATUS.DISPLAYED && status != CONSTANTS.SLOT_STATUS.TARGETING_ADDED) {
        refThis.findWinningBidAndApplyTargeting(key);
    }
}


/* start-test-block */
exports.findWinningBidIfRequired_Display = findWinningBidIfRequired_Display;
/* end-test-block */

function displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg) { // TDD : done
    switch (oldStatus) {
        // display method was called for this slot
        /* istanbul ignore next */
        case CONSTANTS.SLOT_STATUS.CREATED:
            // dm flow is already intiated for this slot
            // just intitate the CONFIG.getTimeout() now
            // eslint-disable-line no-fallthrough
        /* istanbul ignore next */
        case CONSTANTS.SLOT_STATUS.PARTNERS_CALLED:
            // var refThis = this;
            // TODO : ignore istanbul or extract function and add TDD ?
            window.setTimeout(function() {

                util.log("PostTimeout.. back in display function");
                util.forEachOnObject(refThis.slotsMap, function(key, slot) {
                    refThis.findWinningBidIfRequired_Display(key, slot);
                });

                //move this into a function
                if (refThis.getStatusOfSlotForDivId(arg[0]) != CONSTANTS.SLOT_STATUS.DISPLAYED) {
                    refThis.updateStatusAndCallOriginalFunction_Display(
                        "Calling original display function after timeout with arguments, ",
                        theObject,
                        originalFunction,
                        arg
                    );
                } else {
                    util.log("AdSlot already rendered");
                }

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

function forQualifyingSlotNamesCallAdapters(qualifyingSlotNames, arg, isRefreshCall) { // TDD : done
    if (qualifyingSlotNames.length > 0) {
        refThis.updateStatusOfQualifyingSlotsBeforeCallingAdapters(qualifyingSlotNames, arg, isRefreshCall);
        var qualifyingSlots = refThis.arrayOfSelectedSlots(qualifyingSlotNames);
        adapterManager.callAdapters(qualifyingSlots);
    }
}

/* start-test-block */
exports.forQualifyingSlotNamesCallAdapters = forQualifyingSlotNamesCallAdapters;
/* end-test-block */

function newDisplayFunction(theObject, originalFunction) { // TDD : done 
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        // var refThis = this;
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

function newAddHookOnGoogletagDisplay(localGoogletag) { // TDD : done
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

function findWinningBidIfRequired_Refresh(slotName, divID, currentFlagValue) {
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

function postTimeoutRefreshExecution(qualifyingSlotNames, theObject, originalFunction, arg) { // TDD : done
    util.log("Executing post timeout events, arguments: ");
    util.log(arg);
    var yesCallRefreshFunction = false;
    util.forEachOnArray(qualifyingSlotNames, function(index, dmSlot) {
        var divID = refThis.slotsMap[dmSlot].getDivID();
        yesCallRefreshFunction = refThis.findWinningBidIfRequired_Refresh(dmSlot, divID, yesCallRefreshFunction);
        window.setTimeout(function() {
            /* istanbul ignore next */
            util.createVLogInfoPanel(divID, refThis.slotsMap[dmSlot].getSizes());
            /* istanbul ignore next */
            util.realignVLogInfoPanel(divID);  
        }, 2000 + CONFIG.getTimeout());
    });
    bidManager.executeAnalyticsPixel();
    this.callOriginalRefeshFunction(yesCallRefreshFunction, theObject, originalFunction, arg);
}

/* start-test-block */
exports.postTimeoutRefreshExecution = postTimeoutRefreshExecution;
/* end-test-block */

function callOriginalRefeshFunction(flag, theObject, originalFunction, arg) { // TDD : done
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

function getQualifyingSlotNamesForRefresh(arg, theObject) { // TDD : done
    var qualifyingSlotNames = [],
        slotsToConsider = [];
    // handeling case googletag.pubads().refresh(null, {changeCorrelator: false});
    slotsToConsider = arg.length == 0 || arg[0] == null ? theObject.getSlots() : arg[0];
    util.forEachOnArray(slotsToConsider, function(index, slot) {
        var slotName = refThis.generateSlotName(slot);
        if(slotName.length>0){
            qualifyingSlotNames = qualifyingSlotNames.concat();
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
function newRefreshFuncton(theObject, originalFunction) { // TDD : done // Note : not covering the function currying atm , if need be will add istanbul ignore
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
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
            /* istanbul ignore next */
            setTimeout(function() {
                refThis.postTimeoutRefreshExecution(qualifyingSlotNames, theObject, originalFunction, arg);
            }, CONFIG.getTimeout());
            //return originalFunction.apply(theObject, arguments);
        };
    } else {
        util.log("refresh: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newRefreshFuncton = newRefreshFuncton;
/* end-test-block */

function newSizeMappingFunction(theObject, originalFunction) { // TDD : done
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        return function() {
            /* istanbul ignore next */
            slotSizeMapping[refThis.generateSlotName(this)] = arguments[0];
            /* istanbul ignore next */
            return originalFunction.apply(this, arguments);
        };
    } else {
        util.log("newSizeMappingFunction: originalFunction is not a function");
        return null;
    }
}

/* start-test-block */
exports.newSizeMappingFunction = newSizeMappingFunction;
/* end-test-block */

// slot.defineSizeMapping
function addHookOnSlotDefineSizeMapping(localGoogletag) { // TDD : done
    if (util.isObject(localGoogletag) && util.isFunction(localGoogletag.defineSlot)) {
        var s1 = localGoogletag.defineSlot("/Harshad", [
            [728, 90]
        ], "Harshad-02051986");
        if (s1) {
            util.addHookOnFunction(s1, true, "defineSizeMapping", refThis.newSizeMappingFunction);
            localGoogletag.destroySlots([s1]);
            return true;
        }
    }
    return false;
}

/* start-test-block */
exports.addHookOnSlotDefineSizeMapping = addHookOnSlotDefineSizeMapping;
/* end-test-block */

function addHooks(win) { // TDD : done

    if (util.isObject(win) && util.isObject(win.googletag) && util.isFunction(win.googletag.pubads)) {
        var localGoogletag = win.googletag;
        
        var localPubAdsObj = localGoogletag.pubads();
        
        if (!util.isObject(localPubAdsObj)) {
            return false;
        }

        refThis.addHookOnSlotDefineSizeMapping(localGoogletag);
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

function defineGPTVariables(win) { // TDD : done
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

function addHooksIfPossible(win) { // TDD : done
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
        util.log("Failed to load before GPT");
        return false;
    }
}
/* start-test-block */
exports.addHooksIfPossible = addHooksIfPossible;
/* end-test-block */

function callJsLoadedIfRequired(win) { // TDD : done
    if (util.isObject(win) && util.isObject(win.PWT) && util.isFunction(win.PWT.jsLoaded)) {
        win.PWT.jsLoaded();
        return true;
    }
    return false;
}
/* start-test-block */
exports.callJsLoadedIfRequired = callJsLoadedIfRequired;
/* end-test-block */


function initSafeFrameListener(theWindow){
    if(!theWindow.PWT.safeFrameMessageListenerAdded){
        util.addMessageEventListenerForSafeFrame(theWindow);
        theWindow.PWT.safeFrameMessageListenerAdded = true;
    }
}
/* start-test-block */
exports.initSafeFrameListener = initSafeFrameListener;
/* end-test-block */

exports.init = function(win) { // TDD : done
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
