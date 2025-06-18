var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
// var GDPR = require("../gdpr.js");
var SLOT = require("../slot.js");
var prebid = require("../adapters/prebid.js");
var usePrebidKeys = CONFIG.isUsePrebidKeysEnabled();
var isPrebidPubMaticAnalyticsEnabled = CONFIG.isPrebidPubMaticAnalyticsEnabled();
var IdHub = require("../controllers/idhub.js");
var consentConfigResolver = require('../modules/consentConfigResolver.js');

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

    window.PWT.adUnits = window.PWT.adUnits || {};
    Object.keys(refThis.slotsMap).forEach(function(key){
        var activeSlot = refThis.slotsMap[key];
        window.PWT.adUnits[activeSlot.divID] = {
            divID : activeSlot.divID,
            adUnitId : activeSlot.adUnitID,
            mediaTypes : util.getAdUnitConfig(activeSlot.sizes, activeSlot).mediaTypeObject
        }
    });

    util.log(refThis.slotsMap);
}

/* start-test-block */
exports.updateSlotsMapFromGoogleSlots = updateSlotsMapFromGoogleSlots;
/* end-test-block */

//todo: pass slotsMap in every function that uses it
function getStatusOfSlotForDivId(divID) { // TDD, i/o : done
    if (typeof divID == "object" && typeof(divID.getSlotId) == "function") {
        if(typeof(divID.getSlotId().getDomId) == "function"){
            divID  = divID.getSlotId().getDomId();
        }
    }
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
        if(CONFIG.shouldClearTargeting()){
            currentGoogleSlot.clearTargeting();
        }
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

function findWinningBidAndApplyTargeting(divID, parentArgs) { // TDD, i/o : done
    var data; 
	if (isPrebidPubMaticAnalyticsEnabled){
		data = prebid.getBid(divID);
	} else {
        data = bidManager.getBid(divID);
    }
    var winningBid = data.wb || null;
    var keyValuePairs = data.kvp || {};
    var googleDefinedSlot = refThis.slotsMap[divID].getPubAdServerObject();
	var ignoreTheseKeys = !usePrebidKeys ? CONSTANTS.IGNORE_PREBID_KEYS : {};

    util.log("DIV: " + divID + " winningBid: ");
    util.log(winningBid);

    /* istanbul ignore else*/
        if (isPrebidPubMaticAnalyticsEnabled === false && winningBid && winningBid.getNetEcpm() > 0) {
            refThis.slotsMap[divID].setStatus(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
            bidManager.setStandardKeys(winningBid, keyValuePairs);
        };
    
    // Hook to modify key-value-pairs generated, google-slot object is passed so that consumer can get details about the AdSlot
    // this hook is not needed in custom controller
    if(!parentArgs || (parentArgs && parentArgs[0] == divID)) {
        util.handleHook(CONSTANTS.HOOKS.POST_AUCTION_KEY_VALUES, [keyValuePairs, googleDefinedSlot]);
    }
    // attaching keyValuePairs from adapters
    util.forEachOnObject(keyValuePairs, function(key, value) {
        if (!CONFIG.getSendAllBidsStatus() && winningBid && winningBid.adapterID !== "pubmatic" && util.isOwnProperty({"hb_buyid_pubmatic":1,"pwtbuyid_pubmatic":1}, key)) {
			delete keyValuePairs[key];
		}
        /* istanbul ignore else*/
        else if (!util.isOwnProperty(ignoreTheseKeys, key)) {
            googleDefinedSlot.setTargeting(key, value);
            // adding key in wrapperTargetingKeys as every key added by OpenWrap should be removed before calling refresh on slot
            refThis.defineWrapperTargetingKey(key);
        }
    });
    util.forEachOnObject(util.getCDSTargetingData(), function(key, value) {
        window.googletag &&
        window.googletag.pubads().setTargeting(key, value);
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
            util.updateAdUnits(adUnits);
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

function findWinningBidIfRequired_Display(key, slot, parentArgs) { // TDD, i/o : done
    var status = slot.getStatus();
    if (status != CONSTANTS.SLOT_STATUS.DISPLAYED && status != CONSTANTS.SLOT_STATUS.TARGETING_ADDED) {
        refThis.findWinningBidAndApplyTargeting(key, parentArgs);
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
    function executeDisplayPostConsentProcess() {
        var timeoutTicker = 0; // here we will calculate time elapsed
        var timeoutIncrementer = 10; // in ms        
        var intervalId = window.setInterval(function () {
            if ((util.getExternalBidderStatus(divIds) && bidManager.getAllPartnersBidStatuses(window.PWT.bidMap, divIds))
                || timeoutTicker >= timeout) {
                window.clearInterval(intervalId);
                util.resetExternalBidderStatus(divIds); //Quick fix to reset flag so that the notification flow happens only once per page load            
                callback();
            }
            timeoutTicker += timeoutIncrementer;
        }, timeoutIncrementer);
    }
    consentConfigResolver.getInstance().getProcessCompleted(executeDisplayPostConsentProcess);
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
                   refThis.findWinningBidIfRequired_Display(key, slot, arg);
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
        // new approach without adapter-manager
        prebid.fetchBids(qualifyingSlots);
    }
}

/* start-test-block */
exports.forQualifyingSlotNamesCallAdapters = forQualifyingSlotNamesCallAdapters;
/* end-test-block */

function newDisplayFunction(theObject, originalFunction) { // TDD, i/o : done
    // Initiating getUserConsentDataFromCMP method to get the updated consentData
    // GDPR.getUserConsentDataFromCMP();
  
    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        if(CONFIG.isIdentityOnly()){
            util.log(CONSTANTS.MESSAGES.IDENTITY.M5, " Original Display function");
            return function() {
                return originalFunction.apply(theObject, arguments);
            }
        } 
        else{
            // Todo : change structure to take out the anonymous function for better unit test cases
            return function() {

                if (disableInitialLoadIsSet) {
                    util.log("DisableInitialLoad was called, Nothing to do");
                    return originalFunction.apply(theObject, arguments);
                }

                if(!CONFIG.isSRAEnabled() && CONFIG.isAuctionLazyLoadingEnabled()) {
                    var targetSlotId = arguments[0];
                   
                    function checkAndExecute() {
                        if(targetSlotId) {
                            var element = document.getElementById(targetSlotId);
                            if(element && util.isElementInViewport(element)) {
                                executeDisplay(targetSlotId);
                                window.removeEventListener("scroll", throttledScrollHandler);
                            }
                        }
                    }
                    var throttledScrollHandler = util.throttle(checkAndExecute, 300);
                    // Initial check in case some elements are already in view
                    checkAndExecute();
                    window.addEventListener("scroll", throttledScrollHandler);
                } else {
                    // If lazy loading is not enabled, run task immediately
                    executeDisplay(arguments[0]);
                }
            };
        }
    } else {
        util.log("display: originalFunction is not a function");
        return null;
    }
    function executeDisplay(id){
     var slots = googletag.pubads().getSlots();
     var specificSlot = slots.filter(function(slot) { return slot.getSlotElementId() === id; });
     /* istanbul ignore next */
     refThis.updateSlotsMapFromGoogleSlots(specificSlot, arguments, true);
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
     setTimeout(function () {
       util.realignVLogInfoPanel(divID);
       bidManager.executeAnalyticsPixel();
     }, 2000 + CONFIG.getTimeout());
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
    // For lazy loading, we need to ensure DFP calls are made
    if (CONFIG.isAuctionLazyLoadingEnabled()) {
        if (util.isOwnProperty(refThis.slotsMap, slotName)) {
            // Always apply targeting for lazy load refresh
            refThis.findWinningBidAndApplyTargeting(divID);
            
            if (refThis.slotsMap[slotName].isRefreshFunctionCalled() === true && 
                refThis.slotsMap[slotName].getStatus() !== CONSTANTS.SLOT_STATUS.DISPLAYED) {
                refThis.updateStatusAfterRendering(divID, true);
            }
            
            // Always return true for lazy load to ensure DFP calls are made
            return true;
        }
    } else {
        // Original behavior for non-lazy loading
        if (util.isOwnProperty(refThis.slotsMap, slotName) && 
            refThis.slotsMap[slotName].isRefreshFunctionCalled() === true && 
            refThis.slotsMap[slotName].getStatus() !== CONSTANTS.SLOT_STATUS.DISPLAYED) {
            
            refThis.findWinningBidAndApplyTargeting(divID);
            refThis.updateStatusAfterRendering(divID, true);
            return true;
        }
    }
    return currentFlagValue;
}

/* start-test-block */
exports.findWinningBidIfRequired_Refresh = findWinningBidIfRequired_Refresh;
/* end-test-block */

function postRederingChores(divID, dmSlot){
    // googleSlot.getSizes() returns applicable sizes as per sizemapping if we pass current available view-port width and height
    const slot = refThis.slotsMap[dmSlot];
    if(slot) {
        util.createVLogInfoPanel(divID, slot.getSizes(window.innerWidth, window.innerHeight));
    } else {
        util.log("Could not find slot in postRederingChores");
    }
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
    
    // Get the googleSlotMap from arg if available
    var googleSlotMap = arg.googleSlotMap || {};
    
    // Prepare slots for DFP call
    var slotsForDfp = [];
    
    // For lazy loading, we need to ensure we process all slots properly and DFP calls are made
    if (CONFIG.isAuctionLazyLoadingEnabled()) {
        // Always set yesCallRefreshFunction to true for lazy loading to ensure DFP calls
        yesCallRefreshFunction = true;
        
        // In lazy loading, qualifyingSlotNames already contains only slots in viewport
        util.forEachOnArray(qualifyingSlotNames, function(index, dmSlot) {
            var divID = refThis.slotsMap[dmSlot] && refThis.slotsMap[dmSlot].getDivID();
            if(divID) {
                // Apply targeting and update status
                refThis.findWinningBidAndApplyTargeting(divID);
                
                // Update status if needed
                if (refThis.slotsMap[dmSlot].isRefreshFunctionCalled() === true && 
                    refThis.slotsMap[dmSlot].getStatus() !== CONSTANTS.SLOT_STATUS.DISPLAYED) {
                    refThis.updateStatusAfterRendering(divID, true);
                }
                
                // Get the Google slot object from our map
                if (googleSlotMap[divID]) {
                    slotsForDfp.push(googleSlotMap[divID]);
                    util.log("Added slot " + divID + " to DFP refresh list");
                } else {
                    util.log("Warning: Could not find Google slot object for " + divID);
                }
                
                // Schedule post rendering chores
                window.setTimeout(function() {
                    refThis.postRederingChores(divID, dmSlot);
                }, 2000);
            } else {
                util.log("Could not find divID");
            }
        });
        
        // Create a new arg with the proper slots for DFP
        if (slotsForDfp.length > 0) {
            // Create a new arguments object with the proper slots
            var newArg = [];
            newArg.push(slotsForDfp); // First argument is the array of slots
            
            // Copy any additional arguments
            if (arg.length > 1) {
                for (var i = 1; i < arg.length; i++) {
                    newArg.push(arg[i]);
                }
            }
            
            // Use the new arguments for DFP call
            arg = newArg;
            util.log("Created new arguments with " + slotsForDfp.length + " slots for DFP");
        } else {
            util.log("No valid slots found for DFP refresh");
        }
    } else {
        // Original behavior for non-lazy loading
        util.forEachOnArray(qualifyingSlotNames, function(index, dmSlot) {
            var divID = refThis.slotsMap[dmSlot] && refThis.slotsMap[dmSlot].getDivID();
            if(divID) {
                yesCallRefreshFunction = refThis.findWinningBidIfRequired_Refresh(dmSlot, divID, yesCallRefreshFunction);
                window.setTimeout(function() {
                    refThis.postRederingChores(divID, dmSlot);
                }, 2000);
            } else {
                util.log("Could not find divID");
            }
        });
    }
    
    util.log("Calling original refresh function with flag: " + yesCallRefreshFunction);
    
    // Call the original refresh function with the appropriate arguments
    this.callOriginalRefeshFunction(yesCallRefreshFunction, theObject, originalFunction, arg);
}

/* start-test-block */
exports.postTimeoutRefreshExecution = postTimeoutRefreshExecution;
/* end-test-block */

function callOriginalRefeshFunction(shouldCallRefresh, theObject, originalFunction, arg) { 
    
    // For lazy loading, we need to ensure DFP calls are consistent
    if (CONFIG.isAuctionLazyLoadingEnabled()) {
        // Always set flag to true for lazy loading to ensure DFP calls are made
        flag = true;
        
        // Case 1: No specific slots provided (refresh all)
        if (!arg[0]) {
            util.log("Lazy loading refresh - no specific slots provided");
            // Get all slots from googletag
            var allGoogleSlots = [];
            try {
                if (theObject && typeof theObject.getSlots === 'function') {
                    allGoogleSlots = theObject.getSlots() || [];
                    util.log("Got " + allGoogleSlots.length + " slots from googletag");
                } else {
                    util.log("Error: theObject does not have getSlots function");
                }
            } catch(e) {
                util.log("Error getting slots from googletag: " + e);
            }
            
            var slotsInViewport = [];
            
            // Filter to only include slots that are in viewport
            util.forEachOnArray(allGoogleSlots, function(index, slot) {
                try {
                    if (slot && typeof slot.getSlotElementId === 'function') {
                        var elementId = slot.getSlotElementId();
                        var element = document.getElementById(elementId);
                        
                        // Only include slots that are in viewport
                        if (element && util.isElementInViewport(element)) {
                            slotsInViewport.push(slot);
                        }
                    } else {
                        util.log("Warning: slot at index " + index + " does not have getSlotElementId function");
                    }
                } catch(e) {
                    util.log("Error processing slot at index " + index + ": " + e);
                }
            });
            
            // Only call DFP if we have slots in viewport
            if (slotsInViewport.length > 0) {
                util.log("Calling DFP refresh for " + slotsInViewport.length + " slots in viewport");
                // Create new arguments array with filtered slots
                var newArgs = [slotsInViewport];
                if (arg.length > 1) {
                    for (var i = 1; i < arg.length; i++) {
                        newArgs.push(arg[i]);
                    }
                }
                originalFunction.apply(theObject, newArgs);
            } else {
                util.log("No slots in viewport to refresh for DFP");
            }
            return; // Exit early
        }
        
        // Case 2: Specific slots provided
        if (arg[0] && util.isArray(arg[0])) {
            util.log("Lazy loading refresh - specific slots provided");
            var allSlots = arg[0];
            var slotsToRefresh = [];
            
            // Filter to only include slots that are in viewport
            util.forEachOnArray(allSlots, function(index, slot) {
                try {
                    if (slot && typeof slot.getSlotElementId === 'function') {
                        var elementId = slot.getSlotElementId();
                        var element = document.getElementById(elementId);
                        
                        // Only include slots that are in viewport
                        if (element && util.isElementInViewport(element)) {
                            slotsToRefresh.push(slot);
                        }
                    } else {
                        util.log("Warning: specific slot at index " + index + " does not have getSlotElementId function");
                    }
                } catch(e) {
                    util.log("Error processing specific slot at index " + index + ": " + e);
                }
            });
            
            // Only call DFP if we have slots in viewport
            if (slotsToRefresh.length > 0) {
                util.log("Calling DFP refresh for " + slotsToRefresh.length + " specific slots in viewport");
                // Create new arguments array with filtered slots
                var newArg = [];
                for (var i = 0; i < arg.length; i++) {
                    if (i === 0) {
                        newArg.push(slotsToRefresh);
                    } else {
                        newArg.push(arg[i]);
                    }
                }
                originalFunction.apply(theObject, newArg);
            } else {
                util.log("No specific slots in viewport to refresh for DFP");
            }
            return; // Exit early
        }
    }
    
    // Standard behavior for non-lazy loading or unhandled cases
    if (shouldCallRefresh) {
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
    // GDPR.getUserConsentDataFromCMP();

    if (util.isObject(theObject) && util.isFunction(originalFunction)) {
        if(CONFIG.isIdentityOnly()){
            util.log("Identity Only Enabled. No Process Need. Calling Original Display function");
            return function() {
                return originalFunction.apply(theObject, arguments);
            }
        }
        else{
            return function() {
                util.log("In Refresh function");
                
                // If disableInitialLoad was called, just pass through
                if (disableInitialLoadIsSet) {
                    util.log("DisableInitialLoad was called, Nothing to do");
                    return originalFunction.apply(theObject, arguments);
                }
                
                // Update slots map from Google slots
                refThis.updateSlotsMapFromGoogleSlots(theObject.getSlots(), arguments, false);
                
                // Get qualifying slot names for refresh
                var qualifyingSlotNames = getQualifyingSlotNamesForRefresh(arguments, theObject);
                
                // Check if lazy loading should be applied
                if(!CONFIG.isSRAEnabled() && CONFIG.isAuctionLazyLoadingEnabled()) {
                    // Get the slots that need to be refreshed
                    var slotsToRefresh = arguments[0] && util.isArray(arguments[0]) ? arguments[0] : theObject.getSlots();
                    
                    // Create a function to check and execute refresh for slots in viewport
                    function checkAndExecuteRefresh() {
                        var slotsInViewport = [];
                        var remainingSlots = [];
                        
                        // Check which slots are in viewport
                        util.forEachOnArray(slotsToRefresh, function(index, slot) {
                            if (util.isFunction(slot.getSlotElementId)) {
                                var elementId = slot.getSlotElementId();
                                var element = document.getElementById(elementId);
                                
                                if (element && util.isElementInViewport(element)) {
                                    slotsInViewport.push(slot);
                                } else if (element) {
                                    remainingSlots.push(slot);
                                }
                            }
                        });
                        
                        // If there are slots in viewport, refresh them
                        if (slotsInViewport.length > 0) {
                            // Create a filtered list of qualifying slot names that are in viewport
                            var slotsInViewportNames = [];
                            
                            // Map Google slots to their element IDs for quick lookup
                            var slotIdMap = {};
                            util.forEachOnArray(slotsInViewport, function(index, slot) {
                                if (util.isFunction(slot.getSlotElementId)) {
                                    slotIdMap[slot.getSlotElementId()] = true;
                                }
                            });
                            
                            // Filter qualifying slot names to only include those in viewport
                            util.forEachOnArray(qualifyingSlotNames, function(index, slotName) {
                                var slot = refThis.slotsMap[slotName];
                                if (slot && util.isFunction(slot.getDivID)) {
                                    var divId = slot.getDivID();
                                    if (slotIdMap[divId]) {
                                        slotsInViewportNames.push(slotName);
                                    }
                                }
                            });
                            
                            // Create a new arguments array with only the slots in viewport
                            var viewportArgs = Array.prototype.slice.call(arguments);
                            viewportArgs[0] = slotsInViewport;
                            
                            // Execute refresh for slots in viewport
                            executeRefresh(slotsInViewportNames, viewportArgs);
                            
                            // If no more slots to track, remove event listeners
                            if (remainingSlots.length === 0) {
                                window.removeEventListener("scroll", throttledScrollHandler);
                                window.removeEventListener("resize", throttledScrollHandler);
                            } else {
                                // Update slotsToRefresh for next scroll check
                                slotsToRefresh = remainingSlots;
                            }
                        }
                    }
                    
                    // Create throttled scroll handler
                    var throttledScrollHandler = util.throttle(checkAndExecuteRefresh, 300);
                    
                    // Initial check in case some elements are already in view
                    checkAndExecuteRefresh();
                    
                    // Add scroll listener if we need to track more slots
                    if (slotsToRefresh.length > 0) {
                        window.addEventListener("scroll", throttledScrollHandler);
                    }
                } else {
                    // If lazy loading is not enabled or SRA is enabled, refresh all slots
                    executeRefresh(qualifyingSlotNames, arguments);
                }
            };
        }
    } else {
        util.log("refresh: originalFunction is not a function");
        return null;
    }
    
    // Helper function to execute refresh for given slots
    function executeRefresh(slotNames, args) {
        util.log("Executing refresh for slots: " + (slotNames ? slotNames.join(", ") : "none"));
        
        // Make translator calls
        refThis.forQualifyingSlotNamesCallAdapters(slotNames, args, true);
        
        // Execute DFP calls after timeout
        util.log("Initiating Call to original refresh function with Timeout: " + CONFIG.getTimeout() + " ms");
        refThis.executeDisplay(CONFIG.getTimeout(), slotNames, function() {
            // Use the existing postTimeoutRefreshExecution function
            refThis.postTimeoutRefreshExecution(slotNames, theObject, originalFunction, args);
        });
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
    if(CONFIG.isIdentityOnly()){
        return false;
    }
    if (util.isObject(win.googletag) && !win.googletag.apiReady && util.isArray(win.googletag.cmd) && util.isFunction(win.googletag.cmd.unshift)) {
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
        prebid.initPbjsConfig();
        refThis.wrapperTargetingKeys = refThis.defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
        refThis.defineGPTVariables(win);
        refThis.addHooksIfPossible(win);
        IdHub.initIdHub(win);
        return true;
    } else {
        return false;
    }
};
