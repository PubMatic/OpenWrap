/* prebid.js v3.25.0Updated : 2020-11-03 */
!function(u) {
    var s = window.owpbjsChunk;
    window.owpbjsChunk = function(e, t, n) {
        for (var r, o, i, a = 0, c = []; a < e.length; a++)
            o = e[a],
            d[o] && c.push(d[o][0]),
            d[o] = 0;
        for (r in t)
            Object.prototype.hasOwnProperty.call(t, r) && (u[r] = t[r]);
        for (s && s(e, t, n); c.length; )
            c.shift()();
        if (n)
            for (a = 0; a < n.length; a++)
                i = f(f.s = n[a]);
        return i
    }
    ;
    var n = {}
      , d = {
        317: 0
    };
    function f(e) {
        if (n[e])
            return n[e].exports;
        var t = n[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return u[e].call(t.exports, t, t.exports, f),
        t.l = !0,
        t.exports
    }
    f.m = u,
    f.c = n,
    f.d = function(e, t, n) {
        f.o(e, t) || Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: n
        })
    }
    ,
    f.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return f.d(t, "a", t),
        t
    }
    ,
    f.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    f.p = "",
    f.oe = function(e) {
        throw console.error(e),
        e
    }
    ,
    f(f.s = 839)
}([function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    n.d(t, "internal", function() {
        return k
    }),
    n.d(t, "bind", function() {
        return N
    }),
    t.getUniqueIdentifierStr = q,
    t.generateUUID = function e(t) {
        return t ? (t ^ G() >> t / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, e)
    }
    ,
    t.getBidIdParameter = function(e, t) {
        if (t && t[e])
            return t[e];
        return ""
    }
    ,
    t.tryAppendQueryString = function(e, t, n) {
        if (n)
            return e + t + "=" + encodeURIComponent(n) + "&";
        return e
    }
    ,
    t.parseQueryStringParameters = function(e) {
        var t = "";
        for (var n in e)
            e.hasOwnProperty(n) && (t += n + "=" + encodeURIComponent(e[n]) + "&");
        return t = t.replace(/&$/, "")
    }
    ,
    t.transformAdServerTargetingObj = function(t) {
        return t && 0 < Object.getOwnPropertyNames(t).length ? ge(t).map(function(e) {
            return "".concat(e, "=").concat(encodeURIComponent(ye(t, e)))
        }).join("&") : ""
    }
    ,
    t.getAdUnitSizes = function(e) {
        if (!e)
            return;
        var t = [];
        {
            var n;
            e.mediaTypes && e.mediaTypes.banner && Array.isArray(e.mediaTypes.banner.sizes) ? (n = e.mediaTypes.banner.sizes,
            Array.isArray(n[0]) ? t = n : t.push(n)) : Array.isArray(e.sizes) && (Array.isArray(e.sizes[0]) ? t = e.sizes : t.push(e.sizes))
        }
        return t
    }
    ,
    t.parseSizesInput = function(e) {
        var t = [];
        if ("string" == typeof e) {
            var n = e.split(",")
              , r = /^(\d)+x(\d)+$/i;
            if (n)
                for (var o in n)
                    ae(n, o) && n[o].match(r) && t.push(n[o])
        } else if ("object" === S(e)) {
            var i = e.length;
            if (0 < i)
                if (2 === i && "number" == typeof e[0] && "number" == typeof e[1])
                    t.push(F(e));
                else
                    for (var a = 0; a < i; a++)
                        t.push(F(e[a]))
        }
        return t
    }
    ,
    t.parseGPTSingleSizeArray = F,
    t.parseGPTSingleSizeArrayToRtbSize = function(e) {
        if (W(e))
            return {
                w: e[0],
                h: e[1]
            }
    }
    ,
    t.getWindowTop = L,
    t.getWindowSelf = z,
    t.getWindowLocation = V,
    t.logMessage = H,
    t.logInfo = J,
    t.logWarn = K,
    t.logError = $,
    t.hasConsoleLogger = function() {
        return _
    }
    ,
    t.debugTurnedOn = Q,
    t.createInvisibleIframe = function() {
        var e = document.createElement("iframe");
        return e.id = q(),
        e.height = 0,
        e.width = 0,
        e.border = "0px",
        e.hspace = "0",
        e.vspace = "0",
        e.marginWidth = "0",
        e.marginHeight = "0",
        e.style.border = "0",
        e.scrolling = "no",
        e.frameBorder = "0",
        e.src = "about:blank",
        e.style.display = "none",
        e
    }
    ,
    t.getParameterByName = function(e) {
        return Ie(V().search)[e] || ""
    }
    ,
    t.isA = X,
    t.isFn = Z,
    t.isStr = ee,
    t.isArray = te,
    t.isNumber = ne,
    t.isPlainObject = re,
    t.isBoolean = function(e) {
        return X(e, C)
    }
    ,
    t.isEmpty = oe,
    t.isEmptyStr = function(e) {
        return ee(e) && (!e || 0 === e.length)
    }
    ,
    t._each = ie,
    t.contains = function(e, t) {
        if (oe(e))
            return !1;
        if (Z(e.indexOf))
            return -1 !== e.indexOf(t);
        var n = e.length;
        for (; n--; )
            if (e[n] === t)
                return !0;
        return !1
    }
    ,
    t._map = function(n, r) {
        if (oe(n))
            return [];
        if (Z(n.map))
            return n.map(r);
        var o = [];
        return ie(n, function(e, t) {
            o.push(r(e, t, n))
        }),
        o
    }
    ,
    t.hasOwn = ae,
    t.insertElement = ce,
    t.triggerPixel = ue,
    t.callBurl = function(e) {
        var t = e.source
          , n = e.burl;
        t === E.S2S.SRC && n && k.triggerPixel(n)
    }
    ,
    t.insertHtmlIntoIframe = function(e) {
        if (!e)
            return;
        var t = document.createElement("iframe");
        t.id = q(),
        t.width = 0,
        t.height = 0,
        t.hspace = "0",
        t.vspace = "0",
        t.marginWidth = "0",
        t.marginHeight = "0",
        t.style.display = "none",
        t.style.height = "0px",
        t.style.width = "0px",
        t.scrolling = "no",
        t.frameBorder = "0",
        t.allowtransparency = "true",
        k.insertElement(t, document, "body"),
        t.contentWindow.document.open(),
        t.contentWindow.document.write(e),
        t.contentWindow.document.close()
    }
    ,
    t.insertUserSyncIframe = se,
    t.createTrackPixelHtml = function(e) {
        if (!e)
            return "";
        var t = encodeURI(e)
          , n = '<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';
        return n += '<img src="' + t + '"></div>'
    }
    ,
    t.createTrackPixelIframeHtml = de,
    t.getValueString = fe,
    t.uniques = le,
    t.flatten = pe,
    t.getBidRequest = function(n, e) {
        return n ? (e.some(function(e) {
            var t = s()(e.bids, function(t) {
                return ["bidId", "adId", "bid_id"].some(function(e) {
                    return t[e] === n
                })
            });
            return t && (r = t),
            t
        }),
        r) : void 0;
        var r
    }
    ,
    t.getKeys = ge,
    t.getValue = ye,
    t.getKeyByValue = function(e, t) {
        for (var n in e)
            if (e.hasOwnProperty(n) && e[n] === t)
                return n
    }
    ,
    t.getBidderCodes = function() {
        return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : owpbjs.adUnits).map(function(e) {
            return e.bids.map(function(e) {
                return e.bidder
            }).reduce(pe, [])
        }).reduce(pe).filter(le)
    }
    ,
    t.isGptPubadsDefined = be,
    n.d(t, "getHighestCpm", function() {
        return ve
    }),
    n.d(t, "getOldestHighestCpmBid", function() {
        return he
    }),
    n.d(t, "getLatestHighestCpmBid", function() {
        return me
    }),
    t.shuffle = function(e) {
        var t = e.length;
        for (; 0 < t; ) {
            var n = Math.floor(Math.random() * t)
              , r = e[--t];
            e[t] = e[n],
            e[n] = r
        }
        return e
    }
    ,
    t.adUnitsFilter = function(e, t) {
        return f()(e, t && t.adUnitCode)
    }
    ,
    t.deepClone = Ae,
    t.inIframe = function() {
        try {
            return k.getWindowSelf() !== k.getWindowTop()
        } catch (e) {
            return !0
        }
    }
    ,
    t.isSafariBrowser = function() {
        return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)
    }
    ,
    t.replaceAuctionPrice = function(e, t) {
        if (!e)
            return;
        return e.replace(/\$\{AUCTION_PRICE\}/g, t)
    }
    ,
    t.timestamp = function() {
        return (new Date).getTime()
    }
    ,
    t.hasDeviceAccess = function() {
        return !1 !== r.b.getConfig("deviceAccess")
    }
    ,
    t.checkCookieSupport = Ee,
    t.delayExecution = function(e, t) {
        if (t < 1)
            throw new Error("numRequiredCalls must be a positive number. Got ".concat(t));
        var n = 0;
        return function() {
            ++n === t && e.apply(this, arguments)
        }
    }
    ,
    t.groupBy = function(e, n) {
        return e.reduce(function(e, t) {
            return (e[t[n]] = e[t[n]] || []).push(t),
            e
        }, {})
    }
    ,
    t.getDefinedParams = function(n, e) {
        return e.filter(function(e) {
            return n[e]
        }).reduce(function(e, t) {
            return m(e, h({}, t, n[t]))
        }, {})
    }
    ,
    t.isValidMediaTypes = function(e) {
        var t = ["banner", "native", "video"];
        if (!Object.keys(e).every(function(e) {
            return f()(t, e)
        }))
            return !1;
        if (e.video && e.video.context)
            return f()(["instream", "outstream", "adpod"], e.video.context);
        return !0
    }
    ,
    t.getBidderRequest = function(e, t, n) {
        return s()(e, function(e) {
            return 0 < e.bids.filter(function(e) {
                return e.bidder === t && e.adUnitCode === n
            }).length
        }) || {
            start: null,
            auctionId: null
        }
    }
    ,
    t.getUserConfiguredParams = function(e, t, n) {
        return e.filter(function(e) {
            return e.code === t
        }).map(function(e) {
            return e.bids
        }).reduce(pe, []).filter(function(e) {
            return e.bidder === n
        }).map(function(e) {
            return e.params || {}
        })
    }
    ,
    t.getOrigin = function() {
        return window.location.origin ? window.location.origin : window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "")
    }
    ,
    t.getDNT = function() {
        return "1" === navigator.doNotTrack || "1" === window.doNotTrack || "1" === navigator.msDoNotTrack || "yes" === navigator.doNotTrack
    }
    ,
    t.isAdUnitCodeMatchingSlot = function(t) {
        return function(e) {
            return Oe(t, e)
        }
    }
    ,
    t.isSlotMatchingAdUnitCode = we,
    t.getGptSlotInfoForAdUnitCode = function(e) {
        var t;
        be() && (t = s()(window.googletag.pubads().getSlots(), we(e)));
        if (t)
            return {
                gptSlot: t.getAdUnitPath(),
                divId: t.getSlotElementId()
            };
        return {}
    }
    ,
    t.unsupportedBidderMessage = function(e, t) {
        var n = Object.keys(e.mediaTypes || {
            banner: "banner"
        }).join(", ");
        return "\n    ".concat(e.code, " is a ").concat(n, " ad unit\n    containing bidders that don't support ").concat(n, ": ").concat(t, ".\n    This bidder won't fetch demand.\n  ")
    }
    ,
    t.isInteger = Te,
    t.convertCamelToUnderscore = function(e) {
        return e.replace(/(?:^|\.?)([A-Z])/g, function(e, t) {
            return "_" + t.toLowerCase()
        }).replace(/^_/, "")
    }
    ,
    t.cleanObj = function(n) {
        return Object.keys(n).reduce(function(e, t) {
            return void 0 !== n[t] && (e[t] = n[t]),
            e
        }, {})
    }
    ,
    t.pick = function(a, c) {
        return "object" === S(a) ? c.reduce(function(e, t, n) {
            if ("function" == typeof t)
                return e;
            var r = t
              , o = t.match(/^(.+?)\sas\s(.+?)$/i);
            o && (t = o[1],
            r = o[2]);
            var i = a[t];
            return "function" == typeof c[n + 1] && (i = c[n + 1](i, e)),
            void 0 !== i && (e[r] = i),
            e
        }, {}) : {}
    }
    ,
    t.transformBidderParamKeywords = function(e) {
        var r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "keywords"
          , o = [];
        return ie(e, function(e, t) {
            if (te(e)) {
                var n = [];
                ie(e, function(e) {
                    !(e = fe(r + "." + t, e)) && "" !== e || n.push(e)
                }),
                e = n
            } else {
                if (!ee(e = fe(r + "." + t, e)))
                    return;
                e = [e]
            }
            o.push({
                key: t,
                value: e
            })
        }),
        o
    }
    ,
    t.convertTypes = function(r, o) {
        return Object.keys(r).forEach(function(e) {
            var t, n;
            o[e] && (Z(r[e]) ? o[e] = r[e](o[e]) : o[e] = (t = r[e],
            n = o[e],
            "string" === t ? n && n.toString() : "number" === t ? Number(n) : n),
            isNaN(o[e]) && delete o.key)
        }),
        o
    }
    ,
    t.isArrayOfNums = function(e, t) {
        return te(e) && (!t || e.length === t) && e.every(Te)
    }
    ,
    t.fill = function(e, t) {
        for (var n = [], r = 0; r < t; r++) {
            var o = re(e) ? Ae(e) : e;
            n.push(o)
        }
        return n
    }
    ,
    t.chunk = function(e, t) {
        for (var n = [], r = 0; r < Math.ceil(e.length / t); r++) {
            var o = r * t
              , i = o + t;
            n.push(e.slice(o, i))
        }
        return n
    }
    ,
    t.getMinValueFromArray = function(e) {
        return Math.min.apply(Math, y(e))
    }
    ,
    t.getMaxValueFromArray = function(e) {
        return Math.max.apply(Math, y(e))
    }
    ,
    t.compareOn = function(n) {
        return function(e, t) {
            return e[n] < t[n] ? 1 : e[n] > t[n] ? -1 : 0
        }
    }
    ,
    t.parseQS = Ie,
    t.formatQS = je,
    t.parseUrl = function(e, t) {
        var n = document.createElement("a");
        t && "noDecodeWholeURL"in t && t.noDecodeWholeURL ? n.href = e : n.href = decodeURIComponent(e);
        var r = t && "decodeSearchAsString"in t && t.decodeSearchAsString;
        return {
            href: n.href,
            protocol: (n.protocol || "").replace(/:$/, ""),
            hostname: n.hostname,
            port: +n.port,
            pathname: n.pathname.replace(/^(?!\/)/, "/"),
            search: r ? n.search : k.parseQS(n.search || ""),
            hash: (n.hash || "").replace(/^#/, ""),
            host: n.host || window.location.host
        }
    }
    ,
    t.buildUrl = function(e) {
        return (e.protocol || "http") + "://" + (e.host || e.hostname + (e.port ? ":".concat(e.port) : "")) + (e.pathname || "") + (e.search ? "?".concat(k.formatQS(e.search || "")) : "") + (e.hash ? "#".concat(e.hash) : "")
    }
    ,
    t.deepEqual = Ce,
    t.mergeDeep = xe;
    var r = n(3)
      , o = n(167)
      , i = n.n(o)
      , a = n(168)
      , c = n.n(a)
      , u = n(11)
      , s = n.n(u)
      , d = n(12)
      , f = n.n(d)
      , l = n(182);
    n.d(t, "deepAccess", function() {
        return l.a
    });
    var p = n(183);
    function g(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
                return;
            var n = []
              , r = !0
              , o = !1
              , i = void 0;
            try {
                for (var a, c = e[Symbol.iterator](); !(r = (a = c.next()).done) && (n.push(a.value),
                !t || n.length !== t); r = !0)
                    ;
            } catch (e) {
                o = !0,
                i = e
            } finally {
                try {
                    r || null == c.return || c.return()
                } finally {
                    if (o)
                        throw i
                }
            }
            return n
        }(e, t) || b(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function y(e) {
        return function(e) {
            if (Array.isArray(e))
                return v(e)
        }(e) || function(e) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                return Array.from(e)
        }(e) || b(e) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function b(e, t) {
        if (e) {
            if ("string" == typeof e)
                return v(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name),
            "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? v(e, t) : void 0
        }
    }
    function v(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    function h(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n,
        e
    }
    function m() {
        return (m = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    function S(e) {
        return (S = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    n.d(t, "deepSetValue", function() {
        return p.a
    });
    var A, E = n(5), O = "Array", w = "String", T = "Function", I = "Number", j = "Object", C = "Boolean", x = Object.prototype.toString, U = Boolean(window.console), _ = Boolean(U && window.console.log), B = Boolean(U && window.console.info), P = Boolean(U && window.console.warn), R = Boolean(U && window.console.error), k = {
        checkCookieSupport: Ee,
        createTrackPixelIframeHtml: de,
        getWindowSelf: z,
        getWindowTop: L,
        getWindowLocation: V,
        insertUserSyncIframe: se,
        insertElement: ce,
        isFn: Z,
        triggerPixel: ue,
        logError: $,
        logWarn: K,
        logMessage: H,
        logInfo: J,
        parseQS: Ie,
        formatQS: je,
        deepEqual: Ce
    }, D = {}, N = function(e, t) {
        return t
    }
    .bind(null, 1, D)() === D ? Function.prototype.bind : function(e) {
        var t = this
          , n = Array.prototype.slice.call(arguments, 1);
        return function() {
            return t.apply(e, n.concat(Array.prototype.slice.call(arguments)))
        }
    }
    , M = (A = 0,
    function() {
        return ++A
    }
    );
    function q() {
        return M() + Math.random().toString(16).substr(2)
    }
    function G() {
        return window && window.crypto && window.crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(1))[0] % 16 : 16 * Math.random()
    }
    function F(e) {
        if (W(e))
            return e[0] + "x" + e[1]
    }
    function W(e) {
        return te(e) && 2 === e.length && !isNaN(e[0]) && !isNaN(e[1])
    }
    function L() {
        return window.top
    }
    function z() {
        return window.self
    }
    function V() {
        return window.location
    }
    function H() {
        Q() && _ && console.log.apply(console, Y(arguments, "MESSAGE:"))
    }
    function J() {
        Q() && B && console.info.apply(console, Y(arguments, "INFO:"))
    }
    function K() {
        Q() && P && console.warn.apply(console, Y(arguments, "WARNING:"))
    }
    function $() {
        Q() && R && console.error.apply(console, Y(arguments, "ERROR:"))
    }
    function Y(e, t) {
        return e = [].slice.call(e),
        t && e.unshift(t),
        e.unshift("display: inline-block; color: #fff; background: #3b88c3; padding: 1px 4px; border-radius: 3px;"),
        e.unshift("%cPrebid"),
        e
    }
    function Q() {
        return !!r.b.getConfig("debug")
    }
    function X(e, t) {
        return x.call(e) === "[object " + t + "]"
    }
    function Z(e) {
        return X(e, T)
    }
    function ee(e) {
        return X(e, w)
    }
    function te(e) {
        return X(e, O)
    }
    function ne(e) {
        return X(e, I)
    }
    function re(e) {
        return X(e, j)
    }
    function oe(e) {
        if (!e)
            return !0;
        if (te(e) || ee(e))
            return !(0 < e.length);
        for (var t in e)
            if (hasOwnProperty.call(e, t))
                return !1;
        return !0
    }
    function ie(e, t) {
        if (!oe(e)) {
            if (Z(e.forEach))
                return e.forEach(t, this);
            var n = 0
              , r = e.length;
            if (0 < r)
                for (; n < r; n++)
                    t(e[n], n, e);
            else
                for (n in e)
                    hasOwnProperty.call(e, n) && t.call(this, e[n], n)
        }
    }
    function ae(e, t) {
        return e.hasOwnProperty ? e.hasOwnProperty(t) : void 0 !== e[t] && e.constructor.prototype[t] !== e[t]
    }
    function ce(e, t, n, r) {
        var o;
        t = t || document,
        o = n ? t.getElementsByTagName(n) : t.getElementsByTagName("head");
        try {
            if ((o = o.length ? o : t.getElementsByTagName("body")).length) {
                o = o[0];
                var i = r ? null : o.firstChild;
                return o.insertBefore(e, i)
            }
        } catch (e) {}
    }
    function ue(e, t) {
        var n = new Image;
        t && k.isFn(t) && (n.addEventListener("load", t),
        n.addEventListener("error", t)),
        n.src = e
    }
    function se(e, t) {
        var n = k.createTrackPixelIframeHtml(e, !1, "allow-scripts allow-same-origin")
          , r = document.createElement("div");
        r.innerHTML = n;
        var o = r.firstChild;
        t && k.isFn(t) && (o.addEventListener("load", t),
        o.addEventListener("error", t)),
        k.insertElement(o, document, "html", !0)
    }
    function de(e) {
        var t = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "";
        return e ? ((!(1 < arguments.length && void 0 !== arguments[1]) || arguments[1]) && (e = encodeURI(e)),
        t = t && 'sandbox="'.concat(t, '"'),
        "<iframe ".concat(t, ' id="').concat(q(), '"\n      frameborder="0"\n      allowtransparency="true"\n      marginheight="0" marginwidth="0"\n      width="0" hspace="0" vspace="0" height="0"\n      style="height:0px;width:0px;display:none;"\n      scrolling="no"\n      src="').concat(e, '">\n    </iframe>')) : ""
    }
    function fe(e, t, n) {
        return null == t ? n : ee(t) ? t : ne(t) ? t.toString() : void k.logWarn("Unsuported type for param: " + e + " required type: String")
    }
    function le(e, t, n) {
        return n.indexOf(e) === t
    }
    function pe(e, t) {
        return e.concat(t)
    }
    function ge(e) {
        return Object.keys(e)
    }
    function ye(e, t) {
        return e[t]
    }
    function be() {
        if (window.googletag && Z(window.googletag.pubads) && Z(window.googletag.pubads().getSlots))
            return !0
    }
    var ve = Se("timeToRespond", function(e, t) {
        return t < e
    })
      , he = Se("responseTimestamp", function(e, t) {
        return t < e
    })
      , me = Se("responseTimestamp", function(e, t) {
        return e < t
    });
    function Se(n, r) {
        return function(e, t) {
            return e.cpm === t.cpm ? r(e[n], t[n]) ? t : e : e.cpm < t.cpm ? t : e
        }
    }
    function Ae(e) {
        return i()(e)
    }
    function Ee() {
        if (window.navigator.cookieEnabled || document.cookie.length)
            return !0
    }
    var Oe = function(e, t) {
        return e.getAdUnitPath() === t || e.getSlotElementId() === t
    };
    function we(t) {
        return function(e) {
            return Oe(e, t)
        }
    }
    function Te(e) {
        return Number.isInteger ? Number.isInteger(e) : "number" == typeof e && isFinite(e) && Math.floor(e) === e
    }
    function Ie(e) {
        return e ? e.replace(/^\?/, "").split("&").reduce(function(e, t) {
            var n = g(t.split("="), 2)
              , r = n[0]
              , o = n[1];
            return /\[\]$/.test(r) ? (e[r = r.replace("[]", "")] = e[r] || [],
            e[r].push(o)) : e[r] = o || "",
            e
        }, {}) : {}
    }
    function je(e) {
        return Object.keys(e).map(function(t) {
            return Array.isArray(e[t]) ? e[t].map(function(e) {
                return "".concat(t, "[]=").concat(e)
            }).join("&") : "".concat(t, "=").concat(e[t])
        }).join("&")
    }
    function Ce(e, t) {
        return c()(e, t)
    }
    function xe(e) {
        for (var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++)
            n[r - 1] = arguments[r];
        if (!n.length)
            return e;
        var o = n.shift();
        if (re(e) && re(o))
            for (var i in o)
                re(o[i]) ? (e[i] || m(e, h({}, i, {})),
                xe(e[i], o[i])) : te(o[i]) && e[i] ? te(e[i]) && (e[i] = e[i].concat(o[i])) : m(e, h({}, i, o[i]));
        return xe.apply(void 0, [e].concat(n))
    }
}
, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    n.d(t, "storage", function() {
        return T
    }),
    t.registerBidder = function(t) {
        var n = Array.isArray(t.supportedMediaTypes) ? {
            supportedMediaTypes: t.supportedMediaTypes
        } : void 0;
        function r(e) {
            var t = C(e);
            c.default.registerBidAdapter(t, e.code, n)
        }
        r(t),
        Array.isArray(t.aliases) && t.aliases.forEach(function(e) {
            c.default.aliasRegistry[e] = t.code,
            r(w({}, t, {
                code: e
            }))
        })
    }
    ,
    t.newBidder = C,
    n.d(t, "registerSyncInner", function() {
        return x
    }),
    t.preloadBidderMappingFile = U,
    t.getIabSubCategory = function(t, e) {
        var n = c.default.getBidAdapter(t);
        if (n.getSpec().getMappingFileInfo) {
            var r = n.getSpec().getMappingFileInfo()
              , o = r.localStorageKey ? r.localStorageKey : n.getBidderCode()
              , i = T.getDataFromLocalStorage(o);
            if (i) {
                try {
                    i = JSON.parse(i)
                } catch (e) {
                    Object(m.logError)("Failed to parse ".concat(t, " mapping data stored in local storage"))
                }
                return i.mapping[e] ? i.mapping[e] : null
            }
        }
    }
    ,
    t.isValid = _;
    var r = n(100)
      , c = n(7)
      , u = n(3)
      , b = n(32)
      , s = n(39)
      , i = n(35)
      , a = n(36)
      , o = n(5)
      , v = n.n(o)
      , d = n(8)
      , h = n.n(d)
      , f = n(12)
      , l = n.n(f)
      , p = n(4)
      , m = n(0)
      , g = n(2)
      , y = n(13)
      , S = n(9);
    function A(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
                return;
            var n = []
              , r = !0
              , o = !1
              , i = void 0;
            try {
                for (var a, c = e[Symbol.iterator](); !(r = (a = c.next()).done) && (n.push(a.value),
                !t || n.length !== t); r = !0)
                    ;
            } catch (e) {
                o = !0,
                i = e
            } finally {
                try {
                    r || null == c.return || c.return()
                } finally {
                    if (o)
                        throw i
                }
            }
            return n
        }(e, t) || function(e, t) {
            if (!e)
                return;
            if ("string" == typeof e)
                return E(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            "Object" === n && e.constructor && (n = e.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(e);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return E(e, t)
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function E(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    function O(e) {
        return (O = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    function w() {
        return (w = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    var T = Object(S.a)("bidderFactory")
      , I = ["requestId", "cpm", "ttl", "creativeId", "netRevenue", "currency"]
      , j = 1;
    function C(p) {
        return w(new r.a(p.code), {
            getSpec: function() {
                return Object.freeze(p)
            },
            registerSyncs: g,
            callBids: function(i, a, e, n, c, r) {
                var u, s, t, d, o, f;
                function l() {
                    e(),
                    h.a.emit(v.a.EVENTS.BIDDER_DONE, i),
                    g(s, i.gdprConsent, i.uspConsent),
                    window.owpbjs && window.owpbjs.getConfig("userSync") && window.owpbjs.getConfig("userSync").hasOwnProperty("enableOverride") && window.owpbjs.getConfig("userSync").enableOverride && owpbjs.triggerUserSyncs()
                }
                Array.isArray(i.bids) && (u = {},
                s = [],
                0 !== (t = i.bids.filter(y)).length ? (d = {},
                t.forEach(function(e) {
                    (d[e.bidId] = e).adUnitCode || (e.adUnitCode = e.placementCode)
                }),
                (o = p.buildRequests(t, i)) && 0 !== o.length ? (Array.isArray(o) || (o = [o]),
                f = Object(m.delayExecution)(r(l), o.length),
                o.forEach(function(o) {
                    switch (o.method) {
                    case "GET":
                        n("".concat(o.url).concat(function(e) {
                            if (e)
                                return "?".concat("object" === O(e) ? Object(m.parseQueryStringParameters)(e) : e);
                            return ""
                        }(o.data)), {
                            success: r(e),
                            error: t
                        }, void 0, w({
                            method: "GET",
                            withCredentials: !0
                        }, o.options));
                        break;
                    case "POST":
                        n(o.url, {
                            success: r(e),
                            error: t
                        }, "string" == typeof o.data ? o.data : JSON.stringify(o.data), w({
                            method: "POST",
                            contentType: "text/plain",
                            withCredentials: !0
                        }, o.options));
                        break;
                    default:
                        Object(m.logWarn)("Skipping invalid request from ".concat(p.code, ". Request type ").concat(o.type, " must be GET or POST")),
                        f()
                    }
                    function e(e, t) {
                        c(p.code);
                        try {
                            e = JSON.parse(e)
                        } catch (e) {}
                        var n;
                        e = {
                            body: e,
                            headers: {
                                get: t.getResponseHeader.bind(t)
                            }
                        },
                        s.push(e);
                        try {
                            n = p.interpretResponse(e, o)
                        } catch (e) {
                            return Object(m.logError)("Bidder ".concat(p.code, " failed to interpret the server's response. Continuing without bids"), null, e),
                            void f()
                        }
                        function r(e) {
                            var t, n, r, o = d[e.requestId];
                            o ? (e.originalCpm = e.cpm,
                            e.originalCurrency = e.currency,
                            t = w(Object(b.a)(v.a.STATUS.GOOD, o), e),
                            n = o.adUnitCode,
                            r = t,
                            u[n] = !0,
                            _(n, r, [i]) && a(n, r)) : Object(m.logWarn)("Bidder ".concat(p.code, " made bid for unknown request ID: ").concat(e.requestId, ". Ignoring."))
                        }
                        n && (Object(m.isArray)(n) ? n.forEach(r) : r(n)),
                        f(n)
                    }
                    function t(e) {
                        c(p.code),
                        Object(m.logError)("Server call for ".concat(p.code, " failed: ").concat(e, ". Continuing without bids.")),
                        f()
                    }
                })) : l()) : l())
            }
        });
        function g(e, t, n) {
            x(p, e, t, n)
        }
        function y(e) {
            return !!p.isBidRequestValid(e) || (Object(m.logWarn)("Invalid bid sent to bidder ".concat(p.code, ": ").concat(JSON.stringify(e))),
            !1)
        }
    }
    var x = Object(y.b)("async", function(t, e, n, r) {
        var o, i, a = u.b.getConfig("userSync.aliasSyncEnabled");
        !t.getUserSyncs || !a && c.default.aliasRegistry[t.code] || (o = u.b.getConfig("userSync.filterSettings"),
        (i = t.getUserSyncs({
            iframeEnabled: !(!o || !o.iframe && !o.all),
            pixelEnabled: !(!o || !o.image && !o.all)
        }, e, n, r)) && (Array.isArray(i) || (i = [i]),
        i.forEach(function(e) {
            s.a.registerSync(e.type, t.code, e.url)
        })))
    }, "registerSyncs");
    function U(e, t) {
        if (!u.b.getConfig("adpod.brandCategoryExclusion"))
            return e.call(this, t);
        t.filter(function(e) {
            return Object(m.deepAccess)(e, "mediaTypes.video.context") === g.a
        }).map(function(e) {
            return e.bids.map(function(e) {
                return e.bidder
            })
        }).reduce(m.flatten, []).filter(m.uniques).forEach(function(n) {
            var e = c.default.getBidAdapter(n);
            if (e.getSpec().getMappingFileInfo) {
                var t = e.getSpec().getMappingFileInfo()
                  , r = t.refreshInDays ? t.refreshInDays : j
                  , o = t.localStorageKey ? t.localStorageKey : e.getSpec().code
                  , i = T.getDataFromLocalStorage(o);
                try {
                    (!(i = i ? JSON.parse(i) : void 0) || Object(m.timestamp)() > i.lastUpdated + 24 * r * 60 * 60 * 1e3) && Object(p.a)(t.url, {
                        success: function(e) {
                            try {
                                e = JSON.parse(e);
                                var t = {
                                    lastUpdated: Object(m.timestamp)(),
                                    mapping: e.mapping
                                };
                                T.setDataInLocalStorage(o, JSON.stringify(t))
                            } catch (e) {
                                Object(m.logError)("Failed to parse ".concat(n, " bidder translation mapping file"))
                            }
                        },
                        error: function() {
                            Object(m.logError)("Failed to load ".concat(n, " bidder translation file"))
                        }
                    })
                } catch (e) {
                    Object(m.logError)("Failed to parse ".concat(n, " bidder translation mapping file"))
                }
            }
        }),
        e.call(this, t)
    }
    function _(e, t, n) {
        function r(e) {
            return "Invalid bid from ".concat(t.bidderCode, ". Ignoring bid: ").concat(e)
        }
        return e ? t ? (o = Object.keys(t),
        I.every(function(e) {
            return l()(o, e) && !l()([void 0, null], t[e])
        }) ? "native" !== t.mediaType || Object(i.f)(t, n) ? "video" !== t.mediaType || Object(a.d)(t, n) ? !("banner" === t.mediaType && !function(e, t, n) {
            if ((t.width || 0 === parseInt(t.width, 10)) && (t.height || 0 === parseInt(t.height, 10)))
                return t.width = parseInt(t.width, 10),
                t.height = parseInt(t.height, 10),
                1;
            var r = Object(m.getBidderRequest)(n, t.bidderCode, e)
              , o = r && r.bids && r.bids[0] && r.bids[0].sizes
              , i = Object(m.parseSizesInput)(o);
            if (1 === i.length) {
                var a = A(i[0].split("x"), 2)
                  , c = a[0]
                  , u = a[1];
                return t.width = parseInt(c, 10),
                t.height = parseInt(u, 10),
                1
            }
        }(e, t, n)) || (Object(m.logError)(r("Banner bids require a width and height")),
        !1) : (Object(m.logError)(r("Video bid does not have required vastUrl or renderer property")),
        !1) : (Object(m.logError)(r("Native bid missing some required properties.")),
        !1) : (Object(m.logError)(r("Bidder ".concat(t.bidderCode, " is missing required params. Check http://prebid.org/dev-docs/bidder-adapter-1.html for list of params."))),
        !1)) : (Object(m.logWarn)("Some adapter tried to add an undefined bid for ".concat(e, ".")),
        !1) : (Object(m.logWarn)("No adUnitCode was supplied to addBidResponse."),
        !1);
        var o
    }
    Object(y.a)("checkAdUnitSetup").before(U)
}
, function(e, t, n) {
    "use strict";
    n.d(t, "c", function() {
        return r
    }),
    n.d(t, "d", function() {
        return o
    }),
    n.d(t, "b", function() {
        return i
    }),
    n.d(t, "a", function() {
        return a
    });
    var r = "native"
      , o = "video"
      , i = "banner"
      , a = "adpod"
}
, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return v
    }),
    n.d(t, "b", function() {
        return I
    });
    var r = n(46)
      , o = n(11)
      , a = n.n(o)
      , i = n(12)
      , c = n.n(i)
      , u = n(80)
      , s = n.n(u)
      , d = n(0);
    function f() {
        return (f = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    var l = n(92)
      , p = n(0)
      , g = n(5)
      , y = "TRUE" === p.getParameterByName(g.DEBUG_MODE).toUpperCase()
      , b = window.location.origin
      , v = "random"
      , h = {};
    h[v] = !0,
    h.fixed = !0;
    var m = v
      , S = {
        LOW: "low",
        MEDIUM: "medium",
        HIGH: "high",
        AUTO: "auto",
        DENSE: "dense",
        CUSTOM: "custom"
    };
    var A, E, O, w, T, I = (w = [],
    T = null,
    j(),
    {
        getCurrentBidder: function() {
            return T
        },
        getConfig: function() {
            if (arguments.length <= 1 && "function" != typeof (arguments.length <= 0 ? void 0 : arguments[0])) {
                var e = arguments.length <= 0 ? void 0 : arguments[0];
                return e ? p.deepAccess(C(), e) : C()
            }
            return function(e, t) {
                var n = t;
                if ("string" != typeof e && (n = e,
                e = "*"),
                "function" == typeof n) {
                    var r = {
                        topic: e,
                        callback: n
                    };
                    return w.push(r),
                    function() {
                        w.splice(w.indexOf(r), 1)
                    }
                }
                p.logError("listener must be a function")
            }
            .apply(void 0, arguments)
        },
        setConfig: function(n) {
            var e, r;
            p.isPlainObject(n) ? (e = Object.keys(n),
            r = {},
            e.forEach(function(e) {
                var t = n[e];
                p.isPlainObject(A[e]) && p.isPlainObject(t) && (t = f({}, A[e], t)),
                r[e] = E[e] = t
            }),
            x(r)) : p.logError("setConfig options must be an object")
        },
        setDefaults: function(e) {
            p.isPlainObject(A) ? (f(A, e),
            f(E, e)) : p.logError("defaults must be an object")
        },
        resetConfig: j,
        runWithBidder: U,
        callbackWithBidder: function(i) {
            return function(o) {
                return function() {
                    if ("function" == typeof o) {
                        for (var e, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
                            n[r] = arguments[r];
                        return U(i, (e = p.bind).call.apply(e, [o, this].concat(n)))
                    }
                    p.logWarn("config.callbackWithBidder callback is not a function")
                }
            }
        },
        setBidderConfig: function(r) {
            try {
                !function(e) {
                    if (!p.isPlainObject(e))
                        throw "setBidderConfig bidder options must be an object";
                    if (!Array.isArray(e.bidders) || !e.bidders.length)
                        throw "setBidderConfig bidder options must contain a bidders list with at least 1 bidder";
                    if (!p.isPlainObject(e.config))
                        throw "setBidderConfig bidder options must contain a config object"
                }(r),
                r.bidders.forEach(function(n) {
                    O[n] || (O[n] = {}),
                    Object.keys(r.config).forEach(function(e) {
                        var t = r.config[e];
                        p.isPlainObject(t) ? O[n][e] = f({}, O[n][e] || {}, t) : O[n][e] = t
                    })
                })
            } catch (e) {
                p.logError(e)
            }
        },
        getBidderConfig: function() {
            return O
        }
    });
    function j() {
        A = {};
        var n = {
            _debug: y,
            get debug() {
                return this._debug
            },
            set debug(e) {
                this._debug = e
            },
            _bidderTimeout: 3e3,
            get bidderTimeout() {
                return this._bidderTimeout
            },
            set bidderTimeout(e) {
                this._bidderTimeout = e
            },
            _publisherDomain: b,
            get publisherDomain() {
                return this._publisherDomain
            },
            set publisherDomain(e) {
                this._publisherDomain = e
            },
            _priceGranularity: S.MEDIUM,
            set priceGranularity(e) {
                i(e) && ("string" == typeof e ? this._priceGranularity = o(e) ? e : S.MEDIUM : p.isPlainObject(e) && (this._customPriceBucket = e,
                this._priceGranularity = S.CUSTOM,
                p.logMessage("Using custom price granularity")))
            },
            get priceGranularity() {
                return this._priceGranularity
            },
            _customPriceBucket: {},
            get customPriceBucket() {
                return this._customPriceBucket
            },
            _mediaTypePriceGranularity: {},
            get mediaTypePriceGranularity() {
                return this._mediaTypePriceGranularity
            },
            set mediaTypePriceGranularity(n) {
                var r = this;
                this._mediaTypePriceGranularity = Object.keys(n).reduce(function(e, t) {
                    return i(n[t]) ? "string" == typeof n ? e[t] = o(n[t]) ? n[t] : r._priceGranularity : p.isPlainObject(n) && (e[t] = n[t],
                    p.logMessage("Using custom price granularity for ".concat(t))) : p.logWarn("Invalid price granularity for media type: ".concat(t)),
                    e
                }, {})
            },
            _sendAllBids: !0,
            get enableSendAllBids() {
                return this._sendAllBids
            },
            set enableSendAllBids(e) {
                this._sendAllBids = e
            },
            _useBidCache: !1,
            get useBidCache() {
                return this._useBidCache
            },
            set useBidCache(e) {
                this._useBidCache = e
            },
            _deviceAccess: !0,
            get deviceAccess() {
                return this._deviceAccess
            },
            set deviceAccess(e) {
                this._deviceAccess = e
            },
            _bidderSequence: m,
            get bidderSequence() {
                return this._bidderSequence
            },
            set bidderSequence(e) {
                h[e] ? this._bidderSequence = e : p.logWarn("Invalid order: ".concat(e, ". Bidder Sequence was not set."))
            },
            _timeoutBuffer: 400,
            get timeoutBuffer() {
                return this._timeoutBuffer
            },
            set timeoutBuffer(e) {
                this._timeoutBuffer = e
            },
            _disableAjaxTimeout: !1,
            get disableAjaxTimeout() {
                return this._disableAjaxTimeout
            },
            set disableAjaxTimeout(e) {
                this._disableAjaxTimeout = e
            }
        };
        function o(t) {
            return a()(Object.keys(S), function(e) {
                return t === S[e]
            })
        }
        function i(e) {
            if (e) {
                if ("string" == typeof e)
                    o(e) || p.logWarn("Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.");
                else if (p.isPlainObject(e) && !Object(r.b)(e))
                    return void p.logError("Invalid custom price value passed to `setPriceGranularity()`");
                return 1
            }
            p.logError("Prebid Error: no value passed to `setPriceGranularity()`")
        }
        E && x(Object.keys(E).reduce(function(e, t) {
            return E[t] !== n[t] && (e[t] = n[t] || {}),
            e
        }, {})),
        E = n,
        O = {}
    }
    function C() {
        if (T && O && p.isPlainObject(O[T])) {
            var n = O[T]
              , e = new s.a(Object.keys(E).concat(Object.keys(n)));
            return l(e).reduce(function(e, t) {
                return void 0 === n[t] ? e[t] = E[t] : void 0 !== E[t] && p.isPlainObject(n[t]) ? e[t] = Object(d.mergeDeep)({}, E[t], n[t]) : e[t] = n[t],
                e
            }, {})
        }
        return f({}, E)
    }
    function x(o) {
        var t = Object.keys(o);
        w.filter(function(e) {
            return c()(t, e.topic)
        }).forEach(function(e) {
            var t, n, r;
            e.callback((t = {},
            n = e.topic,
            r = o[e.topic],
            n in t ? Object.defineProperty(t, n, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[n] = r,
            t))
        }),
        w.filter(function(e) {
            return "*" === e.topic
        }).forEach(function(e) {
            return e.callback(o)
        })
    }
    function U(e, t) {
        T = e;
        try {
            return t()
        } finally {
            T = null
        }
    }
}
, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return r
    }),
    t.b = o;
    var l = n(3);
    function p() {
        return (p = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    function g(e) {
        return (g = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    var y = n(0)
      , b = 4
      , r = o();
    function o() {
        var s = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 3e3
          , e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
          , d = e.request
          , f = e.done;
        return function(e, t, n) {
            var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : {};
            try {
                var o, i = r.method || (n ? "POST" : "GET"), a = document.createElement("a");
                a.href = e;
                var c, u = "object" === g(t) && null !== t ? t : {
                    success: function() {
                        y.logMessage("xhr success")
                    },
                    error: function(e) {
                        y.logError("xhr error", null, e)
                    }
                };
                "function" == typeof t && (u.success = t),
                (o = new window.XMLHttpRequest).onreadystatechange = function() {
                    var e;
                    o.readyState === b && ("function" == typeof f && f(a.origin),
                    200 <= (e = o.status) && e < 300 || 304 === e ? u.success(o.responseText, o) : u.error(o.statusText, o))
                }
                ,
                l.b.getConfig("disableAjaxTimeout") || (o.ontimeout = function() {
                    y.logError("  xhr timeout after ", o.timeout, "ms")
                }
                ),
                "GET" === i && n && (p((c = y.parseUrl(e, r)).search, n),
                e = y.buildUrl(c)),
                o.open(i, e, !0),
                l.b.getConfig("disableAjaxTimeout") || (o.timeout = s),
                r.withCredentials && (o.withCredentials = !0),
                y._each(r.customHeaders, function(e, t) {
                    o.setRequestHeader(t, e)
                }),
                r.preflight && o.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
                o.setRequestHeader("Content-Type", r.contentType || "text/plain"),
                "function" == typeof d && d(a.origin),
                "POST" === i && n ? o.send(n) : o.send()
            } catch (e) {
                y.logError("xhr construction", e)
            }
        }
    }
}
, function(e, t) {
    e.exports = {
        JSON_MAPPING: {
            PL_CODE: "code",
            PL_SIZE: "sizes",
            PL_BIDS: "bids",
            BD_BIDDER: "bidder",
            BD_ID: "paramsd",
            BD_PL_ID: "placementId",
            ADSERVER_TARGETING: "adserverTargeting",
            BD_SETTING_STANDARD: "standard"
        },
        DEBUG_MODE: "pbjs_debug",
        STATUS: {
            GOOD: 1,
            NO_BID: 2
        },
        CB: {
            TYPE: {
                ALL_BIDS_BACK: "allRequestedBidsBack",
                AD_UNIT_BIDS_BACK: "adUnitBidsBack",
                BID_WON: "bidWon",
                REQUEST_BIDS: "requestBids"
            }
        },
        EVENTS: {
            AUCTION_INIT: "auctionInit",
            AUCTION_END: "auctionEnd",
            BID_ADJUSTMENT: "bidAdjustment",
            BID_TIMEOUT: "bidTimeout",
            BID_REQUESTED: "bidRequested",
            BID_RESPONSE: "bidResponse",
            NO_BID: "noBid",
            BID_WON: "bidWon",
            BIDDER_DONE: "bidderDone",
            SET_TARGETING: "setTargeting",
            BEFORE_REQUEST_BIDS: "beforeRequestBids",
            REQUEST_BIDS: "requestBids",
            ADD_AD_UNITS: "addAdUnits",
            AD_RENDER_FAILED: "adRenderFailed"
        },
        AD_RENDER_FAILED_REASON: {
            PREVENT_WRITING_ON_MAIN_DOCUMENT: "preventWritingOnMainDocuemnt",
            NO_AD: "noAd",
            EXCEPTION: "exception",
            CANNOT_FIND_AD: "cannotFindAd",
            MISSING_DOC_OR_ADID: "missingDocOrAdid"
        },
        EVENT_ID_PATHS: {
            bidWon: "adUnitCode"
        },
        GRANULARITY_OPTIONS: {
            LOW: "low",
            MEDIUM: "medium",
            HIGH: "high",
            AUTO: "auto",
            DENSE: "dense",
            CUSTOM: "custom"
        },
        TARGETING_KEYS: {
            BIDDER: "hb_bidder",
            AD_ID: "hb_adid",
            PRICE_BUCKET: "hb_pb",
            SIZE: "hb_size",
            DEAL: "hb_deal",
            SOURCE: "hb_source",
            FORMAT: "hb_format",
            UUID: "hb_uuid",
            CACHE_ID: "hb_cache_id",
            CACHE_HOST: "hb_cache_host"
        },
        NATIVE_KEYS: {
            title: "pwt_native_title",
            body: "pwt_native_body",
            body2: "pwt_native_body2",
            privacyLink: "pwt_native_privacy",
            sponsoredBy: "pwt_native_brand",
            image: "pwt_native_image",
            icon: "pwt_native_icon",
            clickUrl: "pwt_native_linkurl",
            displayUrl: "pwt_native_displayurl",
            cta: "pwt_native_cta",
            rating: "pwt_native_rating",
            address: "pwt_native_address",
            downloads: "pwt_native_downloads",
            likes: "pwt_native_likes",
            phone: "pwt_native_phone",
            price: "pwt_native_price",
            salePrice: "pwt_native_saleprice"
        },
        S2S: {
            SRC: "s2s",
            DEFAULT_ENDPOINT: "https://prebid.adnxs.com/pbs/v1/openrtb2/auction",
            SYNCED_BIDDERS_KEY: "pbjsSyncs"
        },
        BID_STATUS: {
            BID_TARGETING_SET: "targetingSet",
            RENDERED: "rendered",
            BID_REJECTED: "bidRejected"
        }
    }
}
, , function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    n.d(t, "gdprDataHandler", function() {
        return B
    }),
    n.d(t, "uspDataHandler", function() {
        return P
    }),
    t.setS2STestingModule = function(e) {
        T = e
    }
    ;
    var S = n(0)
      , p = n(101)
      , g = n(35)
      , d = n(1)
      , h = n(4)
      , A = n(3)
      , r = n(13)
      , o = n(12)
      , E = n.n(o)
      , i = n(11)
      , O = n.n(i)
      , y = n(69)
      , w = n(30);
    function m(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
                return;
            var n = []
              , r = !0
              , o = !1
              , i = void 0;
            try {
                for (var a, c = e[Symbol.iterator](); !(r = (a = c.next()).done) && (n.push(a.value),
                !t || n.length !== t); r = !0)
                    ;
            } catch (e) {
                o = !0,
                i = e
            } finally {
                try {
                    r || null == c.return || c.return()
                } finally {
                    if (o)
                        throw i
                }
            }
            return n
        }(e, t) || function(e, t) {
            if (!e)
                return;
            if ("string" == typeof e)
                return a(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            "Object" === n && e.constructor && (n = e.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(e);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return a(e, t)
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function a(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    function b() {
        return (b = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    var T, I = n(0), j = n(5), C = n(8), f = {}, x = f.bidderRegistry = {}, l = f.aliasRegistry = {}, U = {};
    A.b.getConfig("s2sConfig", function(e) {
        U = e.s2sConfig
    });
    var c = {};
    var _ = Object(r.b)("sync", function(e) {
        var o = e.bidderCode
          , s = e.auctionId
          , d = e.bidderRequestId
          , t = e.adUnits
          , f = e.labels
          , l = e.src;
        return t.reduce(function(e, c) {
            var t = Object(p.b)(Object(p.a)(c, f), c.mediaTypes, c.sizes)
              , n = t.active
              , u = t.mediaTypes
              , r = t.filterResults;
            return n ? r && I.logInfo('Size mapping filtered adUnit "'.concat(c.code, '" banner sizes from '), r.before, "to ", r.after) : I.logInfo('Size mapping disabled adUnit "'.concat(c.code, '"')),
            n && e.push(c.bids.filter(function(e) {
                return e.bidder === o
            }).reduce(function(e, t) {
                var n = c.nativeParams || I.deepAccess(c, "mediaTypes.native");
                n && (t = b({}, t, {
                    nativeParams: Object(g.g)(n)
                })),
                t = b({}, t, Object(S.getDefinedParams)(c, ["fpd", "mediaType", "renderer", "storedAuctionResponse"]));
                var r = Object(p.b)(Object(p.a)(t, f), u)
                  , o = r.active
                  , i = r.mediaTypes
                  , a = r.filterResults;
                return o ? a && I.logInfo('Size mapping filtered adUnit "'.concat(c.code, '" bidder "').concat(t.bidder, '" banner sizes from '), a.before, "to ", a.after) : I.logInfo('Size mapping deactivated adUnit "'.concat(c.code, '" bidder "').concat(t.bidder, '"')),
                I.isValidMediaTypes(i) ? t = b({}, t, {
                    mediaTypes: i
                }) : I.logError("mediaTypes is not correctly configured for adunit ".concat(c.code)),
                o && e.push(b({}, t, {
                    adUnitCode: c.code,
                    transactionId: c.transactionId,
                    sizes: I.deepAccess(i, "banner.sizes") || I.deepAccess(i, "video.playerSize") || [],
                    bidId: t.bid_id || I.getUniqueIdentifierStr(),
                    bidderRequestId: d,
                    auctionId: s,
                    src: l,
                    bidRequestsCount: y.a.getRequestsCounter(c.code),
                    bidderRequestsCount: y.a.getBidderRequestsCounter(c.code, t.bidder),
                    bidderWinsCount: y.a.getBidderWinsCounter(c.code, t.bidder)
                })),
                e
            }, [])),
            e
        }, []).reduce(S.flatten, []).filter(function(e) {
            return "" !== e
        })
    }, "getBids");
    var B = {
        consentData: null,
        setConsentData: function(e) {
            B.consentData = e
        },
        getConsentData: function() {
            return B.consentData
        }
    }
      , P = {
        consentData: null,
        setConsentData: function(e) {
            P.consentData = e
        },
        getConsentData: function() {
            return P.consentData
        }
    };
    function R() {
        return U && U.enabled && U.testing && T
    }
    function u(t, n, e) {
        try {
            var r = x[t].getSpec();
            r && r[n] && "function" == typeof r[n] && (I.logInfo("Invoking ".concat(t, ".").concat(n)),
            A.b.runWithBidder(t, S.bind.call(r[n], r, e)))
        } catch (e) {
            I.logWarn("Error calling ".concat(n, " of ").concat(t))
        }
    }
    f.makeBidRequests = Object(r.b)("sync", function(e, o, i, a, c) {
        C.emit(j.EVENTS.BEFORE_REQUEST_BIDS, e);
        var u = []
          , t = Object(S.getBidderCodes)(e);
        A.b.getConfig("bidderSequence") === A.a && (t = Object(S.shuffle)(t));
        var n, r, s, d, f, l, p, g = Object(w.a)(), y = t, b = [];
        U.enabled && (R() && (b = T.getSourceBidderMap(e)[T.CLIENT]),
        n = U.bidders,
        y = t.filter(function(e) {
            return !E()(n, e) || E()(b, e)
        }),
        Boolean(R() && U.testServerOnly) && (p = e,
        Boolean(O()(p, function(e) {
            return O()(e.bids, function(e) {
                return (e.bidSource || U.bidderControl && U.bidderControl[e.bidder]) && e.finalSource === T.SERVER
            })
        }))) && (y.length = 0),
        d = e,
        f = U.bidders,
        (l = I.deepClone(d)).forEach(function(e) {
            e.bids = e.bids.filter(function(e) {
                return E()(f, e.bidder) && (!R() || e.finalSource !== T.CLIENT)
            }).map(function(e) {
                return e.bid_id = I.getUniqueIdentifierStr(),
                e
            })
        }),
        r = l = l.filter(function(e) {
            return 0 !== e.bids.length
        }),
        s = I.generateUUID(),
        n.forEach(function(e) {
            var t = I.getUniqueIdentifierStr()
              , n = {
                bidderCode: e,
                auctionId: i,
                bidderRequestId: t,
                tid: s,
                bids: _({
                    bidderCode: e,
                    auctionId: i,
                    bidderRequestId: t,
                    adUnits: I.deepClone(r),
                    labels: c,
                    src: j.S2S.SRC
                }),
                auctionStart: o,
                timeout: U.timeout,
                src: j.S2S.SRC,
                refererInfo: g
            };
            0 !== n.bids.length && u.push(n)
        }),
        r.forEach(function(e) {
            var t = e.bids.filter(function(t) {
                return O()(u, function(e) {
                    return O()(e.bids, function(e) {
                        return e.bidId === t.bid_id
                    })
                })
            });
            e.bids = t
        }),
        u.forEach(function(e) {
            e.adUnitsS2SCopy = r.filter(function(e) {
                return 0 < e.bids.length
            })
        }));
        var v, h, m = (v = e,
        (h = I.deepClone(v)).forEach(function(e) {
            e.bids = e.bids.filter(function(e) {
                return !R() || e.finalSource !== T.SERVER
            })
        }),
        h = h.filter(function(e) {
            return 0 !== e.bids.length
        }));
        return y.forEach(function(e) {
            var t = I.getUniqueIdentifierStr()
              , n = {
                bidderCode: e,
                auctionId: i,
                bidderRequestId: t,
                bids: _({
                    bidderCode: e,
                    auctionId: i,
                    bidderRequestId: t,
                    adUnits: I.deepClone(m),
                    labels: c,
                    src: "client"
                }),
                auctionStart: o,
                timeout: a,
                refererInfo: g
            }
              , r = x[e];
            r || I.logError("Trying to make a request for bidder that does not exist: ".concat(e)),
            r && n.bids && 0 !== n.bids.length && u.push(n)
        }),
        B.getConsentData() && u.forEach(function(e) {
            e.gdprConsent = B.getConsentData()
        }),
        P.getConsentData() && u.forEach(function(e) {
            e.uspConsent = P.getConsentData()
        }),
        u
    }, "makeBidRequests"),
    f.callBids = function(e, t, o, i, a, c, u) {
        var n, r, s, d, f, l, p, g, y, b, v;
        t.length ? (r = (n = m(t.reduce(function(e, t) {
            return e[Number(void 0 !== t.src && t.src === j.S2S.SRC)].push(t),
            e
        }, [[], []]), 2))[0],
        (s = n[1]).length && (d = Object(h.b)(c, a ? {
            request: a.request.bind(null, "s2s"),
            done: a.done
        } : void 0),
        f = U.bidders,
        l = x[U.adapter],
        p = s[0].tid,
        g = s[0].adUnitsS2SCopy,
        l ? (y = {
            tid: p,
            ad_units: g
        }).ad_units.length && (b = s.map(function(e) {
            return e.start = Object(S.timestamp)(),
            i.bind(e)
        }),
        v = y.ad_units.reduce(function(e, t) {
            return e.concat((t.bids || []).reduce(function(e, t) {
                return e.concat(t.bidder)
            }, []))
        }, []),
        I.logMessage("CALLING S2S HEADER BIDDERS ==== ".concat(f.filter(function(e) {
            return E()(v, e)
        }).join(","))),
        s.forEach(function(e) {
            C.emit(j.EVENTS.BID_REQUESTED, e)
        }),
        l.callBids(y, s, function(e, t) {
            var n = Object(S.getBidderRequest)(s, t.bidderCode, e);
            n && o.call(n, e, t)
        }, function() {
            return b.forEach(function(e) {
                return e()
            })
        }, d)) : I.logError("missing " + U.adapter)),
        r.forEach(function(t) {
            t.start = Object(S.timestamp)();
            var e = x[t.bidderCode];
            I.logMessage("CALLING BIDDER ======= ".concat(t.bidderCode)),
            C.emit(j.EVENTS.BID_REQUESTED, t);
            var n = Object(h.b)(c, a ? {
                request: a.request.bind(null, t.bidderCode),
                done: a.done
            } : void 0)
              , r = i.bind(t);
            try {
                A.b.runWithBidder(t.bidderCode, S.bind.call(e.callBids, e, t, o.bind(t), r, n, u, A.b.callbackWithBidder(t.bidderCode)))
            } catch (e) {
                I.logError("".concat(t.bidderCode, " Bid Adapter emitted an uncaught error when parsing their bidRequest"), {
                    e: e,
                    bidRequest: t
                }),
                r()
            }
        })) : I.logWarn("callBids executed with no bidRequests.  Were they filtered by labels or sizing?")
    }
    ,
    f.videoAdapters = [],
    f.registerBidAdapter = function(e, t) {
        var n = (2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}).supportedMediaTypes
          , r = void 0 === n ? [] : n;
        e && t ? "function" == typeof e.callBids ? (x[t] = e,
        E()(r, "video") && f.videoAdapters.push(t),
        E()(r, "native") && g.e.push(t)) : I.logError("Bidder adaptor error for bidder code: " + t + "bidder must implement a callBids() function") : I.logError("bidAdaptor or bidderCode not specified")
    }
    ,
    f.aliasBidAdapter = function(t, e) {
        var n, r;
        if (void 0 === x[e]) {
            var o = x[t];
            if (void 0 === o) {
                var i = A.b.getConfig("s2sConfig")
                  , a = i && i.bidders;
                a && E()(a, e) ? l[e] = t : I.logError('bidderCode "' + t + '" is not an existing bidder.', "adapterManager.aliasBidAdapter")
            } else
                try {
                    var c, u, s = (n = t,
                    r = [],
                    E()(f.videoAdapters, n) && r.push("video"),
                    E()(g.e, n) && r.push("native"),
                    r);
                    o.constructor.prototype != Object.prototype ? (u = new o.constructor).setBidderCode(e) : (c = o.getSpec(),
                    u = Object(d.newBidder)(b({}, c, {
                        code: e
                    })),
                    l[e] = t),
                    f.registerBidAdapter(u, e, {
                        supportedMediaTypes: s
                    })
                } catch (e) {
                    I.logError(t + " bidder does not currently support aliasing.", "adapterManager.aliasBidAdapter")
                }
        } else
            I.logMessage('alias name "' + e + '" has been already specified.')
    }
    ,
    f.registerAnalyticsAdapter = function(e) {
        var t = e.adapter
          , n = e.code;
        t && n ? "function" == typeof t.enableAnalytics ? (t.code = n,
        c[n] = t) : I.logError('Prebid Error: Analytics adaptor error for analytics "'.concat(n, '"\n        analytics adapter must implement an enableAnalytics() function')) : I.logError("Prebid Error: analyticsAdapter or analyticsCode not specified")
    }
    ,
    f.enableAnalytics = function(e) {
        I.isArray(e) || (e = [e]),
        I._each(e, function(e) {
            var t = c[e.provider];
            t ? t.enableAnalytics(e) : I.logError("Prebid Error: no analytics adapter found in registry for\n        ".concat(e.provider, "."))
        })
    }
    ,
    f.getBidAdapter = function(e) {
        return x[e]
    }
    ,
    f.callTimedOutBidders = function(t, n, r) {
        n = n.map(function(e) {
            return e.params = I.getUserConfiguredParams(t, e.adUnitCode, e.bidder),
            e.timeout = r,
            e
        }),
        n = I.groupBy(n, "bidder"),
        Object.keys(n).forEach(function(e) {
            u(e, "onTimeout", n[e])
        })
    }
    ,
    f.callBidWonBidder = function(e, t, n) {
        t.params = I.getUserConfiguredParams(n, t.adUnitCode, t.bidder),
        y.a.incrementBidderWinsCounter(t.adUnitCode, t.bidder),
        u(e, "onBidWon", t)
    }
    ,
    f.callSetTargetingBidder = function(e, t) {
        u(e, "onSetTargeting", t)
    }
    ,
    t.default = f
}
, function(e, t, n) {
    function r() {
        return (r = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    var c, o, u = n(0), i = n(5), a = Array.prototype.slice, s = Array.prototype.push, d = u._map(i.EVENTS, function(e) {
        return e
    }), f = i.EVENT_ID_PATHS, l = [];
    e.exports = (c = {},
    (o = {}).on = function(e, t, n) {
        var r, o;
        o = e,
        u.contains(d, o) ? (r = c[e] || {
            que: []
        },
        n ? (r[n] = r[n] || {
            que: []
        },
        r[n].que.push(t)) : r.que.push(t),
        c[e] = r) : u.logError("Wrong event name : " + e + " Valid event names :" + d)
    }
    ,
    o.emit = function(e) {
        !function(e, t) {
            u.logMessage("Emitting event for: " + e);
            var n = t[0] || {}
              , r = n[f[e]]
              , o = c[e] || {
                que: []
            }
              , i = u._map(o, function(e, t) {
                return t
            })
              , a = [];
            l.push({
                eventType: e,
                args: n,
                id: r
            }),
            r && u.contains(i, r) && s.apply(a, o[r].que),
            s.apply(a, o.que),
            u._each(a, function(e) {
                if (e)
                    try {
                        e.apply(null, t)
                    } catch (e) {
                        u.logError("Error executing handler:", "events.js", e)
                    }
            })
        }(e, a.call(arguments, 1))
    }
    ,
    o.off = function(e, n, r) {
        var o = c[e];
        u.isEmpty(o) || u.isEmpty(o.que) && u.isEmpty(o[r]) || r && (u.isEmpty(o[r]) || u.isEmpty(o[r].que)) || (r ? u._each(o[r].que, function(e) {
            var t = o[r].que;
            e === n && t.splice(t.indexOf(e), 1)
        }) : u._each(o.que, function(e) {
            var t = o.que;
            e === n && t.splice(t.indexOf(e), 1)
        }),
        c[e] = o)
    }
    ,
    o.get = function() {
        return c
    }
    ,
    o.getEvents = function() {
        var n = [];
        return u._each(l, function(e) {
            var t = r({}, e);
            n.push(t)
        }),
        n
    }
    ,
    o)
}
, function(e, t, n) {
    "use strict";
    n.d(t, "c", function() {
        return f
    }),
    n.d(t, "d", function() {
        return l
    }),
    t.a = function(e) {
        return i({
            moduleName: e,
            moduleType: "core"
        })
    }
    ,
    t.b = function(e, t) {
        return i({
            gvlid: e,
            moduleName: t
        })
    }
    ;
    var r = n(13)
      , c = n(0)
      , o = n(12)
      , u = n.n(o)
      , d = ["core", "prebid-module"]
      , f = [];
    function i(e) {
        var t = 0 < arguments.length && void 0 !== e ? e : {}
          , o = t.gvlid
          , i = t.moduleName
          , a = t.moduleType;
        function s(n) {
            if (u()(d, a)) {
                return n({
                    valid: !0
                })
            }
            var r;
            return l(o, i, {
                hasEnforcementHook: !1
            }, function(e) {
                var t;
                r = e && e.hasEnforcementHook ? n(e) : (t = {
                    hasEnforcementHook: !1,
                    valid: c.hasDeviceAccess()
                },
                n(t))
            }),
            r
        }
        return {
            setCookie: function(o, i, a, c, u, t) {
                function n(e) {
                    var t, n, r;
                    e && e.valid && (t = u && "" !== u ? " ;domain=".concat(encodeURIComponent(u)) : "",
                    n = a && "" !== a ? " ;expires=".concat(a) : "",
                    r = null != c && "none" == c.toLowerCase() ? "; Secure" : "",
                    document.cookie = "".concat(o, "=").concat(encodeURIComponent(i)).concat(n, "; path=/").concat(t).concat(c ? "; SameSite=".concat(c) : "").concat(r))
                }
                if (!t || "function" != typeof t)
                    return s(n);
                f.push(function() {
                    var e = s(n);
                    t(e)
                })
            },
            getCookie: function(n, t) {
                function r(e) {
                    if (e && e.valid) {
                        var t = window.document.cookie.match("(^|;)\\s*" + n + "\\s*=\\s*([^;]*)\\s*(;|$)");
                        return t ? decodeURIComponent(t[2]) : null
                    }
                    return null
                }
                if (!t || "function" != typeof t)
                    return s(r);
                f.push(function() {
                    var e = s(r);
                    t(e)
                })
            },
            localStorageIsEnabled: function(t) {
                function n(e) {
                    if (e && e.valid)
                        try {
                            return localStorage.setItem("prebid.cookieTest", "1"),
                            "1" === localStorage.getItem("prebid.cookieTest")
                        } catch (e) {}
                    return !1
                }
                if (!t || "function" != typeof t)
                    return s(n);
                f.push(function() {
                    var e = s(n);
                    t(e)
                })
            },
            cookiesAreEnabled: function(t) {
                function n(e) {
                    return !(!e || !e.valid) && (!!c.checkCookieSupport() || (window.document.cookie = "prebid.cookieTest",
                    -1 !== window.document.cookie.indexOf("prebid.cookieTest")))
                }
                if (!t || "function" != typeof t)
                    return s(n);
                f.push(function() {
                    var e = s(n);
                    t(e)
                })
            },
            setDataInLocalStorage: function(t, n, r) {
                function o(e) {
                    e && e.valid && window.localStorage.setItem(t, n)
                }
                if (!r || "function" != typeof r)
                    return s(o);
                f.push(function() {
                    var e = s(o);
                    r(e)
                })
            },
            getDataFromLocalStorage: function(t, n) {
                function r(e) {
                    return e && e.valid ? window.localStorage.getItem(t) : null
                }
                if (!n || "function" != typeof n)
                    return s(r);
                f.push(function() {
                    var e = s(r);
                    n(e)
                })
            },
            removeDataFromLocalStorage: function(t, n) {
                function r(e) {
                    e && e.valid && window.localStorage.removeItem(t)
                }
                if (!n || "function" != typeof n)
                    return s(r);
                f.push(function() {
                    var e = s(r);
                    n(e)
                })
            },
            hasLocalStorage: function(t) {
                function n(e) {
                    if (e && e.valid)
                        try {
                            return !!window.localStorage
                        } catch (e) {
                            c.logError("Local storage api disabled")
                        }
                    return !1
                }
                if (!t || "function" != typeof t)
                    return s(n);
                f.push(function() {
                    var e = s(n);
                    t(e)
                })
            },
            findSimilarCookies: function(i, t) {
                function n(e) {
                    if (e && e.valid) {
                        var t = [];
                        if (c.hasDeviceAccess())
                            for (var n = document.cookie.split(";"); n.length; ) {
                                var r = n.pop()
                                  , o = (o = r.indexOf("=")) < 0 ? r.length : o;
                                0 <= decodeURIComponent(r.slice(0, o).replace(/^\s+/, "")).indexOf(i) && t.push(decodeURIComponent(r.slice(o + 1)))
                            }
                        return t
                    }
                }
                if (!t || "function" != typeof t)
                    return s(n);
                f.push(function() {
                    var e = s(n);
                    t(e)
                })
            }
        }
    }
    var l = Object(r.b)("async", function(e, t, n, r) {
        r(n)
    }, "validateStorageEnforcement")
}
, function(e, t, n) {
    "use strict";
    t.a = o,
    t.c = function(e) {
        return !(!e || !e.url)
    }
    ,
    t.b = function(e, t) {
        e.render(t)
    }
    ;
    var u = n(40)
      , s = n(0)
      , r = n(11)
      , d = n.n(r)
      , f = "outstream";
    function o(e) {
        var t = this
          , r = e.url
          , n = e.config
          , o = e.id
          , i = e.callback
          , a = e.loaded
          , c = e.adUnitCode;
        this.url = r,
        this.config = n,
        this.handlers = {},
        this.id = o,
        this.loaded = a,
        this.cmd = [],
        this.push = function(e) {
            "function" == typeof e ? t.loaded ? e.call() : t.cmd.push(e) : s.logError("Commands given to Renderer.push must be wrapped in a function")
        }
        ,
        this.callback = i || function() {
            t.loaded = !0,
            t.process()
        }
        ,
        this.render = function() {
            var t, e, n;
            t = c,
            e = owpbjs.adUnits,
            (n = d()(e, function(e) {
                return e.code === t
            })) && n.renderer && n.renderer.url && n.renderer.render ? s.logWarn("External Js not loaded by Renderer since renderer url and callback is already defined on adUnit ".concat(c)) : Object(u.a)(r, f, this.callback),
            this._render ? this._render.apply(this, arguments) : s.logWarn("No render function was provided, please use .setRender on the renderer")
        }
        .bind(this)
    }
    o.install = function(e) {
        return new o({
            url: e.url,
            config: e.config,
            id: e.id,
            callback: e.callback,
            loaded: e.loaded,
            adUnitCode: e.adUnitCode
        })
    }
    ,
    o.prototype.getConfig = function() {
        return this.config
    }
    ,
    o.prototype.setRender = function(e) {
        this._render = e
    }
    ,
    o.prototype.setEventHandlers = function(e) {
        this.handlers = e
    }
    ,
    o.prototype.handleVideoEvent = function(e) {
        var t = e.id
          , n = e.eventName;
        "function" == typeof this.handlers[n] && this.handlers[n](),
        s.logMessage("Prebid Renderer event for id ".concat(t, " type ").concat(n))
    }
    ,
    o.prototype.process = function() {
        for (; 0 < this.cmd.length; )
            try {
                this.cmd.shift().call()
            } catch (e) {
                s.logError("Error processing Renderer command: ", e)
            }
    }
}
, function(e, t, n) {
    var r = n(105);
    e.exports = r
}
, function(e, t, n) {
    var r = n(114);
    e.exports = r
}
, function(e, t, n) {
    "use strict";
    n.d(t, "b", function() {
        return a
    }),
    n.d(t, "a", function() {
        return c
    }),
    t.d = function(e, t) {
        var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 15;
        0 === e.getHooks({
            hook: t
        }).length && e.before(t, n)
    }
    ,
    t.c = function(e, n) {
        a("async", function(e) {
            e.forEach(function(e) {
                return n.apply(void 0, function(e) {
                    if (Array.isArray(e))
                        return i(e)
                }(t = e) || function(e) {
                    if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                        return Array.from(e)
                }(t) || function(e, t) {
                    if (e) {
                        if ("string" == typeof e)
                            return i(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        return "Object" === n && e.constructor && (n = e.constructor.name),
                        "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(e, t) : void 0
                    }
                }(t) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }());
                var t
            })
        }, e)([])
    }
    ,
    t.e = function(e) {
        for (var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++)
            n[r - 1] = arguments[r];
        c(e).before(function(e, t) {
            t.push(n),
            e(t)
        })
    }
    ;
    var r = n(184)
      , o = n.n(r);
    function i(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    var a = o()({
        useProxy: !1,
        ready: o.a.SYNC | o.a.ASYNC | o.a.QUEUE
    })
      , c = a.get
}
, function(e, t, n) {
    "use strict";
    function v(r) {
        function e(e, t, n) {
            if (this instanceof r) {
                switch (arguments.length) {
                case 0:
                    return new r;
                case 1:
                    return new r(e);
                case 2:
                    return new r(e,t)
                }
                return new r(e,t,n)
            }
            return r.apply(this, arguments)
        }
        return e.prototype = r.prototype,
        e
    }
    var h = n(22)
      , m = n(107).f
      , S = n(109)
      , A = n(43)
      , E = n(21)
      , O = n(29)
      , w = n(24);
    e.exports = function(e, t) {
        var n, r, o, i, a, c, u, s, d = e.target, f = e.global, l = e.stat, p = e.proto, g = f ? h : l ? h[d] : (h[d] || {}).prototype, y = f ? A : A[d] || (A[d] = {}), b = y.prototype;
        for (o in t)
            n = !S(f ? o : d + (l ? "." : "#") + o, e.forced) && g && w(g, o),
            a = y[o],
            n && (c = e.noTargetGet ? (s = m(g, o)) && s.value : g[o]),
            i = n && c ? c : t[o],
            n && typeof a == typeof i || (u = e.bind && n ? E(i, h) : e.wrap && n ? v(i) : p && "function" == typeof i ? E(Function.call, i) : i,
            (e.sham || i && i.sham || a && a.sham) && O(u, "sham", !0),
            y[o] = u,
            p && (w(A, r = d + "Prototype") || O(A, r, {}),
            A[r][o] = i,
            e.real && b && !b[o] && O(b, o, i)))
    }
}
, function(e, t, n) {
    var r = n(23);
    e.exports = function(e) {
        if (!r(e))
            throw TypeError(String(e) + " is not an object");
        return e
    }
}
, function(e, t) {
    e.exports = !0
}
, function(e, t, n) {
    function p(e, t) {
        this.stopped = e,
        this.result = t
    }
    var g = n(15)
      , y = n(82)
      , b = n(51)
      , v = n(21)
      , h = n(62)
      , m = n(83);
    (e.exports = function(e, t, n, r, o) {
        var i, a, c, u, s, d, f, l = v(t, n, r ? 2 : 1);
        if (o)
            i = e;
        else {
            if ("function" != typeof (a = h(e)))
                throw TypeError("Target is not iterable");
            if (y(a)) {
                for (c = 0,
                u = b(e.length); c < u; c++)
                    if ((s = r ? l(g(f = e[c])[0], f[1]) : l(e[c])) && s instanceof p)
                        return s;
                return new p(!1)
            }
            i = a.call(e)
        }
        for (d = i.next; !(f = d.call(i)).done; )
            if ("object" == typeof (s = m(i, l, f.value, r)) && s && s instanceof p)
                return s;
        return new p(!1)
    }
    ).stop = function(e) {
        return new p(!0,e)
    }
}
, function(e, t) {
    e.exports = function(e) {
        if ("function" != typeof e)
            throw TypeError(String(e) + " is not a function");
        return e
    }
}
, function(e, t, n) {
    var r = n(22)
      , o = n(76)
      , i = n(24)
      , a = n(60)
      , c = n(78)
      , u = n(113)
      , s = o("wks")
      , d = r.Symbol
      , f = u ? d : d && d.withoutSetter || a;
    e.exports = function(e) {
        return i(s, e) || (c && i(d, e) ? s[e] = d[e] : s[e] = f("Symbol." + e)),
        s[e]
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function() {
        return window.owpbjs
    }
    ,
    window.owpbjs = window.owpbjs || {},
    window.owpbjs.cmd = window.owpbjs.cmd || [],
    window.owpbjs.que = window.owpbjs.que || [],
    window._pbjsGlobals = window._pbjsGlobals || [],
    window._pbjsGlobals.push("owpbjs")
}
, function(e, t, n) {
    var i = n(18);
    e.exports = function(r, o, e) {
        if (i(r),
        void 0 === o)
            return r;
        switch (e) {
        case 0:
            return function() {
                return r.call(o)
            }
            ;
        case 1:
            return function(e) {
                return r.call(o, e)
            }
            ;
        case 2:
            return function(e, t) {
                return r.call(o, e, t)
            }
            ;
        case 3:
            return function(e, t, n) {
                return r.call(o, e, t, n)
            }
        }
        return function() {
            return r.apply(o, arguments)
        }
    }
}
, function(n, e, t) {
    (function(e) {
        function t(e) {
            return e && e.Math == Math && e
        }
        n.exports = t("object" == typeof globalThis && globalThis) || t("object" == typeof window && window) || t("object" == typeof self && self) || t("object" == typeof e && e) || Function("return this")()
    }
    ).call(e, t(33))
}
, function(e, t) {
    e.exports = function(e) {
        return "object" == typeof e ? null !== e : "function" == typeof e
    }
}
, function(e, t) {
    var n = {}.hasOwnProperty;
    e.exports = function(e, t) {
        return n.call(e, t)
    }
}
, function(e, t, n) {
    function r(e) {
        return "function" == typeof e ? e : void 0
    }
    var o = n(43)
      , i = n(22);
    e.exports = function(e, t) {
        return arguments.length < 2 ? r(o[e]) || r(i[e]) : o[e] && o[e][t] || i[e] && i[e][t]
    }
}
, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return u
    });
    var r = n(0)
      , s = n(41)
      , o = n(11)
      , i = n.n(o)
      , a = n(5);
    var d, c, u = (d = [],
    (c = {}).addWinningBid = function(t) {
        var e = i()(d, function(e) {
            return e.getAuctionId() === t.auctionId
        });
        e ? (t.status = a.BID_STATUS.RENDERED,
        e.addWinningBid(t)) : Object(r.logWarn)("Auction not found when adding winning bid")
    }
    ,
    c.getAllWinningBids = function() {
        return d.map(function(e) {
            return e.getWinningBids()
        }).reduce(r.flatten, [])
    }
    ,
    c.getBidsRequested = function() {
        return d.map(function(e) {
            return e.getBidRequests()
        }).reduce(r.flatten, [])
    }
    ,
    c.getNoBids = function() {
        return d.map(function(e) {
            return e.getNoBids()
        }).reduce(r.flatten, [])
    }
    ,
    c.getBidsReceived = function() {
        return d.map(function(e) {
            if (e.getAuctionStatus() === s.a)
                return e.getBidsReceived()
        }).reduce(r.flatten, []).filter(function(e) {
            return e
        })
    }
    ,
    c.getAdUnits = function() {
        return d.map(function(e) {
            return e.getAdUnits()
        }).reduce(r.flatten, [])
    }
    ,
    c.getAdUnitCodes = function() {
        return d.map(function(e) {
            return e.getAdUnitCodes()
        }).reduce(r.flatten, []).filter(r.uniques)
    }
    ,
    c.createAuction = function(e) {
        var t, n = e.adUnits, r = e.adUnitCodes, o = e.callback, i = e.cbTimeout, a = e.labels, c = e.auctionId, u = Object(s.k)({
            adUnits: n,
            adUnitCodes: r,
            callback: o,
            cbTimeout: i,
            labels: a,
            auctionId: c
        });
        return t = u,
        d.push(t),
        u
    }
    ,
    c.findBidByAdId = function(t) {
        return i()(d.map(function(e) {
            return e.getBidsReceived()
        }).reduce(r.flatten, []), function(e) {
            return e.adId === t
        })
    }
    ,
    c.getStandardBidderAdServerTargeting = function() {
        return Object(s.j)()[a.JSON_MAPPING.ADSERVER_TARGETING]
    }
    ,
    c.setStatusForBids = function(e, t) {
        var n, r = c.findBidByAdId(e);
        r && (r.status = t),
        !r || t !== a.BID_STATUS.BID_TARGETING_SET || (n = i()(d, function(e) {
            return e.getAuctionId() === r.auctionId
        })) && n.setBidTargeting(r)
    }
    ,
    c.getLastAuctionId = function() {
        return d.length && d[d.length - 1].getAuctionId()
    }
    ,
    c)
}
, function(e, t, n) {
    var r = n(28);
    e.exports = !r(function() {
        return 7 != Object.defineProperty({}, 1, {
            get: function() {
                return 7
            }
        })[1]
    })
}
, function(e, t) {
    e.exports = function(e) {
        try {
            return !!e()
        } catch (e) {
            return !0
        }
    }
}
, function(e, t, n) {
    var r = n(27)
      , o = n(31)
      , i = n(47);
    e.exports = r ? function(e, t, n) {
        return o.f(e, t, i(1, n))
    }
    : function(e, t, n) {
        return e[t] = n,
        e
    }
}
, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return r
    });
    var o = n(0);
    function i() {
        return (i = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    var a, r = (a = window,
    function() {
        try {
            var e, t = c(), n = t.length - 1, r = null !== t[n].location || 0 < n && null !== t[n - 1].referrer, o = function(e) {
                for (var t = [], n = null, r = null, o = null, i = null, a = null, c = null, u = e.length - 1; 0 <= u; u--) {
                    try {
                        r = e[u].location
                    } catch (e) {}
                    if (r)
                        t.push(r),
                        c = c || r;
                    else if (0 !== u) {
                        o = e[u - 1];
                        try {
                            i = o.referrer,
                            a = o.ancestor
                        } catch (e) {}
                        i ? (t.push(i),
                        c = c || i) : a ? (t.push(a),
                        c = c || a) : t.push(n)
                    } else
                        t.push(n)
                }
                return {
                    stack: t,
                    detectedRefererUrl: c
                }
            }(t);
            return t[t.length - 1].canonicalUrl && (e = t[t.length - 1].canonicalUrl),
            {
                referer: o.detectedRefererUrl,
                reachedTop: r,
                numIframes: n,
                stack: o.stack,
                canonicalUrl: e
            }
        } catch (e) {}
    }
    );
    function c() {
        var e = function() {
            var t, n = [];
            do {
                try {
                    t = t ? t.parent : a;
                    try {
                        var e = t == a.top
                          , r = {
                            referrer: t.document.referrer || null,
                            location: t.location.href || null,
                            isTop: e
                        };
                        e && (r = i(r, {
                            canonicalUrl: function(e) {
                                try {
                                    var t = e.querySelector("link[rel='canonical']");
                                    if (null !== t)
                                        return t.href
                                } catch (e) {}
                                return null
                            }(t.document)
                        })),
                        n.push(r)
                    } catch (e) {
                        n.push({
                            referrer: null,
                            location: null,
                            isTop: t == a.top
                        }),
                        Object(o.logWarn)("Trying to access cross domain iframe. Continuing without referrer and location")
                    }
                } catch (e) {
                    return n.push({
                        referrer: null,
                        location: null,
                        isTop: !1
                    }),
                    n
                }
            } while (t != a.top);return n
        }()
          , t = function() {
            try {
                if (!a.location.ancestorOrigins)
                    return;
                return a.location.ancestorOrigins
            } catch (e) {}
        }();
        if (t)
            for (var n = 0, r = t.length; n < r; n++)
                e[n].ancestor = t[n];
        return e
    }
}
, function(e, t, n) {
    var r = n(27)
      , o = n(74)
      , i = n(15)
      , a = n(56)
      , c = Object.defineProperty;
    t.f = r ? c : function(e, t, n) {
        if (i(e),
        t = a(t, !0),
        i(n),
        o)
            try {
                return c(e, t, n)
            } catch (e) {}
        if ("get"in n || "set"in n)
            throw TypeError("Accessors not supported");
        return "value"in n && (e[t] = n.value),
        e
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function(e, t) {
        return new r(e,t)
    }
    ;
    var o = n(0);
    function r(e, t) {
        var n = t && t.src || "client"
          , r = e || 0;
        this.bidderCode = t && t.bidder || "",
        this.width = 0,
        this.height = 0,
        this.statusMessage = function() {
            switch (r) {
            case 0:
                return "Pending";
            case 1:
                return "Bid available";
            case 2:
                return "Bid returned empty or error response";
            case 3:
                return "Bid timed out"
            }
        }(),
        this.adId = o.getUniqueIdentifierStr(),
        this.requestId = t && t.bidId,
        this.mediaType = "banner",
        this.source = n,
        this.getStatusCode = function() {
            return r
        }
        ,
        this.getSize = function() {
            return this.width + "x" + this.height
        }
    }
}
, function(e, t) {
    var n = function() {
        return this
    }();
    try {
        n = n || Function("return this")() || (0,
        eval)("this")
    } catch (e) {
        "object" == typeof window && (n = window)
    }
    e.exports = n
}
, function(e, t, n) {
    var r = n(16)
      , o = n(91);
    e.exports = r ? o : function(e) {
        return Set.prototype.values.call(e)
    }
}
, function(e, t, n) {
    "use strict";
    n.d(t, "e", function() {
        return i
    }),
    n.d(t, "a", function() {
        return s
    }),
    t.g = function(e) {
        if (e && e.type && function(e) {
            return !(!e || !c()(Object.keys(d), e)) || (Object(a.logError)("".concat(e, " nativeParam is not supported")),
            !1)
        }(e.type))
            return d[e.type];
        return e
    }
    ,
    t.f = function(t, e) {
        var n = Object(a.getBidRequest)(t.requestId, e);
        if (!n)
            return !1;
        if (!Object(a.deepAccess)(t, "native.clickUrl"))
            return !1;
        if (Object(a.deepAccess)(t, "native.image") && (!Object(a.deepAccess)(t, "native.image.height") || !Object(a.deepAccess)(t, "native.image.width")))
            return !1;
        if (Object(a.deepAccess)(t, "native.icon") && (!Object(a.deepAccess)(t, "native.icon.height") || !Object(a.deepAccess)(t, "native.icon.width")))
            return !1;
        var r = n.nativeParams;
        if (!r)
            return !0;
        var o = Object.keys(r).filter(function(e) {
            return r[e].required
        })
          , i = Object.keys(t.native).filter(function(e) {
            return t.native[e]
        });
        return o.every(function(e) {
            return c()(i, e)
        })
    }
    ,
    t.b = function(e, t) {
        var n;
        "click" === e.action ? n = t.native && t.native.clickTrackers : (n = t.native && t.native.impressionTrackers,
        t.native && t.native.javascriptTrackers && Object(a.insertHtmlIntoIframe)(t.native.javascriptTrackers));
        return (n || []).forEach(a.triggerPixel),
        e.action
    }
    ,
    t.d = function(r, o) {
        var i = {};
        return Object.keys(r.native).forEach(function(e) {
            var t = u.NATIVE_KEYS[e]
              , n = f(r.native[e]);
            Object(a.deepAccess)(o, "mediaTypes.native.".concat(e, ".sendId")) && (n = "".concat(t, ":").concat(r.adId)),
            t && n && (i[t] = n)
        }),
        i
    }
    ,
    t.c = function(e, r) {
        var o = {
            message: "assetResponse",
            adId: e.adId,
            assets: []
        };
        return e.assets.forEach(function(e) {
            var t = Object(a.getKeyByValue)(u.NATIVE_KEYS, e)
              , n = f(r.native[t]);
            o.assets.push({
                key: t,
                value: n
            })
        }),
        o
    }
    ;
    var a = n(0)
      , r = n(12)
      , c = n.n(r);
    function o(e) {
        return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    var u = n(5)
      , i = []
      , s = Object.keys(u.NATIVE_KEYS).map(function(e) {
        return u.NATIVE_KEYS[e]
    })
      , d = {
        image: {
            image: {
                required: !0
            },
            title: {
                required: !0
            },
            sponsoredBy: {
                required: !0
            },
            clickUrl: {
                required: !0
            },
            body: {
                required: !1
            },
            icon: {
                required: !1
            }
        }
    };
    function f(e) {
        return "object" === o(e) && e.url ? e.url : e
    }
}
, function(e, t, n) {
    "use strict";
    n.d(t, "b", function() {
        return c
    }),
    n.d(t, "a", function() {
        return u
    }),
    t.d = function(e, t) {
        var n = Object(i.getBidRequest)(e.requestId, t)
          , r = n && Object(i.deepAccess)(n, "mediaTypes.video")
          , o = r && Object(i.deepAccess)(r, "context");
        return s(e, n, r, o)
    }
    ,
    n.d(t, "c", function() {
        return s
    });
    n(7);
    var i = n(0)
      , o = n(3)
      , r = n(12)
      , a = (n.n(r),
    n(13))
      , c = "outstream"
      , u = "instream";
    var s = Object(a.b)("sync", function(e, t, n, r) {
        return !t || n && r !== c ? o.b.getConfig("cache.url") || !e.vastXml || e.vastUrl ? !(!e.vastUrl && !e.vastXml) : (Object(i.logError)('\n        This bid contains only vastXml and will not work when a prebid cache url is not specified.\n        Try enabling prebid cache with owpbjs.setConfig({ cache: {url: "..."} });\n      '),
        !1) : r !== c || !(!e.renderer && !t.renderer)
    }, "checkVideoBidSetup")
}
, function(e, t) {
    e.exports = {}
}
, function(e, t, n) {
    var o = n(15)
      , i = n(18)
      , a = n(19)("species");
    e.exports = function(e, t) {
        var n, r = o(e).constructor;
        return void 0 === r || null == (n = o(r)[a]) ? t : i(n)
    }
}
, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return S
    });
    var a = n(0)
      , r = n(3)
      , o = n(12)
      , i = n.n(o)
      , c = n(9);
    function u(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
                return;
            var n = []
              , r = !0
              , o = !1
              , i = void 0;
            try {
                for (var a, c = e[Symbol.iterator](); !(r = (a = c.next()).done) && (n.push(a.value),
                !t || n.length !== t); r = !0)
                    ;
            } catch (e) {
                o = !0,
                i = e
            } finally {
                try {
                    r || null == c.return || c.return()
                } finally {
                    if (o)
                        throw i
                }
            }
            return n
        }(e, t) || function(e, t) {
            if (!e)
                return;
            if ("string" == typeof e)
                return s(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            "Object" === n && e.constructor && (n = e.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(e);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return s(e, t)
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function s(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    function d() {
        return (d = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    r.b.setDefaults({
        userSync: a.deepClone({
            syncEnabled: !0,
            filterSettings: {
                image: {
                    bidders: "*",
                    filter: "include"
                }
            },
            syncsPerBidder: 5,
            syncDelay: 3e3,
            auctionDelay: 0
        })
    });
    var f = Object(c.a)("usersync");
    var l, p, g, y, b, v, h, m = !a.isSafariBrowser() && f.cookiesAreEnabled(), S = (l = {
        config: r.b.getConfig("userSync"),
        browserSupportsCookies: m
    },
    p = {},
    g = A(),
    y = new Set,
    v = {
        image: !0,
        iframe: !(b = {})
    },
    h = l.config,
    r.b.getConfig("userSync", function(e) {
        var t;
        e.userSync && (t = e.userSync.filterSettings,
        a.isPlainObject(t) && (t.image || t.all || (e.userSync.filterSettings.image = {
            bidders: "*",
            filter: "include"
        }))),
        h = d(h, e.userSync)
    }),
    p.registerSync = function(e, t, n) {
        return y.has(t) ? a.logMessage('already fired syncs for "'.concat(t, '", ignoring registerSync call')) : h.syncEnabled && a.isArray(g[e]) ? t ? 0 !== h.syncsPerBidder && Number(b[t]) >= h.syncsPerBidder ? a.logWarn('Number of user syncs exceeded for "'.concat(t, '"')) : p.canBidderRegisterSync(e, t) ? (g[e].push([t, n]),
        (r = b)[o = t] ? r[o] += 1 : r[o] = 1,
        void (b = r)) : a.logWarn('Bidder "'.concat(t, '" not permitted to register their "').concat(e, '" userSync pixels.')) : a.logWarn("Bidder is required for registering sync") : a.logWarn('User sync type "'.concat(e, '" not supported'));
        var r, o
    }
    ,
    p.syncUsers = function() {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
        if (e)
            return setTimeout(E, Number(e));
        E()
    }
    ,
    p.triggerUserSyncs = function() {
        h.enableOverride && p.syncUsers()
    }
    ,
    p.canBidderRegisterSync = function(e, t) {
        return !h.filterSettings || !w(e, t)
    }
    ,
    p);
    function A() {
        return {
            image: [],
            iframe: []
        }
    }
    function E() {
        if (h.syncEnabled && l.browserSupportsCookies) {
            try {
                !function() {
                    if (!v.image)
                        return;
                    O(g.image, function(e) {
                        var t = u(e, 2)
                          , n = t[0]
                          , r = t[1];
                        a.logMessage("Invoking image pixel user sync for bidder: ".concat(n)),
                        a.triggerPixel(r)
                    })
                }(),
                function() {
                    if (!v.iframe)
                        return;
                    O(g.iframe, function(e) {
                        var t = u(e, 2)
                          , n = t[0]
                          , r = t[1];
                        a.logMessage("Invoking iframe user sync for bidder: ".concat(n)),
                        a.insertUserSyncIframe(r)
                    })
                }()
            } catch (e) {
                return a.logError("Error firing user syncs", e)
            }
            g = A()
        }
    }
    function O(e, t) {
        a.shuffle(e).forEach(function(e) {
            t(e),
            y.add(e[0])
        })
    }
    function w(e, t) {
        var n = h.filterSettings;
        if (function(e, t) {
            if (e.all && e[t])
                return a.logWarn('Detected presence of the "filterSettings.all" and "filterSettings.'.concat(t, '" in userSync config.  You cannot mix "all" with "iframe/image" configs; they are mutually exclusive.')),
                !1;
            var n = e.all ? e.all : e[t]
              , r = e.all ? "all" : t;
            if (!n)
                return !1;
            var o = n.filter
              , i = n.bidders;
            if (o && "include" !== o && "exclude" !== o)
                return a.logWarn('UserSync "filterSettings.'.concat(r, ".filter\" setting '").concat(o, "' is not a valid option; use either 'include' or 'exclude'.")),
                !1;
            return !!("*" === i || Array.isArray(i) && 0 < i.length && i.every(function(e) {
                return a.isStr(e) && "*" !== e
            })) || (a.logWarn('Detected an invalid setup in userSync "filterSettings.'.concat(r, ".bidders\"; use either '*' (to represent all bidders) or an array of bidders.")),
            !1)
        }(n, e)) {
            v[e] = !0;
            var r = n.all ? n.all : n[e]
              , o = "*" === r.bidders ? [t] : r.bidders;
            return {
                include: function(e, t) {
                    return !i()(e, t)
                },
                exclude: function(e, t) {
                    return i()(e, t)
                }
            }[r.filter || "include"](o, t)
        }
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function(r, e, t) {
        if (!e || !r)
            return void i.logError("cannot load external script without url and moduleCode");
        if (!o()(c, e))
            return void i.logError("".concat(e, " not whitelisted for loading external JavaScript"));
        if (a[r])
            return t && "function" == typeof t && (a[r].loaded ? t() : a[r].callbacks.push(t)),
            a[r].tag;
        a[r] = {
            loaded: !1,
            tag: null,
            callbacks: []
        },
        t && "function" == typeof t && a[r].callbacks.push(t);
        return i.logWarn("module ".concat(e, " is loading external JavaScript")),
        function(e, t) {
            var n = document.createElement("script");
            n.type = "text/javascript",
            n.async = !0,
            (a[r].tag = n).readyState ? n.onreadystatechange = function() {
                "loaded" !== n.readyState && "complete" !== n.readyState || (n.onreadystatechange = null,
                t())
            }
            : n.onload = function() {
                t()
            }
            ;
            return n.src = e,
            i.insertElement(n),
            n
        }(r, function() {
            a[r].loaded = !0;
            try {
                for (var e = 0; e < a[r].callbacks.length; e++)
                    a[r].callbacks[e]()
            } catch (e) {
                i.logError("Error executing callback", "adloader.js:loadExternalScript", e)
            }
        })
    }
    ;
    var r = n(12)
      , o = n.n(r)
      , i = n(0)
      , a = {}
      , c = ["criteo", "outstream", "adagio", "browsi"]
}
, function(e, t, n) {
    "use strict";
    n.d(t, "b", function() {
        return F
    }),
    n.d(t, "a", function() {
        return W
    }),
    t.k = function(e) {
        var t, o, y, b, i = e.adUnits, n = e.adUnitCodes, r = e.callback, a = e.cbTimeout, c = e.labels, u = e.auctionId, v = i, s = c, d = n, h = [], f = [], l = [], p = u || D.generateUUID(), g = r, m = a, S = [], A = new Set;
        function E() {
            return {
                auctionId: p,
                timestamp: t,
                auctionEnd: o,
                auctionStatus: y,
                adUnits: v,
                adUnitCodes: d,
                labels: s,
                bidderRequests: h,
                noBids: l,
                bidsReceived: f,
                winningBids: S,
                timeout: m
            }
        }
        function O(n, e) {
            var r, t;
            e && clearTimeout(b),
            void 0 === o && (r = [],
            n && (D.logMessage("Auction ".concat(p, " timedOut")),
            t = A,
            (r = h.map(function(e) {
                return (e.bids || []).filter(function(e) {
                    return !t.has(e.bidder)
                })
            }).reduce(j.flatten, []).map(function(e) {
                return {
                    bidId: e.bidId,
                    bidder: e.bidder,
                    adUnitCode: e.adUnitCode,
                    auctionId: e.auctionId
                }
            })).length && M.emit(q.EVENTS.BID_TIMEOUT, r)),
            y = W,
            o = Date.now(),
            M.emit(q.EVENTS.AUCTION_END, E()),
            $(v, function() {
                try {
                    var e;
                    null != g && (e = f.filter(D.bind.call(j.adUnitsFilter, this, d)).reduce(Z, {}),
                    g.apply(owpbjs, [e, n, p]),
                    g = null)
                } catch (e) {
                    D.logError("Error executing bidsBackHandler", null, e)
                } finally {
                    r.length && N.callTimedOutBidders(i, r, m);
                    var t = U.b.getConfig("userSync") || {};
                    t.enableOverride || k(t.syncDelay)
                }
            }))
        }
        function w() {
            D.logInfo("Bids Received for Auction with id: ".concat(p), f),
            y = W,
            O(!1, !0)
        }
        function T(e) {
            A.add(e)
        }
        function I(d) {
            var f = this;
            d.forEach(function(e) {
                var t;
                t = e,
                h = h.concat(t)
            });
            var l = {}
              , e = {
                bidRequests: d,
                run: function() {
                    var e, t;
                    e = O.bind(null, !0),
                    t = setTimeout(e, m),
                    b = t,
                    y = F,
                    M.emit(q.EVENTS.AUCTION_INIT, E());
                    var n, r, o, i, a, c, u = (n = w,
                    r = f,
                    o = 0,
                    i = !1,
                    a = new Set,
                    c = {},
                    {
                        addBidResponse: function(e, t) {
                            c[t.requestId] = !0,
                            o++;
                            var n = function(e) {
                                var t = e.adUnitCode
                                  , n = e.bid
                                  , r = e.bidderRequest
                                  , o = e.auctionId
                                  , i = r.start
                                  , a = R({}, n, {
                                    auctionId: o,
                                    responseTimestamp: Object(j.timestamp)(),
                                    requestTimestamp: i,
                                    cpm: parseFloat(n.cpm) || 0,
                                    bidder: n.bidderCode,
                                    adUnitCode: t
                                });
                                a.timeToRespond = a.responseTimestamp - a.requestTimestamp,
                                M.emit(q.EVENTS.BID_ADJUSTMENT, a);
                                var c = r.bids && _()(r.bids, function(e) {
                                    return e.adUnitCode == t
                                })
                                  , u = c && c.renderer;
                                u && u.url && (a.renderer = x.a.install({
                                    url: u.url
                                }),
                                a.renderer.setRender(u.render));
                                var s = X(n.mediaType, c, U.b.getConfig("mediaTypePriceGranularity"))
                                  , d = Object(C.a)(a.cpm, "object" === P(s) ? s : U.b.getConfig("customPriceBucket"), U.b.getConfig("currency.granularityMultiplier"));
                                return a.pbLg = d.low,
                                a.pbMg = d.med,
                                a.pbHg = d.high,
                                a.pbAg = d.auto,
                                a.pbDg = d.dense,
                                a.pbCg = d.custom,
                                a
                            }({
                                adUnitCode: e,
                                bid: t,
                                bidderRequest: this,
                                auctionId: r.getAuctionId()
                            });
                            "video" === n.mediaType ? function(e, t, n, r) {
                                var o = !0
                                  , i = Object(j.getBidRequest)(t.requestId, [n])
                                  , a = i && Object(j.deepAccess)(i, "mediaTypes.video")
                                  , c = a && Object(j.deepAccess)(a, "context");
                                U.b.getConfig("cache.url") && c !== B.b && (t.videoCacheKey ? t.vastUrl || (D.logError("videoCacheKey specified but not required vastUrl for video bid"),
                                o = !1) : (o = !1,
                                Q(e, t, r, i))),
                                o && (Y(e, t),
                                r())
                            }(r, n, this, s) : (Y(r, n),
                            s())
                        },
                        adapterDone: function() {
                            a.add(this),
                            i = r.getBidRequests().every(function(e) {
                                return a.has(e)
                            }),
                            this.bids.forEach(function(e) {
                                c[e.bidId] || (r.addNoBid(e),
                                M.emit(q.EVENTS.NO_BID, e))
                            }),
                            i && 0 === o && n()
                        }
                    });
                    function s() {
                        o--,
                        i && 0 === o && n()
                    }
                    N.callBids(v, d, function() {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        J.apply({
                            dispatch: u.addBidResponse,
                            bidderRequest: this
                        }, t)
                    }, u.adapterDone, {
                        request: function(e, t) {
                            g(z, t),
                            g(l, e),
                            V[e] || (V[e] = {
                                SRA: !0,
                                origin: t
                            }),
                            1 < l[e] && (V[e].SRA = !1)
                        },
                        done: function(e) {
                            z[e]--,
                            H[0] && p(H[0]) && H.shift()
                        }
                    }, m, T)
                }
            };
            function p(e) {
                var r = !0
                  , o = U.b.getConfig("maxRequestsPerOrigin") || L;
                return e.bidRequests.some(function(e) {
                    var t = 1
                      , n = void 0 !== e.src && e.src === q.S2S.SRC ? "s2s" : e.bidderCode;
                    return V[n] && (!1 === V[n].SRA && (t = Math.min(e.bids.length, o)),
                    z[V[n].origin] + t > o && (r = !1)),
                    !r
                }),
                r && e.run(),
                r
            }
            function g(e, t) {
                void 0 === e[t] ? e[t] = 1 : e[t]++
            }
            p(e) || (D.logWarn("queueing auction due to limited endpoint capacity"),
            H.push(e))
        }
        return {
            addBidReceived: function(e) {
                f = f.concat(e)
            },
            addNoBid: function(e) {
                l = l.concat(e)
            },
            executeCallback: O,
            callBids: function() {
                y = G,
                t = Date.now();
                var e = N.makeBidRequests(v, t, p, m, s);
                D.logInfo("Bids Requested for Auction with id: ".concat(p), e),
                e.length < 1 ? (D.logWarn("No valid bid requests returned for auction"),
                w()) : K.call({
                    dispatch: I,
                    context: this
                }, e)
            },
            addWinningBid: function(e) {
                S = S.concat(e),
                N.callBidWonBidder(e.bidder, e, i)
            },
            setBidTargeting: function(e) {
                N.callSetTargetingBidder(e.bidder, e)
            },
            getWinningBids: function() {
                return S
            },
            getTimeout: function() {
                return m
            },
            getAuctionId: function() {
                return p
            },
            getAuctionStatus: function() {
                return y
            },
            getAdUnits: function() {
                return v
            },
            getAdUnitCodes: function() {
                return d
            },
            getBidRequests: function() {
                return h
            },
            getBidsReceived: function() {
                return f
            },
            getNoBids: function() {
                return l
            }
        }
    }
    ,
    n.d(t, "c", function() {
        return J
    }),
    n.d(t, "e", function() {
        return K
    }),
    t.g = s,
    t.d = Y,
    n.d(t, "f", function() {
        return Q
    }),
    n.d(t, "i", function() {
        return d
    }),
    n.d(t, "h", function() {
        return f
    }),
    t.j = l;
    var j = n(0)
      , C = n(46)
      , a = n(35)
      , i = n(102)
      , x = n(10)
      , U = n(3)
      , r = n(39)
      , o = n(13)
      , c = n(11)
      , _ = n.n(c)
      , B = n(36)
      , u = n(2);
    function P(e) {
        return (P = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    function R() {
        return (R = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    var k = r.a.syncUsers
      , D = n(0)
      , N = n(7).default
      , M = n(8)
      , q = n(5)
      , G = "started"
      , F = "inProgress"
      , W = "completed";
    M.on(q.EVENTS.BID_ADJUSTMENT, function(e) {
        !function(e) {
            var t, n = e.bidderCode, r = e.cpm;
            if (owpbjs.bidderSettings && (n && owpbjs.bidderSettings[n] && "function" == typeof owpbjs.bidderSettings[n].bidCpmAdjustment ? t = owpbjs.bidderSettings[n].bidCpmAdjustment : owpbjs.bidderSettings[q.JSON_MAPPING.BD_SETTING_STANDARD] && "function" == typeof owpbjs.bidderSettings[q.JSON_MAPPING.BD_SETTING_STANDARD].bidCpmAdjustment && (t = owpbjs.bidderSettings[q.JSON_MAPPING.BD_SETTING_STANDARD].bidCpmAdjustment),
            t))
                try {
                    r = t(e.cpm, R({}, e))
                } catch (e) {
                    D.logError("Error during bid adjustment", "bidmanager.js", e)
                }
            0 <= r && (e.cpm = r)
        }(e)
    });
    var L = 4
      , z = {}
      , V = {}
      , H = [];
    var J = Object(o.b)("async", function(e, t) {
        this.dispatch.call(this.bidderRequest, e, t)
    }, "addBidResponse")
      , K = Object(o.b)("sync", function(e) {
        this.dispatch.call(this.context, e)
    }, "addBidderRequests")
      , $ = Object(o.b)("async", function(e, t) {
        t && t()
    }, "bidsBackCallback");
    function s(e, t) {
        t.timeToRespond > e.getTimeout() + U.b.getConfig("timeoutBuffer") && e.executeCallback(!0)
    }
    function Y(e, t) {
        var n = e.getBidRequests()
          , r = _()(n, function(e) {
            return e.bidderCode === t.bidderCode
        });
        !function(t, e) {
            var n;
            {
                var r;
                t.bidderCode && (0 < t.cpm || t.dealId) && (r = _()(e.bids, function(e) {
                    return e.adUnitCode === t.adUnitCode
                }),
                n = function(e, t, n) {
                    if (!t)
                        return {};
                    var r = {}
                      , o = owpbjs.bidderSettings;
                    {
                        var i;
                        o && (i = l(t.mediaType, e, n),
                        p(r, i, t),
                        e && o[e] && o[e][q.JSON_MAPPING.ADSERVER_TARGETING] && (p(r, o[e], t),
                        t.sendStandardTargeting = o[e].sendStandardTargeting))
                    }
                    t.native && (r = R({}, r, Object(a.d)(t, n)));
                    return r
                }(t.bidderCode, t, r))
            }
            t.adserverTargeting = R(t.adserverTargeting || {}, n)
        }(t, r),
        M.emit(q.EVENTS.BID_RESPONSE, t),
        e.addBidReceived(t),
        s(e, t)
    }
    var Q = Object(o.b)("async", function(n, r, o, e) {
        Object(i.b)([r], function(e, t) {
            e ? (D.logWarn("Failed to save to the video cache: ".concat(e, ". Video bid must be discarded.")),
            s(n, r)) : "" === t[0].uuid ? (D.logWarn("Supplied video cache key was already in use by Prebid Cache; caching attempt was rejected. Video bid must be discarded."),
            s(n, r)) : (r.videoCacheKey = t[0].uuid,
            r.vastUrl || (r.vastUrl = Object(i.a)(r.videoCacheKey)),
            Y(n, r),
            o())
        }, e)
    }, "callPrebidCache");
    function X(e, t, n) {
        if (e && n) {
            if (e === u.d) {
                var r = Object(j.deepAccess)(t, "mediaTypes.".concat(u.d, ".context"), "instream");
                if (n["".concat(u.d, "-").concat(r)])
                    return n["".concat(u.d, "-").concat(r)]
            }
            return n[e]
        }
    }
    var d = function(e, t) {
        var n = X(e, t, U.b.getConfig("mediaTypePriceGranularity"));
        return "string" == typeof e && n ? "string" == typeof n ? n : "custom" : U.b.getConfig("priceGranularity")
    }
      , f = function(t) {
        return function(e) {
            return t === q.GRANULARITY_OPTIONS.AUTO ? e.pbAg : t === q.GRANULARITY_OPTIONS.DENSE ? e.pbDg : t === q.GRANULARITY_OPTIONS.LOW ? e.pbLg : t === q.GRANULARITY_OPTIONS.MEDIUM ? e.pbMg : t === q.GRANULARITY_OPTIONS.HIGH ? e.pbHg : t === q.GRANULARITY_OPTIONS.CUSTOM ? e.pbCg : void 0
        }
    };
    function l(e, t, n) {
        function r(e, t) {
            return {
                key: e,
                val: "function" == typeof t ? function(e) {
                    return t(e)
                }
                : function(e) {
                    return Object(j.getValue)(e, t)
                }
            }
        }
        var o, i, a = q.TARGETING_KEYS, c = d(e, n), u = owpbjs.bidderSettings;
        return u[q.JSON_MAPPING.BD_SETTING_STANDARD] || (u[q.JSON_MAPPING.BD_SETTING_STANDARD] = {}),
        u[q.JSON_MAPPING.BD_SETTING_STANDARD][q.JSON_MAPPING.ADSERVER_TARGETING] || (u[q.JSON_MAPPING.BD_SETTING_STANDARD][q.JSON_MAPPING.ADSERVER_TARGETING] = [r(a.BIDDER, "bidderCode"), r(a.AD_ID, "adId"), r(a.PRICE_BUCKET, f(c)), r(a.SIZE, "size"), r(a.DEAL, "dealId"), r(a.SOURCE, "source"), r(a.FORMAT, "mediaType")]),
        "video" === e && (o = u[q.JSON_MAPPING.BD_SETTING_STANDARD][q.JSON_MAPPING.ADSERVER_TARGETING],
        [a.UUID, a.CACHE_ID].forEach(function(t) {
            void 0 === _()(o, function(e) {
                return e.key === t
            }) && o.push(r(t, "videoCacheKey"))
        }),
        !U.b.getConfig("cache.url") || t && !1 === D.deepAccess(u, "".concat(t, ".sendStandardTargeting")) || (i = Object(j.parseUrl)(U.b.getConfig("cache.url")),
        void 0 === _()(o, function(e) {
            return e.key === a.CACHE_HOST
        }) && o.push(r(a.CACHE_HOST, function(e) {
            return D.deepAccess(e, "adserverTargeting.".concat(a.CACHE_HOST)) ? e.adserverTargeting[a.CACHE_HOST] : i.hostname
        })))),
        u[q.JSON_MAPPING.BD_SETTING_STANDARD]
    }
    function p(r, o, i) {
        var e = o[q.JSON_MAPPING.ADSERVER_TARGETING];
        return i.size = i.getSize(),
        D._each(e, function(e) {
            var t = e.key
              , n = e.val;
            if (r[t] && D.logWarn("The key: " + t + " is getting ovewritten"),
            D.isFn(n))
                try {
                    n = n(i)
                } catch (e) {
                    D.logError("bidmanager", "ERROR", e)
                }
            (void 0 === o.suppressEmptyKeys || !0 !== o.suppressEmptyKeys) && t !== q.TARGETING_KEYS.DEAL || !D.isEmptyStr(n) && null != n ? r[t] = n : D.logInfo("suppressing empty key '" + t + "' from adserver targeting")
        }),
        r
    }
    function Z(e, t) {
        return e[t.adUnitCode] || (e[t.adUnitCode] = {
            bids: []
        }),
        e[t.adUnitCode].bids.push(t),
        e
    }
}
, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return p
    });
    var v = n(0)
      , h = n(3)
      , m = n(35)
      , r = n(26)
      , o = n(101)
      , i = n(2)
      , a = n(12)
      , S = n.n(a);
    function A() {
        return (A = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    function E(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n,
        e
    }
    function O(e) {
        return function(e) {
            if (Array.isArray(e))
                return c(e)
        }(e) || function(e) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                return Array.from(e)
        }(e) || function(e, t) {
            if (!e)
                return;
            if ("string" == typeof e)
                return c(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            "Object" === n && e.constructor && (n = e.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(e);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return c(e, t)
        }(e) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    var u = n(0)
      , w = n(5)
      , T = []
      , I = Object.keys(w.TARGETING_KEYS).map(function(e) {
        return w.TARGETING_KEYS[e]
    })
      , s = function(e) {
        return e.responseTimestamp + 1e3 * e.ttl + 1e3 > Object(v.timestamp)()
    }
      , d = function(e) {
        return e && (e.status && !S()([w.BID_STATUS.RENDERED], e.status) || !e.status)
    };
    function j(e, r, t) {
        var o = 2 < arguments.length && void 0 !== t ? t : 0
          , i = []
          , a = h.b.getConfig("sendBidsControl.dealPrioritization")
          , c = Object(v.groupBy)(e, "adUnitCode");
        return Object.keys(c).forEach(function(e) {
            var t = []
              , n = Object(v.groupBy)(c[e], "bidderCode");
            Object.keys(n).forEach(function(e) {
                return t.push(n[e].reduce(r))
            }),
            0 < o ? (t = a ? t(C(!0)) : t.sort(function(e, t) {
                return t.cpm - e.cpm
            }),
            i.push.apply(i, O(t.slice(0, o)))) : i.push.apply(i, O(t))
        }),
        i
    }
    function C(e) {
        var n = 0 < arguments.length && void 0 !== e && e;
        return function(e, t) {
            return void 0 !== e.adUnitTargeting.hb_deal && void 0 === t.adUnitTargeting.hb_deal ? -1 : void 0 === e.adUnitTargeting.hb_deal && void 0 !== t.adUnitTargeting.hb_deal ? 1 : n ? t.cpm - e.cpm : t.adUnitTargeting.hb_pb - e.adUnitTargeting.hb_pb
        }
    }
    var f, x, l, p = (f = r.a,
    l = {},
    (x = {}).setLatestAuctionForAdUnit = function(e, t) {
        l[e] = t
    }
    ,
    x.resetPresetTargeting = function(e, t) {
        var n, o;
        Object(v.isGptPubadsDefined)() && (n = _(e),
        o = f.getAdUnits().filter(function(e) {
            return S()(n, e.code)
        }),
        window.googletag.pubads().getSlots().forEach(function(n) {
            var r = u.isFn(t) && t(n);
            T.forEach(function(t) {
                o.forEach(function(e) {
                    (e.code === n.getAdUnitPath() || e.code === n.getSlotElementId() || u.isFn(r) && r(e.code)) && n.setTargeting(t, null)
                })
            })
        }))
    }
    ,
    x.resetPresetTargetingAST = function(e) {
        _(e).forEach(function(e) {
            var t, n, r = window.apntag.getTag(e);
            r && r.keywords && (t = Object.keys(r.keywords),
            n = {},
            t.forEach(function(e) {
                S()(T, e.toLowerCase()) || (n[e] = r.keywords[e])
            }),
            window.apntag.modifyTag(e, {
                keywords: n
            }))
        })
    }
    ,
    x.getAllTargeting = function(e) {
        var n, t, r, o, i, a, c, u, s, d = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : B(), f = _(e), l = (a = f,
        c = d,
        u = x.getWinningBids(a, c),
        s = P(),
        (u = u.map(function(i) {
            return E({}, i.adUnitCode, Object.keys(i.adserverTargeting).filter(function(e) {
                return void 0 === i.sendStandardTargeting || i.sendStandardTargeting || -1 === s.indexOf(e)
            }).reduce(function(e, t) {
                var n = [i.adserverTargeting[t]]
                  , r = E({}, t.substring(0, 20), n);
                if (t !== w.TARGETING_KEYS.DEAL)
                    return [].concat(O(e), [r]);
                var o = E({}, "".concat(t, "_").concat(i.bidderCode).substring(0, 20), n);
                return [].concat(O(e), [r, o])
            }, []))
        })).concat((i = f,
        d.filter(function(e) {
            return S()(i, e.adUnitCode)
        }).map(function(e) {
            return A({}, e)
        }).reduce(R, []).map(k).filter(function(e) {
            return e
        }))).concat(h.b.getConfig("enableSendAllBids") ? (n = f,
        t = d,
        r = I.concat(m.a),
        o = h.b.getConfig("sendBidsControl.bidLimit"),
        j(t, v.getHighestCpm, o).map(function(t) {
            if (U(t, n))
                return E({}, t.adUnitCode, D(t, r.filter(function(e) {
                    return void 0 !== t.adserverTargeting[e]
                })))
        }).filter(function(e) {
            return e
        })) : function(e, t) {
            if (!0 !== h.b.getConfig("targetingControls.alwaysIncludeDeals"))
                return [];
            var n = I.concat(m.a);
            return j(t, v.getHighestCpm).map(function(t) {
                if (t.dealId && U(t, e))
                    return E({}, t.adUnitCode, D(t, n.filter(function(e) {
                        return void 0 !== t.adserverTargeting[e]
                    })))
            }).filter(function(e) {
                return e
            })
        }(f, d)));
        l.map(function(t) {
            Object.keys(t).map(function(e) {
                t[e].map(function(e) {
                    -1 === T.indexOf(Object.keys(e)[0]) && (T = Object.keys(e).concat(T))
                })
            })
        }),
        l = l.map(function(e) {
            return E({}, Object.keys(e)[0], e[Object.keys(e)[0]].map(function(e) {
                return E({}, Object.keys(e)[0], e[Object.keys(e)[0]].join(", "))
            }).reduce(function(e, t) {
                return A(t, e)
            }, {}))
        }).reduce(function(e, t) {
            var n = Object.keys(t)[0];
            return e[n] = A({}, e[n], t[n]),
            e
        }, {});
        var p, g, y, b = h.b.getConfig("targetingControls.auctionKeyMaxChars");
        return b && (Object(v.logInfo)("Detected 'targetingControls.auctionKeyMaxChars' was active for this auction; set with a limit of ".concat(b, " characters.  Running checks on auction keys...")),
        p = l,
        g = b,
        y = Object(v.deepClone)(p),
        l = Object.keys(y).map(function(e) {
            return {
                adUnitCode: e,
                adUnitTargeting: y[e]
            }
        }).sort(C()).reduce(function(e, t, n, r) {
            var o, i = (o = t.adUnitTargeting,
            Object.keys(o).reduce(function(e, t) {
                return e + "".concat(t, "%3d").concat(encodeURIComponent(o[t]), "%26")
            }, ""));
            n + 1 === r.length && (i = i.slice(0, -3));
            var a = t.adUnitCode
              , c = i.length;
            return c <= g ? (g -= c,
            Object(v.logInfo)("AdUnit '".concat(a, "' auction keys comprised of ").concat(c, " characters.  Deducted from running threshold; new limit is ").concat(g), y[a]),
            e[a] = y[a]) : Object(v.logWarn)("The following keys for adUnitCode '".concat(a, "' exceeded the current limit of the 'auctionKeyMaxChars' setting.\nThe key-set size was ").concat(c, ", the current allotted amount was ").concat(g, ".\n"), y[a]),
            n + 1 === r.length && 0 === Object.keys(e).length && Object(v.logError)("No auction targeting keys were permitted due to the setting in setConfig(targetingControls.auctionKeyMaxChars).  Please review setup and consider adjusting."),
            e
        }, {})),
        f.forEach(function(e) {
            l[e] || (l[e] = {})
        }),
        l
    }
    ,
    x.setTargetingForGPT = function(o, e) {
        window.googletag.pubads().getSlots().forEach(function(r) {
            Object.keys(o).filter((e || Object(v.isAdUnitCodeMatchingSlot))(r)).forEach(function(n) {
                return Object.keys(o[n]).forEach(function(t) {
                    var e = o[n][t].split(",");
                    (e = 1 < e.length ? [e] : e).map(function(e) {
                        return u.logMessage("Attempting to set key value for slot: ".concat(r.getSlotElementId(), " key: ").concat(t, " value: ").concat(e)),
                        e
                    }).forEach(function(e) {
                        r.setTargeting(t, e)
                    })
                })
            })
        })
    }
    ,
    x.getWinningBids = function(e) {
        var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : B()
          , t = _(e);
        return n.filter(function(e) {
            return S()(t, e.adUnitCode)
        }).filter(function(e) {
            return 0 < e.cpm
        }).map(function(e) {
            return e.adUnitCode
        }).filter(v.uniques).map(function(t) {
            return n.filter(function(e) {
                return e.adUnitCode === t ? e : null
            }).reduce(v.getHighestCpm)
        })
    }
    ,
    x.setTargetingForAst = function(e) {
        var r = x.getAllTargeting(e);
        try {
            x.resetPresetTargetingAST(e)
        } catch (e) {
            u.logError("unable to reset targeting for AST" + e)
        }
        Object.keys(r).forEach(function(n) {
            return Object.keys(r[n]).forEach(function(e) {
                var t;
                u.logMessage("Attempting to set targeting for targetId: ".concat(n, " key: ").concat(e, " value: ").concat(r[n][e])),
                (u.isStr(r[n][e]) || u.isArray(r[n][e])) && (t = {},
                e.search(/pt[0-9]/) < 0 ? t[e.toUpperCase()] = r[n][e] : t[e] = r[n][e],
                window.apntag.setKeywords(n, t, {
                    overrideKeyValue: !0
                }))
            })
        })
    }
    ,
    x.isApntagDefined = function() {
        if (window.apntag && u.isFn(window.apntag.setKeywords))
            return !0
    }
    ,
    x);
    function U(e, t) {
        return e.adserverTargeting && t && (u.isArray(t) && S()(t, e.adUnitCode) || "string" == typeof t && e.adUnitCode === t)
    }
    function _(e) {
        return "string" == typeof e ? [e] : u.isArray(e) ? e : f.getAdUnitCodes() || []
    }
    function B() {
        var e = f.getBidsReceived();
        return h.b.getConfig("useBidCache") || (e = e.filter(function(e) {
            return l[e.adUnitCode] === e.auctionId
        })),
        j(e = e.filter(function(e) {
            return Object(v.deepAccess)(e, "video.context") !== i.a
        }).filter(function(e) {
            return "banner" !== e.mediaType || Object(o.c)([e.width, e.height])
        }).filter(d).filter(s), v.getOldestHighestCpmBid)
    }
    function P() {
        return f.getStandardBidderAdServerTargeting().map(function(e) {
            return e.key
        }).concat(I).filter(v.uniques)
    }
    function R(r, o, e, t) {
        return Object.keys(o.adserverTargeting).filter(g()).forEach(function(e) {
            var t, n;
            r.length && r.filter((n = e,
            function(e) {
                return e.adUnitCode === o.adUnitCode && e.adserverTargeting[n]
            }
            )).forEach((t = e,
            function(e) {
                u.isArray(e.adserverTargeting[t]) || (e.adserverTargeting[t] = [e.adserverTargeting[t]]),
                e.adserverTargeting[t] = e.adserverTargeting[t].concat(o.adserverTargeting[t]).filter(v.uniques),
                delete o.adserverTargeting[t]
            }
            ))
        }),
        r.push(o),
        r
    }
    function g() {
        var t = P().concat(m.a);
        return function(e) {
            return -1 === t.indexOf(e)
        }
    }
    function k(t) {
        return E({}, t.adUnitCode, Object.keys(t.adserverTargeting).filter(g()).map(function(e) {
            return E({}, e.substring(0, 20), [t.adserverTargeting[e]])
        }))
    }
    function D(t, e) {
        return e.map(function(e) {
            return E({}, "".concat(e, "_").concat(t.bidderCode).substring(0, 20), [t.adserverTargeting[e]])
        })
    }
}
, function(e, t) {
    e.exports = {}
}
, function(e, t, n) {
    "use strict";
    function i(e, t, n, r) {
        var o;
        t in e && ("function" != typeof (o = r) || "[object Function]" !== u.call(o) || !r()) || (f ? d(e, t, {
            configurable: !0,
            enumerable: !1,
            value: n,
            writable: !0
        }) : e[t] = n)
    }
    function r(e, t) {
        var n = 2 < arguments.length ? arguments[2] : {}
          , r = a(t);
        c && (r = s.call(r, Object.getOwnPropertySymbols(t)));
        for (var o = 0; o < r.length; o += 1)
            i(e, r[o], t[r[o]], n[r[o]])
    }
    var a = n(93)
      , c = "function" == typeof Symbol && "symbol" == typeof Symbol("foo")
      , u = Object.prototype.toString
      , s = Array.prototype.concat
      , d = Object.defineProperty
      , f = d && function() {
        var e = {};
        try {
            for (var t in d(e, "x", {
                enumerable: !1,
                value: e
            }),
            e)
                return !1;
            return e.x === e
        } catch (e) {
            return !1
        }
    }();
    r.supportsDescriptors = !!f,
    e.exports = r
}
, , function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return d
    }),
    n.d(t, "b", function() {
        return h
    });
    var r = n(11)
      , b = n.n(r)
      , o = n(0)
      , v = 2
      , i = {
        buckets: [{
            max: 5,
            increment: .5
        }]
    }
      , a = {
        buckets: [{
            max: 20,
            increment: .1
        }]
    }
      , c = {
        buckets: [{
            max: 20,
            increment: .01
        }]
    }
      , u = {
        buckets: [{
            max: 3,
            increment: .01
        }, {
            max: 8,
            increment: .05
        }, {
            max: 20,
            increment: .5
        }]
    }
      , s = {
        buckets: [{
            max: 5,
            increment: .05
        }, {
            max: 10,
            increment: .1
        }, {
            max: 20,
            increment: .5
        }]
    };
    function d(e, t) {
        var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 1
          , r = parseFloat(e);
        return isNaN(r) && (r = ""),
        {
            low: "" === r ? "" : f(e, i, n),
            med: "" === r ? "" : f(e, a, n),
            high: "" === r ? "" : f(e, c, n),
            auto: "" === r ? "" : f(e, s, n),
            dense: "" === r ? "" : f(e, u, n),
            custom: "" === r ? "" : f(e, t, n)
        }
    }
    function f(n, e, r) {
        var o = "";
        if (!h(e))
            return o;
        var t, i, a, c, u, s, d, f, l, p = e.buckets.reduce(function(e, t) {
            return e.max > t.max ? e : t
        }, {
            max: 0
        }), g = 0, y = b()(e.buckets, function(e) {
            if (n > p.max * r) {
                var t = e.precision;
                void 0 === t && (t = v),
                o = (e.max * r).toFixed(t)
            } else {
                if (n <= e.max * r && g * r <= n)
                    return e.min = g,
                    e;
                g = e.max
            }
        });
        return y && (t = n,
        a = r,
        c = void 0 !== (i = y).precision ? i.precision : v,
        u = i.increment * a,
        s = i.min * a,
        d = Math.pow(10, c + 2),
        f = (t * d - s * d) / (u * d),
        l = Math.floor(f) * u + s,
        o = (l = Number(l.toFixed(10))).toFixed(c)),
        o
    }
    function h(e) {
        if (o.isEmpty(e) || !e.buckets || !Array.isArray(e.buckets))
            return !1;
        var t = !0;
        return e.buckets.forEach(function(e) {
            e.max && e.increment || (t = !1)
        }),
        t
    }
}
, function(e, t) {
    e.exports = function(e, t) {
        return {
            enumerable: !(1 & e),
            configurable: !(2 & e),
            writable: !(4 & e),
            value: t
        }
    }
}
, function(e, t, n) {
    var r = n(73)
      , o = n(50);
    e.exports = function(e) {
        return r(o(e))
    }
}
, function(e, t) {
    var n = {}.toString;
    e.exports = function(e) {
        return n.call(e).slice(8, -1)
    }
}
, function(e, t) {
    e.exports = function(e) {
        if (null == e)
            throw TypeError("Can't call method on " + e);
        return e
    }
}
, function(e, t, n) {
    var r = n(59)
      , o = Math.min;
    e.exports = function(e) {
        return 0 < e ? o(r(e), 9007199254740991) : 0
    }
}
, function(e, t) {
    e.exports = function() {}
}
, function(e, t, n) {
    var r = n(25);
    e.exports = r
}
, function(e, t) {
    e.exports = {}
}
, function(e, t, n) {
    var r, o, i, a, c, u, s, d, f = n(122), l = n(22), p = n(23), g = n(29), y = n(24), b = n(66), v = n(54), h = l.WeakMap;
    s = f ? (r = new h,
    o = r.get,
    i = r.has,
    a = r.set,
    c = function(e, t) {
        return a.call(r, e, t),
        t
    }
    ,
    u = function(e) {
        return o.call(r, e) || {}
    }
    ,
    function(e) {
        return i.call(r, e)
    }
    ) : (v[d = b("state")] = !0,
    c = function(e, t) {
        return g(e, d, t),
        t
    }
    ,
    u = function(e) {
        return y(e, d) ? e[d] : {}
    }
    ,
    function(e) {
        return y(e, d)
    }
    ),
    e.exports = {
        set: c,
        get: u,
        has: s,
        enforce: function(e) {
            return s(e) ? u(e) : c(e, {})
        },
        getterFor: function(n) {
            return function(e) {
                var t;
                if (!p(e) || (t = u(e)).type !== n)
                    throw TypeError("Incompatible receiver, " + n + " required");
                return t
            }
        }
    }
}
, function(e, t, n) {
    var o = n(23);
    e.exports = function(e, t) {
        if (!o(e))
            return e;
        var n, r;
        if (t && "function" == typeof (n = e.toString) && !o(r = n.call(e)))
            return r;
        if ("function" == typeof (n = e.valueOf) && !o(r = n.call(e)))
            return r;
        if (!t && "function" == typeof (n = e.toString) && !o(r = n.call(e)))
            return r;
        throw TypeError("Can't convert object to primitive value")
    }
}
, function(e, t, n) {
    function r(p) {
        var g = 1 == p
          , y = 2 == p
          , b = 3 == p
          , v = 4 == p
          , h = 6 == p
          , m = 5 == p || h;
        return function(e, t, n, r) {
            for (var o, i, a = E(e), c = A(a), u = S(t, n, 3), s = O(c.length), d = 0, f = r || w, l = g ? f(e, s) : y ? f(e, 0) : void 0; d < s; d++)
                if ((m || d in c) && (i = u(o = c[d], d, a),
                p))
                    if (g)
                        l[d] = i;
                    else if (i)
                        switch (p) {
                        case 3:
                            return !0;
                        case 5:
                            return o;
                        case 6:
                            return d;
                        case 2:
                            T.call(l, o)
                        }
                    else if (v)
                        return !1;
            return h ? -1 : b || v ? v : l
        }
    }
    var S = n(21)
      , A = n(73)
      , E = n(58)
      , O = n(51)
      , w = n(110)
      , T = [].push;
    e.exports = {
        forEach: r(0),
        map: r(1),
        filter: r(2),
        some: r(3),
        every: r(4),
        find: r(5),
        findIndex: r(6)
    }
}
, function(e, t, n) {
    var r = n(50);
    e.exports = function(e) {
        return Object(r(e))
    }
}
, function(e, t) {
    var n = Math.ceil
      , r = Math.floor;
    e.exports = function(e) {
        return isNaN(e = +e) ? 0 : (0 < e ? r : n)(e)
    }
}
, function(e, t) {
    var n = 0
      , r = Math.random();
    e.exports = function(e) {
        return "Symbol(" + String(void 0 === e ? "" : e) + ")_" + (++n + r).toString(36)
    }
}
, function(e, t, n) {
    function a(e) {
        throw e
    }
    var c = n(27)
      , u = n(28)
      , s = n(24)
      , d = Object.defineProperty
      , f = {};
    e.exports = function(e, t) {
        if (s(f, e))
            return f[e];
        var n = [][e]
          , r = !!s(t = t || {}, "ACCESSORS") && t.ACCESSORS
          , o = s(t, 0) ? t[0] : a
          , i = s(t, 1) ? t[1] : void 0;
        return f[e] = !!n && !u(function() {
            if (r && !c)
                return !0;
            var e = {
                length: -1
            };
            r ? d(e, 1, {
                enumerable: !0,
                get: a
            }) : e[1] = 1,
            n.call(e, o, i)
        })
    }
}
, function(e, t, n) {
    var r = n(63)
      , o = n(37)
      , i = n(19)("iterator");
    e.exports = function(e) {
        if (null != e)
            return e[i] || e["@@iterator"] || o[r(e)]
    }
}
, function(e, t, n) {
    var r = n(64)
      , o = n(49)
      , i = n(19)("toStringTag")
      , a = "Arguments" == o(function() {
        return arguments
    }());
    e.exports = r ? o : function(e) {
        var t, n, r;
        return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (n = function(e, t) {
            try {
                return e[t]
            } catch (e) {}
        }(t = Object(e), i)) ? n : a ? o(t) : "Object" == (r = o(t)) && "function" == typeof t.callee ? "Arguments" : r
    }
}
, function(e, t, n) {
    var r = {};
    r[n(19)("toStringTag")] = "z",
    e.exports = "[object z]" === String(r)
}
, function(e, t, n) {
    var i = n(64)
      , a = n(31).f
      , c = n(29)
      , u = n(24)
      , s = n(121)
      , d = n(19)("toStringTag");
    e.exports = function(e, t, n, r) {
        var o;
        e && (o = n ? e : e.prototype,
        u(o, d) || a(o, d, {
            configurable: !0,
            value: t
        }),
        r && !i && c(o, "toString", s))
    }
}
, function(e, t, n) {
    var r = n(76)
      , o = n(60)
      , i = r("keys");
    e.exports = function(e) {
        return i[e] || (i[e] = o(e))
    }
}
, function(e, t, n) {
    "use strict";
    function v() {
        return this
    }
    var h = n(14)
      , m = n(130)
      , S = n(89)
      , A = n(132)
      , E = n(65)
      , O = n(29)
      , w = n(87)
      , r = n(19)
      , T = n(16)
      , I = n(37)
      , o = n(88)
      , j = o.IteratorPrototype
      , C = o.BUGGY_SAFARI_ITERATORS
      , x = r("iterator")
      , U = "values"
      , _ = "entries";
    e.exports = function(e, t, n, r, o, i, a) {
        m(n, t, r);
        function c(e) {
            if (e === o && y)
                return y;
            if (!C && e in p)
                return p[e];
            switch (e) {
            case "keys":
            case U:
            case _:
                return function() {
                    return new n(this,e)
                }
            }
            return function() {
                return new n(this)
            }
        }
        var u, s, d, f = t + " Iterator", l = !1, p = e.prototype, g = p[x] || p["@@iterator"] || o && p[o], y = !C && g || c(o), b = "Array" == t && p.entries || g;
        if (b && (u = S(b.call(new e)),
        j !== Object.prototype && u.next && (T || S(u) === j || (A ? A(u, j) : "function" != typeof u[x] && O(u, x, v)),
        E(u, f, !0, !0),
        T && (I[f] = v))),
        o == U && g && g.name !== U && (l = !0,
        y = function() {
            return g.call(this)
        }
        ),
        T && !a || p[x] === y || O(p, x, y),
        I[t] = y,
        o)
            if (s = {
                values: c(U),
                keys: i ? y : c("keys"),
                entries: c(_)
            },
            a)
                for (d in s)
                    !C && !l && d in p || w(p, d, s[d]);
            else
                h({
                    target: t,
                    proto: !0,
                    forced: C || l
                }, s);
        return s
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(172);
    e.exports = Function.prototype.bind || r
}
, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return i
    });
    var r = n(0)
      , c = {};
    function o(e, t, n) {
        var r, o, i, a = (o = n,
        i = c[r = e] = c[r] || {
            bidders: {}
        },
        o ? i.bidders[o] = i.bidders[o] || {} : i);
        return a[t] = (a[t] || 0) + 1,
        a[t]
    }
    var i = {
        incrementRequestsCounter: function(e) {
            return o(e, "requestsCounter")
        },
        incrementBidderRequestsCounter: function(e, t) {
            return o(e, "requestsCounter", t)
        },
        incrementBidderWinsCounter: function(e, t) {
            return o(e, "winsCounter", t)
        },
        getRequestsCounter: function(e) {
            return Object(r.deepAccess)(c, "".concat(e, ".requestsCounter")) || 0
        },
        getBidderRequestsCounter: function(e, t) {
            return Object(r.deepAccess)(c, "".concat(e, ".bidders.").concat(t, ".requestsCounter")) || 0
        },
        getBidderWinsCounter: function(e, t) {
            return Object(r.deepAccess)(c, "".concat(e, ".bidders.").concat(t, ".winsCounter")) || 0
        }
    }
}
, function(e, t, n) {
    var r = n(238);
    e.exports = r
}
, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    n.d(t, "adUnitSetupChecks", function() {
        return z
    }),
    n.d(t, "checkAdUnitSetup", function() {
        return V
    }),
    t.executeStorageCallbacks = K;
    var r = n(20)
      , o = n(0)
      , i = n(246)
      , a = n(39)
      , d = n(3)
      , v = n(26)
      , f = n(42)
      , c = n(13)
      , u = n(247)
      , s = n(12)
      , l = n.n(s)
      , p = n(69)
      , h = n(10)
      , g = n(32)
      , y = n(9);
    function b(e) {
        return (b = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    function m() {
        return (m = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    var S = Object(r.a)()
      , A = n(5)
      , E = n(0)
      , O = n(7).default
      , w = n(8)
      , T = a.a.triggerUserSyncs
      , I = A.EVENTS
      , j = I.ADD_AD_UNITS
      , C = I.BID_WON
      , x = I.REQUEST_BIDS
      , U = I.SET_TARGETING
      , _ = I.AD_RENDER_FAILED
      , B = A.AD_RENDER_FAILED_REASON
      , P = B.PREVENT_WRITING_ON_MAIN_DOCUMENT
      , R = B.NO_AD
      , k = B.EXCEPTION
      , D = B.CANNOT_FIND_AD
      , N = B.MISSING_DOC_OR_ADID
      , M = {
        bidWon: function(e) {
            var t = v.a.getBidsRequested().map(function(e) {
                return e.bids.map(function(e) {
                    return e.adUnitCode
                })
            }).reduce(o.flatten).filter(o.uniques);
            return !!E.contains(t, e) || void E.logError('The "' + e + '" placement is not defined.')
        }
    };
    function q(e, t, n) {
        e.defaultView && e.defaultView.frameElement && (e.defaultView.frameElement.width = t,
        e.defaultView.frameElement.height = n)
    }
    function G(e, t) {
        var n = [];
        return E.isArray(e) && (t ? e.length === t : 0 < e.length) && (e.every(function(e) {
            return Object(o.isArrayOfNums)(e, 2)
        }) ? n = e : Object(o.isArrayOfNums)(e, 2) && n.push(e)),
        n
    }
    function F(e) {
        var t = e.mediaTypes.banner
          , n = G(t.sizes);
        0 < n.length ? (t.sizes = n,
        e.sizes = n) : (E.logError("Detected a mediaTypes.banner object without a proper sizes field.  Please ensure the sizes are listed like: [[300, 250], ...].  Removing invalid mediaTypes.banner object from request."),
        delete e.mediaTypes.banner)
    }
    function W(e) {
        var t = e.mediaTypes.video
          , n = "number" == typeof t.playerSize[0] ? 2 : 1
          , r = G(t.playerSize, n);
        0 < r.length ? (2 == n && E.logInfo("Transforming video.playerSize from [640,480] to [[640,480]] so it's in the proper format."),
        t.playerSize = r,
        e.sizes = r) : (E.logError("Detected incorrect configuration of mediaTypes.video.playerSize.  Please specify only one set of dimensions in a format like: [[640, 480]]. Removing invalid mediaTypes.video.playerSize property from request."),
        delete e.mediaTypes.video.playerSize)
    }
    function L(e) {
        var t = e.mediaTypes.native;
        t.image && t.image.sizes && !Array.isArray(t.image.sizes) && (E.logError("Please use an array of sizes for native.image.sizes field.  Removing invalid mediaTypes.native.image.sizes property from request."),
        delete e.mediaTypes.native.image.sizes),
        t.image && t.image.aspect_ratios && !Array.isArray(t.image.aspect_ratios) && (E.logError("Please use an array of sizes for native.image.aspect_ratios field.  Removing invalid mediaTypes.native.image.aspect_ratios property from request."),
        delete e.mediaTypes.native.image.aspect_ratios),
        t.icon && t.icon.sizes && !Array.isArray(t.icon.sizes) && (E.logError("Please use an array of sizes for native.icon.sizes field.  Removing invalid mediaTypes.native.icon.sizes property from request."),
        delete e.mediaTypes.native.icon.sizes)
    }
    Object(u.a)(),
    S.bidderSettings = S.bidderSettings || {},
    S.libLoaded = !0,
    S.version = "v3.25.0",
    E.logInfo("Prebid.js v3.25.0 loaded"),
    S.adUnits = S.adUnits || [],
    S.triggerUserSyncs = T;
    var z = {
        validateBannerMediaType: F,
        validateVideoMediaType: W,
        validateNativeMediaType: L,
        validateSizes: G
    }
      , V = Object(c.b)("sync", function(e) {
        return e.filter(function(e) {
            var t = e.mediaTypes;
            return t && 0 !== Object.keys(t).length ? (t.banner && F(e),
            t.video && t.video.playerSize && W(e),
            t.native && L(e),
            !0) : (E.logError("Detected adUnit.code '".concat(e.code, "' did not have a 'mediaTypes' object defined.  This is a required field for the auction, so this adUnit has been removed.")),
            !1)
        })
    }, "checkAdUnitSetup");
    function H(e) {
        var n = v.a[e]().filter(E.bind.call(o.adUnitsFilter, this, v.a.getAdUnitCodes()))
          , r = v.a.getLastAuctionId();
        return n.map(function(e) {
            return e.adUnitCode
        }).filter(o.uniques).map(function(t) {
            return n.filter(function(e) {
                return e.auctionId === r && e.adUnitCode === t
            })
        }).filter(function(e) {
            return e && e[0] && e[0].adUnitCode
        }).map(function(e) {
            return t = {},
            n = e[0].adUnitCode,
            r = {
                bids: e
            },
            n in t ? Object.defineProperty(t, n, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[n] = r,
            t;
            var t, n, r
        }).reduce(function(e, t) {
            return m(e, t)
        }, {})
    }
    function J(e) {
        var t = e.reason
          , n = e.message
          , r = e.bid
          , o = e.id
          , i = {
            reason: t,
            message: n
        };
        r && (i.bid = r),
        o && (i.adId = o),
        E.logError(n),
        w.emit(_, i)
    }
    function K(e, t) {
        !function(e) {
            var t;
            for (; t = e.shift(); )
                t()
        }(y.c),
        e.call(this, t)
    }
    function $(e) {
        e.forEach(function(e) {
            if (void 0 === e.called)
                try {
                    e.call(),
                    e.called = !0
                } catch (e) {
                    E.logError("Error processing command :", "prebid.js", e)
                }
        })
    }
    S.getAdserverTargetingForAdUnitCodeStr = function(e) {
        if (E.logInfo("Invoking owpbjs.getAdserverTargetingForAdUnitCodeStr", arguments),
        e) {
            var t = S.getAdserverTargetingForAdUnitCode(e);
            return E.transformAdServerTargetingObj(t)
        }
        E.logMessage("Need to call getAdserverTargetingForAdUnitCodeStr with adunitCode")
    }
    ,
    S.getAdserverTargetingForAdUnitCode = function(e) {
        return S.getAdserverTargeting(e)[e]
    }
    ,
    S.getAdserverTargeting = function(e) {
        return E.logInfo("Invoking owpbjs.getAdserverTargeting", arguments),
        f.a.getAllTargeting(e)
    }
    ,
    S.getNoBids = function() {
        return E.logInfo("Invoking owpbjs.getNoBids", arguments),
        H("getNoBids")
    }
    ,
    S.getBidResponses = function() {
        return E.logInfo("Invoking owpbjs.getBidResponses", arguments),
        H("getBidsReceived")
    }
    ,
    S.getBidResponsesForAdUnitCode = function(t) {
        return {
            bids: v.a.getBidsReceived().filter(function(e) {
                return e.adUnitCode === t
            })
        }
    }
    ,
    S.setTargetingForGPTAsync = function(e, t) {
        var n;
        E.logInfo("Invoking owpbjs.setTargetingForGPTAsync", arguments),
        Object(o.isGptPubadsDefined)() ? (n = f.a.getAllTargeting(e),
        f.a.resetPresetTargeting(e, t),
        f.a.setTargetingForGPT(n, t),
        Object.keys(n).forEach(function(t) {
            Object.keys(n[t]).forEach(function(e) {
                "hb_adid" === e && v.a.setStatusForBids(n[t][e], A.BID_STATUS.BID_TARGETING_SET)
            })
        }),
        w.emit(U, n)) : E.logError("window.googletag is not defined on the page")
    }
    ,
    S.setTargetingForAst = function(e) {
        E.logInfo("Invoking owpbjs.setTargetingForAn", arguments),
        f.a.isApntagDefined() ? (f.a.setTargetingForAst(e),
        w.emit(U, f.a.getAllTargeting())) : E.logError("window.apntag is not defined on the page")
    }
    ,
    S.renderAd = function(e, t) {
        if (E.logInfo("Invoking owpbjs.renderAd", arguments),
        E.logMessage("Calling renderAd with adId :" + t),
        e && t)
            try {
                var n, r, o, i, a, c, u, s, d, f, l, p, g = v.a.findBidByAdId(t);
                g ? (g.ad = E.replaceAuctionPrice(g.ad, g.cpm),
                g.adUrl = E.replaceAuctionPrice(g.adUrl, g.cpm),
                v.a.addWinningBid(g),
                w.emit(C, g),
                n = g.height,
                r = g.width,
                o = g.ad,
                i = g.mediaType,
                a = g.adUrl,
                c = g.renderer,
                u = document.createComment("Creative ".concat(g.creativeId, " served by ").concat(g.bidder, " Prebid.js Header Bidding")),
                E.insertElement(u, e, "body"),
                Object(h.c)(c) ? Object(h.b)(c, g) : e === document && !E.inIframe() || "video" === i ? (s = "Error trying to write ad. Ad render call ad id ".concat(t, " was prevented from writing to the main document."),
                J({
                    reason: P,
                    message: s,
                    bid: g,
                    id: t
                })) : o ? (navigator.userAgent && -1 < navigator.userAgent.toLowerCase().indexOf("firefox/") && ((d = navigator.userAgent.toLowerCase().match(/firefox\/([\d\.]+)/)[1]) && parseInt(d, 10) < 67 && e.open("text/html", "replace")),
                e.write(o),
                e.close(),
                q(e, r, n),
                E.callBurl(g)) : a ? ((f = E.createInvisibleIframe()).height = n,
                f.width = r,
                f.style.display = "inline",
                f.style.overflow = "hidden",
                f.src = a,
                E.insertElement(f, e, "body"),
                q(e, r, n),
                E.callBurl(g)) : (l = "Error trying to write ad. No ad for bid response id: ".concat(t),
                J({
                    reason: R,
                    message: l,
                    bid: g,
                    id: t
                }))) : (p = "Error trying to write ad. Cannot find ad by given id : ".concat(t),
                J({
                    reason: D,
                    message: p,
                    id: t
                }))
            } catch (e) {
                var y = "Error trying to write ad Id :".concat(t, " to the page:").concat(e.message);
                J({
                    reason: k,
                    message: y,
                    id: t
                })
            }
        else {
            var b = "Error trying to write ad Id :".concat(t, " to the page. Missing document or adId");
            J({
                reason: N,
                message: b,
                id: t
            })
        }
    }
    ,
    S.removeAdUnit = function(e) {
        E.logInfo("Invoking owpbjs.removeAdUnit", arguments),
        e ? (E.isArray(e) ? e : [e]).forEach(function(e) {
            for (var t = S.adUnits.length - 1; 0 <= t; t--)
                S.adUnits[t].code === e && S.adUnits.splice(t, 1)
        }) : S.adUnits = []
    }
    ,
    S.requestBids = Object(c.b)("async", function() {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
          , t = e.bidsBackHandler
          , n = e.timeout
          , r = e.adUnits
          , o = e.adUnitCodes
          , i = e.labels
          , a = e.auctionId;
        w.emit(x);
        var c = n || d.b.getConfig("bidderTimeout")
          , r = r || S.adUnits;
        if (E.logInfo("Invoking owpbjs.requestBids", arguments),
        o && o.length ? r = r.filter(function(e) {
            return l()(o, e.code)
        }) : o = r && r.map(function(e) {
            return e.code
        }),
        (r = V(r)).forEach(function(o) {
            var i = Object.keys(o.mediaTypes || {
                banner: "banner"
            })
              , e = o.bids.map(function(e) {
                return e.bidder
            })
              , a = O.bidderRegistry
              , t = d.b.getConfig("s2sConfig")
              , n = t && t.bidders
              , r = n ? e.filter(function(e) {
                return !l()(n, e)
            }) : e;
            o.transactionId = E.generateUUID(),
            r.forEach(function(t) {
                var e = a[t]
                  , n = e && e.getSpec && e.getSpec()
                  , r = n && n.supportedMediaTypes || ["banner"];
                i.some(function(e) {
                    return l()(r, e)
                }) ? p.a.incrementBidderRequestsCounter(o.code, t) : (E.logWarn(E.unsupportedBidderMessage(o, t)),
                o.bids = o.bids.filter(function(e) {
                    return e.bidder !== t
                }))
            }),
            p.a.incrementRequestsCounter(o.code)
        }),
        r && 0 !== r.length) {
            var u = v.a.createAuction({
                adUnits: r,
                adUnitCodes: o,
                callback: t,
                cbTimeout: c,
                labels: i,
                auctionId: a
            })
              , s = r.length;
            15 < s && E.logInfo("Current auction ".concat(u.getAuctionId(), " contains ").concat(s, " adUnits."), r),
            o.forEach(function(e) {
                return f.a.setLatestAuctionForAdUnit(e, u.getAuctionId())
            }),
            u.callBids()
        } else if (E.logMessage("No adUnits configured. No bids requested."),
        "function" == typeof t)
            try {
                t()
            } catch (e) {
                E.logError("Error executing bidsBackHandler", null, e)
            }
    }),
    S.requestBids.before(K, 49),
    S.addAdUnits = function(e) {
        E.logInfo("Invoking owpbjs.addAdUnits", arguments),
        E.isArray(e) ? S.adUnits.push.apply(S.adUnits, e) : "object" === b(e) && S.adUnits.push(e),
        w.emit(j)
    }
    ,
    S.onEvent = function(e, t, n) {
        E.logInfo("Invoking owpbjs.onEvent", arguments),
        E.isFn(t) ? !n || M[e].call(null, n) ? w.on(e, t, n) : E.logError('The id provided is not valid for event "' + e + '" and no handler was set.') : E.logError('The event handler provided is not a function and was not set on event "' + e + '".')
    }
    ,
    S.offEvent = function(e, t, n) {
        E.logInfo("Invoking owpbjs.offEvent", arguments),
        n && !M[e].call(null, n) || w.off(e, t, n)
    }
    ,
    S.registerBidAdapter = function(e, t) {
        E.logInfo("Invoking owpbjs.registerBidAdapter", arguments);
        try {
            O.registerBidAdapter(e(), t)
        } catch (e) {
            E.logError("Error registering bidder adapter : " + e.message)
        }
    }
    ,
    S.registerAnalyticsAdapter = function(e) {
        E.logInfo("Invoking owpbjs.registerAnalyticsAdapter", arguments);
        try {
            O.registerAnalyticsAdapter(e)
        } catch (e) {
            E.logError("Error registering analytics adapter : " + e.message)
        }
    }
    ,
    S.createBid = function(e) {
        return E.logInfo("Invoking owpbjs.createBid", arguments),
        Object(g.a)(e)
    }
    ,
    S.enableAnalytics = function(e) {
        e && !E.isEmpty(e) ? (E.logInfo("Invoking owpbjs.enableAnalytics for: ", e),
        O.enableAnalytics(e)) : E.logError("owpbjs.enableAnalytics should be called with option {}")
    }
    ,
    S.aliasBidder = function(e, t) {
        E.logInfo("Invoking owpbjs.aliasBidder", arguments),
        e && t ? O.aliasBidAdapter(e, t) : E.logError("bidderCode and alias must be passed as arguments", "owpbjs.aliasBidder")
    }
    ,
    S.getAllWinningBids = function() {
        return v.a.getAllWinningBids()
    }
    ,
    S.getAllPrebidWinningBids = function() {
        return v.a.getBidsReceived().filter(function(e) {
            return e.status === A.BID_STATUS.BID_TARGETING_SET
        })
    }
    ,
    S.getHighestCpmBids = function(e) {
        return f.a.getWinningBids(e)
    }
    ,
    S.markWinningBidAsUsed = function(t) {
        var e = [];
        t.adUnitCode && t.adId ? e = v.a.getBidsReceived().filter(function(e) {
            return e.adId === t.adId && e.adUnitCode === t.adUnitCode
        }) : t.adUnitCode ? e = f.a.getWinningBids(t.adUnitCode) : t.adId ? e = v.a.getBidsReceived().filter(function(e) {
            return e.adId === t.adId
        }) : E.logWarn("Inproper usage of markWinningBidAsUsed. It'll need an adUnitCode and/or adId to function."),
        0 < e.length && (e[0].status = A.BID_STATUS.RENDERED)
    }
    ,
    S.getConfig = d.b.getConfig,
    S.setConfig = d.b.setConfig,
    S.setBidderConfig = d.b.setBidderConfig,
    S.que.push(function() {
        return Object(i.a)()
    }),
    S.cmd.push = function(e) {
        if ("function" == typeof e)
            try {
                e.call()
            } catch (e) {
                E.logError("Error processing command :", e.message, e.stack)
            }
        else
            E.logError("Commands written into owpbjs.cmd.push must be wrapped in a function")
    }
    ,
    S.que.push = S.cmd.push,
    S.processQueue = function() {
        c.b.ready(),
        $(S.que),
        $(S.cmd)
    }
    ,
    t.default = S
}
, function(e, t, n) {
    "use strict";
    t.a = function(t, n) {
        i.adServers = i.adServers || {},
        i.adServers[t] = i.adServers[t] || {},
        Object.keys(n).forEach(function(e) {
            i.adServers[t][e] ? Object(o.logWarn)("Attempting to add an already registered function property ".concat(e, " for AdServer ").concat(t, ".")) : i.adServers[t][e] = n[e]
        })
    }
    ;
    var r = n(20)
      , o = n(0)
      , i = Object(r.a)()
}
, function(e, t, n) {
    var r = n(28)
      , o = n(49)
      , i = "".split;
    e.exports = r(function() {
        return !Object("z").propertyIsEnumerable(0)
    }) ? function(e) {
        return "String" == o(e) ? i.call(e, "") : Object(e)
    }
    : Object
}
, function(e, t, n) {
    var r = n(27)
      , o = n(28)
      , i = n(75);
    e.exports = !r && !o(function() {
        return 7 != Object.defineProperty(i("div"), "a", {
            get: function() {
                return 7
            }
        }).a
    })
}
, function(e, t, n) {
    var r = n(22)
      , o = n(23)
      , i = r.document
      , a = o(i) && o(i.createElement);
    e.exports = function(e) {
        return a ? i.createElement(e) : {}
    }
}
, function(e, t, n) {
    var r = n(16)
      , o = n(77);
    (e.exports = function(e, t) {
        return o[e] || (o[e] = void 0 !== t ? t : {})
    }
    )("versions", []).push({
        version: "3.6.4",
        mode: r ? "pure" : "global",
        copyright: "u00A9 2020 Denis Pushkarev (zloirock.ru)"
    })
}
, function(e, t, n) {
    var r = n(22)
      , o = n(112)
      , i = "__core-js_shared__"
      , a = r[i] || o(i, {});
    e.exports = a
}
, function(e, t, n) {
    var r = n(28);
    e.exports = !!Object.getOwnPropertySymbols && !r(function() {
        return !String(Symbol())
    })
}
, function(e, t, n) {
    function r(c) {
        return function(e, t, n) {
            var r, o = u(e), i = s(o.length), a = d(n, i);
            if (c && t != t) {
                for (; a < i; )
                    if ((r = o[a++]) != r)
                        return !0
            } else
                for (; a < i; a++)
                    if ((c || a in o) && o[a] === t)
                        return c || a || 0;
            return !c && -1
        }
    }
    var u = n(48)
      , s = n(51)
      , d = n(116);
    e.exports = {
        includes: r(!0),
        indexOf: r(!1)
    }
}
, function(e, t, n) {
    var r = n(117);
    n(140),
    n(142),
    n(144),
    n(146),
    n(148),
    n(149),
    n(150),
    n(151),
    n(152),
    n(153),
    n(154),
    n(155),
    n(156),
    n(157),
    n(158),
    n(159),
    n(160),
    n(161),
    e.exports = r
}
, function(e, t, n) {
    function r(e) {
        c(e, d, {
            value: {
                objectID: "O" + ++f,
                weakData: {}
            }
        })
    }
    var o = n(54)
      , i = n(23)
      , a = n(24)
      , c = n(31).f
      , u = n(60)
      , s = n(120)
      , d = u("meta")
      , f = 0
      , l = Object.isExtensible || function() {
        return !0
    }
      , p = e.exports = {
        REQUIRED: !1,
        fastKey: function(e, t) {
            if (!i(e))
                return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;
            if (!a(e, d)) {
                if (!l(e))
                    return "F";
                if (!t)
                    return "E";
                r(e)
            }
            return e[d].objectID
        },
        getWeakData: function(e, t) {
            if (!a(e, d)) {
                if (!l(e))
                    return !0;
                if (!t)
                    return !1;
                r(e)
            }
            return e[d].weakData
        },
        onFreeze: function(e) {
            return s && p.REQUIRED && l(e) && !a(e, d) && r(e),
            e
        }
    };
    o[d] = !0
}
, function(e, t, n) {
    var r = n(19)
      , o = n(37)
      , i = r("iterator")
      , a = Array.prototype;
    e.exports = function(e) {
        return void 0 !== e && (o.Array === e || a[i] === e)
    }
}
, function(e, t, n) {
    var i = n(15);
    e.exports = function(t, e, n, r) {
        try {
            return r ? e(i(n)[0], n[1]) : e(n)
        } catch (e) {
            var o = t.return;
            throw void 0 !== o && i(o.call(t)),
            e
        }
    }
}
, function(e, t) {
    e.exports = function(e, t, n) {
        if (!(e instanceof t))
            throw TypeError("Incorrect " + (n ? n + " " : "") + "invocation");
        return e
    }
}
, function(e, t, n) {
    function r() {}
    function o(e) {
        return "<script>" + e + "</" + g + ">"
    }
    var i, a = n(15), c = n(125), u = n(86), s = n(54), d = n(128), f = n(75), l = n(66), p = "prototype", g = "script", y = l("IE_PROTO"), b = function() {
        try {
            i = document.domain && new ActiveXObject("htmlfile")
        } catch (e) {}
        var e, t;
        b = i ? function(e) {
            e.write(o("")),
            e.close();
            var t = e.parentWindow.Object;
            return e = null,
            t
        }(i) : ((t = f("iframe")).style.display = "none",
        d.appendChild(t),
        t.src = String("javascript:"),
        (e = t.contentWindow.document).open(),
        e.write(o("document.F=Object")),
        e.close(),
        e.F);
        for (var n = u.length; n--; )
            delete b[p][u[n]];
        return b()
    };
    s[y] = !0,
    e.exports = Object.create || function(e, t) {
        var n;
        return null !== e ? (r[p] = a(e),
        n = new r,
        r[p] = null,
        n[y] = e) : n = b(),
        void 0 === t ? n : c(n, t)
    }
}
, function(e, t) {
    e.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"]
}
, function(e, t, n) {
    var o = n(29);
    e.exports = function(e, t, n, r) {
        r && r.enumerable ? e[t] = n : o(e, t, n)
    }
}
, function(e, t, n) {
    "use strict";
    var r, o, i, a = n(89), c = n(29), u = n(24), s = n(19), d = n(16), f = s("iterator"), l = !1;
    [].keys && ("next"in (i = [].keys()) ? (o = a(a(i))) !== Object.prototype && (r = o) : l = !0),
    null == r && (r = {}),
    d || u(r, f) || c(r, f, function() {
        return this
    }),
    e.exports = {
        IteratorPrototype: r,
        BUGGY_SAFARI_ITERATORS: l
    }
}
, function(e, t, n) {
    var r = n(24)
      , o = n(58)
      , i = n(66)
      , a = n(131)
      , c = i("IE_PROTO")
      , u = Object.prototype;
    e.exports = a ? Object.getPrototypeOf : function(e) {
        return e = o(e),
        r(e, c) ? e[c] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? u : null
    }
}
, function(e, t, n) {
    "use strict";
    var o = n(136).charAt
      , r = n(55)
      , i = n(67)
      , a = "String Iterator"
      , c = r.set
      , u = r.getterFor(a);
    i(String, "String", function(e) {
        c(this, {
            type: a,
            string: String(e),
            index: 0
        })
    }, function() {
        var e, t = u(this), n = t.string, r = t.index;
        return r >= n.length ? {
            value: void 0,
            done: !0
        } : (e = o(n, r),
        t.index += e.length,
        {
            value: e,
            done: !1
        })
    })
}
, function(e, t, n) {
    var r = n(15)
      , o = n(62);
    e.exports = function(e) {
        var t = o(e);
        if ("function" != typeof t)
            throw TypeError(String(e) + " is not iterable");
        return r(t.call(e))
    }
}
, function(e, t, n) {
    var r = n(162);
    e.exports = r
}
, function(e, t, n) {
    "use strict";
    var r = Array.prototype.slice
      , o = n(94)
      , i = Object.keys
      , a = i ? function(e) {
        return i(e)
    }
    : n(169)
      , c = Object.keys;
    a.shim = function() {
        return Object.keys ? function() {
            var e = Object.keys(arguments);
            return e && e.length === arguments.length
        }(1, 2) || (Object.keys = function(e) {
            return o(e) ? c(r.call(e)) : c(e)
        }
        ) : Object.keys = a,
        Object.keys || a
    }
    ,
    e.exports = a
}
, function(e, t, n) {
    "use strict";
    var r = Object.prototype.toString;
    e.exports = function(e) {
        var t = r.call(e);
        return "[object Arguments]" === t || "[object Array]" !== t && null !== e && "object" == typeof e && "number" == typeof e.length && 0 <= e.length && "[object Function]" === r.call(e.callee)
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(68)
      , o = n(173)("%Function%")
      , i = o.apply
      , a = o.call;
    e.exports = function() {
        return r.apply(a, arguments)
    }
    ,
    e.exports.apply = function() {
        return r.apply(i, arguments)
    }
}
, function(e, t, n) {
    "use strict";
    function r(e) {
        return e != e
    }
    e.exports = function(e, t) {
        return 0 === e && 0 === t ? 1 / e == 1 / t : e === t || !(!r(e) || !r(t))
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(96);
    e.exports = function() {
        return "function" == typeof Object.is ? Object.is : r
    }
}
, function(e, t, n) {
    "use strict";
    var r = Object
      , o = TypeError;
    e.exports = function() {
        if (null != this && this !== r(this))
            throw new o("RegExp.prototype.flags getter called on non-object");
        var e = "";
        return this.global && (e += "g"),
        this.ignoreCase && (e += "i"),
        this.multiline && (e += "m"),
        this.dotAll && (e += "s"),
        this.unicode && (e += "u"),
        this.sticky && (e += "y"),
        e
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(98)
      , o = n(44).supportsDescriptors
      , i = Object.getOwnPropertyDescriptor
      , a = TypeError;
    e.exports = function() {
        if (!o)
            throw new a("RegExp.prototype.flags requires a true ES5 environment that supports property descriptors");
        if ("gim" === /a/gim.flags) {
            var e = i(RegExp.prototype, "flags");
            if (e && "function" == typeof e.get && "boolean" == typeof /a/.dotAll)
                return e.get
        }
        return r
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function(e) {
        var t = e;
        return {
            callBids: function() {},
            setBidderCode: function(e) {
                t = e
            },
            getBidderCode: function() {
                return t
            }
        }
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function(e, t) {
        if (e.labelAll)
            return {
                labelAll: !0,
                labels: e.labelAll,
                activeLabels: t
            };
        return {
            labelAll: !1,
            labels: e.labelAny,
            activeLabels: t
        }
    }
    ,
    t.c = function(e) {
        var t = b(1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : y);
        return !t.shouldFilter || !!t.sizesSupported[e]
    }
    ,
    t.b = function() {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
          , t = e.labels
          , n = void 0 === t ? [] : t
          , r = e.labelAll
          , o = void 0 !== r && r
          , i = e.activeLabels
          , a = void 0 === i ? [] : i
          , c = 1 < arguments.length ? arguments[1] : void 0
          , u = 2 < arguments.length ? arguments[2] : void 0
          , s = b(3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : y);
        c = Object(p.isPlainObject)(c) ? Object(p.deepClone)(c) : u ? {
            banner: {
                sizes: u
            }
        } : {};
        var d = Object(p.deepAccess)(c, "banner.sizes");
        s.shouldFilter && d && (c.banner.sizes = d.filter(function(e) {
            return s.sizesSupported[e]
        }));
        var f = Object.keys(c)
          , l = {
            active: f.every(function(e) {
                return "banner" !== e
            }) || f.some(function(e) {
                return "banner" === e
            }) && 0 < Object(p.deepAccess)(c, "banner.sizes.length") && (0 === n.length || !o && (n.some(function(e) {
                return s.labels[e]
            }) || n.some(function(e) {
                return g()(a, e)
            })) || o && n.reduce(function(e, t) {
                return e ? s.labels[t] || g()(a, t) : e
            }, !0)),
            mediaTypes: c
        };
        d && d.length !== c.banner.sizes.length && (l.filterResults = {
            before: d,
            after: c.banner.sizes
        });
        return l
    }
    ;
    var r = n(3)
      , p = n(0)
      , o = n(12)
      , g = n.n(o);
    function i(e) {
        return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    var y = [];
    function b(e) {
        return e.reduce(function(n, r) {
            if ("object" === i(r) && "string" == typeof r.mediaQuery) {
                var t = !1;
                if ("" === r.mediaQuery)
                    t = !0;
                else
                    try {
                        t = Object(p.getWindowTop)().matchMedia(r.mediaQuery).matches
                    } catch (e) {
                        Object(p.logWarn)("Unfriendly iFrame blocks sizeConfig from being correctly evaluated"),
                        t = matchMedia(r.mediaQuery).matches
                    }
                t && (Array.isArray(r.sizesSupported) && (n.shouldFilter = !0),
                ["labels", "sizesSupported"].forEach(function(t) {
                    return (r[t] || []).forEach(function(e) {
                        return n[t][e] = !0
                    })
                }))
            } else
                Object(p.logWarn)('sizeConfig rule missing required property "mediaQuery"');
            return n
        }, {
            labels: {},
            sizesSupported: {},
            shouldFilter: !1
        })
    }
    r.b.getConfig("sizeConfig", function(e) {
        return t = e.sizeConfig,
        void (y = t);
        var t
    })
}
, function(e, t, n) {
    "use strict";
    t.b = function(e, t, n) {
        var r = {
            puts: e.map(i, n)
        };
        Object(o.a)(a.b.getConfig("cache.url"), function(n) {
            return {
                success: function(e) {
                    var t;
                    try {
                        t = JSON.parse(e).responses
                    } catch (e) {
                        return void n(e, [])
                    }
                    t ? n(null, t) : n(new Error("The cache server didn't respond with a responses property."), [])
                },
                error: function(e, t) {
                    n(new Error("Error storing video ad in the cache: ".concat(e, ": ").concat(JSON.stringify(t))), [])
                }
            }
        }(t), JSON.stringify(r), {
            contentType: "text/plain",
            withCredentials: !0
        })
    }
    ,
    t.a = function(e) {
        return "".concat(a.b.getConfig("cache.url"), "?uuid=").concat(e)
    }
    ;
    var o = n(4)
      , a = n(3)
      , c = n(0);
    function i(e) {
        var t, n, r, o = e.vastXml ? e.vastXml : (t = e.vastUrl,
        n = e.vastImpUrl,
        r = n ? "<![CDATA[".concat(n, "]]>") : "",
        '<VAST version="3.0">\n    <Ad>\n      <Wrapper>\n        <AdSystem>prebid.org wrapper</AdSystem>\n        <VASTAdTagURI><![CDATA['.concat(t, "]]></VASTAdTagURI>\n        <Impression>").concat(r, "</Impression>\n        <Creatives></Creatives>\n      </Wrapper>\n    </Ad>\n  </VAST>"));
        window && window.PWT && (o = window.PWT.UpdateVastWithTracker(e, o));
        var i = {
            type: "xml",
            value: o,
            ttlseconds: Number(e.ttl)
        };
        return a.b.getConfig("cache.vasttrack") && (i.bidder = e.bidder,
        i.bidid = e.requestId,
        c.isPlainObject(this) && this.hasOwnProperty("auctionStart") && (i.timestamp = this.auctionStart)),
        "string" == typeof e.customCacheKey && "" !== e.customCacheKey && (i.key = e.customCacheKey),
        i
    }
}
, , , function(e, t, n) {
    n(106);
    var r = n(53);
    e.exports = r("Array", "find")
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(57).find
      , i = n(52)
      , a = n(61)
      , c = "find"
      , u = !0
      , s = a(c);
    c in [] && Array(1)[c](function() {
        u = !1
    }),
    r({
        target: "Array",
        proto: !0,
        forced: u || !s
    }, {
        find: function(e, t) {
            return o(this, e, 1 < arguments.length ? t : void 0)
        }
    }),
    i(c)
}
, function(e, t, n) {
    var r = n(27)
      , o = n(108)
      , i = n(47)
      , a = n(48)
      , c = n(56)
      , u = n(24)
      , s = n(74)
      , d = Object.getOwnPropertyDescriptor;
    t.f = r ? d : function(e, t) {
        if (e = a(e),
        t = c(t, !0),
        s)
            try {
                return d(e, t)
            } catch (e) {}
        if (u(e, t))
            return i(!o.f.call(e, t), e[t])
    }
}
, function(e, t, n) {
    "use strict";
    var r = {}.propertyIsEnumerable
      , o = Object.getOwnPropertyDescriptor
      , i = o && !r.call({
        1: 2
    }, 1);
    t.f = i ? function(e) {
        var t = o(this, e);
        return !!t && t.enumerable
    }
    : r
}
, function(e, t, n) {
    function r(e, t) {
        var n = c[a(e)];
        return n == s || n != u && ("function" == typeof t ? o(t) : !!t)
    }
    var o = n(28)
      , i = /#|\.prototype\./
      , a = r.normalize = function(e) {
        return String(e).replace(i, ".").toLowerCase()
    }
      , c = r.data = {}
      , u = r.NATIVE = "N"
      , s = r.POLYFILL = "P";
    e.exports = r
}
, function(e, t, n) {
    var r = n(23)
      , o = n(111)
      , i = n(19)("species");
    e.exports = function(e, t) {
        var n;
        return o(e) && ("function" == typeof (n = e.constructor) && (n === Array || o(n.prototype)) || r(n) && null === (n = n[i])) && (n = void 0),
        new (void 0 === n ? Array : n)(0 === t ? 0 : t)
    }
}
, function(e, t, n) {
    var r = n(49);
    e.exports = Array.isArray || function(e) {
        return "Array" == r(e)
    }
}
, function(e, t, n) {
    var r = n(22)
      , o = n(29);
    e.exports = function(t, n) {
        try {
            o(r, t, n)
        } catch (e) {
            r[t] = n
        }
        return n
    }
}
, function(e, t, n) {
    var r = n(78);
    e.exports = r && !Symbol.sham && "symbol" == typeof Symbol.iterator
}
, function(e, t, n) {
    n(115);
    var r = n(53);
    e.exports = r("Array", "includes")
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(79).includes
      , i = n(52);
    r({
        target: "Array",
        proto: !0,
        forced: !n(61)("indexOf", {
            ACCESSORS: !0,
            1: 0
        })
    }, {
        includes: function(e, t) {
            return o(this, e, 1 < arguments.length ? t : void 0)
        }
    }),
    i("includes")
}
, function(e, t, n) {
    var r = n(59)
      , o = Math.max
      , i = Math.min;
    e.exports = function(e, t) {
        var n = r(e);
        return n < 0 ? o(n + t, 0) : i(n, t)
    }
}
, function(e, t, n) {
    n(118),
    n(135),
    n(90),
    n(137);
    var r = n(43);
    e.exports = r.Set
}
, function(e, t, n) {
    "use strict";
    var r = n(119)
      , o = n(124);
    e.exports = r("Set", function(t) {
        return function(e) {
            return t(this, arguments.length ? e : void 0)
        }
    }, o)
}
, function(e, t, n) {
    "use strict";
    var f = n(14)
      , l = n(22)
      , p = n(81)
      , g = n(28)
      , y = n(29)
      , b = n(17)
      , v = n(84)
      , h = n(23)
      , m = n(65)
      , S = n(31).f
      , A = n(57).forEach
      , E = n(27)
      , r = n(55)
      , O = r.set
      , w = r.getterFor;
    e.exports = function(n, e, t) {
        var r, a, o = -1 !== n.indexOf("Map"), c = -1 !== n.indexOf("Weak"), i = o ? "set" : "add", u = l[n], s = u && u.prototype, d = {};
        return E && "function" == typeof u && (c || s.forEach && !g(function() {
            (new u).entries().next()
        })) ? (r = e(function(e, t) {
            O(v(e, r, n), {
                type: n,
                collection: new u
            }),
            null != t && b(t, e[i], e, o)
        }),
        a = w(n),
        A(["add", "clear", "delete", "forEach", "get", "has", "set", "keys", "values", "entries"], function(o) {
            var i = "add" == o || "set" == o;
            o in s && (!c || "clear" != o) && y(r.prototype, o, function(e, t) {
                var n = a(this).collection;
                if (!i && c && !h(e))
                    return "get" == o && void 0;
                var r = n[o](0 === e ? 0 : e, t);
                return i ? this : r
            })
        }),
        c || S(r.prototype, "size", {
            configurable: !0,
            get: function() {
                return a(this).collection.size
            }
        })) : (r = t.getConstructor(e, n, o, i),
        p.REQUIRED = !0),
        m(r, n, !1, !0),
        d[n] = r,
        f({
            global: !0,
            forced: !0
        }, d),
        c || t.setStrong(r, n, o),
        r
    }
}
, function(e, t, n) {
    var r = n(28);
    e.exports = !r(function() {
        return Object.isExtensible(Object.preventExtensions({}))
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(64)
      , o = n(63);
    e.exports = r ? {}.toString : function() {
        return "[object " + o(this) + "]"
    }
}
, function(e, t, n) {
    var r = n(22)
      , o = n(123)
      , i = r.WeakMap;
    e.exports = "function" == typeof i && /native code/.test(o(i))
}
, function(e, t, n) {
    var r = n(77)
      , o = Function.toString;
    "function" != typeof r.inspectSource && (r.inspectSource = function(e) {
        return o.call(e)
    }
    ),
    e.exports = r.inspectSource
}
, function(e, t, n) {
    "use strict";
    var s = n(31).f
      , d = n(85)
      , f = n(129)
      , l = n(21)
      , p = n(84)
      , g = n(17)
      , a = n(67)
      , c = n(134)
      , y = n(27)
      , b = n(81).fastKey
      , r = n(55)
      , v = r.set
      , h = r.getterFor;
    e.exports = {
        getConstructor: function(e, n, r, o) {
            function i(e, t, n) {
                var r, o, i = c(e), a = u(e, t);
                return a ? a.value = n : (i.last = a = {
                    index: o = b(t, !0),
                    key: t,
                    value: n,
                    previous: r = i.last,
                    next: void 0,
                    removed: !1
                },
                i.first || (i.first = a),
                r && (r.next = a),
                y ? i.size++ : e.size++,
                "F" !== o && (i.index[o] = a)),
                e
            }
            var a = e(function(e, t) {
                p(e, a, n),
                v(e, {
                    type: n,
                    index: d(null),
                    first: void 0,
                    last: void 0,
                    size: 0
                }),
                y || (e.size = 0),
                null != t && g(t, e[o], e, r)
            })
              , c = h(n)
              , u = function(e, t) {
                var n, r = c(e), o = b(t);
                if ("F" !== o)
                    return r.index[o];
                for (n = r.first; n; n = n.next)
                    if (n.key == t)
                        return n
            };
            return f(a.prototype, {
                clear: function() {
                    for (var e = c(this), t = e.index, n = e.first; n; )
                        n.removed = !0,
                        n.previous && (n.previous = n.previous.next = void 0),
                        delete t[n.index],
                        n = n.next;
                    e.first = e.last = void 0,
                    y ? e.size = 0 : this.size = 0
                },
                delete: function(e) {
                    var t, n, r = c(this), o = u(this, e);
                    return o && (t = o.next,
                    n = o.previous,
                    delete r.index[o.index],
                    o.removed = !0,
                    n && (n.next = t),
                    t && (t.previous = n),
                    r.first == o && (r.first = t),
                    r.last == o && (r.last = n),
                    y ? r.size-- : this.size--),
                    !!o
                },
                forEach: function(e, t) {
                    for (var n, r = c(this), o = l(e, 1 < arguments.length ? t : void 0, 3); n = n ? n.next : r.first; )
                        for (o(n.value, n.key, this); n && n.removed; )
                            n = n.previous
                },
                has: function(e) {
                    return !!u(this, e)
                }
            }),
            f(a.prototype, r ? {
                get: function(e) {
                    var t = u(this, e);
                    return t && t.value
                },
                set: function(e, t) {
                    return i(this, 0 === e ? 0 : e, t)
                }
            } : {
                add: function(e) {
                    return i(this, e = 0 === e ? 0 : e, e)
                }
            }),
            y && s(a.prototype, "size", {
                get: function() {
                    return c(this).size
                }
            }),
            a
        },
        setStrong: function(e, t, n) {
            var r = t + " Iterator"
              , o = h(t)
              , i = h(r);
            a(e, t, function(e, t) {
                v(this, {
                    type: r,
                    target: e,
                    state: o(e),
                    kind: t,
                    last: void 0
                })
            }, function() {
                for (var e = i(this), t = e.kind, n = e.last; n && n.removed; )
                    n = n.previous;
                return e.target && (e.last = n = n ? n.next : e.state.first) ? "keys" == t ? {
                    value: n.key,
                    done: !1
                } : "values" == t ? {
                    value: n.value,
                    done: !1
                } : {
                    value: [n.key, n.value],
                    done: !1
                } : {
                    value: e.target = void 0,
                    done: !0
                }
            }, n ? "entries" : "values", !n, !0),
            c(t)
        }
    }
}
, function(e, t, n) {
    var r = n(27)
      , a = n(31)
      , c = n(15)
      , u = n(126);
    e.exports = r ? Object.defineProperties : function(e, t) {
        c(e);
        for (var n, r = u(t), o = r.length, i = 0; i < o; )
            a.f(e, n = r[i++], t[n]);
        return e
    }
}
, function(e, t, n) {
    var r = n(127)
      , o = n(86);
    e.exports = Object.keys || function(e) {
        return r(e, o)
    }
}
, function(e, t, n) {
    var a = n(24)
      , c = n(48)
      , u = n(79).indexOf
      , s = n(54);
    e.exports = function(e, t) {
        var n, r = c(e), o = 0, i = [];
        for (n in r)
            !a(s, n) && a(r, n) && i.push(n);
        for (; t.length > o; )
            a(r, n = t[o++]) && (~u(i, n) || i.push(n));
        return i
    }
}
, function(e, t, n) {
    var r = n(25);
    e.exports = r("document", "documentElement")
}
, function(e, t, n) {
    var o = n(87);
    e.exports = function(e, t, n) {
        for (var r in t)
            n && n.unsafe && e[r] ? e[r] = t[r] : o(e, r, t[r], n);
        return e
    }
}
, function(e, t, n) {
    "use strict";
    function o() {
        return this
    }
    var i = n(88).IteratorPrototype
      , a = n(85)
      , c = n(47)
      , u = n(65)
      , s = n(37);
    e.exports = function(e, t, n) {
        var r = t + " Iterator";
        return e.prototype = a(i, {
            next: c(1, n)
        }),
        u(e, r, !1, !0),
        s[r] = o,
        e
    }
}
, function(e, t, n) {
    var r = n(28);
    e.exports = !r(function() {
        function e() {}
        return e.prototype.constructor = null,
        Object.getPrototypeOf(new e) !== e.prototype
    })
}
, function(e, t, n) {
    var o = n(15)
      , i = n(133);
    e.exports = Object.setPrototypeOf || ("__proto__"in {} ? function() {
        var n, r = !1, e = {};
        try {
            (n = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set).call(e, []),
            r = e instanceof Array
        } catch (e) {}
        return function(e, t) {
            return o(e),
            i(t),
            r ? n.call(e, t) : e.__proto__ = t,
            e
        }
    }() : void 0)
}
, function(e, t, n) {
    var r = n(23);
    e.exports = function(e) {
        if (!r(e) && null !== e)
            throw TypeError("Can't set " + String(e) + " as a prototype");
        return e
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(25)
      , o = n(31)
      , i = n(19)
      , a = n(27)
      , c = i("species");
    e.exports = function(e) {
        var t = r(e)
          , n = o.f;
        a && t && !t[c] && n(t, c, {
            configurable: !0,
            get: function() {
                return this
            }
        })
    }
}
, function(e, t) {}
, function(e, t, n) {
    function r(c) {
        return function(e, t) {
            var n, r, o = String(s(e)), i = u(t), a = o.length;
            return i < 0 || a <= i ? c ? "" : void 0 : (n = o.charCodeAt(i)) < 55296 || 56319 < n || i + 1 === a || (r = o.charCodeAt(i + 1)) < 56320 || 57343 < r ? c ? o.charAt(i) : n : c ? o.slice(i, i + 2) : r - 56320 + (n - 55296 << 10) + 65536
        }
    }
    var u = n(59)
      , s = n(50);
    e.exports = {
        codeAt: r(!1),
        charAt: r(!0)
    }
}
, function(e, t, n) {
    n(138);
    var r = n(139)
      , o = n(22)
      , i = n(63)
      , a = n(29)
      , c = n(37)
      , u = n(19)("toStringTag");
    for (var s in r) {
        var d = o[s]
          , f = d && d.prototype;
        f && i(f) !== u && a(f, u, s),
        c[s] = c.Array
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(48)
      , o = n(52)
      , i = n(37)
      , a = n(55)
      , c = n(67)
      , u = "Array Iterator"
      , s = a.set
      , d = a.getterFor(u);
    e.exports = c(Array, "Array", function(e, t) {
        s(this, {
            type: u,
            target: r(e),
            index: 0,
            kind: t
        })
    }, function() {
        var e = d(this)
          , t = e.target
          , n = e.kind
          , r = e.index++;
        return !t || r >= t.length ? {
            value: e.target = void 0,
            done: !0
        } : "keys" == n ? {
            value: r,
            done: !1
        } : "values" == n ? {
            value: t[r],
            done: !1
        } : {
            value: [r, t[r]],
            done: !1
        }
    }, "values"),
    i.Arguments = i.Array,
    o("keys"),
    o("values"),
    o("entries")
}
, function(e, t) {
    e.exports = {
        CSSRuleList: 0,
        CSSStyleDeclaration: 0,
        CSSValueList: 0,
        ClientRectList: 0,
        DOMRectList: 0,
        DOMStringList: 0,
        DOMTokenList: 1,
        DataTransferItemList: 0,
        FileList: 0,
        HTMLAllCollection: 0,
        HTMLCollection: 0,
        HTMLFormElement: 0,
        HTMLSelectElement: 0,
        MediaList: 0,
        MimeTypeArray: 0,
        NamedNodeMap: 0,
        NodeList: 1,
        PaintRequestList: 0,
        Plugin: 0,
        PluginArray: 0,
        SVGLengthList: 0,
        SVGNumberList: 0,
        SVGPathSegList: 0,
        SVGPointList: 0,
        SVGStringList: 0,
        SVGTransformList: 0,
        SourceBufferList: 0,
        StyleSheetList: 0,
        TextTrackCueList: 0,
        TextTrackList: 0,
        TouchList: 0
    }
}
, function(e, t, n) {
    n(14)({
        target: "Set",
        stat: !0
    }, {
        from: n(141)
    })
}
, function(e, t, n) {
    "use strict";
    var s = n(18)
      , d = n(21)
      , f = n(17);
    e.exports = function(e, t, n) {
        var r, o, i, a, c = arguments.length, u = 1 < c ? t : void 0;
        return s(this),
        (r = void 0 !== u) && s(u),
        null == e ? new this : (o = [],
        r ? (i = 0,
        a = d(u, 2 < c ? n : void 0, 2),
        f(e, function(e) {
            o.push(a(e, i++))
        })) : f(e, o.push, o),
        new this(o))
    }
}
, function(e, t, n) {
    n(14)({
        target: "Set",
        stat: !0
    }, {
        of: n(143)
    })
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        for (var e = arguments.length, t = new Array(e); e--; )
            t[e] = arguments[e];
        return new this(t)
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(145);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        addAll: function() {
            return i.apply(this, arguments)
        }
    })
}
, function(e, t, n) {
    "use strict";
    var o = n(15)
      , i = n(18);
    e.exports = function() {
        for (var e = o(this), t = i(e.add), n = 0, r = arguments.length; n < r; n++)
            t.call(e, arguments[n]);
        return e
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(147);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        deleteAll: function() {
            return i.apply(this, arguments)
        }
    })
}
, function(e, t, n) {
    "use strict";
    var a = n(15)
      , c = n(18);
    e.exports = function() {
        for (var e, t = a(this), n = c(t.delete), r = !0, o = 0, i = arguments.length; o < i; o++)
            e = n.call(t, arguments[o]),
            r = r && e;
        return !!r
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(15)
      , a = n(21)
      , c = n(34)
      , u = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        every: function(e, t) {
            var n = i(this)
              , r = c(n)
              , o = a(e, 1 < arguments.length ? t : void 0, 3);
            return !u(r, function(e) {
                if (!o(e, e, n))
                    return u.stop()
            }, void 0, !1, !0).stopped
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(25)
      , a = n(15)
      , c = n(18)
      , u = n(38)
      , s = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        difference: function(e) {
            var t = a(this)
              , n = new (u(t, i("Set")))(t)
              , r = c(n.delete);
            return s(e, function(e) {
                r.call(n, e)
            }),
            n
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , c = n(25)
      , u = n(15)
      , s = n(18)
      , d = n(21)
      , f = n(38)
      , l = n(34)
      , p = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        filter: function(e, t) {
            var n = u(this)
              , r = l(n)
              , o = d(e, 1 < arguments.length ? t : void 0, 3)
              , i = new (f(n, c("Set")))
              , a = s(i.add);
            return p(r, function(e) {
                o(e, e, n) && a.call(i, e)
            }, void 0, !1, !0),
            i
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(15)
      , a = n(21)
      , c = n(34)
      , u = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        find: function(e, t) {
            var n = i(this)
              , r = c(n)
              , o = a(e, 1 < arguments.length ? t : void 0, 3);
            return u(r, function(e) {
                if (o(e, e, n))
                    return u.stop(e)
            }, void 0, !1, !0).result
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(25)
      , a = n(15)
      , c = n(18)
      , u = n(38)
      , s = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        intersection: function(e) {
            var t = a(this)
              , n = new (u(t, i("Set")))
              , r = c(t.has)
              , o = c(n.add);
            return s(e, function(e) {
                r.call(t, e) && o.call(n, e)
            }),
            n
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(15)
      , a = n(18)
      , c = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        isDisjointFrom: function(e) {
            var t = i(this)
              , n = a(t.has);
            return !c(e, function(e) {
                if (!0 === n.call(t, e))
                    return c.stop()
            }).stopped
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(25)
      , a = n(15)
      , c = n(18)
      , u = n(91)
      , s = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        isSubsetOf: function(e) {
            var t = u(this)
              , n = a(e)
              , r = n.has;
            return "function" != typeof r && (n = new (i("Set"))(e),
            r = c(n.has)),
            !s(t, function(e) {
                if (!1 === r.call(n, e))
                    return s.stop()
            }, void 0, !1, !0).stopped
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(15)
      , a = n(18)
      , c = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        isSupersetOf: function(e) {
            var t = i(this)
              , n = a(t.has);
            return !c(e, function(e) {
                if (!1 === n.call(t, e))
                    return c.stop()
            }).stopped
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(15)
      , a = n(34)
      , c = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        join: function(e) {
            var t = i(this)
              , n = a(t)
              , r = void 0 === e ? "," : String(e)
              , o = [];
            return c(n, o.push, o, !1, !0),
            o.join(r)
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , c = n(25)
      , u = n(15)
      , s = n(18)
      , d = n(21)
      , f = n(38)
      , l = n(34)
      , p = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        map: function(e, t) {
            var n = u(this)
              , r = l(n)
              , o = d(e, 1 < arguments.length ? t : void 0, 3)
              , i = new (f(n, c("Set")))
              , a = s(i.add);
            return p(r, function(e) {
                a.call(i, o(e, e, n))
            }, void 0, !1, !0),
            i
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , a = n(15)
      , c = n(18)
      , u = n(34)
      , s = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        reduce: function(t, e) {
            var n = a(this)
              , r = u(n)
              , o = arguments.length < 2
              , i = o ? void 0 : e;
            if (c(t),
            s(r, function(e) {
                i = o ? (o = !1,
                e) : t(i, e, e, n)
            }, void 0, !1, !0),
            o)
                throw TypeError("Reduce of empty set with no initial value");
            return i
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(15)
      , a = n(21)
      , c = n(34)
      , u = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        some: function(e, t) {
            var n = i(this)
              , r = c(n)
              , o = a(e, 1 < arguments.length ? t : void 0, 3);
            return u(r, function(e) {
                if (o(e, e, n))
                    return u.stop()
            }, void 0, !1, !0).stopped
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(25)
      , a = n(15)
      , c = n(18)
      , u = n(38)
      , s = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        symmetricDifference: function(e) {
            var t = a(this)
              , n = new (u(t, i("Set")))(t)
              , r = c(n.delete)
              , o = c(n.add);
            return s(e, function(e) {
                r.call(n, e) || o.call(n, e)
            }),
            n
        }
    })
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(16)
      , i = n(25)
      , a = n(15)
      , c = n(18)
      , u = n(38)
      , s = n(17);
    r({
        target: "Set",
        proto: !0,
        real: !0,
        forced: o
    }, {
        union: function(e) {
            var t = a(this)
              , n = new (u(t, i("Set")))(t);
            return s(e, c(n.add), n),
            n
        }
    })
}
, function(e, t, n) {
    n(90),
    n(163);
    var r = n(43);
    e.exports = r.Array.from
}
, function(e, t, n) {
    var r = n(14)
      , o = n(164);
    r({
        target: "Array",
        stat: !0,
        forced: !n(166)(function(e) {
            Array.from(e)
        })
    }, {
        from: o
    })
}
, function(e, t, n) {
    "use strict";
    var b = n(21)
      , v = n(58)
      , h = n(83)
      , m = n(82)
      , S = n(51)
      , A = n(165)
      , E = n(62);
    e.exports = function(e, t, n) {
        var r, o, i, a, c, u, s = v(e), d = "function" == typeof this ? this : Array, f = arguments.length, l = 1 < f ? t : void 0, p = void 0 !== l, g = E(s), y = 0;
        if (p && (l = b(l, 2 < f ? n : void 0, 2)),
        null == g || d == Array && m(g))
            for (o = new d(r = S(s.length)); y < r; y++)
                u = p ? l(s[y], y) : s[y],
                A(o, y, u);
        else
            for (c = (a = g.call(s)).next,
            o = new d; !(i = c.call(a)).done; y++)
                u = p ? h(a, l, [i.value, y], !0) : i.value,
                A(o, y, u);
        return o.length = y,
        o
    }
}
, function(e, t, n) {
    "use strict";
    var o = n(56)
      , i = n(31)
      , a = n(47);
    e.exports = function(e, t, n) {
        var r = o(t);
        r in e ? i.f(e, r, a(0, n)) : e[r] = n
    }
}
, function(e, t, n) {
    var o = n(19)("iterator")
      , i = !1;
    try {
        var r = 0
          , a = {
            next: function() {
                return {
                    done: !!r++
                }
            },
            return: function() {
                i = !0
            }
        };
        a[o] = function() {
            return this
        }
        ,
        Array.from(a, function() {
            throw 2
        })
    } catch (e) {}
    e.exports = function(e, t) {
        if (!t && !i)
            return !1;
        var n = !1;
        try {
            var r = {};
            r[o] = function() {
                return {
                    next: function() {
                        return {
                            done: n = !0
                        }
                    }
                }
            }
            ,
            e(r)
        } catch (e) {}
        return n
    }
}
, function(e, t) {
    e.exports = function e(t) {
        var n = Array.isArray(t) ? [] : {};
        for (var r in t) {
            var o = t[r];
            n[r] = o && "object" == typeof o ? e(o) : o
        }
        return n
    }
}
, function(e, t, n) {
    var f = n(93)
      , l = n(170)
      , o = n(171)
      , p = n(177)
      , g = n(179)
      , y = n(181)
      , b = Date.prototype.getTime;
    function v(e, t, n) {
        var r = n || {};
        return !(r.strict ? !o(e, t) : e !== t) || (!e || !t || "object" != typeof e && "object" != typeof t ? r.strict ? o(e, t) : e == t : function(e, t, n) {
            var r, o;
            if (typeof e != typeof t)
                return !1;
            if (h(e) || h(t))
                return !1;
            if (e.prototype !== t.prototype)
                return !1;
            if (l(e) !== l(t))
                return !1;
            var i = p(e)
              , a = p(t);
            if (i !== a)
                return !1;
            if (i || a)
                return e.source === t.source && g(e) === g(t);
            if (y(e) && y(t))
                return b.call(e) === b.call(t);
            var c = m(e)
              , u = m(t);
            if (c !== u)
                return !1;
            if (c || u) {
                if (e.length !== t.length)
                    return !1;
                for (r = 0; r < e.length; r++)
                    if (e[r] !== t[r])
                        return !1;
                return !0
            }
            if (typeof e != typeof t)
                return !1;
            try {
                var s = f(e)
                  , d = f(t)
            } catch (e) {
                return !1
            }
            if (s.length !== d.length)
                return !1;
            for (s.sort(),
            d.sort(),
            r = s.length - 1; 0 <= r; r--)
                if (s[r] != d[r])
                    return !1;
            for (r = s.length - 1; 0 <= r; r--)
                if (o = s[r],
                !v(e[o], t[o], n))
                    return !1;
            return !0
        }(e, t, r))
    }
    function h(e) {
        return null == e
    }
    function m(e) {
        return !(!e || "object" != typeof e || "number" != typeof e.length) && ("function" == typeof e.copy && "function" == typeof e.slice && !(0 < e.length && "number" != typeof e[0]))
    }
    e.exports = v
}
, function(e, t, n) {
    "use strict";
    var l, p, g, r, y, b, v, h, o, m, i;
    Object.keys || (l = Object.prototype.hasOwnProperty,
    p = Object.prototype.toString,
    g = n(94),
    r = Object.prototype.propertyIsEnumerable,
    y = !r.call({
        toString: null
    }, "toString"),
    b = r.call(function() {}, "prototype"),
    v = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
    h = function(e) {
        var t = e.constructor;
        return t && t.prototype === e
    }
    ,
    o = {
        $applicationCache: !0,
        $console: !0,
        $external: !0,
        $frame: !0,
        $frameElement: !0,
        $frames: !0,
        $innerHeight: !0,
        $innerWidth: !0,
        $onmozfullscreenchange: !0,
        $onmozfullscreenerror: !0,
        $outerHeight: !0,
        $outerWidth: !0,
        $pageXOffset: !0,
        $pageYOffset: !0,
        $parent: !0,
        $scrollLeft: !0,
        $scrollTop: !0,
        $scrollX: !0,
        $scrollY: !0,
        $self: !0,
        $webkitIndexedDB: !0,
        $webkitStorageInfo: !0,
        $window: !0
    },
    m = function() {
        if ("undefined" == typeof window)
            return !1;
        for (var e in window)
            try {
                if (!o["$" + e] && l.call(window, e) && null !== window[e] && "object" == typeof window[e])
                    try {
                        h(window[e])
                    } catch (e) {
                        return !0
                    }
            } catch (e) {
                return !0
            }
        return !1
    }(),
    i = function(e) {
        var t = null !== e && "object" == typeof e
          , n = "[object Function]" === p.call(e)
          , r = g(e)
          , o = t && "[object String]" === p.call(e)
          , i = [];
        if (!t && !n && !r)
            throw new TypeError("Object.keys called on a non-object");
        var a = b && n;
        if (o && 0 < e.length && !l.call(e, 0))
            for (var c = 0; c < e.length; ++c)
                i.push(String(c));
        if (r && 0 < e.length)
            for (var u = 0; u < e.length; ++u)
                i.push(String(u));
        else
            for (var s in e)
                a && "prototype" === s || !l.call(e, s) || i.push(String(s));
        if (y)
            for (var d = function(e) {
                if ("undefined" == typeof window || !m)
                    return h(e);
                try {
                    return h(e)
                } catch (e) {
                    return !1
                }
            }(e), f = 0; f < v.length; ++f)
                d && "constructor" === v[f] || !l.call(e, v[f]) || i.push(v[f]);
        return i
    }
    ),
    e.exports = i
}
, function(e, t, n) {
    "use strict";
    function r(e) {
        return !(i && e && "object" == typeof e && Symbol.toStringTag in e) && "[object Arguments]" === a.call(e)
    }
    function o(e) {
        return !!r(e) || null !== e && "object" == typeof e && "number" == typeof e.length && 0 <= e.length && "[object Array]" !== a.call(e) && "[object Function]" === a.call(e.callee)
    }
    var i = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag
      , a = Object.prototype.toString
      , c = function() {
        return r(arguments)
    }();
    r.isLegacyArguments = o,
    e.exports = c ? r : o
}
, function(e, t, n) {
    "use strict";
    var r = n(44)
      , o = n(95)
      , i = n(96)
      , a = n(97)
      , c = n(176)
      , u = o(a(), Object);
    r(u, {
        getPolyfill: a,
        implementation: i,
        shim: c
    }),
    e.exports = u
}
, function(e, t, n) {
    "use strict";
    var u = Array.prototype.slice
      , s = Object.prototype.toString;
    e.exports = function(t) {
        var n = this;
        if ("function" != typeof n || "[object Function]" !== s.call(n))
            throw new TypeError("Function.prototype.bind called on incompatible " + n);
        for (var r, e, o = u.call(arguments, 1), i = Math.max(0, n.length - o.length), a = [], c = 0; c < i; c++)
            a.push("$" + c);
        return r = Function("binder", "return function (" + a.join(",") + "){ return binder.apply(this,arguments); }")(function() {
            if (this instanceof r) {
                var e = n.apply(this, o.concat(u.call(arguments)));
                return Object(e) === e ? e : this
            }
            return n.apply(t, o.concat(u.call(arguments)))
        }),
        n.prototype && ((e = function() {}
        ).prototype = n.prototype,
        r.prototype = new e,
        e.prototype = null),
        r
    }
}
, function(e, t, n) {
    "use strict";
    var r, c = TypeError, u = Object.getOwnPropertyDescriptor;
    if (u)
        try {
            u({}, "")
        } catch (e) {
            u = null
        }
    function o() {
        throw new c
    }
    var i = u ? function() {
        try {
            return o
        } catch (e) {
            try {
                return u(arguments, "callee").get
            } catch (e) {
                return o
            }
        }
    }() : o
      , a = n(174)()
      , s = Object.getPrototypeOf || function(e) {
        return e.__proto__
    }
      , d = r
      , f = "undefined" == typeof Uint8Array ? r : s(Uint8Array)
      , l = {
        "%Array%": Array,
        "%ArrayBuffer%": "undefined" == typeof ArrayBuffer ? r : ArrayBuffer,
        "%ArrayBufferPrototype%": "undefined" == typeof ArrayBuffer ? r : ArrayBuffer.prototype,
        "%ArrayIteratorPrototype%": a ? s([][Symbol.iterator]()) : r,
        "%ArrayPrototype%": Array.prototype,
        "%ArrayProto_entries%": Array.prototype.entries,
        "%ArrayProto_forEach%": Array.prototype.forEach,
        "%ArrayProto_keys%": Array.prototype.keys,
        "%ArrayProto_values%": Array.prototype.values,
        "%AsyncFromSyncIteratorPrototype%": r,
        "%AsyncFunction%": void 0,
        "%AsyncFunctionPrototype%": r,
        "%AsyncGenerator%": r,
        "%AsyncGeneratorFunction%": void 0,
        "%AsyncGeneratorPrototype%": r,
        "%AsyncIteratorPrototype%": d && a && Symbol.asyncIterator ? d[Symbol.asyncIterator]() : r,
        "%Atomics%": "undefined" == typeof Atomics ? r : Atomics,
        "%Boolean%": Boolean,
        "%BooleanPrototype%": Boolean.prototype,
        "%DataView%": "undefined" == typeof DataView ? r : DataView,
        "%DataViewPrototype%": "undefined" == typeof DataView ? r : DataView.prototype,
        "%Date%": Date,
        "%DatePrototype%": Date.prototype,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%ErrorPrototype%": Error.prototype,
        "%eval%": eval,
        "%EvalError%": EvalError,
        "%EvalErrorPrototype%": EvalError.prototype,
        "%Float32Array%": "undefined" == typeof Float32Array ? r : Float32Array,
        "%Float32ArrayPrototype%": "undefined" == typeof Float32Array ? r : Float32Array.prototype,
        "%Float64Array%": "undefined" == typeof Float64Array ? r : Float64Array,
        "%Float64ArrayPrototype%": "undefined" == typeof Float64Array ? r : Float64Array.prototype,
        "%Function%": Function,
        "%FunctionPrototype%": Function.prototype,
        "%Generator%": r,
        "%GeneratorFunction%": void 0,
        "%GeneratorPrototype%": r,
        "%Int8Array%": "undefined" == typeof Int8Array ? r : Int8Array,
        "%Int8ArrayPrototype%": "undefined" == typeof Int8Array ? r : Int8Array.prototype,
        "%Int16Array%": "undefined" == typeof Int16Array ? r : Int16Array,
        "%Int16ArrayPrototype%": "undefined" == typeof Int16Array ? r : Int8Array.prototype,
        "%Int32Array%": "undefined" == typeof Int32Array ? r : Int32Array,
        "%Int32ArrayPrototype%": "undefined" == typeof Int32Array ? r : Int32Array.prototype,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": a ? s(s([][Symbol.iterator]())) : r,
        "%JSON%": "object" == typeof JSON ? JSON : r,
        "%JSONParse%": "object" == typeof JSON ? JSON.parse : r,
        "%Map%": "undefined" == typeof Map ? r : Map,
        "%MapIteratorPrototype%": "undefined" != typeof Map && a ? s((new Map)[Symbol.iterator]()) : r,
        "%MapPrototype%": "undefined" == typeof Map ? r : Map.prototype,
        "%Math%": Math,
        "%Number%": Number,
        "%NumberPrototype%": Number.prototype,
        "%Object%": Object,
        "%ObjectPrototype%": Object.prototype,
        "%ObjProto_toString%": Object.prototype.toString,
        "%ObjProto_valueOf%": Object.prototype.valueOf,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": "undefined" == typeof Promise ? r : Promise,
        "%PromisePrototype%": "undefined" == typeof Promise ? r : Promise.prototype,
        "%PromiseProto_then%": "undefined" == typeof Promise ? r : Promise.prototype.then,
        "%Promise_all%": "undefined" == typeof Promise ? r : Promise.all,
        "%Promise_reject%": "undefined" == typeof Promise ? r : Promise.reject,
        "%Promise_resolve%": "undefined" == typeof Promise ? r : Promise.resolve,
        "%Proxy%": "undefined" == typeof Proxy ? r : Proxy,
        "%RangeError%": RangeError,
        "%RangeErrorPrototype%": RangeError.prototype,
        "%ReferenceError%": ReferenceError,
        "%ReferenceErrorPrototype%": ReferenceError.prototype,
        "%Reflect%": "undefined" == typeof Reflect ? r : Reflect,
        "%RegExp%": RegExp,
        "%RegExpPrototype%": RegExp.prototype,
        "%Set%": "undefined" == typeof Set ? r : Set,
        "%SetIteratorPrototype%": "undefined" != typeof Set && a ? s((new Set)[Symbol.iterator]()) : r,
        "%SetPrototype%": "undefined" == typeof Set ? r : Set.prototype,
        "%SharedArrayBuffer%": "undefined" == typeof SharedArrayBuffer ? r : SharedArrayBuffer,
        "%SharedArrayBufferPrototype%": "undefined" == typeof SharedArrayBuffer ? r : SharedArrayBuffer.prototype,
        "%String%": String,
        "%StringIteratorPrototype%": a ? s(""[Symbol.iterator]()) : r,
        "%StringPrototype%": String.prototype,
        "%Symbol%": a ? Symbol : r,
        "%SymbolPrototype%": a ? Symbol.prototype : r,
        "%SyntaxError%": SyntaxError,
        "%SyntaxErrorPrototype%": SyntaxError.prototype,
        "%ThrowTypeError%": i,
        "%TypedArray%": f,
        "%TypedArrayPrototype%": f ? f.prototype : r,
        "%TypeError%": c,
        "%TypeErrorPrototype%": c.prototype,
        "%Uint8Array%": "undefined" == typeof Uint8Array ? r : Uint8Array,
        "%Uint8ArrayPrototype%": "undefined" == typeof Uint8Array ? r : Uint8Array.prototype,
        "%Uint8ClampedArray%": "undefined" == typeof Uint8ClampedArray ? r : Uint8ClampedArray,
        "%Uint8ClampedArrayPrototype%": "undefined" == typeof Uint8ClampedArray ? r : Uint8ClampedArray.prototype,
        "%Uint16Array%": "undefined" == typeof Uint16Array ? r : Uint16Array,
        "%Uint16ArrayPrototype%": "undefined" == typeof Uint16Array ? r : Uint16Array.prototype,
        "%Uint32Array%": "undefined" == typeof Uint32Array ? r : Uint32Array,
        "%Uint32ArrayPrototype%": "undefined" == typeof Uint32Array ? r : Uint32Array.prototype,
        "%URIError%": URIError,
        "%URIErrorPrototype%": URIError.prototype,
        "%WeakMap%": "undefined" == typeof WeakMap ? r : WeakMap,
        "%WeakMapPrototype%": "undefined" == typeof WeakMap ? r : WeakMap.prototype,
        "%WeakSet%": "undefined" == typeof WeakSet ? r : WeakSet,
        "%WeakSetPrototype%": "undefined" == typeof WeakSet ? r : WeakSet.prototype
    }
      , p = n(68).call(Function.call, String.prototype.replace)
      , g = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g
      , y = /\\(\\)?/g;
    e.exports = function(e, t) {
        if ("string" != typeof e || 0 === e.length)
            throw new TypeError("intrinsic name must be a non-empty string");
        if (1 < arguments.length && "boolean" != typeof t)
            throw new TypeError('"allowMissing" argument must be a boolean');
        for (var o, n = (o = [],
        p(e, g, function(e, t, n, r) {
            o[o.length] = n ? p(r, y, "$1") : t || e
        }),
        o), r = function(e, t) {
            if (!(e in l))
                throw new SyntaxError("intrinsic " + e + " does not exist!");
            if (void 0 === l[e] && !t)
                throw new c("intrinsic " + e + " exists, but is not available. Please file an issue!");
            return l[e]
        }("%" + (0 < n.length ? n[0] : "") + "%", t), i = 1; i < n.length; i += 1)
            if (null != r)
                if (u && i + 1 >= n.length) {
                    var a = u(r, n[i]);
                    if (!(t || n[i]in r))
                        throw new c("base intrinsic for " + e + " exists, but the property is not available.");
                    r = a ? a.get || a.value : r[n[i]]
                } else
                    r = r[n[i]];
        return r
    }
}
, function(r, e, o) {
    "use strict";
    (function(e) {
        var t = e.Symbol
          , n = o(175);
        r.exports = function() {
            return "function" == typeof t && ("function" == typeof Symbol && ("symbol" == typeof t("foo") && ("symbol" == typeof Symbol("bar") && n())))
        }
    }
    ).call(e, o(33))
}
, function(e, t, n) {
    "use strict";
    e.exports = function() {
        if ("function" != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols)
            return !1;
        if ("symbol" == typeof Symbol.iterator)
            return !0;
        var e = {}
          , t = Symbol("test")
          , n = Object(t);
        if ("string" == typeof t)
            return !1;
        if ("[object Symbol]" !== Object.prototype.toString.call(t))
            return !1;
        if ("[object Symbol]" !== Object.prototype.toString.call(n))
            return !1;
        for (t in e[t] = 42,
        e)
            return !1;
        if ("function" == typeof Object.keys && 0 !== Object.keys(e).length)
            return !1;
        if ("function" == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(e).length)
            return !1;
        var r = Object.getOwnPropertySymbols(e);
        if (1 !== r.length || r[0] !== t)
            return !1;
        if (!Object.prototype.propertyIsEnumerable.call(e, t))
            return !1;
        if ("function" == typeof Object.getOwnPropertyDescriptor) {
            var o = Object.getOwnPropertyDescriptor(e, t);
            if (42 !== o.value || !0 !== o.enumerable)
                return !1
        }
        return !0
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(97)
      , o = n(44);
    e.exports = function() {
        var e = r();
        return o(Object, {
            is: e
        }, {
            is: function() {
                return Object.is !== e
            }
        }),
        e
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(178)
      , o = RegExp.prototype.exec
      , i = Object.getOwnPropertyDescriptor
      , a = Object.prototype.toString
      , c = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag;
    e.exports = function(e) {
        if (!e || "object" != typeof e)
            return !1;
        if (!c)
            return "[object RegExp]" === a.call(e);
        var t = i(e, "lastIndex");
        return !(!t || !r(t, "value")) && function(e) {
            try {
                var t = e.lastIndex;
                return e.lastIndex = 0,
                o.call(e),
                !0
            } catch (e) {
                return !1
            } finally {
                e.lastIndex = t
            }
        }(e)
    }
}
, function(e, t, n) {
    "use strict";
    var r = n(68);
    e.exports = r.call(Function.call, Object.prototype.hasOwnProperty)
}
, function(e, t, n) {
    "use strict";
    var r = n(44)
      , o = n(95)
      , i = n(98)
      , a = n(99)
      , c = n(180)
      , u = o(i);
    r(u, {
        getPolyfill: a,
        implementation: i,
        shim: c
    }),
    e.exports = u
}
, function(e, t, n) {
    "use strict";
    var r = n(44).supportsDescriptors
      , o = n(99)
      , i = Object.getOwnPropertyDescriptor
      , a = Object.defineProperty
      , c = TypeError
      , u = Object.getPrototypeOf
      , s = /a/;
    e.exports = function() {
        if (!r || !u)
            throw new c("RegExp.prototype.flags requires a true ES5 environment that supports property descriptors");
        var e = o()
          , t = u(s)
          , n = i(t, "flags");
        return n && n.get === e || a(t, "flags", {
            configurable: !0,
            enumerable: !1,
            get: e
        }),
        e
    }
}
, function(e, t, n) {
    "use strict";
    var r = Date.prototype.getDay
      , o = Object.prototype.toString
      , i = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag;
    e.exports = function(e) {
        return "object" == typeof e && null !== e && (i ? function(e) {
            try {
                return r.call(e),
                !0
            } catch (e) {
                return !1
            }
        }(e) : "[object Date]" === o.call(e))
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function(e, t, n, r, o) {
        for (t = t.split ? t.split(".") : t,
        r = 0; r < t.length; r++)
            e = e ? e[t[r]] : o;
        return e === o ? n : e
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function(e, t, n) {
        t.split && (t = t.split("."));
        for (var r, o = 0, i = t.length, a = e; o < i; ++o)
            r = a[t[o]],
            a = a[t[o]] = o === i - 1 ? n : null != r ? r : !~t[o + 1].indexOf(".") && -1 < +t[o + 1] ? [] : {}
    }
}
, function(e, t) {
    h.SYNC = 1,
    h.ASYNC = 2,
    h.QUEUE = 4;
    var g = "fun-hooks";
    var n = Object.freeze({
        useProxy: !0,
        ready: 0
    })
      , y = new WeakMap
      , r = "2,1,0" === [1].reduce(function(e, t, n) {
        return [e, t, n]
    }, 2).toString() ? Array.prototype.reduce : function(e, t) {
        var n, r = Object(this), o = r.length >>> 0, i = 0;
        if (t)
            n = t;
        else {
            for (; i < o && !(i in r); )
                i++;
            n = r[i++]
        }
        for (; i < o; )
            i in r && (n = e(n, r[i], i, r)),
            i++;
        return n
    }
    ;
    function b(e, t) {
        return Array.prototype.slice.call(e, t)
    }
    var v = Object.assign || function(e) {
        return r.call(b(arguments, 1), function(t, n) {
            return n && Object.keys(n).forEach(function(e) {
                t[e] = n[e]
            }),
            t
        }, e)
    }
    ;
    function h(u) {
        var s, e = {}, d = [];
        function t(e, t) {
            return "function" == typeof e ? f.call(null, "sync", e, t) : "string" == typeof e && "function" == typeof t ? f.apply(null, arguments) : "object" == typeof e ? function(i, e, a) {
                var t = !0;
                void 0 === e && (e = Object.getOwnPropertyNames(i),
                t = !1);
                var c = {}
                  , n = ["constructor"];
                for (; (e = e.filter(function(e) {
                    return !("function" != typeof i[e] || -1 !== n.indexOf(e) || e.match(/^_/))
                })).forEach(function(e) {
                    var t, n = e.split(":"), r = n[0], o = n[1] || "sync";
                    c[r] || (t = i[r],
                    c[r] = i[r] = f(o, t, a ? [a, r] : void 0))
                }),
                i = Object.getPrototypeOf(i),
                t && i; )
                    ;
                return c
            }
            .apply(null, arguments) : void 0
        }
        function l(i) {
            var a = Array.isArray(i) ? i : i.split(".");
            return r.call(a, function(t, n, e) {
                var r = t[n]
                  , o = !1;
                return r || (e === a.length - 1 ? (s || d.push(function() {
                    o || console.warn(g + ": referenced '" + i + "' but it was never created")
                }),
                t[n] = p(function(e) {
                    t[n] = e,
                    o = !0
                })) : t[n] = {})
            }, e)
        }
        function p(r) {
            var i = []
              , a = []
              , c = function() {}
              , e = {
                before: function(e, t) {
                    return n.call(this, i, "before", e, t)
                },
                after: function(e, t) {
                    return n.call(this, a, "after", e, t)
                },
                getHooks: function(n) {
                    var e = i.concat(a);
                    "object" == typeof n && (e = e.filter(function(t) {
                        return Object.keys(n).every(function(e) {
                            return t[e] === n[e]
                        })
                    }));
                    try {
                        v(e, {
                            remove: function() {
                                return e.forEach(function(e) {
                                    e.remove()
                                }),
                                this
                            }
                        })
                    } catch (e) {
                        console.error("error adding `remove` to array, did you modify Array.prototype?")
                    }
                    return e
                },
                removeAll: function() {
                    return this.getHooks().remove()
                }
            }
              , t = {
                install: function(e, t, n) {
                    this.type = e,
                    (c = n)(i, a),
                    r && r(t)
                }
            };
            return y.set(e.after, t),
            e;
            function n(t, e, n, r) {
                var o = {
                    hook: n,
                    type: e,
                    priority: r || 10,
                    remove: function() {
                        var e = t.indexOf(o);
                        -1 !== e && (t.splice(e, 1),
                        c(i, a))
                    }
                };
                return t.push(o),
                t.sort(function(e, t) {
                    return t.priority - e.priority
                }),
                c(i, a),
                this
            }
        }
        function f(f, e, t) {
            var n = e.after && y.get(e.after);
            if (n) {
                if (n.type !== f)
                    throw g + ": recreated hookable with different type";
                return e
            }
            var r, o, i = t ? l(t) : p(), a = {
                get: function(e, t) {
                    return i[t] || Reflect.get.apply(Reflect, arguments)
                }
            };
            return s || d.push(c),
            u.useProxy && "function" == typeof Proxy && Proxy.revocable ? o = new Proxy(e,a) : v(o = function() {
                return a.apply ? a.apply(e, this, b(arguments)) : e.apply(this, arguments)
            }
            , i),
            y.get(o.after).install(f, o, function(e, t) {
                var s, d = [];
                r = e.length || t.length ? (e.forEach(n),
                s = d.push(void 0) - 1,
                t.forEach(n),
                function(n, r, e) {
                    var o, i = 0, a = "async" === f && "function" == typeof e[e.length - 1] && e.pop();
                    function c(e) {
                        "sync" === f ? o = e : a && a.apply(null, arguments)
                    }
                    function u(e) {
                        if (d[i]) {
                            var t = b(arguments);
                            return u.bail = c,
                            t.unshift(u),
                            d[i++].apply(r, t)
                        }
                        "sync" === f ? o = e : a && a.apply(null, arguments)
                    }
                    return d[s] = function() {
                        var e = b(arguments, 1);
                        "async" === f && a && (delete u.bail,
                        e.push(u));
                        var t = n.apply(r, e);
                        "sync" === f && u(t)
                    }
                    ,
                    u.apply(null, e),
                    o
                }
                ) : void 0;
                function n(e) {
                    d.push(e.hook)
                }
                c()
            }),
            o;
            function c() {
                !s && ("sync" !== f || u.ready & h.SYNC) && ("async" !== f || u.ready & h.ASYNC) ? "sync" !== f && u.ready & h.QUEUE ? a.apply = function() {
                    var e = arguments;
                    d.push(function() {
                        o.apply(e[1], e[2])
                    })
                }
                : a.apply = function() {
                    throw g + ": hooked function not ready"
                }
                : a.apply = r
            }
        }
        return (u = v({}, n, u)).ready ? t.ready = function() {
            s = !0,
            function(e) {
                for (var t; t = e.shift(); )
                    t()
            }(d)
        }
        : s = !0,
        t.get = l,
        t
    }
    e.exports = h
}
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, n) {
    n(239);
    var r = n(53);
    e.exports = r("Array", "findIndex")
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(57).findIndex
      , i = n(52)
      , a = n(61)
      , c = "findIndex"
      , u = !0
      , s = a(c);
    c in [] && Array(1)[c](function() {
        u = !1
    }),
    r({
        target: "Array",
        proto: !0,
        forced: u || !s
    }, {
        findIndex: function(e, t) {
            return o(this, e, 1 < arguments.length ? t : void 0)
        }
    }),
    i(c)
}
, , , , , , , function(e, t, n) {
    "use strict";
    t.a = function() {
        window.addEventListener("message", c, !1)
    }
    ;
    var r = n(8)
      , g = n.n(r)
      , y = n(35)
      , o = n(5)
      , b = (n.n(o),
    n(0))
      , v = n(26)
      , i = n(11)
      , h = n.n(i)
      , m = n(10)
      , a = n(12)
      , S = n.n(a)
      , A = o.EVENTS.BID_WON;
    function c(e) {
        var t, n, r, o, i, a, c, u, s, d = e.message ? "message" : "data", f = {};
        try {
            f = JSON.parse(e[d])
        } catch (e) {
            return
        }
        if (f && f.adId) {
            var l = h()(v.a.getBidsReceived(), function(e) {
                return e.adId === f.adId
            });
            if (l && "Prebid Request" === f.message && (n = e,
            r = (t = l).adId,
            o = t.ad,
            i = t.adUrl,
            a = t.width,
            c = t.height,
            u = t.renderer,
            s = t.cpm,
            Object(m.c)(u) ? Object(m.b)(u, t) : r && (function(e) {
                var i = e.adId
                  , a = e.adUnitCode
                  , r = e.width
                  , o = e.height;
                function c(e) {
                    var t, n, r = (t = i,
                    n = a,
                    window.googletag ? function(n) {
                        return h()(window.googletag.pubads().getSlots(), function(t) {
                            return h()(t.getTargetingKeys(), function(e) {
                                return S()(t.getTargeting(e), n)
                            })
                        }).getSlotElementId()
                    }(t) : window.apntag ? function(e) {
                        var t = window.apntag.getTag(e);
                        return t && t.targetId
                    }(n) : n), o = document.getElementById(r);
                    return o && o.querySelector(e)
                }
                ["div", "iframe"].forEach(function(e) {
                    var t, n = c(e + ':not([style*="display: none"])');
                    n ? ((t = n.style).width = r + "px",
                    t.height = o + "px") : Object(b.logWarn)("Unable to locate matching page element for adUnitCode ".concat(a, ".  Can't resize it to ad's dimensions.  Please review setup."))
                })
            }(t),
            n.source.postMessage(JSON.stringify({
                message: "Prebid Response",
                ad: Object(b.replaceAuctionPrice)(o, s),
                adUrl: Object(b.replaceAuctionPrice)(i, s),
                adId: r,
                width: a,
                height: c
            }), n.origin)),
            v.a.addWinningBid(l),
            g.a.emit(A, l)),
            l && "Prebid Native" === f.message) {
                if ("assetRequest" === f.action) {
                    var p = Object(y.c)(f, l);
                    return void e.source.postMessage(JSON.stringify(p), e.origin)
                }
                if ("click" === Object(y.b)(f, l))
                    return;
                v.a.addWinningBid(l),
                g.a.emit(A, l)
            }
        }
    }
}
, function(e, t, n) {
    "use strict";
    t.a = function(e) {
        var t;
        try {
            e = e || window.sessionStorage,
            t = JSON.parse(e.getItem(u))
        } catch (e) {}
        t && p(t, !0)
    }
    ;
    var r, o, i = n(3), a = n(0), c = n(41), u = "owpbjs:debugging";
    function s(e) {
        Object(a.logMessage)("DEBUG: " + e)
    }
    function d(e) {
        Object(a.logWarn)("DEBUG: " + e)
    }
    function f(e) {
        r = function(e, t, n) {
            if (y(this.bidders, n.bidderCode))
                return void d("bidder '".concat(n.bidderCode, "' excluded from auction by bidder overrides"));
            Array.isArray(this.bids) && this.bids.forEach(function(e) {
                g(e, n.bidderCode, t) || b(e, n, "bidder")
            });
            e(t, n)
        }
        .bind(e),
        c.c.before(r, 5),
        o = function(e, t) {
            var r = this
              , n = t.filter(function(e) {
                return !y(r.bidders, e.bidderCode) || (d("bidRequest '".concat(e.bidderCode, "' excluded from auction by bidder overrides")),
                !1)
            });
            Array.isArray(r.bidRequests) && n.forEach(function(n) {
                r.bidRequests.forEach(function(t) {
                    n.bids.forEach(function(e) {
                        g(t, n.bidderCode, e.adUnitCode) || b(t, e, "bidRequest")
                    })
                })
            });
            e(n)
        }
        .bind(e),
        c.e.before(o, 5)
    }
    function l() {
        c.c.getHooks({
            hook: r
        }).remove(),
        c.e.getHooks({
            hook: o
        }).remove()
    }
    function p(e, t) {
        var n = 1 < arguments.length && void 0 !== t && t;
        i.b.setConfig({
            debug: !0
        }),
        l(),
        f(e),
        s("bidder overrides enabled".concat(n ? " from session" : ""))
    }
    function g(e, t, n) {
        return e.bidder && e.bidder !== t || !(!e.adUnitCode || e.adUnitCode === n)
    }
    function y(e, t) {
        return Array.isArray(e) && -1 === e.indexOf(t)
    }
    function b(n, e, r) {
        return Object.keys(n).filter(function(e) {
            return -1 === ["adUnitCode", "bidder"].indexOf(e)
        }).reduce(function(e, t) {
            return s("bidder overrides changed '".concat(e.adUnitCode, "/").concat(e.bidderCode, "' ").concat(r, ".").concat(t, " from '").concat(e[t], ".js' to '").concat(n[t], "'")),
            e[t] = n[t],
            e
        }, e)
    }
    function v(e) {
        if (e.enabled) {
            try {
                window.sessionStorage.setItem(u, JSON.stringify(e))
            } catch (e) {}
            p(e)
        } else {
            l(),
            s("bidder overrides disabled");
            try {
                window.sessionStorage.removeItem(u)
            } catch (e) {}
        }
    }
    i.b.getConfig("debugging", function(e) {
        return v(e.debugging)
    })
}
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, n) {
    var r = n(359);
    e.exports = r
}
, function(e, t, n) {
    n(360);
    var r = n(53);
    e.exports = r("String", "includes")
}
, function(e, t, n) {
    "use strict";
    var r = n(14)
      , o = n(361)
      , i = n(50);
    r({
        target: "String",
        proto: !0,
        forced: !n(363)("includes")
    }, {
        includes: function(e, t) {
            return !!~String(i(this)).indexOf(o(e), 1 < arguments.length ? t : void 0)
        }
    })
}
, function(e, t, n) {
    var r = n(362);
    e.exports = function(e) {
        if (r(e))
            throw TypeError("The method doesn't accept regular expressions");
        return e
    }
}
, function(e, t, n) {
    var r = n(23)
      , o = n(49)
      , i = n(19)("match");
    e.exports = function(e) {
        var t;
        return r(e) && (void 0 !== (t = e[i]) ? !!t : "RegExp" == o(e))
    }
}
, function(e, t, n) {
    var r = n(19)("match");
    e.exports = function(t) {
        var n = /./;
        try {
            "/./"[t](n)
        } catch (e) {
            try {
                return n[r] = !1,
                "/./"[t](n)
            } catch (e) {}
        }
        return !1
    }
}
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, n) {
    var r = n(486);
    e.exports = r
}
, function(e, t, n) {
    n(487);
    var r = n(43);
    e.exports = r.Number.isInteger
}
, function(e, t, n) {
    n(14)({
        target: "Number",
        stat: !0
    }, {
        isInteger: n(488)
    })
}
, function(e, t, n) {
    var r = n(23)
      , o = Math.floor;
    e.exports = function(e) {
        return !r(e) && isFinite(e) && o(e) === e
    }
}
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, n) {
    e.exports = n(71)
}
]);
owpbjsChunk([293], {
    244: function(e, t, i) {
        e.exports = i(245)
    },
    245: function(e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.callPrebidCacheHook = _,
        t.checkAdUnitSetupHook = R,
        t.checkVideoBidSetupHook = K,
        t.adpodSetConfig = P,
        t.callPrebidCacheAfterAuction = x,
        t.sortByPricePerSecond = z,
        t.getTargeting = G;
        var h = i(0)
          , p = i(41)
          , n = i(71)
          , a = i(36)
          , r = i(13)
          , u = i(102)
          , y = i(3)
          , m = i(2)
          , o = i(80)
          , s = i.n(o)
          , d = i(11)
          , c = i.n(d)
          , T = i(26)
          , l = i(5)
          , f = i.n(l);
        function C() {
            return (C = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = arguments[t];
                    for (var n in i)
                        Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n])
                }
                return e
            }
            ).apply(this, arguments)
        }
        function S(e, t, i) {
            return t in e ? Object.defineProperty(e, t, {
                value: i,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = i,
            e
        }
        function A(e, t) {
            return function(e) {
                if (Array.isArray(e))
                    return e
            }(e) || function(e, t) {
                if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
                    return;
                var i = []
                  , n = !0
                  , a = !1
                  , r = void 0;
                try {
                    for (var o, d = e[Symbol.iterator](); !(n = (o = d.next()).done) && (i.push(o.value),
                    !t || i.length !== t); n = !0)
                        ;
                } catch (e) {
                    a = !0,
                    r = e
                } finally {
                    try {
                        n || null == d.return || d.return()
                    } finally {
                        if (a)
                            throw r
                    }
                }
                return i
            }(e, t) || v(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function g(e) {
            return function(e) {
                if (Array.isArray(e))
                    return b(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                    return Array.from(e)
            }(e) || v(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function v(e, t) {
            if (e) {
                if ("string" == typeof e)
                    return b(e, t);
                var i = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === i && e.constructor && (i = e.constructor.name),
                "Map" === i || "Set" === i ? Array.from(e) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? b(e, t) : void 0
            }
        }
        function b(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var i = 0, n = new Array(t); i < t; i++)
                n[i] = e[i];
            return n
        }
        var I, E = i(92), j = "hb_pb_cat_dur", w = "hb_cache_id", D = 50, O = 5, U = (I = {},
        {
            addBid: function(e) {
                I[e.auctionId] || B(e.auctionId),
                I[e.auctionId].bidStorage.add(e)
            },
            removeBid: function(e) {
                I[e.auctionId].bidStorage.delete(e)
            },
            getBids: function(e) {
                return I[e.auctionId] && I[e.auctionId].bidStorage.values()
            },
            getQueueDispatcher: function(e) {
                return I[e.auctionId] && I[e.auctionId].queueDispatcher
            },
            setupInitialCacheKey: function(e) {
                I[e.auctionId] || (I[e.auctionId] = {},
                I[e.auctionId].initialCacheKey = h.generateUUID())
            },
            getInitialCacheKey: function(e) {
                return I[e.auctionId] && I[e.auctionId].initialCacheKey
            }
        });
        function B(e) {
            var o, d, c;
            I[e] = {},
            I[e].bidStorage = new s.a,
            I[e].queueDispatcher = (o = D,
            c = 1,
            function(e, t, i, n) {
                function a() {
                    (function(a, r, o) {
                        (function(e) {
                            for (var t = 0; t < e.length; t++)
                                U.removeBid(e[t])
                        }
                        )(r),
                        Object(u.b)(r, function(e, t) {
                            if (e) {
                                h.logWarn("Failed to save to the video cache: ".concat(e, ". Video bid(s) must be discarded."));
                                for (var i = 0; i < r.length; i++)
                                    Object(p.g)(a, r[i])
                            } else
                                for (var n = 0; n < t.length; n++)
                                    "" !== t[n].uuid ? Object(p.d)(a, r[n]) : h.logInfo("Detected a bid was not cached because the custom key was already registered.  Attempted to use key: ".concat(r[n].customCacheKey, ". Bid was: "), r[n]),
                                    o()
                        })
                    }
                    ).call(r, e, t, i)
                }
                var r = this;
                clearTimeout(d),
                n ? c = 1 : c === O ? (c = 1,
                a()) : (c++,
                d = setTimeout(a, o))
            }
            ),
            I[e].initialCacheKey = h.generateUUID()
        }
        function k(e, t) {
            var i, n, a, r, o, d = U.getInitialCacheKey(e), c = h.deepAccess(e, "video.durationBucket"), u = (i = e,
            y.b.getConfig("adpod.prioritizeDeals") && h.deepAccess(i, "video.dealTier") ? (n = y.b.getConfig("adpod.dealTier.".concat(i.bidderCode, ".prefix"))) ? n + h.deepAccess(i, "video.dealTier") : h.deepAccess(i, "video.dealTier") : (a = Object(p.i)(i.mediaType),
            Object(p.h)(a)(i)));
            o = t ? (r = h.deepAccess(e, "meta.adServerCatId"),
            "".concat(u, "_").concat(r, "_").concat(c, "s")) : "".concat(u, "_").concat(c, "s"),
            e.adserverTargeting || (e.adserverTargeting = {}),
            e.adserverTargeting[j] = o,
            e.adserverTargeting[w] = d,
            e.videoCacheKey = d,
            e.customCacheKey = "".concat(o, "_").concat(d)
        }
        function _(e, t, i, n, a) {
            var r, o, d, c, u, s, l, f, g = h.deepAccess(a, "mediaTypes.video");
            g && g.context === m.a ? (r = y.b.getConfig("adpod.brandCategoryExclusion"),
            !h.deepAccess(i, "meta.adServerCatId") && r ? (h.logWarn("Detected a bid without meta.adServerCatId while setConfig({adpod.brandCategoryExclusion}) was enabled.  This bid has been rejected:", i),
            n()) : !1 === y.b.getConfig("adpod.deferCaching") ? (U.addBid(i),
            k(i, r),
            o = t,
            d = i,
            c = n,
            (f = U.getBids(d)) ? (u = E(f),
            s = U.getQueueDispatcher(d),
            l = !(o.getAuctionStatus() === p.b),
            s(o, u, c, l)) : h.logWarn("Attempted to cache a bid from an unknown auction. Bid:", d)) : (U.setupInitialCacheKey(i),
            k(i, r),
            Object(p.d)(t, i),
            n())) : e.call(this, t, i, n, a)
        }
        function R(e, t) {
            t = t.filter(function(e) {
                var t = h.deepAccess(e, "mediaTypes")
                  , i = h.deepAccess(t, "video");
                if (i && i.context === m.a) {
                    if (1 < Object.keys(t).length)
                        return h.logWarn("Detected more than one mediaType in adUnitCode: ".concat(e.code, " while attempting to define an 'adpod' video adUnit.  'adpod' adUnits cannot be mixed with other mediaTypes.  This adUnit will be removed from the auction.")),
                        !1;
                    var n = "Detected missing or incorrectly setup fields for an adpod adUnit.  Please review the following fields of adUnitCode: ".concat(e.code, ".  This adUnit will be removed from the auction.")
                      , a = !!(i.playerSize && (h.isArrayOfNums(i.playerSize, 2) || h.isArray(i.playerSize) && i.playerSize.every(function(e) {
                        return h.isArrayOfNums(e, 2)
                    })) || i.sizeConfig)
                      , r = !!(i.adPodDurationSec && h.isNumber(i.adPodDurationSec) && 0 < i.adPodDurationSec)
                      , o = !!(i.durationRangeSec && h.isArrayOfNums(i.durationRangeSec) && i.durationRangeSec.every(function(e) {
                        return 0 < e
                    }));
                    if (!a || !r || !o)
                        return n += a ? "" : "\nmediaTypes.video.playerSize",
                        n += r ? "" : "\nmediaTypes.video.adPodDurationSec",
                        n += o ? "" : "\nmediaTypes.video.durationRangeSec",
                        h.logWarn(n),
                        !1
                }
                return !0
            }),
            e.call(this, t)
        }
        function K(e, t, i, n, a) {
            var r;
            a === m.a ? (r = !0,
            y.b.getConfig("adpod.brandCategoryExclusion") && !h.deepAccess(t, "meta.primaryCatId") && (r = !1),
            h.deepAccess(t, "video") && (h.deepAccess(t, "video.context") && t.video.context === m.a || (r = !1),
            h.deepAccess(t, "video.durationSeconds") && !(t.video.durationSeconds <= 0) && function(e, t) {
                var i = h.deepAccess(t, "video.durationSeconds")
                  , n = h.deepAccess(e, "mediaTypes.video")
                  , a = n.durationRangeSec;
                if (a.sort(function(e, t) {
                    return e - t
                }),
                n.requireExactDuration) {
                    if (!c()(a, function(e) {
                        return e === i
                    }))
                        return h.logWarn("Detected a bid with a duration value not part of the list of accepted ranges specified in adUnit.mediaTypes.video.durationRangeSec.  Exact match durations must be used for this adUnit. Rejecting bid: ", t),
                        !1;
                    t.video.durationBucket = i
                } else {
                    var r = Math.max.apply(Math, g(a));
                    if (!(i <= r + 2))
                        return h.logWarn("Detected a bid with a duration value outside the accepted ranges specified in adUnit.mediaTypes.video.durationRangeSec.  Rejecting bid: ", t),
                        !1;
                    var o = c()(a, function(e) {
                        return i <= e + 2
                    });
                    t.video.durationBucket = o
                }
                return !0
            }(i, t) || (r = !1)),
            y.b.getConfig("cache.url") || !t.vastXml || t.vastUrl || (h.logError('\n        This bid contains only vastXml and will not work when a prebid cache url is not specified.\n        Try enabling prebid cache with pbjs.setConfig({ cache: {url: "..."} });\n      '),
            r = !1),
            e.bail(r)) : e.call(this, t, i, n, a)
        }
        function P(e) {
            void 0 !== e.bidQueueTimeDelay && ("number" == typeof e.bidQueueTimeDelay && 0 < e.bidQueueTimeDelay ? D = e.bidQueueTimeDelay : h.logWarn("Detected invalid value for adpod.bidQueueTimeDelay in setConfig; must be a positive number.  Using default: ".concat(D))),
            void 0 !== e.bidQueueSizeLimit && ("number" == typeof e.bidQueueSizeLimit && 0 < e.bidQueueSizeLimit ? O = e.bidQueueSizeLimit : h.logWarn("Detected invalid value for adpod.bidQueueSizeLimit in setConfig; must be a positive number.  Using default: ".concat(O)))
        }
        function x(a, r) {
            Object(u.b)(a, function(e, t) {
                if (e)
                    r(e, null);
                else {
                    for (var i = [], n = 0; n < t.length; n++)
                        "" !== t[n] && i.push(a[n]);
                    r(null, i)
                }
            })
        }
        function z(e, t) {
            return e.adserverTargeting[f.a.TARGETING_KEYS.PRICE_BUCKET] / e.video.durationBucket < t.adserverTargeting[f.a.TARGETING_KEYS.PRICE_BUCKET] / t.video.durationBucket ? 1 : e.adserverTargeting[f.a.TARGETING_KEYS.PRICE_BUCKET] / e.video.durationBucket > t.adserverTargeting[f.a.TARGETING_KEYS.PRICE_BUCKET] / t.video.durationBucket ? -1 : 0
        }
        function G() {
            var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
              , t = e.codes
              , n = e.callback;
            if (n) {
                var i, a, r, o, d, c, u = (i = t = t || [],
                T.a.getAdUnits().filter(function(e) {
                    return h.deepAccess(e, "mediaTypes.video.context") === m.a
                }).filter(function(e) {
                    return !(0 < i.length) || -1 != i.indexOf(e.code)
                })), s = T.a.getBidsReceived(), l = y.b.getConfig("adpod.brandCategoryExclusion"), f = y.b.getConfig("adpod.deferCaching"), g = "boolean" != typeof f || f, p = (a = s,
                r = u.map(function(e) {
                    return e.code
                }),
                a.filter(function(e) {
                    return -1 != r.indexOf(e.adUnitCode) && e.video && e.video.context === m.a
                })), p = l || g ? function(e) {
                    var t = e.map(function(e) {
                        return C({}, e, S({}, j, e.adserverTargeting[j]))
                    });
                    t = h.groupBy(t, j);
                    var i = [];
                    return Object.keys(t).forEach(function(e) {
                        t[e].sort(h.compareOn("responseTimestamp")),
                        i.push(t[e][0])
                    }),
                    i
                }(p) : p;
                y.b.getConfig("adpod.prioritizeDeals") ? (d = (o = A(p.reduce(function(e, t) {
                    var i = h.deepAccess(t, "video.dealTier")
                      , n = y.b.getConfig("adpod.dealTier.".concat(t.bidderCode, ".minDealTier"));
                    return n && i ? n <= i ? e[1].push(t) : e[0].push(t) : i ? e[1].push(t) : e[0].push(t),
                    e
                }, [[], []]), 2))[0],
                (c = o[1]).sort(z),
                d.sort(z),
                p = c.concat(d)) : p.sort(z);
                var v, b = {};
                return !1 === g ? (u.forEach(function(t) {
                    var n = []
                      , a = h.deepAccess(t, "mediaTypes.video.adPodDurationSec");
                    p.filter(function(e) {
                        return e.adUnitCode === t.code
                    }).forEach(function(e, t, i) {
                        e.video.durationBucket <= a && (n.push(S({}, j, e.adserverTargeting[j])),
                        a -= e.video.durationBucket),
                        t === i.length - 1 && 0 < n.length && n.push(S({}, w, e.adserverTargeting[w]))
                    }),
                    b[t.code] = n
                }),
                n(null, b)) : (v = [],
                u.forEach(function(t) {
                    var i = h.deepAccess(t, "mediaTypes.video.adPodDurationSec");
                    p.filter(function(e) {
                        return e.adUnitCode === t.code
                    }).forEach(function(e) {
                        e.video.durationBucket <= i && (v.push(e),
                        i -= e.video.durationBucket)
                    })
                }),
                x(v, function(e, t) {
                    var i;
                    e ? n(e, null) : (i = h.groupBy(t, "adUnitCode"),
                    Object.keys(i).forEach(function(e) {
                        var n = [];
                        i[e].forEach(function(e, t, i) {
                            n.push(S({}, j, e.adserverTargeting[j])),
                            t === i.length - 1 && 0 < n.length && n.push(S({}, w, e.adserverTargeting[w]))
                        }),
                        b[e] = n
                    }),
                    n(null, b))
                })),
                b
            }
            h.logError("No callback function was defined in the getTargeting call.  Aborting getTargeting().")
        }
        y.b.getConfig("adpod", function(e) {
            return P(e.adpod)
        }),
        Object(r.d)(p.f, _),
        Object(r.d)(n.checkAdUnitSetup, R),
        Object(r.d)(a.c, K);
        var Q = {
            TARGETING_KEY_PB_CAT_DUR: j,
            TARGETING_KEY_CACHE_ID: w,
            getTargeting: G
        };
        Object.freeze(Q),
        Object(r.c)("adpod", function(e) {
            h.isPlainObject(arguments.length <= 0 ? void 0 : e) ? function(e, t) {
                for (var i in t)
                    e[i] = t[i]
            }(arguments.length <= 0 ? void 0 : e, Q) : h.logError("Adpod module needs plain object to share methods with submodule")
        })
    }
}, [244]);
owpbjsChunk([279], {
    278: function(e, r, t) {
        e.exports = t(279)
    },
    279: function(e, r, t) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        t.d(r, "spec", function() {
            return x
        });
        var s = t(0)
          , n = t(1)
          , i = t(2);
        function o() {
            return (o = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var n in t)
                        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                }
                return e
            }
            ).apply(this, arguments)
        }
        function a() {
            var e = u(["dcn=", "&pos=", "&cmd=bid", ""]);
            return a = function() {
                return e
            }
            ,
            e
        }
        function c() {
            var e = u(["", "/bidRequest?"]);
            return c = function() {
                return e
            }
            ,
            e
        }
        function d() {
            var e = u(["", "/pubapi/3.0/", "/", "/", "/", "/ADTECH;v=2;cmd=bid;cors=yes;alias=", ";misc=", ";", ""]);
            return d = function() {
                return e
            }
            ,
            e
        }
        function u(e, r) {
            return r = r || e.slice(0),
            Object.freeze(Object.defineProperties(e, {
                raw: {
                    value: Object.freeze(r)
                }
            }))
        }
        var p = {
            AOL: "aol",
            ONEMOBILE: "onemobile",
            ONEDISPLAY: "onedisplay"
        }
          , l = {
            GET: "display-get"
        }
          , m = {
            GET: "mobile-get",
            POST: "mobile-post"
        }
          , f = {
            TAG: "iframe",
            TYPE: "iframe"
        }
          , b = {
            TAG: "img",
            TYPE: "image"
        }
          , h = P(d(), "host", "network", "placement", "pageid", "sizeid", "alias", "misc", "dynamicParams")
          , v = P(c(), "host")
          , g = P(a(), "dcn", "pos", "dynamicParams")
          , O = {
            us: "adserver-us.adtech.advertising.com",
            eu: "adserver-eu.adtech.advertising.com",
            as: "adserver-as.adtech.advertising.com"
        }
          , y = "https"
          , E = 1;
        function P(o) {
            for (var e = arguments.length, t = new Array(1 < e ? e - 1 : 0), r = 1; r < e; r++)
                t[r - 1] = arguments[r];
            return function() {
                for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
                    n[r] = arguments[r];
                var i = n[n.length - 1] || {}
                  , a = [o[0]];
                return t.forEach(function(e, r) {
                    var t = s.isInteger(e) ? n[e] : i[e];
                    a.push(t, o[r + 1])
                }),
                a.join("")
            }
        }
        function I(e) {
            return e === p.AOL || e === p.ONEMOBILE
        }
        function T(e) {
            if (I(e.bidder) && e.params.id && e.params.imp && e.params.imp[0]) {
                var r = e.params.imp[0];
                return r.id && r.tagid && (r.banner && r.banner.w && r.banner.h || r.video && r.video.mimes && r.video.minduration && r.video.maxduration)
            }
        }
        function S(e) {
            return I(e.bidder) && e.params.dcn && e.params.pos
        }
        function C(e) {
            return ((r = e.bidder) === p.AOL || r === p.ONEDISPLAY) && e.params.placement && e.params.network;
            var r
        }
        var x = {
            code: p.AOL,
            gvlid: 25,
            aliases: [p.ONEMOBILE, p.ONEDISPLAY],
            supportedMediaTypes: [i.b],
            isBidRequestValid: function(e) {
                return C(e) || (S(r = e) || T(r));
                var r
            },
            buildRequests: function(e, r) {
                var n = this
                  , i = {};
                return r && (i.gdpr = r.gdprConsent,
                i.uspConsent = r.uspConsent),
                e.map(function(e) {
                    var r, t = S(r = e) ? m.GET : T(r) ? m.POST : C(r) ? l.GET : void 0;
                    if (t)
                        return n.formatBidRequest(t, e, i)
                })
            },
            interpretResponse: function(e, r) {
                var t = e.body;
                if (t) {
                    var n = this._parseBidResponse(t, r);
                    if (n)
                        return n
                } else
                    s.logError("Empty bid response", r.bidderCode, t)
            },
            getUserSyncs: function(e, r) {
                var t = !s.isEmpty(r) && r[0].body;
                return t && t.ext && t.ext.pixels ? this.parsePixelItems(t.ext.pixels) : []
            },
            formatBidRequest: function(e, r, t) {
                var n;
                switch (e) {
                case l.GET:
                    n = {
                        url: this.buildMarketplaceUrl(r, t),
                        method: "GET",
                        ttl: 60
                    };
                    break;
                case m.GET:
                    n = {
                        url: this.buildOneMobileGetUrl(r, t),
                        method: "GET",
                        ttl: 3600
                    };
                    break;
                case m.POST:
                    n = {
                        url: this.buildOneMobileBaseUrl(r),
                        method: "POST",
                        ttl: 3600,
                        data: this.buildOpenRtbRequestData(r, t),
                        options: {
                            contentType: "application/json",
                            customHeaders: {
                                "x-openrtb-version": "2.2"
                            }
                        }
                    }
                }
                return n.bidderCode = r.bidder,
                n.bidId = r.bidId,
                n.userSyncOn = r.params.userSyncOn,
                n
            },
            buildMarketplaceUrl: function(e, r) {
                var t, n = e.params, i = n.server, a = n.region || "us";
                return O.hasOwnProperty(a) || (s.logWarn("Unknown region '".concat(a, "' for AOL bidder.")),
                a = "us"),
                t = i || O[a],
                n.region = a,
                this.applyProtocol(h({
                    host: t,
                    network: n.network,
                    placement: parseInt(n.placement),
                    pageid: n.pageId || 0,
                    sizeid: n.sizeId || 0,
                    alias: n.alias || s.getUniqueIdentifierStr(),
                    misc: (new Date).getTime(),
                    dynamicParams: this.formatMarketplaceDynamicParams(n, r)
                }))
            },
            buildOneMobileGetUrl: function(e, r) {
                var t, n = e.params, i = n.dcn, a = n.pos, o = n.ext, s = this.buildOneMobileBaseUrl(e);
                return i && a && (t = this.formatOneMobileDynamicParams(o, r),
                s += g({
                    dcn: i,
                    pos: a,
                    dynamicParams: t
                })),
                s
            },
            buildOneMobileBaseUrl: function(e) {
                return this.applyProtocol(v({
                    host: e.params.host || "c2shb.ssp.yahoo.com"
                }))
            },
            applyProtocol: function(e) {
                return /^https?:\/\//i.test(e) ? e : 0 === e.indexOf("//") ? "".concat(y, ":").concat(e) : "".concat(y, "://").concat(e)
            },
            formatMarketplaceDynamicParams: function(e, r) {
                var t = 0 < arguments.length && void 0 !== e ? e : {}
                  , n = 1 < arguments.length && void 0 !== r ? r : {}
                  , i = {};
                t.bidFloor && (i.bidfloor = t.bidFloor),
                o(i, this.formatKeyValues(t.keyValues)),
                o(i, this.formatConsentData(n));
                var a = "";
                return s._each(i, function(e, r) {
                    a += "".concat(r, "=").concat(encodeURIComponent(e), ";")
                }),
                a
            },
            formatOneMobileDynamicParams: function(e, r) {
                var t = 0 < arguments.length && void 0 !== e ? e : {}
                  , n = 1 < arguments.length && void 0 !== r ? r : {};
                this.isSecureProtocol() && (t.secure = E),
                o(t, this.formatConsentData(n));
                var i = "";
                return s._each(t, function(e, r) {
                    i += "&".concat(r, "=").concat(encodeURIComponent(e))
                }),
                i
            },
            buildOpenRtbRequestData: function(e, r) {
                var t = 1 < arguments.length && void 0 !== r ? r : {}
                  , n = {
                    id: e.params.id,
                    imp: e.params.imp
                };
                return this.isEUConsentRequired(t) && (s.deepSetValue(n, "regs.ext.gdpr", E),
                t.gdpr.consentString && s.deepSetValue(n, "user.ext.consent", t.gdpr.consentString)),
                t.uspConsent && s.deepSetValue(n, "regs.ext.us_privacy", t.uspConsent),
                n
            },
            isEUConsentRequired: function(e) {
                return !!(e && e.gdpr && e.gdpr.gdprApplies)
            },
            formatKeyValues: function(e) {
                var t = {};
                return s._each(e, function(e, r) {
                    t["kv".concat(r)] = e
                }),
                t
            },
            formatConsentData: function(e) {
                var r = {};
                return this.isEUConsentRequired(e) && (r.gdpr = E,
                e.gdpr.consentString && (r.euconsent = e.gdpr.consentString)),
                e.uspConsent && (r.us_privacy = e.uspConsent),
                r
            },
            parsePixelItems: function(e) {
                var r, n = /\w*(?=\s)/, i = /src=("|')(.*?)\1/, a = [];
                return !e || (r = e.match(/(img|iframe)[\s\S]*?src\s*=\s*("|')(.*?)\2/gi)) && r.forEach(function(e) {
                    var r = e.match(n)[0]
                      , t = e.match(i)[2];
                    r && r && a.push({
                        type: r === b.TAG ? b.TYPE : f.TYPE,
                        url: t
                    })
                }),
                a
            },
            _parseBidResponse: function(e, r) {
                var t, n;
                try {
                    t = e.seatbid[0].bid[0]
                } catch (e) {
                    return
                }
                if (t.ext && t.ext.encp)
                    n = t.ext.encp;
                else if (null === (n = t.price) || isNaN(n))
                    return void s.logError("Invalid price in bid response", p.AOL, t);
                return {
                    bidderCode: r.bidderCode,
                    requestId: r.bidId,
                    ad: t.adm,
                    cpm: n,
                    width: t.w,
                    height: t.h,
                    creativeId: t.crid || 0,
                    pubapiId: e.id,
                    currency: e.cur || "USD",
                    dealId: t.dealid,
                    netRevenue: !0,
                    ttl: r.ttl
                }
            },
            isOneMobileBidder: I,
            isSecureProtocol: function() {
                return "https:" === document.location.protocol
            }
        };
        Object(n.registerBidder)(x)
    }
}, [278]);
owpbjsChunk([277], {
    286: function(e, r, t) {
        e.exports = t(287)
    },
    287: function(e, r, t) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        t.d(r, "spec", function() {
            return R
        });
        var f = t(10)
          , k = t(0)
          , I = t(3)
          , y = t(1)
          , g = t(2)
          , p = t(26)
          , a = t(11)
          , x = t.n(a)
          , n = t(12)
          , A = t.n(n)
          , v = t(36)
          , i = t(9);
        function s(e) {
            return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        function b() {
            return (b = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var a in t)
                        Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a])
                }
                return e
            }
            ).apply(this, arguments)
        }
        function C(e) {
            return function(e) {
                if (Array.isArray(e))
                    return o(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                    return Array.from(e)
            }(e) || function(e, r) {
                if (!e)
                    return;
                if ("string" == typeof e)
                    return o(e, r);
                var t = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === t && e.constructor && (t = e.constructor.name);
                if ("Map" === t || "Set" === t)
                    return Array.from(e);
                if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                    return o(e, r)
            }(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function o(e, r) {
            (null == r || r > e.length) && (r = e.length);
            for (var t = 0, a = new Array(r); t < r; t++)
                a[t] = e[t];
            return a
        }
        var d = "appnexus"
          , w = "https://ib.adnxs.com/ut/v3/prebid"
          , c = ["id", "minduration", "maxduration", "skippable", "playback_method", "frameworks", "context", "skipoffset"]
          , S = ["age", "externalUid", "segments", "gender", "dnt", "language"]
          , T = ["geo", "device_id"]
          , E = ["enabled", "dongle", "member_id", "debug_timeout"]
          , u = {
            playback_method: {
                unknown: 0,
                auto_play_sound_on: 1,
                auto_play_sound_off: 2,
                click_to_play: 3,
                mouse_over: 4,
                auto_play_sound_unknown: 5
            },
            context: {
                unknown: 0,
                pre_roll: 1,
                mid_roll: 2,
                post_roll: 3,
                outstream: 4,
                "in-banner": 5
            }
        }
          , l = {
            body: "description",
            body2: "desc2",
            cta: "ctatext",
            image: {
                serverName: "main_image",
                requiredParams: {
                    required: !0
                }
            },
            icon: {
                serverName: "icon",
                requiredParams: {
                    required: !0
                }
            },
            sponsoredBy: "sponsored_by",
            privacyLink: "privacy_link",
            salePrice: "saleprice",
            displayUrl: "displayurl"
        }
          , m = "<script"
          , h = /\/\/cdn\.adnxs\.com\/v/
          , _ = "trk.js"
          , O = Object(i.b)(32, d)
          , R = {
            code: d,
            gvlid: 32,
            aliases: ["appnexusAst", "brealtime", "emxdigital", "pagescience", "defymedia", "gourmetads", "matomy", "featureforward", "oftmedia", "districtm", "adasta", "beintoo"],
            supportedMediaTypes: [g.b, g.d, g.c],
            isBidRequestValid: function(e) {
                return !!(e.params.placementId || e.params.member && e.params.invCode)
            },
            buildRequests: function(e, r) {
                var a = e.map(N)
                  , t = x()(e, M)
                  , n = {};
                !0 === I.b.getConfig("coppa") && (n = {
                    coppa: !0
                }),
                t && Object.keys(t.params.user).filter(function(e) {
                    return A()(S, e)
                }).forEach(function(e) {
                    var r = k.convertCamelToUnderscore(e);
                    n[r] = t.params.user[e]
                });
                var i, s = x()(e, D);
                s && s.params && s.params.app && (i = {},
                Object.keys(s.params.app).filter(function(e) {
                    return A()(T, e)
                }).forEach(function(e) {
                    return i[e] = s.params.app[e]
                }));
                var o, d = x()(e, B);
                d && d.params && s.params.app && s.params.app.id && (o = {
                    appid: d.params.app.id
                });
                var p = {}
                  , c = {}
                  , u = O.getCookie("apn_prebid_debug") || null;
                if (u)
                    try {
                        p = JSON.parse(u)
                    } catch (e) {
                        k.logError("AppNexus Debug Auction Cookie Error:\n\n" + e)
                    }
                else {
                    var l = x()(e, V);
                    l && l.debug && (p = l.debug)
                }
                p && p.enabled && Object.keys(p).filter(function(e) {
                    return A()(E, e)
                }).forEach(function(e) {
                    c[e] = p[e]
                });
                var m, f = x()(e, z), y = f ? parseInt(f.params.member, 10) : 0, g = e[0].schain, v = {
                    tags: C(a),
                    user: n,
                    sdk: {
                        source: "pbjs",
                        version: "3.25.0"
                    },
                    schain: g
                };
                0 < y && (v.member_id = y),
                s && (v.device = i),
                d && (v.app = o),
                I.b.getConfig("adpod.brandCategoryExclusion") && (v.brand_category_uniqueness = !0),
                c.enabled && (v.debug = c,
                k.logInfo("AppNexus Debug Auction Settings:\n\n" + JSON.stringify(c, null, 4))),
                r && r.gdprConsent && (v.gdpr_consent = {
                    consent_string: r.gdprConsent.consentString,
                    consent_required: r.gdprConsent.gdprApplies
                }),
                r && r.uspConsent && (v.us_privacy = r.uspConsent),
                r && r.refererInfo && (m = {
                    rd_ref: encodeURIComponent(r.refererInfo.referer),
                    rd_top: r.refererInfo.reachedTop,
                    rd_ifs: r.refererInfo.numIframes,
                    rd_stk: r.refererInfo.stack.map(function(e) {
                        return encodeURIComponent(e)
                    }).join(",")
                },
                v.referrer_detection = m),
                x()(e, J) && e.filter(J).forEach(function(r) {
                    var e = function(e, r) {
                        var t = r.mediaTypes.video
                          , a = t.durationRangeSec
                          , n = t.requireExactDuration
                          , i = function(e) {
                            var r = e.adPodDurationSec
                              , t = e.durationRangeSec
                              , a = e.requireExactDuration
                              , n = k.getMinValueFromArray(t)
                              , i = Math.floor(r / n);
                            return a ? Math.max(i, t.length) : i
                        }(r.mediaTypes.video)
                          , s = k.getMaxValueFromArray(a)
                          , o = e.filter(function(e) {
                            return e.uuid === r.bidId
                        })
                          , d = k.fill.apply(k, C(o).concat([i]));
                        {
                            var p, c;
                            n ? (p = Math.ceil(i / a.length),
                            c = k.chunk(d, p),
                            a.forEach(function(r, e) {
                                c[e].map(function(e) {
                                    W(e, "minduration", r),
                                    W(e, "maxduration", r)
                                })
                            })) : d.map(function(e) {
                                return W(e, "maxduration", s)
                            })
                        }
                        return d
                    }(a, r)
                      , t = v.tags.filter(function(e) {
                        return e.uuid !== r.bidId
                    });
                    v.tags = [].concat(C(t), C(e))
                });
                var b = []
                  , h = k.deepAccess(e[0], "userId.criteoId");
                h && b.push({
                    source: "criteo.com",
                    id: h
                });
                var _ = k.deepAccess(e[0], "userId.tdid");
                return _ && b.push({
                    source: "adserver.org",
                    id: _,
                    rti_partner: "TDID"
                }),
                b.length && (v.eids = b),
                a[0].publisher_id && (v.publisher_id = a[0].publisher_id),
                function(e, t) {
                    var a = []
                      , n = {};
                    !function(e) {
                        var r = !0;
                        e && e.gdprConsent && e.gdprConsent.gdprApplies && 2 === e.gdprConsent.apiVersion && (r = !(!0 !== k.deepAccess(e.gdprConsent, "vendorData.purpose.consents.1")));
                        return r
                    }(t) && (n = {
                        withCredentials: !1
                    });
                    {
                        var i, r;
                        15 < e.tags.length ? (i = k.deepClone(e),
                        k.chunk(e.tags, 15).forEach(function(e) {
                            i.tags = e;
                            var r = JSON.stringify(i);
                            a.push({
                                method: "POST",
                                url: w,
                                data: r,
                                bidderRequest: t,
                                options: n
                            })
                        })) : (r = JSON.stringify(e),
                        a = {
                            method: "POST",
                            url: w,
                            data: r,
                            bidderRequest: t,
                            options: n
                        })
                    }
                    return a
                }(v, r)
            },
            interpretResponse: function(e, r) {
                var i = this
                  , s = r.bidderRequest;
                e = e.body;
                var t, o = [];
                if (e && !e.error)
                    return e.tags && e.tags.forEach(function(e) {
                        var r, t, a, n = (r = e) && r.ads && r.ads.length && x()(r.ads, function(e) {
                            return e.rtb
                        });
                        n && 0 !== n.cpm && A()(i.supportedMediaTypes, n.ad_type) && ((t = function(r, e, t) {
                            var a = k.getBidRequest(r.uuid, [t])
                              , n = {
                                requestId: r.uuid,
                                cpm: e.cpm,
                                creativeId: e.creative_id,
                                dealId: e.deal_id,
                                currency: "USD",
                                netRevenue: !0,
                                ttl: 300,
                                adUnitCode: a.adUnitCode,
                                appnexus: {
                                    buyerMemberId: e.buyer_member_id,
                                    dealPriority: e.deal_priority,
                                    dealCode: e.deal_code
                                }
                            };
                            e.advertiser_id && (n.meta = b({}, n.meta, {
                                advertiserId: e.advertiser_id
                            }));
                            if (e.rtb.video) {
                                var i, s;
                                switch (b(n, {
                                    width: e.rtb.video.player_width,
                                    height: e.rtb.video.player_height,
                                    vastImpUrl: e.notify_url,
                                    ttl: 3600
                                }),
                                k.deepAccess(a, "mediaTypes.video.context")) {
                                case g.a:
                                    var o = Object(y.getIabSubCategory)(a.bidder, e.brand_category_id);
                                    n.meta = b({}, n.meta, {
                                        primaryCatId: o
                                    });
                                    var d = e.deal_priority;
                                    n.video = {
                                        context: g.a,
                                        durationSeconds: Math.floor(e.rtb.video.duration_ms / 1e3),
                                        dealTier: d
                                    },
                                    n.vastUrl = e.rtb.video.asset_url;
                                    break;
                                case v.b:
                                    n.adResponse = r,
                                    n.adResponse.ad = n.adResponse.ads[0],
                                    n.adResponse.ad.video = n.adResponse.ad.rtb.video,
                                    n.vastXml = e.rtb.video.content,
                                    e.renderer_url && (i = x()(t.bids, function(e) {
                                        return e.bidId === r.uuid
                                    }),
                                    s = k.deepAccess(i, "renderer.options"),
                                    n.renderer = function(e, r) {
                                        var t = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}
                                          , a = f.a.install({
                                            id: r.renderer_id,
                                            url: r.renderer_url,
                                            config: t,
                                            loaded: !1,
                                            adUnitCode: e
                                        });
                                        try {
                                            a.setRender(F)
                                        } catch (e) {
                                            k.logWarn("Prebid Error calling setRender on renderer", e)
                                        }
                                        return a.setEventHandlers({
                                            impression: function() {
                                                return k.logMessage("AppNexus outstream video impression event")
                                            },
                                            loaded: function() {
                                                return k.logMessage("AppNexus outstream video loaded event")
                                            },
                                            ended: function() {
                                                k.logMessage("AppNexus outstream renderer video event"),
                                                document.querySelector("#".concat(e)).style.display = "none"
                                            }
                                        }),
                                        a
                                    }(n.adUnitCode, e, s));
                                    break;
                                case v.a:
                                    n.vastUrl = e.notify_url + "&redir=" + encodeURIComponent(e.rtb.video.asset_url)
                                }
                            } else if (e.rtb[g.c]) {
                                var p = e.rtb[g.c]
                                  , c = e.viewability.config.replace("src=", "data-src=")
                                  , u = p.javascript_trackers;
                                null == u ? u = c : k.isStr(u) ? u = [u, c] : u.push(c),
                                n[g.c] = {
                                    title: p.title,
                                    body: p.desc,
                                    body2: p.desc2,
                                    cta: p.ctatext,
                                    rating: p.rating,
                                    sponsoredBy: p.sponsored,
                                    privacyLink: p.privacy_link,
                                    address: p.address,
                                    downloads: p.downloads,
                                    likes: p.likes,
                                    phone: p.phone,
                                    price: p.price,
                                    salePrice: p.saleprice,
                                    clickUrl: p.link.url,
                                    displayUrl: p.displayurl,
                                    clickTrackers: p.link.click_trackers,
                                    impressionTrackers: p.impression_trackers,
                                    javascriptTrackers: u
                                },
                                p.main_img && (n.native.image = {
                                    url: p.main_img.url,
                                    height: p.main_img.height,
                                    width: p.main_img.width
                                }),
                                p.icon && (n.native.icon = {
                                    url: p.icon.url,
                                    height: p.icon.height,
                                    width: p.icon.width
                                })
                            } else {
                                b(n, {
                                    width: e.rtb.banner.width,
                                    height: e.rtb.banner.height,
                                    ad: e.rtb.banner.content
                                });
                                try {
                                    var l = e.rtb.trackers[0].impression_urls[0]
                                      , m = k.createTrackPixelHtml(l);
                                    n.ad += m
                                } catch (e) {
                                    k.logError("Error appending tracking pixel", e)
                                }
                            }
                            return n
                        }(e, n, s)).mediaType = (a = n.ad_type) === g.d ? g.d : a === g.c ? g.c : g.b,
                        o.push(t))
                    }),
                    e.debug && e.debug.debug_info && (t = (t = "AppNexus Debug Auction for Prebid\n\n" + e.debug.debug_info).replace(/(<td>|<th>)/gm, "\t").replace(/(<\/td>|<\/th>)/gm, "\n").replace(/^<br>/gm, "").replace(/(<br>\n|<br>)/gm, "\n").replace(/<h1>(.*)<\/h1>/gm, "\n\n===== $1 =====\n\n").replace(/<h[2-6]>(.*)<\/h[2-6]>/gm, "\n\n*** $1 ***\n\n").replace(/(<([^>]+)>)/gim, ""),
                    k.logMessage("https://console.appnexus.com/docs/understanding-the-debug-auction"),
                    k.logMessage(t)),
                    o;
                var a = "in response for ".concat(s.bidderCode, " adapter");
                return e && e.error && (a += ": ".concat(e.error)),
                k.logError(a),
                o
            },
            getMappingFileInfo: function() {
                return {
                    url: "https://acdn.adnxs.com/prebid/appnexus-mapping/mappings.json",
                    refreshInDays: 2
                }
            },
            getUserSyncs: function(e) {
                if (e.iframeEnabled)
                    return [{
                        type: "iframe",
                        url: "https://acdn.adnxs.com/dmp/async_usersync.html"
                    }]
            },
            transformBidParams: function(t, e) {
                return t = k.convertTypes({
                    member: "string",
                    invCode: "string",
                    placementId: "number",
                    keywords: k.transformBidderParamKeywords,
                    publisherId: "number"
                }, t),
                e && (t.use_pmt_rule = "boolean" == typeof t.usePaymentRule && t.usePaymentRule,
                t.usePaymentRule && delete t.usePaymentRule,
                j(t.keywords) && t.keywords.forEach(P),
                Object.keys(t).forEach(function(e) {
                    var r = k.convertCamelToUnderscore(e);
                    r !== e && (t[r] = t[e],
                    delete t[e])
                })),
                t
            },
            onBidWon: function(e) {
                e.native && function(e) {
                    var r = function(e) {
                        var r;
                        if (k.isStr(e) && U(e))
                            r = e;
                        else if (k.isArray(e))
                            for (var t = 0; t < e.length; t++) {
                                var a = e[t];
                                U(a) && (r = a)
                            }
                        return r
                    }(e.native.javascriptTrackers);
                    if (r)
                        for (var t = "pbjs_adid=" + e.adId + ";pbjs_auc=" + e.adUnitCode, a = function(e) {
                            var r = e.indexOf('src="') + 5
                              , t = e.indexOf('"', r);
                            return e.substring(r, t)
                        }(r), n = a.replace("dom_id=%native_dom_id%", t), i = document.getElementsByTagName("iframe"), s = !1, o = 0; o < i.length && !s; o++) {
                            var d = i[o];
                            try {
                                var p = d.contentDocument || d.contentWindow.document;
                                if (p)
                                    for (var c = p.getElementsByTagName("script"), u = 0; u < c.length && !s; u++) {
                                        var l = c[u];
                                        l.getAttribute("data-src") == a && (l.setAttribute("src", n),
                                        l.setAttribute("data-src", ""),
                                        l.removeAttribute && l.removeAttribute("data-src"),
                                        s = !0)
                                    }
                            } catch (e) {
                                if (!(e instanceof DOMException && "SecurityError" === e.name))
                                    throw e
                            }
                        }
                }(e)
            }
        };
        function j(e) {
            return k.isArray(e) && 0 < e.length
        }
        function P(e) {
            j(e.value) && "" === e.value[0] && delete e.value
        }
        function U(e) {
            var r = e.match(h)
              , t = null != r && 1 <= r.length
              , a = e.match(_)
              , n = null != a && 1 <= a.length;
            return e.startsWith(m) && n && t
        }
        function N(t) {
            var e, r, n, i, a = {};
            a.sizes = q(t.sizes),
            a.primary_size = a.sizes[0],
            a.ad_types = [],
            a.uuid = t.bidId,
            t.params.placementId ? a.id = parseInt(t.params.placementId, 10) : a.code = t.params.invCode,
            a.allow_smaller_sizes = t.params.allowSmallerSizes || !1,
            a.use_pmt_rule = t.params.usePaymentRule || !1,
            a.prebid = !0,
            a.disable_psa = !0,
            t.params.reserve && (a.reserve = t.params.reserve),
            t.params.position && (a.position = {
                above: 1,
                below: 2
            }[t.params.position] || 0),
            t.params.trafficSourceCode && (a.traffic_source_code = t.params.trafficSourceCode),
            t.params.privateSizes && (a.private_sizes = q(t.params.privateSizes)),
            t.params.supplyType && (a.supply_type = t.params.supplyType),
            t.params.pubClick && (a.pubclick = t.params.pubClick),
            t.params.extInvCode && (a.ext_inv_code = t.params.extInvCode),
            t.params.publisherId && (a.publisher_id = parseInt(t.params.publisherId, 10)),
            t.params.externalImpId && (a.external_imp_id = t.params.externalImpId),
            k.isEmpty(t.params.keywords) || (0 < (e = k.transformBidderParamKeywords(t.params.keywords)).length && e.forEach(P),
            a.keywords = e),
            t.mediaType !== g.c && !k.deepAccess(t, "mediaTypes.".concat(g.c)) || (a.ad_types.push(g.c),
            0 === a.sizes.length && (a.sizes = q([1, 1])),
            t.nativeParams && (n = t.nativeParams,
            i = {},
            Object.keys(n).forEach(function(e) {
                var r, t = l[e] && l[e].serverName || l[e] || e, a = l[e] && l[e].requiredParams;
                i[t] = b({}, a, n[e]),
                t !== l.image.serverName && t !== l.icon.serverName || !i[t].sizes || (r = i[t].sizes,
                (k.isArrayOfNums(r) || k.isArray(r) && 0 < r.length && r.every(function(e) {
                    return k.isArrayOfNums(e)
                })) && (i[t].sizes = q(i[t].sizes))),
                t === l.privacyLink && (i.privacy_supported = !0)
            }),
            r = i,
            a[g.c] = {
                layouts: [r]
            }));
            var s = k.deepAccess(t, "mediaTypes.".concat(g.d))
              , o = k.deepAccess(t, "mediaTypes.video.context");
            a.hb_source = s && "adpod" === o ? 7 : 1,
            t.mediaType !== g.d && !s || a.ad_types.push(g.d),
            (t.mediaType === g.d || s && "outstream" !== o) && (a.require_asset_url = !0),
            t.params.video && (a.video = {},
            Object.keys(t.params.video).filter(function(e) {
                return A()(c, e)
            }).forEach(function(e) {
                switch (e) {
                case "context":
                case "playback_method":
                    var r = t.params.video[e]
                      , r = k.isArray(r) ? r[0] : r;
                    a.video[e] = u[e][r];
                    break;
                default:
                    a.video[e] = t.params.video[e]
                }
            })),
            t.renderer && (a.video = b({}, a.video, {
                custom_renderer_present: !0
            }));
            var d = x()(p.a.getAdUnits(), function(e) {
                return t.transactionId === e.transactionId
            });
            return d && d.mediaTypes && d.mediaTypes.banner && a.ad_types.push(g.b),
            0 === a.ad_types.length && delete a.ad_types,
            a
        }
        function q(e) {
            var r = []
              , t = {};
            if (k.isArray(e) && 2 === e.length && !k.isArray(e[0]))
                t.width = parseInt(e[0], 10),
                t.height = parseInt(e[1], 10),
                r.push(t);
            else if ("object" === s(e))
                for (var a = 0; a < e.length; a++) {
                    var n = e[a];
                    (t = {}).width = parseInt(n[0], 10),
                    t.height = parseInt(n[1], 10),
                    r.push(t)
                }
            return r
        }
        function M(e) {
            return !!e.params.user
        }
        function z(e) {
            return !!parseInt(e.params.member, 10)
        }
        function D(e) {
            if (e.params)
                return !!e.params.app
        }
        function B(e) {
            return e.params && e.params.app ? !!e.params.app.id : !!e.params.app
        }
        function V(e) {
            return !!e.debug
        }
        function J(e) {
            return e.mediaTypes && e.mediaTypes.video && e.mediaTypes.video.context === g.a
        }
        function W(e, r, t) {
            k.isEmpty(e.video) && (e.video = {}),
            e.video[r] = t
        }
        function F(e) {
            var r, t;
            r = e.adUnitCode,
            (t = document.getElementById(r).querySelectorAll("div[id^='google_ads']"))[0] && t[0].style.setProperty("display", "none"),
            e.renderer.push(function() {
                window.ANOutstreamVideo.renderAd({
                    tagId: e.adResponse.tag_id,
                    sizes: [e.getSize().split("x")],
                    targetId: e.adUnitCode,
                    uuid: e.adResponse.uuid,
                    adResponse: e.adResponse,
                    rendererOptions: e.renderer.getConfig()
                }, function(e, r, t) {
                    e.renderer.handleVideoEvent({
                        id: r,
                        eventName: t
                    })
                }
                .bind(null, e))
            })
        }
        Object(y.registerBidder)(R)
    }
}, [286]);
owpbjsChunk([243], {
    364: function(n, t, e) {
        n.exports = e(365)
    },
    365: function(n, t, e) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        e.d(t, "consentAPI", function() {
            return c
        }),
        e.d(t, "consentTimeout", function() {
            return r
        }),
        e.d(t, "staticConsentData", function() {
            return u
        }),
        t.requestBidsHook = m,
        t.resetConsentData = function() {
            l = void 0,
            c = void 0,
            o.uspDataHandler.setConsentData(null)
        }
        ,
        t.setConsentConfig = P;
        var s = e(0)
          , a = e(3)
          , o = e(7);
        function i(n) {
            return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
                return typeof n
            }
            : function(n) {
                return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n
            }
            )(n)
        }
        var c, r, u, l, d = "iab", p = 50, f = !1, g = {
            iab: function(a, o, i) {
                var t, e = function() {
                    var e = {};
                    return {
                        consentDataCallback: function(n, t) {
                            t && n.uspString && (e.usPrivacy = n.uspString),
                            e.usPrivacy ? a(e, i) : o("Unable to get USP consent string.", i)
                        }
                    }
                }(), s = {};
                try {
                    window.__uspapi("getUSPData", 1, e.consentDataCallback)
                } catch (n) {
                    for (var c = window; !t; ) {
                        try {
                            c.frames.__uspapiLocator && (t = c)
                        } catch (n) {}
                        if (c === window.top)
                            break;
                        c = c.parent
                    }
                    if (!t)
                        return o("USP CMP not found.", i);
                    !function(n, i, e) {
                        function a(n) {
                            var t = n && n.data && n.data.__uspapiReturn;
                            t && t.callId && void 0 !== s[t.callId] && (s[t.callId](t.returnValue, t.success),
                            delete s[t.callId])
                        }
                        window.__uspapi = function(n, t, e) {
                            var a = Math.random() + ""
                              , o = {
                                __uspapiCall: {
                                    command: n,
                                    version: t,
                                    callId: a
                                }
                            };
                            s[a] = e,
                            i.postMessage(o, "*")
                        }
                        ,
                        window.addEventListener("message", a, !1),
                        window.__uspapi(n, 1, function(n, t) {
                            window.removeEventListener("message", a, !1),
                            e(n, t)
                        })
                    }("getUSPData", t, e.consentDataCallback)
                }
            },
            static: function(n, t, e) {
                n(u, e)
            }
        };
        function m(n, t) {
            var e = {
                context: this,
                args: [t],
                nextFn: n,
                adUnits: t.adUnits || owpbjs.adUnits,
                bidsBackHandler: t.bidsBackHandler,
                haveExited: !1,
                timer: null
            };
            return l ? y(null, e) : g[c] ? (g[c].call(this, v, b, e),
            void (e.haveExited || (0 === r ? v(void 0, e) : e.timer = setTimeout(function(n) {
                b("USPAPI workflow exceeded timeout threshold.", n)
            }
            .bind(null, e), r)))) : (s.logWarn("USP framework (".concat(c, ") is not a supported framework. Aborting consentManagement module and resuming auction.")),
            e.nextFn.apply(e.context, e.args))
        }
        function v(n, t) {
            var e;
            !n || !n.usPrivacy ? b("USPAPI returned unexpected value during lookup process.", t, n) : (clearTimeout(t.timer),
            (e = n) && e.usPrivacy && (l = e.usPrivacy,
            o.uspDataHandler.setConsentData(l)),
            y(null, t))
        }
        function b(n, t, e) {
            clearTimeout(t.timer),
            y(n, t, e)
        }
        function y(n, t, e) {
            var a, o, i;
            !1 === t.haveExited && (t.haveExited = !0,
            a = t.context,
            o = t.args,
            i = t.nextFn,
            n && s.logWarn(n + " Resuming auction without consent data as per consentManagement config.", e),
            i.apply(a, o))
        }
        function P(n) {
            (n = n.usp) && "object" === i(n) ? (s.isStr(n.cmpApi) ? c = n.cmpApi : (c = d,
            s.logInfo("consentManagement.usp config did not specify cmpApi. Using system default setting (".concat(d, ")."))),
            s.isNumber(n.timeout) ? r = n.timeout : (r = p,
            s.logInfo("consentManagement.usp config did not specify timeout. Using system default setting (".concat(p, ")."))),
            s.logInfo("USPAPI consentManagement module has been activated..."),
            "static" === c && (s.isPlainObject(n.consentData) && s.isPlainObject(n.consentData.getUSPData) ? (n.consentData.getUSPData.uspString && (u = {
                usPrivacy: n.consentData.getUSPData.uspString
            }),
            r = 0) : s.logError("consentManagement config with cmpApi: 'static' did not specify consentData. No consents will be available to adapters.")),
            f || owpbjs.requestBids.before(m, 50),
            f = !0) : s.logWarn("consentManagement.usp config not defined, exiting usp consent manager")
        }
        a.b.getConfig("consentManagement", function(n) {
            return P(n.consentManagement)
        })
    }
}, [364]);
owpbjsChunk([0], {
    378: function(t, e, r) {
        t.exports = r(379)
    },
    379: function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        Object.defineProperty(__webpack_exports__, "__esModule", {
            value: !0
        }),
        __webpack_require__.d(__webpack_exports__, "ADAPTER_VERSION", function() {
            return ADAPTER_VERSION
        }),
        __webpack_require__.d(__webpack_exports__, "PROFILE_ID_PUBLISHERTAG", function() {
            return PROFILE_ID_PUBLISHERTAG
        }),
        __webpack_require__.d(__webpack_exports__, "spec", function() {
            return spec
        }),
        __webpack_exports__.tryGetCriteoFastBid = tryGetCriteoFastBid;
        var __WEBPACK_IMPORTED_MODULE_0__src_adloader_js__ = __webpack_require__(40)
          , __WEBPACK_IMPORTED_MODULE_1__src_adapters_bidderFactory_js__ = __webpack_require__(1)
          , __WEBPACK_IMPORTED_MODULE_2__src_config_js__ = __webpack_require__(3)
          , __WEBPACK_IMPORTED_MODULE_3__src_mediaTypes_js__ = __webpack_require__(2)
          , __WEBPACK_IMPORTED_MODULE_4__src_utils_js__ = __webpack_require__(0)
          , __WEBPACK_IMPORTED_MODULE_5_core_js_pure_features_array_find_js__ = __webpack_require__(11)
          , __WEBPACK_IMPORTED_MODULE_5_core_js_pure_features_array_find_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_pure_features_array_find_js__)
          , __WEBPACK_IMPORTED_MODULE_6_criteo_direct_rsa_validate_build_verify_js__ = __webpack_require__(380)
          , __WEBPACK_IMPORTED_MODULE_6_criteo_direct_rsa_validate_build_verify_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_criteo_direct_rsa_validate_build_verify_js__)
          , __WEBPACK_IMPORTED_MODULE_7__src_storageManager_js__ = __webpack_require__(9);
        function _extends() {
            return (_extends = Object.assign || function(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var r = arguments[e];
                    for (var i in r)
                        Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i])
                }
                return t
            }
            ).apply(this, arguments)
        }
        var GVLID = 91
          , ADAPTER_VERSION = 32
          , BIDDER_CODE = "criteo"
          , CDB_ENDPOINT = "https://bidder.criteo.com/cdb"
          , PROFILE_ID_INLINE = 207
          , PROFILE_ID_PUBLISHERTAG = 185
          , storage = Object(__WEBPACK_IMPORTED_MODULE_7__src_storageManager_js__.b)(GVLID)
          , LOG_PREFIX = "Criteo: "
          , PUBLISHER_TAG_URL = "https://static.criteo.net/js/ld/publishertag.prebid.js"
          , FAST_BID_PUBKEY_E = 65537
          , FAST_BID_PUBKEY_N = "ztQYwCE5BU7T9CDM5he6rKoabstXRmkzx54zFPZkWbK530dwtLBDeaWBMxHBUT55CYyboR/EZ4efghPi3CoNGfGWezpjko9P6p2EwGArtHEeS4slhu/SpSIFMjG6fdrpRoNuIAMhq1Z+Pr/+HOd1pThFKeGFr2/NhtAg+TXAzaU="
          , spec = {
            code: BIDDER_CODE,
            gvlid: GVLID,
            supportedMediaTypes: [__WEBPACK_IMPORTED_MODULE_3__src_mediaTypes_js__.b, __WEBPACK_IMPORTED_MODULE_3__src_mediaTypes_js__.d, __WEBPACK_IMPORTED_MODULE_3__src_mediaTypes_js__.c],
            isBidRequestValid: function(t) {
                return !(!t || !t.params || !t.params.zoneId && !t.params.networkId) && !(hasVideoMediaType(t) && !hasValidVideoMediaType(t))
            },
            buildRequests: function(t, e) {
                var r, i, s, o, _;
                if (_extends(e, {
                    publisherExt: __WEBPACK_IMPORTED_MODULE_2__src_config_js__.b.getConfig("fpd.context"),
                    userExt: __WEBPACK_IMPORTED_MODULE_2__src_config_js__.b.getConfig("fpd.user"),
                    ceh: __WEBPACK_IMPORTED_MODULE_2__src_config_js__.b.getConfig("criteo.ceh")
                }),
                publisherTagAvailable() || (window.Criteo = window.Criteo || {},
                window.Criteo.usePrebidEvents = !1,
                tryGetCriteoFastBid(),
                setTimeout(function() {
                    Object(__WEBPACK_IMPORTED_MODULE_0__src_adloader_js__.a)(PUBLISHER_TAG_URL, BIDDER_CODE)
                }, e.timeout)),
                _ = publisherTagAvailable() ? (r = new Criteo.PubTag.Adapters.Prebid(PROFILE_ID_PUBLISHERTAG,ADAPTER_VERSION,t,e,"3.25.0"),
                i = __WEBPACK_IMPORTED_MODULE_2__src_config_js__.b.getConfig("enableSendAllBids"),
                r.setEnableSendAllBids && "function" == typeof r.setEnableSendAllBids && "boolean" == typeof i && r.setEnableSendAllBids(i),
                o = r.buildCdbUrl(),
                r.buildCdbRequest()) : (o = buildCdbUrl(s = buildContext(t, e)),
                buildCdbRequest(s, t, e)))
                    return {
                        method: "POST",
                        url: o,
                        data: _,
                        bidRequests: t
                    }
            },
            interpretResponse: function(t, s) {
                var e = t.body || t;
                if (publisherTagAvailable()) {
                    var r = Criteo.PubTag.Adapters.Prebid.GetAdapter(s);
                    if (r)
                        return r.interpretResponse(e, s)
                }
                var o = [];
                return e && e.slots && __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.isArray(e.slots) && e.slots.forEach(function(e) {
                    var t = __WEBPACK_IMPORTED_MODULE_5_core_js_pure_features_array_find_js___default()(s.bidRequests, function(t) {
                        return t.adUnitCode === e.impid && (!t.params.zoneId || parseInt(t.params.zoneId) === e.zoneid)
                    })
                      , r = t.bidId
                      , i = {
                        requestId: r,
                        adId: e.bidId || __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.getUniqueIdentifierStr(),
                        cpm: e.cpm,
                        currency: e.currency,
                        netRevenue: !0,
                        ttl: e.ttl || 60,
                        creativeId: r,
                        width: e.width,
                        height: e.height,
                        dealId: e.dealCode
                    };
                    if (e.native)
                        if (t.params.nativeCallback)
                            i.ad = createNativeAd(r, e.native, t.params.nativeCallback);
                        else {
                            if (!0 === __WEBPACK_IMPORTED_MODULE_2__src_config_js__.b.getConfig("enableSendAllBids"))
                                return;
                            i.native = createPrebidNativeAd(e.native),
                            i.mediaType = __WEBPACK_IMPORTED_MODULE_3__src_mediaTypes_js__.c
                        }
                    else
                        e.video ? (i.vastUrl = e.displayurl,
                        i.mediaType = __WEBPACK_IMPORTED_MODULE_3__src_mediaTypes_js__.d) : i.ad = e.creative;
                    o.push(i)
                }),
                o
            },
            onTimeout: function(t) {
                var e;
                publisherTagAvailable() && Array.isArray(t) && (e = [],
                t.forEach(function(t) {
                    -1 === e.indexOf(t.auctionId) && (e.push(t.auctionId),
                    Criteo.PubTag.Adapters.Prebid.GetAdapter(t.auctionId).handleBidTimeout())
                }))
            },
            onBidWon: function(t) {
                publisherTagAvailable() && t && Criteo.PubTag.Adapters.Prebid.GetAdapter(t.auctionId).handleBidWon(t)
            },
            onSetTargeting: function(t) {
                publisherTagAvailable() && Criteo.PubTag.Adapters.Prebid.GetAdapter(t.auctionId).handleSetTargeting(t)
            }
        };
        function publisherTagAvailable() {
            return "undefined" != typeof Criteo && Criteo.PubTag && Criteo.PubTag.Adapters && Criteo.PubTag.Adapters.Prebid
        }
        function buildContext(t, e) {
            var r = "";
            e && e.refererInfo && (r = e.refererInfo.referer);
            var i = __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.parseUrl(r).search
              , s = {
                url: r,
                debug: "1" === i.pbt_debug,
                noLog: "1" === i.pbt_nolog,
                amp: !1
            };
            return t.forEach(function(t) {
                "amp" === t.params.integrationMode && (s.amp = !0)
            }),
            s
        }
        function buildCdbUrl(t) {
            var e = CDB_ENDPOINT;
            return e += "?profileId=" + PROFILE_ID_INLINE,
            e += "&av=" + String(ADAPTER_VERSION),
            e += "&wv=" + encodeURIComponent("3.25.0"),
            e += "&cb=" + String(Math.floor(99999999999 * Math.random())),
            t.amp && (e += "&im=1"),
            t.debug && (e += "&debug=1"),
            t.noLog && (e += "&nolog=1"),
            e
        }
        function checkNativeSendId(t) {
            return !t.nativeParams || !(t.nativeParams.image && !0 !== t.nativeParams.image.sendId || t.nativeParams.icon && !0 !== t.nativeParams.icon.sendId || t.nativeParams.clickUrl && !0 !== t.nativeParams.clickUrl.sendId || t.nativeParams.displayUrl && !0 !== t.nativeParams.displayUrl.sendId || t.nativeParams.privacyLink && !0 !== t.nativeParams.privacyLink.sendId || t.nativeParams.privacyIcon && !0 !== t.nativeParams.privacyIcon.sendId)
        }
        function buildCdbRequest(t, e, r) {
            var i, s = {
                publisher: {
                    url: t.url,
                    ext: r.publisherExt
                },
                slots: e.map(function(t) {
                    i = t.params.networkId || i;
                    var e, r = {
                        impid: t.adUnitCode,
                        transactionid: t.transactionId,
                        auctionId: t.auctionId
                    };
                    return t.params.zoneId && (r.zoneid = t.params.zoneId),
                    t.fpd && t.fpd.context && (r.ext = t.fpd.context),
                    t.params.ext && (r.ext = _extends({}, r.ext, t.params.ext)),
                    t.params.publisherSubId && (r.publishersubid = t.params.publisherSubId),
                    t.params.nativeCallback || __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.deepAccess(t, "mediaTypes.".concat(__WEBPACK_IMPORTED_MODULE_3__src_mediaTypes_js__.c)) ? (r.native = !0,
                    checkNativeSendId(t) || __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.logWarn(LOG_PREFIX + "all native assets containing URL should be sent as placeholders with sendId(icon, image, clickUrl, displayUrl, privacyLink, privacyIcon)"),
                    r.sizes = parseSizes(retrieveBannerSizes(t), parseNativeSize)) : r.sizes = parseSizes(retrieveBannerSizes(t), parseSize),
                    hasVideoMediaType(t) && ((e = {
                        playersizes: parseSizes(__WEBPACK_IMPORTED_MODULE_4__src_utils_js__.deepAccess(t, "mediaTypes.video.playerSize"), parseSize),
                        mimes: t.mediaTypes.video.mimes,
                        protocols: t.mediaTypes.video.protocols,
                        maxduration: t.mediaTypes.video.maxduration,
                        api: t.mediaTypes.video.api
                    }).skip = t.params.video.skip,
                    e.placement = t.params.video.placement,
                    e.minduration = t.params.video.minduration,
                    e.playbackmethod = t.params.video.playbackmethod,
                    e.startdelay = t.params.video.startdelay,
                    r.video = e),
                    r
                })
            };
            return i && (s.publisher.networkid = i),
            s.user = {
                ext: r.userExt
            },
            r && r.ceh && (s.user.ceh = r.ceh),
            r && r.gdprConsent && (s.gdprConsent = {},
            void 0 !== r.gdprConsent.gdprApplies && (s.gdprConsent.gdprApplies = !!r.gdprConsent.gdprApplies),
            s.gdprConsent.version = r.gdprConsent.apiVersion,
            void 0 !== r.gdprConsent.consentString && (s.gdprConsent.consentData = r.gdprConsent.consentString)),
            r && r.uspConsent && (s.user.uspIab = r.uspConsent),
            s
        }
        function retrieveBannerSizes(t) {
            return __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.deepAccess(t, "mediaTypes.banner.sizes") || t.sizes
        }
        function parseSizes(t, e) {
            return Array.isArray(t[0]) ? t.map(function(t) {
                return e(t)
            }) : [e(t)]
        }
        function parseSize(t) {
            return t[0] + "x" + t[1]
        }
        function parseNativeSize(t) {
            return void 0 === t[0] && void 0 === t[1] ? "2x2" : t[0] + "x" + t[1]
        }
        function hasVideoMediaType(t) {
            return void 0 !== __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.deepAccess(t, "params.video") && void 0 !== __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.deepAccess(t, "mediaTypes.video")
        }
        function hasValidVideoMediaType(e) {
            var r = !0;
            ["mimes", "playerSize", "maxduration", "protocols", "api"].forEach(function(t) {
                void 0 === __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.deepAccess(e, "mediaTypes.video." + t) && (r = !1,
                __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.logError("Criteo Bid Adapter: mediaTypes.video." + t + " is required"))
            });
            if (["skip", "placement", "playbackmethod"].forEach(function(t) {
                void 0 === __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.deepAccess(e, "params.video." + t) && (r = !1,
                __WEBPACK_IMPORTED_MODULE_4__src_utils_js__.logError("Criteo Bid Adapter: params.video." + t + " is required"))
            }),
            r) {
                if ("instream" == e.mediaTypes.video.context && 1 === e.params.video.placement)
                    return 1;
                if ("outstream" == e.mediaTypes.video.context && 1 !== e.params.video.placement)
                    return 1
            }
        }
        function createPrebidNativeAd(t) {
            return {
                title: t.products[0].title,
                body: t.products[0].description,
                sponsoredBy: t.advertiser.description,
                icon: t.advertiser.logo,
                image: t.products[0].image,
                clickUrl: t.products[0].click_url,
                privacyLink: t.privacy.optout_click_url,
                privacyIcon: t.privacy.optout_image_url,
                cta: t.products[0].call_to_action,
                price: t.products[0].price,
                impressionTrackers: t.impression_pixels.map(function(t) {
                    return t.url
                })
            }
        }
        function createNativeAd(t, e, r) {
            var i = "criteo_prebid_native_slots";
            return window[i] = window[i] || {},
            window[i][t] = {
                callback: r,
                payload: e
            },
            '\n<script type="text/javascript">\nfor (var i = 0; i < 10; ++i) {\n var slots = window.parent.'.concat(i, ';\n  if(!slots){continue;}\n  var responseSlot = slots["').concat(t, '"];\n  responseSlot.callback(responseSlot.payload);\n  break;\n}\n<\/script>')
        }
        function tryGetCriteoFastBid() {
            try {
                var fastBidStorageKey = "criteo_fast_bid", hashPrefix = "// Hash: ", fastBidFromStorage = storage.getDataFromLocalStorage(fastBidStorageKey), firstLineEndPosition, firstLine, publisherTagHash, publisherTag;
                null !== fastBidFromStorage && (firstLineEndPosition = fastBidFromStorage.indexOf("\n"),
                firstLine = fastBidFromStorage.substr(0, firstLineEndPosition).trim(),
                firstLine.substr(0, hashPrefix.length) !== hashPrefix ? (__WEBPACK_IMPORTED_MODULE_4__src_utils_js__.logWarn("No hash found in FastBid"),
                storage.removeDataFromLocalStorage(fastBidStorageKey)) : (publisherTagHash = firstLine.substr(hashPrefix.length),
                publisherTag = fastBidFromStorage.substr(firstLineEndPosition + 1),
                Object(__WEBPACK_IMPORTED_MODULE_6_criteo_direct_rsa_validate_build_verify_js__.verify)(publisherTag, publisherTagHash, FAST_BID_PUBKEY_N, FAST_BID_PUBKEY_E) ? (__WEBPACK_IMPORTED_MODULE_4__src_utils_js__.logInfo("Using Criteo FastBid"),
                eval(publisherTag)) : (__WEBPACK_IMPORTED_MODULE_4__src_utils_js__.logWarn("Invalid Criteo FastBid found"),
                storage.removeDataFromLocalStorage(fastBidStorageKey))))
            } catch (t) {}
        }
        Object(__WEBPACK_IMPORTED_MODULE_1__src_adapters_bidderFactory_js__.registerBidder)(spec)
    },
    380: function(t, e, r) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var a = r(381)
          , n = r(382);
        e.verify = function(t, e, r, i) {
            var s = new a.BigInteger(a.b64toHex(e))
              , o = new a.BigInteger(a.b64toHex(r))
              , _ = s.modPowInt(i, o);
            return a.removeExtraSymbols(_.toHexString()) === n.Sha256.hash(t)
        }
    },
    381: function(t, e, r) {
        "use strict";
        var i;
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = (T.prototype.toHexString = function() {
            if (this.s < 0)
                return "-" + this.negate().toHexString();
            var t, e = !1, r = "", i = this.t, s = this.DB - i * this.DB % 4;
            if (0 < i--)
                for (s < this.DB && 0 < (t = this[i] >> s) && (e = !0,
                r = c(t)); 0 <= i; )
                    s < 4 ? (t = (this[i] & (1 << s) - 1) << 4 - s,
                    t |= this[--i] >> (s += this.DB - 4)) : (t = this[i] >> (s -= 4) & 15,
                    s <= 0 && (s += this.DB,
                    --i)),
                    0 < t && (e = !0),
                    e && (r += c(t));
            return e ? r : "0"
        }
        ,
        T.prototype.fromHexString = function(t) {
            if (null !== t) {
                this.t = 0,
                this.s = 0;
                for (var e = t.length, r = !1, i = 0; 0 <= --e; ) {
                    var s = n(t, e);
                    s < 0 ? "-" == t.charAt(e) && (r = !0) : (r = !1,
                    0 == i ? this[this.t++] = s : i + 4 > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - i) - 1) << i,
                    this[this.t++] = s >> this.DB - i) : this[this.t - 1] |= s << i,
                    (i += 4) >= this.DB && (i -= this.DB))
                }
                this.clamp(),
                r && T.ZERO.subTo(this, this)
            }
        }
        ,
        T.prototype.negate = function() {
            var t = b();
            return T.ZERO.subTo(this, t),
            t
        }
        ,
        T.prototype.abs = function() {
            return this.s < 0 ? this.negate() : this
        }
        ,
        T.prototype.mod = function(t) {
            var e = b();
            return this.abs().divRemTo(t, null, e),
            this.s < 0 && 0 < e.compareTo(T.ZERO) && t.subTo(e, e),
            e
        }
        ,
        T.prototype.copyTo = function(t) {
            for (var e = this.t - 1; 0 <= e; --e)
                t[e] = this[e];
            t.t = this.t,
            t.s = this.s
        }
        ,
        T.prototype.lShiftTo = function(t, e) {
            for (var r = t % this.DB, i = this.DB - r, s = (1 << i) - 1, o = Math.floor(t / this.DB), _ = this.s << r & this.DM, a = this.t - 1; 0 <= a; --a)
                e[a + o + 1] = this[a] >> i | _,
                _ = (this[a] & s) << r;
            for (a = o - 1; 0 <= a; --a)
                e[a] = 0;
            e[o] = _,
            e.t = this.t + o + 1,
            e.s = this.s,
            e.clamp()
        }
        ,
        T.prototype.invDigit = function() {
            if (this.t < 1)
                return 0;
            var t = this[0];
            if (0 == (1 & t))
                return 0;
            var e = 3 & t;
            return 0 < (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) ? this.DV - e : -e
        }
        ,
        T.prototype.dlShiftTo = function(t, e) {
            for (var r = this.t - 1; 0 <= r; --r)
                e[r + t] = this[r];
            for (r = t - 1; 0 <= r; --r)
                e[r] = 0;
            e.t = this.t + t,
            e.s = this.s
        }
        ,
        T.prototype.squareTo = function(t) {
            for (var e = this.abs(), r = t.t = 2 * e.t; 0 <= --r; )
                t[r] = 0;
            for (r = 0; r < e.t - 1; ++r) {
                var i = e.am(r, e[r], t, 2 * r, 0, 1);
                (t[r + e.t] += e.am(r + 1, 2 * e[r], t, 2 * r + 1, i, e.t - r - 1)) >= e.DV && (t[r + e.t] -= e.DV,
                t[r + e.t + 1] = 1)
            }
            0 < t.t && (t[t.t - 1] += e.am(r, e[r], t, 2 * r, 0, 1)),
            t.s = 0,
            t.clamp()
        }
        ,
        T.prototype.multiplyTo = function(t, e) {
            var r = this.abs()
              , i = t.abs()
              , s = r.t;
            for (e.t = s + i.t; 0 <= --s; )
                e[s] = 0;
            for (s = 0; s < i.t; ++s)
                e[s + r.t] = r.am(0, i[s], e, s, 0, r.t);
            e.s = 0,
            e.clamp(),
            this.s != t.s && T.ZERO.subTo(e, e)
        }
        ,
        T.prototype.divRemTo = function(t, e, r) {
            var i = t.abs();
            if (!(i.t <= 0)) {
                var s = this.abs();
                if (s.t < i.t)
                    return null != e && e.fromHexString("0"),
                    void (null != r && this.copyTo(r));
                null == r && (r = b());
                var o = b()
                  , _ = this.s
                  , a = t.s
                  , n = this.DB - D(i[i.t - 1]);
                0 < n ? (i.lShiftTo(n, o),
                s.lShiftTo(n, r)) : (i.copyTo(o),
                s.copyTo(r));
                var p = o.t
                  , c = o[p - 1];
                if (0 != c) {
                    var d = c * (1 << this.F1) + (1 < p ? o[p - 2] >> this.F2 : 0)
                      , u = this.FV / d
                      , h = (1 << this.F1) / d
                      , l = 1 << this.F2
                      , f = r.t
                      , E = f - p
                      , v = null == e ? b() : e;
                    for (o.dlShiftTo(E, v),
                    0 <= r.compareTo(v) && (r[r.t++] = 1,
                    r.subTo(v, r)),
                    T.ONE.dlShiftTo(p, v),
                    v.subTo(o, o); o.t < p; )
                        o[o.t++] = 0;
                    for (; 0 <= --E; ) {
                        var m = r[--f] == c ? this.DM : Math.floor(r[f] * u + (r[f - 1] + l) * h);
                        if ((r[f] += o.am(0, m, r, E, 0, p)) < m)
                            for (o.dlShiftTo(E, v),
                            r.subTo(v, r); r[f] < --m; )
                                r.subTo(v, r)
                    }
                    null != e && (r.drShiftTo(p, e),
                    _ != a && T.ZERO.subTo(e, e)),
                    r.t = p,
                    r.clamp(),
                    0 < n && r.rShiftTo(n, r),
                    _ < 0 && T.ZERO.subTo(r, r)
                }
            }
        }
        ,
        T.prototype.rShiftTo = function(t, e) {
            e.s = this.s;
            var r = Math.floor(t / this.DB);
            if (r >= this.t)
                e.t = 0;
            else {
                var i = t % this.DB
                  , s = this.DB - i
                  , o = (1 << i) - 1;
                e[0] = this[r] >> i;
                for (var _ = r + 1; _ < this.t; ++_)
                    e[_ - r - 1] |= (this[_] & o) << s,
                    e[_ - r] = this[_] >> i;
                0 < i && (e[this.t - r - 1] |= (this.s & o) << s),
                e.t = this.t - r,
                e.clamp()
            }
        }
        ,
        T.prototype.drShiftTo = function(t, e) {
            for (var r = t; r < this.t; ++r)
                e[r - t] = this[r];
            e.t = Math.max(this.t - t, 0),
            e.s = this.s
        }
        ,
        T.prototype.subTo = function(t, e) {
            for (var r = 0, i = 0, s = Math.min(t.t, this.t); r < s; )
                i += this[r] - t[r],
                e[r++] = i & this.DM,
                i >>= this.DB;
            if (t.t < this.t) {
                for (i -= t.s; r < this.t; )
                    i += this[r],
                    e[r++] = i & this.DM,
                    i >>= this.DB;
                i += this.s
            } else {
                for (i += this.s; r < t.t; )
                    i -= t[r],
                    e[r++] = i & this.DM,
                    i >>= this.DB;
                i -= t.s
            }
            e.s = i < 0 ? -1 : 0,
            i < -1 ? e[r++] = this.DV + i : 0 < i && (e[r++] = i),
            e.t = r,
            e.clamp()
        }
        ,
        T.prototype.clamp = function() {
            for (var t = this.s & this.DM; 0 < this.t && this[this.t - 1] == t; )
                --this.t
        }
        ,
        T.prototype.modPowInt = function(t, e) {
            var r = new (t < 256 || e.isEven() ? d : h)(e);
            return this.exp(t, r)
        }
        ,
        T.prototype.exp = function(t, e) {
            if (4294967295 < t || t < 1)
                return T.ONE;
            var r, i = b(), s = b(), o = e.convert(this), _ = D(t) - 1;
            for (o.copyTo(i); 0 <= --_; )
                e.sqrTo(i, s),
                0 < (t & 1 << _) ? e.mulTo(s, o, i) : (r = i,
                i = s,
                s = r);
            return e.revert(i)
        }
        ,
        T.prototype.isEven = function() {
            return 0 == (0 < this.t ? 1 & this[0] : this.s)
        }
        ,
        T.prototype.compareTo = function(t) {
            var e = this.s - t.s;
            if (0 != e)
                return e;
            var r = this.t;
            if (0 != (e = r - t.t))
                return this.s < 0 ? -e : e;
            for (; 0 <= --r; )
                if (0 != (e = this[r] - t[r]))
                    return e;
            return 0
        }
        ,
        T.prototype.am1 = function(t, e, r, i, s, o) {
            for (; 0 <= --o; ) {
                var _ = e * this[t++] + r[i] + s;
                s = Math.floor(_ / 67108864),
                r[i++] = 67108863 & _
            }
            return s
        }
        ,
        T.prototype.am2 = function(t, e, r, i, s, o) {
            for (var _ = 32767 & e, a = e >> 15; 0 <= --o; ) {
                var n = 32767 & this[t]
                  , p = this[t++] >> 15
                  , c = a * n + p * _;
                s = ((n = _ * n + ((32767 & c) << 15) + r[i] + (1073741823 & s)) >>> 30) + (c >>> 15) + a * p + (s >>> 30),
                r[i++] = 1073741823 & n
            }
            return s
        }
        ,
        T.prototype.am3 = function(t, e, r, i, s, o) {
            for (var _ = 16383 & e, a = e >> 14; 0 <= --o; ) {
                var n = 16383 & this[t]
                  , p = this[t++] >> 14
                  , c = a * n + p * _;
                s = ((n = _ * n + ((16383 & c) << 14) + r[i] + s) >> 28) + (c >> 14) + a * p,
                r[i++] = 268435455 & n
            }
            return s
        }
        ,
        T);
        function T(t) {
            null !== t && this.fromHexString(t)
        }
        function b() {
            return new s(null)
        }
        function D(t) {
            var e, r = 1;
            return 0 != (e = t >>> 16) && (t = e,
            r += 16),
            0 != (e = t >> 8) && (t = e,
            r += 8),
            0 != (e = t >> 4) && (t = e,
            r += 4),
            0 != (e = t >> 2) && (t = e,
            r += 2),
            0 != (e = t >> 1) && (t = e,
            r += 1),
            r
        }
        e.BigInteger = s,
        e.nbi = b,
        e.nbits = D;
        for (var o = [], _ = "0".charCodeAt(0), a = 0; a <= 9; ++a)
            o[_++] = a;
        for (_ = "a".charCodeAt(0),
        a = 10; a < 36; ++a)
            o[_++] = a;
        for (_ = "A".charCodeAt(0),
        a = 10; a < 36; ++a)
            o[_++] = a;
        function n(t, e) {
            var r = o[t.charCodeAt(e)];
            return null == r ? -1 : r
        }
        e.intAt = n;
        var p = "0123456789abcdefghijklmnopqrstuvwxyz";
        function c(t) {
            return p.charAt(t)
        }
        e.int2char = c;
        e.b64toHex = function(t) {
            for (var e = "", r = 0, i = 0, s = 0; s < t.length && "=" != t.charAt(s); ++s) {
                var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(t.charAt(s));
                o < 0 || (r = 0 == r ? (e += c(o >> 2),
                i = 3 & o,
                1) : 1 == r ? (e += c(i << 2 | o >> 4),
                i = 15 & o,
                2) : 2 == r ? (e += c(i),
                e += c(o >> 2),
                i = 3 & o,
                3) : (e += c(i << 2 | o >> 4),
                e += c(15 & o),
                0))
            }
            return 1 == r && (e += c(i << 2)),
            e
        }
        ,
        e.removeExtraSymbols = function(t) {
            return t.replace(/^1f+00/, "").replace("3031300d060960864801650304020105000420", "")
        }
        ;
        var d = (u.prototype.convert = function(t) {
            return t.s < 0 || 0 <= t.compareTo(this.m) ? t.mod(this.m) : t
        }
        ,
        u.prototype.revert = function(t) {
            return t
        }
        ,
        u.prototype.reduce = function(t) {
            t.divRemTo(this.m, null, t)
        }
        ,
        u.prototype.mulTo = function(t, e, r) {
            t.multiplyTo(e, r),
            this.reduce(r)
        }
        ,
        u.prototype.sqrTo = function(t, e) {
            t.squareTo(e),
            this.reduce(e)
        }
        ,
        u);
        function u(t) {
            this.m = t
        }
        var h = (l.prototype.convert = function(t) {
            var e = b();
            return t.abs().dlShiftTo(this.m.t, e),
            e.divRemTo(this.m, null, e),
            t.s < 0 && 0 < e.compareTo(s.ZERO) && this.m.subTo(e, e),
            e
        }
        ,
        l.prototype.revert = function(t) {
            var e = b();
            return t.copyTo(e),
            this.reduce(e),
            e
        }
        ,
        l.prototype.reduce = function(t) {
            for (; t.t <= this.mt2; )
                t[t.t++] = 0;
            for (var e = 0; e < this.m.t; ++e) {
                var r = 32767 & t[e]
                  , i = r * this.mpl + ((r * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                for (t[r = e + this.m.t] += this.m.am(0, i, t, e, 0, this.m.t); t[r] >= t.DV; )
                    t[r] -= t.DV,
                    t[++r]++
            }
            t.clamp(),
            t.drShiftTo(this.m.t, t),
            0 <= t.compareTo(this.m) && t.subTo(this.m, t)
        }
        ,
        l.prototype.mulTo = function(t, e, r) {
            t.multiplyTo(e, r),
            this.reduce(r)
        }
        ,
        l.prototype.sqrTo = function(t, e) {
            t.squareTo(e),
            this.reduce(e)
        }
        ,
        l);
        function l(t) {
            this.m = t,
            this.mp = t.invDigit(),
            this.mpl = 32767 & this.mp,
            this.mph = this.mp >> 15,
            this.um = (1 << t.DB - 15) - 1,
            this.mt2 = 2 * t.t
        }
        function f(t) {
            var e = b();
            return e.fromHexString(t.toString()),
            e
        }
        e.nbv = f,
        s.ZERO = f(0),
        s.ONE = f(1),
        i = "Microsoft Internet Explorer" == navigator.appName ? (s.prototype.am = s.prototype.am2,
        30) : "Netscape" != navigator.appName ? (s.prototype.am = s.prototype.am1,
        26) : (s.prototype.am = s.prototype.am3,
        28),
        s.prototype.DB = i,
        s.prototype.DM = (1 << i) - 1,
        s.prototype.DV = 1 << i;
        s.prototype.FV = Math.pow(2, 52),
        s.prototype.F1 = 52 - i,
        s.prototype.F2 = 2 * i - 52
    },
    382: function(t, e, r) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = (y.hash = function(t) {
            t = y.utf8Encode(t || "");
            for (var e = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], r = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], i = (t += String.fromCharCode(128)).length / 4 + 2, s = Math.ceil(i / 16), o = new Array(s), _ = 0; _ < s; _++) {
                o[_] = new Array(16);
                for (var a = 0; a < 16; a++)
                    o[_][a] = t.charCodeAt(64 * _ + 4 * a) << 24 | t.charCodeAt(64 * _ + 4 * a + 1) << 16 | t.charCodeAt(64 * _ + 4 * a + 2) << 8 | t.charCodeAt(64 * _ + 4 * a + 3) << 0
            }
            var n = 8 * (t.length - 1) / Math.pow(2, 32)
              , p = 8 * (t.length - 1) >>> 0;
            for (o[s - 1][14] = Math.floor(n),
            o[s - 1][15] = p,
            _ = 0; _ < s; _++) {
                for (var c = new Array(64), d = 0; d < 16; d++)
                    c[d] = o[_][d];
                for (d = 16; d < 64; d++)
                    c[d] = y.q1(c[d - 2]) + c[d - 7] + y.q0(c[d - 15]) + c[d - 16] >>> 0;
                for (var u = r[0], h = r[1], l = r[2], f = r[3], E = r[4], v = r[5], m = r[6], T = r[7], d = 0; d < 64; d++) {
                    var b = T + y.z1(E) + y.Ch(E, v, m) + e[d] + c[d]
                      , D = y.z0(u) + y.Maj(u, h, l);
                    T = m,
                    m = v,
                    v = E,
                    E = f + b >>> 0,
                    f = l,
                    l = h,
                    h = u,
                    u = b + D >>> 0
                }
                r[0] = r[0] + u >>> 0,
                r[1] = r[1] + h >>> 0,
                r[2] = r[2] + l >>> 0,
                r[3] = r[3] + f >>> 0,
                r[4] = r[4] + E >>> 0,
                r[5] = r[5] + v >>> 0,
                r[6] = r[6] + m >>> 0,
                r[7] = r[7] + T >>> 0
            }
            for (var P = new Array(r.length), T = 0; T < r.length; T++)
                P[T] = ("00000000" + r[T].toString(16)).slice(-8);
            return P.join("")
        }
        ,
        y.utf8Encode = function(e) {
            try {
                return (new TextEncoder).encode(e).reduce(function(t, e) {
                    return t + String.fromCharCode(e)
                }, "")
            } catch (t) {
                return unescape(encodeURIComponent(e))
            }
        }
        ,
        y.ROTR = function(t, e) {
            return e >>> t | e << 32 - t
        }
        ,
        y.z0 = function(t) {
            return y.ROTR(2, t) ^ y.ROTR(13, t) ^ y.ROTR(22, t)
        }
        ,
        y.z1 = function(t) {
            return y.ROTR(6, t) ^ y.ROTR(11, t) ^ y.ROTR(25, t)
        }
        ,
        y.q0 = function(t) {
            return y.ROTR(7, t) ^ y.ROTR(18, t) ^ t >>> 3
        }
        ,
        y.q1 = function(t) {
            return y.ROTR(17, t) ^ y.ROTR(19, t) ^ t >>> 10
        }
        ,
        y.Ch = function(t, e, r) {
            return t & e ^ ~t & r
        }
        ,
        y.Maj = function(t, e, r) {
            return t & e ^ t & r ^ e & r
        }
        ,
        y);
        function y() {}
        e.Sha256 = i
    }
}, [378]);
owpbjsChunk([230], {
    397: function(e, r, t) {
        e.exports = t(398)
    },
    398: function(e, r, t) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        t.d(r, "adpodUtils", function() {
            return T
        }),
        r.buildDfpVideoUrl = i,
        r.notifyTranslationModule = d,
        r.buildAdpodVideoUrl = u;
        var o = t(72)
          , s = t(42)
          , p = t(0)
          , a = t(3)
          , n = t(13)
          , c = t(26);
        function _(e, r, t) {
            return r in e ? Object.defineProperty(e, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[r] = t,
            e
        }
        function b() {
            return (b = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var o in t)
                        Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
                }
                return e
            }
            ).apply(this, arguments)
        }
        var f = {
            env: "vp",
            gdfp_req: 1,
            output: "xml_vast3",
            unviewed_position_start: 1
        }
          , T = {};
        function i(e) {
            if (e.params || e.url) {
                var r = e.adUnit
                  , t = e.bid || s.a.getWinningBids(r.code)[0]
                  , o = {};
                if (e.url && (o = Object(p.parseUrl)(e.url, {
                    noDecodeWholeURL: !0
                }),
                Object(p.isEmpty)(e.params)))
                    return function(e, r, t) {
                        var o = l(r, e, "search");
                        o && (e.search.description_url = o);
                        var a = v(r, t);
                        return e.search.cust_params = e.search.cust_params ? e.search.cust_params + "%26" + a : a,
                        Object(p.buildUrl)(e)
                    }(o, t, e);
                var a = {
                    correlator: Date.now(),
                    sz: Object(p.parseSizesInput)(r.sizes).join("|"),
                    url: encodeURIComponent(location.href)
                }
                  , n = v(t, e)
                  , c = b({}, f, o.search, a, e.params, {
                    cust_params: n
                })
                  , i = l(t, e, "params");
                return i && (c.description_url = i),
                Object(p.buildUrl)({
                    protocol: "https",
                    host: "securepubads.g.doubleclick.net",
                    pathname: "/gampad/ads",
                    search: c
                })
            }
            Object(p.logError)("A params object or a url is required to use owpbjs.adServers.dfp.buildVideoUrl")
        }
        function d(e) {
            e.call(this, "dfp")
        }
        function u() {
            var s, r, e, t, o = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, d = o.code, u = o.params, l = o.callback;
            u && l ? (s = {
                correlator: Date.now(),
                sz: (r = d,
                e = c.a.getAdUnits().filter(function(e) {
                    return e.code === r
                }),
                t = Object(p.deepAccess)(e[0], "mediaTypes.video.playerSize"),
                Object(p.parseSizesInput)(t).join("|")),
                url: encodeURIComponent(location.href)
            },
            T.getTargeting({
                codes: [d],
                callback: function(e, r) {
                    var t;
                    if (e)
                        return void l(e, null);
                    var o = (_(t = {}, T.TARGETING_KEY_PB_CAT_DUR, void 0),
                    _(t, T.TARGETING_KEY_CACHE_ID, void 0),
                    t)
                      , a = {};
                    r[d] && (a = r[d].reduce(function(e, r) {
                        return Object.keys(r)[0] === T.TARGETING_KEY_PB_CAT_DUR ? e[T.TARGETING_KEY_PB_CAT_DUR] = void 0 !== e[T.TARGETING_KEY_PB_CAT_DUR] ? e[T.TARGETING_KEY_PB_CAT_DUR] + "," + r[T.TARGETING_KEY_PB_CAT_DUR] : r[T.TARGETING_KEY_PB_CAT_DUR] : Object.keys(r)[0] === T.TARGETING_KEY_CACHE_ID && (e[T.TARGETING_KEY_CACHE_ID] = r[T.TARGETING_KEY_CACHE_ID]),
                        e
                    }, o));
                    var n = encodeURIComponent(Object(p.formatQS)(a))
                      , c = b({}, f, s, u, {
                        cust_params: n
                    })
                      , i = Object(p.buildUrl)({
                        protocol: "https",
                        host: "securepubads.g.doubleclick.net",
                        pathname: "/gampad/ads",
                        search: c
                    });
                    l(null, i)
                }
            })) : Object(p.logError)("A params object and a callback is required to use pbjs.adServers.dfp.buildAdpodVideoUrl")
        }
        function l(e, r, t) {
            if (!a.b.getConfig("cache.url"))
                if (Object(p.deepAccess)(r, "".concat(t, ".description_url")))
                    Object(p.logError)("input cannnot contain description_url");
                else {
                    var o = e && e.vastUrl;
                    if (o)
                        return encodeURIComponent(o)
                }
        }
        function v(e, r) {
            var t, o = e && e.adserverTargeting || {}, a = {}, n = r && r.adUnit;
            n && (a = (t = s.a.getAllTargeting(n.code)) ? t[n.code] : {});
            var c = Object(p.deepAccess)(r, "params.cust_params")
              , i = b({}, {
                hb_uuid: e && e.videoCacheKey
            }, {
                hb_cache_id: e && e.videoCacheKey
            }, a, o, c);
            return window.PWT && window.PWT.getCustomParamsForDFPVideo && (i = window.PWT.getCustomParamsForDFPVideo(c, e)),
            encodeURIComponent(Object(p.formatQS)(i))
        }
        Object(n.a)("registerAdserver").before(d),
        Object(o.a)("dfp", {
            buildVideoUrl: i,
            buildAdpodVideoUrl: u,
            getAdpodTargeting: function(e) {
                return T.getTargeting(e)
            }
        }),
        Object(n.e)("adpod", T)
    }
}, [397]);
owpbjsChunk([190], {
    483: function(e, r, t) {
        e.exports = t(484)
    },
    484: function(e, r, t) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        t.d(r, "spec", function() {
            return m
        });
        var b = t(0)
          , y = t(2)
          , h = t(3)
          , i = t(11)
          , l = t.n(i)
          , a = t(485)
          , n = t.n(a)
          , s = t(1);
        function v(e) {
            return (v = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        var o = [y.b, y.d]
          , g = 100
          , w = 300
          , x = 3600
          , I = !0
          , P = {
            JPY: 1
        };
        function p(e) {
            var r = {};
            return r.id = e.bidId,
            r.ext = {},
            r.ext.siteID = e.params.siteId,
            !e.params.hasOwnProperty("id") || "string" != typeof e.params.id && "number" != typeof e.params.id ? r.ext.sid = "".concat(e.params.size[0], "x").concat(e.params.size[1]) : r.ext.sid = String(e.params.id),
            e.params.hasOwnProperty("bidFloor") && e.params.hasOwnProperty("bidFloorCur") && (r.bidfloor = e.params.bidFloor,
            r.bidfloorcur = e.params.bidFloorCur),
            r
        }
        function d(e) {
            return Array.isArray(e) && 2 === e.length && n()(e[0]) && n()(e[1])
        }
        function c(e, r) {
            if (d(e))
                return e[0] === r[0] && e[1] === r[1];
            for (var t = 0; t < e.length; t++)
                if (e[t][0] === r[0] && e[t][1] === r[1])
                    return 1
        }
        function u(e, r, t, i) {
            var a = [];
            if (window.headertag && "function" == typeof window.headertag.getIdentityInfo) {
                var n, s = window.headertag.getIdentityInfo();
                if (s && "object" === v(s))
                    for (var o in s) {
                        !s.hasOwnProperty(o) || !(n = s[o]).responsePending && n.data && "object" === v(n.data) && Object.keys(n.data).length && a.push(n.data)
                    }
            }
            var d, p = {};
            p.id = e[0].bidderRequestId,
            p.imp = t,
            p.site = {},
            p.ext = {},
            p.ext.source = "prebid",
            e[0].schain && (p.source = {
                ext: {
                    schain: e[0].schain
                }
            }),
            0 < a.length && (p.user = {},
            p.user.eids = a),
            document.referrer && "" !== document.referrer && (p.site.ref = document.referrer),
            r && (r.gdprConsent && ((d = r.gdprConsent).hasOwnProperty("gdprApplies") && (p.regs = {
                ext: {
                    gdpr: d.gdprApplies ? 1 : 0
                }
            }),
            d.hasOwnProperty("consentString") && (p.user = p.user || {},
            p.user.ext = {
                consent: d.consentString || ""
            })),
            r.uspConsent && b.deepSetValue(p, "regs.ext.us_privacy", r.uspConsent),
            r.refererInfo && (p.site.page = r.refererInfo.referer));
            var c = {}
              , u = r && r.bidderCode || "ix"
              , m = h.b.getConfig(u);
            if (m) {
                if ("object" === v(m.firstPartyData)) {
                    var f = m.firstPartyData
                      , y = "?";
                    for (var l in f)
                        f.hasOwnProperty(l) && (y += "".concat(encodeURIComponent(l), "=").concat(encodeURIComponent(f[l]), "&"));
                    y = y.slice(0, -1),
                    p.site.page += y
                }
                "number" == typeof m.timeout && (c.t = m.timeout)
            }
            return c.s = e[0].params.siteId,
            c.v = i,
            c.r = JSON.stringify(p),
            c.ac = "j",
            c.sd = 1,
            8.1 === i && (c.nf = 1),
            {
                method: "GET",
                url: "https://as-sec.casalemedia.com/cygnus",
                data: c
            }
        }
        var m = {
            code: "ix",
            gvlid: 10,
            aliases: ["indexExchange"],
            supportedMediaTypes: o,
            isBidRequestValid: function(e) {
                if (!d(e.params.size))
                    return b.logError("ix bidder params: bid size has invalid format."),
                    !1;
                if (!c(e.sizes, e.params.size))
                    return b.logError("ix bidder params: bid size is not included in ad unit sizes."),
                    !1;
                if (e.hasOwnProperty("mediaType") && !b.contains(o, e.mediaType))
                    return !1;
                if (e.hasOwnProperty("mediaTypes") && !b.deepAccess(e, "mediaTypes.banner.sizes") && !b.deepAccess(e, "mediaTypes.video.playerSize"))
                    return !1;
                if ("string" != typeof e.params.siteId && "number" != typeof e.params.siteId)
                    return b.logError("ix bidder params: siteId must be string or number value."),
                    !1;
                var r, t, i = e.params.hasOwnProperty("bidFloor"), a = e.params.hasOwnProperty("bidFloorCur");
                return !!(!i && !a || i && a && (r = e.params.bidFloor,
                t = e.params.bidFloorCur,
                Boolean("number" == typeof r && "string" == typeof t && t.match(/^[A-Z]{3}$/)))) || (b.logError("ix bidder params: bidFloor / bidFloorCur parameter has invalid format."),
                !1)
            },
            buildRequests: function(e, r) {
                for (var t, i, a = [], n = [], s = [], o = null, d = 0; d < e.length; d++)
                    (o = e[d]).mediaType !== y.d && !b.deepAccess(o, "mediaTypes.video") || (o.mediaType === y.d || c(o.mediaTypes.video.playerSize, o.params.size) ? s.push(function(e) {
                        var r = p(e);
                        r.video = b.deepClone(e.params.video),
                        r.video.w = e.params.size[0],
                        r.video.h = e.params.size[1];
                        var t = b.deepAccess(e, "mediaTypes.video.context");
                        return t && ("instream" === t ? r.video.placement = 1 : "outstream" === t ? r.video.placement = 4 : b.logWarn("ix bidder params: video context '".concat(t, "' is not supported"))),
                        r
                    }(o)) : b.logError("Bid size is not included in video playerSize")),
                    o.mediaType !== y.b && !b.deepAccess(o, "mediaTypes.banner") && (o.mediaType || o.mediaTypes) || n.push((i = void 0,
                    (i = p(t = o)).banner = {},
                    i.banner.w = t.params.size[0],
                    i.banner.h = t.params.size[1],
                    i.banner.topframe = b.inIframe() ? 0 : 1,
                    i));
                return 0 < n.length && a.push(u(e, r, n, 7.2)),
                0 < s.length && a.push(u(e, r, s, 8.1)),
                a
            },
            interpretResponse: function(e, r) {
                var t = [];
                if (!e.hasOwnProperty("body") || !e.body.hasOwnProperty("seatbid"))
                    return t;
                for (var i, a, n, s, o = e.body, d = o.seatbid, p = 0; p < d.length; p++)
                    if (d[p].hasOwnProperty("bid"))
                        for (var c = d[p].bid, u = JSON.parse(r.data.r), m = 0; m < c.length; m++) {
                            var f = function(r, e) {
                                if (r)
                                    return l()(e, function(e) {
                                        return e.id === r
                                    })
                            }(c[m].impid, u.imp);
                            i = c[m],
                            a = o.cur,
                            n = f,
                            s = void 0,
                            s = {},
                            P.hasOwnProperty(a) ? s.cpm = i.price / P[a] : s.cpm = i.price / g,
                            s.requestId = i.impid,
                            s.dealId = b.deepAccess(i, "ext.dealid"),
                            s.netRevenue = I,
                            s.currency = a,
                            s.creativeId = i.hasOwnProperty("crid") ? i.crid : "-",
                            b.deepAccess(i, "ext.vasturl") ? (s.vastUrl = i.ext.vasturl,
                            s.width = n.video.w,
                            s.height = n.video.h,
                            s.mediaType = y.d,
                            s.ttl = x) : (s.ad = i.adm,
                            s.width = i.w,
                            s.height = i.h,
                            s.mediaType = y.b,
                            s.ttl = w),
                            s.meta = {},
                            s.meta.networkId = b.deepAccess(i, "ext.dspid"),
                            s.meta.brandId = b.deepAccess(i, "ext.advbrandid"),
                            s.meta.brandName = b.deepAccess(i, "ext.advbrand"),
                            t.push(s)
                        }
                return t
            },
            transformBidParams: function(e) {
                return b.convertTypes({
                    siteID: "number"
                }, e)
            },
            getUserSyncs: function(e) {
                return e.iframeEnabled ? [{
                    type: "iframe",
                    url: "https://js-sec.indexww.com/um/ixmatch.html"
                }] : []
            }
        };
        Object(s.registerBidder)(m)
    }
}, [483]);
owpbjsChunk([149], {
    586: function(e, t, n) {
        e.exports = n(587)
    },
    587: function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        n.d(t, "USER_ID_CODE_TO_QUERY_ARG", function() {
            return m
        }),
        n.d(t, "spec", function() {
            return l
        });
        var c = n(3)
          , r = n(1)
          , d = n(0)
          , s = n(2);
        function o(e, t) {
            return function(e) {
                if (Array.isArray(e))
                    return e
            }(e) || function(e, t) {
                if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
                    return;
                var n = []
                  , r = !0
                  , i = !1
                  , a = void 0;
                try {
                    for (var s, o = e[Symbol.iterator](); !(r = (s = o.next()).done) && (n.push(s.value),
                    !t || n.length !== t); r = !0)
                        ;
                } catch (e) {
                    i = !0,
                    a = e
                } finally {
                    try {
                        r || null == o.return || o.return()
                    } finally {
                        if (i)
                            throw a
                    }
                }
                return n
            }(e, t) || function(e, t) {
                if (!e)
                    return;
                if ("string" == typeof e)
                    return i(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === n && e.constructor && (n = e.constructor.name);
                if ("Map" === n || "Set" === n)
                    return Array.from(e);
                if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                    return i(e, t)
            }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function i(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var n = 0, r = new Array(t); n < t; n++)
                r[n] = e[n];
            return r
        }
        var a = [s.b, s.d]
          , p = "hb_pb"
          , u = "3.0.2"
          , m = {
            britepoolid: "britepoolid",
            criteoId: "criteoid",
            digitrustid: "digitrustid",
            id5id: "id5id",
            idl_env: "lre",
            lipb: "lipbid",
            netId: "netid",
            parrableid: "parrableid",
            pubcid: "pubcid",
            tdid: "ttduuid"
        }
          , l = {
            code: "openx",
            gvlid: 69,
            supportedMediaTypes: a,
            isBidRequestValid: function(e) {
                var t = e.params.delDomain || e.params.platform;
                return d.deepAccess(e, "mediaTypes.banner") && t ? !!e.params.unit || 0 < d.deepAccess(e, "mediaTypes.banner.sizes.length") : !(!e.params.unit || !t)
            },
            buildRequests: function(e, r) {
                if (0 === e.length)
                    return [];
                var i = []
                  , t = o(e.reduce(function(e, t) {
                    var n;
                    return n = t,
                    d.deepAccess(n, "mediaTypes.video") && !d.deepAccess(n, "mediaTypes.banner") || n.mediaType === s.d ? e[0].push(t) : e[1].push(t),
                    e
                }, [[], []]), 2)
                  , n = t[0]
                  , a = t[1];
                return 0 < a.length && i.push(function(e, t) {
                    var r = []
                      , i = !1
                      , n = h(e, t)
                      , a = d._map(e, function(e) {
                        return e.params.unit
                    });
                    n.aus = d._map(e, function(e) {
                        return d.parseSizesInput(e.mediaTypes.banner.sizes).join(",")
                    }).join("|"),
                    n.divIds = d._map(e, function(e) {
                        return encodeURIComponent(e.adUnitCode)
                    }).join(","),
                    a.some(function(e) {
                        return e
                    }) && (n.auid = a.join(","));
                    e.some(function(e) {
                        return e.params.doNotTrack
                    }) && (n.ns = 1);
                    !0 !== c.b.getConfig("coppa") && !e.some(function(e) {
                        return e.params.coppa
                    }) || (n.tfcd = 1);
                    e.forEach(function(t) {
                        var e, n;
                        t.params.customParams ? (e = d._map(Object.keys(t.params.customParams), function(e) {
                            return function(e, t) {
                                var n = t[e];
                                d.isArray(n) && (n = n.join(","));
                                return (e.toLowerCase() + "=" + n.toLowerCase()).replace("+", ".").replace("/", "_")
                            }(e, t.params.customParams)
                        }),
                        n = window.btoa(e.join("&")),
                        i = !0,
                        r.push(n)) : r.push("")
                    }),
                    i && (n.tps = r.join(","));
                    var s = []
                      , o = !1;
                    e.forEach(function(e) {
                        e.params.customFloor ? (s.push(Math.round(100 * e.params.customFloor) / 100 * 1e3),
                        o = !0) : s.push(0)
                    }),
                    o && (n.aumfs = s.join(","));
                    return {
                        method: "GET",
                        url: n.ph ? "https://u.openx.net/w/1.0/arj" : "https://".concat(e[0].params.delDomain, "/w/1.0/arj"),
                        data: n,
                        payload: {
                            bids: e,
                            startTime: new Date
                        }
                    }
                }(a, r)),
                0 < n.length && n.forEach(function(e) {
                    var t, n;
                    i.push({
                        method: "GET",
                        url: (n = function(e, t) {
                            var n, r, i = h([e], t), a = d.deepAccess(e, "params.video") || {}, s = d.deepAccess(e, "mediaTypes.video.context"), o = d.deepAccess(e, "mediaTypes.video.playerSize");
                            d.isArray(e.sizes) && 2 === e.sizes.length && !d.isArray(e.sizes[0]) ? (n = parseInt(e.sizes[0], 10),
                            r = parseInt(e.sizes[1], 10)) : d.isArray(e.sizes) && d.isArray(e.sizes[0]) && 2 === e.sizes[0].length ? (n = parseInt(e.sizes[0][0], 10),
                            r = parseInt(e.sizes[0][1], 10)) : d.isArray(o) && 2 === o.length && (n = parseInt(o[0], 10),
                            r = parseInt(o[1], 10));
                            Object.keys(a).forEach(function(e) {
                                "openrtb" === e ? (a[e].w = n || a[e].w,
                                a[e].v = r || a[e].v,
                                i[e] = JSON.stringify(a[e])) : e in i || "url" === e || (i[e] = a[e])
                            }),
                            i.auid = e.params.unit,
                            i.vwd = n || a.vwd,
                            i.vht = r || a.vht,
                            "outstream" === s && (i.vos = "101");
                            a.mimes && (i.vmimes = a.mimes);
                            return i
                        }(t = e, r)).ph ? "https://u.openx.net/v/1.0/avjp" : "https://".concat(t.params.delDomain, "/v/1.0/avjp"),
                        data: n,
                        payload: {
                            bid: t,
                            startTime: new Date
                        }
                    })
                }),
                i
            },
            interpretResponse: function(e, t) {
                var n = e.body;
                return ((/avjp$/.test(t.url) ? s.d : s.b) === s.d ? function(e, t) {
                    var n = t.bid
                      , r = (t.startTime,
                    []);
                    {
                        var i, a;
                        void 0 !== e && "" !== e.vastUrl && 0 < e.pub_rev && (i = d.parseUrl(e.vastUrl).search || {},
                        (a = {}).requestId = n.bidId,
                        a.ttl = 300,
                        a.netRevenue = !0,
                        a.currency = e.currency,
                        a.cpm = parseInt(e.pub_rev, 10) / 1e3,
                        a.width = parseInt(e.width, 10),
                        a.height = parseInt(e.height, 10),
                        a.creativeId = e.adid,
                        a.vastUrl = e.vastUrl,
                        a.mediaType = s.d,
                        e.ph = i.ph,
                        e.colo = i.colo,
                        e.ts = i.ts,
                        r.push(a))
                    }
                    return r
                }
                : function(e, t) {
                    for (var n = t.bids, r = (t.startTime,
                    e.ads.ad), i = [], a = 0; a < r.length; a++) {
                        var s, o = r[a], c = parseInt(o.idx, 10), d = {};
                        d.requestId = n[c].bidId,
                        o.pub_rev && (d.cpm = Number(o.pub_rev) / 1e3,
                        (s = o.creative[0]) && (d.width = s.width,
                        d.height = s.height),
                        d.creativeId = s.id,
                        d.ad = o.html,
                        o.deal_id && (d.dealId = o.deal_id),
                        d.ttl = 300,
                        d.netRevenue = !0,
                        d.currency = o.currency,
                        o.tbd && (d.tbd = o.tbd),
                        d.ts = o.ts,
                        d.meta = {},
                        o.brand_id && (d.meta.brandId = o.brand_id),
                        o.adv_id && (d.meta.dspid = o.adv_id),
                        i.push(d))
                    }
                    return i
                }
                )(n, t.payload)
            },
            getUserSyncs: function(e, t, n, r) {
                if (e.iframeEnabled || e.pixelEnabled)
                    return [{
                        type: e.iframeEnabled ? "iframe" : "image",
                        url: d.deepAccess(t, "0.body.ads.pixels") || d.deepAccess(t, "0.body.pixels") || function(e, t) {
                            var n = [];
                            e && (n.push("gdpr=" + (e.gdprApplies ? 1 : 0)),
                            n.push("gdpr_consent=" + encodeURIComponent(e.consentString || "")));
                            t && n.push("us_privacy=" + encodeURIComponent(t));
                            return "".concat("https://u.openx.net/w/1.0/pd").concat(0 < n.length ? "?" + n.join("&") : "")
                        }(n, r)
                    }]
            },
            transformBidParams: function(e) {
                return d.convertTypes({
                    unit: "string",
                    customFloor: "number"
                }, e)
            }
        };
        function h(e, t) {
            var n, r, i, a, s = d.inIframe(), o = {
                ju: c.b.getConfig("pageUrl") || t.refererInfo.referer,
                ch: document.charSet || document.characterSet,
                res: "".concat(screen.width, "x").concat(screen.height, "x").concat(screen.colorDepth),
                ifr: s,
                tz: (new Date).getTimezoneOffset(),
                tws: function(e) {
                    var t, n, r, i = window, a = document, s = a.documentElement;
                    if (e) {
                        try {
                            i = window.top,
                            a = window.top.document
                        } catch (e) {
                            return
                        }
                        s = a.documentElement,
                        r = a.body,
                        t = i.innerWidth || s.clientWidth || r.clientWidth,
                        n = i.innerHeight || s.clientHeight || r.clientHeight
                    } else
                        s = a.documentElement,
                        t = i.innerWidth || s.clientWidth,
                        n = i.innerHeight || s.clientHeight;
                    return "".concat(t, "x").concat(n)
                }(s),
                be: 1,
                bc: e[0].params.bc || "".concat(p, "_").concat(u),
                dddid: d._map(e, function(e) {
                    return e.transactionId
                }).join(","),
                nocache: (new Date).getTime()
            };
            return e[0].params.platform && (o.ph = e[0].params.platform),
            t.gdprConsent && (void 0 !== (n = t.gdprConsent).consentString && (o.gdpr_consent = n.consentString),
            void 0 !== n.gdprApplies && (o.gdpr = n.gdprApplies ? 1 : 0),
            "iab" === c.b.getConfig("consentManagement.cmpApi") && (o.x_gdpr_f = 1)),
            t && t.uspConsent && (o.us_privacy = t.uspConsent),
            d.deepAccess(e[0], "crumbs.pubcid") && d.deepSetValue(e[0], "userId.pubcid", d.deepAccess(e[0], "crumbs.pubcid")),
            r = o,
            i = e[0].userId,
            d._each(i, function(e, t) {
                var n = m[t];
                if (m.hasOwnProperty(t))
                    switch (t) {
                    case "digitrustid":
                        r[n] = d.deepAccess(e, "data.id");
                        break;
                    case "lipb":
                        r[n] = e.lipbid;
                        break;
                    default:
                        r[n] = e
                    }
            }),
            o = r,
            e[0].schain && (o.schain = (a = e[0].schain,
            "".concat(a.ver, ",").concat(a.complete, "!").concat(function(e) {
                var n = ["asi", "sid", "hp", "rid", "name", "domain"];
                return e.map(function(t) {
                    return n.map(function(e) {
                        return t[e] || ""
                    }).join(",")
                }).join("!")
            }(a.nodes)))),
            o
        }
        Object(r.registerBidder)(l)
    }
}, [586]);
owpbjsChunk([132], {
    627: function(e, r, a) {
        e.exports = a(628)
    },
    628: function(e, r, a) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        a.d(r, "spec", function() {
            return b
        });
        var O = a(0)
          , i = a(1)
          , S = a(2)
          , R = a(3)
          , t = a(10);
        function P() {
            return (P = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var a = arguments[r];
                    for (var i in a)
                        Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i])
                }
                return e
            }
            ).apply(this, arguments)
        }
        function D(e) {
            return (D = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        var Y = "PubMatic: "
          , x = "USD"
          , A = void 0
          , s = "https://pubmatic.bbvms.com/r/".concat("$RENDERER", ".js")
          , N = {
            kadpageurl: "",
            gender: "",
            yob: "",
            lat: "",
            lon: "",
            wiid: "",
            profId: "",
            verId: ""
        }
          , n = {
            NUMBER: "number",
            STRING: "string",
            BOOLEAN: "boolean",
            ARRAY: "array",
            OBJECT: "object"
        }
          , o = {
            mimes: n.ARRAY,
            minduration: n.NUMBER,
            maxduration: n.NUMBER,
            startdelay: n.NUMBER,
            playbackmethod: n.ARRAY,
            api: n.ARRAY,
            protocols: n.ARRAY,
            w: n.NUMBER,
            h: n.NUMBER,
            battr: n.ARRAY,
            linearity: n.NUMBER,
            placement: n.NUMBER,
            minbitrate: n.NUMBER,
            maxbitrate: n.NUMBER
        }
          , c = {
            TITLE: {
                ID: 1,
                KEY: "title",
                TYPE: 0
            },
            IMAGE: {
                ID: 2,
                KEY: "image",
                TYPE: 0
            },
            ICON: {
                ID: 3,
                KEY: "icon",
                TYPE: 0
            },
            SPONSOREDBY: {
                ID: 4,
                KEY: "sponsoredBy",
                TYPE: 1
            },
            BODY: {
                ID: 5,
                KEY: "body",
                TYPE: 2
            },
            CLICKURL: {
                ID: 6,
                KEY: "clickUrl",
                TYPE: 0
            },
            VIDEO: {
                ID: 7,
                KEY: "video",
                TYPE: 0
            },
            EXT: {
                ID: 8,
                KEY: "ext",
                TYPE: 0
            },
            DATA: {
                ID: 9,
                KEY: "data",
                TYPE: 0
            },
            LOGO: {
                ID: 10,
                KEY: "logo",
                TYPE: 0
            },
            SPONSORED: {
                ID: 11,
                KEY: "sponsored",
                TYPE: 1
            },
            DESC: {
                ID: 12,
                KEY: "data",
                TYPE: 2
            },
            RATING: {
                ID: 13,
                KEY: "rating",
                TYPE: 3
            },
            LIKES: {
                ID: 14,
                KEY: "likes",
                TYPE: 4
            },
            DOWNLOADS: {
                ID: 15,
                KEY: "downloads",
                TYPE: 5
            },
            PRICE: {
                ID: 16,
                KEY: "price",
                TYPE: 6
            },
            SALEPRICE: {
                ID: 17,
                KEY: "saleprice",
                TYPE: 7
            },
            PHONE: {
                ID: 18,
                KEY: "phone",
                TYPE: 8
            },
            ADDRESS: {
                ID: 19,
                KEY: "address",
                TYPE: 9
            },
            DESC2: {
                ID: 20,
                KEY: "desc2",
                TYPE: 10
            },
            DISPLAYURL: {
                ID: 21,
                KEY: "displayurl",
                TYPE: 11
            },
            CTA: {
                ID: 22,
                KEY: "cta",
                TYPE: 12
            }
        }
          , l = {
            ICON: 1,
            LOGO: 2,
            IMAGE: 3
        }
          , m = [{
            id: c.SPONSOREDBY.ID,
            required: !0,
            data: {
                type: 1
            }
        }, {
            id: c.TITLE.ID,
            required: !0
        }, {
            id: c.IMAGE.ID,
            required: !0
        }]
          , d = {
            1: "PMP",
            5: "PREF",
            6: "PMPG"
        }
          , p = {
            bootstrapPlayer: function(e) {
                var r = {
                    code: e.adUnitCode
                };
                if (e.vastXml ? r.vastXml = e.vastXml : e.vastUrl && (r.vastUrl = e.vastUrl),
                e.vastXml || e.vastUrl) {
                    for (var a, i = p.getRendererId("pubmatic", e.rendererCode), t = document.getElementById(e.adUnitCode), s = 0; s < window.bluebillywig.renderers.length; s++)
                        if (window.bluebillywig.renderers[s]._id === i) {
                            a = window.bluebillywig.renderers[s];
                            break
                        }
                    a ? a.bootstrap(r, t) : O.logWarn("".concat(Y, ": Couldn't find a renderer with ").concat(i))
                } else
                    O.logWarn("".concat(Y, ": No vastXml or vastUrl on bid, bailing..."))
            },
            newRenderer: function(e, r) {
                var a = s.replace("$RENDERER", e)
                  , i = t.a.install({
                    url: a,
                    loaded: !1,
                    adUnitCode: r
                });
                try {
                    i.setRender(p.outstreamRender)
                } catch (e) {
                    O.logWarn("".concat(Y, ": Error tying to setRender on renderer"), e)
                }
                return i
            },
            outstreamRender: function(e) {
                e.renderer.push(function() {
                    p.bootstrapPlayer(e)
                })
            },
            getRendererId: function(e, r) {
                return "".concat(e, "-").concat(r)
            }
        }
          , k = 0
          , u = !1
          , g = {}
          , h = {};
        function z(e, r) {
            if (!O.isStr(r))
                return r && O.logWarn(Y + "Ignoring param key: " + e + ", expects string-value, found " + D(r)),
                A;
            switch (e) {
            case "pmzoneid":
                return r.split(",").slice(0, 50).map(function(e) {
                    return e.trim()
                }).join();
            case "kadfloor":
            case "lat":
            case "lon":
                return parseFloat(r) || A;
            case "yob":
                return parseInt(r) || A;
            default:
                return r
            }
        }
        function C(e) {
            var r;
            e.params.adUnit = "",
            e.params.adUnitIndex = "0",
            e.params.width = 0,
            e.params.height = 0,
            e.params.adSlot = (r = e.params.adSlot,
            O.isStr(r) ? r.replace(/^\s+/g, "").replace(/\s+$/g, "") : "");
            var a = (i = e.params.adSlot).split(":")
              , i = a[0];
            if (2 == a.length && (e.params.adUnitIndex = a[1]),
            a = i.split("@"),
            e.params.adUnit = a[0],
            1 < a.length) {
                if (2 != (a = 2 == a.length ? a[1].split("x") : 3 == a.length ? a[2].split("x") : []).length)
                    return void O.logWarn(Y + "AdSlot Error: adSlot not in required format");
                e.params.width = parseInt(a[0], 10),
                e.params.height = parseInt(a[1], 10)
            }
            if (e.hasOwnProperty("mediaTypes") && e.mediaTypes.hasOwnProperty(S.b) && e.mediaTypes.banner.hasOwnProperty("sizes")) {
                for (var t = 0, s = []; t < e.mediaTypes.banner.sizes.length; t++)
                    2 === e.mediaTypes.banner.sizes[t].length && s.push(e.mediaTypes.banner.sizes[t]);
                e.mediaTypes.banner.sizes = s,
                1 <= e.mediaTypes.banner.sizes.length && (e.params.width || e.params.height ? e.params.width == e.mediaTypes.banner.sizes[0][0] && e.params.height == e.mediaTypes.banner.sizes[0][1] && (e.mediaTypes.banner.sizes = e.mediaTypes.banner.sizes.splice(1, e.mediaTypes.banner.sizes.length - 1)) : (e.params.width = e.mediaTypes.banner.sizes[0][0],
                e.params.height = e.mediaTypes.banner.sizes[0][1],
                e.mediaTypes.banner.sizes = e.mediaTypes.banner.sizes.splice(1, e.mediaTypes.banner.sizes.length - 1)))
            }
        }
        function f(e) {
            var r, a = e.params.video;
            if (a !== A) {
                for (var i in r = {},
                o)
                    a.hasOwnProperty(i) && (r[i] = function(e, r, a) {
                        var i, t = "Ignoring param key: " + e + ", expects " + a + ", found " + D(r);
                        switch (a) {
                        case n.BOOLEAN:
                            i = O.isBoolean;
                            break;
                        case n.NUMBER:
                            i = O.isNumber;
                            break;
                        case n.STRING:
                            i = O.isStr;
                            break;
                        case n.ARRAY:
                            i = O.isArray
                        }
                        return i(r) ? r : (O.logWarn(Y + t),
                        A)
                    }(i, a[i], o[i]));
                if (e.mediaTypes.video.playerSize)
                    O.isArray(e.mediaTypes.video.playerSize[0]) ? (r.w = parseInt(e.mediaTypes.video.playerSize[0][0], 10),
                    r.h = parseInt(e.mediaTypes.video.playerSize[0][1], 10)) : O.isNumber(e.mediaTypes.video.playerSize[0]) && (r.w = parseInt(e.mediaTypes.video.playerSize[0], 10),
                    r.h = parseInt(e.mediaTypes.video.playerSize[1], 10));
                else {
                    if (!e.mediaTypes.video.w || !e.mediaTypes.video.h)
                        return r = A,
                        O.logWarn(Y + "Error: Video size params(playersize or w&h) missing for adunit: " + e.params.adUnit + " with mediaType set as video. Ignoring video impression in the adunit."),
                        r;
                    r.w = parseInt(e.mediaTypes.video.w, 10),
                    r.h = parseInt(e.mediaTypes.video.h, 10)
                }
                e.params.video.hasOwnProperty("skippable") && (r.ext = {
                    video_skippable: e.params.video.skippable ? 1 : 0
                })
            } else
                r = A,
                O.logWarn(Y + "Error: Video config params missing for adunit: " + e.params.adUnit + " with mediaType set as video. Ignoring video impression in the adunit.");
            return r
        }
        function U(e) {
            var r, a, i, t, s = {}, n = {}, o = e.hasOwnProperty("sizes") ? e.sizes : [], d = "", p = [], s = {
                id: e.bidId,
                tagid: e.params.hashedKey || e.params.adUnit || void 0,
                bidfloor: z("kadfloor", e.params.kadfloor),
                secure: 1,
                ext: {
                    pmZoneId: z("pmzoneid", e.params.pmzoneid)
                },
                bidfloorcur: e.params.currency ? z("currency", e.params.currency) : x
            };
            if (i = s,
            (t = e).params.deals && (O.isArray(t.params.deals) ? t.params.deals.forEach(function(e) {
                O.isStr(e) && 3 < e.length ? (i.pmp || (i.pmp = {
                    private_auction: 0,
                    deals: []
                }),
                i.pmp.deals.push({
                    id: e
                })) : O.logWarn(Y + "Error: deal-id present in array bid.params.deals should be a strings with more than 3 charaters length, deal-id ignored: " + e)
            }) : O.logWarn(Y + "Error: bid.params.deals should be an array of strings.")),
            e.hasOwnProperty("mediaTypes"))
                for (d in e.mediaTypes)
                    switch (d) {
                    case S.b:
                        (r = function(e) {
                            var r, a = e.mediaTypes.banner.sizes, i = [];
                            if (a !== A && O.isArray(a)) {
                                if (r = {},
                                e.params.width || e.params.height)
                                    r.w = e.params.width,
                                    r.h = e.params.height;
                                else {
                                    if (0 === a.length)
                                        return r = A,
                                        O.logWarn(Y + "Error: mediaTypes.banner.size missing for adunit: " + e.params.adUnit + ". Ignoring the banner impression in the adunit."),
                                        r;
                                    r.w = parseInt(a[0][0], 10),
                                    r.h = parseInt(a[0][1], 10),
                                    a = a.splice(1, a.length - 1)
                                }
                                0 < a.length && (i = [],
                                a.forEach(function(e) {
                                    1 < e.length && i.push({
                                        w: e[0],
                                        h: e[1]
                                    })
                                }),
                                0 < i.length && (r.format = i)),
                                r.pos = 0,
                                r.topframe = O.inIframe() ? 0 : 1
                            } else
                                O.logWarn(Y + "Error: mediaTypes.banner.size missing for adunit: " + e.params.adUnit + ". Ignoring the banner impression in the adunit."),
                                r = A;
                            return r
                        }(e)) !== A && (s.banner = r);
                        break;
                    case S.c:
                        n.request = JSON.stringify(function(e) {
                            var r, a, i, t = {
                                assets: []
                            };
                            for (var s in e) {
                                if (e.hasOwnProperty(s)) {
                                    var n = {};
                                    if (!(t.assets && 0 < t.assets.length && t.assets.hasOwnProperty(s)))
                                        switch (s) {
                                        case c.TITLE.KEY:
                                            e[s].len || e[s].length ? n = {
                                                id: c.TITLE.ID,
                                                required: e[s].required ? 1 : 0,
                                                title: {
                                                    len: e[s].len || e[s].length,
                                                    ext: e[s].ext
                                                }
                                            } : O.logWarn(Y + "Error: Title Length is required for native ad: " + JSON.stringify(e));
                                            break;
                                        case c.IMAGE.KEY:
                                            e[s].sizes && 0 < e[s].sizes.length ? n = {
                                                id: c.IMAGE.ID,
                                                required: e[s].required ? 1 : 0,
                                                img: {
                                                    type: l.IMAGE,
                                                    w: e[s].w || e[s].width || (e[s].sizes ? e[s].sizes[0] : A),
                                                    h: e[s].h || e[s].height || (e[s].sizes ? e[s].sizes[1] : A),
                                                    wmin: e[s].wmin || e[s].minimumWidth || (e[s].minsizes ? e[s].minsizes[0] : A),
                                                    hmin: e[s].hmin || e[s].minimumHeight || (e[s].minsizes ? e[s].minsizes[1] : A),
                                                    mimes: e[s].mimes,
                                                    ext: e[s].ext
                                                }
                                            } : O.logWarn(Y + "Error: Image sizes is required for native ad: " + JSON.stringify(e));
                                            break;
                                        case c.ICON.KEY:
                                            e[s].sizes && 0 < e[s].sizes.length ? n = {
                                                id: c.ICON.ID,
                                                required: e[s].required ? 1 : 0,
                                                img: {
                                                    type: l.ICON,
                                                    w: e[s].w || e[s].width || (e[s].sizes ? e[s].sizes[0] : A),
                                                    h: e[s].h || e[s].height || (e[s].sizes ? e[s].sizes[1] : A),
                                                    ext: e[s].ext
                                                }
                                            } : O.logWarn(Y + "Error: Icon sizes is required for native ad: " + JSON.stringify(e));
                                            break;
                                        case c.VIDEO.KEY:
                                            n = {
                                                id: c.VIDEO.ID,
                                                required: e[s].required ? 1 : 0,
                                                video: {
                                                    minduration: e[s].minduration,
                                                    maxduration: e[s].maxduration,
                                                    protocols: e[s].protocols,
                                                    mimes: e[s].mimes,
                                                    ext: e[s].ext
                                                }
                                            };
                                            break;
                                        case c.EXT.KEY:
                                            n = {
                                                id: c.EXT.ID,
                                                required: e[s].required ? 1 : 0
                                            };
                                            break;
                                        case c.LOGO.KEY:
                                            n = {
                                                id: c.LOGO.ID,
                                                required: e[s].required ? 1 : 0,
                                                img: {
                                                    type: l.LOGO,
                                                    w: e[s].w || e[s].width || (e[s].sizes ? e[s].sizes[0] : A),
                                                    h: e[s].h || e[s].height || (e[s].sizes ? e[s].sizes[1] : A),
                                                    ext: e[s].ext
                                                }
                                            };
                                            break;
                                        case c.SPONSOREDBY.KEY:
                                        case c.BODY.KEY:
                                        case c.RATING.KEY:
                                        case c.LIKES.KEY:
                                        case c.DOWNLOADS.KEY:
                                        case c.PRICE.KEY:
                                        case c.SALEPRICE.KEY:
                                        case c.PHONE.KEY:
                                        case c.ADDRESS.KEY:
                                        case c.DESC2.KEY:
                                        case c.DISPLAYURL.KEY:
                                        case c.CTA.KEY:
                                            r = h[s],
                                            a = e,
                                            i = r.KEY,
                                            n = {
                                                id: r.ID,
                                                required: a[i].required ? 1 : 0,
                                                data: {
                                                    type: r.TYPE,
                                                    len: a[i].len,
                                                    ext: a[i].ext
                                                }
                                            }
                                        }
                                }
                                n && n.id && (t.assets[t.assets.length] = n)
                            }
                            var o = m.length
                              , d = 0;
                            return m.forEach(function(e) {
                                for (var r = t.assets.length, a = 0; a < r; a++)
                                    if (e.id == t.assets[a].id) {
                                        d++;
                                        break
                                    }
                            }),
                            u = o != d,
                            t
                        }(e.nativeParams)),
                        u ? O.logWarn(Y + "Error: Error in Native adunit " + e.params.adUnit + ". Ignoring the adunit. Refer to http://prebid.org/dev-docs/show-native-ads.html for more details.") : s.native = n;
                        break;
                    case S.d:
                        (a = f(e)) !== A && (s.video = a)
                    }
            else
                r = {
                    pos: 0,
                    w: e.params.width,
                    h: e.params.height,
                    topframe: O.inIframe() ? 0 : 1
                },
                O.isArray(o) && 1 < o.length && ((o = o.splice(1, o.length - 1)).forEach(function(e) {
                    O.isArray(e) && 2 == e.length && p.push({
                        w: e[0],
                        h: e[1]
                    })
                }),
                r.format = p),
                s.banner = r;
            return function(i, t) {
                var s = -1;
                "function" != typeof t.getFloor || R.b.getConfig("pubmatic.disableFloors") || [S.b, S.d, S.c].forEach(function(e) {
                    var r, a;
                    i.hasOwnProperty(e) && ("object" !== D(r = t.getFloor({
                        currency: i.bidfloorcur,
                        mediaType: e,
                        size: "*"
                    })) || r.currency !== i.bidfloorcur || isNaN(parseInt(r.floor)) || (a = parseFloat(r.floor),
                    s = -1 == s ? a : Math.min(a, s)))
                });
                i.bidfloor && (s = Math.max(s, i.bidfloor));
                i.bidfloor = !isNaN(s) && 0 < s ? s : A
            }(s, e),
            s.hasOwnProperty(S.b) || s.hasOwnProperty(S.c) || s.hasOwnProperty(S.d) ? s : A
        }
        O._each(c, function(e) {
            g[e.ID] = e.KEY
        }),
        O._each(c, function(e) {
            h[e.KEY] = e
        });
        var b = {
            code: "pubmatic",
            gvlid: 76,
            supportedMediaTypes: [S.b, S.d, S.c],
            aliases: ["pubmatic2"],
            isBidRequestValid: function(e) {
                if (e && e.params) {
                    if (!O.isStr(e.params.publisherId))
                        return O.logWarn(Y + "Error: publisherId is mandatory and cannot be numeric. Call to OpenBid will not be sent for ad unit: " + JSON.stringify(e)),
                        !1;
                    if (e.params.hasOwnProperty("video")) {
                        if (!e.params.video.hasOwnProperty("mimes") || !O.isArray(e.params.video.mimes) || 0 === e.params.video.mimes.length)
                            return O.logWarn(Y + "Error: For video ads, mimes is mandatory and must specify atlease 1 mime value. Call to OpenBid will not be sent for ad unit:" + JSON.stringify(e)),
                            !1;
                        if (!e.hasOwnProperty("mediaTypes") || !e.mediaTypes.hasOwnProperty(S.d))
                            return O.logError("".concat(Y, ": mediaTypes or mediaTypes.video is not specified. Rejecting bid: "), e),
                            !1;
                        if (!e.mediaTypes[S.d].hasOwnProperty("context"))
                            return O.logError("".concat(Y, ": no context specified in bid. Rejecting bid: "), e),
                            !1;
                        if ("outstream" === e.mediaTypes[S.d].context && !O.isStr(e.params.outstreamAU))
                            return O.logError("".concat(Y, ': for "outstream" bids outstreamAU is required. Rejecting bid: '), e),
                            !1
                    }
                    return !0
                }
                return !1
            },
            buildRequests: function(e, r) {
                var a;
                r && r.refererInfo && (a = r.refererInfo);
                var i, t, s, n, o, d, p, c, l, m, u, g, h, f, b, y, v = {
                    pageURL: (i = a) && i.referer ? i.referer : window.location.href,
                    refURL: window.document.referrer
                }, E = (t = v,
                {
                    id: "" + (new Date).getTime(),
                    at: 1,
                    cur: [x],
                    imp: [],
                    site: {
                        page: t.pageURL,
                        ref: t.refURL,
                        publisher: {}
                    },
                    device: {
                        ua: navigator.userAgent,
                        js: 1,
                        dnt: "yes" == navigator.doNotTrack || "1" == navigator.doNotTrack || "1" == navigator.msDoNotTrack ? 1 : 0,
                        h: screen.height,
                        w: screen.width,
                        language: navigator.language
                    },
                    user: {},
                    ext: {}
                }), I = "", w = [], T = [];
                if (e.forEach(function(e) {
                    var r;
                    (s = O.deepClone(e)).params.adSlot = s.params.adSlot || "",
                    C(s),
                    s.params.hasOwnProperty("video") || s.hasOwnProperty("mediaTypes") && s.mediaTypes.hasOwnProperty(S.c) || 0 !== s.params.width || 0 !== s.params.height ? (v.pubId = v.pubId || s.params.publisherId,
                    (v = function(e, r) {
                        var a, i, t;
                        for (a in r.kadpageurl || (r.kadpageurl = r.pageURL),
                        N)
                            N.hasOwnProperty(a) && (i = e[a]) && ("object" === D(t = N[a]) && (i = t.f(i, r)),
                            O.isStr(i) ? r[a] = i : O.logWarn(Y + "Ignoring param : " + a + " with value : " + N[a] + ", expects string-value, found " + D(i)));
                        return r
                    }(s.params, v)).transactionId = s.transactionId,
                    "" === I ? I = s.params.currency || A : s.params.hasOwnProperty("currency") && I !== s.params.currency && O.logWarn(Y + "Currency specifier ignored. Only one currency permitted."),
                    s.params.currency = I,
                    s.params.hasOwnProperty("dctr") && O.isStr(s.params.dctr) && w.push(s.params.dctr),
                    s.params.hasOwnProperty("bcat") && O.isArray(s.params.bcat) && (T = T.concat(s.params.bcat)),
                    (r = U(s)) && E.imp.push(r)) : O.logWarn(Y + "Skipping the non-standard adslot: ", s.params.adSlot, JSON.stringify(s))
                }),
                0 != E.imp.length)
                    return E.site.publisher.id = v.pubId.trim(),
                    k = v.pubId.trim(),
                    E.ext.wrapper = {},
                    E.ext.wrapper.profile = parseInt(v.profId) || A,
                    E.ext.wrapper.version = parseInt(v.verId) || A,
                    E.ext.wrapper.wiid = v.wiid || A,
                    E.ext.wrapper.wv = "prebid_prebid_3.25.0",
                    E.ext.wrapper.transactionId = v.transactionId,
                    E.ext.wrapper.wp = "pbjs",
                    E.user.gender = v.gender ? v.gender.trim() : A,
                    E.user.geo = {},
                    E.user.geo.lat = z("lat", v.lat),
                    E.user.geo.lon = z("lon", v.lon),
                    E.user.yob = z("yob", v.yob),
                    E.device.geo = E.user.geo,
                    E.site.page = v.kadpageurl.trim() || E.site.page.trim(),
                    E.site.domain = (n = E.site.page,
                    (o = document.createElement("a")).href = n,
                    o.hostname),
                    "object" === D(R.b.getConfig("device")) && (E.device = P(E.device, R.b.getConfig("device"))),
                    O.deepSetValue(E, "source.tid", v.transactionId),
                    -1 !== window.location.href.indexOf("pubmaticTest=true") && (E.test = 1),
                    e[0].schain && O.deepSetValue(E, "source.ext.schain", e[0].schain),
                    r && r.gdprConsent && (O.deepSetValue(E, "user.ext.consent", r.gdprConsent.consentString),
                    O.deepSetValue(E, "regs.ext.gdpr", r.gdprConsent.gdprApplies ? 1 : 0)),
                    r && r.uspConsent && O.deepSetValue(E, "regs.ext.us_privacy", r.uspConsent),
                    !0 === R.b.getConfig("coppa") && O.deepSetValue(E, "regs.coppa", 1),
                    d = E,
                    c = e,
                    u = "",
                    0 < (p = w).length && (c[0].params.hasOwnProperty("dctr") ? (u = c[0].params.dctr,
                    O.isStr(u) && 0 < u.length ? (m = u.split("|"),
                    u = "",
                    m.forEach(function(e) {
                        u += 0 < e.length ? e.trim() + "|" : ""
                    }),
                    l = u.length,
                    "|" === u.substring(l, l - 1) && (u = u.substring(0, l - 1)),
                    d.site.ext = {
                        key_val: u.trim()
                    }) : O.logWarn(Y + "Ignoring param : dctr with value : " + u + ", expects string-value, found empty or non-string value"),
                    1 < p.length && O.logWarn(Y + "dctr value found in more than 1 adunits. Value from 1st adunit will be picked. Ignoring values from subsequent adunits")) : O.logWarn(Y + "dctr value not found in 1st adunit, ignoring values from subsequent adunits")),
                    g = E,
                    h = e,
                    f = O.deepAccess(h, "0.userIdAsEids"),
                    O.isArray(f) && 0 < f.length && O.deepSetValue(g, "user.eids", f),
                    b = E,
                    0 < (y = (y = T).filter(function(e) {
                        return "string" == typeof e || (O.logWarn(Y + "bcat: Each category should be a string, ignoring category: " + e),
                        !1)
                    }).map(function(e) {
                        return e.trim()
                    }).filter(function(e, r, a) {
                        return 3 < e.length ? a.indexOf(e) === r : void O.logWarn(Y + "bcat: Each category should have a value of a length of more than 3 characters, ignoring category: " + e)
                    })).length && (O.logWarn(Y + "bcat: Selected: ", y),
                    b.bcat = y),
                    "object" === D(R.b.getConfig("app")) && (E.app = R.b.getConfig("app"),
                    E.app.publisher = E.site.publisher,
                    E.app.ext = E.site.ext || A,
                    delete E.site),
                    {
                        method: "POST",
                        url: "https://hbopenbid.pubmatic.com/translator?source=prebid-client",
                        data: JSON.stringify(E),
                        bidderRequest: r
                    }
            },
            interpretResponse: function(e, i) {
                var r = []
                  , t = x
                  , a = JSON.parse(i.data)
                  , s = a.site && a.site.ref ? a.site.ref : "";
                try {
                    var n = JSON.parse(i.data);
                    n && n.imp && 0 < n.imp.length && n.imp.forEach(function(e) {
                        r.push({
                            requestId: e.id,
                            width: 0,
                            height: 0,
                            ttl: 300,
                            ad: "",
                            creativeId: 0,
                            netRevenue: !1,
                            cpm: 0,
                            currency: t,
                            referrer: s
                        })
                    }),
                    e.body && e.body.seatbid && O.isArray(e.body.seatbid) && (t = e.body.cur || t,
                    e.body.seatbid.forEach(function(e) {
                        e.bid && O.isArray(e.bid) && e.bid.forEach(function(a) {
                            r.forEach(function(r) {
                                r.requestId == a.impid && (r.requestId = a.impid,
                                r.cpm = (parseFloat(a.price) || 0).toFixed(2),
                                r.width = a.w,
                                r.height = a.h,
                                r.sspID = a.id || "",
                                r.creativeId = a.crid || a.id,
                                r.dealId = a.dealid,
                                r.currency = t,
                                r.netRevenue = !1,
                                r.ttl = 300,
                                r.referrer = s,
                                r.ad = a.adm,
                                r.pm_seat = e.seat || null,
                                r.pm_dspid = a.ext && a.ext.dspid ? a.ext.dspid : null,
                                n.imp && 0 < n.imp.length && n.imp.forEach(function(e) {
                                    if (a.impid === e.id)
                                        switch (!function(r, e) {
                                            var a = ""
                                              , i = new RegExp(/VAST\s+version/);
                                            if (0 <= r.indexOf('span class="PubAPIAd"'))
                                                e.mediaType = S.b;
                                            else if (i.test(r))
                                                e.mediaType = S.d;
                                            else
                                                try {
                                                    (a = JSON.parse(r.replace(/\\/g, ""))) && a.native && (e.mediaType = S.c)
                                                } catch (e) {
                                                    O.logWarn(Y + "Error: Cannot parse native reponse for ad response: " + r)
                                                }
                                        }(a.adm, r),
                                        r.mediaType) {
                                        case S.b:
                                            break;
                                        case S.d:
                                            r.width = a.hasOwnProperty("w") ? a.w : e.video.w,
                                            r.height = a.hasOwnProperty("h") ? a.h : e.video.h,
                                            r.vastXml = a.adm,
                                            function(e, r) {
                                                var a, i, t;
                                                if (r.bidderRequest && r.bidderRequest.bids) {
                                                    for (var s = 0; s < r.bidderRequest.bids.length; s++)
                                                        r.bidderRequest.bids[s].bidId === e.requestId && (a = r.bidderRequest.bids[s].params,
                                                        i = r.bidderRequest.bids[s].mediaTypes[S.d].context,
                                                        t = r.bidderRequest.bids[s].adUnitCode);
                                                    i && "outstream" === i && a && a.outstreamAU && t && (e.rendererCode = a.outstreamAU,
                                                    e.renderer = p.newRenderer(e.rendererCode, t))
                                                }
                                            }(r, i);
                                            break;
                                        case S.c:
                                            !function(e, r) {
                                                if (r.native = {},
                                                e.hasOwnProperty("adm")) {
                                                    var a = "";
                                                    try {
                                                        a = JSON.parse(e.adm.replace(/\\/g, ""))
                                                    } catch (e) {
                                                        return O.logWarn(Y + "Error: Cannot parse native reponse for ad response: " + r.adm)
                                                    }
                                                    if (a && a.native && a.native.assets && 0 < a.native.assets.length) {
                                                        r.mediaType = S.c;
                                                        for (var i = 0, t = a.native.assets.length; i < t; i++)
                                                            switch (a.native.assets[i].id) {
                                                            case c.TITLE.ID:
                                                                r.native.title = a.native.assets[i].title && a.native.assets[i].title.text;
                                                                break;
                                                            case c.IMAGE.ID:
                                                                r.native.image = {
                                                                    url: a.native.assets[i].img && a.native.assets[i].img.url,
                                                                    height: a.native.assets[i].img && a.native.assets[i].img.h,
                                                                    width: a.native.assets[i].img && a.native.assets[i].img.w
                                                                };
                                                                break;
                                                            case c.ICON.ID:
                                                                r.native.icon = {
                                                                    url: a.native.assets[i].img && a.native.assets[i].img.url,
                                                                    height: a.native.assets[i].img && a.native.assets[i].img.h,
                                                                    width: a.native.assets[i].img && a.native.assets[i].img.w
                                                                };
                                                                break;
                                                            case c.SPONSOREDBY.ID:
                                                            case c.BODY.ID:
                                                            case c.LIKES.ID:
                                                            case c.DOWNLOADS.ID:
                                                            case c.PRICE:
                                                            case c.SALEPRICE.ID:
                                                            case c.PHONE.ID:
                                                            case c.ADDRESS.ID:
                                                            case c.DESC2.ID:
                                                            case c.CTA.ID:
                                                            case c.RATING.ID:
                                                            case c.DISPLAYURL.ID:
                                                                r.native[g[a.native.assets[i].id]] = a.native.assets[i].data && a.native.assets[i].data.value
                                                            }
                                                        r.native.clickUrl = a.native.link && a.native.link.url,
                                                        r.native.clickTrackers = a.native.link && a.native.link.clicktrackers || [],
                                                        r.native.impressionTrackers = a.native.imptrackers || [],
                                                        r.native.jstracker = a.native.jstracker || [],
                                                        r.width || (r.width = 0),
                                                        r.height || (r.height = 0)
                                                    }
                                                }
                                            }(a, r)
                                        }
                                }),
                                a.ext && a.ext.deal_channel && (r.dealChannel = d[a.ext.deal_channel] || null),
                                r.meta = {},
                                a.ext && a.ext.dspid && (r.meta.networkId = a.ext.dspid),
                                a.ext && a.ext.advid && (r.meta.buyerId = a.ext.advid),
                                a.adomain && 0 < a.adomain.length && (r.meta.clickUrl = a.adomain[0]),
                                e.ext && e.ext.buyid && (r.adserverTargeting = {
                                    hb_buyid_pubmatic: e.ext.buyid
                                }))
                            })
                        })
                    }))
                } catch (e) {
                    O.logError(e)
                }
                return r
            },
            getUserSyncs: function(e, r, a, i) {
                var t = "" + k;
                return a && (t += "&gdpr=" + (a.gdprApplies ? 1 : 0),
                t += "&gdpr_consent=" + encodeURIComponent(a.consentString || "")),
                i && (t += "&us_privacy=" + encodeURIComponent(i)),
                !0 === R.b.getConfig("coppa") && (t += "&coppa=1"),
                e.iframeEnabled ? [{
                    type: "iframe",
                    url: "https://ads.pubmatic.com/AdServer/js/showad.js#PIX&kdntuid=1&p=" + t
                }] : [{
                    type: "image",
                    url: "https://image8.pubmatic.com/AdServer/ImgSync?p=" + t
                }]
            },
            transformBidParams: function(e) {
                return O.convertTypes({
                    publisherId: "string",
                    adSlot: "string"
                }, e)
            }
        };
        Object(i.registerBidder)(b)
    }
}, [627]);
owpbjsChunk([111], {
    683: function(e, r, t) {
        e.exports = t(684)
    },
    684: function(e, r, t) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        t.d(r, "FASTLANE_ENDPOINT", function() {
            return o
        }),
        t.d(r, "VIDEO_ENDPOINT", function() {
            return l
        }),
        t.d(r, "SYNC_ENDPOINT", function() {
            return a
        }),
        t.d(r, "spec", function() {
            return h
        }),
        r.hasVideoMediaType = c,
        r.masSizeOrdering = S,
        r.determineRubiconVideoSizeId = C,
        r.getPriceGranularity = j,
        r.hasValidVideoParams = k,
        r.hasValidSupplyChainParams = T,
        r.encodeParam = w,
        r.resetUserSync = function() {
            R = !1
        }
        ;
        var g = t(0)
          , i = t(1)
          , b = t(3)
          , u = t(2);
        function v(e, r) {
            return function(e) {
                if (Array.isArray(e))
                    return e
            }(e) || function(e, r) {
                if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
                    return;
                var t = []
                  , i = !0
                  , n = !1
                  , o = void 0;
                try {
                    for (var a, s = e[Symbol.iterator](); !(i = (a = s.next()).done) && (t.push(a.value),
                    !r || t.length !== r); i = !0)
                        ;
                } catch (e) {
                    n = !0,
                    o = e
                } finally {
                    try {
                        i || null == s.return || s.return()
                    } finally {
                        if (n)
                            throw o
                    }
                }
                return t
            }(e, r) || function(e, r) {
                if (!e)
                    return;
                if ("string" == typeof e)
                    return n(e, r);
                var t = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === t && e.constructor && (t = e.constructor.name);
                if ("Map" === t || "Set" === t)
                    return Array.from(e);
                if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                    return n(e, r)
            }(e, r) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function n(e, r) {
            (null == r || r > e.length) && (r = e.length);
            for (var t = 0, i = new Array(r); t < r; t++)
                i[t] = e[t];
            return i
        }
        function y() {
            return (y = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var i in t)
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
                }
                return e
            }
            ).apply(this, arguments)
        }
        function p(e, r, t) {
            return r in e ? Object.defineProperty(e, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[r] = t,
            e
        }
        function x(e) {
            return (x = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        var o = "https://fastlane.rubiconproject.com/a/api/fastlane.json"
          , l = "https://prebid-server.rubiconproject.com/openrtb2/auction"
          , a = "https://eus.rubiconproject.com/usync.html"
          , d = {
            FASTLANE: {
                id: "dt.id",
                keyv: "dt.keyv",
                pref: "dt.pref"
            },
            PREBID_SERVER: {
                id: "id",
                keyv: "keyv"
            }
        }
          , f = {
            1: "468x60",
            2: "728x90",
            5: "120x90",
            8: "120x600",
            9: "160x600",
            10: "300x600",
            13: "200x200",
            14: "250x250",
            15: "300x250",
            16: "336x280",
            17: "240x400",
            19: "300x100",
            31: "980x120",
            32: "250x360",
            33: "180x500",
            35: "980x150",
            37: "468x400",
            38: "930x180",
            39: "750x100",
            40: "750x200",
            41: "750x300",
            42: "2x4",
            43: "320x50",
            44: "300x50",
            48: "300x300",
            53: "1024x768",
            54: "300x1050",
            55: "970x90",
            57: "970x250",
            58: "1000x90",
            59: "320x80",
            60: "320x150",
            61: "1000x1000",
            64: "580x500",
            65: "640x480",
            66: "930x600",
            67: "320x480",
            68: "1800x1000",
            72: "320x320",
            73: "320x160",
            78: "980x240",
            79: "980x300",
            80: "980x400",
            83: "480x300",
            85: "300x120",
            90: "548x150",
            94: "970x310",
            95: "970x100",
            96: "970x210",
            101: "480x320",
            102: "768x1024",
            103: "480x280",
            105: "250x800",
            108: "320x240",
            113: "1000x300",
            117: "320x100",
            125: "800x250",
            126: "200x600",
            144: "980x600",
            145: "980x150",
            152: "1000x250",
            156: "640x320",
            159: "320x250",
            179: "250x600",
            195: "600x300",
            198: "640x360",
            199: "640x200",
            213: "1030x590",
            214: "980x360",
            221: "1x1",
            229: "320x180",
            230: "2000x1400",
            232: "580x400",
            234: "6x6",
            251: "2x2",
            256: "480x820",
            257: "400x600",
            258: "500x200",
            259: "998x200",
            264: "970x1000",
            265: "1920x1080",
            274: "1800x200",
            278: "320x500",
            282: "320x400",
            288: "640x380"
        };
        g._each(f, function(e, r) {
            return f[e] = r
        });
        var h = {
            code: "rubicon",
            aliases: ["rubicon2"],
            gvlid: 52,
            supportedMediaTypes: [u.b, u.d],
            isBidRequestValid: function(e) {
                if ("object" !== x(e.params))
                    return !1;
                for (var r = 0, t = ["accountId", "siteId", "zoneId"]; r < t.length; r++)
                    if (e.params[t[r]] = parseInt(e.params[t[r]]),
                    isNaN(e.params[t[r]]))
                        return g.logError("Rubicon: wrong format of accountId or siteId or zoneId."),
                        !1;
                var i = m(e, !0);
                return !!i && ("video" !== i || k(e))
            },
            buildRequests: function(e, u) {
                var n, r = e.filter(function(e) {
                    return "video" === m(e)
                }).map(function(e) {
                    e.startTime = (new Date).getTime();
                    var r, t, i = {
                        id: e.transactionId,
                        test: b.b.getConfig("debug") ? 1 : 0,
                        cur: ["USD"],
                        source: {
                            tid: e.transactionId
                        },
                        tmax: b.b.getConfig("TTL") || 1e3,
                        imp: [{
                            exp: 300,
                            id: e.adUnitCode,
                            secure: 1,
                            ext: p({}, e.bidder, e.params),
                            video: g.deepAccess(e, "mediaTypes.video") || {}
                        }],
                        ext: {
                            prebid: {
                                cache: {
                                    vastxml: {
                                        returnCreative: !1
                                    }
                                },
                                targeting: {
                                    includewinners: !0,
                                    includebidderkeys: !1,
                                    pricegranularity: j(b.b)
                                },
                                bidders: {
                                    rubicon: {
                                        integration: b.b.getConfig("rubicon.int_type") || "pbjs"
                                    }
                                }
                            }
                        }
                    };
                    "rubicon" !== e.bidder && (i.ext.prebid.aliases = p({}, e.bidder, "rubicon")),
                    t = "function" != typeof e.getFloor || b.b.getConfig("rubicon.disableFloors") ? parseFloat(g.deepAccess(e, "params.floor")) : "object" !== x(r = e.getFloor({
                        currency: "USD",
                        mediaType: "video",
                        size: A(e, "video")
                    })) || "USD" !== r.currency || isNaN(parseInt(r.floor)) ? void 0 : parseFloat(r.floor),
                    isNaN(t) || (i.imp[0].bidfloor = t),
                    i.imp[0].ext[e.bidder].video.size_id = C(e),
                    function(r, t, e) {
                        if (!r)
                            return;
                        "object" === x(b.b.getConfig("app")) ? r.app = b.b.getConfig("app") : r.site = {
                            page: I(t, e)
                        };
                        "object" === x(b.b.getConfig("device")) && (r.device = b.b.getConfig("device"));
                        t.params.video.language && ["site", "device"].forEach(function(e) {
                            r[e] && (r[e].content = y({
                                language: t.params.video.language
                            }, r[e].content))
                        })
                    }(i, e, u),
                    function(e, r) {
                        "object" === x(e.imp[0].video) && void 0 === e.imp[0].video.skip && (e.imp[0].video.skip = r.params.video.skip);
                        "object" === x(e.imp[0].video) && void 0 === e.imp[0].video.skipafter && (e.imp[0].video.skipafter = r.params.video.skipdelay);
                        "object" === x(e.imp[0].video) && void 0 === e.imp[0].video.pos && ("atf" === r.params.position ? e.imp[0].video.pos = 1 : "btf" === r.params.position && (e.imp[0].video.pos = 3));
                        var t = A(r, "video");
                        e.imp[0].video.w = t[0],
                        e.imp[0].video.h = t[1]
                    }(i, e);
                    var n, o = _(e, "PREBID_SERVER");
                    o && g.deepSetValue(i, "user.ext.digitrust", o),
                    u.gdprConsent && ("boolean" == typeof u.gdprConsent.gdprApplies && (n = u.gdprConsent.gdprApplies ? 1 : 0),
                    g.deepSetValue(i, "regs.ext.gdpr", n),
                    g.deepSetValue(i, "user.ext.consent", u.gdprConsent.consentString)),
                    u.uspConsent && g.deepSetValue(i, "regs.ext.us_privacy", u.uspConsent),
                    e.userId && "object" === x(e.userId) && (e.userId.tdid || e.userId.pubcid || e.userId.lipb || e.userId.idl_env) && (g.deepSetValue(i, "user.ext.eids", []),
                    e.userId.tdid && i.user.ext.eids.push({
                        source: "adserver.org",
                        uids: [{
                            id: e.userId.tdid,
                            ext: {
                                rtiPartner: "TDID"
                            }
                        }]
                    }),
                    e.userId.pubcid && i.user.ext.eids.push({
                        source: "pubcommon",
                        uids: [{
                            id: e.userId.pubcid
                        }]
                    }),
                    e.userId.lipb && e.userId.lipb.lipbid && (i.user.ext.eids.push({
                        source: "liveintent.com",
                        uids: [{
                            id: e.userId.lipb.lipbid
                        }]
                    }),
                    i.user.ext.tpid = {
                        source: "liveintent.com",
                        uid: e.userId.lipb.lipbid
                    },
                    Array.isArray(e.userId.lipb.segments) && e.userId.lipb.segments.length && g.deepSetValue(i, "rp.target.LIseg", e.userId.lipb.segments)),
                    e.userId.idl_env && i.user.ext.eids.push({
                        source: "liveramp.com",
                        uids: [{
                            id: e.userId.idl_env
                        }]
                    })),
                    !0 === b.b.getConfig("coppa") && g.deepSetValue(i, "regs.coppa", 1),
                    e.schain && T(e.schain) && g.deepSetValue(i, "source.ext.schain", e.schain);
                    var a, s = y({}, e.params.inventory, b.b.getConfig("fpd.context")), d = y({}, e.params.visitor, b.b.getConfig("fpd.user"));
                    g.isEmpty(s) && g.isEmpty(d) || (a = {
                        bidders: [u.bidderCode],
                        config: {
                            fpd: {}
                        }
                    },
                    g.isEmpty(s) || (a.config.fpd.site = s),
                    g.isEmpty(d) || (a.config.fpd.user = d),
                    g.deepSetValue(i, "ext.prebid.bidderconfig.0", a));
                    var c = g.deepAccess(e, "fpd.context.pbAdSlot");
                    return "string" == typeof c && c && g.deepSetValue(i.imp[0].ext, "context.data.adslot", c),
                    e.storedAuctionResponse && g.deepSetValue(i.imp[0], "ext.prebid.storedauctionresponse.id", e.storedAuctionResponse.toString()),
                    g.deepSetValue(i.imp[0], "ext.prebid.auctiontimestamp", u.auctionStart),
                    {
                        method: "POST",
                        url: l,
                        data: i,
                        bidRequest: e
                    }
                });
                return !0 !== b.b.getConfig("rubicon.singleRequest") ? r.concat(e.filter(function(e) {
                    return "banner" === m(e)
                }).map(function(e) {
                    var i = h.createSlotParams(e, u);
                    return {
                        method: "GET",
                        url: o,
                        data: h.getOrderedParams(i).reduce(function(e, r) {
                            var t = i[r];
                            return g.isStr(t) && "" !== t || g.isNumber(t) ? "".concat(e).concat(w(r, t), "&") : e
                        }, "") + "slots=1&rand=".concat(Math.random()),
                        bidRequest: e
                    }
                })) : (n = e.filter(function(e) {
                    return "banner" === m(e)
                }).reduce(function(e, r) {
                    return (e[r.params.siteId] = e[r.params.siteId] || []).push(r),
                    e
                }, {}),
                r.concat(Object.keys(n).reduce(function(r, e) {
                    var t, i;
                    return t = n[e],
                    i = 10,
                    t.map(function(e, r) {
                        return r % i == 0 ? t.slice(r, r + i) : null
                    }).filter(function(e) {
                        return e
                    }).forEach(function(e) {
                        var i = h.combineSlotUrlParams(e.map(function(e) {
                            return h.createSlotParams(e, u)
                        }));
                        r.push({
                            method: "GET",
                            url: o,
                            data: h.getOrderedParams(i).reduce(function(e, r) {
                                var t = i[r];
                                return g.isStr(t) && "" !== t || g.isNumber(t) ? "".concat(e).concat(w(r, t), "&") : e
                            }, "") + "slots=".concat(e.length, "&rand=").concat(Math.random()),
                            bidRequest: e
                        })
                    }),
                    r
                }, [])))
            },
            getOrderedParams: function(e) {
                var r = /^tg_v/
                  , t = /^tg_i/
                  , i = ["account_id", "site_id", "zone_id", "size_id", "alt_size_ids", "p_pos", "gdpr", "gdpr_consent", "us_privacy", "rp_schain", "tpid_tdid", "tpid_liveintent.com", "tg_v.LIseg", "dt.id", "dt.keyv", "dt.pref", "rf", "p_geo.latitude", "p_geo.longitude", "kw"].concat(Object.keys(e).filter(function(e) {
                    return r.test(e)
                })).concat(Object.keys(e).filter(function(e) {
                    return t.test(e)
                })).concat(["tk_flint", "x_source.tid", "x_source.pchain", "p_screen_res", "rp_floor", "rp_secure", "tk_user_key"]);
                return i.concat(Object.keys(e).filter(function(e) {
                    return -1 === i.indexOf(e)
                }))
            },
            combineSlotUrlParams: function(n) {
                if (1 === n.length)
                    return n[0];
                var i = n.reduce(function(r, t, i) {
                    return Object.keys(t).forEach(function(e) {
                        r.hasOwnProperty(e) || (r[e] = new Array(n.length)),
                        r[e].splice(i, 1, t[e])
                    }),
                    r
                }, {})
                  , o = new RegExp("^([^;]*)(;\\1)+$");
                return Object.keys(i).forEach(function(e) {
                    var r = i[e].join(";")
                      , t = r.match(o);
                    i[e] = t ? t[1] : r
                }),
                i
            },
            createSlotParams: function(e, r) {
                e.startTime = (new Date).getTime();
                var t, i = e.params, n = A(e, "banner"), o = v(i.latLong || [], 2), a = o[0], s = o[1], d = b.b.getConfig("rubicon.int_type"), c = {
                    account_id: i.accountId,
                    site_id: i.siteId,
                    zone_id: i.zoneId,
                    size_id: n[0],
                    alt_size_ids: n.slice(1).join(",") || void 0,
                    rp_floor: .01 < (i.floor = parseFloat(i.floor)) ? i.floor : .01,
                    rp_secure: "1",
                    tk_flint: "".concat(d || "pbjs_lite", "_v3.25.0"),
                    "x_source.tid": e.transactionId,
                    "x_source.pchain": i.pchain,
                    p_screen_res: [window.screen.width, window.screen.height].join("x"),
                    tk_user_key: i.userId,
                    "p_geo.latitude": isNaN(parseFloat(a)) ? void 0 : parseFloat(a).toFixed(4),
                    "p_geo.longitude": isNaN(parseFloat(s)) ? void 0 : parseFloat(s).toFixed(4),
                    "tg_fl.eid": e.code,
                    rf: I(e, r)
                };
                "function" != typeof e.getFloor || b.b.getConfig("rubicon.disableFloors") || (t = e.getFloor({
                    currency: "USD",
                    mediaType: "banner",
                    size: "*"
                }),
                c.rp_hard_floor = "object" !== x(t) || "USD" !== t.currency || isNaN(parseInt(t.floor)) ? void 0 : t.floor),
                c.p_pos = "atf" === i.position || "btf" === i.position ? i.position : "",
                e.userId && (e.userId.tdid && (c.tpid_tdid = e.userId.tdid),
                e.userId.lipb && e.userId.lipb.lipbid && (c["tpid_liveintent.com"] = e.userId.lipb.lipbid,
                Array.isArray(e.userId.lipb.segments) && e.userId.lipb.segments.length && (c["tg_v.LIseg"] = e.userId.lipb.segments.join(","))),
                e.userId.idl_env && (c["tpid_liveramp.com"] = e.userId.idl_env)),
                r.gdprConsent && ("boolean" == typeof r.gdprConsent.gdprApplies && (c.gdpr = Number(r.gdprConsent.gdprApplies)),
                c.gdpr_consent = r.gdprConsent.consentString),
                r.uspConsent && (c.us_privacy = encodeURIComponent(r.uspConsent));
                var u = y({}, i.visitor, b.b.getConfig("fpd.user"));
                Object.keys(u).forEach(function(e) {
                    null != u[e] && "keywords" !== e && (c["tg_v.".concat(e)] = "object" !== x(u[e]) || Array.isArray(u[e]) ? u[e].toString() : JSON.stringify(u[e]))
                });
                var p = y({}, i.inventory, b.b.getConfig("fpd.context"));
                Object.keys(p).forEach(function(e) {
                    null != p[e] && "keywords" !== e && (c["tg_i.".concat(e)] = "object" !== x(p[e]) || Array.isArray(p[e]) ? p[e].toString() : JSON.stringify(p[e]))
                });
                var l = (i.keywords || []).concat(g.deepAccess(b.b.getConfig("fpd.user"), "keywords") || [], g.deepAccess(b.b.getConfig("fpd.context"), "keywords") || []);
                c.kw = Array.isArray(l) && l.length ? l.join(",") : "";
                var f = g.deepAccess(e, "fpd.context.pbAdSlot");
                "string" == typeof f && f && (c["tg_i.dfp_ad_unit_code"] = f.replace(/^\/+/, ""));
                var m = _(e, "FASTLANE");
                return y(c, m),
                !0 === b.b.getConfig("coppa") && (c.coppa = 1),
                e.schain && T(e.schain) && (c.rp_schain = h.serializeSupplyChain(e.schain)),
                c
            },
            serializeSupplyChain: function(e) {
                if (!T(e))
                    return "";
                var r = e.ver
                  , t = e.complete
                  , i = e.nodes;
                return "".concat(r, ",").concat(t, "!").concat(h.serializeSupplyChainNodes(i))
            },
            serializeSupplyChainNodes: function(e) {
                var t = ["asi", "sid", "hp", "rid", "name", "domain"];
                return e.map(function(r) {
                    return t.map(function(e) {
                        return encodeURIComponent(r[e] || "")
                    }).join(",")
                }).join("!")
            },
            interpretResponse: function(d, e) {
                var c = e.bidRequest;
                if (!(d = d.body) || "object" !== x(d))
                    return [];
                if (d.seatbid) {
                    var r = g.deepAccess(d, "ext.errors.rubicon");
                    Array.isArray(r) && 0 < r.length && g.logWarn("Rubicon: Error in video response");
                    var o = [];
                    return d.seatbid.forEach(function(n) {
                        (n.bid || []).forEach(function(e) {
                            var r = {
                                requestId: c.bidId,
                                currency: d.cur || "USD",
                                creativeId: e.crid,
                                cpm: e.price || 0,
                                bidderCode: n.seat,
                                ttl: 300,
                                netRevenue: !1 !== b.b.getConfig("rubicon.netRevenue"),
                                width: e.w || g.deepAccess(c, "mediaTypes.video.w") || g.deepAccess(c, "params.video.playerWidth"),
                                height: e.h || g.deepAccess(c, "mediaTypes.video.h") || g.deepAccess(c, "params.video.playerHeight")
                            };
                            e.id && (r.seatBidId = e.id),
                            e.dealid && (r.dealId = e.dealid);
                            var t, i = g.deepAccess(d, "ext.responsetimemillis.rubicon");
                            c && i && (c.serverResponseTimeMs = i),
                            g.deepAccess(e, "ext.prebid.type") === u.d ? (r.mediaType = u.d,
                            (t = g.deepAccess(e, "ext.prebid.targeting")) && "object" === x(t) && (r.adserverTargeting = t),
                            e.ext.prebid.cache && "object" === x(e.ext.prebid.cache.vastXml) && e.ext.prebid.cache.vastXml.cacheId && e.ext.prebid.cache.vastXml.url ? (r.videoCacheKey = e.ext.prebid.cache.vastXml.cacheId,
                            r.vastUrl = e.ext.prebid.cache.vastXml.url) : t && t.hb_uuid && t.hb_cache_host && t.hb_cache_path && (r.videoCacheKey = t.hb_uuid,
                            r.vastUrl = "https://".concat(t.hb_cache_host).concat(t.hb_cache_path, "?uuid=").concat(t.hb_uuid)),
                            e.adm && (r.vastXml = e.adm),
                            e.nurl && (r.vastUrl = e.nurl),
                            !r.vastUrl && e.nurl && (r.vastUrl = e.nurl)) : g.logWarn("Rubicon: video response received non-video media type"),
                            o.push(r)
                        })
                    }),
                    o
                }
                var t = d.ads;
                return "object" !== x(c) || Array.isArray(c) || "video" !== m(c) || "object" !== x(t) || (t = t[c.adUnitCode]),
                !Array.isArray(t) || t.length < 1 ? [] : t.reduce(function(e, r, t) {
                    if ("ok" !== r.status)
                        return e;
                    var i, n, o, a, s = Array.isArray(c) ? c[t] : c;
                    return s && "object" === x(s) ? (i = {
                        requestId: s.bidId,
                        currency: "USD",
                        creativeId: r.creative_id || "".concat(r.network || "", "-").concat(r.advertiser || ""),
                        cpm: r.cpm || 0,
                        dealId: r.deal,
                        ttl: 300,
                        netRevenue: !1 !== b.b.getConfig("rubicon.netRevenue"),
                        rubicon: {
                            advertiserId: r.advertiser,
                            networkId: r.network
                        },
                        meta: {
                            advertiserId: r.advertiser,
                            networkId: r.network
                        }
                    },
                    r.creative_type && (i.mediaType = r.creative_type),
                    r.creative_type === u.d ? (i.width = s.params.video.playerWidth,
                    i.height = s.params.video.playerHeight,
                    i.vastUrl = r.creative_depot_url,
                    i.impression_id = r.impression_id,
                    i.videoCacheKey = r.impression_id) : (i.ad = (o = r.script,
                    a = r.impression_id,
                    "<html>\n<head><script type='text/javascript'>inDapIF=true;<\/script></head>\n<body style='margin : 0; padding: 0;'>\n\x3c!-- Rubicon Project Ad Tag --\x3e\n<div data-rp-impression-id='".concat(a, "'>\n<script type='text/javascript'>").concat(o, "<\/script>\n</div>\n</body>\n</html>")),
                    n = v(f[r.size_id].split("x").map(function(e) {
                        return Number(e)
                    }), 2),
                    i.width = n[0],
                    i.height = n[1]),
                    i.rubiconTargeting = (Array.isArray(r.targeting) ? r.targeting : []).reduce(function(e, r) {
                        return e[r.key] = r.values[0],
                        e
                    }, {
                        rpfl_elemid: s.adUnitCode
                    }),
                    e.push(i)) : g.logError("Rubicon: bidRequest undefined at index position:".concat(t), c, d),
                    e
                }, []).sort(function(e, r) {
                    return (r.cpm || 0) - (e.cpm || 0)
                })
            },
            getUserSyncs: function(e, r, t, i) {
                if (!R && e.iframeEnabled) {
                    var n = "";
                    return t && "string" == typeof t.consentString && ("boolean" == typeof t.gdprApplies ? n += "?gdpr=".concat(Number(t.gdprApplies), "&gdpr_consent=").concat(t.consentString) : n += "?gdpr_consent=".concat(t.consentString)),
                    i && (n += "".concat(n ? "&" : "?", "us_privacy=").concat(encodeURIComponent(i))),
                    R = !0,
                    {
                        type: "iframe",
                        url: a + n
                    }
                }
            },
            transformBidParams: function(e) {
                return g.convertTypes({
                    accountId: "number",
                    siteId: "number",
                    zoneId: "number"
                }, e)
            }
        };
        function _(e, r) {
            var t, i = 0 < arguments.length && void 0 !== e ? e : {}, n = 1 < arguments.length ? r : void 0;
            if (!n || !d[n])
                return null;
            var o = d[n];
            var a = function() {
                var e = g.deepAccess(i, "userId.digitrustid.data");
                if (e)
                    return e;
                var r = window.DigiTrust && (b.b.getConfig("digiTrustId") || window.DigiTrust.getUser({
                    member: "T9QSFKPDN9"
                }));
                return r && r.success && r.identity || null
            }();
            if (!a || a.privacy && a.privacy.optout)
                return null;
            var s = (p(t = {}, o.id, a.id),
            p(t, o.keyv, a.keyv),
            t);
            return o.pref && (s[o.pref] = 0),
            s
        }
        function I(e, r) {
            var t = b.b.getConfig("pageUrl")
              , t = e.params.referrer ? e.params.referrer : t || r.refererInfo.referer;
            return e.params.secure ? t.replace(/^http:/i, "https:") : t
        }
        function A(e, r) {
            var t = e.params;
            if ("video" === r) {
                var i = [];
                return t.video && t.video.playerWidth && t.video.playerHeight ? i = [t.video.playerWidth, t.video.playerHeight] : Array.isArray(g.deepAccess(e, "mediaTypes.video.playerSize")) && 1 === e.mediaTypes.video.playerSize.length ? i = e.mediaTypes.video.playerSize[0] : Array.isArray(e.sizes) && 0 < e.sizes.length && Array.isArray(e.sizes[0]) && 1 < e.sizes[0].length && (i = e.sizes[0]),
                i
            }
            var n = [];
            return Array.isArray(t.sizes) ? n = t.sizes : void 0 !== g.deepAccess(e, "mediaTypes.banner.sizes") ? n = s(e.mediaTypes.banner.sizes) : Array.isArray(e.sizes) && 0 < e.sizes.length ? n = s(e.sizes) : g.logWarn("Rubicon: no sizes are setup or found"),
            S(n)
        }
        function s(e) {
            return g.parseSizesInput(e).reduce(function(e, r) {
                var t = parseInt(f[r], 10);
                return t && e.push(t),
                e
            }, [])
        }
        function c(e) {
            return "object" === x(g.deepAccess(e, "params.video")) && void 0 !== g.deepAccess(e, "mediaTypes.".concat(u.d))
        }
        function m(e, r) {
            var t = 1 < arguments.length && void 0 !== r && r;
            return c(e) ? -1 === ["outstream", "instream"].indexOf(g.deepAccess(e, "mediaTypes.".concat(u.d, ".context"))) ? void (t && g.logError("Rubicon: mediaTypes.video.context must be outstream or instream")) : A(e, "video").length < 2 ? void (t && g.logError("Rubicon: could not determine the playerSize of the video")) : (t && g.logMessage("Rubicon: making video request for adUnit", e.adUnitCode),
            "video") : 0 === A(e, "banner").length ? void (t && g.logError("Rubicon: could not determine the sizes for banner request")) : (t && g.logMessage("Rubicon: making banner request for adUnit", e.adUnitCode),
            "banner")
        }
        function S(e) {
            var n = [15, 2, 9];
            return e.sort(function(e, r) {
                var t = n.indexOf(e)
                  , i = n.indexOf(r);
                return -1 < t || -1 < i ? -1 === t ? 1 : -1 === i ? -1 : t - i : e - r
            })
        }
        function C(e) {
            var r = parseInt(g.deepAccess(e, "params.video.size_id"));
            return isNaN(r) ? "outstream" === g.deepAccess(e, "mediaTypes.".concat(u.d, ".context")) ? 203 : 201 : r
        }
        function j(e) {
            return {
                ranges: {
                    low: [{
                        max: 5,
                        increment: .5
                    }],
                    medium: [{
                        max: 20,
                        increment: .1
                    }],
                    high: [{
                        max: 20,
                        increment: .01
                    }],
                    auto: [{
                        max: 5,
                        increment: .05
                    }, {
                        min: 5,
                        max: 10,
                        increment: .1
                    }, {
                        min: 10,
                        max: 20,
                        increment: .5
                    }],
                    dense: [{
                        max: 3,
                        increment: .01
                    }, {
                        min: 3,
                        max: 8,
                        increment: .05
                    }, {
                        min: 8,
                        max: 20,
                        increment: .5
                    }],
                    custom: e.getConfig("customPriceBucket") && e.getConfig("customPriceBucket").buckets
                }[e.getConfig("priceGranularity")]
            }
        }
        function k(r) {
            var t = !0
              , e = Object.prototype.toString.call([])
              , i = Object.prototype.toString.call(0)
              , n = {
                mimes: e,
                protocols: e,
                maxduration: i,
                linearity: i,
                api: e
            };
            return Object.keys(n).forEach(function(e) {
                Object.prototype.toString.call(g.deepAccess(r, "mediaTypes.video." + e)) !== n[e] && (t = !1,
                g.logError("Rubicon: mediaTypes.video." + e + " is required and must be of type: " + n[e]))
            }),
            t
        }
        function T(e) {
            var r = !1
              , t = ["asi", "sid", "hp"];
            return e.nodes && ((r = e.nodes.reduce(function(e, r) {
                return e ? t.every(function(e) {
                    return r[e]
                }) : e
            }, !0)) || g.logError("Rubicon: required schain params missing")),
            r
        }
        function w(e, r) {
            return "rp_schain" === e ? "rp_schain=".concat(r) : "".concat(e, "=").concat(encodeURIComponent(r))
        }
        var R = !1;
        Object(i.registerBidder)(h)
    }
}, [683]);
owpbjsChunk([77], {
    769: function(r, e, t) {
        r.exports = t(770)
    },
    770: function(r, e, t) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        }),
        t.d(e, "tripleliftAdapterSpec", function() {
            return f
        });
        var n = t(2)
          , i = t(1)
          , u = t(0)
          , o = t(3);
        function p(r) {
            return (p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
                return typeof r
            }
            : function(r) {
                return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
            }
            )(r)
        }
        function c(r) {
            return function(r) {
                if (Array.isArray(r))
                    return a(r)
            }(r) || function(r) {
                if ("undefined" != typeof Symbol && Symbol.iterator in Object(r))
                    return Array.from(r)
            }(r) || function(r, e) {
                if (!r)
                    return;
                if ("string" == typeof r)
                    return a(r, e);
                var t = Object.prototype.toString.call(r).slice(8, -1);
                "Object" === t && r.constructor && (t = r.constructor.name);
                if ("Map" === t || "Set" === t)
                    return Array.from(r);
                if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                    return a(r, e)
            }(r) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function a(r, e) {
            (null == e || e > r.length) && (e = r.length);
            for (var t = 0, n = new Array(e); t < e; t++)
                n[t] = r[t];
            return n
        }
        var d = !0
          , s = null
          , f = {
            code: "triplelift",
            supportedMediaTypes: [n.b],
            isBidRequestValid: function(r) {
                return void 0 !== r.params.inventoryCode
            },
            buildRequests: function(r, e) {
                var t, n = "https://tlx.3lift.com/header/auction?", i = function(r) {
                    var e = {}
                      , t = r[0].schain;
                    e.imp = r.map(function(r, e) {
                        return {
                            id: e,
                            tagid: r.params.inventoryCode,
                            floor: function(r) {
                                var e = null;
                                {
                                    var t;
                                    "function" == typeof r.getFloor && ("object" !== p(t = r.getFloor({
                                        currency: "USD",
                                        mediaType: "banner",
                                        size: y(r.sizes)
                                    })) || "USD" !== t.currency || isNaN(parseFloat(t.floor)) || (e = parseFloat(t.floor)))
                                }
                                return null !== e ? e : r.params.floor
                            }(r),
                            banner: {
                                format: y(r.sizes)
                            }
                        }
                    });
                    var n = [].concat(c(function(r) {
                        return l(r, "tdid", "adserver.org", "TDID")
                    }(r)), c(function(r) {
                        return l(r, "idl_env", "liveramp.com", "idl")
                    }(r)), c(function(r) {
                        return l(r, "criteoId", "criteo.com", "criteoId")
                    }(r)));
                    0 < n.length && (e.user = {
                        ext: {
                            eids: n
                        }
                    });
                    t && (e.ext = {
                        schain: t
                    });
                    return e
                }(r);
                return n = u.tryAppendQueryString(n, "lib", "prebid"),
                n = u.tryAppendQueryString(n, "v", "3.25.0"),
                e && e.refererInfo && (t = e.refererInfo.referer,
                n = u.tryAppendQueryString(n, "referrer", t)),
                e && e.timeout && (n = u.tryAppendQueryString(n, "tmax", e.timeout)),
                e && e.gdprConsent && (void 0 !== e.gdprConsent.gdprApplies && (d = e.gdprConsent.gdprApplies,
                n = u.tryAppendQueryString(n, "gdpr", d.toString())),
                void 0 !== e.gdprConsent.consentString && (s = e.gdprConsent.consentString,
                n = u.tryAppendQueryString(n, "cmp_cs", s))),
                e && e.uspConsent && (n = u.tryAppendQueryString(n, "us_privacy", e.uspConsent)),
                !0 === o.b.getConfig("coppa") && (n = u.tryAppendQueryString(n, "coppa", !0)),
                n.lastIndexOf("&") === n.length - 1 && (n = n.substring(0, n.length - 1)),
                u.logMessage("tlCall request built: " + n),
                {
                    method: "POST",
                    url: n,
                    data: i,
                    bidderRequest: e
                }
            },
            interpretResponse: function(r, e) {
                var t = e.bidderRequest;
                return (r.body.bids || []).map(function(r) {
                    return function(r, e) {
                        var t = {}
                          , n = e.width || 1
                          , i = e.height || 1
                          , o = e.deal_id || ""
                          , u = e.crid || "";
                        0 != e.cpm && e.ad && (t = {
                            requestId: r.bids[e.imp_id].bidId,
                            cpm: e.cpm,
                            width: n,
                            height: i,
                            netRevenue: !0,
                            ad: e.ad,
                            creativeId: u,
                            dealId: o,
                            currency: "USD",
                            ttl: 300,
                            tl_source: e.tl_source
                        });
                        return t
                    }(t, r)
                })
            },
            getUserSyncs: function(r, e, t, n) {
                var i = function(r) {
                    if (!r)
                        return;
                    if (r.iframeEnabled)
                        return "iframe";
                    if (r.pixelEnabled)
                        return "image"
                }(r);
                if (i) {
                    var o = "https://eb2.3lift.com/sync?";
                    return "image" === i && (o = u.tryAppendQueryString(o, "px", 1),
                    o = u.tryAppendQueryString(o, "src", "prebid")),
                    null !== s && (o = u.tryAppendQueryString(o, "gdpr", d),
                    o = u.tryAppendQueryString(o, "cmp_cs", s)),
                    n && (o = u.tryAppendQueryString(o, "us_privacy", n)),
                    [{
                        type: i,
                        url: o
                    }]
                }
            }
        };
        function l(r, e, t, n) {
            return r.map((u = e,
            function(r) {
                return r && r.userId && r.userId[u]
            }
            )).filter(function(r) {
                return !!r
            }).map((i = t,
            o = n,
            function(r) {
                return {
                    source: i,
                    uids: [{
                        id: r,
                        ext: {
                            rtiPartner: o
                        }
                    }]
                }
            }
            ));
            var i, o, u
        }
        function y(r) {
            return r.filter(m).map(function(r) {
                return {
                    w: r[0],
                    h: r[1]
                }
            })
        }
        function m(r) {
            return 2 === r.length && "number" == typeof r[0] && "number" == typeof r[1]
        }
        Object(i.registerBidder)(f)
    }
}, [769]);
owpbjs.processQueue();
!(function(e) {
    function t(i) {
        if (o[i])
            return o[i].exports;
        var r = o[i] = {
            exports: {},
            id: i,
            loaded: !1
        };
        return e[i].call(r.exports, r, r.exports, t),
        r.loaded = !0,
        r.exports
    }
    var o = {};
    return t.m = e,
    t.c = o,
    t.p = "",
    t(0)
}
)([(function(e, t, o) {
    var i = o(1)
      , r = o(10)
      , n = o(6)
      , d = o(4)
      , s = i.getMetaInfo(window);
    window.PWT = window.PWT || {},
    window.PWT.bidMap = window.PWT.bidMap || {},
    window.PWT.bidIdMap = window.PWT.bidIdMap || {},
    window.PWT.isIframe = window.PWT.isIframe || s.isInIframe,
    window.PWT.protocol = window.PWT.protocol || s.protocol,
    window.PWT.secure = window.PWT.secure || s.secure,
    window.PWT.pageURL = window.PWT.pageURL || s.pageURL,
    window.PWT.refURL = window.PWT.refURL || s.refURL,
    window.PWT.isSafeFrame = window.PWT.isSafeFrame || !1,
    window.PWT.safeFrameMessageListenerAdded = window.PWT.safeFrameMessageListenerAdded || !1,
    window.PWT.udpv = window.PWT.udpv || i.findQueryParamInURL(s.isIframe ? s.refURL : s.pageURL, "pwtv"),
    i.findQueryParamInURL(s.isIframe ? s.refURL : s.pageURL, "pwtc") && i.enableDebugLog(),
    i.findQueryParamInURL(s.isIframe ? s.refURL : s.pageURL, "pwtvc") && i.enableVisualDebugLog(),
    window.PWT.displayCreative = function(e, t) {
        i.log("In displayCreative for: " + t),
        n.displayCreative(e, t)
    }
    ,
    window.PWT.displayPMPCreative = function(e, t, o) {
        i.log("In displayPMPCreative for: " + t);
        var r = i.getBididForPMP(t, o);
        r && n.displayCreative(e, r)
    }
    ,
    window.PWT.sfDisplayCreative = function(e, t) {
        i.log("In sfDisplayCreative for: " + t),
        this.isSafeFrame = !0,
        window.parent.postMessage(JSON.stringify({
            pwt_type: "1",
            pwt_bidID: t,
            pwt_origin: d.COMMON.PROTOCOL + window.location.hostname
        }), "*")
    }
    ,
    window.PWT.sfDisplayPMPCreative = function(e, t, o) {
        i.log("In sfDisplayPMPCreative for: " + t),
        this.isSafeFrame = !0,
        window.parent.postMessage(JSON.stringify({
            pwt_type: "1",
            pwt_bidID: i.getBididForPMP(t, o),
            pwt_origin: d.COMMON.PROTOCOL + window.location.hostname
        }), "*")
    }
    ,
    window.PWT.initNativeTrackers = function(e, t) {
        i.log("In startTrackers for: " + t),
        i.addEventListenerForClass(window, "click", d.COMMON.OW_CLICK_NATIVE, n.loadTrackers),
        n.executeTracker(t)
    }
    ,
    window.PWT.getUserIds = function() {
        return i.getUserIds()
    }
    ,
    window.OWT = {
        notifyCount: 0,
        externalBidderStatuses: {}
    },
    window.OWT.registerExternalBidders = function(e) {
        return window.OWT.notifyCount++,
        i.forEachOnArray(e, (function(e, t) {
            i.log("registerExternalBidders: " + t),
            window.OWT.externalBidderStatuses[t] = {
                id: window.OWT.notifyCount,
                status: !1
            }
        }
        )),
        window.OWT.notifyCount
    }
    ,
    window.OWT.notifyExternalBiddingComplete = function(e) {
        i.forEachOnObject(window.OWT.externalBidderStatuses, (function(t, o) {
            o && o.id === e && (i.log("notify externalBidding complete: " + t),
            window.OWT.externalBidderStatuses[t] = {
                id: o.id,
                status: !0
            })
        }
        ))
    }
    ,
    window.PWT.UpdateVastWithTracker = function(e, t) {
        return i.UpdateVastWithTracker(e, t)
    }
    ,
    window.PWT.generateDFPURL = function(e, t) {
        var o = "";
        if (e && i.isObject(e) || i.logError("An AdUnit should be an Object", e),
        !(e.bidData && e.bidData.wb && e.bidData.kvp))
            return i.logWarning("No bid found for given adUnit"),
            void 0;
        e.bid = e.bidData.wb,
        e.bid.adserverTargeting = e.bidData.kvp;
        var r = {
            adUnit: e,
            params: {
                iu: e.adUnitId,
                cust_params: t,
                output: "vast"
            }
        };
        return e.bid && (r.bid = e.bid),
        o = window.owpbjs.adServers.dfp.buildVideoUrl(r)
    }
    ,
    window.PWT.getCustomParamsForDFPVideo = function(e, t) {
        return i.getCustomParamsForDFPVideo(e, t)
    }
    ,
    r.init(window)
}
), (function(e, t, o) {
    function i(e, t) {
        return u.call(e) === "[object " + t + "]"
    }
    function r(e, t, o, i, r, n, _, p, c, m) {
        var l = o[d.CONFIG.KEY_LOOKUP_MAP] || o[d.CONFIG.REGEX_KEY_LOOKUP_MAP] || null
          , x = m.indexOf(d.MACROS.WIDTH) >= 0 && m.indexOf(d.MACROS.HEIGHT) >= 0
          , u = o[d.CONFIG.REGEX_KEY_LOOKUP_MAP] ? !0 : !1
          , g = void 0;
        I.forEachOnArray(n, (function(n, m) {
            var b = null
              , f = !1
              , h = _.getSizes();
            if (null == l)
                f = !0;
            else {
                if (u) {
                    I.debugLogIsEnabled && I.log(console.time("Time for regexMatching for key " + m));
                    var w = I.getConfigFromRegex(l, m);
                    I.debugLogIsEnabled && I.log(console.timeEnd("Time for regexMatching for key " + m)),
                    w && (b = w.config,
                    g = w.regexPattern)
                } else
                    b = l[m];
                b ? I.checkMandatoryParams(b, r, e) ? f = !0 : I.log(e + ": " + m + d.MESSAGES.M9) : I.log(e + ": " + m + d.MESSAGES.M8)
            }
            if (f) {
                if (1 == c) {
                    var E = s.createBid(e, m);
                    E.setDefaultBidStatus(1).setReceivedTime(I.getCurrentTimestampInMs()),
                    a.setBidFromBidder(_.getDivID(), E),
                    E.setRegexPattern(g)
                }
                p(e, t, o, i, m, x, _, I.getPartnerParams(b), h[n][0], h[n][1], g)
            }
        }
        ))
    }
    var n = o(2)
      , d = o(4)
      , s = o(5)
      , a = o(6)
      , _ = !1;
    t.debugLogIsEnabled = _;
    var p = !1;
    t.visualDebugLogIsEnabled = p;
    var c = "Array"
      , m = "String"
      , l = "Function"
      , x = "Number"
      , u = Object.prototype.toString
      , I = this;
    I.idsAppendedToAdUnits = !1;
    var g = {};
    t.mediaTypeConfig = g,
    t.isA = i,
    t.isFunction = function(e) {
        return I.isA(e, l)
    }
    ,
    t.isString = function(e) {
        return I.isA(e, m)
    }
    ,
    t.isArray = function(e) {
        return I.isA(e, c)
    }
    ,
    t.isNumber = function(e) {
        return I.isA(e, x)
    }
    ,
    t.isObject = function(e) {
        return "object" == typeof e && null !== e
    }
    ,
    t.isOwnProperty = function(e, t) {
        return I.isObject(e) && e.hasOwnProperty ? e.hasOwnProperty(t) : !1
    }
    ,
    t.isUndefined = function(e) {
        return "undefined" == typeof e
    }
    ,
    t.enableDebugLog = function() {
        I.debugLogIsEnabled = !0
    }
    ,
    t.isDebugLogEnabled = function() {
        return I.debugLogIsEnabled
    }
    ,
    t.enableVisualDebugLog = function() {
        I.debugLogIsEnabled = !0,
        I.visualDebugLogIsEnabled = !0
    }
    ,
    t.isEmptyObject = function(e) {
        return I.isObject(e) && 0 === Object.keys(e).length
    }
    ;
    var b = "[OpenWrap] : "
      , f = "[OpenWrap] : [Error]";
    t.log = function(e) {
        I.debugLogIsEnabled && console && this.isFunction(console.log) && (this.isString(e) ? console.log((new Date).getTime() + " : " + b + e) : console.log(e))
    }
    ,
    t.logError = function(e) {
        I.debugLogIsEnabled && console && this.isFunction(console.log) && (this.isString(e) ? console.error((new Date).getTime() + " : " + b + e) : console.error(e))
    }
    ,
    t.logWarning = function(e) {
        I.debugLogIsEnabled && console && this.isFunction(console.log) && (this.isString(e) ? console.warn((new Date).getTime() + " : " + b + e) : console.warn(e))
    }
    ,
    t.error = function(e) {
        console.log((new Date).getTime() + " : " + f, e)
    }
    ,
    t.getCurrentTimestampInMs = function() {
        var e = new window.Date;
        return e.getTime()
    }
    ,
    t.getCurrentTimestamp = function() {
        var e = new Date;
        return Math.round(e.getTime() / 1e3)
    }
    ;
    var h = (function() {
        var e = 0;
        return function() {
            return e++,
            e
        }
    }
    )();
    t.utilGetIncrementalInteger = h,
    t.getUniqueIdentifierStr = function() {
        return h() + window.Math.random().toString(16).substr(2)
    }
    ,
    t.copyKeyValueObject = function(e, t) {
        if (I.isObject(e) && I.isObject(t)) {
            var o = I;
            I.forEachOnObject(t, (function(i, r) {
                if (t[i] = o.isArray(r) ? r : [r],
                o.isOwnProperty(e, i)) {
                    if (!I.isArray(e[i])) {
                        var n = e[i];
                        e[i] = [n]
                    }
                    e[i].push(r)
                } else
                    e[i] = [r]
            }
            ))
        }
    }
    ,
    t.getIncrementalInteger = (function() {
        var e = 0;
        return function() {
            return e++,
            e
        }
    }
    )(),
    t.generateUUID = function() {
        var e = (new window.Date).getTime()
          , t = window.decodeURIComponent(this.pageURL).toLowerCase().replace(/[^a-z,A-Z,0-9]/gi, "")
          , o = t.length
          , i = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-zzzzz".replace(/[xyz]/g, (function(i) {
            var r = (e + 16 * Math.random()) % 16 | 0;
            e = Math.floor(e / 16);
            var n;
            switch (i) {
            case "x":
                n = r;
                break;
            case "z":
                n = t[Math.floor(Math.random() * o)];
                break;
            default:
                n = 3 & r | 8
            }
            return n.toString(16)
        }
        ));
        return i
    }
    ;
    var w = "g"
      , E = new RegExp(d.MACROS.WIDTH,w)
      , y = new RegExp(d.MACROS.HEIGHT,w)
      , T = new RegExp(d.MACROS.AD_UNIT_ID,w)
      , D = new RegExp(d.MACROS.AD_UNIT_INDEX,w)
      , P = new RegExp(d.MACROS.INTEGER,w)
      , v = new RegExp(d.MACROS.DIV,w);
    t.generateSlotNamesFromPattern = function(e, t, o) {
        var i, r, n, d, s = [], a = {};
        if (I.isObject(e) && I.isFunction(e.getSizes) && (r = e.getSizes(),
        n = r.length,
        n > 0))
            for (d = 0; n > d; d++)
                if (2 == r[d].length && r[d][0] && r[d][1] || I.isFunction(r[d].getWidth) && I.isFunction(r[d].getHeight)) {
                    var _ = I.isFunction(e.getAdUnitID) ? e.getAdUnitID() : e.getSlotId().getAdUnitPath()
                      , p = I.isFunction(e.getDivID) ? e.getDivID() : e.getSlotId().getDomId()
                      , c = I.isFunction(e.getAdUnitIndex) ? e.getAdUnitIndex() : e.getSlotId().getId().split("_")[1]
                      , m = r[d][0] || r[d].getWidth()
                      , l = r[d][1] || r[d].getHeight();
                    if (i = t,
                    i = i.replace(T, _).replace(D, c).replace(P, I.getIncrementalInteger()).replace(v, p),
                    o) {
                        var x = I.mediaTypeConfig[p];
                        i = x && x.video ? i.replace(E, "0").replace(y, "0") : i.replace(E, m).replace(y, l)
                    } else
                        i = i.replace(E, m).replace(y, l);
                    I.isOwnProperty(a, i) || (a[i] = "",
                    s.push(i))
                }
        return s
    }
    ,
    t.checkMandatoryParams = function(e, t, o) {
        var i = !1
          , r = !0;
        if (!e || !I.isObject(e) || I.isArray(e))
            return I.logWarning(o + "provided object is invalid."),
            i;
        if (!I.isArray(t))
            return I.logWarning(o + "provided keys must be in an array."),
            i;
        var n = t.length;
        if (0 == n)
            return r;
        for (var d = 0; n > d; d++)
            if (!I.isOwnProperty(e, t[d]))
                return I.logError(o + ": " + t[d] + ", mandatory parameter not present."),
                i;
        return r
    }
    ,
    t.forEachGeneratedKey = function(e, t, o, i, r, n, s, a) {
        var _ = n.length
          , p = o[d.CONFIG.KEY_GENERATION_PATTERN] || o[d.CONFIG.REGEX_KEY_GENERATION_PATTERN] || "";
        _ > 0 && p.length > 3 && I.forEachOnArray(n, (function(n, d) {
            var _ = I.generateSlotNamesFromPattern(d, p, !0);
            _.length > 0 && I.callHandlerFunctionForMapping(e, t, o, i, r, _, d, s, a, p)
        }
        ))
    }
    ,
    t.callHandlerFunctionForMapping = r,
    t.resizeWindow = function(e, t, o, i) {
        if (o && t)
            try {
                var r = e.defaultView.frameElement
                  , n = [];
                if (i) {
                    var d = document.getElementById(i)
                      , s = d.querySelector("div");
                    n.push(s),
                    n.push(s.querySelector("iframe")),
                    r = d.querySelector("iframe")
                }
                n.push(r),
                n.forEach((function(e) {
                    e && (e.width = "" + t,
                    e.height = "" + o,
                    e.style.width = "" + t + "px",
                    e.style.height = "" + o + "px")
                }
                ))
            } catch (a) {
                I.logError("Creative-Resize; Error in resizing creative")
            }
    }
    ,
    t.writeIframe = function(e, t, o, i, r) {
        e.write('<iframe frameborder="0" allowtransparency="true" marginheight="0" marginwidth="0" scrolling="no" width="' + o + '" hspace="0" vspace="0" height="' + i + '"' + (r ? ' style="' + r + '"' : "") + ' src="' + t + '"></iframe>')
    }
    ,
    t.displayCreative = function(e, t) {
        t && t.pbbid && "video" == t.pbbid.mediaType && t.renderer && I.isObject(t.renderer) ? I.isFunction(t.renderer.render) && t.renderer.render(t.getPbBid()) : (I.resizeWindow(e, t.width, t.height),
        t.adHtml ? ("appier" == t.getAdapterID().toLowerCase() && (t.adHtml = I.replaceAuctionPrice(t.adHtml, t.getGrossEcpm())),
        e.write(t.adHtml)) : t.adUrl ? ("appier" == t.getAdapterID().toLowerCase() && (t.adUrl = I.replaceAuctionPrice(t.adUrl, t.getGrossEcpm())),
        I.writeIframe(e, t.adUrl, t.width, t.height, "")) : (I.logError("creative details are not found"),
        I.logError(t)))
    }
    ,
    t.getScreenWidth = function(e) {
        var t = -1;
        return e.innerHeight ? t = e.innerWidth : e.document && e.document.documentElement && e.document.documentElement.clientWidth ? t = e.document.documentElement.clientWidth : e.document.body && (t = e.document.body.clientWidth),
        t
    }
    ,
    t.getScreenHeight = function(e) {
        var t = -1;
        return e.innerHeight ? t = e.innerHeight : e.document && e.document.documentElement && e.document.documentElement.clientHeight ? t = e.document.documentElement.clientHeight : e.document.body && (t = e.document.body.clientHeight),
        t
    }
    ,
    t.forEachOnObject = function(e, t) {
        if (I.isObject(e) && I.isFunction(t))
            for (var o in e)
                I.isOwnProperty(e, o) && t(o, e[o])
    }
    ,
    t.forEachOnArray = function(e, t) {
        if (I.isArray(e) && I.isFunction(t))
            for (var o = 0, i = e.length; i > o; o++)
                t(o, e[o])
    }
    ,
    t.trim = function(e) {
        return I.isString(e) ? e.replace(/^\s+/g, "").replace(/\s+$/g, "") : e
    }
    ,
    t.getTopFrameOfSameDomain = function(e) {
        try {
            if (e.parent.document != e.document)
                return I.getTopFrameOfSameDomain(e.parent)
        } catch (t) {}
        return e
    }
    ,
    t.metaInfo = {},
    t.getMetaInfo = function(e) {
        var t, o = {}, i = 512;
        o.pageURL = "",
        o.refURL = "",
        o.protocol = "https://",
        o.secure = 1,
        o.isInIframe = I.isIframe(e);
        try {
            t = I.getTopFrameOfSameDomain(e),
            o.refURL = (t.refurl || t.document.referrer || "").substr(0, i),
            o.pageURL = (t !== window.top && "" != t.document.referrer ? t.document.referrer : t.location.href).substr(0, i),
            o.protocol = (function(e) {
                return "http:" === e.location.protocol ? (o.secure = 0,
                "http://") : (o.secure = 1,
                "https://")
            }
            )(t)
        } catch (r) {}
        return o.pageDomain = I.getDomainFromURL(o.pageURL),
        I.metaInfo = o,
        o
    }
    ,
    t.isIframe = function(e) {
        try {
            return e.self !== e.top
        } catch (t) {
            return !1
        }
    }
    ,
    t.findInString = function(e, t) {
        return e.indexOf(t) >= 0
    }
    ,
    t.findQueryParamInURL = function(e, t) {
        return I.isOwnProperty(I.parseQueryParams(e), t)
    }
    ,
    t.parseQueryParams = function(e) {
        var t = I.createDocElement(window, "a");
        t.href = e;
        var o = {};
        if (t.search) {
            var i = t.search.replace("?", "");
            i = i.split("&"),
            I.forEachOnArray(i, (function(e, t) {
                var t = t.split("=")
                  , i = t[0] || ""
                  , r = t[1] || "";
                o[i] = r
            }
            ))
        }
        return o
    }
    ,
    t.createDocElement = function(e, t) {
        return e.document.createElement(t)
    }
    ,
    t.addHookOnFunction = function(e, t, o, i) {
        var r = e;
        if (e = t ? e.__proto__ : e,
        I.isObject(e) && I.isFunction(e[o])) {
            var n = e[o];
            e[o] = i(r, n)
        } else
            I.logWarning("in assignNewDefination: oldReference is not a function")
    }
    ,
    t.getBididForPMP = function(e, t) {
        e = e.split(",");
        var o = e.length
          , i = t.length
          , r = ""
          , n = "";
        if (0 == o)
            return this.log("Error: Unable to find bidID as values array is empty."),
            void 0;
        for (var s = 0; i > s; s++) {
            for (var a = 0; o > a; a++)
                if (e[a].indexOf(t[s]) >= 0) {
                    r = e[a];
                    break
                }
            if ("" != r)
                break
        }
        "" == r ? (r = e[0],
        this.log("No PMP-Deal was found matching PriorityArray, So Selecting first PMP-Deal: " + r)) : this.log("Selecting PMP-Deal: " + r);
        var _ = r.split(d.COMMON.DEAL_KEY_VALUE_SEPARATOR);
        return 3 == _.length && (n = _[2]),
        n ? n : (this.log("Error: bidID not found in PMP-Deal: " + r),
        void 0)
    }
    ,
    t.createInvisibleIframe = function() {
        var e = I.createDocElement(window, "iframe");
        return e.id = I.getUniqueIdentifierStr(),
        e.height = 0,
        e.width = 0,
        e.border = "0px",
        e.hspace = "0",
        e.vspace = "0",
        e.marginWidth = "0",
        e.marginHeight = "0",
        e.style.border = "0",
        e.scrolling = "no",
        e.frameBorder = "0",
        e.src = "about:self",
        e.style = "display:none",
        e
    }
    ,
    t.addMessageEventListener = function(e, t) {
        return "function" != typeof t ? (I.log("EventHandler should be a function"),
        !1) : (e.addEventListener ? e.addEventListener("message", t, !1) : e.attachEvent("onmessage", t),
        !0)
    }
    ,
    t.safeFrameCommunicationProtocol = function(e) {
        try {
            if (msgData = window.JSON.parse(e.data),
            !msgData.pwt_type)
                return;
            switch (window.parseInt(msgData.pwt_type)) {
            case 1:
                if (window.PWT.isSafeFrame)
                    return;
                var t = a.getBidById(msgData.pwt_bidID);
                if (t) {
                    var o = t.bid
                      , i = o.getAdapterID()
                      , r = t.slotid
                      , n = {
                        pwt_type: 2,
                        pwt_bid: o
                    };
                    I.vLogInfo(r, {
                        type: "disp",
                        adapter: i
                    }),
                    a.executeMonetizationPixel(r, o),
                    o && o.pbbid && "video" == o.pbbid.mediaType && o.renderer && I.isObject(o.renderer) ? I.isFunction(o.renderer.render) && o.renderer.render(o.getPbBid()) : (I.resizeWindow(window.document, o.width, o.height, r),
                    e.source.postMessage(window.JSON.stringify(n), msgData.pwt_origin))
                }
                break;
            case 2:
                if (!window.PWT.isSafeFrame)
                    return;
                if (msgData.pwt_bid) {
                    var o = msgData.pwt_bid;
                    if (o.adHtml)
                        try {
                            var d = I.createInvisibleIframe(window.document);
                            if (!d)
                                throw {
                                    message: "Failed to create invisible frame.",
                                    name: ""
                                };
                            if (d.setAttribute("width", o.width),
                            d.setAttribute("height", o.height),
                            d.style = "",
                            window.document.body.appendChild(d),
                            !d.contentWindow)
                                throw {
                                    message: "Unable to access frame window.",
                                    name: ""
                                };
                            var s = d.contentWindow.document;
                            if (!s)
                                throw {
                                    message: "Unable to access frame window document.",
                                    name: ""
                                };
                            var _ = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><script>inDapIF=true;</script></head>';
                            _ += "<body>",
                            _ += "<script>var $sf = window.parent.$sf;</script>",
                            _ += "<script>setInterval(function(){try{var fr = window.document.defaultView.frameElement;fr.width = window.parent.document.defaultView.innerWidth;fr.height = window.parent.document.defaultView.innerHeight;}catch(e){}}, 200);</script>",
                            _ += o.adHtml,
                            _ += "</body></html>",
                            s.write(_),
                            s.close()
                        } catch (p) {
                            I.logError("Error in rendering creative in safe frame."),
                            I.log(p),
                            I.log("Rendering synchronously."),
                            I.displayCreative(window.document, msgData.pwt_bid)
                        }
                    else
                        o.adUrl ? I.writeIframe(window.document, o.adUrl, o.width, o.height, "") : (I.logWarning("creative details are not found"),
                        I.log(o))
                }
                break;
            case 3:
                var t = a.getBidById(msgData.pwt_bidID);
                if (t) {
                    var o = t.bid
                      , i = o.getAdapterID()
                      , r = t.slotid;
                    I.vLogInfo(r, {
                        type: "disp",
                        adapter: i
                    }),
                    msgData.pwt_action && "imptrackers" == msgData.pwt_action && a.executeMonetizationPixel(r, o),
                    a.fireTracker(o, msgData.pwt_action)
                }
            }
        } catch (p) {}
    }
    ,
    t.addMessageEventListenerForSafeFrame = function(e) {
        I.addMessageEventListener(e, I.safeFrameCommunicationProtocol)
    }
    ,
    t.getElementLocation = function(e) {
        var t, o = 0, i = 0;
        if (I.isFunction(e.getBoundingClientRect))
            t = e.getBoundingClientRect(),
            o = Math.floor(t.left),
            i = Math.floor(t.top);
        else
            for (; e; )
                o += e.offsetLeft,
                i += e.offsetTop,
                e = e.offsetParent;
        return {
            x: o,
            y: i
        }
    }
    ,
    t.createVLogInfoPanel = function(e, t) {
        var o, i, r, n = window.document;
        if (I.visualDebugLogIsEnabled && (o = n.getElementById(e),
        o && t.length && t[0][0] && t[0][1] && (r = e + "-pwtc-info",
        !I.isUndefined(n.getElementById(r))))) {
            var d = I.getElementLocation(o);
            i = n.createElement("div"),
            i.id = r,
            i.style = "position: absolute; /*top: " + d.y + "px;*/ left: " + d.x + "px; width: " + t[0][0] + "px; height: " + t[0][1] + "px; border: 1px solid rgb(255, 204, 52); padding-left: 11px; background: rgb(247, 248, 224) none repeat scroll 0% 0%; overflow: auto; z-index: 9999997; visibility: hidden;opacity:0.9;font-size:13px;font-family:monospace;";
            var s = n.createElement("img");
            s.src = I.metaInfo.protocol + "ads.pubmatic.com/AdServer/js/pwt/close.png",
            s.style = "cursor:pointer; position: absolute; top: 2px; left: " + (d.x + t[0][0] - 16 - 15) + "px; z-index: 9999998;",
            s.title = "close",
            s.onclick = function() {
                i.style.display = "none"
            }
            ,
            i.appendChild(s),
            i.appendChild(n.createElement("br"));
            for (var a = "Slot: " + e + " | ", _ = 0; _ < t.length; _++)
                a += (0 != _ ? ", " : "") + t[_][0] + "x" + t[_][1];
            i.appendChild(n.createTextNode(a)),
            i.appendChild(n.createElement("br")),
            o.parentNode.insertBefore(i, o)
        }
    }
    ,
    t.realignVLogInfoPanel = function(e) {
        var t, o, i, r = window.document;
        if (I.visualDebugLogIsEnabled && (t = r.getElementById(e),
        t && (i = e + "-pwtc-info",
        o = r.getElementById(i)))) {
            var n = I.getElementLocation(t);
            o.style.visibility = "visible",
            o.style.left = n.x + "px",
            o.style.height = t.clientHeight + "px"
        }
    }
    ,
    t.vLogInfo = function(e, t) {
        var o, i, r = window.document;
        if (I.visualDebugLogIsEnabled) {
            var n = e + "-pwtc-info";
            if (o = r.getElementById(n)) {
                switch (t.type) {
                case "bid":
                    var d = t.latency
                      , s = t.bidDetails
                      , a = "";
                    0 > d && (d = 0),
                    a = t.hasOwnProperty("adServerCurrency") && void 0 !== t.adServerCurrency ? 0 == t.adServerCurrency ? "USD" : t.adServerCurrency : "USD",
                    i = "Bid: " + t.bidder + (t.s2s ? "(s2s)" : "") + ": " + s.getNetEcpm() + "(" + s.getGrossEcpm() + ")" + a + " :" + d + "ms",
                    s.getPostTimeoutStatus() && (i += ": POST-TIMEOUT");
                    break;
                case "win-bid":
                    var s = t.bidDetails
                      , a = "";
                    a = t.hasOwnProperty("adServerCurrency") && void 0 !== t.adServerCurrency ? 0 == t.adServerCurrency ? "USD" : t.adServerCurrency : "USD",
                    i = "Winning Bid: " + s.getAdapterID() + ": " + s.getNetEcpm() + a;
                    break;
                case "win-bid-fail":
                    i = "There are no bids from PWT";
                    break;
                case "hr":
                    i = "----------------------";
                    break;
                case "disp":
                    i = "Displaying creative from " + t.adapter
                }
                o.appendChild(r.createTextNode(i)),
                o.appendChild(r.createElement("br"))
            }
        }
    }
    ,
    t.getExternalBidderStatus = function(e) {
        var t = !0;
        return I.forEachOnArray(e, (function(e, o) {
            t = window.OWT.externalBidderStatuses[o] ? t && window.OWT.externalBidderStatuses[o].status : t
        }
        )),
        t
    }
    ,
    t.resetExternalBidderStatus = function(e) {
        I.forEachOnArray(e, (function(e, t) {
            I.log("resetExternalBidderStatus: " + t),
            window.OWT.externalBidderStatuses[t] = void 0
        }
        ))
    }
    ,
    t.ajaxRequest = function(e, t, o, i) {
        try {
            i = i || {};
            var r, n = 4, d = !0, s = i.method || (o ? "POST" : "GET");
            if (window.XMLHttpRequest ? (r = new window.XMLHttpRequest,
            I.isUndefined(r.responseType) && (d = !1)) : d = !1,
            !d)
                return I.log("Ajax is not supported"),
                void 0;
            r.onreadystatechange = function() {
                r.readyState === n && t && t(r.responseText, r)
            }
            ,
            r.open(s, e),
            i.withCredentials && (r.withCredentials = !0),
            i.preflight && r.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
            r.setRequestHeader("Content-Type", i.contentType || "text/plain"),
            r.send("POST" === s && o)
        } catch (a) {
            I.log("Failed in Ajax"),
            I.log(a)
        }
    }
    ,
    t.getAdUnitConfig = function(e, t) {
        var o = {}
          , i = {}
          , r = n.getSlotConfiguration();
        if (r)
            if (r.configPattern && "" != r.configPattern.trim() || (r.configPattern = "_AU_")) {
                var s = r.configPattern
                  , a = !0
                  , _ = !0
                  , p = !0
                  , c = void 0
                  , m = I.isFunction(t.getDivID) ? t.getDivID() : t.getSlotId().getDomId()
                  , l = I.generateSlotNamesFromPattern(t, s, !1)[0];
                if (I.isOwnProperty(r.config, d.COMMON.DEFAULT) && (r.config[d.COMMON.DEFAULT].banner && I.isOwnProperty(r.config[d.COMMON.DEFAULT].banner, "enabled") && !r.config[d.COMMON.DEFAULT].banner.enabled && (p = !1),
                r.config[d.COMMON.DEFAULT].native && I.isOwnProperty(r.config[d.COMMON.DEFAULT].native, "enabled") && !r.config[d.COMMON.DEFAULT].native.enabled && (_ = !1),
                r.config[d.COMMON.DEFAULT].video && I.isOwnProperty(r.config[d.COMMON.DEFAULT].video, "enabled") && !r.config[d.COMMON.DEFAULT].video.enabled && (a = !1),
                c = r.config[d.COMMON.DEFAULT],
                c.renderer && !I.isEmptyObject(c.renderer) && (o.renderer = c.renderer)),
                I.isOwnProperty(r.config, l) ? (c = r.config[l],
                I.log("Config" + JSON.stringify(c) + " found for adSlot: " + JSON.stringify(t))) : I.log("Considering Default Config for " + JSON.stringify(t)),
                c) {
                    if (_ && c.native && (!I.isOwnProperty(c.native, "enabled") || c.native.enabled) && (c.native.config ? i["native"] = c.native.config : I.logWarning("Native Config will not be considered as no config has been provided for slot" + JSON.stringify(t) + " or there is no configuration defined in default.")),
                    a && c.video && (!I.isOwnProperty(c.video, "enabled") || c.video.enabled) && (n.getAdServer() != d.AD_SERVER.DFP ? c.video.config ? (i.video = c.video.config,
                    c.video.partnerConfig && (i.partnerConfig = c.video.partnerConfig)) : I.logWarning("Video Config will not be considered as no config has been provided for slot" + JSON.stringify(t) + " or there is no configuration defined in default.") : I.logWarning("Video Config will not be considered with DFP selected as AdServer.")),
                    c.renderer && !I.isEmptyObject(c.renderer) && (o.renderer = c.renderer),
                    !p || c.banner && I.isOwnProperty(c.banner, "enabled") && !c.banner.enabled)
                        return I.mediaTypeConfig[m] = i,
                        o.mediaTypeObject = i,
                        o
                } else
                    I.log("Config not found for adSlot: " + JSON.stringify(t))
            } else
                I.logWarning("Slot Type not found in config. Please provide slotType in configuration");
        return i.banner = {
            sizes: e
        },
        I.mediaTypeConfig[m] = i,
        o.mediaTypeObject = i,
        o
    }
    ,
    t.addEventListenerForClass = function(e, t, o, i) {
        if ("function" != typeof i)
            return I.log("EventHandler should be a function"),
            !1;
        var r = I.findElementsByClass(e, o);
        e.addEventListener || (t = "on" + t);
        for (var n = 0; n < r.length; n++)
            r[n].addEventListener(t, i, !0);
        return !0
    }
    ,
    t.findElementsByClass = function(e, t) {
        return e.document.getElementsByClassName(t) || []
    }
    ,
    t.getBidFromEvent = function(e) {
        return e && e.target && e.target.attributes && e.target.attributes[d.COMMON.BID_ID] && e.target.attributes[d.COMMON.BID_ID].value || ""
    }
    ,
    t.getAdFormatFromBidAd = function(e) {
        var t = void 0;
        if (e && I.isString(e))
            try {
                var o = new RegExp(/VAST\s+version/);
                if (o.test(e))
                    t = d.FORMAT_VALUES.VIDEO;
                else {
                    var i = JSON.parse(e.replace(/\\/g, ""));
                    i && i.native && (t = d.FORMAT_VALUES.NATIVE)
                }
            } catch (r) {
                t = d.FORMAT_VALUES.BANNER
            }
        return t
    }
    ,
    t.handleHook = function(e, t) {
        I.isFunction(window.PWT[e]) && (I.log("For Hook-name: " + e + ", calling window.PWT." + e + "function."),
        window.PWT[e].apply(window.PWT, t))
    }
    ,
    t.getCurrencyToDisplay = function() {
        var e = n.getAdServerCurrency();
        if (0 == e && (e = "USD"),
        n.getAdServerCurrency() && window[d.COMMON.PREBID_NAMESPACE] && I.isFunction(window[d.COMMON.PREBID_NAMESPACE].getConfig)) {
            var t = window[d.COMMON.PREBID_NAMESPACE].getConfig();
            if (t && t.currency && t.currency.adServerCurrency)
                return t.currency.adServerCurrency
        }
        return e
    }
    ,
    t.getConfigFromRegex = function(e, t) {
        for (var o = null, i = t.split("@"), r = 0; r < e.length; r++) {
            var n = e[r]
              , s = n.rx;
            if (3 == i.length)
                try {
                    if (i[0].match(new RegExp(s.AU)) && i[1].match(new RegExp(s.DIV)) && i[2].match(new RegExp(s.SIZE))) {
                        o = {
                            config: n.rx_config,
                            regexPattern: s.AU + "@" + s.DIV + "@" + s.SIZE
                        };
                        break
                    }
                } catch (a) {
                    I.logError(d.MESSAGES.M27 + JSON.stringify(s))
                }
            else
                I.logWarning(d.MESSAGES.M28 + t)
        }
        return o
    }
    ,
    t.getUserIdConfiguration = function() {
        var e = [];
        return I.forEachOnObject(n.getIdentityPartners(), (function(t, o) {
            e.push(I.getUserIdParams(o))
        }
        )),
        I.log(d.MESSAGES.IDENTITY.M4 + JSON.stringify(e)),
        e
    }
    ,
    t.clearPreviousTargeting = function() {
        var e = window.googletag.pubads().getTargetingKeys();
        e.indexOf(d.WRAPPER_TARGETING_KEYS.USER_IDS) > -1 && window.googletag.pubads().clearTargeting(d.WRAPPER_TARGETING_KEYS.USER_IDS)
    }
    ,
    t.setUserIdTargeting = function() {
        if (I.clearPreviousTargeting(),
        !window[d.COMMON.PREBID_NAMESPACE] || !I.isFunction(window[d.COMMON.PREBID_NAMESPACE].getUserIds))
            return I.logWarning(d.MESSAGES.IDENTITY.M1),
            void 0;
        var e = I.getUserIds();
        I.isEmptyObject(e) || I.setUserIdToGPT(e)
    }
    ,
    t.setUserIdToGPT = function(e) {
        I.log(d.MESSAGES.IDENTITY.M2, e),
        window.googletag.pubads().setTargeting(d.WRAPPER_TARGETING_KEYS.USER_IDS, JSON.stringify(e))
    }
    ,
    t.getUserIds = function() {
        return I.isFunction(window[d.COMMON.PREBID_NAMESPACE].getUserIds) ? window[d.COMMON.PREBID_NAMESPACE].getUserIds() : (I.logWarning("getUserIds" + d.MESSAGES.IDENTITY.M6),
        void 0)
    }
    ,
    t.getUserIdsAsEids = function() {
        return I.isFunction(window[d.COMMON.PREBID_NAMESPACE].getUserIdsAsEids) ? window[d.COMMON.PREBID_NAMESPACE].getUserIdsAsEids() : (I.logWarning("getUserIdsAsEids" + d.MESSAGES.IDENTITY.M6),
        void 0)
    }
    ,
    t.getNestedObjectFromArray = function(e, t, o) {
        for (var i = e, r = i, n = 0; n < t.length - 1; n++)
            r[t[n]] || (r[t[n]] = {}),
            r = r[t[n]];
        return r[t[t.length - 1]] = o,
        i
    }
    ,
    t.getNestedObjectFromString = function(e, t, o, i) {
        var r = o.split(t);
        return 1 == r.length ? e[o] = i : e = I.getNestedObjectFromArray(e, r, i),
        e
    }
    ,
    t.getUserIdParams = function(e) {
        var t = {};
        for (var o in e)
            try {
                -1 == d.EXCLUDE_IDENTITY_PARAMS.indexOf(o) && (d.TOLOWERCASE_IDENTITY_PARAMS.indexOf(o) > -1 && (e[o] = e[o].toLowerCase()),
                d.JSON_VALUE_KEYS.indexOf(o) > -1 && (e[o] = JSON.parse(e[o])),
                t = I.getNestedObjectFromString(t, ".", o, e[o]))
            } catch (i) {
                I.logWarning(d.MESSAGES.IDENTITY.M3, i)
            }
        return t
    }
    ,
    t.getPartnerParams = function(e) {
        var t = {};
        for (var o in e)
            try {
                t = I.getNestedObjectFromString(t, ".", o, e[o])
            } catch (i) {
                I.logWarning(d.MESSAGES.M29, i)
            }
        return t
    }
    ,
    t.generateMonetizationPixel = function(e, t) {
        var o, i, r, s, a, _ = n.getMonetizationPixelURL(), p = n.getPublisherId(), c = "";
        const m = !0;
        return _ ? (i = I.isFunction(t.getGrossEcpm) ? t.getGrossEcpm(m) : n.getAdServerCurrency() && I.isFunction(t.getCpmInNewCurrency) ? window.parseFloat(t.getCpmInNewCurrency(d.COMMON.ANALYTICS_CURRENCY)) : t.cpm,
        a = I.isFunction(t.getAdapterID) ? t.getAdapterID() : t.bidderCode,
        o = I.isFunction(t.getNetEcpm) ? t.getNetEcpm(m) : window.parseFloat((i * n.getAdapterRevShare(a)).toFixed(d.COMMON.BID_PRECISION)),
        s = I.isFunction(t.getBidID) ? t.getBidID() : window.PWT.bidMap[e].adapters[a].bids[Object.keys(window.PWT.bidMap[e].adapters[a].bids)[0]].bidID,
        r = I.isFunction(t.getKGPV) ? t.getKGPV() : window.PWT.bidMap[e].adapters[a].bids[Object.keys(window.PWT.bidMap[e].adapters[a].bids)[0]].kgpv,
        c = I.isFunction(t.getsspID) ? t.getsspID() : t.sspID || "",
        _ += "pubid=" + p,
        _ += "&purl=" + window.encodeURIComponent(I.metaInfo.pageURL),
        _ += "&tst=" + I.getCurrentTimestamp(),
        _ += "&iid=" + window.encodeURIComponent(window.PWT.bidMap[e].getImpressionID()),
        _ += "&bidid=" + window.encodeURIComponent(s),
        _ += "&pid=" + window.encodeURIComponent(n.getProfileID()),
        _ += "&pdvid=" + window.encodeURIComponent(n.getProfileDisplayVersionID()),
        _ += "&slot=" + window.encodeURIComponent(e),
        _ += "&pn=" + window.encodeURIComponent(a),
        _ += "&en=" + window.encodeURIComponent(o),
        _ += "&eg=" + window.encodeURIComponent(i),
        _ += "&kgpv=" + window.encodeURIComponent(r),
        _ += "&piid=" + window.encodeURIComponent(c),
        d.COMMON.PROTOCOL + _) : void 0
    }
    ,
    t.UpdateVastWithTracker = function(e, t) {
        try {
            var o = new DOMParser
              , i = o.parseFromString(t, "application/xml")
              , r = i.createElement("Impression");
            return r.innerHTML = "<![CDATA[" + I.generateMonetizationPixel(e.adUnitCode, e) + "]]>",
            1 == i.getElementsByTagName("Wrapper").length ? i.getElementsByTagName("Wrapper")[0].appendChild(r) : 1 == i.getElementsByTagName("InLine").length && i.getElementsByTagName("InLine")[0].appendChild(r),
            (new XMLSerializer).serializeToString(i)
        } catch (n) {
            return t
        }
    }
    ,
    t.getDomainFromURL = function(e) {
        var t = window.document.createElement("a");
        return t.href = e,
        t.hostname
    }
    ,
    t.replaceAuctionPrice = function(e, t) {
        return e ? e.replace(/\$\{AUCTION_PRICE\}/g, t) : void 0
    }
    ,
    t.getCustomParamsForDFPVideo = function(e, t) {
        const o = t && t.adserverTargeting || {};
        var i = {};
        for (var r in o)
            I.isOwnProperty(o, r) && (i[r] = I.isArray(o[r]) ? o[r].join() : o[r]);
        var e = Object.assign({}, i, e);
        return e
    }
    ,
    t.getDevicePlatform = function() {
        var e = 3;
        try {
            var t = navigator.userAgent;
            if (t && I.isString(t) && "" != t.trim()) {
                t = t.toLowerCase().trim();
                var o = new RegExp("(mobi|tablet|ios).*");
                e = t.match(o) ? 2 : 1
            }
        } catch (i) {
            I.logError("Unable to get device platform", i)
        }
        return e
    }
    ,
    t.updateAdUnits = function(e) {
        I.isArray(e) ? e.forEach((function(e) {
            e.bids.forEach((function(e) {
                I.updateUserIds(e)
            }
            ))
        }
        )) : I.isEmptyObject(e) || e.bids.forEach((function(e) {
            I.updateUserIds(e)
        }
        ))
    }
    ,
    t.updateUserIds = function(e) {
        if (I.isUndefined(e.userId) ? e.userId = I.getUserIds() : e.userId && (e.userId = Object.assign(e.userId, I.getUserIds())),
        I.isUndefined(e.userIdAsEids))
            e.userIdAsEids = I.getUserIdsAsEids();
        else if (I.isArray(e.userIdAsEids)) {
            var t = new Set
              , o = I.getUserIdsAsEids().concat(e.userIdAsEids);
            I.isArray(o) && o.length > 0 && (o = o.filter((function(e) {
                if (e.source) {
                    if (t.has(e.source))
                        return !1;
                    t.add(e.source)
                }
                return !0
            }
            ))),
            e.userIdAsEids = o
        }
    }
}
), (function(e, t, o) {
    function i() {
        var e = n.COMMON.PARENT_ADAPTER_PREBID;
        if (!d.isOwnProperty(r.adapters, e)) {
            var t = {};
            t[n.CONFIG.REV_SHARE] = "0.0",
            t[n.CONFIG.THROTTLE] = "100",
            t[n.CONFIG.KEY_GENERATION_PATTERN] = "_DIV_",
            t[n.CONFIG.KEY_LOOKUP_MAP] = {},
            r.adapters[e] = t
        }
    }
    var r = o(3)
      , n = o(4)
      , d = o(1)
      , s = null;
    s = this,
    t.getPublisherId = function() {
        return d.trim(r.pwt.pubid) || "0"
    }
    ,
    t.getMataDataPattern = function() {
        return d.isString(r[n.CONFIG.COMMON][n.CONFIG.META_DATA_PATTERN]) ? r[n.CONFIG.COMMON][n.CONFIG.META_DATA_PATTERN] : null
    }
    ,
    t.getSendAllBidsStatus = function() {
        return window.parseInt(r[n.CONFIG.COMMON][n.CONFIG.SEND_ALL_BIDS]) || 0
    }
    ,
    t.getTimeout = function() {
        return window.parseInt(r.pwt.t) || 1e3
    }
    ,
    t.getDisableAjaxTimeout = function() {
        var e = r.pwt;
        return d.isOwnProperty(e, n.CONFIG.DISABLE_AJAX_TIMEOUT) ? 1 == r.pwt.disableAjaxTimeout : !0
    }
    ,
    t.getAdapterRevShare = function(e) {
        var t = r.adapters;
        return d.isOwnProperty(t[e], n.CONFIG.REV_SHARE) ? 1 - window.parseFloat(t[e][n.CONFIG.REV_SHARE]) / 100 : 1
    }
    ,
    t.getAdapterThrottle = function(e) {
        var t = r.adapters;
        return d.isOwnProperty(t[e], n.CONFIG.THROTTLE) ? 100 - window.parseFloat(t[e][n.CONFIG.THROTTLE]) : 0
    }
    ,
    t.isServerSideAdapter = function(e) {
        var t = r.adapters;
        return t[e] && d.isOwnProperty(t[e], n.CONFIG.SERVER_SIDE_ENABLED) ? 1 === window.parseInt(t[e][n.CONFIG.SERVER_SIDE_ENABLED]) : !1
    }
    ,
    t.getAdapterMaskBidsStatus = function(e) {
        var t = r.adapters
          , o = {
            audienceNetwork: 1
        };
        return d.isOwnProperty(o, e) ? o[e] : d.isOwnProperty(t[e], n.CONFIG.MASK_BIDS) ? window.parseInt(t[e][n.CONFIG.MASK_BIDS]) || 0 : 0
    }
    ,
    t.getBidPassThroughStatus = function(e) {
        var t = r.adapters;
        return d.isOwnProperty(t[e], n.CONFIG.BID_PASS_THROUGH) ? window.parseInt(t[e][n.CONFIG.BID_PASS_THROUGH]) : 0
    }
    ,
    t.getProfileID = function() {
        return d.trim(r.pwt[n.CONFIG.PROFILE_ID]) || "0"
    }
    ,
    t.getProfileDisplayVersionID = function() {
        return d.trim(r.pwt[n.CONFIG.PROFILE_VERSION_ID]) || "0"
    }
    ,
    t.getAnalyticsPixelURL = function() {
        return r.pwt[n.CONFIG.LOGGER_URL] || !1
    }
    ,
    t.getMonetizationPixelURL = function() {
        return r.pwt[n.CONFIG.TRACKER_URL] || !1
    }
    ,
    t.forEachAdapter = function(e) {
        d.forEachOnObject(r.adapters, e)
    }
    ,
    t.getGdpr = function() {
        var e = r[n.CONFIG.COMMON][n.CONFIG.GDPR_CONSENT] || n.CONFIG.DEFAULT_GDPR_CONSENT;
        return "1" === e
    }
    ,
    t.getCmpApi = function() {
        return r[n.CONFIG.COMMON][n.CONFIG.GDPR_CMPAPI] || n.CONFIG.DEFAULT_GDPR_CMPAPI
    }
    ,
    t.getGdprTimeout = function() {
        var e = r[n.CONFIG.COMMON][n.CONFIG.GDPR_TIMEOUT];
        return e ? window.parseInt(e) : n.CONFIG.DEFAULT_GDPR_TIMEOUT
    }
    ,
    t.getAwc = function() {
        var e = r[n.CONFIG.COMMON][n.CONFIG.GDPR_AWC] || n.CONFIG.DEFAULT_GDPR_AWC;
        return "1" === e
    }
    ,
    t.addPrebidAdapter = i,
    t.initConfig = function() {
        s.addPrebidAdapter();
        var e = {};
        d.forEachOnObject(n.CONFIG, (function(t, o) {
            e[o] = ""
        }
        )),
        d.forEachOnObject(r.adapters, (function(t, o) {
            var i = {};
            d.forEachOnObject(o, (function(t, o) {
                d.isOwnProperty(e, t) || (i[t] = o)
            }
            )),
            d.forEachOnObject(o[n.CONFIG.KEY_LOOKUP_MAP], (function(e, t) {
                d.forEachOnObject(i, (function(e, o) {
                    t[e] = o
                }
                ))
            }
            )),
            "pubmatic" != t && "pubmatic2" != t && d.forEachOnObject(o[n.CONFIG.REGEX_KEY_LOOKUP_MAP], (function(e, t) {
                d.forEachOnObject(i, (function(e, o) {
                    d.isOwnProperty(t, "rx_config") && (t.rx_config[e] = o)
                }
                ))
            }
            ))
        }
        ))
    }
    ,
    t.getNativeConfiguration = function() {
        return r[n.COMMON.NATIVE_MEDIA_TYPE_CONFIG]
    }
    ,
    t.getAdServerCurrency = function() {
        return r[n.CONFIG.COMMON][n.COMMON.AD_SERVER_CURRENCY]
    }
    ,
    t.isSingleImpressionSettingEnabled = function() {
        return parseInt(r[n.CONFIG.COMMON][n.COMMON.SINGLE_IMPRESSION] || n.CONFIG.DEFAULT_SINGLE_IMPRESSION)
    }
    ,
    t.isUserIdModuleEnabled = function() {
        return parseInt(r[n.CONFIG.COMMON][n.COMMON.ENABLE_USER_ID] || n.CONFIG.DEFAULT_USER_ID_MODULE)
    }
    ,
    t.getIdentityPartners = function() {
        return r[n.COMMON.IDENTITY_PARTNERS]
    }
    ,
    t.isIdentityOnly = function() {
        return parseInt(r[n.CONFIG.COMMON][n.COMMON.IDENTITY_ONLY] || n.CONFIG.DEFAULT_IDENTITY_ONLY)
    }
    ,
    t.getIdentityConsumers = function() {
        return (r[n.CONFIG.COMMON][n.COMMON.IDENTITY_CONSUMERS] || "").toLowerCase()
    }
    ,
    t.getSlotConfiguration = function() {
        return r[n.COMMON.SLOT_CONFIG]
    }
    ,
    t.getAdServer = function() {
        return r[n.COMMON.ADSERVER]
    }
    ,
    t.getCCPA = function() {
        var e = r[n.CONFIG.COMMON][n.CONFIG.CCPA_CONSENT] || n.CONFIG.DEFAULT_CCPA_CONSENT;
        return "1" === e
    }
    ,
    t.getCCPACmpApi = function() {
        return r[n.CONFIG.COMMON][n.CONFIG.CCPA_CMPAPI] || n.CONFIG.DEFAULT_CCPA_CMPAPI
    }
    ,
    t.getCCPATimeout = function() {
        var e = r[n.CONFIG.COMMON][n.CONFIG.CCPA_TIMEOUT];
        return e ? window.parseInt(e) : n.CONFIG.DEFAULT_CCPA_TIMEOUT
    }
    ,
    t.getSchainObject = function() {
        return r[n.CONFIG.COMMON][n.COMMON.SCHAINOBJECT] || {}
    }
    ,
    t.isSchainEnabled = function() {
        return window.parseInt(r[n.CONFIG.COMMON][n.COMMON.SCHAIN]) || 0
    }
    ,
    t.PBJS_NAMESPACE = r[n.CONFIG.COMMON][n.COMMON.PBJS_NAMESPACE] || "pbjs"
}
), (function(e, t) {
    t.pwt = {
        pid: "1481",
        gcv: "123",
        pdvid: "31",
        pubid: "103207",
        dataURL: "t.pubmatic.com/wl?",
        winURL: "t.pubmatic.com/wt?",
        owv: "v21.0.0",
        pbv: "v3.25.0",
        metaDataPattern: "_PC_:_BC_::_P_-_W_x_H_-_NE_[_GE_]||",
        sendAllBids: "0",
        adserver: "CUSTOM",
        gdpr: "0",
        cmp: 0,
        gdprTimeout: 0,
        awc: 0,
        platform: "display",
        refreshInterval: 0,
        priceGranularity: 0,
        adServerCurrency: 0,
        singleImpression: "1",
        identityEnabled: "0",
        identityConsumers: 0,
        ccpa: "1",
        ccpaCmpApi: "iab",
        ccpaTimeout: "200",
        sChain: "0",
        sChainObj: 0,
        auTimeout: "1000",
        t: "1000",
        ssTimeout: 0,
        prebidObjName: 0,
        pubAnalyticsAdapter: "0",
        usePBJSKeys: "0"
    },
    t.adapters = {
        appnexus: {
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            pt: 0,
            serverSideEnabled: "0",
            amp: 0,
            video: 0,
            "in-app": 0,
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    placementId: "12110026"
                },
                "tcom_desktop_300x250_110@300x250": {
                    placementId: "12110025"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    placementId: "12110033"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    placementId: "12110037"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    placementId: "13946230"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    placementId: "11892097"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos20@320x50": {
                    placementId: "12110029"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos40@320x50": {
                    placementId: "12110029"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    placementId: "12110037"
                },
                "tcom_desktop_300x250_70@300x250": {
                    placementId: "12110025"
                },
                "tcom_mweb_300x250_60@300x250": {
                    placementId: "12110026"
                },
                "tcom_desktop_728x90_130@728x90": {
                    placementId: "11892097"
                },
                "dcomHomeTop-300x250@300x250": {
                    placementId: "12110031"
                },
                "dmwMisspellThesTop@320x50": {
                    placementId: "12110029"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    placementId: "12110025"
                },
                "tcom_writingprompt_dkt_atf_300x250_pos10@300x250": {
                    placementId: "11892095"
                },
                "tcomHomeBot-728x90@728x90": {
                    placementId: "11892097"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    placementId: "13946260"
                },
                "dcom-serp-lb-728x90@728x90": {
                    placementId: "12110032"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    placementId: "12110034"
                },
                "tcom_desktop_300x250_150@300x250": {
                    placementId: "12110025"
                },
                "dcomHomeTop-728x90@970x250": {
                    placementId: "12110032"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos30@320x50": {
                    placementId: "12110029"
                },
                "tcom_mweb_300x250_80@300x250": {
                    placementId: "12110026"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    placementId: "14204414"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    placementId: "12110034"
                },
                "tcom_desktop_728x90_60@728x90": {
                    placementId: "11892097"
                },
                "tcomHomeTop-728x90@970x90": {
                    placementId: "11892081"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    placementId: "12110031"
                },
                "dcom_quiz_dkt_atf_728x90_pos1@728x90": {
                    placementId: "12110032"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    placementId: "12110035"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    placementId: "11892081"
                },
                "tcomHomeTop-300x250@300x250": {
                    placementId: "11892095"
                },
                "tcom_mweb_300x250_70@300x250": {
                    placementId: "12110026"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    placementId: "12110032"
                },
                "tcom_mweb_300x250_100@300x250": {
                    placementId: "12110026"
                },
                "dmwMisspellThesBottom@300x250": {
                    placementId: "12110026"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    placementId: "13946234"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    placementId: "12110025"
                },
                "dcom-misspell-top-300x250@300x250": {
                    placementId: "12110031"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    placementId: "12110031"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    placementId: "11892081"
                },
                "tcom_mweb_300x250_40@300x250": {
                    placementId: "12110026"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    placementId: "12110035"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    placementId: "12110029"
                },
                "dmwSerpThesTop@320x50": {
                    placementId: "12110029"
                },
                "tcom_desktop_728x90_100@728x90": {
                    placementId: "11892097"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    placementId: "12110025"
                },
                "tcom_desktop_728x90_80@728x90": {
                    placementId: "11892097"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    placementId: "12110032"
                },
                "tcom_desktop_300x250_90@300x250": {
                    placementId: "12110025"
                },
                "tcom_mweb_300x250_50@300x250": {
                    placementId: "12110026"
                },
                "dmwHomeThesBottom@300x250": {
                    placementId: "12110026"
                },
                "dcomHomeTop-728x90@728x90": {
                    placementId: "12110032"
                },
                "tcom_mweb_300x250_90@300x250": {
                    placementId: "12110026"
                },
                "tcom_serp_dkt_btf_300x600_4@300x600": {
                    placementId: "13946246"
                },
                "tcomHomeTop-728x90@728x90": {
                    placementId: "11892081"
                },
                "dcom_quiz_mweb_atf_320x50_pos1@320x50": {
                    placementId: "12110037"
                },
                "tcom_serp_dkt_btf_970x250_5@970x250": {
                    placementId: "13946251"
                },
                "tcom_writingtool_dkt_atf_728x90_pos1@728x90": {
                    placementId: "11892081"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    placementId: "12110036"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    placementId: "12110025"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    placementId: "13892971"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    placementId: "13946235"
                },
                "tcom_mweb_300x250_120@300x250": {
                    placementId: "12110026"
                },
                "DcomHomeDesktop_728x90_pos30@970x250": {
                    placementId: "17746465"
                },
                "tcomHomeDesktop_728x90_pos30@728x90": {
                    placementId: "17746475"
                },
                "dcom-serp-lb-728x90@970x90": {
                    placementId: "12110032"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    placementId: "12110041"
                },
                "dmwSerpThesBottom@300x250": {
                    placementId: "12110026"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    placementId: "12110042"
                },
                "tcom_desktop_300x250_50@300x250": {
                    placementId: "12110025"
                },
                "tcom_desktop_728x90_170@728x90": {
                    placementId: "11892097"
                },
                "tcomHomeDesktop_728x90_pos30@970x250": {
                    placementId: "17746477"
                },
                "dcom-serp-lb-728x90@970x250": {
                    placementId: "12110032"
                },
                "tcom_serp_dkt_btf_970x90_5@970x90": {
                    placementId: "13946256"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    placementId: "13946221"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    placementId: "12110042"
                },
                "dcomHomeBot-728x90@728x90": {
                    placementId: "12110035"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    placementId: "11892081"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    placementId: "12110042"
                },
                "DcomHomeDesktop_728x90_pos30@728x90": {
                    placementId: "17746464"
                },
                "thesaurus_serp_btf_2@728x90": {
                    placementId: "11892097"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    placementId: "11892095"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    placementId: "12110034"
                },
                "tcom_writingtool_dkt_atf_160x600_pos10@160x600": {
                    placementId: "17746506"
                },
                "thesaurus_serp_btf_2@970x90": {
                    placementId: "11892097"
                },
                "tcom_desktop_300x250_140@300x250": {
                    placementId: "12110025"
                },
                "tcom_writingtool_mweb_atf_320x50_pos1@320x50": {
                    placementId: "12110029"
                },
                "tcom_desktop_728x90_40@728x90": {
                    placementId: "11892097"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos10@320x50": {
                    placementId: "12110029"
                },
                "tcom_mweb_300x250_110@300x250": {
                    placementId: "12110026"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    placementId: "12110037"
                },
                "tcom_writingprompt_dkt_atf_728x90_pos1@728x90": {
                    placementId: "11892081"
                },
                "tcom_writingprompt_mweb_atf_320x50_pos1@320x50": {
                    placementId: "12110029"
                },
                "tcom_desktop_728x90_160@728x90": {
                    placementId: "11892097"
                },
                "dmwHomeThesTop@320x50": {
                    placementId: "12110029"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    placementId: "11892095"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    placementId: "12110033"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    placementId: "12110033"
                },
                "dcom-serp-bot-300x250@300x250": {
                    placementId: "12110034"
                },
                "dcom-no-result-top-300x250@300x250": {
                    placementId: "12110031"
                },
                "dcomHomeTop-728x90@970x90": {
                    placementId: "12110032"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    placementId: "12110025"
                },
                "thesaurus_serp_btf_2@970x250": {
                    placementId: "11892097"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    placementId: "13892967"
                },
                "tcom_desktop_728x90_120@728x90": {
                    placementId: "11892097"
                }
            }
        },
        pubmatic: {
            publisherId: "103207",
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            pt: 0,
            serverSideEnabled: "0",
            amp: 0,
            video: 0,
            "in-app": 0,
            kgp: "_DIV_@_W_x_H_",
            sk: "true"
        },
        districtm: {
            rev_share: "10.0",
            timeout: 0,
            throttle: "100",
            serverSideEnabled: "0",
            amp: 0,
            video: 0,
            "in-app": 0,
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    placementId: "12109540"
                },
                "tcom_desktop_300x250_110@300x250": {
                    placementId: "11907071"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    placementId: "11907078"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    placementId: "11907082"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    placementId: "13946875"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    placementId: "11907073"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    placementId: "11907082"
                },
                "tcom_desktop_300x250_70@300x250": {
                    placementId: "11907071"
                },
                "tcom_mweb_300x250_60@300x250": {
                    placementId: "12109540"
                },
                "tcom_desktop_728x90_130@728x90": {
                    placementId: "11907073"
                },
                "dcomHomeTop-300x250@300x250": {
                    placementId: "12109541"
                },
                "dmwMisspellThesTop@320x50": {
                    placementId: "11907074"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    placementId: "11907071"
                },
                "tcomHomeBot-728x90@728x90": {
                    placementId: "11907073"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    placementId: "13946894"
                },
                "dcom-serp-lb-728x90@728x90": {
                    placementId: "12109542"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    placementId: "11907079"
                },
                "tcom_desktop_300x250_150@300x250": {
                    placementId: "11907071"
                },
                "dcomHomeTop-728x90@970x250": {
                    placementId: "12109542"
                },
                "tcom_mweb_300x250_80@300x250": {
                    placementId: "12109540"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    placementId: "14201051"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    placementId: "11907079"
                },
                "tcom_desktop_728x90_60@728x90": {
                    placementId: "11907073"
                },
                "tcomHomeTop-728x90@970x90": {
                    placementId: "11907070"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    placementId: "12109541"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    placementId: "11907080"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    placementId: "11907070"
                },
                "tcomHomeTop-300x250@300x250": {
                    placementId: "11907069"
                },
                "tcom_mweb_300x250_70@300x250": {
                    placementId: "12109540"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    placementId: "12109542"
                },
                "tcom_mweb_300x250_100@300x250": {
                    placementId: "12109540"
                },
                "dmwMisspellThesBottom@300x250": {
                    placementId: "12109540"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    placementId: "13946873"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    placementId: "11907071"
                },
                "dcom-misspell-top-300x250@300x250": {
                    placementId: "12109541"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    placementId: "12109541"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    placementId: "11907070"
                },
                "tcom_mweb_300x250_40@300x250": {
                    placementId: "12109540"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    placementId: "11907080"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    placementId: "11907074"
                },
                "dmwSerpThesTop@320x50": {
                    placementId: "11907074"
                },
                "tcom_desktop_728x90_100@728x90": {
                    placementId: "11907073"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    placementId: "11907071"
                },
                "tcom_desktop_728x90_80@728x90": {
                    placementId: "11907073"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    placementId: "12109542"
                },
                "tcom_desktop_300x250_90@300x250": {
                    placementId: "11907071"
                },
                "tcom_mweb_300x250_50@300x250": {
                    placementId: "12109540"
                },
                "dmwHomeThesBottom@300x250": {
                    placementId: "12109540"
                },
                "dcomHomeTop-728x90@728x90": {
                    placementId: "12109542"
                },
                "tcom_mweb_300x250_90@300x250": {
                    placementId: "12109540"
                },
                "tcom_serp_dkt_btf_300x600_4@300x600": {
                    placementId: "13946886"
                },
                "tcomHomeTop-728x90@728x90": {
                    placementId: "11907070"
                },
                "tcom_serp_dkt_btf_970x250_5@970x250": {
                    placementId: "13946889"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    placementId: "11907081"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    placementId: "11907071"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    placementId: "13893587"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    placementId: "13946871"
                },
                "tcom_mweb_300x250_120@300x250": {
                    placementId: "12109540"
                },
                "dcom-serp-lb-728x90@970x90": {
                    placementId: "12109542"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    placementId: "11907083"
                },
                "dmwSerpThesBottom@300x250": {
                    placementId: "12109540"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    placementId: "11907084"
                },
                "tcom_desktop_300x250_50@300x250": {
                    placementId: "11907071"
                },
                "tcom_desktop_728x90_170@728x90": {
                    placementId: "11907073"
                },
                "dcom-serp-lb-728x90@970x250": {
                    placementId: "12109542"
                },
                "tcom_serp_dkt_btf_970x90_5@970x90": {
                    placementId: "13946892"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    placementId: "13946864"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    placementId: "11907084"
                },
                "dcomHomeBot-728x90@728x90": {
                    placementId: "11907080"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    placementId: "11907070"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    placementId: "11907084"
                },
                "thesaurus_serp_btf_2@728x90": {
                    placementId: "11907073"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    placementId: "11907069"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    placementId: "11907079"
                },
                "thesaurus_serp_btf_2@970x90": {
                    placementId: "11907073"
                },
                "tcom_desktop_300x250_140@300x250": {
                    placementId: "11907071"
                },
                "tcom_desktop_728x90_40@728x90": {
                    placementId: "11907073"
                },
                "tcom_mweb_300x250_110@300x250": {
                    placementId: "12109540"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    placementId: "11907082"
                },
                "tcom_desktop_728x90_160@728x90": {
                    placementId: "11907073"
                },
                "dmwHomeThesTop@320x50": {
                    placementId: "11907074"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    placementId: "11907069"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    placementId: "11907078"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    placementId: "11907078"
                },
                "dcom-serp-bot-300x250@300x250": {
                    placementId: "11907079"
                },
                "dcom-no-result-top-300x250@300x250": {
                    placementId: "12109541"
                },
                "dcomHomeTop-728x90@970x90": {
                    placementId: "12109542"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    placementId: "11907071"
                },
                "thesaurus_serp_btf_2@970x250": {
                    placementId: "11907073"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    placementId: "12109540"
                },
                "tcom_desktop_728x90_120@728x90": {
                    placementId: "11907073"
                }
            }
        },
        openx: {
            delDomain: "ask-d.openx.net",
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            pt: 0,
            serverSideEnabled: "0",
            amp: 0,
            video: 0,
            "in-app": 0,
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    unit: "539342494"
                },
                "tcom_desktop_300x250_110@300x250": {
                    unit: "539342493"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    unit: "539342498"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    unit: "539342502"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    unit: "540311554"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    unit: "539342492"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos20@320x50": {
                    unit: "539342495"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos40@320x50": {
                    unit: "539342495"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    unit: "539342502"
                },
                "tcom_desktop_300x250_70@300x250": {
                    unit: "539342493"
                },
                "tcom_mweb_300x250_60@300x250": {
                    unit: "540290585"
                },
                "tcom_desktop_728x90_130@728x90": {
                    unit: "539342492"
                },
                "dcomHomeTop-300x250@300x250": {
                    unit: "539342496"
                },
                "dmwMisspellThesTop@320x50": {
                    unit: "539342495"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    unit: "539342493"
                },
                "tcom_writingprompt_dkt_atf_300x250_pos10@300x250": {
                    unit: "539342491"
                },
                "tcomHomeBot-728x90@728x90": {
                    unit: "539342492"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    unit: "540311578"
                },
                "dcom-serp-lb-728x90@728x90": {
                    unit: "539342497"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    unit: "539342499"
                },
                "tcom_desktop_300x250_150@300x250": {
                    unit: "539342493"
                },
                "dcomHomeTop-728x90@970x250": {
                    unit: "539342497"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos30@320x50": {
                    unit: "539342495"
                },
                "tcom_mweb_300x250_80@300x250": {
                    unit: "540290585"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    unit: "540398742"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    unit: "539342499"
                },
                "tcom_desktop_728x90_60@728x90": {
                    unit: "539342492"
                },
                "tcomHomeTop-728x90@970x90": {
                    unit: "539342490"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    unit: "539342496"
                },
                "dcom_quiz_dkt_atf_728x90_pos1@728x90": {
                    unit: "539342497"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    unit: "539342500"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    unit: "539342490"
                },
                "tcomHomeTop-300x250@300x250": {
                    unit: "539342491"
                },
                "tcom_mweb_300x250_70@300x250": {
                    unit: "540290585"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    unit: "539342497"
                },
                "tcom_mweb_300x250_100@300x250": {
                    unit: "540290585"
                },
                "dmwMisspellThesBottom@300x250": {
                    unit: "539342494"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    unit: "540311555"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    unit: "539342493"
                },
                "dcom-misspell-top-300x250@300x250": {
                    unit: "539342496"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    unit: "539342496"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    unit: "539342490"
                },
                "tcom_mweb_300x250_40@300x250": {
                    unit: "540290585"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    unit: "539342500"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    unit: "539342495"
                },
                "dmwSerpThesTop@320x50": {
                    unit: "539342495"
                },
                "tcom_desktop_728x90_100@728x90": {
                    unit: "539342492"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    unit: "539342493"
                },
                "tcom_desktop_728x90_80@728x90": {
                    unit: "539342492"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    unit: "539342497"
                },
                "tcom_desktop_300x250_90@300x250": {
                    unit: "539342493"
                },
                "tcom_mweb_300x250_50@300x250": {
                    unit: "540290585"
                },
                "dmwHomeThesBottom@300x250": {
                    unit: "539342494"
                },
                "dcomHomeTop-728x90@728x90": {
                    unit: "539342497"
                },
                "tcom_mweb_300x250_90@300x250": {
                    unit: "540290585"
                },
                "tcom_serp_dkt_btf_300x600_4@300x600": {
                    unit: "540311575"
                },
                "tcomHomeTop-728x90@728x90": {
                    unit: "539342490"
                },
                "dcom_quiz_mweb_atf_320x50_pos1@320x50": {
                    unit: "539342502"
                },
                "tcom_serp_dkt_btf_970x250_5@970x250": {
                    unit: "540311576"
                },
                "tcom_writingtool_dkt_atf_728x90_pos1@728x90": {
                    unit: "539342490"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    unit: "539342501"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    unit: "539342493"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    unit: "540290585"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    unit: "540311557"
                },
                "tcom_mweb_300x250_120@300x250": {
                    unit: "540290585"
                },
                "DcomHomeDesktop_728x90_pos30@970x250": {
                    unit: "540916047"
                },
                "tcomHomeDesktop_728x90_pos30@728x90": {
                    unit: "540916048"
                },
                "dcom-serp-lb-728x90@970x90": {
                    unit: "539342497"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    unit: "539342503"
                },
                "dmwSerpThesBottom@300x250": {
                    unit: "539342494"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    unit: "539342504"
                },
                "tcom_desktop_300x250_50@300x250": {
                    unit: "539342493"
                },
                "tcom_desktop_728x90_170@728x90": {
                    unit: "539342492"
                },
                "tcomHomeDesktop_728x90_pos30@970x250": {
                    unit: "540916048"
                },
                "dcom-serp-lb-728x90@970x250": {
                    unit: "539342497"
                },
                "tcom_serp_dkt_btf_970x90_5@970x90": {
                    unit: "540311577"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    unit: "540311553"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    unit: "539342504"
                },
                "dcomHomeBot-728x90@728x90": {
                    unit: "539342500"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    unit: "539342490"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    unit: "539342504"
                },
                "DcomHomeDesktop_728x90_pos30@728x90": {
                    unit: "540916047"
                },
                "thesaurus_serp_btf_2@728x90": {
                    unit: "539342492"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    unit: "539342491"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    unit: "539342499"
                },
                "tcom_writingtool_dkt_atf_160x600_pos10@160x600": {
                    unit: "540916055"
                },
                "thesaurus_serp_btf_2@970x90": {
                    unit: "539342492"
                },
                "tcom_desktop_300x250_140@300x250": {
                    unit: "539342493"
                },
                "tcom_writingtool_mweb_atf_320x50_pos1@320x50": {
                    unit: "539342495"
                },
                "tcom_desktop_728x90_40@728x90": {
                    unit: "539342492"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos10@320x50": {
                    unit: "539342495"
                },
                "tcom_mweb_300x250_110@300x250": {
                    unit: "540290585"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    unit: "539342502"
                },
                "tcom_writingprompt_dkt_atf_728x90_pos1@728x90": {
                    unit: "539342490"
                },
                "tcom_writingprompt_mweb_atf_320x50_pos1@320x50": {
                    unit: "539342495"
                },
                "tcom_desktop_728x90_160@728x90": {
                    unit: "539342492"
                },
                "dmwHomeThesTop@320x50": {
                    unit: "539342495"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    unit: "539342491"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    unit: "539342498"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    unit: "539342498"
                },
                "dcom-serp-bot-300x250@300x250": {
                    unit: "539342499"
                },
                "dcom-no-result-top-300x250@300x250": {
                    unit: "539342496"
                },
                "dcomHomeTop-728x90@970x90": {
                    unit: "539342497"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    unit: "539342493"
                },
                "thesaurus_serp_btf_2@970x250": {
                    unit: "539342492"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    unit: "540290583"
                },
                "tcom_desktop_728x90_120@728x90": {
                    unit: "539342492"
                }
            }
        },
        aol: {
            network: "9547.1",
            server: "adserver.adtech.advertising.com",
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    sizeId: "170",
                    alias: "tcom_serp_mweb_btf_300x250_4",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_300x250_110@300x250": {
                    sizeId: "170",
                    alias: "tcom_desktop_300x250_110",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x250-mid-pow",
                    placement: "4677689",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    sizeId: "3055",
                    alias: "iac.dict.dictry.mw-320x50-atf-pow",
                    placement: "4677724",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    sizeId: "2466",
                    alias: "dcom_serp_dkt_btf_970x250_5",
                    placement: "4944596",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-bottest",
                    placement: "4618966",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos20@320x50": {
                    sizeId: "3055",
                    alias: "tcom_serp_mweb_atf_320x50_1",
                    placement: "4944599",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_100@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_100",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos40@320x50": {
                    sizeId: "3055",
                    alias: "tcom_serp_mweb_atf_320x50_1",
                    placement: "4944599",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_80@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_80",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    sizeId: "3055",
                    alias: "iac.dict.dictry.mw-320x50-atf-pow",
                    placement: "4677724",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "tcom_desktop_300x250_70@300x250": {
                    sizeId: "170",
                    alias: "tcom_desktop_300x250_70",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_mweb_300x250_60@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_60",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_130@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_130",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomHomeTop-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x250-atf-pow",
                    placement: "4677688",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dmwMisspellThesTop@320x50": {
                    sizeId: "3055",
                    alias: "iac.dict.thesrs.mw-320x50-toptest",
                    placement: "4619814",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    sizeId: "529",
                    alias: "iac.dict.thesrs.dw-300x250-mid-pow",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_writingprompt_dkt_atf_300x250_pos10@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.dw-300x250-toptest",
                    placement: "4618968",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcomHomeBot-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-bottest",
                    placement: "4618966",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    sizeId: "225",
                    alias: "tcom_serp_dkt_atf_728x90_3",
                    placement: "4944606",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcom-serp-lb-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-atf-pow",
                    placement: "4677690",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x2500-btf-pow",
                    placement: "4677687",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_desktop_300x250_150@300x250": {
                    sizeId: "170",
                    alias: "tcom_desktop_300x250_150",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_desktop_728x90_120@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_120",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomHomeTop-728x90@970x250": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-atf-pow",
                    placement: "4677690",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos30@320x50": {
                    sizeId: "3055",
                    alias: "tcom_serp_mweb_atf_320x50_1",
                    placement: "4944599",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_mweb_300x250_80@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_80",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-bottest",
                    placement: "4618966",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x2500-btf-pow",
                    placement: "4677687",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_desktop_728x90_60@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_60",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcomHomeTop-728x90@970x90": {
                    sizeId: "2473",
                    alias: "iac.dict.thesrs.dw-970x90-toptest",
                    placement: "4618965",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    sizeId: "529",
                    alias: "iac.dict.dictry.dw-300x600-atf-pow",
                    placement: "4696360",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom_quiz_dkt_atf_728x90_pos1@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-atf-pow",
                    placement: "4677690",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-btf-pow",
                    placement: "4677686",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-toptest",
                    placement: "4618967",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcomHomeTop-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.dw-300x250-toptest",
                    placement: "4618968",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_mweb_300x250_70@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_70",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-atf-pow",
                    placement: "4677690",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_mweb_300x250_100@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_100",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dmwMisspellThesBottom@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.mw-300x250-bottest",
                    placement: "4619813",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    sizeId: "2473",
                    alias: "dcom_serp_dkt_btf_970x90_5",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_desktop_728x90_40@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_40",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.dw-300x250-mid-pow",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcom-misspell-top-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x250-atf-pow",
                    placement: "4677688",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x250-atf-pow",
                    placement: "4677688",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    sizeId: "2466",
                    alias: "iac.dict.thesrs.dw-970x250-atf-pow",
                    placement: "4696359",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_mweb_300x250_40@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_40",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-btf-pow",
                    placement: "4677686",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    sizeId: "3055",
                    alias: "tcom_serp_mweb_atf_320x50_1",
                    placement: "4944599",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dmwSerpThesTop@320x50": {
                    sizeId: "3055",
                    alias: "iac.dict.thesrs.mw-320x50-toptest",
                    placement: "4619814",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_100@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_100",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.dw-300x250-mid-pow",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_desktop_728x90_80@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_80",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-atf-pow",
                    placement: "4677690",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_desktop_300x250_90@300x250": {
                    sizeId: "170",
                    alias: "tcom_desktop_300x250_90",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_mweb_300x250_50@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_50",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dmwHomeThesBottom@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.mw-300x250-bottest",
                    placement: "4619813",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dcomHomeTop-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-atf-pow",
                    placement: "4677690",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_mweb_300x250_90@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_90",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcomHomeTop-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-toptest",
                    placement: "4618967",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_desktop_728x90_130@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_130",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom_quiz_mweb_atf_320x50_pos1@320x50": {
                    sizeId: "3055",
                    alias: "iac.dict.dictry.mw-320x50-atf-pow",
                    placement: "4677724",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "tcom_writingtool_dkt_atf_728x90_pos1@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-toptest",
                    placement: "4618967",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.mw-300x250-atf-pow",
                    placement: "4677726",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    sizeId: "529",
                    alias: "tcom_serp_dkt_btf_300x600_4",
                    placement: "4944603",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    sizeId: "170",
                    alias: "tcom_serp_mweb_mid_300x250_3",
                    placement: "4944601",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    sizeId: "225",
                    alias: "dcom_serp_dkt_atf_728x90_3",
                    placement: "4944598",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_desktop_728x90_170@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_170",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_mweb_300x250_120@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_120",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "DcomHomeDesktop_728x90_pos30@970x250": {
                    sizeId: "2466",
                    alias: "DcomHomeDesktop_970x250_pos30 BTF",
                    placement: "5160997",
                    bidFloor: "0.6",
                    pageId: "209826"
                },
                "tcomHomeDesktop_728x90_pos30@728x90": {
                    sizeId: "225",
                    alias: "tcomHomeDesktop_728x90_pos30 BTF",
                    placement: "5160996",
                    bidFloor: "0.6",
                    pageId: "209827"
                },
                "dcom-serp-lb-728x90@970x90": {
                    sizeId: "2473",
                    alias: "iac.dict.dictry.dw-970x90-atf-pow",
                    placement: "4696357",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.mw-300x250-mid-pow",
                    placement: "4677725",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "dmwSerpThesBottom@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.mw-300x250-bottest",
                    placement: "4619813",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_60@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_60",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.mw-300x250-btf-pow",
                    placement: "4677723",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "tcom_desktop_300x250_50@300x250": {
                    sizeId: "170",
                    alias: "tcom_desktop_300x250_50",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_desktop_728x90_170@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_170",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcomHomeDesktop_728x90_pos30@970x250": {
                    sizeId: "2466",
                    alias: "tcomHomeDesktop_970x250_pos30 BTF",
                    placement: "5160999",
                    bidFloor: "0.6",
                    pageId: "209827"
                },
                "dcom-serp-lb-728x90@970x250": {
                    sizeId: "2466",
                    alias: "iac.dict.dictry.dw-970x250-atf-pow",
                    placement: "4696358",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    sizeId: "529",
                    alias: "dcom_serp_dkt_btf_300x600_4",
                    placement: "4944595",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.mw-320x50-atf-pow",
                    placement: "4677723",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "dcomHomeBot-728x90@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.dictry.dw-728x90-btf-pow",
                    placement: "4677686",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    sizeId: "2473",
                    alias: "iac.dict.thesrs.dw-970x90-toptest",
                    placement: "4618965",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.mw-300x250-btf-pow",
                    placement: "4677723",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "DcomHomeDesktop_728x90_pos30@728x90": {
                    sizeId: "225",
                    alias: "DcomHomeDesktop_728x90_pos30 BTF",
                    placement: "5160995",
                    bidFloor: "0.6",
                    pageId: "209826"
                },
                "thesaurus_serp_btf_2@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-bottest",
                    placement: "4618966",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    sizeId: "529",
                    alias: "iac.dict.thesrs.dw-300x600-atf-pow",
                    placement: "4696361",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_desktop_728x90_160@970x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_160",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x2500-btf-pow",
                    placement: "4677687",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_writingtool_dkt_atf_160x600_pos10@160x600": {
                    sizeId: "154",
                    alias: "tcom_writingtool_dkt_atf_160x600_pos10",
                    placement: "5161008",
                    bidFloor: "0.6",
                    pageId: "411423"
                },
                "thesaurus_serp_btf_2@970x90": {
                    sizeId: "2473",
                    alias: "tcom_serp_dkt_btf_970x90_5",
                    placement: "4944605",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_desktop_300x250_140@300x250": {
                    sizeId: "170",
                    alias: "tcom_desktop_300x250_140",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_writingtool_mweb_atf_320x50_pos1@320x50": {
                    sizeId: "3055",
                    alias: "tcom_serp_mweb_atf_320x50_1",
                    placement: "4944599",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_40@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_40",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos10@320x50": {
                    sizeId: "3055",
                    alias: "tcom_serp_mweb_atf_320x50_1",
                    placement: "4944599",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_mweb_300x250_110@300x250": {
                    sizeId: "170",
                    alias: "tcom_mweb_300x250_110",
                    placement: "4944602",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    sizeId: "3055",
                    alias: "iac.dict.dictry.mw-320x50-atf-pow",
                    placement: "4677724",
                    bidFloor: "0.6",
                    pageId: "819399"
                },
                "tcom_writingprompt_dkt_atf_728x90_pos1@728x90": {
                    sizeId: "225",
                    alias: "iac.dict.thesrs.dw-728x90-toptest",
                    placement: "4618967",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_writingprompt_mweb_atf_320x50_pos1@320x50": {
                    sizeId: "3055",
                    alias: "tcom_serp_mweb_atf_320x50_1",
                    placement: "4944599",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_160@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_160",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dmwHomeThesTop@320x50": {
                    sizeId: "3055",
                    alias: "iac.dict.thesrs.mw-320x50-toptest",
                    placement: "4619814",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.dw-300x250-toptest",
                    placement: "4618968",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x250-mid-pow",
                    placement: "4677689",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x250-mid-pow",
                    placement: "4677689",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-serp-bot-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x2500-btf-pow",
                    placement: "4677687",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcom-no-result-top-300x250@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.dictry.dw-300x250-atf-pow",
                    placement: "4677688",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "dcomHomeTop-728x90@970x90": {
                    sizeId: "2473",
                    alias: "iac.dict.dictry.dw-970x90-atf-pow",
                    placement: "4696357",
                    bidFloor: "0.6",
                    pageId: "819396"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    sizeId: "170",
                    alias: "iac.dict.thesrs.dw-300x250-mid-pow",
                    placement: "4677683",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "thesaurus_serp_btf_2@970x250": {
                    sizeId: "2466",
                    alias: "tcom_serp_dkt_btf_970x250_5",
                    placement: "4944604",
                    bidFloor: "0.6",
                    pageId: "819382"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    sizeId: "170",
                    alias: "tcom_serp_mweb_atf_300x250_2",
                    placement: "4944600",
                    bidFloor: "0.6",
                    pageId: "819388"
                },
                "tcom_desktop_728x90_120@728x90": {
                    sizeId: "2473",
                    alias: "tcom_desktop_728x90_120",
                    placement: "4944597",
                    bidFloor: "0.6",
                    pageId: "819396"
                }
            }
        },
        rubicon: {
            accountId: "10952",
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            pt: 0,
            serverSideEnabled: "0",
            amp: 0,
            video: 0,
            "in-app": 0,
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_desktop_300x250_110@300x250": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    zoneId: "167536",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    zoneId: "167548",
                    siteId: "40358",
                    position: "atf",
                    floor: "0.6"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.6"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos20@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos40@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.6"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    zoneId: "167548",
                    siteId: "40358",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_desktop_300x250_70@300x250": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_mweb_300x250_60@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_desktop_728x90_130@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "dcomHomeTop-300x250@300x250": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "dmwMisspellThesTop@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "atf",
                    floor: "0.6"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    zoneId: "342616",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_writingprompt_dkt_atf_300x250_pos10@300x250": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "tcomHomeBot-728x90@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "dcom-serp-lb-728x90@728x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_desktop_300x250_150@300x250": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "dcomHomeTop-728x90@970x250": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos30@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_mweb_300x250_80@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    zoneId: "1083276",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_desktop_728x90_60@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "tcomHomeTop-728x90@970x90": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.6"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.6"
                },
                "dcom_quiz_dkt_atf_728x90_pos1@728x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "tcomHomeTop-300x250@300x250": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "tcom_mweb_300x250_70@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "tcom_mweb_300x250_100@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dmwMisspellThesBottom@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.6"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    zoneId: "342616",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-misspell-top-300x250@300x250": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_mweb_300x250_40@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "atf",
                    floor: "0.6"
                },
                "dmwSerpThesTop@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_desktop_728x90_100@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    zoneId: "342616",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_desktop_728x90_80@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "tcom_desktop_300x250_90@300x250": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_mweb_300x250_50@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dmwHomeThesBottom@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dcomHomeTop-728x90@728x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "tcom_mweb_300x250_90@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_serp_dkt_btf_300x600_4@300x600": {
                    zoneId: "342616",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "tcomHomeTop-728x90@728x90": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "dcom_quiz_mweb_atf_320x50_pos1@320x50": {
                    zoneId: "167548",
                    siteId: "40358",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_serp_dkt_btf_970x250_5@970x250": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_writingtool_dkt_atf_728x90_pos1@728x90": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    zoneId: "167548",
                    siteId: "40358",
                    position: "atf",
                    floor: "0.18"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    zoneId: "342616",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "tcom_mweb_300x250_120@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "DcomHomeDesktop_728x90_pos30@970x250": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.6"
                },
                "tcomHomeDesktop_728x90_pos30@728x90": {
                    zoneId: "1488128",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-serp-lb-728x90@970x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.6"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    zoneId: "756176",
                    siteId: "40358",
                    position: "btf",
                    floor: "0.18"
                },
                "dmwSerpThesBottom@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    zoneId: "167550",
                    siteId: "40358",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_desktop_300x250_50@300x250": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_desktop_728x90_170@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "tcomHomeDesktop_728x90_pos30@970x250": {
                    zoneId: "1488128",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "dcom-serp-lb-728x90@970x250": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_serp_dkt_btf_970x90_5@970x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    zoneId: "167536",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.6"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    zoneId: "167550",
                    siteId: "40358",
                    position: "btf",
                    floor: "0.18"
                },
                "dcomHomeBot-728x90@728x90": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.6"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    zoneId: "167550",
                    siteId: "40358",
                    position: "btf",
                    floor: "0.18"
                },
                "DcomHomeDesktop_728x90_pos30@728x90": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_btf_2@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.6"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_writingtool_dkt_atf_160x600_pos10@160x600": {
                    zoneId: "1488132",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_btf_2@970x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_desktop_300x250_140@300x250": {
                    zoneId: "1488124",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_writingtool_mweb_atf_320x50_pos1@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_desktop_728x90_40@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos10@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_mweb_300x250_110@300x250": {
                    zoneId: "250988",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.18"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    zoneId: "167548",
                    siteId: "40358",
                    position: "atf",
                    floor: "0.6"
                },
                "tcom_writingprompt_dkt_atf_728x90_pos1@728x90": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "tcom_writingprompt_mweb_atf_320x50_pos1@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_desktop_728x90_160@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "dmwHomeThesTop@320x50": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "atf",
                    floor: "0.6"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    zoneId: "173412",
                    siteId: "41374",
                    position: "atf",
                    floor: "0.18"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    zoneId: "167536",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    zoneId: "167536",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-serp-bot-300x250@300x250": {
                    zoneId: "167538",
                    siteId: "37926",
                    position: "btf",
                    floor: "0.18"
                },
                "dcom-no-result-top-300x250@300x250": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.18"
                },
                "dcomHomeTop-728x90@970x90": {
                    zoneId: "158746",
                    siteId: "37926",
                    position: "atf",
                    floor: "0.6"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    zoneId: "342616",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                },
                "thesaurus_serp_btf_2@970x250": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.6"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    zoneId: "250986",
                    siteId: "54244",
                    position: "atf",
                    floor: "0.18"
                },
                "tcom_desktop_728x90_120@728x90": {
                    zoneId: "342618",
                    siteId: "41374",
                    position: "btf",
                    floor: "0.18"
                }
            }
        },
        ix: {
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            pt: 0,
            serverSideEnabled: "0",
            "in-app": 0,
            amp: 0,
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    siteID: "299153",
                    id: "23"
                },
                "tcom_desktop_300x250_110@300x250": {
                    siteID: "220869",
                    id: "51"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    siteID: "220873",
                    id: "3"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    siteID: "220877",
                    id: "1"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    siteID: "299147",
                    id: "17"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    siteID: "210649",
                    id: "15"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos20@320x50": {
                    siteID: "299150",
                    id: "36"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos40@320x50": {
                    siteID: "299150",
                    id: "38"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    siteID: "220877",
                    id: "1"
                },
                "tcom_desktop_300x250_70@300x250": {
                    siteID: "220869",
                    id: "47"
                },
                "tcom_mweb_300x250_60@300x250": {
                    siteID: "299153",
                    id: "60"
                },
                "tcom_desktop_728x90_130@728x90": {
                    siteID: "210649",
                    id: "53"
                },
                "dcomHomeTop-300x250@300x250": {
                    siteID: "220872",
                    id: "2"
                },
                "dmwMisspellThesTop@320x50": {
                    siteID: "220870",
                    id: "1"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    siteID: "220869",
                    id: "12"
                },
                "tcom_writingprompt_dkt_atf_300x250_pos10@300x250": {
                    siteID: "210648",
                    id: "33"
                },
                "tcomHomeBot-728x90@728x90": {
                    siteID: "210649",
                    id: "2"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    siteID: "299157",
                    id: "27"
                },
                "dcom-serp-lb-728x90@728x90": {
                    siteID: "220875",
                    id: "1"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    siteID: "220874",
                    id: "4"
                },
                "tcom_desktop_300x250_150@300x250": {
                    siteID: "220869",
                    id: "55"
                },
                "dcomHomeTop-728x90@970x250": {
                    siteID: "220875",
                    id: "1"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos30@320x50": {
                    siteID: "299150",
                    id: "37"
                },
                "tcom_mweb_300x250_80@300x250": {
                    siteID: "299153",
                    id: "62"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    siteID: "312689",
                    id: "14"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    siteID: "220874",
                    id: "4"
                },
                "tcom_desktop_728x90_60@728x90": {
                    siteID: "210649",
                    id: "46"
                },
                "tcomHomeTop-728x90@970x90": {
                    siteID: "210651",
                    id: "4"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    siteID: "220872",
                    id: "8"
                },
                "dcom_serp_dkt_btf_300x600_4@300x600": {
                    siteID: "299146",
                    id: "16"
                },
                "dcom_quiz_dkt_atf_728x90_pos1@728x90": {
                    siteID: "220875",
                    id: "29"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    siteID: "220876",
                    id: "5"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    siteID: "210651",
                    id: "1"
                },
                "tcomHomeTop-300x250@300x250": {
                    siteID: "210648",
                    id: "1"
                },
                "tcom_mweb_300x250_70@300x250": {
                    siteID: "299153",
                    id: "61"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    siteID: "220875",
                    id: "1"
                },
                "tcom_mweb_300x250_100@300x250": {
                    siteID: "299153",
                    id: "64"
                },
                "dmwMisspellThesBottom@300x250": {
                    siteID: "220871",
                    id: "2"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    siteID: "299148",
                    id: "18"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    siteID: "220869",
                    id: "11"
                },
                "dcom-misspell-top-300x250@300x250": {
                    siteID: "220872",
                    id: "2"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    siteID: "220872",
                    id: "2"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    siteID: "224847",
                    id: "5"
                },
                "tcom_mweb_300x250_40@300x250": {
                    siteID: "299153",
                    id: "58"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    siteID: "220876",
                    id: "4"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    siteID: "299150",
                    id: "20"
                },
                "dmwSerpThesTop@320x50": {
                    siteID: "220870",
                    id: "1"
                },
                "tcom_desktop_728x90_100@728x90": {
                    siteID: "210649",
                    id: "50"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    siteID: "220869",
                    id: "3"
                },
                "tcom_desktop_728x90_80@728x90": {
                    siteID: "210649",
                    id: "48"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    siteID: "220875",
                    id: "1"
                },
                "tcom_desktop_300x250_90@300x250": {
                    siteID: "220869",
                    id: "49"
                },
                "tcom_mweb_300x250_50@300x250": {
                    siteID: "299153",
                    id: "59"
                },
                "dmwHomeThesBottom@300x250": {
                    siteID: "220871",
                    id: "2"
                },
                "dcomHomeTop-728x90@728x90": {
                    siteID: "220875",
                    id: "1"
                },
                "tcom_mweb_300x250_90@300x250": {
                    siteID: "299153",
                    id: "63"
                },
                "tcom_serp_dkt_btf_300x600_4@300x600": {
                    siteID: "299154",
                    id: "24"
                },
                "tcomHomeTop-728x90@728x90": {
                    siteID: "210651",
                    id: "3"
                },
                "dcom_quiz_mweb_atf_320x50_pos1@320x50": {
                    siteID: "220877",
                    id: "28"
                },
                "tcom_serp_dkt_btf_970x250_5@970x250": {
                    siteID: "299155",
                    id: "25"
                },
                "tcom_writingtool_dkt_atf_728x90_pos1@728x90": {
                    siteID: "210651",
                    id: "31"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    siteID: "220878",
                    id: "2"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    siteID: "220869",
                    id: "10"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    siteID: "299152",
                    id: "22"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    siteID: "299149",
                    id: "19"
                },
                "tcom_mweb_300x250_120@300x250": {
                    siteID: "299153",
                    id: "66"
                },
                "DcomHomeDesktop_728x90_pos30@970x250": {
                    siteID: "429373",
                    id: "40"
                },
                "tcomHomeDesktop_728x90_pos30@728x90": {
                    siteID: "429374",
                    id: "41"
                },
                "dcom-serp-lb-728x90@970x90": {
                    siteID: "220875",
                    id: "7"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    siteID: "220879",
                    id: "3"
                },
                "dmwSerpThesBottom@300x250": {
                    siteID: "220871",
                    id: "2"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    siteID: "220880",
                    id: "4"
                },
                "tcom_desktop_300x250_50@300x250": {
                    siteID: "220869",
                    id: "45"
                },
                "tcom_desktop_728x90_170@728x90": {
                    siteID: "210649",
                    id: "57"
                },
                "tcomHomeDesktop_728x90_pos30@970x250": {
                    siteID: "429375",
                    id: "42"
                },
                "dcom-serp-lb-728x90@970x250": {
                    siteID: "224848",
                    id: "6"
                },
                "tcom_serp_dkt_btf_970x90_5@970x90": {
                    siteID: "299156",
                    id: "26"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    siteID: "299146",
                    id: "16"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    siteID: "220880",
                    id: "3"
                },
                "dcomHomeBot-728x90@728x90": {
                    siteID: "220876",
                    id: "3"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    siteID: "210651",
                    id: "6"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    siteID: "220880",
                    id: "3"
                },
                "DcomHomeDesktop_728x90_pos30@728x90": {
                    siteID: "429372",
                    id: "39"
                },
                "thesaurus_serp_btf_2@728x90": {
                    siteID: "210649",
                    id: "4"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    siteID: "210648",
                    id: "7"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    siteID: "220874",
                    id: "4"
                },
                "tcom_writingtool_dkt_atf_160x600_pos10@160x600": {
                    siteID: "429376",
                    id: "43"
                },
                "thesaurus_serp_btf_2@970x90": {
                    siteID: "210649",
                    id: "9"
                },
                "tcom_desktop_300x250_140@300x250": {
                    siteID: "220869",
                    id: "54"
                },
                "dcom_serp_dkt_btf_970x250_5@970x250": {
                    siteID: "299147",
                    id: "17"
                },
                "tcom_writingtool_mweb_atf_320x50_pos1@320x50": {
                    siteID: "299150",
                    id: "30"
                },
                "tcom_desktop_728x90_40@728x90": {
                    siteID: "210649",
                    id: "44"
                },
                "dcom_serp_dkt_btf_970x90_5@970x90": {
                    siteID: "299148",
                    id: "18"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos10@320x50": {
                    siteID: "299150",
                    id: "35"
                },
                "tcom_mweb_300x250_110@300x250": {
                    siteID: "299153",
                    id: "65"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    siteID: "220877",
                    id: "1"
                },
                "tcom_writingprompt_dkt_atf_728x90_pos1@728x90": {
                    siteID: "210651",
                    id: "32"
                },
                "tcom_writingprompt_mweb_atf_320x50_pos1@320x50": {
                    siteID: "299150",
                    id: "34"
                },
                "tcom_desktop_728x90_160@728x90": {
                    siteID: "210649",
                    id: "56"
                },
                "dmwHomeThesTop@320x50": {
                    siteID: "220870",
                    id: "1"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    siteID: "210648",
                    id: "2"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    siteID: "220873",
                    id: "3"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    siteID: "220873",
                    id: "3"
                },
                "dcom-serp-bot-300x250@300x250": {
                    siteID: "220874",
                    id: "4"
                },
                "dcom-no-result-top-300x250@300x250": {
                    siteID: "220872",
                    id: "2"
                },
                "dcomHomeTop-728x90@970x90": {
                    siteID: "220875",
                    id: "4"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    siteID: "220869",
                    id: "13"
                },
                "thesaurus_serp_btf_2@970x250": {
                    siteID: "210649",
                    id: "8"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    siteID: "299151",
                    id: "21"
                },
                "tcom_desktop_728x90_120@728x90": {
                    siteID: "210649",
                    id: "52"
                }
            }
        },
        criteo: {
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_300x250_110@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos20@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos40@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_300x250_70@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_60@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_130@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomHomeTop-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dmwMisspellThesTop@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingprompt_dkt_atf_300x250_pos10@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_home_dkt_atf_300x250_20@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_home_dkt_atf_728x90_1@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcomHomeBot-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-lb-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_300x250_150@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomHomeTop-728x90@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos30@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_80@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_60@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom_quiz_dkt_atf_728x90_pos1@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcomHomeTop-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_70@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_mweb_atf_320x50_1@320x100": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_serp_dkt_atf_300x250_30@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_100@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dmwMisspellThesBottom@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-misspell-top-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_serp_dkt_btf_300x250_20@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_40@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dmwSerpThesTop@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_100@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_80@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_300x250_90@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_50@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dmwHomeThesBottom@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomHomeTop-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_90@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_home_dkt_atf_728x90_1@970x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_dkt_btf_300x600_4@300x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcomHomeTop-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom_quiz_mweb_atf_320x50_pos1@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_dkt_btf_970x250_5@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingtool_dkt_atf_728x90_pos1@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_home_dkt_atf_728x90_1@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_120@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "DcomHomeDesktop_728x90_pos30@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcomHomeDesktop_728x90_pos30@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-lb-728x90@970x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dmwSerpThesBottom@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_300x250_50@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_170@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_serp_dkt_atf_160x600_1@160x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcomHomeDesktop_728x90_pos30@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_serp_dkt_atf_728x90_10@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-lb-728x90@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_dkt_btf_970x90_5@970x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomHomeBot-728x90@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "DcomHomeDesktop_728x90_pos30@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_btf_2@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingtool_dkt_atf_160x600_pos10@160x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_300x250_140@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_serp_dkt_atf_160x600_1@300x600": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingtool_mweb_atf_320x50_pos1@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileSERPTopAd-320x50@320x100": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_40@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos10@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_mweb_300x250_110@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingprompt_dkt_atf_728x90_pos1@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_writingprompt_mweb_atf_320x50_pos1@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_160@728x90": {
                    zoneId: "",
                    networkId: "8791"
                },
                "lexi_home_dkt_btf_300x250_10@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dmwHomeThesTop@320x50": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-serp-bot-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "dcom-no-result-top-300x250@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "thesaurus_serp_btf_2@970x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    zoneId: "",
                    networkId: "8791"
                },
                "tcom_desktop_728x90_120@728x90": {
                    zoneId: "",
                    networkId: "8791"
                }
            }
        },
        triplelift: {
            rev_share: "0.0",
            timeout: 0,
            throttle: "100",
            serverSideEnabled: "0",
            amp: 0,
            kgp: "_DIV_@_W_x_H_",
            klm: {
                "crb-ad-slot-atw-origin-mobile@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "tcom_serp_mweb_btf_300x250_4@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "tcom_desktop_300x250_110@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-no-result-mid-300x250@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcomMobileSERPTopAd-320x50@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "dcom-serp-bottom-lb-728x90@970x250": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "thesaurus_serp_728x90_p6@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos20@320x50": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos40@320x50": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "dcomMobileMisspellTop-320x50@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "tcom_desktop_300x250_70@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_mweb_300x250_60@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "tcom_desktop_728x90_130@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcomHomeTop-300x250@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dmwMisspellThesTop@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "thesaurus_serp_300x250_p5@300x600": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_writingprompt_dkt_atf_300x250_pos10@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcomHomeBot-728x90@728x90": {
                    inventoryCode: "Thesaurus_desktop_header_btf_Prebid"
                },
                "tcom_serp_dkt_atf_728x90_3@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "crbAdSlot0@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crbAdSlot4@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "dcom-no-result-bot-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "dcom-serp-lb-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crbAdSlot1@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-serp-bot-300x250_e@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_desktop_300x250_150@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "dcomHomeTop-728x90@970x250": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos30@320x50": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "tcom_mweb_300x250_80@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "thesaurus_serp_728x90_p5@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcom-serp-bot-300x250_d@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_desktop_728x90_60@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcom-serp-a-top-300x250@300x600": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom_serp_dkt_btf_300x600_4@300x600": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "crbAdSlot3@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crbAdSlot2@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "crbAdSlot1@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "dcom-serp-bottom-lb-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "thesaurus_serp_atf_728x90@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "tcomHomeTop-300x250@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_mweb_300x250_70@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "dcom-misspell-lb-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcom_mweb_300x250_100@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "dmwMisspellThesBottom@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dcom-serp-bottom-lb-728x90@970x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "thesaurus_serp_300x250_p5@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-misspell-top-300x250@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-serp-a-top-300x250@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "crbAdSlot0-5@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "thesaurus_serp_atf_728x90@970x250": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "tcom_mweb_300x250_40@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "crb-ad-slot-atw-hot-mobile@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dcom-misspell-bottom-lb-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "tcom_serp_mweb_atf_320x50_1@320x50": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "crb-ad-slot-middle@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "crb-ad-slot-bottom@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "dmwSerpThesTop@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "tcom_desktop_728x90_100@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "crbAdSlot6@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crb-ad-slot-top@970x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "thesaurus_serp_btf_300x252@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_desktop_728x90_80@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcom-no-result-lb-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcom_desktop_300x250_90@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_mweb_300x250_50@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "dmwHomeThesBottom@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dcomHomeTop-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcom_mweb_300x250_90@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "crb-ad-slot-middle@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcom_serp_dkt_btf_300x600_4@300x600": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_serp_dkt_btf_970x250_5@970x250": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "tcom_writingtool_dkt_atf_728x90_pos1@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcomMobileSERPDisplayTopAd-300x250@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "crbAdSlot4@300x250": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "thesaurus_serp_btf_300x252@300x600": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_serp_mweb_mid_300x250_3@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "crb-ad-slot-top@970x250": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crb-ad-slot-middle@300x600": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "crbAdSlot5@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crb-ad-slot-bottom@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "dcom_serp_dkt_atf_728x90_3@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcom_mweb_300x250_120@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "DcomHomeDesktop_728x90_pos30@970x250": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crbAdSlot2@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcomHomeDesktop_728x90_pos30@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcom-serp-lb-728x90@970x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "crb-ad-slot-top@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "dcomMobileSERPDisplayMidAd-300x250@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dmwSerpThesBottom@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dcomMobileSERPDisplayBotAd-300x250@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "tcom_desktop_300x250_50@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_desktop_728x90_170@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "crb-ad-slot-bottom@970x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "tcomHomeDesktop_728x90_pos30@970x250": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "crb-ad-slot-bottom@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-serp-lb-728x90@970x250": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcom_serp_dkt_btf_970x90_5@970x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcom-serp-a-mid-300x250@300x600": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcomMobileHPBotAd-300x250@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dcomHomeBot-728x90@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "thesaurus_serp_atf_728x90@970x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcomMobileMisspellBottomAd-300x250@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "DcomHomeDesktop_728x90_pos30@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "thesaurus_serp_btf_2@728x90": {
                    inventoryCode: "Thesaurus_desktop_header_btf_Prebid"
                },
                "thesaurus_serp_atf_300x250@300x600": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-serp-bot-300x250_c@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_writingtool_dkt_atf_160x600_pos10@160x600": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "crbAdSlot0@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "thesaurus_serp_btf_2@970x90": {
                    inventoryCode: "Thesaurus_desktop_header_btf_Prebid"
                },
                "crbAdSlot3@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_desktop_300x250_140@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom_serp_dkt_btf_970x250_5@970x250": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "tcom_writingtool_mweb_atf_320x50_pos1@320x50": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "tcom_desktop_728x90_40@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "dcom_serp_dkt_btf_970x90_5@970x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_BTF_header_Prebid"
                },
                "tcom_writingprompt_mweb_btf_320x50_pos10@320x50": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "tcom_mweb_300x250_110@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "dcomMobileHPTopAd-320x50@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "tcom_writingprompt_dkt_atf_728x90_pos1@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "tcom_writingprompt_mweb_atf_320x50_pos1@320x50": {
                    inventoryCode: "Thesaurus_desktop_directdisplay_Prebid"
                },
                "crb-ad-slot-top@728x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "tcom_desktop_728x90_160@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                },
                "crb-ad-slot-atw-usage-mobile@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dmwHomeThesTop@320x50": {
                    inventoryCode: "Dictionary_mobile_leaderboard_header_Prebid"
                },
                "thesaurus_serp_atf_300x250@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-misspell-mid-300x250@300x250": {
                    inventoryCode: "Dictionary_mobile_300x250_header_Prebid"
                },
                "dcom-serp-a-mid-300x250@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-serp-bot-300x250@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcom-no-result-top-300x250@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "dcomHomeTop-728x90@970x90": {
                    inventoryCode: "Dictionary_desktop_leaderboard_header_Prebid"
                },
                "thesaurus_serp_300x250_p6@300x250": {
                    inventoryCode: "Thesaurus_desktop_rightrail_300x250_header_Prebid"
                },
                "thesaurus_serp_btf_2@970x250": {
                    inventoryCode: "Thesaurus_desktop_header_btf_Prebid"
                },
                "crb-ad-slot-aside@300x250": {
                    inventoryCode: "Dictionary_desktop_rightrail_300x250_header_Prebid"
                },
                "tcom_serp_mweb_atf_300x250_2@300x250": {
                    inventoryCode: "Thesaurus_mobile_300x250_header_Prebid"
                },
                "tcom_desktop_728x90_120@728x90": {
                    inventoryCode: "Thesaurus_desktop_leaderboard_header_Prebid"
                }
            }
        }
    },
    t.identityPartners = {}
}
), (function(e, t) {
    t.COMMON = {
        BID_PRECISION: 2,
        DEAL_KEY_FIRST_PART: "pwtdeal_",
        DEAL_KEY_VALUE_SEPARATOR: "_-_",
        PREBID_PREFIX: "PB_",
        CONFIG: "config",
        DIV_ID: "divID",
        PARAMS: "params",
        SIZES: "sizes",
        HEIGHT: "height",
        WIDTH: "width",
        SLOTS: "slots",
        KEY_GENERATION_PATTERN_VALUE: "kgpv",
        KEY_VALUE_PAIRS: "kvp",
        IMPRESSION_ID: "iid",
        PARENT_ADAPTER_PREBID: "prebid",
        ANALYTICS_CURRENCY: "USD",
        NATIVE_MEDIA_TYPE_CONFIG: "nativeConfig",
        NATIVE_ONLY: "nativeOnly",
        OW_CLICK_NATIVE: "openwrap-native-click",
        BID_ID: "owbidid",
        AD_SERVER_CURRENCY: "adServerCurrency",
        SINGLE_IMPRESSION: "singleImpression",
        PREBID_NAMESPACE: "owpbjs",
        ENABLE_USER_ID: "identityEnabled",
        IDENTITY_PARTNERS: "identityPartners",
        IDENTITY_CONSUMERS: "identityConsumers",
        IDENTITY_ONLY: "identityOnly",
        GAM: "eb",
        TAM: "tam",
        PREBID: "prebid",
        PROTOCOL: "https://",
        SLOT_CONFIG: "slotConfig",
        DEFAULT: "default",
        ADSERVER: "adserver",
        SCHAINOBJECT: "sChainObj",
        SCHAIN: "sChain",
        PBJS_NAMESPACE: "prebidObjName"
    },
    t.CONFIG = {
        GLOBAL: "global",
        ADAPTERS: "adapters",
        COMMON: "pwt",
        TIMEOUT: "t",
        KEY_GENERATION_PATTERN: "kgp",
        REGEX_KEY_GENERATION_PATTERN: "kgp_rx",
        REGEX_KEY_LOOKUP_MAP: "klm_rx",
        KEY_LOOKUP_MAP: "klm",
        SERVER_SIDE_KEY: "sk",
        PUBLISHER_ID: "pubid",
        PROFILE_ID: "pid",
        PROFILE_VERSION_ID: "pdvid",
        LOGGER_URL: "dataURL",
        TRACKER_URL: "winURL",
        REV_SHARE: "rev_share",
        THROTTLE: "throttle",
        BID_PASS_THROUGH: "pt",
        GLOBAL_KEY_VALUE: "gkv",
        MASK_BIDS: "maksBids",
        META_DATA_PATTERN: "metaDataPattern",
        SEND_ALL_BIDS: "sendAllBids",
        SERVER_SIDE_ENABLED: "serverSideEnabled",
        GDPR_CONSENT: "gdpr",
        CONSENT_STRING: "cns",
        GDPR_CMPAPI: "cmpApi",
        GDPR_TIMEOUT: "gdprTimeout",
        GDPR_AWC: "awc",
        DEFAULT_GDPR_CMPAPI: "iab",
        DEFAULT_GDPR_TIMEOUT: 1e4,
        DEFAULT_GDPR_AWC: "0",
        DEFAULT_SINGLE_IMPRESSION: "0",
        DEFAULT_USER_ID_MODULE: "0",
        DEFAULT_IDENTITY_ONLY: "0",
        DEFAULT_GDPR_CONSENT: "0",
        DISABLE_AJAX_TIMEOUT: "disableAjaxTimeout",
        CCPA_CONSENT: "ccpa",
        CCPA_CMPAPI: "ccpaCmpApi",
        CCPA_TIMEOUT: "ccpaTimeout",
        DEFAULT_CCPA_CMPAPI: "iab",
        DEFAULT_CCPA_TIMEOUT: 1e4,
        CACHE_PATH: "/cache",
        CACHE_URL: "https://ow.pubmatic.com",
        VIDEO_PARAM: "video"
    },
    t.METADATA_MACROS = {
        WIDTH: "_W_",
        HEIGHT: "_H_",
        PARTNER: "_P_",
        GROSS_ECPM: "_GE_",
        NET_ECPM: "_NE_",
        BID_COUNT: "_BC_",
        PARTNER_COUNT: "_PC_"
    },
    t.MACROS = {
        WIDTH: "_W_",
        HEIGHT: "_H_",
        AD_UNIT_ID: "_AU_",
        AD_UNIT_INDEX: "_AUI_",
        INTEGER: "_I_",
        DIV: "_DIV_"
    },
    t.SLOT_STATUS = {
        CREATED: 0,
        PARTNERS_CALLED: 1,
        TARGETING_ADDED: 2,
        DISPLAYED: 3
    },
    t.WRAPPER_TARGETING_KEYS = {
        BID_ID: "pwtsid",
        BID_STATUS: "pwtbst",
        BID_ECPM: "pwtecp",
        BID_DEAL_ID: "pwtdid",
        BID_ADAPTER_ID: "pwtpid",
        BID_SIZE: "pwtsz",
        PUBLISHER_ID: "pwtpubid",
        PROFILE_ID: "pwtprofid",
        PROFILE_VERSION_ID: "pwtverid",
        META_DATA: "pwtm",
        PLATFORM_KEY: "pwtplt",
        USER_IDS: "pwtuid",
        CACHE_ID: "pwtcid",
        CACHE_URL: "pwtcurl",
        CACHE_PATH: "pwtcpath"
    },
    t.IGNORE_PREBID_KEYS = {
        hb_bidder: 1,
        hb_adid: 1,
        hb_pb: 1,
        hb_size: 1,
        hb_deal: 1,
        hb_uuid: 1,
        hb_cache_host: 1,
        hb_cache_id: 1
    },
    t.LOGGER_PIXEL_PARAMS = {
        TIMESTAMP: "tst",
        PAGE_URL: "purl",
        PAGE_DOMAIN: "orig",
        TIMEOUT: "to"
    },
    t.MESSAGES = {
        M1: ": In fetchbids.",
        M2: ": Throttled.",
        M3: ": adapter must implement the fetchBids() function.",
        M4: "BidManager: entry ",
        M5: ": Callback.",
        M6: "bidAlreadExists : ",
        M7: ": Exiting from fetchBids.",
        M8: ". Config not found, ignored.",
        M9: ". Config ignored.",
        M10: "Bid is rejected as ecpm is NULL.",
        M11: "Bid is rejected as ecpm is NaN: ",
        M12: "Existing bid ecpm: ",
        M13: ", is lower than new bid ecpm ",
        M14: ", so we are replacing bid from partner ",
        M15: ", is greater than new bid ecpm ",
        M16: ", so we are not replacing bid from partner ",
        M17: "Post timeout bid, ignored.",
        M18: "Bid is selected for partner ",
        M19: ": Found winning adapterID: ",
        M20: "Bid is rejected as ecpm is empty string.",
        M21: ": error in respose handler.",
        M22: "Bid is rejected as ecpm is <= 0.",
        M23: "Existing bid is default-bid with zero ecpm, thus replacing it with the new bid from partner ",
        M24: "Passsed argument is not a bidAdaptor",
        M25: "Bid details not found for bidID: ",
        M26: "Currency Module is Activated. Ad Server Currency is: ",
        M27: "Invalid regex pattern ",
        M28: "Unable to match regex pattern as kgpv length is not 3",
        M29: "Unable to parse Partner configuration",
        IDENTITY: {
            M1: "Unable to get User Id from OpenIdentity",
            M2: "Setting UserIds to EB ",
            M3: "Unable to parse User ID configuration",
            M4: "User Id Condiguration Sent to prebid ",
            M5: "Identity only enabled, no need to process. Calling Original function ",
            M6: " function is not available. Make sure userId module is included."
        }
    },
    t.PLATFORM_VALUES = {
        DISPLAY: "display",
        NATIVE: "native",
        VIDEO: "video"
    },
    t.FORMAT_VALUES = {
        BANNER: "banner",
        VIDEO: "video",
        NATIVE: "native",
        OTHER: "other"
    },
    t.HOOKS = {
        PREBID_SET_CONFIG: "HookForPrebidSetConfig",
        PREBID_REQUEST_BIDS: "HookForPrebidRequestBids",
        BID_RECEIVED: "HookForBidReceived",
        POST_AUCTION_KEY_VALUES: "HookForPostAuctionKeyValues"
    },
    t.SRA_ENABLED_BIDDERS = {
        rubicon: 1,
        improvedigital: 2
    },
    t.EXCLUDE_IDENTITY_PARAMS = ["rev_share", "timeout", "throttle"],
    t.TOLOWERCASE_IDENTITY_PARAMS = ["storage.type"],
    t.JSON_VALUE_KEYS = ["params.clientIdentifier"],
    t.AD_SERVER = {
        DFP: "DFP",
        CUSTOM: "CUSTOM"
    }
}
), (function(e, t, o) {
    function i(e, t) {
        this.adapterID = e,
        this.kgpv = t,
        this.bidID = d.getUniqueIdentifierStr(),
        this.grossEcpm = 0,
        this.netEcpm = 0,
        this.defaultBid = 0,
        this.adHtml = "",
        this.adUrl = "",
        this.height = 0,
        this.width = 0,
        this.creativeID = "",
        this.keyValuePairs = {},
        this.isPostTimeout = !1,
        this.receivedTime = 0,
        this.isServerSide = r.isServerSideAdapter(e) ? 1 : 0,
        this.dealID = "",
        this.dealChannel = "",
        this.isWinningBid = !1,
        this.status = 0,
        this.serverSideResponseTime = 0,
        this.mi = void 0,
        this.originalCpm = 0,
        this.originalCurrency = "",
        this.analyticsGrossCpm = 0,
        this.analyticsNetCpm = 0,
        this.native = void 0,
        this.adFormat = void 0,
        this.regexPattern = void 0,
        this.cacheUUID = void 0,
        this.sspID = "",
        this.vastUrl = void 0,
        this.vastCache = void 0,
        this.renderer = void 0,
        this.pbBid = void 0
    }
    var r = o(2)
      , n = o(4)
      , d = o(1)
      , s = function(e, t) {
        return window.parseFloat((e * r.getAdapterRevShare(t)).toFixed(n.COMMON.BID_PRECISION))
    };
    i.prototype.setServerSideResponseTime = function(e) {
        this.serverSideResponseTime = e
    }
    ,
    i.prototype.getServerSideResponseTime = function() {
        return this.serverSideResponseTime
    }
    ,
    i.prototype.getServerSideStatus = function() {
        return this.isServerSide
    }
    ,
    i.prototype.setServerSideStatus = function(e) {
        this.isServerSide = e
    }
    ,
    i.prototype.getAdapterID = function() {
        return this.adapterID
    }
    ,
    i.prototype.getBidID = function() {
        return this.bidID
    }
    ,
    i.prototype.setGrossEcpm = function(e) {
        return null === e ? (d.log(n.MESSAGES.M10),
        d.log(this),
        this) : d.isString(e) && (e = e.replace(/\s/g, ""),
        0 === e.length) ? (d.log(n.MESSAGES.M20),
        d.log(this),
        this) : window.isNaN(e) ? (d.log(n.MESSAGES.M11 + e),
        d.log(this),
        this) : (e = window.parseFloat(e.toFixed(n.COMMON.BID_PRECISION)),
        this.grossEcpm = e,
        this.netEcpm = s(this.grossEcpm, this.getAdapterID()),
        this)
    }
    ,
    i.prototype.getGrossEcpm = function(e) {
        return r.getAdServerCurrency() && this.analyticsGrossCpm && e ? this.analyticsGrossCpm : this.grossEcpm
    }
    ,
    i.prototype.getNetEcpm = function(e) {
        return r.getAdServerCurrency() && this.analyticsNetCpm && e ? this.analyticsNetCpm : this.netEcpm
    }
    ,
    i.prototype.setDefaultBidStatus = function(e) {
        return this.defaultBid = e,
        this
    }
    ,
    i.prototype.getDefaultBidStatus = function() {
        return this.defaultBid
    }
    ,
    i.prototype.setAdHtml = function(e) {
        return this.adHtml = e,
        this.setAdFormat(e),
        this
    }
    ,
    i.prototype.getAdHtml = function() {
        return this.adHtml
    }
    ,
    i.prototype.setAdUrl = function(e) {
        return this.adUrl = e,
        this
    }
    ,
    i.prototype.getAdUrl = function() {
        return this.adUrl
    }
    ,
    i.prototype.setHeight = function(e) {
        return this.height = e,
        this
    }
    ,
    i.prototype.getHeight = function() {
        return this.height
    }
    ,
    i.prototype.setWidth = function(e) {
        return this.width = e,
        this
    }
    ,
    i.prototype.getWidth = function() {
        return this.width
    }
    ,
    i.prototype.getKGPV = function(e) {
        return !e && this.regexPattern ? this.regexPattern : this.kgpv
    }
    ,
    i.prototype.setKeyValuePair = function(e, t) {
        return this.keyValuePairs[e.substr(0, 20)] = t,
        this
    }
    ,
    i.prototype.getKeyValuePairs = function() {
        return this.keyValuePairs
    }
    ,
    i.prototype.setPostTimeoutStatus = function() {
        return this.isPostTimeout = !0,
        this
    }
    ,
    i.prototype.getPostTimeoutStatus = function() {
        return this.isPostTimeout
    }
    ,
    i.prototype.setReceivedTime = function(e) {
        return this.receivedTime = e,
        this
    }
    ,
    i.prototype.getReceivedTime = function() {
        return this.receivedTime
    }
    ,
    i.prototype.setDealID = function(e) {
        return e && (this.dealID = e,
        this.dealChannel = this.dealChannel || "PMP",
        this.setKeyValuePair(n.COMMON.DEAL_KEY_FIRST_PART + this.adapterID, this.dealChannel + n.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.dealID + n.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.bidID)),
        this
    }
    ,
    i.prototype.getDealID = function() {
        return this.dealID
    }
    ,
    i.prototype.setDealChannel = function(e) {
        return this.dealID && e && (this.dealChannel = e,
        this.setKeyValuePair(n.COMMON.DEAL_KEY_FIRST_PART + this.adapterID, this.dealChannel + n.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.dealID + n.COMMON.DEAL_KEY_VALUE_SEPARATOR + this.bidID)),
        this
    }
    ,
    i.prototype.getDealChannel = function() {
        return this.dealChannel
    }
    ,
    i.prototype.setWinningBidStatus = function() {
        return this.isWinningBid = !0,
        this
    }
    ,
    i.prototype.getWinningBidStatus = function() {
        return this.isWinningBid
    }
    ,
    i.prototype.setStatus = function(e) {
        return this.status = e,
        this
    }
    ,
    i.prototype.getStatus = function() {
        return this.status
    }
    ,
    i.prototype.setSendAllBidsKeys = function() {
        if (this.setKeyValuePair(n.WRAPPER_TARGETING_KEYS.BID_ID + "_" + this.adapterID, this.bidID),
        this.setKeyValuePair(n.WRAPPER_TARGETING_KEYS.BID_STATUS + "_" + this.adapterID, this.getNetEcpm() > 0 ? 1 : 0),
        this.setKeyValuePair(n.WRAPPER_TARGETING_KEYS.BID_ECPM + "_" + this.adapterID, this.getNetEcpm().toFixed(n.COMMON.BID_PRECISION)),
        this.setKeyValuePair(n.WRAPPER_TARGETING_KEYS.BID_SIZE + "_" + this.adapterID, this.width + "x" + this.height),
        this.native) {
            var e = this.keyValuePairs
              , t = this;
            d.forEachOnObject(e, (function(e, o) {
                e.indexOf("native") >= 0 && t.setKeyValuePair(e + "_" + t.adapterID, o)
            }
            ))
        }
    }
    ,
    i.prototype.setMi = function(e) {
        return this.mi = e,
        this
    }
    ,
    i.prototype.getMi = function() {
        return this.mi
    }
    ,
    i.prototype.setOriginalCpm = function(e) {
        return this.originalCpm = window.parseFloat(e.toFixed(n.COMMON.BID_PRECISION)),
        this
    }
    ,
    i.prototype.getOriginalCpm = function() {
        return this.originalCpm
    }
    ,
    i.prototype.setOriginalCurrency = function(e) {
        return this.originalCurrency = e,
        this
    }
    ,
    i.prototype.getOriginalCurrency = function() {
        return this.originalCurrency
    }
    ,
    i.prototype.setAnalyticsCpm = function(e) {
        return this.analyticsGrossCpm = window.parseFloat(e.toFixed(n.COMMON.BID_PRECISION)),
        this.analyticsNetCpm = s(this.analyticsGrossCpm, this.getAdapterID()),
        this
    }
    ,
    i.prototype.getAnalyticsCpm = function() {
        return this.analyticsGrossCpm
    }
    ,
    i.prototype.getNative = function() {
        return this.native
    }
    ,
    i.prototype.setNative = function(e) {
        return this.native = e,
        this
    }
    ,
    i.prototype.getAdFormat = function() {
        return this.adFormat
    }
    ,
    i.prototype.setAdFormat = function(e) {
        return this.adFormat = d.getAdFormatFromBidAd(e),
        this
    }
    ,
    i.prototype.getRegexPattern = function() {
        return this.regexPattern
    }
    ,
    i.prototype.setRegexPattern = function(e) {
        return this.regexPattern = e,
        this
    }
    ,
    i.prototype.getcacheUUID = function() {
        return this.cacheUUID
    }
    ,
    i.prototype.setcacheUUID = function(e) {
        return this.cacheUUID = e,
        this.adFormat || (this.adFormat = n.FORMAT_VALUES.VIDEO),
        this
    }
    ,
    i.prototype.getsspID = function() {
        return this.sspID
    }
    ,
    i.prototype.setsspID = function(e) {
        return this.sspID = e,
        this
    }
    ,
    i.prototype.setRenderer = function(e) {
        return d.isEmptyObject(e) || (this.renderer = e),
        this
    }
    ,
    i.prototype.getRenderer = function() {
        return this.renderer
    }
    ,
    i.prototype.setVastCache = function(e) {
        return d.isString(e) && (this.vastCache = e),
        this
    }
    ,
    i.prototype.getVastCache = function() {
        return this.vastCache
    }
    ,
    i.prototype.setVastUrl = function(e) {
        return d.isString(e) && (this.vastUrl = e),
        this
    }
    ,
    i.prototype.getVastUrl = function() {
        return this.vastUrl
    }
    ,
    i.prototype.setVastXml = function(e) {
        return d.isString(e) && (this.vastXml = e),
        this
    }
    ,
    i.prototype.getVastXml = function() {
        return this.vastXml
    }
    ,
    i.prototype.setPbBid = function(e) {
        return this.pbbid = e,
        this
    }
    ,
    i.prototype.getPbBid = function() {
        return this.pbbid
    }
    ,
    i.prototype.updateBidId = function(e) {
        if (window.PWT.bidMap[e] && window.PWT.bidMap[e].adapters && Object.keys(window.PWT.bidMap[e].adapters).length > 0) {
            var t = window.PWT.bidMap[e].adapters[this.adapterID].bids[Object.keys(window.PWT.bidMap[e].adapters[this.adapterID].bids)[0]].bidID;
            t && this.adFormat == n.FORMAT_VALUES.VIDEO && (this.bidID = t)
        } else
            d.logWarning("Error in Updating BidId. It might be possible singleImpressionEnabled is false"),
            console.warn("Setup for video might not be correct. Try setting up Optimize MultiSize AdSlot to true.");
        return this
    }
    ,
    e.exports.Bid = i,
    t.createBid = function(e, t) {
        return new i(e,t)
    }
}
), (function(e, t, o) {
    function i(e) {
        l.isOwnProperty(window.PWT.bidMap, e) || (window.PWT.bidMap[e] = x.createBMEntry(e))
    }
    function r(e, t, o, i) {
        window.PWT.bidMap[e].setNewBid(t, o),
        window.PWT.bidIdMap[o.getBidID()] = {
            s: e,
            a: t
        },
        0 === o.getDefaultBidStatus() && "pubmaticServer" !== o.adapterID && l.vLogInfo(e, {
            type: "bid",
            bidder: t + (0 !== c.getBidPassThroughStatus(t) ? "(Passthrough)" : ""),
            bidDetails: o,
            latency: i,
            s2s: c.isServerSideAdapter(t),
            adServerCurrency: l.getCurrencyToDisplay()
        })
    }
    function n(e, t, o) {
        var i = ""
          , r = 0
          , n = 0
          , s = m.METADATA_MACROS
          , a = "g";
        l.forEachOnObject(t.adapters, (function(t, o) {
            "" != o.getLastBidID() && ("pubmaticServer" !== t && n++,
            l.forEachOnObject(o.bids, (function(t, o) {
                1 != o.getDefaultBidStatus() && 1 != o.getPostTimeoutStatus() && 0 != o.getGrossEcpm() && (r++,
                i += d(e, o))
            }
            )))
        }
        )),
        0 == i.length && (i = e),
        i = i.replace(new RegExp(s.BID_COUNT,a), r),
        i = i.replace(new RegExp(s.PARTNER_COUNT,a), n),
        o[m.WRAPPER_TARGETING_KEYS.META_DATA] = encodeURIComponent(i)
    }
    function d(e, t) {
        var o = m.METADATA_MACROS
          , i = "g";
        return e.replace(new RegExp(o.PARTNER,i), t.getAdapterID()).replace(new RegExp(o.WIDTH,i), t.getWidth()).replace(new RegExp(o.HEIGHT,i), t.getHeight()).replace(new RegExp(o.GROSS_ECPM,i), t.getGrossEcpm()).replace(new RegExp(o.NET_ECPM,i), t.getNetEcpm())
    }
    function s(e) {
        var t = null
          , o = {};
        return l.forEachOnObject(e.adapters, (function(e, i) {
            var r = u.auctionBidsCallBack(e, i, o, t);
            t = r.winningBid,
            o = r.keyValuePairs
        }
        )),
        null !== c.getMataDataPattern() && n(c.getMataDataPattern(), e, o),
        {
            wb: t,
            kvp: o
        }
    }
    function a(e) {
        for (var t in e)
            t.indexOf("native") >= 0 && 3 === t.split("_").length && delete e[t]
    }
    function _(e, t, o, i) {
        var r = this;
        return "" != t.getLastBidID() ? (l.forEachOnObject(t.bids, (function(t, n) {
            if (n.getPostTimeoutStatus() === !0)
                return {
                    winningBid: i,
                    keyValuePairs: o
                };
            if (1 !== n.getDefaultBidStatus() && 1 == c.getSendAllBidsStatus() && n.setSendAllBidsKeys(),
            null !== i)
                if (i.getNetEcpm() < n.getNetEcpm())
                    r.updateNativeTargtingKeys(o);
                else {
                    var d = n.getKeyValuePairs();
                    r.updateNativeTargtingKeys(d),
                    n.keyValuePairs = d
                }
            return l.copyKeyValueObject(o, n.getKeyValuePairs()),
            0 !== c.getBidPassThroughStatus(e) ? {
                winningBid: i,
                keyValuePairs: o
            } : (null == i ? i = n : i.getNetEcpm() < n.getNetEcpm() && (i = n),
            void 0)
        }
        )),
        {
            winningBid: i,
            keyValuePairs: o
        }) : {
            winningBid: i,
            keyValuePairs: o
        }
    }
    function p(e, t, o) {
        var i = t.getCreationTime() || 0
          , r = void 0
          , n = t.getImpressionID();
        const d = !0;
        if (t.getAnalyticEnabledStatus() && !t.getExpiredStatus()) {
            var s = {
                sn: e,
                sz: t.getSizes(),
                ps: []
            };
            t.setExpired(),
            o[n] = o[n] || [],
            l.forEachOnObject(t.adapters, (function(e, t) {
                1 != c.getBidPassThroughStatus(e) && l.forEachOnObject(t.bids, (function(t, o) {
                    var a = o.getReceivedTime();
                    return "pubmaticServer" === e ? (l.isOwnProperty(window.PWT.owLatency, n) && l.isOwnProperty(window.PWT.owLatency[n], "startTime") && l.isOwnProperty(window.PWT.owLatency[n], "endTime") ? r = window.PWT.owLatency[n].endTime - window.PWT.owLatency[n].startTime : (r = 0,
                    l.log("Logging pubmaticServer latency as 0 for impressionID: " + n)),
                    l.log("PSL logging: time logged for id " + n + " is " + r),
                    void 0) : ((1 != c.getAdapterMaskBidsStatus(e) || o.getWinningBidStatus() !== !1) && (o.getServerSideStatus() && -1 === o.getDefaultBidStatus() && -1 === o.getServerSideResponseTime() || ("pubmatic" !== e && "pubmatic2" !== e || !(o.getDefaultBidStatus() || o.getPostTimeoutStatus() && 0 == o.getGrossEcpm(d))) && s.ps.push({
                        pn: e,
                        bidid: t,
                        db: o.getDefaultBidStatus(),
                        kgpv: o.getKGPV(),
                        kgpsv: o.getKGPV(!0),
                        psz: o.getWidth() + "x" + o.getHeight(),
                        eg: o.getGrossEcpm(d),
                        en: o.getNetEcpm(d),
                        di: o.getDealID(),
                        dc: o.getDealChannel(),
                        l1: o.getServerSideStatus() ? o.getServerSideResponseTime() : a - i,
                        l2: 0,
                        ss: o.getServerSideStatus(),
                        t: o.getPostTimeoutStatus() === !1 ? 0 : 1,
                        wb: o.getWinningBidStatus() === !0 ? 1 : 0,
                        mi: o.getServerSideStatus() ? o.getMi() : void 0,
                        af: o.getAdFormat(),
                        ocpm: c.getAdServerCurrency() ? o.getOriginalCpm() : o.getGrossEcpm(),
                        ocry: c.getAdServerCurrency() ? o.getOriginalCurrency() : m.COMMON.ANALYTICS_CURRENCY,
                        piid: o.getsspID()
                    })),
                    void 0)
                }
                ))
            }
            )),
            o[n].push(s),
            void 0 !== r && (o[n].psl = r)
        }
    }
    var c = o(2)
      , m = o(4)
      , l = o(1)
      , x = (o(7),
    o(8))
      , u = this;
    t.createBidEntry = i,
    t.setSizes = function(e, t) {
        u.createBidEntry(e),
        window.PWT.bidMap[e].setSizes(t)
    }
    ,
    t.setCallInitTime = function(e, t) {
        u.createBidEntry(e),
        window.PWT.bidMap[e].setAdapterEntry(t)
    }
    ,
    t.setAllPossibleBidsReceived = function(e) {
        window.PWT.bidMap[e].setAllPossibleBidsReceived()
    }
    ,
    t.setBidFromBidder = function(e, t) {
        var o = t.getAdapterID()
          , i = (t.getBidID(),
        window.PWT.bidMap[e]);
        if (!l.isOwnProperty(window.PWT.bidMap, e))
            return l.logWarning("BidManager is not expecting bid for " + e + ", from " + o),
            void 0;
        var r = i.getCreationTime() + c.getTimeout() < t.getReceivedTime() ? !0 : !1
          , n = t.getReceivedTime() - i.getCreationTime();
        u.createBidEntry(e),
        l.log("BdManagerSetBid: divID: " + e + ", bidderID: " + o + ", ecpm: " + t.getGrossEcpm() + ", size: " + t.getWidth() + "x" + t.getHeight() + ", postTimeout: " + r + ", defaultBid: " + t.getDefaultBidStatus()),
        r === !0 && t.setPostTimeoutStatus();
        var d = i.getLastBidIDForAdapter(o);
        if ("" != d) {
            var s = i.getBid(o, d)
              , a = 1 === s.getDefaultBidStatus()
              , _ = -1 === s.getDefaultBidStatus();
            a || !r || _ ? (a && l.log(m.MESSAGES.M23 + o),
            a || s.getNetEcpm() < t.getNetEcpm() || _ ? (l.log(m.MESSAGES.M12 + s.getNetEcpm() + m.MESSAGES.M13 + t.getNetEcpm() + m.MESSAGES.M14 + o),
            u.storeBidInBidMap(e, o, t, n)) : l.log(m.MESSAGES.M12 + s.getNetEcpm() + m.MESSAGES.M15 + t.getNetEcpm() + m.MESSAGES.M16 + o)) : l.log(m.MESSAGES.M17)
        } else
            l.log(m.MESSAGES.M18 + o),
            u.storeBidInBidMap(e, o, t, n);
        r && setTimeout(window[m.COMMON.PREBID_NAMESPACE].triggerUserSyncs, 10)
    }
    ,
    t.storeBidInBidMap = r,
    t.resetBid = function(e, t) {
        l.vLogInfo(e, {
            type: "hr"
        }),
        delete window.PWT.bidMap[e],
        u.createBidEntry(e),
        window.PWT.bidMap[e].setImpressionID(t)
    }
    ,
    t.createMetaDataKey = n,
    t.replaceMetaDataMacros = d,
    t.auctionBids = s,
    t.updateNativeTargtingKeys = a,
    t.auctionBidsCallBack = _,
    t.getBid = function(e) {
        var t = null
          , o = null;
        if (l.isOwnProperty(window.PWT.bidMap, e)) {
            var i = u.auctionBids(window.PWT.bidMap[e]);
            t = i.wb,
            o = i.kvp,
            window.PWT.bidMap[e].setAnalyticEnabled(),
            t && t.getNetEcpm() > 0 ? (t.setStatus(1),
            t.setWinningBidStatus(),
            l.vLogInfo(e, {
                type: "win-bid",
                bidDetails: t,
                adServerCurrency: l.getCurrencyToDisplay()
            })) : l.vLogInfo(e, {
                type: "win-bid-fail"
            })
        }
        return {
            wb: t,
            kvp: o
        }
    }
    ,
    t.getBidById = function(e) {
        if (!l.isOwnProperty(window.PWT.bidIdMap, e))
            return l.log(m.MESSAGES.M25 + e),
            null;
        var t = window.PWT.bidIdMap[e].s
          , o = window.PWT.bidIdMap[e].a;
        if (l.isOwnProperty(window.PWT.bidMap, t)) {
            l.log("BidID: " + e + ", DivID: " + t + m.MESSAGES.M19 + o);
            var i = window.PWT.bidMap[t].getBid(o, e);
            return null == i ? null : {
                bid: i,
                slotid: t
            }
        }
        return l.log(m.MESSAGES.M25 + e),
        null
    }
    ,
    t.displayCreative = function(e, t) {
        var o = u.getBidById(t);
        if (o) {
            var i = o.bid
              , r = o.slotid;
            l.displayCreative(e, i),
            l.vLogInfo(r, {
                type: "disp",
                adapter: i.getAdapterID()
            }),
            u.executeMonetizationPixel(r, i)
        }
    }
    ,
    t.executeAnalyticsPixel = function() {
        var e = {
            s: []
        }
          , t = c.getPublisherId()
          , o = c.getAnalyticsPixelURL()
          , i = {};
        o && (o = m.COMMON.PROTOCOL + o + "pubid=" + t,
        e[m.CONFIG.PUBLISHER_ID] = c.getPublisherId(),
        e[m.LOGGER_PIXEL_PARAMS.TIMEOUT] = "" + c.getTimeout(),
        e[m.LOGGER_PIXEL_PARAMS.PAGE_URL] = window.decodeURIComponent(l.metaInfo.pageURL),
        e[m.LOGGER_PIXEL_PARAMS.PAGE_DOMAIN] = l.metaInfo.pageDomain,
        e[m.LOGGER_PIXEL_PARAMS.TIMESTAMP] = l.getCurrentTimestamp(),
        e[m.CONFIG.PROFILE_ID] = c.getProfileID(),
        e[m.CONFIG.PROFILE_VERSION_ID] = c.getProfileDisplayVersionID(),
        e.tgid = (function() {
            var e = parseInt(PWT.testGroupId || 0);
            return 15 >= e && e >= 0 ? e : 0
        }
        )(),
        l.forEachOnObject(window.PWT.bidMap, (function(e, t) {
            u.analyticalPixelCallback(e, t, i)
        }
        )),
        l.forEachOnObject(i, (function(t, i) {
            i.length > 0 && (e.s = i,
            e[m.COMMON.IMPRESSION_ID] = window.encodeURIComponent(t),
            e.psl = i.psl,
            e.dvc = {
                plt: l.getDevicePlatform()
            },
            l.ajaxRequest(o, (function() {}
            ), "json=" + window.encodeURIComponent(JSON.stringify(e)), {
                contentType: "application/x-www-form-urlencoded",
                withCredentials: !0
            }))
        }
        )))
    }
    ,
    t.executeMonetizationPixel = function(e, t) {
        var o = l.generateMonetizationPixel(e, t);
        o && u.setImageSrcToPixelURL(o)
    }
    ,
    t.analyticalPixelCallback = p,
    t.setImageSrcToPixelURL = function(e, t) {
        var o = new window.Image;
        return void 0 == t || t ? (String(e).trim().substring(0, 8) != m.COMMON.PROTOCOL && (e = m.COMMON.PROTOCOL + e),
        o.src = e,
        void 0) : (o.src = e,
        void 0)
    }
    ,
    t.getAllPartnersBidStatuses = function(e, t) {
        var o = !0;
        return l.forEachOnArray(t, (function(t, i) {
            e[i] && (o = o && e[i].hasAllPossibleBidsReceived() === !0)
        }
        )),
        o
    }
    ,
    t.loadTrackers = function(e) {
        var t = l.getBidFromEvent(e);
        window.parent.postMessage(JSON.stringify({
            pwt_type: "3",
            pwt_bidID: t,
            pwt_origin: m.COMMON.PROTOCOL + window.location.hostname,
            pwt_action: "click"
        }), "*")
    }
    ,
    t.executeTracker = function(e) {
        window.parent.postMessage(JSON.stringify({
            pwt_type: "3",
            pwt_bidID: e,
            pwt_origin: m.COMMON.PROTOCOL + window.location.hostname,
            pwt_action: "imptrackers"
        }), "*")
    }
    ,
    t.fireTracker = function(e, t) {
        var o;
        if ("click" === t)
            o = e["native"] && e["native"].clickTrackers;
        else if ("imptrackers" === t && (o = e["native"] && e["native"].impressionTrackers,
        e["native"] && e["native"].javascriptTrackers)) {
            var i = l.createInvisibleIframe();
            if (!i)
                throw {
                    message: "Failed to create invisible frame for native javascript trackers"
                };
            if (!i.contentWindow)
                throw {
                    message: "Unable to access frame window for native javascript trackers"
                };
            window.document.body.appendChild(i),
            i.contentWindow.document.open(),
            i.contentWindow.document.write(e["native"].javascriptTrackers),
            i.contentWindow.document.close()
        }
        (o || []).forEach((function(e) {
            u.setImageSrcToPixelURL(e, !1)
        }
        ))
    }
    ,
    t.setStandardKeys = function(e, t) {
        if (e) {
            t[m.WRAPPER_TARGETING_KEYS.BID_ID] = e.getBidID(),
            t[m.WRAPPER_TARGETING_KEYS.BID_STATUS] = e.getStatus(),
            t[m.WRAPPER_TARGETING_KEYS.BID_ECPM] = e.getNetEcpm().toFixed(m.COMMON.BID_PRECISION);
            var o = e.getDealID();
            o && (t[m.WRAPPER_TARGETING_KEYS.BID_DEAL_ID] = o),
            t[m.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID] = e.getAdapterID(),
            t[m.WRAPPER_TARGETING_KEYS.PUBLISHER_ID] = c.getPublisherId(),
            t[m.WRAPPER_TARGETING_KEYS.PROFILE_ID] = c.getProfileID(),
            t[m.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID] = c.getProfileDisplayVersionID(),
            t[m.WRAPPER_TARGETING_KEYS.BID_SIZE] = e.width + "x" + e.height,
            t[m.WRAPPER_TARGETING_KEYS.PLATFORM_KEY] = e.getAdFormat() == m.FORMAT_VALUES.VIDEO ? m.PLATFORM_VALUES.VIDEO : e.getNative() ? m.PLATFORM_VALUES.NATIVE : m.PLATFORM_VALUES.DISPLAY,
            e.getAdFormat() == m.FORMAT_VALUES.VIDEO && (t[m.WRAPPER_TARGETING_KEYS.CACHE_PATH] = m.CONFIG.CACHE_PATH,
            t[m.WRAPPER_TARGETING_KEYS.CACHE_URL] = m.CONFIG.CACHE_URL,
            t[m.WRAPPER_TARGETING_KEYS.CACHE_ID] = e.getcacheUUID())
        } else
            l.logWarning("Not generating key-value pairs as invalid winningBid object passed. WinningBid: "),
            l.logWarning(e)
    }
}
), (function(e, t) {
    function o(e, t) {
        return toString.call(e) === "[object " + t + "]"
    }
    var i = "OpenWrap"
      , r = 909090
      , n = function(e) {
        return o(e, "Function")
    }
      , d = (function() {
        try {
            return window.localStorage && n(window.localStorage.getItem) && n(window.localStorage.setItem)
        } catch (e) {
            return !1
        }
    }
    )()
      , s = function(e, t, o, r) {
        var n;
        if (d) {
            try {
                n = window.localStorage.getItem(i)
            } catch (s) {}
            if (n && "string" == typeof n)
                try {
                    n = JSON.parse(n)
                } catch (s) {
                    n = {}
                }
            else
                n = {};
            n && (n.hasOwnProperty(e) || (n[e] = {}),
            n[e].t = (new Date).getTime(),
            n[e][t] = o,
            "c" == t && (n[e].g = r ? 1 : 0));
            try {
                window.localStorage.setItem(i, JSON.stringify(n))
            } catch (s) {}
        }
    };
    t.setConsentDataInLS = s,
    t.isCmpFound = function() {
        return !!window.__cmp
    }
    ,
    t.getUserConsentDataFromCMP = function() {
        function e(e) {
            if (e && e.data && e.data.__cmp && e.data.__cmp.result) {
                var t = e.data.__cmp.result;
                t && t.consentData ? s(o, "c", t.consentData, t.gdprApplies) : "string" == typeof t && s(o, "c", t)
            }
        }
        function t() {
            window.__cmp("getConsentData", "vendorConsents", (function(e) {
                e && e.consentData ? s(o, "c", e.consentData, e.gdprApplies) : "string" == typeof e && s(o, "c", e)
            }
            ))
        }
        var o = r
          , i = 0
          , n = {
            __cmp: {
                callId: "iframe:" + ++i,
                command: "getConsentData"
            }
        };
        window.__cmp ? "function" == typeof window.__cmp ? t() : setTimeout((function() {
            "function" == typeof window.__cmp && t()
        }
        ), 500) : (window.top.postMessage(n, "*"),
        window.addEventListener("message", e))
    }
    ,
    t.getUserConsentDataFromLS = function() {
        var e = r
          , t = {
            c: "",
            g: 0
        };
        if (!d)
            return t;
        var o;
        try {
            o = window.localStorage.getItem(i)
        } catch (n) {}
        if (o && "string" == typeof o) {
            try {
                o = JSON.parse(o)
            } catch (n) {
                o = {}
            }
            if (o.hasOwnProperty(e)) {
                var s = o[e];
                s && s.c && s.t && s.t && parseInt(s.t, 10) > (new Date).getTime() - 864e5 && (t.c = s.c,
                t.g = s.g)
            }
        }
        return t
    }
}
), (function(e, t, o) {
    function i(e) {
        this.name = e,
        this.sizes = [],
        this.adapters = {},
        this.creationTime = n.getCurrentTimestampInMs(),
        this.impressionID = "",
        this.analyticsEnabled = !1,
        this.expired = !1,
        this.allPossibleBidsReceived = !1
    }
    var r = o(4)
      , n = o(1)
      , d = o(9).AdapterEntry;
    i.prototype.setExpired = function() {
        return this.expired = !0,
        this
    }
    ,
    i.prototype.getExpiredStatus = function() {
        return this.expired
    }
    ,
    i.prototype.setAnalyticEnabled = function() {
        return this.analyticsEnabled = !0,
        this
    }
    ,
    i.prototype.getAnalyticEnabledStatus = function() {
        return this.analyticsEnabled
    }
    ,
    i.prototype.setNewBid = function(e, t) {
        n.isOwnProperty(this.adapters, e) || (this.adapters[e] = new d(e)),
        this.adapters[e].setNewBid(t)
    }
    ,
    i.prototype.getBid = function(e, t) {
        return n.isOwnProperty(this.adapters, e) ? this.adapters[e].getBid(t) : void 0
    }
    ,
    i.prototype.getName = function() {
        return this.name
    }
    ,
    i.prototype.getCreationTime = function() {
        return this.creationTime
    }
    ,
    i.prototype.setImpressionID = function(e) {
        return this.impressionID = e,
        this
    }
    ,
    i.prototype.getImpressionID = function() {
        return this.impressionID
    }
    ,
    i.prototype.setSizes = function(e) {
        return this.sizes = e,
        this
    }
    ,
    i.prototype.getSizes = function() {
        return this.sizes
    }
    ,
    i.prototype.setAdapterEntry = function(e) {
        return n.isOwnProperty(this.adapters, e) || (this.adapters[e] = new d(e),
        n.log(r.MESSAGES.M4 + this.name + " " + e + " " + this.adapters[e].getCallInitiatedTime())),
        this
    }
    ,
    i.prototype.getLastBidIDForAdapter = function(e) {
        return n.isOwnProperty(this.adapters, e) ? this.adapters[e].getLastBidID() : ""
    }
    ,
    i.prototype.setAllPossibleBidsReceived = function() {
        return this.allPossibleBidsReceived = !0,
        this
    }
    ,
    i.prototype.hasAllPossibleBidsReceived = function() {
        return this.allPossibleBidsReceived
    }
    ,
    e.exports.BMEntry = i,
    t.createBMEntry = function(e) {
        return new i(e)
    }
}
), (function(e, t, o) {
    function i(e) {
        this.adapterID = e,
        this.callInitiatedTime = r.getCurrentTimestampInMs(),
        this.bids = {},
        this.lastBidID = ""
    }
    var r = o(1);
    i.prototype.getCallInitiatedTime = function() {
        return this.callInitiatedTime
    }
    ,
    i.prototype.getLastBidID = function() {
        return this.lastBidID
    }
    ,
    i.prototype.getBid = function(e) {
        return r.isOwnProperty(this.bids, e) ? this.bids[e] : null
    }
    ,
    i.prototype.setNewBid = function(e) {
        delete this.bids[this.lastBidID];
        var t = e.getBidID();
        this.bids[t] = e,
        this.lastBidID = t
    }
    ,
    e.exports.AdapterEntry = i
}
), (function(e, t, o) {
    function i(e) {
        f.isObject(e) && (D = e)
    }
    function r() {
        return D
    }
    function n(e) {
        var t = 0;
        try {
            var o = e.getSlotId().getId().split("_");
            t = parseInt(o[o.length - 1])
        } catch (i) {}
        return t
    }
    function d(e) {
        f.isObject(P.wrapperTargetingKeys) || (P.wrapperTargetingKeys = {}),
        P.wrapperTargetingKeys[e] = ""
    }
    function s(e) {
        var t = {};
        return f.forEachOnObject(e, (function(e, o) {
            t[o] = ""
        }
        )),
        t
    }
    function a(e) {
        return f.isObject(e) && f.isObject(e.PWT) && f.isFunction(e.PWT.jsLoaded) ? (e.PWT.jsLoaded(),
        !0) : !1
    }
    function _(e) {
        e.PWT.safeFrameMessageListenerAdded || (f.addMessageEventListenerForSafeFrame(e),
        e.PWT.safeFrameMessageListenerAdded = !0)
    }
    function p(e) {
        return f.isObject(e) ? f.isString(e.code) ? f.isString(e.divId) ? f.isString(e.adUnitId) ? f.isString(e.adUnitIndex) ? f.isObject(e.mediaTypes) ? f.isObject(e.mediaTypes.banner) || f.isObject(e.mediaTypes.native) || f.isObject(e.mediaTypes.video) ? f.isObject(e.mediaTypes.banner) && !f.isArray(e.mediaTypes.banner.sizes) ? (f.logError("An anAdUnitObject.mediaTypes.banner should have a property named sizes and it should be an array", e),
        !1) : !0 : (f.logError("An anAdUnitObject.mediaTypes should atleast have a property named banner or native or video and it should be an object", e),
        !1) : (f.logError("An AdUnitObject should have a property named mediaTypes and it should be an object", e),
        !1) : (f.logError("An AdUnitObject should have a property named adUnitIndex and it should be a string", e),
        !1) : (f.logError("An AdUnitObject should have a property named adUnitId and it should be a string", e),
        !1) : (f.logError("An AdUnitObject should have a property named divId and it should be a string", e),
        !1) : (f.logError("An AdUnitObject should have a property named code and it should be a string", e),
        !1) : (f.logError("An AdUnitObject should be an object", e),
        !1)
    }
    function c(e) {
        if (e && e.mediaTypes) {
            if (e.mediaTypes.banner && f.isArray(e.mediaTypes.banner.sizes))
                return e.mediaTypes.banner.sizes;
            if (e.mediaTypes.video && !(f.isArray(e.mediaTypes.video.playerSize) || e.mediaTypes.video.w && e.mediaTypes.video.h))
                return f.logError("For slot video playersize or w,h is not defined and may not request bids from SSP for this slot. " + JSON.stringify(e)),
                [];
            if (e.mediaTypes.native || e.mediaTypes.video)
                return e.sizes
        }
        return []
    }
    function m(e) {
        var t = h.getBid(e)
          , o = t.wb || null
          , i = t.kvp || null
          , r = b.IGNORE_PREBID_KEYS;
        o && o.getNetEcpm() > 0 && h.setStandardKeys(o, i),
        f.forEachOnObject(i, (function(e) {
            f.isOwnProperty(r, e) || "pubmatic" !== o.adapterID && f.isOwnProperty({
                hb_buyid_pubmatic: 1,
                pwtbuyid_pubmatic: 1
            }, e) ? delete i[e] : P.defineWrapperTargetingKey(e)
        }
        ));
        var n = null;
        return o && (n = {},
        n.adHtml = o.adHtml,
        n.adapterID = o.adapterID,
        n.grossEcpm = o.grossEcpm,
        n.netEcpm = o.netEcpm,
        n.height = o.height,
        n.width = o.width),
        {
            wb: n,
            kvp: i
        }
    }
    function l(e, t) {
        if (!f.isArray(e))
            return f.error("First argument to PWT.requestBids API, arrayOfAdUnits is mandatory and it should be an array."),
            t(e),
            void 0;
        if (!f.isFunction(t))
            return f.error("Second argument to PWT.requestBids API, callBackFunction is mandatory and it should be a function."),
            void 0;
        var o = []
          , i = {}
          , r = [];
        if (f.forEachOnArray(e, (function(e, t) {
            if (P.validateAdUnitObject(t)) {
                var n = t.code
                  , d = E.createSlot(n);
                d.setDivID(t.divId || n),
                d.setPubAdServerObject(t),
                d.setAdUnitID(t.adUnitId || ""),
                d.setAdUnitIndex(t.adUnitIndex || 0),
                d.setSizes(P.getAdSlotSizesArray(t)),
                o.push(d),
                i[d.getDivID()] = d.getName(),
                r.push(d.getDivID()),
                f.createVLogInfoPanel(d.getDivID(), d.getSizes())
            }
        }
        )),
        0 == o.length)
            return f.error("There are no qualifyingSlots, so not calling bidders."),
            t(e),
            void 0;
        w.callAdapters(o);
        var n = Date.now() + g.getTimeout()
          , d = window.setInterval((function() {
            if (h.getAllPartnersBidStatuses(window.PWT.bidMap, r) || Date.now() >= n) {
                clearInterval(d),
                setTimeout((function() {
                    h.executeAnalyticsPixel()
                }
                ), 2e3);
                var o = {};
                f.forEachOnArray(r, (function(e, t) {
                    var r = i[t];
                    o[r] = P.findWinningBidAndGenerateTargeting(t, r),
                    setTimeout(f.realignVLogInfoPanel, 1e3, t)
                }
                )),
                f.forEachOnArray(e, (function(e, t) {
                    o.hasOwnProperty(t.code) && (t.bidData = o[t.code])
                }
                )),
                t(e)
            }
        }
        ), 10)
    }
    function x(e) {
        var t = [];
        return f.isArray(e) ? (f.forEachOnArray(e, (function(e, o) {
            var i = ""
              , r = ""
              , n = ""
              , d = []
              , s = "";
            if (f.isObject(o)) {
                if (f.isFunction(o.getAdUnitPath) && (i = o.getAdUnitPath()),
                f.isFunction(o.getSlotId)) {
                    var a = o.getSlotId();
                    r = "" + P.getAdUnitIndex(o),
                    a && f.isFunction(a.getDomId) && (n = a.getDomId(),
                    s = n)
                }
                f.isFunction(o.getSizes) && f.forEachOnArray(o.getSizes(window.innerWidth, window.innerHeight), (function(e, t) {
                    f.isFunction(t.getWidth) && f.isFunction(t.getHeight) ? d.push([t.getWidth(), t.getHeight()]) : (f.log(n + ", size object does not have getWidth and getHeight method. Ignoring: "),
                    f.log(t))
                }
                ))
            }
            t.push({
                code: s,
                divId: n,
                adUnitId: i,
                adUnitIndex: r,
                mediaTypes: f.getAdUnitConfig(d, o).mediaTypeObject,
                sizes: d
            })
        }
        )),
        t) : (f.error("first argument to generateConfForGPT should be an array"),
        t)
    }
    function u(e) {
        f.isArray(e) || f.error("array is expected");
        var t = [];
        f.isObject(window.googletag) && f.isFunction(window.googletag.pubads) && (t = window.googletag.pubads().getSlots());
        var o = {};
        f.forEachOnArray(t, (function(e, t) {
            if (f.isFunction(t.getSlotId)) {
                var i = t.getSlotId();
                i && f.isFunction(i.getDomId) ? o[i.getDomId()] = t : f.error("slotID.getDomId is not a function")
            } else
                f.error("googleSlot.getSlotId is not a function")
        }
        )),
        f.forEachOnArray(e, (function(e, t) {
            if (f.isOwnProperty(o, t.divId)) {
                var i = o[t.divId];
                f.isObject(t) && f.isObject(t.bidData) && f.isObject(t.bidData.kvp) && f.forEachOnObject(t.bidData.kvp, (function(e, t) {
                    i.setTargeting(e, [t])
                }
                ))
            } else
                f.error("GPT-Slot not found for divId: " + t.divId)
        }
        ))
    }
    function I(e) {
        f.forEachOnArray(e, (function(e, t) {
            var o = {};
            f.isFunction(t.getTargetingKeys) && f.forEachOnArray(t.getTargetingKeys(), (function(e, i) {
                o[i] = t.getTargeting(i)
            }
            )),
            f.isFunction(t.clearTargeting) && t.clearTargeting(),
            f.forEachOnObject(o, (function(e, o) {
                f.isOwnProperty(P.wrapperTargetingKeys, e) || f.isFunction(t.setTargeting) && t.setTargeting(e, o)
            }
            ))
        }
        ))
    }
    var g = o(2)
      , b = o(4)
      , f = o(1)
      , h = o(6)
      , w = (o(7),
    o(11))
      , E = o(13)
      , y = {};
    t.wrapperTargetingKeys = y;
    var T = {};
    t.slotSizeMapping = T;
    var D = null
      , P = this;
    t.setWindowReference = i,
    t.getWindowReference = r,
    t.getAdUnitIndex = n,
    t.defineWrapperTargetingKey = d,
    t.defineWrapperTargetingKeys = s,
    t.callJsLoadedIfRequired = a,
    t.initSafeFrameListener = _,
    t.validateAdUnitObject = p,
    t.getAdSlotSizesArray = c,
    t.findWinningBidAndGenerateTargeting = m,
    t.customServerExposedAPI = l,
    t.generateConfForGPT = x,
    t.addKeyValuePairsToGPTSlots = u,
    t.removeKeyValuePairsFromGPTSlots = I,
    t.init = function(e) {
        return g.initConfig(),
        f.isObject(e) ? (P.setWindowReference(e),
        P.initSafeFrameListener(e),
        e.PWT.requestBids = P.customServerExposedAPI,
        e.PWT.generateConfForGPT = P.generateConfForGPT,
        e.PWT.addKeyValuePairsToGPTSlots = u,
        e.PWT.removeKeyValuePairsFromGPTSlots = I,
        P.wrapperTargetingKeys = P.defineWrapperTargetingKeys(b.WRAPPER_TARGETING_KEYS),
        w.registerAdapters(),
        P.callJsLoadedIfRequired(e),
        !0) : !1
    }
}
), (function(e, t, o) {
    function i() {
        return Math.floor(100 * Math.random())
    }
    function r(e, t, o) {
        m.forEachOnObject(e, (function(e, i) {
            I.setInitTimeForSlotsForAdapter(t, e),
            i.fB(t, o)
        }
        ))
    }
    function n(e, t) {
        m.forEachOnArray(e, (function(e, o) {
            var i = o.getDivID();
            l.resetBid(i, t),
            l.setSizes(i, m.generateSlotNamesFromPattern(o, "_W_x_H_"))
        }
        ))
    }
    function d(e, t) {
        return !(e >= p.getAdapterThrottle(t))
    }
    function s(e, t) {
        m.forEachOnObject(e, (function(e, o) {
            l.setCallInitTime(o.getDivID(), t)
        }
        ))
    }
    function a(e) {
        if (e) {
            var t = e.ID();
            m.isFunction(e.fB) ? I.registeredAdapters[t] = e : m.log(t + c.MESSAGES.M3)
        } else
            m.log(c.MESSAGES.M3),
            m.log(e)
    }
    function _() {
        I.registerAdapter(x.register())
    }
    var p = o(2)
      , c = o(4)
      , m = o(1)
      , l = o(6)
      , x = o(12)
      , u = {};
    t.registeredAdapters = u;
    var I = this;
    t.callAdapters = function(e) {
        var t = m.generateUUID();
        I.resetSlots(e, t),
        I.callAdapter(u, e, t)
    }
    ,
    t.getRandomNumberBelow100 = i,
    t.callAdapter = r,
    t.resetSlots = n,
    t.throttleAdapter = d,
    t.setInitTimeForSlotsForAdapter = s,
    t.registerAdapter = a,
    t.registerAdapters = _
}
), (function(e, t, o) {
    function i(e, t, o) {
        var i = o || e.regexPattern || void 0
          , r = b.createBid(e.bidderCode, t)
          , n = parseInt(e.pubmaticServerErrorCode);
        return r.setGrossEcpm(e.cpm),
        r.setDealID(e.dealId),
        r.setDealChannel(e.dealChannel),
        r.setAdHtml(e.ad || ""),
        r.setAdUrl(e.adUrl || ""),
        r.setWidth(e.width),
        r.setHeight(e.height),
        r.setMi(e.mi),
        e.videoCacheKey && r.setVastCache(e.videoCacheKey),
        e.vastUrl && r.setVastUrl(e.vastUrl),
        e.vastXml && r.setVastUrl(e.vastUrl),
        e.renderer && r.setRenderer(e.renderer),
        e.native && r.setNative(e.native),
        i && r.setRegexPattern(i),
        e.mediaType == g.FORMAT_VALUES.VIDEO && (e.videoCacheKey && r.setcacheUUID(e.videoCacheKey),
        r.updateBidId(e.adUnitCode)),
        e.sspID && r.setsspID(e.sspID),
        r.setReceivedTime(e.responseTimestamp),
        r.setServerSideResponseTime(e.serverSideResponseTime),
        I.getAdServerCurrency() && (f.isOwnProperty(e, "originalCpm") || (e.originalCpm = e.cpm),
        f.isOwnProperty(e, "originalCurrency") || (e.originalCurrency = f.getCurrencyToDisplay()),
        r.setOriginalCpm(window.parseFloat(e.originalCpm)),
        r.setOriginalCurrency(e.originalCurrency),
        f.isFunction(e.getCpmInNewCurrency) ? r.setAnalyticsCpm(window.parseFloat(e.getCpmInNewCurrency(g.COMMON.ANALYTICS_CURRENCY))) : r.setAnalyticsCpm(r.getGrossEcpm())),
        1 === n || 2 === n || 6 === n || 11 === n || 12 === n ? (r.setDefaultBidStatus(-1),
        r.setWidth(0),
        r.setHeight(0)) : 3 === n || 4 === n || 5 === n ? (r.setDefaultBidStatus(0),
        0 === r.isServerSide && r.setPostTimeoutStatus()) : n && r.setDefaultBidStatus(1),
        f.forEachOnObject(e.adserverTargeting, (function(e, t) {
            "hb_format" !== e && "hb_source" !== e && r.setKeyValuePair(e, t)
        }
        )),
        r.setPbBid(e),
        r
    }
    function r(e, t) {
        var o = {
            responseKGPV: "",
            responseRegex: ""
        };
        t.kgpvs.length > 0 && t.kgpvs.forEach((function(t) {
            e.bidderCode == t.adapterID && (o.responseKGPV = t.kgpv,
            o.responseRegex = t.regexPattern)
        }
        ));
        var i = o.responseKGPV.split("@")
          , r = 1
          , n = !1;
        if (i && (2 == i.length || 3 == i.length && (r = 2) && (n = !0)) && "video" != e.mediaType) {
            var d = i[r]
              , s = null;
            i[r].indexOf(":") > 0 && (d = i[r].split(":")[0],
            s = i[r].split(":")[1]),
            e.getSize() && e.getSize() != d && "0X0" != e.getSize().toUpperCase() && (i[0].toUpperCase() == d.toUpperCase() && (i[0] = e.getSize().toLowerCase()),
            o.responseKGPV = n ? i[0] + "@" + i[1] + "@" + e.getSize() : i[0] + "@" + e.getSize(),
            s && (o.responseKGPV = o.responseKGPV + ":" + s))
        }
        return o
    }
    function n(e) {
        var t = e.adUnitCode || "";
        if (f.isOwnProperty(P.kgpvMap, t)) {
            if ("pubmaticServer" === e.bidderCode && (e.bidderCode = e.originalBidder),
            P.isSingleImpressionSettingEnabled) {
                var o = P.checkAndModifySizeOfKGPVIfRequired(e, P.kgpvMap[t]);
                P.kgpvMap[t].kgpv = o.responseKGPV,
                P.kgpvMap[t].regexPattern = o.responseRegex
            }
            if (e.bidderCode && I.isServerSideAdapter(e.bidderCode)) {
                var i = P.kgpvMap[t].divID;
                if (!P.isSingleImpressionSettingEnabled) {
                    var r = P.getPBCodeWithWidthAndHeight(i, e.bidderCode, e.width, e.height)
                      , n = P.getPBCodeWithoutWidthAndHeight(i, e.bidderCode);
                    if (f.isOwnProperty(P.kgpvMap, r))
                        t = r;
                    else {
                        if (!f.isOwnProperty(P.kgpvMap, n))
                            return f.logWarning("Failed to find kgpv details for S2S-adapter:" + e.bidderCode),
                            void 0;
                        t = n
                    }
                }
                e.ss = I.isServerSideAdapter(e.bidderCode) ? 1 : 0
            }
            e.bidderCode && (e.timeToRespond < v && f.handleHook(g.HOOKS.BID_RECEIVED, [P.kgpvMap[t].divID, e]),
            h.setBidFromBidder(P.kgpvMap[t].divID, P.transformPBBidToOWBid(e, P.kgpvMap[t].kgpv, P.kgpvMap[t].regexPattern)))
        } else
            f.logWarning("Failed to find pbBid.adUnitCode in kgpvMap, pbBid.adUnitCode:" + e.adUnitCode)
    }
    function d(e) {
        for (var t in e)
            if (f.isOwnProperty(e, t) && f.isOwnProperty(P.kgpvMap, t))
                for (var o = e[t], r = o.bids || [], n = 0; n < r.length; n++) {
                    var d = r[n];
                    d.bidderCode && h.setBidFromBidder(P.kgpvMap[t].divID, i(d, P.kgpvMap[t].kgpv))
                }
    }
    function s(e, t, o, i) {
        return e + "@" + t + "@" + o + "X" + i
    }
    function a(e, t) {
        return e + "@" + t
    }
    function _(e, t, o) {
        var i = !1;
        return f.isOwnProperty(e, t) && e[t].bids.forEach((function(e) {
            e.bidder == o && (i = !0)
        }
        )),
        i
    }
    function p(e, t, o, i, r, n, d, s, a, p, c) {
        var m, l, x, u, g = d.getDivID();
        if (P.isSingleImpressionSettingEnabled) {
            m = d.getDivID(),
            l = d.getSizes();
            var b = !1;
            if (P.kgpvMap[m] && P.kgpvMap[m].kgpvs && P.kgpvMap[m].kgpvs.length > 0) {
                if (f.forEachOnArray(P.kgpvMap[m].kgpvs, (function(t, o) {
                    o.adapterID == e && (b = !0)
                }
                )),
                b && _(t, m, e))
                    return
            } else
                P.kgpvMap[m] = {
                    kgpvs: [],
                    divID: g
                };
            if (!b) {
                var h = {
                    adapterID: e,
                    kgpv: r,
                    regexPattern: c
                };
                P.kgpvMap[m].kgpvs.push(h)
            }
        } else
            n ? (m = P.getPBCodeWithWidthAndHeight(g, e, a, p),
            l = [[a, p]]) : (m = P.getPBCodeWithoutWidthAndHeight(g, e),
            l = d.getSizes()),
            P.kgpvMap[m] = {
                kgpv: r,
                divID: g,
                regexPattern: c
            };
        if (I.isServerSideAdapter(e))
            return f.log("Not calling adapter: " + e + ", for " + r + ", as it is serverSideEnabled."),
            void 0;
        var w = f.getAdUnitConfig(l, d);
        if (x = w.mediaTypeObject,
        x.partnerConfig && (u = x.partnerConfig),
        f.isOwnProperty(t, m)) {
            if (P.isSingleImpressionSettingEnabled && _(t, m, e))
                return
        } else
            t[m] = {
                code: m,
                mediaTypes: {},
                sizes: l,
                bids: [],
                divID: g
            },
            x.banner && (t[m].mediaTypes.banner = x.banner),
            x.native && (t[m].mediaTypes["native"] = x.native),
            x.video && (t[m].mediaTypes.video = x.video),
            w.renderer && (t[m].renderer = w.renderer);
        f.isOwnProperty(t, m) && (x = t[m].mediaTypes);
        var E = {};
        switch (x && f.isOwnProperty(x, "video") && "telaria" != e && (E.video = x.video),
        f.forEachOnObject(s, (function(e, t) {
            E[e] = t
        }
        )),
        u && Object.keys(u).length > 0 && f.forEachOnObject(u, (function(t, o) {
            t == e && f.forEachOnObject(o, (function(e, t) {
                E[e] = t
            }
            ))
        }
        )),
        x && f.isOwnProperty(x, "video") && "telaria" != e && (f.isOwnProperty(E, "video") && f.isObject(E.video) ? f.forEachOnObject(x.video, (function(e, t) {
            f.isOwnProperty(E.video, e) || (E.video[e] = t)
        }
        )) : E.video = x.video),
        e) {
        case "pubmaticServer":
            E.publisherId = o.publisherId,
            E.adUnitIndex = "" + d.getAdUnitIndex(),
            E.adUnitId = d.getAdUnitID(),
            E.divId = d.getDivID(),
            E.adSlot = r,
            E.wiid = i,
            E.profId = I.getProfileID(),
            window.PWT.udpv && (E.verId = I.getProfileDisplayVersionID()),
            t[m].bids.push({
                bidder: e,
                params: E
            });
            break;
        case "pubmatic":
        case "pubmatic2":
            E.publisherId = o.publisherId,
            E.adSlot = E.slotName || r,
            E.wiid = i,
            E.profId = "pubmatic2" == e ? o.profileId : I.getProfileID(),
            "pubmatic2" != e && window.PWT.udpv && (E.verId = I.getProfileDisplayVersionID()),
            t[m].bids.push({
                bidder: e,
                params: E
            });
            break;
        case "pulsepoint":
            f.forEachOnArray(l, (function(o, i) {
                var r = {};
                f.forEachOnObject(s, (function(e, t) {
                    r[e] = t
                }
                )),
                r.cf = i[0] + "x" + i[1],
                t[m].bids.push({
                    bidder: e,
                    params: r
                })
            }
            ));
            break;
        case "adg":
            f.forEachOnArray(l, (function(o, i) {
                var r = {};
                f.forEachOnObject(s, (function(e, t) {
                    r[e] = t
                }
                )),
                r.width = i[0],
                r.height = i[1],
                P.isSingleImpressionSettingEnabled && _(t, m, e) || t[m].bids.push({
                    bidder: e,
                    params: r
                })
            }
            ));
            break;
        case "yieldlab":
            f.forEachOnArray(l, (function(o, i) {
                var r = {};
                f.forEachOnObject(s, (function(e, t) {
                    r[e] = t
                }
                )),
                r.adSize = i[0] + "x" + i[1],
                P.isSingleImpressionSettingEnabled && _(t, m, e) || t[m].bids.push({
                    bidder: e,
                    params: r
                })
            }
            ));
            break;
        case "ix":
        case "indexExchange":
            f.forEachOnArray(l, (function(o, i) {
                var r = {};
                s.siteID && (r.siteId = s.siteID),
                r.size = i,
                t[m].bids.push({
                    bidder: e,
                    params: r
                })
            }
            ));
            break;
        default:
            t[m].bids.push({
                bidder: e,
                params: E
            })
        }
    }
    function c(e, t, o, i, r) {
        f.log(e + g.MESSAGES.M1),
        t && f.forEachGeneratedKey(e, i, t, r, [], o, P.generatedKeyCallback, !0)
    }
    function m(e) {
        f.forEachOnObject(g.SRA_ENABLED_BIDDERS, (function(t) {
            f.isOwnProperty(E.adapters, t) && (e[t] = {
                singleRequest: !0
            })
        }
        ))
    }
    function l(e, t) {
        if (!window[T])
            return f.logError("PreBid js is not loaded"),
            void 0;
        if (!f.isFunction(window[T].onEvent))
            return f.logWarning("PreBid js onEvent method is not available"),
            void 0;
        A || (window[T].onEvent("bidResponse", P.pbBidStreamHandler),
        A = !0),
        window[T].logging = f.isDebugLogEnabled();
        var o = {}
          , i = w.getRandomNumberBelow100();
        I.forEachAdapter((function(r, n) {
            r !== P.parentAdapterID && (I.isServerSideAdapter(r) || 0 == w.throttleAdapter(i, r) ? (w.setInitTimeForSlotsForAdapter(e, r),
            P.generatePbConf(r, n, e, o, t)) : f.log(r + g.MESSAGES.M2))
        }
        ));
        var r = [];
        for (var n in o)
            f.isOwnProperty(o, n) && r.push(o[n]);
        if (r.length > 0 && window[T])
            try {
                if (f.isFunction(window[T].setConfig) || "function" == typeof window[T].setConfig) {
                    var d = {
                        debug: f.isDebugLogEnabled(),
                        cache: {
                            url: g.CONFIG.CACHE_URL + g.CONFIG.CACHE_PATH
                        },
                        bidderSequence: "random",
                        userSync: {
                            enableOverride: !0,
                            syncsPerBidder: 0,
                            filterSettings: {
                                iframe: {
                                    bidders: "*",
                                    filter: "include"
                                }
                            },
                            enabledBidders: (function() {
                                var e = [];
                                return I.forEachAdapter((function(t) {
                                    e.push(t)
                                }
                                )),
                                e
                            }
                            )(),
                            syncDelay: 2e3
                        },
                        disableAjaxTimeout: I.getDisableAjaxTimeout()
                    };
                    I.getGdpr() && (d.consentManagement = {},
                    d.consentManagement.gdpr = {
                        cmpApi: I.getCmpApi(),
                        timeout: I.getGdprTimeout(),
                        allowAuctionWithoutConsent: I.getAwc()
                    }),
                    I.getCCPA() && (d.consentManagement || (d.consentManagement = {}),
                    d.consentManagement.usp = {
                        cmpApi: I.getCCPACmpApi(),
                        timeout: I.getCCPATimeout()
                    }),
                    I.getAdServerCurrency() && (f.log(g.MESSAGES.M26 + I.getAdServerCurrency()),
                    d.currency = {
                        adServerCurrency: I.getAdServerCurrency(),
                        granularityMultiplier: 1
                    }),
                    I.isSchainEnabled && (d.schain = I.getSchainObject()),
                    P.assignSingleRequestConfigForBidders(d),
                    f.handleHook(g.HOOKS.PREBID_SET_CONFIG, [d]),
                    I.isUserIdModuleEnabled() && (d.userSync.userIds = f.getUserIdConfiguration()),
                    window[T].setConfig(d)
                }
                if (!f.isFunction(window[T].requestBids) && "function" != typeof window[T].requestBids)
                    return f.log("PreBid js requestBids function is not available"),
                    void 0;
                f.handleHook(g.HOOKS.PREBID_REQUEST_BIDS, [r]),
                window[T].requestBids({
                    adUnits: r,
                    bidsBackHandler: function(t) {
                        function o() {
                            f.forEachOnArray(e, (function(e, t) {
                                h.setAllPossibleBidsReceived(t.getDivID())
                            }
                            ))
                        }
                        f.log("In PreBid bidsBackHandler with bidResponses: "),
                        f.log(t),
                        setTimeout(window[T].triggerUserSyncs, 10),
                        I.getAdServerCurrency() ? setTimeout(o, 300) : o()
                    },
                    timeout: v
                })
            } catch (s) {
                f.logError("Error occured in calling PreBid."),
                f.logError(s)
            }
    }
    function x() {
        return P.parentAdapterID
    }
    function u() {
        if (f.isFunction(window[T].setConfig) || "function" == typeof window[T].setConfig) {
            var e = {
                debug: f.isDebugLogEnabled(),
                userSync: {
                    syncDelay: 2e3
                }
            };
            I.getGdpr() && (e.consentManagement = {
                cmpApi: I.getCmpApi(),
                timeout: I.getGdprTimeout(),
                allowAuctionWithoutConsent: I.getAwc()
            }),
            I.isUserIdModuleEnabled() && (e.userSync.userIds = f.getUserIdConfiguration()),
            f.handleHook(g.HOOKS.PREBID_SET_CONFIG, [e]),
            window[T].setConfig(e),
            window[T].requestBids([])
        }
    }
    var I = o(2)
      , g = o(4)
      , b = o(5)
      , f = o(1)
      , h = o(6)
      , w = o(11)
      , E = o(3)
      , y = g.COMMON.PARENT_ADAPTER_PREBID
      , T = g.COMMON.PREBID_NAMESPACE;
    t.parentAdapterID = y;
    var D = {};
    t.kgpvMap = D;
    var P = this
      , v = I.getTimeout() - 50
      , A = !1
      , S = I.isSingleImpressionSettingEnabled();
    t.isSingleImpressionSettingEnabled = S,
    t.transformPBBidToOWBid = i,
    t.checkAndModifySizeOfKGPVIfRequired = r,
    t.pbBidStreamHandler = n,
    t.handleBidResponses = d,
    t.getPBCodeWithWidthAndHeight = s,
    t.isAdUnitsCodeContainBidder = _,
    t.getPBCodeWithoutWidthAndHeight = a,
    t.generatedKeyCallback = p,
    t.generatePbConf = c,
    t.assignSingleRequestConfigForBidders = m,
    t.fetchBids = l,
    t.setConfig = u,
    t.getParenteAdapterID = x,
    t.register = function() {
        return {
            fB: P.fetchBids,
            ID: P.getParenteAdapterID,
            sC: P.setConfig
        }
    }
}
), (function(e, t, o) {
    function i(e) {
        this.name = e,
        this.status = r.SLOT_STATUS.CREATED,
        this.divID = "",
        this.adUnitID = "",
        this.adUnitIndex = 0,
        this.sizes = [],
        this.keyValues = {},
        this.arguments = [],
        this.pubAdServerObject = null,
        this.displayFunctionCalled = !1,
        this.refreshFunctionCalled = !1
    }
    var r = o(4);
    i.prototype.getName = function() {
        return this.name
    }
    ,
    i.prototype.setStatus = function(e) {
        return this.status = e,
        this
    }
    ,
    i.prototype.getStatus = function() {
        return this.status
    }
    ,
    i.prototype.setDivID = function(e) {
        return this.divID = e,
        this
    }
    ,
    i.prototype.getDivID = function() {
        return this.divID
    }
    ,
    i.prototype.setAdUnitID = function(e) {
        return this.adUnitID = e,
        this
    }
    ,
    i.prototype.getAdUnitID = function() {
        return this.adUnitID
    }
    ,
    i.prototype.setAdUnitIndex = function(e) {
        return this.adUnitIndex = e,
        this
    }
    ,
    i.prototype.getAdUnitIndex = function() {
        return this.adUnitIndex
    }
    ,
    i.prototype.setSizes = function(e) {
        return this.sizes = e,
        this
    }
    ,
    i.prototype.getSizes = function() {
        return this.sizes
    }
    ,
    i.prototype.setKeyValue = function(e, t) {
        return this.keyValues[e] = t,
        this
    }
    ,
    i.prototype.setKeyValues = function(e) {
        return this.keyValues = e,
        this
    }
    ,
    i.prototype.getkeyValues = function() {
        return this.keyValues
    }
    ,
    i.prototype.setArguments = function(e) {
        return this.arguments = e,
        this
    }
    ,
    i.prototype.getArguments = function() {
        return this.arguments
    }
    ,
    i.prototype.setPubAdServerObject = function(e) {
        return this.pubAdServerObject = e,
        this
    }
    ,
    i.prototype.getPubAdServerObject = function() {
        return this.pubAdServerObject
    }
    ,
    i.prototype.setDisplayFunctionCalled = function(e) {
        return this.displayFunctionCalled = e,
        this
    }
    ,
    i.prototype.isDisplayFunctionCalled = function() {
        return this.displayFunctionCalled
    }
    ,
    i.prototype.setRefreshFunctionCalled = function(e) {
        return this.refreshFunctionCalled = e,
        this
    }
    ,
    i.prototype.isRefreshFunctionCalled = function() {
        return this.refreshFunctionCalled
    }
    ,
    i.prototype.updateStatusAfterRendering = function(e) {
        this.status = r.SLOT_STATUS.DISPLAYED,
        this.arguments = [],
        e ? this.refreshFunctionCalled = !1 : this.displayFunctionCalled = !1
    }
    ,
    e.exports.Slot = i,
    t.createSlot = function(e) {
        return new i(e)
    }
}
)]);
