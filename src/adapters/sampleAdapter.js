adapterManagerRegisterAdapter((function(){

	var adapterID = 'sample',
		endPointURL = 'bid.sampleAdapter.com/server?',
		constConfigPubID = 'pubID',
		constSlotConfigAdID = 'adID',

		// mention all mandatory parameters expected in adapter config
		adapterConfigMandatoryParams = [constConfigKeyGeneratigPattern, constConfigKeyLookupMap, constConfigPubID],

		// mention all mandatory parameters expected in slot config
		slotConfigMandatoryParams = [constSlotConfigAdID],

		internalMap = {},

		// this function will be called by AdapterManager
		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			try{

				var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID);
				if(!utilCheckMandatoryParams(adapterConfig, adapterConfigMandatoryParams, adapterID)){
					utilLog(adapterID+constCommonMessage07);
					return;
				}

				var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
				var keyLookupMap = adapterConfig[constConfigKeyLookupMap];
				var pubID = adapterConfig[constConfigPubID];

				// generate all possible keys for each adSlot from keyGenerationPattern
				utilForEachGeneratedKey(
					activeSlots, 
					keyGenerationPattern, 
					keyLookupMap, 

					// this function will be executed for each generated key
					function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
						
						// check whether config is valid
						if(!keyConfig){
							utilLog(adapterID+': '+generatedKey+constCommonMessage08);
							return;
						}

						// check for slotLevel mandatory params
						if(!utilCheckMandatoryParams(keyConfig, slotConfigMandatoryParams, adapterID)){
							utilLog(adapterID+': '+generatedKey+constCommonMessage09);
							return;
						}

						var randomID = utilGetUniqueIdentifierStr();
						win.PWT.SampleAdapterCallbacks[randomID] = new (function(){
							var theRandomID = randomID;
							this.callback = function(response){
								callBackFunction(response, theRandomID);
							}
						})();

						// keep track of impressions with necessary information to be used
						internalMap[randomID] = {};
						internalMap[randomID][constCommonConfig] = {
							'divID': currentSlot[constCommonDivID]
						};
						internalMap[randomID][constCommonKeyGenerationPatternValue] = generatedKey;

						// calling bid-server
						utilLoadScript(
							utilMetaInfo.protocol+
							endPointURL+
							constConfigPubID+'='+pubID+'&'+
							constSlotConfigAdID+'='+keyConfig[constSlotConfigAdID]+'&'+
							'width='+currentWidth+'&'+
							'height='+currentHeight+'&'+
							'callback=window.parent.PWT.RubiconAdapterCallbacks["'+randomID+'"].callback'
						);
					}
				);		

			}catch(e){}
		},

		// bid-server response handler
		callBackFunction = function(response, theRandomID){
			if (response && response.status === 'ok') {
				try {
					var bidDetails = internalMap[getBidId(response, theRandomID)];
					if(bidDetails){

						// creating bid object from the response
						bidObject = bidManagerCreateBidObject(
							response.cpm,
							response.deal_id,
							response.ad_id,
							'<script>' + response.ad_script + '</script>',
							response.ad_url,
							response.width,
							response.height,
							bidDetails[constCommonKeyGenerationPatternValue]
						);

						// passing bid to the bid manager
						bidManagerSetBidFromBidder(bidDetails[constCommonConfig][constCommonDivID], adapterID, bidObject);
					}
				}catch(e){}
			}	
		}
	;

	win.PWT.SampleAdapterCallbacks = {};

	return {
		// fB: fetchBids function is used to initiate bids fetching from adapter
		fB: fetchBids,
		// dC: displayCreative function is used to display creative
		// if required you may mention custom function here		
		dC: utilDisplayCreative,
		// ID: this function returns adapterID
		ID: function(){
			return adapterID;
		}
	};
})());