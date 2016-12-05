adapterManagerRegisterAdapter((function() {

	var adapterID = 'pulsePoint',
		
		jsLibURL = '//tag.contextweb.com/getjs.static.js',
		endPoint = '//bid.contextweb.com/header/tag',		
		
		//Note: we are not supporting region parameter
		constConfigPlacement = 'placement',
		constConfigNetwork = 'network',
		constConfigAlias = 'alias',
		constConfigServer = 'server',
		constConfigSizeId = 'sizeId',
		constConfigBidFloor = 'bidFloor',

		adapterConfigMandatoryParams = [constConfigNetwork, constConfigServer, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigPlacement],

		networkID = "",
		server = "",

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			networkID = adapterConfig[constConfigNetwork];
			server = adapterConfig[constConfigServer];

			utilLoadScript(jsLibURL, function(){
				utilForEachGeneratedKey(
					adapterID,
					slotConfigMandatoryParams,
					activeSlots, 
					keyGenerationPattern, 
					keyLookupMap, 
					function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
					}
				);
			});
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