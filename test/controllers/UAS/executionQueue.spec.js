/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var UTIL = require("../../../src_new/util.js");
var EXECUTION_QUEUE = require("../../../src_new/controllers/UAS/executionQueue").EexecutionQueue;

describe("EXECUTION QUEUE", function () {

    var executionQueue = null;

    beforeEach(function(done) {
        executionQueue = new EXECUTION_QUEUE();
        done();
    });

    afterEach(function(done) {
        executionQueue = null;
        done();
    });

    describe("EexecutionQueue Object", function () {
        it("is a function", function(done) {
            EXECUTION_QUEUE.should.be.a("function");
            done();
        });
    });

    describe("#push", function () {
        it("is a function", function(done) {
            executionQueue.push.should.be.a("function");
            done();
        });
    });

    describe("#executeQ", function () {
        it("is a function", function(done) {
            executionQueue.executeQ.should.be.a("function");
            done();
        });
    });
});
