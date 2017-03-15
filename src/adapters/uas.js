adapterManagerRegisterEmptyAdapter('uas');

// UAS library

var combineSlotsData  = function(dataAttribute, arrayOfSlots, keyLookupMap){
	var theSlot,
		output = '',
		index,
		aSlot
	;
	
	for(index in arrayOfSlots){
		aSlot = arrayOfSlots[ index ];
		output += combineSlotSpecificData(dataAttribute, aSlot, keyLookupMap) + '|';
	}
	output = output.substr(0, output.length -1 );	
	return output;
};

var combineSlotSpecificData = function(dataAttribute, theSlot, keyLookupMap){
	var temp,
		i,
		len,
		output = '',
		dataAttributeFunctionMap = {
			'adUnit'			: 'getAdUnitPath',
			'adSizes'			: 'getSizes',
			'targetings'		: 'getTargetingKeys',
			'targetingByKey'	: 'getTargeting',
		}
	;
	
	switch(dataAttribute){
		case 'adUnit':
			if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){// todo: this if bracket can be taken above switch
				output = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
				output = keyLookupMap[output].auid; // todo: checks needed
			}
			break;

		case 'adDiv':
			output = theSlot.getSlotId().getDomId();
			break;	
			
		//todo: what to do if adunit is targeted at all sizes ?	
		//		empty array should be passed []
		//		but then what should be passed ?
		case 'adSizes':
			if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){
				// temp will contain an array of sizes
				temp = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
				len = temp.length;
				for(i=0; i<len; i++){
					if(temp[i]){
						output += temp[i].getWidth() + 'x' + temp[i].getHeight() + ','
					}
				}
				output = output.substr(0, output.length -1 );
			}
			break;
			
		case 'targetings':
			if( dataAttributeFunctionMap.hasOwnProperty( dataAttribute ) ){
			
				// temp will contain list of keys first
				temp = theSlot[ dataAttributeFunctionMap[ dataAttribute ] ]();
				len = temp.length;
				for(i=0; i<len; i++){
					output += temp[i] + '=' + (theSlot[ dataAttributeFunctionMap[ 'targetingByKey' ] ]( temp[i] )).join() + '&';
				}
				output = output.substr(0, output.length -1 );
			}
			break;
	}							
	
	return output;
}

var uasGenerateCall = function(arrayOfSlots, configObject){
	var serevr_path = 'ae.pubmatic.com/ad?',
		encodeURIC = encodeURIComponent,
		queryString = [],
		currTime = new Date(),
		adapterConfigMandatoryParams = [constConfigKeyGeneratigPattern, constConfigKeyLookupMap],
		keyLookupMap = {}
	;

	var adapterConfig = utilLoadGlobalConfigForAdapter(configObject, 'uas', adapterConfigMandatoryParams);
	if(!adapterConfig){
		return;
	}

	keyLookupMap = adapterConfig[constConfigKeyLookupMap];

	/*
		Assume that DFP_AU --> UAS_AU config is always present
		todo :
			map of AU
			percentage config
	*/

	queryString.push(
		'req_type=219',
		'sec='+utilMetaInfo.secure,
		'res_format=2',
		'cback=window.PWT.UASCallback', // todo: window.parent ??  we may need to rethink
		'rndn='			+ Math.random(),
		'purl='			+ utilMetaInfo.u,
		'rurl='			+ utilMetaInfo.r,
		'iifr='			+ (self === top ? '0' : '1'),
		'scrn='			+ encodeURIC( screen.width + 'x' + screen.height ),
		'tz='			+ encodeURIC( currTime.getTimezoneOffset()/60  * -1 ),					
		'kltstamp='		+ encodeURIC( currTime.getFullYear() + "-" + (currTime.getMonth() + 1) + "-" + currTime.getDate() + " " + currTime.getHours() + ":" + currTime.getMinutes() + ":" + currTime.getSeconds() ),
		'au='			+ encodeURIC( combineSlotsData('adUnit', arrayOfSlots, keyLookupMap) ),
		'iid='			+ encodeURIC( combineSlotsData('adDiv', arrayOfSlots) ),
		'asz='			+ encodeURIC( combineSlotsData('adSizes', arrayOfSlots) ),
		'slt_kv='		+ encodeURIC( combineSlotsData('targetings', arrayOfSlots) )//,
		//'gkv='			+ encodeURIC( combineGlobalTargetings() ) // optional
	);
	
	utilLoadScript(utilMetaInfo.protocol + serevr_path + queryString.join('&'));
};

var createFriendlyIframeAndRenderCreative = function( addIframeToElementID, responseObject ){
	var addIframeToElement,
		iframeDoc,
		iframeElement,
		content,
		trackers,
		trackersLength,
		i					
	;
	
	addIframeToElement = doc.getElementById( addIframeToElementID );
	if(addIframeToElement){
		iframeElement = doc.createElement('iframe');
		iframeElement.id = addIframeToElementID + '_adDisplay';												
		iframeElement.height = responseObject.h;
		iframeElement.width = responseObject.w;
		iframeElement.scrolling="no";
		iframeElement.marginwidth="0";
		iframeElement.marginheight="0";
		iframeElement.frameborder="0";					
		iframeElement.style.cssText="border: 0px; vertical-align: bottom;";
		
		addIframeToElement.appendChild( iframeElement );
		
		iframeElement = doc.getElementById( addIframeToElementID + '_adDisplay' );
		if(iframeElement){
			
			content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><scr' + 'ipt>inDapIF=true;</scr' + 'ipt></head>';
			content += '<body><style>body{margin:0px;padding:0px;}</style>';
			content += '<scr' + 'ipt>';
			content += 'document.write(decodeURIComponent("'+responseObject.ct+'"));';
			if(responseObject.tr){
			trackers = responseObject.tr;
			trackersLength = trackers.length;
			for(i=0; i<trackersLength; i++){
					content += 'document.write("<iframe src=\''+ trackers[i] +'\' style=\'border: 0px; vertical-align: bottom;visibility: hidden; display: none;\'></iframe>");';
				}
			}
			content += '</scr' + 'ipt>';							
			content += '</body></html>';
			
			iframeDoc = iframeElement.contentWindow.document;
			iframeDoc.write(content);
			iframeDoc.close();							
		}
	}					
};

win.PWT.UASCallback = function(response){
	//todo: response might require the div-id as key , need to define new key too
	//		problem with out-of page, can there be case where div-id is not passed
	var eachBid, index;
	if(response.bids){
		for(index in response.bids){
			eachBid = response.bids[index];
			if(eachBid.isNative == 1 ){
				// special treatment calls 58:c1ee99e0-b26a-46a1-bc77-8913f0cfe732								
				console.log('Native creative found...');
				continue;
			}			
			if(eachBid.ct && eachBid.ct.length != 0 /*&& eachBid.h != 0 && eachBid.w != 0*/){
				console.log('Creative found for ' + eachBid.id)
				createFriendlyIframeAndRenderCreative(eachBid.id, eachBid); // temporary change
			}else{
				console.log('Creative NOT found for ' + eachBid.id)
			}
		}
	}
};