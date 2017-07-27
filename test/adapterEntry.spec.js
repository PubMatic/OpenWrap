/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var UTIL = require("../src_new/util.js");
var AdapterEntry = require("../src_new/adapterEntry.js").AdapterEntry;
var BID = require("../src_new/bid.js").Bid;

var commonAdpterID = 'pubmatic';
var commonBidID = '9886ade8a';
var commonKGPV = "XYZ";
var commonNewBidID = "a4de2312";
var commonNewKGPV = "ABC";

describe('AdapterEntry adapterEntryObject', function() {
    var adapterEntryObject = null;
    var adapterID = null;
    
    beforeEach(function(done) {
        adapterID = commonAdpterID;
        adapterEntryObject = new AdapterEntry(adapterID);
        done();
    });

    afterEach(function(done) {
        adapterEntryObject = null;
        done();
    });


    describe('#AdapterEntry', function() {

        it('is a function', function(done) {
            AdapterEntry.should.be.a('function');
            done();
        });
    });

    describe('#getCallInitiatedTime', function() {

        it('is a function', function(done) {
            adapterEntryObject.getCallInitiatedTime.should.be.a('function');
            done();
        });

        it('returns callInitiatedTime', function(done) {
            adapterEntryObject.getCallInitiatedTime().should.equal(adapterEntryObject.callInitiatedTime);
            done();
        });
    });

    describe('#getLastBidID', function() {

        it('is a function', function(done) {
            adapterEntryObject.getLastBidID.should.be.a('function');
            done();
        });

        it('returns lastBidID', function(done) {
            adapterEntryObject.getLastBidID().should.equal(adapterEntryObject.lastBidID);
            done();
        });
    });

    describe('#getBid', function() {

        beforeEach(function(done) {
            sinon.spy(UTIL, "isOwnProperty");
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            adapterEntryObject.getBid.should.be.a('function');
            done();
        });

        it('returns bid object if given bidID is present in the adapterEntry bids', function(done) {
            adapterEntryObject.bids[commonBidID] = new BID(commonAdpterID, commonKGPV);
            adapterEntryObject.getBid(commonBidID).should.equal(adapterEntryObject.bids[commonBidID]);
            UTIL.isOwnProperty.calledWith(adapterEntryObject.bids, commonBidID).should.be.true;
            done();
        });

        it('returns null if given bidID is not present in the adapterEntry bids', function(done) {
            should.not.exist(adapterEntryObject.getBid(commonBidID));
            done();
        });
    });

    describe('#setNewBid', function() {

        it('is a function', function(done) {
            adapterEntryObject.setNewBid.should.be.a('function');
            done();
        });

        it('should assign passed bid as lastBid of the adapterEntry object while deleting the old one', function(done) {
            var existingLastBid = new BID(commonBidID, commonKGPV);
            var theBid = new BID(commonNewBidID, commonNewKGPV);
            adapterEntryObject.lastBid = existingLastBid;
            adapterEntryObject.setNewBid(theBid);
            adapterEntryObject.getLastBidID().should.be.equal(theBid.getBidID());
            adapterEntryObject.bids[theBid.getBidID()].should.be.equal(theBid);
            done();
        });
    });
});
