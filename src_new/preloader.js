/**
 * Use of preloader.js
 * 1. Serve the correct prebid config based on geo detected - consent management use case
 * 2. Apply domain filters to remove identity partners based on domain - channel partner use case
 * 3. If a pwt.js is deleted or archived, show a message asking publisher to create a new one - useful for compliance use case where we want to delte a particular version of pwt which has compliance issues
 */

var util = require("./util.js");
var CONFIG = require("./config.js");

var identityPartners = {
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

var adapters = {
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

    var filters = {
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

// CHAT GPT CODE


function getGeoInfoNew () {
	var geos = ['GDPR','CCPA','GPP','ROW', 'CA', 'TX', 'NY', 'FL', 'IL'];
	var randomValue = geos[Math.floor(Math.random() * geos.length)];
     console.log(`Random geo: ${randomValue}`);   
	return {'geo': randomValue};
}

var response = getGeoInfoNew();
var currentDomain = window.location.hostname;

function shouldDelete(partner, geo, domain) {
    if (geo) {
        if (geo.allowList && !geo.allowList.includes(response.geo)) {
            console.log('Deleting due to allowList mismatch: ',partner);
            return true;
        }
        if (geo.blockList && geo.blockList.includes(response.geo)) {
            console.log('Deleting due to allowList mismatch: ',partner);
            return true;
        }
    }
    if (domain && domain.blockList && domain.blockList.includes(currentDomain)) {
        console.log('Deleting due to domain blockList match: ',partner);
        return true;
    }
    return false;
}

for (var key in filters.idpartners) {
    var idpartner = filters.idpartners[key];
    if (shouldDelete(idpartner, idpartner.geo, idpartner.domain)) {
        delete identityPartners[key];
    } else {
        console.log(`Allowed: ${key}`);
    }
}

for (var key in filters.adapters) {
    var adapter = filters.adapters[key];
    if (shouldDelete(adapter, adapter.geo, adapter.domain)) {
        delete adapters[key];
    } else {
        console.log(`Allowed: ${key}`);
    }
}

console.log('identityPartners: ',identityPartners);
console.log('adapters: ',adapters);