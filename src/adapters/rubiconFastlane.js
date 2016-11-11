adapterManagerRegisterAdapter((function() {

	window.rubicontag = window.rubicontag || {};
    window.rubicontag.cmd = window.rubicontag.cmd || [];

	var adapterID = 'rubiconFastlane',

		rubiconAccountID = '',
		_bidStart = null,

		RUBICONTAG_URL = (window.location.protocol) + '//ads.rubiconproject.com/header/',
		RUBICON_OK_STATUS = 'ok',
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
		// the fastlane creative code
		RUBICON_CREATIVE_START = '<script type="text/javascript">;(function (rt, fe) { rt.renderCreative(fe, "',
		RUBICON_CREATIVE_END = '"); }((parent.window.rubicontag || window.top.rubicontag), (document.body || document.documentElement)));</script>',

		_initSDK = function(){
			if (RUBICON_INITIALIZED) {
			    return;
			}
			RUBICON_INITIALIZED = 1;
			utilLoadScript(RUBICONTAG_URL + rubiconAccountID + '.js');
		},

		createRbSlot = function(slotConfig, sizes, divID, kgpv){

			if(!(slotConfig.siteId && slotConfig.zoneId)){
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
	            siteId: slotConfig.siteId,
	            zoneId: slotConfig.zoneId,
	            sizes: rbSizes,
	            id: divID
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

	        return slot;
		},

		_bidsReady = function(rbSlots){
	        utilLog('rubiconFastlane bidding complete: ' + ((new Date).getTime() - _bidStart));
	        utilEach(rbSlots, function (rbSlot) {
	            _addBids(rbSlot, rbSlot.getRawResponses());
	        });
		},

		_addBids = function(rbSlot, ads) {
	        // get the bid for the placement code
	        var bids;
	        if (!ads || ads.length === 0) {
	            bids = [_errorBid(rbSlot, ads)];
	        } else {
	            bids = _makeBids(rbSlot, ads);
	        }

	        bids.forEach(function (bid) {
	            //bidmanager.addBidResponse(rbSlot.getElementId(), bid);
	            bidManagerSetBidFromBidder(rbSlot.getElementId(), adapterID, bid);
	        });
	    },

	    _errorBid = function(rbSlot, ads) {
	    	var bidResponse = {};
			bidResponse[constTargetingBidStatus] = 0;
			bidResponse[constTargetingEcpm] = 0;
			bidResponse[constTargetingAdHTML] = "";
			bidResponse[constTargetingAdUrl] = "";
			bidResponse[constTargetingDealID] = "";
			bidResponse[constTargetingCreativeID] = "";
			bidResponse[constTargetingWidth] = 0;
			bidResponse[constTargetingHeight] = 0;
			bidResponse[constCommonKeyGenerationPatternValue] = rbSlot.kgpv;
			return bidResponse;
		},

		_makeBids = function(rbSlot, ads) {
	        // if there are multiple ads, sort by CPM
	        //ads = ads.sort(_adCpmSort);
	        var bidResponses = [];
	        ads.forEach(function(ad){

	            var bidResponse, size = ad.dimensions;

	            if (!size) {
	                // this really shouldn't happen
	                utilLog('no dimensions given', adapterID, ad);
	                bidResponse = _errorBid(rbSlot, ads);
	            } else {

	            	var bidResponse = {};
					bidResponse[constTargetingBidStatus] = 1;
					bidResponse[constTargetingEcpm] = ad.cpm;
					bidResponse[constTargetingAdHTML] = _creative(rbSlot.getElementId(), size);
					bidResponse[constTargetingAdUrl] = "";
					bidResponse[constTargetingDealID] = ad.deal || "";
					bidResponse[constTargetingCreativeID] = "";
					bidResponse[constTargetingWidth] = size[0];
					bidResponse[constTargetingHeight] = size[1];
					bidResponse[constCommonKeyGenerationPatternValue] = rbSlot.kgpv;	                
	            }

	            bidResponses.push(bidResponse);
	        });

	        return bidResponses;
	    },

	    _creative = function(elemId, size) {
	        // convert the size to a rubicon sizeId
	        var sizeId = RUBICON_SIZE_MAP[size.join('x')];
	        if (!sizeId) {
	            utilLog('fastlane: missing sizeId for size: ' + size.join('x') + ' could not render creative', adapterID, RUBICON_SIZE_MAP);
	            return '';
	        }
	        return RUBICON_CREATIVE_START + elemId + '", "' + sizeId + RUBICON_CREATIVE_END;
	    },

	    fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID),
				constConfigRpAccount = 'accountId'
			;

			if(!utilCheckMandatoryParams(adapterConfig, [constConfigRpAccount, constConfigKeyGeneratigPattern, constConfigKeyLookupMap], adapterID)){
				utilLog(adapterID+constCommonMessage07);
				return;
			}

			rubiconAccountID = adapterConfig[constConfigRpAccount];
			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			_initSDK();

			window.rubicontag.cmd.push(function(){
				var rbSlots = []
				;

				utilForEachGeneratedKey(
					activeSlots, 
					keyGenerationPattern, 
					keyLookupMap, 
					function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
						
						if(!keyConfig){
							utilLog(adapterID+': '+generatedKey+constCommonMessage08);
							return;
						}

						if(!utilCheckMandatoryParams(keyConfig, ['siteId', 'zoneId'], adapterID)){
							utilLog(adapterID+': '+generatedKey+constCommonMessage09);
							return;
						}						

						var sizes = [];

						if(kgpConsistsWidthAndHeight){
							sizes.push([currentWidth, currentHeight]);
						}else{
							sizes = currentSlot[constAdSlotSizes];
						}

						var rbSlot = createRbSlot(keyConfig, sizes, currentSlot[constCommonDivID], generatedKey);
						rbSlot && rbSlots.push(rbSlot);
					}
				);

				if(rbSlots.length){
					window.rubicontag.setIntegration('pub');
    				window.rubicontag.run(function(){
    					_bidsReady(rbSlots);
    				}, {slots: rbSlots});
				}
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