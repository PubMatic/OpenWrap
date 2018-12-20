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

// getAdUnitIndex
	// input , just like divID and adUnit
// generateSlotName
	// use code
// storeInSlotsMap
	// store against code
// postRederingChores 
	// do it post auction + some time , may be post returning callback	

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

function customServerExposedAPI(arrayOfAdUnits){
	if(!util.isArray(arrayOfAdUnits)){
		util.error("arrayOfAdUnits should be an array.");
		return;
	}

	// generate slots
	// call bid-manager
}

exports.init = function(win) { // TDD, i/o : done
	CONFIG.initConfig();
    if (util.isObject(win)) {
        refThis.setWindowReference(win);
        refThis.initSafeFrameListener(win);
        // define and init new method here 
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