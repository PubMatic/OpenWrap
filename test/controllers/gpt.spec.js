/* global describe, it, xit, sinon, expect */
var sinon = require('sinon');
var should = require("chai").should();
var expect = require("chai").expect;
var GPT = require("../../src_new/controllers/gpt.js");
var UTIL = require("../../src_new/util.js");
var AM = require("../../src_new/adapterManager.js");

describe("CONTROLLER: GPT", function() {

	describe("#getAdUnitIndex()", function() {

		it("should return 0 when the object passed is null ", function() {
			GPT.getAdUnitIndex(null).should.equal(0);
		});

		it("should return 0 when the object passed is number ", function() {
			GPT.getAdUnitIndex(0).should.equal(0);
		});

		it("should return 0 when the object passed is empty string ", function() {
			GPT.getAdUnitIndex("").should.equal(0);
		});

		it("should return 0 when the object passed is not empty string ", function() {
			GPT.getAdUnitIndex("abcd").should.equal(0);
		});

		it("should return 0 when the object passed does not have required method ", function() {
			GPT.getAdUnitIndex({}).should.equal(0);
		});

		var random = Math.floor(Math.random() * 100);
		var test = {
			getSlotId: function() {
				return this;
			},
			getId: function() {
				return "abcd_" + random;
			}
		};

		it("should return " + random + " when the object passed does have required method ", function() {
			GPT.getAdUnitIndex(test).should.equal(random);
		});

	});

	describe("#callJsLoadedIfRequired()", function() {

		it("should return false when the object passed is string ", function() {
			GPT.callJsLoadedIfRequired("").should.equal(false);
		});

		it("should return false when the object passed is number ", function() {
			GPT.callJsLoadedIfRequired(1).should.equal(false);
		});

		it("should return false when the object passed is null ", function() {
			GPT.callJsLoadedIfRequired(null).should.equal(false);
		});

		it("should return false when the object is not passed ", function() {
			GPT.callJsLoadedIfRequired().should.equal(false);
		});

		it("should return false when the object passed is object but it does not have PWT property ", function() {
			GPT.callJsLoadedIfRequired({}).should.equal(false);
		});

		it("should return false when the object passed is object but PWT property is set to null", function() {
			GPT.callJsLoadedIfRequired({ PWT: null }).should.equal(false);
		});

		it("should return false when the object passed is object but PWT property is set to string", function() {
			GPT.callJsLoadedIfRequired({ PWT: "" }).should.equal(false);
		});

		it("should return false when the object passed is object but PWT property is set to number", function() {
			GPT.callJsLoadedIfRequired({ PWT: 1 }).should.equal(false);
		});

		it("should return false when the object passed is object but PWT property is set but does not have jsLoaded property", function() {
			GPT.callJsLoadedIfRequired({ PWT: {} }).should.equal(false);
		});

		it("should return false when the object passed is object but PWT property is set but jsLoaded is set to null", function() {
			GPT.callJsLoadedIfRequired({ PWT: { jsLoaded: null } }).should.equal(false);
		});

		it("should return false when the object passed is object but PWT property is set but jsLoaded is set to number", function() {
			GPT.callJsLoadedIfRequired({ PWT: { jsLoaded: 1 } }).should.equal(false);
		});

		it("should return false when the object passed is object but PWT property is set but jsLoaded is set to string", function() {
			GPT.callJsLoadedIfRequired({ PWT: { jsLoaded: "" } }).should.equal(false);
		});

		var _test = {
			PWT: {}
		};
		_test.PWT.jsLoaded = function() {
			flag = true;
		};
		var flag = false;
		it("should return true when the object passed is object and PWT property is set and jsLoaded is set to function and the function is called", function() {
			GPT.callJsLoadedIfRequired(_test).should.equal(true) && flag.should.equal(true);
		});

	});

	describe("#defineGPTVariables()", function() {		
		it("should return false when the null is passed", function() {
			GPT.defineGPTVariables(null).should.equal(false);
		});

		var x = {};
		it("should return true when the object passed is valid", function() {
			GPT.defineGPTVariables(x).should.equal(true) &&  UTIL.isObject(x.googletag) && UTIL.isArray(x.googletag.cmd);
		});

		var x = {
			googletag: {
				cmd: [1, 2, 3]
			}
		};
		it("should return true when the googletag.cmd is already defined", function() {
			GPT.defineGPTVariables(x).should.equal(true) &&  UTIL.isObject(x.googletag) && UTIL.isArray(x.googletag.cmd) && x.googletag.cmd.length.should.equal(3);
		});
	});

	describe("#setWindowReference()", function(){

		it("should not set WindowReference if argument is not object", function() {
			GPT.setWindowReference(0);
			expect(GPT.getWindowReference() === null).to.equal(true);
		});

		it("should set WindowReference if argument is object", function() {
			var x = {a:0};
			GPT.setWindowReference(x);
			var y = GPT.getWindowReference();
			expect(UTIL.isOwnProperty(y, 'a') && y.a === x.a).to.equal(true);
		});
	});

	describe("#init()", function(){

		it("should return false when the null is passed", function() {
			GPT.init(null).should.equal(false);
		});

		it("should return true when the object is passed", function() {
			GPT.init({}).should.equal(true);
		});

		describe("Sinon check", function(){			

			it("Attach Sinon stub to functions called from GPT.init ", function(done){
				sinon.stub(UTIL, "isObject", function(){return true});
				sinon.stub(GPT, "setWindowReference");
				sinon.stub(GPT, "defineWrapperTargetingKeys");
				sinon.stub(GPT, "defineGPTVariables");					
				sinon.stub(AM, "registerAdapters");
				sinon.stub(GPT, "addHooksIfPossible");
				sinon.stub(GPT, "callJsLoadedIfRequired");
				GPT.init({PWT:{jsLoaded: function(){}}});
				expect(UTIL.isObject.calledOnce &&
				GPT.setWindowReference.calledOnce &&
				GPT.defineWrapperTargetingKeys.calledOnce &&
				GPT.defineGPTVariables.calledOnce &&
				AM.registerAdapters.calledOnce &&
				GPT.addHooksIfPossible.calledOnce &&
				GPT.callJsLoadedIfRequired.calledOnce).to.equal(true);
				done();
			});
		});
	});

	describe("#defineWrapperTargetingKeys()", function(){
	});


});