require("prebid-universal-creative");

window.PWT = window.PWT || {};
window.pbjs = window.pbjs || {};

var refThis = this;

var typeString = "String";

/* start-test-block */
exports.isA = isA;
/* end-test-block */

exports.isString = function (object) {
	return toString.call(object) === "[object " + typeString + "]";
};

// Desc: Uses prebid js render ad function to call cache and render ad based on the params from response.
// Param Defination 
exports.renderCreative = function (theDocument, params) {
	if (params && params.cacheUrl && params.uuid) {
		try {
			window.pbjs.renderAd(theDocument, "", {
				cacheHost: params.cacheUrl,
				cachePath: params.cachePath,
				uuid: params.uuid,
				mediaType: "banner",
			});
		}
		catch(e){

		}
	}
};

exports.removeProtocolFromUrl = function (url) {
	if (isString(url)) {
		var outputUrl = url || "";
		if (url && url.length > 0) {
			url.replace(/^https{0,1}:\/\//i, "");
		}
		return outputUrl;
	}
}

///  Change name to general render function : renderOWCreative
window.PWT.renderOWCreative = function (theDocument, targetingKeys) {
	if (targetingKeys) {
		var cacheid = targetingKeys.cacheid || "";
		var cacheURL = targetingKeys.cacheURL || "";
		var cachePath = targetingKeys.cachePath || "/cache";
		if (cacheURL.length > 0 && cacheid.length > 0) {
			cacheURL = refThis.removeProtocolFromUrl(cacheURL); // removes protocol from url if present and returns host only
			refThis.renderCreative(theDocument, {
				cacheURL: cacheURL,
				cachePath: cachePath,
				uuid: cacheid
			});
		}
	} else {
		// Condition : Although the creative has won but it does not contain targeting keys required to render ad
		// error at dfp configuration.
	}
};