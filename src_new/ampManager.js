window.PWT = window.PWT || {};

var refThis = this;

exports.createScriptTag = function(url,onLoadCallback,onErrorCallback){
    var scriptTag = document.createElement("script");
    scriptTag.onload = onLoadCallback || function(){};
    scriptTag.onerror = onErrorCallback || function(){};
    scriptTag.src = url;
    return scriptTag;    
}

function displayCreativeCallback(creativeCode){
    if(creativeCode){
        var div =  document.createElement('div');
        div.innerHTML = creative.creativeCode;
        var bodyTag = document.getElementsByTagName('body')[0];  
        bodyTag.appendChild(div);
    }
}

exports.displayCreativeCallback = displayCreativeCallback;

exports.getCreative = function(cacheUrl,cacheId){
     if(cacheUrl && cacheId){
        var url = cacheUrl + "/cache?uuid=" + cacheId + '&callback=displayCreativeCallback'; ; // TODO : Pass more parameters to this 
        var scriptTag =  refThis.createScriptTag(url,
            function(res){
                // TODO : Fire Success Pixel if appplicable
                // debugger;
            },
            function(err){
                // TODO: Log error to new error endpoint with pubid and profileid
                // debugger;
            }
        );
        try{
            var bodyTag = document.getElementsByTagName('body')[0];     
            bodyTag.appendChild(scriptTag);
        }
        catch(err){
            // Error with DOM.
        }
     }
     else{
         // Missing Parameters : Log Error
     }
     // Pass pub id and profile id to cache for error reporting
     // Error Logging 
     // Build process is soft build of copying triggered through UI
     // 

}

window.PWT.renderAMPAd = function (targetingKeys) {
     var pwtecp = targetingKeys.pwtecp;
     var pwtbst = targetingKeys.pwtbst;
     var pwtdid = targetingKeys.pwtdid;
     var pwtpid = targetingKeys.pwtpid;
     var cacheid = targetingKeys.cacheid;
     var cacheURL = targetingKeys.cacheURL;
     refThis.getCreative(cacheURL,cacheid);
};
