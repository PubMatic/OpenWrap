exports.pwt = {
	t: "3000",
	pid: "46",
	gcv: "11",
	pdvid: "4",
	pubid: "9999",
	dataURL: "t.test-domain.com/logger?",
	winURL: "t.test-domain.com/tracker?",
	adserver: "DFP",
	gdpr: "0",
	cmpApi: "iab",
	gdprTimeout: "10000",
	awc: "1",
	disableAjaxTimeout:true,
	adServerCurrency: "INR",
	singleImpression: "1",
	identityEnabled:"0",
	identityConsumers:"EB,TAM,Prebid",
	identityOnly:"0"
};

// singleImpression is used to enable feature of sending single impression for multiple size ad slot earlier there were multiple impression for multiple sizes

exports.adapters = {
	pubmatic: {
		rev_share: "0.0",
		throttle: "100",
		publisherId: "156209",
		kgp: "_W_x_H_@_W_x_H_:_AUI_"
	},
	audienceNetwork: {
		rev_share: "0.0",
		throttle: "100",
		kgp_rx: "_DIV_",
		klm_rx: {
			"Div_1": {
				placementId: "8801674"
			},
			"Div-2": {
				placementId: "8801685"
			}
		}
	},
	sekindoUM: {
		rev_share: "0.0",
		throttle: "100",
		kgp: "_DIV_",
		klm: {
			"Div_1": {
				spaceId: 14071
			},
			"Div-2": {
				spaceId: 14071
			}
		}
	},
	appnexus: {
		rev_share: "0.0",
		throttle: "100",
		kgp: "_DIV_",
		klm: {
			"Div_1": {
				placementId: "8801674"
			},
			"Div-2": {
				placementId: "8801685"
			}
		}
	},
	pulsepoint: {
		cp: "521732",
		rev_share: "0.0",
		throttle: "100",
		kgp: "_DIV_",
		klm: {
			"Div_1": {
				ct: "76835"
			},
			"Div-2": {
				ct: "147007"
			}
		}
	}
};

exports.nativeConfig = {
	kgp:"_DIV_", 
	klm:{
		"DIV1":{
			"nativeOnly": true,
			config: {
				image: {
					required: true,
					sizes: [150, 50]
				},
				title: {
					required: true,
					len: 80
				},
				sponsoredBy: {
					required: true
				},
				body: {
					required: true
				}
			}
		},
		"DIV2":{
			"nativeOnly": true,
			config: {
				image: {
					required: true,
					sizes: [150, 50]
				},
				title: {
					required: true,
					len: 80
				},
				sponsoredBy: {
					required: true
				},
				body: {
					required: true
				}
			}
		}
	}
};

exports.identityPartners = {
	pubCommonId: {
		name: "pubCommonId",
		"storage.type": "cookie",
		"storage.name": "_pubCommonId", 
		"storage.expires": "1825"               
	},
	digitrust: {
		"name":"digitrust",
		"params.init.member": "nQjyizbdyF",
		"params.init.site":"FL6whbX1IW",
		"redirects": "true",
		"storage.type": "cookie",
		"storage.name": "somenamevalue",
		"storage.expires":"60"
	}
};

exports.videoConfig = {
	"default": {
		"video": {
			"enabled": "true",
			"format":"instream",
			"connectiontype": [2],
			"minduration": 10,
			"maxduration": 50,
			"battr": [6,7],
			"skip": 1,
			"skipmin": 10,
			"skipafter": 15
		}
	},
	"slotConfig": [{
		"slotname": "DIV1",
		"video": {
			"enabled": true,
			"connectiontype": [0, 1, 2, 3, 5, 6],
			"minduration": 10,
			"maxduration": 50,
			"battr": [6,7],
			"skip": 1,
			"skipmin": 10,
			"skipafter": 15,
			"clientconfig": {
				"timeouts": {
					"wrapperTagURI": "<interval>",
					"mediaFileURI": "<interval>"
				}
			}
		}
	},
	{
		"slotname": "DIV2",
		"video": {
			"enabled": false,
			"connectiontype": [1, 2, 6],
			"minduration": 10,
			"maxduration": 50,
			"battr": [
				6,
				7
			],
			"skip": 1,
			"skipmin": 10,
			"skipafter": 15,
			"clientconfig": {
				"timeouts": {
					"wrapperTagURI": "<interval>",
					"mediaFileURI": "<interval>"
				}
			}
		}
	},
	{
		"slotname": "efgc",
		"banner": {
			"enabled":false
		}
	}]
};