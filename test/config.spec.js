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
    });
});
