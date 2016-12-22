adapterManagerRegisterAdapter((function() {

	var adapterID = 'openx',

		constConfigJsTagUrl = 'jstag_url',
		constConfigPageID = 'pgid',
		constConfigUnit = 'unit',
		adapterConfigMandatoryParams = [constConfigJsTagUrl, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigUnit],

		// metaInfo
		opts = {
			pageURL: utilMetaInfo.u,
			refererURL: utilMetaInfo.r,
			pgid: 0
		},

		internalMap = {},

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];
			var doCall = 0;
			var scriptUrl = adapterConfig[constConfigJsTagUrl];
			if( utilHasOwnProperty(adapterConfig, constConfigPageID) ){
				opts[constConfigPageID] = adapterConfig[constConfigPageID];
			}

			utilForEachGeneratedKey(
				adapterID,
				slotConfigMandatoryParams,
				activeSlots, 
				keyGenerationPattern, 
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
					
					var callbackId = utilGetUniqueIdentifierStr();
					internalMap[callbackId] = {};								
					internalMap[callbackId][constCommonConfig] = {
						'params': keyConfig,
						'divID': currentSlot[constCommonDivID], 				
						'sizes': currentSlot[constAdSlotSizes]
					};
					internalMap[callbackId][constCommonKeyGenerationPatternValue] = generatedKey;
					doCall = 1;
				}
			);

			if(doCall){
				_requestBids(scriptUrl);
			}
		},

		_requestBids = function(scriptUrl) {
			if (scriptUrl) {
				utilLoadScript(scriptUrl, function() {
					try{
						var i;
						var POX = OX();

						POX.setPageURL(opts.pageURL);
						POX.setRefererURL(opts.refererURL);
						POX.addPage(opts.pgid);
						
						for(i in internalMap){
							if(utilHasOwnProperty(internalMap, i)){
								POX.addAdUnit(internalMap[i][constCommonConfig][constCommonParams][constConfigUnit]);	
							}						
						}

						POX.addHook(function(response) {
							try{
								var id,
									bid,
									adUnit,
									bidObject,
									constPubRev = 'pub_rev',
									constAdID = 'ad_id',
									constAdURL = 'ad_url',
									constAdHTML= 'html',
									constAdWidth = 'width',
									constAdHeight = 'height'
								;

								utilLog(adapterID+constCommonMessage05);

								for(id in internalMap){
									if( utilHasOwnProperty(internalMap, id) && internalMap[id]['exp'] != true ){

										bid = internalMap[id];
										adUnit = response.getOrCreateAdUnit(bid.config[constCommonParams][constConfigUnit]);

										if (adUnit.get(constPubRev)) {

											bidObject = bidManagerCreateBidObject(
												Number(adUnit.get(constPubRev)) / 1000,
												bidManagerCreateDealObject(),
												adUnit.get(constAdID),
												adUnit.get(constAdHTML),
												adUnit.get(constAdURL),
												adUnit.get(constAdWidth),
												adUnit.get(constAdHeight),
												bid[constCommonKeyGenerationPatternValue]
											);

										} else {

											utilLog(adapterID + ": Required details not available");

											bidObject = bidManagerCreateBidObject(
												0,
												bidManagerCreateDealObject(),
												"",
												"",
												"",
												0,
												0,
												bid[constCommonKeyGenerationPatternValue]
											);									
										}

										bidManagerSetBidFromBidder(bid.config[constCommonDivID], adapterID, bidObject);
										// need to mark these bids as expeired to confirm that this bid is noyt used again
										internalMap[id]['exp'] = true;
									}
								}
							}catch(e){}

						}, OX.Hooks.ON_AD_RESPONSE);

						// Make request
						POX.load();
					}catch(e){}
				});
			}
		}
	;
		
	return {
		fB: fetchBids,
		dC: utilDisplayCreative,
		ID: function(){
			return adapterID;
		}
	};
})());