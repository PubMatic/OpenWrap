var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
var GDPR = require("../gdpr.js");
var adapterManager = require("../adapterManager.js");
var SLOT = require("../slot.js");

//todo: combine these maps
var wrapperTargetingKeys = {}; // key is div id
/* start-test-block */
exports.wrapperTargetingKeys = wrapperTargetingKeys;
/* end-test-block */

//todo: is this required in first phase?
var slotSizeMapping = {}; // key is div id
/* start-test-block */
exports.slotSizeMapping = slotSizeMapping;
/* end-test-block */

var slotsMap = {}; // key is div id, stores the mapping of divID ==> googletag.slot
/* start-test-block */
exports.slotsMap = slotsMap;
/* end-test-block */

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

// todo: this function may not be needed
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


function validateSizeArray = function(sizeArray){
    //todo: we need to support fluid sizes as well
    return true; // if valid
}
/* start-test-block */
exports.validateSizeArray = validateSizeArray;
/* end-test-block */

function validateAdUnitObject(anAdUnitObject){
    if(!utils.isObject(anAdUnitObject)){
        utils.error('An AdUnitObject should be an object', anAdUnitObject);
        return false;
    }

    if(!utils.isString(anAdUnitObject.code)){
        utils.error('An AdUnitObject should have a property named code and it should be a string', anAdUnitObject);
        return false;
    }

    if(!utils.isString(anAdUnitObject.divId)){
        utils.error('An AdUnitObject should have a property named divId and it should be a string', anAdUnitObject);
        return false;
    }

    if(!utils.isString(anAdUnitObject.adUnitId)){
        utils.error('An AdUnitObject should have a property named adUnitId and it should be a string', anAdUnitObject);
        return false;
    }

    if(!utils.isString(anAdUnitObject.adUnitIndex)){
        utils.error('An AdUnitObject should have a property named adUnitIndex and it should be a string', anAdUnitObject);
        return false;
    }

    if(!utils.isObject(anAdUnitObject.mediaTypes)){
        utils.error('An AdUnitObject should have a property named mediaTypes and it should be an object', anAdUnitObject);
        return false;
    }

    // todo: in future we need to support native as well

    if(!utils.isObject(anAdUnitObject.mediaTypes.banner)){
        utils.error('An anAdUnitObject.mediaTypes should have a property named banner and it should be an object', anAdUnitObject);
        return false;
    }

    if(!utils.isArray(anAdUnitObject.mediaTypes.banner.sizes)){
        utils.error('An anAdUnitObject.mediaTypes.banner should have a property named sizes and it should be an array', anAdUnitObject);
        return false;
    }    

    return true;
}
/* start-test-block */
exports.validateAdUnitObject = validateAdUnitObject;
/* end-test-block */

// getAdUnitIndex
    // input , just like divID and adUnit

function generateSlotName(adUnitObject) { // TDD, i/o : done
    if (util.isObject(adUnitObject) && util.isString(adUnitObject.code)) {
        return adUnitObject.code;
    }
    return "";
}
/* start-test-block */
exports.generateSlotName = generateSlotName;
/* end-test-block */

// storeInSlotsMap
    // store against code
// postRederingChores 
    // do it post auction + some time , may be post returning callback  



function storeInSlotsMap(anAdUnitObject) { // TDD, i/o : done
    // note: here dmSlotName is actually the code
    var dmSlotName = refThis.generateSlotName(anAdUnitObject);
    if (!util.isOwnProperty(refThis.slotsMap, dmSlotName)) {
        var slot = SLOT.createSlot(dmSlotName);
        slot.setDivID(anAdUnitObject.divId || "");
        slot.setPubAdServerObject(anAdUnitObject);
        slot.setAdUnitID(anAdUnitObject.adUnitId || "");
        slot.setAdUnitIndex(anAdUnitObject.adUnitIndex || 0);
        slot.setSizes(refThis.getAdSlotSizesArray(dmSlotName, anAdUnitObject));
        slot.setStatus(CONSTANTS.SLOT_STATUS.CREATED);
        // todo: find and set position
        //todo: we do not have a way to accept and pass key-value pairs ; we may add support later
        //      even in GPT controller we are not passing this information to and adapter that consumes it
        /* istanbul ignore else */
        /*if (sendTargetingInfoIsSet && util.isObject(JSON) && util.isFunction(JSON.stringify)) {
            util.forEachOnArray(anAdUnitObject.getTargetingKeys(), function(index, value) {
                slot.setKeyValue(value, anAdUnitObject.getTargeting(value));
            });
        }*/
        refThis.slotsMap[dmSlotName] = slot;
        //util.createVLogInfoPanel(dmSlotName, slot.getSizes()); //todo: do we need support for this?
    }
}

/* start-test-block */
exports.storeInSlotsMap = storeInSlotsMap;
/* end-test-block */

/*
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
*/
function customServerExposedAPI(arrayOfAdUnits, callbackFunction){
	if(!util.isArray(arrayOfAdUnits)){
		util.error("arrayOfAdUnits should be an array.");
		return;
	}

    util.forEachOnArray(arrayOfAdUnits, function(index, anAdUnitObject){
        if(refThis.validateAdUnit(anAdUnitObject)){ // returns true for valid adUnit
            // // generate slots
            refThis.storeInSlotsMap(anAdUnitObject);
        }
    });
    // call adapter-manager for valid slots
}
/* start-test-block */
exports.customServerExposedAPI = customServerExposedAPI;
/* end-test-block */

exports.init = function(win) { // TDD, i/o : done
	CONFIG.initConfig();
    if (util.isObject(win)) {
        refThis.setWindowReference(win);
        refThis.initSafeFrameListener(win);
        // define and init new method here 
        win.PWT.requestBids = refThis.customServerExposedAPI;
        //todo: shall we call GDPR.getUserConsentDataFromCMP(); here or from the new mwthod we will define?
        	// i think init is fine and it needs to be called only once, then why is it called twice in gpt.js controller?
        refThis.wrapperTargetingKeys = refThis.defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);        
        adapterManager.registerAdapters();        
        refThis.callJsLoadedIfRequired(win);

        return true;
    } else {
        return false;
    }
};		