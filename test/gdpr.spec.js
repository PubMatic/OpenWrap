/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CONFIG = require("../src_new/config.js");
var GDPR = require("../src_new/gdpr.js");

var win = {
    __cmp: function (a, b, c) {
        c({
          consentData: "MOCK_DATA_STRING"
        });
    },
    addEventListener: function (a, b) {
        b({
          consentData: "MOCK_DATA_STRING"
        });
    },
    localStorage: {
      getItem: function (key) {
        return '{"9999":{"t":4524546538377,"c":"MOCK_DATA_STRING","g":1}}';
      },
      setItem: function () {

      }
    }
};

describe('GDPR', function() {

    describe('#isCmpFound', function() {

        it("is a function", function(done) {
            GDPR.isCmpFound.should.be.a("function");
            done();
        });

        it("should return boolean value", function(done) {
            var window = win;
            GDPR.isCmpFound().should.be.a("boolean");
            done();
        });
    });

    describe('#setConsentDataInLS', function() {

        it("is a function", function(done) {
            GDPR.setConsentDataInLS.should.be.a("function");
            done();
        });

        it("should return if localStorage is not enabled", function(done) {
            var window = {
              localStorage: {
                getItem: function () {
                  return "mock-data";
                }
              }
            };
            var x = GDPR.setConsentDataInLS(CONFIG.getPublisherId(), "c", "MOCK_DATA", true);
            window.localStorage.getItem.should.not.be.called;
            done();
        });

        it("should save data in localStorage", function(done) {
            var window = win;
            var pubId = CONFIG.getPublisherId();
            var x = GDPR.setConsentDataInLS(pubId, "c", "", false);
            window.localStorage.getItem.should.be.called;
            window.localStorage.setItem.should.be.called;
            done();
        });
    });

    describe('#getUserConsentDataFromCMP', function() {
        beforeEach(function(done) {
            sinon.spy(CONFIG, "getPublisherId");
            done();
        });

        afterEach(function(done) {
            CONFIG.getPublisherId.restore();
            done();
        });

        it("is a function", function(done) {
            GDPR.getUserConsentDataFromCMP.should.be.a("function");
            done();
        });

        it("should get consentData from CMP Apis", function(done) {
            var window = win;
            GDPR.getUserConsentDataFromCMP();
            window.__cmp.should.be.called;
            CONFIG.getPublisherId.should.be.called;
            window.addEventListener.should.not.be.called;
            GDPR.setConsentDataInLS.should.be.called;
            done();
        });

        it("should get consentData from Upper Iframe if CMP not present", function(done) {
            window = {
              __cmp: null
            };
            GDPR.getUserConsentDataFromCMP();
            CONFIG.getPublisherId.should.be.called;
            window.addEventListener.should.be.called;
            GDPR.setConsentDataInLS.should.be.called;
            done();
        });
    });

    describe('#getUserConsentDataFromLS', function() {
        beforeEach(function(done) {
            sinon.spy(CONFIG, "getPublisherId");
            done();
        });

        afterEach(function(done) {
            CONFIG.getPublisherId.restore();
            done();
        });

        it("is a function", function(done) {
            GDPR.getUserConsentDataFromLS.should.be.a("function");
            done();
        });

        it("should return default value", function(done) {
            var window = {
              localStorage: {
                getItem: function () {
                  return "mock-data";
                }
              }
            };
            var consentData = GDPR.getUserConsentDataFromLS(CONFIG.getPublisherId());
            window.localStorage.getItem.should.not.be.called;
            consentData.should.deep.equal({ c: "", g: 0 });
            done();
        });

        it("should return expected value", function(done) {
            var window = win;
            var pubId = CONFIG.getPublisherId();
            GDPR.setConsentDataInLS(pubId, "c", "MOCK_DATA", true)
            var consentData = GDPR.getUserConsentDataFromLS(pubId);
            window.localStorage.getItem.should.be.called;
            consentData.should.deep.equal({ c: "MOCK_DATA", g: 1 });
            done();
        });
    });

});
