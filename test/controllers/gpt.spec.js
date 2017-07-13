/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;
var GPT = require("../../src_new/controllers/gpt.js");
var UTIL = require("../../src_new/util.js");
var AM = require("../../src_new/adapterManager.js");

var commonDivID = "DIV_1";

describe("CONTROLLER: GPT", function() {

    describe("#getAdUnitIndex()", function() {

        it("should return 0 when the object passed is null ", function() {
            GPT.getAdUnitIndex(null).should.equal(0);
        });

        it("should return 0 when the object passed is number ", function() {
            GPT.getAdUnitIndex(0).should.equal(0);
        });

        it("should return 0 when the object passed is empty string ", function() {
            GPT.getAdUnitIndex("").should.equal(0);
        });

        it("should return 0 when the object passed is not empty string ", function() {
            GPT.getAdUnitIndex("abcd").should.equal(0);
        });

        it("should return 0 when the object passed does not have required method ", function() {
            GPT.getAdUnitIndex({}).should.equal(0);
        });

        var random = Math.floor(Math.random() * 100);
        var test = {
            getSlotId: function() {
                return this;
            },
            getId: function() {
                return "abcd_" + random;
            }
        };

        it("should return " + random + " when the object passed does have required method ", function() {
            GPT.getAdUnitIndex(test).should.equal(random);
        });

    });

    describe("#callJsLoadedIfRequired()", function() {

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

    describe("#defineGPTVariables()", function() {
        it("should return false when the null is passed", function() {
            GPT.defineGPTVariables(null).should.equal(false);
        });

        var x = {};
        it("should return true when the object passed is valid", function() {
            GPT.defineGPTVariables(x).should.equal(true);
            UTIL.isObject(x.googletag);
            UTIL.isArray(x.googletag.cmd);
        });

        var x = {
            googletag: {
                cmd: [1, 2, 3]
            }
        };
        it("should return true when the googletag.cmd is already defined", function() {
            GPT.defineGPTVariables(x).should.equal(true);
            UTIL.isObject(x.googletag);
            UTIL.isArray(x.googletag.cmd);
            x.googletag.cmd.length.should.equal(3);
        });

        var winObj = {
            googletag: {

            }
        };
        it("should create googletag.cmd as empty array if not present", function(done) {
            GPT.defineGPTVariables(winObj).should.equal(true);
            UTIL.isArray(winObj.googletag.cmd);
            winObj.googletag.cmd.length.should.equal(0);
            done();
        });

        var winObj1 = {};
        it("should create googletag as empty object if not present", function(done) {
            GPT.defineGPTVariables(winObj1).should.equal(true);
            UTIL.isObject(winObj.googletag);
            done();
        });
    });

    describe("#setWindowReference()", function() {

        it("should not set WindowReference if argument is not object", function() {
            GPT.setWindowReference(0);
            expect(GPT.getWindowReference() === null).to.equal(true);
        });

        it("should set WindowReference if argument is object", function() {
            var x = { a: 0 };
            GPT.setWindowReference(x);
            var y = GPT.getWindowReference();
            expect(UTIL.isOwnProperty(y, "a") && y.a === x.a).to.equal(true);
        });
    });

    describe("#init()", function() {

        it("should return false when window object is null", function() {
            GPT.init(null).should.equal(false);
        });

        it("should return true when the required window object is passed", function() {
            GPT.init({}).should.equal(true);
        });

        describe("When window object with required props are passed", function() {

            before(function(done) {
                sinon.stub(UTIL, "isObject",
                    function() {
                        return true;
                    });
                sinon.stub(GPT, "setWindowReference");
                sinon.stub(GPT, "defineWrapperTargetingKeys");
                sinon.stub(GPT, "defineGPTVariables");
                sinon.stub(AM, "registerAdapters");
                sinon.stub(GPT, "addHooksIfPossible");
                sinon.stub(GPT, "callJsLoadedIfRequired");
                done();
            });

            after(function(done) {
                UTIL.isObject.restore();
                GPT.setWindowReference.restore();
                GPT.defineWrapperTargetingKeys.restore();
                GPT.defineGPTVariables.restore();
                AM.registerAdapters.restore();
                GPT.addHooksIfPossible.restore();
                GPT.callJsLoadedIfRequired.restore();
                done();
            });

            it("should have called respective internal functions ", function(done) {

                GPT.init({
                    PWT: {
                        jsLoaded: function() {

                        }
                    }
                });

                console.log("UTIL.isObject.calledOnce ==>", UTIL.isObject.callCount);

                UTIL.isObject.called.should.equal(true);
                GPT.setWindowReference.calledOnce.should.equal(true);
                GPT.defineWrapperTargetingKeys.calledOnce.should.equal(true);
                GPT.defineGPTVariables.calledOnce.should.equal(true);
                AM.registerAdapters.calledOnce.should.equal(true);
                GPT.addHooksIfPossible.calledOnce.should.equal(true);
                GPT.callJsLoadedIfRequired.calledOnce.should.equal(true);
                done();
            });
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

            it("should return object with values as keys and respective value should be empty strings", function(done) {
                GPT.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
                done();
            });

            it("should have called util.forEachOnObject", function(done) {
                GPT.defineWrapperTargetingKeys(inputObject); //.should.deep.equal(outputObject);
                // console.log("UTIL.forEachOnObject.calledTwice ==>", UTIL.forEachOnObject.calledOnce);
                UTIL.forEachOnObject.calledOnce.should.equal(true);
                // expect(UTIL.forEachOnObject.calledTwice, true);
                done();
            });
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
            // console.log("UTIL.isFunction.called ==>", UTIL.isFunction.called);
            UTIL.isFunction.calledTwice.should.equal(true);
            done();
        });

        it("should have returned Dom Id as generated Slot name if propper googleSlot object is passed", function(done) {
            GPT.generateSlotName(googleSlotObject).should.equal(domId);
            done();
        });
    });

    describe("#defineWrapperTargetingKey()", function() {

        it("is a function", function(done) {
            GPT.defineWrapperTargetingKey.should.be.a("function");
            done();
        });

        it("set wrapper Targeting Key's value to empty string", function(done) {
            GPT.defineWrapperTargetingKey("DIV_1");
            // var x = GPT.wrapperTargetingKeys;
            // console.log("GPT.wrapperTargetingKeys ==>", GPT.wrapperTargetingKeys, x);
            GPT.wrapperTargetingKeys["DIV_1"].should.equal("");
            done();
        });


        it("initialize wrapperTargetingKeys if its not been initialized", function(done) {
            GPT.def;
            done();
        });
    });

    describe("#addHooksIfPossible()", function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "isUndefined");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isArray");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "log");
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
            GPT.addHooksIfPossible({}).should.equal(false);
            UTIL.log.calledOnce.should.equal(true);
            UTIL.log.calledWith("Failed to load before GPT").should.be.true;

            UTIL.isUndefined.calledOnce.should.equal(true);
            UTIL.isObject.calledOnce.should.equal(true);
            // UTIL.isArray.calledOnce.should.equal(true);
            // UTIL.isFunction.calledOnce.should.equal(true);

            done();
        });

        var winObj = {
            googletag: {
                cmd: []
            }
        };
        it("return true if passed window object with required props and should have called util.log", function(done) {
            GPT.addHooksIfPossible(winObj).should.equal(true);
            UTIL.log.calledOnce.should.equal(true);
            UTIL.log.calledWith("Succeeded to load before GPT").should.be.true;
            done();
        });
    });


    describe("#addHooks()", function() {
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

            sinon.spy(UTIL, "addHookOnFunction");
            sinon.spy(GPT, "addHookOnSlotDefineSizeMapping");
            sinon.spy(GPT, "newAddHookOnGoogletagDisplay");
            done();
        });

        afterEach(function(done) {
            winObj = null;
            winObjBad = null;
            UTIL.addHookOnFunction.restore();
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
            done();
        });

        it("returns false if googletag.pubads returns a non object value ", function(done) {
            GPT.addHooks(winObjBad).should.equal(false);
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

    describe("#addHookOnSlotDefineSizeMapping()", function() {


        var googleTag = null;
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
            googleTag = {
                defineSlot: function() {
                    return definedSlotS1;
                },
                destroySlots: function() {
                    return {};
                }
            };
            sinon.spy(googleTag, "defineSlot");
            sinon.spy(googleTag, "destroySlots");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "addHookOnFunction");
            done();
        });

        afterEach(function(done) {
            googleTag.defineSlot.restore();
            googleTag.destroySlots.restore();

            UTIL.isFunction.restore();
            UTIL.isObject.restore();
            UTIL.addHookOnFunction.restore();

            googleTag = null;

            done();
        });

        it("is a function", function(done) {
            GPT.addHookOnSlotDefineSizeMapping.should.be.a("function");
            done();
        });

        it("returns false if passed in googletag is not and object", function(done) {
            GPT.addHookOnSlotDefineSizeMapping(null).should.equal(false);
            done();
        });

        it("should return true when proper googleTag object is passed", function(done) {
            GPT.addHookOnSlotDefineSizeMapping(googleTag).should.equal(true);
            done();
        });

        it("on passing proper googleTag object should have called util.addHookOnFunction", function(done) {
            GPT.addHookOnSlotDefineSizeMapping(googleTag).should.equal(true);

            UTIL.addHookOnFunction.calledWith(definedSlotS1, true, "defineSizeMapping", GPT.newSizeMappingFunction).should.equal(true);

            googleTag.defineSlot.calledWith("/Harshad", [
                [728, 90]
            ], "Harshad-02051986").should.equal(true);

            googleTag.destroySlots.calledWith([definedSlotS1]).should.equal(true);

            done();
        });
    });

    describe('#getAdSlotSizesArray()', function () {
        var divID = null;
        var currentGoogleSlots = null;
        var sizeObj_1 = null;
        var sizeObj_2 = null;
    	beforeEach(function (done) {
            divID = commonDivID;
            sizeObj_1 = {
                getWidth: function () {
                    return 1024;
                },
                getHeight: function () {
                    return 768;
                }
            };

            sizeObj_2 = {
                getWidth: function () {
                    return 640;
                },
                getHeight: function () {
                    return 480;
                }
            };
            currentGoogleSlots = {
                getSizes: function () {
                    return [sizeObj_1, sizeObj_2];
                }
            };

            sinon.spy(currentGoogleSlots, 'getSizes');
            sinon.spy(sizeObj_1, 'getHeight');
            sinon.spy(sizeObj_1, 'getWidth');
            sinon.spy(sizeObj_2, 'getHeight');
            sinon.spy(sizeObj_2, 'getWidth');

            sinon.stub(GPT, 'getSizeFromSizeMapping');
            GPT.getSizeFromSizeMapping.returns(true);
            sinon.stub(UTIL, 'log');
            sinon.stub(UTIL, 'isFunction');
            UTIL.isFunction.returns(true);
            sinon.spy(UTIL, 'forEachOnArray');
    		done();
    	});	

    	afterEach(function (done) {
            GPT.getSizeFromSizeMapping.restore();
            UTIL.log.restore();
            UTIL.isFunction.restore();
            UTIL.forEachOnArray.restore();

            currentGoogleSlots.getSizes.restore();
            sizeObj_1.getHeight.restore();
            sizeObj_1.getWidth.restore();
            sizeObj_2.getHeight.restore();
            sizeObj_2.getWidth.restore();

            sizeObj_1 = null;
            sizeObj_2 = null;
            currentGoogleSlots = null;
    		done();
    	});	


    	it('is a function', function (done) {
    		GPT.getAdSlotSizesArray.should.be.a('function');
    		done();
    	});
    	
        it('should have called getSizeFromSizeMapping', function (done) {
            GPT.getAdSlotSizesArray(divID, currentGoogleSlots).should.be.true;
            UTIL.log.calledWith(divID + ": responsiveSizeMapping applied: ");
            UTIL.log.calledWith(true);
            done();
        });

        it('should have created adSlotSizesArray when proper currentGoogleSlots is passed ', function (done) {
            GPT.getSizeFromSizeMapping.restore();
            sinon.stub(GPT, 'getSizeFromSizeMapping');
            GPT.getSizeFromSizeMapping.returns(false);
            GPT.getAdSlotSizesArray(divID, currentGoogleSlots).should.be.a('array');
            UTIL.isFunction.called.should.be.true;
            UTIL.forEachOnArray.called.should.be.true;
            
            currentGoogleSlots.getSizes.called.should.be.true;
            sizeObj_1.getHeight.called.should.be.true;
            sizeObj_1.getWidth.called.should.be.true;
            sizeObj_2.getHeight.called.should.be.true;
            sizeObj_2.getWidth.called.should.be.true;

            done();
        });
    });

    xdescribe('#getSizeFromSizeMapping', function () {
        var divID = null;
        var slotSizeMapping = null;
        var screenWidth = 1024;
        var screenHeight = 768;
        beforeEach(function (done) {
            divID = commonDivID;
            slotSizeMapping = {};
            slotSizeMapping[divID] = [];
            sinon.spy(UTIL, 'isOwnProperty');

            sinon.stub(UTIL, 'getScreenWidth');
            UTIL.getScreenWidth.returns(screenWidth);

            sinon.stub(UTIL, 'getScreenHeight');
            UTIL.getScreenHeight.returns(screenHeight);

            sinon.stub(UTIL, 'isArray');
            sinon.stub(UTIL, 'isNumber');
            sinon.stub(UTIL, 'log');
            done();
        });

        afterEach(function (done) {
            divID = null;
            slotSizeMapping = null;
            UTIL.isOwnProperty.restore();
            UTIL.getScreenWidth.restore();
            UTIL.getScreenHeight.restore();
            UTIL.isArray.restore();
            UTIL.isNumber.restore();
            UTIL.log.restore();
            done();
        });

        it('is a function', function (done) {
            GPT.getSizeFromSizeMapping.should.be.a('function');
            done();
        });

        it('should return false when given divID not a property of slotSizeMapping passed', function (done) {
            delete slotSizeMapping[divID];
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.false;
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('should have logged sizeMapping and its details', function (done) {
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping);

            UTIL.log.calledWith(divID + ": responsiveSizeMapping found: screenWidth: " + screenWidth + ", screenHeight: " + screenHeight).should.be.true;
            UTIL.log.calledWith(slotSizeMapping[divID]).should.be.true;
            done();
        });

        it('should return false if sizeMapping is not and array', function (done) {
            slotSizeMapping[divID] = {};
            GPT.getSizeFromSizeMapping(divID, slotSizeMapping).should.be.false;
            UTIL.isArray.calledOnce.should.be.true;
            done();
        });


    });


    describe('#newDisplayFunction()', function () {

    	beforeEach(function (done) {
    		sinon.spy(UTIL, "log");
    		done();
    	});

    	afterEach(function (done) {
    		UTIL.log.restore();
    		done();
    	});

    	it('is a function', function (done) {
    		GPT.newDisplayFunction.should.be.a('function');
    		done();
    	});

    	it('should return null when impropper parameters are passed', function (done) {
    		// TODO : finf better approach to check for null in chai
    		var result = GPT.newDisplayFunction(null, function(){ console.log("inside function")});
    		// console.log(" result ==>", result);
    		should.not.exist(result);
    		UTIL.log.calledOnce.should.equal(true);
    		UTIL.log.calledWith("display: originalFunction is not a function").should.be.true;
    		done();
    	});

    	it('should return function when proper parameters are passed', function (done) {
    		GPT.newDisplayFunction({}, function () { console.log("inside function")}).should.be.a('function');
    		// console.log("updateSlotsMapFromGoogleSlots ==>", GPT.updateSlotsMapFromGoogleSlots.callCount);
    		done();
    	});

    });

    describe('#newSizeMappingFunction', function () {

    	beforeEach(function (done) {
    		sinon.spy(UTIL, "log");
    		sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
    		done();
    	});

    	afterEach(function (done) {
    		UTIL.log.restore();
    		UTIL.isObject.restore();
    		UTIL.isFunction.restore();
    		done();
    	});


    	it('is a function', function (done) {
    		GPT.newSizeMappingFunction.should.be.a('function');
    		done();
    	});

    	it('should return null when impropper parameters passed', function (done) {
    		var result = GPT.newSizeMappingFunction(null, {});
    		should.not.exist(result);
    		UTIL.log.calledOnce.should.be.true;
    		UTIL.log.calledWith("newSizeMappingFunction: originalFunction is not a function").should.be.true;
    		done();
    	});

    	it('should return a function when propper parameters are passed', function (done) {
    		GPT.newSizeMappingFunction({}, function () {
    			console.log("inside function");
    		}).should.be.a('function');
    		UTIL.isObject.calledOnce.should.be.true;
    		UTIL.isFunction.calledOnce.should.be.true;
    		done();
    	});
    });

    describe('#newRefreshFuncton', function () {

    	beforeEach(function (done) {
    		sinon.spy(UTIL, "log");
    		sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
    		done();
    	});

    	afterEach(function (done) {
    		UTIL.log.restore();
    		UTIL.isObject.restore();
    		UTIL.isFunction.restore();
    		done();
    	});


    	it('is a function', function (done) {
    		GPT.newRefreshFuncton.should.be.a('function');
    		done();
    	});

    	it('should return null when impropper parameters passed', function (done) {
    		var result = GPT.newRefreshFuncton(null, {});
    		should.not.exist(result);
    		UTIL.log.calledOnce.should.be.true;
    		UTIL.log.calledWith("refresh: originalFunction is not a function").should.be.true;
    		done();
    	});

    	it('should return a function when propper parameters are passed', function (done) {
    		GPT.newRefreshFuncton({}, function () {
    			console.log("inside function");
    		}).should.be.a('function');
    		UTIL.isObject.calledOnce.should.be.true;
    		UTIL.isFunction.calledOnce.should.be.true;
    		done();
    	});
    });

    describe('#getQualifyingSlotNamesForRefresh', function () {
        var arg = null;
        var theObject = null;

        beforeEach(function (done) {
            arg = [];
            theObject = {
                getSlots: function () {
                    return ["slot_1", "slot_2"];
                }
            };
            sinon.spy(UTIL, "forEachOnArray");
            sinon.stub(GPT, "generateSlotName");
            sinon.spy(theObject, "getSlots");
            GPT.generateSlotName.returns("qualifying_slot_name");
            done();
        });

        afterEach(function (done) {
            UTIL.forEachOnArray.restore();
            GPT.generateSlotName.restore();
            theObject.getSlots.restore();
            theObject = null;
            arg = null;
            done();
        });

        it('is a function', function (done) {
            GPT.getQualifyingSlotNamesForRefresh.should.be.a('function');
            done();
        });

        it('should return an array', function (done) {
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject).should.be.a('array');
            done();
        });

        it('should have called GPT.generateSlotName and UTIL.forEachOnArray', function (done) {
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject);
            GPT.generateSlotName.called.should.be.true;
            UTIL.forEachOnArray.called.should.be.true;
            UTIL.forEachOnArray.calledWith(theObject.getSlots()).should.be.true;
            done();
        });

        it('should consider passed arg if its not empty instead of slots from the object being passed', function (done) {
            arg = [["slot_1", "slot_2"]];
            GPT.getQualifyingSlotNamesForRefresh(arg, theObject);
            UTIL.forEachOnArray.calledWith(arg[0]).should.be.true;
            done();
        });
    });


    describe('#callOriginalRefeshFunction', function () {
        var flag = null;
        var theObject = null;
        var obj = null;
        // var originalFunction = null;
        var arg = null;

        beforeEach(function (done) {
            flag = true
            theObject = {} 
            
            obj = {
                originalFunction: function (theObject, arg) {
                    return "originalFunction";
                }
            };
            // obj.originalFunction = originalFunction;
            sinon.spy(obj.originalFunction, 'apply');
            sinon.spy(UTIL, "log");
            arg = [["slot_1", "slot_2"]];
            done();
        });

        afterEach(function (done) {
            obj.originalFunction.apply.restore();
            UTIL.log.restore();
            flag = null;
            theObject = null;
            obj.originalFunction = null;
            obj = null;
            arg = null;
            done();
        }); 

        it('is a function', function (done) {
            GPT.callOriginalRefeshFunction.should.be.a('function');
            done();
        });

        it('should have logged if the ad has been already rendered ', function (done) {
            flag = false;
            GPT.callOriginalRefeshFunction(flag, theObject, obj.originalFunction, arg);
            UTIL.log.calledWith("AdSlot already rendered").should.be.true;
            done();
        });

        it('should have logged while calling the passed originalFunction with passed arguments', function (done) {
            GPT.callOriginalRefeshFunction(flag, theObject, obj.originalFunction, arg);
            obj.originalFunction.apply.calledWith(theObject, arg).should.be.true;
            UTIL.log.calledWith("Calling original refresh function from CONFIG.getTimeout()").should.be.true;
            done();
        });
    });
});
