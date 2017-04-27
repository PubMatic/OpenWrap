var displayHookAdded = false,

	configObject = {},

	SEND_TARGETING_INFO	= true,	

	isDisableInitialLoadSet = false,
	
	// Different status codes
	status_slotCreated					= 0, // slot is just created
	status_DM_Display_CallMade			= 1, // DM call is made for the slot
	status_DM_Display_TargetingsAdded	= 2, // DM call has completed and targeting is applied
	status_DM_Display_Displayed			= 3, // this simply means that creative is rendered by GPT
	
	// keys used in pmSlots map object will be stored in variable to avoid strings repeating in code
	pmSlots_key_adSlot					= 'adSlot',
	pmSlots_key_adSlotSizes				= 'adSlotSizes',
	pmSlots_key_adUnitID				= 'adUnitID',
	pmSlots_key_adUnitIndex				= 'adUnitIndex',
	pmSlots_key_divId					= 'divID',
	pmSlots_key_status					= 'status',
	pmSlots_key_isDisplayFunctionCalled	= 'isDisplayFunctionCalled',
	pmSlots_key_isRefreshFunctionCalled	= 'isRefreshFunctionCalled',
	pmSlots_key_arguments				= 'arguments',
	
	// localising original GPT variables / functions
	localGoogletag,
	localPubAdsObj,
	original_display,
	original_refresh,
	original_disableInitialLoad,
	original_setTargeting,
	original_enableSingleRequest,
	original_destroySlots,

	isSRA = false,

	slotsMap = {},			// stores the mapping of divID ==> googletag.slot
	GPT_targetingMap = {},	// stores the targetings applied using, googletag.pubads().setTargeting('article-id','65207');

	DM_targetingKeys = {},	// stores all targeting keys that DM has added, 'key': ''

	slotSizeMapping = {},

	getAdUnitIndex = function(currentGoogleSlot){
		var adUnitIndex = 0;
		try{
			adUnitIndex = currentGoogleSlot.getSlotId().getId().split('_');
			adUnitIndex = adUnitIndex[ adUnitIndex.length - 1 ];
		}catch(ex){}
		return adUnitIndex;
	},

	getSizeFromSizeMapping = function(divID){
		/*
			Ref: https://support.google.com/dfp_premium/answer/3423562?hl=en
			The adslot.defineSizeMapping() method will receive an array of mappings in the following form: 
				[ [ [ 1024, 768 ], [ [ 970, 250 ] ] ], [ [ 980, 600 ], [ [ 728, 90 ], [ 640, 480 ] ] ], ...],  
				which should be ordered from highest to lowest priority. 
			The builder syntax is a more readable way of defining the mappings that orders them automatically. 
			However, you have the option of using different priority ordering by bypassing the builder and constructing the array of mappings manually.
		*/

		var sizeMapping,
			screenWidth = -1,
			screenHeight = -1
		;
		
		try{
			//screenWidth = window.document.body.scrollWidth;
			//screenHeight = window.document.body.scrollHeight;
			win.innerHeight ? (screenWidth = win.innerWidth, screenHeight = win.innerHeight) : win.document.documentElement && win.document.documentElement.clientHeight ? (screenWidth = win.document.documentElement.clientWidth, screenHeight = win.document.documentElement.clientHeight) : win.document.body && (screenWidth = win.document.body.clientWidth, screenHeight = win.document.body.clientHeight);
		}catch(e){}

		if(!utilHasOwnProperty(slotSizeMapping, divID)){
			return false;
		}

		sizeMapping = slotSizeMapping[divID];
		utilLog(divID+': responsiveSizeMapping found: screenWidth: '+ screenWidth + ', screenHeight: '+ screenHeight);
		utilLog(sizeMapping);

		if(!utilIsArray(sizeMapping)){
			return false;
		}

		for(var i=0, l=sizeMapping.length; i < l; i++){
			if(sizeMapping[i].length == 2 && sizeMapping[i][0].length == 2){
				var currentWidth = sizeMapping[i][0][0],
					currentHeight = sizeMapping[i][0][1]
				;

				if(screenWidth >= currentWidth && screenHeight >= currentHeight){
					if(sizeMapping[i][1].length != 0 && !utilIsArray(sizeMapping[i][1][0]) ){
						if(sizeMapping[i][1].length == 2 && utilIsNumber(sizeMapping[i][1][0]) && utilIsNumber(sizeMapping[i][1][1]) ){
							return [sizeMapping[i][1]];	
						}else{
							utilLog(divID + ': Unsupported mapping template.');
							utilLog(sizeMapping)
						}						
					}
					return sizeMapping[i][1];
				}
			}
		}

		return false;
	},
	
	getAdSlotSizesArray = function(divID, currentGoogleSlot){
		var sizeArray,
			sizeArrayLength,
			index,
			sizeObj,
			adslotSizesArray = [],
			sizeMapping = getSizeFromSizeMapping(divID)
		;

		if(sizeMapping !== false){
			utilLog(divID + ': responsiveSizeMapping applied: ');
			utilLog(sizeMapping);
			return sizeMapping;
		}

		if( utilIsFn(currentGoogleSlot.getSizes)){
			sizeArray = currentGoogleSlot.getSizes();					
			sizeArrayLength = sizeArray.length;			
			for(index = 0; index < sizeArrayLength; index++){
				sizeObj = sizeArray[ index ];
				if(sizeObj.getWidth && sizeObj.getHeight){
					adslotSizesArray.push([sizeObj.getWidth(), sizeObj.getHeight()]);
				}else{
					utilLog(divID + ', size object does not have getWidth and getHeight method. Ignoring: ');
					utilLog(sizeObj);
				}
			}
		}
		
		return adslotSizesArray;
	},
	
	storeInSlotsMap = function(dmSlotName, currentGoogleSlot, isDisplayFlow){
		// note: here dmSlotName is actually the DivID
		//todo: also pass targeting info, common + slotLevel
		if( ! utilHasOwnProperty(slotsMap, dmSlotName) ){
			slotsMap[dmSlotName] = {};
			slotsMap[dmSlotName][pmSlots_key_divId] 					= dmSlotName;
			slotsMap[dmSlotName][pmSlots_key_adSlot] 					= currentGoogleSlot;
			slotsMap[dmSlotName][pmSlots_key_adUnitID] 					= currentGoogleSlot.getAdUnitPath();
			slotsMap[dmSlotName][pmSlots_key_adUnitIndex] 				= getAdUnitIndex(currentGoogleSlot);
			slotsMap[dmSlotName][pmSlots_key_adSlotSizes] 				= getAdSlotSizesArray(dmSlotName, currentGoogleSlot);
			slotsMap[dmSlotName][pmSlots_key_status] 					= status_slotCreated;
			slotsMap[dmSlotName][pmSlots_key_isDisplayFunctionCalled] 	= false;
			slotsMap[dmSlotName][pmSlots_key_isRefreshFunctionCalled] 	= false;
			slotsMap[dmSlotName][pmSlots_key_arguments]					= [];
			slotsMap[dmSlotName]['position']							= utilFindPosition(dmSlotName);

			if(SEND_TARGETING_INFO && JSON && typeof JSON.stringify == "function"){
				var targetKeys = currentGoogleSlot.getTargetingKeys();
				var targetKeysLength = targetKeys.length;				
				slotsMap[dmSlotName][constCommonSlotKeyValue] = {};
				for(var k=0; k<targetKeysLength; k++ ){
					var targetKey = targetKeys[k];
					slotsMap[dmSlotName][constCommonSlotKeyValue][targetKey] = currentGoogleSlot.getTargeting( targetKey );
				}
			}

			utilCreateVLogInfoPanel(dmSlotName, slotsMap[dmSlotName][pmSlots_key_adSlotSizes]);
		}else{
			if(!isDisplayFlow){
				slotsMap[dmSlotName][pmSlots_key_adSlotSizes] = getAdSlotSizesArray(dmSlotName, currentGoogleSlot);
			}
		}
	},
	
	updateSlotsMapFromGoogleSlots	= function( argumentsFromCallingFunction, isDisplayFlow ){

		var googleSlotsArray	= [],
			googleSlotsArrayLength,

			currentGoogleSlot,		
			
			dmSlotName,
			
			i,
			
			divIdFromDisplayFunction
		;

		if(win.googletag && utilIsFn(win.googletag.pubads)){

			googleSlotsArray = win.googletag.pubads().getSlots();
			googleSlotsArrayLength = googleSlotsArray.length;				

			for(i=0; i<googleSlotsArrayLength; i++){
			
				currentGoogleSlot = googleSlotsArray[ i ];				
				dmSlotName = currentGoogleSlot.getSlotId().getDomId();// here divID will be the key

				storeInSlotsMap(dmSlotName, currentGoogleSlot, isDisplayFlow);
				
				if( isDisplayFlow && utilHasOwnProperty(slotsMap, dmSlotName) ){				
					divIdFromDisplayFunction = argumentsFromCallingFunction[0];
					// if display function is called for this slot only
					if( divIdFromDisplayFunction && divIdFromDisplayFunction == slotsMap[dmSlotName][pmSlots_key_divId] ){					
						// mark that display function for this slot has been called
						slotsMap[dmSlotName][pmSlots_key_isDisplayFunctionCalled] = true;
						slotsMap[dmSlotName][pmSlots_key_arguments] = argumentsFromCallingFunction;
					}							
				}								
			}
		}
	},
	
	getStatusOfSlotForDivId = function(divID){
		var output = status_DM_Display_Displayed
		;
	
		if( utilHasOwnProperty(slotsMap, divID) ){
			output = slotsMap[divID][pmSlots_key_status];
		}
		
		return output;
	},
	
	updateStatusAfterRendering = function(divID, isRefreshCall){
		var settings = {};
		settings[ pmSlots_key_status ] = status_DM_Display_Displayed;		
		settings[pmSlots_key_arguments] = [];		
		settings[ isRefreshCall ? pmSlots_key_isRefreshFunctionCalled : pmSlots_key_isDisplayFunctionCalled ] = false;		
		setKeyValueOfSlotForDivId(divID, settings);
	},
	
	setKeyValueOfSlotForDivId = function(divID, keyValueObject){
		var kv
		;

		if( utilHasOwnProperty(slotsMap, divID) ){
			for(kv in keyValueObject){
				if(utilHasOwnProperty(keyValueObject, kv)){
					slotsMap[divID][kv] = keyValueObject[kv];
				}	
			}
		}	
	},
	
	getSlotNamesByStatus = function(statusObject){
		var key,
			slots = []
		;
	
		for( key in slotsMap){
		
			if( utilHasOwnProperty(statusObject, slotsMap[key][pmSlots_key_status]) ){
				slots.push( key );
			}
		}
		
		return slots;	
	},

	removeDMTargetingFromSlot = function(key){
		var currenGoogleSlot,
			targetingKeys,
			targetingKey,
			targetingMap,
			len,
			i
			;			
			
		if( key in slotsMap){		
			targetingKeys = [];
			targetingMap = {};		
			currenGoogleSlot = slotsMap[ key ][pmSlots_key_adSlot];							
			targetingKeys = currenGoogleSlot.getTargetingKeys();			
			len = targetingKeys.length;
			
			// take backup of all targetings, except those set by DM
			for(i = 0; i < len; i++){				
				targetingKey = targetingKeys[ i ];				
				if( ! utilHasOwnProperty(DM_targetingKeys, targetingKey) ){				
					targetingMap[ targetingKey ] = currenGoogleSlot.getTargeting( targetingKey );					
				}
			}
			
			// now clear all targetings
			currenGoogleSlot.clearTargeting();
			
			// now set all settings from backup
			for( targetingKey in targetingMap){
			
				if( utilHasOwnProperty(targetingMap, targetingKey) ){					
				
					currenGoogleSlot.setTargeting( targetingKey, targetingMap[targetingKey] );						
				}
			}
		}			
	},
	
	updateStatusOfQualifyingSlotsBeforeCallingAdapters = function(slotNames, argumentsFromCallingFunction, isRefreshCall){
		
		var slotNamesLength = slotNames.length,
			index,
			key
		;		
	
		if( slotNamesLength > 0 ){

			for(index=0; index < slotNamesLength; index++){

				key = slotNames[ index ];
				slotsMap[ key ][pmSlots_key_status] = status_DM_Display_CallMade;								
				
				if( isRefreshCall ){
					removeDMTargetingFromSlot( key );
					slotsMap[ key ][pmSlots_key_isRefreshFunctionCalled] = true;					
					slotsMap[ key ][pmSlots_key_arguments] = argumentsFromCallingFunction;
				}
			}
		}	
	},	
	
	arrayOfSelectedSlots = function(slotNames){		
		var slotNamesLength = slotNames.length,
			index,
			output = []
		;		
	
		if( slotNamesLength > 0 ){
			for(index=0; index < slotNamesLength; index++){
				output.push(slotsMap[ slotNames[index] ]);
			}
		}
		
		return output;
	},

	findWinningBidAndApplyTargeting = function(divID){
		var winningBid = bidManagerGetBid(divID);
		var googleDefinedSlot = slotsMap[ divID ][pmSlots_key_adSlot];

		utilLog('DIV: '+divID+' winningBid: ');
		utilLog(winningBid);
		
		if(winningBid[constTargetingEcpm] > 0){
			slotsMap[ divID ][pmSlots_key_status] = status_DM_Display_TargetingsAdded;			
			googleDefinedSlot.setTargeting(constTargetingBidID, winningBid[constTargetingBidID]);
			googleDefinedSlot.setTargeting(constTargetingBidStatus, winningBid[constTargetingBidStatus]);
			googleDefinedSlot.setTargeting(constTargetingEcpm, (winningBid[constTargetingEcpm]).toFixed(bidPrecision));
			winningBid[constTargetingDeal][constDealID] && googleDefinedSlot.setTargeting(constTargetingDealID, winningBid[constTargetingDeal][constDealID]);
			googleDefinedSlot.setTargeting(constTargetingAdapterID, winningBid[constTargetingAdapterID]);
			googleDefinedSlot.setTargeting(constTargetingPubID, bidManagerGetPublisherID());
			googleDefinedSlot.setTargeting(constTargetingProfileID, bidManagerGetProfileID());
			googleDefinedSlot.setTargeting(constTargetingProfileVersionID, bidManagerGetProfileDisplayVersionID());
		}

		// attaching keyValuePairs from adapters
		for(var key in winningBid[constTargetingKvp]){
			if(utilHasOwnProperty(winningBid[constTargetingKvp], key)){
				googleDefinedSlot.setTargeting(key, winningBid[constTargetingKvp][key]);
				// adding key in DM_targetingKeys as every key added by OpenWrap should be removed before calling refresh on slot
				DM_targetingKeys[key] = '';
			}
		}
	},
	
	addHookOnGoogletagDisplay = function (){

		if(displayHookAdded){
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
		
		displayHookAdded = true;

		utilLog('Adding hook on googletag.display');
		
		localGoogletag.display = function(){
		
			utilLog('In display function, with arguments: ');
			utilLog(arguments);
		
			var arg = arguments,
				oldStatus,
				qualifyingSlotNames,
				qualifyingSlots = []
			;
		
			// If AdVanced GPT mode is enabled, no need to do anything in display function
			if( isDisableInitialLoadSet ){
				utilLog('DisableInitialLoad was called, Nothing to do');
				return original_display.apply(this, arg);
				
			}else{
				
				utilLog('Generating slotsMap');
				updateSlotsMapFromGoogleSlots( arg, true );
				utilLog(slotsMap);

				oldStatus = getStatusOfSlotForDivId( arg[0] );
				switch( oldStatus ){
				
					// display method was called for this slot
					case status_slotCreated:
					// dm flow is already intiated for this slot
					// just intitate the timeout now
					case status_DM_Display_CallMade:
						setTimeout(function(){

							utilLog('PostTimeout.. back in display function');

							var tempFunc = function(key){
								if( utilHasOwnProperty(slotsMap, key) 
									&& slotsMap[key][pmSlots_key_status] != status_DM_Display_Displayed 
									&& slotsMap[key][pmSlots_key_status] != status_DM_Display_TargetingsAdded){

									findWinningBidAndApplyTargeting(key);									
								}	
							};

							for(var key in slotsMap){
								tempFunc(key);								
							}
							
							var status = getStatusOfSlotForDivId( arg[0] );
							// check status of the slot, if not displayed/
							if(status != status_DM_Display_Displayed){
																	
								utilLog('calling original display function after timeout with arguments, ');
								utilLog(arg);
								updateStatusAfterRendering(arg[0], false);
								original_display.apply(win.googletag, arg);
							}else{
								utilLog('AdSlot already rendered');
							}

							bidManagerExecuteAnalyticsPixel();
								
						}, TIMEOUT);
						break;

					// call the original function now	
					case status_DM_Display_TargetingsAdded:
						utilLog('As DM processing is already done, Calling original display function with arguments');
						utilLog(arg);						
						updateStatusAfterRendering(arg[0], false);
						original_display.apply(win.googletag, arg);
						break;
					
					case status_DM_Display_Displayed:
						updateStatusAfterRendering(arg[0], false);
						original_display.apply(win.googletag, arg);					
						break;
				}
				
				qualifyingSlotNames = getSlotNamesByStatus({0:''});
				if(qualifyingSlotNames.length > 0){
					updateStatusOfQualifyingSlotsBeforeCallingAdapters(qualifyingSlotNames, arg, false);
					qualifyingSlots = arrayOfSelectedSlots(qualifyingSlotNames);
					adapterManagerCallAdapters(configObject, qualifyingSlots);
				}				

				setTimeout(function(){
					utilRealignVLogInfoPanel(arg[0]);
				},2000+TIMEOUT);
			}					
		};					
	},

	addHookOnGooglePubAdsDisableInitialLoad = function(){
		if( original_disableInitialLoad = (localPubAdsObj && localPubAdsObj.disableInitialLoad) ){	
			localPubAdsObj.disableInitialLoad = function(){
				isDisableInitialLoadSet = true;
				utilLog('Disable Initial Load is called');
				var arg = arguments;
				return original_disableInitialLoad.apply(this, arg);
			};			
		}
	},

	addHookOnGooglePubAdsEnableSingleRequest = function(){
		if( original_enableSingleRequest = (localPubAdsObj && localPubAdsObj.enableSingleRequest) ){		
			localPubAdsObj.enableSingleRequest = function(){					
				utilLog('enableSingleRequest is called');
				var arg = arguments;
				isSRA = true;
				addHookOnGoogletagDisplay();
				return original_enableSingleRequest.apply(this, arg);
			};			
		}
	},

	addHookOnGooglePubAdsSetTargeting = function(){
		if( original_setTargeting = (localPubAdsObj && localPubAdsObj.setTargeting) ){
		
			localPubAdsObj.setTargeting = function(){
				var arg = arguments,
					key = arg[0] ? arg[0] : null
				;
				addHookOnGoogletagDisplay();
				
				if(key != null){
					
					if( ! utilHasOwnProperty(GPT_targetingMap, key) ){
						GPT_targetingMap[ key ] = [];
					}
					
					GPT_targetingMap[ key ] = GPT_targetingMap[ key ].concat( arg[1] );
				}
				return original_setTargeting.apply(localPubAdsObj, arg);
			};	
		}	
	},

	addHookOnGoogletagDestroySlots = function(){
		localGoogletag.destroySlots = function(arrayOfSlots){
			for(var i = 0, l = arrayOfSlots.length; i < l; i++){
				var divID = arrayOfSlots[i].getSlotId().getDomId();
				delete slotsMap[divID];
			}
			original_destroySlots.apply(win.googletag, arguments);
		};
	},

	addHookOnGooglePubAdsRefresh = function(){
		/*
			there are many ways of calling refresh
				1. googletag.pubads().refresh([slot1]);
				2. googletag.pubads().refresh([slot1, slot2]);
				3. googletag.pubads().refresh();					
				4. googletag.pubads().refresh(null, {changeCorrelator: false});		
		*/		
		if( original_refresh = (localPubAdsObj && localPubAdsObj.refresh) ){
		
			localPubAdsObj.refresh = function(){
			
				var arg = arguments,
					slotsToConsider = [],
					slotsToConsiderLength,
					qualifyingSlotNames = [],
					qualifyingSlots,
					index
				;
				
				utilLog('In Refresh function');

				updateSlotsMapFromGoogleSlots(arg, false);
				
				if( arg.length == 0){
					slotsToConsider = win.googletag.pubads().getSlots();
				}else{				
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
					adapterManagerCallAdapters(configObject, qualifyingSlots);
				}
				
				utilLog('Intiating Call to original refresh function with timeout: ' + TIMEOUT+' ms');
				setTimeout(function(){
					
					utilLog('Executing post timeout events, arguments: ');
					utilLog(arg);
					
					var index,	
						dmSlot,
						divID,
						yesCallRefreshFunction = false,
						qualifyingSlotNamesLength
					;

					qualifyingSlotNamesLength = qualifyingSlotNames.length;					
					for(index=0; index<qualifyingSlotNamesLength; index++){						
						
						dmSlot = qualifyingSlotNames[ index ];
						divID = slotsMap[dmSlot][pmSlots_key_divId];

						if( utilHasOwnProperty(slotsMap, dmSlot) 
							&& slotsMap[dmSlot][pmSlots_key_isRefreshFunctionCalled] == true 
							&& slotsMap[dmSlot][pmSlots_key_status] != status_DM_Display_Displayed ){
						
							findWinningBidAndApplyTargeting(divID);
							updateStatusAfterRendering(divID, true);
							yesCallRefreshFunction = true;
						}
					}

					setTimeout(function(){
						for(index=0; index<qualifyingSlotNamesLength; index++){
							var dmSlot = qualifyingSlotNames[ index ];
							utilCreateVLogInfoPanel(slotsMap[dmSlot][pmSlots_key_divId], slotsMap[dmSlot][pmSlots_key_adSlotSizes]);						
							utilRealignVLogInfoPanel(slotsMap[dmSlot][pmSlots_key_divId]);	
						}						
					}, 2000+TIMEOUT);

					bidManagerExecuteAnalyticsPixel();
					
					if(yesCallRefreshFunction){						
						utilLog('Calling original refresh function from Timeout');
						original_refresh.apply(win.googletag.pubads(), arg );						
					}else{
						utilLog('AdSlot already rendered');
					}
						
				}, TIMEOUT);
			};
		}
	},
	
	addHooks = function(){

		localGoogletag = win.googletag;
		localPubAdsObj = localGoogletag.pubads();

		var s1 = localGoogletag.defineSlot('/Harshad', [[728, 90]], 'Harshad-02051986');
		if(s1 && s1.__proto__ && s1.__proto__.defineSizeMapping){
			var originalDefineSizeMapping = s1.__proto__.defineSizeMapping;
			s1.__proto__.defineSizeMapping = function(){
				slotSizeMapping[ this.getSlotId().getDomId() ] = arguments[0];
				return originalDefineSizeMapping.apply(this, arguments);
			};
		}
		localGoogletag.destroySlots([s1]);

		original_display = (localGoogletag && localGoogletag.display);
		original_destroySlots = (localGoogletag && localGoogletag.destroySlots);

		addHookOnGooglePubAdsDisableInitialLoad();
		addHookOnGooglePubAdsEnableSingleRequest();		
		addHookOnGoogletagDisplay();		
		addHookOnGooglePubAdsRefresh();				
		//	setTargeting is implemented by
		//		googletag.pubads().setTargeting(key, value);
		//			we are only intresetd in this one
		//		googletag.PassbackSlot.setTargeting(key, value);
		//			we do not care about it
		//		slot.setTargeting(key, value);
		//			we do not care, as it has a get method
		addHookOnGooglePubAdsSetTargeting();
		addHookOnGoogletagDestroySlots();
	}	
;

var controllerInit = function(config){

	try{

		utilAddMessageEventListenerForSafeFrame(false);		

		if(utilIsUndefined(config)){
			return;
		}

		configObject = config;
		bidManagerSetGlobalConfig(configObject);

		TIMEOUT = parseInt(configObject[constCommonGlobal].pwt.t || 1000);
		
		DM_targetingKeys[constTargetingBidID] = '';
		DM_targetingKeys[constTargetingBidStatus] = '';
		DM_targetingKeys[constTargetingEcpm] = '';
		DM_targetingKeys[constTargetingDealID] = '';
		DM_targetingKeys[constTargetingAdapterID] = '';
		DM_targetingKeys[constTargetingPubID] = '';
		DM_targetingKeys[constTargetingProfileID] = '';
		DM_targetingKeys[constTargetingProfileVersionID] = '';
		
		// define the command array if not already defined
		win.googletag = win.googletag || {};
		win.googletag.cmd = win.googletag.cmd || [];

		if(utilIsUndefined(win.google_onload_fired) && win.googletag.cmd.unshift){
			utilLog('Succeeded to load before GPT');
			win.googletag.cmd.unshift( function(){ 
				utilLog('OpenWrap initialization started');
				addHooks();
				utilLog('OpenWrap initialization completed');
			} );
		}else{
			utilLog('Failed to load before GPT');
		}
		
		if(utilIsFn(win.PWT.jsLoaded)){
			win.PWT.jsLoaded();
		}		

	}catch(e){
		console.log('OpenWrap: Something went wrong.');
		console.log(e);
	}
};