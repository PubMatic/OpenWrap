/*
	Note:
		Whenever we support a new PB adapter, we need to check if it needs actual sizes to be passed,
			if so we will need to add special handling
		PreBid does not do mandatory parameters checking
*/
var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var BID = require("../bid.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
var CONF = require("../conf.js");
var COMMON_CONFIG = require("../common.config.js");

var parentAdapterID = CONSTANTS.COMMON.PARENT_ADAPTER_PREBID;

var pbNameSpace = /*CONFIG.isIdentityOnly() ? CONSTANTS.COMMON.IH_NAMESPACE : */ CONSTANTS.COMMON.PREBID_NAMESPACE;

/* start-test-block */
exports.parentAdapterID = parentAdapterID;
/* end-test-block */
var kgpvMap = {};

/* start-test-block */
exports.kgpvMap = kgpvMap;
/* end-test-block */

var refThis = this;
var onEventAdded = false;
var onAuctionEndEventAdded = false;
var isPrebidPubMaticAnalyticsEnabled = CONFIG.isPrebidPubMaticAnalyticsEnabled();
var isSingleImpressionSettingEnabled = CONFIG.isSingleImpressionSettingEnabled();
var defaultAliases = CONSTANTS.DEFAULT_ALIASES;

/* start-test-block */
exports.isSingleImpressionSettingEnabled = isSingleImpressionSettingEnabled;
/* end-test-block */

function isAdUnitsCodeContainBidder(adUnits, code, adapterID){
	var bidderPresent = false;
	if(util.isOwnProperty(adUnits, code)){
		adUnits[code].bids.forEach(function(bid) {
			if(bid.bidder == adapterID){
				bidderPresent = true;	
			}
		});
	}
	return bidderPresent;
}

/* start-test-block */
exports.isAdUnitsCodeContainBidder = isAdUnitsCodeContainBidder;
/* end-test-block */

function generatedKeyCallbackForPbAnalytics(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight, regexPattern){
	var code, sizes, divID, adUnitId;
	var mediaTypeConfig;
	var partnerConfig;

	//If we are using PubMaticServerBidAdapatar then serverSideEabled: do not add config into adUnits. 
	//If we are using PrebidServerBidAdapatar then we need to add config into adUnits.
	if(CONFIG.isServerSideAdapter(adapterID) && CONFIG.usePBSAdapter() != true){
		util.log("Not calling adapter: "+ adapterID + ", for " + generatedKey +", as it is serverSideEnabled.");
		return;
	}

	divID = currentSlot.getDivID();
	code = currentSlot.getDivID();
	sizes = currentSlot.getSizes();
	adUnitId = currentSlot.getAdUnitID();

	/* istanbul ignore else */
	var adUnitConfig = util.getAdUnitConfig(sizes, currentSlot);
	mediaTypeConfig = adUnitConfig.mediaTypeObject;
	if(mediaTypeConfig.partnerConfig){
		partnerConfig = mediaTypeConfig.partnerConfig;
	}
	if(!util.isOwnProperty(adUnits, code)){
		//TODO: Remove sizes from below as it will be deprecated soon in prebid
		// Need to check pubmaticServerBidAdapter in our fork after this change.
		adUnits[code] = {
			code: code,
			mediaTypes:{} ,
			sizes: sizes,
			adUnitId:adUnitId,
			bids: [],
			divID : divID
		};
		//Assigning it individually since mediaTypes doesn't take any extra param apart from these.
		// And We are now also getting partnerConfig for different partners
		if(mediaTypeConfig.banner){
			adUnits[code].mediaTypes["banner"] = mediaTypeConfig.banner;
		}
		if(mediaTypeConfig.native){
			adUnits[code].mediaTypes["native"] = mediaTypeConfig.native;
		}
		if(mediaTypeConfig.video){
			adUnits[code].mediaTypes["video"] = mediaTypeConfig.video;
		}
		if(adUnitConfig.renderer){
			adUnits[code]["renderer"]= adUnitConfig.renderer;
		}
		if (adUnitConfig.ortb2Imp) {
			adUnits[code]["ortb2Imp"] = adUnitConfig.ortb2Imp;
		}	
		if(adUnitConfig.floors){
			adUnits[code]["floors"]= adUnitConfig.floors;
		}
		window.PWT.adUnits = window.PWT.adUnits || {};
		window.PWT.adUnits[code] = adUnits[code];
	} else if(CONFIG.isSingleImpressionSettingEnabled()){
		// following function call basically checks whether the adapter is already configured for the given code in adunits object
		if(isAdUnitsCodeContainBidder(adUnits, code, adapterID)){
			return;
		}
	}

	pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits, partnerConfig, regexPattern);	
}

exports.generatedKeyCallbackForPbAnalytics = generatedKeyCallbackForPbAnalytics;

function pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits, partnerConfig, regexPattern){
	var slotParams = {};
	var mediaTypeConfig = adUnits[code].mediaTypes;
	var sizes = adUnits[code].sizes;
	var isWiidRequired = false; 
	if(mediaTypeConfig && util.isOwnProperty(mediaTypeConfig,"video") && adapterID != "telaria"){
		slotParams["video"]= mediaTypeConfig.video;
	}
	util.forEachOnObject(keyConfig, function(key, value){
		/* istanbul ignore next */
		slotParams[key] = value;
	});
	
	if(isPrebidPubMaticAnalyticsEnabled){
		slotParams["kgpv"] = generatedKey; // TODO : Update this in case of video, change the size to 0x0 
		slotParams["regexPattern"] = regexPattern;
	}

	if(partnerConfig && Object.keys(partnerConfig).length>0){
		util.forEachOnObject(partnerConfig, function(key, value){
			if(key == adapterID) {
				util.forEachOnObject(value, function(key, value){
					/* istanbul ignore next */
					slotParams[key] = value;
				});
			}
		});
	}

	// Logic : If for slot config for partner video parameter is present then use that
	// else take it from mediaType.video
	if(mediaTypeConfig && util.isOwnProperty(mediaTypeConfig,"video") && adapterID != "telaria"){
		if(util.isOwnProperty(slotParams,"video") && util.isObject(slotParams.video)){
			util.forEachOnObject(mediaTypeConfig.video, function(key, value){
				if(!util.isOwnProperty(slotParams["video"],key)){
					slotParams["video"][key] = value;
				}
			});
		}
		else {
			slotParams["video"]= mediaTypeConfig.video;
		}
	}
	// for pubmaticServer partner we used to pass wiid when isPrebidPubMaticAnalyticsEnabled is false but now we do not 
	// get pubmaticServer partner when usePBSAdapter flag is true so we will be adding wiid conditionally.
	if(CONFIG.usePBSAdapter()){
		slotParams["wiid"] = impressionID;
		isWiidRequired = true;
	}

	var adapterName = CONFIG.getAdapterNameForAlias(adapterID) || adapterID;
	
	//processing for each partner
	switch(adapterName){

		//todo: unit-test cases pending
		case "pubmaticServer":
			slotParams["publisherId"] = adapterConfig["publisherId"];
			slotParams["adUnitIndex"] = ''+currentSlot.getAdUnitIndex();
			slotParams["adUnitId"] = currentSlot.getAdUnitID();
			slotParams["divId"] = currentSlot.getDivID();
			slotParams["adSlot"] = generatedKey;
			slotParams["wiid"] = impressionID;
			slotParams["profId"] = CONFIG.getProfileID();
			/* istanbul ignore else*/
			if(window.PWT.udpv){
				slotParams["verId"] = CONFIG.getProfileDisplayVersionID();
			}
			adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
			break;

		case "pubmatic":
		case "pubmatic2":
			slotParams["publisherId"] = adapterConfig["publisherId"];
			slotParams["adSlot"] = slotParams["slotName"] || generatedKey;
			slotParams["wiid"] = impressionID;
			slotParams["profId"] = (adapterID == "pubmatic2") || (adapterName == "pubmatic2")  ? adapterConfig["profileId"]: CONFIG.getProfileID();
			/* istanbul ignore else*/
			if((adapterID != "pubmatic2" && adapterName != "pubmatic2") && window.PWT.udpv){
				slotParams["verId"] = CONFIG.getProfileDisplayVersionID();
			}

		// If we will be using PrebidServerBidAdaptar add wrapper object with profile and version
		if(CONFIG.usePBSAdapter() == true && CONFIG.isServerSideAdapter(adapterID)) {
			slotParams["wrapper"] = {
				profile: parseInt(CONF.pwt.pid),
				version: parseInt(CONF.pwt.pdvid)
			};
			// If mapping is regex then we should pass hashedKey to adSlot params earlier it was handled on s2s side.
			if(slotParams["hashedKey"]) {
				slotParams["adSlot"] = slotParams["hashedKey"];
			}
		}

			// We are removing mimes because it merges with the existing adUnit mimes
			// if(slotParams["video"] && slotParams["video"]["mimes"]){
			// 	delete slotParams["video"]["mimes"];
			// }
			adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
			break;
		case "pulsepoint":
			util.forEachOnArray(sizes, function(index, size){
				var slotParams = {};
				util.forEachOnObject(keyConfig, function(key, value){
					/* istanbul ignore next */
					slotParams[key] = value;
				});
				slotParams["cf"] = size[0] + "x" + size[1];
				if(isWiidRequired) {
					slotParams["wiid"] = impressionID;
				}
				adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
			});
			break;

		case "adg":
			util.forEachOnArray(sizes, function(index, size){
				var slotParams = {};
				util.forEachOnObject(keyConfig, function(key, value){
					/* istanbul ignore next */
					slotParams[key] = value;
				});
				slotParams["width"] = size[0];
				slotParams["height"] = size[1];
				if(isWiidRequired) {
					slotParams["wiid"] = impressionID;
				}
			if(!(refThis.isSingleImpressionSettingEnabled && isAdUnitsCodeContainBidder(adUnits, code, adapterID))){
				adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
			}
			});
			break;

		case "yieldlab":
			util.forEachOnArray(sizes, function(index, size){
				var slotParams = {};
				util.forEachOnObject(keyConfig, function(key, value){
					/* istanbul ignore next */
					slotParams[key] = value;
				});
				slotParams["adSize"] = size[0] + "x" + size[1];
				if(isWiidRequired) {
					slotParams["wiid"] = impressionID;
				}
			if(!(refThis.isSingleImpressionSettingEnabled && isAdUnitsCodeContainBidder(adUnits, code, adapterID))){
				adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
			}
			});
			break;
		case "ix":
		case "indexExchange":
			/** Added case ix cause indexExchange bidder has changed its bidder code in server side 
			 * this will have impact in codegen to change its adapter code from indexexchange to ix 
			 * so added a case for the same.
			*/
		
			if (slotParams["siteID"]) {
				slotParams["siteId"] = slotParams["siteID"];
				delete slotParams['siteID'];
			}
			if(isWiidRequired) {
				slotParams["wiid"] = impressionID;
			}
			adUnits [code].bids.push({bidder: adapterID, params: slotParams});
			break;
		default:
			adUnits[code].bids.push({ bidder: adapterID, params: slotParams });
			break;
	}
}

exports.pushAdapterParamsInAdunits = pushAdapterParamsInAdunits;

function generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID){
	util.log(adapterID+CONSTANTS.MESSAGES.M1);

	/* istanbul ignore else */
	if(!adapterConfig){
		return;
	}

	util.forEachGeneratedKey(
		adapterID,
		adUnits,
		adapterConfig,
		impressionID,
		[],
		activeSlots,
		isPrebidPubMaticAnalyticsEnabled ? refThis.generatedKeyCallbackForPbAnalytics : refThis.generatedKeyCallback,
		// refThis.generatedKeyCallback,
		// serverSideEabled: do not set default bids as we do not want to throttle them at client-side
		true // !CONFIG.isServerSideAdapter(adapterID)
	);
}

/* start-test-block */
exports.generatePbConf = generatePbConf;
/* end-test-block */

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
			allowAuctionWithoutConsent: CONFIG.getAwc(), // Auction without consent
			defaultGdprScope: true
		};
		var gdprActionTimeout = COMMON_CONFIG.getGdprActionTimeout()
		if (gdprActionTimeout) {
			util.log("GDPR IS ENABLED, TIMEOUT: " + prebidConfig["consentManagement"]['gdpr']['timeout'] +", ACTION TIMEOUT: "+ gdprActionTimeout);
			prebidConfig["consentManagement"]['gdpr']['actionTimeout'] = gdprActionTimeout;
		}
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

function configureBidderAliasesIfAvailable(){
	if(util.isFunction(window[pbNameSpace].aliasBidder)){
		CONFIG.forEachBidderAlias(function(alias){
			window[pbNameSpace].aliasBidder(CONF.alias[alias] && CONF.alias[alias].name ? CONF.alias[alias].name : CONF.alias[alias], alias, CONF.alias[alias] && CONF.alias[alias].gvlid ? {gvlid:CONF.alias[alias].gvlid}:{});
		});
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
				profileVersionId: CONFIG.getProfileDisplayVersionID(),
				identityOnly: (CONFIG.isUserIdModuleEnabled() ? 1 : 0)
			}
		});
	}
}

exports.enablePrebidPubMaticAnalyticIfRequired = enablePrebidPubMaticAnalyticIfRequired;

function throttleAdapter(randomNumber, adapterID){
	return !(randomNumber >= CONFIG.getAdapterThrottle(adapterID));
}

exports.throttleAdapter = throttleAdapter;

function generateAdUnitsArray(activeSlots, impressionID){
	var adUnits = {};// create ad-units for prebid
	var randomNumberBelow100 = util.getRandomNumberBelow100();

	CONFIG.forEachAdapter(function(adapterID, adapterConfig){
		// Assumption: all partners are running through PreBid,
		//				if we add any new parent-adapter, then code changes will be required
		/* istanbul ignore else */
		if(adapterID !== refThis.parentAdapterID){

			// If we will be using PrebidServerBidAdapatar then we need to check throttling for 
			// serverEnabled partners at client-side
			/* istanbul ignore if */
			if(CONFIG.usePBSAdapter() == true&& CONFIG.isServerSideAdapter(adapterID)) {
				if(refThis.throttleAdapter(randomNumberBelow100, adapterID) == false) {
					refThis.generateConfig(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
				} else {
					util.log(adapterID+CONSTANTS.MESSAGES.M2);
				}
			} else {
				// serverSideEabled: we do not want to throttle them at client-side
				/* istanbul ignore if */
				if(CONFIG.isServerSideAdapter(adapterID) || refThis.throttleAdapter(randomNumberBelow100, adapterID) == false){
					refThis.generateConfig(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
				}else{
					util.log(adapterID+CONSTANTS.MESSAGES.M2);
				}
			}
		}
	});

	// adUnits is object create array from it
	var adUnitsArray = [];
	for(var code in adUnits){
		/* istanbul ignore else */
		if(util.isOwnProperty(adUnits, code)){
			adUnitsArray.push(adUnits[code]);
		}
	}

	return adUnitsArray;
}

exports.generateAdUnitsArray = generateAdUnitsArray;

function generateConfig(adapterID, adapterConfig, activeSlots, adUnits, impressionID) {
	util.forEachOnObject(activeSlots, function(j, slot){
		bidManager.setCallInitTime(slot.getDivID(), adapterID);
	});
	refThis.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
}
exports.generateConfig = generateConfig;

function setPrebidConfig(){
	if(util.isFunction(window[pbNameSpace].setConfig) || typeof window[pbNameSpace].setConfig == "function") {
		var prebidConfig = {
			debug: util.isDebugLogEnabled(),
			cache: {
				url: CONSTANTS.CONFIG.CACHE_URL + CONSTANTS.CONFIG.CACHE_PATH,
				ignoreBidderCacheKey: true
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

		window.PWT.ssoEnabled = CONFIG.isSSOEnabled() || false;

		refThis.getFloorsConfiguration(prebidConfig);
		refThis.checkConfigLevelFloor(prebidConfig);
		refThis.assignUserSyncConfig(prebidConfig);
		refThis.assignGdprConfigIfRequired(prebidConfig);
		refThis.assignCcpaConfigIfRequired(prebidConfig);
		refThis.assignCurrencyConfigIfRequired(prebidConfig);
		refThis.assignSchainConfigIfRequired(prebidConfig);
		refThis.assignSingleRequestConfigForBidders(prebidConfig);
		refThis.readCustDimenData(prebidConfig);
		// if usePBSAdapter is 1 then add s2sConfig
		if(CONFIG.usePBSAdapter()) {
			refThis.gets2sConfig(prebidConfig);
		}
		// Check for yahoossp bidder and add property {mode: 'all'} to setConfig
		refThis.checkForYahooSSPBidder(prebidConfig);
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

function realignPubmaticAdapters(){
	if(CONF.adapters && CONF.adapters["pubmatic"]){
		var pubmaticAdpater = {"pubmatic": CONF.adapters["pubmatic"]};
		CONF.adapters = Object.assign(pubmaticAdpater, CONF.adapters);
	}
}

exports.realignPubmaticAdapters = realignPubmaticAdapters;

function gets2sConfig(prebidConfig){
	var bidderParams = {};
	var s2sBidders = CONFIG.getServerEnabledAdaptars();
	for(var key in CONF.alias) {
		defaultAliases[key] = CONF.alias[key] && CONF.alias[key].name ? CONF.alias[key].name : CONF.alias[key];
	}
	var pubmaticAndAliases = CONFIG.getPubMaticAndAlias(s2sBidders);
	if(pubmaticAndAliases.length) {
		pubmaticAndAliases.forEach(function(bidder) {
			bidderParams[bidder] = {};
		})
	}

	prebidConfig["s2sConfig"] = {
		accountId: CONFIG.getPublisherId(),
		adapter: CONSTANTS.PBSPARAMS.adapter,
		enabled: true,
		bidders: s2sBidders,
		endpoint: CONSTANTS.PBSPARAMS.endpoint,
		syncEndpoint: CONSTANTS.PBSPARAMS.syncEndpoint,
		timeout: CONFIG.getTimeoutForPBSRequest(),
		secure: 1,// request needs secure assets pass 1
		extPrebid: {
			aliases: defaultAliases,
			bidderparams: bidderParams,
			targeting: {
				pricegranularity: CONFIG.getPriceGranularity()
			},
			isPrebidPubMaticAnalyticsEnabled: CONFIG.isPrebidPubMaticAnalyticsEnabled(),
			isUsePrebidKeysEnabled: CONFIG.isUsePrebidKeysEnabled(),
			macros: CONFIG.createMacros()
		}	
	}
	// adding support for marketplace
	if(!!CONFIG.getMarketplaceBidders()){
		prebidConfig["s2sConfig"]["allowUnknownBidderCodes"] = true;
		prebidConfig["s2sConfig"]["extPrebid"]["alternatebiddercodes"] = {
			enabled: true,
			bidders: {
				pubmatic: {
					enabled: true,
					allowedbiddercodes: CONFIG.getMarketplaceBidders()
				}
			}
		}
	}
}

exports.gets2sConfig = gets2sConfig;

function hasFloorsSchema(config, prebidConfig) {
	for (var key in config) {
	  if (config.hasOwnProperty(key)) {
		if (key === 'floors' || (typeof config[key] === 'object' && hasFloorsSchema(config[key], prebidConfig))) {
			return prebidConfig['floors'] = {
				enforcement: {
					enforceJS: CONFIG.getFloorType()
				}
			};
		}
	  }
	}
	return false;
}
exports.hasFloorsSchema = hasFloorsSchema;

function checkConfigLevelFloor(prebidConfig){
	if(!prebidConfig.hasOwnProperty('floors')) {
		if(CONF.slotConfig && CONF.slotConfig.config) {
			refThis.hasFloorsSchema(CONF.slotConfig.config, prebidConfig);
		}
	}
}
exports.checkConfigLevelFloor = checkConfigLevelFloor;

function getFloorsConfiguration(prebidConfig){
	if(CONFIG.isFloorPriceModuleEnabled() == true && CONFIG.getFloorSource() !== CONSTANTS.COMMON.EXTERNAL_FLOOR_WO_CONFIG){
		prebidConfig["floors"]={
			enforcement: {
				enforceJS: CONFIG.getFloorType()
			},
			auctionDelay: CONFIG.getFloorAuctionDelay(),
			endpoint:{
				url: CONFIG.getFloorJsonUrl()
			},
			additionalSchemaFields : {
				browser : util.getBrowserDetails,
				platform_id : util.getPltForFloor
			}
		}
	}
}

exports.getFloorsConfiguration = getFloorsConfiguration;

function checkForYahooSSPBidder(prebidConfig){
	var isYahooAlias = false;
	var isYahooSSP = CONF.adapters.hasOwnProperty(CONSTANTS.YAHOOSSP);
	
	if(!isYahooSSP) {
		for(var bidder in CONF.alias) {
			bidder = bidder.name ? bidder.name : bidder;
			if(CONFIG.getAdapterNameForAlias(bidder) == CONSTANTS.YAHOOSSP) {
				isYahooAlias = true;
			}
		}
	}
	if(isYahooSSP || isYahooAlias) {
		prebidConfig[CONSTANTS.YAHOOSSP]={
			mode: "all"
		}
	}
}

exports.checkForYahooSSPBidder = checkForYahooSSPBidder;

function readCustDimenData(prebidConfig) {
	const cdsData = util.isFunction(window.getCustomDimensionsDataFromPublisher) ? window.getCustomDimensionsDataFromPublisher() : null;
	cdsData && (prebidConfig["cds"] = cdsData.cds);
}

exports.readCustDimenData = readCustDimenData;

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
        }, {
			key: 'pwtacat',
			val: function(bidResponse){
				return (bidResponse.meta && bidResponse.meta.primaryCatId) ? bidResponse.meta.primaryCatId : '';
			}
		}, {
			key: 'pwtdsp',
			val: function(bidResponse){
				return (bidResponse.meta && bidResponse.meta.networkId) ? bidResponse.meta.networkId : '';
			}
		}, {
			key: 'pwtcrid',
			val: function(bidResponse){
				return bidResponse.creativeId  ? bidResponse.creativeId : '';
			}
		}
    ];
}

exports.getPbjsAdServerTargetingConfig = getPbjsAdServerTargetingConfig;

function setPbjsBidderSettingsIfRequired(){
	if(isPrebidPubMaticAnalyticsEnabled === false){
		window[pbNameSpace].bidderSettings = {
			'standard': {
				'storageAllowed': CONF.pwt.localStorageAccess === "1" ? true : null
			}		
		};
		return;
	}
	var preBidderSetting = window[pbNameSpace].bidderSettings || {};
	window[pbNameSpace].bidderSettings = {
		'standard': {
			'suppressEmptyKeys': true, // this boolean flag can be used to avoid sending those empty values to the ad server.
			'storageAllowed': CONF.pwt.localStorageAccess === "1" ? true : null
		}		
	};


	if(CONFIG.isUsePrebidKeysEnabled() === false){
		window[pbNameSpace].bidderSettings['standard']['adserverTargeting'] = getPbjsAdServerTargetingConfig();
	}

	// adding bidder level settings
	CONFIG.forEachAdapter(function(adapterID){
		if(window[pbNameSpace].bidderSettings.hasOwnProperty(adapterID) === false){
			window[pbNameSpace].bidderSettings[adapterID] = {};
			// adding marketplace params
			if(adapterID === "pubmatic" && !!CONFIG.getMarketplaceBidders()){
				window[pbNameSpace].bidderSettings[adapterID]['allowAlternateBidderCodes'] = true;
				window[pbNameSpace].bidderSettings[adapterID]['allowedAlternateBidderCodes'] = CONFIG.getMarketplaceBidders();
			}
			// adding bidCpmAdjustment			
			window[pbNameSpace].bidderSettings[adapterID]['bidCpmAdjustment'] = function(bidCpm, bid){
				return window.parseFloat((bidCpm * CONFIG.getAdapterRevShare(adapterID)).toFixed(CONSTANTS.COMMON.BID_PRECISION));
			}
			// Check if code snippets has storageAllowed set to particular partner
			if(preBidderSetting[adapterID]) {
				window[pbNameSpace].bidderSettings[adapterID]['storageAllowed'] = preBidderSetting[adapterID]['storageAllowed'];
			}
		}
	});

	// Check if code snippet modified storageAllowed with standard settings.
	if(preBidderSetting['standard']) {
		window[pbNameSpace].bidderSettings['standard']['storageAllowed'] = preBidderSetting['standard']['storageAllowed'];
	}
}

exports.setPbjsBidderSettingsIfRequired = setPbjsBidderSettingsIfRequired;

function pbjsBidsBackHandler(bidResponses, activeSlots) {
	util.log("In PreBid bidsBackHandler with bidResponses: ");
	util.log(bidResponses);
	setTimeout(window[pbNameSpace].triggerUserSyncs, 10);
	//TODO: this blockk is used only for analytics enabled thus it should be covered in callback function?
	//		callback function behaviour will be different for different controllers?
	//			diff behaviour can be managed in respective controller code
	//		making the callback related code changes will be good to manage respective code	
	// we may not request bids for all slots from Prebid if we do not find mapping for a slot thus looping on activeSlots
	function setPossibleBidRecieved(){
		util.forEachOnArray(activeSlots, function(i, activeSlot){
			bidManager.setAllPossibleBidsReceived(activeSlot.getDivID());
		});
	}
	if(CONFIG.getAdServerCurrency()){
		//Added timeout for issue in GPT should execute dfp as soon as all bids are available
		setTimeout(setPossibleBidRecieved,300);
	}
	else{
		setPossibleBidRecieved();
	}
}

exports.pbjsBidsBackHandler = pbjsBidsBackHandler;

// this function will be called by controllers, 
// will take care of setting the config as it is configured thru UI
function initPbjsConfig(){
	if(! window[pbNameSpace]){ // todo: move this code owt.js
		util.logError("PreBid js is not loaded");
		return;
	}
	window[pbNameSpace].logging = util.isDebugLogEnabled();
	refThis.realignPubmaticAdapters();
	refThis.setPrebidConfig();
	refThis.configureBidderAliasesIfAvailable();
	refThis.enablePrebidPubMaticAnalyticIfRequired();
	refThis.setPbjsBidderSettingsIfRequired();
	util.getGeoInfo();
}
exports.initPbjsConfig = initPbjsConfig;

function fetchBids(activeSlots){

	var impressionID = util.generateUUID();
	// todo: 
	// 	Accept a call back function, pass it from controllers only if pbjs-analytics is enabled
	//		if possible try to use the callback for all cases
	//  TRY not make many changes in GPT controller

	/* istanbul ignore else */
	if(! window[pbNameSpace]){ // todo: move this code owt.js
		util.logError("PreBid js is not loaded");
		return;
	}

	// calling some bid-manager functions to reset, and set new sizes
	// todo: can be moved to a function
	util.forEachOnArray(activeSlots, function(key, slot){
        var divID = slot.getDivID();
        bidManager.resetBid(divID, impressionID);
        bidManager.setSizes(divID, util.generateSlotNamesFromPattern(slot, "_W_x_H_"));
    });	

	// todo: this is the function that basically puts bidder params in all adUnits, expose it separately
	var adUnitsArray = refThis.generateAdUnitsArray(activeSlots, impressionID);
	/* istanbul ignore else */
	if(adUnitsArray.length > 0 && window[pbNameSpace]){

		try{
			/* With prebid 2.0.0 it has started using FunHooks library which provides
			   proxy object instead of wrapper function by default so in case of safari and IE 
			   below check of util gives us Object instead of function hence return false and does
			   not work on safari and ie. Introduced one more check of typeof to check for function.
			   This if code is just safe check and may be removed in near future.
			*/
			/* istanbul ignore else */

			if(util.isFunction(window[pbNameSpace].requestBids) || typeof window[pbNameSpace].requestBids == "function"){
				
				// Adding a hook for publishers to modify the adUnits we are passing to Prebid
				util.handleHook(CONSTANTS.HOOKS.PREBID_REQUEST_BIDS, [ adUnitsArray ]);
				
				window[pbNameSpace].removeAdUnit();
				window[pbNameSpace].addAdUnits(adUnitsArray);
				window[pbNameSpace].requestBids({
					bidsBackHandler: function(bidResponses){
						refThis.pbjsBidsBackHandler(bidResponses, activeSlots);
					},
					timeout: CONFIG.getTimeout() - CONSTANTS.CONFIG.TIMEOUT_ADJUSTMENT
				});
			} else {
				util.log("PreBid js requestBids function is not available");
				return;
			}
		} catch (e) {
			util.logError("Error occured in calling PreBid.");
			util.logError(e);
		}
	}
}

/* start-test-block */
exports.fetchBids = fetchBids;
/* end-test-block */

// returns the highest bid and its key value pairs
function getBid(divID){
	var wb = window[pbNameSpace].getHighestCpmBids([divID])[0] || null;
	if(wb){
		wb.adHtml = wb.ad;
		wb.adapterID = wb.bidder;
		wb.netEcpm = wb.cpm;
		wb.grossEcpm = wb.originalCpm;
	}

	var outputObj =  {
		wb: wb,
		kvp: window[pbNameSpace].getAdserverTargetingForAdUnitCode([divID]) || null
	};
	if(isPrebidPubMaticAnalyticsEnabled && outputObj.kvp['pwtdeal'] ){
		delete outputObj.kvp['pwtdeal'];// Check for null object && usePrebidAnalyticsAdapter 
	} 
	return outputObj;
}

exports.getBid = getBid;
