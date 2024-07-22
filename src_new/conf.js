exports.pwt = {
	t: "3000",
	pid: "46",
	gcv: "11",
	pdvid: "4",
	pubid: "9999",
	dataURL: "t.test-domain.com/logger?",
	winURL: "t.test-domain.com/tracker?",
	"adserver": "IDHUB",
	gdpr: "0",
	cmpApi: "iab",
	gdprTimeout: "10000",
	awc: "1",
	disableAjaxTimeout: true,
	adServerCurrency: "INR",
	singleImpression: "1",
	identityEnabled: "1",
	identityConsumers: "EB,TAM,Prebid",
	identityOnly: "1",
	ccpa: "0",
	ccpaCmpApi: "iab",
	ccpaTimeout: "10000",
	pbv:"v4.33.0",
	owv:"v21.4.0",
	abTestEnabled:"0",
	pubAnalyticsAdapter: "0",
	reduceCodeSize:1,
	pbGlobalVarNamespace: "ihowpbjs",
	owGlobalVarNamespace: "IHPWT",
	localStorageAccess: "1", // Added new field for allow local storage feature 
	filters: {
		domainFilter: {
			"idpartners": {
				"127.0.0.1:8081": ["hadronId"]
			}
		},
		geoFilter: {
			"EU": "1",
			"US": "2",
			"ROW": "3"
		}
	}

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
	hadronId: {
	    name: "hadronId",
	    "params.urlArg": "eparam"
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
};
