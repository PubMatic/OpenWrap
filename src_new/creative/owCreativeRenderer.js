require("prebid-universal-creative");

window.PWT = window.PWT || {};
window.pbjs = window.pbjs || {};

var refThis = this;

var typeString = "String";

exports.isString = function (object) {
	return toString.call(object) === "[object " + typeString + "]";
};

// Desc: Uses prebid js render ad function to call cache and render ad based on the params from response.
// Param Definition 
exports.renderCreative = function (theDocument, params) {
	if (params && params.cacheURL && params.uuid) {
		try {
			window.pbjs.renderAd(theDocument, "", {
				cacheHost: params.cacheURL,
				cachePath: params.cachePath,
				uuid: params.uuid,
				mediaType: "banner",
				size: params.size
			});
		}
		catch(e){

		}
	}
};

exports.removeProtocolFromUrl = function (url) {
	if (refThis.isString(url)) {
		var outputUrl = url || "";
		if (url && url.length > 0) {
			outputUrl= url.replace(/^https{0,1}:\/\//i, "");
		}
		return outputUrl;
	}
	return "";
}

///  Change name to general render function : renderOWCreative
window.PWT.renderOWCreative = function (theDocument, targetingKeys) {
	if (targetingKeys) {
		var cacheid = targetingKeys.pwtcid || "";
		var cacheURL = targetingKeys.pwtcurl || "";
		var cachePath = targetingKeys.pwtcpath || "/cache";
		var size = targetingKeys.pwtsz ;
		if (cacheURL.length > 0 && cacheid.length > 0) {
			cacheURL = refThis.removeProtocolFromUrl(cacheURL); // removes protocol from url if present and returns host only
			refThis.renderCreative(theDocument, {
				cacheURL: cacheURL,
				cachePath: cachePath,
				uuid: cacheid,
				size: size
			});
		}
	} else {
		// Condition : Although the creative has won but it does not contain targeting keys required to render ad
		// error at dfp configuration.
		console.warn("Warning: No Targeting keys returned from adserver");
	}
};