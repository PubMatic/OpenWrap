//todo:
// remove unnecessary constants

exports.COMMON = {
	"BID_PRECISION": 4,
	"CONFIG": "config",
	"DIV_ID": "divID",
	"PARAMS": "params",
	"SIZES": "sizes",
	"HEIGHT": "height",
	"WIDTH": "width",
	"SLOTS": "slots",
	"KEY_GENERATION_PATTERN_VALUE": "kgpv",
	"KEY_VALUE_PAIRS": "kvp",
	"IMPRESSION_ID": "iid"
};

exports.CONFIG = {
	"GLOBAL": "global",
	"ADAPTERS": "adapters",
	"COMMON": "pwt",
	"TIMEOUT": "t",
	"KEY_GENERATION_PATTERN": "kgp",
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
	"GLOBAL_KEY_VALUE": "gkv"
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
	"PUBLISHER_ID": "pwtpubid",
	"PROFILE_ID": "pwtprofid",
	"PROFILE_VERSION_ID": "pwtverid"
};

//todo: mention all params here and use accordigly
exports.LOGGER_PIXEL_PARAMS = {
	"TIMESTAMP": "tst",
	"PAGE_URL": "purl",
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
	"M14": ", so we are replacing bid.",
	"M15": ", is greater than new bid ecpm ",
	"M16": ", so we are not replacing bid.",
	"M17": "Post timeout bid, ignored.",
	"M18": "Bid is selected.",
	"M19": ": Found winning adapterID: ",
	"M20": "Bid is rejected as ecpm is empty string.",
	"M21": ": error in respose handler.",
	"M22": "Bid is rejected as ecpm is <= 0.",
	"M23": "Existing bid is default-bid with zero ecpm, thus replacing it with the new bid from partner."
};