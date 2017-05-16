var CONFIG = require('./config.js');
var CONSTANTS = require('./constants.js');
var util = require('./util.js');
var controller = require('./controllers/gpt.js');

util.enableDebugLog();

window.PWT = window.PWT || {
	bidMap: {},
	bidIdMap: {}
};
controller.init(CONFIG.config, window);

/*

TODO:
	config how to store and read ?
	any issue with bidManager/adapterManager being called from many files
		does it keeps all data together OR creates many new versions
	common name-space
		how to add callbacks in common namespace
	first adapter:
		Prebid
		PubMatic
	COMPARE FEATURES FROM LATEST CODE	
		safeframe
			these changes are required in bidManager
*/