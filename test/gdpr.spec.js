/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CONFIG = require("../src_new/config.js");
var GDPR = require("../src_new/gdpr.js");

describe('GDPR', function() {

    describe('#isCmpFound', function() {

        it("is a function", function(done) {
            GDPR.isCmpFound.should.be.a("function");
            done();
        });

        it("should return false if CMP is not present", function(done) {
            window = {
              __cmp: null
            };

            GDPR.isCmpFound().should.be.false;
            done();
        });

        // it("should return true if CMP is present", function(done) {
        //     // window = {
        //     //   __cmp: 1
        //     // };
        //     sinon.spy(window, "__cmp");
        //     console.log("fdevevrev:", GDPR.isCmpFound(), window.__cmp);
        //     GDPR.isCmpFound().should.be.true;
        //     done();
        // });
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
    });
});
