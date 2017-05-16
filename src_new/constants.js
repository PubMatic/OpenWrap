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

exports.SLOT_ATTRIBUTES = {
	"SLOT_OBJECT": "adSlot",
	"SIZES": "adSlotSizes",
	"AD_UNIT_ID": "adUnitID",
	"AD_UNIT_INDEX": "adUnitIndex",
	"DIV_ID": "divID",
	"STATUS": "status",
	"DISPLAY_FUNCTION_CALLED": "displayFunctionCalled",
	"REFRESH_FUNCTION_CALLED": "refreshFunctionCalled",
	"ARGUMENTS": "arguments",
	"POSITION": "position",
	"KEY_VALUE": "skv"
};

exports.DEAL = {
	"ID": "id",
	"CHANNEL": "channel",
	"KEY_FIRST_PART": "pwtdeal_",
	"KEY_VALUE_SEPARATOR": "_-_",
	"CHANNEL_PMP": "PMP",
	"CHANNEL_PMPG": "PMPG",
	"CHANNEL_PREF": "PREF"
};

exports.WRAPPER_TARGETING_KEYS = {
	"BID_ID": "pwtsid",
	"BID_STATUS": "pwtbst",
	"BID_ECPM": "pwtecp",
	"BID_DEAL_ID": "pwtdid",
	"BID_ADAPTER_ID": "pwtpid"
};

exports.BID_ATTRIBUTES = {
	"CREATION_TIME": "creationTime"
};

exports.MESSAGES = {
	"1": ": In fetchbids.",
	"2": ": Throttled.",
	"3": ": adapter must implement the fetchBids() function.",
	"4": "BidManager: entry ",
	"5": ": Callback.",
	"6": "bidAlreadExists : ",
	"7": ": Exiting from fetchBids.",
	"8": ". Config not found, ignored.",
	"9": ". Config ignored.",
	"10": "Bid is rejected as ecpm is NULL.",
	"11": "Bid is rejected as ecpm is NaN: ",
	"12": "Existing bid ecpm: ",
	"13": ", is lower than new bid ecpm ",
	"14": ", so we are replacing bid.",
	"15": ", is greater than new bid ecpm ",
	"16": ", so we are not replacing bid.",
	"17": "Post timeout bid, ignored.",
	"18": "Bid is selected.",
	"19": ": Found winning adapterID: ",
	"20": "Bid is rejected as ecpm is empty string.",
	"21": ": error in respose handler.",
	"22": "Bid is rejected as ecpm is <= 0.",
	"23": "Existing bid is default-bid with zero ecpm, thus replacing it with the new bid from partner."
};