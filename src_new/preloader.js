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


function getGeoInfoNew () {
	var geos = ['GDPR','CCPA','GPP','ROW', 'CA', 'TX', 'NY', 'FL', 'IL'];
	var randomValue = geos[Math.floor(Math.random() * geos.length)];
     console.log("Random geo: " + randomValue);
	return {'geo': randomValue};
}

var response = getGeoInfoNew();
var currentDomain = window.location.hostname;

function shouldDelete(partner, geo, domain, key) {
    if (geo) {
        if ((geo.allowList && !geo.allowList.includes(response.geo))
            || (geo.blockList && geo.blockList.includes(response.geo))) {
            console.log('Deleting due to allowList mismatch: ', key);
            return true;
        }
    }
    if (domain) {
        if ((domain.allowList && !domain.allowList.includes(currentDomain))
            || (domain.blockList && domain.blockList.includes(currentDomain))) {
            console.log('Deleting due to domain blockList match: ', key);
            return true;
        }
        return false;
    }
}

for (var key in filters.idpartners) {
    var idpartner = filters.idpartners[key];
    if (shouldDelete(idpartner, idpartner.geo, idpartner.domain, key)) {
        delete identityPartners[key];
    } else {
        console.log("Allowed: " + key);
    }
}

for (var key in filters.adapters) {
    var adapter = filters.adapters[key];
    if (shouldDelete(adapter, adapter.geo, adapter.domain, key)) {
        delete adapters[key];
    } else {
        console.log("Allowed: " + key);
    }
}

config.setIdentityPartners(identityPartners);


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
        console.log("Timeout increased by " + timeoutToAdd + " ms due to connection type: " + connectionType +
        " and new timeout is " + timeout);
        config.setTimeout(timeout);
    }
}
// CONNECTION TYPE CODE ENDS

// ServerSideEnabled UPDATE CODE STARTS
// bidderSettings = {"pubmatic":{"rc":0,"tc":4,"l":10000}}
if (config.getAutoMoveBidder()) {
    function readFromLocalStorage(key) {
        // Retrieve the data from localStorage using the provided key
        const data = localStorage.getItem(key);

        // Check if data exists for the given key
        if (data !== null) {
            try {
                // Parse the data as JSON (if it's a JSON string)
                const parsedData = JSON.parse(data);
                console.log("Data for key " + key + ":" + parsedData);
                return parsedData;
            } catch (e) {
                // If parsing fails, return the raw string data
                console.log("Data for key " + key + ":," + data);
                return data;
            }
        } else {
            console.log("No data found for key " + key);
            return null;
        }
    }

    // Example usage: Read data from localStorage with the key 'userSettings'
    const bidderSettings = readFromLocalStorage('bidderSettings');

    if (bidderSettings) {
        var thresholds = {
            rc: 10,
            tc: 4,
            l: 10000
        };
        var doNotMoveBidders = config.getDoNotMoveBidders();

        function filterObjectByValue(bidderSettings, thresholds) {
            for (var key in bidderSettings) {                
                if(doNotMoveBidders.includes(key)) {
                    continue;
                }
                if (bidderSettings[key].rc > thresholds.rc
                    && (bidderSettings[key].tc > thresholds.tc || bidderSettings[key].l > thresholds.l)) {
                    if (adapters[key]) {
                        adapters[key].serverSideEnabled = 1;
                    }
                }
            }
        }

        filterObjectByValue(bidderSettings, thresholds);
    }
}
// ServerSideEnabled UPDATE CODE ENDS

// CMP FIND CODE STARTS
var win = window;
function findCMP(apiName) {
    var f = win;
    var cmpFrame;
    var isCmpPresent = false;
    while (f != null) {
        try {
            if (typeof f[apiName] === 'function') {
                cmpFrame = f;
                isCmpPresent = true;
                break;
            }
        } catch (e) {
        }

        // need separate try/catch blocks due to the exception errors thrown when trying to check for a frame that doesn't exist in 3rd party env
        try {
            if (f.frames[apiName+ "Locator"]) {
                cmpFrame = f;
                isCmpPresent = true;
                break;
            }
        } catch (e) {
        }

        if (f === win.top) break;
        f = f.parent;
    }
    return isCmpPresent;
};

var cmpAPIs = {
    '__tcfapi': false,
    '__uspapi': false,
    '__gpp': false
};
for (var key in cmpAPIs) {
    cmpAPIs[key] = findCMP(key);
    switch (key) {
        case "__tcfapi":
            config.setPwtConfig('gdpr', cmpAPIs[key] ? 1 : 0);
            break;
        case "__uspapi":    
            config.setPwtConfig('ccpa', cmpAPIs[key] ? 1 : 0);
            break;
        case "__gpp":  
            config.setPwtConfig('gpp', cmpAPIs[key] ? 1 : 0);
            break;
        default:
            break;
    }
}
// CMP FIND CODE ENDS

config.setAdapters(adapters);