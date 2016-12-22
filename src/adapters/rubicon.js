adapterManagerRegisterAdapter((function() {

	var adapterID = 'rubicon',

		constConfigRpAccount 	= 'rp_account',
		constConfigRpSite		= 'rp_site',
		constConfigRpZoneSize	= 'rp_zonesize',
		constConfigRpTracking	= 'rp_tracking',
		constConfigRpInventory	= 'rp_inventory',
		constConfigRpFloor		= 'rp_floor',
		constConfigRpVisitor	= 'rp_visitor',

		adapterConfigMandatoryParams = [constConfigRpAccount, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigRpSite, constConfigRpZoneSize],

		rubiconAccountID = '',

		// Map size dimensions to size 'ID'
		sizeMap = {},
		internalMap = {},

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			rubiconAccountID = adapterConfig[constConfigRpAccount];
			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			utilForEachGeneratedKey(
				adapterID,
				slotConfigMandatoryParams,
				activeSlots, 
				keyGenerationPattern, 
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){

					var randomID = utilGetUniqueIdentifierStr();
					win.PWT.RubiconAdapterCallbacks[randomID] = new (function(){
						var theRandomID = randomID;
						this.callback = function(response){
							callBackFunction(response, theRandomID);
						}
					})();
					
					var callbackId = getBidId({'params': keyConfig}, randomID);

					internalMap[callbackId] = {};
					internalMap[callbackId][constCommonConfig] = {
						'params': keyConfig,
						'divID': currentSlot[constCommonDivID], 				
						'sizes': currentSlot[constAdSlotSizes]
					};
					internalMap[callbackId][constCommonKeyGenerationPatternValue] = generatedKey;

					var iframeContents = createRequestContent(
						internalMap[callbackId][constCommonConfig],
						'window.parent.PWT.RubiconAdapterCallbacks["'+randomID+'"].callback',
						internalMap[callbackId][constCommonConfig][constCommonSizes][0][0],
						internalMap[callbackId][constCommonConfig][constCommonSizes][0][1]
					);

					internalMap[callbackId][constCommonConfig].iframeID = loadIframeContent(iframeContents);
				}	
			);			
		},
		
		getBidId = function(bid, randomID) {
			return (bid[constCommonParams] ? [rubiconAccountID, bid[constCommonParams].rp_site, bid[constCommonParams].rp_zonesize, randomID] :				[bid.account_id, bid.site_id, bid.zone_id, bid.size_id, randomID]).join('-');
		},

		loadIframeContent = function(content) {
			try{
				var iframe = utilCreateInvisibleIframe();
				if(!iframe){
					throw {message: 'Failed to create invisible frame.', name:""};
				}

				var elToAppend = document.getElementsByTagName('head')[0];
				elToAppend.insertBefore(iframe, elToAppend.firstChild);

				if(!iframe.contentWindow){
					throw {message: 'Unable to access frame window.', name:""};
				}

				var iframeDoc = iframe.contentWindow.document;
				if(!iframeDoc){
					throw {message: 'Unable to access frame window document.', name:""};
				}

				iframeDoc.write(content);
				iframeDoc.close();
				return iframe.id;
			}catch(e){
				utilLog(adapterID+': error in calling bids.');
				utilLog(e);
			}
		},

		createRequestContent = function(bidOptions, callback, width, height) {

			var params = bidOptions[constCommonParams];

			sizeMap[params[constConfigRpZoneSize].split('-')[1]] = {
				width: width,
				height: height
			};

			var content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><scr' + 'ipt>inDapIF=true;</scr' + 'ipt></head>';
			content += '<body>';
			content += '<scr' + 'ipt>';
			content += '' +
				'window.rp_account  	= "'+rubiconAccountID+'";' +
				'window.rp_site     	= "'+params[constConfigRpSite]+'";' +
				'window.rp_zonesize 	= "'+params[constConfigRpZoneSize]+'";' +
				'window.rp_tracking 	= "'+(params[constConfigRpTracking] ? params[constConfigRpTracking] : '')+'";' +
				'window.rp_visitor 		= "'+(params[constConfigRpVisitor] ? params[constConfigRpVisitor] : '{}')+'";' +
				'window.rp_width 		=  '+width+';' +
				'window.rp_height 		=  '+height+';' +
				'window.rp_adtype   	= "jsonp";' +
				'window.rp_inventory 	= "'+(params[constConfigRpInventory] ? params[constConfigRpInventory] : '{}')+'";' +
				'window.rp_floor 		= '+(params[constConfigRpFloor] ? params[constConfigRpFloor] : '0.00')+';' +
				'window.rp_callback 	= ' + callback + ';';
			content += '</scr' + 'ipt>';
			content += '<scr' + 'ipt src="https://ads.rubiconproject.com/ad/'+rubiconAccountID+'.js"></scr' + 'ipt>';
			content += '</body></html>';
			return content;
		},

		callBackFunction = function(response, theRandomID) {			

			var divID = '';
			utilLog(adapterID+constCommonMessage05);
			if (response && response.status === 'ok') {
				try {
					var iframeID = '';
					var bidObj = internalMap[getBidId(response, theRandomID)];

					if (bidObj) {
						divID = bidObj[constCommonConfig][constCommonDivID];
						bidObj.status = 1;
						iframeID = bidObj[constCommonConfig].iframeID;
					}

					if (response.ads && response.ads[0]) {
						var rubiconAd = response.ads[0];
						var size = sizeMap[response.size_id];
						var width = 0;
						var height = 0;
						var bidObject;

						if(rubiconAd.status != "no-ads"){

							if(rubiconAd.size_id){
								var iframeObj = window.frames[iframeID];
								var rubiconObj = iframeObj.contentWindow.RubiconAdServing;
								if (rubiconObj && rubiconObj.AdSizes) {
									size = rubiconObj.AdSizes[rubiconAd.size_id];
									var sizeArray = size.dim.split('x');
									width = sizeArray[0];
									height = sizeArray[1];
								}
							}

							bidObject = bidManagerCreateBidObject(
								rubiconAd.cpm,
								bidManagerCreateDealObject(),
								rubiconAd.ad_id,
								'<script>' + rubiconAd.script + '</script>',
								"",
								width,
								height,
								bidObj[constCommonKeyGenerationPatternValue]
							);

						}else{

							bidObject = bidManagerCreateBidObject(
								0,
								bidManagerCreateDealObject(),
								"",
								"",
								"",
								width,
								height,
								bidObj[constCommonKeyGenerationPatternValue]
							);
						}

						bidManagerSetBidFromBidder(bidObj[constCommonConfig][constCommonDivID], adapterID, bidObject);					
					}

				} catch (e) {
					utilLog('Error parsing rubicon response bid: ' + e.message);
				}
			}
		}
	;

	win.PWT.RubiconAdapterCallbacks = {};

	return {
		fB: fetchBids,
		dC: utilDisplayCreative,
		ID: function(){
			return adapterID;
		}
	};
})());