var CONSTANTS = require("../constants.js");
var CONFIG = require("../config.js");
var util = require("../util.js");

var isPrebidPubMaticAnalyticsEnabled = CONFIG.isPrebidPubMaticAnalyticsEnabled();
var isSingleImpressionSettingEnabled = CONFIG.isSingleImpressionSettingEnabled();

function initPbjsConfig(){
	if(! window[pbNameSpace]){ // todo: move this code owt.js
		util.logError("PreBid js is not loaded");
		return;
	}
	window[pbNameSpace].logging = util.isDebugLogEnabled();
	timeoutForPrebid = CONFIG.getTimeout() - 50;
	refThis.setPrebidConfig();
	refThis.configureBidderAliasesIfAvailable();
	refThis.enablePrebidPubMaticAnalyticIfRequired();
	refThis.setPbjsBidderSettingsIfRequired();
}
exports.initPbjsConfig = initPbjsConfig;

function setPrebidConfig(){
	if(util.isFunction(window[pbNameSpace].setConfig) || typeof window[pbNameSpace].setConfig == "function") {
		var prebidConfig = {
			debug: util.isDebugLogEnabled(),
			cache: {
				url: CONSTANTS.CONFIG.CACHE_URL + CONSTANTS.CONFIG.CACHE_PATH
			},
			bidderSequence: "random",					
			disableAjaxTimeout: CONFIG.getDisableAjaxTimeout(),
			enableSendAllBids: CONFIG.getSendAllBidsStatus(),
			targetingControls: {
				alwaysIncludeDeals: true
			},
			testGroupId: parseInt(window.PWT.testGroupId || 0)
		};

		if(CONFIG.getPriceGranularity()){
			prebidConfig["priceGranularity"] = CONFIG.getPriceGranularity();
		}

		if(isPrebidPubMaticAnalyticsEnabled === true){
			prebidConfig['instreamTracking'] = {
				enabled: true
			}
		}
		
		refThis.assignUserSyncConfig(prebidConfig);
		refThis.assignGdprConfigIfRequired(prebidConfig);
		refThis.assignCcpaConfigIfRequired(prebidConfig);
		refThis.assignCurrencyConfigIfRequired(prebidConfig);
		refThis.assignSchainConfigIfRequired(prebidConfig);
		refThis.assignSingleRequestConfigForBidders(prebidConfig);
		// Adding a hook for publishers to modify the Prebid Config we have generated
		util.handleHook(CONSTANTS.HOOKS.PREBID_SET_CONFIG, [ prebidConfig ]);
		//todo: stop supporting this hook let pubs use pbjs.requestBids hook
		// do not set any config below this line as we are executing the hook above
		window[pbNameSpace].setConfig(prebidConfig);
	} else {
		util.logWarning("PreBidJS setConfig method is not available");
	}
}

exports.setPrebidConfig = setPrebidConfig;

function assignUserSyncConfig(prebidConfig){
	prebidConfig["userSync"] = {
		enableOverride: true,
		syncsPerBidder: 0,
		iframeEnabled: true,
		pixelEnabled: true,
		filterSettings: {
			iframe: {
				bidders: "*", // '*' means all bidders
				filter: "include"
			}
		},
		enabledBidders: (function(){
			var arr = [];
			CONFIG.forEachAdapter(function(adapterID){
				var adapterName = CONFIG.getAdapterNameForAlias(adapterID) || adapterID;
				if(arr.indexOf(adapterName) == -1){
					arr.push(adapterName);
				}
			});
			return arr;
		})(),
		syncDelay: 2000, //todo: default is 3000 write image pixels 5 seconds after the auction
		aliasSyncEnabled: true
	};

	// removeIf(removeUserIdRelatedCode)
	if(CONFIG.isUserIdModuleEnabled()){
		prebidConfig["userSync"]["userIds"] = util.getUserIdConfiguration();
	}
	// endRemoveIf(removeUserIdRelatedCode)
}

exports.assignUserSyncConfig = assignUserSyncConfig;

function assignGdprConfigIfRequired(prebidConfig){
	if (CONFIG.getGdpr()) {
		if(!prebidConfig["consentManagement"]){
			prebidConfig["consentManagement"] = {};
		}
		prebidConfig["consentManagement"]['gdpr'] = {
			cmpApi: CONFIG.getCmpApi(),
			timeout: CONFIG.getGdprTimeout(),
			allowAuctionWithoutConsent: CONFIG.getAwc() // Auction without consent
		};
	}
}

exports.assignGdprConfigIfRequired = assignGdprConfigIfRequired;

function assignCcpaConfigIfRequired(prebidConfig){
	if (CONFIG.getCCPA()) {
		if(!prebidConfig["consentManagement"]){
			prebidConfig["consentManagement"] = {};
		}
		prebidConfig["consentManagement"]["usp"] = {
			cmpApi: CONFIG.getCCPACmpApi(),
			timeout: CONFIG.getCCPATimeout(),
		};
	}
}

exports.assignCcpaConfigIfRequired = assignCcpaConfigIfRequired;

function assignCurrencyConfigIfRequired(prebidConfig){
	if(CONFIG.getAdServerCurrency()){
		// get AdServer currency from Config
		// Log in console 
		util.log(CONSTANTS.MESSAGES.M26 + CONFIG.getAdServerCurrency());
		prebidConfig["currency"] = {
			"adServerCurrency": CONFIG.getAdServerCurrency(), 
			"granularityMultiplier": CONFIG.getGranularityMultiplier(), 
		};
	}
}

exports.assignCurrencyConfigIfRequired = assignCurrencyConfigIfRequired;

function assignSchainConfigIfRequired(prebidConfig){
	if(CONFIG.isSchainEnabled()){
		prebidConfig["schain"] = CONFIG.getSchainObject();
	}
}

exports.assignSchainConfigIfRequired = assignSchainConfigIfRequired;

function assignSingleRequestConfigForBidders(prebidConfig){
	//todo: use forEachAdapter
	util.forEachOnObject(CONSTANTS.SRA_ENABLED_BIDDERS,function(adapterName){
		if(util.isOwnProperty(CONF.adapters, adapterName)){
			prebidConfig[adapterName] = {
				singleRequest : true
			};
		}
	});
}

exports.assignSingleRequestConfigForBidders = assignSingleRequestConfigForBidders;

function configureBidderAliasesIfAvailable(){
	if(util.isFunction(window[pbNameSpace].aliasBidder)){
		CONFIG.forEachBidderAlias(function(alias){
			window[pbNameSpace].aliasBidder(CONF.alias[alias], alias);
		})
	}
	else{
		util.logWarning("PreBid js aliasBidder method is not available");
		return;
	}
}

exports.configureBidderAliasesIfAvailable = configureBidderAliasesIfAvailable;

function enablePrebidPubMaticAnalyticIfRequired(){
	if(isPrebidPubMaticAnalyticsEnabled && util.isFunction(window[pbNameSpace].enableAnalytics)){
		window[pbNameSpace].enableAnalytics({
			provider: "pubmatic",
			options: {
				publisherId: CONFIG.getPublisherId(),
				profileId: CONFIG.getProfileID(),
				profileVersionId: CONFIG.getProfileDisplayVersionID()
			}
		});
	}
}

exports.enablePrebidPubMaticAnalyticIfRequired = enablePrebidPubMaticAnalyticIfRequired;

function getPbjsAdServerTargetingConfig(){
	// Todo: Handle send-all bids feature enabled case
	//		we will need to add bidder specific keys?? do we?
	// todo: refer constants for key names
	/*
		Todo: 
			what if we do not add a handler for some keys? do we need to add handler to all if we want to add for one?
			does custom keys do not get used in send-all-bids?
			do we always need to update the prebid targeting keys config in?
			what keys in prebid can be re-used?
	*/
	return [
    	//todo: what abt hb_deal, hb_uuid(video?), hb_cache_id(video?), hb_cache_host(video?) ?
        {
            key: "pwtpid", //hb_bidder
            val: function(bidResponse) {
                return bidResponse.bidderCode;
            }
        }, {
            key: "pwtsid", //hb_adid
            val: function(bidResponse) {
                return bidResponse.adId;
            }
        }, {
            key: "pwtecp", //hb_pb
            val: function(bidResponse) {
                // return bidResponse.pbMg;
                return (bidResponse.cpm||0).toFixed(CONSTANTS.COMMON.BID_PRECISION);
            }
        }, {
            key: 'pwtsz', //hb_size
            val: function (bidResponse) {
                return bidResponse.size;
            }
        }, {
            key: 'hb_source', //hb_source // we do not want it, so send empty, suppressEmptyKeys feature will prevent it being passed
            // do not change it in prebid.js project constants file
            val: function (bidResponse) {
                // return bidResponse.source;
                return '';
            }
        }, {
            key: 'pwtplt', //hb_format
            val: function (bidResponse) {
                // return bidResponse.mediaType;
                return (bidResponse.mediaType == "video" && bidResponse.videoCacheKey) ? CONSTANTS.PLATFORM_VALUES.VIDEO : (bidResponse.native ? CONSTANTS.PLATFORM_VALUES.NATIVE : CONSTANTS.PLATFORM_VALUES.DISPLAY);
            }
        },
        {
        	key: 'pwtdid', // hb_deal
        	val: function(bidResponse){ // todo: do we want to concat dealchannel as well?
        		return bidResponse.dealId || '';
        	}
		},  
		{
        	key: 'pwtdeal', // hb_deal
			val: function(bidResponse){ // todo: do we want to concat dealchannel as well?
				if(bidResponse.dealId){
					bidResponse.dealChannel = bidResponse.dealChannel || "PMP";
					return bidResponse.dealChannel + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidResponse.dealId + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidResponse.adId;
				}
				return '';
			}
        },     
        {
            key: 'pwtbst', // our custom
            val: function(bidResponse) {
                return 1;
            }
        },               
        {
        	key: 'pwtpubid', // custom
        	val: function(bidResponse){
        		return CONFIG.getPublisherId();
        	}
        },
        {
        	key: 'pwtprofid', // custom
        	val: function(bidResponse){
        		return CONFIG.getProfileID();
        	}
        },
        {
        	key: 'pwtverid', // custom
        	val: function(bidResponse){ // todo: empty value?
        		return CONFIG.getProfileDisplayVersionID();
        	}
        },
        {
        	key: 'pwtcid', // custom
			val: function(bidResponse){ // todo: empty value?
        		return (bidResponse.mediaType == "video" && bidResponse.videoCacheKey ) ?  bidResponse.videoCacheKey : "";
        	}
        }, {
        	key: 'pwtcurl', // custom
        	val: function(bidResponse){ // todo: empty value?	
				return (bidResponse.mediaType == "video" && bidResponse.videoCacheKey ) ? CONSTANTS.CONFIG.CACHE_URL : "";			
        	}
        }, {
        	key: 'pwtcpath', // custom
        	val: function(bidResponse){ // todo: empty value?
        		return (bidResponse.mediaType == "video" && bidResponse.videoCacheKey )  ? CONSTANTS.CONFIG.CACHE_PATH : "";
        	}
        }, {
        	key: 'pwtuuid', // custom
        	val: function(bidResponse){ // todo: empty value?
        		return "";
        	}
        }
    ];
}

exports.getPbjsAdServerTargetingConfig = getPbjsAdServerTargetingConfig;

function setPbjsBidderSettingsIfRequired(){
	if(isPrebidPubMaticAnalyticsEnabled === false){
		return;
	}

	window[pbNameSpace].bidderSettings = {
		'standard': {
			'suppressEmptyKeys': true, // this boolean flag can be used to avoid sending those empty values to the ad server.
		}		
	};

	if(CONFIG.isUsePrebidKeysEnabled() === false){
		window[pbNameSpace].bidderSettings['standard']['adserverTargeting'] = getPbjsAdServerTargetingConfig();
	}

	// adding bidder level settings
	CONFIG.forEachAdapter(function(adapterID){
		if(window[pbNameSpace].bidderSettings.hasOwnProperty(adapterID) === false){
			window[pbNameSpace].bidderSettings[adapterID] = {};

			// adding bidCpmAdjustment			
			window[pbNameSpace].bidderSettings[adapterID]['bidCpmAdjustment'] = function(bidCpm, bid){
				return window.parseFloat((bidCpm * CONFIG.getAdapterRevShare(adapterID)).toFixed(CONSTANTS.COMMON.BID_PRECISION));
			}
		}
	});
}

exports.setPbjsBidderSettingsIfRequired = setPbjsBidderSettingsIfRequired;