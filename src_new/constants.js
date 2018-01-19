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
	"PARENT_ADAPTER_PREBID": "prebid"
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
	"GLOBAL_KEY_VALUE": "gkv",
	"MASK_BIDS": "maksBids",
	"META_DATA_PATTERN": "metaDataPattern",
	"SEND_ALL_BIDS": "sendAllBids",
	"SERVER_SIDE_ENABLED": "serverSideEnabled"
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
	"META_DATA": "pwtm"
};

exports.IGNORE_PREBID_KEYS = {
	"hb_bidder": 1,
    "hb_adid": 1,
    "hb_pb": 1,
    "hb_size": 1,
    "hb_deal": 1
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
	"M23": "Existing bid is default-bid with zero ecpm, thus replacing it with the new bid from partner.",
	"M24": "Passsed argument is not a bidAdaptor",
	"M25": "Bid details not found for bidID: "
};
