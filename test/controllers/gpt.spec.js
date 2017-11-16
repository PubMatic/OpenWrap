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

var commonDivID = "DIV_1";

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

    describe('#getSizeFromSizeMapping', function() {
        var divID = null;
        var slotSizeMapping = null;
        var screenWidth = 1024;
        var screenHeight = 768;

        beforeEach(function(done) {
            divID = commonDivID;
            slotSizeMapping = {};
            slotSizeMapping[divID] = [];

            sinon.spy(UTIL, 'isOwnProperty');

            sinon.stub(UTIL, 'getScreenWidth');
            UTIL.getScreenWidth.returns(screenWidth);

            sinon.stub(UTIL, 'getScreenHeight');
            UTIL.getScreenHeight.returns(screenHeight);

            sinon.spy(UTIL, 'isArray');
            sinon.spy(UTIL, 'isNumber');
            sinon.spy(UTIL, 'log');
            done();
        });

        afterEach(function(done) {
            divID = null;
            slotSizeMapping = null;

            UTIL.getScreenWidth.restore();
            UTIL.getScreenHeight.restore();

            UTIL.isOwnProperty.restore();
            UTIL.isArray.restore();
            UTIL.isNumber.restore();
            UTIL.log.restore();
            done();
        });

        it('is a function', function(done) {
            GPT.getSizeFromSizeMapping.should.be.a('function');
            done();
        });

        it('should return false when given divID not a property of slotSizeMapping passed', function(done) {
            delete slotSizeMapping[divID];
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.false;
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('should have logged sizeMapping and its details', function(done) {
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping);

            UTIL.log.calledWith(divID + ": responsiveSizeMapping found: screenWidth: " + screenWidth + ", screenHeight: " + screenHeight).should.be.true;
            UTIL.log.calledWith(slotSizeMapping[divID]).should.be.true;
            done();
        });

        it('should return false if sizeMapping is not and array', function(done) {
            slotSizeMapping[divID] = {};
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.false;
            UTIL.isArray.calledOnce.should.be.true;
            done();
        });

        it('should have logged in case of unsupported mapping template', function (done) {
            slotSizeMapping[divID] =
            [
                [
                    [ 1024, 768 ],
                    [
                        "X970X", 250
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
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.an('array');
            UTIL.isNumber.called.should.be.true;
            UTIL.log.calledWith(divID + ": Unsupported mapping template.").should.be.true;
            UTIL.log.calledWith(slotSizeMapping[divID]).should.be.true;
            done();
        });

        it('should have logged in case of unsupported mapping template', function (done) {
            slotSizeMapping[divID] =
            [
                [
                    [ 1024, 768 ],
                    [
                        250, "X970X"
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
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.an('array');
            UTIL.isNumber.calledTwice.should.be.true;
            UTIL.log.calledWith(divID + ": Unsupported mapping template.").should.be.true;
            UTIL.log.calledWith(slotSizeMapping[divID]).should.be.true;
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

    describe('#setDisplayFunctionCalledIfRequired', function() {

        var slot = null,
            arg = null;
        beforeEach(function(done) {
            slot = SLOT.createSlot("slot_1");
            slot.setDivID("DIV_1");
            arg = ["DIV_1", "DIV_2"];

            sinon.spy(slot, "getDivID");
            sinon.spy(slot, "setDisplayFunctionCalled");
            sinon.spy(slot, "setArguments");

            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "isArray");
            done();
        });

        afterEach(function(done) {
            UTIL.isObject.restore();
            UTIL.isFunction.restore();
            UTIL.isArray.restore();

            if (typeof slot.getDivID === "function") {
                slot.getDivID.restore();
            }
            slot.setDisplayFunctionCalled.restore();
            slot.setArguments.restore();

            slot = null;

            done();
        });

        it('is a function', function(done) {
            GPT.setDisplayFunctionCalledIfRequired.should.be.a('function');
            done();
        });

        it('should have called setDisplayFunctionCalled and setArguments if given arguments are proper ', function(done) {
            GPT.setDisplayFunctionCalledIfRequired(slot, arg);
            UTIL.isObject.calledWith(slot).should.be.true;
            UTIL.isFunction.calledWith(slot.getDivID).should.be.true;
            UTIL.isArray.calledWith(arg).should.be.true;
            slot.getDivID.called.should.be.true;
            slot.setDisplayFunctionCalled.calledWith(true).should.be.true;
            slot.setArguments.calledWith(arg).should.be.true;
            done();
        });


        it('should not proceed if given slot is not an object', function (done) {
            GPT.setDisplayFunctionCalledIfRequired(null, arg);
            UTIL.isObject.calledWith(slot).should.be.false;
            UTIL.isFunction.calledWith(slot.getDivID).should.be.false;
            UTIL.isArray.calledWith(arg).should.be.false;
            slot.getDivID.called.should.be.false;
            slot.setDisplayFunctionCalled.calledWith(true).should.be.false;
            slot.setArguments.calledWith(arg).should.be.false;
            done();
        });

        it('should not proceed if given slot doesnt have required method', function (done) {
            slot.getDivID = null;
            GPT.setDisplayFunctionCalledIfRequired(slot, arg);
            UTIL.isObject.calledWith(slot).should.be.true;
            UTIL.isFunction.calledWith(slot.getDivID).should.be.true;
            UTIL.isArray.calledWith(arg).should.be.false;
            slot.setDisplayFunctionCalled.calledWith(true).should.be.false;
            slot.setArguments.calledWith(arg).should.be.false;
            done();
        });

    });

    describe('#storeInSlotsMap', function() {
        var dmSlotName = null, currentGoogleSlotStub = null, isDisplayFlow = null;
        var slotStub = null, sizeObj_1 = null, sizeObj_2 = null;

        beforeEach(function (done) {
            dmSlotName = "DIV_1"; // note: here dmSlotName is actually the DivID // please refer source code

            sinon.spy(UTIL, "isOwnProperty");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "createVLogInfoPanel");
            sinon.spy(UTIL, "forEachOnArray");


            slotStub = SLOT.createSlot(dmSlotName);

            sinon.spy(slotStub, "setDivID");
            sinon.spy(slotStub, "setPubAdServerObject");
            sinon.spy(slotStub, "setAdUnitID");
            sinon.spy(slotStub, "setAdUnitIndex");
            // sinon.spy(slotStub, "setSizes");
            sinon.spy(slotStub, "setStatus");
            sinon.spy(slotStub, "setKeyValue");
            sinon.spy(slotStub, "getSizes");



            sinon.stub(SLOT, "createSlot").returns(slotStub);

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

            currentGoogleSlotStub = {
                getTargetingKeys: function () {
                    return [ "k1", "k2"];
                },
                getTargeting: function (key) {
                    return "v1";
                },
                getSizes: function() {
                    return [sizeObj_1, sizeObj_2];
                },
                getAdUnitPath: function () {
                    return "ad_unit_path";
                }
            };

            sinon.stub(currentGoogleSlotStub, "getTargeting")
                .withArgs("k1").returns("v1")
                .withArgs("k2").returns("v2");

            GPT.slotsMap[dmSlotName] = slotStub;
            sinon.spy(GPT.slotsMap[dmSlotName], "setSizes");
            isDisplayFlow = true;

            done();
        });

        afterEach(function (done) {
            UTIL.isOwnProperty.restore();
            UTIL.createVLogInfoPanel.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();
            UTIL.forEachOnArray.restore();

            SLOT.createSlot.restore();

            slotStub.setDivID.restore();
            slotStub.setPubAdServerObject.restore();
            slotStub.setAdUnitID.restore();
            slotStub.setAdUnitIndex.restore();
            // slotStub.setSizes.restore();
            slotStub.setStatus.restore();
            slotStub.setKeyValue.restore();
            slotStub.getSizes.restore();

            slotStub = null;

            currentGoogleSlotStub.getTargeting.restore();

            currentGoogleSlotStub = null;

            if (GPT.slotsMap[dmSlotName].setSizes) {
                GPT.slotsMap[dmSlotName].setSizes.restore();
            }

            if (GPT.slotsMap[dmSlotName]) {

                delete GPT.slotsMap[dmSlotName];
            }

            isDisplayFlow = null;

            done();
        });


        it('is a function', function(done) {
            GPT.storeInSlotsMap.should.be.a('function');
            done();
        });

        it('should called proper methods to create and add slot for given dmSlotName in slotsMap, if not present already ', function (done) {
            delete GPT.slotsMap[dmSlotName];
            GPT.storeInSlotsMap(dmSlotName, currentGoogleSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(false).should.be.true;
            slotStub.setDivID.calledWith(dmSlotName).should.be.true;
            slotStub.setPubAdServerObject.calledWith(currentGoogleSlotStub).should.be.true;
            slotStub.setAdUnitID.called.should.be.true;
            slotStub.setAdUnitIndex.called.should.be.true;
            done();
        });

        it('should create and add slot for given dmSlotName in slotsMap, if not present already ', function (done) {
            delete GPT.slotsMap[dmSlotName];
            GPT.storeInSlotsMap(dmSlotName, currentGoogleSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(false).should.be.true;
            slotStub.setDivID.calledWith(dmSlotName).should.be.true;
            slotStub.setPubAdServerObject.calledWith(currentGoogleSlotStub).should.be.true;
            slotStub.setAdUnitID.called.should.be.true;
            slotStub.setAdUnitIndex.called.should.be.true;
            GPT.slotsMap[dmSlotName].should.deep.equal(slotStub);
            done();
        });

        it('should have set key value pairs on slot from given currentGoogleSlot targeting keys ', function (done) {
            delete GPT.slotsMap[dmSlotName];
            GPT.storeInSlotsMap(dmSlotName, currentGoogleSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(false).should.be.true;
            slotStub.setDivID.calledWith(dmSlotName).should.be.true;
            slotStub.setPubAdServerObject.calledWith(currentGoogleSlotStub).should.be.true;
            slotStub.setAdUnitID.called.should.be.true;
            slotStub.setAdUnitIndex.called.should.be.true;

            UTIL.forEachOnArray.calledWith(currentGoogleSlotStub.getTargetingKeys()).should.be.true;
            Object.keys(slotStub.getkeyValues()).should.deep.equal(currentGoogleSlotStub.getTargetingKeys());
            done();
        });

        it('should not set sizes on slot of given name if isDisplayFlow is true', function (done) {
            GPT.storeInSlotsMap(dmSlotName, currentGoogleSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(true).should.be.true;
            GPT.slotsMap[dmSlotName].setSizes.called.should.be.false;
            done();
        });

        it('should set sizes on slot of given name if isDisplayFlow is false', function (done) {
            isDisplayFlow = false;
            GPT.storeInSlotsMap(dmSlotName, currentGoogleSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(true).should.be.true;
            GPT.slotsMap[dmSlotName].setSizes.called.should.be.true;
            done();
        });
    });

    describe("#generateSlotName()", function() {
        var domId = null;
        var slotIDObject = null;
        var googleSlotObject = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, "isFunction");
            domId = "DIV_1";
            slotIDObject = {
                getDomId: function() {
                    return domId;
                }
            };

            googleSlotObject = {
                getSlotId: function() {
                    return slotIDObject;
                }
            };

            done();
        });

        afterEach(function(done) {
            UTIL.isFunction.restore();
            domId = null;
            slotIDObject = null;
            googleSlotObject = null;
            done();
        });

        it("GPT.generateSlotName is a function", function(done) {
            GPT.generateSlotName.should.be.a("function");
            done();
        });

        it("return empty string if googleSlot is not an object", function(done) {
            GPT.generateSlotName(null).should.equal("");
            done();
        });

        it("return empty string if googleSlot is an object but without required methods", function(done) {
            GPT.generateSlotName({}).should.equal("");
            done();
        });

        it("should have called util.isFunction if propper googleSlot is passed", function(done) {
            GPT.generateSlotName(googleSlotObject);
            UTIL.isFunction.calledTwice.should.equal(true);
            done();
        });

        it("should have returned Dom Id as generated Slot name if propper googleSlot object is passed", function(done) {
            GPT.generateSlotName(googleSlotObject).should.equal(domId);
            done();
        });
    });

    describe('#updateSlotsMapFromGoogleSlots', function() {
        var googleSlotsArray = null, argumentsFromCallingFunction = null, isDisplayFlow = null;
        var currentGoogleSlotStub_1 = null;
        var currentGoogleSlotStub_2 = null;

        beforeEach(function (done) {
            currentGoogleSlotStub_1 = {
                keyValuePairs: {
                    "k1": "v1",
                    "k2": "v2",
                    "pk1": "pv1",
                    "pk2": "pv2",
                },
                getTargetingKeys: function() {
                    return Object.keys(this.keyValuePairs);
                },
                getTargeting: function(key) {
                    return this.keyValuePairs[key];
                },
                clearTargeting: function() {
                    this.keyValuePairs = {};
                },
                setTargeting: function(key, value) {
                    return this.keyValuePairs[key] = value;
                },
                getSlotId: function () {
                    return "slot_1";
                },
                getAdUnitPath: function () {
                    return "getAdUnitPath";
                },
                setSizes: function () {
                    return "setSizes"
                }
            };

            currentGoogleSlotStub_2 = {
                keyValuePairs: {
                    "k11": "v11",
                    "k22": "v22",
                    "pk11": "pv11",
                    "pk22": "pv22",
                },
                getTargetingKeys: function() {
                    return Object.keys(this.keyValuePairs);
                },
                getTargeting: function(key) {
                    return this.keyValuePairs[key];
                },
                clearTargeting: function() {
                    this.keyValuePairs = {};
                },
                setTargeting: function(key, value) {
                    return this.keyValuePairs[key] = value;
                },
                getSlotId: function () {
                    return {
                        getDomId: function () {
                            return "DIV_2";
                        }
                    };
                },
                getAdUnitPath: function () {
                    return "getAdUnitPath";
                },
                setSizes: function () {
                    return "setSizes"
                }
            };

            GPT.slotsMap["DIV_2"] = currentGoogleSlotStub_1;

            argumentsFromCallingFunction = ["DIV_1", "DIV_2"];

            googleSlotsArray = [currentGoogleSlotStub_1, currentGoogleSlotStub_2];
            isDisplayFlow = true;

            sinon.spy(currentGoogleSlotStub_1, "getTargetingKeys");
            sinon.spy(currentGoogleSlotStub_1, "getTargeting");
            sinon.spy(currentGoogleSlotStub_1, "clearTargeting");
            sinon.spy(currentGoogleSlotStub_1, "setTargeting");
            sinon.spy(currentGoogleSlotStub_1, "getSlotId");


            sinon.spy(currentGoogleSlotStub_2, "getTargetingKeys");
            sinon.spy(currentGoogleSlotStub_2, "getTargeting");
            sinon.spy(currentGoogleSlotStub_2, "clearTargeting");
            sinon.spy(currentGoogleSlotStub_2, "setTargeting");
            sinon.spy(currentGoogleSlotStub_2, "getSlotId");

            sinon.spy(UTIL, "isOwnProperty");
            sinon.spy(UTIL, "forEachOnArray");
            sinon.spy(UTIL, "log");

            sinon.spy(GPT, "generateSlotName");
            sinon.spy(GPT, "storeInSlotsMap");

            sinon.spy(GPT, "setDisplayFunctionCalledIfRequired");

            done();
        });

        afterEach(function (done) {

            currentGoogleSlotStub_1.getTargetingKeys.restore();
            currentGoogleSlotStub_1.getTargeting.restore();
            currentGoogleSlotStub_1.clearTargeting.restore();
            currentGoogleSlotStub_1.setTargeting.restore();
            currentGoogleSlotStub_1.getSlotId.restore();

            currentGoogleSlotStub_2.getTargetingKeys.restore();
            currentGoogleSlotStub_2.getTargeting.restore();
            currentGoogleSlotStub_2.clearTargeting.restore();
            currentGoogleSlotStub_2.setTargeting.restore();
            currentGoogleSlotStub_2.getSlotId.restore();

            UTIL.isOwnProperty.restore();
            UTIL.forEachOnArray.restore();
            UTIL.log.restore();

            GPT.generateSlotName.restore();
            GPT.storeInSlotsMap.restore();
            GPT.setDisplayFunctionCalledIfRequired.restore();

            isDisplayFlow = null;
            googleSlotsArray = null;
            argumentsFromCallingFunction = null;

            done();
        });

        it('is a function', function(done) {
            GPT.updateSlotsMapFromGoogleSlots.should.be.a('function');
            done();
        });

        it('should have logged about generating slotsMap as well as the slotsMap generated', function (done) {
            GPT.updateSlotsMapFromGoogleSlots(googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow);
            UTIL.log.calledWith("Generating slotsMap").should.be.true;
            UTIL.log.calledWith(GPT.slotsMap).should.be.true;
            done();
        });

        it('should have iterated over the googleSlotsArray ', function (done) {
            GPT.updateSlotsMapFromGoogleSlots(googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow);
            GPT.generateSlotName.calledTwice.should.be.true;
            GPT.storeInSlotsMap.calledTwice.should.be.true;
            GPT.storeInSlotsMap.calledWith("").should.be.true;
            GPT.storeInSlotsMap.calledWith("DIV_2", currentGoogleSlotStub_2, isDisplayFlow).should.be.true;
            done();
        });


        it('should set display function called bsaed on isDisplayFlow and whether current slot is present in slotsMap', function (done) {
            GPT.updateSlotsMapFromGoogleSlots(googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow);
            GPT.setDisplayFunctionCalledIfRequired.calledWith(GPT.slotsMap["DIV_2"], argumentsFromCallingFunction).should.be.true;
            expect(googleSlotsArray.length).to.be.equal(2);
            GPT.setDisplayFunctionCalledIfRequired.called.should.be.true;
            done();
        });

        it('should not set display function called if  isDisplayFlow  if false even current slot is present in slotsMap', function (done) {
            isDisplayFlow = false;
            GPT.updateSlotsMapFromGoogleSlots(googleSlotsArray, argumentsFromCallingFunction, isDisplayFlow);
            GPT.setDisplayFunctionCalledIfRequired.calledWith(GPT.slotsMap["DIV_2"], argumentsFromCallingFunction).should.be.false;
            expect(googleSlotsArray.length).to.be.equal(2);
            GPT.setDisplayFunctionCalledIfRequired.calledOnce.should.be.false;
            done();
        });

    });

    describe('#getStatusOfSlotForDivId', function() {
        var divID = null;

        beforeEach(function(done) {
            divID = commonDivID;
            GPT.slotsMap[divID] = {
                getStatus: function() {
                    return CONSTANTS.SLOT_STATUS.TARGETING_ADDED;
                }
            };
            sinon.spy(GPT.slotsMap[divID], "getStatus");
            sinon.spy(UTIL, "isOwnProperty");
            done();
        });

        afterEach(function(done) {
            GPT.slotsMap[divID] = null;
            UTIL.isOwnProperty.restore();
            divID = null;
            done();
        });

        it('is a function', function(done) {
            GPT.getStatusOfSlotForDivId.should.be.a('function');
            done();
        });

        it('should return slot status by calling getStatus of the given slot if its present in slotMap', function(done) {
            GPT.getStatusOfSlotForDivId(divID).should.deep.equal(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
            UTIL.isOwnProperty.called.should.be.true;
            GPT.slotsMap[divID].getStatus.called.should.be.true;
            done();
        });

        it('should return slot status as DISPLAYED if given divID is not present in slotMap', function(done) {
            delete GPT.slotsMap[divID];
            GPT.getStatusOfSlotForDivId(divID).should.be.equal(CONSTANTS.SLOT_STATUS.DISPLAYED);
            done();
        });
    });

    describe('#updateStatusAfterRendering', function() {
        var divID = null, isRefreshCall = null;
        var slot_1_Stub = null;
        var slotName = null;

        beforeEach(function (done) {
            isRefreshCall = true;
            slotName = "slot_1";
            divID = commonDivID;
            slot_1_Stub = SLOT.createSlot(slotName);
            GPT.slotsMap[divID] = slot_1_Stub;

            sinon.spy(GPT.slotsMap[divID], "updateStatusAfterRendering");

            sinon.spy(UTIL, "isOwnProperty");
            done();
        });

        afterEach(function (done) {
            isRefreshCall = false;
            GPT.slotsMap[divID].updateStatusAfterRendering.restore();
            GPT.slotsMap[divID] = null;
            slot_1_Stub = null;
            divID = null;

            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            GPT.updateStatusAfterRendering.should.be.a('function');
            done();
        });

        it('should not proceed if given divID is not in slotsMap', function (done) {
            GPT.updateStatusAfterRendering("non_existing_div_id", true);
            GPT.slotsMap[divID].updateStatusAfterRendering.called.should.be.false;
            done();
        });

        it('should have called updateStatusAfterRendering on slot of given id when present in slotsMap', function (done) {
            GPT.updateStatusAfterRendering(divID, isRefreshCall);
            GPT.slotsMap[divID].updateStatusAfterRendering.calledWith(isRefreshCall).should.be.true;
            done();
        });
    });

    describe('#getSlotNamesByStatus', function() {
        var statusObject = null;
        var slot_1_Stub = null;
        var slot_2_Stub = null;

        beforeEach(function(done) {
            statusObject = CONSTANTS.SLOT_STATUS;

            slot_1_Stub = {
                getStatus: function () {
                    return "CREATED";
                }
            };

            slot_2_Stub =  {
                getStatus: function () {
                    return "NON_EXISITNG_STATUS";
                }
            };

            GPT.slotsMap["DIV_1"] = slot_1_Stub;
            GPT.slotsMap["DIV_2"] = slot_2_Stub;

            sinon.spy(GPT.slotsMap["DIV_1"], "getStatus");
            sinon.spy(GPT.slotsMap["DIV_2"], "getStatus");
            sinon.spy(UTIL, 'forEachOnObject');
            sinon.spy(UTIL, 'isOwnProperty');
            done();
        });

        afterEach(function(done) {
            GPT.slotsMap["DIV_1"] = null;
            GPT.slotsMap["DIV_2"] = null;
            UTIL.forEachOnObject.restore();
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            GPT.getSlotNamesByStatus.should.be.a('function');
            done();
        });

        it('should return array of slots', function(done) {
            GPT.getSlotNamesByStatus(statusObject).should.be.a('array');
            done();
        });

        it('should have called UTIL functions and slot\'s getStatus', function(done) {
            GPT.getSlotNamesByStatus(statusObject);

            UTIL.isOwnProperty.called.should.be.true;
            UTIL.forEachOnObject.called.should.be.true;

            GPT.slotsMap["DIV_1"].getStatus.called.should.be.true;
            GPT.slotsMap["DIV_2"].getStatus.called.should.be.true;
            done();
        });

        it('should return array of keys from slotMap which match the status of given status object', function (done) {
            GPT.getSlotNamesByStatus(statusObject).should.be.an('array');
            GPT.getSlotNamesByStatus(statusObject).should.be.deep.equal(["DIV_1"]);
            done();
        });

        it('should return empty array if slotsMap is empty', function (done) {
            GPT.slotsMap = {};
            GPT.getSlotNamesByStatus(statusObject).should.be.an('array');
            GPT.getSlotNamesByStatus(statusObject).should.be.deep.equal([]);
            done();
        });
    });

    describe('#removeDMTargetingFromSlot', function() {
        var key = null;
        var currentGoogleSlotStub = null;

        beforeEach(function(done) {
            key = commonDivID;
            GPT.slotsMap = {};
            currentGoogleSlotStub = {
                keyValuePairs: {
                    "k1": "v1",
                    "k2": "v2",
                    "pk1": "pv1",
                    "pk2": "pv2",
                },
                getTargetingKeys: function() {
                    return Object.keys(this.keyValuePairs);
                },
                getTargeting: function(key) {
                    return this.keyValuePairs[key];
                },
                clearTargeting: function() {
                    this.keyValuePairs = {};
                },
                setTargeting: function(key, value) {
                    return this.keyValuePairs[key] = value;
                },
            };

            GPT.wrapperTargetingKeys = {
                "pk1": "pv1",
                "pk2": "pv2",
                "pk3": "pv3"
            };

            GPT.slotsMap[key] = {
                getPubAdServerObject: function() {
                    return currentGoogleSlotStub;
                }
            };

            sinon.spy(currentGoogleSlotStub, "getTargetingKeys");
            sinon.spy(currentGoogleSlotStub, "getTargeting");
            sinon.spy(currentGoogleSlotStub, "clearTargeting");
            sinon.spy(currentGoogleSlotStub, "setTargeting");

            sinon.spy(UTIL, "isOwnProperty");
            sinon.spy(UTIL, "forEachOnArray");
            sinon.spy(UTIL, "forEachOnObject");
            done();
        });


        afterEach(function(done) {
            currentGoogleSlotStub.getTargetingKeys.restore();
            currentGoogleSlotStub.getTargeting.restore();
            currentGoogleSlotStub.clearTargeting.restore();
            currentGoogleSlotStub.setTargeting.restore();

            UTIL.isOwnProperty.restore();
            UTIL.forEachOnArray.restore();
            UTIL.forEachOnObject.restore();

            done();
        });

        it('is a function', function(done) {
            GPT.removeDMTargetingFromSlot.should.be.a('function');
            done();
        });

        it('should proceed only if given key is present in slotsMap', function (done) {
            GPT.removeDMTargetingFromSlot("non_existing_key");

            UTIL.isOwnProperty.calledOnce.should.be.true;

            UTIL.forEachOnObject.called.should.be.false;
            UTIL.forEachOnArray.called.should.be.false;

            currentGoogleSlotStub.getTargetingKeys.called.should.be.false;
            currentGoogleSlotStub.getTargeting.called.should.be.false;
            currentGoogleSlotStub.clearTargeting.called.should.be.false;
            currentGoogleSlotStub.setTargeting.called.should.be.false;
            done();
        });

        it('should have called proper functions', function(done) {
            GPT.removeDMTargetingFromSlot(key);

            UTIL.isOwnProperty.called.should.be.true;
            UTIL.forEachOnObject.called.should.be.true;
            UTIL.forEachOnArray.called.should.be.true;

            currentGoogleSlotStub.getTargetingKeys.called.should.be.true;
            currentGoogleSlotStub.getTargeting.called.should.be.true;
            currentGoogleSlotStub.clearTargeting.called.should.be.true;
            currentGoogleSlotStub.setTargeting.called.should.be.true;
            done();
        });

        it('should have removed wrapper targeting keys', function (done) {
            GPT.removeDMTargetingFromSlot(key);

            currentGoogleSlotStub.keyValuePairs.should.not.have.all.keys(Object.keys(GPT.wrapperTargetingKeys));

            currentGoogleSlotStub.setTargeting.calledWith("k1", "v1").should.be.true;
            currentGoogleSlotStub.setTargeting.calledWith("k2", "v2").should.be.true;
            currentGoogleSlotStub.setTargeting.calledWith("pk1", "pv1").should.be.false;
            currentGoogleSlotStub.setTargeting.calledWith("pk2", "pv2").should.be.false;
            currentGoogleSlotStub.setTargeting.calledWith("pk3", "pv3").should.be.false;
            done();
        });
    });

    describe('#updateStatusOfQualifyingSlotsBeforeCallingAdapters', function() {
        var slotNames = null,
            argumentsFromCallingFunction = null,
            isRefreshCall = null;
        var slotObject = null;

        beforeEach(function(done) {
            slotNames = ["slot_1", "slot_2", "slot_3"];
            argumentsFromCallingFunction = {};
            isRefreshCall = true;
            sinon.spy(UTIL, "forEachOnArray");
            sinon.spy(UTIL, "isOwnProperty");

            GPT.slotsMap = {};
            slotObject = {
                setStatus: function() {
                    return "setStatus";
                },
                setRefreshFunctionCalled: function() {
                    return "setRefreshFunctionCalled";
                },
                setArguments: function() {
                    return "setArguments";
                },
                getStatus: function() {
                    return CONSTANTS.SLOT_STATUS.PARTNERS_CALLED;
                }
            };

            sinon.spy(slotObject, "setStatus");
            sinon.spy(slotObject, "setRefreshFunctionCalled");
            sinon.spy(slotObject, "setArguments");

            GPT.slotsMap["slot_1"] = slotObject;
            GPT.slotsMap["slot_2"] = slotObject;
            GPT.slotsMap["slot_3"] = slotObject;

            sinon.stub(GPT, "removeDMTargetingFromSlot");
            GPT.removeDMTargetingFromSlot.returns(true);

            done();
        });

        afterEach(function(done) {

            slotObject.setStatus.restore();
            slotObject.setRefreshFunctionCalled.restore();
            slotObject.setArguments.restore();

            GPT.slotsMap = null;

            UTIL.forEachOnArray.restore();
            UTIL.isOwnProperty.restore();

            GPT.removeDMTargetingFromSlot.restore();
            done();
        });

        it('is a function', function(done) {
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters.should.be.a('function');
            done();
        });

        it('should not proceed if given slotNames are not present in slotsMap', function (done) {
            delete GPT.slotsMap["slot_1"];
            delete GPT.slotsMap["slot_2"];
            delete GPT.slotsMap["slot_3"];
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall);
            UTIL.isOwnProperty.alwaysReturned(false).should.be.true;
            done();
        });

        it('should set status of slot to PARTNERS_CALLED if given slot is present in slotsMap', function(done) {
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall);
            UTIL.forEachOnArray.calledWith(slotNames).should.be.true;
            GPT.slotsMap["slot_1"].getStatus().should.be.equal(CONSTANTS.SLOT_STATUS.PARTNERS_CALLED);
            done();
        });

        it('should not have called GPT.removeDMTargetingFromSlot and should not have called respective slot\'s setRefreshFunctionCalled and setArguments if isRefreshCall is false', function(done) {
            isRefreshCall = false;
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall);
            GPT.removeDMTargetingFromSlot.called.should.be.false;
            GPT.slotsMap["slot_1"].setRefreshFunctionCalled.calledWith(true).should.be.false;
            GPT.slotsMap["slot_1"].setArguments.calledWith(argumentsFromCallingFunction).should.be.false;
            done();
        });

        it('should have called GPT.removeDMTargetingFromSlot with slot names and should have called respective slot\'s setRefreshFunctionCalled and setArguments if isRefreshCall is true', function(done) {
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall);
            GPT.removeDMTargetingFromSlot.called.should.be.true;
            GPT.slotsMap["slot_1"].setRefreshFunctionCalled.calledWith(true).should.be.true;
            GPT.slotsMap["slot_1"].setArguments.calledWith(argumentsFromCallingFunction).should.be.true;
            done();
        });
    });

    describe('#arrayOfSelectedSlots', function() {
        var slotNames = null;
        var slot_1 = null, slot_2 = null, slot_3 = null;

        beforeEach(function(done) {
            slotNames = ["slot_1", "slot_2", "slot_3"];

            slot_1 = SLOT.createSlot("slot_1");
            slot_2 = SLOT.createSlot("slot_2");
            slot_3 = SLOT.createSlot("slot_3");

            GPT.slotsMap = {};

            GPT.slotsMap["slot_1"] = slot_1;
            GPT.slotsMap["slot_2"] = slot_2;
            GPT.slotsMap["slot_3"] = slot_3;

            sinon.spy(UTIL, "forEachOnArray");
            done();
        });

        afterEach(function(done) {
            GPT.slotsMap = {};
            UTIL.forEachOnArray.restore();
            done();
        });

        it('is a function', function(done) {
            GPT.arrayOfSelectedSlots.should.be.a('function');
            done();
        });

        it('should return empty array when slotNames given are empty', function (done) {
            GPT.arrayOfSelectedSlots([]).should.deep.equal([]);
            done();
        });

        it('return array slot objects of given slot names from the slotMap', function(done) {
            GPT.arrayOfSelectedSlots(slotNames).should.be.a('array');
            GPT.arrayOfSelectedSlots(slotNames).should.deep.equal([slot_1, slot_2, slot_3]);
            Object.keys(GPT.slotsMap).should.be.deep.equal(slotNames);
            Object.keys(GPT.slotsMap).length.should.be.equal(slotNames.length);
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

    describe('#findWinningBidAndApplyTargeting', function() {
        var divID = null;
        var dataStub = null;
        var winningBidStub = null;
        var keyValuePairsStub = null;
        var googleDefinedSlotStub = null;

        beforeEach(function(done) {
            divID = commonDivID;
            winningBidStub = {
                getBidID: function() {
                    return "getBidID";
                },
                getStatus: function() {
                    return "getStatus";
                },
                getNetEcpm: function() {
                    return "getNetEcpm";
                },
                getDealID: function() {
                    return "getDealID";
                },
                getAdapterID: function() {
                    return "getAdapterID";
                },
            };
            sinon.stub(winningBidStub, "getBidID");
            sinon.stub(winningBidStub, "getStatus");
            sinon.stub(winningBidStub, "getNetEcpm");
            sinon.stub(winningBidStub, "getDealID");
            sinon.stub(winningBidStub, "getAdapterID");
            keyValuePairsStub = {
                "key1": {
                    "k1": "v1",
                    "k2": "v2"
                },
                "key2": {
                    "k12": "v12",
                    "k22": "v22"
                }
            };
            dataStub = {
                wb: winningBidStub,
                kvp: keyValuePairsStub
            };
            googleDefinedSlotStub = {
                setTargeting: function() {
                    return "setTargeting";
                }
            };
            sinon.spy(googleDefinedSlotStub, "setTargeting");

            GPT.slotsMap[divID] = {
                getPubAdServerObject: function() {
                    return googleDefinedSlotStub;
                },
                setStatus: function() {
                    return "setStatus";
                }
            };
            sinon.spy(GPT.slotsMap[divID], "setStatus");

            sinon.stub(BM, "getBid").withArgs(divID).returns(dataStub);
            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "forEachOnObject");
            sinon.stub(UTIL, "isOwnProperty").returns(true);
            sinon.stub(GPT, "defineWrapperTargetingKey").returns(true);
            done();
        });

        afterEach(function(done) {
            BM.getBid.restore();

            UTIL.log.restore();
            UTIL.forEachOnObject.restore();
            UTIL.isOwnProperty.restore();

            GPT.slotsMap[divID].setStatus.restore();

            googleDefinedSlotStub.setTargeting.restore();
            GPT.defineWrapperTargetingKey.restore();

            if (winningBidStub) {
                winningBidStub.getBidID.restore();
                winningBidStub.getStatus.restore();
                winningBidStub.getNetEcpm.restore();
                winningBidStub.getDealID.restore();
                winningBidStub.getAdapterID.restore();
            }
            divID = null;
            keyValuePairsStub = null;
            done();
        });

        it('is a function', function(done) {
            GPT.findWinningBidAndApplyTargeting.should.be.a('function');
            done();
        });

        it('should have logged passed divID along with winning Bid object', function(done) {
            GPT.findWinningBidAndApplyTargeting(divID);
            UTIL.log.calledWith("DIV: " + divID + " winningBid: ").should.be.true;
            UTIL.log.calledWith(winningBidStub).should.be.true;
            done();
        });

        it('should not have called setTargeting for bid if the winningBid is invalid object', function(done) {
            winningBidStub = null;
            GPT.findWinningBidAndApplyTargeting(divID);
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.SLOT_STATUS.TARGETING_ADDED).should.be.false;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID, CONFIG.getProfileID()).should.be.false;
            done();
        });

        it('should not have called setTargeting for bid if bid\'s net ecpm is not greater than 0', function(done) {
            winningBidStub.getNetEcpm.returns(-1);
            GPT.findWinningBidAndApplyTargeting(divID);
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.SLOT_STATUS.TARGETING_ADDED).should.be.false;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID, CONFIG.getProfileID()).should.be.false;
            winningBidStub.getNetEcpm.called.should.be.true;
            winningBidStub.getBidID.called.should.be.false;
            winningBidStub.getStatus.called.should.be.false;
            winningBidStub.getDealID.called.should.be.false;
            winningBidStub.getAdapterID.called.should.be.false;
            done();
        });

        it('should not have called defineWrapperTargetingKey if key in keyValuePairs is among prebid keys to ignore', function(done) {
            winningBidStub.getNetEcpm.returns(2);

            UTIL.isOwnProperty.withArgs(CONSTANTS.IGNORE_PREBID_KEYS).returns(true);

            GPT.findWinningBidAndApplyTargeting(divID);

            winningBidStub.getNetEcpm.called.should.be.true;
            winningBidStub.getBidID.called.should.be.true;
            winningBidStub.getStatus.called.should.be.true;
            GPT.defineWrapperTargetingKey.called.should.be.false;
            done();
        });

        it('should have called defineWrapperTargetingKey if key in keyValuePairs is not among prebid keys to ignore', function(done) {
            winningBidStub.getNetEcpm.returns(2);
            UTIL.isOwnProperty.withArgs(CONSTANTS.IGNORE_PREBID_KEYS).returns(false);

            GPT.findWinningBidAndApplyTargeting(divID);

            UTIL.forEachOnObject.called.should.be.true;
            GPT.defineWrapperTargetingKey.called.should.be.true;

            googleDefinedSlotStub.setTargeting.calledWith("key1", keyValuePairsStub["key1"]).should.be.true;
            GPT.defineWrapperTargetingKey.calledWith("key1").should.be.true;

            googleDefinedSlotStub.setTargeting.calledWith("key2", keyValuePairsStub["key2"]).should.be.true;
            GPT.defineWrapperTargetingKey.calledWith("key2").should.be.true;

            googleDefinedSlotStub.setTargeting.calledWith("key3", keyValuePairsStub["key3"]).should.be.false;
            GPT.defineWrapperTargetingKey.calledWith("key3").should.be.false;
            done();
        });

        it('should have set targeting when winning bid\'s net ecpm is greater than 0 but should not have called set targeting on deal id if not valid', function (done) {
            winningBidStub.getNetEcpm.returns(2);
            winningBidStub.getDealID.returns(null);
            GPT.findWinningBidAndApplyTargeting(divID);
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID, winningBidStub.getBidID()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS, winningBidStub.getStatus()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM, winningBidStub.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION)).should.be.true;

            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID, winningBidStub.getDealID()).should.be.false;

            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID, winningBidStub.getAdapterID()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID, CONFIG.getPublisherId()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID, CONFIG.getProfileID()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID, CONFIG.getProfileDisplayVersionID()).should.be.true;

            done();
        });

        it('should have set targeting when winning bid\'s net ecpm is greater than 0 and should have called set targeting on deal id is valid', function (done) {
            winningBidStub.getNetEcpm.returns(2);
            winningBidStub.getDealID.returns("deal_id");
            GPT.findWinningBidAndApplyTargeting(divID);
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID, winningBidStub.getBidID()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS, winningBidStub.getStatus()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM, winningBidStub.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION)).should.be.true;

            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID, winningBidStub.getDealID()).should.be.true;

            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID, winningBidStub.getAdapterID()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID, CONFIG.getPublisherId()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID, CONFIG.getProfileID()).should.be.true;
            googleDefinedSlotStub.setTargeting.calledWith(CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID, CONFIG.getProfileDisplayVersionID()).should.be.true;

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

    describe('#newDisableInitialLoadFunction', function() {

        var theObject = null,
            originalFunction = null;

        beforeEach(function(done) {
            theObject = {};
            originalFunction = function() {
                return "originalFunction";
            };

            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");

            done();

        });

        afterEach(function(done) {
            originalFunction = null;
            theObject = null;

            UTIL.log.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();

            done();
        });

        it('is a function', function(done) {
            GPT.newDisableInitialLoadFunction.should.be.a('function');
            done();
        });

        it('return null if passed function is not a function', function(done) {
            originalFunction = null;
            should.not.exist(GPT.newDisableInitialLoadFunction(theObject, originalFunction));
            UTIL.log.calledWith("disableInitialLoad: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            done();
        });

        it('return null if passed object is not an object', function(done) {
            theObject = null;
            should.not.exist(GPT.newDisableInitialLoadFunction(theObject, originalFunction));
            UTIL.log.calledWith("disableInitialLoad: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.false;
            done();
        });

        it('return function if passed object is an object and passed function is a function', function(done) {
            GPT.newDisableInitialLoadFunction(theObject, originalFunction).should.be.a('function');
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            done();
        });
    });

    describe('#newEnableSingleRequestFunction', function() {

        var theObject = null,
            originalFunction = null;

        beforeEach(function(done) {
            theObject = {};
            originalFunction = function() {
                return "originalFunction";
            };

            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");

            done();

        });

        afterEach(function(done) {
            originalFunction = null;
            theObject = null;

            UTIL.log.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();

            done();
        });

        it('is a function', function(done) {
            GPT.newEnableSingleRequestFunction.should.be.a('function');
            done();
        });

        it('return null if passed function is not a function', function(done) {
            originalFunction = null;
            should.not.exist(GPT.newEnableSingleRequestFunction(theObject, originalFunction));
            UTIL.log.calledWith("disableInitialLoad: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            UTIL.isFunction.returned(false).should.be.true;
            done();
        });

        it('return null if passed object is not an object', function(done) {
            theObject = null;
            should.not.exist(GPT.newEnableSingleRequestFunction(theObject, originalFunction));
            UTIL.log.calledWith("disableInitialLoad: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.false;
            done();
        });

        it('return function if passed object is an object and passed function is a function', function(done) {
            GPT.newEnableSingleRequestFunction(theObject, originalFunction).should.be.a('function');
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            done();
        });
    });

    describe('#newSetTargetingFunction', function() {

        var theObject = null,
            originalFunction = null;

        beforeEach(function(done) {
            theObject = {};
            originalFunction = function() {
                return "originalFunction";
            };

            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");

            done();

        });

        afterEach(function(done) {
            originalFunction = null;
            theObject = null;

            UTIL.log.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();

            done();
        });

        it('is a function', function(done) {
            GPT.newSetTargetingFunction.should.be.a('function');
            done();
        });

        it('return null if passed object is not an object', function(done) {
            theObject = null;
            should.not.exist(GPT.newSetTargetingFunction(theObject, originalFunction));
            UTIL.log.calledWith("setTargeting: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.false;
            done();
        });

        it('return null if function is not a function', function(done) {
            originalFunction = null;
            should.not.exist(GPT.newSetTargetingFunction(theObject, originalFunction));
            UTIL.log.calledWith("setTargeting: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            UTIL.isFunction.returned(false).should.be.true;
            done();
        });

        it('return function if passed object is an object and passed function is a function', function(done) {
            GPT.newSetTargetingFunction(theObject, originalFunction).should.be.a('function');
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            done();
        });
    });

    describe('#newDestroySlotsFunction', function() {
        var theObject = null,
            originalFunction = null;

        beforeEach(function(done) {
            theObject = {};
            originalFunction = function() {
                return "originalFunction";
            };

            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");

            done();

        });

        afterEach(function(done) {
            originalFunction = null;
            theObject = null;

            UTIL.log.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();

            done();
        });

        it('is a function', function(done) {
            GPT.newDestroySlotsFunction.should.be.a('function');
            done();
        });

        it('return null if passed object is not an object', function(done) {
            theObject = null;
            should.not.exist(GPT.newDestroySlotsFunction(theObject, originalFunction));
            UTIL.log.calledWith("destroySlots: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.false;
            done();
        });

        it('return null if passed function is not a function', function(done) {
            originalFunction = null;
            should.not.exist(GPT.newDestroySlotsFunction(theObject, originalFunction));
            UTIL.log.calledWith("destroySlots: originalFunction is not a function").should.be.true;
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            UTIL.isFunction.returned(false).should.be.true;
            done();
        });

        it('return function if passed object is an object and passed function is a function', function(done) {
            GPT.newDestroySlotsFunction(theObject, originalFunction).should.be.a('function');
            UTIL.isObject.calledWith(theObject).should.be.true;
            UTIL.isFunction.calledWith(originalFunction).should.be.true;
            done();
        });
    });

    describe('#updateStatusAndCallOriginalFunction_Display', function() {
        var message = null,
            theObject = null,
            originalFunction = null,
            arg = null;
        var obj = null;

        beforeEach(function(done) {
            message = "log message";
            theObject = {};
            obj = {
                originalFunction: function() {
                    return "originalFunction";
                }
            };

            arg = ["DIV_1", "DIV_2"];
            sinon.spy(obj.originalFunction, "apply");
            sinon.spy(UTIL, "log");

            sinon.stub(GPT, "updateStatusAfterRendering");
            GPT.updateStatusAfterRendering.returns(true);

            done();
        });

        afterEach(function(done) {
            obj.originalFunction.apply.restore();
            UTIL.log.restore();
            GPT.updateStatusAfterRendering.restore();
            message = null;
            theObject = null;
            originalFunction = null;
            arg = null;
            done();
        });

        it('is a function', function(done) {
            GPT.updateStatusAndCallOriginalFunction_Display.should.be.a('function');
            done();
        });

        it('should have called UTIL.log, GPT.updateStatusAfterRendering and passed originalFunction with proper arguments', function(done) {
            GPT.updateStatusAndCallOriginalFunction_Display(message, theObject, obj.originalFunction, arg);
            UTIL.log.calledWith(message).should.be.true;
            UTIL.log.calledWith(arg).should.be.true;
            obj.originalFunction.apply.calledWith(theObject, arg).should.be.true;
            GPT.updateStatusAfterRendering.calledWith(arg[0], false).should.be.true;
            done();
        });
    });

    describe('#findWinningBidIfRequired_Display', function() {
        var key = null,
            slot = null;

        beforeEach(function(done) {
            key = "key_1";
            slot = SLOT.createSlot(commonDivID);
            sinon.stub(slot, "getStatus");

            sinon.stub(GPT, "findWinningBidAndApplyTargeting");
            GPT.findWinningBidAndApplyTargeting.returns(true);

            done();
        });

        afterEach(function(done) {
            GPT.findWinningBidAndApplyTargeting.restore();

            slot.getStatus.restore();

            key = null;
            slot = null;
            done();
        });

        it('is a function', function(done) {
            GPT.findWinningBidIfRequired_Display.should.be.a('function');
            done();
        });

        it('should not have called GPT.findWinningBidAndApplyTargeting if slot\'s status is either DISPLAYED or TARGETING_ADDED', function(done) {
            slot.getStatus.returns(CONSTANTS.SLOT_STATUS.DISPLAYED);
            GPT.findWinningBidIfRequired_Display(key, slot);
            GPT.findWinningBidAndApplyTargeting.called.should.be.false;
            slot.getStatus.called.should.be.true;
            done();
        });

        it('should not have called GPT.findWinningBidAndApplyTargeting if slot\'s status is either DISPLAYED or TARGETING_ADDED', function(done) {
            slot.getStatus.returns(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
            GPT.findWinningBidIfRequired_Display(key, slot);
            GPT.findWinningBidAndApplyTargeting.called.should.be.false;
            slot.getStatus.called.should.be.true;
            done();
        });

        it('should have called GPT.findWinningBidAndApplyTargeting if slot\'s status is neither DISPLAYED nor TARGETING_ADDED', function(done) {
            GPT.findWinningBidIfRequired_Display(key, slot);
            GPT.findWinningBidAndApplyTargeting.calledWith(key).should.be.true;
            slot.getStatus.called.should.be.true;
            done();
        });
    });

    describe('#processDisplayCalledSlot', function(){

        beforeEach(function(done){
            //sinon.stub(UTIL, 'log')
            done();
        });

        afterEach(function(done){
            //UTIL.log.restore()
            done();
        });

        it('is function', function(done){
            GPT.processDisplayCalledSlot.should.be.a('function');
            done();
        });

        it('do nothing if slot is invalid', function(done){
            sinon.spy(UTIL, "log");
            GPT.processDisplayCalledSlot({}, function(){}, ["div1"]);
            UTIL.log.args[0][0].should.equal("AdSlot already rendered");
            UTIL.log.restore();
            done();
        });

        it('valid case', function(done){

            var sizeObj_1 = {
                getWidth: function() {
                    return 1024;
                },
                getHeight: function() {
                    return 768;
                },
                "id": "sizeObj_1"
            };

            var sizeObj_2 = {
                getWidth: function() {
                    return 640;
                },
                getHeight: function() {
                    return 480;
                },
                "id": "sizeObj_2"
            };

            currentGoogleSlotStub = {
                getTargetingKeys: function () {
                    return [ "k1", "k2"];
                },
                getTargeting: function (key) {
                    return "v1";
                },
                getSizes: function() {
                    return [sizeObj_1, sizeObj_2];
                },
                getAdUnitPath: function () {
                    return "ad_unit_path";
                }
            };


            sinon.stub(GPT, "findWinningBidAndApplyTargeting");
            sinon.stub(GPT, "updateStatusAndCallOriginalFunction_Display");

            var dmSlotName = "DIV_TEST";
            delete GPT.slotsMap[dmSlotName];
            GPT.storeInSlotsMap(dmSlotName, currentGoogleSlotStub, true);

            var theObject = {};
            var theOriginalFunction = function(){};
            var args = [dmSlotName];

            GPT.processDisplayCalledSlot(theObject, theOriginalFunction, args);
            //GPT.findWinningBidAndApplyTargeting.calledWith(dmSlotName);
            GPT.updateStatusAndCallOriginalFunction_Display.calledWith(
                "Calling original display function after timeout with arguments, ",
                theObject,
                theOriginalFunction,
                args
            );
            GPT.findWinningBidAndApplyTargeting.restore();
            GPT.updateStatusAndCallOriginalFunction_Display.restore();
            done();
        });
    });

    describe("#executeDisplay", function() {
        beforeEach(function(done) {
            sinon.spy(window, "setTimeout");
            window.OWT = {
              externalBidderStatuses: {
                Div1: {
                  id: 0,
                  status: false
                },
                Div2: {
                  id: 1,
                  status: true
                }
              }
            };
            done();
        });

        afterEach(function(done) {
            window.OWT = undefined;
            window.setTimeout.restore();
            done();
        });

        it('should be a function', function(done) {
            GPT.executeDisplay.should.be.a('function');
            done();
        });

        it('should recall executeDisplay as partners not responded for given slot', function (done) {
            var isTriggered = false;
            GPT.executeDisplay(100, ["Div1"], function() {
              isTriggered = true;
            });
            window.setTimeout.called.should.be.true;
            isTriggered.should.be.false;
            done();
        });

        it('should execute callback as partners responded for given slot', function (done) {
            var isTriggered = false;
            GPT.executeDisplay(100, ["Div2"], function() {
              isTriggered = true;
            });
            window.setTimeout.called.should.be.false;
            isTriggered.should.be.true;
            done();
        });
    });

    describe('#displayFunctionStatusHandler', function() {

        var oldStatus = null,
            theObject = null,
            originalFunction = null,
            arg = null;
        beforeEach(function(done) {
            oldStatus = CONSTANTS.SLOT_STATUS.CREATED;
            theObject = {};
            originalFunction = function() {
                return "originalFunction"
            };
            arg = {};
            window.OWT = {
              externalBidderStatuses: {}
            };
            sinon.stub(GPT, "updateStatusAndCallOriginalFunction_Display").returns(true);
            sinon.spy(window, "setTimeout");
            sinon.spy(CONFIG, "getTimeout");
            done();
        });

        afterEach(function(done) {
            oldStatus = null;
            theObject = null;
            originalFunction = null;
            arg = null;
            window.OWT = null;
            GPT.updateStatusAndCallOriginalFunction_Display.restore();
            window.setTimeout.restore();
            CONFIG.getTimeout.restore();
            done();
        });

        it('should be a function', function(done) {
            GPT.displayFunctionStatusHandler.should.be.a('function');
            done();
        });

        it('should have fall through and called setTimeout with function to fire post timeout to handle slot rendering', function (done) {
            oldStatus = CONSTANTS.SLOT_STATUS.CREATED;
            GPT.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            window.setTimeout.called.should.be.true;
            CONFIG.getTimeout.called.should.be.true;
            done();
        });

        it('should have called setTimeout with function to fire post timeout to handle slot rendering', function (done) {
            oldStatus = CONSTANTS.SLOT_STATUS.PARTNERS_CALLED;
            GPT.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            window.setTimeout.called.should.be.true;
            CONFIG.getTimeout.called.should.be.true;
            done();
        });

        it('should have called updateStatusAndCallOriginalFunction_Display with proper arguments when oldStatus is  TARGETING_ADDED', function(done) {
            oldStatus = CONSTANTS.SLOT_STATUS.TARGETING_ADDED;
            GPT.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            GPT.updateStatusAndCallOriginalFunction_Display
                .calledWith(
                    "As DM processing is already done, Calling original display function with arguments",
                    theObject,
                    originalFunction,
                    arg)
                .should.be.true;
            done();
        });

        it('should have called updateStatusAndCallOriginalFunction_Display with proper arguments when oldStatus is  DISPLAYED', function(done) {
            oldStatus = CONSTANTS.SLOT_STATUS.DISPLAYED;
            GPT.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            GPT.updateStatusAndCallOriginalFunction_Display
                .calledWith(
                    "As slot is already displayed, Calling original display function with arguments",
                    theObject,
                    originalFunction,
                    arg)
                .should.be.true;
            done();
        });
    });

    describe('#forQualifyingSlotNamesCallAdapters', function() {

        var qualifyingSlotNames = null,
            arg = null,
            isRefreshCall = null;
        var qualifyingSlots = null;
        var slot_1 = null, slot_2 = null;

        beforeEach(function(done) {
            qualifyingSlotNames = ["slot_1", "slot_2", "slot_3"];
            arg = [
                ["slot_1"], "slot_2"
            ];
            slot_1 = SLOT.createSlot("slot_1");
            slot_2 = SLOT.createSlot("slot_2");

            qualifyingSlots = [slot_1, slot_2];
            isRefreshCall = false;

            sinon.stub(GPT, "updateStatusOfQualifyingSlotsBeforeCallingAdapters");
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters.returns(true);

            sinon.stub(GPT, "arrayOfSelectedSlots");
            GPT.arrayOfSelectedSlots.returns(qualifyingSlots);

            sinon.stub(AM, "callAdapters");
            AM.callAdapters.returns(true);

            done();
        });

        afterEach(function(done) {
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters.restore();
            GPT.arrayOfSelectedSlots.restore();
            AM.callAdapters.restore();

            qualifyingSlotNames = null;
            qualifyingSlots = null;

            slot_1 = null;
            slot_2 = null;

            done();
        });


        it('should be a function', function(done) {
            GPT.forQualifyingSlotNamesCallAdapters.should.be.a('function');
            done();
        });

        it('should have called updateStatusOfQualifyingSlotsBeforeCallingAdapters and arrayOfSelectedSlots', function(done) {
            GPT.forQualifyingSlotNamesCallAdapters(qualifyingSlotNames, arg, isRefreshCall);
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters.calledWith(qualifyingSlotNames, arg, isRefreshCall).should.be.true;
            GPT.arrayOfSelectedSlots.calledWith(qualifyingSlotNames).should.be.true;
            AM.callAdapters.calledWith(qualifyingSlots).should.be.true;
            done();
        });

        it('should not have called updateStatusOfQualifyingSlotsBeforeCallingAdapters and arrayOfSelectedSlots when passed qualifyingSlotNames is empty', function(done) {
            qualifyingSlotNames = [];
            GPT.forQualifyingSlotNamesCallAdapters(qualifyingSlotNames, arg, isRefreshCall);
            GPT.updateStatusOfQualifyingSlotsBeforeCallingAdapters.called.should.be.false;
            GPT.arrayOfSelectedSlots.called.should.be.false;
            AM.callAdapters.called.should.be.false;
            done();
        });
    });

    describe('#newDisplayFunction()', function() {
        var theObject = null, originalFunction = null;
        var pubadsStub = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");

            pubadsStub = {
                getSlots: function () {
                    return ["slot_1", "slot_2"];
                }
            };

            theObject = {
                pubads: function () {
                    return pubadsStub;
                }
            };
            sinon.spy(theObject, "pubads");
            sinon.spy(pubadsStub, "getSlots");

            originalFunction = function () {
                return "originalFunction";
            };

            sinon.stub(GPT, "updateSlotsMapFromGoogleSlots").returns(true);
            sinon.stub(GPT, "displayFunctionStatusHandler").returns(true);
            sinon.stub(GPT, "forQualifyingSlotNamesCallAdapters").returns(true);
            // sinon.stub(GPT, "getSlotNamesByStatus").returns(true);

            done();
        });

        afterEach(function(done) {
            UTIL.log.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();

            if (theObject) {
                theObject.pubads.restore();
            }

            pubadsStub.getSlots.restore();


            originalFunction = null;

            GPT.updateSlotsMapFromGoogleSlots.restore();
            GPT.displayFunctionStatusHandler.restore();
            GPT.forQualifyingSlotNamesCallAdapters.restore();
            // GPT.getSlotNamesByStatus.restore();


            pubadsStub = null;
            theObject = null

            done();
        });

        it('is a function', function(done) {
            GPT.newDisplayFunction.should.be.a('function');
            done();
        });

        it('should return null when passed an non object as a parameter', function(done) {
            theObject = null;
            should.not.exist(GPT.newDisplayFunction(theObject, originalFunction));
            UTIL.log.calledOnce.should.equal(true);
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.false;
            UTIL.isObject.returned(false).should.be.true;
            UTIL.log.calledWith("display: originalFunction is not a function").should.be.true;
            done();
        });

        it('should return null when passed function is not a function', function(done) {
            originalFunction = null;
            should.not.exist(GPT.newDisplayFunction(theObject, originalFunction));
            UTIL.log.calledOnce.should.equal(true);
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.true;
            UTIL.isObject.returned(true).should.be.true;
            UTIL.isFunction.returned(false).should.be.true;
            UTIL.log.calledWith("display: originalFunction is not a function").should.be.true;
            done();
        });

        it('should return function when proper parameters are passed', function(done) {
            GPT.newDisplayFunction(theObject, originalFunction).should.be.a('function');
            done();
        });

        xit('should return a function which will original function', function (done) {
            var returnedFunction = GPT.newDisplayFunction(theObject, originalFunction);
            returnedFunction();
            UTIL.log.calledWith("In display function, with arguments: ").should.be.true;
            UTIL.log.calledWith("DisableInitialLoad was called, Nothing to do").should.be.false;
            GPT.updateSlotsMapFromGoogleSlots.called.should.be.true;
            GPT.displayFunctionStatusHandler.called.should.be.true;
            GPT.forQualifyingSlotNamesCallAdapters.called.should.be.true;
            // GPT.getSlotNamesByStatus.called.should.be.true;
            done();
        });
    });

    describe('#newAddHookOnGoogletagDisplay', function() {
        var localGoogletag = null;

        beforeEach(function(done) {
            localGoogletag = {};
            sinon.spy(UTIL, "log");
            sinon.stub(UTIL, "addHookOnFunction");
            UTIL.addHookOnFunction.returns(true);
            done();
        });

        afterEach(function(done) {
            localGoogletag = null;
            UTIL.log.restore();
            UTIL.addHookOnFunction.restore();
            done();
        });

        it('is a function', function(done) {
            GPT.newAddHookOnGoogletagDisplay.should.be.a('function');
            done();
        });

        it('should proceed if display hook is already added', function(done) {
            GPT.displayHookIsAdded = true;
            GPT.newAddHookOnGoogletagDisplay(localGoogletag);
            GPT.displayHookIsAdded.should.be.true;
            UTIL.log.calledOnce.should.be.false;
            UTIL.addHookOnFunction.calledOnce.should.be.false;
            done();
        });

        it('should have return while adding hook on localGoogletag passed and logging it', function(done) {
            GPT.displayHookIsAdded = false;
            GPT.newAddHookOnGoogletagDisplay(localGoogletag);
            UTIL.log.calledWith("Adding hook on googletag.display.").should.be.true;
            UTIL.addHookOnFunction.calledWith(localGoogletag, false, "display", GPT.newDisplayFunction).should.be.true;
            GPT.displayHookIsAdded.should.be.equal(true);
            done();
        });
    });

    describe('#findWinningBidIfRequired_Refresh', function() {
        var slotName = null,
            divID = null,
            currentFlagValue = null
            slotStub = null;

        beforeEach(function(done) {
            slotName = "Slot_1";
            divID = commonDivID;
            currentFlagValue = true;
            GPT.slotsMap = {};
            slotStub = {
                isRefreshFunctionCalled: function() {
                    return true;
                },
                getStatus: function() {
                    return CONSTANTS.SLOT_STATUS.DISPLAYED;
                }
            };
            GPT.slotsMap[slotName] = slotStub;

            sinon.stub(GPT.slotsMap[slotName], "isRefreshFunctionCalled").returns(true);

            sinon.stub(GPT.slotsMap[slotName], "getStatus");

            sinon.stub(UTIL, "isOwnProperty");
            UTIL.isOwnProperty.returns(true);

            sinon.stub(GPT, "findWinningBidAndApplyTargeting");
            GPT.findWinningBidAndApplyTargeting.returns(true);

            sinon.stub(GPT, "updateStatusAfterRendering");
            GPT.updateStatusAfterRendering.returns(true);

            done();
        });

        afterEach(function(done) {


            GPT.slotsMap[slotName].isRefreshFunctionCalled.restore();
            GPT.slotsMap[slotName].getStatus.restore();

            GPT.slotsMap[slotName] = null;


            UTIL.isOwnProperty.restore();

            GPT.findWinningBidAndApplyTargeting.restore();

            GPT.updateStatusAfterRendering.restore();

            slotName = null;
            divID = null;
            currentFlagValue = null;
            done();
        });

        it('is a function', function(done) {
            GPT.findWinningBidIfRequired_Refresh.should.be.a('function');
            done();
        });

        it('should return true when given slot name is in slotsMap for given slot refresh function is already called and status of the slot is DISPLAYED', function(done) {
            GPT.findWinningBidIfRequired_Refresh(slotName, divID, currentFlagValue).should.be.equal(true);
            GPT.slotsMap[slotName].isRefreshFunctionCalled.called.should.be.true;
            GPT.slotsMap[slotName].isRefreshFunctionCalled.returned(true).should.be.true
            UTIL.isOwnProperty.calledWith(GPT.slotsMap, slotName).should.be.true;
            GPT.findWinningBidAndApplyTargeting.called.should.be.true;
            GPT.updateStatusAfterRendering.called.should.be.true;
            done();
        });

        it('should return passed currentFlagValue when either given slotName is not in slotsMap or given slotNames refresh function is already not called or given slotNames status is of type DISPLAYED', function(done) {
            currentFlagValue = false;
            GPT.slotsMap[slotName].isRefreshFunctionCalled.returns(false);
            GPT.findWinningBidIfRequired_Refresh(slotName, divID, currentFlagValue).should.be.false;
            GPT.findWinningBidAndApplyTargeting.called.should.be.false;
            GPT.updateStatusAfterRendering.called.should.be.false;
            done();
        });
    });

    describe('#postRederingChores', function(){
        beforeEach(function(done){
            sinon.spy(UTIL, "createVLogInfoPanel");
            sinon.spy(UTIL, "realignVLogInfoPanel");
            sinon.stub(BM, "executeAnalyticsPixel");
            BM.executeAnalyticsPixel.returns(true);
            done();
        });

        afterEach(function(done){
            UTIL.createVLogInfoPanel.restore();
            UTIL.realignVLogInfoPanel.restore();
            BM.executeAnalyticsPixel.restore();
            done();
        });

        it('is a function', function(done){
            GPT.postRederingChores.should.be.a('function');
            done();
        });

        it('all internal functions are called', function(done){
            GPT.slotsMap['dmSlotName'] = SLOT.createSlot('dmSlotName');
            GPT.postRederingChores('DIV_1', 'dmSlotName');
            UTIL.createVLogInfoPanel.called.should.be.true;
            UTIL.realignVLogInfoPanel.called.should.be.true;
            BM.executeAnalyticsPixel.called.should.be.true;
            done();
        });
    });

    describe('#postTimeoutRefreshExecution', function() {
        var qualifyingSlotNames = null,
            theObject = null,
            originalFunction = null,
            arg = null;
        var slotObject = null;

        beforeEach(function(done) {
            qualifyingSlotNames = ["slot_1", "slot_2"];
            theObject = {};
            originalFunction = function() {
                return "originalFunction";
            };
            arg = {};
            slotObject = {
                getDivID: function() {
                    return "getDivID";
                },
                getSizes: function() {
                    return "getSizes";
                },
            };

            GPT.slotsMap = {};
            GPT.slotsMap["slot_1"] = slotObject;
            GPT.slotsMap["slot_2"] = slotObject;

            sinon.spy(slotObject, "getDivID");

            sinon.spy(window, "setTimeout");

            sinon.spy(CONFIG, "getTimeout");

            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "forEachOnArray");
            sinon.spy(UTIL, "createVLogInfoPanel");
            sinon.spy(UTIL, "realignVLogInfoPanel");

            sinon.stub(BM, "executeAnalyticsPixel");
            BM.executeAnalyticsPixel.returns(true);
            sinon.stub(GPT, "callOriginalRefeshFunction");
            GPT.callOriginalRefeshFunction.returns(true);

            sinon.stub(GPT, "findWinningBidIfRequired_Refresh");
            GPT.findWinningBidIfRequired_Refresh.returns(true);

            done();
        });

        afterEach(function(done) {
            UTIL.log.restore();
            UTIL.forEachOnArray.restore();
            UTIL.createVLogInfoPanel.restore();
            UTIL.realignVLogInfoPanel.restore();

            BM.executeAnalyticsPixel.restore();

            GPT.callOriginalRefeshFunction.restore();

            GPT.findWinningBidIfRequired_Refresh.restore();

            window.setTimeout.restore();

            CONFIG.getTimeout.restore();

            slotObject.getDivID.restore();

            done();
        });

        it('is a function', function(done) {
            GPT.postTimeoutRefreshExecution.should.be.a('function');
            done();
        });

        it('should not proceed if qualifyingSlotNames are empty', function (done) {
            qualifyingSlotNames = [];
            GPT.postTimeoutRefreshExecution(qualifyingSlotNames, theObject, originalFunction, arg);
            window.setTimeout.called.should.be.false;
            GPT.callOriginalRefeshFunction.calledWith(false, theObject, originalFunction, arg).should.be.true;
            done();
        });

        it('should have called callOriginalRefeshFunction with proper arguments', function (done) {
            GPT.findWinningBidIfRequired_Refresh.returns(false);

            GPT.postTimeoutRefreshExecution(qualifyingSlotNames, theObject, originalFunction, arg);

            UTIL.log.calledWith("Executing post timeout events, arguments: ").should.be.true;
            UTIL.log.calledWith(arg).should.be.true;
            UTIL.forEachOnArray.calledWith(qualifyingSlotNames).should.be.true;
            window.setTimeout.called.should.be.true;
            GPT.callOriginalRefeshFunction.calledWith(false, theObject, originalFunction, arg).should.be.true;

            done();
        });

        it('should have logged the arg while executing post timeout events', function(done) {
            GPT.postTimeoutRefreshExecution(qualifyingSlotNames, theObject, originalFunction, arg);
            UTIL.log.calledWith("Executing post timeout events, arguments: ").should.be.true;
            UTIL.log.calledWith(arg).should.be.true;
            UTIL.forEachOnArray.calledWith(qualifyingSlotNames).should.be.true;
            window.setTimeout.called.should.be.true;
            GPT.callOriginalRefeshFunction.calledWith(true, theObject, originalFunction, arg).should.be.true;
            done();
        });
    });

    describe('#callOriginalRefeshFunction', function() {
        var flag = null;
        var theObject = null;
        var obj = null;
        var arg = null;

        beforeEach(function(done) {
            flag = true
            theObject = {}

            obj = {
                originalFunction: function(theObject, arg) {
                    return "originalFunction";
                }
            };
            sinon.spy(obj.originalFunction, 'apply');
            sinon.spy(UTIL, "log");
            arg = [
                ["slot_1", "slot_2"]
            ];
            done();
        });

        afterEach(function(done) {
            obj.originalFunction.apply.restore();
            UTIL.log.restore();
            flag = null;
            theObject = null;
            obj.originalFunction = null;
            obj = null;
            arg = null;
            done();
        });

        it('is a function', function(done) {
            GPT.callOriginalRefeshFunction.should.be.a('function');
            done();
        });

        it('should have logged if the ad has been already rendered ', function(done) {
            flag = false;
            GPT.callOriginalRefeshFunction(flag, theObject, obj.originalFunction, arg);
            UTIL.log.calledWith("AdSlot already rendered").should.be.true;
            done();
        });

        //todo: move the log messages to constants and use same here
        it('should have logged while calling the passed originalFunction with passed arguments', function(done) {
            GPT.callOriginalRefeshFunction(flag, theObject, obj.originalFunction, arg);
            obj.originalFunction.apply.calledWith(theObject, arg).should.be.true;
            UTIL.log.calledWith("Calling original refresh function post timeout").should.be.true;
            done();
        });
    });

    describe('#getQualifyingSlotNamesForRefresh', function() {
        var arg = null;
        var theObject = null;
        var slot_1Stub = null;
        var slot_2Stub = null;

        beforeEach(function(done) {
            arg = [];
            slot_1Stub = {
                getSlotId: function () {
                    return {
                        getDomId: function () {
                            return "DIV_1";
                        }
                    }
                }
            };

            slot_2Stub = {
                getSlotId: function () {
                    return {
                        getDomId: function () {
                            return "DIV_2";
                        }
                    }
                }
            };
            theObject = {
                getSlots: function() {
                    return [slot_1Stub, slot_2Stub];
                }
            };
            sinon.spy(UTIL, "forEachOnArray");
            sinon.spy(GPT, "generateSlotName");
            sinon.spy(theObject, "getSlots");
            done();
        });

        afterEach(function(done) {
            UTIL.forEachOnArray.restore();
            GPT.generateSlotName.restore();
            theObject.getSlots.restore();
            theObject = null;
            arg = null;
            done();
        });

        it('is a function', function(done) {
            GPT.getQualifyingSlotNamesForRefresh.should.be.a('function');
            done();
        });

        it('should return an array', function(done) {
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.a('array');
            done();
        });

        it('should have called GPT.generateSlotName and UTIL.forEachOnArray', function(done) {
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject);
            GPT.generateSlotName.called.should.be.true;
            UTIL.forEachOnArray.called.should.be.true;
            UTIL.forEachOnArray.calledWith(theObject.getSlots()).should.be.true;
            done();
        });

        it('should consider passed arg if its not empty', function(done) {
            arg = [ [slot_1Stub, slot_2Stub] ];
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.deep.equal(['DIV_1', 'DIV_2']);
            UTIL.forEachOnArray.calledWith(arg[0]).should.be.true;
            done();
        });

        it('should consider passed arg if first argumnet in array is null', function(done) {
            arg = [ [null, slot_2Stub] ];
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.deep.equal(['DIV_2']);
            UTIL.forEachOnArray.calledWith(arg[0]).should.be.true;
            done();
        });


        it('should consider passed arg if passed argumnet is empty string array', function(done) {
            arg = [ [''] ];
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.deep.equal([]);
            UTIL.forEachOnArray.calledWith(arg[0]).should.be.true;
            done();
        });

        it('should consider passed arg if first argumnet is empty string array and second is slot object', function(done) {
            arg = [ ['', slot_2Stub] ];
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.deep.equal(['DIV_2']);
            UTIL.forEachOnArray.calledWith(arg[0]).should.be.true;
            done();
        });

        it('should consider passed arg if its empty ', function(done) {
            arg = [];
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.deep.equal([ 'DIV_1', 'DIV_2']);
            UTIL.forEachOnArray.calledWith(theObject.getSlots()).should.be.true;
            done();
        });

        it('should consider passed arg if its null', function(done) {
            arg = [null];
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.deep.equal([ 'DIV_1', 'DIV_2']);
            UTIL.forEachOnArray.calledWith(theObject.getSlots()).should.be.true;
            done();
        });
    });

    describe('#newRefreshFuncton', function() {
        var theObject = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");

            sinon.stub(GPT, "updateSlotsMapFromGoogleSlots").returns(true);
            sinon.stub(GPT, "forQualifyingSlotNamesCallAdapters").returns(true);
            theObject = {
                getSlots: function () {
                    return "getSlots";
                }
            };
            window.OWT = {
                externalBidderStatuses: {}
            };
            done();
        });

        afterEach(function(done) {
            UTIL.log.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();

            GPT.updateSlotsMapFromGoogleSlots.restore();
            GPT.forQualifyingSlotNamesCallAdapters.restore();
            theObject = null;
            window.OWT = null;
            done();
        });


        it('is a function', function(done) {
            GPT.newRefreshFuncton.should.be.a('function');
            done();
        });

        it('should return null when impropper parameters passed', function(done) {
            var result = GPT.newRefreshFuncton(null, function() {
                console.log("inside function");
            });
            should.not.exist(result);
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.false;
            UTIL.log.calledOnce.should.be.true;
            UTIL.log.calledWith("refresh: originalFunction is not a function").should.be.true;
            done();
        });

        it('should return a function when propper parameters are passed', function(done) {
            GPT.newRefreshFuncton(theObject, function() {
                console.log("inside function");
            }).should.be.a('function');
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.true;
            UTIL.isObject.calledOnce.should.be.true;
            UTIL.isFunction.calledOnce.should.be.true;
            done();
        });


        it('the returned function when called should call refersh functionality', function (done) {
            var returnedFn = GPT.newRefreshFuncton(theObject, function() {
                console.log("inside function");
            });
            UTIL.isObject.calledOnce.should.be.true;
            UTIL.isFunction.calledOnce.should.be.true;
            returnedFn();
            UTIL.log.calledWith("In Refresh function").should.be.true;
            UTIL.log.calledWith("Intiating Call to original refresh function with Timeout: " + CONFIG.getTimeout() + " ms").should.be.true;
            GPT.updateSlotsMapFromGoogleSlots.called.should.be.true;
            GPT.forQualifyingSlotNamesCallAdapters.called.should.be.true;
            done();
        });
    });

    describe('#newSizeMappingFunction', function() {

        var theObject = null, obj  = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
            obj = {
                originalFunction: function () {
                    return "originalFunction";
                }
            };
            sinon.spy(obj.originalFunction, "apply");

            theObject = {};
            done();
        });

        afterEach(function(done) {
            UTIL.log.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();
            if (obj.originalFunction) {
                obj.originalFunction.apply.restore();
            }
            // obj.originalFunction = null;
            theObject = null;
            done();
        });


        it('is a function', function(done) {
            GPT.newSizeMappingFunction.should.be.a('function');
            done();
        });

        it('should return null when impropper parameters passed, non object', function(done) {
            theObject = null;
            var result = GPT.newSizeMappingFunction(theObject, obj.originalFunction);
            should.not.exist(result);
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.false;
            UTIL.log.calledOnce.should.be.true;
            UTIL.log.calledWith("newSizeMappingFunction: originalFunction is not a function").should.be.true;
            done();
        });

        it('should return null when impropper parameters passed, non function', function(done) {
            obj.originalFunction = null
            var result = GPT.newSizeMappingFunction(theObject, obj.originalFunction);
            should.not.exist(result);
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.true;
            UTIL.log.calledOnce.should.be.true;
            UTIL.log.calledWith("newSizeMappingFunction: originalFunction is not a function").should.be.true;
            done();
        });

        it('should return a function when propper parameters are passed', function(done) {
            GPT.newSizeMappingFunction(theObject, obj.originalFunction).should.be.a('function');
            UTIL.isObject.calledOnce.should.be.true;
            UTIL.isFunction.calledOnce.should.be.true;
            done();
        });

        it('should have called originalFunction when returned function is invoked', function (done) {
            var returnedFn = GPT.newSizeMappingFunction(theObject, obj.originalFunction);
            returnedFn();
            obj.originalFunction.apply.called.should.be.true;
            done();
        });
    });

    describe("#addHookOnSlotDefineSizeMapping", function() {
        var googleTagStub = null;
        var definedSlotS1 = null;

        beforeEach(function(done) {
            definedSlotS1 = {
                "/Harshad": {
                    sizes: [
                        [728, 90]
                    ],
                    id: "Harshad-02051986"
                }
            };
            googleTagStub = {
                defineSlot: function() {
                    return definedSlotS1;
                },
                destroySlots: function() {
                    return {};
                }
            };
            sinon.spy(googleTagStub, "defineSlot");
            sinon.spy(googleTagStub, "destroySlots");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "addHookOnFunction");
            done();
        });

        afterEach(function(done) {
            if (googleTagStub) {
                if (googleTagStub.defineSlot) {
                    googleTagStub.defineSlot.restore();
                }
                if (googleTagStub.destroySlots) {
                    googleTagStub.destroySlots.restore();
                }
            }


            UTIL.isFunction.restore();
            UTIL.isObject.restore();
            UTIL.addHookOnFunction.restore();

            googleTagStub = null;

            done();
        });

        it("is a function", function(done) {
            GPT.addHookOnSlotDefineSizeMapping.should.be.a("function");
            done();
        });

        it("returns false if passed in googletag is not and object", function(done) {
            googleTagStub = null;
            GPT.addHookOnSlotDefineSizeMapping(googleTagStub).should.equal(false);
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.false;
            done();
        });

        it("returns false if passed in googletag does not have defineSlot method", function(done) {
            delete googleTagStub.defineSlot;
            GPT.addHookOnSlotDefineSizeMapping(googleTagStub).should.equal(false);
            UTIL.isObject.called.should.be.true;
            UTIL.isFunction.called.should.be.true;
            done();
        });

        it("should return true when proper google object is passed", function(done) {
            GPT.addHookOnSlotDefineSizeMapping(googleTagStub).should.equal(true);
            done();
        });

        it("on passing proper googletag object should have called util.addHookOnFunction", function(done) {
            GPT.addHookOnSlotDefineSizeMapping(googleTagStub).should.equal(true);

            UTIL.addHookOnFunction.calledWith(definedSlotS1, true, "defineSizeMapping", GPT.newSizeMappingFunction).should.equal(true);

            googleTagStub.defineSlot.calledWith("/Harshad", [
                [728, 90]
            ], "Harshad-02051986").should.equal(true);

            googleTagStub.destroySlots.calledWith([definedSlotS1]).should.equal(true);

            done();
        });
    });

    describe("#addHooks", function() {
        var winObj = null;
        var winObjBad = null;
        beforeEach(function(done) {
            winObj = {
                googletag: {
                    pubads: function() {
                        return {};
                    }
                }
            };

            winObjBad = {
                googletag: {
                    pubads: function() {
                        return null;
                    }
                }
            };
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "addHookOnFunction");

            sinon.spy(GPT, "addHookOnSlotDefineSizeMapping");
            sinon.spy(GPT, "newAddHookOnGoogletagDisplay");
            done();
        });

        afterEach(function(done) {
            winObj = null;
            winObjBad = null;

            UTIL.addHookOnFunction.restore();
            UTIL.isObject.restore();
            UTIL.isFunction.restore();

            GPT.addHookOnSlotDefineSizeMapping.restore();
            GPT.newAddHookOnGoogletagDisplay.restore();
            done();
        });

        it("is a function", function(done) {
            GPT.addHooks.should.be.a("function");
            done();
        });

        it("returns false if passed in window object is not an object", function(done) {
            GPT.addHooks(null).should.equal(false);

            GPT.addHookOnSlotDefineSizeMapping.called.should.be.false;
            GPT.newAddHookOnGoogletagDisplay.called.should.be.false;
            UTIL.addHookOnFunction.called.should.be.false;
            UTIL.isObject.called.should.be.true;
            UTIL.isObject.calledOnce.should.be.true;
            UTIL.isFunction.called.should.be.false;
            done();
        });

        it("returns false if passed in window object is an object but doesnt have required structure and methods", function(done) {
            GPT.addHooks({googletag : {}}).should.equal(false);

            GPT.addHookOnSlotDefineSizeMapping.called.should.be.false;
            GPT.newAddHookOnGoogletagDisplay.called.should.be.false;
            UTIL.addHookOnFunction.called.should.be.false;
            UTIL.isObject.called.should.be.true;
            UTIL.isObject.calledTwice.should.be.true;
            UTIL.isFunction.called.should.be.true;
            UTIL.isFunction.returned(false).should.be.true;
            done();
        });

        it("returns false if googletag.pubads returns a non object value ", function(done) {
            GPT.addHooks(winObjBad).should.equal(false);

            UTIL.isObject.calledThrice.should.be.true;
            UTIL.isFunction.calledOnce.should.be.true;

            GPT.addHookOnSlotDefineSizeMapping.called.should.be.false;
            GPT.newAddHookOnGoogletagDisplay.called.should.be.false;
            UTIL.addHookOnFunction.called.should.be.false;
            done();
        });


        it("returns true if proper window object is passed with required structure", function(done) {
            GPT.addHooks(winObj).should.equal(true);
            done();
        });

        it("on passing proper window object with required structure should have called util.addHookOnFunction for various googletag pubads object methods", function(done) {
            GPT.addHooks(winObj).should.equal(true);

            GPT.addHookOnSlotDefineSizeMapping.calledOnce.should.equal(true);
            GPT.addHookOnSlotDefineSizeMapping.calledWith(winObj.googletag).should.equal(true);

            UTIL.addHookOnFunction.calledWith(winObj.googletag.pubads(), false, "disableInitialLoad", GPT.newDisableInitialLoadFunction).should.equal(true);
            UTIL.addHookOnFunction.calledWith(winObj.googletag.pubads(), false, "enableSingleRequest", GPT.newEnableSingleRequestFunction).should.equal(true);

            GPT.newAddHookOnGoogletagDisplay.calledOnce.should.equal(true);
            GPT.newAddHookOnGoogletagDisplay.calledWith(winObj.googletag).should.equal(true);

            UTIL.addHookOnFunction.calledWith(winObj.googletag.pubads(), false, "refresh", GPT.newRefreshFuncton).should.equal(true);
            UTIL.addHookOnFunction.calledWith(winObj.googletag.pubads(), false, "setTargeting", GPT.newSetTargetingFunction).should.equal(true);
            UTIL.addHookOnFunction.calledWith(winObj.googletag, false, "destroySlots", GPT.newDestroySlotsFunction).should.equal(true);

            done();
        });
    });

    describe("#defineGPTVariables", function() {
        var windowObj = null;

        beforeEach(function (done) {
            sinon.spy(UTIL, "isObject");
            windowObj = {
                googletag: {
                    cmd: []
                }
            };
            done();
        });


        afterEach(function (done) {
            UTIL.isObject.restore();
            windowObj = null;
            done();
        });

        it("should return false when the invalid window object is passed", function(done) {
            GPT.defineGPTVariables(null).should.equal(false);
            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(false).should.be.true;
            done();
        });

        it("should return true when the object passed is valid", function(done) {
            windowObj = {};
            GPT.defineGPTVariables(windowObj).should.equal(true);
            UTIL.isObject(windowObj.googletag);
            UTIL.isArray(windowObj.googletag.cmd);
            done();
        });

        it("should return true when the googletag.cmd is already defined", function(done) {
            GPT.defineGPTVariables(windowObj).should.equal(true);
            UTIL.isObject(windowObj.googletag);
            UTIL.isArray(windowObj.googletag.cmd);
            done();
        });

        it("should create googletag.cmd as empty array if not present", function(done) {
            delete windowObj.googletag.cmd;
            GPT.defineGPTVariables(windowObj).should.equal(true);
            UTIL.isArray(windowObj.googletag.cmd);
            windowObj.googletag.cmd.length.should.equal(0);
            done();
        });

        it("should create googletag as empty object if not present", function(done) {
            windowObj = {};
            GPT.defineGPTVariables(windowObj).should.equal(true);
            UTIL.isObject(windowObj.googletag);
            done();
        });
    });

    describe("#addHooksIfPossible", function() {
        var winObj = null;

        beforeEach(function(done) {
            sinon.spy(UTIL, "isUndefined");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isArray");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "log");

            winObj = {
                googletag: {
                    cmd: []
                }
            }
            done();
        });

        afterEach(function(done) {
            UTIL.isUndefined.restore();
            UTIL.isObject.restore();
            UTIL.isArray.restore();
            UTIL.isFunction.restore();
            UTIL.log.restore();
            done();
        });

        it("is a function", function(done) {
            GPT.addHooksIfPossible.should.be.a("function");
            done();
        });

        it("return false if passed in window object is impropper and should have called util.log", function(done) {
            winObj.google_onload_fired = true;
            GPT.addHooksIfPossible(winObj).should.equal(false);
            UTIL.log.calledOnce.should.equal(true);
            UTIL.log.calledWith("Failed to load before GPT").should.be.true;

            UTIL.isUndefined.calledOnce.should.equal(true);
            UTIL.isObject.calledOnce.should.be.false;
            done();
        });

        it("return false if passed in window object is impropper and should have called util.log", function(done) {
            delete winObj.googletag;
            GPT.addHooksIfPossible(winObj).should.equal(false);
            UTIL.log.calledOnce.should.equal(true);
            UTIL.log.calledWith("Failed to load before GPT").should.be.true;

            UTIL.isUndefined.calledOnce.should.equal(true);
            UTIL.isObject.calledOnce.should.equal(true);
            done();
        });


        it("return false if passed in window object is impropper and should have called util.log", function(done) {
            delete winObj.googletag.cmd;
            GPT.addHooksIfPossible(winObj).should.equal(false);
            UTIL.log.calledOnce.should.equal(true);
            UTIL.log.calledWith("Failed to load before GPT").should.be.true;

            UTIL.isUndefined.calledOnce.should.equal(true);
            UTIL.isObject.calledOnce.should.equal(true);
            done();
        });

        it("return true if passed window object with required props and should have called util.log", function(done) {
            GPT.addHooksIfPossible(winObj).should.equal(true);
            UTIL.log.calledOnce.should.equal(true);
            UTIL.log.calledWith("Succeeded to load before GPT").should.be.true;
            done();
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

    describe("#init", function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "isObject");
            sinon.spy(GPT, "setWindowReference");
            sinon.spy(GPT, "defineWrapperTargetingKeys");
            sinon.spy(GPT, "defineGPTVariables");
            sinon.spy(AM, "registerAdapters");
            sinon.spy(GPT, "addHooksIfPossible");
            sinon.spy(GPT, "callJsLoadedIfRequired");
            sinon.spy(GPT, "initSafeFrameListener");
            done();
        });

        afterEach(function(done) {
            UTIL.isObject.restore();
            GPT.setWindowReference.restore();
            GPT.defineWrapperTargetingKeys.restore();
            GPT.defineGPTVariables.restore();
            AM.registerAdapters.restore();
            GPT.addHooksIfPossible.restore();
            GPT.callJsLoadedIfRequired.restore();
            GPT.initSafeFrameListener.restore();
            done();
        });

        it("should return false when window object is null", function(done) {
            GPT.init(null).should.equal(false);
            done();
        });

        it("should have called respective internal functions ", function(done) {
            window.PWT = {};
            GPT.init(window).should.equal(true);

            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(true).should.to.be.true;

            GPT.setWindowReference.called.should.be.true;
            GPT.defineWrapperTargetingKeys.called.should.be.true;
            GPT.defineGPTVariables.called.should.be.true;
            AM.registerAdapters.called.should.be.true;
            GPT.addHooksIfPossible.called.should.be.true;
            GPT.callJsLoadedIfRequired.called.should.be.true;
            done();
        });

        it('should not proceed if passed window object is invalid', function (done) {
            GPT.init("NonObject").should.be.false;

            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(false).should.be.true;

            UTIL.isObject.calledWith("NonObject").should.be.true;
            GPT.setWindowReference.called.should.be.false;
            GPT.defineWrapperTargetingKeys.called.should.be.false;
            GPT.defineGPTVariables.called.should.be.false;
            AM.registerAdapters.called.should.be.false;
            GPT.addHooksIfPossible.called.should.be.false;
            GPT.callJsLoadedIfRequired.called.should.be.false;
            done();
        });
    });

    describe('#getSizeFromSizeMapping', function() {
        var divID = null,
            slotSizeMapping = null;
        var sizeMapping = null;

        beforeEach(function(done) {
            divID = commonDivID;
            sizeMapping = [
                [340, 210],
                [1024, 768]
            ]
            slotSizeMapping = sizeMapping;
            sinon.stub(UTIL, "isOwnProperty");
            sinon.stub(UTIL, "getScreenWidth");
            sinon.stub(UTIL, "getScreenHeight");
            sinon.stub(UTIL, "isArray");
            sinon.stub(UTIL, "isNumber");
            sinon.stub(UTIL, "log");

            sinon.stub(GPT, "getWindowReference");
            GPT.getWindowReference.returns(true);
            done();
        });

        afterEach(function(done) {

            UTIL.isOwnProperty.restore();
            UTIL.getScreenWidth.restore();
            UTIL.getScreenHeight.restore();
            UTIL.isArray.restore();
            UTIL.isNumber.restore();
            UTIL.log.restore();

            GPT.getWindowReference.restore();
            done();
        });

        it('is a function', function(done) {
            GPT.getSizeFromSizeMapping.should.be.a('function');
            done();
        });

        it('returns false if given divID is not in give slotSizeMapping', function(done) {
            UTIL.isOwnProperty.returns(false);
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.false;
            done();
        });

        it('returns false if sizeMapping for given divID is not an array', function(done) {
            UTIL.isOwnProperty.returns(true);
            UTIL.isArray.withArgs(sizeMapping).returns(false);
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.false;
            done();
        });
    });
});
