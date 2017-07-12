/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

// var CONFIG = require("../src_new/config.js");
// var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");

var commonAdpterID = 'pubmatic';
// var commonDivID = "DIV_1";
// var commonKGPV = "XYZ";

var AdapterEntry = require("../src_new/adapterEntry.js").AdapterEntry;


describe('AdapterEntry', function() {

});

describe('AdapterEntry adapterEntryObject', function() {
    var adapterEntryObject = null;
    var adapterID = null;
    // var kgpv = null;
    beforeEach(function(done) {
        adapterID = commonAdpterID;
        // kgpv = commonKGPV;
        adapterEntryObject = new AdapterEntry(adapterID);
        done();
    });

    afterEach(function(done) {
        adapterEntryObject = null;
        done();
    });


    describe('Bid', function() {
        it('is a function', function(done) {
            AdapterEntry.should.be.a('function');
            done();
        });
    });

    describe('#getCallInitiatedTime', function () {
     	it('is a function', function (done) {
     		adapterEntryObject.getCallInitiatedTime.should.be.a('function');
     		done();
     	});
     }); 
	describe('#getLastBidID', function () {
	 	it('is a function', function (done) {
	 		adapterEntryObject.getLastBidID.should.be.a('function');
	 		done();
	 	});
	 }); 
	describe('#getBid', function () {
	 	it('is a function', function (done) {
	 		adapterEntryObject.getBid.should.be.a('function');
	 		done();
	 	});
	 }); 
	describe('#setNewBid', function () {
	 	it('is a function', function (done) {
	 		adapterEntryObject.setNewBid.should.be.a('function');
	 		done();
	 	});
	 }); 
});
