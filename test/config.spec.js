/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CONF = require("../src_new/conf.js");
var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");
var CONFIG = require("../src_new/config.js");

var commonAdapterID = "pubmatic";

// TODO : remove as required during single TDD only
// var jsdom = require('jsdom').jsdom;
// var exposedProperties = ['window', 'navigator', 'document'];
// global.document = jsdom('');
// global.window = document.defaultView;
// Object.keys(document.defaultView).forEach((property) => {
//     if (typeof global[property] === 'undefined') {
//         exposedProperties.push(property);
//         global[property] = document.defaultView[property];
//     }
// });
// global.navigator = {
//     userAgent: 'node.js'
// };

describe('Config', function() {

    describe('#getPublisherId', function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "trim");
            done();
        });

        afterEach(function(done) {
            UTIL.trim.restore();
            done();
        });

        it('is a function', function(done) {
            CONFIG.getPublisherId.should.be.a('function');
            done();
        });

        it('should return trimmed pubid', function(done) {
            CONFIG.getPublisherId().should.be.equal(CONF.pwt.pubid);
            UTIL.trim.calledOnce.should.be.true;
            done();
        });

        it('should return zero when pubid is not present in conf', function(done) {
            delete CONF.pwt.pubid;
            CONFIG.getPublisherId().should.be.equal("0");
            done();
        });
    });

    describe('#getMataDataPattern', function() {

        it('is a function', function(done) {
            CONFIG.getMataDataPattern.should.be.a('function');
            done();
        });

        it('should return "TestMetaDataPattern", as it is set to "TestMetaDataPattern"', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.META_DATA_PATTERN] = "TestMetaDataPattern";
            CONFIG.getMataDataPattern().should.be.equal("TestMetaDataPattern");
            done();
        });

        it('should return null, as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.META_DATA_PATTERN];
            expect(CONFIG.getMataDataPattern()).to.equal(null);
            done();
        });

        it('should return null, as it is set to number 123', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.META_DATA_PATTERN] = 123;
            expect(CONFIG.getMataDataPattern()).to.equal(null);
            done();
        });
    });    

    describe('#getSendAllBidsStatus', function() {

        it('is a function', function(done) {
            CONFIG.getSendAllBidsStatus.should.be.a('function');
            done();
        });

        it('should return 1, as it is set to 1', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SEND_ALL_BIDS] = "1";
            CONFIG.getSendAllBidsStatus().should.be.equal(1);
            done();
        });

        it('should return 0, as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SEND_ALL_BIDS];
            CONFIG.getSendAllBidsStatus().should.be.equal(0);
            done();
        });
    });

    describe('#getTimeout', function() {

        beforeEach(function(done) {
            done();
        });

        afterEach(function(done) {
            done();
        });

        it('is a function', function(done) {
            CONFIG.getTimeout.should.be.a('function');
            done();
        });

        it('should return timeout from conf', function(done) {
            CONFIG.getTimeout().should.be.equal(window.parseInt(CONF.pwt.t));
            done();
        });

        it('should return 1000 (default timeout value) when pubid is not present in conf(configuration)', function(done) {
            var temp_t = CONF.pwt.t;
            delete CONF.pwt.t;
            CONFIG.getTimeout().should.be.equal(1000);
            CONF.pwt.t = temp_t;
            done();
        });
    });

    describe('#getDisableAjaxTimeout', function(){
        it('is a function', function(done) {
            CONFIG.getDisableAjaxTimeout.should.be.a('function');
            done();
        });

        it('by default, it should  return true', function(done){
            if(undefined !== CONF.pwt[CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT]){
                delete CONF.pwt[CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT];            
            };
            CONFIG.getDisableAjaxTimeout().should.equal(true);
            done();
        });

        it('if set false, disableAjaxTimeout should return false', function(done){
            CONF.pwt[CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT] = false;
            CONFIG.getDisableAjaxTimeout().should.equal(false);
            delete CONF.pwt[CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT];
            done();
        });

        it('if set true, disableAjaxTimeout should return true', function(done){
            CONF.pwt[CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT] = true;
            CONFIG.getDisableAjaxTimeout().should.equal(true);
            if(CONF.pwt[CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT]){
            delete CONF.pwt[CONSTANTS.CONFIG.DISABLE_AJAX_TIMEOUT];
            }
            done();
        });
    });


    describe('#getAdapterRevShare', function() {
        var adapterID = null;

        beforeEach(function(done) {
            CONF.adapters["non_adapter"] = {
                throttle: "100",
                publisherId: "9999",
                kgp: "_DIV_@_W_x_H_:_AUI_"
            };
            sinon.spy(UTIL, "isOwnProperty");
            sinon.spy(window, "parseFloat");
            adapterID = commonAdapterID;
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            window.parseFloat.restore();
            adapterID = null;
            delete CONF.adapters["non_adapter"];
            done();
        });

        it('is a function', function(done) {
            CONFIG.getAdapterRevShare.should.be.a('function');
            done();
        });

        it('returns revShare value as 1 when revShare value is not present in conf of given adapterID', function(done) {
            CONFIG.getAdapterRevShare("non_adapter").should.equal(1);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            window.parseFloat.calledOnce.should.be.false;
            done();
        });

        it('returns revShare value when revShare value is present in conf of given adapterID', function(done) {
            CONFIG.getAdapterRevShare(adapterID).should.equal((1 - window.parseFloat(CONF.adapters[adapterID].rev_share) / 100));
            UTIL.isOwnProperty.calledOnce.should.be.true;
            window.parseFloat.calledTwice.should.be.true;
            done();
        });
    });

    describe('#isServerSideAdapter', function(){
        it('is a function', function(done) {
            CONFIG.isServerSideAdapter.should.be.a('function');
            done();
        });

        it('by default, status should be returned false', function(done){
            delete CONF.adapters["pubmatic"][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
            CONFIG.isServerSideAdapter("pubmatic").should.equal(false);
            done();
        });

        it('if set, status should be returned true', function(done){
            CONF.adapters["pubmatic"][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
            CONFIG.isServerSideAdapter("pubmatic").should.equal(true);
            delete CONF.adapters["pubmatic"][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
            done();
        });
    });

    describe('#getAdapterMaskBidsStatus', function(){
        it('is a function', function(done) {
            CONFIG.getAdapterMaskBidsStatus.should.be.a('function');
            done();
        });

        it('should return 0 for pubmatic adapter', function(done){
            CONFIG.getAdapterMaskBidsStatus('pubmatic').should.equal(0);
            done();
        });        

        it('should return 1 for audienceNetwork adapter, as we have hard-coded', function(done){
            CONFIG.getAdapterMaskBidsStatus('audienceNetwork').should.equal(1);
            done();
        });

    });

    describe('#getAdapterThrottle', function() {
        var adapterID = null;

        beforeEach(function(done) {
            CONF.adapters["non_adapter"] = {
                rev_share: "0.0",
                publisherId: "9999",
                kgp: "_DIV_@_W_x_H_:_AUI_"
            };
            sinon.spy(UTIL, "isOwnProperty");
            adapterID = commonAdapterID;
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            adapterID = null;
            delete CONF.adapters["non_adapter"];
            done();
        });

        it('is a function', function(done) {
            CONFIG.getAdapterThrottle.should.be.a('function');
            done();
        });

        it('returns throttle value as 0 when throttle value is not present in conf of given adapterID', function(done) {
            CONFIG.getAdapterThrottle("non_adapter").should.equal(0);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('returns throttle value when throttle value is present in conf of given adapterID', function(done) {
            CONFIG.getAdapterThrottle(adapterID).should.equal(100 - CONF.adapters[adapterID].throttle);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });
    });

    describe('#getBidPassThroughStatus', function() {
        var adapterID = null;

        beforeEach(function(done) {
            CONF.adapters["non_adapter"] = {
                rev_share: "0.0",
                throttle: "100",
                publisherId: "9999",
                kgp: "_DIV_@_W_x_H_:_AUI_",
                pt: "2"
            };
            sinon.spy(UTIL, "isOwnProperty");
            adapterID = commonAdapterID;
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            adapterID = null;
            delete CONF.adapters["non_adapter"];
            done();
        });

        it('is a function', function(done) {
            CONFIG.getBidPassThroughStatus.should.be.a('function');
            done();
        });

        it('returns BidPassThroughStatus value as 0 when BidPassThroughStatus value is not present in conf of given adapterID', function(done) {
            delete CONF.adapters["non_adapter"].pt;
            CONFIG.getBidPassThroughStatus("non_adapter").should.equal(0);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('returns BidPassThroughStatus value when BidPassThroughStatus value is present in conf of given adapterID', function(done) {
            CONF.adapters[adapterID] = {
                pt: "0"
            };
            CONFIG.getBidPassThroughStatus(adapterID).should.equal(window.parseInt(CONF.adapters[adapterID].pt));
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });
    });

    describe('#getProfileID', function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "trim");
            done();
        });

        afterEach(function(done) {
            UTIL.trim.restore();
            done();
        });


        it('is a function', function(done) {
            CONFIG.getProfileID.should.be.a('function');
            done();
        });

        it('should return trimmed profile id', function(done) {
            CONFIG.getProfileID().should.be.equal(CONF.pwt.pid);
            UTIL.trim.calledOnce.should.be.true;
            done();
        });

        it('should return zero when profile id is not present in conf', function(done) {
            delete CONF.pwt.pid;
            CONFIG.getPublisherId().should.be.equal("0");
            done();
        });
    });

    describe('#getProfileDisplayVersionID', function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "trim");
            done();
        });

        afterEach(function(done) {
            UTIL.trim.restore();
            done();
        });

        it('is a function', function(done) {
            CONFIG.getProfileDisplayVersionID.should.be.a('function');
            done();
        });

        it('should return trimmed Profile Display Version ID', function(done) {
            CONFIG.getProfileDisplayVersionID().should.be.equal(CONF.pwt.pdvid);
            UTIL.trim.calledOnce.should.be.true;
            done();
        });

        it('should return zero when Profile Display Version ID is not present in conf', function(done) {
            delete CONF.pwt.pdvid;
            CONFIG.getProfileDisplayVersionID().should.be.equal("0");
            done();
        });
    });

    describe('#getAnalyticsPixelURL', function() {

        it('is a function', function(done) {
            CONFIG.getAnalyticsPixelURL.should.be.a('function');
            done();
        });

        it('should return Analytics Pixel URL', function(done) {
            CONFIG.getAnalyticsPixelURL().should.be.equal(CONF.pwt.dataURL);
            done();
        });

        it('should return false when Analytics Pixel URL is not present in conf', function(done) {
            delete CONF.pwt.dataURL;
            CONFIG.getAnalyticsPixelURL().should.be.equal(false);
            done();
        });
    });

    describe('#getMonetizationPixelURL', function() {

        it('is a function', function(done) {
            CONFIG.getMonetizationPixelURL.should.be.a('function');
            done();
        });

        it('should return Monetization Pixel URL', function(done) {
            CONFIG.getMonetizationPixelURL().should.be.equal(CONF.pwt.winURL);
            done();
        });

        it('should return false when Monetization Pixel URL is not present in conf', function(done) {
            delete CONF.pwt.winURL;
            CONFIG.getMonetizationPixelURL().should.be.equal(false);
            done();
        });
    });

    describe('#forEachAdapter', function() {
        var obj = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, "forEachOnObject");
            obj = {
                callback: function() {
                    return "callback";
                }
            };
            sinon.spy(obj, "callback");
            done();
        });

        afterEach(function(done) {
            UTIL.forEachOnObject.restore();
            obj.callback.restore();
            done();
        });

        it('is a function', function(done) {
            CONFIG.forEachAdapter.should.be.a('function');
            done();
        });

        it('should have called UTIL.forEachOnObject with conf adapters and callback function being passed', function(done) {
            CONFIG.forEachAdapter(obj.callback);
            UTIL.forEachOnObject.calledWith(CONF.adapters, obj.callback).should.be.true;
            obj.callback.called.should.be.true;
            done();
        });
    });

    describe('#addPrebidAdapter', function() {

        beforeEach(function (done) {
            sinon.spy(UTIL, "isOwnProperty");
            done();
        });

        afterEach(function (done) {
            UTIL.isOwnProperty.restore();
            delete CONF.adapters[CONSTANTS.COMMON.PARENT_ADAPTER_PREBID];
            done();
        });

        it('is a function', function(done) {
            CONFIG.addPrebidAdapter.should.be.a('function');
            done();
        });

        it('should add Prebid Adapter to the conf if doesnt already exists', function (done) {
            CONFIG.addPrebidAdapter();
            expect(CONF.adapters[CONSTANTS.COMMON.PARENT_ADAPTER_PREBID]).to.be.deep.equal({
                rev_share: "0.0",
                throttle: "100",
                kgp: "_DIV_",
                klm: {}
            });
            done();
        });
    });

    describe('#initConfig', function() {

        beforeEach(function (done) {
            sinon.spy(CONFIG, "addPrebidAdapter");
            sinon.spy(UTIL, "forEachOnObject");
            done();
        });

        afterEach(function (done) {
            CONFIG.addPrebidAdapter.restore();
            UTIL.forEachOnObject.restore();
            done();
        });

        it('is a function', function(done) {
            CONFIG.initConfig.should.be.a('function');
            done();
        });


        it('should have initiated the config with all required internal function calls', function (done) {
            CONFIG.initConfig();
            UTIL.forEachOnObject.called.should.be.true;
            UTIL.forEachOnObject.calledWith(CONSTANTS.CONFIG).should.be.true;
            UTIL.forEachOnObject.calledWith(CONF.adapters).should.be.true;
            UTIL.forEachOnObject.calledWith(CONF.adapters["pubmatic"]).should.be.true;
            UTIL.forEachOnObject.calledWith(CONF.adapters["sekindoUM"]["klm"]).should.be.true;
            done();
        });

        it('should copy account level params in case of regex',function(done){
            var expectedConfig = {zoneId: '869224', siteId: '178620', floor: '0', accountId: '10998', timeout: '1000', amp: 0, "in-app": 0};
            CONFIG.initConfig();
            expect(CONF.adapters["rubicon"].klm_rx[0].rx_config).to.be.deep.equal(expectedConfig);
            done();
        });
    });

    describe('#getGdpr', function() {
        it('is a function', function(done) {
            CONFIG.getGdpr.should.be.a('function');
            done();
        });

        it('should return true, as it is set to "1"', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] = "1";
            CONFIG.getGdpr().should.be.true;
            done();
        });

        it('should return default value for gdpr which is '+(CONSTANTS.CONFIG.DEFAULT_GDPR_CONSENT === "1")+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT];
            CONFIG.getGdpr().should.be.equal((CONSTANTS.CONFIG.DEFAULT_GDPR_CONSENT === "1"));
            done();
        });
    });

    describe('#getCmpApi', function() {
        it('is a function', function(done) {
            CONFIG.getCmpApi.should.be.a('function');
            done();
        });

        it('should return iab, as it is set to iab', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CMPAPI] = 'iab';
            CONFIG.getCmpApi().should.be.equal('iab');
            done();
        });

        it('should return default cpm which is '+CONSTANTS.CONFIG.DEFAULT_GDPR_CMPAPI+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CMPAPI];
            CONFIG.getCmpApi().should.be.equal(CONSTANTS.CONFIG.DEFAULT_GDPR_CMPAPI);
            done();
        });
    });

    describe('#getGdprTimeout', function() {
        it('is a function', function(done) {
            CONFIG.getGdprTimeout.should.be.a('function');
            done();
        });

        it('should return 5000, as it is set to 5000', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_TIMEOUT] = 5000;
            CONFIG.getGdprTimeout().should.be.equal(5000);
            done();
        });

        it('should return default value for gdpr timeout which is '+CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_TIMEOUT];
            CONFIG.getGdprTimeout().should.be.equal(CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT);
            done();
        });
    });

    describe('#getAwc', function() {
        it('is a function', function(done) {
            CONFIG.getAwc.should.be.a('function');
            done();
        });

        it('should return 1, as it is set to 1', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_AWC] = "1";
            CONFIG.getAwc().should.be.true;
            done();
        });

        it('should return default value which is '+(CONSTANTS.CONFIG.DEFAULT_GDPR_AWC === "1")+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_AWC];
            CONFIG.getAwc().should.be.equal((CONSTANTS.CONFIG.DEFAULT_GDPR_AWC === "1"));
            done();
        });
    });

    describe('#getNativeConfiguration',function(){
        var conf;
        beforeEach(function(done){
            conf =  {
                kgp:"_DIV_",
                klm:{
                    "DIV1":{
                        "NativeOnly": true,
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
                        "NativeOnly": true,
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
            CONF[CONSTANTS.COMMON.NATIVE_MEDIA_TYPE_CONFIG] = conf;
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.COMMON.NATIVE_MEDIA_TYPE_CONFIG];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getNativeConfiguration.should.be.a('function');
            done();
        });

        it('should return nativeConfig by reading from config', function(done) {
            var expectedResult =  {
                kgp:"_DIV_",
                klm:{
                    "DIV1":{
                        "NativeOnly": true,
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
                        "NativeOnly": true,
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
            CONFIG.getNativeConfiguration().should.be.deep.equal(expectedResult);
            done();
        });

        it('should be undefined if nativeConfig is not present',function(done){
            delete CONF[CONSTANTS.COMMON.NATIVE_MEDIA_TYPE_CONFIG];
            expect(CONFIG.getNativeConfiguration()).to.equal(undefined);
            done();
        })
    })

    describe('#getAdServerCurrency',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.AD_SERVER_CURRENCY] = "INR";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.AD_SERVER_CURRENCY];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getAdServerCurrency.should.be.a('function');
            done();
        });

        it('should return adServerCurrency by reading from config', function(done) {
            var expectedResult = "INR"
            CONFIG.getAdServerCurrency().should.be.deep.equal(expectedResult);
            done();
        });

        it('should be undefined if adServerCurrency is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.AD_SERVER_CURRENCY];
            expect(CONFIG.getAdServerCurrency()).to.equal(undefined);
            done();
        })
    })

    describe('#getSingleImpressionSetting',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SINGLE_IMPRESSION] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SINGLE_IMPRESSION];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.isSingleImpressionSettingEnabled.should.be.a('function');
            done();
        });

        it('should return 1 by reading from config', function(done) {
            var expectedResult = 1;
            CONFIG.isSingleImpressionSettingEnabled().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return 0 if getSingleImpressionSetting is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SINGLE_IMPRESSION];
            expect(CONFIG.isSingleImpressionSettingEnabled()).to.equal(0);
            done();
        });

        it('should return 0 if singleImpression set to "0"', function(done) {
            var expectedResult = 0;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SINGLE_IMPRESSION] = "0";
            CONFIG.isSingleImpressionSettingEnabled().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#isUserIdModuleEnabled',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.isUserIdModuleEnabled.should.be.a('function');
            done();
        });

        it('should return 1 by reading from config', function(done) {
            var expectedResult = 1;
            CONFIG.isUserIdModuleEnabled().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return 0 if isUserIdModuleEnabled is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID];
            expect(CONFIG.isUserIdModuleEnabled()).to.equal(0);
            done();
        });

        it('should return 0 if isUserIdModuleEnabled set to "0"', function(done) {
            var expectedResult = 0;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SINGLE_IMPRESSION] = "0";
            CONFIG.isSingleImpressionSettingEnabled().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#isIdentityOnly',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.isIdentityOnly.should.be.a('function');
            done();
        });

        it('should return 1 by reading from config', function(done) {
            var expectedResult = 1;
            CONFIG.isIdentityOnly().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return 0 if isIdentityOnly is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY];
            expect(CONFIG.isIdentityOnly()).to.equal(0);
            done();
        });

        it('should return 0 if isIdentityOnly set to "0"', function(done) {
            var expectedResult = 0;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] = "0";
            CONFIG.isIdentityOnly().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getIdentityPartners',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS] = {
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
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getIdentityPartners.should.be.a('function');
            done();
        });

        it('should return expected config by reading from config', function(done) {
            var expectedResult = {
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
            CONFIG.getIdentityPartners().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return undefined if identityPartners is not present',function(done){
            delete CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS];
            expect(CONFIG.getIdentityPartners()).to.be.undefined;
            done();
        });
    });

    describe('#getIdentityConsumers',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS] = "EB,TAM,Prebid";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getIdentityConsumers.should.be.a('function');
            done();
        });

        it('should return "eb,tam,prebid" by reading from config', function(done) {
            var expectedResult = "eb,tam,prebid";
            CONFIG.getIdentityConsumers().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return "" if isIdentityOnly is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS];
            expect(CONFIG.getIdentityConsumers()).to.be.equal("");
            done();
        });
    });


    describe('#getCCPA', function() {
        it('is a function', function(done) {
            CONFIG.getCCPA.should.be.a('function');
            done();
        });

        it('should return true, as it is set to "1"', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] = "1";
            CONFIG.getCCPA().should.be.true;
            done();
        });

        it('should return default value for ccpa which is '+(CONSTANTS.CONFIG.DEFAULT_CCPA_CONSENT === "1")+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT];
            CONFIG.getCCPA().should.be.equal((CONSTANTS.CONFIG.DEFAULT_CCPA_CONSENT === "1"));
            done();
        });
    });

    describe('#getCCPACmpApi', function() {
        it('is a function', function(done) {
            CONFIG.getCCPACmpApi.should.be.a('function');
            done();
        });

        it('should return iab, as it is set to iab', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CMPAPI] = 'iab';
            CONFIG.getCCPACmpApi().should.be.equal('iab');
            done();
        });

        it('should return default cpm which is '+CONSTANTS.CONFIG.DEFAULT_CCPA_CMPAPI+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CMPAPI];
            CONFIG.getCCPACmpApi().should.be.equal(CONSTANTS.CONFIG.DEFAULT_CCPA_CMPAPI);
            done();
        });
    });

    describe('#getCCPATimeout', function() {
	it("is a function", function(done) {
            CONFIG.getCCPATimeout.should.be.a('function');
            done();
        });

        it('should return 5000, as it is set to 5000', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_TIMEOUT] = 5000;
            CONFIG.getCCPATimeout().should.be.equal(5000);
            done();
        });

        it('should return default value for ccpa timeout which is '+CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_TIMEOUT];
            CONFIG.getCCPATimeout().should.be.equal(CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT);
	done();
        });
    });

    describe('#getSchainObject',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAINOBJECT] = {
                "validation": "strict",
                "config": {
                    "ver": "1.0",
                    "complete": 1,
                    "nodes": [{
                        "asi": "indirectseller.com",
                        "sid": "00001",
                        "hp": 1
                    }]
                }
            };
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAINOBJECT];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getSchainObject.should.be.a('function');
            done();
        });

        it('should return confing if present', function(done) {
            var expectedResult = {
                "validation": "strict",
                "config": {
                    "ver": "1.0",
                    "complete": 1,
                    "nodes": [{
                        "asi": "indirectseller.com",
                        "sid": "00001",
                        "hp": 1
                    }]
                }
            };
            CONFIG.getSchainObject().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return empty object if config is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAINOBJECT];
            CONFIG.getSchainObject().should.be.deep.equal({});
            done();
        });
    });

    describe('#isSchainEnabled',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAIN] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAIN];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.isSchainEnabled.should.be.a('function');
            done();
        });

        it('should return 1 by reading from config', function(done) {
            var expectedResult = 1;
            CONFIG.isSchainEnabled().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return 0 if isSchainExnabled is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAIN];
            expect(CONFIG.isSchainEnabled()).to.equal(0);
            done();
        });

        it('should return 0 if isSchainEnabled set to "0"', function(done) {
            var expectedResult = 0;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.SCHAIN] = "0";
            CONFIG.isSchainEnabled().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#isFloorPriceModuleEnabled',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_PRICE_MODULE_ENABLED] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_PRICE_MODULE_ENABLED];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.isFloorPriceModuleEnabled.should.be.a('function');
            done();
        });

        it('should return true by reading from config', function(done) {
            var expectedResult = true;
            expect(CONFIG.isFloorPriceModuleEnabled()).to.equal(expectedResult);
            done();
        });

        it('should return false if isFloorPriceModuleEnabled is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_PRICE_MODULE_ENABLED];
            expect(CONFIG.isFloorPriceModuleEnabled()).to.equal(false);
            done();
        });

        it('should return false if isFloorPriceModuleEnabled set to "0"', function(done) {
            var expectedResult = false;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_PRICE_MODULE_ENABLED] = "0";
            CONFIG.isFloorPriceModuleEnabled().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getFloorAuctionDelay',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_AUCTION_DELAY] = "200";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_AUCTION_DELAY];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getFloorAuctionDelay.should.be.a('function');
            done();
        });

        it('should return true by reading from config', function(done) {
            var expectedResult = 200;
            expect(CONFIG.getFloorAuctionDelay()).to.equal(200);
            done();
        });

        it('should return false if getFloorAuctionDelay is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_AUCTION_DELAY];
            expect(CONFIG.getFloorAuctionDelay()).to.equal(100);
            done();
        });
    });

    describe('#getFloorType',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_ENFORCE_JS] = "hard";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_ENFORCE_JS];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getFloorType.should.be.a('function');
            done();
        });

        it('should return true by reading from config', function(done) {
            var expectedResult = true;
            expect(CONFIG.getFloorType()).to.equal(expectedResult);
            done();
        });

        it('should return false if getFloorType is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_ENFORCE_JS];
            expect(CONFIG.getFloorType()).to.equal(false);
            done();
        });

        it('should return false if getFloorType set to "0"', function(done) {
            var expectedResult = false;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_ENFORCE_JS] = "soft";
            CONFIG.getFloorType().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getFloorJsonUrl',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_JSON_URL] = "floor.json";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.FLOOR_JSON_URL];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getFloorJsonUrl.should.be.a('function');
            done();
        });

        it('should return url by reading from config', function(done) {
            var expectedResult = "floor.json";
            expect(CONFIG.getFloorJsonUrl()).to.equal(expectedResult);
            done();
        });

    });

    describe('#isAbTestEnabled',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.AB_TEST_ENABLED] = "1";
            done();
        });

        afterEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.AB_TEST_ENABLED] = "0";
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.isAbTestEnabled.should.be.a('function');
            done();
        });

        it('should return 1 by reading from config', function(done) {
            var expectedResult = true;
            expect(CONFIG.isAbTestEnabled()).to.be.equal(expectedResult);
            done();
        });

        it('should return 0 if isAbTestEnabled is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.AB_TEST_ENABLED];
            expect(CONFIG.isAbTestEnabled()).to.equal(false);
            done();
        });

        it('should return 0 if isAbTestEnabled set to "0"', function(done) {
            var expectedResult = false;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.AB_TEST_ENABLED] = "0";
            CONFIG.isAbTestEnabled().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getTestGroupDetails',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.COMMON.TEST_GROUP_DETAILS] = {
                "testGroupSize":50
            };
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.COMMON.TEST_GROUP_DETAILS];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getTestGroupDetails.should.be.a('function');
            done();
        });

        it('should return confing if present', function(done) {
            var expectedResult = {
                "testGroupSize":50
            };
            CONFIG.getTestGroupDetails().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return empty object if config is not present',function(done){
            delete CONF[CONSTANTS.COMMON.TEST_GROUP_DETAILS];
            CONFIG.getTestGroupDetails().should.be.deep.equal({});
            done();
        });
    });

    describe('#getTestPWTConfig',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.COMMON.TEST_PWT] = {
                "t":5000
            };
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.COMMON.TEST_PWT];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getTestPWTConfig.should.be.a('function');
            done();
        });

        it('should return confing if present', function(done) {
            var expectedResult = {
                "t":5000
            }
            CONFIG.getTestPWTConfig().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return empty object if config is not present',function(done){
            delete CONF[CONSTANTS.COMMON.TEST_PWT];
            CONFIG.getTestPWTConfig().should.be.deep.equal({});
            done();
        });
    });

    describe('#updateABTestConfig',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.AB_TEST_ENABLED] = "1";
            CONF[CONSTANTS.COMMON.TEST_GROUP_DETAILS]  = {
                "testGroupSize": 99
            };
            CONF[CONSTANTS.COMMON.TEST_PWT]  = {
                "t": 5000
            };
            done();
        });

        afterEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.AB_TEST_ENABLED] = "0";     
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.updateABTestConfig.should.be.a('function');
            done();
        });

        it('should update the conf if random number is less than test group size', function(done) {
            var expectedTimeout = CONFIG.getTestPWTConfig().t;
            CONFIG.updateABTestConfig()
            CONFIG.getTimeout().should.be.deep.equal(expectedTimeout);
            done();
        });

        it('should not update the conf if random number is greater than test group size', function(done) {
            CONF[CONSTANTS.COMMON.TEST_GROUP_DETAILS]  = {
                "testGroupSize": 1
            };
            var expectedTimeout = CONFIG.getTimeout();
            CONFIG.updateABTestConfig()
            CONFIG.getTimeout().should.be.deep.equal(expectedTimeout);
            done();
        });

        it('should update the identityConfig to test config even if identity is not present', function(done){
            var result = {
                pubCommonId: {
                    name: "pubCommonId",
                    "storage.type": "cookie",
                    "storage.name": "_myPubCommonId",
                    "storage.expires": "1825"
                },
                identityLink: {
                    name: "identityLink",
                    "params.pid": "23",
                    "storage.type": "cookie",
                    "params.loadAts": "true", // or false// boolean default is false,
                    "params.placementID": "23",
                    "params.storageType": "localstorage",
                    "params.detectionType": "scrapeAndUrl",
                    "params.urlParameter": "eparam",
                    "params.cssSelectors": ["input[type=text]", "input[type=email]"],
                    "params.logging": "info",
                    "storage.name": "somenamevalue",
                    "storage.expires": "60"
                }
            };
            CONF[CONSTANTS.COMMON.TEST_PWT]  = {};
            CONF[CONSTANTS.COMMON.TEST_IDENTITY_PARTNER]  =  result
            CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS]  = {};
            CONFIG.updateABTestConfig()
            expect(CONFIG.getIdentityPartners()).to.deep.equal(result);
            done();
        });

        it('should not update the identityConfig to test config even if control identity is not present', function(done){
            CONF[CONSTANTS.COMMON.TEST_GROUP_DETAILS]  = {
                "testGroupSize": 1
            };
            var result = {
                pubCommonId: {
                    name: "pubCommonId",
                    "storage.type": "cookie",
                    "storage.name": "_myPubCommonId",
                    "storage.expires": "1825"
                },
                identityLink: {
                    name: "identityLink",
                    "params.pid": "23",
                    "storage.type": "cookie",
                    "params.loadAts": "true", // or false// boolean default is false,
                    "params.placementID": "23",
                    "params.storageType": "localstorage",
                    "params.detectionType": "scrapeAndUrl",
                    "params.urlParameter": "eparam",
                    "params.cssSelectors": ["input[type=text]", "input[type=email]"],
                    "params.logging": "info",
                    "storage.name": "somenamevalue",
                    "storage.expires": "60"
                }
            };
            CONF[CONSTANTS.COMMON.TEST_PWT]  = {};
            CONF[CONSTANTS.COMMON.TEST_IDENTITY_PARTNER]  =  result
            CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS]  = {};
            CONFIG.updateABTestConfig()
            expect(CONFIG.getIdentityPartners()).to.deep.equal({});
            done();
        });
    });

    describe('#getTestPartnerConfig',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.COMMON.TEST_PARTNER] = {
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
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.COMMON.TEST_PARTNER];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.getTestPartnerConfig.should.be.a('function');
            done();
        });

        it('should return confing if present', function(done) {
            var expectedResult = {
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
            CONFIG.getTestPartnerConfig().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return empty object if config is not present',function(done){
            delete CONF[CONSTANTS.COMMON.TEST_PARTNER];
            CONFIG.getTestPartnerConfig().should.be.deep.equal({});
            done();
        });
    });

    describe('#updatePartnerConfig',function(){
        var adapters;
        beforeEach(function(done){
            CONF[CONSTANTS.COMMON.TEST_PARTNER] = {
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
            adapters = {
                pubmatic: {
                    rev_share: "0.0",
                    throttle: "100",
                    publisherId: "156209",
                    kgp: "_W_x_H_@_W_x_H_:_AUI_"
                },
                audienceNetwork: {
                    rev_share: "0.0",
                    throttle: "100",
                    kgp: "_DIV_",
                    klm: {
                        "Div1": {
                            placementId: "8801674"
                        },
                        "Div2": {
                            placementId: "8801685"
                        }
                    }
                }
            }
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.COMMON.TEST_PARTNER];
            done();
        })
        
        it('is a function', function(done) {
            CONFIG.updatePartnerConfig.should.be.a('function');
            done();
        });

        it('should return only test partner when there are no common partners in control and test', function(done) {
            var expectedResult = {
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
            var updatedPartners = CONFIG.updatePartnerConfig(CONF[CONSTANTS.COMMON.TEST_PARTNER],adapters);
            expect(updatedPartners).to.be.deep.equal(expectedResult);
            done();
        });

        it('should return test partner along with control when there are common partners in control and test', function(done) {
            CONF[CONSTANTS.COMMON.TEST_PARTNER] = {
                pubmatic:{},
                audienceNetwork:{},
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
            var expectedResult = {
                pubmatic: {
                    rev_share: "0.0",
                    throttle: "100",
                    publisherId: "156209",
                    kgp: "_W_x_H_@_W_x_H_:_AUI_"
                },
                audienceNetwork: {
                    rev_share: "0.0",
                    throttle: "100",
                    kgp: "_DIV_",
                    klm: {
                        "Div1": {
                            placementId: "8801674"
                        },
                        "Div2": {
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
            var updatedPartners = CONFIG.updatePartnerConfig(CONF[CONSTANTS.COMMON.TEST_PARTNER],adapters);
            expect(updatedPartners).to.be.deep.equal(expectedResult);
            done();
        });

        it('should return test partner along with control with updated values when there are common partners in control and test', function(done) {
            CONF[CONSTANTS.COMMON.TEST_PARTNER] = {
                pubmatic:{  
                    rev_share: "98.0",
                    timeout: "500",
                },
                audienceNetwork:{},
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
            var expectedResult = {
                "pubmatic": {
                    "rev_share": "98.0",
                    "timeout": "500",
                    "publisherId": "156209",
                    "throttle": "100",
                    "kgp": "_W_x_H_@_W_x_H_:_AUI_"
                },
                "audienceNetwork": {
                    "rev_share": "0.0",
                    "throttle": "100",
                    "kgp": "_DIV_",
                    "klm": {
                        "Div1": {
                            "placementId": "8801674"
                        },
                        "Div2": {
                            "placementId": "8801685"
                        }
                    }
                },
                "pulsepoint": {
                    "cp": "521732",
                    "rev_share": "0.0",
                    "throttle": "100",
                    "kgp": "_DIV_",
                    "klm": {
                        "Div_1": {
                            "ct": "76835"
                        },
                        "Div-2": {
                            "ct": "147007"
                        }
                    }
                },
                "rubicon": {
                    "accountId": "10998",
                    "rev_share": "0.0",
                    "timeout": "1000",
                    "throttle": "100",
                    "pt": 0,
                    "serverSideEnabled": "0",
                    "amp": 0,
                    "video": 0,
                    "in-app": 0,
                    "kgp_rx": "_AU_@_DIV_@_W_x_H_",
                    "klm_rx": [{
                        "rx": {
                            "DIV": ".*",
                            "AU": "^/43743431/DMDemo",
                            "SIZE": "728x90"
                        },
                        "rx_config": {
                            "zoneId": "869224",
                            "siteId": "178620",
                            "floor": "0"
                        }
                    }]
                }
            };
            var updatedPartners = CONFIG.updatePartnerConfig(CONF[CONSTANTS.COMMON.TEST_PARTNER],adapters);
            expect(updatedPartners).to.be.deep.equal(expectedResult);
            done();
        });

        it('should return control object if test config is not present but test is enabled',function(done){
            CONF[CONSTANTS.COMMON.TEST_PARTNER]= {};
            var updatedPartners = CONFIG.updatePartnerConfig(CONF[CONSTANTS.COMMON.TEST_PARTNER],adapters);
            expect(updatedPartners).to.be.deep.equal(adapters);
            done();
        });

        //Test Cases for Idenentity Partners
        describe('updateIdentityPartners', function(){
            var identityPartners,testIdentityPartners;
            beforeEach(function(done){
                identityPartners = {
                    pubCommonId: {
                        name: "pubCommonId",
                        "storage.type": "cookie",
                        "storage.name": "_myPubCommonId",
                        "storage.expires": "1825"
                    },
                    identityLink: {
                        name: "identityLink",
                        "params.pid": "23",
                        "storage.type": "cookie",
                        "params.loadAts": "true", // or false// boolean default is false,
                        "params.placementID": "23",
                        "params.storageType": "localstorage",
                        "params.detectionType": "scrapeAndUrl",
                        "params.urlParameter": "eparam",
                        "params.cssSelectors": ["input[type=text]", "input[type=email]"],
                        "params.logging": "info",
                        "storage.name": "somenamevalue",
                        "storage.expires": "60"
                    }
                };
                testIdentityPartners = {
                    criteo: {
                        name: "criteo",
                    },
                    unifiedId: {
                        name: "unifiedId",
                        "params.url": "https://match.adsrvr.org/track/rid?ttd_pid=PubMatic&fmt=json",
                        "storage.type": "cookie",
                        "storage.name": "_myUnifiedId",
                        "storage.expires": "1825"
                    }
                }
                done();
            });

            afterEach(function(done){
                // identityPartners = null;
                // testIdeneityPartners = null;
                done();
            })

            it('should return only test partner when there are no common partners in control and test', function(done) {
                var expectedResult = {
                    criteo: {
                        name: "criteo",
                    },
                    unifiedId: {
                        name: "unifiedId",
                        "params.url": "https://match.adsrvr.org/track/rid?ttd_pid=PubMatic&fmt=json",
                        "storage.type": "cookie",
                        "storage.name": "_myUnifiedId",
                        "storage.expires": "1825"
                    }
                };
                var updatedPartners = CONFIG.updatePartnerConfig(testIdentityPartners,identityPartners);
                expect(updatedPartners).to.be.deep.equal(expectedResult);
                done();
            });

            it('should return test partner along with control when there are common partners in control and test', function(done) {
                testIdentityPartners = {
                    pubCommonId:{},
                    identityLink:{},
                    criteo: {
                        name: "criteo",
                    },
                    unifiedId: {
                        name: "unifiedId",
                        "params.url": "https://match.adsrvr.org/track/rid?ttd_pid=PubMatic&fmt=json",
                        "storage.type": "cookie",
                        "storage.name": "_myUnifiedId",
                        "storage.expires": "1825"
                    }
                };
                var expectedResult = {
                    criteo: {
                        name: "criteo",
                    },
                    unifiedId: {
                        name: "unifiedId",
                        "params.url": "https://match.adsrvr.org/track/rid?ttd_pid=PubMatic&fmt=json",
                        "storage.type": "cookie",
                        "storage.name": "_myUnifiedId",
                        "storage.expires": "1825"
                    }, 
                    pubCommonId: {
                        name: "pubCommonId",
                        "storage.type": "cookie",
                        "storage.name": "_myPubCommonId",
                        "storage.expires": "1825"
                    },
                    identityLink: {
                        name: "identityLink",
                        "params.pid": "23",
                        "storage.type": "cookie",
                        "params.loadAts": "true", // or false// boolean default is false,
                        "params.placementID": "23",
                        "params.storageType": "localstorage",
                        "params.detectionType": "scrapeAndUrl",
                        "params.urlParameter": "eparam",
                        "params.cssSelectors": ["input[type=text]", "input[type=email]"],
                        "params.logging": "info",
                        "storage.name": "somenamevalue",
                        "storage.expires": "60"
                    }
                };
                var updatedPartners = CONFIG.updatePartnerConfig(testIdentityPartners, identityPartners);
                expect(updatedPartners).to.be.deep.equal(expectedResult);
                done();
            });

            it('should return test partner along with control with updated values when there are common partners in control and test', function(done) {
                testIdentityPartners = {
                    pubCommonId:{  "storage.name": "_testPubCommonId",},
                    identityLink:{},
                    criteo: {
                        name: "criteo",
                    },
                    unifiedId: {
                        name: "unifiedId",
                        "params.url": "https://match.adsrvr.org/track/rid?ttd_pid=PubMatic&fmt=json",
                        "storage.type": "cookie",
                        "storage.name": "_myUnifiedId",
                        "storage.expires": "1825"
                    }
                };
                var expectedResult = {
                    criteo: {
                        name: "criteo",
                    },
                    unifiedId: {
                        name: "unifiedId",
                        "params.url": "https://match.adsrvr.org/track/rid?ttd_pid=PubMatic&fmt=json",
                        "storage.type": "cookie",
                        "storage.name": "_myUnifiedId",
                        "storage.expires": "1825"
                    }, 
                    pubCommonId: {
                        name: "pubCommonId",
                        "storage.type": "cookie",
                        "storage.name": "_testPubCommonId",
                        "storage.expires": "1825"
                    },
                    identityLink: {
                        name: "identityLink",
                        "params.pid": "23",
                        "storage.type": "cookie",
                        "params.loadAts": "true", // or false// boolean default is false,
                        "params.placementID": "23",
                        "params.storageType": "localstorage",
                        "params.detectionType": "scrapeAndUrl",
                        "params.urlParameter": "eparam",
                        "params.cssSelectors": ["input[type=text]", "input[type=email]"],
                        "params.logging": "info",
                        "storage.name": "somenamevalue",
                        "storage.expires": "60"
                    }
                };
                var updatedPartners = CONFIG.updatePartnerConfig(testIdentityPartners,identityPartners);
                console.log("Updated Partners are ", JSON.stringify(updatedPartners));  
                expect(updatedPartners).to.be.deep.equal(expectedResult);
                done();
            });

            it('should return control object if test config is not present but test is enabled',function(done){
                testIdentityPartners = {};
                var updatedPartners = CONFIG.updatePartnerConfig(testIdentityPartners, identityPartners);
                expect(updatedPartners).to.be.deep.equal(identityPartners);
                done();
            }); 

            it('should not break the flow if control partner is not present',function(done){
                testIdentityPartners = {
                    pubCommonId:{  "storage.name": "_testPubCommonId",},
                    identityLink:{},
                    criteo: {
                        name: "criteo",
                    },
                    unifiedId: {
                        name: "unifiedId",
                        "params.url": "https://match.adsrvr.org/track/rid?ttd_pid=PubMatic&fmt=json",
                        "storage.type": "cookie",
                        "storage.name": "_myUnifiedId",
                        "storage.expires": "1825"
                    }
                };
                var updatedPartners = CONFIG.updatePartnerConfig(testIdentityPartners, undefined);
                expect(updatedPartners).to.equal(undefined);
                done();
            })
        });
    });

    
    describe("#getMergedConfig",function(){
        var toObject,fromObject;
        beforeEach(function(done){
            toObject = {
                rev_share: "20"
            }
            fromObject = {
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
            }
            done();
        });

        afterEach(function(done){
            toObject = null;
            fromObject = null;
            done();
        });

        it('is a function', function(done) {
            CONFIG.getMergedConfig.should.be.a('function');
            done();
        });

        it('should copy all properties fromObject into toObject for common objects',function(done){
            var expectedResult = {
                rev_share: "20",
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
            }
            var output = CONFIG.getMergedConfig(toObject, fromObject);
            expect(output).to.be.deep.equal(expectedResult);
            done();
        });

        it('should return all properties of fromObject if there is no common props in to and from',function(done){
            toObject = {};
            var expectedResult = {
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
            }
            var output = CONFIG.getMergedConfig(toObject, fromObject);
            expect(output).to.be.deep.equal(expectedResult);
            done();
        });

        it('should return all properties of fromObject if there is no common props in to and from',function(done){
            toObject = {};
            var expectedResult = {
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
            }
            var output = CONFIG.getMergedConfig(toObject, fromObject);
            expect(output).to.be.deep.equal(expectedResult);
            done();
        });
    })

    describe('#getPriceGranularity',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.PRICE_GRANULARITY]  = "high";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.PRICE_GRANULARITY] ;
            done();
        })

        it('is a function', function(done) {
            CONFIG.getPriceGranularity.should.be.a('function');
            done();
        });

        it('should return high by reading from config', function(done) {
            var expectedResult = "high"
            expect(CONFIG.getPriceGranularity()).to.equal(expectedResult);
            done();
        });

        it('should return null if priceGranularity is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.PRICE_GRANULARITY];
            expect(CONFIG.getPriceGranularity()).to.equal(null);
            done();
        });
    });

    describe('#getGranularityMultiplier',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.GRANULARITY_MULTIPLIER] = "1.1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.GRANULARITY_MULTIPLIER];
            done();
        })

        it('is a function', function(done) {
            CONFIG.getGranularityMultiplier.should.be.a('function');
            done();
        });

        it('should return 1.1 by reading from config', function(done) {
            var expectedResult = 1.1;
            CONFIG.getGranularityMultiplier().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return 1 if isSchainExnabled is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.GRANULARITY_MULTIPLIER];
            expect(CONFIG.getGranularityMultiplier()).to.equal(1);
            done();
        });
    });

    describe('#isReduceCodeSizeFeatureEnabled', function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.REDUCE_CODE_SIZE] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.REDUCE_CODE_SIZE];
            done();
        });

        it('is a function', function(done) {
            CONFIG.isReduceCodeSizeFeatureEnabled.should.be.a('function');
            done();
        });

        it('should return true by reading reduceCodeSize from config', function(done) {            
            CONFIG.isReduceCodeSizeFeatureEnabled().should.be.deep.equal(true);
            done();
        });

        it('should return false if reduceCodeSize is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.REDUCE_CODE_SIZE];
            expect(CONFIG.isReduceCodeSizeFeatureEnabled()).to.equal(false);
            done();
        });

        it('should return false if reduceCodeSize set to "0"', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.REDUCE_CODE_SIZE] = "0";
            CONFIG.isReduceCodeSizeFeatureEnabled().should.be.deep.equal(false);
            done();
        });
    })

    describe('#forEachBidderAlias', function() {
        var obj = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, "forEachOnObject");
            obj = {
                callback: function() {
                    return "callback";
                }
            };
            sinon.spy(obj, "callback");
            CONF.alias = {
                appnexus2 : "appnexus"
            }
            done();
        });

        afterEach(function(done) {
            UTIL.forEachOnObject.restore();
            obj.callback.restore();
            CONF.alias = {};
            done();
        });

        it('is a function', function(done) {
            CONFIG.forEachBidderAlias.should.be.a('function');
            done();
        });

        it('should have called UTIL.forEachOnObject with conf alias and callback function being passed', function(done) {
            CONFIG.forEachBidderAlias(obj.callback);
            UTIL.forEachOnObject.calledWith(CONF.alias, obj.callback).should.be.true;
            obj.callback.called.should.be.true;
            done();
        });
    });

    describe('#getAdapterNameForAlias', function() {

        beforeEach(function(done) {
            CONF.alias = {
                appnexus2 : "appnexus"
            }
            done();
        });

        afterEach(function(done) {
            CONF.alias = null;
            done();
        });

        it('is a function', function(done) {
            CONFIG.getAdapterNameForAlias.should.be.a('function');
            done();
        });

        it('should return adapter name when alias name is passed', function(done) {
            expect(CONFIG.getAdapterNameForAlias("appnexus2")).to.equal("appnexus");
            done();
        });

        it('should return the input value , if alias name is not present in alias array', function(done) {
            expect(CONFIG.getAdapterNameForAlias("pubmatic")).to.equal("pubmatic");
            done();
        });
    });

    describe('#isSSOEnabled',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.SSO_ENABLED] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.SSO_ENABLED];
            done();
        })
    });

});
