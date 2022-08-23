adapterManagerRegisterAdapter((function() {

	var adapterID = 'aol',		
		
		//Note: we are not supporting region parameter
		constConfigPlacement = 'placement',
		constConfigNetwork = 'network',
		constConfigAlias = 'alias',
		constConfigServer = 'server',
		constConfigSizeId = 'sizeId',
		constConfigBidFloor = 'bidFloor',
		constConfigPageId = 'pageId',

		adapterConfigMandatoryParams = [constConfigNetwork, constConfigServer, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigPlacement],

		dealKey = constDealKeyFirstPart + adapterID,
		dealChannelValues = {},

		networkID = "",
		server = "",

		_addErrorBidResponse = function(divID, kgpv){
			bidManagerSetBidFromBidder(
		    	divID, 
		    	adapterID, 
		    	bidManagerCreateBidObject(
					0,
					bidManagerCreateDealObject(),
					"",
					"",
					"",
					0,
					0,
					kgpv
				)
			);

		},

		_addBidResponse = function(divID, kgpv, response){

			var bidData;

			try {
			    bidData = response.seatbid[0].bid[0];
			}catch(e){
			    _addErrorBidResponse(divID, kgpv);
			    return;
			}

			var cpm = (bidData.ext && bidData.ext.encp) ? bidData.ext.encp : bidData.price;
			var ad = bidData.adm;
			if(response.ext && response.ext.pixels){
			    ad += response.ext.pixels;
			}

			var keyValuePairs = {},
				bidID = utilGetUniqueIdentifierStr(),
				dealID = utilTrim(bidData.dealid),
				dealChannel = utilGetDealChannelValue(dealChannelValues, '')
			;
			if(bidData.dealid){
				keyValuePairs[dealKey] = dealChannel+constDealKeyValueSeparator+dealID+constDealKeyValueSeparator+bidID;
			}

			bidManagerSetBidFromBidder(
		    	divID, 
		    	adapterID, 
		    	bidManagerCreateBidObject(
					cpm,
					bidManagerCreateDealObject(dealID, dealChannel),
					bidData.crid,
					ad,
					"",					
					bidData.w,
					bidData.h,
					kgpv,
					keyValuePairs
				),
				bidID
			);
		},

		buildCall = function(bid){
			// template`${'protocol'}://${'host'}/pubapi/3.0/${'network'}/${'placement'}/${'pageid'}/${'sizeid'}/ADTECH;v=2;cmd=bid;cors=yes;alias=${'alias'}${'bidfloor'};misc=${'misc'}`;
			return utilMetaInfo.protocol + 
				server + 
				'/pubapi/3.0/' + 
				networkID + '/' + 
				bid[constConfigPlacement] + '/' + 
				(bid[constConfigPageId] || 0) + '/' + 
				(bid[constConfigSizeId] || 0) + 
				'/ADTECH;v=2;cmd=bid;cors=yes' + 
				(bid[constConfigAlias] ? ';alias='+bid[constConfigAlias] : '' ) + 
				(bid[constConfigBidFloor] ? ';bidfloor=' + bid[constConfigBidFloor].toString() : '') + 
				';misc=' + new Date().getTime()
			;
		},

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

			utilForEachGeneratedKey(
				adapterID,
				slotConfigMandatoryParams,
				activeSlots, 
				keyGenerationPattern, 
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
					utilAjaxCall(
						buildCall(keyConfig),
						function(response){

							if(!response && response.length <= 0){
								utilLog(adapterID+': Empty bid response');
								_addErrorBidResponse(currentSlot[constCommonDivID], generatedKey);
								return;
							}

							try{
								response = JSON.parse(response);
							}catch(e){
								utilLog(adapterID+': Invalid JSON in bid response');
								_addErrorBidResponse(currentSlot[constCommonDivID], generatedKey);
								return;
							}

							_addBidResponse(currentSlot[constCommonDivID], generatedKey, response);
						},
						null,
						{withCredentials: true}							
					);
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