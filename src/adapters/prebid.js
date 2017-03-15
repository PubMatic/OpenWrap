adapterManagerRegisterAdapter((function() {

	var adapterID = 'prebid',
		pbPrefix = 'PB_',
		kgpvMap = {},
		
		adapterConfigMandatoryParams = [constConfigKeyGeneratigPattern, constConfigKeyLookupMap],

		handleBidResponses = function(bidResponses){
			for(var responseID in bidResponses){
				if(utilHasOwnProperty(bidResponses, responseID) && utilHasOwnProperty(kgpvMap, responseID)){
					var bidObject = bidResponses[responseID];
					var bids = bidObject.bids || [];

					for(var i = 0; i<bids.length; i++){
						var bid = bids[i];
						if(bid.bidderCode){
							bidManagerSetBidFromBidder(
								kgpvMap[responseID].divID, 
								pbPrefix + bid.bidderCode, 
								bidManagerCreateBidObject(
									bid.cpm,
									bidManagerCreateDealObject(bid.dealId, "NA"),
									"",
									bid.ad,
									"",
									bid.width,
									bid.height,
									kgpvMap[responseID].kgpv,
									bid.adserverTargeting || null
								), 
								utilGetUniqueIdentifierStr()
							);
						}
					}
				}
			}			
		},
		
		generatePbConf = function(pbAdapterID, configObject, activeSlots, adUnits){

			var adapterIdInPreBid = pbAdapterID.replace(pbPrefix, '');

			utilLog(pbAdapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, pbAdapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}
			
			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			utilForEachGeneratedKey(
				pbAdapterID,
				[],
				activeSlots, 
				keyGenerationPattern, 
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){					
					
					var code, sizes;

					if(kgpConsistsWidthAndHeight){
						code = currentSlot[constCommonDivID] + '@' + adapterIdInPreBid + '@' + currentWidth + 'X' + currentHeight;
						sizes = [[currentWidth, currentHeight]];
					}else{
						code = currentSlot[constCommonDivID];
						sizes = currentSlot[constAdSlotSizes];
					}

					kgpvMap [ code ] = {
						kgpv: generatedKey,
						divID: currentSlot[constCommonDivID]	
					};
				
					if(!utilHasOwnProperty(adUnits, code)){
						adUnits[ code ] = {
							code: code,
							sizes: sizes,
							bids: []
						};
					}

					var adUnit = adUnits[ code ],
						bid = {
							bidder: adapterIdInPreBid,
							params: keyConfig
						}
					;
					adUnit.bids.push(bid);					
				}
			);
		},

		fetchBids = function(configObject, activeSlots){

			if(! window.pbjs){
				utilLog('PreBid js is not loaded');	
				return;
			}

			/* read own config, anything to read ? */
			//todo add a farzi conf param

			var adUnits = {};// create ad-units for prebid

			for(var pbAdapterID in configObject['global']['adapters']){
				if(utilHasOwnProperty(configObject['global']['adapters'], pbAdapterID) && pbAdapterID.indexOf(pbPrefix) == 0){
					generatePbConf(pbAdapterID, configObject, activeSlots, adUnits);
				}
			}			

			// adUnits is object create array from it
			var adUnitsArray = [];
			for(var code in adUnits){
				if(utilHasOwnProperty(adUnits, code)){
					adUnitsArray.push(adUnits[code]);
				}
			}

			if(adUnitsArray.length > 0){
				if(pbjs && utilIsFn(pbjs.addAdUnits)){
					pbjs.addAdUnits(adUnitsArray);
					pbjs.requestBids({
	                    bidsBackHandler: function(bidResponses) {
							handleBidResponses(bidResponses);							
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