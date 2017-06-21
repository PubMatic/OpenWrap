var util = require("./util.js");
var controller = require("./controllers/gpt.js");//todo: configer how to select controller, may be from config
var bidManager = require("./bidManager.js");

util.enableDebugLog();

window.PWT = window.PWT || {
	bidMap: {},
	bidIdMap: {},
	isIframe: util.isIframe(window),
	protocol: util.getProtocol(window),
	pageURL: util.getPageURL(window)
	//safeframe flags here
};

//todo: set pageURL and refURL using one func call
window.PWT["cDebug"] = util.findInString(window.PWT.pageURL, "");
window.PWT["vDebug"] = util.findInString(window.PWT.pageURL, "");

window.PWT.displayCreative = function(theDocument, bidID){
	util.log("In displayCreative for: " + bidID);
	bidManager.displayCreative(theDocument, bidID);
};

window.PWT.displayPMPCreative = function(theDocument, values, priorityArray){
	util.log("In displayPMPCreative for: " + values);	
	var bidID = util.getBididForPMP(values, priorityArray);
	bidID && bidManager.displayCreative(theDocument, bidID);
};

//todo: change first argument to window, will require change in LineItemCreationTool 
window.PWT.sfDisplayCreative = function(theDocument, bidID){
	util.log("In sfDisplayCreative for: " + bidID);
	util.addMessageEventListenerForSafeFrame(window, true);//todo
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "1",
			pwt_bidID: bidID,
			pwt_origin: ""//win.location.protocol+"//"+win.location.hostname//todo
		}), 
		"*"
	);
};

//todo: change first argument to window, will require change in LineItemCreationTool
window.PWT.sfDisplayPMPCreative = function(theDocument, values, priorityArray){
	util.log("In sfDisplayPMPCreative for: " + values);
	util.addMessageEventListenerForSafeFrame(window, true);
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "1",
			pwt_bidID: util.getBididForPMP(values, priorityArray),
			pwt_origin: "", //win.location.protocol+"//"+win.location.hostname //todo
		}), 
		"*"
	);
};

//exports.PWT = window.PWT;

controller.init(window);

/*

TODO:
	When to execute logger pixel ?
		like nightly ? or original
	SafeFrame gpt:init
		utilAddMessageEventListenerForSafeFrame(false);	
	config how to store and read ?
		DONE
	any issue with bidManager/adapterManager being called from many files
		does it keeps all data together OR creates many new versions
		DONE
	common name-space
		how to add callbacks in common namespace
	first adapter:
		Prebid
		PubMatic
	COMPARE FEATURES FROM LATEST CODE
		safeframe
			these changes are required in bidManager
		named sizes
			DONE
		logger pixel execution	
			DONE

*/