/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");

var typeArray = "Array";
var typeString = "String";
var typeFunction = "Function";
var typeNumber = "Number";

var CONF = require("../src_new/conf.js");
var CONSTANTS = require("../src_new/constants.js");
var CONFIG = require("../src_new/config.idhub");

CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID] = "1";
CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] = "1";
CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SSO_ENABLED] = "1";
CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ADSERVER] = "IDHUB";


var IDHUBUTIL = require("../src_new/util.idhub");
const { util } = require("chai");

// IDHUB UTIL TEST CASES
describe('IDHUBUTIL', function() {

    describe('#enableVisualDebugLog', function() {
        it('is a function', function(done) {
            IDHUBUTIL.enableVisualDebugLog.should.be.a('function');
            done();
        });

        it('should have set debugLogIsEnabled and visualDebugLogIsEnabled to true', function(done) {
            IDHUBUTIL.isDebugLogEnabled();
            IDHUBUTIL.enableVisualDebugLog();
            IDHUBUTIL.debugLogIsEnabled.should.be.true;
            IDHUBUTIL.visualDebugLogIsEnabled.should.be.true;
            done();
        });
    });

    describe('#isString', function() {

        it('is a function', function(done) {
            IDHUBUTIL.isString.should.be.a('function');
            done();
        });

        it('should have returned false when non string is passed', function (done) {
            var obj = {};
            IDHUBUTIL.isFunction(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true in case of string being passed', function(done) {
            var str = "string_value";
            IDHUBUTIL.isString(str).should.be.true;
            IDHUBUTIL.isA(str, typeString).should.be.true;
            done();
        });
    });

    describe('#isArray', function() {

        it('is a function', function(done) {
            IDHUBUTIL.isArray.should.be.a('function');
            done();
        });

        it('should have retuend false when non array is passed', function (done) {
            var obj = {};
            IDHUBUTIL.isArray(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true when array is passed', function(done) {
            var arr = [1, 2, "3"];
            IDHUBUTIL.isArray(arr).should.be.true;
            IDHUBUTIL.isA(arr, typeArray).should.be.true;
            done();
        });
    });

    describe('#isNumber', function() {
        it('is a function', function(done) {
            IDHUBUTIL.isNumber.should.be.a('function');
            done();
        });

        it('should have returned false when non number is passed', function (done) {
            var obj = {};
            IDHUBUTIL.isNumber(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true when number is passed', function(done) {
            var num = 1234;
            IDHUBUTIL.isNumber(num).should.be.true;
            IDHUBUTIL.isA(num, typeNumber).should.be.true;
            done();
        });
    });

    describe('#isObject', function() {

        it('is a function', function(done) {
            IDHUBUTIL.isObject.should.be.a('function');
            done();
        });

        it('should return true when proper object is passed', function (done) {
            var obj = {};
            IDHUBUTIL.isObject(obj).should.be.true;
            done();
        });

        it('should have returned false when non object is passed', function (done) {
            var num = 1234;
            IDHUBUTIL.isObject(num).should.be.false;
            done();
        });
    });

    describe('#isOwnProperty', function() {

        it('is a function', function(done) {
            IDHUBUTIL.isOwnProperty.should.be.a('function');
            done();
        });

        it('return false if passed object doesnt have hasOwnProperty method', function(done) {
            var theObject = false;
            IDHUBUTIL.isOwnProperty(theObject, "propertyName").should.be.false;
            done();
        });

        it('return false if passed object doesnt have said property', function(done) {
            var theObject = { "propertyName": "value" };
            IDHUBUTIL.isOwnProperty(theObject, "NonExistingPropertyName").should.be.false;
            done();
        });

        it('return true if passed object have hasOwnProperty method', function(done) {
            var theObject = { "propertyName": "value" };
            IDHUBUTIL.isOwnProperty(theObject, "propertyName").should.be.true;
            done();
        });
    });

    describe('#error', function(){
        beforeEach(function(){
            sinon.stub(console, 'log')

        })
        afterEach(function(){
            console.log.restore()
        })
        it('is a function', function(done) {
            IDHUBUTIL.error.should.be.a('function');
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.error("")
            console.log.should.be.calledOnce;
            done();
        });
    })

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
            sinon.spy(IDHUBUTIL, "isIframe");
            sinon.stub(IDHUBUTIL, "getTopFrameOfSameDomain").returns(frameStub);
            window.top = frameStub;
            done();
        });

        afterEach(function(done) {
            cWin = null;
            IDHUBUTIL.getTopFrameOfSameDomain.restore();
            IDHUBUTIL.isIframe.restore();
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.getMetaInfo.should.be.a('function');
            done();
        });

        it('should return metaInfo object', function(done) {
            IDHUBUTIL.getMetaInfo(cWin)
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
            var metaInfoObj = IDHUBUTIL.getMetaInfo();
            expect(metaInfoObj.secure).to.be.equal(1);
            expect(metaInfoObj.protocol).to.be.equal("https://");
            IDHUBUTIL.isIframe.called.should.be.true;
            IDHUBUTIL.getTopFrameOfSameDomain.called.should.be.true;
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
            sinon.spy(IDHUBUTIL, "isIframe");
            sinon.stub(IDHUBUTIL, "getTopFrameOfSameDomain").returns(frameStub);
            window.top = frameStub;
            done();
        });

        afterEach(function(done) {
            cWin = null;
            IDHUBUTIL.getTopFrameOfSameDomain.restore();
            IDHUBUTIL.isIframe.restore();
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.getMetaInfo.should.be.a('function');
            done();
        });

        it('should return metaInfo object', function(done) {
            IDHUBUTIL.getMetaInfo(cWin)
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
            var metaInfoObj = IDHUBUTIL.getMetaInfo();
            expect(metaInfoObj.secure).to.be.equal(1);
            expect(metaInfoObj.protocol).to.be.equal("https://");
            IDHUBUTIL.isIframe.called.should.be.true;
            IDHUBUTIL.getTopFrameOfSameDomain.called.should.be.true;
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
            IDHUBUTIL.isIframe.should.be.a('function');
            done();
        });

        it('should return whether given window object is iframe or not', function(done) {
            IDHUBUTIL.isIframe(theWindow).should.be.true;
            done();
        });
    });

    describe('#findQueryParamInURL', function() {
        var url = null,
            name = null;
        beforeEach(function(done) {
            url = "http://some.url.here?key=value&rhs=lhs"
            sinon.spy(IDHUBUTIL, "isOwnProperty");
            sinon.stub(IDHUBUTIL, "parseQueryParams").returns({
                "key": "value",
                "rhs": "lhs"
            });
            name = "key";
            done();
        });

        afterEach(function(done) {
            IDHUBUTIL.isOwnProperty.restore();
            IDHUBUTIL.parseQueryParams.restore();
            url = null;
            name = null;
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.findQueryParamInURL.should.be.a('function');
            done();
        });

        it('should have checked whether passed query param is present in given url', function(done) {
            IDHUBUTIL.findQueryParamInURL(url, name).should.be.true;
            IDHUBUTIL.parseQueryParams.called.should.be.true;
            IDHUBUTIL.isOwnProperty.called.should.be.true;
            done();
        });
    });

    describe('#parseQueryParams', function() {
        var url = null;

        beforeEach(function(done) {
            url = "http://some.url.here?key=value&rhs=lhs";
            sinon.spy(window.document, "createElement");
            sinon.spy(IDHUBUTIL, "forEachOnArray");
            done();
        });

        afterEach(function(done) {
            window.document.createElement.restore();
            IDHUBUTIL.forEachOnArray.restore();
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.parseQueryParams.should.be.a('function');
            done();
        });

        it('should return query params with their values in object form', function(done) {
            IDHUBUTIL.parseQueryParams(url).should.deep.equal({
                "key": "value",
                "rhs": "lhs"
            });
            IDHUBUTIL.forEachOnArray.called.should.be.true;
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

            sinon.spy(IDHUBUTIL, "isObject");
            sinon.spy(IDHUBUTIL, "isFunction");
            sinon.spy(IDHUBUTIL, "log");
            done();
        });

        afterEach(function(done) {
            obj.newFunction.restore();

            IDHUBUTIL.isObject.restore();
            IDHUBUTIL.isFunction.restore();
            IDHUBUTIL.log.restore();

            theObject = null;
            useProto = null;
            functionName = null;
            obj = null;
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.addHookOnFunction.should.be.a('function');
            done();
        });

        it('should have logged if passed object doesnt have function which we want to add hook on', function(done) {
            functionName = "non_existing_fn_name";
            IDHUBUTIL.addHookOnFunction(theObject, useProto, functionName, obj.newFunction);
            IDHUBUTIL.isFunction.returned(false).should.be.true;
            IDHUBUTIL.isObject.returned(true).should.be.true;
            IDHUBUTIL.log.calledWith("in assignNewDefination: oldReference is not a function");
            done();
        });

        it('should assign the passed in object with passed function name the invocation of passed newFunction', function(done) {
            var originalFn = theObject[functionName];
            IDHUBUTIL.addHookOnFunction(theObject, useProto, functionName, obj.newFunction);
            IDHUBUTIL.isObject.returned(true).should.be.true;
            IDHUBUTIL.isFunction.returned(true).should.be.true;
            done();
        });
    });

    describe('#getUserIdParams', function() {
        var params;
        beforeEach(function(done) {
            IDHUBUTIL.enableDebugLog();
            params = {"name":"pubCommonId","storage.type":"cookie","storage.name":"_pubCommonId","storage.expires":"1825"}
            sinon.spy(IDHUBUTIL, "initZeoTapJs");
            sinon.spy(IDHUBUTIL, "initLiveRampAts");
            //var namespace = CONFIG.isIdentityOnly() ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE;
            IDHUBUTIL.pbNameSpace = CONFIG.isIdentityOnly() ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE;
            function onSSOLogin() {};
            function getUserIdentities() {
                return {
                    email: "zeotaptestrab@gmail.com",
                    customerID: "custid_123",
                    pubProvidedEmailHash: {
                        MD5: '4e8fb772f3a4034906153f2d4258ee5c', SHA1: 'e770f63ff1d3eb07b589b4ab972009b5ad8d836b', SHA256: 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d'
                    }
                }
            }
            window[IDHUBUTIL.pbNameSpace] = {
                'onSSOLogin': onSSOLogin,
                'getUserIdentities': getUserIdentities
            }
            sinon.spy(window, "setTimeout");
            done();
        });

        afterEach(function(done) {
            params = null;
            IDHUBUTIL.debugLogIsEnabled= false;
            IDHUBUTIL.initZeoTapJs.restore();
            IDHUBUTIL.initLiveRampAts.restore();
            window.setTimeout.restore();
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.getUserIdParams.should.be.a('function');
            done();
        });

        // it('should return userId with valid params',function(done){
        //     var expectedResult = {"name":"pubCommonId","storage":{"type":"cookie","name":"_pubCommonId","expires":"1825"}};
        //     var result = IDHUBUTIL.getUserIdParams(params);
        //     result.should.deep.equal(expectedResult);
        //     done();
        // });

        it('should call initLiveRampAts if identityLink partner is configured and loadATS is set to true', function(done) {
            var lrParams = {
                name: "identityLink",
                "params.pid": "23",
                "storage.type": "cookie",
                "params.loadATS": "true", // or false// boolean default is false,
                "params.placementID": "23",
                "params.storageType": "localstorage",
                "params.detectionType": "scrapeAndUrl",
                "params.urlParameter": "eparam",
                "params.cssSelectors": "input[type=text], input[type=email]",
                "params.logging": "info",
                "storage.name": "somenamevalue",
                "storage.expires": "60"
            };
            var result = IDHUBUTIL.getUserIdParams(lrParams);
            IDHUBUTIL.initLiveRampAts.should.be.calledOnce;
            window[IDHUBUTIL.pbNameSpace] = undefined;
            done();
        });

        it('should not call initLiveRampAts if identityLink partner is configured and loadATS is set to false', function(done) {
            var lrParams = {
                name: "identityLink",
                "params.pid": "23",
                "storage.type": "cookie",
                "params.loadATS": "false", // or false// boolean default is false,
                "params.placementID": "23",
                "params.storageType": "localstorage",
                "params.detectionType": "scrapeAndUrl",
                "params.urlParameter": "eparam",
                "params.cssSelectors": "input[type=text], input[type=email]",
                "params.logging": "info",
                "storage.name": "somenamevalue",
                "storage.expires": "60"
            };
            var result = IDHUBUTIL.getUserIdParams(lrParams);
            IDHUBUTIL.initLiveRampAts.should.not.be.called;
            window[IDHUBUTIL.pbNameSpace] = undefined;
            done();
        });

        it('should pass accountID, customerIDRegex, detectionMechanism and customerID to ats script if custom ID is enabled ', function(done){
            var lrParams = {
                name: "identityLink",
                params: {
                    pid: "23",
                    loadATS: "true",
                    storageType: "localstorage",
                    detectionType: "scrapeAndUrl",
                    urlParameter: "eparam",
                    cssSelectors: "input[type=text], input[type=email]",
                    logging: "info",
                    enableCustomId: "true",
                    accountID: "123_acc",
                    customerIDRegex: "[0-9a-zA-Z_]*",
                    detectionMechanism: "direct"
                },
                storage: {
                    type: "cookie",
                    name: "somenamevalue",
                    expires: "60"
                }
            }
            var expectedResult = {
                placementID: '23',
                storageType: 'localstorage',
                logging: 'info',
                accountID: '123_acc',
                customerIDRegex: '[0-9a-zA-Z_]*',
                detectionSubject: 'customerIdentifier',
                emailHashes: ['4e8fb772f3a4034906153f2d4258ee5c', 'e770f63ff1d3eb07b589b4ab972009b5ad8d836b', 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d'],
                customerID: 'custid_123'
            };
            var result = IDHUBUTIL.getLiverampParams(lrParams);
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should not pass accountID, customerID, customerIDRegex and customerIdentifier data to ats script if custom ID is disabled ', function(done){
            var lrParams = {
                name: "identityLink",
                params: {
                    pid: "23",
                    loadATS: "true",
                    storageType: "localstorage",
                    detectionType: "scrapeAndUrl",
                    urlParameter: "eparam",
                    cssSelectors: "input[type=text], input[type=email]",
                    logging: "info",
                    enableCustomId: "false",
                    accountID: "123_acc",
                    customerIDRegex: "[0-9a-zA-Z_]*",
                    detectionMechanism: "direct"
                },
                storage: {
                    type: "cookie",
                    name: "somenamevalue",
                    expires: "60"
                }
            };

            var expectedResult = {
                placementID: '23',
                storageType: 'localstorage',
                logging: 'info',
                emailHashes: ['4e8fb772f3a4034906153f2d4258ee5c', 'e770f63ff1d3eb07b589b4ab972009b5ad8d836b', 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d']
            };

            var result = IDHUBUTIL.getLiverampParams(lrParams);
            result.should.deep.equal(expectedResult);

            done();
        });

        it('should not pass detectionType, urlParameter, cssSelectors data to ats script if detectionMechanism is direct', function(done){
            var lrParams = {
                name: "identityLink",
                params: {
                    pid: "23",
                    loadATS: "true",
                    storageType: "localstorage",
                    detectionType: "scrapeAndUrl",
                    urlParameter: "eparam",
                    cssSelectors: "input[type=text], input[type=email]",
                    logging: "info",
                    enableCustomId: "false",
                    accountID: "123_acc",
                    customerIDRegex: "[0-9a-zA-Z_]*",
                    detectionMechanism: "direct"
                },
                storage: {
                    type: "cookie",
                    name: "somenamevalue",
                    expires: "60"
                }
            };

            var expectedResult = {
                placementID: '23',
                storageType: 'localstorage',
                logging: 'info',
                emailHashes: ['4e8fb772f3a4034906153f2d4258ee5c', 'e770f63ff1d3eb07b589b4ab972009b5ad8d836b', 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d']
            };

            var result = IDHUBUTIL.getLiverampParams(lrParams);
            result.should.deep.equal(expectedResult);

            done();
        });

        it('should pass detectionType, urlParameter, cssSelectors data to ats script if detectionMechanism is detect', function(done){
            var lrParams = {
                name: "identityLink",
                params: {
                    pid: "23",
                    loadATS: "true",
                    storageType: "localstorage",
                    detectionType: "scrapeAndUrl",
                    urlParameter: "eparam",
                    cssSelectors: "input[type=text], input[type=email]",
                    logging: "info",
                    enableCustomId: "false",
                    accountID: "123_acc",
                    customerIDRegex: "[0-9a-zA-Z_]*",
                    detectionMechanism: "detect",
                    detectDynamicNodes: "false",
                    detectionEventType: "onblur"
                },
                storage: {
                    type: "cookie",
                    name: "somenamevalue",
                    expires: "60"
                }
            };

            var expectedResult = {
                placementID: '23',
                storageType: 'localstorage',
                logging: 'info',
                detectionType: 'scrapeAndUrl',
                urlParameter: 'eparam',
                cssSelectors: ['input[type=text]', ' input[type=email]'],
                detectDynamicNodes: "false",
                detectionEventType: "onblur"
            };
            var result = IDHUBUTIL.getLiverampParams(lrParams);
            result.should.deep.equal(expectedResult);

            done();
        });

        it('should pass detectionEventType with onclick/onsubmit value and no triggerElements should be passed along with other params data to ats script if detectionMechanism is detect', function(done){
            var lrParams = {
                name: "identityLink",
                params: {
                    pid: "23",
                    loadATS: "true",
                    storageType: "localstorage",
                    detectionType: "scrapeAndUrl",
                    urlParameter: "eparam",
                    cssSelectors: "input[type=text], input[type=email]",
                    logging: "info",
                    enableCustomId: "false",
                    accountID: "123_acc",
                    customerIDRegex: "[0-9a-zA-Z_]*",
                    detectionMechanism: "detect",
                    detectDynamicNodes: "false",
                    detectionEventType: "onclick",
                    triggerElements: "input[type=text]"
                },
                storage: {
                    type: "cookie",
                    name: "somenamevalue",
                    expires: "60"
                }
            };

            var expectedResult = {
                placementID: '23',
                storageType: 'localstorage',
                logging: 'info',
                detectionType: 'scrapeAndUrl',
                urlParameter: 'eparam',
                cssSelectors: ['input[type=text]', ' input[type=email]'],
                detectDynamicNodes: "false",
                detectionEventType: "onclick",
                triggerElements: ['input[type=text]']
            };
            var result = IDHUBUTIL.getLiverampParams(lrParams);
            result.should.deep.equal(expectedResult);

            done();
        });

        it('should call initZeoTapJs if zeotap partner is configured and initZeotap is set to true', function(done) {
            var zeotapParams = {
                name: "zeotapIdPlus",
                "storage.type": 'cookie',
                "storage.expires": "30",
                "storage.name": "IDP",
                "params.partnerId": "b13e43f5-9846-4349-ae87-23ea3c3c25de",
                "params.loadIDP": "true"
            };
            var result = IDHUBUTIL.getUserIdParams(zeotapParams);
            IDHUBUTIL.initZeoTapJs.should.be.calledOnce;
            window[IDHUBUTIL.pbNameSpace] = undefined;
            done();
        });

        it('should not call initZeoTapJs if zeotap partner is configured and initZeotap is set to false', function(done) {
            var zeotapParams = {
                name: "zeotapIdPlus",
                "storage.type": 'cookie',
                "storage.expires": "30",
                "storage.name": "IDP",
                "params.partnerId": "b13e43f5-9846-4349-ae87-23ea3c3c25de",
                "params.loadIDP": "false"
            };
            var result = IDHUBUTIL.getUserIdParams(zeotapParams);
            IDHUBUTIL.initZeoTapJs.should.not.be.called;
            window[IDHUBUTIL.pbNameSpace] = undefined;
            done();
        });

        // Publink initLauncherJs
        it('should call initLauncherJs if publink partner is configured and loadLauncher is set to true', function(done) {
            var publinkIdParams = {
                name: "publinkId",
                "storage.type": "cookie",
                "storage.expires": "30",
                "storage.name": "pbjs_publink",
                "params.site_id": "123456",
                "params.api_key": "00000000-0000-0000-0000-00000000000",
                "params.loadLauncher": "true",
                "params.launcher_id": "3434",
                "params.detectionMechanism": "detect",
                "params.urlParameter": "eparam",
                "params.cssSelectors": "input[type=text],input[type=email]",
                display: 0,
                rev_share: "0.0",
                throttle: "100"
            }
            IDHUBUTIL.getUserIdParams(publinkIdParams);
            IDHUBUTIL.initLauncherJs.should.be.calledOnce;
            window[IDHUBUTIL.pbNameSpace] = undefined;
            done();
        });

        it('should not call initLauncherJs if publink partner is configured and loadLauncher is set to false', function(done) {
            var publinkIdParams = {
                name: "publinkId",
                "storage.type": "cookie",
                "storage.expires": "30",
                "storage.name": "pbjs_publink",
                "params.site_id": "123456",
                "params.api_key": "00000000-0000-0000-0000-00000000000",
                "params.loadLauncher": "false",
                display: 0,
                rev_share: "0.0",
                throttle: "100"
            }
            IDHUBUTIL.getUserIdParams(publinkIdParams);
            IDHUBUTIL.initLauncherJs.should.not.be.called;
            window[IDHUBUTIL.pbNameSpace] = undefined;
            done();
        });


        it('should pass urlParameter, cssSelectors data to launcher script if detectionMechanism is detect', function(done){
            var publinkParams = {
                name: "publinkId",
                params: {
                    site_id: "123456",
                    launcher_id: "3434",
                    loadLauncher: "true",
                    storageType: "cookie",
                    urlParameter: "eparam",
                    cssSelectors: "input[type=text],input[type=email]",
                    detectionMechanism: "detect",
                    api_key: '00000000-0000-0000-0000-00000000000'
                },
                storage: {
                    type: "cookie",
                    name: "pbjs_publink",
                    expires: "30"
                }
            };
            var expectedResult = {apiKey: '00000000-0000-0000-0000-00000000000', siteId: '123456', urlParameter: 'eparam', cssSelectors: ['input[type=text]', 'input[type=email]'], detectionSubject: 'email'}
            var result = IDHUBUTIL.getPublinkLauncherParams(publinkParams);
            result.should.deep.equal(expectedResult);
            done();
        });

        it('should not pass urlParameter, cssSelectors data to launcher script if detectionMechanism is direct', function(done){
            var publinkParams = {
                name: "publinkId",
                params: {
                    site_id: "123456",
                    launcher_id: "3434",
                    loadLauncher: "true",
                    storageType: "cookie",
                    urlParameter: "eparam",
                    cssSelectors: "input[type=text],input[type=email]",
                    detectionMechanism: "direct",
                    api_key: '00000000-0000-0000-0000-00000000000'
                },
                storage: {
                    type: "cookie",
                    name: "pbjs_publink",
                    expires: "30"
                }
            };
            var expectedResult = {apiKey: '00000000-0000-0000-0000-00000000000', siteId: '123456', emailHashes: ['4e8fb772f3a4034906153f2d4258ee5c', 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d']}
            var result = IDHUBUTIL.getPublinkLauncherParams(publinkParams);
            result.should.deep.equal(expectedResult);
            done();
        });


        //Liveramp V2
        // it('should call initLiveRampLaunchPad if Liveramp V2 partner is configured and custom loadLaunchPad is set to true', function(done) {
        //      var identityLinkV2Params=  {
        //         name: "identityLink",
        //         "storage.name": "lr_str_v2",
        //         "storage.type": "cookie",
        //         "storage.expires": "30",
        //         "storage.refreshInSeconds": "1800",
        //         "params.pid": "1258",
        //         "custom.loadLaunchPad": "true",
        //         "custom.configurationId": "a92aa809-634c-459f-a0c8-f37e897f037c",
        //         display: 0,
        //         rev_share: "0.0",
        //         throttle: "100"
        //     };
        //     IDHUBUTIL.getUserIdParams(identityLinkV2Params);
        //     IDHUBUTIL.initLiveRampLaunchPad.should.be.calledOnce;
        //     window[IDHUBUTIL.pbNameSpace] = undefined;
        //     done();
        // });

        // it('should not call initLiveRampLaunchPad if Liveramp v2 partner is configured and custom loadLaunchPad is set to false', function(done) {
        //     var identityLinkV2Params=  {
        //         name: "identityLink",
        //         "storage.name": "lr_str_v2",
        //         "storage.type": "cookie",
        //         "storage.expires": "30",
        //         "storage.refreshInSeconds": "1800",
        //         "params.pid": "1258",
        //         "custom.loadLaunchPad": "false",
        //         display: 0,
        //         rev_share: "0.0",
        //         throttle: "100"
        //     };
        //     IDHUBUTIL.getUserIdParams(identityLinkV2Params);
        //     IDHUBUTIL.initLiveRampLaunchPad.should.not.be.called;
        //     window[IDHUBUTIL.pbNameSpace] = undefined;
        //     done();
        // });

    });

    describe('#getNestedObjectFromString', function() {
        var sourceObject,separator,key,value;
        beforeEach(function(done) {
            sourceObject = {};
            separator = ".";
            key = "params.init.member";
            value="nQjyizbdyF";
            function onSSOLogin() {};
            window[IDHUBUTIL.pbNameSpace] = {
                'onSSOLogin': onSSOLogin
            }
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
            IDHUBUTIL.getNestedObjectFromString.should.be.a('function');
            done();
        });

        it('should return userId with valid params',function(done){
            var expectedResult = {"params":{"init":{"member":"nQjyizbdyF"}}};
            var result = IDHUBUTIL.getNestedObjectFromString(sourceObject,separator,key,value);
            result.should.deep.equal(expectedResult);
            done();
        });
    });


    describe('#getUserIdsAsEids' ,function(){
        beforeEach(function(done) {
            window[IDHUBUTIL.pbNameSpace] = {
                getUserIdsAsEids: function(){
                    return [{"source":"myId",id:1}]
                }
            }
            done();
        })
        afterEach(function(done) {
            window[IDHUBUTIL.pbNameSpace] = undefined
            done();
        });
        it('is a function', function(done) {
            IDHUBUTIL.getUserIdsAsEids.should.be.a('function');
            done();
        });

        it('should return Eids values by calling getUserIdsAsEids', function(done) {
            window[IDHUBUTIL.pbNameSpace] = {
                getUserIdsAsEids: function(){
                    return [{"source":"myId",id:1}]
                }
            }
            var result = IDHUBUTIL.getUserIdsAsEids();
            result.should.be.deep.equal([{"source":"myId",id:1}])
            done();
        });

        it('should return warning message if getUserIdsAsEids is not defined as function', function(done) {
            window[IDHUBUTIL.pbNameSpace] = {}
            IDHUBUTIL.getUserIdsAsEids();
            IDHUBUTIL.logWarning.should.be.calledOnce;
            done();
        });


    })

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
            IDHUBUTIL.getNestedObjectFromArray.should.be.a('function');
            done();
        });

        it('should return userId with valid params',function(done){
            var expectedResult = {"name":"pubCommonId","storage":{"type":"cookie"}};
            var result = IDHUBUTIL.getNestedObjectFromArray(sourceObject,sourceArray,valueOfLastNode);
            result.should.deep.equal(expectedResult);
            done();
        });
    });

    describe('#isEmptyObject', function() {

        it('is a function', function(done) {
            IDHUBUTIL.isEmptyObject.should.be.a('function');
            done();
        });

        it('should return false when non empty object is passed', function (done) {
            var obj = {"true":true};
            IDHUBUTIL.isEmptyObject(obj).should.be.false;
            done();
        });

        it('should have returned false when non object is passed', function (done) {
            var num = 1234;
            IDHUBUTIL.isEmptyObject(num).should.be.false;
            done();
        });

        it('should have returned false when empty object is passed', function (done) {
            var obj = {};
            IDHUBUTIL.isEmptyObject(obj).should.be.true;
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
            });
            function onSSOLogin() {};
            function getUserIdentities() {
                return {
                    email: "zeotaptestrab@gmail.com"
                }
            }
            window[IDHUBUTIL.pbNameSpace] = {
                'onSSOLogin': onSSOLogin,
                'getUserIdentities': getUserIdentities
            }
            done();
        });

        afterEach(function(done) {
            CONFIG.getIdentityPartners.restore();
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.getUserIdConfiguration.should.be.a('function');
            done();
        });

        // it('should return userId with valid params',function(done){
        //     var expectedResult = [{"name":"pubCommonId","storage":{"type":"cookie","name":"_pubCommonId","expires":"1825"}},{"name":"digitrust","params":{"init":{"member":"nQjyizbdyF","site":"FL6whbX1IW"}},"redirects":"true","storage":{"type":"cookie","name":"somenamevalue","expires":"60"}}];
        //     var result = IDHUBUTIL.getUserIdConfiguration();
        //     result.should.deep.equal(expectedResult);
        //     done();
        // });

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
            var result = IDHUBUTIL.getUserIdConfiguration();

            result.should.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getOWConfig', function() {
        beforeEach(function(done){
            done();
        });
        afterEach(function(done){
            done();
        });
        it("is a function", function(done) {
            IDHUBUTIL.getOWConfig.should.be.a('function');
            done();
        });

        it('should return owversion and pbversion',function(done){
            var expectedResult = {"openwrap_version":"v21.4.0","prebid_version":"v4.33.0","profileId":"46","profileVersionId":"4"} ;
            var result = IDHUBUTIL.getOWConfig();
            result.should.be.deep.equal(expectedResult);
            done();
        });

        // it('should not return owversion and pbversion if not defined',function(done){
        //     delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.PBVERSION]
        //     delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.OWVERSION];

        //     var expectedResult = {"openwrap_version":undefined,"prebid_version":undefined,"profileId":"46","profileVersionId":"4"};
        //     var result = IDHUBUTIL.getOWConfig();
        //     console.log(result);
        //     result.should.be.deep.equal(expectedResult);
        //     done();
        // });
    });
    describe('updateAdUnitsWithEids',function(){
        var adUnits
        beforeEach(function(done){
            sinon.spy(IDHUBUTIL,'updateUserIds');
            sinon.stub(IDHUBUTIL,'getUserIds').returns({id:1})
            sinon.stub(IDHUBUTIL,'getUserIdsAsEids').returns([{"source":"myId",id:1}])
            done();
        });

        afterEach(function(done){
            adUnits = null;
            IDHUBUTIL.updateUserIds.restore();
            IDHUBUTIL.getUserIds.restore();
            IDHUBUTIL.getUserIdsAsEids.restore();    
            done();
        });

        it('is a function', function(done) {
            IDHUBUTIL.updateAdUnits.should.be.a('function');
            done();
        });

        it('should call updateUserIds if passed adUnit is array',function(done){
            adUnits = [{bids:[{"ecpm":10}]}];
            IDHUBUTIL.updateAdUnits(adUnits);
            IDHUBUTIL.updateUserIds.calledOnce.should.be.true;
            done();
        });

        it('should call updateUserIds if passed adUnit is object', function(done){
            adUnits = {bids:[{"ecpm":10}]};
            IDHUBUTIL.updateAdUnits(adUnits);
            IDHUBUTIL.updateUserIds.calledOnce.should.be.true;          
            done();
        });

        it('should call updateUserIds for each bid if multiple bids are present', function(done){
            adUnits = {bids:[{"ecpm":10},{"ecpm":20}]};
            IDHUBUTIL.updateAdUnits(adUnits);
            IDHUBUTIL.updateUserIds.calledTwice.should.be.true;          
            done();
        });
    });

    describe('updateUserIds', function(){
        var bid;
        beforeEach(function(done){
            bid = {
                'ecpm':'10.00'
            }
            sinon.stub(IDHUBUTIL,'getUserIds').returns({id:1})
            sinon.stub(IDHUBUTIL,'getUserIdsAsEids').returns([{"source":"myId",id:1}])
            done();
        });

        afterEach(function(done){
            bid=null;
            IDHUBUTIL.getUserIds.restore();
            IDHUBUTIL.getUserIdsAsEids.restore();
            done();
        });

        it('is a function', function(done){
            IDHUBUTIL.updateUserIds.should.be.a('function');
            done();
        });

        it('should add UserId in bid if userIds is not present', function(done){
            var expectedResult = {"ecpm":"10.00","userId":{"id":1},"userIdAsEids":[{"source":"myId","id":1}]}
            IDHUBUTIL.updateUserIds(bid)
            bid.should.be.deep.equal(expectedResult);
            done();
        })

        // TODO: UnComment Below Test Cases once PhantomJs is replaced by ChromeHeadless in build.sh production and test mode
        xit('should update UserID in bid if userIds is present',function(done){
            var expectedResult = {"ecpm":"10.00","userId":{"existingId":2,"id":1},"userIdAsEids":[{"source":"myId","id":1},{"source":"existingMyId","existingId":2}]} 
            bid['userId'] = {"existingId":2}
            bid['userIdAsEids'] = [{"source":"existingMyId","existingId":2}]
            IDHUBUTIL.updateUserIds(bid)
            bid.should.be.deep.equal(expectedResult);
            done();
        })
        // TODO: UnComment Below Test Cases once PhantomJs is replaced by ChromeHeadless in build.sh production and test mode
        xit('should update with IH values if same id is present', function(done){
            var expectedResult = {"ecpm":"10.00","userId":{"id":1},"userIdAsEids":[{"source":"myId","id":1}]}
            bid['userId'] = {"id":2}
            bid['userIdAsEids'] = [{"source":"myId","id":2}]
            IDHUBUTIL.updateUserIds(bid);
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
            IDHUBUTIL.applyDataTypeChangesIfApplicable.should.be.a('function');
            done();
        });

        it('should update the param value with correct datatype',function(done){
            var expectedResult = {"name": "intentIqId","params.partner":123,"storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};
            IDHUBUTIL.applyDataTypeChangesIfApplicable(params);
            params.should.deep.equal(expectedResult);
            done();
        });

        it('should keep the param value unchanged and print a log message if datatype conversion is not possible',function(done){
            params = {"name": "intentIqId","params.partner":"abc","storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};
            var expectedResult = {"name": "intentIqId","params.partner":"abc","storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};

            IDHUBUTIL.applyDataTypeChangesIfApplicable(params);
            params.should.deep.equal(expectedResult);
            IDHUBUTIL.logError.should.be.calledOnce;

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
            IDHUBUTIL.applyDataTypeChangesIfApplicable(paramsForParrable);
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
            IDHUBUTIL.applyDataTypeChangesIfApplicable(paramsForParrable);
            paramsForParrable["params.timezoneFilter.allowedZones"].should.be.a('Array');
            paramsForParrable["params.timezoneFilter.allowedZones"].length.should.equal(expectedResult["params.timezoneFilter.allowedZones"].length);

            done();
        });

       it('should not update the params object if timezone value is not set', function(done) {
            paramsForParrable = {
                "name": 'parrableId',
                "params.partner": "'30182847-e426-4ff9-b2b5-9ca1324ea09b','b07cf20d-8b55-4cd7-9e84-d804ed66b644'",
                "storage.name": "parrableId_cookie",
                "storage.type": "cookie",
                "storage.expires": "60"
            };
            IDHUBUTIL.applyDataTypeChangesIfApplicable(paramsForParrable);
            expect(paramsForParrable["params.timezoneFilter.allowedZones"]).to.be.undefined
            done();
        });

        it('should keep the param value unchanged and print a log message if datatype conversion is not possible',function(done){
            params = {"name": "intentIqId","params.partner":"abc","storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};
            var expectedResult = {"name": "intentIqId","params.partner":"abc","storage.type":"cookie","storage.name":"intentIqId","storage.expires": "60"};

            IDHUBUTIL.applyDataTypeChangesIfApplicable(params);
            params.should.deep.equal(expectedResult);
            IDHUBUTIL.logError.should.be.calledOnce;

            done();
        });

        it('should set requestedAttributesOverrides value correctly as a JSON object', function(done) {
            params = {"name": "liveIntentId","params.publisherId": "12432415","params.requestedAttributesOverrides": {"uid2":false,"pubmatic":true}};
            var expectedResult = {
                name: "liveIntentId",
                "params.publisherId": "12432415",
                "params.requestedAttributesOverrides": {"uid2": false, "pubmatic": true}
            };
            IDHUBUTIL.applyDataTypeChangesIfApplicable(params);
            params.should.deep.equal(expectedResult);
            
            done();
        });

        it('should not set requestedAttributesOverrides parameter if its received as blank object in config', function(done) {
            params = {"name": "liveIntentId","params.publisherId": "12432415"};
            var expectedResult = {
                name: "liveIntentId",
                "params.publisherId": "12432415"
            };
            IDHUBUTIL.applyDataTypeChangesIfApplicable(params);
            params.should.deep.equal(expectedResult);
            done();
        });
    });  

    describe('#applyCustomParamValuesfApplicable', function() {
        var paramsForID5;
        beforeEach(function(done) {
            paramsForID5 = {"name":"id5Id","storage":{"type":"html5","expires":"30","name":"id5id","refreshInSeconds":"28800"},"params":{"partner":173,},"display":0}
            done();
        });
        afterEach(function(done) {
            paramsForID5 = null;
            done();
        });
        it('should update the params object if custom values are provided for ID partners', function(done) {
            IDHUBUTIL.applyCustomParamValuesfApplicable(paramsForID5);
            expect(paramsForID5["params.provider"]).to.be.defined;
            expect(paramsForID5["params.provider"]).to.be.equal("pubmatic-identity-hub");
            done();
        });
    });

    // describe('#deleteCustomParams', function() {
    //     var paramsForLiverampV2;
    //     beforeEach(function(done) {
    //         paramsForLiverampV2 = {
    //             "name": "identityLink",
    //             "storage": {
    //                 "name": "lr_str_v2",
    //                 "type": "cookie",
    //                 "expires": "30",
    //                 "refreshInSeconds": 2400
    //             },
    //             "params": {
    //                 "pid": "1258"
    //             },
    //             "custom": {
    //                 "loadLaunchPad": "true",
    //                 "configurationId": "12442745-5ed1-4dc2-b3a1-b9722f16b1f6"
    //             },
    //         }
    //         done();
    //     });
    //     afterEach(function(done) {
    //         paramsForLiverampV2 = null;
    //         done();
    //     });
    //     it('should delete custom object in the params object if custom values are present', function(done) {
    //         IDHUBUTIL.deleteCustomParams(paramsForLiverampV2);
    //         expect(paramsForLiverampV2.custom).to.be.undefined;
    //         done();
    //     });
    // });

    // describe('#getEmailHashes', function() {
    //     beforeEach(function(done) {
    //         done();
    //     });
    //     afterEach(function(done) {
    //         CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SSO_ENABLED] = "0";
    //         done();
    //     });
    //     it('should return the emailHashes in array if SSO enabled is disabled and publisher Provided email Hash is present', function(done) {
    //         var expectedResult=['4e8fb772f3a4034906153f2d4258ee5c', 'e770f63ff1d3eb07b589b4ab972009b5ad8d836b', 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d'];
    //         function getUserIdentities() {
    //             return {
    //                 email: "zeotaptestrab@gmail.com",
    //                 pubProvidedEmailHash: {
    //                     MD5: '4e8fb772f3a4034906153f2d4258ee5c', SHA1: 'e770f63ff1d3eb07b589b4ab972009b5ad8d836b', SHA256: 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d'
    //                 }
    //             }
    //         }
    //         window['ihowpbjs'] = {
    //             'getUserIdentities': getUserIdentities
    //         }
    //         var result = IDHUBUTIL.getEmailHashes();
    //         result.should.deep.equal(expectedResult);
    //         done();
    //     });

    //     it('should return the emailHash in array if SSO enabled and email Hash fetched is present', function(done) {
    //         var expResult=['b9ea47bd80a563c9299ca16b2f79405b', 'df0dd701dc1a7ef9dd65d6eca9abfbc1c33abbd1', 'c08a386a01d187e2e3b03489b6553b0d7cf7ac6feb99a92516f9fbde30d0b283'];
    //         CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SSO_ENABLED] = "1";
    //         function getUserIdentities() {
    //             return {
    //                 email: "zeotaptestrab@gmail.com",
    //                 emailHash: {
    //                     MD5: 'b9ea47bd80a563c9299ca16b2f79405b', SHA1: 'df0dd701dc1a7ef9dd65d6eca9abfbc1c33abbd1', SHA256: 'c08a386a01d187e2e3b03489b6553b0d7cf7ac6feb99a92516f9fbde30d0b283'
    //                 }
    //             }
    //         }
    //         window['ihowpbjs'] = {
    //             'getUserIdentities': getUserIdentities
    //         }
    //         var result = IDHUBUTIL.getEmailHashes();
    //         result.should.deep.equal(expResult);
    //         done();
    //     });
    // });
})