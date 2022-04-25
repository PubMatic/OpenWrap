//todo:
// remove unnecessary constants

exports.COMMON = {
	"BID_PRECISION": 2,
	"DEAL_KEY_FIRST_PART": "pwtdeal_",
	"DEAL_KEY_VALUE_SEPARATOR": "_-_",
	"PREBID_PREFIX": "PB_",
	"CONFIG": "config",
	"DIV_ID": "divID",
	"PARAMS": "params",
	"SIZES": "sizes",
	"HEIGHT": "height",
	"WIDTH": "width",
	"SLOTS": "slots",
	"KEY_GENERATION_PATTERN_VALUE": "kgpv",
	"KEY_VALUE_PAIRS": "kvp",
	"IMPRESSION_ID": "iid",
	"PARENT_ADAPTER_PREBID": "prebid",
	"ANALYTICS_CURRENCY": "USD",
	"NATIVE_MEDIA_TYPE_CONFIG": "nativeConfig",
	"NATIVE_ONLY": "nativeOnly",
	"OW_CLICK_NATIVE": "openwrap-native-click",
	"BID_ID": "owbidid",
	"AD_SERVER_CURRENCY": "adServerCurrency",
	"SINGLE_IMPRESSION": "singleImpression",
	"PREBID_NAMESPACE": "owpbjs",
	"ENABLE_USER_ID": "identityEnabled",
	"IDENTITY_PARTNERS": "identityPartners",
	"IDENTITY_CONSUMERS": "identityConsumers",
	"IDENTITY_ONLY": "identityOnly",
	"PREBID": "prebid",
	"PROTOCOL": "https://",
	"SLOT_CONFIG": "slotConfig",
	"DEFAULT": "default",
	"ADSERVER":"adserver",
	"OWVERSION":"owv",
	"PBVERSION":"pbv",
	"SCHAINOBJECT":"sChainObj",
	"SCHAIN":"sChain",
	"PBJS_NAMESPACE": "prebidObjName",
	"TEST_GROUP_DETAILS": "testConfigDetails",
	"TEST_PWT": "test_pwt",
	"PRICE_GRANULARITY" : "priceGranularity",
	"GRANULARITY_MULTIPLIER" : "granularityMultiplier",
	"TEST_PARTNER": "test_adapters",
	"REDUCE_CODE_SIZE": "reduceCodeSize",
	"TEST_IDENTITY_PARTNER": "test_identityPartners"
};

exports.CONFIG = {
	"GLOBAL": "global",
	"ADAPTERS": "adapters",
	"COMMON": "pwt",
	"TIMEOUT": "t",
	"KEY_GENERATION_PATTERN": "kgp",
	"REGEX_KEY_GENERATION_PATTERN": "kgp_rx",
	"REGEX_KEY_LOOKUP_MAP": "klm_rx",
	"KEY_LOOKUP_MAP": "klm",
	"SERVER_SIDE_KEY": "sk",
	"PUBLISHER_ID": "pubid",
	"PROFILE_ID": "pid",
	"PROFILE_VERSION_ID": "pdvid",
	"LOGGER_URL": "dataURL",
	"TRACKER_URL": "winURL",
	"REV_SHARE": "rev_share",
	"THROTTLE": "throttle",
	"BID_PASS_THROUGH": "pt",
	"GLOBAL_KEY_VALUE": "gkv",
	"MASK_BIDS": "maksBids",
	"META_DATA_PATTERN": "metaDataPattern",
	"SEND_ALL_BIDS": "sendAllBids",
	"SERVER_SIDE_ENABLED": "serverSideEnabled",
	"GDPR_CONSENT": "gdpr",
	"CONSENT_STRING": "cns",
	"GDPR_CMPAPI": "cmpApi",
	"GDPR_TIMEOUT": "gdprTimeout",
	"GDPR_AWC": "awc",
	"DEFAULT_GDPR_CMPAPI": "iab",
	"DEFAULT_GDPR_TIMEOUT": 10000,
	"DEFAULT_GDPR_AWC": "0",
	"DEFAULT_SINGLE_IMPRESSION": "0",
	"DEFAULT_USER_ID_MODULE": "0",
	"DEFAULT_IDENTITY_ONLY": "0",
	"DEFAULT_GDPR_CONSENT": "0",
	"DISABLE_AJAX_TIMEOUT": "disableAjaxTimeout",
	"CCPA_CONSENT": "ccpa",
	"CCPA_CMPAPI": "ccpaCmpApi",
	"CCPA_TIMEOUT": "ccpaTimeout",
	"DEFAULT_CCPA_CMPAPI": "iab",
	"DEFAULT_CCPA_TIMEOUT": 10000,
	"CACHE_PATH": "/cache",
	"CACHE_URL": "https://ow.pubmatic.com",
	"VIDEO_PARAM": "video",
	"ENABLE_PB_PM_ANALYTICS": "pubAnalyticsAdapter",
	"FLOOR_PRICE_MODULE_ENABLED": "floorPriceModuleEnabled",
	"FLOOR_AUCTION_DELAY":"floorAuctionDelay",
	"DEFAULT_FLOOR_AUCTION_DELAY": 100,
	"FLOOR_JSON_URL":"jsonUrl",
	"FLOOR_ENFORCE_JS":"floorType",
	"DEFAULT_FLOOR_ENFORCE_JS": true,
	"USE_PREBID_KEYS": "usePBJSKeys",
	"AB_TEST_ENABLED": "abTestEnabled",
	"TIMEOUT_ADJUSTMENT": 50,
	"SSO_ENABLED": "ssoEnabled"
};

exports.METADATA_MACROS = {
	"WIDTH": "_W_",
	"HEIGHT": "_H_",
	"PARTNER": "_P_",
	"GROSS_ECPM": "_GE_",
	"NET_ECPM": "_NE_",
	"BID_COUNT": "_BC_",
	"PARTNER_COUNT": "_PC_"
};

exports.MACROS = {
	"WIDTH": "_W_",
	"HEIGHT": "_H_",
	"AD_UNIT_ID": "_AU_",
	"AD_UNIT_INDEX": "_AUI_",
	"INTEGER": "_I_",
	"DIV": "_DIV_"
};

exports.SLOT_STATUS = {
	"CREATED": 0,
	"PARTNERS_CALLED": 1,
	"TARGETING_ADDED": 2,
	"DISPLAYED": 3
};

exports.WRAPPER_TARGETING_KEYS = {
	"BID_ID": "pwtsid",
	"BID_STATUS": "pwtbst",
	"BID_ECPM": "pwtecp",
	"BID_DEAL_ID": "pwtdid",
	"BID_ADAPTER_ID": "pwtpid",
	"BID_SIZE": "pwtsz",
	"PUBLISHER_ID": "pwtpubid",
	"PROFILE_ID": "pwtprofid",
	"PROFILE_VERSION_ID": "pwtverid",
	"META_DATA": "pwtm",
	"PLATFORM_KEY": "pwtplt",
	"USER_IDS": "pwtuid",
	"CACHE_ID": "pwtcid",
	"CACHE_URL": "pwtcurl",
	"CACHE_PATH": "pwtcpath",
};

exports.IGNORE_PREBID_KEYS = {
	"hb_bidder": 1,
	"hb_adid": 1,
	"hb_pb": 1,
	"hb_size": 1,
	"hb_deal": 1,
	"hb_uuid": 1,
	"hb_cache_host": 1,
	"hb_cache_id": 1,
	"hb_adomain": 1
};

//todo: mention all params here and use accordigly
exports.LOGGER_PIXEL_PARAMS = {
	"TIMESTAMP": "tst",
	"PAGE_URL": "purl",
	"PAGE_DOMAIN": "orig",
	"TIMEOUT": "to"
};

exports.MESSAGES = {
	"M1": ": In fetchbids.",
	"M2": ": Throttled.",
	"M3": ": adapter must implement the fetchBids() function.",
	"M4": "BidManager: entry ",
	"M5": ": Callback.",
	"M6": "bidAlreadExists : ",
	"M7": ": Exiting from fetchBids.",
	"M8": ". Config not found, ignored.",
	// "M9": ". Config ignored.",
	"M10": "Bid is rejected as ecpm is NULL.",
	"M11": "Bid is rejected as ecpm is NaN: ",
	"M12": "Existing bid ecpm: ",
	"M13": ", is lower than new bid ecpm ",
	"M14": ", so we are replacing bid from partner ",
	"M15": ", is greater than new bid ecpm ",
	"M16": ", so we are not replacing bid from partner ",
	"M17": "Post timeout bid, ignored.",
	"M18": "Bid is selected for partner ",
	"M19": ": Found winning adapterID: ",
	"M20": "Bid is rejected as ecpm is empty string.",
	"M21": ": error in respose handler.",
	"M22": "Bid is rejected as ecpm is <= 0.",
	"M23": "Existing bid is default-bid with zero ecpm, thus replacing it with the new bid from partner ",
	"M24": "Passsed argument is not a bidAdaptor",
	"M25": "Bid details not found for bidID: ",
	"M26": "Currency Module is Activated. Ad Server Currency is: ",
	"M27": "Invalid regex pattern ",
	"M28": "Unable to match regex pattern as kgpv length is not 3",
	"M29": "Unable to parse Partner configuration",
	"M30": "AB Test Enabled With Config",
	"M31": "AB Test Enabled With Partner Config",
	IDENTITY: {
		M1: "Unable to get User Id from OpenIdentity",
		M2: "Setting UserIds to EB ",
		M3: "Unable to parse User ID configuration",
		M4: "User Id Condiguration Sent to prebid ",
		M5: "Identity only enabled, no need to process. Calling Original function ",
		M6: " function is not available. Make sure userId module is included."
	}
};

exports.PLATFORM_VALUES = {
	"DISPLAY": "display",
	"NATIVE": "native",
	"VIDEO": "video"
};

exports.FORMAT_VALUES = {
	"BANNER": "banner",
	"VIDEO": "video",
	"NATIVE": "native",
	"OTHER": "other"
};

exports.HOOKS = {
	"PREBID_SET_CONFIG": "HookForPrebidSetConfig",
	"PREBID_REQUEST_BIDS": "HookForPrebidRequestBids",
	"BID_RECEIVED": "HookForBidReceived",
	"POST_AUCTION_KEY_VALUES": "HookForPostAuctionKeyValues"
};

exports.SRA_ENABLED_BIDDERS = {
	"rubicon": 1,
	"improvedigital": 2
};

exports.EXCLUDE_IDENTITY_PARAMS = ["rev_share", "timeout", "throttle"];

exports.TOLOWERCASE_IDENTITY_PARAMS = ["storage.type"];

exports.JSON_VALUE_KEYS = ["params.clientIdentifier"];

exports.AD_SERVER = {
	"DFP": "DFP",
	"CUSTOM": "CUSTOM"
};

exports.SPECIAL_CASE_ID_PARTNERS = {
	"intentIqId": {
		"params.partner": "number"
	},
	"sharedId": {
		"params.syncTime": "number"
	},
	"id5Id": {
		"params.partner": "number"
	},
	"parrableId": {
		"params.timezoneFilter.allowedZones": "array"
	},
	"imuid": {
		"params.cid": "number"
	}
}; //list of ID partners for whom special handling of datatype is required

exports.ID_PARTNERS_CUSTOM_VALUES = {
	"id5Id": [
		{
			"key": "params.provider",
			"value": "pubmatic-identity-hub"
		}
	]
};

exports.EXCLUDE_PARTNER_LIST = ['pubProvidedId'];

exports.MEDIATYPE = {
	BANNER:0 ,
	VIDEO:1,
	NATIVE:2 
  };

exports.BID_STATUS =  {
	BID_REJECTED : "bidRejected"
}
// Add list of PubMatic aliases here.
exports.PUBMATIC_ALIASES = ["pubmatic2"];

exports.PBSPARAMS = {
	adapter: "prebidServer",
	endpoint: "https://ow.pubmatic.com/pbs/openrtb2/auction",
	syncEndpoint: "https://ow.pubmatic.com/cookie_sync/?sec=1"
}

exports.TIMEOUT_CONFIG = {
	MaxTimeout: 500,
	MinTimeout: 200
}

exports.DEFAULT_ALIASES = {
	adg: "adgeneration",
	districtm: "appnexus",
	districtmDMX: "dmx",
	pubmatic2: "pubmatic"
}
exports.YAHOOSSP = "yahoossp";
