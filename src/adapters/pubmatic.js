adapterManagerRegisterAdapter((function(){	

	win.bidDetailsMap = win.bidDetailsMap || {};
	win.progKeyValueMap = win.progKeyValueMap || {};
		
	var adapterID = 'pubmatic',

		constConfigPubID = 'pub_id',
		constPubId = 'pubId',
		constPubMaticResponseCreative = 'creative_tag',
		constPubMaticResponseTrackingURL = 'tracking_url',
		adapterConfigMandatoryParams = [constConfigPubID, constConfigKeyGeneratigPattern, constConfigServerSideKey],
		slotConfigMandatoryParams = [],

		pubID = 0,
		wrapperImpressionID = '',
		pmSlotToDivIDMap = {},

		isPixelingDone = false,

		setTimeStampAndZone = function(conf) {
			var currTime = new Date();
			conf.kltstamp  = currTime.getFullYear()
								+ "-" + (currTime.getMonth() + 1)
								+ "-" + currTime.getDate()
								+ " " + currTime.getHours()
								+ ":" + currTime.getMinutes()
								+ ":" + currTime.getSeconds();
			conf.timezone = currTime.getTimezoneOffset()/60  * -1;
		},

		initiateUserSyncup = function(){
			if( ! isPixelingDone ){
				setTimeout(function(){
					var element = doc.createElement('iframe');
					element.src = utilMetaInfo.protocol + 'ads.pubmatic.com/AdServer/js/showad.js#PIX&kdntuid=1&p=' + pubID + '&s=&a=';
					element.style.height ="0px";
					element.style.width ="0px";
					doc.getElementsByTagName("script")[0].parentNode.appendChild(element);
					isPixelingDone = true;
				}, 2000);				
			}
		},
		
		createCall = function(activeSlots, keyGenerationPattern){
		
			var request_url = "",
				tempURL,
				protocol = utilMetaInfo.protocol,
				adserver_url = 'haso.pubmatic.com/ads/',
				slots = [],
				conf = {},
				lessOneHopPubList = {46076:'', 60530:'', 9999:'', 7777:''}
			;

			utilForEachGeneratedKey(
				activeSlots, 
				keyGenerationPattern, 
				{}, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
					slots.push( generatedKey );
					pmSlotToDivIDMap[ generatedKey ] = currentSlot[constCommonDivID];
				}
			);

			if(slots.length > 0){
				conf[constPubId] = pubID;
				conf['wiid'] = wrapperImpressionID;
				conf.pm_cb = 'window.PWT.PubmaticAdapterCallback';
				conf.grs = 3; // Grouped Response parameter, 0: default, 1: variables are split, 2: 1+rid passed to cback func, 3: 1+ md5 of bidid
				conf.a = 1;// async == true
				conf.sec = utilMetaInfo.secure;
				conf.pageURL  = utilMetaInfo.u;
				conf.refurl   = utilMetaInfo.r;
				conf.inIframe = win != top ? '1' : '0';
				conf.screenResolution =  win.screen.width + 'x' + win.screen.height;
				conf.ranreq = Math.random();

				conf.profId = bidManagerGetProfileID();
				if(utilUsingDifferentProfileVersionID){
					conf.verId = bidManagerGetProfileDisplayVersionID();
				}
				
				if(navigator.cookieEnabled === false ){
					conf.fpcd = '1';
				}
				setTimeStampAndZone( conf );

				tempURL = (win.pm_dm_enabled != true && ! utilHasOwnProperty(lessOneHopPubList, conf[constPubId])) ? 'gads.pubmatic.com/AdServer/AdCallAggregator' : (adserver_url +  conf[constPubId] + '/GRPBID/index.html');
				request_url = protocol + tempURL + '?' + utilToUrlParams(conf);
				request_url += '&adslots=' + encodeURIComponent('[' + slots.join(',') +']');
			}
			
			return request_url;
		},

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}
						
			var isServerSideKey = adapterConfig[constConfigServerSideKey];
			if(isServerSideKey == false){
				utilLog(adapterID+': '+constConfigServerSideKey+' should be true.'+constCommonMessage07)
				return;
			}

			pubID = adapterConfig[constConfigPubID];
			wrapperImpressionID = configObject.global.pwt.wiid;

			if(pubID == 0){
				utilLog(adapterID+': '+constConfigPubID+' should be non-zero.'+constCommonMessage07)
				return;
			}

			utilLoadScript(createCall(activeSlots, adapterConfig[constConfigKeyGeneratigPattern]));
			initiateUserSyncup();
		},

		generateCreative = function(creative, tracker, pubID){
			var isTrackerFirstEnabled = function(pubId){
					var config = {37576: ''}; // this is a whitelist
					return utilHasOwnProperty(config, pubId);
				},				
				tracker = '<iframe frameborder="0" allowtransparency="true" marginheight="0" marginwidth="0" scrolling="no" width="0" hspace="0" vspace="0" height="0"'
				+ ' style="height:0p;width:0p;display:none;" src="' + decodeURIComponent(tracker) + '"></iframe>',
				output = (isTrackerFirstEnabled(pubID) ? tracker : '') + decodeURIComponent(creative) + (!isTrackerFirstEnabled(pubID) ? '' : tracker)
			;

			if(win.PubMaticAI!=null){
				output = "<span class='PubAdAI'>" + output + "</span>";
			}

			return output;
		}
	;

	win.PWT.PubmaticAdapterCallback = function(){
		var localProgKeyValueMap = win.progKeyValueMap,
			bidDetailsMap = win.bidDetailsMap
		;

		win.progKeyValueMap = {};
		for( var key in localProgKeyValueMap){

			if( utilHasOwnProperty(localProgKeyValueMap, key) ){

				var progKeyValueMapDetails = localProgKeyValueMap[key].split(';');
				var progKeyValueMapDetailsLength = progKeyValueMapDetails.length;
				if(progKeyValueMapDetailsLength == 8){
					
					var bidObject = bidManagerCreateBidObject(
						parseFloat(progKeyValueMapDetails[3]), 
						progKeyValueMapDetails[7], 
						"", 
						generateCreative(bidDetailsMap[ progKeyValueMapDetails[5] ][constPubMaticResponseCreative], bidDetailsMap[ progKeyValueMapDetails[5] ][constPubMaticResponseTrackingURL], pubID), 
						"",
						bidDetailsMap[ progKeyValueMapDetails[5] ][constCommonWidth],
						bidDetailsMap[ progKeyValueMapDetails[5] ][constCommonHeight],						
						key
					);					
					bidManagerSetBidFromBidder(pmSlotToDivIDMap[key], adapterID, bidObject);
				}
			}
		}
	};
	
	return {
		fB: fetchBids,
		dC: utilDisplayCreative,
		ID: function(){
			return adapterID;
		}
	};
})());