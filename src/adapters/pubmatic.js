adapterManagerRegisterAdapter((function(){	

	win.bidDetailsMap = win.bidDetailsMap || {};
	win.progKeyValueMap = win.progKeyValueMap || {};
		
	var adapterID = 'pubmatic',

		constConfigPubID = 'pub_id',
		constPubId = 'pubId',
		constPubMaticResponseCreative = 'creative_tag',
		constPubMaticResponseTrackingURL = 'tracking_url',
		adapterConfigMandatoryParams = [constConfigPubID, constConfigKeyGeneratigPattern],
		slotConfigMandatoryParams = [],

		dealKey = constDealKeyFirstPart + adapterID,
		dealChannelValues = {
			1: constDealChannelPMP,
			5: constDealChannelPreffered,
			6: constDealChannelPMPG
		},

		pubID = 0,
		wrapperImpressionID = '',
		conf = {},
		pmSlotToDivIDMap = {},

		isPixelingDone = false,

		ortbEnabledPublishers = {5890:''},

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

		initConf = function(){
			conf[constPubId] = pubID;
			conf['wiid'] = wrapperImpressionID;
			//conf.pm_cb = 'DM.callBack';
			conf.pm_cb = 'window.PWT.PubmaticAdapterCallback';
			conf.grs = 3; // Grouped Response parameter, 0: default, 1: variables are split, 2: 1+rid passed to cback func, 3: 1+ md5 of bidid
			conf.a = 1;// async == true
			conf.sec = utilMetaInfo.secure;
			conf.js = 1;
			conf.pageURL  = utilMetaInfo.u;				
			conf.refurl   = utilMetaInfo.r;			
			conf.inIframe = win != top ? '1' : '0';
			conf.screenResolution =  win.screen.width + 'x' + win.screen.height;
			conf.ranreq = Math.random();

			conf.profileid = bidManagerGetProfileID();
			if(utilUsingDifferentProfileVersionID){
				conf.versionid = bidManagerGetProfileDisplayVersionID();
			}
			
			if(navigator.cookieEnabled === false ){
				conf.fpcd = '1';
			}
			setTimeStampAndZone( conf );
		},

		createOrtbJson = function(conf, slots, keyGenerationPattern){
			var json = null,
				loc = win.location,
				nav = win.navigator,
				passTheseConfParamsIntoDmExtension = ['a', 'pm_cb', 'pubId', 'ctype', 'kval_param', 'lmk', 'profileid', 'versionid'],
				copyFromConfAndDeleteFromConf = function(conf, key, dmExtension){
					if(conf[key]){
						dmExtension[key] = decodeURIComponent(conf[key]);
						delete conf[key];
					}
				},
				convertAllValuesToString = function(obj){
					var newObj = {};
					for(var key in obj){
						if(obj.hasOwnProperty(key)){
							newObj[key] = String(obj[key]);
						}
					}
					return newObj;
				}
			;			

			delete conf.grs; // as it is not required in ORTB call

			// setting up the schema
			json = {
				id : ''+utilGetCurrentTimestampInMs(),
				at: 2,
				cur: ["USD"],
				imp: [],
				site: {
					domain: loc.hostname,
					page: loc.href,
					publisher: {
						id: ''+pubID
					}
				},
				device: {
					ua: nav.userAgent
				},
				ext: {
					extension: {}
				}
			};

			// adding slots info
			for(var i= 0, l = slots.length; i < l; i++){
				var slot = slots[i];							

				var format = [];
				for(var k=0, kl = slot[constAdSlotSizes].length; k<kl; k++){
					var width = slot[constAdSlotSizes][k][0];
					var height = slot[constAdSlotSizes][k][1];
					format.push({
						w: parseInt(width),
						h: parseInt(height)
					});
				}

				var anImp = {
					id: slot[constCommonDivID],
					banner: {
						pos: 0,
						format: format
					},
					ext: {
						extension: {
							div: slot[constCommonDivID],
							adunit: slot[constAdUnitID],
							slotIndex: slot[constAdUnitIndex]/*,
							"keyValue": slot[constCommonSlotKeyValue]*/ // do not pass kval_param for now
						}
					}
				};

				json.imp.push(anImp);
			}

			//if there are no json.imp then return null
			if(json.imp.length == 0){
				return null;
			}

			// DM specific params
			var dmExtension = {
				rs: 1//todo confirm
			};
			
			for(var i=0, l = passTheseConfParamsIntoDmExtension.length; i < l; i++){
				copyFromConfAndDeleteFromConf(conf, passTheseConfParamsIntoDmExtension[i], dmExtension);
			}			
			json.ext.extension['dm'] = dmExtension;

			// AdServer specific params to be passed, as it is
			json.ext.extension['as'] = convertAllValuesToString(conf);

			return json;
		},

		makeOrtbCall = function(slots, keyGenerationPattern){
			var request_url = utilMetaInfo.protocol + 'hb.pubmatic.com/openrtb/24/',
				json = createOrtbJson(conf, slots, keyGenerationPattern)
			;
			if(json == null){
				utilLog(adapterID+': Error in generating ORTB json.')
				return;
			}

			utilAjaxCall(
				request_url,
				function(response){
					try{
						response = JSON.parse(response);
					}catch(e){
						utilLog(adapterID+constCommonMessage21);
						utilLog(e);
						return;
					}

					if(response.seatbid && response.seatbid[0]){
						var seatbid = response.seatbid[0];
						if(seatbid.bid && seatbid.bid.length > 0){
							var bids = seatbid.bid;
							for(var i=0, l=bids.length; i<l; i++){

								var responseBid = bids[i];

								if(responseBid.impid && responseBid.h && responseBid.w 
									&& responseBid.ext && responseBid.ext.extension
									&& responseBid.ext.extension.slotname){

									var keyValuePairs = {},
										bidID = utilGetUniqueIdentifierStr(),
										dealID = utilTrim(responseBid.dealid),
										dealChannel = utilGetDealChannelValue(dealChannelValues, utilTrim(responseBid.ext.extension.dealchannel))
									;

									if(dealID){
										keyValuePairs[dealKey] = dealChannel+constDealKeyValueSeparator+dealID+constDealKeyValueSeparator+bidID;
									}

									bidManagerSetBidFromBidder(
										responseBid.impid,
										adapterID,
										bidManagerCreateBidObject(
											responseBid.price,
											bidManagerCreateDealObject(dealID, dealChannel),
											"", 
											generateCreative(
												responseBid.adm,
												responseBid.ext.extension.trackingUrl,
												pubID
											),
											"",
											responseBid.w,
											responseBid.h,
											responseBid.ext.extension.slotname,
											keyValuePairs
										),
										bidID
									);
								}else{
									utilLog(adapterID+constCommonMessage21);
								}
							}
						}else{
							utilLog(adapterID+constCommonMessage21);
						}
					}else{
						utilLog(adapterID+constCommonMessage21);
					}
				},
				JSON.stringify(json),
				{} // todo later
			);
		},
		
		createLegacyCall = function(activeSlots, keyGenerationPattern){
		
			var request_url = "",
				tempURL,
				protocol = utilMetaInfo.protocol,
				adserver_url = 'haso.pubmatic.com/ads/',
				slots = [],
				dmPremiumPubList = {46076:'', 60530:'', 9999:'', 7777:''}
			;

			conf.profId = conf.profileid;
			delete conf.profileid;

			if(conf.versionid){
				conf.verId = conf.versionid;
				delete conf.versionid;
			}	

			utilForEachGeneratedKey(
				adapterID,
				slotConfigMandatoryParams,
				activeSlots, 
				keyGenerationPattern, 
				null, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
					slots.push( generatedKey );
					pmSlotToDivIDMap[ generatedKey ] = currentSlot[constCommonDivID];
					//todo: do pass kval_param_slots
				},
				true
			);

			if(slots.length > 0){				
				tempURL = (win.pm_dm_enabled != true && ! utilHasOwnProperty(dmPremiumPubList, conf[constPubId])) ? 'gads.pubmatic.com/AdServer/AdCallAggregator' : (adserver_url +  conf[constPubId] + '/GRPBID/index.html');
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
			if(isServerSideKey !== 'true'){				
				utilLog(adapterID+': '+constConfigServerSideKey+' should be set to true, setting it to true.')
				isServerSideKey = true;
			}

			pubID = adapterConfig[constConfigPubID] || 0;
			wrapperImpressionID = configObject.global.pwt.wiid;

			if(pubID == 0){
				utilLog(adapterID+': '+constConfigPubID+' should be non-zero.'+constCommonMessage07);
				return;
			}

			initConf();
			// do not pass kval_param for now
			//conf['kval_param'] = JSON.stringify(configObject[constConfigGlobalKeyValue]);

			if(utilHasOwnProperty(ortbEnabledPublishers, pubID)){
				makeOrtbCall(activeSlots, adapterConfig[constConfigKeyGeneratigPattern]);
			}else{
				utilLoadScript(createLegacyCall(activeSlots, adapterConfig[constConfigKeyGeneratigPattern]));
			}

			initiateUserSyncup();
		},

		generateCreative = function(creative, tracker, pubID){
			var isTrackerFirstEnabled = function(pubId){
					var config = {37576: ''}; // this is a whitelist
					return utilHasOwnProperty(config, pubId);
				}
			;	
			tracker = '<iframe frameborder="0" allowtransparency="true" marginheight="0" marginwidth="0" scrolling="no" width="0" hspace="0" vspace="0" height="0"'
				+ ' style="height:0px;width:0px;display:none;" src="' + decodeURIComponent(tracker) + '"></iframe>',				
				output = (isTrackerFirstEnabled(pubID) ? tracker : '') + decodeURIComponent(creative) + (isTrackerFirstEnabled(pubID) ? '' : tracker)
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
					
					var bid = bidDetailsMap[ progKeyValueMapDetails[5] ],
						bidID = utilGetUniqueIdentifierStr(),
						dealID = utilTrim(progKeyValueMapDetails[7]),
						keyValuePairs = {},
						dealChannel = utilGetDealChannelValue(dealChannelValues, utilTrim(bid.deal_channel))
					;

					if(dealID){
						keyValuePairs[dealKey] = dealChannel+constDealKeyValueSeparator+dealID+constDealKeyValueSeparator+bidID;
					}

					bidManagerSetBidFromBidder(
						pmSlotToDivIDMap[key], 
						adapterID, 
						bidManagerCreateBidObject(
							progKeyValueMapDetails[3],
							bidManagerCreateDealObject(dealID, dealChannel), 
							"", 
							generateCreative(bid[constPubMaticResponseCreative], bid[constPubMaticResponseTrackingURL], pubID), 
							"",
							bid[constCommonWidth],
							bid[constCommonHeight],
							key,
							keyValuePairs
						), 
						bidID
					);
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