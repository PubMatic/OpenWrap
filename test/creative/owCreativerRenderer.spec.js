/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;
var typeString = "String";

var OWCren = require('../../src_new/creative/owCreativeRenderer.js');

describe("owCreativeRenderer : OWCren", function() {

    /* start-test-block */
    describe('#renderOWCreative', function() {

        it('is a function', function (done) {
            OWCren.renderOWCreative.should.be.a('function');
            done();
        });

        it('should not have called renderCreative when required parameters are not present',function(done){
            OWCren.renderOWCreative();
            OWCren.renderCreative.called.should.be.false;
            done();
        });

        it('should not have called renderCreative when required parameters are present',function(done){
            var targettingKeys = {
                cacheURL : 'https://amptestapi.com',
                cachePath:'/cache',
                cacheId:'3aa0df0e-54e8-4128-964a-7119cb3fc809'
            }
            OWCren.renderOWCreative(targettingKeys);
            OWCren.renderCreative.called.should.be.true;
            done();
        });
    });
    /* end-test-block */

     /* start-test-block */
     describe('#removeProtocolFromUrl', function() {

        it('is a function', function (done) {
            OWCren.removeProtocolFromUrl.should.be.a('function');
            done();
        });

        it('should return empty url if no url is passed as argument',function(done){
           var outputStr =  OWCren.removeProtocolFromUrl();
           expect(outputStr).should.be.equal("").to.be.true;
            done();
        });

        it('should return url without protocol if url is passed as argument',function(done){
            var cacheUrl = "https://amptestapi.com";
            var outputUrl = "amptestapi.com"
            var outputStr = OWCren.removeProtocolFromUrl(cacheUrl);
            expect(outputStr).should.be.equal(outputUrl).to.be.true;
            done();
        });
    });
    /* end-test-block */

     /* start-test-block */
    describe('#isString', function() {

        it('is a function', function(done) {
            OWCren.isString.should.be.a('function');
            done();
        });

        it('should have returned false when non string is passed', function (done) {
            var obj = {};
            OWCren.isFunction(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true in case of string being passed', function(done) {
            var str = "string_value";
            OWCren.isString(str).should.be.true;
            OWCren.isA.calledWith(str, typeString).should.be.true;
            done();
        });
    });
    /* end-test-block */

});
