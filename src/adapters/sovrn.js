
/*
	Note: we are not accepting size from config, so we shall not be able to call Sovrn to fetch add of size 728x50 for adslot of 728x90
*/

adapterManagerRegisterAdapter((function() {

	var adapterID = 'sovrn',
		sovrnUrl = 'ap.lijit.com/rtb/bid',
		constConfigAdTagID = 'tagid',
		constConfigBidFloor = 'bidfloor',
		adapterConfigMandatoryParams = [constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigAdTagID],

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];
			var sovrnImps = [];
			var sovrnImpsInternal = {};

			utilForEachGeneratedKey(
				adapterID,
				slotConfigMandatoryParams,
				activeSlots,
				keyGenerationPattern,
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
					
					var adSlotSizes = kgpConsistsWidthAndHeight ? [[currentWidth, currentHeight]] : currentSlot[constAdSlotSizes];

					for(var n=0, l=adSlotSizes.length; n<l; n++){
						var bidWidth = adSlotSizes[n][0];
						var bidHeight = adSlotSizes[n][1];

						var imp = {
			                id: currentSlot[constCommonDivID] + '@' + bidWidth + 'x' + bidHeight,
			                banner: {
			                    w: bidWidth,
			                    h: bidHeight
			                },
			                tagid: keyConfig[constConfigAdTagID],
			                bidfloor: keyConfig[constConfigBidFloor]
			            };
			            sovrnImps.push(imp);

			            sovrnImpsInternal[imp.id] = {
			            	divID: currentSlot[constCommonDivID],
			            	kgpv: generatedKey
			            };
					}
				}
			);

			if(sovrnImps.length == 0){
				utilLog(adapterID+': sovrnImps array is empty');
				utilLog(adapterID+constCommonMessage07);
				return;
			}

			// build bid request with impressions
			var randomID = utilGetUniqueIdentifierStr();
	        var sovrnBidReq = {
	            id: randomID,
	            imp: sovrnImps,
	            site: {
	                domain: window.location.host,
	                page: window.location.pathname + location.search + location.hash
	            }
	        };

	        win.PWT.SovrnAdapterCallbacks[randomID] = bidResponseHandler(sovrnImpsInternal);

	        var scriptUrl = '//' + sovrnUrl + '?callback=window.PWT.SovrnAdapterCallbacks["'+randomID+'"]' + '&src=pwt&br=' + encodeURIComponent(JSON.stringify(sovrnBidReq));
	        utilLoadScript(scriptUrl);			
		},

		bidResponseHandler = function(requestImpressions){
			return function(sovrnResponseObj){
				try{
					if(sovrnResponseObj && sovrnResponseObj.id){
						if(sovrnResponseObj.seatbid && sovrnResponseObj.seatbid.length !== 0 && sovrnResponseObj.seatbid[0].bid && sovrnResponseObj.seatbid[0].bid.length !== 0){
							sovrnResponseObj.seatbid[0].bid.forEach(function(sovrnBid){

								if(!utilHasOwnProperty(requestImpressions,sovrnBid.impid)){
									return;
								}

								var requestBid = requestImpressions[sovrnBid.impid];
								bidManagerSetBidFromBidder(
							    	requestBid.divID, 
							    	adapterID, 
							    	bidManagerCreateBidObject(
										parseFloat(sovrnBid.price),
										bidManagerCreateDealObject(),
										"",
										decodeURIComponent(sovrnBid.adm + '<img src="' + sovrnBid.nurl + '">'),
										"",
										sovrnBid.w,
										sovrnBid.h,
										requestBid.kgpv
									)
								);

								delete requestImpressions[sovrnBid.impid];
							});
						}
					}

					// set zero ecpm bid for slots 
					for(var key in requestImpressions){
						if(utilHasOwnProperty(requestImpressions, key)){
							var requestBid = requestImpressions[key];
							bidManagerSetBidFromBidder(
						    	requestBid.divID, 
						    	adapterID, 
						    	bidManagerCreateBidObject(
									0,
									bidManagerCreateDealObject(),
									"",
									"",
									"",
									0,
									0,
									requestBid.kgpv
								)
							);
						}
					}

				}catch(e){
					utilLog(adapterID+constCommonMessage21);
					utilLog(e);
				}
			}
		}
	;

	win.PWT.SovrnAdapterCallbacks = {};

	return {
		fB: fetchBids,
		dC: utilDisplayCreative,
		ID: function(){
			return adapterID;
		}
	};
})());