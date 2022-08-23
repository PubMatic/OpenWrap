adapterManagerRegisterAdapter((function() {

	var adapterID = 'pulsePoint',
		jsLibURL = '//tag.contextweb.com/getjs.static.js',
		endPoint = '//bid.contextweb.com/header/tag',
		pubID = 0,
		constConfigPubID = 'cp',
		constConfigAdTagID = 'ct',
		adapterConfigMandatoryParams = [constConfigPubID, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigAdTagID],

		makeBidRequest = function(bidRequest){
			try{
				var ppBidRequest = new window.pp.Ad({
				    cf: bidRequest.cf,
				    cp: bidRequest.cp,
				    ct: bidRequest.ct,
				    cn: 1,
				    ca: window.pp.requestActions.BID,
				    cu: endPoint,
				    adUnitId: bidRequest.aui,
				    callback: bidResponseCallback(bidRequest)
				});
				ppBidRequest.display();
			}catch(e){
				utilLog(adapterID+constCommonMessage07);
	        	utilLog(e);
			}
		},

		bidResponseCallback = function(bidRequest) {
		    return function (bidResponse) {
		        bidResponseAvailable(bidRequest, bidResponse);
		    };
		},

		bidResponseAvailable = function(bidRequest, bidResponse) {
			var ecpm = 0,
				creativeHTML = ""
			;

			try{
			    if (bidResponse) {
			    	ecpm = bidResponse.bidCpm;
			    	creativeHTML = bidResponse.html;
			    }

			    bidManagerSetBidFromBidder(
			    	bidRequest.div, 
			    	adapterID, 
			    	bidManagerCreateBidObject(
						ecpm,
						bidManagerCreateDealObject(),
						"",
						creativeHTML,
						"",
						bidRequest.bw,
						bidRequest.bh,
						bidRequest.kgpv
					)
				);
			}catch(e){
				utilLog(adapterID+constCommonMessage21);
	        	utilLog(e);
			}
		},

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			pubID = adapterConfig[constConfigPubID];
			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			utilLoadScript(jsLibURL, function(){						
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
							var bidRequest = {
								cf: bidWidth + 'x' + bidHeight,
								cp: pubID,
								ct: keyConfig[constConfigAdTagID],
								aui: currentSlot[constCommonDivID] + '@' + bidWidth + 'x' + bidHeight,
								div: currentSlot[constCommonDivID],
								bw: bidWidth,
								bh: bidHeight,
								kgpv: generatedKey
							};
							makeBidRequest(bidRequest);
						}
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
