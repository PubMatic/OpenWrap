exports.pwt = {
	t: "3000",
    pid: "46",
    gcv: "11",
    pdvid: "4",
    pubid: "9999",
    dataURL: "t.test-domain.com/logger?",
    winURL: "t.test-domain.com/tracker?",
    "adserver": "IDHUB",//DFP
    gdpr: "0",
    cmpApi: "iab",
    gdprTimeout: "10000",
    awc: "1",
    disableAjaxTimeout: true,
    adServerCurrency: "INR",
    singleImpression: "1",
    identityEnabled: "1",
    identityConsumers: "Prebid", // PREBID
    identityOnly: "1", // 1
    ccpa: "0",
    ccpaCmpApi: "iab",
    ccpaTimeout: "10000",
    pbv:"v4.33.0",
    owv:"v21.4.0",
    abTestEnabled:"0",
    pubAnalyticsAdapter: "0",
    reduceCodeSize:1,
	ssoEnabled: "1"
}

exports.buildTimeConfigs = {
    userIdConfigs: {}
}

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
	}
};

exports.identityPartners = {
	publinkId: {
		name: "publinkId",
		"storage.type": "cookie",
		"storage.name": "pbjs_publink",
		"storage.expires": "30",
		"params.loadLauncher": "true",
		"params.LauncherId": "663",
		"params.site_id": "214393",
		"params.api_key": "061065f4-4835-40f4-936e-74e0f3af59b5",
		"params.urlParameter": "eparam",
		"params.cssSelectors": "input[type=text], input[type=email]",
	},
	identityLink: {
		name: "identityLink",
		"params.pid": "23",
		"storage.type": "cookie",
		"params.loadATS": "true",
		"params.placementID": "23",
		"params.storageType": "localstorage",
		"params.detectionType": "scrapeAndUrl",
		"params.urlParameter": "eparam",
		"params.cssSelectors": "input[type=text], input[type=email]",
		"params.logging": "info",
		"storage.name": "somenamevalue",
		"storage.expires": "60"
	}
};


/// AD UNIT AU1
// Read Config File and Get Video Config
// 1. Video Config is available 
// 2. Check if Defaut Video is Enabled or not
// 3. Generate Config of slot based on KGP of Default Video it would be _AU_ // AU1
// 4. Loop on slotConfig for that generated slot config in pt.3
// 5. DIV1 -> Apply based on condtions (enabled,)
// 6. DIV5 -> It will increase Latency 

exports.slotConfig = {
	"configPattern": "_DIV_",
	"config": {
		"Div1": {
			"banner": {
				"enabled": true
			},
			"native": {
				"enabled": true,
				"config": {
					"image": {
						"required": true,
						"sizes": [150, 50]
					},
					"title": {
						"required": true,
						"len": 80
					},
					"sponsoredBy": {
						"required": true
					},
					"body": {
						"required": true
					}
				}
			},
			"video": {
				"enabled": true,
				"config": {
					"context": "instream",
					"connectiontype": [1, 2, 6],
					"minduration": 10,
					"maxduration": 50,
					"battr": [
						6,
						7
					],
					"skip": 1,
					"skipmin": 10,
					"skipafter": 15
				},
				"partnerConfig": {
					"pubmatic": {
						"outstreamAU": "pubmatic-test"
					}
				}
			},

		},
		"AU2": {
			"banner": {}
		}
	}
}