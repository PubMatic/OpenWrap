/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");
var AE = require("../src_new/adapterEntry");
var BMEntry = require("../src_new/bmEntry.js").BMEntry;

var commonAdpterID = 'pubmatic';
var commonBidID = "bid_id";
var commonBmEntryName = "bm_entry_name";;


// TODO : remove as required during single TDD only
// var jsdom = require('jsdom').jsdom;
// var exposedProperties = ['window', 'navigator', 'document'];
// global.document = jsdom('');
// global.window = document.defaultView;
// Object.keys(document.defaultView).forEach((property) => {
//     if (typeof global[property] === 'undefined') {
//         exposedProperties.push(property);
//         global[property] = document.defaultView[property];
//     }
// });
// global.navigator = {
//     userAgent: 'node.js'
// };

describe('Bid bmEntryObject', function() {
    var bmEntryObject = null;
    var name = null;

    beforeEach(function(done) {
        name = commonBmEntryName;
        bmEntryObject = new BMEntry(name);
        done();
    });

    afterEach(function(done) {
        bmEntryObject = null;
        done();
    });


    describe('#setExpired', function() {

        it('is a function', function(done) {
            bmEntryObject.setExpired.should.be.a('function');
            done();
        });

        it('returns bmEntryObject with updating expired to true', function(done) {
            bmEntryObject.setExpired().should.equal(bmEntryObject);
            done();
        });
    });

    describe('#getExpiredStatus', function() {

        it('is a function', function(done) {
            bmEntryObject.getExpiredStatus.should.be.a('function');
            done();
        });

        it('returns expired status', function(done) {
            bmEntryObject.getExpiredStatus().should.equal(bmEntryObject.expired);
            done();
        });
    });

    describe('#setAnalyticEnabled', function() {

        it('is a function', function(done) {
            bmEntryObject.setAnalyticEnabled.should.be.a('function');
            done();
        });

        it('returns bmEntryObject with updating expired to true', function(done) {
            bmEntryObject.setAnalyticEnabled().should.equal(bmEntryObject);
            done();
        });
    });

    describe('#getAnalyticEnabledStatus', function() {

        it('is a function', function(done) {
            bmEntryObject.getAnalyticEnabledStatus.should.be.a('function');
            done();
        });

        it('returns expired status', function(done) {
            bmEntryObject.getAnalyticEnabledStatus().should.equal(bmEntryObject.analyticsEnabled);
            done();
        });
    });

    xdescribe('#setNewBid', function() {
        var adapterID = null,
            theBid = null;

        var AdapterEntryStubReturn = null;
        beforeEach(function(done) {
            sinon.stub(UTIL, "isOwnProperty").returns(false);
            AdapterEntryStubReturn = {
                setNewBid: function() {
                    return "setNewBid";
                }
            };
            sinon.stub(AE, "AdapterEntry").returns(AdapterEntryStubReturn);
            sinon.spy(AdapterEntryStubReturn, "setNewBid");
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            AE.AdapterEntry.restore();
            AdapterEntryStubReturn.setNewBid.restore();
            done();
        });

        it('is a function', function(done) {
            bmEntryObject.setNewBid.should.be.a('function');
            done();
        });

        it('should have added Adapter Entry Object for given adapterID', function(done) {
            adapterID = commonAdpterID;
            theBid = {};
            bmEntryObject.setNewBid(adapterID, theBid);
            UTIL.isOwnProperty.calledWith(bmEntryObject.adapters, adapterID).should.be.true;
            AdapterEntryStubReturn.setNewBid.calledWith(theBid).should.be.true;
            done();
        });
    });

    describe('#getBid', function() {
        var adapterID = null,
            bidID = null;

        beforeEach(function(done) {
            adapterID = commonAdpterID;
            bidID = commonBidID;
            sinon.stub(UTIL, "isOwnProperty").returns(true);
            done();
        });

        afterEach(function(done) {
            adapterID = null;
            bidID = null;
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            bmEntryObject.getBid.should.be.a('function');
            done();
        });

        it('returns expired status', function(done) {
            bmEntryObject.adapters[adapterID] = {
                getBid: function() {
                    return "getBid";
                }
            };

            sinon.spy(bmEntryObject.adapters[adapterID], "getBid");

            bmEntryObject.getBid(adapterID, bidID).should.equal(bmEntryObject.adapters[adapterID].getBid());
            UTIL.isOwnProperty.calledWith(bmEntryObject.adapters, adapterID).should.be.true;
            bmEntryObject.adapters[adapterID].getBid.calledWith(bidID).should.be.true;
            bmEntryObject.adapters[adapterID].getBid.restore()
            done();
        });
    });

    describe('#getName', function() {

        it('is a function', function(done) {
            bmEntryObject.getName.should.be.a('function');
            done();
        });

        it('returns name', function(done) {
            bmEntryObject.getName().should.equal(bmEntryObject.name);
            done();
        });
    });

    describe('#getCreationTime', function() {

        it('is a function', function(done) {
            bmEntryObject.getCreationTime.should.be.a('function');
            done();
        });

        it('returns creationTime', function(done) {
            bmEntryObject.getCreationTime().should.equal(bmEntryObject.creationTime);
            done();
        });
    });

    describe('#setImpressionID', function() {

        it('is a function', function(done) {
            bmEntryObject.setImpressionID.should.be.a('function');
            done();
        });

        it('returns modified bmEntryObject while setting up the passed in value', function(done) {
            var value = 12345;
            bmEntryObject.setImpressionID(value).should.equal(bmEntryObject);
            done();
        });
    });

    describe('#getImpressionID', function() {

        it('is a function', function(done) {
            bmEntryObject.getImpressionID.should.be.a('function');
            done();
        });

        it('returns impressionID', function(done) {
            bmEntryObject.getImpressionID().should.equal(bmEntryObject.impressionID);
            done();
        });
    });

    describe('#setSizes', function() {

        it('is a function', function(done) {
            bmEntryObject.setSizes.should.be.a('function');
            done();
        });

        it('returns modified bmEntryObject while setting up the passed in value', function(done) {
            var sizes = [
                [320, 210],
                [1024, 768]
            ];
            bmEntryObject.setSizes(sizes).should.equal(bmEntryObject);
            done();
        });
    });

    describe('#getSizes', function() {

        it('is a function', function(done) {
            bmEntryObject.getSizes.should.be.a('function');
            done();
        });

        it('returns sizes', function(done) {
            bmEntryObject.getSizes().should.equal(bmEntryObject.sizes);
            done();
        });
    });

    xdescribe('#setAdapterEntry', function() {
        var adapterID = null;

        beforeEach(function(done) {
            adapterID = commonAdpterID;
            sinon.stub(UTIL, "isOwnProperty").returns(false);

            done();
        });

        afterEach(function(done) {
            adapterID = null;
            done();
        });

        it('is a function', function(done) {
            bmEntryObject.setAdapterEntry.should.be.a('function');
            done();
        });

        it('should do what...', function(done) {
            bmEntryObject.adapters[adapterID] = {
                getCallInitiatedTime: function() {
                    return "getCallInitiatedTime";
                }
            };

            bmEntryObject.setAdapterEntry(adapterID).should.be.deep.equal(bmEntryObject);
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M4 + bmEntryObject.name + " " + adapterID + " " + bmEntryObject.adapters[adapterID].getCallInitiatedTime())
            done();
        });
    });

    describe('#getLastBidIDForAdapter', function() {
        var adapterID = null;

        beforeEach(function(done) {
            adapterID = commonAdpterID;
            sinon.stub(UTIL, "isOwnProperty").returns(true);

            done();
        });

        afterEach(function(done) {
            adapterID = null;
            UTIL.isOwnProperty.restore();
            done();
        });

        it('is a function', function(done) {
            bmEntryObject.getLastBidIDForAdapter.should.be.a('function');
            done();
        });

        it('returns empty string if given adapterID is not in bmEntry\'s adapters', function(done) {
            UTIL.isOwnProperty.returns(false);
            adapterID = "non_existing_adapter_id";
            bmEntryObject.getLastBidIDForAdapter(adapterID).should.be.equal("");
            done();
        });

        it('return last Bid ID  for given adapterID of present in bmEntry\' adapters', function(done) {
            bmEntryObject.adapters[adapterID] = {
                getLastBidID: function() {
                    return "getLastBidID";
                }
            };
            sinon.spy(bmEntryObject.adapters[adapterID], "getLastBidID")
            bmEntryObject.getLastBidIDForAdapter(adapterID).should.be.deep.equal(bmEntryObject.adapters[adapterID].getLastBidID());
            bmEntryObject.adapters[adapterID].getLastBidID.called.should.be.true;
            done();
        });
    });
});
