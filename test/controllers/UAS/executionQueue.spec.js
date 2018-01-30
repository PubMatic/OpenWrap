/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var UTIL = require("../../../src_new/util.js");
var EXECUTION_QUEUE = require("../../../src_new/controllers/UAS/executionQueue").EexecutionQueue;
var Phoenix  = require("../../../src_new/controllers/UAS/phoenix.js");

describe("EXECUTION QUEUE", function () {

    var executionQueue = null;
    var window = {};

    beforeEach(function(done) {
        executionQueue = new EXECUTION_QUEUE();
        window.Phoenix = new Phoenix.PhoenixClass();
        done();
    });

    afterEach(function(done) {
        executionQueue = null;
        window = {};
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

        it("should not add in queue if input is not function", function (done) {
            executionQueue.push("test");
            executionQueue.internalQ.length.should.be.equal(0);
            done();
        });

        // it("should add functions in queue", function (done) {
        //     var funct = sinon.spy();
        //     executionQueue.push(funct);
        //     executionQueue.internalQ.length.should.be.equal(1);
        //     done();
        // });
    });

    describe("#executeQ", function () {
        it("is a function", function(done) {
            executionQueue.executeQ.should.be.a("function");
            done();
        });

        // it("should execute the added function in queue", function (done) {
        //     var funct = sinon.spy();
        //     var proxy = once(funct);
        //     executionQueue.push(proxy);
        //     executionQueue.internalQ.length.should.be.equal(1);
        //     executionQueue.executeQ();
        //     executionQueue.internalQ.length.should.be.equal(0);
        //     assert(funct.called);
        //     done();
        // });

        // it("should execute the added function in queue only once", function (done) {
        //     var funct = sinon.spy();
        //     var proxy = once(funct);
        //     executionQueue.push(proxy);
        //     executionQueue.internalQ.length.should.be.equal(1);
        //     executionQueue.executeQ();
        //     executionQueue.executeQ();
        //     executionQueue.internalQ.length.should.be.equal(0);
        //     assert(funct.calledOnce);
        //     done();
        // });
    });
});
