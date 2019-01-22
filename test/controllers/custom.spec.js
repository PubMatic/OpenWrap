/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CUSTOM = require("../../src_new/controllers/custom.js");
var UTIL = require("../../src_new/util.js");
var AM = require("../../src_new/adapterManager.js");
var CONSTANTS = require("../../src_new/constants.js");
var CONFIG = require("../../src_new/config.js");
var BM = require("../../src_new/bidManager.js");
var SLOT = require("../../src_new/slot.js");
var commonDivID = "DIV_1";

describe("CONTROLLER: CUSTOM", function() {

	describe("#setWindowReference()", function() {
        var nonObject = 0;

        beforeEach(function (done) {
            sinon.spy(UTIL, "isObject");
            done();
        });

        afterEach(function (done) {
            UTIL.isObject.restore();
            done();
        });

        it("should not set WindowReference if argument is not object", function(done) {
            CUSTOM.setWindowReference(nonObject);
            expect(CUSTOM.getWindowReference() === null).to.equal(true);
            UTIL.isObject.returned(false).should.be.true;
            UTIL.isObject.calledOnce.should.be.true;
            done();
        });

        it("should set WindowReference if argument is object", function(done) {
            CUSTOM.setWindowReference(window);
            CUSTOM.getWindowReference().should.be.deep.equal(window);
            UTIL.isObject.calledOnce.should.be.true;
            UTIL.isObject.returned(true).should.be.true;
            done();
        });
    });

    describe('#getWindowReference', function () {
        it('is a function', function (done) {
            CUSTOM.getWindowReference.should.be.a('function');
            done();
        });

        it('should return the window object reference', function (done) {
            CUSTOM.setWindowReference(window);
            CUSTOM.getWindowReference().should.deep.equal(window);
            done();
        });
    });

    describe("#getAdUnitIndex()", function() {
        var random = null;
        var currentGoogleSlotStub = null;

        beforeEach(function (done) {
            random = Math.floor(Math.random() * 100);
            currentGoogleSlotStub = {
                getSlotId: function() {
                    return this;
                },
                getId: function() {
                    return "abcd_" + random;
                }
            };
            sinon.spy(currentGoogleSlotStub, "getSlotId");
            sinon.spy(currentGoogleSlotStub, "getId");
            done();
        });

        afterEach(function (done) {
            currentGoogleSlotStub.getSlotId.restore();
            currentGoogleSlotStub.getId.restore();
            random = null;
            currentGoogleSlotStub = null;
            done();
        });


        it("should return 0 when the object passed is null ", function(done) {
            CUSTOM.getAdUnitIndex(null).should.equal(0);
            done();
        });

        it("should return 0 when the object passed is number ", function(done) {
            CUSTOM.getAdUnitIndex(0).should.equal(0);
            done();
        });

        it("should return 0 when the object passed is empty string ", function(done) {
            CUSTOM.getAdUnitIndex("").should.equal(0);
            done();
        });

        it("should return 0 when the object passed is not empty string ", function(done) {
            CUSTOM.getAdUnitIndex("abcd").should.equal(0);
            done();
        });

        it("should return 0 when the object passed does not have required method ", function(done) {
            CUSTOM.getAdUnitIndex({}).should.equal(0);
            done();
        });


        it("should return random when the object passed does have required method ", function(done) {
            CUSTOM.getAdUnitIndex(currentGoogleSlotStub).should.equal(random);
            currentGoogleSlotStub.getSlotId.calledOnce.should.be.true;
            currentGoogleSlotStub.getId.calledOnce.should.be.true;
            done();
        });
    });

    describe("#defineWrapperTargetingKey()", function() {

        beforeEach(function (done) {
            sinon.spy(UTIL, "isObject");
            done();
        });

        afterEach(function (done) {
            UTIL.isObject.restore();
            done();
        });

        it("is a function", function(done) {
            CUSTOM.defineWrapperTargetingKey.should.be.a("function");
            done();
        });

        it("set wrapper Targeting Key's value to empty string", function(done) {
            CUSTOM.defineWrapperTargetingKey("DIV_1");
            CUSTOM.wrapperTargetingKeys["DIV_1"].should.equal("");
            done();
        });


        it("initialize wrapperTargetingKeys if its not been initialized", function(done) {
            CUSTOM.wrapperTargetingKeys = null;
            CUSTOM.defineWrapperTargetingKey("DIV_2");
            CUSTOM.wrapperTargetingKeys["DIV_2"].should.equal("");
            Object.keys(CUSTOM.wrapperTargetingKeys).length.should.be.equal(1);
            UTIL.isObject.returned(false).should.be.true;
            done();
        });
    });

    describe("#defineWrapperTargetingKeys()", function() {

        it("should return empty object when empty object is passed", function(done) {
            CUSTOM.defineWrapperTargetingKeys({}).should.deep.equal({});
            done();
        });

        describe("When object with keys n values is passed", function() {
            beforeEach(function(done) {
                sinon.spy(UTIL, "forEachOnObject");
                done();
            });

            afterEach(function(done) {
                UTIL.forEachOnObject.restore();
                done();
            });

            var inputObject = {
                "key1": "value1",
                "key2": "value2"
            };

            var outputObject = {
                "value1": "",
                "value2": ""
            };

            it('should return empty object when given input object doesnt have any key value pairs', function (done) {
                CUSTOM.defineWrapperTargetingKeys({}).should.deep.equal({});
                done();
            });

            it("should return object with values as keys and respective value should be empty strings", function(done) {
                CUSTOM.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
                done();
            });

            it("should have called util.forEachOnObject", function(done) {
                CUSTOM.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
                UTIL.forEachOnObject.calledOnce.should.equal(true);
                done();
            });
        });
    });

    describe("#callJsLoadedIfRequired", function() {

        it("should return false when the object passed is string ", function() {
            CUSTOM.callJsLoadedIfRequired("").should.equal(false);
        });

        it("should return false when the object passed is number ", function() {
            CUSTOM.callJsLoadedIfRequired(1).should.equal(false);
        });

        it("should return false when the object passed is null ", function() {
            CUSTOM.callJsLoadedIfRequired(null).should.equal(false);
        });

        it("should return false when the object is not passed ", function() {
            CUSTOM.callJsLoadedIfRequired().should.equal(false);
        });

        it("should return false when the object passed is object but it does not have PWT property ", function() {
            CUSTOM.callJsLoadedIfRequired({}).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to null", function() {
            CUSTOM.callJsLoadedIfRequired({ PWT: null }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to string", function() {
            CUSTOM.callJsLoadedIfRequired({ PWT: "" }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to number", function() {
            CUSTOM.callJsLoadedIfRequired({ PWT: 1 }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but does not have jsLoaded property", function() {
            CUSTOM.callJsLoadedIfRequired({ PWT: {} }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to null", function() {
            CUSTOM.callJsLoadedIfRequired({ PWT: { jsLoaded: null } }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to number", function() {
            CUSTOM.callJsLoadedIfRequired({ PWT: { jsLoaded: 1 } }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to string", function() {
            CUSTOM.callJsLoadedIfRequired({ PWT: { jsLoaded: "" } }).should.equal(false);
        });

        var _test = {
            PWT: {}
        };
        _test.PWT.jsLoaded = function() {
            flag = true;
        };
        var flag = false;
        it("should return true when the object passed is object and PWT property is set and jsLoaded is set to function and the function is called", function() {
            CUSTOM.callJsLoadedIfRequired(_test).should.equal(true);
            flag.should.equal(true);
        });
    });

    describe('#initSafeFrameListener', function () {
        var theWindow = null;

        beforeEach(function (done) {
            sinon.stub(UTIL, "addMessageEventListenerForSafeFrame").returns(true);
            theWindow = {
                PWT: {
                    safeFrameMessageListenerAdded: true
                }
            };
            done();
        });

        afterEach(function (done) {
            UTIL.addMessageEventListenerForSafeFrame.restore();
            theWindow = null;
            done();
        });

        it('is a function', function (done) {
            CUSTOM.initSafeFrameListener.should.be.a('function');
            done();
        });


        it('should do nothing if message listener for safe frame is already added', function (done) {
            CUSTOM.initSafeFrameListener(theWindow);
            UTIL.addMessageEventListenerForSafeFrame.called.should.be.false;
            theWindow.PWT.safeFrameMessageListenerAdded.should.be.true;
            done();
        });


        it('should add message listener for safe frame if not added', function (done) {
            theWindow.PWT.safeFrameMessageListenerAdded = false;
            CUSTOM.initSafeFrameListener(theWindow);
            UTIL.addMessageEventListenerForSafeFrame.calledOnce.should.be.true;
            theWindow.PWT.safeFrameMessageListenerAdded.should.be.true;
            done();
        });
    });

    describe('#validateAdUnitObject', function () {
    	it('is a function', function(done) {
            CUSTOM.validateAdUnitObject.should.be.a('function');
            done();
        });
    });

    describe('#getAdSlotSizesArray()', function() {
        it('is a function', function(done) {
            CUSTOM.getAdSlotSizesArray.should.be.a('function');
            done();
        });
    });

    describe('#findWinningBidAndGenerateTargeting', function () {
    	it('is a function', function(done) {
            CUSTOM.findWinningBidAndGenerateTargeting.should.be.a('function');
            done();
        });
    });

    describe('#customServerExposedAPI', function () {
    	it('is a function', function(done) {
            CUSTOM.customServerExposedAPI.should.be.a('function');
            done();
        });
    });

    describe('#generateConfForGPT', function () {
    	it('is a function', function(done) {
            CUSTOM.generateConfForGPT.should.be.a('function');
            done();
        });
    });

    describe('#addKeyValuePairsOnSlotsForGPT', function () {
    	it('is a function', function(done) {
            CUSTOM.addKeyValuePairsOnSlotsForGPT.should.be.a('function');
            done();
        });
    });

    describe('#removeOpenWrapKeyValuePairsFromSlotsForGPT', function () {
    	it('is a function', function(done) {
            CUSTOM.removeOpenWrapKeyValuePairsFromSlotsForGPT.should.be.a('function');
            done();
        });
    });

    describe("#init", function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "isObject");
            sinon.spy(CUSTOM, "setWindowReference");
            sinon.spy(CUSTOM, "defineWrapperTargetingKeys");
            sinon.spy(AM, "registerAdapters");
            sinon.spy(CUSTOM, "callJsLoadedIfRequired");
            sinon.spy(CUSTOM, "initSafeFrameListener");
            done();
        });

        afterEach(function(done) {
            UTIL.isObject.restore();
            CUSTOM.setWindowReference.restore();
            CUSTOM.defineWrapperTargetingKeys.restore();
            AM.registerAdapters.restore();
            CUSTOM.callJsLoadedIfRequired.restore();
            CUSTOM.initSafeFrameListener.restore();
            done();
        });

        it('is a function', function(done) {
            CUSTOM.init.should.be.a('function');
            done();
        });

        it("should return false when window object is null", function(done) {
            CUSTOM.init(null).should.equal(false);
            done();
        });

        it("should have called respective internal functions ", function(done) {
            window.PWT = {};
            CUSTOM.init(window).should.equal(true);
            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(true).should.to.be.true;
            CUSTOM.setWindowReference.called.should.be.true;
            CUSTOM.defineWrapperTargetingKeys.called.should.be.true;
            AM.registerAdapters.called.should.be.true;
            CUSTOM.callJsLoadedIfRequired.called.should.be.true;
            done();
        });

        it('should not proceed if passed window object is invalid', function (done) {
            CUSTOM.init("NonObject").should.be.false;
            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(false).should.be.true;
            UTIL.isObject.calledWith("NonObject").should.be.true;
            CUSTOM.setWindowReference.called.should.be.false;
            CUSTOM.defineWrapperTargetingKeys.called.should.be.false;
            AM.registerAdapters.called.should.be.false;
            CUSTOM.callJsLoadedIfRequired.called.should.be.false;
            done();
        });
    });
});
