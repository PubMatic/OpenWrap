exports.pwt = {
	pid:"3693",
	gcv:"132",
	pdvid:"2",
	pubid:"5890",
	dataURL:"t.pubmatic.com/wl?",
	winURL:"t.pubmatic.com/wt?",
	owv:"v21.8.0",
	pbv:"v4.17.0",
	metaDataPattern:"PC:BC::P-W_x_H-NE(GE)||",
	sendAllBids:"0",
	adserver:"DFP",
	gdpr:"0",
	cmp:0,
	gdprTimeout:0,
	awc:0,
	platform:"display",
	refreshInterval:0,
	priceGranularity:0,
	adServerCurrency:0,
	singleImpression:"1",
	identityEnabled:"0",
	identityConsumers:0,
	ccpa:"0",
	ccpaCmpApi:0,
	ccpaTimeout:0,
	sChain:"0",
	sChainObj:0,
	auTimeout:"5000",
	t:"5000",
	ssTimeout:0,
	prebidObjName:0,
	pubAnalyticsAdapter:"0",
	usePBJSKeys:"0",
	abTestEnabled:"1"
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
	pubmatic:{
		publisherId:"5890",
		kgp:"AU@W_x_H:AUI",
		rev_share:"10.0",
		timeout:0,
		throttle:"100",
		pt:0,
		serverSideEnabled:"0",
		amp:0,
		video:0,
		"in-app":0,
		sk:"true"
	}
};	


exports.identityPartners = {};

exports.testConfigDetails={
	testGroupSize:"50",
	testType:"Partners"
}


/// AD UNIT AU1
// Read Config File and Get Video Config
// 1. Video Config is available 
// 2. Check if Defaut Video is Enabled or not
// 3. Generate Config of slot based on KGP of Default Video it would be AU // AU1
// 4. Loop on slotConfig for that generated slot config in pt.3
// 5. DIV1 -> Apply based on condtions (enabled,)
// 6. DIV5 -> It will increase Latency 

exports.slotConfig = {
	"configPattern": "DIV",
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