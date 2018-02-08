var CONFIG = require("../../config.js");
var UTIL = require("../../util.js");
var PHOENIX = require("./phoenix.js");

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
		win.Phoenix = new PHOENIX.PhoenixClass();
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
        refThis.createPubMaticNamespace(win);
        refThis.generateBCUID(win);
        refThis.callJsLoadedIfRequired(win);
        return true;
    } else {
        return false;
    }
};
