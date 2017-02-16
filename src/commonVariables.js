// commonVariables.js

var win = window,
	doc = win.document,

	TIMEOUT,

	bidPrecision = 4,

	constDebugInConsoleKeyword = 'pwtc',
	constDebugInConsolePrependWith = '=+=+= ',
	constDebugInOverlay = 'pwtvc',

	// Ones passed by PWT to DFP OR present in bidDetails
	constTargetingBidID 		= 'pwtsid', //DivID will be passed
	constTargetingBidStatus 	= 'pwtbst',
	constTargetingAdapterID 	= 'pwtpid',
	constTargetingEcpm			= 'pwtecp',
	constTargetingActualEcpm	= 'pwtaecp',
	constTargetingDeal			= 'pwtdeal'
	constTargetingDealID		= 'pwtdid',
	constTargetingAdUrl			= 'pwtau',
	constTargetingAdHTML		= 'pwta',
	constTargetingCreativeID	= 'pwtcid',
	constTargetingHeight		= 'pwth',
	constTargetingWidth			= 'pwtw',
	constTargetingKvp			= 'kvp',

	// ones used in PWT config
	constConfigKeyGeneratigPattern = 'kgp',	
	constConfigServerSideKey = 'sk',
	constConfigKeyLookupMap = 'klm',
	constConfigPublisherID = 'pubid',
	constConfigProfileID = 'pid',
	constConfigProfileDisplayVersionID = 'pdvid',
	constConfigAnalyticURL = 'dataURL',
	constConfigMonetizationURL = 'winURL',

	constConfigAdapterRevenueShare = 'rev_share',
	constConfigAdapterThrottle = 'throttle',
	constConfigAdapterBidPassThrough = 'pt',
	constConfigGlobalKeyValue = 'gkv',
	constCommonSlotKeyValue = 'skv',

	// very commonly used
	constCommonConfig = 'config',
	constCommonDivID = 'divID',
	constCommonParams = 'params',
	constCommonSizes = 'sizes',
	constCommonHeight = 'height',
	constCommonWidth = 'width',
	constCommonGlobal = 'global',
	constCommonAdapters = 'adapters',
	constCommonSlots = 'slots',
	constCommonKeyGenerationPatternValue = 'kgpv',
	constCommonDefaultBid = 'db',
	constCommonLastBidID = 'lastbidid',
	
	constDealID = 'id',
	constDealChannel = 'channel',
	constDealKeyFirstPart = 'pwtdeal_'
	constDealKeyValueSeparator = '_-_',
	constDealChannelPMP = 'PMP',
	constDealChannelPMPG = 'PMPG',
	constDealChannelPreffered = 'PREF',

	constCommonMessage01 = ': In fetchbids.',
	constCommonMessage02 = ': Throttled.',
	constCommonMessage03 = ': adapter must implement the fetchBids() function.',
	constCommonMessage04 = 'BidManager: entry ',
	constCommonMessage05 = ': Callback.',
	constCommonMessage06 = 'bidAlreadExists : ',
	constCommonMessage07 = ': Exiting from fetchBids.',
	constCommonMessage08 = '. Config not found, ignored.',
	constCommonMessage09 = '. Config ignored.',
	constCommonMessage10 = 'Bid is rejected as ecpm is NULL.',	
	constCommonMessage11 = 'Bid is rejected as ecpm is NaN: ',
	constCommonMessage12 = 'Existing bid ecpm: ',
	constCommonMessage13 = ', is lower than new bid ecpm ',
	constCommonMessage14 = ', so we are replacing bid.',
	constCommonMessage15 = ', is greater than new bid ecpm ',
	constCommonMessage16 = ', so we are not replacing bid.',
	constCommonMessage17 = 'Post timeout bid, ignored.',
	constCommonMessage18 = 'Bid is selected.',
	constCommonMessage19 = ': Found winning adapterID: ',
	constCommonMessage20 = 'Bid is rejected as ecpm is empty string.',
	constCommonMessage21 = ': error in respose handler.',
	constCommonMessage22 = 'Bid is rejected as ecpm is <= 0.',

	constCommonMacroForWidth = '_W_',
	constCommonMacroForHeight = '_H_',
	constCommonMacroForAdUnitID = '_AU_',
	constCommonMacroForAdUnitIndex = '_AUI_',
	constCommonMacroForInteger = '_I_',
	constCommonMacroForDiv = '_DIV_',

	constCommonMacroForWidthRegExp = new RegExp(constCommonMacroForWidth, "g"),
	constCommonMacroForHeightRegExp = new RegExp(constCommonMacroForHeight, "g"),
	constCommonMacroForAdUnitIDRegExp = new RegExp(constCommonMacroForAdUnitID, "g"),
	constCommonMacroForAdUnitIndexRegExp = new RegExp(constCommonMacroForAdUnitIndex, "g"),
	constCommonMacroForIntegerRegExp = new RegExp(constCommonMacroForInteger, "g"),
	constCommonMacroForDivRegExp = new RegExp(constCommonMacroForDiv, "g"),

	// active slots
	constAdSlotSizes = 'adSlotSizes',
	constAdUnitID = 'adUnitID',
	constAdUnitIndex = 'adUnitIndex',
	constImpressionID = 'iid',

	constBidInfoSlot = 'slt',
	constBidInfoAdapter = 'adp',
	constBidInfoNetEcpm = 'en',
	constBidInfoGrossEcpm = 'eg',
	constBidInfoTimestamp = 'tst'
;

win.PWT = win.PWT || {};

win.PWT.displayCreative = function(theDocument, divID){
	utilLog('In displayCreative for: ' + divID);
	bidManagerDisplayCreative(theDocument, divID);
};

win.PWT.displayPMPCreative = function(theDocument, values, priorityArray){

	utilLog('In displayPMPCreative for: ' + values);
	
	values = values.split(',');

	var valuesLength = values.length,
		priorityArrayLength = priorityArray.length,
		selectedPMPDeal = '',
		bidID = ''
	;

	if(valuesLength == 0){
		utilLog('Error: Unable to find bidID as values array is empty.');
		return;
	}
	
	for(var i = 0; i < priorityArrayLength; i++){

		for(var j = 0; j < valuesLength; j++){
			if(values[j].indexOf(priorityArray[i]) >= 0){
				selectedPMPDeal = values[j];
				break;
			}
		}

		if(selectedPMPDeal != ''){
			break;
		}
	}
	
	if(selectedPMPDeal == ''){
		selectedPMPDeal = values[0];
		utilLog('No PMP-Deal was found matching PriorityArray, So Selecting first PMP-Deal: '+ selectedPMPDeal);		
	}else{
		utilLog('Selecting PMP-Deal: '+ selectedPMPDeal);	
	}

	var temp = selectedPMPDeal.split(constDealKeyValueSeparator);
	if(temp.length == 3){
		bidID = temp[2];
	}

	if(bidID == ''){
		utilLog('Error: bidID not found in PMP-Deal: '+ selectedPMPDeal);
		return;
	}

	bidManagerDisplayCreative(theDocument, bidID);
}