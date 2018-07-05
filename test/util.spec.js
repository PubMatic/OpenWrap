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

var BIDMgr = require("../src_new/bidManager.js");

var commonAdapterID = "pubmatic";
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
            pattern = null;

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

        it('should return Array of slot names', function(done) {
            UTIL.generateSlotNamesFromPattern(activeSlot, pattern).should.be.a('array');
            UTIL.isOwnProperty.called.should.be.true;
            UTIL.getIncrementalInteger.called.should.be.true;
            done();
        });


        it('should have extracted data from activeSlot to generate slot names', function(done) {
            UTIL.generateSlotNamesFromPattern(activeSlot, pattern);
            activeSlot.getSizes.calledOnce.should.be.true;
            activeSlot.getAdUnitID.calledOnce.should.be.true;
            activeSlot.getAdUnitIndex.calledOnce.should.be.true;
            activeSlot.getDivID.calledOnce.should.be.true;
            done();
        });
    });

    describe('#checkMandatoryParams', function() {
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
            UTIL.log.calledWith(adapterID + "provided object is invalid.");
            done();
        });

        it('should log if provided object is invalid i.e. an array ', function(done) {
            object = [];
            UTIL.checkMandatoryParams(object, keys, adapterID).should.be.false;
            UTIL.log.calledWith(adapterID + "provided object is invalid.");
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
            UTIL.log.calledWith(adapterID + "provided keys must be in an array.");
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
            UTIL.log.calledWith(adapterID + ": " + keys[0] + ", mandatory parameter not present.").should.be.true;
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
            keyGenerationPattern = null,
            keyLookupMap = null,
            handlerFunction = null,
            addZeroBids = null;
        var obj = null;

        beforeEach(function(done) {
            adapterID = commonAdapterID;
            adUnits = "adUnits";
            adapterConfig = "adapterConfig";
            impressionID = "impressionID";
            slotConfigMandatoryParams = "slotConfigMandatoryParams";
            activeSlots = [new SLOT("slot_1"), new SLOT("slot_2")];
            keyGenerationPattern = "_W_x_H_";
            keyLookupMap = {
                "generatedKeys": "some_vale"
            };
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
            keyGenerationPattern = null;
            keyLookupMap = null;
            obj.handlerFunction.restore();
            obj.handlerFunction = null;
            addZeroBids = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.forEachGeneratedKey.should.be.a('function');
            done();
        });

        it('should check whther activeSlots is not empty ad key generation pattern must be greater than 3 in length ', function(done) {
            UTIL.forEachGeneratedKey(adapterID, adUnits, adapterConfig, impressionID, slotConfigMandatoryParams, activeSlots, keyGenerationPattern, keyLookupMap, handlerFunction, addZeroBids);

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
                height: 210
            };
            sinon.stub(UTIL, "resizeWindow")
            // .returns(true);
            sinon.stub(UTIL, "writeIframe")
            // .returns(true);
            sinon.spy(UTIL, "log");
            done();
        });

        afterEach(function(done) {
            theDocument.write.restore();
            theDocument = null;
            bid = null;
            UTIL.resizeWindow.restore();
            UTIL.writeIframe.restore();
            UTIL.log.restore();
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
            UTIL.log.calledWith("creative details are not found").should.be.true;
            UTIL.log.calledWith(bid).should.be.true;
            done();
        });
    });

    describe('#getScreenWidth', function() {
        var win = null;

        beforeEach(function(done) {
            win = {
                innerHeight: 1024,
                innerWidth: 768,
                document: {
                    documentElement: {
                        clientWidth: 768
                    },
                    body: {
                        clientWidth: 921
                    }
                }
            };
            done();
        });

        afterEach(function(done) {
            done();
        });

        it('is a function', function(done) {
            UTIL.getScreenWidth.should.be.a('function');
            done();
        });

        it('should return screen width of given window object', function(done) {
            delete win.innerHeight;
            UTIL.getScreenWidth(win).should.be.equal(768);
            done();
        });

        it('should return screen width of given window object', function(done) {
            delete win.innerHeight;
            delete win.document.documentElement.clientWidth;
            UTIL.getScreenWidth(win).should.be.equal(921);
            done();
        });
    });

    describe('#getScreenHeight', function() {
        var win = null;

        beforeEach(function(done) {
            win = {
                innerHeight: 1024,
                innerWidth: 768,
                document: {
                    documentElement: {
                        clientHeight: 768
                    },
                    body: {
                        clientHeight: 921
                    }
                }
            };
            done();
        });

        afterEach(function(done) {
            done();
        });

        it('is a function', function(done) {
            UTIL.getScreenHeight.should.be.a('function');
            done();
        });

        it('should return screen width of given window object', function(done) {
            delete win.innerHeight;
            UTIL.getScreenHeight(win).should.be.equal(768);
            done();
        });

        it('should return screen width of given window object', function(done) {
            delete win.innerHeight;
            delete win.document.documentElement.clientHeight;
            UTIL.getScreenHeight(win).should.be.equal(921);
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

    describe('#findInString', function() {
        var theString = null,
            find = null;

        beforeEach(function(done) {
            theString = "lorem Ipsum";
            find = "Ipsum";
            done();
        });

        afterEach(function(done) {
            theString = null;
            find = null;
            done();
        });

        it('is a function', function(done) {
            UTIL.findInString.should.be.a('function');
            done();
        });

        it('should return false when given substring is not found in given main string', function(done) {
            UTIL.findInString(theString, "nomatch").should.be.false;
            done();
        });

        it('should return true when given substring is found in given main string', function(done) {
            UTIL.findInString(theString, find).should.be.true;
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
            sinon.stub(UTIL, "writeIframe").returns(true);
            sinon.stub(window.document.body, "appendChild").returns(true);

            sinon.spy(window, "parseInt");
            done();
        });

        afterEach(function(done) {
            window.parseInt.restore();
            BIDMgr.executeMonetizationPixel.restore();
            BIDMgr.getBidById.restore();

            UTIL.vLogInfo.restore();
            UTIL.resizeWindow.restore();
            UTIL.createInvisibleIframe.restore();
            UTIL.displayCreative.restore();
            UTIL.log.restore();
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
                UTIL.resizeWindow.called.should.be.false;
                done();
            });

            it('should have called resizeWindow', function(done) {
                window.PWT.isSafeFrame = true;
                UTIL.safeFrameCommunicationProtocol(msg);
                UTIL.resizeWindow.calledWith(window.document, 200, 400).should.be.true;
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
                    UTIL.log.calledWith('Error in rendering creative in safe frame.').should.be.true;
                    UTIL.log.calledWith('Rendering synchronously.').should.be.true;
                    UTIL.displayCreative.called.should.be.true;
                    done();
                });

                it('should have thrown if iframe doenst have contentWindow', function(done) {
                    iFrameStub.contentWindow = false;
                    UTIL.createInvisibleIframe.returns(iFrameStub);
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.log.calledWith('Error in rendering creative in safe frame.').should.be.true;
                    UTIL.log.calledWith('Rendering synchronously.').should.be.true;
                    UTIL.displayCreative.called.should.be.true;
                    done();
                });

                it('should have thrown if iframeDoc is invalid', function(done) {
                    iFrameStub.contentWindow.document = false;
                    UTIL.createInvisibleIframe.returns(iFrameStub);
                    UTIL.safeFrameCommunicationProtocol(msg);
                    UTIL.log.calledWith('Error in rendering creative in safe frame.').should.be.true;
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
                    UTIL.log.calledWith("creative details are not found").should.be.true;
                    UTIL.createInvisibleIframe.called.should.be.false;
                    done();
                });
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

            window.document.createTextNode.calledWith("Bid: " + infoObject.bidder + ": " + infoObject.bidDetails.getNetEcpm() + "(" + infoObject.bidDetails.getGrossEcpm() + "): " + infoObject.latency + "ms").should.be.true;
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
            window.document.createTextNode.calledWith("Bid: " + infoObject.bidder + ": " + infoObject.bidDetails.getNetEcpm() + "(" + infoObject.bidDetails.getGrossEcpm() + "): " + 0 + "ms" + ": POST-TIMEOUT").should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
            done();
        });

        it('should have created the text node when type of the infoObject is \'win-bid\' with proper message being generated', function(done) {
            infoObject.type = "win-bid";
            UTIL.vLogInfo(divID, infoObject);
            window.document.createTextNode.calledWith("Winning Bid: " + infoObject.bidDetails.getAdapterID() + ": " + infoObject.bidDetails.getNetEcpm()).should.be.true;
            infoPanelElementStub.appendChild.calledTwice.should.be.true;
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

});
