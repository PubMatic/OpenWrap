/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var ADPTMgr = require('../src_new/adapterManager');
var CONFIG = require("../src_new/config.js");
var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");
var BIDMANAGER = require("../src_new/bidManager.js");
var prebid = require("../src_new/adapters/prebid.js");
var conf = require('../src_new/conf');

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

describe("adapterManager : ADPTMgr", function() {


    describe("#callAdapters", function() {

        var activeSlots = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, 'generateUUID');
            sinon.spy(ADPTMgr, 'resetSlots');
            sinon.spy(ADPTMgr, 'callAdapter');
            activeSlots = {};
            done();
        });

        afterEach(function(done) {
            UTIL.generateUUID.restore();
            ADPTMgr.resetSlots.restore();
            ADPTMgr.callAdapter.restore();
            activeSlots = null;
            done();
        });

        it('is a function', function(done) {
            ADPTMgr.callAdapters.should.be.a('function');
            done();
        });

        it('must have called resetSlots and callAdapter internally', function(done) {
            ADPTMgr.callAdapters(activeSlots);

            UTIL.generateUUID.calledOnce.should.be.true;
            ADPTMgr.resetSlots.calledOnce.should.be.true;
            ADPTMgr.callAdapter.calledOnce.should.be.true;

            done();
        });
    });


    /* start-test-block */
    describe('#getRandomNumberBelow100', function() {

        it('is a function', function (done) {
            ADPTMgr.getRandomNumberBelow100.should.be.a('function');
            done();
        });

        it('returns numeric value below 100', function(done) {
            var result = ADPTMgr.getRandomNumberBelow100();

            result.should.be.below(100);
            done();
        });
    });
    /* end-test-block */


    /* start-test-block */
    describe('#callAdapter', function() {

        var adapters = null,
            slots = null,
            impressionID = null,
            bidAdaptor = null;

        beforeEach(function(done) {
            bidAdaptor = {
                ID: function() {
                    return adapterID;
                },
                fB: function() {
                    return true;
                }
            };

            sinon.spy(UTIL, 'forEachOnObject');
            sinon.spy(ADPTMgr, 'throttleAdapter');
            sinon.spy(ADPTMgr, 'setInitTimeForSlotsForAdapter');
            adapters = conf.adapters, slots = {}, impressionID = {};
            UTIL.forEachOnObject(adapters, function(key, value) {
                adapters[key].ID = bidAdaptor.ID;
                adapters[key].fB = bidAdaptor.fB;
            });
            done();
        });

        afterEach(function(done) {
            UTIL.forEachOnObject.restore();
            ADPTMgr.throttleAdapter.restore();
            ADPTMgr.setInitTimeForSlotsForAdapter.restore();
            adapters = null, slots = null, impressionID = null;
            done();
        });

        it('is a function', function(done) {
            ADPTMgr.callAdapter.should.be.a('function');
            done();
        });

        it('should have called UTIL.forEachOnObject', function(done) {
            ADPTMgr.callAdapter(adapters, slots, impressionID);
            UTIL.forEachOnObject.called.should.be.true;
            done();
        });

        it('should have called setInitTimeForSlotsForAdapter when not throttling', function(done) {
            ADPTMgr.throttleAdapter.restore();
            sinon.stub(ADPTMgr, 'throttleAdapter');
            ADPTMgr.throttleAdapter.returns(false);

            ADPTMgr.callAdapter(adapters, slots, impressionID);
            ADPTMgr.setInitTimeForSlotsForAdapter.called.should.be.true;
            throttleAdapterStub = null;
            done();
        });
    });
    /* end-test-block */


    /* start-test-block */
    describe('#resetSlots', function() {
        var slots = null;
        var divID_1 = "DIV_ID_1";
        var divID_2 = "DIV_ID_2";
        var impressionID = "impressionIDDummy";
        beforeEach(function(done) {
            slots = [{
                getDivID: function() {
                    return divID_1;
                }
            }, {
                getDivID: function() {
                    return divID_2;
                }
            }];

            sinon.spy(UTIL, 'forEachOnArray');
            sinon.spy(UTIL, 'generateSlotNamesFromPattern');
            sinon.stub(BIDMANAGER, 'resetBid');
            sinon.stub(BIDMANAGER, 'setSizes');
            done();
        });


        afterEach(function(done) {
            UTIL.forEachOnArray.restore();
            UTIL.generateSlotNamesFromPattern.restore();
            BIDMANAGER.resetBid.restore();
            BIDMANAGER.setSizes.restore();
            slots = null;
            done();
        });

        it('is a function', function(done) {
            ADPTMgr.resetSlots.should.be.a('function');
            done();
        });

        //todo: we are calling forEachOnArray
        it('should have called UTIL.forEachOnObject', function(done) {
            ADPTMgr.resetSlots(slots, impressionID);
            UTIL.forEachOnArray.called.should.be.true;
            BIDMANAGER.resetBid.called.should.be.true;
            BIDMANAGER.setSizes.called.should.be.true;
            UTIL.generateSlotNamesFromPattern.called.should.be.true;
            UTIL.generateSlotNamesFromPattern.calledWith(slots[0], "_W_x_H_").should.be.true;
            done();

        });
    });
    /* end-test-block */
    

    /* start-test-block */
    describe('#throttleAdapter', function() {
        var adapterID = null;

        beforeEach(function(done) {
            adapterID = commonAdapterID;
            sinon.stub(CONFIG, 'getAdapterThrottle');
            CONFIG.getAdapterThrottle.returns(true);
            done();
        });

        afterEach(function(done) {
            CONFIG.getAdapterThrottle.restore();
            adapterID = null;
            done();
        });


        it('is a function', function(done) {
            ADPTMgr.throttleAdapter.should.be.a('function');
            done();
        });

        it('should have called CONFIG.getAdapterThrottle', function(done) {
            ADPTMgr.throttleAdapter(90, adapterID);
            CONFIG.getAdapterThrottle.calledOnce.should.be.true;
            done();
        });

        it('should return true when passed randomNumber is less than passed adapter ids throttle value ', function(done) {
            CONFIG.getAdapterThrottle.restore();
            sinon.stub(CONFIG, 'getAdapterThrottle');
            CONFIG.getAdapterThrottle.withArgs(adapterID).returns(90);
            ADPTMgr.throttleAdapter(80, adapterID).should.be.true;
            done();
        });


        it('should return false when passed randomNumber is greater than passed adapter ids throttle value ', function(done) {
            CONFIG.getAdapterThrottle.restore();
            sinon.stub(CONFIG, 'getAdapterThrottle');
            CONFIG.getAdapterThrottle.withArgs(adapterID).returns(90);
            ADPTMgr.throttleAdapter(99, adapterID).should.be.false;
            done();
        });
    });
    /* end-test-block */


    /* start-test-block */
    describe('#setInitTimeForSlotsForAdapter', function() {
        var adapterID = null;
        var slots = null;
        var divID_1 = "DIV_ID_1";
        var divID_2 = "DIV_ID_2";
        var impressionID = "impressionIDDummy";

        beforeEach(function(done) {
            slots = {
                slot_1: {
                    getDivID: function() {
                        return divID_1;
                    }
                },
                slot_2: {
                    getDivID: function() {
                        return divID_2;
                    }
                }
            };
            adapterID = commonAdapterID;
            sinon.stub(BIDMANAGER, 'setCallInitTime');
            sinon.spy(UTIL, 'forEachOnObject');
            done();
        });

        afterEach(function(done) {
            BIDMANAGER.setCallInitTime.restore();
            UTIL.forEachOnObject.restore();
            adapterID = null;
            slots = null;
            done();
        });

        it('is a function', function(done) {
            ADPTMgr.setInitTimeForSlotsForAdapter.should.be.a('function');
            done();
        });

        it('should have called UTIL.forEachOnObject', function(done) {
            ADPTMgr.setInitTimeForSlotsForAdapter(slots, adapterID);
            UTIL.forEachOnObject.called.should.be.true;
            BIDMANAGER.setCallInitTime.called.should.be.true;
            done();
        });
    });
    /* end-test-block */


    /* start-test-block */
    describe('#registerAdapter', function() {
        var bidAdaptor = null;
        var adapterID = null;

        beforeEach(function(done) {
            adapterID = commonAdapterID;
            bidAdaptor = {
                ID: function() {
                    return adapterID;
                },
                fB: function() {
                    console.log("Dummy fetBids : fB function ");
                }
            };
            sinon.spy(bidAdaptor, 'ID');
            sinon.spy(UTIL, 'isFunction');
            sinon.spy(UTIL, 'log');
            done();
        });

        afterEach(function(done) {
            UTIL.isFunction.restore();
            UTIL.log.restore();
            bidAdaptor.ID.restore();
            bidAdaptor = null;
            adapterID = null;
            done();
        });

        it('is a function', function(done) {
            ADPTMgr.registerAdapter.should.be.a('function');
            done();
        });

        it('should call UTIL.log if bidAdaptor is not an object', function(done) {
            ADPTMgr.registerAdapter(null);
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M3).should.be.true;
            UTIL.log.calledWith(null).should.be.true;
            done();
        });

        it('should have called UTIL isFunction and bidAdaptor.ID', function(done) {
            ADPTMgr.registerAdapter(bidAdaptor);
            UTIL.isFunction.calledOnce.should.be.true;
            bidAdaptor.ID.called.should.be.true;
            done();
        });

        it('should have added bidAdaptor into registeredAdapters if bidAdaptor has fB function with given adapterID', function(done) {
            ADPTMgr.registerAdapter(bidAdaptor);
            ADPTMgr.registeredAdapters[adapterID].should.deep.equal(bidAdaptor);
            done();
        });


        it('should have caled UTIL.log if bidAdaptor doesnt have fB function', function(done) {
            delete bidAdaptor.fB;
            ADPTMgr.registerAdapter(bidAdaptor);
            UTIL.log.calledOnce.should.be.true;
            ADPTMgr.registeredAdapters[adapterID].should.not.equal(bidAdaptor);
            UTIL.log.calledWith(bidAdaptor.ID() + CONSTANTS.MESSAGES.M3).should.be.true;
            done();
        });
    });
    /* end-test-block */


    /* start-test-block */
    describe('#registerAdapters', function() {


        beforeEach(function(done) {
            sinon.spy(ADPTMgr, "registerAdapter");
            sinon.spy(prebid, 'register');
            done();
        });

        afterEach(function(done) {
            ADPTMgr.registerAdapter.restore();
            prebid.register.restore();
            done();
        });

        it('is a function', function(done) {
            ADPTMgr.registerAdapters.should.be.a('function');
            done();
        });

        it('should have called ADPTMgr.registerAdapter and prebid.register', function(done) {
            ADPTMgr.registerAdapters();
            ADPTMgr.registerAdapter.calledOnce.should.be.true;
            prebid.register.calledOnce.should.be.true;
            done();
        });
    });
    /* end-test-block */
});
