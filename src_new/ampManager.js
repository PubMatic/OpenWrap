window.PWT = window.PWT || {};

exports.getCreative = function(cacheUrl,cacheId){
     var scriptTag = document.createElement("script");
     scriptTag.src = cacheUrl + "/cache?uuid=" + cacheId;
     var bodyTag = document.getElementsByTagName('body')[0];
     bodyTag.appendChild(scriptTag);
}

window.PWT.renderAMPAd = function (targetingKeys) {
     var pwtecp = targetingKeys.pwtecp;
     var pwtbst = targetingKeys.pwtbst;
     var pwtdid = targetingKeys.pwtdid;
     var pwtpid = targetingKeys.pwtpid;
     var cacheid = targetingKeys.cacheid;
     var cacheURL = targetingKeys.cacheURL;
    getCreative(cacheURL,cacheid);
};
