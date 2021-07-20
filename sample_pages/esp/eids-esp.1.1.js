var esp = (function() {
    var esp = {};
    esp.is = {};
    esp.is.VERSION = '0.8.0';

    // define interfaces
    esp.is.not = {};
    esp.is.all = {};
    esp.is.any = {};
    // is a given value window?
    // setInterval method is only available for window object
    esp.is.windowObject = function(value) {
        return value != null && typeof value === 'object' && 'setInterval' in value;
    };
       // cache some methods to call later on
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // helper function which reverses the sense of predicate result
    function not(func) {
        return function() {
            return !func.apply(null, slice.call(arguments));
        };
    }

    // helper function which call predicate function per parameter and return true if all pass
    function all(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (!func.call(null, params[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // helper function which call predicate function per parameter and return true if any pass
    function any(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (func.call(null, params[i])) {
                    return true;
                }
            }
            return false;
        };
    }

    // build a 'comparator' object for various comparison checks
    var comparator = {
        '<': function(a, b) { return a < b; },
        '<=': function(a, b) { return a <= b; },
        '>': function(a, b) { return a > b; },
        '>=': function(a, b) { return a >= b; }
    };

    // helper function which compares a version to a range
    function compareVersion(version, range) {
        var string = (range + '');
        var n = +(string.match(/\d+/) || NaN);
        var op = string.match(/^[<>]=?|/)[0];
        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
    }

    // helper function which extracts params from arguments
    function getParams(args) {
        var params = slice.call(args);
        var length = params.length;
        if (length === 1 && is.array(params[0])) {    // support array
            params = params[0];
        }
        return params;
    }
    
    // is a given value function?
    esp.is['function'] = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Function]' || typeof value === 'function';
    };
    // Environment checks
    /* -------------------------------------------------------------------------- */

    var freeGlobal = esp.is.windowObject(typeof global == 'object' && global) && global;
    var freeSelf = esp.is.windowObject(typeof self == 'object' && self) && self;
    var thisGlobal = esp.is.windowObject(typeof this == 'object' && this) && this;
    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

    var document = freeSelf && freeSelf.document;
    var previousIs = root.is;

    // store navigator properties to use later
    var navigator = freeSelf && freeSelf.navigator;
    var platform = (navigator && navigator.platform || '').toLowerCase();
    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
    var vendor = (navigator && navigator.vendor || '').toLowerCase();

    // is current device android?
    esp.is.android = function() {
        return /android/.test(userAgent);
    };
    // android method does not support 'all' and 'any' interfaces
    esp.is.android.api = ['not'];

    // is current device android phone?
    esp.is.androidPhone = function() {
        return /android/.test(userAgent) && /mobile/.test(userAgent);
    };
    // androidPhone method does not support 'all' and 'any' interfaces
    esp.is.androidPhone.api = ['not'];

    // is current device android tablet?
    esp.is.androidTablet = function() {
        return /android/.test(userAgent) && !/mobile/.test(userAgent);
    };
    // androidTablet method does not support 'all' and 'any' interfaces
    esp.is.androidTablet.api = ['not'];

    // is current device blackberry?
    esp.is.blackberry = function() {
        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
    };
    // blackberry method does not support 'all' and 'any' interfaces
    esp.is.blackberry.api = ['not'];

    // is current browser chrome?
    // parameter is optional
    esp.is.chrome = function(range) {
        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
        return match !== null && esp.is.not.opera() && compareVersion(match[1], range);
    };
    // chrome method does not support 'all' and 'any' interfaces
    esp.is.chrome.api = ['not'];

    // is current device desktop?
    esp.is.desktop = function() {
        return esp.is.not.mobile() && esp.is.not.tablet();
    };
    // desktop method does not support 'all' and 'any' interfaces
    esp.is.desktop.api = ['not'];

    // is current browser edge?
    // parameter is optional
    esp.is.edge = function(range) {
        var match = userAgent.match(/edge\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // edge method does not support 'all' and 'any' interfaces
    esp.is.edge.api = ['not'];

    // is current browser firefox?
    // parameter is optional
    esp.is.firefox = function(range) {
        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // firefox method does not support 'all' and 'any' interfaces
    esp.is.firefox.api = ['not'];

    // is current browser internet explorer?
    // parameter is optional
    esp.is.ie = function(range) {
        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ie method does not support 'all' and 'any' interfaces
    esp.is.ie.api = ['not'];

    // is current device ios?
    esp.is.ios = function() {
        return esp.is.iphone() || esp.is.ipad() || esp.is.ipod();
    };
    // ios method does not support 'all' and 'any' interfaces
    esp.is.ios.api = ['not'];

    // is current device ipad?
    // parameter is optional
    esp.is.ipad = function(range) {
        var match = userAgent.match(/ipad.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipad method does not support 'all' and 'any' interfaces
    esp.is.ipad.api = ['not'];

    // is current device iphone?
    // parameter is optional
    esp.is.iphone = function(range) {
        // avoid false positive for Facebook in-app browser on ipad;
        // original iphone doesn't have the OS portion of the UA
        var match = esp.is.ipad() ? null : userAgent.match(/iphone(?:.+?os (\d+))?/);
        return match !== null && compareVersion(match[1] || 1, range);
    };
    // iphone method does not support 'all' and 'any' interfaces
    esp.is.iphone.api = ['not'];

    // is current device ipod?
    // parameter is optional
    esp.is.ipod = function(range) {
        var match = userAgent.match(/ipod.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipod method does not support 'all' and 'any' interfaces
    esp.is.ipod.api = ['not'];

    // is current operating system linux?
    esp.is.linux = function() {
        return /linux/.test(platform) && esp.is.not.android();
    };
    // linux method does not support 'all' and 'any' interfaces
    esp.is.linux.api = ['not'];

    // is current operating system mac?
    esp.is.mac = function() {
        return /mac/.test(platform);
    };
    // mac method does not support 'all' and 'any' interfaces
    esp.is.mac.api = ['not'];

    // is current device mobile?
    esp.is.mobile = function() {
        return esp.is.iphone() || esp.is.ipod() || esp.is.androidPhone() || esp.is.blackberry() || esp.is.windowsPhone();
    };
    // mobile method does not support 'all' and 'any' interfaces
    esp.is.mobile.api = ['not'];

    // is current state offline?
    esp.is.offline = not(esp.is.online);
    // offline method does not support 'all' and 'any' interfaces
    esp.is.offline.api = ['not'];

    // is current state online?
    esp.is.online = function() {
        return !navigator || navigator.onLine === true;
    };
    // online method does not support 'all' and 'any' interfaces
    esp.is.online.api = ['not'];

    // is current browser opera?
    // parameter is optional
    esp.is.opera = function(range) {
        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // opera method does not support 'all' and 'any' interfaces
    esp.is.opera.api = ['not'];

    // is current browser opera mini?
    // parameter is optional
    esp.is.operaMini = function(range) {
        var match = userAgent.match(/opera mini\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // operaMini method does not support 'all' and 'any' interfaces
    esp.is.operaMini.api = ['not'];

    // is current browser phantomjs?
    // parameter is optional
    esp.is.phantom = function(range) {
        var match = userAgent.match(/phantomjs\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // phantom method does not support 'all' and 'any' interfaces
    esp.is.phantom.api = ['not'];

    // is current browser safari?
    // parameter is optional
    esp.is.safari = function(range) {
        var match = userAgent.match(/version\/(\d+).+?safari/);
        return match !== null && compareVersion(match[1], range);
    };
    // safari method does not support 'all' and 'any' interfaces
    esp.is.safari.api = ['not'];

    // is current device tablet?
    esp.is.tablet = function() {
        return esp.is.ipad() || esp.is.androidTablet() || esp.is.windowsTablet();
    };
    // tablet method does not support 'all' and 'any' interfaces
    esp.is.tablet.api = ['not'];

    // is current device supports touch?
    esp.is.touchDevice = function() {
        return !!document && ('ontouchstart' in freeSelf ||
            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
    };
    // touchDevice method does not support 'all' and 'any' interfaces
    esp.is.touchDevice.api = ['not'];

    // is current operating system windows?
    esp.is.windows = function() {
        return /win/.test(platform);
    };
    // windows method does not support 'all' and 'any' interfaces
    esp.is.windows.api = ['not'];

    // is current device windows phone?
    esp.is.windowsPhone = function() {
        return esp.is.windows() && /phone/.test(userAgent);
    };
    // windowsPhone method does not support 'all' and 'any' interfaces
    esp.is.windowsPhone.api = ['not'];

    // is current device windows tablet?
    esp.is.windowsTablet = function() {
        return esp.is.windows() && esp.is.not.windowsPhone() && /touch/.test(userAgent);
    };
    // windowsTablet method does not support 'all' and 'any' interfaces
    esp.is.windowsTablet.api = ['not'];
    
    function setInterfaces() {
        var options = esp.is;
        for (var option in options) {
            if (hasOwnProperty.call(options, option) && esp.is['function'](options[option])) {
                var interfaces = options[option].api || ['not', 'all', 'any'];
                for (var i = 0; i < interfaces.length; i++) {
                    if (interfaces[i] === 'not') {
                        esp.is.not[option] = not(esp.is[option]);
                    }
                    if (interfaces[i] === 'all') {
                        esp.is.all[option] = all(esp.is[option]);
                    }
                    if (interfaces[i] === 'any') {
                        esp.is.any[option] = any(esp.is[option]);
                    }
                }
            }
        }
    }
    setInterfaces();
    
    
    esp.fetchAsyncSignals = function(mode, source, enc, customFunction, customKey) {
        console.log("Going to fetch signals for mode: " + mode + " & source: " + source);
        var eids = "";
        switch (mode) {
            case 1:
                if (typeof pbjs !== "undefined" && typeof pbjs.getUserIdsAsEids === "function") {
                    eids = pbjs.getUserIdsAsEids(); // Get Identities from Prebid API in oRTB eids structure.
                }
                break;
            case 2:
                if (typeof owpbjs !== "undefined" && typeof owpbjs.getUserIdsAsEids === "function") {
                    eids = owpbjs.getUserIdsAsEids(); //Get Identities from Identity Hub  API in oRTB eids structure.
                }
                break;
            case 3:
                if (typeof customFunction === "function") {
                    eids = customFunction(source); //Get Identities from Custom function provided in oRTB eids structure.
                }
                break;
            case 4:
                if (typeof customFunction === "function") {
                    eids = customFunction(source); //Get Identities from Custom function provided in any format.
                }
                break;

            default:
                eids = JSON.parse('{"source":"pubmatic","uids":[{"id":"hello-eids","atype":1}]}'); // Demo data

        }

        var eidsSignals = {};
        if (mode == 4) {
            eidsSignals[source] = "1||" + encryptSignals(eids);
        } else {
            eids.forEach(function(eid) {
                if (true === enc) {
                    eidsSignals[eid.source] = "1||" + encryptSignals(eid); // If encryption is enabled append version (1|| and encrypt entire object
                } else {
                    eidsSignals[eid.source] = eid.uids[0].id;
                }

            });
        }
        var promise = Promise.resolve(eidsSignals[source]);
        console.log("fetching Signal: " + eidsSignals[source]);
        return promise;
    }

    var encryptSignals = function(signals) {
        return btoa(JSON.stringify(signals)); // Test encryption. To be replaced with better algo
    }

    esp.registerSignalSources = function(gtag, signalSources, mode, enc, customFunction, customKey) {

        gtag.encryptedSignalProviders = gtag.encryptedSignalProviders || [];
        signalSources.forEach(function(source) {
            console.log("Registering signal provider: " + source);
            var updatedSrc = source;
            if (true === enc) {
                updatedSrc = source + "/enc"; // Update source value and append /enc to indicate encrypted signal. 

            }
            if (4 === mode) {
                updatedSrc = source + "/" + customKey + "/enc"
            }

            gtag.encryptedSignalProviders.push({
                id: updatedSrc,
                collectorFunction: function() {
                    return esp.fetchAsyncSignals(mode, source, enc, customFunction, customKey);
                }
            });
        });
    }
    return esp;
}());
