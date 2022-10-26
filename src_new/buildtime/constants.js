


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