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
	if(bid.native){
		theBid.setNative(bid.native);
	}
	if(rxPattern){
		theBid.setRegexPattern(rxPattern);
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
	if(responseIdArray &&  (responseIdArray.length == 2 || ((responseIdArray.length == 3) && (sizeIndex = 2) && (isRegex=true)))){
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
		if(CONFIG.isSingleImpressionSettingEnabled()){
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
			if(!CONFIG.isSingleImpressionSettingEnabled()){
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
	
	if(!CONFIG.isSingleImpressionSettingEnabled()){
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
		adUnits[code] = {
			code: code,
			mediaTypes: util.getMediaTypeObject(CONFIG.getNativeConfiguration(), sizes, currentSlot),
			sizes: sizes,
			bids: [],
			divID : divID
		};
	}else if(CONFIG.isSingleImpressionSettingEnabled()){
		if(isAdUnitsCodeContainBidder(adUnits, code, adapterID)){
			return;
		}
	}

	var slotParams = {};
	util.forEachOnObject(keyConfig, function(key, value){
		/* istanbul ignore next */
		slotParams[key] = value;
	});

	//processing for each partner
	switch(adapterID){

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
		slotParams["profId"] = adapterID == "pubmatic2"? adapterConfig["profileId"]: CONFIG.getProfileID();
			/* istanbul ignore else*/
		if(adapterID != "pubmatic2" && window.PWT.udpv){
				slotParams["verId"] = CONFIG.getProfileDisplayVersionID();
			}
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
				adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
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
				adUnits[ code ].bids.push({	bidder: adapterID, params: slotParams });
			});
			break;
	case "ix":
		case "indexExchange":
		/** Added case ix cause indexExchange bidder has changed its bidder code in server side 
		 * this will have impact in codegen to change its adapter code from indexexchange to ix 
		 * so added a case for the same.
		*/
		
			util.forEachOnArray(sizes, function(index, size) {
				var slotParams = {};

				if (keyConfig["siteID"]) {
					slotParams["siteId"] = keyConfig["siteID"];
				}
				slotParams["size"] = size;
				adUnits [code].bids.push({bidder: adapterID, params: slotParams});
			});
			break;

		default:
			adUnits[code].bids.push({ bidder: adapterID, params: slotParams });
			break;
	}
}

/* start-test-block */
exports.generatedKeyCallback = generatedKeyCallback;
/* end-test-block */


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
		refThis.generatedKeyCallback,
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

function fetchBids(activeSlots, impressionID){

	//window.pwtCreatePrebidNamespace(pbNameSpace);

	/* istanbul ignore else */
	if(! window[pbNameSpace]){ // todo: move this code to initial state of adhooks
		util.logError("PreBid js is not loaded");
		return;
	}


	if(util.isFunction(window[pbNameSpace].onEvent)){
		if(!onEventAdded){
			window[pbNameSpace].onEvent('bidResponse', refThis.pbBidStreamHandler);
			onEventAdded = true;
		}		
	} else {
		util.logWarning("PreBid js onEvent method is not available");
		return;
	}

	window[pbNameSpace].logging = util.isDebugLogEnabled();

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
	for(var code in adUnits){
		/* istanbul ignore else */
		if(util.isOwnProperty(adUnits, code)){
			adUnitsArray.push(adUnits[code]);
		}
	}

	/* istanbul ignore else */
	if(adUnitsArray.length > 0 && window[pbNameSpace]){

		try{
			/* istanbul ignore else */
			//if(util.isFunction(window[pbNameSpace].setBidderSequence)){
			//	window[pbNameSpace].setBidderSequence("random");
			//}

			if(util.isFunction(window[pbNameSpace].setConfig) || typeof window[pbNameSpace].setConfig == "function") {
				var prebidConfig = {
					debug: util.isDebugLogEnabled(),
					bidderSequence: "random",
					userSync: {
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
					},
					disableAjaxTimeout: CONFIG.getDisableAjaxTimeout(),
				};

				if (CONFIG.getGdpr()) {
					prebidConfig["consentManagement"] = {
						cmpApi: CONFIG.getCmpApi(),
						timeout: CONFIG.getGdprTimeout(),
						allowAuctionWithoutConsent: CONFIG.getAwc()
					};
				}
				//remove true and implement getCurrency() in config
				// CONFIG.getCurrency()
				if(CONFIG.getAdServerCurrency()){
					// get AdServer currency from Config
					// Log in console 
					util.log(CONSTANTS.MESSAGES.M26 + CONFIG.getAdServerCurrency());
					prebidConfig["currency"] = {
						"adServerCurrency": CONFIG.getAdServerCurrency(), 
						"granularityMultiplier": 1, 
					};

				}
				refThis.assignSingleRequestConfigForBidders(prebidConfig);
				// Adding a hook for publishers to modify the Prebid Config we have generated
				util.handleHook(CONSTANTS.HOOKS.PREBID_SET_CONFIG, [ prebidConfig ]);

				if(CONFIG.isUserIdModuleEnabled()){
					prebidConfig["userSync"]["userIds"] = util.getUserIdConfiguration();
				}

				window[pbNameSpace].setConfig(prebidConfig);
			}

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
				
				window[pbNameSpace].requestBids({
					adUnits: adUnitsArray,
					// Note: Though we are not doing anything in the bidsBackHandler, it is required by PreBid
					bidsBackHandler: function(bidResponses) {
						util.log("In PreBid bidsBackHandler with bidResponses: ");
						util.log(bidResponses);
						setTimeout(window[pbNameSpace].triggerUserSyncs, 10);
						//refThis.handleBidResponses(bidResponses);
						util.forEachOnObject(bidResponses, function(responseID, bidResponse){
							bidManager.setAllPossibleBidsReceived(refThis.kgpvMap[responseID].divID);
						});
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
