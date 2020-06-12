/*
	Notes:
		Whenever we support a new PB adapter, we need to check if it needs actual sizes to be passed,
			if so we will need to add special handling
		PreBid does not do mandatory parameters checking
*/
var CONFIG = require("../config.js");
var CONSTANTS = require("../constants.js");
var BID = require("../bid.js");
var util = require("../util.js");
var bidManager = require("../bidManager.js");
var adapterManager = require("../adapterManager.js");
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
var timeoutForPrebid = CONFIG.getTimeout()-50;
var onEventAdded = false;
var isPrebidPubMaticAnalyticsEnabled = CONFIG.isPrebidPubMaticAnalyticsEnabled();
var isSingleImpressionSettingEnabled = CONFIG.isSingleImpressionSettingEnabled();

/* start-test-block */
exports.isSingleImpressionSettingEnabled = isSingleImpressionSettingEnabled;
/* end-test-block */

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
			if(pbBid.timeToRespond < timeoutForPrebid){
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

// this function is no more used
function handleBidResponses(bidResponses){
	for(var responseID in bidResponses){
		/* istanbul ignore else */
		if(util.isOwnProperty(bidResponses, responseID) && util.isOwnProperty(refThis.kgpvMap, responseID)){
			var bidObject = bidResponses[responseID];
			var bids = bidObject.bids || [];

			for(var i = 0; i<bids.length; i++){
				var bid = bids[i];
				/* istanbul ignore else */
				if(bid.bidderCode){
					bidManager.setBidFromBidder(refThis.kgpvMap[responseID].divID, transformPBBidToOWBid(bid, refThis.kgpvMap[responseID].kgpv));
				}
			}
		}
	}
}

/* start-test-block */
exports.handleBidResponses = handleBidResponses;
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
exports.isAdUnitsCodeContainBidder = isAdUnitsCodeContainBidder;
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
exports.getPBCodeWithoutWidthAndHeight = getPBCodeWithoutWidthAndHeight;
/* end-test-block */

function generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight,regexPattern){

	var code, sizes, divID = currentSlot.getDivID();
	var mediaTypeConfig;
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
	if(!util.isOwnProperty(adUnits, code)){
		var adUnitConfig = util.getAdUnitConfig(sizes, currentSlot);
		mediaTypeConfig = adUnitConfig.mediaTypeObject;
		//TODO: Remove sizes from below as it will be deprecated soon in prebid
		// Need to check pubmaticServerBidAdapter in our fork after this change.
		adUnits[code] = {
			code: code,
			mediaTypes:mediaTypeConfig ,
			sizes: sizes,
			bids: [],
			divID : divID
		};
		if(adUnitConfig.renderer){
			adUnits[code]["renderer"]= adUnitConfig.renderer;
		}
	}else if(refThis.isSingleImpressionSettingEnabled){
		if(isAdUnitsCodeContainBidder(adUnits, code, adapterID)){
			return;
		}
	}

	pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits);
}

/* start-test-block */
exports.generatedKeyCallback = generatedKeyCallback;
/* end-test-block */

// todo: unit test cases pending
function generatedKeyCallbackForPbAnalytics(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight){
	var code, sizes, divID;
	
	if(CONFIG.isServerSideAdapter(adapterID)){
		util.log("Not calling adapter: "+ adapterID + ", for " + generatedKey +", as it is serverSideEnabled.");
		return;
	}

	divID = currentSlot.getDivID();
	code = currentSlot.getDivID();
	sizes = currentSlot.getSizes();

	/* istanbul ignore else */
	if(!util.isOwnProperty(adUnits, code)){
		adUnits[code] = {
			code: code,
			mediaTypes: util.getMediaTypeObject(CONFIG.getNativeConfiguration(), sizes, currentSlot),
			sizes: sizes,
			bids: [],
			divID : divID
		};
	} else if(CONFIG.isSingleImpressionSettingEnabled()){
		// following function call basically checks whether the adapter is already configured for the given code in adunits object
		if(isAdUnitsCodeContainBidder(adUnits, code, adapterID)){
			return;
		}
	}

	pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits);	
}

exports.generatedKeyCallbackForPbAnalytics = generatedKeyCallbackForPbAnalytics;

function pushAdapterParamsInAdunits(adapterID, generatedKey, impressionID, keyConfig, adapterConfig, currentSlot, code, adUnits){
	// in case there are multiple bidders ,we don't generate the config again but utilize the existing mediatype.
	if(util.isOwnProperty(adUnits, code)){
		mediaTypeConfig = adUnits[code].mediaTypes;
	}

	var slotParams = {};
	if(mediaTypeConfig && util.isOwnProperty(mediaTypeConfig,"video") && adapterID != "telaria"){
		slotParams["video"]= mediaTypeConfig.video;
	}
	util.forEachOnObject(keyConfig, function(key, value){
		/* istanbul ignore next */
		slotParams[key] = value;
	});

	if(isPrebidPubMaticAnalyticsEnabled){
		slotParams["kgpv"] = generatedKey;	
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
		adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN],
		adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || null,
		(isPrebidPubMaticAnalyticsEnabled ? refThis.generatedKeyCallbackForPbAnalytics : refThis.generatedKeyCallback),
		// serverSideEabled: do not set default bids as we do not want to throttle them at client-side
		true // !CONFIG.isServerSideAdapter(adapterID)
	);
}

/* start-test-block */
exports.generatePbConf = generatePbConf;
/* end-test-block */

function assignSingleRequestConfigForBidders(prebidConfig){
	util.forEachOnObject(CONSTANTS.SRA_ENABLED_BIDDERS,function(adapterName){
		if(util.isOwnProperty(CONF.adapters, adapterName)){
			prebidConfig[adapterName] = {
				singleRequest : true
			};
		}
	});
}

exports.assignSingleRequestConfigForBidders = assignSingleRequestConfigForBidders;

// todo: unit test case pending
function enablePrebidPubMaticAnalyticIfRequired(){
	if(isPrebidPubMaticAnalyticsEnabled && util.isFunction(window[pbNameSpace].enableAnalytics)){
		window[pbNameSpace].enableAnalytics({
            provider: 'pubmatic',
            options: {
                publisherId: CONFIG.getPublisherId(),
                profileId: CONFIG.getProfileID(),
                profileVersionId: CONFIG.getProfileDisplayVersionID()
            }
        });
	}
}

exports.enablePrebidPubMaticAnalyticIfRequired = enablePrebidPubMaticAnalyticIfRequired;

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

function generateAdUnitsArray(activeSlots, impressionID){
	var adUnits = {};// create ad-units for prebid
	var randomNumberBelow100 = adapterManager.getRandomNumberBelow100();

	CONFIG.forEachAdapter(function(adapterID, adapterConfig){
		// Assumption: all partners are running through PreBid,
		//				if we add any new parent-adapter, then code changes will be required
		/* istanbul ignore else */
		if(adapterID !== refThis.parentAdapterID){

			//serverSideEabled: we do not want to throttle them at client-side
			/* istanbul ignore if */
			if(CONFIG.isServerSideAdapter(adapterID) || adapterManager.throttleAdapter(randomNumberBelow100, adapterID) == false){
				adapterManager.setInitTimeForSlotsForAdapter(activeSlots, adapterID);
				refThis.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
			}else{
				util.log(adapterID+CONSTANTS.MESSAGES.M2);
			}
		}
	});

	// adUnits is object create array from it
	var adUnitsArray = [];
	util.forEachOnObject(adUnits, function(key, adUnit){
		adUnitsArray.push(adUnit);
	});

	return adUnitsArray;
}

exports.generateAdUnitsArray = generateAdUnitsArray;

function assignUserSyncConfig(prebidConfig){
	prebidConfig["userSync"] = {
		enableOverride: true,
		syncsPerBidder: 0,
		iframeEnabled: true,
		pixelEnabled: true,
		enabledBidders: (function(){
			var arr = [];
			CONFIG.forEachAdapter(function(adapterID){
				arr.push(adapterID);
			});
			return arr;
		})(),
		syncDelay: 2000, //todo: default is 3000 write image pixels 5 seconds after the auction
	};
	if(CONFIG.isUserIdModuleEnabled()){
		prebidConfig["userSync"]["userIds"] = util.getUserIdConfiguration();
	}
}

exports.assignUserSyncConfig = assignUserSyncConfig;

function assignGdprConfigIfRequired(prebidConfig){
	if (CONFIG.getGdpr()) {
		prebidConfig["consentManagement"] = {
			cmpApi: CONFIG.getCmpApi(),
			timeout: CONFIG.getGdprTimeout(),
			allowAuctionWithoutConsent: CONFIG.getAwc() // Auction without consent
		};
	}
}

exports.assignGdprConfigIfRequired = assignGdprConfigIfRequired;

function assignCurrencyConfigIfRequired(prebidConfig){
	if(CONFIG.getAdServerCurrency()){
		util.log(CONSTANTS.MESSAGES.M26 + CONFIG.getAdServerCurrency());
		prebidConfig["currency"] = {
			"adServerCurrency": CONFIG.getAdServerCurrency(), 
			"granularityMultiplier": 1, 
		};
	}
}

exports.assignCurrencyConfigIfRequired = assignCurrencyConfigIfRequired;

function bidsBackHandler(bidResponses){
	util.log("In PreBid bidsBackHandler with bidResponses: ");
	util.log(bidResponses);
	setTimeout(window[pbNameSpace].triggerUserSyncs, 10);
	//refThis.handleBidResponses(bidResponses);
	if(isPrebidPubMaticAnalyticsEnabled){
		window[pbNameSpace].setTargetingForGPTAsync(); // todo we do not want this for Custom conroller OR better do it only for GPT controller
	}

	util.forEachOnObject(bidResponses, function(responseID, bidResponse){
		bidManager.setAllPossibleBidsReceived(
			isPrebidPubMaticAnalyticsEnabled ? responseID : refThis.kgpvMap[responseID].divID
		);
	});
}

exports.bidsBackHandler = bidsBackHandler;

function configurePrebidKeysIfRequired(){
	// Todo: Handle send-all bids feature enabled case
	//		we will need to add bidder specific keys
	// todo: refer constants for key names
	if(isPrebidPubMaticAnalyticsEnabled){
		window[pbNameSpace].bidderSettings = {
            'standard': {
            	'suppressEmptyKeys': true, // this boolean flag can be used to avoid sending those empty values to the ad server.

                'adserverTargeting': [
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
                        key: "hb_pb", //hb_pb // we do not want it, so send empty, suppressEmptyKeys feature will prevent it being passed
                        // do not change it in prebid.js project constants file
                        val: function(bidResponse) {
                            // return bidResponse.pbMg;
                            return '';
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
                            return (bidResponse.native ? CONSTANTS.PLATFORM_VALUES.NATIVE : CONSTANTS.PLATFORM_VALUES.DISPLAY);
                        }
                    },
                    {
                        key: 'pwtecp', // our custom
                        val: function(bidResponse) {
                            return bidResponse.cpm;
                        }
                    },
                    {
                        key: 'pwtbst', // our custom
                        val: function(bidResponse) {
                            return 1;
                        }
                    },
                    {
                    	key: 'pwtdid', // custom
                    	val: function(bidResponse){ // todo: do we want to concat dealchannel as well?
                    		return bidResponse.dealId;
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
                    	key: 'pwtm', // custom
                    	val: function(bidResponse){ // todo: value?
                    		return '';
                    	}
                    }
                ]
            }
        };
	}
}

exports.configurePrebidKeysIfRequired = configurePrebidKeysIfRequired;

function fetchBids(activeSlots, impressionID){
	/* istanbul ignore else */
	if(! window[pbNameSpace]){ // todo: move this code to initial state of adhooks
		util.logError("PreBid js is not loaded");
		return;
	}
	
	var adUnitsArray = refThis.generateAdUnitsArray(activeSlots, impressionID);
	/* istanbul ignore else */
	if(adUnitsArray.length > 0 && window[pbNameSpace]){

		try{
			if(util.isFunction(window[pbNameSpace].setConfig) || typeof window[pbNameSpace].setConfig == "function") {// todo: use isFunction
				var prebidConfig = {
					debug: util.isDebugLogEnabled(),
					cache: {
						url: CONSTANTS.CONFIG.CACHE_URL + CONSTANTS.CONFIG.CACHE_PATH
					},
					bidderSequence: "random",
					disableAjaxTimeout: CONFIG.getDisableAjaxTimeout(),
				};
				refThis.assignUserSyncConfig(prebidConfig);
				refThis.assignGdprConfigIfRequired(prebidConfig);
				refThis.assignCurrencyConfigIfRequired(prebidConfig);
				// todo move it to a separate function or along with GDPR
				if (CONFIG.getCCPA()) {
					if(!prebidConfig["consentManagement"]){
						prebidConfig["consentManagement"] = {};
					}
					prebidConfig["consentManagement"]["usp"] = {
						cmpApi: CONFIG.getCCPACmpApi(),
						timeout: CONFIG.getCCPATimeout(),
					};
				}
				// todo move it to a separate function
				if(CONFIG.isSchainEnabled){
					prebidConfig["schain"] = CONFIG.getSchainObject();
				}
				refThis.assignSingleRequestConfigForBidders(prebidConfig);
				// Adding a hook for publishers to modify the Prebid Config we have generated
				util.handleHook(CONSTANTS.HOOKS.PREBID_SET_CONFIG, [ prebidConfig ]);
				// DO NOT PUSH ANY CONFIG AFTER THIS LINE!!
				window[pbNameSpace].setConfig(prebidConfig);
			}

			refThis.enablePrebidPubMaticAnalyticIfRequired();
			refThis.configurePrebidKeysIfRequired();

			// todo: move the typeof check to a function
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
				if( !isPrebidPubMaticAnalyticsEnabled){
					// we do not want this call when we have PrebidAnalytics enabled
					refThis.addOnBidResponseHandler();	
				}				
				window[pbNameSpace].requestBids({
					adUnits: adUnitsArray,
					// Note: Though we are not doing anything in the bidsBackHandler, it is required by PreBid
					bidsBackHandler: function(bidResponses) {
						util.log("In PreBid bidsBackHandler with bidResponses: ");
						util.log(bidResponses);
						setTimeout(window[pbNameSpace].triggerUserSyncs, 10);
						//refThis.handleBidResponses(bidResponses);						
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
					},
					timeout: timeoutForPrebid
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

function getParenteAdapterID() {
	return refThis.parentAdapterID;
}

//REVIEW: should be used only with identity only flow
function setConfig(){
	if(util.isFunction(window[pbNameSpace].setConfig) || typeof window[pbNameSpace].setConfig == "function") {
		var prebidConfig = {
			debug: util.isDebugLogEnabled(),
			userSync: {
				syncDelay: 2000
			}
		};

		if (CONFIG.getGdpr()) {
			prebidConfig["consentManagement"] = {
				cmpApi: CONFIG.getCmpApi(),
				timeout: CONFIG.getGdprTimeout(),
				allowAuctionWithoutConsent: CONFIG.getAwc()
			};
		}

		// Adding a hook for publishers to modify the Prebid Config we have generated
		// util.handleHook(CONSTANTS.HOOKS.PREBID_SET_CONFIG, [ prebidConfig ]);

		if(CONFIG.isUserIdModuleEnabled()){
			prebidConfig["userSync"]["userIds"] = util.getUserIdConfiguration();
		}

		window[pbNameSpace].setConfig(prebidConfig);
		window[pbNameSpace].requestBids([]);
	}
}

exports.setConfig = setConfig;

/* start-test-block */
exports.getParenteAdapterID = getParenteAdapterID;
/* end-test-block */

exports.register = function(){
	return {
		fB: refThis.fetchBids,
		ID: refThis.getParenteAdapterID,
		sC:	refThis.setConfig
	};
};
