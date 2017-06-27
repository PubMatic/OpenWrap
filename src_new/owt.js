var util = require("./util.js");
var controller = require("./controllers/gpt.js");//todo: configer how to select controller, may be from config
var bidManager = require("./bidManager.js");

var metaInfo = util.getMetaInfo(window);
window.PWT = window.PWT || {
	bidMap: {},
	bidIdMap: {},
	isIframe: metaInfo.isInIframe,
	protocol: metaInfo.protocol,
	secure: metaInfo.secure,
	pageURL: metaInfo.u,
	refURL: metaInfo.r,
	//safeframe flags here
	isSafeFrame: false,
	safeFrameMessageListenerAdded: false,
	udpv: util.findInString(metaInfo.isIframe ? metaInfo.refURL : metaInfo.pageURL, "pwtv") // usingDifferentProfileVersion
};

util.findInString(metaInfo.isIframe ? metaInfo.refURL : metaInfo.pageURL, "pwtc") && util.enableDebugLog();
util.findInString(metaInfo.isIframe ? metaInfo.refURL : metaInfo.pageURL, "pwtvc") && util.enableVisualDebugLog();

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
	this.isSafeFrame = true;
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "1",
			pwt_bidID: bidID,
			pwt_origin: window.location.protocol+"//"+window.location.hostname
		}),
		"*"
	);
};

//todo: change first argument to window, will require change in LineItemCreationTool
window.PWT.sfDisplayPMPCreative = function(theDocument, values, priorityArray){
	util.log("In sfDisplayPMPCreative for: " + values);
	this.isSafeFrame = true;
	window.parent.postMessage(
		JSON.stringify({
			pwt_type: "1",
			pwt_bidID: util.getBididForPMP(values, priorityArray),
			pwt_origin: window.location.protocol+"//"+window.location.hostname
		}), 
		"*"
	);
};

//todo: move to init
if(false){
	if(!this.safeFrameMessageListenerAdded){
		util.addMessageEventListenerForSafeFrame(window);
		this.this.safeFrameMessageListenerAdded = true;
	}	
}

controller.init(window);

/*
TODO:
	Util
		visualConsole
	When to execute logger pixel ?
		like nightly ? or original
		NOPE, abhinav said so on 21st June, 1756(time)
		DONE	
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