/* global describe, it, xit, sinon, expect */

var util = require("../src_new/util");
var assert = require("assert");
console.log('util.isA  ==>', util.isA);

describe("Util", function() {
	var obj_function = function() {};

	describe("isFunction", function() {
		it("isFunction checks whether passed object is function or not", function(done) {
			var output = util.isFunction(obj_function);
			assert.deepEqual(output, true);
			done();
		});
	});

	describe("isFunction Sinon check", function () {
		sinon.spy(util, "isFunction");
		it("Attach Sinon spy to util function ", function (done) {
			var output = util.isFunction(obj_function);
			expect(util.isFunction.calledOnce);
			done();
		});
	});
	
	/* start-test-block */
	describe("isFunction Sinon stub example", function () {
		sinon.stub(util, "isA");
		it("should do what...", function (done) {
			var output = util.isFunction(obj_function);
			expect(util.isA.calledOnce);
			done();
		});
	});
	/* end-test-block */

    /* start-test-block */
	describe("isA", function () {
		it("isA checks whether passed entity is object or now", function (done) {
			var output = util.isFunction(obj_function);
            // assert.deepEqual(output, true);
			expect(output).to.equal(true); // Note : chai works
			done();
		});
	});
    /* end-test-block */
});


/* start-test-block */

var lorem = "lorem  ipsum";

/* end-test-block */