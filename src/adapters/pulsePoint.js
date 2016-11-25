adapterManagerRegisterAdapter((function() {

	var adapterID = 'pulsePoint',
		jsLibURL = '//tag.contextweb.com/getjs.static.js',
		endPoint = '//bid.contextweb.com/header/tag',
		pubID = 0,
		constConfigPubID = 'cp',
		constConfigAdTagID = 'ct',

		makeBidRequest = function(bidRequest){
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

		    if (bidResponse) {
		    	ecpm = bidResponse.bidCpm;
		    	creativeHTML = bidResponse.html;
		    }

		    bidManagerSetBidFromBidder(
		    	bidRequest.div, 
		    	adapterID, 
		    	bidManagerCreateBidObject(
					ecpm,
					"",
					"",
					creativeHTML,
					"",
					bidRequest.bw,
					bidRequest.bh,
					bidRequest.kgpv
				)
			);
		},

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID);
			if(!utilCheckMandatoryParams(adapterConfig, [constConfigPubID, constConfigKeyGeneratigPattern, constConfigKeyLookupMap], adapterID)){
				utilLog(adapterID+constCommonMessage07);
				return;
			}

			pubID = adapterConfig[constConfigPubID];
			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			utilForEachGeneratedKey(
				activeSlots, 
				keyGenerationPattern, 
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){

					if(!keyConfig){
						utilLog(adapterID+': '+generatedKey+constCommonMessage08);
						return;
					}

					if(!utilCheckMandatoryParams(keyConfig, [constConfigAdTagID], adapterID)){
						utilLog(adapterID+': '+generatedKey+constCommonMessage09);
						return;
					}

					var adSlotSizes = kgpConsistsWidthAndHeight ? [[currentWidth, currentHeight]] : currentSlot[constAdSlotSizes];
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
			);	
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
