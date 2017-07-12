/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;


var CONF = require("../src_new/conf.js");
var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");

var CONFIG = require("../src_new/config.js");


describe('Config', function () {


	describe('#getPublisherId', function () {
		it('is a function', function (done) {
			CONFIG.getPublisherId.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getTimeout', function () {
		it('is a function', function (done) {
			CONFIG.getTimeout.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getAdapterRevShare', function () {
		it('is a function', function (done) {
			CONFIG.getAdapterRevShare.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getAdapterThrottle', function () {
		it('is a function', function (done) {
			CONFIG.getAdapterThrottle.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getBidPassThroughStatus', function () {
		it('is a function', function (done) {
			CONFIG.getBidPassThroughStatus.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getProfileID', function () {
		it('is a function', function (done) {
			CONFIG.getProfileID.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getProfileDisplayVersionID', function () {
		it('is a function', function (done) {
			CONFIG.getProfileDisplayVersionID.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getAnalyticsPixelURL', function () {
		it('is a function', function (done) {
			CONFIG.getAnalyticsPixelURL.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#getMonetizationPixelURL', function () {
		it('is a function', function (done) {
			CONFIG.getMonetizationPixelURL.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#forEachAdapter', function () {
		it('is a function', function (done) {
			CONFIG.forEachAdapter.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#addPrebidAdapter', function () {
		it('is a function', function (done) {
			CONFIG.addPrebidAdapter.should.be.a('function');
			done();
		});
	 	
	 }); 
	
	describe('#initConfig', function () {
		it('is a function', function (done) {
			CONFIG.initConfig.should.be.a('function');
			done();
		});
	 	
	 }); 
	
});