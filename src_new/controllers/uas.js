var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var UTIL = require("../util.js");
var PHOENIX = require("./UAS/phoenix.js");
var adapterManager = require("../adapterManager.js");

var bidManager = require("../bidManager.js");
var SLOT = require("../slot.js");

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

// // --------------------------------------New Code Added------------------------------------------------------
// function setDisplayFunctionCalledIfRequired(slot, arg) { // TDD, i/o : done
//     /* istanbul ignore else */
//     if (UTIL.isObject(slot) && UTIL.isFunction(slot.getDivID)) {
//         /* istanbul ignore else */
//         if (UTIL.isArray(arg) && arg[0] && arg[0] == slot.getDivID()) {
//             slot.setDisplayFunctionCalled(true);
//             slot.setArguments(arg);
//         }
//     }
// }
//
// /* start-test-block */
// exports.setDisplayFunctionCalledIfRequired = setDisplayFunctionCalledIfRequired;
// /* end-test-block */
//
// function storeInSlotsMap(dmSlotName, currentPhoenixSlot, isDisplayFlow) { // TDD, i/o : done
//     // note: here dmSlotName is actually the DivID
//     if (!UTIL.isOwnProperty(refThis.slotsMap, dmSlotName)) {
//         var slot = SLOT.createSlot(dmSlotName);
//         slot.setDivID(dmSlotName);
//         slot.setPubAdServerObject(currentPhoenixSlot);
//         slot.setAdUnitID(currentPhoenixSlot.getAdUnit());
//         slot.setAdUnitIndex(0); // TODO: refThis.getAdUnitIndex(currentPhoenixSlot)
//         slot.setSizes(currentPhoenixSlot.getDimensions()); // TODO: refThis.getAdSlotSizesArray(dmSlotName, currentPhoenixSlot)
//         slot.setStatus(CONSTANTS.SLOT_STATUS.CREATED);
//
// 				// todo: find and set position
// 				// Removing sendTargetingInfoIsSet as its just set once to true
//         /* istanbul ignore else */
// 				// NOTE: Don't need this as we are not adding hook on "setTargeting"
//         // if (UTIL.isObject(JSON) && UTIL.isFunction(JSON.stringify)) {
//         //     UTIL.forEachOnArray(currentPhoenixSlot.getTargetingKeys(), function(index, value) {
//         //         slot.setKeyValue(value, currentPhoenixSlot.getTargeting(value));
//         //     });
//         // }
//
//         refThis.slotsMap[dmSlotName] = slot;
//         UTIL.createVLogInfoPanel(dmSlotName, slot.getSizes());
//     }
// }
//
// /* start-test-block */
// exports.storeInSlotsMap = storeInSlotsMap;
// /* end-test-block */
//
// function updateSlotsMapFromPhoenixSlots(phoenixSlotsArray, argumentsFromCallingFunction, isDisplayFlow) { // TDD, i/o : done
//     UTIL.log("Generating slotsMap");
//     UTIL.forEachOnArray(phoenixSlotsArray, function(index, currentPhoenixSlot) {
//         var dmSlotName = currentPhoenixSlot.getId();
//         refThis.storeInSlotsMap(dmSlotName, currentPhoenixSlot, isDisplayFlow);
//         if (isDisplayFlow && UTIL.isOwnProperty(refThis.slotsMap, dmSlotName)) {
//             refThis.setDisplayFunctionCalledIfRequired(refThis.slotsMap[dmSlotName], argumentsFromCallingFunction);
//         }
//     });
//     UTIL.log(refThis.slotsMap);
// }
//
// /* start-test-block */
// exports.updateSlotsMapFromPhoenixSlots = updateSlotsMapFromPhoenixSlots;
// /* end-test-block */
//
// //todo: pass slotsMap in every function that uses it
// function getStatusOfSlotForDivId(divID) { // TDD, i/o : done
//     /* istanbul ignore else */
//     if (util.isOwnProperty(refThis.slotsMap, divID)) {
//         return refThis.slotsMap[divID].getStatus();
//     }
//     return CONSTANTS.SLOT_STATUS.DISPLAYED;
// }
//
// /* start-test-block */
// exports.getStatusOfSlotForDivId = getStatusOfSlotForDivId;
// /* end-test-block */
//
// function updateStatusAfterRendering(divID, isRefreshCall) { // TDD, i/o : done
//     /* istanbul ignore else */
//     if (util.isOwnProperty(refThis.slotsMap, divID)) {
//         refThis.slotsMap[divID].updateStatusAfterRendering(isRefreshCall);
//     }
// }
//
// /* start-test-block */
// exports.updateStatusAfterRendering = updateStatusAfterRendering;
// /* end-test-block */

// ---------------------------------End New Code----------------------------------------------------

function NewPhoenix() {
  PHOENIX.PhoenixClass.apply(this);
}

NewPhoenix.prototype = Object.create(PHOENIX.PhoenixClass.prototype, {
  display: {
    value: function(divID) { // override
      console.log("Inside NewPhoenix OBJECT", divID);
      PHOENIX.PhoenixClass.prototype.display.apply(this, arguments);
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});

NewPhoenix.prototype.constructor = NewPhoenix;

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
		win.Phoenix = new NewPhoenix();
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
	//if(!userSyncupInitiated){
		//initiateUserSyncup();
	//}
}
/* start-test-block */
exports.initPhoenix = initPhoenix;
/* end-test-block */

function createPubMaticNamespace(win){
	win.PubMatic = win.PubMatic || {};
	//todo: break the function
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
