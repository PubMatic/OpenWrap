require("prebid-universal-creative");

window.PWT = window.PWT || {};
window.pbjs = window.pbjs || {};

var refThis = this;

// Desc: Uses prebid js render ad function to call cache and render ad based on the params from response.
// Param Defination 
exports.renderCreative = function (cacheUrl, cachePath, uuid) {
	if (cacheUrl && uuid) {
		window.pbjs.renderAd(document, "", {
			cacheHost: cacheUrl,
			cachePath: cachePath,
			uuid: uuid,
			mediaType: "banner",
		});
	}
};

exports.removeProtocolFromUrl = function(url){
	var outPuturl = url || "";
	if(url && url.length > 0){
		outPuturl = url.replace(/^http:\/\//i, "");
		outPuturl = url.replace(/^https:\/\//i, "");
	}
	return outPuturl;
}

///  Change name to general render function : renderOWCreative
window.PWT.renderOWCreative = function (targetingKeys) {
	if (targetingKeys) {
		var cacheid = targetingKeys.cacheid || "";
		var cacheURL = targetingKeys.cacheURL || "";
		var cachePath = targetingKeys.cachePath || "/cache";
		if (cacheURL.length > 0 && cacheid.length > 0) {
		    cacheUrl = refThis.removeProtocolFromUrl(cacheURL); // removes protocol from url if present and returns host only
			refThis.renderCreative(cacheURL, cachePath, cacheid);
		}
	} else {
		// Condition : Although the creative has won but it does not contain targeting keys required to render ad
		// error at dfp configuration.
	}
};