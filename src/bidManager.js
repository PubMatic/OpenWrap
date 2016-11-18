var bidMap = {},
	bidManagerPwtConf = {},
	adapterRevShareMap = {},
	adapterThrottleMap = {},
	adapterBidPassThrough = {},
	bid = 'bid',
	bids = 'bidsFromBidders',
	postTimeout = 'post_timeout',
	creationTime = 'creationTime',
	callInitiatedTime = 'callInitiatedTime',
	bidReceivedTime = 'bidReceivedTime',

	bidManagerCreateBidObject = function(ecpm, dealID, creativeID, creativeHTML, creativeURL, width, height, kgpv, keyValuePairs){
		var bidObject = {};
		bidObject[constTargetingEcpm] = ecpm;
		bidObject[constTargetingDealID] = dealID;		
		bidObject[constTargetingAdHTML] = creativeHTML;
		bidObject[constTargetingAdUrl] = creativeURL;
		bidObject[constTargetingCreativeID] = creativeID;
		bidObject[constTargetingHeight] = height;
		bidObject[constTargetingWidth] = width;
		bidObject[constCommonKeyGenerationPatternValue] = kgpv;
		bidObject[constTargetingKvp] = keyValuePairs || false;		
		return bidObject;
	},
	
	bidManagerCreateBidEntry = function(divID){
		var temp;
		if(! utilHasOwnProperty(bidMap, divID) ){
			
			temp = {};
			temp[bids] = {};
			temp[constCommonConfig] = {};
			temp[constCommonSizes] = [];
			temp[creationTime] = utilGetCurrentTimestampInMs();

			bidMap[divID] = temp;
		}
	},

	bidManagerSetConfig = function(divID, config){
		bidManagerCreateBidEntry(divID);
		bidMap[divID][constCommonConfig] = config;
	},

	bidManagerSetSizes = function(divID, slotSizes){
		bidManagerCreateBidEntry(divID);
		bidMap[divID][constCommonSizes] = slotSizes;
	},

	bidManagerSetCallInitTime = function(divID, bidderID){
		bidManagerCreateBidEntry(divID);
		if(! utilHasOwnProperty(bidMap[divID][bids], bidderID) ){
			bidMap[divID][bids][bidderID] = {};
		}
		bidMap[divID][bids][bidderID][callInitiatedTime] = utilGetCurrentTimestampInMs();	

		utilLog(constCommonMessage04+divID + ' '+bidderID+' '+bidMap[divID][bids][bidderID][callInitiatedTime]);
	},

	bidManagerSetBidFromBidder = function(divID, bidderID, bidDetails){

		bidManagerCreateBidEntry(divID);

		if(! utilHasOwnProperty(bidMap[divID][bids], bidderID) ){
			bidMap[divID][bids][bidderID] = {};
		}

		utilLog('BdManagerSetBid: divID: '+divID+', bidderID: '+bidderID+', ecpm: '+bidDetails[constTargetingEcpm]);
		utilLog(constCommonMessage06+ utilHasOwnProperty(bidMap[divID][bids][bidderID], bid));

		if(bidDetails[constTargetingEcpm] == null){
			utilLog(constCommonMessage10);
			return;
		}

		if(utilIsStr(bidDetails[constTargetingEcpm])){
			bidDetails[constTargetingEcpm] = bidDetails[constTargetingEcpm].replace(/\s/g, '');
			if(bidDetails[constTargetingEcpm].length == 0){
				utilLog(constCommonMessage20);
				return;
			}
		}
		
		if(isNaN(bidDetails[constTargetingEcpm])){
			utilLog(constCommonMessage11+bidDetails[constTargetingEcpm]);
			return;
		}

		//todo: add validation, html / url should be present and should be a string

		// updaate bid ecpm according to revShare
		bidDetails[constTargetingEcpm] = parseFloat(bidDetails[constTargetingEcpm]);
		bidDetails[constTargetingActualEcpm] = parseFloat(bidDetails[constTargetingEcpm]);
		bidDetails[constTargetingEcpm] = parseFloat((bidDetails[constTargetingEcpm] * bidManagerGetAdapterRevShare(bidderID)).toFixed(bidPrecision));

		var currentTime = utilGetCurrentTimestampInMs();
		var isPostTimeout = (bidMap[divID][creationTime]+TIMEOUT) < currentTime ? true : false;		

		if(utilHasOwnProperty(bidMap[divID][bids][bidderID], bid)){

			if(! isPostTimeout){
				
				if(bidMap[divID][bids][bidderID][bid][constTargetingEcpm] < bidDetails[constTargetingEcpm]){
					utilLog(constCommonMessage12+bidMap[divID][bids][bidderID][bid][constTargetingEcpm]+constCommonMessage13+bidDetails[constTargetingEcpm]+constCommonMessage14);
					bidMap[divID][bids][bidderID][bid] = bidDetails;
					bidMap[divID][bids][bidderID][bidReceivedTime] = currentTime;
					bidMap[divID][bids][bidderID][postTimeout] = isPostTimeout;					

					utilVLogInfo(divID, {
						type: bid,
						bidder: bidderID,
						bidDetails: bidDetails,
						startTime: bidMap[divID][creationTime],
						endTime: bidMap[divID][bids][bidderID][bidReceivedTime],
					});
				}else{
					utilLog(constCommonMessage12+bidMap[divID][bids][bidderID][bid][constTargetingEcpm]+constCommonMessage15+bidDetails[constTargetingEcpm]+constCommonMessage16);
				}
				
			}else{
				utilLog(constCommonMessage17);
			}

		}else{

			utilLog(constCommonMessage18);
			bidMap[divID][bids][bidderID][bid] = bidDetails;
			bidMap[divID][bids][bidderID][bidReceivedTime] = currentTime;
			bidMap[divID][bids][bidderID][postTimeout] = isPostTimeout;			

			utilVLogInfo(divID, {
				type: bid,
				bidder: bidderID + (adapterBidPassThrough[bidderID] ? '(PT)' : ''),
				bidDetails: bidDetails,
				startTime: bidMap[divID][creationTime],
				endTime: bidMap[divID][bids][bidderID][bidReceivedTime],
			});
		}		
	},

	bidManagerResetBid = function(divID, impressionID){
		utilVLogInfo(divID, {type: "hr"})
		delete bidMap[divID];
		bidManagerCreateBidEntry(divID);	
		bidMap[divID][constImpressionID] = impressionID;
	},

	bidManagerAuctionBids = function(bids){
		var winningBid = {},
			keyValuePairs = {}
		;
		winningBid[constTargetingEcpm] = 0;

		for(var adapter in bids){
			if(bids[adapter] 
				&& bids[adapter].bid 
				&& !adapterBidPassThrough[adapter]//BidPassThrough: Do not participate in auction
				// commenting this condition as we need to pass kvp for all bids and bids which should not be part of auction will have zero ecpm
				//&& bids[adapter].bid[constTargetingEcpm]
				&& bids[adapter][postTimeout] == false){

				if(bids[adapter].bid[constTargetingKvp]){
					utilCopyKeyValueObject(keyValuePairs, bids[adapter].bid[constTargetingKvp]);
				}

				if(winningBid[constTargetingEcpm] < bids[adapter].bid[constTargetingEcpm]){
					winningBid = bids[adapter].bid;
					winningBid[constTargetingAdapterID] = adapter;
				}
			}
		}

		winningBid[constTargetingKvp] = keyValuePairs;
		return winningBid;
	},

	bidManagerGetBid = function(divID, auctionFunction){

		var winningBid = {};
		winningBid[constTargetingEcpm] = 0;

		if( utilHasOwnProperty(bidMap, divID) ){		

			// if a custom auctionFunction is passed , let it evaluate the bids
			if(utilIsFn(auctionFunction)){
				return auctionFunction(bidMap[divID][bids]);
			}
			
			winningBid = bidManagerAuctionBids(bidMap[divID][bids]);
			winningBid[constTargetingBidStatus] = 1;
			bidMap[divID]['ae'] = true; // Analytics Enabled		

			if(winningBid[constTargetingEcpm] > 0){
				bidMap[divID][bids][ winningBid[constTargetingAdapterID] ].win = true;
				utilVLogInfo(divID, {
					type: "win-bid",
					bidDetails: winningBid
				});
			}else{
				utilVLogInfo(divID, {
					type: "win-bid-fail",
				});
			}
		}		

		return winningBid;
	},

	bidManagerDisplayCreative = function(theDocument, divID){	

		if( utilHasOwnProperty(bidMap, divID) ){
			var adapterID = '';
			// find the winning adapter
			for(var adapter in bidMap[divID][bids]){
				if( utilHasOwnProperty(bidMap[divID][bids], adapter) && bidMap[divID][bids][adapter].win ){
					adapterID = adapter;
					break;		
				}
			}
			
			utilLog(divID+constCommonMessage19+ adapterID);

			if( utilHasOwnProperty(bidMap[divID][bids], adapterID) ){
				adapterManagerDisplayCreative(
					theDocument, adapterID, bidMap[divID][bids][adapterID]
				);
				utilVLogInfo(divID, {type: 'disp', adapter: adapterID});
				bidManagerExecuteMonetizationPixel({
					'slt': divID,
					'adp': adapterID,
					'en': bidMap[divID][bids][adapterID][bid][constTargetingEcpm],
					'eg': bidMap[divID][bids][adapterID][bid][constTargetingActualEcpm],
					'iid': bidMap[divID][constImpressionID],
					'kgpv': bidMap[divID][bids][adapterID][bid][constCommonKeyGenerationPatternValue]
				});
			}
		}		
	},

	bidManagerSetGlobalConfig = function(config){

		if(utilHasOwnProperty(config, constCommonGlobal) && utilHasOwnProperty(config[constCommonGlobal], 'pwt')){
			bidManagerPwtConf = config[constCommonGlobal]['pwt'];
		}

		bidManagerSetAdapterConfig(config);
	},

	bidManagerGetProfileID = function(){
		return bidManagerPwtConf[constConfigProfileID] || "0";
	},

	bidManagerGetProfileDisplayVersionID = function(){
		return bidManagerPwtConf[constConfigProfileDisplayVersionID] || "0";
	},

	bidManagerGetAnalyticsPixelURL = function(){
		return bidManagerPwtConf[constConfigAnalyticURL] || false;
	},

	bidManagerGetMonetizationPixelURL = function(){
		return bidManagerPwtConf[constConfigMonetizationURL] || false;
	},

	bidManagerSetAdapterConfig = function(configObject){
		if(	utilHasOwnProperty(configObject, constCommonGlobal) 
			&& utilHasOwnProperty(configObject[constCommonGlobal], constCommonAdapters)){

			var adapterConfig = configObject[constCommonGlobal][constCommonAdapters];

			for(var adapter in adapterConfig){
				if( utilHasOwnProperty(adapterConfig, adapter) ){
					if(utilHasOwnProperty(adapterConfig[adapter], constConfigAdapterRevenueShare)){
						adapterRevShareMap[adapter] = (1 - parseFloat(adapterConfig[adapter][constConfigAdapterRevenueShare])/100);	
					}

					if(utilHasOwnProperty(adapterConfig[adapter], constConfigAdapterThrottle)){
						adapterThrottleMap[adapter] = 100 - parseFloat(adapterConfig[adapter][constConfigAdapterThrottle]);	
					}

					if(utilHasOwnProperty(adapterConfig[adapter], constConfigAdapterBidPassThrough)){
						adapterBidPassThrough[adapter] = parseInt(adapterConfig[adapter][constConfigAdapterBidPassThrough]);
					}
				}
			}
		}		
	},

	bidManagerGetAdapterRevShare = function(adapterID){
		if(utilHasOwnProperty(adapterRevShareMap, adapterID)){
			return adapterRevShareMap[adapterID];
		}
		return 1;
	},

	bidManagerGetAdapterThrottle = function(adapterID){
		if(utilHasOwnProperty(adapterThrottleMap, adapterID)){
			return adapterThrottleMap[adapterID];
		}
		return 0;
	},

	bidManagerExecuteAnalyticsPixel = function(){

		var selectedInfo = {},
			outputObj = {},
			firePixel = false,
			impressionID = '',
			pixelURL = bidManagerGetAnalyticsPixelURL()
		;

		if(!pixelURL){
			return;
		}

		outputObj['s'] = [];

		for(var key in bidMap){

			if(! utilHasOwnProperty(bidMap, key)){
				continue;
			}

			var startTime = bidMap[key][creationTime];
			if(utilHasOwnProperty(bidMap, key) && bidMap[key].exp != false && bidMap[key]['ae'] == true ){

				bidMap[key].exp = false;

				var slotObject = {
					'sn': key,
					'sz': bidMap[key][constCommonSizes],
					'ps': []
				};

				selectedInfo[key] = {};

				var bidsArray = bidMap[key][bids];
				impressionID = bidMap[key][constImpressionID];

				for(var adapter in bidsArray){

					//if bid-pass-thru is set then do not log the bids
					if(adapterBidPassThrough[adapter]){
						continue;
					}

					if(bidsArray[adapter] && bidsArray[adapter].bid ){

						var endTime = bidsArray[adapter][bidReceivedTime];

						slotObject['ps'].push({
							'pn': adapter,
							'kgpv': bidsArray[adapter].bid[constCommonKeyGenerationPatternValue],
							'psz': bidsArray[adapter].bid[constTargetingWidth] + 'x' + bidsArray[adapter].bid[constTargetingHeight],
							'eg': bidsArray[adapter].bid[constTargetingActualEcpm],
							'en': bidsArray[adapter].bid[constTargetingEcpm],
							'l1': endTime - startTime,
							'l2': 0,
							't': bidsArray[adapter][postTimeout] == false ? 0 : 1,
							'wb': bidsArray[adapter]['win'] == true ? 1 : 0
						});

						firePixel = true;
					}
				}

				outputObj['s'].push(slotObject);
			}
		}

		if(firePixel){			
			outputObj[constConfigPublisherID] = bidManagerPwtConf[constConfigPublisherID];
			outputObj['to'] = bidManagerPwtConf['t'];
			outputObj['purl'] = decodeURIComponent(utilMetaInfo.u);
			outputObj[constBidInfoTimestamp] = utilGetCurrentTimestamp();
			outputObj[constImpressionID] = encodeURIComponent(impressionID);
			outputObj[constConfigProfileID] = bidManagerGetProfileID();
			outputObj[constConfigProfileDisplayVersionID] = bidManagerGetProfileDisplayVersionID();

			pixelURL += 'json=' + encodeURIComponent(JSON.stringify(outputObj));
		}

		//setTimeout(function(){
			if(firePixel){
				(new Image()).src = utilMetaInfo.protocol + pixelURL;
			}
		//}, TIMEOUT+5000);//todo: decide the timeout value
	},

	bidManagerExecuteMonetizationPixel = function(bidInfo){

		var pixelURL = bidManagerGetMonetizationPixelURL();

		if(!pixelURL){
			return;
		}

		pixelURL += 'pubid=' + bidManagerPwtConf[constConfigPublisherID];
		pixelURL += '&purl=' + utilMetaInfo.u;
		pixelURL += '&tst=' + utilGetCurrentTimestamp();
		pixelURL += '&iid=' + encodeURIComponent(bidInfo[constImpressionID]);
		pixelURL += '&pid=' + encodeURIComponent(bidManagerGetProfileID());
		pixelURL += '&pdvid=' + encodeURIComponent(bidManagerGetProfileDisplayVersionID());
		pixelURL += '&slot=' + encodeURIComponent(bidInfo[constBidInfoSlot]);
		pixelURL += '&pn=' + encodeURIComponent(bidInfo[constBidInfoAdapter]);
		pixelURL += '&en=' + encodeURIComponent(bidInfo[constBidInfoNetEcpm]);
		pixelURL += '&eg=' + encodeURIComponent(bidInfo[constBidInfoGrossEcpm]);
		pixelURL += '&kgpv=' + encodeURIComponent(bidInfo[constCommonKeyGenerationPatternValue]);

		(new Image()).src = utilMetaInfo.protocol + pixelURL;
	}
;