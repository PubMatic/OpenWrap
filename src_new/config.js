var config = require("./conf.js");
var CONSTANTS = require("./constants.js");
var util = require("./util.js");

var refThis = null;

refThis = this;

exports.getPublisherId = function () {
	return util.trim(config.pwt.pubid) || "0";
};

exports.getMataDataPattern = function () {
	if (util.isString(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.META_DATA_PATTERN])) {
		return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.META_DATA_PATTERN];
	}
	return null;
};

exports.getSendAllBidsStatus = function () {
	return window.parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SEND_ALL_BIDS]) || 0;
};

exports.getTimeout = function () {
	return window.parseInt(config.pwt.t) || 1000;
};

exports.getDisableAjaxTimeout = function () {
	var pwt = config.pwt;
	if (util.isOwnProperty(pwt, CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT)) {
		return true == config.pwt.disableAjaxTimeout;
	}
	return true;
};

exports.getAdapterRevShare = function (adapterID) {
	var adapterConfig = config.adapters;
	if (util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.REV_SHARE)) {
		return (1 - window.parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.REV_SHARE]) / 100);
	}
	return 1;
};

exports.getAdapterThrottle = function (adapterID) {
	var adapterConfig = config.adapters;
	if (util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.THROTTLE)) {
		return 100 - window.parseFloat(adapterConfig[adapterID][CONSTANTS.CONFIG.THROTTLE]);
	}
	return 0;
};

exports.isServerSideAdapter = function (adapterID) {
	var adapterConfig = config.adapters;
	/* istanbul ignore else */
	if (adapterConfig[adapterID] && util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.SERVER_SIDE_ENABLED)) {
		return window.parseInt(adapterConfig[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED]) === 1;
	}
	return false;
};

exports.getAdapterMaskBidsStatus = function (adapterID) {
	var adapterConfig = config.adapters;
	var tempSettings = {
		'audienceNetwork': 1
	};

	if (util.isOwnProperty(tempSettings, adapterID)) {
		return tempSettings[adapterID];
	}

	if (util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.MASK_BIDS)) {
		return window.parseInt(adapterConfig[adapterID][CONSTANTS.CONFIG.MASK_BIDS]) || 0;
	}
	return 0;
}

exports.getBidPassThroughStatus = function (adapterID) {
	var adapterConfig = config.adapters;
	if (util.isOwnProperty(adapterConfig[adapterID], CONSTANTS.CONFIG.BID_PASS_THROUGH)) {
		return window.parseInt(adapterConfig[adapterID][CONSTANTS.CONFIG.BID_PASS_THROUGH]);
	}
	return 0;
};

exports.getProfileID = function () {
	return util.trim(config.pwt[CONSTANTS.CONFIG.PROFILE_ID]) || "0";
};

exports.getProfileDisplayVersionID = function () {
	return util.trim(config.pwt[CONSTANTS.CONFIG.PROFILE_VERSION_ID]) || "0";
};

exports.getAnalyticsPixelURL = function () {
	return config.pwt[CONSTANTS.CONFIG.LOGGER_URL] || false;
};

exports.getMonetizationPixelURL = function () {
	return config.pwt[CONSTANTS.CONFIG.TRACKER_URL] || false;
};

exports.forEachAdapter = function (callback) {
	util.forEachOnObject(config.adapters, callback);
};

function addPrebidAdapter() {
	var preBidAdapter = CONSTANTS.COMMON.PARENT_ADAPTER_PREBID;
	if (!util.isOwnProperty(config.adapters, preBidAdapter)) {
		var adapterConfig = {};
		adapterConfig[CONSTANTS.CONFIG.REV_SHARE] = "0.0";
		adapterConfig[CONSTANTS.CONFIG.THROTTLE] = "100";
		adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN] = "_DIV_";
		adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] = {};
		config.adapters[preBidAdapter] = adapterConfig;
	}
}

exports.getGdpr = function () {
	var gdpr = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] || CONSTANTS.CONFIG.DEFAULT_GDPR_CONSENT;
	return gdpr === "1";
};

exports.getCmpApi = function () {
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CMPAPI] || CONSTANTS.CONFIG.DEFAULT_GDPR_CMPAPI;
};

exports.getGdprTimeout = function () {
	var gdprTimeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_TIMEOUT];
	return gdprTimeout ? window.parseInt(gdprTimeout) : CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT;
};

exports.getAwc = function () {
	var awc = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_AWC] || CONSTANTS.CONFIG.DEFAULT_GDPR_AWC;
	return awc === "1";
};

/* start-test-block */
exports.addPrebidAdapter = addPrebidAdapter;
/* end-test-block */

exports.initConfig = function () {
	refThis.updateABTestConfig();
	refThis.addPrebidAdapter();

	var ignoreAdapterLevelParams = {};
	util.forEachOnObject(CONSTANTS.CONFIG, function (key, value) {
		ignoreAdapterLevelParams[value] = "";
	});

	util.forEachOnObject(config.adapters, function (adapterID, adapterConfig) {
		var adapterLevelParams = {};
		util.forEachOnObject(adapterConfig, function (key, value) {
			if (!util.isOwnProperty(ignoreAdapterLevelParams, key)) {
				adapterLevelParams[key] = value;
			}
		});
		util.forEachOnObject(adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP], function (kgpv, slotLevelParams) {
			util.forEachOnObject(adapterLevelParams, function (key, value) {
				slotLevelParams[key] = value;
			});
		});

		if (adapterID != "pubmatic" && adapterID != "pubmatic2") {
			util.forEachOnObject(adapterConfig[CONSTANTS.CONFIG.REGEX_KEY_LOOKUP_MAP], function (kgpv, slotLevelParams) {
				util.forEachOnObject(adapterLevelParams, function (key, value) {
					if (util.isOwnProperty(slotLevelParams, "rx_config")) {
						slotLevelParams["rx_config"][key] = value;
					}
				});
			});
		}
	});
};

/* Native Configuration */

exports.getNativeConfiguration = function () {
	return config[CONSTANTS.COMMON.NATIVE_MEDIA_TYPE_CONFIG];
};

exports.getAdServerCurrency = function () {
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.AD_SERVER_CURRENCY];
};

exports.isSingleImpressionSettingEnabled = function () {
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SINGLE_IMPRESSION] || CONSTANTS.CONFIG.DEFAULT_SINGLE_IMPRESSION);
};

exports.isUserIdModuleEnabled = function () {
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID] || CONSTANTS.CONFIG.DEFAULT_USER_ID_MODULE);
};

exports.getIdentityPartners = function () {
	return config[CONSTANTS.COMMON.IDENTITY_PARTNERS];
};

exports.isIdentityOnly = function () {
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] || CONSTANTS.CONFIG.DEFAULT_IDENTITY_ONLY);
};

exports.getIdentityConsumers = function () {
	return (config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS] || "").toLowerCase();
};

exports.getSlotConfiguration = function () {
	return config[CONSTANTS.COMMON.SLOT_CONFIG];
};

exports.getAdServer = function () {
	return config[CONSTANTS.COMMON.ADSERVER];
};
exports.getCCPA = function () {
	var ccpa = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] || CONSTANTS.CONFIG.DEFAULT_CCPA_CONSENT;
	return ccpa === "1";
};

exports.getCCPACmpApi = function () {
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CMPAPI] || CONSTANTS.CONFIG.DEFAULT_CCPA_CMPAPI;
};

exports.getCCPATimeout = function () {
	var ccpaTimeout = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_TIMEOUT];
	return ccpaTimeout ? window.parseInt(ccpaTimeout) : CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT;
};

exports.getSchainObject = function () {
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAINOBJECT] || {};
};

exports.isSchainEnabled = function () {
	return window.parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAIN]) || 0;
};

exports.isPrebidPubMaticAnalyticsEnabled = function () {
	// note: not using window.parseInt as this function is also used in build.sh that runs in NodeJS environment
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.ENABLE_PB_PM_ANALYTICS]) === 1;
};

exports.isUsePrebidKeysEnabled = function () {
	// note: not using window.parseInt as this function is also used in build.sh that runs in NodeJS environment
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.USE_PREBID_KEYS]) === 1;
};

exports.PBJS_NAMESPACE = config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.PBJS_NAMESPACE] || "pbjs";

exports.getPriceGranularity = function(){
	return config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.PRICE_GRANULARITY] || null;
};

exports.getGranularityMultiplier = function(){
	return parseFloat(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.GRANULARITY_MULTIPLIER]) || 1;
};
exports.isAbTestEnabled = function () {
	return parseInt(config[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.AB_TEST_ENABLED]) === 1;
};

exports.getTestPWTConfig = function () {
	return config[CONSTANTS.COMMON.TEST_PWT] || {};
};

exports.getTestGroupDetails = function () {
	return config[CONSTANTS.COMMON.TEST_GROUP_DETAILS] || {};
};

exports.getTestPartnerConfig = function () {
	return config[CONSTANTS.COMMON.TEST_PARTNER] || {};
};

exports.getTestIdentityPartners = function () {
	return config[CONSTANTS.COMMON.TEST_IDENTITY_PARTNER] || {};
};

exports.updateABTestConfig = function () {
	if (refThis.isAbTestEnabled()) {
		var randomNumberBelow100 = util.getRandomNumberBelow100();
		var testGroupDetails = refThis.getTestGroupDetails();
		// if Random number is smaller than the test group size then test config will be applied 
		if (testGroupDetails && testGroupDetails.testGroupSize && randomNumberBelow100 < testGroupDetails.testGroupSize) {
			refThis.updatePWTConfig();
			config.adapters = refThis.updatePartnerConfig(refThis.getTestPartnerConfig(), config.adapters);			
			config.identityPartners = refThis.updatePartnerConfig(refThis.getTestIdentityPartners(), refThis.getIdentityPartners());			
		}
	}
};

exports.updatePWTConfig = function () {
	var testConfig = refThis.getTestPWTConfig();
	if (testConfig && Object.keys(testConfig).length > 0) {
		util.log(CONSTANTS.MESSAGES.M30, JSON.stringify(testConfig));
		for (var key in testConfig) {
			if (config[CONSTANTS.CONFIG.COMMON][key]) {
				config[CONSTANTS.CONFIG.COMMON][key] = testConfig[key];
			}
		}
		//TODO: Uncomment Below code after updating phatomjs or using chrome headless 
		// Object.assign(config[CONSTANTS.CONFIG.COMMON], testConfig);
		window.PWT.testGroupId = 1;
	}
};

exports.updatePartnerConfig = function (testConfig, controlConfig) {
	if (testConfig && controlConfig && Object.keys(testConfig).length > 0 && Object.keys(controlConfig).length > 0) {
		util.log(CONSTANTS.MESSAGES.M31, JSON.stringify(testConfig));
		for (var key in testConfig) {
			if (util.isOwnProperty(testConfig, key) && util.isObject(testConfig[key])) {
				if (Object.keys(testConfig[key]).length == 0 && controlConfig[key] && Object.keys(controlConfig[key]).length > 0) {
					testConfig[key] = controlConfig[key];
				} else if (Object.keys(testConfig[key]).length > 0 && controlConfig[key] && Object.keys(controlConfig[key]).length > 0) {
					testConfig[key] = refThis.getMergedConfig(testConfig[key], controlConfig[key]);
				}
			}
		}
		window.PWT.testGroupId = 1;
		return testConfig;
	} else{
		// since only test type can be enabled test config will be empty if other test config is enabled and hence return control config
		return controlConfig;
	}
};

exports.getTestGroupDetails = function () {
	return config[CONSTANTS.COMMON.TEST_GROUP_DETAILS] || {};
};
// This will keep toObject config as is and only merge objects common in both from and toobject 
exports.getMergedConfig = function(toObject, fromObject){
	for(var key in fromObject){
		if(!Object.prototype.hasOwnProperty.call(toObject, key)) {
			if(util.isObject(fromObject[key]) || util.isArray(fromObject[key])) {
				toObject[key] = JSON.parse(JSON.stringify(fromObject[key]));
			}else{
				toObject[key] = fromObject[key];
			}
		}
	}
	return toObject;
};
