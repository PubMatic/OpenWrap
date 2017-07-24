/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CONFIG = require("../src_new/config.js");
var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");

var commonAdpterID = 'pubmatic';
var commonDivID = "DIV_1";
var commonKGPV = "XYZ";

var BID = require("../src_new/bid.js").Bid;


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

describe('Bid bidObject', function() {
    var bidObject = null;
    var adapterID = null;
    var kgpv = null;
    beforeEach(function(done) {
        adapterID = commonAdpterID;
        kgpv = commonKGPV;
        bidObject = new BID(adapterID, kgpv);
        done();
    });

    afterEach(function(done) {
        bidObject = null;
        done();
    });


    describe('Bid', function() {
        it('is a function', function(done) {
            BID.should.be.a('function');
            done();
        });
    });


    describe('#getAdapterID', function() {
        it('is a function', function(done) {
            bidObject.getAdapterID.should.be.a('function');
            done();
        });

        it('returns adapterID', function(done) {
            bidObject.getAdapterID().should.equal(bidObject.adapterID);
            done();
        });
    });

    describe('#getBidID', function() {
        it('is a function', function(done) {
            bidObject.getBidID.should.be.a('function');
            done();
        });

        it('returns bidID', function(done) {
            bidObject.getBidID().should.equal(bidObject.bidID);
            done();
        });
    });

    describe('#setGrossEcpm', function() {

        var ecpm = null;
        beforeEach(function (done) {
            ecpm = 2.0;
            sinon.spy(UTIL, 'log');
            sinon.stub(UTIL, "isString").returns(true);
            sinon.stub(window, "isNaN").returns(true);
            sinon.stub(window, "parseFloat").returns("NaN");
            // sinon.spy(CONFIG, "getAdapterRevShare");
            // sinon.spy(bidObject, "getAdapterID");

            done();
        });

        afterEach(function (done) {
            UTIL.log.restore();
            UTIL.isString.restore();
            window.isNaN.restore();
            window.parseFloat.restore();
            ecpm = null;
            done();
        });

        it('is a function', function(done) {
            bidObject.setGrossEcpm.should.be.a('function');
            done();
        });

        it('should return unmodified bid object when ecpm passed is null', function (done) {
            ecpm = null;
            bidObject.setGrossEcpm(ecpm).should.be.deep.equal(bidObject);
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M10).should.be.true;
            UTIL.log.calledWith(bidObject).should.be.true;
            done();
        });

        it('should return unmodified bid object when ecpm passed is empty string', function (done) {
            ecpm = "";
            bidObject.setGrossEcpm(ecpm).should.be.deep.equal(bidObject);
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M20).should.be.true;
            UTIL.log.calledWith(bidObject).should.be.true;
            done();
        });

        //todo: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NaN
        xit('should return when ecpm passed is Not a number', function (done) {
            ecpm = "NotANumber";
            UTIL.isString.returns(false);
            window.parseFloat.returns("NotANumber");
            bidObject.setGrossEcpm(ecpm).should.be.deep.equal(bidObject);
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M11+ecpm).should.be.true;
            UTIL.log.calledWith(bidObject).should.be.true;
            done();
        });

        it('should return modified bid object when ecpm passed is proper', function (done) {
            ecpm = 2.0;
            UTIL.isString.returns(false);
            window.isNaN.returns(false);
            window.parseFloat.returns(2.7);

            bidObject.setGrossEcpm(ecpm).should.be.deep.equal(bidObject);
            done();
        });

    });


    describe('#getGrossEcpm', function() {
        it('is a function', function(done) {
            bidObject.getGrossEcpm.should.be.a('function')
            done();
        });

        it('returns grossEcpm', function(done) {
            bidObject.getGrossEcpm().should.equal(bidObject.grossEcpm);
            done();
        });
    });

    describe('#getNetEcpm', function() {
        it('is a function', function(done) {
            bidObject.getNetEcpm.should.be.a('function')
            done();
        });

        it('returns netEcpm', function(done) {
            bidObject.getNetEcpm().should.equal(bidObject.netEcpm);
            done();
        });
    });

    describe('#setDefaultBidStatus', function() {
        it('is a function', function(done) {
            bidObject.setDefaultBidStatus.should.be.a('function')
            done();
        });

        it('changes defaultBid and returns changed/updated bid Object', function(done) {
            bidObject.defaultBid.should.equal(0);
            var status = 2;
            bidObject.setDefaultBidStatus(status).should.deep.equal(bidObject);
            bidObject.defaultBid.should.equal(2);
            done();

        });
    });

    describe('#getDefaultBidStatus', function() {
        it('is a function', function(done) {
            bidObject.getDefaultBidStatus.should.be.a('function')
            done();
        });

        it('returns defaultBid', function(done) {
            bidObject.getDefaultBidStatus().should.equal(bidObject.defaultBid);
            done();
        });
    });

    describe('#setAdHtml', function() {
        it('is a function', function(done) {
            bidObject.setAdHtml.should.be.a('function')
            done();
        });

        it('changes adHtml and returns changed/updated bid Object ', function(done) {
            bidObject.adHtml.should.equal("");
            var adHtml = "<body><h1>Ad text goes here</h1></body>";
            bidObject.setAdHtml(adHtml).should.deep.equal(bidObject);
            bidObject.adHtml.should.equal(adHtml);
            done();

        });
    });

    describe('#getAdHtml', function() {
        it('is a function', function(done) {
            bidObject.getAdHtml.should.be.a('function')
            done();
        });

        it('returns adHtml', function(done) {
            bidObject.getAdHtml().should.equal(bidObject.adHtml);
            done();
        });
    });

    describe('#setAdUrl', function() {
        it('is a function', function(done) {
            bidObject.setAdUrl.should.be.a('function')
            done();
        });

        it('changes adUrl and returns changed/updated bid Object ', function(done) {
            bidObject.adUrl.should.equal("");
            var adUrl = "http://example.com/ad/path";
            bidObject.setAdUrl(adUrl).should.deep.equal(bidObject);
            bidObject.adUrl.should.equal(adUrl);
            done();

        });
    });

    describe('#getAdUrl', function() {
        it('is a function', function(done) {
            bidObject.getAdUrl.should.be.a('function')
            done();
        });

        it('returns adUrl', function(done) {
            bidObject.getAdUrl().should.equal(bidObject.adUrl);
            done();
        });
    });

    describe('#setHeight', function() {
        it('is a function', function(done) {
            bidObject.setHeight.should.be.a('function')
            done();
        });

        it('changes height and returns changed/updated bid Object ', function(done) {
            bidObject.height.should.equal(0);
            var height = "http://example.com/ad/path";
            bidObject.setHeight(height).should.deep.equal(bidObject);
            bidObject.height.should.equal(height);
            done();

        });
    });

    describe('#getHeight', function() {
        it('is a function', function(done) {
            bidObject.getHeight.should.be.a('function')
            done();
        });

        it('returns height', function(done) {
            bidObject.getHeight().should.equal(bidObject.height);
            done();
        });
    });

    describe('#setWidth', function() {
        it('is a function', function(done) {
            bidObject.setWidth.should.be.a('function')
            done();
        });

        it('changes width and returns changed/updated bid Object ', function(done) {
            bidObject.width.should.equal(0);
            var width = "http://example.com/ad/path";
            bidObject.setWidth(width).should.deep.equal(bidObject);
            bidObject.width.should.equal(width);
            done();

        });
    });

    describe('#getWidth', function() {
        it('is a function', function(done) {
            bidObject.getWidth.should.be.a('function')
            done();
        });

        it('returns width', function(done) {
            bidObject.getHeight().should.equal(bidObject.width);
            done();
        });
    });

    describe('#getKGPV', function() {
        it('is a function', function(done) {
            bidObject.getKGPV.should.be.a('function')
            done();
        });

        it('returns kgpv', function(done) {
            bidObject.getKGPV().should.equal(bidObject.kgpv);
            done();
        });
    });

    describe('#setKeyValuePair', function() {
        it('is a function', function(done) {
            bidObject.setKeyValuePair.should.be.a('function')
            done();
        });

        it('add the given key and value pair to the bidObject and returns changed/updated bid Object ', function(done) {
            bidObject.keyValuePairs.should.deep.equal({});
            var key = "key_1";
            var value = "value_1";
            bidObject.setKeyValuePair(key, value).should.deep.equal(bidObject);
            bidObject.keyValuePairs[key].should.equal(value);
            done();

        });
    });

    describe('#getKeyValuePairs', function() {
        it('is a function', function(done) {
            bidObject.getKeyValuePairs.should.be.a('function')
            done();
        });

        it('returns keyValuePairs', function(done) {
            var key = "key_1";
            var value = "value_1";
            bidObject.setKeyValuePair(key, value);
            bidObject.getKeyValuePairs().should.deep.equal({ "key_1": value });
            done();
        });
    });

    describe('#setPostTimeoutStatus', function() {
        it('is a function', function(done) {
            bidObject.setPostTimeoutStatus.should.be.a('function')
            done();
        });

        it('changes isPostTimeout to be true and returns changed/updated bid Object ', function(done) {
            bidObject.isPostTimeout.should.equal(false);
            bidObject.setPostTimeoutStatus().should.deep.equal(bidObject);
            bidObject.isPostTimeout.should.be.true;
            done();
        });
    });

    describe('#getPostTimeoutStatus', function() {
        it('is a function', function(done) {
            bidObject.getPostTimeoutStatus.should.be.a('function')
            done();
        });

        it('returns isPostTimeout', function(done) {
            bidObject.getPostTimeoutStatus().should.equal(bidObject.isPostTimeout);
            done();
        });
    });

    describe('#setReceivedTime', function() {
        it('is a function', function(done) {
            bidObject.setReceivedTime.should.be.a('function')
            done();
        });

        it('changes receivedTime to be true and returns changed/updated bid Object ', function(done) {
            bidObject.receivedTime.should.equal(0);
            bidObject.setReceivedTime(1234).should.deep.equal(bidObject);
            bidObject.receivedTime.should.equal(1234);
            done();
        });
    });

    describe('#getReceivedTime', function() {
        it('is a function', function(done) {
            bidObject.getReceivedTime.should.be.a('function')
            done();
        });

        it('returns isPostTimeout', function(done) {
            bidObject.getReceivedTime().should.equal(bidObject.receivedTime);
            done();
        });
    });

    describe('#setDealID', function() {
        var dealID = null;

        beforeEach(function (done) {
            sinon.spy(bidObject, "setKeyValuePair");
            done();
        });

        afterEach(function (done) {
            bidObject.setKeyValuePair.restore();
            done();
        });
        it('is a function', function(done) {
            bidObject.setDealID.should.be.a('function')
            done();
        });

        it('returns bidObject with updating dealID if porper dealID is passed', function (done) {
            dealID = "deal_id";
            bidObject.setDealID(dealID).should.be.deep.equal(bidObject);
            bidObject.setKeyValuePair.calledWith(
                CONSTANTS.COMMON.DEAL_KEY_FIRST_PART+bidObject.adapterID, 
                bidObject.dealChannel + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.dealID + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.bidID
            )
            .should.be.true;
            done();
        });

        it('returns bidObject without updating dealID if imporper dealID is passed', function (done) {
            dealID = false;
            bidObject.setDealID(dealID).should.be.deep.equal(bidObject);
            bidObject.setKeyValuePair.calledWith(
                CONSTANTS.COMMON.DEAL_KEY_FIRST_PART+bidObject.adapterID, 
                bidObject.dealChannel + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.dealID + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.bidID
            )
            .should.be.false;
            done();
        });

    });

    describe('#getDealID', function() {
        it('is a function', function(done) {
            bidObject.getDealID.should.be.a('function')
            done();
        });

        it('returns dealID', function(done) {
            bidObject.getDealID().should.equal(bidObject.dealID);
            done();
        });
    });

    describe('#setDealChannel', function() {
        var dealChannel = null;

        beforeEach(function (done) {
            sinon.spy(bidObject, "setKeyValuePair");
            done();
        });

        afterEach(function (done) {
            bidObject.setKeyValuePair.restore();
            done();
        });

        it('is a function', function(done) {
            bidObject.setDealChannel.should.be.a('function')
            done();
        });

        it('returns bidObject with updating dealChannel if porper dealChannel is passed', function (done) {
            dealChannel = "deal_channel";
            bidObject.dealID = "deal_id";
            bidObject.setDealChannel(dealChannel).should.be.deep.equal(bidObject);
            bidObject.setKeyValuePair.calledWith(
                CONSTANTS.COMMON.DEAL_KEY_FIRST_PART+bidObject.adapterID, 
                bidObject.dealChannel + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.dealID + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.bidID
            )
            .should.be.true;
            done();
        });

        it('returns bidObject without updating dealChannel if imporper dealChannel is passed', function (done) {
            dealChannel = false;
            bidObject.setDealChannel(dealChannel).should.be.deep.equal(bidObject);
            bidObject.setKeyValuePair.calledWith(
                CONSTANTS.COMMON.DEAL_KEY_FIRST_PART+bidObject.adapterID, 
                bidObject.dealChannel + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.dealID + CONSTANTS.COMMON.DEAL_KEY_VALUE_SEPARATOR + bidObject.bidID
            )
            .should.be.false;
            done();
        });
        
    });

    describe('#getDealChannel', function() {
        it('is a function', function(done) {
            bidObject.getDealChannel.should.be.a('function')
            done();
        });

        it('returns dealChannel', function(done) {
            bidObject.getDealChannel().should.equal(bidObject.dealChannel);
            done();
        });
    });

    describe('#setWinningBidStatus', function() {
        it('is a function', function(done) {
            bidObject.setWinningBidStatus.should.be.a('function')
            done();
        });

        it('changes isWinningBid to be true and returns changed/updated bid Object ', function(done) {
            bidObject.isWinningBid.should.be.false;
            bidObject.setWinningBidStatus().should.deep.equal(bidObject);
            bidObject.isWinningBid.should.be.true;
            done();
        });
    });

    describe('#getWinningBidStatus', function() {
        it('is a function', function(done) {
            bidObject.getWinningBidStatus.should.be.a('function')
            done();
        });

        it('returns isWinningBid', function(done) {
            bidObject.getWinningBidStatus().should.equal(bidObject.isWinningBid);
            done();
        });
    });

    describe('#setStatus', function() {
        it('is a function', function(done) {
            bidObject.setStatus.should.be.a('function')
            done();
        });

        it('changes status to given value and returns changed/updated bid Object ', function(done) {
            bidObject.status.should.equal(0);
            bidObject.setStatus(1234).should.deep.equal(bidObject);
            bidObject.status.should.equal(1234);
            done();
        });
    });

    describe('#getStatus', function() {
        it('is a function', function(done) {
            bidObject.getStatus.should.be.a('function')
            done();
        });

        it('returns status', function(done) {
            bidObject.getStatus().should.equal(bidObject.status);
            done();
        });
    });

});
