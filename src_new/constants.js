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
	"SINGLE_IMPRESSION":"singleImpression",
	"PREBID_NAMESPACE": "owpbjs",
	"ENABLE_USER_ID":"identityEnabled",
	"IDENTITY_PARTNERS":"identityPartners",
	"IDENTITY_CONSUMERS": "identityConsumers",
	"IDENTITY_ONLY":"identityOnly",
	"GAM":"eb",
	"TAM":"tam",
	"PREBID":"prebid",	
	"PROTOCOL" : "https://",
	"SLOT_CONFIG": "slotConfig"	,
	"DEFAULT": "default",
	"ADSERVER":"adserver",
	"SCHAINOBJECT":"sChainObj",
	"SCHAIN":"sChain"
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
	"CACHE_PATH":"/cache",
	"CACHE_URL":"https://ow.pubmatic.com",
	"VIDEO_PARAM":"video"
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
	"USER_IDS":"pwtuid",
	"CACHE_ID":"pwtcid",
	"CACHE_URL":"pwtcurl",
	"CACHE_PATH":"pwtcpath",
};

exports.IGNORE_PREBID_KEYS = {
	"hb_bidder": 1,
	"hb_adid": 1,
	"hb_pb": 1,
	"hb_size": 1,
	"hb_deal": 1,
	"hb_uuid":1,
	"hb_cache_host":1,
	"hb_cache_id":1
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
	"M9": ". Config ignored.",
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
	IDENTITY:{
		M1: "Unable to get User Id from OpenIdentity",
		M2: "Setting UserIds to EB ",
		M3: "Unable to parse User ID configuration",
		M4: "User Id Condiguration Sent to prebid ",
		M5: "Identity only enabled, no need to process. Calling Original function "
	}
};

exports.PLATFORM_VALUES = {
	"DISPLAY": "display",
	"NATIVE": "native",
	"VIDEO":"video"
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

exports.EXCLUDE_IDENTITY_PARAMS = ["rev_share","timeout","throttle"];

exports.TOLOWERCASE_IDENTITY_PARAMS = ["storage.type"];

exports.JSON_VALUE_KEYS = ["params.clientIdentifier"];

exports.AD_SERVER = {
	"DFP" : "DFP",
	"CUSTOM": "CUSTOM"
};