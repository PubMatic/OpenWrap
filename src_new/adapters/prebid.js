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

	if(CONFIG.isServerSideAdapter(adapterID)){
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
			slotParams["profId"] = adapterID == "pubmatic2"? adapterConfig["profileId"]: CONFIG.getProfileID();
			/* istanbul ignore else*/
			if(adapterID != "pubmatic2" && window.PWT.udpv){
				slotParams["verId"] = CONFIG.getProfileDisplayVersionID();
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

			//serverSideEabled: we do not want to throttle them at client-side
			/* istanbul ignore if */
			if(CONFIG.isServerSideAdapter(adapterID) || refThis.throttleAdapter(randomNumberBelow100, adapterID) == false){
				util.forEachOnObject(activeSlots, function(j, slot){
					bidManager.setCallInitTime(slot.getDivID(), adapterID);
				});
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

	return adUnitsArray;
}

exports.generateAdUnitsArray = generateAdUnitsArray;

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
