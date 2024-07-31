/**
 * Use of preloader.js
 * 1. Serve the correct prebid config based on geo detected - consent management use case
 * 2. Apply domain filters to remove identity partners based on domain - channel partner use case
 * 3. If a pwt.js is deleted or archived, show a message asking publisher to create a new one - useful for compliance use case where we want to delte a particular version of pwt which has compliance issues
 */

var util = require("./util.js");
var config = require("./config.js");

var filters = config.getFilters();
var identityPartners = config.getIdentityPartners();
var adapters = config.getAdapters();

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
        if ((geo.allowList && !geo.allowList.includes(response.geo))
            || (geo.blockList && geo.blockList.includes(response.geo))) {
            console.log('Deleting due to allowList mismatch: ', partner);
            return true;
        }
    }
    if (domain) {
        if ((domain.allowList && !domain.allowList.includes(currentDomain))
            || (domain.blockList && domain.blockList.includes(currentDomain))) {
            console.log('Deleting due to domain blockList match: ', partner);
            return true;
        }
        return false;
    }
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

config.setIdentityPartners(identityPartners);
config.setAdapters(adapters);

// CONNECTION TYPE CODE STARTS
if (config.isDynamicTimeoutEnabled()) {
    console.log('Dynamic timeout is Enabled');

    var connectionTimeoutMap = {
        'slow-2g': 1000,
        '2g': 500,
        '3g': 250
    };

    function getConnectionType() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const connectionType = connection.effectiveType;
            return connectionType;
        } else {
            console.log('Network Information API is not supported by this browser.');
            return null;
        }
    }
    var connectionType = getConnectionType();
    if (connectionTimeoutMap.hasOwnProperty(connectionType)) {
        var timeoutToAdd = connectionTimeoutMap[connectionType];
        var timeout = config.getTimeout() + timeoutToAdd;
        console.log(`Timeout increased by ${timeoutToAdd} ms due to connection type: ${connectionType} and new timeout is ${timeout}`);
        config.setTimeout(timeout);
    }
}
// CONNECTION TYPE CODE ENDS