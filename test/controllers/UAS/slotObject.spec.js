/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var UTIL = require("../../../src_new/util.js");
var SLOT_OBJECT = require("../../../src_new/controllers/UAS/slotObject").SlotObject;

var commonDivID = "DIV_1";
var commonDimensionArray = [[336,280]];
var commonAdUnitId = "10002918";

describe("Bid slotObject", function() {
    var slotObject = null;
    var adUnitId = null;
    var divElement = null;
    var dimensionArray = null;

    beforeEach(function(done) {
        adUnitId = commonAdUnitId;
        divElement = commonDivID;
        dimensionArray = commonDimensionArray;
        slotObject = new SLOT_OBJECT(adUnitId, dimensionArray, divElement);
        done();
    });

    afterEach(function(done) {
        slotObject = null;
        done();
    });

    describe("SlotObject", function() {

        it("is a function", function(done) {
            SLOT_OBJECT.should.be.a("function");
            done();
        });

        it("should have set deafult values of the SlotObject", function (done) {
            slotObject.adUnit.should.be.equal(commonAdUnitId)
            slotObject.dimensionArray.should.be.deep.equal(commonDimensionArray)
            slotObject.divElement.should.be.equal(commonDivID)
            slotObject.slotTargetings.should.be.deep.equal({})
            slotObject.slotKeywords.should.be.deep.equal([])
            slotObject.keywordsOperation.should.be.equal(0);
            slotObject.status.should.be.equal(0);
            slotObject.isNative.should.be.equal(false);
            slotObject.nativeTemplateID.should.be.equal(0);
            expect(slotObject.nativeReqestObject).to.be.a("null");
            expect(slotObject.nativeRenderingFunction).to.be.a("null");
            slotObject.id.should.be.equal(commonDivID);
            slotObject.isDisplayFunctionCalled.should.be.equal(false);
            expect(slotObject.response).to.be.a("null");
            slotObject.visibility.should.be.equal(0);
            done();
        });
    });

    describe("#setResponse", function() {

        it("is a function", function(done) {
            slotObject.setResponse.should.be.a("function");
            done();
        });

        it("set response", function(done) {
            var response = { id: 123, adId: "adfsse2312" };
            slotObject.setResponse(response);
            slotObject.response.should.be.deep.equal(response);
            done();
        });
    });

    describe("#getResponse", function() {

        it("is a function", function(done) {
            slotObject.getResponse.should.be.a("function");
            done();
        });

        it("returns response", function(done) {
            var response = { id: 123, adId: "adfsse2312" };
            slotObject.setResponse(response);
            slotObject.getResponse().should.be.deep.equal(response);
            done();
        });
    });

    describe("#getDisplayFunctionCalled", function() {

        it("is a function", function(done) {
            slotObject.getDisplayFunctionCalled.should.be.a("function");
            done();
        });

        it("returns isDisplayFunctionCalled flag", function(done) {
            slotObject.getDisplayFunctionCalled().should.be.equal(slotObject.isDisplayFunctionCalled);
            done();
        });
    });

    describe("#setDisplayFunctionCalled", function() {

        it("is a function", function(done) {
            slotObject.setDisplayFunctionCalled.should.be.a("function");
            done();
        });

        it("set isDisplayFunctionCalled flag", function(done) {
            slotObject.setDisplayFunctionCalled(true);
            slotObject.isDisplayFunctionCalled.should.be.equal(true);
            done();
        });
    });

    describe("#getStatus", function() {

        it("is a function", function(done) {
            slotObject.getStatus.should.be.a("function");
            done();
        });

        it("returns status", function(done) {
            var response = { id: 123, adId: "adfsse2312" };
            slotObject.getStatus().should.be.equal(slotObject.status);
            done();
        });
    });

    describe("#setStatus", function() {

        it("is a function", function(done) {
            slotObject.setResponse.should.be.a("function");
            done();
        });

        it("set status", function(done) {
            slotObject.setStatus(true);
            slotObject.status.should.be.equal(true);
            done();
        });
    });

    describe("#getId", function() {

        it("is a function", function(done) {
            slotObject.getId.should.be.a("function");
            done();
        });

        it("returns id", function(done) {
            slotObject.getId().should.be.equal(commonDivID);
            done();
        });
    });

    describe("#getAdUnit", function() {

        it("is a function", function(done) {
            slotObject.getAdUnit.should.be.a("function");
            done();
        });

        it("returns adUnit", function(done) {
            slotObject.getAdUnit().should.be.equal(slotObject.adUnit);
            done();
        });
    });

    describe("#getDimensions", function() {

        it("is a function", function(done) {
            slotObject.getDimensions.should.be.a("function");
            done();
        });

        it("returns dimensionArray", function(done) {
            slotObject.getDimensions().should.be.deep.equal(slotObject.dimensionArray);
            done();
        });
    });

    describe("#getDivElement", function() {

        it("is a function", function(done) {
            slotObject.getDivElement.should.be.a("function");
            done();
        });

        it("returns divElement", function(done) {
            slotObject.getDivElement().should.be.equal(slotObject.divElement);
            done();
        });
    });

    describe("#setTargeting", function() {

        it("is a function", function(done) {
            slotObject.setTargeting.should.be.a("function");
            done();
        });

        it("set slotTargetings with value is Array", function(done) {
            var targeting = { pwtm: ["1.231"] };
            slotObject.setTargeting("pwtm", targeting.pwtm);
            slotObject.slotTargetings.should.be.deep.equal(targeting);
            done();
        });

        it("set slotTargetings with value is string", function(done) {
            var targeting = { pwtm: ["1.231"] };
            slotObject.setTargeting("pwtm", targeting.pwtm[0]);
            slotObject.slotTargetings.should.be.deep.equal(targeting);
            done();
        });
    });

    describe("#getTargetingKeys", function() {

        it("is a function", function(done) {
            slotObject.getTargetingKeys.should.be.a("function");
            done();
        });

        it("returns targeting Keys", function(done) {
            var targeting = { pwtm: ["1.231"] };
            slotObject.setTargeting("pwtm", targeting.pwtm);
            expect(slotObject.getTargetingKeys()).to.be.a("array");
            slotObject.getTargetingKeys().should.be.deep.equal(["pwtm"]);
            done();
        });
    });

    describe("#getTargeting", function() {

        it("is a function", function(done) {
            slotObject.getTargeting.should.be.a("function");
            done();
        });

        it("returns targeting value", function(done) {
            var targeting = { pwtm: ["1.231"] };
            slotObject.setTargeting("pwtm", targeting.pwtm);
            slotObject.getTargeting("pwtm").should.be.deep.equal(targeting.pwtm);
            done();
        });
    });

    describe("#setKeywords", function() {

        it("is a function", function(done) {
            slotObject.setKeywords.should.be.a("function");
            done();
        });

        it("set slotKeywords", function(done) {
            var keyWords = ["1.231", "er243r", "er234"];
            slotObject.setKeywords(keyWords);
            slotObject.slotKeywords.should.be.deep.equal(keyWords);
            done();
        });
    });

    describe("#getKeywords", function() {

        it("is a function", function(done) {
            slotObject.getKeywords.should.be.a("function");
            done();
        });

        it("returns slotKeywords", function(done) {
            var keyWords = ["1.231", "er243r", "er234"];
            slotObject.setKeywords(keyWords);
            slotObject.getKeywords().should.be.deep.equal(keyWords);
            done();
        });
    });

    describe("#enableKeywordsAnding", function() {

        it("is a function", function(done) {
            slotObject.enableKeywordsAnding.should.be.a("function");
            done();
        });

        it("returns targeting value", function(done) {
            slotObject.enableKeywordsAnding();
            slotObject.keywordsOperation.should.be.equal(1);
            done();
        });
    });

    describe("#getKeywordsOperation", function() {

        it("is a function", function(done) {
            slotObject.getKeywordsOperation.should.be.a("function");
            done();
        });

        it("returns keywordsOperation", function(done) {
            slotObject.getKeywordsOperation().should.be.equal(slotObject.keywordsOperation);
            done();
        });
    });

    describe("#setNativeTemplateID", function() {

        it("is a function", function(done) {
            slotObject.setNativeTemplateID.should.be.a("function");
            done();
        });

        it("set native & its Id", function(done) {
            slotObject.setNativeTemplateID("1234");
            slotObject.isNative.should.be.equal(true);
            slotObject.nativeTemplateID.should.be.equal("1234");
            done();
        });
    });

    describe("#getNativeTemplateID", function() {

        it("is a function", function(done) {
            slotObject.getNativeTemplateID.should.be.a("function");
            done();
        });

        it("returns nativrTemplateId", function(done) {
            slotObject.setNativeTemplateID("1234");
            slotObject.getNativeTemplateID().should.be.equal("1234");
            done();
        });
    });

    describe("#setNativeRequestObject", function() {

        it("is a function", function(done) {
            slotObject.setNativeRequestObject.should.be.a("function");
            done();
        });

        it("set setNativeRequestObject", function(done) {
            var nativeRequestObj ={ a: "1", b: "2" };
            slotObject.setNativeRequestObject(nativeRequestObj);
            slotObject.isNative.should.be.equal(true);
            slotObject.nativeReuestObject.should.be.equal(nativeRequestObj);
            done();
        });
    });

    describe("#setVisibility", function() {

        it("is a function", function(done) {
            slotObject.setVisibility.should.be.a("function");
            done();
        });

        it("set visibility", function(done) {
            slotObject.setVisibility(3);
            slotObject.visibility.should.be.equal(3);
            done();
        });
    });

    describe("#getVisibility", function() {

        it("is a function", function(done) {
            slotObject.getVisibility.should.be.a("function");
            done();
        });

        it("return default visibility", function(done) {
            slotObject.getVisibility().should.be.equal(0);
            done();
        });

        it("return visibility", function(done) {
            slotObject.setVisibility(2);
            slotObject.getVisibility().should.be.equal(2);
            done();
        });
    });

    describe("#setNativeRenderingFunction", function() {

        it("is a function", function(done) {
            slotObject.setNativeRenderingFunction.should.be.a("function");
            done();
        });

        it("set setNativeRenderingFunction", function(done) {
            slotObject.setNativeRenderingFunction(function() {
              return 2324;
            });
            expect(slotObject.nativeRenderingFunction).to.be.a("function");
            done();
        });
    });

});
