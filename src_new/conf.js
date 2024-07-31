exports.pwt = {
	pid: "66622",
	gcv: "209",
	pdvid: "1",
	pubid: "5890",
	dataURL: "t.pubmatic.com/wl?",
	winURL: "t.pubmatic.com/wt?",
	owv: "v26.10.0",
	pbv: "v7.39.0",
	usePBSAdapter: "0",
	reduceCodeSize: "1",
	metaDataPattern: 0,
	sendAllBids: "0",
	adserver: "DFP",
	gdpr: "0",
	cmp: 0,
	gdprTimeout: 0,
	awc: 0,
	platform: "display",
	refreshInterval: 0,
	priceGranularity: 0,
	adServerCurrency: 0,
	singleImpression: "1",
	identityEnabled: 1,
	identityConsumers: 0,
	ccpa: "0",
	ccpaCmpApi: 0,
	ccpaTimeout: 0,
	sChain: "0",
	sChainObj: 0,
	auTimeout: "1000",
	t: "1000",
	ssTimeout: 0,
	prebidObjName: 0,
	pubAnalyticsAdapter: "1",
	usePBJSKeys: "0",
	abTestEnabled: "0",
	testGroupSize: 0,
	testType: 0,
	granularityMultiplier: 0,
	floorPriceModuleEnabled: "0",
	floorSource: 0,
	floorAuctionDelay: 0,
	jsonUrl: 0,
	ssoEnabled: 0,
	autoRefreshAdslots: "0",
	videoAdDuration: 0,
	videoAdDurationMatching: 0,
	adPodConfiguration: 0,
	customPriceGranularityConfig: 0,
	marketplaceBidders: 0,
	owRedirectURL: 0,
	topicsFPDModule: 0,
	enableVastUnwrapper: 0,
	floorType: 0,
	pubId: 0,
	zone: 0,
	pbGlobalVarNamespace: "owpbjs",
	owGlobalVarNamespace: "PWT",
	gpp: "0",
	gppCmpApi: 0,
	gppTimeout: 0,
	globalNamespaceType: "Default",
	gdprActionTimeout: 0,
	localStorageAccess: "1",
	 // Added new field for allow local storage feature 
	filters: {
	   'idpartners': {
		 'identityLink': {
		   geo: {
			 allowList: ['CCPA'] // run only in US, block everywhere else
		   }
		 },
		 'id5Id': {
		   geo: {
			 allowList: ['GDPR'] // run only in EU, block everywhere else
		   }
		 },
		 'liveIntentId': {
		   domain: {
			 blockList: ['localhost'] // block on this domain
		   }
		 }
	   },
	   'adapters': {
		 'rubicon': {
		   geo: {
			 allowList: ['GDPR']
		   },
		   domain: {
			 blockList: ['localhost'] // block on this domain
		   }
		 }
	   }
	 },
	 dynamicTimeoutEnabled: "1",
	 autoMoveBidder: "1",
	 doNotMoveBidders: ["appnexus", "pubmatic"]
   };
   
   // singleImpression is used to enable feature of sending single impression for multiple size ad slot earlier there were multiple impression for multiple sizes
   
   //below is the config for test purpose only
   exports.testConfigDetails = {
	 "testGroupSize": 99
   };
   //below is the config for test purpose only
   exports.test_pwt = {
	 "t": 5000
   };
   exports.adapters = {
	 pubmatic: {
	   rev_share: "0.0",
	   throttle: "100",
	   publisherId: "156209",
	   kgp: "_W_x_H_@_W_x_H_:_AUI_"
	 },
	 appnexus: {
	   rev_share: "0.0",
	   throttle: "100",
	   kgp: "_DIV_",
	   klm: {
		 "Div_1": {
		   placementId: "8801674",
		   "video.mimes": "",
		   "video.minduration": ""
		 },
		 "Div-2": {
		   placementId: "8801685"
		 }
	   }
	 },
	 rubicon: {
	   accountId: "10998",
	   rev_share: "0.0",
	   timeout: "1000",
	   throttle: "100",
	   pt: 0,
	   serverSideEnabled: "0",
	   amp: 0,
	   video: 0,
	   "in-app": 0,
	   kgp_rx: "_AU_@_DIV_@_W_x_H_",
	   klm_rx: [{
		 rx: {
		   DIV: ".*",
		   AU: "^/43743431/DMDemo",
		   SIZE: "728x90"
		 },
		 rx_config: {
		   zoneId: "869224",
		   siteId: "178620",
		   floor: "0"
		 }
	   }]
	 }
   };
   exports.identityPartners = {
	 id5Id: {
	   name: "id5Id",
	   "storage.type": "html5",
	   "storage.expires": "90",
	   "storage.name": "id5id",
	   "storage.refreshInSeconds": "28800",
	   "params.partner": "556",
	   "params.abTesting.enabled": 0,
	   "params.abTesting.controlGroupPct": 0,
	   rev_share: "0.0",
	   timeout: 0,
	   throttle: "100",
	   display: 0
	 },
	 liveIntentId: {
		name: "liveIntentId",
		"params.publisherId": 5890,
		"params.requestedAttributesOverrides": '{"uid2":true,"pubmatic":true}',
		"storage.type": "cookie",
		"storage.name": "pbjs_li_nonid"
	},
	identityLink: {
		name: "identityLink",
		"storage.type": "cookie",
		"storage.expires": "30",
		"storage.name": "idl_env",
		"params.pid": "198",
		"params.loadATS": 0,
		"params.storageType": 0,
		"params.detectionType": 0,
		"params.urlParameter": 0,
		"params.cssSelectors": 0,
		"params.logging": 0,
		"params.detectDynamicNodes": 0,
		"params.enableCustomId": 0,
		"params.accountID": 0,
		"params.customerIDRegex": 0,
		"params.detectionMechanism": 0,
		"params.detectionEventType": 0,
		"params.triggerElements": 0,
		"params.pixelID": 0,
		"rev_share": "0.0",
		"timeout": 0,
		"throttle": "100",
		"display": 0
	},
   };
  