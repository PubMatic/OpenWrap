/**
 * Use of preloader.js
 * 1. Serve the correct prebid config based on geo detected - consent management use case
 * 2. Apply domain filters to remove identity partners based on domain - channel partner use case
 * 3. If a pwt.js is deleted or archived, show a message asking publisher to create a new one - useful for compliance use case where we want to delte a particular version of pwt which has compliance issues
 */

var util = require("./util.js");
var CONFIG = require("./config.js");

function applyDomainFilterIfApplicable(filters) {
    var domainFilters, domain, rules, configIdPartners, i;
    if (filters.domainFilter) {
        console.log("### applying domain filters");
        domainFilters = filters.domainFilter;
        domain = util.getFullDomainFromURL();

        if (domainFilters.hasOwnProperty('idpartners')) {
            console.log("### applying idpartner filters");
            rules = domainFilters['idpartners'];

            if (rules.hasOwnProperty(domain)) {
                console.log("Removing rules - ", rules[domain]);
                removeIdPartners.push(rules[domain]);
            }
        }
    }
    if (removeIdPartners.length > 0) {
        configIdPartners = CONFIG.getIdentityPartners();
        for (i = 0; i < removeIdPartners.length; i++) {
            delete configIdPartners[removeIdPartners[i]];
        }
        CONFIG.setIdentityPartners(configIdPartners);
    }
}

exports.filters = filters;

function insertPrebidScript(data) {
    var prebidScript, cc, geoKey, controller;
    prebidScript = document.createElement('script');
    cc = JSON.parse(data) && data.cc || 'ROW';
    geoKey = filters.geoFilter[cc] || filters.geoFilter.ROW;

    prebidScript.src = './prebid' + geoKey + '.js';
    prebidScript.type = 'text/javascript';

    currentScript.parentNode.insertBefore(prebidScript, currentScript.nextSibling);

    console.log("prebid loaded, initialising IH/OW now");
    setTimeout(function() {
        controller = require("./controllers/idhub.js");
        controller.init(window);
    }, 0);
}



