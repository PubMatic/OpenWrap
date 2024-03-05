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
	"OPENWRAP_NAMESPACE": "PWT",
	"IH_OW_NAMESPACE": "IHPWT",
	"PREBID_NAMESPACE": "owpbjs",
	"IH_NAMESPACE": "ihowpbjs",
	"ENABLE_USER_ID": "identityEnabled",
	"IDENTITY_PARTNERS": "identityPartners",
	"IDENTITY_CONSUMERS": "identityConsumers",
	"IDENTITY_ONLY": "identityOnly",
	"PREBID": "prebid",
	"PROTOCOL": "https://",
	"SLOT_CONFIG": "slotConfig",
	"DEFAULT": "default",
	"MCONF_REGEX": "regex",
	"ADSERVER":"adserver",
	"OWVERSION":"owv",
	"PBVERSION":"pbv",
	"SCHAINOBJECT":"sChainObj",
	"SCHAIN":"sChain",
	"PBJS_NAMESPACE": "prebidObjName",
	"TEST_GROUP_DETAILS": "testConfigDetails",
	"TEST_PWT": "test_pwt",
	"PRICE_GRANULARITY" : "priceGranularity",
	"PRICE_GRANULARITY_CUSTOM" : "custom",
	"PRICE_GRANULARITY_BUCKETS" : "priceGranularityBuckets",
	"GRANULARITY_MULTIPLIER" : "granularityMultiplier",
	"TEST_PARTNER": "test_adapters",
	"REDUCE_CODE_SIZE": "reduceCodeSize",
	"TEST_IDENTITY_PARTNER": "test_identityPartners",
	"IH_ANALYTICS_ADAPTER_EXPIRY": "ihAnalyticsAdapterExpiry",
	"IH_ANALYTICS_ADAPTER_DEFAULT_EXPIRY": 7,
	"EXTERNAL_FLOOR_WO_CONFIG": "External Floor w/o Config",
	"HARD_FLOOR": "hard"
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
	"SSO_ENABLED": "ssoEnabled",
	"FLOOR_SOURCE": "floorSource",
	"GDPR_ACTION_TIMEOUT": "gdprActionTimeout",
	"PB_GLOBAL_VAR_NAMESPACE": "pbGlobalVarNamespace",
	"OW_GLOBAL_VAR_NAMESPACE": "owGlobalVarNamespace"
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
	"ACAT": "pwtacat",
	"CRID": "pwtcrid",
	"DSP": "pwtdsp"
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
	"M32": "Invalid MediaConfig regex pattern : ",
	"M33": "Price Buckets should be set for custom price granularity",
	IDENTITY: {
		M1: "Unable to get User Id from OpenIdentity",
		M2: "Setting UserIds to EB ",
		M3: "Unable to parse User ID configuration",
		M4: "User Id Configuration Sent to prebid ",
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
		"params.partner": "number",
		"storage.refreshInSeconds": "number",
		"storage.expires": "number"
	},
	"parrableId": {
		"params.timezoneFilter.allowedZones": "array"
	},
	"imuid": {
		"params.cid": "number"
	},
	"identityLink": {
		"storage.refreshInSeconds": "number"
	},
	"merkleId": {
		"params.ssp_ids": "array"
	},
	"liveIntentId": {
		"params.requestedAttributesOverrides": "customObject"
	}
}; //list of ID partners for whom special handling of datatype is required

exports.ID_PARTNERS_CUSTOM_VALUES = {
	"id5Id": [{
			"key": "params.provider",
			"value": "pubmatic-identity-hub"
		}
	],
	"identityLink": [{
		"key": "storage.refreshInSeconds",
		"value": "1800"
	}]
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

exports.REGEX_BROWSERS = [/\b(?:crmo|crios)\/([\w\.]+)/i,/edg(?:e|ios|a)?\/([\w\.]+)/i,/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
/opios[\/ ]+([\w\.]+)/i,/\bopr\/([\w\.]+)/i,/(kindle)\/([\w\.]+)/i,/(lunascape)[\/ ]?([\w\.]*)/i,/(maxthon)[\/ ]?([\w\.]*)/i,/(netfront)[\/ ]?([\w\.]*)/i,/(jasmine)[\/ ]?([\w\.]*)/i,/(blazer)[\/ ]?([\w\.]*)/i,
/(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,/(ba?idubrowser)[\/ ]?([\w\.]+)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock)\/([-\w\.]+)/i,/(rockmelt)\/([-\w\.]+)/i,/(midori)\/([-\w\.]+)/i,/(epiphany)\/([-\w\.]+)/i,
/(silk)\/([-\w\.]+)/i,/(skyfire)\/([-\w\.]+)/i,/(ovibrowser)\/([-\w\.]+)/i,/(bolt)\/([-\w\.]+)/i,/(iron)\/([-\w\.]+)/i,/(vivaldi)\/([-\w\.]+)/i,/(iridium)\/([-\w\.]+)/i,/(phantomjs)\/([-\w\.]+)/i,
/(bowser)\/([-\w\.]+)/i,/(quark)\/([-\w\.]+)/i,/(qupzilla)\/([-\w\.]+)/i,/(falkon)\/([-\w\.]+)/i,/(rekonq)\/([-\w\.]+)/i,/(puffin)\/([-\w\.]+)/i,/(brave)\/([-\w\.]+)/i,/(whale)\/([-\w\.]+)/i,/(qqbrowserlite)\/([-\w\.]+)/i,
/(qq)\/([-\w\.]+)/i,/(duckduckgo)\/([-\w\.]+)/i,/(weibo)__([\d\.]+)/i,/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i,/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i,/micromessenger\/([\w\.]+)/i,
/konqueror\/([\w\.]+)/i,/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i,/yabrowser\/([\w\.]+)/i,/(avast|avg)\/([\w\.]+)/i,/\bfocus\/([\w\.]+)/i,/\bopt\/([\w\.]+)/i,/coc_coc\w+\/([\w\.]+)/i,/dolfin\/([\w\.]+)/i,
/coast\/([\w\.]+)/i,/miuibrowser\/([\w\.]+)/i,/fxios\/([-\w\.]+)/i,/\bqihu|(qi?ho?o?|360)browser/i,/(oculus)browser\/([\w\.]+)/i,/(samsung)browser\/([\w\.]+)/i,/(sailfish)browser\/([\w\.]+)/i,/(huawei)browser\/([\w\.]+)/i,
/(comodo_dragon)\/([\w\.]+)/i,/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i,/(metasr)[\/ ]?([\w\.]+)/i,/(lbbrowser)/i,/\[(linkedin)app\]/i,
/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(chromium|instagram)[\/ ]([-\w\.]+)/i,/\bgsa\/([\w\.]+) .*safari\//i,/headlesschrome(?:\/([\w\.]+)| )/i,
/ wv\).+(chrome)\/([\w\.]+)/i,/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i,/(chrome|chromium|crios)\/v?([\w\.]+)/i,/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i,/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i,
/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i,/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i,/(navigator|netscape\d?)\/([-\w\.]+)/i,/mobile vr; rv:([\w\.]+)\).+firefox/i,/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,
/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i];
exports.BROWSER_MAPPING = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,42,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,
	65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90];

exports.PRICE_GRANULARITY_KEYS = {
	auto: "pbAg",
	dense: "pbDg",
	low: "pbLg",
	medium: "pbMg",
	high:"pbHg",
	custom: "pbCg"
};