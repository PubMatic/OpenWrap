/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var typeArray = "Array";
var typeString = "String";
var typeFunction = "Function";
var typeNumber = "Number";

var UTIL = require("../src_new/util");

var SLOT = require("../src_new/slot.js").Slot;

var BID = require("../src_new/bid.js");
var BIDMgr = require("../src_new/bidManager.js");
var CONFIG = require("../src_new/config.js");

var commonAdapterID = "pubmatic";
var commonDivID = "DIV_1";
var CONSTANTS = require("../src_new/constants.js");


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

describe('UTIL', function() {

    beforeEach(function(done) {
        sinon.spy(UTIL, "isA");
        done();
    });

    afterEach(function(done) {
        UTIL.isA.restore();
        done();
    });

    describe('#isA', function() {

        beforeEach(function (done) {
            sinon.spy(Object.prototype.toString, "call");
            done();
        });

        afterEach(function (done) {
            Object.prototype.toString.call.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.isA.should.be.a('function');
            done();
        });

        it('should have called toString object\'s call method', function (done) {
            var number = 1234;

            UTIL.isA(number, typeNumber).should.be.true;
            Object.prototype.toString.call.called.should.be.true;
            done();

        });

        it('should return either true or false depending on the type check result', function (done) {
            var number = 1234;
            UTIL.isA(number, typeNumber).should.be.true;
            Object.prototype.toString.call.called.should.be.true;

            var arrayOfNum = [1234, 5678];
            UTIL.isA(arrayOfNum, typeNumber).should.be.false;
            Object.prototype.toString.call.called.should.be.true;
            done();
        });
    });

    /* start-test-block */
    describe('#getRandomNumberBelow100', function() {

        it('is a function', function (done) {
            UTIL.getRandomNumberBelow100.should.be.a('function');
            done();
        });

        it('returns numeric value below 100', function(done) {
            var result = UTIL.getRandomNumberBelow100();
            result.should.be.below(100);
            done();
        });
    });
    /* end-test-block */


    describe('#isFunction', function() {

        it('is a function', function(done) {
            UTIL.isFunction.should.be.a('function');
            done();
        });

        it('should have returned false when non function is passed', function (done) {
            var obj = {};
            UTIL.isFunction(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true in case of function being passed', function(done) {
            var obj = function() {
                return "obj";
            };
            UTIL.isFunction(obj).should.be.true;
            UTIL.isA.calledWith(obj, typeFunction).should.be.true;
            done();
        });
    });

    describe('#isString', function() {

        it('is a function', function(done) {
            UTIL.isString.should.be.a('function');
            done();
        });

        it('should have returned false when non string is passed', function (done) {
            var obj = {};
            UTIL.isFunction(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true in case of string being passed', function(done) {
            var str = "string_value";
            UTIL.isString(str).should.be.true;
            UTIL.isA.calledWith(str, typeString).should.be.true;
            done();
        });
    });

    describe('#isArray', function() {

        it('is a function', function(done) {
            UTIL.isArray.should.be.a('function');
            done();
        });

        it('should have retuend false when non array is passed', function (done) {
            var obj = {};
            UTIL.isArray(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true when array is passed', function(done) {
            var arr = [1, 2, "3"];
            UTIL.isArray(arr).should.be.true;
            UTIL.isA.calledWith(arr, typeArray).should.be.true;
            done();
        });
    });

    describe('#isNumber', function() {
        it('is a function', function(done) {
            UTIL.isNumber.should.be.a('function');
            done();
        });

        it('should have returned false when non number is passed', function (done) {
            var obj = {};
            UTIL.isNumber(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true when number is passed', function(done) {
            var num = 1234;
            UTIL.isNumber(num).should.be.true;
            UTIL.isA.calledWith(num, typeNumber).should.be.true;
            done();
        });
    });

    describe('#isObject', function() {

        it('is a function', function(done) {
            UTIL.isObject.should.be.a('function');
            done();
        });

        it('should return true when proper object is passed', function (done) {
            var obj = {};
            UTIL.isObject(obj).should.be.true;
            done();
        });

        it('should have returned false when non object is passed', function (done) {
            var num = 1234;
            UTIL.isObject(num).should.be.false;
            done();
        });
    });

    describe('#isOwnProperty', function() {

        it('is a function', function(done) {
            UTIL.isOwnProperty.should.be.a('function');
            done();
        });

        it('return false if passed object doesnt have hasOwnProperty method', function(done) {
            var theObject = false;
            UTIL.isOwnProperty(theObject, "propertyName").should.be.false;
            done();
        });

        it('return false if passed object doesnt have said property', function(done) {
            var theObject = { "propertyName": "value" };
            UTIL.isOwnProperty(theObject, "NonExistingPropertyName").should.be.false;
            done();
        });

        it('return true if passed object have hasOwnProperty method', function(done) {
            var theObject = { "propertyName": "value" };
            UTIL.isOwnProperty(theObject, "propertyName").should.be.true;
            done();
        });
    });

    describe('#isUndefined', function() {

        it('is a function', function(done) {
            UTIL.isUndefined.should.be.a('function');
            done();
        });

        it('returns true when undefined is passed', function (done) {
            UTIL.isUndefined(undefined).should.be.true;
            done();
        });

        it('returns false when non undefined is passed', function (done) {
            UTIL.isUndefined({}).should.be.false;
            done();
        });
    });

    describe('#enableDebugLog', function() {

        it('is a function', function(done) {
            UTIL.enableDebugLog.should.be.a('function');
            done();
        });

        it('should set enableDebugLog to true', function(done) {
            UTIL.debugLogIsEnabled.should.be.false;
            UTIL.enableDebugLog();
            UTIL.debugLogIsEnabled.should.be.true;
            done();
        });
    });

    describe('#isDebugLogEnabled', function(){

        it('is a function', function(done) {
            UTIL.isDebugLogEnabled.should.be.a('function');
            done();
        });

        it('should return same value as of debugLogIsEnabled: false', function(done) {
            UTIL.debugLogIsEnabled = false;
            UTIL.isDebugLogEnabled().should.be.false;
            done();
        });

        it('should return true when enableDebugLog is called', function(done) {
            UTIL.debugLogIsEnabled = false;
            UTIL.enableDebugLog();
            UTIL.isDebugLogEnabled().should.be.true;
            done();
        });

    })

    describe('#enableVisualDebugLog', function() {

        it('is a function', function(done) {
            UTIL.enableVisualDebugLog.should.be.a('function');
            done();
        });

        it('should have set debugLogIsEnabled and visualDebugLogIsEnabled to true', function(done) {
            UTIL.visualDebugLogIsEnabled.should.be.false;
            UTIL.enableVisualDebugLog();
            UTIL.debugLogIsEnabled.should.be.true;
            UTIL.visualDebugLogIsEnabled.should.be.true;
            done();
        });
    });

    describe('#log', function() {
        var currentTime = null;

        beforeEach(function(done) {
            var currentTime = new window.Date();
            sinon.stub(UTIL, "isFunction");
            sinon.stub(UTIL, "isString");
            sinon.stub(window, "Date").returns(currentTime);
            sinon.stub(window.console, "log");
            done();
        });

        afterEach(function(done) {
            UTIL.isFunction.restore();
            UTIL.isString.restore();
            window.Date.restore();
            window.console.log.restore();
            done();
        });


        it('is a function', function(done) {
            UTIL.log.should.be.a('function');
            done();
        });

        it('should have called UTIL.isString got check passed data to be of string ', function(done) {
            var stirngData = "string data";
            UTIL.debugLogIsEnabled = true;
            UTIL.isFunction.returns(true);
            window.Date.returns(currentTime);
            UTIL.log(stirngData);
            UTIL.isString.calledWith(stirngData).should.be.true;
            done();
        });

        it('should have called window.console.log when passed data is not string', function(done) {
            UTIL.isString.returns(false);
            UTIL.debugLogIsEnabled = true;
            UTIL.isFunction.returns(true);
            var theObject = {
                "prop": "value"
            };
            UTIL.log(theObject);
            UTIL.isFunction.called.should.be.true;
            done();
        });
    });

    describe('#getCurrentTimestampInMs', function() {

        it('is a function', function(done) {
            UTIL.getCurrentTimestampInMs.should.be.a('function');
            done();
        });

        it('should return current  time in miliseconds', function(done) {
            var currentTime = new window.Date();
            sinon.stub(window, "Date").returns(currentTime);

            UTIL.getCurrentTimestampInMs().should.be.equal(currentTime.getTime());
            window.Date.restore();
            done();
        });
    });

    describe('#getCurrentTimestamp', function() {

        it('is a function', function(done) {
            UTIL.getCurrentTimestamp.should.be.a('function');
            done();
        });

        it('should return current Time stamp ', function(done) {
            var currentTime = new window.Date();
            sinon.stub(window, "Date").returns(currentTime);

            UTIL.getCurrentTimestamp().should.be.equal(Math.round(currentTime.getTime() / 1000));
            window.Date.restore();
            done();
        });
    });

    describe('#getIncrementalInteger', function() {

        it('is a function', function(done) {
            UTIL.getIncrementalInteger.should.be.a('function');
            done();
        });

        it('should incremet the count value each time being called', function(done) {
            UTIL.getIncrementalInteger().should.be.equal(1);
            UTIL.getIncrementalInteger().should.be.equal(2);
            done();
        });
    });

    describe('#getUniqueIdentifierStr', function() {

        it('is a function', function(done) {
            UTIL.getUniqueIdentifierStr.should.be.a('function');
            done();
        });

        it('should produce unique string each time called', function (done) {
            var str1 = UTIL.getUniqueIdentifierStr();
            var str2 = UTIL.getUniqueIdentifierStr();
            var str3 = UTIL.getUniqueIdentifierStr();

            expect(str1).should.not.equal(str2).to.be.true;
            expect(str1).should.not.equal(str3).to.be.true;
            expect(str2).should.not.equal(str3).to.be.true;
            done();
        });
    });

    describe('#copyKeyValueObject', function() {
        var copyTo = null,
            copyFrom = null;

        beforeEach(function(done) {
            copyTo = {
                "k1": "v3"
            };
            copyFrom = {
                "k1": "v1",
                "k2": "v2"
            };

            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isArray");
            sinon.spy(UTIL, "forEachOnObject");
            done();
        });

        afterEach(function(done) {
            UTIL.isObject.restore();
            UTIL.forEachOnObject.restore();
            UTIL.isArray.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.copyKeyValueObject.should.be.a('function');
            done();
        });

        it('should check whether both passed arguments are object', function(done) {
            UTIL.copyKeyValueObject(copyTo, copyFrom);
            UTIL.isObject.called.should.be.true;
            done();
        });

        it('should have copied keys and values from given object to target object', function(done) {
            UTIL.copyKeyValueObject(copyTo, copyFrom);
            copyTo.should.deep.equal({ "k1": [ 'v3', 'v1' ], "k2": [ 'v2' ] });
            UTIL.forEachOnObject.called.should.be.true;
            UTIL.isArray.called.should.be.true;
            done();
        });
    });

    // TODO ?
    describe('#generateUUID', function() {
        it('is a function', function(done) {
            UTIL.generateUUID.should.be.a('function');
            done();
        });
    });

    describe('#generateSlotNamesFromPattern', function() {
        var activeSlot = null,
            pattern = null,
            videoSlot = [];

        beforeEach(function(done) {
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "getIncrementalInteger");
            sinon.spy(UTIL, "isOwnProperty");
            activeSlot = {
                getSizes: function() {
                    return [
                        [1024, 120]
                    ];
                },
                getAdUnitID: function() {
                    return "/15671365/DM*De*m-o";
                },
                getAdUnitIndex: function() {
                    return 0;
                },
                getDivID: function() {
                    return "Div_1";
                },
            };
            sinon.spy(activeSlot, "getSizes");
            sinon.spy(activeSlot, "getAdUnitID");
            sinon.spy(activeSlot, "getAdUnitIndex");
            sinon.spy(activeSlot, "getDivID");
            pattern = "_W_x_H_";
            done();
        });

        afterEach(function(done) {
            UTIL.isObject.restore();
            UTIL.isFunction.restore();
            UTIL.getIncrementalInteger.restore();
            UTIL.isOwnProperty.restore();

            activeSlot.getSizes.restore();
            activeSlot.getAdUnitID.restore();
            activeSlot.getAdUnitIndex.restore();
            activeSlot.getDivID.restore();
            activeSlot = null;
            pattern = null;
            videoSlot = null;
            UTIL.mediaTypeConfig ={};
            done();
        });

        it('is a function', function(done) {
            UTIL.generateSlotNamesFromPattern.should.be.a('function');
            done();
        });

        it('should have cehcked whether activeSlot passed is an object and has method getSizes', function(done) {
            UTIL.generateSlotNamesFromPattern(activeSlot, pattern);
            UTIL.isObject.returned(true).should.be.true;
            UTIL.isFunction.returned(true).should.be.true;
            done();
        });

        it('should return array of slot names', function(done) {
            UTIL.generateSlotNamesFromPattern(activeSlot, pattern).should.be.a('array');
            UTIL.isOwnProperty.called.should.be.true;
            UTIL.getIncrementalInteger.called.should.be.true;
            done();
        });

        it('should return array of slot names and should ignore fluid size', function(done) {
            activeSlot.getSizes.restore();
            sinon.stub(activeSlot,"getSizes").returns([
                    [1024, 120],
                    'fluid'
                ]);
            var slotNames = UTIL.generateSlotNamesFromPattern(activeSlot, pattern);
            slotNames.should.be.a('array')
            slotNames.should.be.lengthOf(1);
            UTIL.isOwnProperty.called.should.be.true;
            UTIL.getIncrementalInteger.called.should.be.true;
            done();
        });

        it('should have extracted data from activeSlot to generate slot names', function(done) {
            UTIL.generateSlotNamesFromPattern(activeSlot, pattern);
            activeSlot.getSizes.calledOnce.should.be.true;
            activeSlot.getAdUnitID.calledOnce.should.be.true;
            activeSlot.getAdUnitIndex.calledOnce.should.be.true;
            activeSlot.getDivID.calledTwice.should.be.true;
            done();
        });

        // Uncomment Below code once phantom js has been replaced with chrome headless
        xit('should have assigned videoSlot if video config is present',function(done){
            videoSlot = [];
            UTIL.mediaTypeConfig = {
                "Div_1":{
                    video:{
                        'test':'property'
                    }
                }
            }
            // sinon.stub(UTIL, "mediaTypeConfig").returns();
            pattern = '_DIV_@_W_x_H_';
            var expectedResult = "Div_1@0x0";
            var generatedKeys = UTIL.generateSlotNamesFromPattern(activeSlot, pattern, true, videoSlot);
            expect(videoSlot[0]).to.be.equal(expectedResult);
            done();
        });

        //TODO: Uncomment Below code once phantom js has been replaced with chrome headless
        xit('should not have assigned videoSlot if video config is not present',function(done){
            videoSlot = [];
            UTIL.mediaTypeConfig ={};
            pattern = '_DIV_@_W_x_H_';
            var expectedResult = "Div_1@0x0";
            var generatedKeys = UTIL.generateSlotNamesFromPattern(activeSlot, pattern, true, videoSlot);
            expect(videoSlot).to.be.deep.equal([]);
            done();
        });

        //TODO: Uncomment Below code once phantom js has been replaced with chrome headless
        xit('should not have assigned videoSlot if video config is present but flag for video is false',function(done){
            videoSlot = [];
            UTIL.mediaTypeConfig = {
                "Div_1":{
                    video:{
                        'test':'property'
                    }
                }
            }
            // sinon.stub(UTIL, "mediaTypeConfig").returns();
            pattern = '_DIV_@_W_x_H_';
            var expectedResult = "Div_1@0x0";
            var generatedKeys = UTIL.generateSlotNamesFromPattern(activeSlot, pattern, false, videoSlot);
            expect(videoSlot).to.be.deep.equal([]);
            done();
        });

        //TODO: Uncomment Below code once phantom js has been replaced with chrome headless
        xit('should not update the sizes of active slot', function(done){
            videoSlot = [];
            UTIL.mediaTypeConfig = {
                "Div_1":{
                    video:{
                        'test':'property'
                    }
                }
            }
            UTIL.generateSlotNamesFromPattern(activeSlot, pattern, true, videoSlot);
            var sizes = activeSlot.getSizes()
            expect(sizes).to.be.deep.equal([
                [1024, 120]
            ]);
            done();
        })
    });

    xdescribe('#checkMandatoryParams', function() {
        var object = null,
            keys = null,
            adapterID = null;

        beforeEach(function(done) {
            object = {
                "k1": "v1",
                "k2": "v2"
            };
            keys = ["k1", "k2"];
            adapterID = commonAdapterID;
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isArray");
            sinon.spy(UTIL, "isOwnProperty");
            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "logWarning");
            sinon.spy(UTIL, "logError");
            done();
        });

        afterEach(function(done) {
            object = null;
            keys = null;
            adapterID = null;
            UTIL.isObject.restore();
            UTIL.isArray.restore();
            UTIL.isOwnProperty.restore();
            UTIL.log.restore();
            UTIL.logWarning.restore();
            UTIL.logError.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.checkMandatoryParams.should.be.a('function');
            done();
        });

        it('should log if provided object is invalid', function(done) {
            UTIL.checkMandatoryParams(object, keys, adapterID);
            UTIL.isObject.returned(true).should.be.true;
            UTIL.isArray.returned(false).should.be.true;
            UTIL.logWarning.calledWith(adapterID + "provided object is invalid.");
            done();
        });

        it('should log if provided object is invalid i.e. an array ', function(done) {
            object = [];
            UTIL.checkMandatoryParams(object, keys, adapterID).should.be.false;
            UTIL.logWarning.calledWith(adapterID + "provided object is invalid.");
            done();
        });

        it('should check whether passed keys are of type array', function(done) {
            UTIL.checkMandatoryParams(object, keys, adapterID).should.be.true;
            UTIL.isArray.calledWith(keys).should.be.true;
            done();
        });

        it('should log if provided keys are not an array', function(done) {
            keys = {};
            UTIL.checkMandatoryParams(object, keys, adapterID).should.be.false;
            UTIL.logWarning.calledWith(adapterID + "provided keys must be in an array.");
            done();
        });

        it('should return true if passed keys, is and empty array', function(done) {
            keys = [];
            UTIL.checkMandatoryParams(object, keys, adapterID).should.be.true;
            UTIL.isOwnProperty.called.should.be.false;
            done();
        });

        it('should have logged if passed object doesnt contain the mandetory parameters passed via keys param', function(done) {
            object = {
                "k3": "v3"
            };
            UTIL.checkMandatoryParams(object, keys, adapterID).should.be.false;
            UTIL.isOwnProperty.calledWith(object, keys[0]).should.be.true;
            UTIL.logError.calledWith(adapterID + ": " + keys[0] + ", mandatory parameter not present.").should.be.true;
            done();
        });

        it('should have returned true if passed object have the mandetory parameters passed via keys param', function(done) {
            UTIL.checkMandatoryParams(object, keys, adapterID).should.be.true;
            UTIL.isOwnProperty.calledWith(object, keys[0]).should.be.true;
            done();
        });
    });

    // TODO ?
    describe('#forEachGeneratedKey', function() {
        var adapterID = null,
            adUnits = null,
            adapterConfig = null,
            impressionID = null,
            slotConfigMandatoryParams = null,
            activeSlots = null,
            handlerFunction = null,
            addZeroBids = null;
        var obj = null;

        beforeEach(function(done) {
            adapterID = commonAdapterID;
            adUnits = "adUnits";
            adapterConfig = {
                kgp: "_W_x_H_",
                klm: {
                    "generatedKeys": "some_vale"
                }
            };
            impressionID = "impressionID";
            slotConfigMandatoryParams = "slotConfigMandatoryParams";
            activeSlots = [new SLOT("slot_1"), new SLOT("slot_2")];
            obj = {
                handlerFunction: function() {
                    return "handlerFunction"
                }
            };
            sinon.spy(obj, "handlerFunction");
            addZeroBids = true;
            done();
        });

        afterEach(function(done) {
            adapterID = null;
            adUnits = null;
            adapterConfig = null;
            impressionID = null;
            slotConfigMandatoryParams = null;
            activeSlots = null;
            obj.handlerFunction.restore();
            obj.handlerFunction = null;
            addZeroBids = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.forEachGeneratedKey.should.be.a('function');
            done();
        });

        xit('should check whether activeSlots is not empty ad key generation pattern must be greater than 3 in length ', function(done) {
            UTIL.forEachGeneratedKey(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, activeSlots, handlerFunction, addZeroBids);
            UTIL.forEachOnArray.should.be.calledOnce;
            UTIL.generateSlotNamesFromPattern.should.be.calledOnce;
            UTIL.callHandlerFunctionForMapping.should.be.calledOnce;
            done();
        });

        it('should do nothing if active slot lenght is 0 ',function(done){
            activeSlots = [];
            UTIL.forEachGeneratedKey(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, activeSlots, handlerFunction, addZeroBids);
            UTIL.forEachOnArray.should.not.be.called;
            UTIL.generateSlotNamesFromPattern.should.not.be.called;
            UTIL.callHandlerFunctionForMapping.should.not.be.called;
            done();
        });

        it('should do nothing if KGP length is less than 3 ',function(done){
            adapterConfig.kgp = "";
            UTIL.forEachGeneratedKey(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, activeSlots, handlerFunction, addZeroBids);
            UTIL.forEachOnArray.should.not.be.called;
            UTIL.generateSlotNamesFromPattern.should.not.be.called;
            UTIL.callHandlerFunctionForMapping.should.not.be.called;
            done();
        });

        xit('should check call handler function if activeslots is not empty ad key generation pattern is regex pattern', function(done) {
            adapterConfig.kgp = undefined;
            adapterConfig.kgp_rx = "_AU_@_DIV_@_W_x_H_";
            UTIL.forEachGeneratedKey(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, activeSlots, handlerFunction, addZeroBids);
            UTIL.forEachOnArray.should.be.calledOnce;
            UTIL.generateSlotNamesFromPattern.should.be.calledOnce;
            UTIL.callHandlerFunctionForMapping.should.be.calledOnce;
            done();
        });

    });

    describe('#resizeWindow', function() {
        var theDocument = null,
            width = null,
            height = null;

        beforeEach(function(done) {
            theDocument = {
                defaultView: {
                    frameElement: {
                        width: 0,
                        height: 0
                    }
                }
            };
            width = 340;
            height = 210;
            done();
        });

        afterEach(function(done) {
            theDocument = null;
            width = null;
            height = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.resizeWindow.should.be.a('function');
            done();
        });

        it('should resize the window with given width and height', function(done) {
            UTIL.resizeWindow(theDocument, width, height);
            expect(theDocument.defaultView.frameElement.width == width).to.be.true;
            expect(theDocument.defaultView.frameElement.height == height).to.be.true;
            done();
        });
    });

    describe('#writeIframe', function() {
        var theDocument = null,
            src = null,
            width = null,
            height = null,
            style = null;

        beforeEach(function(done) {
            theDocument = {
                write: function() {
                    return "write"
                }
            };
            src = "iframe.url";
            width = 210;
            height = 340;
            style = "http://path.to.style.css";
            sinon.spy(theDocument, "write");
            done();
        });

        afterEach(function(done) {
            src = null;
            width = null;
            height = null;
            style = null;
            theDocument.write.restore();
            theDocument = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.writeIframe.should.be.a('function');
            done();
        });

        it('should have called passed in doc\'s write method while generating iframe tag', function(done) {
            UTIL.writeIframe(theDocument, src, width, height, style);
            theDocument.write.calledWith("<iframe" + " frameborder=\"0\" allowtransparency=\"true\" marginheight=\"0\" marginwidth=\"0\" scrolling=\"no\" width=\"" + width + "\" hspace=\"0\" vspace=\"0\" height=\"" + height + "\"" + (style ? " style=\"" + style + "\"" : "") + " src=\"" + src + "\"" + "></ifr" + "ame>").should.be.true;
            done();
        });
    });

    describe('#displayCreative', function() {
        var theDocument = null,
            bid = null;

        beforeEach(function(done) {
            theDocument = {
                write: function() {
                    return "write"
                }
            };
            sinon.spy(theDocument, "write");
            bid = {
                adHtml: "<html>ad content goes here </html>",
                adUrl: "http://ad.url.here",
                width: 340,
                height: 210,
                getAdapterID:function(){
                    return '';
                },
                pbbid:{
                    mediaType:"banner"
                }
            };
            sinon.stub(UTIL, "resizeWindow")
            // .returns(true);
            sinon.stub(UTIL, "writeIframe")
            // .returns(true);
            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "logError");
            sinon.spy(UTIL, "replaceAuctionPrice");
            done();
        });

        afterEach(function(done) {
            theDocument.write.restore();
            theDocument = null;
            bid = null;
            UTIL.resizeWindow.restore();
            UTIL.writeIframe.restore();
            UTIL.log.restore();
            UTIL.logError.restore();
            UTIL.replaceAuctionPrice.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.displayCreative.should.be.a('function');
            done();
        });


        it('should have calle resizeWindow', function(done) {
            UTIL.displayCreative(theDocument, bid);
            UTIL.resizeWindow.calledWith(theDocument, bid.width, bid.height).should.be.true;
            done();
        });

        it('should have called write method of the passed object if adHtml is present in given bid', function(done) {
            UTIL.displayCreative(theDocument, bid);
            theDocument.write.calledWith(bid.adHtml).should.be.true;
            done();
        });

        it('should have called writeIframe method if adUrl is present in given bid and adHtml is not', function(done) {
            delete bid.adHtml;
            UTIL.displayCreative(theDocument, bid);
            UTIL.writeIframe.calledWith(theDocument, bid.adUrl, bid.width, bid.height, "").should.be.true;
            done();
        });

        it('should have logged if creative details are not found', function(done) {
            bid = {};
            UTIL.displayCreative(theDocument, bid);
            UTIL.logError.calledWith("creative details are not found").should.be.true;
            UTIL.logError.calledWith(bid).should.be.true;
            done();
        });

        it('should have called replace Auction Price method of the passed object if bid is of APPIER', function(done) {
            bid.getAdapterID = function(){ return "appier" };
            bid.getGrossEcpm = function(){ return "10.55" };
            UTIL.displayCreative(theDocument, bid);
            theDocument.write.calledWith(bid.adHtml).should.be.true;
            UTIL.replaceAuctionPrice.calledWith(bid.adHtml,bid.getGrossEcpm()).should.be.true;
            done();
        });

        it('should have called replace auction price and  writeIframe method if adUrl is present in given bid and adHtml is not and bidder is appier', function(done) {
            delete bid.adHtml;
            bid.getAdapterID = function(){ return "appier" };
            bid.getGrossEcpm = function(){ return "10.55" };
            UTIL.displayCreative(theDocument, bid);
            UTIL.replaceAuctionPrice.calledWith(bid.adUrl,bid.getGrossEcpm()).should.be.true;
            UTIL.writeIframe.calledWith(theDocument, bid.adUrl, bid.width, bid.height, "").should.be.true;
            done();
        });

    });

    describe('#forEachOnObject', function() {
        var theObject = null,
            callback = null;
        var obj = null;

        beforeEach(function(done) {
            theObject = {
                "key1": {
                    "k1": "v1"
                },
                "key2": {
                    "k2": "v2"
                }
            };
            obj = {
                callback: function() {
                    return "callback";
                }
            };
            sinon.spy(obj, "callback");
            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "isOwnProperty");
            done();
        });

        afterEach(function(done) {
            if (obj.callback) {
                obj.callback.restore();
            }
            UTIL.isObject.restore();
            UTIL.isFunction.restore();
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.forEachOnObject.should.be.a('function');
            done();
        });

        it('should return if given object is not a valid Object', function(done) {
            theObject = null
            UTIL.forEachOnObject(theObject, obj.callback);
            UTIL.isObject.returned(false).should.be.true;
            UTIL.isFunction.called.should.be.false;
            done();
        });

        it('should return if given callback is not a valid Function', function(done) {
            obj.callback = null;
            UTIL.forEachOnObject(theObject, obj.callback);
            UTIL.isObject.returned(true).should.be.true;
            UTIL.isOwnProperty.called.should.be.false;
            done();
        });

        it('should have called the callback function if given object\'s keys are are its own ', function(done) {
            UTIL.forEachOnObject(theObject, obj.callback);
            obj.callback.calledWith("key1", theObject["key1"]).should.be.true;
            done();
        });
    });

    describe('#forEachOnArray', function() {

        var theArray = null,
            callback = null;
        var obj = null;

        beforeEach(function(done) {
            theArray = ["key1", "key2"];
            obj = {
                callback: function() {
                    return "callback";
                }
            };
            sinon.spy(obj, "callback");
            sinon.spy(UTIL, "isArray");
            sinon.spy(UTIL, "isFunction");
            done();
        });

        afterEach(function(done) {
            if (obj.callback) {
                obj.callback.restore();
            }
            UTIL.isArray.restore();
            UTIL.isFunction.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.forEachOnArray.should.be.a('function');
            done();
        });

        it('should return if given array is not an valid Array', function(done) {
            theArray = null
            UTIL.forEachOnArray(theArray, obj.callback);
            UTIL.isArray.returned(false).should.be.true;
            UTIL.isFunction.called.should.be.false;
            done();
        });

        it('should return if given callback is not a valid Function', function(done) {
            obj.callback = null;
            UTIL.forEachOnArray(theArray, obj.callback);
            UTIL.isArray.returned(true).should.be.true;
            UTIL.isFunction.returned(false).should.be.true;
            done();
        });

        it('should have called the callback function for given array\'s elements', function(done) {
            UTIL.forEachOnArray(theArray, obj.callback);
            obj.callback.calledWith(0, theArray[0]).should.be.true;
            obj.callback.calledWith(1, theArray[1]).should.be.true;
            done();
        });
    });

    describe('#trim', function() {
        var theStringInput = null;
        var nonStringInput = {};
        beforeEach(function(done) {
            theStringInput = " string with spance on both ends ";
            sinon.spy(UTIL, "isString");
            done();
        });

        afterEach(function(done) {
            UTIL.isString.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.trim.should.be.a('function');
            done();
        });


        it('returns trimmed string while calling replace for trimming using regular expressions', function(done) {
            UTIL.trim(theStringInput).should.be.equal(theStringInput.replace(/^\s+/g, "").replace(/\s+$/g, ""));
            done();
        });

        it('returns the passed param as is if passed non string param', function(done) {
            UTIL.trim(nonStringInput).should.be.equal(nonStringInput);
            done();
        });
    });

    describe('#getTopFrameOfSameDomain', function() {
        var cWin = null;
        var obj = null;
        beforeEach(function(done) {
            obj = {
                "k1": "v1"
            };
            cWin = {
                parent: {
                    document: obj
                },
                document: obj
            };
            sinon.spy(UTIL, "getTopFrameOfSameDomain");
            done();
        });

        afterEach(function(done) {
            cWin = null;
            UTIL.getTopFrameOfSameDomain.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.getTopFrameOfSameDomain.should.be.a('function');
            done();
        });

        it('should return the passed object if parent and the original document objet are same', function(done) {
            UTIL.getTopFrameOfSameDomain(cWin).should.be.deep.equal(cWin);
            done();
        });

        it('should have called UTIL.getTopFrameOfSameDomain if parent and hte original document object are not same', function(done) {
            delete cWin.document["k1"];
            cWin.document["k2"] = "v2";
            UTIL.getTopFrameOfSameDomain(cWin);
            UTIL.getTopFrameOfSameDomain.calledWith(cWin);
            done();
        });
    });

    describe('#getMetaInfo', function() {
        var cWin = null;
        var frameStub = null;

        beforeEach(function(done) {
            cWin = {

            };
            frameStub = {
                refurl: "http://www.example.com/page1",
                document: {
                    referrer: "http://www.example.com/page1"
                },
                location: {
                    href: "",
                    protocol: "http"
                }
            }
            sinon.spy(UTIL, "isIframe");
            sinon.stub(UTIL, "getTopFrameOfSameDomain").returns(frameStub);
            window.top = frameStub;
            done();
        });

        afterEach(function(done) {
            cWin = null;
            UTIL.getTopFrameOfSameDomain.restore();
            UTIL.isIframe.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.getMetaInfo.should.be.a('function');
            done();
        });

        it('should return metaInfo object', function(done) {
            UTIL.getMetaInfo(cWin)
                .should.have.all.keys([
                    "refURL",
                    "protocol",
                    "secure",
                    "isInIframe",
                    "pageURL",
                    "pageDomain"
                ]);
            done();
        });

        it('should handle secure protocol scenario', function(done) {
            frameStub.location.protocol = "ftp";
            var metaInfoObj = UTIL.getMetaInfo();
            expect(metaInfoObj.secure).to.be.equal(1);
            expect(metaInfoObj.protocol).to.be.equal("https://");
            UTIL.isIframe.called.should.be.true;
            UTIL.getTopFrameOfSameDomain.called.should.be.true;
            done();
        });
    });

    describe('#isIframe', function() {
        var theWindow = null;

        beforeEach(function(done) {
            theWindow = {
                self: {
                    "obj1": "val1"
                },
                top: {
                    "obj1": "val1"
                }
            };
            done();
        });

        afterEach(function(done) {
            theWindow = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.isIframe.should.be.a('function');
            done();
        });

        it('should return whether given window object is iframe or not', function(done) {
            UTIL.isIframe(theWindow).should.be.true;
            done();
        });
    });

    describe('#findQueryParamInURL', function() {
        var url = null,
            name = null;
        beforeEach(function(done) {
            url = "http://some.url.here?key=value&rhs=lhs"
            sinon.spy(UTIL, "isOwnProperty");
            sinon.stub(UTIL, "parseQueryParams").returns({
                "key": "value",
                "rhs": "lhs"
            });
            name = "key";
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            UTIL.parseQueryParams.restore();
            url = null;
            name = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.findQueryParamInURL.should.be.a('function');
            done();
        });

        it('should have checked whether passed query param is present in given url', function(done) {
            UTIL.findQueryParamInURL(url, name).should.be.true;
            UTIL.parseQueryParams.called.should.be.true;
            UTIL.isOwnProperty.called.should.be.true;
            done();
        });
    });

    describe('#parseQueryParams', function() {
        var url = null;

        beforeEach(function(done) {
            url = "http://some.url.here?key=value&rhs=lhs";
            sinon.spy(window.document, "createElement");
            sinon.spy(UTIL, "forEachOnArray");
            done();
        });

        afterEach(function(done) {
            window.document.createElement.restore();
            UTIL.forEachOnArray.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.parseQueryParams.should.be.a('function');
            done();
        });

        it('should return query params with their values in object form', function(done) {
            UTIL.parseQueryParams(url).should.deep.equal({
                "key": "value",
                "rhs": "lhs"
            });
            UTIL.forEachOnArray.called.should.be.true;
            done();
        });
    });

    // TODO ?
    describe('#addHookOnFunction', function() {
        var theObject = null,
            useProto = null,
            functionName = null,
            newFunction = null;
        var obj = null;

        beforeEach(function(done) {
            theObject = {};
            functionName = "function_to_highjack"
            theObject[functionName] = function() {
                return "theObject[functionName]"
            };
            useProto = true;
            obj = {
                newFunction: function() {
                    return "newFunction";
                }
            };
            sinon.spy(obj, "newFunction");

            sinon.spy(UTIL, "isObject");
            sinon.spy(UTIL, "isFunction");
            sinon.spy(UTIL, "log");
            done();
        });

        afterEach(function(done) {
            obj.newFunction.restore();

            UTIL.isObject.restore();
            UTIL.isFunction.restore();
            UTIL.log.restore();

            theObject = null;
            useProto = null;
            functionName = null;
            obj = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.addHookOnFunction.should.be.a('function');
            done();
        });

        it('should have logged if passed object doesnt have function which we want to add hook on', function(done) {
            functionName = "non_existing_fn_name";
            UTIL.addHookOnFunction(theObject, useProto, functionName, obj.newFunction);
            UTIL.isFunction.returned(false).should.be.true;
            UTIL.isObject.returned(true).should.be.true;
            UTIL.log.calledWith("in assignNewDefination: oldReference is not a function");
            done();
        });

        it('should assign the passed in object with passed function name the invocation of passed newFunction', function(done) {
            var originalFn = theObject[functionName];
            UTIL.addHookOnFunction(theObject, useProto, functionName, obj.newFunction);
            UTIL.isObject.returned(true).should.be.true;
            UTIL.isFunction.returned(true).should.be.true;
            done();
        });
    });

    // TODO ?
    describe('#getBididForPMP', function() {
        var values = null,
            priorityArray = null;

        it('is a function', function(done) {
            UTIL.getBididForPMP.should.be.a('function');
            done();
        });
    });

    describe('#createInvisibleIframe', function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "getUniqueIdentifierStr");
            sinon.spy(window.document, "createElement");
            done();
        });

        afterEach(function(done) {
            UTIL.getUniqueIdentifierStr.restore();
            window.document.createElement.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.createInvisibleIframe.should.be.a('function');
            done();
        });

        it('should have calle getUniqueIdentifierStr to generate unique id for newly created iframe', function(done) {
            UTIL.createInvisibleIframe();
            UTIL.getUniqueIdentifierStr.called.should.be.true;
            done();
        });

        // TODO: fix as it fails with phantomjs as test environment
        xit('should have created an iframe object with proper attributes', function(done) {
            UTIL.createInvisibleIframe().should.have.all.keys([
                "border",
                "vspace",
                "hspace",
                // TODO : cant verify that these following properties are present on the created element
                // "frame-border",
                // "height",
                // "id",
                // "margin-height",
                // "margin-width",
                // "scrolling",
                // "src",
                // "style",
                // "style.border",
                // "width",
            ]);
            done();
        });
    });

    describe('#addMessageEventListener', function() {
        var theWindow = null,
            eventHandler = null;

        beforeEach(function(done) {
            theWindow = window;

            theWindow.addEventListener = function() {
                return "addEventListener";
            };

            sinon.spy(theWindow, "addEventListener");

            theWindow.attachEvent = function() {
                return "attachEvent";
            };

            sinon.spy(theWindow, "attachEvent");

            eventHandler = function() {
                return "eventHandler";
            };
            sinon.spy(UTIL, "log");
            done();
        });

        afterEach(function(done) {
            if (theWindow.addEventListener) {
                theWindow.addEventListener.restore();
            }
            theWindow.attachEvent.restore();

            theWindow = null;

            eventHandler = null;
            UTIL.log.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.addMessageEventListener.should.be.a('function');
            done();
        });

        it('should have checked and logged if passed eventHandler is not a function ', function(done) {
            eventHandler = {};
            UTIL.addMessageEventListener(theWindow, eventHandler).should.be.false;
            UTIL.log.calledWith("EventHandler should be a function").should.be.true;
            done();
        });

        it('should have added eventHandler using window object\'s addEventListener method', function(done) {
            UTIL.addMessageEventListener(theWindow, eventHandler).should.be.true;
            theWindow.addEventListener.calledWith("message", eventHandler, false).should.be.true;
            done();
        });

        it('should have added eventHandler using window object\'s attachEvent method if addEventListener is not available', function(done) {
            theWindow.addEventListener = false;
            UTIL.addMessageEventListener(theWindow, eventHandler).should.be.true;
            theWindow.attachEvent.calledWith("onmessage", eventHandler).should.be.true;
            done();
        });
    });

    describe('#safeFrameCommunicationProtocol', function() {
        var msg = null;
        var bidDetailsStub = null;
        var iFrameStub = null;

        beforeEach(function(done) {
            msg = {
                "data": '{"pwt_type":1,"pwt_bidID":1,"pwt_origin":1,"pwt_bid":{}}',
                "source": {
                    "postMessage": function() {
                        return "postMessage";
                    }
                }
            };

            sinon.spy(msg.source, "postMessage");
            window.PWT = {
                isSafeFrame: true
            };
            bidDetailsStub = {
                bid: {
                    getAdapterID: function() {
                        return commonAdapterID;
                    }
                },
                slotid: "slot_1"
            };
            sinon.stub(BIDMgr, "getBidById").returns(bidDetailsStub);

            sinon.spy(bidDetailsStub.bid, "getAdapterID");
            sinon.stub(BIDMgr, "executeMonetizationPixel");
            sinon.stub(BIDMgr, "fireTracker");

            sinon.stub(UTIL, "vLogInfo").returns(true);
            sinon.stub(UTIL, "resizeWindow").returns(true);
            iFrameStub = {
                setAttribute: function() {
                    return "setAttribute"
                },
                style: "",
                contentWindow: {
                    document: {
                        write: function() {
                            return "write";
                        },
                        close: function() {
                            return "close"
                        }
                    }
                }
            };

            sinon.spy(iFrameStub, "setAttribute");
            sinon.spy(iFrameStub.contentWindow.document, "write");
            sinon.stub(UTIL, "createInvisibleIframe").returns(iFrameStub);
            sinon.stub(UTIL, "displayCreative").returns(true);
            sinon.spy(UTIL, "log");
            sinon.spy(UTIL, "logError");
            sinon.spy(UTIL, "logWarning");
            sinon.stub(UTIL, "writeIframe").returns(true);
            sinon.stub(window.document.body, "appendChild").returns(true);
            sinon.spy(window, "parseInt");
            done();
        });

        afterEach(function(done) {
            window.parseInt.restore();
            BIDMgr.executeMonetizationPixel.restore();
            BIDMgr.getBidById.restore();
            BIDMgr.fireTracker.restore();

            UTIL.vLogInfo.restore();
            UTIL.resizeWindow.restore();
            UTIL.createInvisibleIframe.restore();
            UTIL.displayCreative.restore();
            UTIL.log.restore();
            UTIL.logWarning.restore();
            UTIL.logError.restore();
            UTIL.writeIframe.restore();

            bidDetailsStub.bid.getAdapterID.restore();
            msg.source.postMessage.restore();
            window.document.body.appendChild.restore();
            iFrameStub.setAttribute.restore();

            msg = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.safeFrameCommunicationProtocol.should.be.a('function');
            done();
        });

        it('should return pwt_type is not of known type', function(done) {
            msg.data = '{"pwt_type":0,"pwt_bidID":1,"pwt_origin":1,"pwt_bid":{}}';
            UTIL.safeFrameCommunicationProtocol(msg);
            window.parseInt.called.should.be.false;
            done();
        });

        describe('##when pwt_type is 1', function() {
            it('should return if isSafeFrame flag is set', function(done) {
                UTIL.safeFrameCommunicationProtocol(msg);
                BIDMgr.getBidById.called.should.be.false;
                done();
            });

            it('should have called vLogInfo and should have executed Monetization Pixel', function(done) {
                window.PWT.isSafeFrame = false;
                UTIL.safeFrameCommunicationProtocol(msg);
                BIDMgr.getBidById.calledWith(1).should.be.true;
                bidDetailsStub.bid.getAdapterID.called.should.be.true;
                UTIL.vLogInfo.calledWith(bidDetailsStub.slotid, { type: 'disp', adapter: commonAdapterID }).should.be.true;
                BIDMgr.executeMonetizationPixel.calledWith(bidDetailsStub.slotid, bidDetailsStub.bid).should.be.true;
                UTIL.resizeWindow.calledWith(window.document, bidDetailsStub.bid.width, bidDetailsStub.bid.height, bidDetailsStub.slotid).should.be.true;
                msg.source.postMessage.calledWith(window.JSON.stringify({
                    pwt_type: 2,
                    pwt_bid: bidDetailsStub.bid
                }), 1).should.be.true;
                done();
            });
        });

        describe('##when pwt_type is 2', function() {
            beforeEach(function(done) {
                msg.data = '{"pwt_type":2,"pwt_bidID":1,"pwt_origin":1,"pwt_bid":{"width":400,"adHtml":"<html> ad content goes here </html>","adUrl":"http://ad.sever.url/path/to/add.html","height":200}}';
                done();
            });

            it('should return if isSafeFrame flag is not set', function(done) {
                window.PWT.isSafeFrame = false;
                UTIL.safeFrameCommunicationProtocol(msg);
                done();
            });

            describe('### when bid has adHtml', function() {
                it('should have called UTIL.createInvisibleIframe', function(done) {
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.createInvisibleIframe.called.should.be.true;
                    iFrameStub.setAttribute.called.should.be.true;
                    done();
                });

                it('should have thrown if iframe is not generated', function(done) {
                    UTIL.createInvisibleIframe.returns(false);
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.logError.calledWith('Error in rendering creative in safe frame.').should.be.true;
                    UTIL.log.calledWith('Rendering synchronously.').should.be.true;
                    UTIL.displayCreative.called.should.be.true;
                    done();
                });

                it('should have thrown if iframe doenst have contentWindow', function(done) {
                    iFrameStub.contentWindow = false;
                    UTIL.createInvisibleIframe.returns(iFrameStub);
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.logError.calledWith('Error in rendering creative in safe frame.').should.be.true;
                    UTIL.log.calledWith('Rendering synchronously.').should.be.true;
                    UTIL.displayCreative.called.should.be.true;
                    done();
                });

                it('should have thrown if iframeDoc is invalid', function(done) {
                    iFrameStub.contentWindow.document = false;
                    UTIL.createInvisibleIframe.returns(iFrameStub);
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.logError.calledWith('Error in rendering creative in safe frame.').should.be.true;
                    UTIL.log.calledWith('Rendering synchronously.').should.be.true;
                    UTIL.displayCreative.called.should.be.true;
                    done();
                });

                it('should have thrown if iframeDoc is invalid', function(done) {
                    UTIL.createInvisibleIframe.returns(iFrameStub);
                    UTIL.safeFrameCommunicationProtocol(msg);
                    var content = content = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><scr' + 'ipt>inDapIF=true;</scr' + 'ipt></head>';
                    content += '<body>';
                    content += "<script>var $sf = window.parent.$sf;<\/script>";
                    content += "<script>setInterval(function(){try{var fr = window.document.defaultView.frameElement;fr.width = window.parent.document.defaultView.innerWidth;fr.height = window.parent.document.defaultView.innerHeight;}catch(e){}}, 200);</script>";
                    content += "<html> ad content goes here </html>";
                    content += '</body></html>';
                    iFrameStub.contentWindow.document.write.calledWith(content).should.be.true;
                    done();
                });
            });

            describe('## when bid object doenst have adHtml', function() {
                beforeEach(function(done) {
                    msg.data = '{"pwt_type":2,"pwt_bidID":1,"pwt_origin":1,"pwt_bid":{"width":400,"adUrl":"http://ad.sever.url/path/to/add.html","height":200}}';
                    done();
                });

                it('should have called UTIL.writeIframe', function(done) {
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.writeIframe.calledWith(window.document, "http://ad.sever.url/path/to/add.html", 400, 200, "").should.be.true;
                    done();
                });
            });

            describe('## when bid object doenst have either adHtml or adUrl', function() {
                beforeEach(function(done) {
                    msg.data = '{"pwt_type":2,"pwt_bidID":1,"pwt_origin":1,"pwt_bid":{"width":400,"height":200}}';
                    done();
                });

                it('should do what...', function(done) {
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.logWarning.calledWith("creative details are not found").should.be.true;
                    UTIL.createInvisibleIframe.called.should.be.false;
                    done();
                });
            });
        });

        describe('##when pwt_type is 3', function() {
            beforeEach(function(done) {
                msg.data = '{"pwt_type":3,"pwt_bidID":1,"pwt_origin":1,"pwt_action":"impTrackers"}';
                done();
            });

            afterEach(function(done){
                msg.data = null;
                done();
            })

            it('should have called vLogInfo and should have called fireTracker with impTrackers', function(done) {
                UTIL.safeFrameCommunicationProtocol(msg);
                BIDMgr.getBidById.calledWith(1).should.be.true;
                BIDMgr.fireTracker.calledWith(bidDetailsStub.bid, "impTrackers").should.be.true;
                done();
            });

            it('should have called vLogInfo and should have called fireTracker with click action', function(done) {
                msg.data = '{"pwt_type":3,"pwt_bidID":1,"pwt_origin":1,"pwt_action":"click"}';
                UTIL.safeFrameCommunicationProtocol(msg);
                BIDMgr.getBidById.calledWith(1).should.be.true;
                bidDetailsStub.bid.getAdapterID.called.should.be.true;
                BIDMgr.fireTracker.calledWith(bidDetailsStub.bid, "click").should.be.true;
                done();
            });

        });
    });

    describe('#addMessageEventListenerForSafeFrame', function() {
        var theWindow = null;
        beforeEach(function(done) {
            theWindow = window;
            sinon.spy(UTIL, "addMessageEventListener");
            done();
        });

        afterEach(function(done) {
            theWindow = null;
            UTIL.addMessageEventListener.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.addMessageEventListenerForSafeFrame.should.be.a('function');
            done();
        });

        it('should have called addMessageEventListener', function(done) {
            UTIL.addMessageEventListenerForSafeFrame(theWindow);
            UTIL.addMessageEventListener.calledWith(theWindow, UTIL.safeFrameCommunicationProtocol).should.be.true;
            done();
        });
    });

    describe('#getElementLocation', function() {
        var el = null;
        var rectStub = null;

        beforeEach(function(done) {
            rectStub = {
                "left": 100,
                "top": 50
            };
            el = {
                getBoundingClientRect: function() {
                    return rectStub;
                },
                "offsetLeft": 100,
                "offsetTop": 50,
                "offsetParent": null,
            };
            sinon.spy(el, "getBoundingClientRect");
            sinon.stub(UTIL, "isFunction").returns(true);
            done();
        });

        afterEach(function(done) {
            el.getBoundingClientRect.restore();
            UTIL.isFunction.restore();
            el = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.getElementLocation.should.be.a('function');
            done();
        });

        it('should return object with x and y position of the element', function(done) {
            UTIL.getElementLocation(el).should.be.deep.equal({
                x: 100,
                y: 50
            });
            done();
        });

        it('should have called isFunction', function(done) {
            UTIL.getElementLocation(el);
            UTIL.isFunction.called.should.be.true;
            UTIL.isFunction.returned(true).should.be.true;
            el.getBoundingClientRect.called.should.be.true;
            done();
        });

        it('should have returned location object when element passed doenst have getBoundingClientRect function', function(done) {
            UTIL.isFunction.returns(false);
            UTIL.getElementLocation(el).should.be.deep.equal({
                x: 100,
                y: 50
            });;
            UTIL.isFunction.called.should.be.true;
            UTIL.isFunction.returned(false).should.be.true;
            el.getBoundingClientRect.called.should.be.false;
            done();
        });
    });

    describe('#createVLogInfoPanel', function() {
        var divID = null,
            dimensionArray = null;
        var elementStub = null;
        var posStub = null;
        var infoPanelElementStub = null;
        var closeImageStub = null;

        beforeEach(function(done) {
            divID = commonDivID;
            UTIL.visualDebugLogIsEnabled = true;
            elementStub = {
                parentNode: {
                    insertBefore: function() {
                        return "insertBefore";
                    }
                }
            };
            dimensionArray = [
                [1024, 120]
            ];
            sinon.spy(elementStub.parentNode, "insertBefore");
            sinon.stub(window.document, "getElementById");
            window.document.getElementById.withArgs(divID).returns(elementStub);
            window.document.getElementById.withArgs(divID + '-pwtc-info').returns(false);

            sinon.stub(window.document, "createElement");
            infoPanelElementStub = {
                "id": "div_id",
                "style": "none",
                appendChild: function() {
                    return "appendChild";
                }
            };
            sinon.spy(infoPanelElementStub, "appendChild");
            window.document.createElement.withArgs("div").returns(infoPanelElementStub);
            closeImageStub = {
                "src": "",
                "style": "",
                "title": "",
                "onclick": function() {
                    return "onclick";
                }
            };
            window.document.createElement.withArgs("img").returns(closeImageStub);
            window.document.createElement.withArgs("br").returns(infoPanelElementStub);
            posStub = {
                x: 200,
                y: 400
            };
            sinon.stub(UTIL, "getElementLocation").returns(posStub);
            sinon.stub(UTIL, "isUndefined");
            sinon.spy(window.document, "createTextNode");

            done();
        });

        afterEach(function(done) {
            window.document.getElementById.restore();
            UTIL.isUndefined.restore();
            UTIL.getElementLocation.restore();
            infoPanelElementStub.appendChild.restore();
            window.document.createTextNode.restore();
            window.document.createElement.restore();
            elementStub.parentNode.insertBefore.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.createVLogInfoPanel.should.be.a('function');
            done();
        });

        it('should proceed only when visualDebugLogIsEnabled is enabled', function(done) {
            UTIL.visualDebugLogIsEnabled = false;
            UTIL.createVLogInfoPanel(divID, dimensionArray);
            done();
        });

        it('should have called doc.getElementById', function(done) {
            UTIL.createVLogInfoPanel(divID, dimensionArray);
            window.document.getElementById.calledWith(divID).should.be.true;
            done();
        });

        it('should have called doc.getElementById', function(done) {
            UTIL.createVLogInfoPanel(divID, dimensionArray);
            window.document.createElement.calledWith("img").should.be.true;
            window.document.createElement.calledWith("div").should.be.true;
            window.document.createElement.calledWith("br").should.be.true;

            expect(infoPanelElementStub.id).to.be.equal(divID + '-pwtc-info');
            expect(infoPanelElementStub.style).to.be.equal('position: absolute; /*top: ' + posStub.y + 'px;*/ left: ' + posStub.x + 'px; width: ' + dimensionArray[0][0] + 'px; height: ' + dimensionArray[0][1] + 'px; border: 1px solid rgb(255, 204, 52); padding-left: 11px; background: rgb(247, 248, 224) none repeat scroll 0% 0%; overflow: auto; z-index: 9999997; visibility: hidden;opacity:0.9;font-size:13px;font-family:monospace;');

            expect(closeImageStub.src).to.be.equal(UTIL.metaInfo.protocol + "ads.pubmatic.com/AdServer/js/pwt/close.png");
            expect(closeImageStub.style).to.be.equal('cursor:pointer; position: absolute; top: 2px; left: ' + (posStub.x + dimensionArray[0][0] - 16 - 15) + 'px; z-index: 9999998;');
            expect(closeImageStub.title).to.be.equal('close');

            elementStub.parentNode.insertBefore.calledWith(infoPanelElementStub, elementStub).should.be.true;
            done();
        });

        it('should not have proceeded when div with \'-pwtc-info\' is missing', function(done) {
            UTIL.isUndefined.returns(true);
            UTIL.createVLogInfoPanel(divID, dimensionArray);
            window.document.createElement.calledWith("img").should.be.false;
            window.document.createElement.calledWith("div").should.be.false;
            window.document.createElement.calledWith("br").should.be.false;
            elementStub.parentNode.insertBefore.calledOnce.should.be.false;
            done();
        });
    });

    describe('#realignVLogInfoPanel', function() {
        var divID = null;
        var elementStub = null;
        var infoPanelElementStub = null;

        beforeEach(function(done) {
            divID = commonDivID;
            elementStub = {
                clientHeight: 768
            };
            sinon.stub(window.document, "getElementById").returns(elementStub);
            infoPanelElementStub = {
                style: {
                    visibility: "visible",
                    left: 100,
                    height: 100,
                }
            };
            window.document.getElementById.withArgs(divID + '-pwtc-info').returns(infoPanelElementStub);
            sinon.stub(UTIL, "getElementLocation").returns({
                x: 200
            });
            UTIL.visualDebugLogIsEnabled = true;
            done();
        });

        afterEach(function(done) {
            window.document.getElementById.restore();
            UTIL.getElementLocation.restore();
            infoPanelElementStub = null;
            divID = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.realignVLogInfoPanel.should.be.a('function');
            done();
        });

        it('should proceed only visualDebugLogIsEnabled is enabled', function(done) {
            UTIL.visualDebugLogIsEnabled = false;
            UTIL.realignVLogInfoPanel(divID);
            window.document.getElementById.called.should.be.false;
            done();
        });

        it('should have changed infoPanelElement properties', function(done) {
            UTIL.realignVLogInfoPanel(divID);
            infoPanelElementStub.should.deep.equal({
                style: {
                    visibility: "visible",
                    left: "200px",
                    height: "768px",
                }
            });
            window.document.getElementById.calledWith(divID).should.be.true;
            window.document.getElementById.calledWith(divID + '-pwtc-info').should.be.true;
            UTIL.getElementLocation.calledWith(elementStub).should.be.true;
            done();
        });
    });

    describe('#vLogInfo', function() {
        var divID = null,
            infoObject = null;
        var infoPanelElementStub = null;

        beforeEach(function(done) {
            divID = commonDivID;

            infoObject = {
                type: "bid",
                latency: 100,
                bidder: "pubmatic",
                adapter: "",
                s2s: false,
                bidDetails: {
                    getNetEcpm: function() {
                        return 4.0;
                    },
                    getGrossEcpm: function() {
                        return 4.0;
                    },
                    getPostTimeoutStatus: function() {
                        return true;
                    },
                    getAdapterID: function() {
                        return "pubmatic";
                    },
                }
            };

            sinon.spy(infoObject.bidDetails, "getGrossEcpm");
            sinon.stub(infoObject.bidDetails, "getPostTimeoutStatus");
            sinon.spy(infoObject.bidDetails, "getAdapterID");
            sinon.spy(infoObject.bidDetails, "getNetEcpm");

            infoPanelElementStub = {
                appendChild: function() {
                    return "appendChild";
                }
            };

            sinon.stub(infoPanelElementStub, "appendChild");
            sinon.stub(window.document, "getElementById").returns(infoPanelElementStub);

            sinon.stub(window.document, "createTextNode");
            sinon.stub(window.document, "createElement");
            UTIL.visualDebugLogIsEnabled = true;
            done();
        });

        afterEach(function(done) {
            window.document.getElementById.restore();
            infoPanelElementStub.appendChild.restore();

            window.document.createTextNode.restore();
            window.document.createElement.restore();

            infoObject.bidDetails.getNetEcpm.restore();
            infoObject.bidDetails.getGrossEcpm.restore();
            infoObject.bidDetails.getPostTimeoutStatus.restore();
            infoObject.bidDetails.getAdapterID.restore();
            infoObject = null;

            done();
        });

        it('is a function', function(done) {
            UTIL.vLogInfo.should.be.a('function');
            done();
        });

        it('should proceed only if visualDebugLogIsEnabled is enabled', function(done) {
            UTIL.visualDebugLogIsEnabled = false;
            UTIL.vLogInfo(divID, infoObject);
            window.document.getElementById.called.should.be.false;
            infoPanelElementStub.appendChild.called.should.be.false;
            done();
        });

        it('should have created the text node when type of the infoObject is bid with proper message being generated but getPostTimeoutStatus is false', function(done) {
            infoObject.bidDetails.getPostTimeoutStatus.returns(false);
            infoObject.type = "bid";
            UTIL.vLogInfo(divID, infoObject);
            infoObject.bidDetails.getNetEcpm.called.should.be.true;
            infoObject.bidDetails.getGrossEcpm.called.should.be.true;
            window.document.createTextNode.calledWith("Bid: " + infoObject.bidder + ": " + infoObject.bidDetails.getNetEcpm() + "(" + infoObject.bidDetails.getGrossEcpm() + ")USD :" + infoObject.latency + "ms").should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
            done();
        });

        it('should have created the text node when type of the infoObject is bid with proper message being generated but getPostTimeoutStatus is true and latency is negative', function(done) {
            infoObject.bidDetails.getPostTimeoutStatus.returns(true);
            infoObject.type = "bid";
            infoObject.latency = -10;
            UTIL.vLogInfo(divID, infoObject);
            infoObject.bidDetails.getNetEcpm.called.should.be.true;
            infoObject.bidDetails.getGrossEcpm.called.should.be.true;
            window.document.createTextNode.calledWith("Bid: " + infoObject.bidder + ": " + infoObject.bidDetails.getNetEcpm() + "(" + infoObject.bidDetails.getGrossEcpm() + ")USD :" + 0 + "ms" + ": POST-TIMEOUT").should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
            done();
        });

        it('should have created the text node when type of the infoObject is \'win-bid\' with proper message being generated', function(done) {
            infoObject.type = "win-bid";
            UTIL.vLogInfo(divID, infoObject);
            window.document.createTextNode.calledWith("Winning Bid: " + infoObject.bidDetails.getAdapterID() + ": " + infoObject.bidDetails.getNetEcpm() + "USD").should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
            done();
        });

        it('should have created the text node when type of the infoObject is \'win-bid\' and adServerCurrency is set with proper message being generated', function(done) {
            infoObject.type = "win-bid";
            UTIL.vLogInfo(divID, infoObject);
            window.document.createTextNode.calledWith("Winning Bid: " + infoObject.bidDetails.getAdapterID() + ": " + infoObject.bidDetails.getNetEcpm() + "USD").should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;

            infoObject.adServerCurrency = "GBP";
            UTIL.vLogInfo(divID, infoObject);
            window.document.createTextNode.calledWith("Winning Bid: " + infoObject.bidDetails.getAdapterID() + ": " + infoObject.bidDetails.getNetEcpm() + infoObject.adServerCurrency).should.be.true;

            infoObject.adServerCurrency = "0";
            UTIL.vLogInfo(divID, infoObject);
            window.document.createTextNode.calledWith("Winning Bid: " + infoObject.bidDetails.getAdapterID() + ": " + infoObject.bidDetails.getNetEcpm() + "USD").should.be.true;
            done();
        });

        it('should have created the text node when type of the infoObject is \'win-bid-fail\' with proper message being generated', function(done) {
            infoObject.type = "win-bid-fail";
            UTIL.vLogInfo(divID, infoObject);
            infoPanelElementStub.appendChild.called.should.be.true;
            window.document.createTextNode.calledWith("There are no bids from PWT").should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
            done();
        });

        it('should have created the text node when type of the infoObject is \'hr\' with proper message being generated', function(done) {
            infoObject.type = "hr";
            UTIL.vLogInfo(divID, infoObject);
            infoPanelElementStub.appendChild.called.should.be.true;
            window.document.createTextNode.calledWith("----------------------").should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
            done();
        });

        it('should have created the text node when type of the infoObject is \'disp\' with proper message being generated', function(done) {
            infoObject.type = "disp";
            UTIL.vLogInfo(divID, infoObject);
            infoPanelElementStub.appendChild.called.should.be.true;
            window.document.createTextNode.calledWith("Displaying creative from " + infoObject.adapter).should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
            done();
        });
    });

    describe('#getExternalBidderStatus', function() {
        beforeEach(function(done) {
            window.OWT = {
            	notifyCount: 0,
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
            window.OWT = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.getExternalBidderStatus.should.be.a('function');
            done();
        });

        it('should return true if empty array of divIds is passed', function(done) {
            UTIL.getExternalBidderStatus([]).should.be.true;
            done();
        });

        it('should return false if external bidder not responded', function(done) {
            UTIL.getExternalBidderStatus(["Div1"]).should.be.false;
            done();
        });

        it('should return true if external bidder already responded', function(done) {
            UTIL.getExternalBidderStatus(["Div2"]).should.be.true;
            done();
        });
    });

    describe('#resetExternalBidderStatus', function() {
        beforeEach(function(done) {
            window.OWT = {
            	notifyCount: 0,
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
            window.OWT = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.resetExternalBidderStatus.should.be.a('function');
            done();
        });

        it('should not update externalBidderStatuses obj if array of empty div is passed', function(done) {
            UTIL.resetExternalBidderStatus([]);
            window.OWT.externalBidderStatuses.should.deep.equal({
              Div1: { id: 0, status: false },
              Div2: { id: 1, status: true },
            });
            done();
        });

        it('should update externalBidderStatuses.Div1 obj if Div1 is passed', function(done) {
            UTIL.resetExternalBidderStatus(["Div1"]);
            window.OWT.externalBidderStatuses.should.deep.equal({
              "Div1": undefined,
              "Div2": { id: 1, status: true },
            });
            done();
        });

        it('should update externalBidderStatuses obj if Div1, Div2 is passed', function(done) {
            UTIL.resetExternalBidderStatus(["Div1", "Div2"]);
            window.OWT.externalBidderStatuses.should.deep.equal({
              "Div1": undefined,
              "Div2": undefined,
            });
            done();
        });
    });

    describe('#getAdUnitConfig', function() {
        var slotConfiguration, sizes, currentSlot;
        
        beforeEach(function(done) {
            sinon.spy(UTIL, "isOwnProperty");
            slotConfiguration ={
                configPattern:"_DIV_", // Or it Could be _AU_
                config:{
                    "DIV_1":{
                        banner:{
                            enabled:true
                        },
                        native:{
                            enabled: true,
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
                    },
                    "DIV_2":{
                        "banner":{
                            enabled:true
                        },
                        "native":{
                            enabled: true,
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
                        "video": {
                            "enabled": true,
                            "config": {
                                "context":"instream",
                                "connectiontype": [1, 2, 6],
                                "minduration": 10,
                                "maxduration": 50,
                                "battr": [
                                    6,
                                    7
                                ],
                                "skip": 1,
                                "skipmin": 10,
                                "skipafter": 15
                            }
                        }
                    }
            }};
            sinon.stub(CONFIG,"getSlotConfiguration").returns(slotConfiguration);
            sizes = [[300,250]];
            currentSlot = { 
                getSizes: function(){
                    return [[300,250]];
                },
                getAdUnitID: function(){
                    return "testAdUnit";
                },
                getDivID: function() {
                    return commonDivID;
                },
                getAdUnitIndex: function(){
                    return 0;
                }
            }
            sinon.spy(currentSlot, "getDivID");
            sinon.spy(currentSlot, "getSizes");
            sinon.spy(currentSlot, "getAdUnitID");
            sinon.spy(currentSlot, "getAdUnitIndex");
            done();
        });

        afterEach(function(done) {
            slotConfiguration = null;
            sizes = null;
            commonDivID = "DIV_1";
            currentSlot.getDivID.restore();
            currentSlot.getSizes.restore();
            currentSlot.getAdUnitID.restore();
            currentSlot.getAdUnitIndex.restore();
            CONFIG.getSlotConfiguration.restore();
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.getAdUnitConfig.should.be.a('function');
            done();
        });

        it('should return mediaTypeObject with Native and Banner if config is present',function(done){
            var expectedResult =  { 
                native: {
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
                },
                banner: {
                    sizes: sizes
                }
            }
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.deep.equal(expectedResult);
            done();
        });
        
        it('should return mediaTypeObject with Native only if for that kgpv banner is disabled',function(done){
            slotConfiguration["config"]["DIV_1"].banner.enabled= false;
            var expectedResult =  { 
                native: {
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
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return only banner if not matching kgpv is found', function(done){
            var expectedResult =  { 
                banner: {
                    sizes: sizes
                }
            };
            commonDivID = "DIV_3";
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return only banner if no configuration found for native', function(done){
            delete slotConfiguration["config"]["DIV_1"].native;
            var expectedResult =  { 
                banner: {
                    sizes: sizes
                }
            };
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return only video if both banner and native is disabled for slot',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_2");
            slotConfiguration["config"]["DIV_2"].banner.enabled= false;
            slotConfiguration["config"]["DIV_2"].native.enabled= false;
            var expectedResult =  {"video":{"context":"instream","connectiontype":[1,2,6],"minduration":10,"maxduration":50,"battr":[6,7],"skip":1,"skipmin":10,"skipafter":15}};
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject;
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return video, banner and native if all are enabled ',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_2");
            var expectedResult = {"native":{"image":{"required":true,"sizes":[150,50]},"title":{"required":true,"len":80},"sponsoredBy":{"required":true},"body":{"required":true}},"video":{"context":"instream","connectiontype":[1,2,6],"minduration":10,"maxduration":50,"battr":[6,7],"skip":1,"skipmin":10,"skipafter":15},"banner":{"sizes":[[300,250]]}};
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject;
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return only banner if video and native are disbaled in default ',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_2");
            slotConfiguration.config["default"] ={
                video:{
                    enabled:false
                },
                native:{
                    enabled:false
                },
                banner:{
                    enabled:true
                }
            };
            var expectedResult = {"banner":{"sizes":[[300,250]]}};
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject;
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return only native if banner and video are disbaled in default ',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_2");
            slotConfiguration.config["default"] ={
                video:{
                    enabled:false
                },
                native:{
                    enabled:true
                },
                banner:{
                    enabled:false
                }
            };
            var expectedResult = {"native":{"image":{"required":true,"sizes":[150,50]},"title":{"required":true,"len":80},"sponsoredBy":{"required":true},"body":{"required":true}}};
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject;
            result.should.deep.equal(expectedResult);
            done();
        });             

        it('should return only video if banner and native are disbaled in default ',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_2");
            slotConfiguration.config["default"] ={
                video:{
                    enabled:true
                },
                native:{
                    enabled:false
                },
                banner:{
                    enabled:false
                }
            };
            var expectedResult = {"video":{"context":"instream","connectiontype":[1,2,6],"minduration":10,"maxduration":50,"battr":[6,7],"skip":1,"skipmin":10,"skipafter":15}};
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject;
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return empty object if video, banner and native are disbaled in default ',function(done){
            slotConfiguration.config["default"] ={
                video:{
                    enabled:false
                },
                native:{
                    enabled:false
                },
                banner:{
                    enabled:false
                }
            };
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject;
            result.should.deep.equal({});
            done();
        });

        it('should return video object from default if config not found for specific slot and default is on ',function(done){
            slotConfiguration.config["default"] ={
                video:{
                    enabled:false,
                    config:{
                        "mimes":["mp4"]
                    }
                },
                native:{
                    enabled:false
                },
                banner:{
                    enabled:false
                }
            };
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject;
            result.should.deep.equal({});
            done();
        });

        it('should return renderer if present with the div',function(done){
            slotConfiguration.config["DIV_1"].renderer = {
                "url" :"someUrl"
            }
            var expectedResult = {
                "url" :"someUrl"
            }
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).renderer
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.deep.equal(expectedResult);
            done();
        });

        it('should not return renderer if not present with the div',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_2");
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).renderer
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.undefined
            done();
        });

        it('should return renderer if present in default',function(done){
            slotConfiguration.config["default"] = {
                renderer : {
                    "url" :"someUrl"
                }
            }
            var expectedResult = {
                "url" :"someUrl"
            }
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).renderer
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.deep.equal(expectedResult);
            done();
        });

        it('should not return renderer if not present in default and div',function(done){
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).renderer
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.undefined;
            done();
        });

        it('should return div renderer if present in default and div',function(done){
            slotConfiguration.config["DIV_1"].renderer = {
                "url" :"divurl"
            }
            slotConfiguration.config["default"] = {
                renderer : {
                    "url" :"defaulturl"
                }
            }
            var expectedResult = {
                "url" :"divurl"
            }
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).renderer
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.deep.equal(expectedResult);
            done();
        });


        it('should return partnerConfig if present with the div',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_1");
            slotConfiguration["config"]["DIV_1"].video = {
                enabled:true,
                config: {
                    "someconfig" :"someconfigvalue"
                },
                partnerConfig : {
                    "pubmatic": {
                        "outstreamAU" :"pubmatictest"
                    }
                }
            };
            var expectedResult = {
                "pubmatic":{
                    "outstreamAU" :"pubmatictest"
                }
            };
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject.partnerConfig;
            expect(result).to.be.deep.equal(expectedResult);
            done();
        });

        it('should not return partnerConfig if not present with the div',function(done){
            currentSlot.getDivID.restore();
            sinon.stub(currentSlot, "getDivID").returns("DIV_2");
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject.partnerConfig
            expect(result).to.be.undefined
            done();
        });

        it('should return partnerConfig if present in default',function(done){
            CONFIG.getSlotConfiguration.restore();
            slotConfiguration ={
                configPattern:"_DIV_", // Or it Could be _AU_
                config:{
                }
            }
            slotConfiguration.config["default"] ={
                video:{
                    enabled:true,
                    config:{
                        "someconfig" :"someconfigvalue"
                    },
                    partnerConfig : {
                        "pubmatic":{
                            "outstreamAU" :"pubmatictest"
                        }
                    }
                },
                native:{
                    enabled:false
                },
                banner:{
                    enabled:true
                }
            };
            sinon.stub(CONFIG,"getSlotConfiguration").returns(slotConfiguration);
            var expectedResult = {
                "pubmatic":{
                    "outstreamAU" :"pubmatictest"
                }
            }
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject.partnerConfig;
            console.log('Result for the partnerConfig is ' , JSON.stringify(result));

            expect(result).to.be.deep.equal(expectedResult);
            done();
        });

        it('should not return partnerConfig if not present in default and div',function(done){
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject.partnerConfig;
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.undefined;
            done();
        });

        it('should return div partnerConfig if present in default and div',function(done){
            slotConfiguration.config["default"] = {};
            slotConfiguration.config["default"].video = {
                enabled:true,
                config:{
                    "someconfig" :"defaultsomeconfigvalue"
                },
                partnerConfig : {
                    "pubmatic":{
                        "outstreamAU" :"defaultpubmatictest"
                    }
                }
            };
             slotConfiguration.config["DIV_1"].video = {
                enabled:true,
                config:{
                    "someconfig" :"someconfigvalue"
                },
                partnerConfig : {
                    "pubmatic":{
                        "outstreamAU" :"pubmatictest"
                    }
                }
            };
            var expectedResult = {
                "pubmatic":{
                    "outstreamAU" :"pubmatictest"
                }
             }
            var result = UTIL.getAdUnitConfig(sizes, currentSlot).mediaTypeObject.partnerConfig
            console.log("Result is " + JSON.stringify(result));
            expect(result).to.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getAdFormatFromBidAd', function(){
        var adFormat, videoAdString, nativeAdString, bannerAdString;

        beforeEach(function(done){
            adFormat= undefined;
            videoAdString= '<?xml version="1.0" encoding="UTF-8"?><VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0"><Ad id="4794680078"><Wrapper><AdSystem>GDFP</AdSystem><VASTAdTagURI><![CDATA[http://ow.pubmatic.com/cache?uuid=910ad57b-fddd-4ddf-a94f-cc597930adeb]]></VASTAdTagURI><Error><![CDATA[https://pubads.g.doubleclick.net/pagead/conversion/?ai=BrL63LDqrXPu_GInDogO30o2ABZ31halFAAAAEAEg0fv0CDgAWLi43_-CBGDl6uaDvA6yAQx3d3cudGVzdC5jb226ARMzMjB4MjU0LDMzNngyNjlfeG1syAEF2gEbaHR0cDovL3d3dy50ZXN0LmNvbS8_cHd0dj0xwAIC4AIA6gIYLzE1NjcxMzY1L01HX1ZpZGVvQWRVbml0-AKF0h6AAwGQA5oImAPgA6gDAeAEAdIFBhCOhqTuEZAGAaAGJNgHAOAHH9IIBwiAYRABGAE&sigh=ovOJ-wYjWfs&label=videoplayfailed[ERRORCODE]]]></Error><Impression><![CDATA[https://securepubads.g.doubleclick.net/pcs/view?xai=AKAOjssRKo6cE9xtv3Vb4p3oM4ZibMiNs08ryvPLLmuJiwYYFTaKC7utY2Li_vjzTfvcO2luVVYCl3j2uTRrkxTr68707p6Ccrex7TiIKb1kt1oROgJ3jDNSY2j9YQ1xSCB6LbPXwDUF6_HRjLgBA6vaTV_HS1-NUyGOk5jR_8WxWSwNK_tyKdqhhjn711kBzLk3IwdQ05wC_j31jB94zjWj6l8LRysGFoykRdciTyEYIZwx6KK1byUzL52qIlaIBGvzAW64omi-cCs&sig=Cg0ArKJSzF5yMoWclp4jEAE&adurl=]]></Impression><Creatives><Creative id="138243726392" sequence="1"> <Linear><VideoClicks><ClickTracking id="GDFP"><![CDATA[https://pubads.g.doubleclick.net/pcs/click?xai=AKAOjstvB03z7ObaZOr6VhAeAaRVPBUY_gg6C5Ufe3K899AeYrg2SHOOpwS5JQuXRzdG6ug9BLPgZDm4_vSZEQHfD681sq_J8yLtoe_kriDJuNJ_05UxH90rr5AvWd3AllOLUy_zz3UTzezIs1LnYhQZl1ke1TkSVHQEebLpH2SZgpP40Z10HQnknJVPGV0BCevR_Z7UK8Yz9Q4WjDEHg2oWoPZf0vA1UAPzyvRGACOfl2rcn5rjqATfRN4FvHhLhA6F3WMwoWQ&sig=Cg0ArKJSzH_dYYoGDUutEAE&urlfix=1]]></ClickTracking></VideoClicks></Linear></Creative></Creatives><Extensions><Extension type="geo"><Country>IN</Country><Bandwidth>4</Bandwidth><BandwidthKbps>20000</BandwidthKbps></Extension><Extension type="activeview"><CustomTracking><Tracking event="viewable_impression"><![CDATA[https://pubads.g.doubleclick.net/pagead/conversion/?ai=BrL63LDqrXPu_GInDogO30o2ABZ31halFAAAAEAEg0fv0CDgAWLi43_-CBGDl6uaDvA6yAQx3d3cudGVzdC5jb226ARMzMjB4MjU0LDMzNngyNjlfeG1syAEF2gEbaHR0cDovL3d3dy50ZXN0LmNvbS8_cHd0dj0xwAIC4AIA6gIYLzE1NjcxMzY1L01HX1ZpZGVvQWRVbml0-AKF0h6AAwGQA5oImAPgA6gDAeAEAdIFBhCOhqTuEZAGAaAGJNgHAOAHH9IIBwiAYRABGAE&sigh=ovOJ-wYjWfs&label=viewable_impression&acvw=[VIEWABILITY]&gv=[GOOGLE_VIEWABILITY]&ad_mt=[AD_MT]]]></Tracking><Tracking event="abandon"><![CDATA[https://pubads.g.doubleclick.net/pagead/conversion/?ai=BrL63LDqrXPu_GInDogO30o2ABZ31halFAAAAEAEg0fv0CDgAWLi43_-CBGDl6uaDvA6yAQx3d3cudGVzdC5jb226ARMzMjB4MjU0LDMzNngyNjlfeG1syAEF2gEbaHR0cDovL3d3dy50ZXN0LmNvbS8_cHd0dj0xwAIC4AIA6gIYLzE1NjcxMzY1L01HX1ZpZGVvQWRVbml0-AKF0h6AAwGQA5oImAPgA6gDAeAEAdIFBhCOhqTuEZAGAaAGJNgHAOAHH9IIBwiAYRABGAE&sigh=ovOJ-wYjWfs&label=video_abandon&acvw=[VIEWABILITY]&gv=[GOOGLE_VIEWABILITY]]]></Tracking></CustomTracking></Extension><Extension type="metrics"><FeEventId>LDqrXPqIGJLGoAPQz604</FeEventId><AdEventId>CPuFoMO7wOECFYmhaAodN2kDUA</AdEventId></Extension><Extension type="ShowAdTracking"><CustomTracking><Tracking event="show_ad"><![CDATA[https://securepubads.g.doubleclick.net/pcs/view?xai=AKAOjsskNiPPjzZVPnZTBoKXb_68n48JD6kaep6DzszP8q8TNeVevCWVxd9OtqdyPGE08DACHmQ3uWvMuuPLGoB7OwX-pWHFAGkybgx_fK17KoOoYPQFo5GhdtsUvPOE5yria9eKwS1BZq2rWr07Y85DJDMBcfJZiaKPmInowRG292edDkl6KaA-rGAgxhgeOQt5hpU6HMTPpeVQuya7RrCmRcyydAhf2-sm7bp23l0R5LYOJHntFGwQ4ua_Q9e8TrrG2LMspXcyOV1TQQ&sig=Cg0ArKJSzBAXwIdOUAQvEAE&adurl=]]></Tracking></CustomTracking></Extension><Extension type="wrapper_info"><Duration>00:00:01</Duration></Extension><Extension type="video_ad_loaded"><CustomTracking><Tracking event="loaded"><![CDATA[https://pubads.g.doubleclick.net/pagead/conversion/?ai=BrL63LDqrXPu_GInDogO30o2ABZ31halFAAAAEAEg0fv0CDgAWLi43_-CBGDl6uaDvA6yAQx3d3cudGVzdC5jb226ARMzMjB4MjU0LDMzNngyNjlfeG1syAEF2gEbaHR0cDovL3d3dy50ZXN0LmNvbS8_cHd0dj0xwAIC4AIA6gIYLzE1NjcxMzY1L01HX1ZpZGVvQWRVbml0-AKF0h6AAwGQA5oImAPgA6gDAeAEAdIFBhCOhqTuEZAGAaAGJNgHAOAHH9IIBwiAYRABGAE&sigh=ovOJ-wYjWfs&label=video_ad_loaded]]></Tracking></CustomTracking></Extension></Extensions></Wrapper></Ad></VAST>';
            nativeAdString= '{"native":{"assets":[{"id":1,"required":0,"title":{"text":"Lexus - Luxury vehicles company"}},{"id":2,"img":{"h":150,"url":"https://stagingnyc.pubmatic.com:8443//sdk/lexus_logo.png","w":150},"required":0},{"id":3,"img":{"h":428,"url":"https://stagingnyc.pubmatic.com:8443//sdk/28f48244cafa0363b03899f267453fe7%20copy.png","w":214},"required":0},{"data":{"value":"Goto PubMatic"},"id":4,"required":0},{"data":{"value":"Lexus - Luxury vehicles company"},"id":5,"required":0},{"data":{"value":"4"},"id":6,"required":0}],"imptrackers":["http://phtrack.pubmatic.com/?ts=1496043362&r=84137f17-eefd-4f06-8380-09138dc616e6&i=c35b1240-a0b3-4708-afca-54be95283c61&a=130917&t=9756&au=10002949&p=&c=10014299&o=10002476&wl=10009731&ty=1"],"link":{"clicktrackers":["http://ct.pubmatic.com/track?ts=1496043362&r=84137f17-eefd-4f06-8380-09138dc616e6&i=c35b1240-a0b3-4708-afca-54be95283c61&a=130917&t=9756&au=10002949&p=&c=10014299&o=10002476&wl=10009731&ty=3&url="],"url":"http://www.lexus.com/"},"ver":1}}';
            bannerAdString = '<img src="http://ads.pubmatic.com/AdTag/728x90.png"></img><div style="position:absolute;left:0px;top:0px;visibility:hidden;"><img src="http://sin1-ib.adnxs.com/it?e=wqT_3QKqB6CqAwAAAwDWAAUBCIKHsdoFELzlh5jb&s=dfa92ae59f49b6052953a52fcc0152434618139a&referrer=http%253A%252F%252Febay.com%252Finte%252Fappnexus.html%253Fpwtvc%253D1%2526pwtv%253D2%2526profileid%253D2514"></div>'
            done();
        });

        afterEach(function(done){
            adFormat= videoAdString=nativeAdString=bannerAdString= undefined;
            done();
        });

        it('should be a function',function(done){
            UTIL.getAdFormatFromBidAd.should.be.a('function');
            done();
        });

        // it('should return video if ad html consists of video string ',function(done){
        //     var expectedResult = CONSTANTS.FORMAT_VALUES.VIDEO;
        //     var oParser = new DOMParser();
        //     var oDOM = oParser.parseFromString(videoAdString, "text/xml");
        //     var result =  UTIL.getAdFormatFromBidAd(oDOM);
        //     result.should.deep.equal(expectedResult);
        //     done();
        // });

        it('should return native if ad html consists of native string ',function(done){
            var expectedResult = CONSTANTS.FORMAT_VALUES.NATIVE
            var result =  UTIL.getAdFormatFromBidAd(nativeAdString);
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should return banner if ad html consists of banner string ',function(done){
            var expectedResult = CONSTANTS.FORMAT_VALUES.BANNER
            var result =  UTIL.getAdFormatFromBidAd(bannerAdString);
            result.should.deep.equal(expectedResult);
            done();
        });
    });

    describe('#handleHook', function(){
        it('is a function', function(done) {
            UTIL.handleHook.should.be.a('function');
            done();
        });

        it('executes a given hook function if available', function(done){
            var myHookData = '1';
            window.PWT.myHook = function(a, b, c){
                myHookData = a + b + c;
            };
            UTIL.handleHook('myHook', [1, 2, 3]);
            myHookData.should.equal(6);
            done();
        });

        it('does not executes a given hook if it is not a function', function(done){
            var myHookData = '1';
            window.PWT.myHook = '';
            UTIL.handleHook('myHook', [1, 2, 3]);
            myHookData.should.equal('1');
            done();
        });

    });

    describe('#getCurrencyToDisplay', function() {

        beforeEach(function(done){
            // sinon.stub(CONFIG, "getAdServerCurrency");
            done();
        });

        afterEach(function(done){
            // CONFIG.getAdServerCurrency.restore();
            done();
        });

        it('#is a function', function(done){
            UTIL.getCurrencyToDisplay.should.be.a('function');
            done();
        });

        it('Default test case, without currency module, it should return USD', function(done){
            sinon.stub(CONFIG, "getAdServerCurrency").returns(0);
            UTIL.getCurrencyToDisplay().should.equal('USD');
            CONFIG.getAdServerCurrency.restore();
            done();
        });

        it('Negative test case, owpbjs not present, it should return USD', function(done){
            sinon.stub(CONFIG, "getAdServerCurrency").returns('USD');
            UTIL.getCurrencyToDisplay().should.equal('USD');
            CONFIG.getAdServerCurrency.restore();
            done();
        });

        it('Negative test case, owpbjs.getConfig not present, it should return USD', function(done){
            sinon.stub(CONFIG, "getAdServerCurrency").returns('USD');
            window.owpbjs = {};
            UTIL.getCurrencyToDisplay().should.equal('USD');
            CONFIG.getAdServerCurrency.restore();
            window.owpbjs = undefined;
            done();
        });

        it('Negative test case, pbConf is null, it should return USD', function(done){
            sinon.stub(CONFIG, "getAdServerCurrency").returns('USD');
            window.owpbjs = {
                getConfig: function(){
                    return null;
                }
            };
            UTIL.getCurrencyToDisplay().should.equal('USD');
            CONFIG.getAdServerCurrency.restore();
            window.owpbjs = undefined;
            done();
        });

        it('Negative test case, pbConf.currency is not present, it should return USD', function(done){
            sinon.stub(CONFIG, "getAdServerCurrency").returns('USD');
            window.owpbjs = {
                getConfig: function(){
                    return {};
                }
            };
            UTIL.getCurrencyToDisplay().should.equal('USD');
            CONFIG.getAdServerCurrency.restore();
            window.owpbjs = undefined;
            done();
        });

        it('Negative test case, pbConf.currency.adServerCurrency is not present, it should return USD', function(done){
            sinon.stub(CONFIG, "getAdServerCurrency").returns('USD');
            window.owpbjs = {
                getConfig: function(){
                    return {
                        currency: {}
                    };
                }
            };
            UTIL.getCurrencyToDisplay().should.equal('USD');
            CONFIG.getAdServerCurrency.restore();
            window.owpbjs = undefined;
            done();
        });

        it('Positive test case, it should return currency set in prebid config', function(done){
            sinon.stub(CONFIG, "getAdServerCurrency").returns('USD');
            window.owpbjs = {
                getConfig: function(){
                    return {
                        currency: {
                            adServerCurrency: 'INR'
                        }
                    };
                }
            };
            UTIL.getCurrencyToDisplay().should.equal('INR');
            CONFIG.getAdServerCurrency.restore();
            window.owpbjs = undefined;
            done();
        });
    });

    describe('#getConfigFromRegex', function(){
        var klmsForPartner,generatedKey;
        beforeEach(function(done){
            klmsForPartner=[{"rx":{"DIV":"Div.*","AU":".*","SIZE":".*"},"rx_config":{"hashedKey":"5ae33b52a72ed31da279ec35b26710e0"}}];
            generatedKey="/43743431/DMDemo@Div1@728x90:0";
           done();

        });

        afterEach(function(done){
            done();
        });

        it('should return regex config if generated key matches the regex',function(done){
           var expectedResult = {"config":{"hashedKey":"5ae33b52a72ed31da279ec35b26710e0"},"regexPattern":".*@Div.*@.*"}
           UTIL.getConfigFromRegex(klmsForPartner, generatedKey).should.be.deep.equal(expectedResult);
           done();
        });

        it('should return regex config for other partner if genrated key matches the regex', function(done){
            klmsForPartner = [{"rx":{"DIV":"DiV.*","AU":".*","SIZE":".*"},"rx_config":{"placementId":"8801674"}},{"rx":{"DIV":"Div1","AU":".*","SIZE":".*"},"rx_config":{"placementId":"8801675"}}];
            generatedKey = "/43743431/DMDemo@Div1@728x90";
            var expectedResult = {"config":{"placementId":"8801675"},"regexPattern":".*@Div1@.*"}
            UTIL.getConfigFromRegex(klmsForPartner, generatedKey).should.be.deep.equal(expectedResult);
            done();
        });

        it('should return null if generated key does not matches the regex pattern', function(done){
            generatedKey = "/43743431/DMDemo@DiV1@728x90";
            expect(UTIL.getConfigFromRegex(klmsForPartner, generatedKey)).to.be.equal(null);
            done();
        });

        it('should return null if regex pattern is invalid', function(done){
            klmsForPartner=[{"rx":{"DIV":"Div.*","AU":".*","SIZE":"[0-9]++"},"rx_config":{"hashedKey":"5ae33b52a72ed31da279ec35b26710e0"}}];
            UTIL.logError.should.be.calledOnce;
            expect(UTIL.getConfigFromRegex(klmsForPartner, generatedKey)).to.be.equal(null);
            done();
        });
    });
    
    
    describe('#getUserIdParams', function() {
        var params;
        beforeEach(function(done) {
            params = {"name":"pubCommonId","storage.type":"cookie","storage.name":"_pubCommonId","storage.expires":"1825"}
            done();
        });

        afterEach(function(done) {
            params = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.getUserIdParams.should.be.a('function');
            done();
        });

        it('should return userId with valid params',function(done){
            var expectedResult = {"name":"pubCommonId","storage":{"type":"cookie","name":"_pubCommonId","expires":"1825"}};
            var result = UTIL.getUserIdParams(params);
            result.should.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getNestedObjectFromString', function() {
        var sourceObject,separator,key,value;
        beforeEach(function(done) {
            sourceObject = {};
            separator = ".";
            key = "params.init.member";
            value="nQjyizbdyF";
            done();
        });

        afterEach(function(done) {
            sourceObject = null;
            separator = null;
            key = null;
            value = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.getNestedObjectFromString.should.be.a('function');
            done();
        });

        it('should return userId with valid params',function(done){
            var expectedResult = {"params":{"init":{"member":"nQjyizbdyF"}}};
            var result = UTIL.getNestedObjectFromString(sourceObject,separator,key,value);
            result.should.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getNestedObjectFromArray', function() {
        var sourceObject, sourceArray , valueOfLastNode;
        beforeEach(function(done) {
            sourceObject = {"name":"pubCommonId"};
            sourceArray =["storage", "type"];
            valueOfLastNode = "cookie";
            done();
        });

        afterEach(function(done) {
            sourceObject = null;
            sourceArray = null;
            valueOfLastNode = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.getNestedObjectFromArray.should.be.a('function');
            done();
        });

        it('should return userId with valid params',function(done){
            var expectedResult = {"name":"pubCommonId","storage":{"type":"cookie"}};
            var result = UTIL.getNestedObjectFromArray(sourceObject,sourceArray,valueOfLastNode);
            result.should.deep.equal(expectedResult);
            done();
        });
    });

    describe('#isEmptyObject', function() {

        it('is a function', function(done) {
            UTIL.isEmptyObject.should.be.a('function');
            done();
        });

        it('should return false when non empty object is passed', function (done) {
            var obj = {"true":true};
            UTIL.isEmptyObject(obj).should.be.false;
            done();
        });

        it('should have returned false when non object is passed', function (done) {
            var num = 1234;
            UTIL.isEmptyObject(num).should.be.false;
            done();
        });

        it('should have returned false when empty object is passed', function (done) {
            var obj = {};
            UTIL.isEmptyObject(obj).should.be.true;
            done();
        });
    });

    describe('#getUserIdConfiguration', function() {
        beforeEach(function(done) {
            sinon.stub(CONFIG,"getIdentityPartners").returns({
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
            })
            done();
        });

        afterEach(function(done) {
            CONFIG.getIdentityPartners.restore();
            done();
        });

        it('is a function', function(done) {
            UTIL.getUserIdConfiguration.should.be.a('function');
            done();
        });

        it('should return userId with valid params',function(done){
            var expectedResult = [{"name":"pubCommonId","storage":{"type":"cookie","name":"_pubCommonId","expires":"1825"}},{"name":"digitrust","params":{"init":{"member":"nQjyizbdyF","site":"FL6whbX1IW"}},"redirects":"true","storage":{"type":"cookie","name":"somenamevalue","expires":"60"}}];
            var result = UTIL.getUserIdConfiguration();
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should exclude pubprovidedId if included in list of partners', function(done) {
            CONFIG.getIdentityPartners.restore();
            var expectedResult = [{"name":"pubCommonId","storage":{"type":"cookie","name":"_pubCommonId","expires":"1825"}}];
            sinon.stub(CONFIG,"getIdentityPartners").returns({
                pubCommonId: {
                    name: "pubCommonId",
                    "storage.type": "cookie",
                    "storage.name": "_pubCommonId",
                    "storage.expires": "1825"         
                },
                pubProvidedId: {
                    name:"pubProvidedId"
                }
            });
            var result = UTIL.getUserIdConfiguration();

            result.should.deep.equal(expectedResult);
            done();
        });
    });
    
    describe('#callHandlerFunctionForMapping',function(){
        var adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, generatedKeys, activeSlot, handlerFunction, addZeroBids,keyGenerationPattern,videoSlotName,keyGenerationPattern,obj;
        beforeEach(function(done){
            adapterID  = commonAdapterID;
            adUnits = "adUnits";
            keyGenerationPattern =  "_W_x_H_";
            adapterConfig = {
                kgp: "_W_x_H_",
                klm: {
                    "0x0": "some_value",
                    "300x250":"some_other_value"
                }
            };
            generatedKeys = ["300x250"];
            videoSlotName = ["0x0"];
            impressionID = "impressionID";
            slotConfigMandatoryParams = "slotConfigMandatoryParams";
            activeSlots = [new SLOT("slot_1"), new SLOT("slot_2")];
            activeSlots[0].setSizes([[300,250]]);
            activeSlots[1].setSizes([300,250]);
            obj = {
                handlerFunction : function(a,b,c,d,e,f,g,h,i,j) {
                    return "handlerFunction"
                }
            }
            UTIL.getPartnerParams = function(){
                return "parnterParams";
            }
            UTIL.checkMandatoryParams = function(){
                return true;
            }
            sinon.spy(UTIL,"checkMandatoryParams")
            sinon.spy(obj, "handlerFunction");
            addZeroBids = true;
            done();
        });

        afterEach(function(done) {
            adapterID = null;
            adUnits = null;
            adapterConfig = null;
            impressionID = null;
            videoSlotName = null;
            slotConfigMandatoryParams = null;
            keyGenerationPattern = null;
            activeSlots = null;
            generatedKeys = null;
            handlerFunction = null;
            addZeroBids = null;
            obj.handlerFunction.restore();
            UTIL.checkMandatoryParams.restore();
            done();
        });

        describe('flow for normal mapping',function(){

            it('should  call handler function',function(done){
                adapterConfig[CONSTANTS.CONFIG.REGEX_KEY_LOOKUP_MAP] = undefined;
                UTIL.forEachOnArray.should.be.calledOnce;
                UTIL.getConfigFromRegex.should.not.be.called;
                done();
            });

            it('should called handler function with video mapping',function(done){
                adapterConfig[CONSTANTS.CONFIG.REGEX_KEY_LOOKUP_MAP] = undefined;
                UTIL.callHandlerFunctionForMapping(adapterID,adUnits,adapterConfig,impressionID,slotConfigMandatoryParams,generatedKeys,activeSlots[0],obj.handlerFunction,false,keyGenerationPattern,videoSlotName);
                obj.handlerFunction.calledWith(adapterID,adUnits,adapterConfig,impressionID,videoSlotName[0],true,activeSlots[0],"parnterParams",activeSlots[0].getSizes()[0][0],activeSlots[0].getSizes()[0][1],undefined).should.be.true;
                done();
            });


            it('should called handler function with generated key if video mapping is not available',function(done){
                adapterConfig[CONSTANTS.CONFIG.REGEX_KEY_LOOKUP_MAP] = undefined;
                UTIL.callHandlerFunctionForMapping(adapterID,adUnits,adapterConfig,impressionID,slotConfigMandatoryParams,generatedKeys,activeSlots[0],obj.handlerFunction,false,keyGenerationPattern,undefined);
                obj.handlerFunction.calledWith(adapterID,adUnits,adapterConfig,impressionID,generatedKeys[0],true,activeSlots[0],"parnterParams",activeSlots[0].getSizes()[0][0],activeSlots[0].getSizes()[0][1],undefined).should.be.true;
                done();
            });

        });

        describe('flow for regex mapping',function(){

            it('should  call handler function',function(done){
                adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] = undefined;
                UTIL.forEachOnArray.should.be.calledOnce;
                UTIL.getConfigFromRegex.should.be.calledOnce;
                done();
            });
        });

        it('should create bid if addZeroBids is true',function(done){
            addZeroBids = true;
            BID.createBid.should.be.calledOnce;
            BIDMgr.setBidFromBidder.should.be.calledOnce;
            done();     
        });

        it('should create bid if addZeroBids is false',function(done){
            addZeroBids = false;
            BID.createBid.should.not.be.called;
            BIDMgr.setBidFromBidder.should.not.be.called;
            done();     
        });
    });

    describe('replaceAuctionPrice', function(){
        it('is a function', function(done) {
            UTIL.replaceAuctionPrice.should.be.a('function');
            done();
        });

        it('should replace auction price macro', function(done){
            var testAdHtml = "<html>Fake HTML ${AUCTION_PRICE}</html>";
            var expectedResult = "<html>Fake HTML 10.55</html>";
            var testbid = 10.55;
            expect(UTIL.replaceAuctionPrice(testAdHtml,testbid)).to.be.equal(expectedResult);
            done();
        });

        it('should not replace any other macro macro', function(done){
            var testAdHtml = "<html>Fake HTML ${DEAL_PRICE}</html>";
            var testbid = 10.55;
            expect(UTIL.replaceAuctionPrice(testAdHtml,testbid)).to.be.equal(testAdHtml);
            done();
        });

    });

    describe('#getDomainFromURL', function(){
        it('is a function', function(done) {
            UTIL.getDomainFromURL.should.be.a('function');
            done();
        });

        it('return correct value', function(done){
            var result = UTIL.getDomainFromURL('http://www.example.com/12xy45');
            result.should.equal('www.example.com');
            done();
        });
    });

    describe('#getDevicePlatform', function(){
        it('is a function', function(done) {
            UTIL.getDevicePlatform.should.be.a('function');
            done();
        });

        it('returns device as desktop if navigator does not consists of mobi', function(done){
            var result = UTIL.getDevicePlatform();
            result.should.equal(1);
            done();
        });

        // TODO: UnComment Below Test Cases once PhantomJs is replaced by ChromeHeadless in build.sh production and test mode
        // it('returns device as mobile if navigator consists of mobi', function(done){
        //     navigator.__defineGetter__('userAgent', function(){
        //         return 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36';
        //     });
        //     var result = UTIL.getDevicePlatform();
        //     result.should.equal(2);
        //     done();
        // });

        // it('returns unknown if ua is not available', function(done){
        //     navigator.__defineGetter__('userAgent', function(){
        //         return '';
        //     });
        //     var result = UTIL.getDevicePlatform();
        //     result.should.equal(3);
        //     done();
        // });
    });

    describe('#getOWConfig', function() {
        beforeEach(function(done){
            done();
        });
        afterEach(function(done){
            done();
        });
        it("is a function", function(done) {
            UTIL.getOWConfig.should.be.a('function');
            done();
        });

        it('should return timeout, owversion and pbversion',function(done){
            var expectedResult = {"timeout":3000,"openwrap_version":"v21.4.0","prebid_version":"v4.33.0","profileId":"46","profileVersionId":"4"} ;
            var result = UTIL.getOWConfig();
            console.log("Version Details:"+ JSON.stringify(result));
            result.should.be.deep.equal(expectedResult);
            done();
        });

        it('should not return owversion and pbversion if not defined',function(done){
            delete CONFIG[CONSTANTS.COMMON.PBVERSION];
            delete CONFIG[CONSTANTS.COMMON.OWVERSION];
            var expectedResult = {"timeout":3000,"openwrap_version":undefined,"prebid_version":undefined,"profileId":"46","profileVersionId":"4"};
            var result = UTIL.getOWConfig();
            result.should.be.deep.equal(expectedResult);
            done();
        });
    });
    describe('updateAdUnitsWithEids',function(){
        var adUnits
        beforeEach(function(done){
            sinon.spy(UTIL,'updateUserIds');
            sinon.stub(UTIL,'getUserIds').returns({id:1})
            sinon.stub(UTIL,'getUserIdsAsEids').returns([{"source":"myId",id:1}])
            done();
        });

        afterEach(function(done){
            adUnits = null;
            UTIL.updateUserIds.restore();
            UTIL.getUserIds.restore();
            UTIL.getUserIdsAsEids.restore();    
            done();
        });

        it('is a function', function(done) {
            UTIL.updateAdUnits.should.be.a('function');
            done();
        });

        it('should call updateUserIds if passed adUnit is array',function(done){
            adUnits = [{bids:[{"ecpm":10}]}];
            UTIL.updateAdUnits(adUnits);
            UTIL.updateUserIds.calledOnce.should.be.true;
            done();
        });

        it('should call updateUserIds if passed adUnit is object', function(done){
            adUnits = {bids:[{"ecpm":10}]};
            UTIL.updateAdUnits(adUnits);
            UTIL.updateUserIds.calledOnce.should.be.true;          
            done();
        });

        it('should call updateUserIds for each bid if multiple bids are present', function(done){
            adUnits = {bids:[{"ecpm":10},{"ecpm":20}]};
            UTIL.updateAdUnits(adUnits);
            UTIL.updateUserIds.calledTwice.should.be.true;          
            done();
        });
    });

    describe('updateUserIds', function(){
        var bid;
        beforeEach(function(done){
            bid = {
                'ecpm':'10.00'
            }
            sinon.stub(UTIL,'getUserIds').returns({id:1})
            sinon.stub(UTIL,'getUserIdsAsEids').returns([{"source":"myId",id:1}])
            done();
        });

        afterEach(function(done){
            bid=null;
            UTIL.getUserIds.restore();
            UTIL.getUserIdsAsEids.restore();
            done();
        });

        it('is a function', function(done){
            UTIL.updateUserIds.should.be.a('function');
            done();
        });

        it('should add UserId in bid if userIds is not present', function(done){
            var expectedResult = {"ecpm":"10.00","userId":{"id":1},"userIdAsEids":[{"source":"myId","id":1}]}
            UTIL.updateUserIds(bid)
            bid.should.be.deep.equal(expectedResult);
            done();
        })

        // TODO: UnComment Below Test Cases once PhantomJs is replaced by ChromeHeadless in build.sh production and test mode
        xit('should update UserID in bid if userIds is present',function(done){
            var expectedResult = {"ecpm":"10.00","userId":{"existingId":2,"id":1},"userIdAsEids":[{"source":"myId","id":1},{"source":"existingMyId","existingId":2}]} 
            bid['userId'] = {"existingId":2}
            bid['userIdAsEids'] = [{"source":"existingMyId","existingId":2}]
            UTIL.updateUserIds(bid)
            bid.should.be.deep.equal(expectedResult);
            done();
        })
        
        // TODO: UnComment Below Test Cases once PhantomJs is replaced by ChromeHeadless in build.sh production and test mode
        xit('should update with IH values if same id is present', function(done){
            var expectedResult = {"ecpm":"10.00","userId":{"id":1},"userIdAsEids":[{"source":"myId","id":1}]}
            bid['userId'] = {"id":2}
            bid['userIdAsEids'] = [{"source":"myId","id":2}]
            UTIL.updateUserIds(bid);
            bid.should.be.deep.equal(expectedResult);
            done();
        })
    })
  
   describe('#applyDataTypeChangesIfApplicable', function() {
        var params;
        beforeEach(function(done) {
            params = {"name": "intentIqId","params.partner":"123","storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};
            paramsForParrable = {
                "name": 'parrableId',
                "params.partner": "'30182847-e426-4ff9-b2b5-9ca1324ea09b','b07cf20d-8b55-4cd7-9e84-d804ed66b644'",
                "storage.name": "parrableId_cookie",
                "storage.type": "cookie",
                "storage.expires": "60",
                "params.timezoneFilter.allowedZones":  "Pacific/Honolulu, Europe/Amsterdam, Europe/Stockholm, Europe/Prague"
            };
            done();
        });

        afterEach(function(done) {
            params = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.applyDataTypeChangesIfApplicable.should.be.a('function');
            done();
        });

        it('should update the param value with correct datatype',function(done){
            var expectedResult = {"name": "intentIqId","params.partner":123,"storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};
            UTIL.applyDataTypeChangesIfApplicable(params);
            params.should.deep.equal(expectedResult);
            done();
        });

        it('should keep the param value unchanged and print a log message if datatype conversion is not possible',function(done){
            params = {"name": "intentIqId","params.partner":"abc","storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};
            var expectedResult = {"name": "intentIqId","params.partner":"abc","storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};

            UTIL.applyDataTypeChangesIfApplicable(params);
            params.should.deep.equal(expectedResult);
            UTIL.logError.should.be.calledOnce;

            done();
        });

        it('should convert comma separated string for parrable timezones to an array, with each entry trimmed', function(done) {
            var expectedResult = {
                "name": 'parrableId',
                "params.partner": "'30182847-e426-4ff9-b2b5-9ca1324ea09b','b07cf20d-8b55-4cd7-9e84-d804ed66b644'",
                "storage.name": "parrableId_cookie",
                "storage.type": "cookie",
                "storage.expires": "60",
                "params.timezoneFilter.allowedZones":  ["Pacific/Honolulu", "Europe/Amsterdam", "Europe/Stockholm", "Europe/Prague"]
            };
            UTIL.applyDataTypeChangesIfApplicable(paramsForParrable);
            paramsForParrable["params.timezoneFilter.allowedZones"].should.be.a('Array');
            paramsForParrable["params.timezoneFilter.allowedZones"].length.should.equal(expectedResult["params.timezoneFilter.allowedZones"].length);
            done();
        });

        it('should convert single entry for parrable timezones to an array', function(done) {
            var expectedResult = {
                "name": 'parrableId',
                "params.partner": "'30182847-e426-4ff9-b2b5-9ca1324ea09b','b07cf20d-8b55-4cd7-9e84-d804ed66b644'",
                "storage.name": "parrableId_cookie",
                "storage.type": "cookie",
                "storage.expires": "60",
                "params.timezoneFilter.allowedZones":  [123]
            };
            paramsForParrable = {
                "name": 'parrableId',
                "params.partner": "'30182847-e426-4ff9-b2b5-9ca1324ea09b','b07cf20d-8b55-4cd7-9e84-d804ed66b644'",
                "storage.name": "parrableId_cookie",
                "storage.type": "cookie",
                "storage.expires": "60",
                "params.timezoneFilter.allowedZones":  123
            };
            UTIL.applyDataTypeChangesIfApplicable(paramsForParrable);
            paramsForParrable["params.timezoneFilter.allowedZones"].should.be.a('Array');
            paramsForParrable["params.timezoneFilter.allowedZones"].length.should.equal(expectedResult["params.timezoneFilter.allowedZones"].length);

            done();
        });
    });  


      
   describe('#getUpdatedKGPVForVideo', function() {
    var kgpv, adFormat;
        beforeEach(function(done) {
            kgpv = "Div1@728x90";
            adFormat = "video"
            done();
        });

        afterEach(function(done) {
            params = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.getUpdatedKGPVForVideo.should.be.a('function');
            done();
        });

        it('should update the kgpv value with 0x0 for video',function(done){
            var expectedResult = "Div1@0x0"
            UTIL.getUpdatedKGPVForVideo(kgpv, adFormat).should.deep.equal(expectedResult);
            done();
        });
        

        it('should not update kgpv if adformat is not video',function(done){
            adFormat = "banner";
            var expectedResult = "Div1@728x90";
            UTIL.getUpdatedKGPVForVideo(kgpv, adFormat).should.deep.equal(expectedResult);
            done();
        });

        it('should not update kgpv if adformat is video and kgpv is Div',function(done){
            adFormat = "video";
            kgpv = "Div1";
            var expectedResult = "Div1";
            UTIL.getUpdatedKGPVForVideo(kgpv, adFormat).should.deep.equal(expectedResult);
            done();
        });
    });  
    
  
});
