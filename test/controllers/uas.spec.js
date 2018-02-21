/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var UAS = require("../../src_new/controllers/uas.js");
var UTIL = require("../../src_new/util.js");
var AM = require("../../src_new/adapterManager.js");
var CONSTANTS = require("../../src_new/constants.js");
var CONFIG = require("../../src_new/config.js");
var BM = require("../../src_new/bidManager.js");
var SLOT = require("../../src_new/slot.js");

var commonDivID = "DIV_1";

describe("CONTROLLER: UAS", function() {

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
            UAS.setWindowReference(nonObject);
            expect(UAS.getWindowReference() === null).to.equal(true);
            UTIL.isObject.returned(false).should.be.true;
            UTIL.isObject.calledOnce.should.be.true;
            done();
        });

        it("should set WindowReference if argument is object", function(done) {
            UAS.setWindowReference(window);
            UAS.getWindowReference().should.be.deep.equal(window);
            UTIL.isObject.calledOnce.should.be.true;
            UTIL.isObject.returned(true).should.be.true;
            done();
        });
    });

    describe('#getWindowReference', function () {
        it('is a function', function (done) {
            UAS.getWindowReference.should.be.a('function');
            done();
        });

        it('should return the window object reference', function (done) {
            UAS.setWindowReference(window);
            UAS.getWindowReference().should.deep.equal(window);
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
            UAS.setDisplayFunctionCalledIfRequired.should.be.a('function');
            done();
        });

        it('should have called setDisplayFunctionCalled and setArguments if given arguments are proper ', function(done) {
            UAS.setDisplayFunctionCalledIfRequired(slot, arg);
            UTIL.isObject.calledWith(slot).should.be.true;
            UTIL.isFunction.calledWith(slot.getDivID).should.be.true;
            UTIL.isArray.calledWith(arg).should.be.true;
            slot.getDivID.called.should.be.true;
            slot.setDisplayFunctionCalled.calledWith(true).should.be.true;
            slot.setArguments.calledWith(arg).should.be.true;
            done();
        });


        it('should not proceed if given slot is not an object', function (done) {
            UAS.setDisplayFunctionCalledIfRequired(null, arg);
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
            UAS.setDisplayFunctionCalledIfRequired(slot, arg);
            UTIL.isObject.calledWith(slot).should.be.true;
            UTIL.isFunction.calledWith(slot.getDivID).should.be.true;
            UTIL.isArray.calledWith(arg).should.be.false;
            slot.setDisplayFunctionCalled.calledWith(true).should.be.false;
            slot.setArguments.calledWith(arg).should.be.false;
            done();
        });

    });

    describe('#storeInSlotsMap', function() {
        var dmSlotName = null, currentPhoenixSlotStub = null, isDisplayFlow = null;
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

            currentPhoenixSlotStub = {
                getTargetingKeys: function () {
                    return [ "k1", "k2"];
                },
                getTargeting: function (key) {
                    return "v1";
                },
                getAdUnit: function () {
                    return "DIV_1";
                },
                getSizes: function() {
                    return [sizeObj_1, sizeObj_2];
                },
                getAdUnitPath: function () {
                    return "ad_unit_path";
                },
                getDimensions: function() {
                    return [sizeObj_1, sizeObj_2];
                },
            };

            sinon.stub(currentPhoenixSlotStub, "getTargeting")
                .withArgs("k1").returns("v1")
                .withArgs("k2").returns("v2");

            UAS.slotsMap[dmSlotName] = slotStub;
            sinon.spy(UAS.slotsMap[dmSlotName], "setSizes");
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

            currentPhoenixSlotStub.getTargeting.restore();

            currentPhoenixSlotStub = null;

            if (UAS.slotsMap[dmSlotName].setSizes) {
                UAS.slotsMap[dmSlotName].setSizes.restore();
            }

            if (UAS.slotsMap[dmSlotName]) {

                delete UAS.slotsMap[dmSlotName];
            }

            isDisplayFlow = null;

            done();
        });


        it('is a function', function(done) {
            UAS.storeInSlotsMap.should.be.a('function');
            done();
        });

        it('should called proper methods to create and add slot for given dmSlotName in slotsMap, if not present already ', function (done) {
            delete UAS.slotsMap[dmSlotName];
            UAS.storeInSlotsMap(dmSlotName, currentPhoenixSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(false).should.be.true;
            slotStub.setDivID.calledWith(dmSlotName).should.be.true;
            slotStub.setPubAdServerObject.calledWith(currentPhoenixSlotStub).should.be.true;
            slotStub.setAdUnitID.called.should.be.true;
            slotStub.setAdUnitIndex.called.should.be.true;
            done();
        });

        it('should create and add slot for given dmSlotName in slotsMap, if not present already ', function (done) {
            delete UAS.slotsMap[dmSlotName];
            UAS.storeInSlotsMap(dmSlotName, currentPhoenixSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(false).should.be.true;
            slotStub.setDivID.calledWith(dmSlotName).should.be.true;
            slotStub.setPubAdServerObject.calledWith(currentPhoenixSlotStub).should.be.true;
            slotStub.setAdUnitID.called.should.be.true;
            slotStub.setAdUnitIndex.called.should.be.true;
            UAS.slotsMap[dmSlotName].should.deep.equal(slotStub);
            done();
        });

        it('should not set sizes on slot of given name if isDisplayFlow is true', function (done) {
            UAS.storeInSlotsMap(dmSlotName, currentPhoenixSlotStub, isDisplayFlow);
            UTIL.isOwnProperty.returned(true).should.be.true;
            UAS.slotsMap[dmSlotName].setSizes.called.should.be.false;
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

            sinon.stub(UAS, "findWinningBidAndApplyTargeting");
            UAS.findWinningBidAndApplyTargeting.returns(true);

            done();
        });

        afterEach(function(done) {
            UAS.findWinningBidAndApplyTargeting.restore();

            slot.getStatus.restore();

            key = null;
            slot = null;
            done();
        });

        it('is a function', function(done) {
            UAS.findWinningBidIfRequired_Display.should.be.a('function');
            done();
        });

        it('should not have called UAS.findWinningBidAndApplyTargeting if slot\'s status is either DISPLAYED or TARGETING_ADDED', function(done) {
            slot.getStatus.returns(CONSTANTS.SLOT_STATUS.DISPLAYED);
            UAS.findWinningBidIfRequired_Display(key, slot);
            UAS.findWinningBidAndApplyTargeting.called.should.be.false;
            slot.getStatus.called.should.be.true;
            done();
        });

        it('should not have called UAS.findWinningBidAndApplyTargeting if slot\'s status is either DISPLAYED or TARGETING_ADDED', function(done) {
            slot.getStatus.returns(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
            UAS.findWinningBidIfRequired_Display(key, slot);
            UAS.findWinningBidAndApplyTargeting.called.should.be.false;
            slot.getStatus.called.should.be.true;
            done();
        });

        it('should have called UAS.findWinningBidAndApplyTargeting if slot\'s status is neither DISPLAYED nor TARGETING_ADDED', function(done) {
            UAS.findWinningBidIfRequired_Display(key, slot);
            UAS.findWinningBidAndApplyTargeting.calledWith(key).should.be.true;
            slot.getStatus.called.should.be.true;
            done();
        });
    });

    describe('#getStatusOfSlotForDivId', function() {
        var divID = null;

        beforeEach(function(done) {
            divID = commonDivID;
            UAS.slotsMap[divID] = {
                getStatus: function() {
                    return CONSTANTS.SLOT_STATUS.TARGETING_ADDED;
                }
            };
            sinon.spy(UAS.slotsMap[divID], "getStatus");
            sinon.spy(UTIL, "isOwnProperty");
            done();
        });

        afterEach(function(done) {
            UAS.slotsMap[divID] = null;
            UTIL.isOwnProperty.restore();
            divID = null;
            done();
        });

        it('is a function', function(done) {
            UAS.getStatusOfSlotForDivId.should.be.a('function');
            done();
        });

        it('should return slot status by calling getStatus of the given slot if its present in slotMap', function(done) {
            UAS.getStatusOfSlotForDivId(divID).should.deep.equal(CONSTANTS.SLOT_STATUS.TARGETING_ADDED);
            UTIL.isOwnProperty.called.should.be.true;
            UAS.slotsMap[divID].getStatus.called.should.be.true;
            done();
        });

        it('should return slot status as DISPLAYED if given divID is not present in slotMap', function(done) {
            delete UAS.slotsMap[divID];
            UAS.getStatusOfSlotForDivId(divID).should.be.equal(CONSTANTS.SLOT_STATUS.DISPLAYED);
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

            UAS.slotsMap = {};
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

            UAS.slotsMap["slot_1"] = slotObject;
            UAS.slotsMap["slot_2"] = slotObject;
            UAS.slotsMap["slot_3"] = slotObject;

            done();
        });

        afterEach(function(done) {

            slotObject.setStatus.restore();
            slotObject.setRefreshFunctionCalled.restore();
            slotObject.setArguments.restore();

            UAS.slotsMap = null;

            UTIL.forEachOnArray.restore();
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters.should.be.a('function');
            done();
        });

        it('should not proceed if given slotNames are not present in slotsMap', function (done) {
            delete UAS.slotsMap["slot_1"];
            delete UAS.slotsMap["slot_2"];
            delete UAS.slotsMap["slot_3"];
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall);
            UTIL.isOwnProperty.alwaysReturned(false).should.be.true;
            done();
        });

        it('should set status of slot to PARTNERS_CALLED if given slot is present in slotsMap', function(done) {
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall);
            UTIL.forEachOnArray.calledWith(slotNames).should.be.true;
            UAS.slotsMap["slot_1"].getStatus().should.be.equal(CONSTANTS.SLOT_STATUS.PARTNERS_CALLED);
            done();
        });

        it('should not have called UAS.removeDMTargetingFromSlot and should not have called respective slot\'s setRefreshFunctionCalled and setArguments if isRefreshCall is false', function(done) {
            isRefreshCall = false;
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters(slotNames, argumentsFromCallingFunction, isRefreshCall);
            // UAS.removeDMTargetingFromSlot.called.should.be.false;
            UAS.slotsMap["slot_1"].setRefreshFunctionCalled.calledWith(true).should.be.false;
            UAS.slotsMap["slot_1"].setArguments.calledWith(argumentsFromCallingFunction).should.be.false;
            done();
        });
    });

    describe('#getSlotNamesByStatus', function() {
        var statusObject = null;
        var slot_1_Stub = null;
        var slot_2_Stub = null;

        beforeEach(function(done) {
            statusObject = CONSTANTS.SLOT_STATUS;
        //
        //     slot_1_Stub = {
        //         getStatus: function () {
        //             return "CREATED";
        //         }
        //     };
        //
        //     slot_2_Stub =  {
        //         getStatus: function () {
        //             return "NON_EXISITNG_STATUS";
        //         }
        //     };
        //
        //     UAS.slotsMap["DIV_1"] = slot_1_Stub;
        //     UAS.slotsMap["DIV_2"] = slot_2_Stub;
        //
        //     sinon.spy(UAS.slotsMap["DIV_1"], "getStatus");
        //     sinon.spy(UAS.slotsMap["DIV_2"], "getStatus");
            sinon.spy(UTIL, 'forEachOnObject');
            sinon.spy(UTIL, 'isOwnProperty');
            done();
        });

        afterEach(function(done) {
        //     UAS.slotsMap["DIV_1"] = null;
        //     UAS.slotsMap["DIV_2"] = null;
            UTIL.forEachOnObject.restore();
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            UAS.getSlotNamesByStatus.should.be.a('function');
            done();
        });

        it('should return array of slots', function(done) {
            UAS.getSlotNamesByStatus(statusObject).should.be.a('array');
            done();
        });

        // it('should have called UTIL functions and slot\'s getStatus', function(done) {
        //     UAS.getSlotNamesByStatus(statusObject);
        //
        //     UTIL.isOwnProperty.called.should.be.true;
        //     UTIL.forEachOnObject.called.should.be.true;
        //
        //     UAS.slotsMap["DIV_1"].getStatus.called.should.be.true;
        //     UAS.slotsMap["DIV_2"].getStatus.called.should.be.true;
        //     done();
        // });

        // it('should return array of keys from slotMap which match the status of given status object', function (done) {
        //     UAS.getSlotNamesByStatus(statusObject).should.be.an('array');
        //     UAS.getSlotNamesByStatus(statusObject).should.be.deep.equal(["DIV_1"]);
        //     done();
        // });

        it('should return empty array if slotsMap is empty', function (done) {
            UAS.slotsMap = {};
            UAS.getSlotNamesByStatus(statusObject).should.be.an('array');
            UAS.getSlotNamesByStatus(statusObject).should.be.deep.equal([]);
            done();
        });
    });

    describe('#updateStatusAfterRendering', function() {
        var divID = null, isRefreshCall = null;
        var slot_1_Stub = null;
        var slotName = null;

        // beforeEach(function (done) {
        //     isRefreshCall = true;
        //     slotName = "slot_1";
        //     divID = commonDivID;
        //     slot_1_Stub = SLOT.createSlot(slotName);
        //     UAS.slotsMap[divID] = slot_1_Stub;
        //
        //     sinon.spy(UAS.slotsMap[divID], "updateStatusAfterRendering");
        //
        //     sinon.spy(UTIL, "isOwnProperty");
        //     done();
        // });
        //
        // afterEach(function (done) {
        //     isRefreshCall = false;
        //     UAS.slotsMap[divID].updateStatusAfterRendering.restore();
        //     UAS.slotsMap[divID] = null;
        //     slot_1_Stub = null;
        //     divID = null;
        //
        //     UTIL.isOwnProperty.restore();
        //     done();
        // });

        it('is a function', function(done) {
            UAS.updateStatusAfterRendering.should.be.a('function');
            done();
        });

        // it('should not proceed if given divID is not in slotsMap', function (done) {
        //     UAS.updateStatusAfterRendering("non_existing_div_id", true);
        //     UAS.slotsMap[divID].updateStatusAfterRendering.called.should.be.false;
        //     done();
        // });
        //
        // it('should have called updateStatusAfterRendering on slot of given id when present in slotsMap', function (done) {
        //     UAS.updateStatusAfterRendering(divID, isRefreshCall);
        //     UAS.slotsMap[divID].updateStatusAfterRendering.calledWith(isRefreshCall).should.be.true;
        //     done();
        // });
    });

    describe('#arrayOfSelectedSlots', function() {
        var slotNames = null;
        var slot_1 = null, slot_2 = null, slot_3 = null;

        beforeEach(function(done) {
            slotNames = ["slot_1", "slot_2", "slot_3"];

            slot_1 = SLOT.createSlot("slot_1");
            slot_2 = SLOT.createSlot("slot_2");
            slot_3 = SLOT.createSlot("slot_3");

            UAS.slotsMap = {};

            UAS.slotsMap["slot_1"] = slot_1;
            UAS.slotsMap["slot_2"] = slot_2;
            UAS.slotsMap["slot_3"] = slot_3;

            sinon.spy(UTIL, "forEachOnArray");
            done();
        });

        afterEach(function(done) {
            UAS.slotsMap = {};
            UTIL.forEachOnArray.restore();
            done();
        });

        it('is a function', function(done) {
            UAS.arrayOfSelectedSlots.should.be.a('function');
            done();
        });

        it('should return empty array when slotNames given are empty', function (done) {
            UAS.arrayOfSelectedSlots([]).should.deep.equal([]);
            done();
        });

        it('return array slot objects of given slot names from the slotMap', function(done) {
            UAS.arrayOfSelectedSlots(slotNames).should.be.a('array');
            UAS.arrayOfSelectedSlots(slotNames).should.deep.equal([slot_1, slot_2, slot_3]);
            Object.keys(UAS.slotsMap).should.be.deep.equal(slotNames);
            Object.keys(UAS.slotsMap).length.should.be.equal(slotNames.length);
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
            UAS.processDisplayCalledSlot.should.be.a('function');
            done();
        });

        it('do nothing if slot is invalid', function(done){
            sinon.spy(UTIL, "log");
            UAS.processDisplayCalledSlot({}, function(){}, ["div1"]);
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

            currentPhoenixSlotStub = {
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
                },
                getAdUnit: function () {
                    return "DIV_1";
                },
                getDimensions: function() {
                    return [sizeObj_1, sizeObj_2];
                },
            };


            sinon.stub(UAS, "findWinningBidAndApplyTargeting");
            sinon.stub(UAS, "updateStatusAndCallOriginalFunction_Display");

            var dmSlotName = "DIV_TEST";
            delete UAS.slotsMap[dmSlotName];
            UAS.storeInSlotsMap(dmSlotName, currentPhoenixSlotStub, true);

            var theObject = {};
            var theOriginalFunction = function(){};
            var args = [dmSlotName];

            UAS.processDisplayCalledSlot(theObject, theOriginalFunction, args);
            //UAS.findWinningBidAndApplyTargeting.calledWith(dmSlotName);
            UAS.updateStatusAndCallOriginalFunction_Display.calledWith(
                "Calling original display function after timeout with arguments, ",
                theObject,
                theOriginalFunction,
                args
            );
            UAS.findWinningBidAndApplyTargeting.restore();
            UAS.updateStatusAndCallOriginalFunction_Display.restore();
            done();
        });
    });

    describe("#executeDisplay", function() {

        it('should be a function', function(done) {
            UAS.executeDisplay.should.be.a('function');
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
            sinon.stub(UAS, "updateStatusAndCallOriginalFunction_Display").returns(true);
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
            UAS.updateStatusAndCallOriginalFunction_Display.restore();
            window.setTimeout.restore();
            CONFIG.getTimeout.restore();
            done();
        });

        it('should be a function', function(done) {
            UAS.displayFunctionStatusHandler.should.be.a('function');
            done();
        });

        it('should have fall through and called setTimeout with function to fire post timeout to handle slot rendering', function (done) {
            oldStatus = CONSTANTS.SLOT_STATUS.CREATED;
            UAS.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            window.setTimeout.called.should.be.true;
            CONFIG.getTimeout.called.should.be.true;
            done();
        });

        it('should have called setTimeout with function to fire post timeout to handle slot rendering', function (done) {
            oldStatus = CONSTANTS.SLOT_STATUS.PARTNERS_CALLED;
            UAS.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            window.setTimeout.called.should.be.true;
            CONFIG.getTimeout.called.should.be.true;
            done();
        });

        it('should have called updateStatusAndCallOriginalFunction_Display with proper arguments when oldStatus is  TARGETING_ADDED', function(done) {
            oldStatus = CONSTANTS.SLOT_STATUS.TARGETING_ADDED;
            UAS.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            UAS.updateStatusAndCallOriginalFunction_Display
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
            UAS.displayFunctionStatusHandler(oldStatus, theObject, originalFunction, arg);
            UAS.updateStatusAndCallOriginalFunction_Display
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

            sinon.stub(UAS, "updateStatusOfQualifyingSlotsBeforeCallingAdapters");
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters.returns(true);

            sinon.stub(UAS, "arrayOfSelectedSlots");
            UAS.arrayOfSelectedSlots.returns(qualifyingSlots);

            sinon.stub(AM, "callAdapters");
            AM.callAdapters.returns(true);

            done();
        });

        afterEach(function(done) {
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters.restore();
            UAS.arrayOfSelectedSlots.restore();
            AM.callAdapters.restore();

            qualifyingSlotNames = null;
            qualifyingSlots = null;

            slot_1 = null;
            slot_2 = null;

            done();
        });

        it('should be a function', function(done) {
            UAS.forQualifyingSlotNamesCallAdapters.should.be.a('function');
            done();
        });

        it('should have called updateStatusOfQualifyingSlotsBeforeCallingAdapters and arrayOfSelectedSlots', function(done) {
            UAS.forQualifyingSlotNamesCallAdapters(qualifyingSlotNames, arg, isRefreshCall);
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters.calledWith(qualifyingSlotNames, arg, isRefreshCall).should.be.true;
            UAS.arrayOfSelectedSlots.calledWith(qualifyingSlotNames).should.be.true;
            AM.callAdapters.calledWith(qualifyingSlots).should.be.true;
            done();
        });

        it('should not have called updateStatusOfQualifyingSlotsBeforeCallingAdapters and arrayOfSelectedSlots when passed qualifyingSlotNames is empty', function(done) {
            qualifyingSlotNames = [];
            UAS.forQualifyingSlotNamesCallAdapters(qualifyingSlotNames, arg, isRefreshCall);
            UAS.updateStatusOfQualifyingSlotsBeforeCallingAdapters.called.should.be.false;
            UAS.arrayOfSelectedSlots.called.should.be.false;
            AM.callAdapters.called.should.be.false;
            done();
        });
    });

    describe("#createPhoenixNamespace", function () {
        beforeEach(function(done) {
            sinon.spy(UTIL, "isUndefined");
            sinon.spy(UAS, "initiateDisplay");
            sinon.spy(CONFIG, "getTimeout");
            done();
        });

        afterEach(function(done) {
            UTIL.isUndefined.restore();
            UAS.initiateDisplay.restore();
            CONFIG.getTimeout.restore();
            done();
        });

        it("should have called all internal functions", function(done) {
            UAS.createPhoenixNamespace(window);
            UTIL.isUndefined.called.should.be.true;
            UAS.initiateDisplay.called.should.be.true;
            CONFIG.getTimeout.called.should.be.true;
            done();
        });

        it("should not call all internal functions if namespace already present", function(done) {
            window.Phoenix = {
              isJSLoaded: true
            };

            UAS.createPhoenixNamespace(window);
            UTIL.isUndefined.called.should.be.true;
            UAS.initiateDisplay.called.should.be.false;
            CONFIG.getTimeout.called.should.be.false;
            done();
        });
    });

    describe("#init", function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "isObject");
            sinon.spy(UAS, "setWindowReference");
            sinon.spy(AM, "registerAdapters");
            sinon.spy(UAS, "createPubMaticNamespace");
            sinon.spy(UAS, "callJsLoadedIfRequired");
            sinon.spy(UAS, "generateBCUID");
            done();
        });

        afterEach(function(done) {
            UTIL.isObject.restore();
            UAS.setWindowReference.restore();
            AM.registerAdapters.restore();
            UAS.createPubMaticNamespace.restore();
            UAS.callJsLoadedIfRequired.restore();
            UAS.generateBCUID.restore();
            done();
        });

        it("should return false when window object is null", function(done) {
            UAS.init(null).should.equal(false);
            done();
        });

        it("should have called respective internal functions ", function(done) {
            window.PWT = {};
            UAS.init(window).should.equal(true);

            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(true).should.to.be.true;

            UAS.setWindowReference.called.should.be.true;
            AM.registerAdapters.called.should.be.true;
            UAS.createPubMaticNamespace.called.should.be.true;
            UAS.callJsLoadedIfRequired.called.should.be.true;
            UAS.generateBCUID.called.should.be.true;
            done();
        });

        it('should not proceed if passed window object is invalid', function (done) {
            UAS.init("NonObject").should.be.false;

            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(false).should.be.true;

            UTIL.isObject.calledWith("NonObject").should.be.true;
            UAS.setWindowReference.called.should.be.false;
            AM.registerAdapters.called.should.be.false;
            UAS.createPubMaticNamespace.called.should.be.false;
            UAS.callJsLoadedIfRequired.called.should.be.false;
            UAS.generateBCUID.called.should.be.false;
            done();
        });
    });
});
