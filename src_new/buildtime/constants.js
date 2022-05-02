


exports.EXCLUDE_IDENTITY_PARAMS = ["rev_share", "timeout", "throttle"];

exports.TOLOWERCASE_IDENTITY_PARAMS = ["storage.type"];

exports.JSON_VALUE_KEYS = ["params.clientIdentifier"];

exports.AD_SERVER = {
	"DFP": "DFP",
	"CUSTOM": "CUSTOM"
};

exports.ID_PARTNERS_CUSTOM_VALUES = {
	"id5Id": [
		{
			"key": "params.provider",
			"value": "pubmatic-identity-hub"
		}
	]
};

exports.EXCLUDE_PARTNER_LIST = ['pubProvidedId'];

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