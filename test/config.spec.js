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

        it('should return 1000 when pubid is not present in conf', function(done) {
            delete CONF.pwt.t;
            CONFIG.getTimeout().should.be.equal(1000);
            done();
        });
    });

    describe('#getAdapterRevShare', function() {
        var adapterID = null;

        beforeEach(function(done) {
            sinon.stub(UTIL, "isOwnProperty");
            adapterID = commonAdapterID;
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            adapterID = null;
            done();
        });

        it('is a function', function(done) {
            CONFIG.getAdapterRevShare.should.be.a('function');
            done();
        });

        it('returns revShare value as 1 when revShare value is not present in conf of given adapterID', function(done) {
            UTIL.isOwnProperty.returns(false);
            CONFIG.getAdapterRevShare().should.equal(1);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('returns revShare value when revShare value is present in conf of given adapterID', function(done) {
            CONFIG.getAdapterRevShare().should.equal(1 - window.parseFloat(CONF.adapters[adapterID].rev_share) / 100);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });
    });

    describe('#getAdapterThrottle', function() {
        var adapterID = null;

        beforeEach(function(done) {
            sinon.stub(UTIL, "isOwnProperty");
            adapterID = commonAdapterID;
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            adapterID = null;
            done();
        });

        it('is a function', function(done) {
            CONFIG.getAdapterThrottle.should.be.a('function');
            done();
        });


        it('returns throttle value as 0 when throttle value is not present in conf of given adapterID', function(done) {
            UTIL.isOwnProperty.returns(false);
            CONFIG.getAdapterThrottle().should.equal(0);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('returns throttle value when throttle value is present in conf of given adapterID', function(done) {
            CONFIG.getAdapterThrottle().should.equal(100 - CONF.adapters[adapterID].throttle);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });
    });

    describe('#getBidPassThroughStatus', function() {
        var adapterID = null;

        beforeEach(function(done) {
            sinon.stub(UTIL, "isOwnProperty");
            adapterID = commonAdapterID;
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            adapterID = null;
            done();
        });

        it('is a function', function(done) {
            CONFIG.getBidPassThroughStatus.should.be.a('function');
            done();
        });

        it('returns BidPassThroughStatus value as 0 when BidPassThroughStatus value is not present in conf of given adapterID', function(done) {
            UTIL.isOwnProperty.returns(false);
            CONFIG.getBidPassThroughStatus().should.equal(0);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('returns BidPassThroughStatus value when BidPassThroughStatus value is present in conf of given adapterID', function(done) {
            CONF.adapters[adapterID] = {
                pt: "0"
            };
            CONFIG.getBidPassThroughStatus().should.equal(window.parseInt(CONF.adapters[adapterID].pt));
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

        beforeEach(function(done) {
            sinon.stub(UTIL, "forEachOnObject").returns(true);
            done();
        });

        afterEach(function(done) {
            UTIL.forEachOnObject.restore();
            done();
        });

        it('is a function', function(done) {
            CONFIG.forEachAdapter.should.be.a('function');
            done();
        });

        it('should have called UTIL.forEachOnObject with conf adapters and callback function being passed', function(done) {
            var callback = function() {
                console.log("callback");
            };
            CONFIG.forEachAdapter(callback);
            UTIL.forEachOnObject.calledWith(CONF.adapters, callback).should.be.true;
            done();
        });

    });

    describe('#addPrebidAdapter', function() {

        it('is a function', function(done) {
            CONFIG.addPrebidAdapter.should.be.a('function');
            done();
        });
    });

    describe('#initConfig', function() {

        it('is a function', function(done) {
            CONFIG.initConfig.should.be.a('function');
            done();
        });
    });
});
