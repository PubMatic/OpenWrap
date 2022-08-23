var adapterManagerRegisteredAdapters = {},

	adapterManagerCallAdapters = function(configObject, activeSlots){

		var randomNumberBelow100 = Math.floor(Math.random()*100);
		
		var impressionID = utilGenerateUUID();
		
		configObject.global.pwt.wiid = impressionID;

		for(var i in activeSlots){
			if(utilHasOwnProperty(activeSlots, i) && activeSlots[i]){
				bidManagerResetBid(activeSlots[i][pmSlots_key_divId], impressionID);
				bidManagerSetConfig(activeSlots[i][pmSlots_key_divId], configObject);
				bidManagerSetSizes(activeSlots[i][pmSlots_key_divId], utilGenerateSlotNamesFromPattern(activeSlots[i], '_W_x_H_'));
			}
		}

		for(var anAdapter in adapterManagerRegisteredAdapters){
			if( utilHasOwnProperty(adapterManagerRegisteredAdapters, anAdapter) ){
				
				if(randomNumberBelow100 >= bidManagerGetAdapterThrottle(anAdapter)){

					for(var i in activeSlots){
						if(utilHasOwnProperty(activeSlots, i) && activeSlots[i]){
							bidManagerSetCallInitTime(activeSlots[i][pmSlots_key_divId], anAdapter);
						}
					}
					adapterManagerRegisteredAdapters[anAdapter].fB(configObject, activeSlots);

				}else{
					utilLog(anAdapter+constCommonMessage02);
				}				
			}
		}
	},

	adapterManagerRegisterAdapter = function(bidAdaptor) {
		if (bidAdaptor) {
			var adapterID = bidAdaptor.ID();
			if (utilIsFn(bidAdaptor.fB)) {
				adapterManagerRegisteredAdapters[adapterID] = bidAdaptor;
			} else {
				utilLog(adapterID + constCommonMessage03);
			}
		}
	},

	adapterManagerDisplayCreative = function(theDocument, adapterID, bidDetails){
		if( utilHasOwnProperty(adapterManagerRegisteredAdapters, adapterID) ){
			adapterManagerRegisteredAdapters[adapterID].dC(theDocument, bidDetails);
		}
	}
;