var CONFIG = require('../config.js');
var CONSTANTS = require('../constants.js');
var util = require('../util.js');
var bidManager = require('../bidManager.js');
var adapterManager = require('../adapterManager.js');

var SEND_TARGETING_INFO = true;
var displayHookIsAdded = false;
var disableInitialLoadIsSet = false;
var sendTargetingInfoIsSet = true;
var sraIsSet = false;

//todo: combine these maps
var wrapperTargetingKeys = {}; // key is div id
var slotSizeMapping = {}; // key is div id
var slotsMap = {};			// key is div id, stores the mapping of divID ==> googletag.slot

var GPT_targetingMap = {};

var localGoogletag;
var localPubAdsObj;

function getAdUnitIndex(currentGoogleSlot){
	var index = 0;
	try{
		adUnitIndexString = currentGoogleSlot.getSlotId().getId().split('_');
		index = adUnitIndexString[ adUnitIndex.length - 1 ];
	}catch(ex){}
	return index;
}

function getSizeFromSizeMapping(divID, slotSizeMapping, win){
	/*
		Ref: https://support.google.com/dfp_premium/answer/3423562?hl=en
		The adslot.defineSizeMapping() method will receive an array of mappings in the following form: 
			[ [ [ 1024, 768 ], [ [ 970, 250 ] ] ], [ [ 980, 600 ], [ [ 728, 90 ], [ 640, 480 ] ] ], ...],  
			which should be ordered from highest to lowest priority. 
		The builder syntax is a more readable way of defining the mappings that orders them automatically. 
		However, you have the option of using different priority ordering by bypassing the builder and constructing the array of mappings manually.
	*/

	if(!util.isOwnProperty(slotSizeMapping, divID)){
		return false;
	}

	var sizeMapping = slotSizeMapping[divID];
	var screenWidth = util.getScreenWidth(win);
	var screenHeight = util.getScreenHeight(win);	

	util.log(divID+': responsiveSizeMapping found: screenWidth: '+ screenWidth + ', screenHeight: '+ screenHeight);
	util.log(sizeMapping);

	if(!util.isArray(sizeMapping)){
		return false;
	}

	for(var i=0, l=sizeMapping.length; i < l; i++){
		if(sizeMapping[i].length == 2 && sizeMapping[i][0].length == 2){
			var currentWidth = sizeMapping[i][0][0],
				currentHeight = sizeMapping[i][0][1]
			;

			if(screenWidth >= currentWidth && screenHeight >= currentHeight){
				if(sizeMapping[i][1].length != 0 && !util.isArray(sizeMapping[i][1][0]) ){
					if(sizeMapping[i][1].length == 2 && util.isNumber(sizeMapping[i][1][0]) && util.isNumber(sizeMapping[i][1][1]) ){
						return [sizeMapping[i][1]];	
					}else{
						util.log(divID + ': Unsupported mapping template.');
						util.log(sizeMapping);
					}
				}
				return sizeMapping[i][1];
			}
		}
	}

	return false;
}

function getAdSlotSizesArray(divID, currentGoogleSlot, win){	
	var sizeMapping = getSizeFromSizeMapping(divID, slotSizeMapping, win);

	if(sizeMapping !== false){
		util.log(divID + ': responsiveSizeMapping applied: ');
		util.log(sizeMapping);
		return sizeMapping;
	}

	var adslotSizesArray = [];

	if( util.isFunction(currentGoogleSlot.getSizes)){
		var sizeArray = currentGoogleSlot.getSizes();
		var sizeArrayLength = sizeArray.length;			
		for(var index = 0; index < sizeArrayLength; index++){
			var sizeObj = sizeArray[ index ];
			if(sizeObj.getWidth && sizeObj.getHeight){
				adslotSizesArray.push([sizeObj.getWidth(), sizeObj.getHeight()]);
			}else{
				util.log(divID + ', size object does not have getWidth and getHeight method. Ignoring: ');
				util.log(sizeObj);
			}	
		}
	}
	
	return adslotSizesArray;
}

function storeInSlotsMap (dmSlotName, currentGoogleSlot, isDisplayFlow, win){
	// note: here dmSlotName is actually the DivID
	if( ! util.isOwnProperty(slotsMap, dmSlotName) ){
		slotsMap[dmSlotName] = {};
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID] 						= dmSlotName;
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SLOT_OBJECT] 				= currentGoogleSlot;
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_ID] 					= currentGoogleSlot.getAdUnitPath();
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_INDEX] 				= getAdUnitIndex(currentGoogleSlot);
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SIZES] 						= getAdSlotSizesArray(dmSlotName, currentGoogleSlot, win);
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.STATUS] 						= CONSTANTS.SLOT_STATUS.CREATED;
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DISPLAY_FUNCTION_CALLED] 	= false;
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED] 	= false;
		slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS]					= [];
		//slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.POSITION]					= utilFindPosition(dmSlotName);//todo

		if(SEND_TARGETING_INFO && JSON && typeof JSON.stringify == "function"){
			var targetKeys = currentGoogleSlot.getTargetingKeys();
			var targetKeysLength = targetKeys.length;				
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.KEY_VALUE] = {};
			for(var k=0; k<targetKeysLength; k++ ){
				var targetKey = targetKeys[k];
				slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.KEY_VALUE][targetKey] = currentGoogleSlot.getTargeting( targetKey );
			}
		}

		//todo
		//utilCreateVLogInfoPanel(dmSlotName, slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SIZES]);
	}else{
		if(!isDisplayFlow){
			slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.SIZES] = getAdSlotSizesArray(dmSlotName, currentGoogleSlot, win);
		}
	}
}

function updateSlotsMapFromGoogleSlots(win, googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow){

	var googleSlotsArrayLength,
		currentGoogleSlot,				
		dmSlotName,
		divIdFromDisplayFunction
	;

	googleSlotsArray = win.googletag.pubads().getSlots();
	googleSlotsArrayLength = googleSlotsArray.length;

	for(var i=0; i<googleSlotsArrayLength; i++){
		currentGoogleSlot = googleSlotsArray[ i ];
		dmSlotName = currentGoogleSlot.getSlotId().getDomId();// here divID will be the key
		storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow, win);			
		if( isDisplayFlow && util.isOwnProperty(slotsMap, dmSlotName) ){
			divIdFromDisplayFunction = argumentsFromCallingFunction[0];
			// if display function is called for this slot only
			if( divIdFromDisplayFunction && divIdFromDisplayFunction == slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID] ){					
				// mark that display function for this slot has been called
				slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.DISPLAY_FUNCTION_CALLED] = true;
				slotsMap[dmSlotName][CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS] = argumentsFromCallingFunction;
			}
		}
	}
}

//todo: pass slotsMap in every function that uses it
function getStatusOfSlotForDivId(divID){
	if( util.isOwnProperty(slotsMap, divID) ){
		return slotsMap[divID][CONSTANTS.SLOT_ATTRIBUTES.STATUS];
	}
	return CONSTANTS.SLOT_STATUS.DISPLAYED;
}

function updateStatusAfterRendering(divID, isRefreshCall){
	var settings = {};
	settings[ CONSTANTS.SLOT_ATTRIBUTES.STATUS ] = CONSTANTS.SLOT_STATUS.DISPLAYED;
	settings[CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS] = [];
	settings[ isRefreshCall ? CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED : CONSTANTS.SLOT_ATTRIBUTES.DISPLAY_FUNCTION_CALLED ] = false;		
	setKeyValueOfSlotForDivId(divID, settings);
}

function setKeyValueOfSlotForDivId(divID, keyValueObject){
	var kv;

	if( util.isOwnProperty(slotsMap, divID) ){
		for(kv in keyValueObject){
			if(util.isOwnProperty(keyValueObject, kv)){
				slotsMap[divID][kv] = keyValueObject[kv];
			}
		}
	}
}

function getSlotNamesByStatus(statusObject){
	var key;
	var slots = [];
	for(key in slotsMap){	
		if( util.isOwnProperty(statusObject, slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.STATUS]) ){
			slots.push( key );
		}
	}	
	return slots;
}

function removeDMTargetingFromSlot(key){
	var currenGoogleSlot;
	var targetingKeys;
	var targetingKey;
	var targetingMap;
	var len;
	var i;
		
	if(util.isOwnProperty(slotsMap, key)){
		
		targetingKeys = [];
		targetingMap = {};
		currenGoogleSlot = slotsMap[ key ][CONSTANTS.SLOT_ATTRIBUTES.SLOT_OBJECT];							
		targetingKeys = currenGoogleSlot.getTargetingKeys();			
		len = targetingKeys.length;
		
		// take backup of all targetings, except those set by DM
		for(i = 0; i < len; i++){				
			targetingKey = targetingKeys[ i ];				
			if( ! util.isOwnProperty(wrapperTargetingKeys, targetingKey) ){				
				targetingMap[ targetingKey ] = currenGoogleSlot.getTargeting( targetingKey );					
			}
		}
		
		// now clear all targetings
		currenGoogleSlot.clearTargeting();

		// now set all settings from backup
		for( targetingKey in targetingMap){		
			if( util.isOwnProperty(targetingMap, targetingKey) ){								
				currenGoogleSlot.setTargeting( targetingKey, targetingMap[targetingKey] );						
			}
		}
	}
}

function updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall){
		
	var slotNamesLength = slotNames.length;
	var index;
	var key;		

	if( slotNamesLength > 0 ){
		for(index=0; index < slotNamesLength; index++){
			key = slotNames[ index ];
			slotsMap[ key ][CONSTANTS.SLOT_ATTRIBUTES.STATUS] = CONSTANTS.SLOT_STATUS.PARTNERS_CALLED;
			if( isRefreshCall ){
				removeDMTargetingFromSlot( key );
				slotsMap[ key ][CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED] = true;					
				slotsMap[ key ][CONSTANTS.SLOT_ATTRIBUTES.ARGUMENTS] = argumentsFromCallingFunction;
			}
		}
	}	
}

function arrayOfSelectedSlots(slotNames){		
	var slotNamesLength = slotNames.length;
	var	index;
	var output = [];		

	if( slotNamesLength > 0 ){
		for(index=0; index < slotNamesLength; index++){
			output.push(slotsMap[ slotNames[index] ]);
		}
	}
	
	return output;
}

function findWinningBidAndApplyTargeting(divID){
	var winningBid = bidManager.getBid(divID);
	var googleDefinedSlot = slotsMap[ divID ][CONSTANTS.SLOT_ATTRIBUTES.SLOT_OBJECT];
	var ignoreTheseKeys = {
		'hb_bidder': 1,
		'hb_adid': 1,
		'hb_pb': 1,
		'hb_size': 1
	};


	util.log('DIV: '+divID+' winningBid: ');
	util.log(winningBid);
	
	if(winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM] > 0){
		slotsMap[ divID ][CONSTANTS.SLOT_ATTRIBUTES.STATUS] = CONSTANTS.SLOT_STATUS.TARGETING_ADDED;			
		googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID, winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID]);
		googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS, winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS]);
		googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM, (winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM]).toFixed(CONSTANTS.COMMON.BID_PRECISION));
		winningBid[CONSTANTS.BID_ATTRIBUTES.DEAL][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID] && googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID, winningBid[CONSTANTS.BID_ATTRIBUTES.DEAL][CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID]);
		googleDefinedSlot.setTargeting(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID, winningBid[CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID]);
	}

	// attaching keyValuePairs from adapters
	for(var key in winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS]){
		if(util.isOwnProperty(winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS], key) && !util.isOwnProperty(ignoreTheseKeys, key)){
			googleDefinedSlot.setTargeting(key, winningBid[CONSTANTS.COMMON.KEY_VALUE_PAIRS][key]);
			// adding key in wrapperTargetingKeys as every key added by OpenWrap should be removed before calling refresh on slot
			wrapperTargetingKeys[key] = '';
		}
	}
}

function defineWrapperTargetingKeys(object){
	var output = {};

	for(var key in object){
		if(util.isOwnProperty(object, key)){
			output[ object[key] ] = '';
		}
	}

	return output;
}

function defineWrapperTargetingKey(key){
	wrapperTargetingKeys[key] = '';
}

// Hooks related functions

function addHookOnGooglePubAdsDisableInitialLoad(){
	var original_disableInitialLoad = localPubAdsObj && localPubAdsObj.disableInitialLoad;
	if(util.isFunction(original_disableInitialLoad)){
		localPubAdsObj.disableInitialLoad = function(){
			disableInitialLoadIsSet = true;
			util.log('Disable Initial Load is called');
			return original_disableInitialLoad.apply(this, arguments);
		};
	}
}

function addHookOnGooglePubAdsEnableSingleRequest(){
	var original_enableSingleRequest = localPubAdsObj && localPubAdsObj.enableSingleRequest;
	if(util.isFunction(original_enableSingleRequest)){
		localPubAdsObj.enableSingleRequest = function(){					
			util.log('enableSingleRequest is called');
			var arg = arguments;
			sraIsSet = true;
			addHookOnGoogletagDisplay();
			return original_enableSingleRequest.apply(this, arg);
		};			
	}
}

function addHookOnGooglePubAdsSetTargeting(){
	var original_setTargeting = localPubAdsObj && localPubAdsObj.setTargeting;
	if(util.isFunction(original_setTargeting)){
		localPubAdsObj.setTargeting = function(){
			var arg = arguments,
				key = arg[0] ? arg[0] : null
			;
			addHookOnGoogletagDisplay();			
			if(key != null){				
				if( ! util.isOwnProperty(GPT_targetingMap, key) ){
					GPT_targetingMap[ key ] = [];
				}
				GPT_targetingMap[ key ] = GPT_targetingMap[ key ].concat( arg[1] );
			}
			return original_setTargeting.apply(localPubAdsObj, arg);
		};	
	}	
}

function addHookOnGoogletagDestroySlots(win){
	var original_destroySlots = localGoogletag && localGoogletag.destroySlots;
	if(util.isFunction(original_destroySlots)){
		localGoogletag.destroySlots = function(arrayOfSlots){
			for(var i = 0, l = arrayOfSlots.length; i < l; i++){
				var divID = arrayOfSlots[i].getSlotId().getDomId();
				delete slotsMap[divID];
			}
			original_destroySlots.apply(win.googletag, arguments);
		};
	}
}

// display
function  addHookOnGoogletagDisplay(win){
	if(displayHookIsAdded){
		return;
	}

	var original_display = localGoogletag && localGoogletag.display;
	if(!util.isFunction(original_display)){
		return;
	}

	/*
		there are many types of display methods
			1. googletag.display('div-1');
				this one is only covered
				
			// following approach can be re-written as 1st					
			2. googletag.pubads().display('/1234567/sports', [728, 90], 'div-1');						
				we can not support this as, above methode will generate adslot object internally and then displays, 
				btw it does not supports single reqest approach
				also slot level targeting can not be set on it
				https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_display
									
			3. googletag.pubads().definePassback('/1234567/sports', [468, 60]).display();
				we are not going to support this one as well as third-party partners use this and they wont have setup required to render our bids
	*/
	
	displayHookIsAdded = true;

	util.log('Adding hook on googletag.display');
	
	localGoogletag.display = function(){
	
		util.log('In display function, with arguments: ');
		util.log(arguments);
			
		var arg = arguments,
			oldStatus,
			qualifyingSlotNames,
			qualifyingSlots = []
		;
	
		// If AdVanced GPT mode is enabled, no need to do anything in display function
		if( disableInitialLoadIsSet ){
			util.log('DisableInitialLoad was called, Nothing to do');
			return original_display.apply(this, arg);
			
		}else{
			
			util.log('Generating slotsMap');
			updateSlotsMapFromGoogleSlots( win, win.googletag.pubads().getSlots(), arg, true );
			util.log(slotsMap);

			oldStatus = getStatusOfSlotForDivId( arg[0] );
			switch( oldStatus ){
			
				// display method was called for this slot
				case CONSTANTS.SLOT_STATUS.CREATED:
				// dm flow is already intiated for this slot
				// just intitate the CONFIG.getTimeout() now
				case CONSTANTS.SLOT_STATUS.PARTNERS_CALLED:
					setTimeout(function(){

						util.log('PostTimeout.. back in display function');

						//todo: move this function out of here
						var tempFunc = function(key){
							if( util.isOwnProperty(slotsMap, key) 
								&& slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.STATUS] != CONSTANTS.SLOT_STATUS.DISPLAYED 
								&& slotsMap[key][CONSTANTS.SLOT_ATTRIBUTES.STATUS] != CONSTANTS.SLOT_STATUS.TARGETING_ADDED){

								findWinningBidAndApplyTargeting(key);									
							}	
						};

						for(var key in slotsMap){
							tempFunc(key);								
						}
						
						var status = getStatusOfSlotForDivId( arg[0] );
						// check status of the slot, if not displayed/
						if(status != CONSTANTS.SLOT_STATUS.DISPLAYED){
																
							util.log('calling original display function after CONFIG.getTimeout() with arguments, ');
							util.log(arg);
							updateStatusAfterRendering(arg[0], false);
							original_display.apply(win.googletag, arg);
						}else{
							util.log('AdSlot already rendered');
						}
							
					}, CONFIG.getTimeout());
					break;

				// call the original function now
				case CONSTANTS.SLOT_STATUS.TARGETING_ADDED:
					util.log('As DM processing is already done, Calling original display function with arguments');
					util.log(arg);						
					updateStatusAfterRendering(arg[0], false);
					original_display.apply(win.googletag, arg);
					break;
				
				case CONSTANTS.SLOT_STATUS.DISPLAYED:
					updateStatusAfterRendering(arg[0], false);
					original_display.apply(win.googletag, arg);					
					break;
			}
			
			qualifyingSlotNames = getSlotNamesByStatus({0:''});
			if(qualifyingSlotNames.length > 0){
				updateStatusOfQualifyingSlotsBeforeCallingAdapters(qualifyingSlotNames, arg, false);
				qualifyingSlots = arrayOfSelectedSlots(qualifyingSlotNames);
				adapterManager.callAdapters(qualifyingSlots);
			}				

			setTimeout(function(){
				//utilRealignVLogInfoPanel(arg[0]);
				bidManager.executeAnalyticsPixel();
			},2000+CONFIG.getTimeout());				
		}						
	};
}

// refresh
function addHookOnGooglePubAdsRefresh(win){
	/*
		there are many ways of calling refresh
			1. googletag.pubads().refresh([slot1]);
			2. googletag.pubads().refresh([slot1, slot2]);
			3. googletag.pubads().refresh();					
			4. googletag.pubads().refresh(null, {changeCorrelator: false});		
	*/
	var original_refresh = localPubAdsObj && localPubAdsObj.refresh;
	if(util.isFunction(original_refresh)){
	
		localPubAdsObj.refresh = function(){
		
			var arg = arguments,
				slotsToConsider = win.googletag.pubads().getSlots(),
				slotsToConsiderLength,
				qualifyingSlotNames = [],
				qualifyingSlots,
				index
			;
			
			util.log('In Refresh function');

			updateSlotsMapFromGoogleSlots(win, slotsToConsider, arg, false);
			
			if( arg.length != 0){								
				// handeling case googletag.pubads().refresh(null, {changeCorrelator: false});
				slotsToConsider = arg[0] == null ? win.googletag.pubads().getSlots() : arg[0];
			}
					
			slotsToConsiderLength = slotsToConsider.length;				
			for(index = 0; index < slotsToConsiderLength; index++){
				qualifyingSlotNames = qualifyingSlotNames.concat( slotsToConsider[ index ].getSlotId().getDomId() );
			}

			if(qualifyingSlotNames.length > 0){
				updateStatusOfQualifyingSlotsBeforeCallingAdapters(qualifyingSlotNames, arg, true);
				qualifyingSlots = arrayOfSelectedSlots(qualifyingSlotNames);
				adapterManager.callAdapters(qualifyingSlots);
			}
			
			util.log('Intiating Call to original refresh function with CONFIG.getTimeout(): ' + CONFIG.getTimeout()+' ms');
			setTimeout(function(){
				
				util.log('Executing post CONFIG.getTimeout() events, arguments: ');
				util.log(arg);
				
				var index,	
					dmSlot,
					divID,
					yesCallRefreshFunction = false,
					qualifyingSlotNamesLength
				;

				qualifyingSlotNamesLength = qualifyingSlotNames.length;					
				for(index=0; index<qualifyingSlotNamesLength; index++){						
					
					dmSlot = qualifyingSlotNames[ index ];
					divID = slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID];

					if( util.isOwnProperty(slotsMap, dmSlot) 
						&& slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.REFRESH_FUNCTION_CALLED] == true 
						&& slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.STATUS] != CONSTANTS.SLOT_STATUS.DISPLAYED ){
					
						findWinningBidAndApplyTargeting(divID);
						updateStatusAfterRendering(divID, true);
						yesCallRefreshFunction = true;
					}
				}

				setTimeout(function(){
					for(index=0; index<qualifyingSlotNamesLength; index++){
						var dmSlot = qualifyingSlotNames[ index ];
						//utilCreateVLogInfoPanel(slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID], slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.SIZES]);						
						//utilRealignVLogInfoPanel(slotsMap[dmSlot][CONSTANTS.SLOT_ATTRIBUTES.DIV_ID]);	
					}						
				}, 2000+CONFIG.getTimeout());

				bidManager.executeAnalyticsPixel();
				
				if(yesCallRefreshFunction){						
					util.log('Calling original refresh function from CONFIG.getTimeout()');
					original_refresh.apply(win.googletag.pubads(), arg );						
				}else{
					util.log('AdSlot already rendered');
				}
					
			}, CONFIG.getTimeout());
		};
	}
}

// slot.defineSizeMapping
function addHookOnSlotDefineSizeMapping(){
	var s1 = localGoogletag.defineSlot('/Harshad', [[728, 90]], 'Harshad-02051986');
	if(s1 && s1.__proto__ && s1.__proto__.defineSizeMapping){
		var originalDefineSizeMapping = s1.__proto__.defineSizeMapping;
		if(util.isFunction(originalDefineSizeMapping)){
			s1.__proto__.defineSizeMapping = function(){
				slotSizeMapping[ this.getSlotId().getDomId() ] = arguments[0];
				return originalDefineSizeMapping.apply(this, arguments);
			};
		}
	}
	localGoogletag.destroySlots([s1]);
}

function addHooks(win){

	localGoogletag = win.googletag;
	localPubAdsObj = localGoogletag.pubads();

	addHookOnSlotDefineSizeMapping();
	addHookOnGooglePubAdsDisableInitialLoad();
	addHookOnGooglePubAdsEnableSingleRequest();		
	addHookOnGoogletagDisplay(win);
	addHookOnGooglePubAdsRefresh(win);
	//	setTargeting is implemented by
	//		googletag.pubads().setTargeting(key, value);
	//			we are only intresetd in this one
	//		googletag.PassbackSlot.setTargeting(key, value);
	//			we do not care about it
	//		slot.setTargeting(key, value);
	//			we do not care, as it has a get method
	addHookOnGooglePubAdsSetTargeting();
	addHookOnGoogletagDestroySlots(win);
}

function defineGPTVariables(win){
	// define the command array if not already defined
	win.googletag = win.googletag || {};
	win.googletag.cmd = win.googletag.cmd || [];
}

exports.init = function(win){
	wrapperTargetingKeys = defineWrapperTargetingKeys(CONSTANTS.WRAPPER_TARGETING_KEYS);
	defineGPTVariables(win);
	adapterManager.registerAdapters();

	if(util.isUndefined(win.google_onload_fired) && win.googletag.cmd.unshift){
		util.log('Succeeded to load before GPT');
		win.googletag.cmd.unshift( function(){ 
			util.log('OpenWrap initialization started');
			addHooks(win);
			util.log('OpenWrap initialization completed');
		} );
	}else{
		util.log('Failed to load before GPT');
	}
	
	if(util.isFunction(win.PWT.jsLoaded)){
		win.PWT.jsLoaded();
	}
};

// todo: export all functions in test scenario for unit testing
// todo: create a slot class