adapterManagerRegisterAdapter((function() {

	window.rubicontag = window.rubicontag || {};
    window.rubicontag.cmd = window.rubicontag.cmd || [];

	var adapterID = 'rubiconFastlanePreBid',
		constConfigRpAccount = 'accountId',
		constConfigRpSite = 'siteId',
		constConfigRpZone = 'zoneId',
		adapterConfigMandatoryParams = [constConfigRpAccount, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigRpSite, constConfigRpZone],
		dealKey = constDealKeyFirstPart + 'rubiconfast',
		dealChannelValues = {},
		rubiconAccountID = '',

		handleBidResponses = function(bidResponses){
			console.log(bidResponses);
			//todo many things
			// push to bidManager, needs kgpv and other details
		},
		
	    fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			rubiconAccountID = adapterConfig[constConfigRpAccount];
			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];			
			var adUnits = [];// create ad-units for prebid

			utilForEachGeneratedKey(
				adapterID,
				slotConfigMandatoryParams,
				activeSlots, 
				keyGenerationPattern, 
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
					var adUnit = {
							code: currentSlot[constCommonDivID],
							sizes: currentSlot[constAdSlotSizes], //todo: do we need to consider kgpConsistsWidthAndHeight
							bids: []
						},
						bid = {
							bidder: 'rubicon',
							params: {}
						}
					;

					bid.params.accountId = rubiconAccountID;
					var copyParams = [constConfigRpSite, constConfigRpZone, 'userId', 'position'/*,'visitor', 'keywords', 'inventory'*/];
					for(var i =0; i<copyParams.length; i++){
						var paramKey = copyParams[i];
						if(utilHasOwnProperty(keyConfig, paramKey)){
							bid.params[paramKey] = keyConfig[paramKey]		
						}
					}
					adUnit.bids.push(bid);
					adUnits.push(adUnit);
				}
			);

			if(adUnits.length > 0){
				if(pbjs && utilIsFn(pbjs.addAdUnits)){
					pbjs.addAdUnits(adUnits);
					pbjs.requestBids({
	                    bidsBackHandler: function(bidResponses) {
							handleBidResponses(bidResponses);
							pbjs.que.push(function(){
								pbjs.setTargetingForGPTAsync();
							});
	                    },
	                    timeout: TIMEOUT
					});
				}
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
