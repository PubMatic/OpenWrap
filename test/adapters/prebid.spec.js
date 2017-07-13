/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;


var CONFIG = require("../../src_new/config.js");
var CONSTANTS = require("../../src_new/constants.js");
var BID = require("../../src_new/bid.js");
var UTIL = require("../../src_new/util.js");
var bidManager = require("../../src_new/bidManager.js");


var SLOT = require("../../src_new/slot.js").Slot;

var PREBID = require("../../src_new/adapters/prebid.js");

var parentAdapterID = "prebid";

var commonAdpterID = 'pubmatic';
var commonDivID = "DIV_1";
var commonKGPV = "XYZ";
// var kgpvMap = {};

// var commonActiveSlots = [new Slot("Slot_1"), new Slot("Slot_2")];

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


describe('ADAPTER: Prebid', function() {
	
    describe('#handleBidResponses', function() {
        it('is a function', function(done) {
            PREBID.handleBidResponses.should.be.a('function');
            done();
        });
    });

    describe('#MyFunction', function () {
    	it('is a function', function (done) {
    		PREBID.MyFunction.should.be.a('function');
    		done();
    	});
    });

    describe('#generatePbConf', function() {
        var adapterID = null;
        var adapterConfig = null;
        var activeSlots = null;
        var adUnits = null;
        var impressionID = null;

        beforeEach(function(done) {
            adapterID = commonAdpterID;
            adapterConfig = {};
            activeSlots = [new SLOT("Slot_1"), new SLOT("Slot_2")];
            adUnits = "ad_unit_1";
            impressionID = 123123123;
            sinon.stub(UTIL, 'log');

            sinon.stub(UTIL, 'forEachGeneratedKey');
            done();
        });

        afterEach(function(done) {
            adapterID = null;
            adapterConfig = null;
            activeSlots = null;
            adUnits = null;
            impressionID = null;
            UTIL.log.restore();
            UTIL.forEachGeneratedKey.restore();
            done();
        });

        it('is a function', function(done) {
            PREBID.generatePbConf.should.be.a('function');
            done();
        });

        it('should have logged passed adapterID and return if adapterConfig is not valid', function(done) {
            adapterConfig = null;
            PREBID.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
            UTIL.log.calledWith(adapterID + CONSTANTS.MESSAGES.M1);
            UTIL.forEachGeneratedKey.called.should.be.false;
            done();
        });

        it('should have called UTIL.forEachGeneratedKey with proper input', function(done) {
        	adapterConfig = {};
        	adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN] = "value_1",
            adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] = "value_2",	
            PREBID.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
            UTIL.log.calledWith(adapterID + CONSTANTS.MESSAGES.M1);
            UTIL.forEachGeneratedKey.called.should.be.true;
            UTIL.forEachGeneratedKey.calledWith(adapterID,
                adUnits,
                adapterConfig,
                impressionID, [],
                activeSlots,
                adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN],
                adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || null,
                PREBID.MyFunction,
                true).should.be.true;
            done();
        });
    });

    describe('#fetchBids', function() {
        var activeSlots = null;
        var impressionID = null;

        beforeEach(function(done) {
            activeSlots = [new SLOT("Slot_1"), new SLOT("Slot_2")];
            impressionID = 123123123;
            sinon.spy(UTIL, 'log');
            sinon.spy(UTIL, 'isOwnProperty');
            sinon.spy(UTIL, 'isFunction');

            sinon.spy(CONFIG, 'forEachAdapter');

            sinon.stub(PREBID, 'generatePbConf');
            PREBID.generatePbConf.returns(true);
            window.pbjs = {

            };
            done();
        });

        afterEach(function(done) {
            activeSlots = null;
            impressionID = null;
            UTIL.log.restore();
            UTIL.isOwnProperty.restore();
            UTIL.isFunction.restore();

            CONFIG.forEachAdapter.restore();
            PREBID.generatePbConf.restore();
            delete window.pbjs;
            done();
        });

        it('is a function', function(done) {
            PREBID.fetchBids.should.be.a('function');
            done();
        });

        it('returns while logging it when Prebid js is not loaded', function(done) {
            window.pbjs = null;
            PREBID.fetchBids(activeSlots, impressionID);
            UTIL.log.calledWith("PreBid js is not loaded").should.be.true;
            CONFIG.forEachAdapter.called.should.be.false;
            done();
        });

        // TODO : change TDD as predbi.js code has changed a bit
        xit('should have called generatePbConf', function(done) {
            PREBID.fetchBids(activeSlots, impressionID);
            // UTIL.log.calledWith("PreBid js is not loaded").should.be.true;
            // CONFIG.forEachAdapter.called.should.be.false;
            PREBID.generatePbConf.called.should.be.true;
            done();
        });
    });

    describe('#getParenteAdapterID', function() {
        it('is a function', function(done) {
            PREBID.getParenteAdapterID.should.be.a('function');
            done();
        });

        it('returns parentAdapterID', function(done) {
            PREBID.getParenteAdapterID().should.equal(PREBID.parentAdapterID);
            done();
        });
    });

    describe('#register', function() {
        it('is a function', function(done) {
            PREBID.register.should.be.a('function');
            done();
        });

        it('returns object with methods to use', function(done) {
            PREBID.register().should.deep.equal({
                fB: PREBID.fetchBids,
                ID: PREBID.getParenteAdapterID
            });
            done();
        });
    });
});
