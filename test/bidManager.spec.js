/* global describe, it, xit, sinon, expect */
var sinon = require('sinon');
var should = require("chai").should();
var expect = require("chai").expect;
var bidManager = require("../src_new/bidManager.js");
var util = require("../src_new/util");
// var GPT = require("../../src_new/controllers/gpt.js");
// var UTIL = require("../../src_new/util.js");
// var AM = require("../../src_new/adapterManager.js");


describe('bidManager', function() {
    describe('createBidEntry', function() {

        it('bidManager.createBidEntry is a function', function(done) {
            expect(bidManager.createBidEntry).to.be.function;
            done();
        });
    });

    describe('what?', function() {
        var bidMap = {};

        // beforeEach(function() {

        var divID = "xyz";
        var divID_Obj = {
            "xyz": {
                "bidsFromBidders": {},
                "adSlotSizes": [],
                "creationTime": util.getCurrentTimestampInMs()
            }
        };

        bidManager.createBidEntry(bidMap, divID);

        it('bidManager.createBidEntry to add bid objet of passed divID to win.PWT.bidMap', function(done) {
            expect(divID_Obj[divID]).to.eql(bidMap[divID]);
            done();
        });

        // });
    });
});
