adapterManagerRegisterAdapter((function() {

	window.rubicontag = window.rubicontag || {};
    window.rubicontag.cmd = window.rubicontag.cmd || [];

	var adapterID = 'rubiconFastlane',
		constConfigRpAccount = 'accountId',
		constConfigRpSite = 'siteId',
		constConfigRpZone = 'zoneId',
		adapterConfigMandatoryParams = [constConfigRpAccount, constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		slotConfigMandatoryParams = [constConfigRpSite, constConfigRpZone],
		dealKey = constDealKeyFirstPart + 'rubiconfast',
		dealChannelValues = {},
		rubiconAccountID = '',
		_bidStart = null,
		RUBICONTAG_URL = (window.location.protocol) + '//ads.rubiconproject.com/header/',
		RUBICON_SIZE_MAP = {
			'468x60': 1,
			'728x90': 2,
			'120x600': 8,
			'160x600': 9,
			'300x600': 10,
			'300x250': 15,
			'336x280': 16,
			'320x50': 43,
			'300x50': 44,
			'300x1050': 54,
			'970x90': 55,
			'970x250': 57,
			'1000x90': 58,
			'320x80': 59,
			'640x480': 65,
			'320x480': 67,
			'1800x1000': 68,
			'320x320': 72,
			'320x160': 73,
			'480x320': 101,
			'768x1024': 102,
			'1000x300': 113,
			'320x100': 117,
			'800x250': 125,
			'200x600': 126
		},
		RUBICON_INITIALIZED = 0,
		RUBICON_CREATIVE_START = '<script type="text/javascript">;(function (rt, fe) { rt.renderCreative(fe, "',
		RUBICON_CREATIVE_END = '"); }((parent.window.rubicontag || window.top.rubicontag), (document.body || document.documentElement)));</script>',		   

		_rready = function(callback) {
			window.rubicontag.cmd.push(callback);
		},

		_initSDK = function(){
			if (RUBICON_INITIALIZED) {
			    return;
			}
			RUBICON_INITIALIZED = 1;
			utilLoadScript(RUBICONTAG_URL + rubiconAccountID + '.js');
		},
	
		_defineSlot = function(slotConfig, sizes, divID, kgpv){

			if(!(slotConfig[constConfigRpSite] && slotConfig[constConfigRpZone])){
				return false;
			}

			var rbSizes = [];

			for(var i=0, l=sizes.length; i<l; i++){
				var sizeStr = sizes[i][0] + 'x' + sizes[i][1];
				if(utilHasOwnProperty(RUBICON_SIZE_MAP, sizeStr)){
					rbSizes.push(RUBICON_SIZE_MAP[sizeStr]);
				}
			}

			if(rbSizes.length == 0){
				return false;
			}

			var userId = slotConfig.userId;
	        var position = slotConfig.position;
	        var visitor = slotConfig.visitor || [];
	        var keywords = slotConfig.keywords || [];
	        var inventory = slotConfig.inventory || [];

	        var slot = window.rubicontag.defineSlot({
	            siteId: slotConfig[constConfigRpSite],
	            zoneId: slotConfig[constConfigRpZone],
	            sizes: rbSizes,
	            id: divID + Math.random()
	        });

	        slot.clearTargeting();

	        if (userId) {
	            window.rubicontag.setUserKey(userId);
	        }

	        if (position) {
	            slot.setPosition(position);
	        }

	        for (var key in visitor) {
	            if (visitor.hasOwnProperty(key)) {
	                slot.addFPV(key, visitor[key]);
	            }
	        }

	        for (var key in inventory) {
	            if (inventory.hasOwnProperty(key)) {
	                slot.addFPI(key, inventory[key]);
	            }
	        }

	        slot.addKW(keywords);

	        //slot.bid = bid;
	        slot.kgpv = kgpv;
	        slot.divID = divID;

	        return slot;
		},

		_eventListenerFunction = function(params){
    		var slot = slots.find(function(slot){return slot.getElementId() === params.elementId});
            var ad = slot.getRawResponseBySizeId && slot.getRawResponseBySizeId(params.sizeId);
            if(ad){
            	var time = ((new Date).getTime() - _bidStart);
	            utilLog("Rubicon Project bid back for "+params.elementId+" size "+params.sizeId+" at: "+time);
	            _makeBid(slot, ad);	
            }
    	},

    	_bidsReady = function(rbSlots){
	        utilLog('rubiconFastlane bidding complete: ' + ((new Date).getTime() - _bidStart));
	        utilEach(rbSlots, function (rbSlot) {
	        	try{
		        	utilLog(adapterID+': '+rbSlot.getElementId()+': getRawResponses: ');
		        	utilLog(rbSlot.getRawResponses());
		            _makeBids(rbSlot, rbSlot.getRawResponses());
	        	}catch(e){
	        		utilLog(adapterID+constCommonMessage21);
	        		utilLog(e);
	        	}
	        });
		},

		_makeBids = function(rbSlot, ads){
			if(!ads || ads.length === 0){
				//bidManagerSetBidFromBidder(rbSlot.getElementId(), adapterID, _errorBid(rbSlot));
				bidManagerSetBidFromBidder(rbSlot.divID, adapterID, _errorBid(rbSlot));
			}else{
			    // if there are multiple ads, sort by CPM
			    // no need to sort as bidManager will take care of it
			    //ads = ads.sort(_adCpmSort);

			    ads.forEach(function(ad){
			        _makeBid(rbSlot, ad);
			    });
			}
		},

		_makeBid = function(rbSlot, ad){

			var bidResponse, 
				size = ad.dimensions,
				bidID = utilGetUniqueIdentifierStr()
			;

			if (!size) {
			    utilLog(adapterID+': no dimensions given');
			    bidResponse = _errorBid(rbSlot);
			    bidManagerSetBidFromBidder(rbSlot.divID, adapterID, bidResponse, bidID);
			} else {

				try{

					var dealID = utilTrim(ad.deal),
						keyValuePairs = ad.targeting || {},
						dealChannel = utilGetDealChannelValue(dealChannelValues, '')
					;

					if(dealID && adapterBidPassThrough[adapterID] != 1){
						keyValuePairs[dealKey] = dealChannel+constDealKeyValueSeparator+dealID+constDealKeyValueSeparator+bidID;												
					}

				    bidResponse = bidManagerCreateBidObject(
						ad.cpm,
						bidManagerCreateDealObject(dealID, dealChannel),
						"",
						_creative(rbSlot.getElementId(), size),
						"",
						size[0],
						size[1],
						rbSlot.kgpv,
						keyValuePairs
					);
					bidManagerSetBidFromBidder(rbSlot.divID, adapterID, bidResponse, bidID);
				}catch(e){
					utilLog(adapterID+constCommonMessage21);
	        		utilLog(e);
				}
			}
		},

		_errorBid = function(rbSlot) {
			return bidManagerCreateBidObject(
				0,
				bidManagerCreateDealObject(),
				"",
				"",
				"",
				0,
				0,
				rbSlot.kgpv
			);
		},

    	_creative = function(elemId, size) {
	        // convert the size to a rubicon sizeId
	        var sizeId = RUBICON_SIZE_MAP[size.join('x')];
	        if (!sizeId) {
	            utilLog(adapterID + ': missing sizeId for size: ' + size.join('x') + ' could not render creative');
	            return '';
	        }
	        return RUBICON_CREATIVE_START + elemId + '", "' + sizeId + RUBICON_CREATIVE_END;
	    },

		_eventAvailable,
		
		_handleBidEvent = function(cb){
			if(_eventAvailable){
			    return true;
			}

			if(_eventAvailable === false){
			    return false;
			}

			return _eventAvailable = window.rubicontag.addEventListener(
				'FL_TIER_MAPPED',
				function(params){
					cb(params);
				}
			);
		},

	    fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			_bidStart = (new Date).getTime();

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			rubiconAccountID = adapterConfig[constConfigRpAccount];
			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			_initSDK();

			_rready(function(){

				var rbConfig = window.rubicontag.setIntegration('pub'),
					rbSlots = []
				;

				utilForEachGeneratedKey(
					adapterID,
					slotConfigMandatoryParams,
					activeSlots, 
					keyGenerationPattern, 
					keyLookupMap, 
					function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
						
						var sizes = kgpConsistsWidthAndHeight ? [[currentWidth, currentHeight]] : currentSlot[constAdSlotSizes];
						var rbSlot = _defineSlot(keyConfig, sizes, currentSlot[constCommonDivID], generatedKey);
						//rbSlot && rbSlots.push(rbSlot);
						if(rbSlot){
							var rbSlots = [rbSlot];
							window.rubicontag.run(
								function(){
    								_bidsReady(rbSlots);
    							}, 
    							{
    								slots: rbSlots
    							}
    						);
						}
					}
				);

				/*
				if(rbSlots.length){

					var parameters = {
							slots: rbSlots
						},
	            		callback = function(){}
	            	;

					if(!_handleBidEvent(_eventListenerFunction)){
						callback = function(){
    						_bidsReady(rbSlots);
    					};
					}

	            	window.rubicontag.run(callback, parameters);
				}
				*/				
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