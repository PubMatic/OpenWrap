var localStorageKey = "PubMatic";
var DUMMY_PUB_ID = 909090;

// Adding util here creating cyclic dependecies between the modules so avoided it & added two util function manually
function isA(object, testForType) {
	return toString.call(object) === "[object " + testForType + "]";
}

var isFunction = function (object) {
	return isA(object, "Function");
};

var isLocalStoreEnabled = (function () {
	try {
		return window.localStorage && isFunction(window.localStorage.getItem) && isFunction(window.localStorage.setItem);
	} catch (e) {
		return false;
	}
})();

/*
	localStorage = {
		localStorageKey : {
			pubID: {
				c: "encoded user consent"
			}
		}
	}
*/

var setConsentDataInLS = function (pubId, dataType, data, gdprApplies) {
	var pm;

	if (!isLocalStoreEnabled) {
		return;
	}
	try {
		pm = window.localStorage.getItem(localStorageKey);
	} catch (e) {}
	if (pm && typeof pm === "string") {
		try {
			pm = JSON.parse(pm);
		} catch (e) {
			pm = {};
		}
	} else {
		pm = {};
	}
	if (pm) {
		if (!pm.hasOwnProperty(pubId)) {
			pm[pubId] = {};
		}
		pm[pubId].t = (new Date()).getTime();
		pm[pubId][dataType] = data;
		if (dataType == "c") {
			pm[pubId]["g"] = gdprApplies ? 1 : 0;
		}
	}
	try {
		window.localStorage.setItem(localStorageKey, JSON.stringify(pm));
	} catch (e) {}
};

/* start-test-block */
exports.setConsentDataInLS = setConsentDataInLS;
/* end-test-block */

exports.isCmpFound = function () {
	return !!window.__cmp;
};

exports.getUserConsentDataFromCMP = function () {
	// Adding dummy pubId to store data against
	var pubId = DUMMY_PUB_ID; //CONFIG.getPublisherId();
	var callId = 0;
	var getConsentDataReq = {
		__cmp: {
			callId: "iframe:" + (++callId),
			command: "getConsentData"
		}
	};

	function receiveMessage(event) {
		if (event && event.data && event.data.__cmp && event.data.__cmp.result) {
			var result = event.data.__cmp.result;

			if (result.consentData) {
				setConsentDataInLS(pubId, "c", result.consentData, result.gdprApplies);
			} else if (typeof result === "string") {
				setConsentDataInLS(pubId, "c", result);
			}
		}
	}

	function callCMP() {
		window.__cmp("getConsentData", "vendorConsents", function (result) {
			if (result.consentData) {
				setConsentDataInLS(pubId, "c", result.consentData, result.gdprApplies);
			} else if (typeof result === "string") {
				setConsentDataInLS(pubId, "c", result);
			}
		});
	}

	if (window.__cmp) {
		if (typeof window.__cmp === "function") {
			callCMP();
		} else {
			setTimeout(function () {
				if (typeof window.__cmp === "function") {
					callCMP();
				}
			}, 500);
		}
	} else {
		// we may be inside an iframe and CMP may exist outside, so we"ll use postMessage to interact with CMP
		window.top.postMessage(getConsentDataReq, "*");
		window.addEventListener("message", receiveMessage);
	}
};

exports.getUserConsentDataFromLS = function () {
	// Adding dummy pubId to store data against
	var pubId = DUMMY_PUB_ID; //CONFIG.getPublisherId();
	var data = {c: "", g: 0};

	if (!isLocalStoreEnabled) {
		return data;
	}
	var pm;

	try {
		pm = window.localStorage.getItem(localStorageKey);
	} catch (e) {}
	if (pm && typeof pm === "string") {
		try {
			pm = JSON.parse(pm);
		} catch (e) {
			pm = {};
		}
		if (pm.hasOwnProperty(pubId)) {
			var pmRecord = pm[pubId];

			if (pmRecord && pmRecord.c && pmRecord.t) {
				// check timestamp of data and current; if older than a day do not use it
				if (pmRecord.t && parseInt(pmRecord.t, 10) > ((new Date()).getTime() - (24 * 60 * 60 * 1000))) {
					data.c = pmRecord.c;
					data.g = pmRecord.g;
				}
			}
		}
	}
	return data;
};
