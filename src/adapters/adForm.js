adapterManagerRegisterAdapter((function(){
	var adapterID = 'adform',
		adxDomain = 'adx.adform.net',
		constConfigAdxDomain = 'adxDomain',
		constConfigMid = 'mid',
		adapterConfigMandatoryParams = [constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
	    slotConfigMandatoryParams = [constConfigMid],

		fetchBids = function(configObject, activeSlots){
			utilLog(adapterID+constCommonMessage01);

			try{

				var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
				if(!adapterConfig){
					return;
				}

				var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
				var keyLookupMap = adapterConfig[constConfigKeyLookupMap];
				if(utilHasOwnProperty(adapterConfig, constConfigAdxDomain)){
					adxDomain = adapterConfig[constConfigAdxDomain];
				}

				var randomID,
					slots = [],
					request = [],
					pushDataInSlots = function(keyConfig, divID, sizes, generatedKey, currentWidth, currentHeight){
						keyConfig.w = currentWidth;
						keyConfig.h = currentHeight;
						slots.push({
							'params': keyConfig,
							'divID': divID,
							'sizes': sizes,
							'kgpv': generatedKey
						});
						request.push(formRequestUrl(keyConfig));
					}
				;

				utilForEachGeneratedKey(
					adapterID,
					slotConfigMandatoryParams,
					activeSlots, 
					keyGenerationPattern, 
					keyLookupMap, 
					function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){						
						var adSlotSizes = kgpConsistsWidthAndHeight ? [[currentWidth, currentHeight]] : currentSlot[constAdSlotSizes];
						var adSlotSizesLength = adSlotSizes.length;
						for(var n=0; n<adSlotSizesLength; n++){
							pushDataInSlots(
								keyConfig, 
								currentSlot[constCommonDivID], 
								currentSlot[constAdSlotSizes],
								generatedKey,
								adSlotSizes[n][0],
								adSlotSizes[n][1]
							);
						}						
					},
					true
				);

				if(slots.length > 0){
					randomID = utilGetUniqueIdentifierStr();
					win.PWT.AdFormAdapterCallbacks[randomID] = new (function(){
						var theSlotsArray = slots;
						this.callback = function(response){
							callBackFunction(response, theSlotsArray);
						}
					})();
					request.unshift('//' + adxDomain + '/adx/?rp=4');
					request.push('callback=window.PWT.AdFormAdapterCallbacks["'+randomID+'"].callback');
					utilLoadScript(request.join('&'));
				}else{
					utilLog(adapterID + ', Not calling as there are no selected slots.');
				}

			}catch(e){}
		},

		formRequestUrl = function(reqData) {
		    var key;
		    var url = [];

		    var validProps = ['mid', 'inv', 'pdom', 'mname', 'mkw', 'mkv', 'cat', 'bcat', 'bcatrt', 'adv', 'advt', 'cntr', 'cntrt', 'maxp', 'minp', 'sminp', 'w', 'h', 'pb', 'pos', 'cturl', 'iturl', 'cttype', 'hidedomain', 'cdims', 'test'];

		    try{
		    for (var i = 0, l = validProps.length; i < l; i++) {
		        key = validProps[i];
		        if (reqData.hasOwnProperty(key)) url.push(key, '=', reqData[key], '&');
		    }
			}catch(e){}

		    return encode64(url.join(''));
		},

		encode64 = function(input) {
		    var out = [];
		    var chr1;
		    var chr2;
		    var chr3;
		    var enc1;
		    var enc2;
		    var enc3;
		    var enc4;
		    var i = 0;
		    var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';

		    try{
		    input = utf8_encode(input);

		    while (i < input.length) {

		        chr1 = input.charCodeAt(i++);
		        chr2 = input.charCodeAt(i++);
		        chr3 = input.charCodeAt(i++);

		        enc1 = chr1 >> 2;
		        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		        enc4 = chr3 & 63;

		        if (isNaN(chr2)) {
		            enc3 = enc4 = 64;
		        } else if (isNaN(chr3)) {
		            enc4 = 64;
		        }

		        out.push(_keyStr.charAt(enc1), _keyStr.charAt(enc2));
		        if (enc3 !== 64) out.push(_keyStr.charAt(enc3));
		        if (enc4 !== 64) out.push(_keyStr.charAt(enc4));
		    }

			}catch(e){
				utilLog(adapterID+ ': erron in encoding');
				utilLog(e);
			}

		    return out.join('');
		},

		utf8_encode = function(string) {

			try{
		    string = string.replace(/\r\n/g, '\n');
		    var utftext = '';

		    for (var n = 0; n < string.length; n++) {

		        var c = string.charCodeAt(n);

		        if (c < 128) {
		            utftext += String.fromCharCode(c);
		        } else if ((c > 127) && (c < 2048)) {
		            utftext += String.fromCharCode((c >> 6) | 192);
		            utftext += String.fromCharCode((c & 63) | 128);
		        } else {
		            utftext += String.fromCharCode((c >> 12) | 224);
		            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		            utftext += String.fromCharCode((c & 63) | 128);
		        }
		    }

			}catch(e){}

		    return utftext;
		},

		callBackFunction = function(adItems, theSlotsArray){
			var bidObject,
				adItem
			;

			try{
			for (var i = 0, l = adItems.length; i < l; i++) {
			    adItem = adItems[i];
			    var aSlot = theSlotsArray[i];
			    if (aSlot && adItem && adItem.response === 'banner' && verifySize(adItem, aSlot[constCommonSizes])) {			        
			        
			    	bidObject = bidManagerCreateBidObject(
			    		adItem.win_bid,
			    		bidManagerCreateDealObject(),
			    		"", 
			    		adItem.banner,
			    		"",
			    		adItem.width,
			    		adItem.height,
			    		aSlot[constCommonKeyGenerationPatternValue]
			    	);
					bidManagerSetBidFromBidder(aSlot[constCommonDivID], adapterID, bidObject);
			    } else {			        
			       utilLog(adapterID+': invalid adItem. Either response is not banner or slot sizes are not matching.');
			    }
			}
			}catch(e){}
		},

		verifySize = function(adItem, validSizes) {
			try{
		    for (var j = 0, k = validSizes.length; j < k; j++) {
		        if (adItem.width == validSizes[j][0] && adItem.height == validSizes[j][1]) {
		            return true;
		        }
		    }
			}catch(e){}
		    return false;
		}
	;

	win.PWT.AdFormAdapterCallbacks = {};

	return {
		fB: fetchBids,
		dC: utilDisplayCreative,
		ID: function(){
			return adapterID;
		}
	};
})());