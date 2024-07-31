exports.pwt = {
	t: "3000",
	pid: "46",
	gcv: "11",
	pdvid: "4",
	pubid: "9999",
	dataURL: "t.test-domain.com/logger?",
	winURL: "t.test-domain.com/tracker?",
	adserver: "CUSTOM",
	gdpr: "1",
	cmpApi: "iab",
	gdprTimeout: "10000",
	awc: "1",
	disableAjaxTimeout: true,
	adServerCurrency: "INR",
	singleImpression: "1",
	identityEnabled: "1",
	identityConsumers: "EB,TAM,Prebid",
	identityOnly: "0",
	ccpa: "1",
	ccpaCmpApi: "iab",
	ccpaTimeout: "10000",
	gpp: "1",
	gppTimeout: "1000",
	pbv:"v4.33.0",
	owv:"v21.4.0",
	abTestEnabled:"0",
	pubAnalyticsAdapter: "0",
	reduceCodeSize:1,
	pbGlobalVarNamespace: "owpbjs",
	owGlobalVarNamespace: "PWT",
	localStorageAccess: "1", // Added new field for allow local storage feature 
	filters: {
        'idpartners': {
            'id5Id': {
                geo: {
                    allowList: ['CCPA'] // run only in US, block everywhere else
                }
            },
            'merkleId': {
               geo: {
                    allowList: ['GDPR'] // run only in EU, block everywhere else
               }
            },
            'zeotapIdPlus': {
                geo: {
                    allowList: ['CA', 'TX', 'NY', 'FL', 'IL'] // run only in these country codes, block everywhere else
                }
            },
            'hadronId': {
                domain: {
                    blockList: ['127.0.0.1:8081'] // block on this domain
                } 
            }
        },
        'adapters': {
            'pubmatic': {
               geo: {
                    blockList: ['GDPR']
               }
            },
            'appnexus': {
                geo: {
                    allowList: ['CCPA']
                }
            },
            'rubicon': {
                geo: {
                    allowList: ['GDPR']
                },
                domain: {
                    blockList: ['127.0.0.1:8081'] // block on this domain
                }
            }
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
exports.adapters = 
{
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
    zeotapIdPlus: {
		name:"zeotapIdPlus",
		"params.loadIDP":0,
		partnerId:0,
		rev_share:"0.0",
		timeout:0,
		throttle:"100",
		display:0
	},
	hadronId: {
		name: "hadronId",
		"params.url": "https://prebid.org/hadron_id/empty",
		"params.urlArg": 0,
		"params.partnerId": "1234",
		display: 0,
		rev_share: "0.0",
		throttle: "100"
	},
	merkleId: {
		name:"merkleId",
		"params.sv_pubid":"5890",
		"params.ssp_ids":"76,89",
		"storage.name":"_svsid",
		"storage.type":"cookie"
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
