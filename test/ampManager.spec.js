/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var AMPMgr = require('../src_new/ampManager.js');

describe("ampManager : AMPMgr", function() {

    /* start-test-block */
    describe('#createScriptTag', function() {

        it('is a function', function (done) {
            AMPMgr.createScriptTag.should.be.a('function');
            done();
        });

        it('does not return anything if url is not passed',function(done){
            var result = AMPMgr.createScriptTag();
            result.should.be.empty;
            done();
        });

        it('returns script tag with url and callbacks', function(done) {
            var scriptUrl = "http://example.com?"
            var result = AMPMgr.createScriptTag();

            result.should.be.below(100);
            done();
        });
    });
    /* end-test-block */

});
