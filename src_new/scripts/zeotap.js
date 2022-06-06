exports.initZeoTapJs = function(params) {
	function addZeoTapJs() {
		var n = document, t = window;
		var userIdentity = owpbjs.getUserIdentities() || {};
		var enableSSO = CONFIG.isSSOEnabled() || false;
		var userIdentityObject = {
			email: enableSSO && userIdentity.emailHash ? userIdentity.emailHash['SHA256'] : userIdentity.pubProvidedEmailHash ? userIdentity.pubProvidedEmailHash['SHA256'] : undefined
		};
		var e=n.createElement("script");
		e.type="text/javascript",
		e.crossorigin="anonymous"
		e.async=!0 ,
		e.src="https://content.zeotap.com/sdk/idp.min.js",
		e.onload=function(){};
		n=n.getElementsByTagName("script")[0];
		var initialsationObject = {
			partnerId:params.partnerId,
			allowIDP: true,
			useConsent: (CONFIG.getCCPA() || CONFIG.getGdpr()),
			checkForCMP: (CONFIG.getCCPA() || CONFIG.getGdpr())
		};
		n.parentNode.insertBefore(e,n);

		n=t.zeotap||{_q:[],_qcmp:[]};

		!function(n,t,e) {
			for( var o=0 ;o<t.length;o++)
				!function(t) {
					n[t]=function(){
						n[e].push([t].concat(Array.prototype.slice.call(arguments, 0 )))
					}
				}(t[o])
		}(n,["callMethod"],"_q"),
		t.zeotap=n,
		t.zeotap.callMethod("init",initialsationObject),
		t.zeotap.callMethod("setUserIdentities",userIdentityObject, true);
	}

	if (document.readyState == 'complete') {
		addZeoTapJs();
	} else {
		window.addEventListener("load", function () {
			setTimeout(addZeoTapJs, 1000);
		});
	}
};