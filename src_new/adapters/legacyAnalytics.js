var CONSTANTS = require("../constants.js");
var util = require("../util.js");
var CONFIG = require("../config.js");

var refThis = this;
var pbNameSpace = CONSTANTS.COMMON.PREBID_NAMESPACE;
var isPrebidPubMaticAnalyticsEnabled = CONFIG.isPrebidPubMaticAnalyticsEnabled();
var isSingleImpressionSettingEnabled = CONFIG.isSingleImpressionSettingEnabled();

function transformPBBidToOWBid(bid, kgpv, regexPattern){
	var rxPattern = regexPattern || bid.regexPattern || undefined;
	var theBid = BID.createBid(bid.bidderCode, kgpv);
	var pubmaticServerErrorCode = parseInt(bid.pubmaticServerErrorCode);
	theBid.setGrossEcpm(bid.cpm);
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
		// if a bidder has same currency as of pbConf.currency.adServerCurrency then Prebid does not set pbBid.originalCurrency and pbBid.originalCurrency value
		// thus we need special handling
		if(!util.isOwnProperty(bid, "originalCpm")){
			bid.originalCpm = bid.cpm;
		}
		if(!util.isOwnProperty(bid, "originalCurrency")){
			bid.originalCurrency = util.getCurrencyToDisplay();
		}
		theBid.setOriginalCpm(window.parseFloat(bid.originalCpm));
		theBid.setOriginalCurrency(bid.originalCurrency);
		if(util.isFunction(bid.getCpmInNewCurrency)){
			theBid.setAnalyticsCpm(window.parseFloat(bid.getCpmInNewCurrency(CONSTANTS.COMMON.ANALYTICS_CURRENCY)));
		} else {
			theBid.setAnalyticsCpm(theBid.getGrossEcpm());
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

/* start-test-block */
exports.transformPBBidToOWBid = transformPBBidToOWBid;
/* end-test-block */

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

/* start-test-block */
exports.checkAndModifySizeOfKGPVIfRequired = checkAndModifySizeOfKGPVIfRequired;
/* end-test-block */

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

/* start-test-block */
exports.pbBidStreamHandler = pbBidStreamHandler;
/* end-test-block */

function pbBidRequestHandler(pbBid){
	pbBid.bids.forEach(function(oBid){
		window.PWT.floorData['floorRequestData'] = oBid.floorData;
	})
}

/* start-test-block */
exports.pbBidRequestHandler = pbBidRequestHandler;
/* end-test-block */

function getPBCodeWithWidthAndHeight(divID, adapterID, width, height){
	return divID + "@" + adapterID + "@" + width + "X" + height;
}

/* start-test-block */
exports.getPBCodeWithWidthAndHeight = getPBCodeWithWidthAndHeight;
/* end-test-block */

function getPBCodeWithoutWidthAndHeight(divID, adapterID){
	return divID + "@" + adapterID;
}

/* start-test-block */
exports.getPBCodeWithoutWidthAndHeight = getPBCodeWithoutWidthAndHeight;
/* end-test-block */

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
	
	//serverSideEabled: do not add config into adUnits
	if(CONFIG.isServerSideAdapter(adapterID)){
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

function addOnBidRequestHandler(){
	if(util.isFunction(window[pbNameSpace].onEvent)){
		window[pbNameSpace].onEvent('bidRequested', refThis.pbBidRequestHandler);
	} else {
		util.logWarning("PreBid js onEvent method is not available");
		return;
	}
}
exports.addOnBidRequestHandler = addOnBidRequestHandler;
