/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var GPT = require("../../src_new/controllers/gpt.js");
var UTIL = require("../../src_new/util.js");
var AM = require("../../src_new/adapterManager.js");
var CONSTANTS = require("../../src_new/constants.js");
var CONFIG = require("../../src_new/config.js");
var BM = require("../../src_new/bidManager.js");
var SLOT = require("../../src_new/slot.js");

describe("CONTROLLER: GPT", function() {

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
            GPT.setWindowReference(nonObject);
            expect(GPT.getWindowReference() === null).to.equal(true);
            UTIL.isObject.returned(false).should.be.true;
            UTIL.isObject.calledOnce.should.be.true;
            done();
        });

        it("should set WindowReference if argument is object", function(done) {
            GPT.setWindowReference(window);
            GPT.getWindowReference().should.be.deep.equal(window);
            UTIL.isObject.calledOnce.should.be.true;
            UTIL.isObject.returned(true).should.be.true;
            done();
        });
    });

    describe('#getWindowReference', function () {
        it('is a function', function (done) {
            GPT.getWindowReference.should.be.a('function');
            done();
        });

        it('should return the window object reference', function (done) {
            GPT.setWindowReference(window);
            GPT.getWindowReference().should.deep.equal(window);
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
            GPT.getAdUnitIndex(null).should.equal(0);
            done();
        });

        it("should return 0 when the object passed is number ", function(done) {
            GPT.getAdUnitIndex(0).should.equal(0);
            done();
        });

        it("should return 0 when the object passed is empty string ", function(done) {
            GPT.getAdUnitIndex("").should.equal(0);
            done();
        });

        it("should return 0 when the object passed is not empty string ", function(done) {
            GPT.getAdUnitIndex("abcd").should.equal(0);
            done();
        });

        it("should return 0 when the object passed does not have required method ", function(done) {
            GPT.getAdUnitIndex({}).should.equal(0);
            done();
        });


        it("should return random when the object passed does have required method ", function(done) {
            GPT.getAdUnitIndex(currentGoogleSlotStub).should.equal(random);
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
            GPT.defineWrapperTargetingKey.should.be.a("function");
            done();
        });

        it("set wrapper Targeting Key's value to empty string", function(done) {
            GPT.defineWrapperTargetingKey("DIV_1");
            GPT.wrapperTargetingKeys["DIV_1"].should.equal("");
            done();
        });


        it("initialize wrapperTargetingKeys if its not been initialized", function(done) {
            GPT.wrapperTargetingKeys = null;
            GPT.defineWrapperTargetingKey("DIV_2");
            GPT.wrapperTargetingKeys["DIV_2"].should.equal("");
            Object.keys(GPT.wrapperTargetingKeys).length.should.be.equal(1);
            UTIL.isObject.returned(false).should.be.true;
            done();
        });
    });

    describe("#defineWrapperTargetingKeys()", function() {

        it("should return empty object when empty object is passed", function(done) {
            GPT.defineWrapperTargetingKeys({}).should.deep.equal({});
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
                GPT.defineWrapperTargetingKeys({}).should.deep.equal({});
                done();
            });

            it("should return object with values as keys and respective value should be empty strings", function(done) {
                GPT.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
                done();
            });

            it("should have called util.forEachOnObject", function(done) {
                GPT.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
                UTIL.forEachOnObject.calledOnce.should.equal(true);
                done();
            });
        });
    });

    describe("#callJsLoadedIfRequired", function() {

        it("should return false when the object passed is string ", function() {
            GPT.callJsLoadedIfRequired("").should.equal(false);
        });

        it("should return false when the object passed is number ", function() {
            GPT.callJsLoadedIfRequired(1).should.equal(false);
        });

        it("should return false when the object passed is null ", function() {
            GPT.callJsLoadedIfRequired(null).should.equal(false);
        });

        it("should return false when the object is not passed ", function() {
            GPT.callJsLoadedIfRequired().should.equal(false);
        });

        it("should return false when the object passed is object but it does not have PWT property ", function() {
            GPT.callJsLoadedIfRequired({}).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to null", function() {
            GPT.callJsLoadedIfRequired({ PWT: null }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to string", function() {
            GPT.callJsLoadedIfRequired({ PWT: "" }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to number", function() {
            GPT.callJsLoadedIfRequired({ PWT: 1 }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but does not have jsLoaded property", function() {
            GPT.callJsLoadedIfRequired({ PWT: {} }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to null", function() {
            GPT.callJsLoadedIfRequired({ PWT: { jsLoaded: null } }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to number", function() {
            GPT.callJsLoadedIfRequired({ PWT: { jsLoaded: 1 } }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to string", function() {
            GPT.callJsLoadedIfRequired({ PWT: { jsLoaded: "" } }).should.equal(false);
        });

        var _test = {
            PWT: {}
        };
        _test.PWT.jsLoaded = function() {
            flag = true;
        };
        var flag = false;
        it("should return true when the object passed is object and PWT property is set and jsLoaded is set to function and the function is called", function() {
            GPT.callJsLoadedIfRequired(_test).should.equal(true);
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
            GPT.initSafeFrameListener.should.be.a('function');
            done();
        });


        it('should do nothing if message listener for safe frame is already added', function (done) {
            GPT.initSafeFrameListener(theWindow);
            UTIL.addMessageEventListenerForSafeFrame.called.should.be.false;
            theWindow.PWT.safeFrameMessageListenerAdded.should.be.true;
            done();
        });


        it('should add message listener for safe frame if not added', function (done) {
            theWindow.PWT.safeFrameMessageListenerAdded = false;
            GPT.initSafeFrameListener(theWindow);
            UTIL.addMessageEventListenerForSafeFrame.calledOnce.should.be.true;
            theWindow.PWT.safeFrameMessageListenerAdded.should.be.true;
            done();
        });
    });

    describe('#getAdSlotSizesArray()', function() {
        var divID = null;
        var currentGoogleSlots = null;
        var sizeObj_1 = null;
        var sizeObj_2 = null;
        var slotSizeMapping = null;

        beforeEach(function(done) {
            divID = commonDivID;
            sizeObj_1 = {
                getWidth: function() {
                    return 1024;
                },
                getHeight: function() {
                    return 768;
                },
                "id": "sizeObj_1"
            };

            sizeObj_2 = {
                getWidth: function() {
                    return 640;
                },
                getHeight: function() {
                    return 480;
                },
                "id": "sizeObj_2"
            };
            currentGoogleSlots = {
                getSizes: function() {
                    return [sizeObj_1, sizeObj_2];
                }
            };

            sinon.spy(currentGoogleSlots, 'getSizes');
            sinon.spy(sizeObj_1, 'getHeight');
            sinon.spy(sizeObj_1, 'getWidth');
            sinon.spy(sizeObj_2, 'getHeight');
            sinon.spy(sizeObj_2, 'getWidth');

            sinon.stub(GPT, 'getSizeFromSizeMapping');
            slotSizeMapping = [
                [
                    [ 1024, 768 ],
                    [
                        970, 250
                    ]
                ],

                [
                    [ 980, 600 ],
                    [
                        [ 728, 90 ],
                        [ 640, 480 ]
                    ]
                ]
            ];
            GPT.getSizeFromSizeMapping.returns(slotSizeMapping);
            sinon.spy(UTIL, 'log');
            sinon.stub(UTIL, 'isFunction');
            UTIL.isFunction.withArgs(sizeObj_1.getWidth).onSecondCall().returns(false);
            UTIL.isFunction.returns(true);
            sinon.spy(UTIL, 'forEachOnArray');
            done();
        });

        afterEach(function(done) {
            GPT.getSizeFromSizeMapping.restore();
            UTIL.log.restore();
            UTIL.isFunction.restore();
            UTIL.forEachOnArray.restore();

            currentGoogleSlots.getSizes.restore();
            if (sizeObj_1.getHeight) {
                sizeObj_1.getHeight.restore();
            }

            if (sizeObj_1.getWidth) {
                sizeObj_1.getWidth.restore();
            }

            if (sizeObj_2.getHeight) {
                sizeObj_2.getHeight.restore();
            }

            if (sizeObj_2.getWidth) {
                sizeObj_2.getWidth.restore();
            }


            sizeObj_1 = null;
            sizeObj_2 = null;
            currentGoogleSlots = null;
            slotSizeMapping = null;
            done();
        });


        it('is a function', function(done) {
            GPT.getAdSlotSizesArray.should.be.a('function');
            done();
        });

        it('should have called getSizeFromSizeMapping', function(done) {
            GPT.getAdSlotSizesArray(divID, currentGoogleSlots).should.be.deep.equal(slotSizeMapping);
            UTIL.log.calledWith(divID + ": responsiveSizeMapping applied: ").should.be.true;
            UTIL.log.calledWith(slotSizeMapping).should.be.true;
            done();
        });

        it('should have created adSlotSizesArray when proper currentGoogleSlots is passed ', function(done) {
            GPT.getSizeFromSizeMapping.restore();
            sinon.stub(GPT, 'getSizeFromSizeMapping');
            GPT.getSizeFromSizeMapping.returns(false);

            GPT.getAdSlotSizesArray(divID, currentGoogleSlots).should.be.deep.equal([[1024, 768], [640, 480]]);

            UTIL.isFunction.called.should.be.true;
            UTIL.forEachOnArray.called.should.be.true;

            currentGoogleSlots.getSizes.called.should.be.true;
            sizeObj_1.getHeight.called.should.be.true;
            sizeObj_1.getWidth.called.should.be.true;
            sizeObj_2.getHeight.called.should.be.true;
            sizeObj_2.getWidth.called.should.be.true;

            done();
        });

        // Todo : check error case
        xit('should have logged when size object doesnt have either of the getWidth or getHeight methods', function (done) {
            currentGoogleSlots.getSizes()[0].getWidth.restore();
            delete currentGoogleSlots.getSizes()[0].getWidth;

            GPT.getAdSlotSizesArray(divID, currentGoogleSlots).should.be.an('array');
            UTIL.log.calledWith(divID + ", size object does not have getWidth and getHeight method. Ignoring: ").should.be.true;
            UTIL.log.calledWith(sizeObj_1).should.be.true;
            done();
        });

        // Todo : check error case
        xit('should have logged when size object doesnt have either of the getWidth or getHeight methods', function (done) {
            delete sizeObj_2.getHeight;
            currentGoogleSlots.getSizes()[1].getHeight = null;
            GPT.getAdSlotSizesArray(divID, currentGoogleSlots).should.be.an('array');
            UTIL.log.calledWith(divID + ", size object does not have getWidth and getHeight method. Ignoring: ").should.be.true;
            UTIL.log.calledWith(sizeObj_2).should.be.true;
            done();
        });
    });
});
