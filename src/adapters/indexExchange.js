win.cygnus_index_parse_res = function(response) {
	try {
		if (response) {
			if (!utilIsObject(_IndexRequestData) || !utilIsObject(_IndexRequestData.impIDToSlotID) || utilIsUndefined(_IndexRequestData.impIDToSlotID[response.id])) {
				return;
			}
			var targetMode = 1;
			var callbackFn;
			if (utilIsObject(_IndexRequestData.reqOptions) && utilIsObject(_IndexRequestData.reqOptions[response.id])) {
				if (utilIsFn(_IndexRequestData.reqOptions[response.id].callback)) {
					callbackFn = _IndexRequestData.reqOptions[response.id].callback;
				}
				if (utilIsNumber(_IndexRequestData.reqOptions[response.id].targetMode)) {
					targetMode = _IndexRequestData.reqOptions[response.id].targetMode;
				}
			}

			_IndexRequestData.lastRequestID = response.id;
			_IndexRequestData.targetIDToBid = {};
			_IndexRequestData.targetIDToResp = {};

			var allBids = [];
			var seatbidLength = utilIsUndefined(response.seatbid) ? 0 : response.seatbid.length;
			for (var i = 0; i < seatbidLength; i++) {
				for (var j = 0; j < response.seatbid[i].bid.length; j++) {
					var bid = response.seatbid[i].bid[j];
					if (!utilIsObject(bid.ext) || !utilIsStr(bid.ext.pricelevel)) {
						continue;
					}
					if (utilIsUndefined(_IndexRequestData.impIDToSlotID[response.id][bid.impid])) {
						continue;
					}
					var slotID = _IndexRequestData.impIDToSlotID[response.id][bid.impid];
					if (utilIsUndefined(_IndexRequestData.targetIDToBid)) {
						_IndexRequestData.targetIDToBid = {};
					}
					var targetID;
					if (utilIsStr(bid.ext.dealid)) {
						if (targetMode === 1) {
							targetID = slotID + bid.ext.pricelevel;
						} else {
							targetID = slotID + "_" + bid.ext.dealid;
						}
					} else {
						targetID = slotID + bid.ext.pricelevel;
					}
					if (_IndexRequestData.targetIDToBid[targetID] === undefined) {
						_IndexRequestData.targetIDToBid[targetID] = [bid.adm];
					} else {
						_IndexRequestData.targetIDToBid[targetID].push(bid.adm);
					}
					var impBid = {};
					impBid.impressionID = bid.impid;
					if (!utilIsUndefined(bid.ext.dealid)) {
						impBid.dealID = bid.ext.dealid;
					}
					impBid.bid = bid.price;
					impBid.slotID = slotID;
					impBid.priceLevel = bid.ext.pricelevel;
					_IndexRequestData.targetIDToResp[targetID] = impBid;
					allBids.push(impBid);
				}
			}
			if (utilIsFn(callbackFn)) {
				if (allBids.length === 0) {
					callbackFn(response.id);
				} else {
					callbackFn(response.id, allBids);
				}
			}

		}
	} catch (e) {}

	if (utilIsFn(window.cygnus_index_ready_state)) {
		window.cygnus_index_ready_state();
	}
};

win.cygnus_index_args = {
	slots: []
};
var index_slots_add = [];

var cygnus_index_start = function () {

	win.index_slots = [];

    win.cygnus_index_args.parseFn = cygnus_index_parse_res;    

	function escapeCharacter(character) {		
		var meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		};
		var escaped = meta[character];
		if (utilIsStr(escaped)) {
			return escaped;
		} else {
			return '\\u' + ('0000' + character.charCodeAt(0).toString(16)).slice(-4);
		}
	}

	function quote(string) {
		var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		escapable.lastIndex = 0;
		if (escapable.test(string)) {
			return string.replace(escapable, escapeCharacter);
		} else {
			return string;
		}
	}

	function OpenRTBRequest(siteID, parseFn, timeoutDelay) {
		this.initialized = false;
		if (!utilIsNumber(siteID) || siteID % 1 !== 0 || siteID < 0) {
			throw 'Invalid Site ID';
		}

		if (utilIsNumber(timeoutDelay) && timeoutDelay % 1 === 0 && timeoutDelay >= 0) {
			this.timeoutDelay = timeoutDelay;
		}

		this.siteID = siteID;
		this.impressions = [];
		this._parseFnName = undefined;
		if (top === self) {
			this.sitePage = location.href;
			this.topframe = 1;
		} else {
			this.sitePage = document.referrer;
			this.topframe = 0;
		}

		if (!utilIsUndefined(parseFn)) {
			if (utilIsFn(parseFn)) {
				this._parseFnName = 'cygnus_index_args.parseFn';
			} else {
				throw 'Invalid jsonp target function';
			}
		}

		if (utilIsUndefined(_IndexRequestData.requestCounter)) {
			_IndexRequestData.requestCounter = Math.floor(Math.random() * 256);
		} else {
			_IndexRequestData.requestCounter = (_IndexRequestData.requestCounter + 1) % 256;
		}

		this.requestID = String((new Date().getTime() % 2592000) * 256 + _IndexRequestData.requestCounter + 256);
		this.initialized = true;
	}

	OpenRTBRequest.prototype.serialize = function () {
		var json = '{}';
		try{		
	    json = '{"id":' + this.requestID + ',"site":{"page":"' + quote(this.sitePage) + '"';
	    if (utilIsStr(document.referrer)) {
	        json += ',"ref":"' + quote(document.referrer) + '"';
	    }

	    json += '},"imp":[';
	    for (var i = 0; i < this.impressions.length; i++) {
	        var impObj = this.impressions[i];
	        var ext = [];
	        json += '{"id":"' + impObj.id + '", "banner":{"w":' + impObj.w + ',"h":' + impObj.h + ',"topframe":' + String(this.topframe) + '}';
	        if (utilIsNumber(impObj.bidfloor)) {
	            json += ',"bidfloor":' + impObj.bidfloor;
	            if (utilIsStr(impObj.bidfloorcur)) {
	                json += ',"bidfloorcur":"' + quote(impObj.bidfloorcur) + '"';
	            }
	        }

	        if (utilIsStr(impObj.slotID) && (!impObj.slotID.match(/^\s*$/))) {
	            ext.push('"sid":"' + quote(impObj.slotID) + '"');
	        }

	        if (utilIsNumber(impObj.siteID)) {
	            ext.push('"siteID":' + impObj.siteID);
	        }

	        if (ext.length > 0) {
	            json += ',"ext": {' + ext.join() + '}';
	        }

	        if (i + 1 === this.impressions.length) {
	            json += '}';
	        } else {
	            json += '},';
	        }
	    }

	    json += ']}';
		}catch(e){
			json = '{}';
		}

	    return json;
	};

	OpenRTBRequest.prototype.setPageOverride = function (sitePageOverride) {
	    if (utilIsStr(sitePageOverride) && (!sitePageOverride.match(/^\s*$/))) {
	        this.sitePage = sitePageOverride;
	        return true;
	    } else {
	        return false;
	    }
	};

	OpenRTBRequest.prototype.addImpression = function (width, height, bidFloor, bidFloorCurrency, slotID, siteID) {
	    var impObj = {
	        id: String(this.impressions.length + 1)
	    };

	    try{

	    if (!utilIsNumber(width) || width <= 1) {
	        return null;
	    }

	    if (!utilIsNumber(height) || height <= 1) {
	        return null;
	    }

	    if ((utilIsStr(slotID) || utilIsNumber(slotID)) && String(slotID).length <= 50) {
	        impObj.slotID = String(slotID);
	    }

	    impObj.w = width;
	    impObj.h = height;
	    if (bidFloor !== undefined && !utilIsNumber(bidFloor)) {
	        return null;
	    }

	    if (utilIsNumber(bidFloor)) {
	        if (bidFloor < 0) {
	            return null;
	        }

	        impObj.bidfloor = bidFloor;
	        if (bidFloorCurrency !== undefined && !utilIsStr(bidFloorCurrency)) {
	            return null;
	        }

	        impObj.bidfloorcur = bidFloorCurrency;
	    }

	    if (!utilIsUndefined(siteID)) {
	        if (utilIsNumber(siteID) && siteID % 1 === 0 && siteID >= 0) {
	            impObj.siteID = siteID;
	        } else {
	            return null;
	        }
	    }

	    this.impressions.push(impObj);

		}catch(e){}

	    return impObj.id;
	};
   
    OpenRTBRequest.prototype.buildRequest = function () {
	    if (this.impressions.length === 0 || this.initialized !== true) {
	        return;
	    }

	    var jsonURI = encodeURIComponent(this.serialize());
	    var scriptSrc = window.location.protocol === 'https:' ? 'https://as-sec.casalemedia.com' : 'http://as.casalemedia.com';
	    //scriptSrc += '/headertag?v=9&x3=1&fn=cygnus_index_parse_res&s=' + this.siteID + '&r=' + jsonURI;
	    scriptSrc += '/cygnus?v=7&fn=cygnus_index_parse_res&pid=pm&s=' + this.siteID + '&r=' + jsonURI;
	    if (utilIsNumber(this.timeoutDelay) && this.timeoutDelay % 1 === 0 && this.timeoutDelay >= 0) {
	        scriptSrc += '&t=' + this.timeoutDelay;
	    }

	    return scriptSrc;
	};

    try {
	    if (utilIsUndefined(cygnus_index_args) || utilIsUndefined(cygnus_index_args.siteID) || utilIsUndefined(cygnus_index_args[constCommonSlots])) {
	        return;
	    }

	    if (utilIsUndefined(window._IndexRequestData)) {
	        window._IndexRequestData = {};
	        window._IndexRequestData.impIDToSlotID = {};
	        window._IndexRequestData.reqOptions = {};
	    }

	    var req = new OpenRTBRequest(cygnus_index_args.siteID, cygnus_index_args.parseFn, cygnus_index_args.timeout);
	    if (cygnus_index_args.url && utilIsStr(cygnus_index_args.url)) {
	        req.setPageOverride(cygnus_index_args.url);
	    }

	    _IndexRequestData.impIDToSlotID[req.requestID] = {};
	    _IndexRequestData.reqOptions[req.requestID] = {};
	    var slotDef, impID;

	    for (var i = 0; i < cygnus_index_args[constCommonSlots].length; i++) {
	        slotDef = cygnus_index_args[constCommonSlots][i];

	        if(slotDef.used == true){
	        	continue;
	        }

	        impID = req.addImpression(slotDef.width, slotDef.height, slotDef.bidfloor, slotDef.bidfloorcur, slotDef.id, slotDef.siteID);
	        if (impID) {
	            _IndexRequestData.impIDToSlotID[req.requestID][impID] = String(slotDef.id);
	            slotDef.used = true;
	        }
	    }

	    if (utilIsNumber(cygnus_index_args.targetMode)) {
	        _IndexRequestData.reqOptions[req.requestID].targetMode = cygnus_index_args.targetMode;
	    }

	    if (utilIsFn(cygnus_index_args.callback)) {
	        _IndexRequestData.reqOptions[req.requestID].callback = cygnus_index_args.callback;
	    }

	    return req.buildRequest();
	} catch (e) {
	    utilLog('Error calling index adapter');
	}	
	/*finally {
		if (utilIsUndefined(window._IndexRequestData)) {
	        window._IndexRequestData = {};
		}
        // ensure that previous targeting mapping is cleared
        _IndexRequestData.targetIDToBid = {};
    }*/
};

adapterManagerRegisterAdapter((function() {

	var adapterID = 'indexExchange',
	    slotIdMap = {},
	    incrID = 0,
	    
	    slotConfigId = 'id',
	    slotConfigSiteId = 'siteID',
	    adapterConfigMandatoryParams = [constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
	    slotConfigMandatoryParams = [slotConfigId, slotConfigSiteId],

	    pushIndexSlots = function(currentWidth, currentHeight, key, params, activeSlot, incrID){
	    	var cygnus_index_adunits = {
	    		'728x90': 1,
				'120x600': 1,
				'300x250': 1,
				'160x600': 1,
				'336x280': 1,
				'234x60': 1,
				'300x600': 1,
				'300x50': 1,
				'320x50': 1,
				'970x250': 1,
				'300x1050': 1,
				'970x90': 1,
				'180x150': 1
	    		}
	    	;

	    	try{
	    	incrID = ''+incrID;

	    	//check if it is a valid size
	    	if(! utilHasOwnProperty(cygnus_index_adunits, currentWidth+'x'+currentHeight)){
	    		return;
	    	}

            if(TIMEOUT && utilIsUndefined(cygnus_index_args.timeout)){	
                cygnus_index_args.timeout = TIMEOUT;
            }

            var siteID = Number(params[slotConfigSiteId]);
            if(!siteID){
                return;
            }

            if(siteID && utilIsUndefined(cygnus_index_args[slotConfigSiteId])){
                cygnus_index_args[slotConfigSiteId] = siteID;
            }            

            slotIdMap[incrID] = {};
            slotIdMap[incrID][slotConfigId] = params[slotConfigId];
            slotIdMap[incrID][constCommonDivID] = activeSlot[constCommonDivID];
            slotIdMap[incrID][constCommonKeyGenerationPatternValue] = key;

            cygnus_index_args[constCommonSlots] = mergeSlotInto({
                id: params[slotConfigId],
                width: currentWidth,
                height: currentHeight,
                siteID: siteID || cygnus_index_args[slotConfigSiteId]
            }, cygnus_index_args[constCommonSlots]);
            

        	}catch(e){}
	    },

	    fetchBids = function(configObject, activeSlots){
	    	utilLog(adapterID+constCommonMessage01);

			var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, adapterID, adapterConfigMandatoryParams);
			if(!adapterConfig){
				return;
			}

			var keyGenerationPattern = adapterConfig[constConfigKeyGeneratigPattern];
			var keyLookupMap = adapterConfig[constConfigKeyLookupMap];

			utilForEachGeneratedKey(
				adapterID,
				slotConfigMandatoryParams,
				activeSlots, 
				keyGenerationPattern, 
				keyLookupMap, 
				function(generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
										
					var sizes = kgpConsistsWidthAndHeight ? [[currentWidth, currentHeight]] : currentSlot[constAdSlotSizes],
						sizesLength = sizes.length
					;
					for (var j = 0; j < sizesLength; j++) {
						incrID++;
						pushIndexSlots(sizes[j][0], sizes[j][1], generatedKey, keyConfig, currentSlot, incrID);
					}					
				},
				true
			);

			cygnus_index_primary_request = false;
			var scriptPath = cygnus_index_start();
			if(scriptPath){
				utilLoadScript(scriptPath);
			}
	    },

		mergeSlotInto = function(slot,slotList){
			/*
			for(var i = 0; i < slotList.length; i++){
			  if(slot.id === slotList[i].id){
			    return slotList;
			  }
			}
			*/
			slotList.push(slot);
			return slotList;
		},

		getSlotObj = function(obj, id) {
			var arr = obj[constCommonSlots];
		    var returnObj = {};
		    utilEach(arr, function (value) {
				if (value[slotConfigId] === id) {
					returnObj = value;
				}
		    });
		    return returnObj;
		}
	;  
    	
	win.cygnus_index_ready_state = function () {

		var bidObject = {};

		try {
			var indexObj = _IndexRequestData.targetIDToBid;

			// Grab all the bids for each slot
            for (var adSlotId in slotIdMap) {

            	if(! utilHasOwnProperty(slotIdMap, adSlotId)){
            		continue;
            	}
            	
                var bidObj = slotIdMap[adSlotId];

                // Grab the bid for current slot
                for (var cpmAndSlotId in indexObj) {

                	if(! utilHasOwnProperty(indexObj, cpmAndSlotId)){
	            		continue;
	            	}

                    var match = /^(.+)_(\d+)$/.exec(cpmAndSlotId);                    
                    var slotID = match[1];
                    var currentCPM = match[2];

                    var slotObj = getSlotObj(cygnus_index_args, slotID);

                    // Bid is for the current slot
                    if (slotID === slotIdMap[adSlotId][slotConfigId] && slotObj.width && slotObj.height && slotObj.siteID){

                    	bidObject = bidManagerCreateBidObject(
                    		currentCPM / 100,
                    		bidManagerCreateDealObject(),
                    		"",
                    		indexObj[cpmAndSlotId][0],
                    		"",
                    		slotObj.width,
                    		slotObj.height,
                    		bidObj[constCommonKeyGenerationPatternValue]
                    	);
						bidManagerSetBidFromBidder(bidObj[constCommonDivID], adapterID, bidObject);

						// Removing the used bid, else we will face issue with adslots using same configs
						delete indexObj[cpmAndSlotId];
						delete slotIdMap[adSlotId];
						break;
                    }else{
                    	//utilLog(adapterID+ ": slotObj details not found.")
                    }
                }                
            }
			
		} catch (e) {
			utilLog('Error in parsing index adapter response');
			utilLog(e);
		}
	};

  return {
    fB: fetchBids,
    dC: utilDisplayCreative,
    ID: function(){
      return adapterID;
    }
  };

})());