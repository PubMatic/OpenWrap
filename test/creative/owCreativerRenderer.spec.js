/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;
var typeString = "String";

var OWCren = require('../../src_new/creative/owCreativeRenderer.js');

describe("owCreativeRenderer : OWCren", function() {

     /* start-test-block */
     describe('#removeProtocolFromUrl', function() {

        it('is a function', function (done) {
            OWCren.removeProtocolFromUrl.should.be.a('function');
            done();
        });

        it('should return empty url if no url is passed as argument',function(done){
           var outputStr =  OWCren.removeProtocolFromUrl();
             outputStr.should.be.equal("");
            done();
        });

        it('should return url without protocol if url is passed as argument',function(done){
            var cacheUrl = "https://amptestapi.com";
            var outputUrl = "amptestapi.com"
            var outputStr = OWCren.removeProtocolFromUrl(cacheUrl);
            outputStr.should.be.equal(outputUrl);
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
            OWCren.isString(obj).should.be.false;
            done();
        });

        it('should have called isA with proper arguments and return true in case of string being passed', function(done) {
            var str = "string_value";
            OWCren.isString(str).should.be.true;
            done();
        });
    });
    /* end-test-block */

});
