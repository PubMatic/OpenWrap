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

var parentAdapterID = CONSTANTS.COMMON.PARENT_ADAPTER_PREBID;

var pbNameSpace = CONSTANTS.COMMON.PREBID_NAMESPACE;

/* start-test-block */
exports.parentAdapterID = parentAdapterID;
/* end-test-block */
var kgpvMap = {};

/* start-test-block */
exports.kgpvMap = kgpvMap;
/* end-test-block */

var refThis = this;
var onEventAdded = false;
var isPrebidPubMaticAnalyticsEnabled = CONFIG.isPrebidPubMaticAnalyticsEnabled();
var isSingleImpressionSettingEnabled = CONFIG.isSingleImpressionSettingEnabled();
var defaultAliases = CONSTANTS.DEFAULT_ALIASES;

/* start-test-block */
exports.isSingleImpressionSettingEnabled = isSingleImpressionSettingEnabled;
/* end-test-block */

// removeIf(removeLegacyAnalyticsRelatedCode)
function transformPBBidToOWBid(bid, kgpv, regexPattern){
	var rxPattern = regexPattern || bid.regexPattern || undefined;
	var theBid = BID.createBid(bid.bidderCode, kgpv);
	var pubmaticServerErrorCode = parseInt(bid.pubmaticServerErrorCode);
	if(!!CONFIG.getAdServerCurrency()){
		// if a bidder has same currency as of pbConf.currency.adServerCurrency then Prebid does not set pbBid.originalCurrency and pbBid.originalCurrency value
		// thus we need special handling
		if(!util.isOwnProperty(bid, "originalCpm")){
			bid.originalCpm = bid.cpm;
		}
		if(!util.isOwnProperty(bid, "originalCurrency")){
			bid.originalCurrency = util.getCurrencyToDisplay();
		}
	}
	if(bid.status == CONSTANTS.BID_STATUS.BID_REJECTED){
		theBid.setGrossEcpm(bid.originalCpm, bid.originalCurrency, util.getCurrencyToDisplay(), bid.status);
	}
	else{
		theBid.setGrossEcpm(bid.cpm);
	}
	theBid.setDealID(bid.dealId);
	theBid.setDealChannel(bid.dealChannel);
	theBid.setAdHtml(bid.ad || "");
	theBid.setAdUrl(bid.adUrl || "");
	theBid.setWidth(bid.width);
	theBid.setHeight(bid.height);
	theBid.setMi(bid.mi);
	if(bid.videoCacheKey){
		theBid.setVastCache(bid.videoCacheKey);
	}
	if(bid.vastUrl){
		theBid.setVastUrl(bid.vastUrl);
	}
	if(bid.vastXml){
		theBid.setVastUrl(bid.vastUrl);
	}
	if(bid.renderer){
		theBid.setRenderer(bid.renderer);
	}
	if(bid.native){
		theBid.setNative(bid.native);
	}
	if(rxPattern){
		theBid.setRegexPattern(rxPattern);
	}
	if(bid.mediaType == CONSTANTS.FORMAT_VALUES.VIDEO){
		if(bid.videoCacheKey){
			theBid.setcacheUUID(bid.videoCacheKey);
		}
		theBid.updateBidId(bid.adUnitCode);
	}
	if(bid.mediaType && (parseFloat(bid.cpm) > 0 || bid.status == CONSTANTS.BID_STATUS.BID_REJECTED)){
		theBid.setAdFormat(bid.adHtml, bid.mediaType);
	}
	if (bid.sspID){
		theBid.setsspID(bid.sspID);
	}
	theBid.setReceivedTime(bid.responseTimestamp);
	theBid.setServerSideResponseTime(bid.serverSideResponseTime);
	// Check if currency conversion is enabled or not
	/*istanbul ignore else */
	if(CONFIG.getAdServerCurrency()){
		theBid.setOriginalCpm(window.parseFloat(bid.originalCpm));
		theBid.setOriginalCurrency(bid.originalCurrency);
		if(util.isFunction(bid.getCpmInNewCurrency)){
			theBid.setAnalyticsCpm(window.parseFloat(bid.getCpmInNewCurrency(CONSTANTS.COMMON.ANALYTICS_CURRENCY)), bid.status);
		} else {
			theBid.setAnalyticsCpm(theBid.getGrossEcpm(), bid.status);
		}
	}
	/*
		errorCodes meaning:
		1 = UNMAPPED_SLOT_ERROR
		2 = MISSING_CONF_ERROR
		3 = TIMEOUT_ERROR
		4 = NO_BID_PREBID_ERROR
		5 = PARTNER_TIMEDOUT_ERROR
		6 = INVALID_CONFIGURATION_ERROR
		7 = NO_GDPR_CONSENT_ERROR
		11 = ALL_PARTNER_THROTTLED
		12 = PARTNER_THROTTLED
		500 = API_RESPONSE_ERROR
	*/
	if(pubmaticServerErrorCode === 1 || pubmaticServerErrorCode === 2 || pubmaticServerErrorCode === 6 || pubmaticServerErrorCode === 11 || pubmaticServerErrorCode === 12) {
		theBid.setDefaultBidStatus(-1);
		theBid.setWidth(0);
		theBid.setHeight(0);
	} else if (pubmaticServerErrorCode === 3 || pubmaticServerErrorCode === 4 || pubmaticServerErrorCode === 5) {
		theBid.setDefaultBidStatus(0);
		/*istanbul ignore else */
		if (theBid.isServerSide === 0) {
			theBid.setPostTimeoutStatus();
		}
	} else {
		pubmaticServerErrorCode && theBid.setDefaultBidStatus(1);
	}

	util.forEachOnObject(bid.adserverTargeting, function(key, value){
		if (key !== "hb_format" && key !== "hb_source") {
			theBid.setKeyValuePair(key, value);
		}
	});
	theBid.setPbBid(bid);
	return theBid;
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
/* start-test-block */
exports.transformPBBidToOWBid = transformPBBidToOWBid;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
// This function is used to check size for the winning kgpv and if size is different then winning then modify it
// to have same code for logging and tracking 
function checkAndModifySizeOfKGPVIfRequired(bid, kgpv){
	var responseObject={
		"responseKGPV" : "",
		"responseRegex": ""
	};

	// Logic to find out KGPV for partner for which the bid is recieved.
	// Need to check for No Bid Case.
	kgpv.kgpvs.length > 0 && kgpv.kgpvs.forEach(function(ele){
		/* istanbul ignore else */
		if(bid.bidderCode == ele.adapterID){
			responseObject.responseKGPV = ele.kgpv;
			responseObject.responseRegex = ele.regexPattern;
		}
	});
	var responseIdArray = responseObject.responseKGPV.split("@");
	var sizeIndex = 1;
	var isRegex = false;
	/* istanbul ignore else */
	if(responseIdArray &&  (responseIdArray.length == 2 || ((responseIdArray.length == 3) && (sizeIndex = 2) && (isRegex=true))) && bid.mediaType != "video"){
		var responseIdSize = responseIdArray[sizeIndex];
		var responseIndex = null;
		// Below check if ad unit index is present then ignore it
		// TODO: Confirm it needs to be ignored or not
		/* istanbul ignore else */
		if(responseIdArray[sizeIndex].indexOf(":")>0){
			responseIdSize= responseIdArray[sizeIndex].split(":")[0];
			responseIndex = responseIdArray[sizeIndex].split(":")[1];
		}
		/* istanbul ignore else */
		if(bid.getSize() && bid.getSize() != responseIdSize && (bid.getSize().toUpperCase() != "0X0")){
			// Below check is for size level mapping
			// ex. 300x250@300X250 is KGPV generated for first size but the winning size is 728x90 
			// then new KGPV will be replaced to 728x90@728X90
			/* istanbul ignore else */
			if(responseIdArray[0].toUpperCase() == responseIdSize.toUpperCase()){
				responseIdArray[0] = bid.getSize().toLowerCase();
			}
			if(isRegex){
				responseObject.responseKGPV = responseIdArray[0] + "@" + responseIdArray[1] + "@" +  bid.getSize();
			}
			else{
				responseObject.responseKGPV = responseIdArray[0] + "@" +  bid.getSize();
			}
			// Below check is to make consistent behaviour with ad unit index
			// it again appends index if it was originally present
			if(responseIndex){
				responseObject.responseKGPV = responseObject.responseKGPV + ":" + responseIndex;
			}
		}
	
	}
	return responseObject;
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
/* start-test-block */
exports.checkAndModifySizeOfKGPVIfRequired = checkAndModifySizeOfKGPVIfRequired;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
function pbBidStreamHandler(pbBid){
	var responseID = pbBid.adUnitCode || "";

	// NEW APPROACH
	//todo: unit-test cases pending
	/* istanbul ignore else */
	if(util.isOwnProperty(refThis.kgpvMap, responseID)){

		if(!!pbBid.floorData){
			window.PWT.floorData['floorResponseData'] = pbBid.floorData;
		}
		/**Special Hack for pubmaticServer for tracker/logger kgpv */
		/* istanbul ignore else */
		if(pbBid.bidderCode === 'pubmaticServer'){
			pbBid.bidderCode = pbBid.originalBidder;
		}

		// If Single impression is turned on then check and modify kgpv as per bid response size
		/* istanbul ignore else */
		if(refThis.isSingleImpressionSettingEnabled){
			// Assinging kbpv after modifying and will be used for logger and tracker purposes
			// this field will be replaced everytime a bid is received with single impression feature on
			var kgpvAndRegexOfBid = refThis.checkAndModifySizeOfKGPVIfRequired(pbBid,refThis.kgpvMap[responseID]);
			refThis.kgpvMap[responseID].kgpv =kgpvAndRegexOfBid.responseKGPV;
			refThis.kgpvMap[responseID].regexPattern =kgpvAndRegexOfBid.responseRegex;
			// : Put a field Regex Pattern in KGPVMAP so that it can be passed on to the bid and to the logger
			// Something like this refThis.kgpvMap[responseID].regexPattern = pbBid.refThis.kgpvMap[responseID].regexPattern;

		}

		/*
			- special handling for serverSideEnabled
			- get the actual divId = kgpvMap[ pbBid.adUnitCode ].divID
			- now check if divID @ pbBid.bidderCode @ pbBid.width X pbBid.height exists in kgpvMap
				if yes this is new responseID
			- else check if divID @ pbBid.bidderCode exists in kgpvMap
				if yes this is new responseID
			- else do nothing, log failure

			Pros:
				no need of divid and kgpv to be returned in bid from prebid
					no need to add custom keys in Prebid bid object, they might standerdize it in future
		*/

		/* istanbul ignore else */
		if(pbBid.bidderCode && CONFIG.isServerSideAdapter(pbBid.bidderCode)){
			var divID = refThis.kgpvMap[responseID].divID;
			if(!refThis.isSingleImpressionSettingEnabled){
				var temp1 = refThis.getPBCodeWithWidthAndHeight(divID, pbBid.bidderCode, pbBid.width, pbBid.height);
				var temp2 = refThis.getPBCodeWithoutWidthAndHeight(divID, pbBid.bidderCode);

				if(util.isOwnProperty(refThis.kgpvMap, temp1)){
					responseID = temp1;
				}else if(util.isOwnProperty(refThis.kgpvMap, temp2)){
					responseID = temp2;
				}else{
					util.logWarning("Failed to find kgpv details for S2S-adapter:"+ pbBid.bidderCode);
					return;
				}
			}
			pbBid.ss = CONFIG.isServerSideAdapter(pbBid.bidderCode) ? 1 : 0;
		}

		/* istanbul ignore else */
		if(pbBid.bidderCode){
			// Adding a hook for publishers to modify the bid we have to store
			// we should NOT call the hook for defaultbids and post-timeout bids
			//			default bids handled here
			//			timeoutForPrebid check is added to avoid Hook call for post-timeout bids
			// Here slotID, adapterID, and latency are read-only and theBid can be modified
			if(pbBid.timeToRespond < (CONFIG.getTimeout() - CONSTANTS.CONFIG.TIMEOUT_ADJUSTMENT)){
				util.handleHook(CONSTANTS.HOOKS.BID_RECEIVED, [refThis.kgpvMap[responseID].divID, pbBid]);
			}			
			bidManager.setBidFromBidder(
				refThis.kgpvMap[responseID].divID,
				refThis.transformPBBidToOWBid(pbBid, refThis.kgpvMap[responseID].kgpv,refThis.kgpvMap[responseID].regexPattern)
			);
		}
	}else{
		util.logWarning("Failed to find pbBid.adUnitCode in kgpvMap, pbBid.adUnitCode:"+ pbBid.adUnitCode);
	}
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
/* start-test-block */
exports.pbBidStreamHandler = pbBidStreamHandler;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
function pbBidRequestHandler(pbBid){
	pbBid.bids.forEach(function(oBid){
		window.PWT.floorData['floorRequestData'] = oBid.floorData;
	})
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)
  
// removeIf(removeLegacyAnalyticsRelatedCode)
/* start-test-block */
exports.pbBidRequestHandler = pbBidRequestHandler;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
function getPBCodeWithWidthAndHeight(divID, adapterID, width, height){
	return divID + "@" + adapterID + "@" + width + "X" + height;
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
/* start-test-block */
exports.getPBCodeWithWidthAndHeight = getPBCodeWithWidthAndHeight;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
function getPBCodeWithoutWidthAndHeight(divID, adapterID){
	return divID + "@" + adapterID;
}
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
/* start-test-block */
exports.getPBCodeWithoutWidthAndHeight = getPBCodeWithoutWidthAndHeight;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

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
	} else if(CONFIG.isSingleImpressionSettingEnabled()){
		// following function call basically checks whether the adapter is already configured for the given code in adunits object
		if(isAdUnitsCodeContainBidder(adUnits, code, adapterID)){
			return;
		}
	}

	pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits, partnerConfig, regexPattern);	
}

exports.generatedKeyCallbackForPbAnalytics = generatedKeyCallbackForPbAnalytics;

// removeIf(removeLegacyAnalyticsRelatedCode)
function generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight,regexPattern){

	var code, sizes, divID = currentSlot.getDivID();
	var adUnitId = currentSlot.getAdUnitID();
	var mediaTypeConfig;
	var partnerConfig;

	if(!refThis.isSingleImpressionSettingEnabled){
		if(kgpConsistsWidthAndHeight){
			code = refThis.getPBCodeWithWidthAndHeight(divID, adapterID, currentWidth, currentHeight);
			sizes = [[currentWidth,currentHeight]];
		}else{
			code = refThis.getPBCodeWithoutWidthAndHeight(divID, adapterID);
			sizes = currentSlot.getSizes();	
		}
		refThis.kgpvMap [ code ] = {
			kgpv: generatedKey,
			divID: divID,
			regexPattern:regexPattern
		};
	} else{
		/* This will be executed in case single impression feature is enabled.
		Below statements assign code as div and sizes as all sizes of ad slot
		it generates kgpvmap consisting of kgpvs as property 
		if in kgpv map code exists and kgpv exists then 
			if a adapter with a single kgpv exists in kgpvs then it ignores and returns from this function
			if a adapter does not exist for the code then a entry is being pushed in kgpvs with adapterid and kgpv for the bidder
		 if code does not consists in kgpv object then a entry is made with adapter first calling it.*/
		code = currentSlot.getDivID();
		sizes = currentSlot.getSizes();
		var adapterAlreadyExsistsInKGPVS = false;
		if (refThis.kgpvMap[code] && refThis.kgpvMap[code].kgpvs && refThis.kgpvMap[code].kgpvs.length > 0){
			util.forEachOnArray(refThis.kgpvMap[code].kgpvs, function(idx,kgpv){
				// We want to have one adapter entry for one bidder and one code/adSlot
				/*istanbul ignore else*/
				if(kgpv.adapterID == adapterID){
					adapterAlreadyExsistsInKGPVS = true;
				}
			});
			/*istanbul ignore else*/
			if(adapterAlreadyExsistsInKGPVS && isAdUnitsCodeContainBidder(adUnits, code, adapterID)){
				return;
			}
		}
		else{
			refThis.kgpvMap[code] = {
				kgpvs : [],
				divID: divID
			};
		}
		if(!adapterAlreadyExsistsInKGPVS){
			var kgpv = {
				adapterID: adapterID,
				kgpv:generatedKey,
				regexPattern:regexPattern
			};
			refThis.kgpvMap[code].kgpvs.push(kgpv);
		}
	}
	
	//If we are using PubMaticServerBidAdapatar then serverSideEabled: do not add config into adUnits. 
	//If we are using PrebidServerBidAdapatar then we need to add config into adUnits.
	if(CONFIG.isServerSideAdapter(adapterID) && CONFIG.usePBSAdapter() != true){
		util.log("Not calling adapter: "+ adapterID + ", for " + generatedKey +", as it is serverSideEnabled.");
		return;
	}

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
			adUnitId: adUnitId,
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
		window.PWT.adUnits = window.PWT.adUnits || {};
		window.PWT.adUnits[code] = adUnits[code];
	}else if(refThis.isSingleImpressionSettingEnabled){
		if(isAdUnitsCodeContainBidder(adUnits, code, adapterID)){
			return;
		}
	}

	// todo: is this block required? isn't it covered in above if block?
	// in case there are multiple bidders ,we don't generate the config again but utilize the existing mediatype.
	if(util.isOwnProperty(adUnits, code)){
		mediaTypeConfig = adUnits[code].mediaTypes;		
	}

	pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits, partnerConfig, regexPattern);	
}

/* start-test-block */
exports.generatedKeyCallback = generatedKeyCallback;
/* end-test-block */
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

function pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits, partnerConfig, regexPattern){
	var slotParams = {};
	var mediaTypeConfig = adUnits[code].mediaTypes;
	var sizes = adUnits[code].sizes;
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
			if(isPrebidPubMaticAnalyticsEnabled === false){
				slotParams["wiid"] = impressionID;
			}
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
			if(isPrebidPubMaticAnalyticsEnabled === false){
				slotParams["wiid"] = impressionID;
			}
			slotParams["profId"] = (adapterID == "pubmatic2") || (adapterName == "pubmatic2")  ? adapterConfig["profileId"]: CONFIG.getProfileID();
			/* istanbul ignore else*/
			if((adapterID != "pubmatic2" && adapterName != "pubmatic2") && window.PWT.udpv){
				slotParams["verId"] = CONFIG.getProfileDisplayVersionID();
			}

			// If we will be using PrebidServerBidAdaptar add wrapper object with profile and version
			if(CONFIG.usePBSAdapter() == true && CONFIG.isServerSideAdapter(adapterID)) {
				slotParams["wiid"] = impressionID;
				slotParams["wrapper"] = {
					profile: parseInt(CONF.pwt.pid),
					version: parseInt(CONF.pwt.pdvid)
				};
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
		
			util.forEachOnArray(sizes, function(index, size) {
			var sltParams = {};
			if(slotParams && slotParams.video){
				sltParams["video"] = slotParams["video"];
				}
				if (keyConfig["siteID"]) {
				sltParams["siteId"] = keyConfig["siteID"];
				}
				if (keyConfig["id"]) {
				sltParams["id"] = keyConfig["id"];
				}
			sltParams["size"] = size;
			adUnits [code].bids.push({bidder: adapterID, params: sltParams});
			});
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

// removeIf(removeLegacyAnalyticsRelatedCode)
function addOnBidResponseHandler(){
	if(util.isFunction(window[pbNameSpace].onEvent)){
		if(!onEventAdded){
			window[pbNameSpace].onEvent('bidResponse', refThis.pbBidStreamHandler);
			onEventAdded = true;
		}		
	} else {
		util.logWarning("PreBid js onEvent method is not available");
		return;
	}
}
exports.addOnBidResponseHandler = addOnBidResponseHandler;
// endRemoveIf(removeLegacyAnalyticsRelatedCode)

// removeIf(removeLegacyAnalyticsRelatedCode)
function addOnBidRequestHandler(){
	if(util.isFunction(window[pbNameSpace].onEvent)){
		window[pbNameSpace].onEvent('bidRequested', refThis.pbBidRequestHandler);
	} else {
		util.logWarning("PreBid js onEvent method is not available");
		return;
	}
}
exports.addOnBidRequestHandler = addOnBidRequestHandler;
// endRemoveIf(removeLegacyAnalyticsRelatedCode)
  
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

		window.PWT.ssoEnabled = CONFIG.isSSOEnabled() || false;

		refThis.getFloorsConfiguration(prebidConfig)
		refThis.assignUserSyncConfig(prebidConfig);
		refThis.assignGdprConfigIfRequired(prebidConfig);
		refThis.assignCcpaConfigIfRequired(prebidConfig);
		refThis.assignCurrencyConfigIfRequired(prebidConfig);
		refThis.assignSchainConfigIfRequired(prebidConfig);
		refThis.assignSingleRequestConfigForBidders(prebidConfig);
		// if usePBSAdapter is 1 then add s2sConfig
		if(CONFIG.usePBSAdapter()) {
			refThis.gets2sConfig(prebidConfig);
		}
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

function gets2sConfig(prebidConfig){
	var bidderParams = {};
	var s2sBidders = CONFIG.getServerEnabledAdaptars();
	var queryParams = "?pubId="+CONFIG.getPublisherId()+"&profId="+CONFIG.getProfileID()+"&verId="+CONFIG.getProfileDisplayVersionID();
	for(var key in CONF.alias) {
		defaultAliases[key] = CONF.alias[key];
	}
	var pubmaticAndAliases = CONFIG.getPubMaticAndAlias(s2sBidders);
	if(pubmaticAndAliases.length) {
		pubmaticAndAliases.forEach(function(bidder) {
			bidderParams[bidder] = {};
		})
	}

	prebidConfig["s2sConfig"] = {
		accountId: CONSTANTS.PBSPARAMS.accountId,
		adapter: CONSTANTS.PBSPARAMS.adapter,
		enabled: true,
		bidders: s2sBidders,
		endpoint: CONSTANTS.PBSPARAMS.endpoint+queryParams,
		syncEndpoint: CONSTANTS.PBSPARAMS.syncEndpoint,
		timeout: CONFIG.getTimeoutForPBSRequest(),
		extPrebid: {
			aliases: defaultAliases,
			bidderparams: bidderParams,
			targeting: {
				pricegranularity: CONFIG.getPriceGranularity()
			}  
		}	
	}
}

exports.gets2sConfig = gets2sConfig;

function getFloorsConfiguration(prebidConfig){
	if(CONFIG.isFloorPriceModuleEnabled() == true){
		prebidConfig["floors"]={
			enforcement: {
				enforceJS: CONFIG.getFloorType()
			},
			auctionDelay: CONFIG.getFloorAuctionDelay(),
			endpoint:{
				url: CONFIG.getFloorJsonUrl()
			}
		}
	}
}

exports.getFloorsConfiguration = getFloorsConfiguration;

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
	refThis.setPrebidConfig();
	refThis.configureBidderAliasesIfAvailable();
	refThis.enablePrebidPubMaticAnalyticIfRequired();
	refThis.setPbjsBidderSettingsIfRequired();
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
				
				// removeIf(removeLegacyAnalyticsRelatedCode)
				if(isPrebidPubMaticAnalyticsEnabled === false){
					// we do not want this call when we have PrebidAnalytics enabled
					refThis.addOnBidResponseHandler();
					refThis.addOnBidRequestHandler();
				}
				// endRemoveIf(removeLegacyAnalyticsRelatedCode)

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
