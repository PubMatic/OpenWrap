/* global describe, it, xit, sinon, expect, beforeEach, afterEach */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;
var typeString = "String";

var OWCren = require("../../src_new/creative/owCreativeRenderer.js");

describe("owCreativeRenderer : OWCren", function() {

     /* start-test-block */
	describe("#removeProtocolFromUrl", function() {

		it("is a function", function (done) {
			OWCren.removeProtocolFromUrl.should.be.a("function");
			done();
		});

		it("should return empty url if no url is passed as argument",function(done){
			var outputStr =  OWCren.removeProtocolFromUrl();
			outputStr.should.be.equal("");
			done();
		});

		it("should return url without protocol if url is passed as argument",function(done){
			var cacheUrl = "https://amptestapi.com";
			var outputUrl = "amptestapi.com";
			var outputStr = OWCren.removeProtocolFromUrl(cacheUrl);
			outputStr.should.be.equal(outputUrl);
			done();
		});
	});
    /* end-test-block */

     /* start-test-block */
	describe("#isString", function() {

		it("is a function", function(done) {
			OWCren.isString.should.be.a("function");
			done();
		});

		it("should have returned false when non string is passed", function (done) {
			var obj = {};
			OWCren.isString(obj).should.be.false;
			done();
		});

		it("should have called isA with proper arguments and return true in case of string being passed", function(done) {
			var str = "string_value";
			OWCren.isString(str).should.be.true;
			done();
		});
	});
    /* end-test-block */

    /* start-test-block */
	describe("renderCreative", function(){
		var theDocument=null;
		var params=null;

		beforeEach(function(done){
			theDocument = window;
			window.ucTag = {
				renderAd: function(){
                    //renders ad
				}
			};
			params = {
				cacheURL : "someUrl",
				uuid : "someId",
				cachePath : "/cache",
				size : "300x250"
			};
			this.renderAd = sinon.spy(window.ucTag, "renderAd");
			done();
		});

		afterEach(function(done){
			theDocument =null;
			params = null;
			this.renderAd.restore();
			done();
		});

		it("should be a function",function(done){
			OWCren.renderCreative.should.be.a("function");
			done();
		});
        
		it("should call prebidMethod if correct configuration is passed",function(done){
			OWCren.renderCreative(theDocument,params); 
			window.ucTag.renderAd.should.be.callled;
			done();
		});
        
		it("should not call prebidMethod if incorrect configuration is passed",function(done){
			params = undefined;
			OWCren.renderCreative(theDocument,params); 
			window.ucTag.renderAd.should.not.be.callled;
			done();
		}); 
	});
    
	describe("renderOWCreative",function(){
		var theDocument =null;
		var targetingKeys = null;

		beforeEach(function(done){
			theDocument = window;
			targetingKeys = {
				pwtcid : "",
				pwtcurl: "",
				pwtcpath: "",
				pwtsz: ""
			};
			done();
		});

		afterEach(function(done){
			theDocument =null;
			targetingKeys = null;
			done();
		});

		it("should be a function",function(done){
			OWCren.renderOWCreative.should.be.a("function");
			done();
		});

		it("should call renderCreative if targetingkeys are defined",function(done){
			OWCren.renderOWCreative(theDocument,targetingKeys);
			OWCren.removeProtocolFromUrl.should.be.callled;
			OWCren.renderCreative.should.be.callled;
			done();
		});

		it("should not call renderCreative if targetingkeys are undefined",function(done){
			targetingKeys = null;
			OWCren.renderOWCreative(theDocument,targetingKeys);
			OWCren.removeProtocolFromUrl.should.not.be.callled;
			OWCren.renderCreative.should.not.be.callled;
			done();
		});

		it("should not call renderCreative if targetingkeys are defined but cache or cache id is empty",function(done){
			targetingKeys.pwtcid = "";
			targetingKeys.cacheid = "";
			OWCren.renderOWCreative(theDocument,targetingKeys);
			OWCren.removeProtocolFromUrl.should.not.be.callled;
			OWCren.renderCreative.should.not.be.callled;
			done();
		});
	});
});
