/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var UTIL = require("../../../src_new/util");
// var CONFIG = require("../../../src_new/config");
// var CONSTANTS = require("../../../src_new/constants");
var PHOENIX  = require("../../../src_new/controllers/UAS/phoenix.js");
var UAS = require("../../../src_new/controllers/UAS/uas");
var AM = require("../../../src_new/adapterManager");

describe("CONTROLLER: UAS", function() {

    beforeEach(function (done) {
        window.Phoenix = {};
        done();
    });

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

    describe("#getWindowReference", function () {
        it("is a function", function (done) {
            UAS.getWindowReference.should.be.a("function");
            done();
        });

        it("should return the window object reference", function (done) {
            UAS.setWindowReference(window);
            UAS.getWindowReference().should.deep.equal(window);
            done();
        });
    });

    describe("#defineWrapperTargetingKeys()", function() {

        it("should return empty object when empty object is passed", function(done) {
            UAS.defineWrapperTargetingKeys({}).should.deep.equal({});
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
                UAS.defineWrapperTargetingKeys({}).should.deep.equal({});
                done();
            });

            it("should return object with values as keys and respective value should be empty strings", function(done) {
                UAS.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
                done();
            });

            it("should have called util.forEachOnObject", function(done) {
                UAS.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
                UTIL.forEachOnObject.calledOnce.should.equal(true);
                done();
            });
        });
    });

    describe("#callJsLoadedIfRequired", function() {

        it("should return false when the object passed is string ", function() {
            UAS.callJsLoadedIfRequired("").should.equal(false);
        });

        it("should return false when the object passed is number ", function() {
            UAS.callJsLoadedIfRequired(1).should.equal(false);
        });

        it("should return false when the object passed is null ", function() {
            UAS.callJsLoadedIfRequired(null).should.equal(false);
        });

        it("should return false when the object is not passed ", function() {
            UAS.callJsLoadedIfRequired().should.equal(false);
        });

        it("should return false when the object passed is object but it does not have PWT property ", function() {
            UAS.callJsLoadedIfRequired({}).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to null", function() {
            UAS.callJsLoadedIfRequired({ PWT: null }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to string", function() {
            UAS.callJsLoadedIfRequired({ PWT: "" }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set to number", function() {
            UAS.callJsLoadedIfRequired({ PWT: 1 }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but does not have jsLoaded property", function() {
            UAS.callJsLoadedIfRequired({ PWT: {} }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to null", function() {
            UAS.callJsLoadedIfRequired({ PWT: { jsLoaded: null } }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to number", function() {
            UAS.callJsLoadedIfRequired({ PWT: { jsLoaded: 1 } }).should.equal(false);
        });

        it("should return false when the object passed is object but PWT property is set but jsLoaded is set to string", function() {
            UAS.callJsLoadedIfRequired({ PWT: { jsLoaded: "" } }).should.equal(false);
        });

        var _test = {
            PWT: {}
        };
        _test.PWT.jsLoaded = function() {
            flag = true;
        };
        var flag = false;
        it("should return true when the object passed is object and PWT property is set and jsLoaded is set to function and the function is called", function() {
            UAS.callJsLoadedIfRequired(_test).should.equal(true);
            flag.should.equal(true);
        });
    });

    describe("#init", function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "isObject");
            sinon.spy(UAS, "defineWrapperTargetingKeys");
            sinon.spy(UAS, "createPubMaticNamespace");
            sinon.spy(AM, "registerAdapters");
            sinon.spy(UAS, "generateBCUID");
            sinon.spy(UAS, "callJsLoadedIfRequired");
            done();
        });

        afterEach(function(done) {
            UTIL.isObject.restore();
            UAS.defineWrapperTargetingKeys.restore();
            UAS.createPubMaticNamespace.restore();
            AM.registerAdapters.restore();
            UAS.generateBCUID.restore();
            UAS.callJsLoadedIfRequired.restore();
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

            UAS.defineWrapperTargetingKeys.called.should.be.true;
            UAS.createPubMaticNamespace.called.should.be.true;
            AM.registerAdapters.called.should.be.true;
            UAS.generateBCUID.called.should.be.true;
            UAS.callJsLoadedIfRequired.called.should.be.true;
            done();
        });

        it('should not proceed if passed window object is invalid', function (done) {
            UAS.init("NonObject").should.be.false;

            UTIL.isObject.called.should.be.true;
            UTIL.isObject.returned(false).should.be.true;

            UTIL.isObject.calledWith("NonObject").should.be.true;

            UAS.defineWrapperTargetingKeys.called.should.be.false;
            UAS.createPubMaticNamespace.called.should.be.false;
            AM.registerAdapters.called.should.be.false;
            UAS.generateBCUID.called.should.be.false;
            UAS.callJsLoadedIfRequired.called.should.be.false;
            done();
        });
    });
});
