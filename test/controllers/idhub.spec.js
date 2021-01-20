/* global describe, it, sinon, beforeEach, afterEach */
// var sinon = require("sinon");
// var should = require("chai").should();
// var expect = require("chai").expect;

var IDHUB = require("../../src_new/controllers/idhub.js");
var UTIL = require("../../src_new/util.js");
var CONFIG = require("../../src_new/config.js");

describe("CONTROLLER: IDHUB", function() {
	describe("#init", function() {

		beforeEach(function(done) {
			sinon.spy(UTIL, "isObject");
			sinon.spy(IDHUB, "initIdHub");
			done();
		});

		afterEach(function(done) {
			UTIL.isObject.restore();
			IDHUB.initIdHub.restore();
			done();
		});

		it("should return false when window object is null", function(done) {
			IDHUB.init(null).should.equal(false);
			done();
		});

		xit("should have called respective internal functions ", function(done) {
			IDHUB.init(window).should.equal(true);
			UTIL.isObject.called.should.be.true;
			UTIL.isObject.returned(true).should.to.be.true;
			IDHUB.initIdHub.called.should.be.true;
			done();
		});

		xit("should not proceed if passed window object is invalid", function (done) {
			IDHUB.init("NonObject").should.be.false;
			UTIL.isObject.called.should.be.true;
			UTIL.isObject.returned(false).should.be.true;
			UTIL.isObject.calledWith("NonObject").should.be.true;
			IDHUB.initIdHub.called.should.be.false;
	
			done();
		});
	});
    
	describe("#initIdHub", function(){
		beforeEach(function(done){
			sinon.stub(CONFIG,"isUserIdModuleEnabled").returns(false);
			sinon.stub(CONFIG,"isIdentityOnly").returns(false);
			sinon.spy(IDHUB,"setConfig");
			done();
		});

		afterEach(function(done){
			CONFIG.isUserIdModuleEnabled.restore();
			CONFIG.isIdentityOnly.restore();
			IDHUB.setConfig.restore();
			done();
		});

		it("should call prebid setConfig if identity is enabled",function(done){
			CONFIG.isUserIdModuleEnabled.restore();
			sinon.stub(CONFIG,"isUserIdModuleEnabled").returns(true);
			IDHUB.init(window);
			IDHUB.setConfig.called.should.be.true;
			done();
		});
		
		it("should not call prebid setConfig if identity not is enabled",function(done){
			IDHUB.init();
			IDHUB.setConfig.called.should.be.false;
			done();
		});
	});
});
