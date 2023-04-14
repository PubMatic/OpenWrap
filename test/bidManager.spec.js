/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var BIDMgr = require('../src_new/bidManager');
var CONFIG = require("../src_new/config.js");
var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");
var GDPR = require("../src_new/gdpr.js");
var bmEntry = require("../src_new/bmEntry.js");
var bmEntryContstuctor = require("../src_new/bmEntry.js").BMEntry;
var AdapterEntry = require("../src_new/adapterEntry").AdapterEntry;
var bid = require('../src_new/bid.js').Bid;
var conf = require("../src_new/conf");

var commonAdpterID = 'pubmatic';
var serverAdapterID = "pubmaticServer";
var commonDivID = "DIV_1";
var commonKGPV = "XYZ";
var commonBidID = '9886ade8a';

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

describe('bidManager BIDMgr', function() {

    describe('#createBidEntry', function() {
        var divID = commonDivID;
        var bidObj = null;

        beforeEach(function(done) {
            window.PWT = {
                bidMap: {

                }
            };

            bidObj = bmEntry.createBMEntry(divID);

            sinon.spy(UTIL, 'isOwnProperty');
            sinon.spy(bmEntry, 'createBMEntry');
            done();
        });

        afterEach(function(done) {
            done();
            UTIL.isOwnProperty.restore();
            bmEntry.createBMEntry.restore();
            bidObj = null;
        });

        it('is a function', function(done) {
            BIDMgr.createBidEntry.should.be.a('function');
            done();
        });

        it('should have called bmEntry.createBMEntry when given DivID is not present in global BidMap', function(done) {
            BIDMgr.createBidEntry(divID);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            bmEntry.createBMEntry.calledOnce.should.be.true;
            bmEntry.createBMEntry.calledWith(divID).should.be.true;
            window.PWT.bidMap[divID].should.have.all.keys("adapters", "analyticsEnabled","creationTime","expired","impressionID","name","sizes","allPossibleBidsReceived");
            done();
        });

        it('should not have called bmEntry.createBMEntry when given DivID is not present in global BidMap', function(done) {
            window.PWT.bidMap[divID] = bidObj;
            BIDMgr.createBidEntry(divID);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            bmEntry.createBMEntry.calledTwice.should.be.false;
            window.PWT.bidMap[divID].should.deep.equal(bidObj);
            done();
        });
    });

    describe('#setSizes', function() {
        var divID = null;
        var slotSizes = null;
        var bmEntryStub = null;

        beforeEach(function(done) {
            window.PWT = {
                bidMap: {

                }
            };
            divID = commonDivID;
            slotSizes = [
                [230, 450]
            ];
            bmEntryStub = bmEntry.createBMEntry(divID);
            window.PWT.bidMap[divID] = bmEntryStub;
            sinon.spy(bmEntry.BMEntry.prototype, "setSizes");
            sinon.stub(BIDMgr, 'createBidEntry').returns(bmEntryStub);
            done();
        });

        afterEach(function(done) {
            divID = null;
            slotSizes = null;
            bmEntry.BMEntry.prototype.setSizes.restore();
            BIDMgr.createBidEntry.restore();
            done();
        });


        it('is a function', function(done) {
            BIDMgr.setSizes.should.be.a('function');
            done();
        });

        it('should have caled BIDMgr.createBidEntry', function(done) {
            BIDMgr.setSizes(divID, slotSizes);
            BIDMgr.createBidEntry.calledOnce.should.be.true;
            window.PWT.bidMap[divID].setSizes.should.be.a('function');
            window.PWT.bidMap[divID].setSizes.calledWith(slotSizes).should.be.true;
            done();
        });
    });

    describe('#setCallInitTime', function() {
        var adapterID = null;
        var divID = null;
        var bmEntryStub = null;

        beforeEach(function(done) {
            divID = commonDivID;
            adapterID = commonAdpterID;

            bmEntryStub = bmEntry.createBMEntry(divID);
            window.PWT.bidMap[divID] = bmEntryStub;
            sinon.spy(bmEntry.BMEntry.prototype, "setAdapterEntry");

            sinon.stub(BIDMgr, 'createBidEntry').returns(bmEntryStub);
            done();
        });

        afterEach(function(done) {
            BIDMgr.createBidEntry.restore();
            bmEntry.BMEntry.prototype.setAdapterEntry.restore();

            divID = null;
            adapterID = null;
            bmEntryStub = null;
            done();
        });

        it('is a function', function(done) {
            BIDMgr.setCallInitTime.should.be.a('function');
            done();
        });

        it('should have called BIDMgr.createBidEntry', function(done) {
            BIDMgr.setCallInitTime(divID, adapterID);
            BIDMgr.createBidEntry.calledOnce.should.be.true;
            window.PWT.bidMap[divID].setAdapterEntry.should.be.a('function');
            window.PWT.bidMap[divID].setAdapterEntry.calledWith(adapterID).should.be.true;
            done();
        });
    });

    describe('#setBidFromBidder', function() {
        var divID = null;
        var bidDetails = null;
        var adapterID = null;
        var kgpv = null;


        beforeEach(function(done) {
            divID = commonDivID;
            adapterID = commonAdpterID;
            kgpv = commonKGPV;

            bidDetails = new bid(adapterID, kgpv);

            window.PWT = {
                bidMap: {

                }
            };

            sinon.spy(bidDetails, 'getAdapterID');
            sinon.spy(bidDetails, 'getBidID');

            sinon.spy(UTIL, 'isOwnProperty');
            sinon.spy(UTIL, 'log');
            sinon.spy(UTIL, 'logError');
            sinon.spy(UTIL, 'logWarning');
            sinon.spy(CONFIG, 'getTimeout');

            sinon.stub(BIDMgr, 'storeBidInBidMap');
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            UTIL.log.restore();
            UTIL.logError.restore();
            UTIL.logWarning.restore();
            bidDetails.getAdapterID.restore();
            bidDetails.getBidID.restore();
            CONFIG.getTimeout.restore();
            BIDMgr.storeBidInBidMap.restore();

            kgpv = null;
            adapterID = null;
            divID = null;
            done();
        });

        it('is a function', function(done) {
            BIDMgr.setBidFromBidder.should.be.a('function');
            done();
        });

        it('should have called UTIL.isOwnProperty', function(done) {
            BIDMgr.setBidFromBidder(commonDivID, bidDetails);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            done();
        });

        it('should return by calling UTIL.log when given divID is not present in bidMap', function(done) {
            BIDMgr.setBidFromBidder(commonDivID, bidDetails);
            UTIL.log.calledWith("BidManager is not expecting bid for " + divID + ", from " + bidDetails.getBidID());
            done();
        });

        it('should have called storeBidInBidMap and util.log only when lastBidID is empty', function(done) {
            window.PWT.bidMap[divID] = bmEntry.createBMEntry(divID);
            var obj = window.PWT.bidMap[divID];
            sinon.spy(obj, 'getCreationTime');
            sinon.spy(bidDetails, 'getReceivedTime');

            sinon.stub(window.PWT.bidMap[divID], 'getLastBidIDForAdapter');
            window.PWT.bidMap[divID].getLastBidIDForAdapter.returns("");

            sinon.spy(window.PWT.bidMap[divID], 'getBid');


            BIDMgr.setBidFromBidder(divID, bidDetails);

            window.PWT.bidMap[commonDivID].getCreationTime.calledTwice.should.be.true;
            bidDetails.getReceivedTime.calledTwice.should.be.true;
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M18 +  bidDetails.getAdapterID()).should.be.true;
            window.PWT.bidMap[divID].getBid.called.should.be.false;

            window.PWT.bidMap[commonDivID].getCreationTime.restore();
            bidDetails.getReceivedTime.restore();
            window.PWT.bidMap[divID].getLastBidIDForAdapter.restore();
            window.PWT.bidMap[divID].getBid.restore();
            done();
        });

        describe('when lastBidID is not empty', function() {
            var obj = null;

            beforeEach(function(done) {
                window.PWT.bidMap[divID] = bmEntry.createBMEntry(divID);
                obj = window.PWT.bidMap[divID];
                sinon.stub(obj, 'getCreationTime');
                CONFIG.getTimeout.restore();
                sinon.stub(CONFIG, 'getTimeout');
                sinon.stub(bidDetails, 'getReceivedTime');
                sinon.stub(window.PWT.bidMap[divID], 'getLastBidIDForAdapter');
                sinon.stub(window.PWT.bidMap[divID], 'getBid');
                window.owpbjs = {

                };
                done();
            });

            afterEach(function(done) {
                window.PWT.bidMap[commonDivID].getCreationTime.restore();
                bidDetails.getReceivedTime.restore();
                window.PWT.bidMap[divID].getLastBidIDForAdapter.restore();
                window.PWT.bidMap[divID].getBid.restore();
                done();
            });

            it('and last Bid Was NOT Default Bid, should not have called storeBidInBidMap', function(done) {
                obj.getCreationTime.returns(2);
                CONFIG.getTimeout.returns(2);
                bidDetails.getReceivedTime.returns(5);
                window.PWT.bidMap[divID].getLastBidIDForAdapter.returns("nonempty");
                window.PWT.bidMap[divID].getBid.returns({
                    getDefaultBidStatus: function() {
                        return 2;
                    },
                    getNetEcpm: function() {
                        return 0;
                    }
                });


                BIDMgr.setBidFromBidder(divID, bidDetails);

                BIDMgr.storeBidInBidMap.called.should.be.false;

                window.PWT.bidMap[commonDivID].getCreationTime.calledTwice.should.be.true;
                bidDetails.getReceivedTime.calledTwice.should.be.true;
                UTIL.log.calledWith(CONSTANTS.MESSAGES.M17).should.be.true;
                window.PWT.bidMap[divID].getBid.called.should.be.true;

                done();
            });

            it('and last Bid Was NOT Default Bid, should have called storeBidInBidMap when last bid was Default Bid', function(done) {
                obj.getCreationTime.returns(2);
                CONFIG.getTimeout.returns(2);
                bidDetails.getReceivedTime.returns(1);
                window.PWT.bidMap[divID].getLastBidIDForAdapter.returns("nonempty");
                window.PWT.bidMap[divID].getBid.returns({
                    getDefaultBidStatus: function() {
                        return 1;
                    },
                    getNetEcpm: function() {
                        return 0;
                    }
                });
                var lastBid = window.PWT.bidMap[divID].getBid();

                BIDMgr.setBidFromBidder(divID, bidDetails);

                BIDMgr.storeBidInBidMap.called.should.be.true;

                window.PWT.bidMap[commonDivID].getCreationTime.calledTwice.should.be.true;
                bidDetails.getReceivedTime.calledTwice.should.be.true;
                UTIL.log.calledWith(CONSTANTS.MESSAGES.M23 +  bidDetails.getAdapterID()).should.be.true;
                UTIL.log.calledWith(CONSTANTS.MESSAGES.M12 + lastBid.getNetEcpm() + CONSTANTS.MESSAGES.M13 + bidDetails.getNetEcpm() + CONSTANTS.MESSAGES.M14 + bidDetails.getAdapterID()).should.be.true;
                window.PWT.bidMap[divID].getBid.called.should.be.true;

                done();
            });

            it('and last Bid Was NOT Default Bid, should have called storeBidInBidMap when last bid was Not Default Bid but lastBid ECPM is less than passed bids ECPM', function(done) {
                obj.getCreationTime.returns(2);
                CONFIG.getTimeout.returns(2);
                bidDetails.getReceivedTime.returns(1);
                window.PWT.bidMap[divID].getLastBidIDForAdapter.returns("nonempty");
                window.PWT.bidMap[divID].getBid.returns({
                    getDefaultBidStatus: function() {
                        return 2;
                    },
                    getNetEcpm: function() {
                        return 0;
                    }
                });

                sinon.stub(bidDetails, 'getNetEcpm');
                bidDetails.getNetEcpm.returns(2);

                var lastBid = window.PWT.bidMap[divID].getBid();

                BIDMgr.setBidFromBidder(divID, bidDetails);

                BIDMgr.storeBidInBidMap.called.should.be.true;

                window.PWT.bidMap[commonDivID].getCreationTime.calledTwice.should.be.true;
                bidDetails.getReceivedTime.calledTwice.should.be.true;
                UTIL.log.calledWith(CONSTANTS.MESSAGES.M23).should.be.false;
                UTIL.log.calledWith(CONSTANTS.MESSAGES.M12 + lastBid.getNetEcpm() + CONSTANTS.MESSAGES.M13 + bidDetails.getNetEcpm() + CONSTANTS.MESSAGES.M14);
                window.PWT.bidMap[divID].getBid.called.should.be.true;

                done();
            });
        });
    });

    describe('#storeBidInBidMap', function() {
        var slotID = null;
        var adapterID = null;
        var theBid = null;
        var latency = null;
        var kgpv = commonKGPV;

        beforeEach(function(done) {
            slotID = "Slot_1";
            adapterID = commonAdpterID;

            theBid = new bid(adapterID, kgpv);
            sinon.stub(theBid, 'getBidID');
            theBid.getBidID.returns(1234);
            latency = 1;
            window.PWT = {
                bidMap: {

                },
                bidIdMap: {

                }
            };
            window.PWT.bidMap[slotID] = {
                setNewBid: function() {
                    return "setNewBid";
                }
            };
            sinon.spy(window.PWT.bidMap[slotID], 'setNewBid');
            sinon.spy(UTIL, 'vLogInfo');
            done();
        });

        afterEach(function(done) {
            window.PWT.bidMap[slotID].setNewBid.restore();
            window.PWT.bidIdMap[theBid.getBidID()] = null;
            UTIL.vLogInfo.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.storeBidInBidMap.should.be.a('function');
            done();
        });

        it('should have called setNewBid and set bidIdMap of given bids bidID with slotID and adapterID', function(done) {
            BIDMgr.storeBidInBidMap(slotID, adapterID, theBid, latency);

            window.PWT.bidMap[slotID].setNewBid.called.should.be.true;
            window.PWT.bidIdMap[theBid.getBidID()].should.deep.equal({
                s: slotID,
                a: adapterID
            });
            done();
        });

        it('should not have called UTIL.vLogInfo when default bid status is not zero', function (done) {
            sinon.stub(theBid, 'getDefaultBidStatus');
            theBid.getDefaultBidStatus.returns(1);

            BIDMgr.storeBidInBidMap(slotID, adapterID, theBid, latency);

            UTIL.vLogInfo.calledOnce.should.be.false;
            done();
        });

        it('should have called UTIL.vLogInfo when default bid status is 0', function(done) {
            sinon.stub(theBid, 'getDefaultBidStatus');
            theBid.getDefaultBidStatus.returns(0);

            BIDMgr.storeBidInBidMap(slotID, adapterID, theBid, latency);

            UTIL.vLogInfo.calledOnce.should.be.true;
            UTIL.vLogInfo.calledWith(slotID, {
                type: "bid",
                bidder: adapterID + (CONFIG.getBidPassThroughStatus(adapterID) !== 0 ? '(Passthrough)' : ''),
                bidDetails: theBid,
                latency: latency,
                s2s: CONFIG.isServerSideAdapter(adapterID),
                adServerCurrency: UTIL.getCurrencyToDisplay()
            }).should.be.true;

            done();
        });
    });

    describe('#resetBid', function() {
        var divID = null;
        var impressionID = null;
        var bmEntryStub = null;
        var bmEntryStubPrev = null;

        beforeEach(function(done) {
            impressionID = 123123123;
            divID = commonDivID;

            window.PWT = {
                bidMap: {

                }
            };

            bmEntryStub = bmEntry.createBMEntry(divID);
            bmEntryStubPrev = bmEntry.createBMEntry("DIV_1_1");
            window.PWT.bidMap[divID] = bmEntryStubPrev;
            sinon.spy(bmEntry.BMEntry.prototype, "setImpressionID");

            sinon.stub(bmEntry, 'createBMEntry').withArgs(divID).returns(bmEntryStub);

            sinon.spy(BIDMgr, "createBidEntry");

            sinon.spy(UTIL, 'vLogInfo');

            done();
        });

        afterEach(function(done) {
            impressionID = null;
            divID = null;
            BIDMgr.createBidEntry.restore();
            bmEntry.createBMEntry.restore();
            UTIL.vLogInfo.restore();
            bmEntry.BMEntry.prototype.setImpressionID.restore();
            done();
        });


        it('is a function', function(done) {
            BIDMgr.resetBid.should.be.a('function');
            done();
        });

        it('should have called UTIL.vLogInfo', function(done) {
            BIDMgr.resetBid(divID, impressionID);

            BIDMgr.createBidEntry.called.should.be.true;
            UTIL.vLogInfo.calledWith(divID, { type: "hr" }).should.be.true;
            window.PWT.bidMap[divID].should.not.deep.equal(bmEntryStubPrev);
            window.PWT.bidMap[divID].setImpressionID.calledWith(impressionID).should.be.true;
            done();
        });
    });

    describe('#createMetaDataKey', function(){

        it('is a function', function(done) {
            BIDMgr.createMetaDataKey.should.be.a('function');
            done();
        });

        it('output', function(done){
            var divID = "DIV-1";
            var bmEntryObj = bmEntry.createBMEntry(divID);
            var theBid_1 = new bid("pubmatic", divID);
            theBid_1.setGrossEcpm(1.2);
            theBid_1.setDealID("DEALID123");
            theBid_1.setDealChannel("PMPG");
            theBid_1.setWidth(728);
            theBid_1.setHeight(90);
            bmEntryObj.setNewBid("pubmatic", theBid_1);
            var theBid_2 = new bid("appnexus", divID);
            theBid_2.setGrossEcpm(1.1);
            theBid_2.setDealID("DEALID123");
            theBid_2.setDealChannel("PMPG");
            theBid_2.setWidth(300);
            theBid_2.setHeight(250);
            bmEntryObj.setNewBid("appnexus", theBid_2);
            var theBid_3 = new bid("pulsepoint", divID);
            theBid_3.setDefaultBidStatus(1);
            bmEntryObj.setNewBid("pulsepoint", theBid_3);
            var keyValuePairs = {};
            BIDMgr.createMetaDataKey("_PC_:_BC_::_P_-_W_x_H_-_NE_(_GE_)||", bmEntryObj, keyValuePairs);
            var expectedOutput = "3:2::pubmatic-728x90-1.2(1.2)||3:2::appnexus-300x250-1.1(1.1)||";
            expect(keyValuePairs['pwtm']).to.equal(encodeURIComponent(expectedOutput));
            done();
        });

        it('does not log pwtm value in case of zero bids from pubmatic', function(done){
            var divID = "DIV-1";
            var bmEntryObj = bmEntry.createBMEntry(divID);
            var theBid_1 = new bid("pubmatic", divID);
            theBid_1.setGrossEcpm(0);
            theBid_1.setDealID("DEALID123");
            theBid_1.setDealChannel("PMPG");
            theBid_1.setWidth(728);
            theBid_1.setHeight(90);
            bmEntryObj.setNewBid("pubmatic", theBid_1);
            var theBid_2 = new bid("appnexus", divID);
            theBid_2.setGrossEcpm(1.1);
            theBid_2.setDealID("DEALID123");
            theBid_2.setDealChannel("PMPG");
            theBid_2.setWidth(300);
            theBid_2.setHeight(250);
            bmEntryObj.setNewBid("appnexus", theBid_2);
            var theBid_3 = new bid("pulsepoint", divID);
            theBid_3.setDefaultBidStatus(1);
            bmEntryObj.setNewBid("pulsepoint", theBid_3);
            var keyValuePairs = {};
            BIDMgr.createMetaDataKey("_PC_:_BC_::_P_-_W_x_H_-_NE_(_GE_)||", bmEntryObj, keyValuePairs);
            var expectedOutput = "3:1::appnexus-300x250-1.1(1.1)||";
            expect(keyValuePairs['pwtm']).to.equal(encodeURIComponent(expectedOutput));
            done();
        });
    });

    describe('#replaceMetaDataMacros', function(){

        it('is a function', function(done) {
            BIDMgr.replaceMetaDataMacros.should.be.a('function');
            done();
        });

        it('macro replacement', function(done){
            conf.adapters.pubmatic.rev_share = "10.0";
            var theBid = new bid("pubmatic", "div-1");
            theBid.setGrossEcpm(1.2);
            theBid.setDealID("DEALID123");
            theBid.setDealChannel("PMPG");
            theBid.setWidth(728);
            theBid.setHeight(90);
            var op = BIDMgr.replaceMetaDataMacros("_P_-_W_x_H_-_NE_(_GE_)", theBid);
            expect(op).to.equal("pubmatic-728x90-1.08(1.2)");
            done();
        });
    });

    describe('#auctionBids', function() {
        var bmEntryObj = null;
        var divID = null;
        var adapterID_1 = commonAdpterID + "_1";
        var theBid_1 = null;
        var adapterID_2 = commonAdpterID + "_2";
        var theBid_2 = null;
        var kgpv = commonKGPV;

        beforeEach(function(done) {
            divID = commonDivID;
            bmEntryObj = bmEntry.createBMEntry(divID);

            theBid_1 = new bid(adapterID_1, kgpv);
            theBid_1.setKeyValuePair("k1", "v1");
            theBid_1.setKeyValuePair("k2", "v2");
            theBid_1.setKeyValuePair("k3", "v3");

            sinon.stub(theBid_1, "getPostTimeoutStatus").returns(false);
            sinon.stub(theBid_1, "getNetEcpm").returns(-1);

            bmEntryObj.setNewBid(adapterID_1, theBid_1);

            theBid_2 = new bid(adapterID_2, kgpv);

            theBid_2.setKeyValuePair("k2", "v2");
            theBid_2.setKeyValuePair("k21", "v21");

            sinon.stub(theBid_2, "getPostTimeoutStatus").returns(false);
            sinon.stub(theBid_2, "getNetEcpm").returns(2);
            bmEntryObj.setNewBid(adapterID_2, theBid_2);

            sinon.spy(BIDMgr, "auctionBidsCallBack");
            sinon.spy(UTIL, "forEachOnObject");

            sinon.stub(CONFIG, "getBidPassThroughStatus").returns(0);
            CONFIG.getBidPassThroughStatus.withArgs(adapterID_2).returns(2);
            done();
        });

        afterEach(function(done) {
            bmEntryObj = null;
            divID = null;
            BIDMgr.auctionBidsCallBack.restore();
            UTIL.forEachOnObject.restore();
            CONFIG.getBidPassThroughStatus.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.auctionBids.should.be.a('function');
            done();
        });

        it('should have called UTIL.forEachOnObject', function(done) {
            BIDMgr.auctionBids(bmEntryObj);

            UTIL.forEachOnObject.called.should.be.true;
            done();
        });

        it('returns winning bid with key value pairs', function(done) {
            BIDMgr.auctionBids(bmEntryObj).should.have.all.keys('wb', 'kvp');
            done();
        });

        it('returns winning bid with key value pairs', function(done) {
            var op = BIDMgr.auctionBids(bmEntryObj);
            op.should.deep.equal({
                "wb" : theBid_1,
                "kvp": {
                    "k1": [ "v1" ],
                    "k2": [ "v2", "v2" ],
                    "k21": [ "v21" ] ,
                    "k3": [ "v3" ]
                }
            });
            done();
        });
    });

    describe('#auctionBidsCallBack', function() {
        var adapterID = null,
            adapterEntry = null,
            keyValuePairs = null,
            winningBid = null;
        var bidID = null;
        var theBidObject = null;
        var adapterID_1 = commonAdpterID + "_1";
        var theBid_1 = null;
        var adapterID_2 = commonAdpterID + "_2";
        var theBid_2 = null;
        var kgpv = commonKGPV;
        var adapterEntry_1 = null;
        var adapterEntry_2 = null;

        beforeEach(function(done) {
            adapterID = commonAdpterID;
            adapterEntry = new AdapterEntry(adapterID);
            keyValuePairs = {};
            winningBid = null;
            bidID = commonBidID;
            theBidObject = theBid = new bid(commonAdpterID, commonKGPV);

            sinon.stub(theBidObject, "getPostTimeoutStatus");
            sinon.stub(theBidObject, "getKeyValuePairs");

            adapterEntry_1 = new AdapterEntry(adapterID_1);
            sinon.stub(adapterEntry_1, "getLastBidID");
            theBid_1 = new bid(adapterID_1, kgpv);

            theBid_1.setKeyValuePair("k1", "v1");
            theBid_1.setKeyValuePair("k2", "v2");
            theBid_1.setKeyValuePair("k3", "v3");
            adapterEntry_1.setNewBid(theBid_1);

            sinon.stub(theBid_1, "getPostTimeoutStatus").returns(false);
            sinon.stub(theBid_1, "getNetEcpm").returns(-1);

            adapterEntry_2 = new AdapterEntry(adapterID_2);
            theBid_2 = new bid(adapterID_2, kgpv);
            theBid_2.setKeyValuePair("k2", "v2");
            theBid_2.setKeyValuePair("k21", "v21");

            sinon.stub(theBid_2, "getPostTimeoutStatus").returns(false);
            sinon.stub(theBid_2, "getNetEcpm").returns(2);
            sinon.spy(theBid_2, "getKeyValuePairs");
            adapterEntry_2.setNewBid(theBid_2);

            sinon.stub(adapterEntry, "getLastBidID").returns("");
            sinon.spy(UTIL, "forEachOnObject");
            sinon.stub(CONFIG, "getBidPassThroughStatus");
            CONFIG.getBidPassThroughStatus.withArgs(adapterID_2).returns(2);

            sinon.spy(UTIL, "copyKeyValueObject");
            done();
        });

        afterEach(function(done) {
            adapterEntry.getLastBidID.restore();
            UTIL.forEachOnObject.restore();
            UTIL.copyKeyValueObject.restore();

            theBid_2.getPostTimeoutStatus.restore();
            theBid_2.getNetEcpm.restore();
            theBid_2.getKeyValuePairs.restore();

            theBidObject.getPostTimeoutStatus.restore();
            theBidObject.getKeyValuePairs.restore();

            CONFIG.getBidPassThroughStatus.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.auctionBidsCallBack.should.be.a('function');
            done();
        });

        it('should have returned proper key value pair', function (done) {
            BIDMgr.auctionBidsCallBack(adapterID_1, adapterEntry_1, {}, null).keyValuePairs.should.deep.equal({ "k1": [ 'v1' ], "k2": [ 'v2' ], "k3": [ 'v3' ] });
            done();
        });

        it('should have returned result with proper structure', function (done) {
            BIDMgr.auctionBidsCallBack(adapterID_1, adapterEntry_1, {}, null).should.have.all.keys("winningBid", "keyValuePairs");
            done()
        });

        it('should have returned result with proper structure', function (done) {
            BIDMgr.auctionBidsCallBack(adapterID_2, adapterEntry_2, {}, theBid_2).should.have.all.keys("winningBid", "keyValuePairs");
            done();
        });

        it('should have returned proper key value pair', function (done) {
            BIDMgr.auctionBidsCallBack(adapterID_2, adapterEntry_2, {}, theBid_2).keyValuePairs.should.deep.equal({ "k2": [ 'v2' ], "k21": [ 'v21' ] });
            done();
        });

        it('should return object containing winningBid and keyValuePairs passed', function(done) {
            BIDMgr.auctionBidsCallBack(adapterID, adapterEntry, keyValuePairs, winningBid).should.deep.equal({
                winningBid: winningBid,
                keyValuePairs: keyValuePairs
            });
            done();
        });

        it('should return while constructing outout object out of passed arguments when passed adapter entry\'s last bid id is empty ', function (done) {
            adapterEntry_1.getLastBidID.returns("");
            BIDMgr.auctionBidsCallBack(adapterID_1, adapterEntry_1, {}, theBid_2).should.have.all.keys("winningBid", "keyValuePairs");
            theBid_2.getPostTimeoutStatus.called.should.be.false;
            CONFIG.getBidPassThroughStatus.called.should.be.false;
            theBid_2.getKeyValuePairs.called.should.be.false;
            done();
        });

        it('should return if bid\'s has come post timeout ', function(done) {
            theBidObject.getPostTimeoutStatus.returns(true);
            adapterEntry.setNewBid(theBidObject);
            adapterEntry.getLastBidID.returns("pubmatic");

            BIDMgr.auctionBidsCallBack(adapterID, adapterEntry, keyValuePairs, winningBid);
            UTIL.forEachOnObject.called.should.be.true;
            CONFIG.getBidPassThroughStatus.called.should.be.false;
            done();
        });


        it('should elect the new winning bid whos net ECPM is greater than previous winning bid object', function (done) {
            theBid_2.getPostTimeoutStatus.returns(false);
            theBid_2.getNetEcpm.returns(3);
            theBid_1.getNetEcpm.returns(1);
            CONFIG.getBidPassThroughStatus.withArgs(adapterID_2).returns(0);
            BIDMgr.auctionBidsCallBack(adapterID_2, adapterEntry_2, {}, theBid_1).winningBid.should.deep.equal(theBid_2);

            done();
        });
    });    

    describe('#getBid', function() {
        var divID = null;
        var keyValuePairs = null;
        var winningBidObj = null;

        beforeEach(function(done) {
            divID = commonDivID;
            window.PWT = {
                bidMap: {}
            };

            window.PWT.bidMap[divID] = {
                setAnalyticEnabled: function() {
                    return "setAnalyticEnabled";
                }
            };

            keyValuePairs = {
                "key_1": "value_1",
                "key_2": "value2"
            };

            sinon.spy(UTIL, 'isOwnProperty');
            sinon.stub(BIDMgr, 'auctionBids');

            winningBidObj = {
                wb: {
                    getNetEcpm: function() {
                        return 2;
                    },
                    setStatus: function() {
                        return true;
                    },
                    setWinningBidStatus: function() {
                        return true;
                    }
                },
                kvp: keyValuePairs
            };

            BIDMgr.auctionBids.returns(winningBidObj);

            sinon.spy(winningBidObj.wb, 'setStatus');
            sinon.spy(winningBidObj.wb, 'setWinningBidStatus');
            sinon.spy(UTIL, 'vLogInfo');
            sinon.stub(CONFIG, "getAdServerCurrency");

            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            divID = null;
            winningBidObj = null;
            BIDMgr.auctionBids.restore();
            UTIL.vLogInfo.restore();
            window.PWT = {};
            CONFIG.getAdServerCurrency.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.getBid.should.be.a('function');
            done();
        });

        it('should have called UTIL.isOwnProperty and return bid when bidMap doesnt have passed divID', function(done) {
            delete window.PWT.bidMap[divID];
            BIDMgr.getBid(divID).should.deep.equal({ wb: null, kvp: null });
            UTIL.isOwnProperty.called.should.be.true;

            done();
        });

        it('should have called UTIL.isOwnProperty and return bid when bidMap have passed divID', function(done) {
            BIDMgr.getBid(divID).should.deep.equal({ wb: winningBidObj.wb, kvp: winningBidObj.kvp });

            UTIL.isOwnProperty.called.should.be.true;

            done();
        });

        it('when bidMap have passed divID and winning  bid has ECPM greater than 0', function(done) {
            UTIL.isOwnProperty.restore();
            sinon.stub(UTIL, 'isOwnProperty');
            UTIL.isOwnProperty.withArgs(window.PWT.bidMap, divID).returns(true);
            BIDMgr.getBid(divID).should.deep.equal({ wb: winningBidObj.wb, kvp: winningBidObj.kvp });;
            BIDMgr.auctionBids.calledOnce.should.be.true;

            winningBidObj.wb.setStatus.called.should.be.true;
            winningBidObj.wb.setWinningBidStatus.called.should.be.true;

            UTIL.vLogInfo.calledWith(divID, {
                type: "win-bid",
                bidDetails: winningBidObj.wb,
                adServerCurrency: UTIL.getCurrencyToDisplay()
            }).should.be.true;

            UTIL.isOwnProperty.called.should.be.true;

            done();
        });

        it('when bidMap have passed divID and winning  bid has ECPM less than 0', function(done) {
            UTIL.isOwnProperty.restore();
            sinon.stub(winningBidObj.wb, 'getNetEcpm');
            winningBidObj.wb.getNetEcpm.returns(-1);
            sinon.stub(UTIL, 'isOwnProperty');
            UTIL.isOwnProperty.withArgs(window.PWT.bidMap, divID).returns(true);
            BIDMgr.getBid(divID).should.deep.equal({ wb: winningBidObj.wb, kvp: winningBidObj.kvp });
            BIDMgr.auctionBids.calledOnce.should.be.true;

            winningBidObj.wb.setStatus.called.should.be.false;
            winningBidObj.wb.setWinningBidStatus.called.should.be.false;

            UTIL.vLogInfo.calledWith(divID, {
                type: "win-bid-fail",
            }).should.be.true;

            UTIL.isOwnProperty.called.should.be.true;
            winningBidObj.wb.getNetEcpm.restore();

            done();
        });
    });

    describe('#getBidById', function() {
        var bidID = null;
        var divID = null;
        var adapterID = null;
        var nonExistingBidID = null;
        var nonExistingDivID = null;
        var theBid = null;

        beforeEach(function(done) {
            bidID = commonBidID;
            divID = commonDivID;
            adapterID = commonAdpterID;
            nonExistingBidID = '213h1231';
            nonExistingDivID = 'non_div';
            theBid = {

            };
            window.PWT = {
                bidIdMap: {

                },
                bidMap: {

                }
            };
            window.PWT.bidIdMap[bidID] = {
                s: divID,
                a: adapterID
            };
            window.PWT.bidMap[divID] = {
                getBid: function() {
                    return true;
                }
            }

            sinon.stub(UTIL, 'isOwnProperty');
            sinon.stub(UTIL, 'log');

            UTIL.isOwnProperty.withArgs(window.PWT.bidIdMap, nonExistingBidID).returns(false);
            UTIL.isOwnProperty.withArgs(window.PWT.bidIdMap, bidID).returns(true);

            UTIL.isOwnProperty.withArgs(window.PWT.bidMap, nonExistingDivID).returns(false);
            UTIL.isOwnProperty.withArgs(window.PWT.bidMap, divID).returns(true);

            sinon.stub(window.PWT.bidMap[divID], 'getBid');
            window.PWT.bidMap[divID].getBid.withArgs(adapterID, bidID).returns(theBid);


            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            UTIL.log.restore();
            if (window.PWT.bidMap[divID].getBid.restore) {
                window.PWT.bidMap[divID].getBid.restore();
            }
            done();
        });

        it('is a function', function(done) {
            BIDMgr.getBidById.should.be.a('function');
            done();
        });

        it('should return null while logging it when bidIdMap doesnt contains passed bidID', function(done) {
            should.not.exist(BIDMgr.getBidById(nonExistingBidID));
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M25 + nonExistingBidID).should.be.true;
            done();
        });

        it('should return null when bidIdMap contains passed bidID but bidMap doenst have bid\'s divID', function(done) {
            window.PWT.bidIdMap[bidID].s = nonExistingDivID;
            should.not.exist(BIDMgr.getBidById(bidID));
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M25 + bidID).should.be.true;
            done();
        });

        it('should return object containing bid and slot id when bid object is not null', function(done) {
            BIDMgr.getBidById(bidID).should.be.deep.equal({ bid: theBid, slotid: divID });
            UTIL.log.calledWith("BidID: " + bidID + ", DivID: " + divID + CONSTANTS.MESSAGES.M19 + adapterID).should.be.true;
            done();
        });

        it('returns resulting object as null when bid object for given divID is null', function (done) {
            window.PWT.bidMap[divID].getBid =  function () {
                return null;
            };
            should.not.exist(BIDMgr.getBidById(bidID));
            UTIL.log.calledWith("BidID: " + bidID + ", DivID: " + divID + CONSTANTS.MESSAGES.M19 + adapterID).should.be.true;
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M25 + bidID).should.be.false;
            done();
        });
    });

    describe('#displayCreative', function() {
        var bidID = null;
        var bidDetails = null;
        var adapterID = null;
        var nonExistingBidID = null;
        var theDocument = null;
        var divID = null;

        beforeEach(function(done) {
            bidID = '784b05cc03a84a';
            adapterID = commonAdpterID;
            divID = "Slot_1";
            bidDetails = {
                bid: {
                    getAdapterID: function() {
                        return adapterID;
                    }
                },
                slotid: divID
            };
            sinon.stub(BIDMgr, 'getBidById');
            BIDMgr.getBidById.withArgs(bidID).returns(bidDetails);
            nonExistingBidID = '12312jjsadd';
            BIDMgr.getBidById.withArgs(nonExistingBidID).returns(null);
            sinon.stub(BIDMgr, 'executeMonetizationPixel');
            BIDMgr.executeMonetizationPixel.returns(true);
            theDocument = {};

            sinon.stub(UTIL, 'displayCreative');
            UTIL.displayCreative.withArgs(theDocument, bidID).returns(true);
            sinon.stub(UTIL, 'vLogInfo');
            done();
        });

        afterEach(function(done) {
            BIDMgr.getBidById.restore();
            BIDMgr.executeMonetizationPixel.restore();
            theDocument = null;
            UTIL.displayCreative.restore();
            UTIL.vLogInfo.restore();
            done();
        });


        it('is a function', function(done) {
            BIDMgr.displayCreative.should.be.a('function');
            done();
        });

        it('should not have called executeMonetizationPixel when given bidID is not present', function(done) {
            BIDMgr.displayCreative(theDocument, nonExistingBidID);

            BIDMgr.getBidById.calledOnce.should.be.true;
            BIDMgr.executeMonetizationPixel.called.should.be.false;
            UTIL.displayCreative.called.should.be.false;
            UTIL.vLogInfo.called.should.be.false;
            done();
        });

        it('should have called executeMonetizationPixel when given bidID is present', function(done) {
            BIDMgr.displayCreative(theDocument, bidID);

            BIDMgr.getBidById.calledOnce.should.be.true;

            BIDMgr.executeMonetizationPixel.calledWith(bidDetails.slotid, bidDetails.bid).should.be.true;

            UTIL.displayCreative.calledWith(theDocument ,bidDetails.bid).should.be.true;

            UTIL.vLogInfo.calledWith(divID, { type: 'disp', adapter: adapterID }).should.be.true;
            done();
        });
    });

    describe('#executeAnalyticsPixel', function() {
        var slotID_1 =  null, slotID_2 = null;
        var bmEntryStub_1 = null, bmEntryStub_2 = null;

        beforeEach(function(done) {
            sinon.stub(CONFIG, "getAnalyticsPixelURL").returns("http://pb.analytics.com/dm/");
            sinon.stub(CONFIG, "getPublisherId");

            sinon.spy(CONFIG, "getTimeout");
            sinon.spy(CONFIG, "getProfileID");
            sinon.spy(CONFIG, "getProfileDisplayVersionID");
            sinon.spy(CONFIG, "isUserIdModuleEnabled");

            var timeNow = new Date().getTime();
            sinon.stub(UTIL, "getCurrentTimestamp").returns(timeNow);
            sinon.spy(GDPR, "getUserConsentDataFromLS");
            sinon.spy(UTIL, "forEachOnObject");

            slotID_1 = "Slot_1";
            bmEntryStub_1 = new bmEntryContstuctor(slotID_1);
            slotID_2 = "Slot_2";
            bmEntryStub_2 = new bmEntryContstuctor(slotID_2);

            window.PWT = {
                bidMap: {
                },
                adUnits:{
                    "Slot_1":{"divID": slotID_1, "code":slotID_1, "adUnitId": slotID_1, "mediaTypes": {'banner': {'sizes': [0]}}}
                }
            };

            window.PWT.bidMap[slotID_1] = bmEntryStub_1;
            window.PWT.bidMap[slotID_2] = bmEntryStub_2;

            sinon.stub(BIDMgr, "analyticalPixelCallback");

            done();
        });

        afterEach(function(done) {
            CONFIG.getAnalyticsPixelURL.restore();
            CONFIG.getPublisherId.restore();

            CONFIG.getTimeout.restore();
            CONFIG.getProfileID.restore();
            CONFIG.getProfileDisplayVersionID.restore();
            CONFIG.isUserIdModuleEnabled.restore();

            UTIL.getCurrentTimestamp.restore();
            UTIL.forEachOnObject.restore();
            GDPR.getUserConsentDataFromLS.restore();
            window.PWT = null;

            BIDMgr.analyticalPixelCallback.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.executeAnalyticsPixel.should.be.a('function');
            done();
        });

        it('should return if pixelURL is empty', function(done) {
            CONFIG.getAnalyticsPixelURL.returns("");
            BIDMgr.executeAnalyticsPixel();
            CONFIG.getPublisherId.called.should.be.true;
            // GDPR.getUserConsentDataFromLS.called.should.be.true;
            done();
        });

        it('should have called CONFIG functions to generate output Object', function(done) {
            BIDMgr.executeAnalyticsPixel();

            CONFIG.getPublisherId.called.should.be.true;
            CONFIG.getTimeout.called.should.be.true;
            CONFIG.getProfileID.called.should.be.true;
            CONFIG.getProfileDisplayVersionID.called.should.be.true;
            CONFIG.isUserIdModuleEnabled.called.should.be.true;

            // GDPR.getUserConsentDataFromLS.called.should.be.true;
            UTIL.getCurrentTimestamp.called.should.be.true;
            done();
        });

        it('should have called UTIL.forEachOnObject with bidMap', function(done) {
            BIDMgr.executeAnalyticsPixel();

            UTIL.forEachOnObject.calledWith(window.PWT.bidMap).should.be.true;
            done();
        });

        it('should have called analyticalPixelCallback', function(done) {
            BIDMgr.executeAnalyticsPixel();
            BIDMgr.analyticalPixelCallback.calledWith(slotID_1, bmEntryStub_1, {}).should.be.true;
            BIDMgr.analyticalPixelCallback.calledWith(slotID_2, bmEntryStub_2, {}).should.be.true;
            done();
        });

        it('should have called UTIL.forEachOnObject twice', function(done) {
            BIDMgr.executeAnalyticsPixel();
            UTIL.forEachOnObject.calledTwice.should.be.true;
            done();
        });
    });

    describe('#executeMonetizationPixel', function() {
        var slotID = null;
        var adUnitId = null;
        var adapterID = null;
        var theBid = null;
        var latency = null;
        var kgpv = commonKGPV;
        var impressionID = 123123;
        var origImage = null;

        beforeEach(function(done) {
            slotID = "Slot_1";
            adUnitId = "slot_au_code";
            theBid = new bid(adapterID, kgpv);
            sinon.spy(CONFIG, 'getMonetizationPixelURL');
            sinon.spy(CONFIG, 'getPublisherId');
            sinon.spy(CONFIG, 'getProfileID');
            sinon.spy(CONFIG, 'getProfileDisplayVersionID');
            sinon.stub(CONFIG, 'getAdapterNameForAlias');
            sinon.stub(theBid, 'getBidID');
            theBid.getBidID.returns('784b05cc03a84a');
            sinon.spy(theBid, 'getAdapterID');
            sinon.spy(theBid, 'getNetEcpm');
            sinon.spy(theBid, 'getGrossEcpm');
            sinon.spy(theBid, 'getKGPV');
            sinon.spy(theBid, 'getsspID');
            origImage = window.Image;
            window.Image = sinon.stub();
            window.Image.returns({});

            window.PWT = {
                bidMap: {},
                adUnits: {
                    "Slot_1":{
                        "divID": slotID, 
                        "code":slotID, 
                        "adUnitId": adUnitId, 
                        "mediaTypes": {'banner': {'sizes': [0]}}
                    }
                },
                newAdUnits:{
                    "123123":{
                        "Slot_1":{
                            "pubmaticAutoRefresh":{ 
                                "isRefreshed": true
                            }
                        }
                    }
                }
            };
            window.PWT.bidMap[slotID] = {
                getImpressionID: function() {
                    return impressionID;
                }
            };

            sinon.spy(window, 'encodeURIComponent');

            sinon.stub(UTIL, 'getCurrentTimestamp');
            var currentTimeStamp = new window.Date().getTime();
            currentTimeStamp = parseInt(currentTimeStamp / 1000);
            UTIL.getCurrentTimestamp.withArgs().returns(currentTimeStamp);
            sinon.spy(BIDMgr, 'setImageSrcToPixelURL');

            done();
        });

        afterEach(function(done) {

            slotID = null;
            CONFIG.getMonetizationPixelURL.restore();
            CONFIG.getPublisherId.restore();
            CONFIG.getProfileID.restore();
            CONFIG.getProfileDisplayVersionID.restore();
            CONFIG.getAdapterNameForAlias.restore();
            window.encodeURIComponent.restore();

            theBid.getBidID.restore();
            theBid.getAdapterID.restore();
            theBid.getNetEcpm.restore();
            theBid.getGrossEcpm.restore();
            theBid.getKGPV.restore();
            theBid.getsspID.restore();
            theBid = null;

            window.Image = origImage;

            UTIL.getCurrentTimestamp.restore();

            BIDMgr.setImageSrcToPixelURL.restore();

            done();
        });


        it('is a function', function(done) {
            BIDMgr.executeMonetizationPixel.should.be.a('function');
            done();
        });

        it('should return when pixelURL is null, without proceeding further ', function(done) {
            CONFIG.getMonetizationPixelURL.restore();

            sinon.stub(CONFIG, 'getMonetizationPixelURL');
            CONFIG.getMonetizationPixelURL.returns(null);

            BIDMgr.executeMonetizationPixel(slotID, theBid);

            CONFIG.getMonetizationPixelURL.called.should.be.true;

            CONFIG.getPublisherId.called.should.be.true;
            CONFIG.getProfileID.called.should.be.false;

            theBid.getBidID.called.should.be.false;
            theBid.getAdapterID.called.should.be.false;
            theBid.getNetEcpm.called.should.be.false;
            theBid.getGrossEcpm.called.should.be.false;
            theBid.getKGPV.called.should.be.false;

            CONFIG.getProfileDisplayVersionID.called.should.be.false;
            window.encodeURIComponent.callCount.should.be.equal(0);
            window.Image.called.should.be.false;
            UTIL.getCurrentTimestamp.called.should.be.false;

            done();
        });

        // TODO 17 JAn 2020 Make below test cases as pass.
        it('should have generated pixel url with all necessary calls', function(done) {
            BIDMgr.executeMonetizationPixel(slotID, theBid);
            CONFIG.getMonetizationPixelURL.called.should.be.true;
            CONFIG.getPublisherId.called.should.be.true;
            CONFIG.getProfileID.called.should.be.true;
            CONFIG.getProfileDisplayVersionID.called.should.be.true;
            CONFIG.getAdapterNameForAlias.called.should.be.true;

            theBid.getBidID.called.should.be.true;
            theBid.getAdapterID.called.should.be.true;
            theBid.getNetEcpm.called.should.be.true;
            theBid.getGrossEcpm.called.should.be.true;
            theBid.getKGPV.called.should.be.true;

            window.Image.called.should.be.true;
            UTIL.getCurrentTimestamp.called.should.be.true;
            window.encodeURIComponent.callCount.should.be.equal(15);

            done();
        });

         // TODO 17 JAn 2020 Make below test cases as pass.
        it('should generate proper pixelURL ', function(done) {

            var pixelURL = CONSTANTS.COMMON.PROTOCOL + CONFIG.getMonetizationPixelURL();
            pixelURL += "pubid=" + CONFIG.getPublisherId();
            pixelURL += "&purl=" + window.encodeURIComponent(UTIL.metaInfo.pageURL);
            pixelURL += "&tst=" + UTIL.getCurrentTimestamp();
            pixelURL += "&iid=" + window.encodeURIComponent(window.PWT.bidMap[slotID].getImpressionID());
            pixelURL += "&bidid=" + (theBid.pbbid ? window.encodeURIComponent(theBid.pbbid) : window.encodeURIComponent(theBid.getBidID()));
			pixelURL += "&origbidid=" + window.encodeURIComponent(theBid.getBidID());
            pixelURL += "&pid=" + window.encodeURIComponent(CONFIG.getProfileID());
            pixelURL += "&pdvid=" + window.encodeURIComponent(CONFIG.getProfileDisplayVersionID());
            pixelURL += "&slot=" + window.encodeURIComponent(slotID);
            pixelURL += "&au=" + window.encodeURIComponent(adUnitId);
            pixelURL += "&bc=" + window.encodeURIComponent(theBid.getAdapterID());
            pixelURL += "&pn=" + window.encodeURIComponent(CONFIG.getAdapterNameForAlias(theBid.getAdapterID()));
            pixelURL += "&en=" + window.encodeURIComponent(theBid.getNetEcpm());
            pixelURL += "&eg=" + window.encodeURIComponent(theBid.getGrossEcpm());
            pixelURL += "&kgpv=" + window.encodeURIComponent(theBid.getKGPV());
            pixelURL += "&piid=" + window.encodeURIComponent(theBid.getsspID());
            pixelURL += "&rf=" + window.encodeURIComponent(1);

            BIDMgr.executeMonetizationPixel(slotID, theBid);
            BIDMgr.setImageSrcToPixelURL.calledWith(pixelURL).should.be.true;

            done();
        });

        it('should generate proper pixelURL for bidder aliases', function(done) {

            theBid.adapterID = "pubmatic21";
            CONFIG.getAdapterNameForAlias.returns('pubmatic');
            var pixelURL = CONSTANTS.COMMON.PROTOCOL + CONFIG.getMonetizationPixelURL();
            pixelURL += "pubid=" + CONFIG.getPublisherId();
            pixelURL += "&purl=" + window.encodeURIComponent(UTIL.metaInfo.pageURL);
            pixelURL += "&tst=" + UTIL.getCurrentTimestamp();
            pixelURL += "&iid=" + window.encodeURIComponent(window.PWT.bidMap[slotID].getImpressionID());
            pixelURL += "&bidid=" + (theBid.pbbid ? window.encodeURIComponent(theBid.pbbid) : window.encodeURIComponent(theBid.getBidID()));
			pixelURL += "&origbidid=" + window.encodeURIComponent(theBid.getBidID());
            pixelURL += "&pid=" + window.encodeURIComponent(CONFIG.getProfileID());
            pixelURL += "&pdvid=" + window.encodeURIComponent(CONFIG.getProfileDisplayVersionID());
            pixelURL += "&slot=" + window.encodeURIComponent(slotID);
            pixelURL += "&au=" + window.encodeURIComponent(adUnitId);
            pixelURL += "&bc=" + window.encodeURIComponent(theBid.getAdapterID());
            pixelURL += "&pn=" + window.encodeURIComponent(CONFIG.getAdapterNameForAlias(theBid.getAdapterID()));
            pixelURL += "&en=" + window.encodeURIComponent(theBid.getNetEcpm());
            pixelURL += "&eg=" + window.encodeURIComponent(theBid.getGrossEcpm());
            pixelURL += "&kgpv=" + window.encodeURIComponent(theBid.getKGPV());
            pixelURL += "&piid=" + window.encodeURIComponent(theBid.getsspID());
            pixelURL += "&rf=" + window.encodeURIComponent(1);

            BIDMgr.executeMonetizationPixel(slotID, theBid);
            BIDMgr.setImageSrcToPixelURL.calledWith(pixelURL).should.be.true;

            done();
        });
    });

    describe('#getAdUnitSizes', function(){
        var bmEntryObj = null;
        var theBid = null;

        beforeEach(function(done) {
            bmEntryObj = new bmEntryContstuctor("pubmatic");
            bmEntryObj.setSizes(["720x80"]);

            theBid = new bid(commonAdpterID, commonKGPV);

            sinon.spy(theBid, "getPostTimeoutStatus");
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);

            done();
        })

        afterEach(function(done) {
            bmEntry = null;
            theBid = null;
            done();
        })
        it('Should return single size of adunit in case of non-native bid', function(done) {
            BIDMgr.getAdUnitSizes(bmEntryObj)[0].should.be.equal('720x80');
            done();
        });

        it('Should return multiple size of adunit in case of non-native bid', function(done) {
            bmEntryObj.setSizes(["720x80","640x480"]);

            BIDMgr.getAdUnitSizes(bmEntryObj)[0].should.be.equal('720x80');
            BIDMgr.getAdUnitSizes(bmEntryObj)[1].should.be.equal('640x480');
            done();
        });

        it('Should return 1x1 in case of native bid', function(done) {
            bmEntryObj.setSizes(["720x80","640x480"]);
            theBid.isWinningBid = true;
            theBid.adFormat="native";

            BIDMgr.getAdUnitSizes(bmEntryObj)[0].should.be.equal('1x1');
            done();
        });

        it('Should return size of adUnit in case of native with NO-BID', function(done) {
            theBid.getPostTimeoutStatus.restore();
            sinon.stub(theBid,"getPostTimeoutStatus").returns(1);
            theBid.setGrossEcpm(0);

            BIDMgr.getAdUnitSizes(bmEntryObj)[0].should.be.equal('720x80');
            done();
        });
    });

    describe('#analyticalPixelCallback', function() {
        var slotID = null,
            bmEntryObj = null,
            adUnitId = null,
            impressionIDMap = null;
        var theBid = null;
        var impressionID = null;
        var serverSideBid = null;

        beforeEach(function(done) {
            slotID = "Slot_1";
            adUnitId = "slot_au_code";
            bmEntryObj = new bmEntryContstuctor("pubmatic");
            impressionID = "12345";

            sinon.stub(bmEntryObj, "getCreationTime");
            sinon.stub(bmEntryObj, "getAnalyticEnabledStatus");
            sinon.stub(bmEntryObj, "getExpiredStatus");
            sinon.stub(bmEntryObj, "getSizes");
            sinon.stub(bmEntryObj, "setExpired");
            sinon.stub(bmEntryObj, "getImpressionID");

            sinon.stub(CONFIG, "getBidPassThroughStatus");

            sinon.spy(UTIL, "forEachOnObject");
            theBid = new bid(commonAdpterID, commonKGPV);

            sinon.spy(theBid, "getReceivedTime");
            sinon.spy(theBid, "getDefaultBidStatus");
            sinon.spy(theBid, "getKGPV");
            sinon.spy(theBid, "getWidth");
            sinon.spy(theBid, "getHeight");
            sinon.spy(theBid, "getGrossEcpm");
            sinon.spy(theBid, "getNetEcpm");
            sinon.spy(theBid, "getDealID");
            sinon.spy(theBid, "getDealChannel");
            sinon.spy(theBid, "getPostTimeoutStatus");
            sinon.spy(theBid, "getWinningBidStatus");
            sinon.spy(theBid, "getPbBid");
			sinon.stub(BIDMgr, 'getSlotLevelFrequencyDepth').returns(1);

            theBid.floorRequestData= {
                'fetchStatus': 'success',
                'floorMin': undefined,
                'floorProvider': 'pubmatic',
                'location': 'fetch',
                'modelTimestamp': undefined,
                'modelVersion': 'floorModelTest',
                'modelWeight': undefined,
                'skipRate': 0,
                'skipped': false
              }

            serverSideBid = new bid(serverAdapterID, commonKGPV);
            impressionIDMap = {};
            window.PWT.owLatency = {
             impressionID: {
                startTime: 30,
                endTime: 25
             }
            }
            window.PWT.adUnits = 
                {
                    "Slot_1":{"divID": slotID, "code":slotID, "adUnitId": adUnitId, "mediaTypes": {'banner': {'sizes': [0]}}}
                }
            window.PWT.floorData = {
                "12345": {
                    "floorRequestData": theBid.floorRequestData
                }
            }
            done();
        });

        afterEach(function(done) {
            bmEntryObj.getCreationTime.restore();
            bmEntryObj.getAnalyticEnabledStatus.restore();
            bmEntryObj.getExpiredStatus.restore();
            bmEntryObj.getSizes.restore();
            bmEntryObj.setExpired.restore();
            bmEntryObj.getImpressionID.restore();

            CONFIG.getBidPassThroughStatus.restore();

            UTIL.forEachOnObject.restore();

            bmEntryObj = null;
            theBid.getReceivedTime.restore();
            theBid.getDefaultBidStatus.restore();
            theBid.getKGPV.restore();
            theBid.getWidth.restore();
            theBid.getHeight.restore();
            theBid.getGrossEcpm.restore();
            theBid.getNetEcpm.restore();
            theBid.getDealID.restore();
            theBid.getDealChannel.restore();
            theBid.getPostTimeoutStatus.restore();
            theBid.getWinningBidStatus.restore();

            theBid = null;
			BIDMgr.getSlotLevelFrequencyDepth.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.analyticalPixelCallback.should.be.a('function');
            done();
        });

        it('should have called bmEntry\'s getCreationTime ', function(done) {
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            bmEntryObj.getCreationTime.calledOnce.should.be.true;
            done();
        });

        it('should check whether given bmEntry\'s analytic status is enabled and whether it is expired or not', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            bmEntryObj.getAnalyticEnabledStatus.calledOnce.should.be.true;
            bmEntryObj.getExpiredStatus.calledOnce.should.be.true;
            done();
        });

        it('should have calle setExpired on given bmEntry object and extract impressionID from the bmEntry object', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            bmEntryObj.setExpired.calledOnce.should.be.true;
            bmEntryObj.getImpressionID.calledOnce.should.be.true;
            done();
        });

        it('should return if Bid Pass Through Status for adapterID is 1', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(1);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);

            UTIL.forEachOnObject.calledWith(bmEntryObj.adapters).should.be.true;
            UTIL.forEachOnObject.calledOnce.should.be.true;

            done();
        });

        it('should have iterated over bmEntry\'s adapters to create slotObject for all the bids in adapterEntry', function(done) {

            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);

            UTIL.forEachOnObject.calledWith(bmEntryObj.adapters).should.be.true;
            UTIL.forEachOnObject.calledTwice.should.be.true;

            done();
        });

        it('should have generated slotObject with the bid object\'s properties', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);

            theBid.getDefaultBidStatus.called.should.be.true;
            theBid.getKGPV.calledTwice.should.be.true;
            theBid.getWidth.calledOnce.should.be.true;
            theBid.getHeight.calledOnce.should.be.true;
            theBid.getGrossEcpm.calledOnce.should.be.true;
            theBid.getNetEcpm.calledOnce.should.be.true;
            theBid.getDealID.calledOnce.should.be.true;
            theBid.getDealChannel.calledOnce.should.be.true;
            theBid.getPostTimeoutStatus.called.should.be.true;
            theBid.getWinningBidStatus.calledOnce.should.be.true;
            theBid.getPbBid.calledOnce.should.be.true;

            done();
        });

        it('should have added impressionIDMap with the generated slotObject', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            //impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].should.have.all.keys("pn", "bidid", "db", "kgpv", "psz", "eg", "en", "di", "dc", "l1", "l2", "ss", "t", "wb");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].pn).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].bidid).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].db).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].kgpv).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].psz).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].eg).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].en).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].di).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].dc).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].l1).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].l2).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].t).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].wb).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].ss).to.exist;
			done()
        });

		it('should log count of bidServed, impServed & request count', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
			expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['sn']).to.equal("Slot_1");
			expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps']).to.be.an("array");
			expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['bs']).to.equal(1);
			expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['is']).to.equal(1);
			expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['rc']).to.equal(1);
            done();
        });

        it('should not log any entry in logger for serverside adapter, server responds with error codes 1/2/3/6', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            if (theBid.getServerSideStatus() && theBid.getDefaultBidStatus() === 0 && theBid.getServerSideResponseTime() === -1) {
                /* if serverside adapter and
                     db == 0 and
                     getServerSideResponseTime returns 0, it means that server responded with error code 1/2/3/6
                     hence do not add entry in logger.
                */


                expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['sn']).to.equal("Slot_1");
                expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps']).to.be.an("array");
                expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps'].length).to.equal(0);

            } 
            done();
        });

        it('should log PubMatic server side latency in psl field for serverside partners', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            theBid.setServerSideStatus(1);
            bmEntryObj.setNewBid(commonAdpterID, theBid);

            bmEntryObj.setAdapterEntry(serverAdapterID);
            serverSideBid.setServerSideStatus(0);
            bmEntryObj.setNewBid(serverAdapterID, serverSideBid);

            CONFIG.getBidPassThroughStatus.returns(2);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            expect(impressionIDMap[bmEntryObj.getImpressionID()].psl).exist;
            done();
        });

        it('should not log PubMatic server side latency in psl field is pubmaticServer partner is not present', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            expect(impressionIDMap.psl).to.not.exist;
            done();
        });

        it('audienceNetwork(maskBids=1) winning bid is logged', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry("audienceNetwork");
            theBid = new bid("audienceNetwork", commonKGPV);
            sinon.spy(theBid, "getReceivedTime");
            sinon.spy(theBid, "getDefaultBidStatus");
            sinon.spy(theBid, "getKGPV");
            sinon.spy(theBid, "getWidth");
            sinon.spy(theBid, "getHeight");
            sinon.spy(theBid, "getGrossEcpm");
            sinon.spy(theBid, "getNetEcpm");
            sinon.spy(theBid, "getDealID");
            sinon.spy(theBid, "getDealChannel");
            sinon.spy(theBid, "getPostTimeoutStatus");
            sinon.spy(theBid, "getWinningBidStatus");
            sinon.stub(theBid, "getPbBid").returns({meta: {advertiserDomains : ["startab.com"]}});
            theBid.setWinningBidStatus();
            bmEntryObj.setNewBid("audienceNetwork", theBid);
            CONFIG.getBidPassThroughStatus.returns(2);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            //impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].should.have.all.keys("pn", "bidid", "db", "kgpv", "psz", "eg", "en", "di", "dc", "l1", "l2", "t", "wb", "ss");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].pn).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].bidid).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].db).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].kgpv).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].psz).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].eg).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].en).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].di).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].dc).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].l1).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].adv).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].l2).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].t).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].wb).to.exist;
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].ss).to.exist;
            done();
        });

        it('audienceNetwork(maskBids=1) non-winning bid is NOT logged', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry("audienceNetwork");
            theBid = new bid("audienceNetwork", commonKGPV);
            sinon.spy(theBid, "getReceivedTime");
            sinon.spy(theBid, "getDefaultBidStatus");
            sinon.spy(theBid, "getKGPV");
            sinon.spy(theBid, "getWidth");
            sinon.spy(theBid, "getHeight");
            sinon.spy(theBid, "getGrossEcpm");
            sinon.spy(theBid, "getNetEcpm");
            sinon.spy(theBid, "getDealID");
            sinon.spy(theBid, "getDealChannel");
            sinon.spy(theBid, "getPostTimeoutStatus");
            sinon.spy(theBid, "getWinningBidStatus");
            bmEntryObj.setNewBid("audienceNetwork", theBid);
            CONFIG.getBidPassThroughStatus.returns(2);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"].length.should.equal(0);
            done();
        });

        it('slotObject should not be populated with bid if adapter is serverside, latency is -1 and default status is -1', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);
            theBid.setServerSideStatus(1);
            theBid.setServerSideResponseTime(-1);
            theBid.setDefaultBidStatus(-1);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);

            expect(impressionIDMap[bmEntryObj.getImpressionID()][0].sn).to.equal("Slot_1");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0].ps).to.be.an('array').that.is.empty;

            done();
        });

        it('should not log any entry in logger for pubmatic if it is a default bid', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            theBid.getDefaultBidStatus.restore();
            sinon.stub(theBid,"getDefaultBidStatus").returns(1);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['sn']).to.equal("Slot_1");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps']).to.be.an("array");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps'].length).to.equal(0);
            done();
        });

        it('should not log any entry in logger for pubmatic if it is a timed out zero bid', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            theBid.getPostTimeoutStatus.restore();
            sinon.stub(theBid,"getPostTimeoutStatus").returns(1);
            theBid.setGrossEcpm(0);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['sn']).to.equal("Slot_1");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps']).to.be.an("array");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps'].length).to.equal(0);
            done();
        });

        it('should log any entry in logger for other than pubmatic if it is a timed out zero bid', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry("appnexus");
            bmEntryObj.setNewBid("appnexus", theBid);
            theBid.getPostTimeoutStatus.restore();
            sinon.stub(theBid,"getPostTimeoutStatus").returns(1);
            theBid.setGrossEcpm(0);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['sn']).to.equal("Slot_1");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps']).to.be.an("array");
            expect(impressionIDMap[bmEntryObj.getImpressionID()][0]['ps'].length).to.equal(1);
            done();
        });
    });

    describe('#setImageSrcToPixelURL', function() {
        var pixelURL = null;
        var origImage = null;
        var imageObjStub = null;

        beforeEach(function(done) {
            pixelURL = "t.pubmatic.com/wt?pubid=9999&purl=undefined&tst=1499332621&iid=123123&bidid=784b05cc03a84a&pid=46&pdvid=4&slot=Slot_1&pn=null&en=0&eg=0&kgpv=XYZ";
            origImage = window.Image;
            window.Image = sinon.stub();
            imageObjStub = {
                src: ""
            };

            window.Image.returns(imageObjStub);
            done();
        });

        afterEach(function(done) {
            pixelURL = null;
            window.Image = origImage
            done();
        });

        it('is a function', function(done) {
            BIDMgr.setImageSrcToPixelURL.should.be.a('function');
            done();
        });

        it('should have called window.Image while setting its src to the passed pixelURL', function(done) {
            BIDMgr.setImageSrcToPixelURL(pixelURL);
            window.Image.called.should.be.true;
            imageObjStub.src.should.equal(CONSTANTS.COMMON.PROTOCOL + pixelURL);
            done();
        });

        it('should have called window.Image while setting its src to the passed pixelURL without protocol', function(done) {
            BIDMgr.setImageSrcToPixelURL(pixelURL,false);
            window.Image.called.should.be.true;
            imageObjStub.src.should.equal(pixelURL);
            done();
        });
    });

    describe('#getAllPartnersBidStatuses', function() {
        var bidMaps = null;
        beforeEach(function(done) {
            bidMaps = {
            	Div1: {
                adapters: {
                  prebid: {
                    bids: {
                      wfw21321wedfwe: {
                        defaultBid: 1,
                        getDefaultBidStatus: function () {
                          return 1;
                        }
                      }
                    }
                  },
                  pubmatic: {
                    bids: {
                      wfw21321wedfwe: {
                        defaultBid: 0,
                        getDefaultBidStatus: function () {
                          return 0;
                        }
                      }
                    }
                  }
                },hasAllPossibleBidsReceived:function(){
                    return false;
                }
              }
            };
            done();
        });

        afterEach(function(done) {
            bidMaps = undefined;
            done();
        });

        it('is a function', function(done) {
            BIDMgr.getAllPartnersBidStatuses.should.be.a('function');
            done();
        });

        it('should return true if empty array of divIds is passed', function(done) {
            BIDMgr.getAllPartnersBidStatuses(bidMaps, []).should.be.true;
            done();
        });

        it('should return false if internal partners not responded', function(done) {
            BIDMgr.getAllPartnersBidStatuses(bidMaps, ["Div1"]).should.be.false;
            done();
        });

        it('should return true if for divId no bids are send', function(done) {
            BIDMgr.getAllPartnersBidStatuses(bidMaps, ["Div2"]).should.be.true;
            done();
        });
    });

    describe('#loadTrackers', function() {
        beforeEach(function(done) {
  
            done();
        });

        afterEach(function(done) {
            done();
        });

        it('is a function', function(done) {
            BIDMgr.loadTrackers.should.be.a('function');
            done();
        });

        it('should call getBidDetails', function(done) {
            BIDMgr.loadTrackers(event);
            UTIL.getBidFromEvent.should.be.calledOnce;
            done();
        });
    });

    describe('#executeTracker', function() {
        beforeEach(function(done) {
  
            done();
        });

        afterEach(function(done) {
            done();
        });

        it('is a function', function(done) {
            BIDMgr.executeTracker.should.be.a('function');
            done();
        });
    });

    describe('#fireTracker', function() {
        var bidDetails, action;
        beforeEach(function(done) {
            bidDetails = {
                "adapterID":"appnexus",
                "kgpv":"300x250@300x250",
                "bidID":"15356da9861f71d",
                "grossEcpm":10,
                "netEcpm":10,
                "defaultBid":0,
                "adHtml":"",
                "adUrl":"",
                "height":0,
                "width":0,
                "creativeID":"",
                "keyValuePairs": {
                    "hb_bidder":["appnexus"],
                    "hb_adid":["177b404c1ad1bdd"],
                    "hb_pb":["10.00"],
                    "hb_size":["0x0"],
                    "pwt_native_title":["This is a Prebid Native Creative"],
                    "pwt_native_body":["This is a Prebid Native Creative.  There are many like it, but this one is mine."],
                    "pwt_native_brand":["Prebid.org"],
                    "pwt_native_linkurl":["http://prebid.org/dev-docs/show-native-ads.html"],
                    "pwt_native_image":["http://vcdn.adnxs.com/p/creative-image/f8/7f/0f/13/f87f0f13-230c-4f05-8087-db9216e393de.jpg"]
                },
                "isPostTimeout":false,
                "receivedTime":1552303426059,
                "isServerSide":0,
                "dealID":"",
                "dealChannel":"",
                "isWinningBid":true,
                "status":1,
                "native":{"title":"This is a Prebid Native Creative",
                "body":"This is a Prebid Native Creative.  There are many like it, but this one is mine.",
                "sponsoredBy":"Prebid.org",
                "clickUrl":"http://prebid.org/dev-docs/show-native-ads.html",
                "clickTrackers":["http://sin1-ib.adnxs.com/click?AAAAAAAAJEAAAAAAAAAkQAAAAAAAACRAAAAAAAAAJEAAAAAAAAAkQFA2SWj7_A0Qnfal3hLEgXNDRYZcAAAAAOLoyQBtJAAAbSQAAAIAAAC8pM8FnPgWAAAAAABVU0QAVVNEAAEAAQBNXQAAAAABAQQCAAAAALoAZRY0pwAAAAA./bcr=AAAAAAAA8D8=/cnd=%21sA1qhQj8-LwKELzJvi4YnPFbIAQoADEAAAAAAAAkQDoJU0lOMTozNTg3QLIISQAAAAAAAPA_UQAAAAAAAAAAWQAAAAAAAAAA/cca=OTMyNSNTSU4xOjM1ODc=/bn=78553/referrer=http%3A%2F%2Ftest.com%2FOpenWrap%2FowSingleSlotNative.html/"],
                "impressionTrackers":["http://sin1-ib.adnxs.com/it?referrer=http%3A%2F%2Ftest.com%2FOpenWrap%2FowSingleSlotNative.html&e=wqT_3QKBB6CBAwAAAwDWAAUBCMOKmeQFENDspMK2n_-GEBid7Zf1rYLxwHMqNgkAAAECCCRAEQEHEAAAJEAZEQkAIREJACkRCQAxEQmoMOLRpwY47UhA7UhIAlC8yb4uWJzxW2AAaM26dXjZ5QSAAQGKAQNVU0SSAQEG8FKYAQGgAQGoAQGwAQC4AQHAAQTIAQLQAQDYAQDgAQDwAQCKAjt1ZignYScsIDI1Mjk4ODUsIDE1NTIzMDM0MjcpO3VmKCdyJywgOTc0OTQyMDQsIC4eAPCakgL1ASFZem56MFFqOC1Md0tFTHpKdmk0WUFDQ2M4VnN3QURnQVFBUkk3VWhRNHRHbkJsZ0FZTlVCYUFCd1BuZ0tnQUdLQVlnQkFKQUJBWmdCQWFBQkFhZ0JBN0FCQUxrQjg2MXFwQUFBSkVEQkFmT3RhcVFBQUNSQXlRRllVdW42VU9iUlA5a0JBQUFBQUFBQThEX2dBUUQxQVEBD0BDWUFnQ2dBdl9fX184UHRRSQEVBEF2DQh4d0FJQXlBSUE0QUlBNkFJQS1BSUFnQU1CbUFNQnFBUAXQgHVnTUpVMGxPTVRvek5UZzM0QU95Q0EuLpoCYSFzQTFxaDr4ACxuUEZiSUFRb0FERUENAQxrUURvMkQAFFFMSUlTUQ0eDFBBX1URDAxBQUFXHQzw7dgCAOACrZhI6gIwaHR0cDovL3Rlc3QuY29tL09wZW5XcmFwL293U2luZ2xlU2xvdE5hdGl2ZS5odG1sgAMAiAMBkAMAmAMXoAMBqgMAwAPgqAHIAwDYA9KCJOADAOgDAPgDAYAEAJIEDS91dC92My9wcmViaWSYBACiBA8xMTUuMTE0LjEzNC4xNzSoBN6SAbIEEAgAEAEYrAIg-gEoADAAOAK4BADABADIBADSBA45MzI1I1NJTjE6MzU4N9oEAggB4AQB8AS8yb4uiAUBmAUAoAX___________8BwAUAyQUAAAAAAADwP9IFCQlJ4XgAANgFAeAFAfAFmfQh-gUECAAQAJAGAZgGALgGAMEGCSUo8D_IBgDaBhYKEAA6AQAYEAAYAOAGDA..&s=e5283e630904b323dced9399c167477da73eb6b3"],
                "image":{"url":"http://vcdn.adnxs.com/p/creative-image/f8/7f/0f/13/f87f0f13-230c-4f05-8087-db9216e393de.jpg",
                "height":742,
                "width":989}}
            }
            action = "impTrackers";
            sinon.spy(BIDMgr, 'setImageSrcToPixelURL');
            done();
        });

        afterEach(function(done) {
            bidDetails = null;
            action = null;
            BIDMgr.setImageSrcToPixelURL.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.fireTracker.should.be.a('function');
            done();
        });

        it('should call pixel url function with impression trackers',function(done){
            BIDMgr.fireTracker(bidDetails,action);
            // BIDMgr.setImageSrcToPixelURL.calledWith(bidDetails["native"].impressionTrackers[0],false).should.be.true;
            done();
        });

        it('should call pixel url function with click trackers',function(done){
            BIDMgr.fireTracker(bidDetails,action);
            // BIDMgr.setImageSrcToPixelURL.calledWith(bidDetails["native"].clickTrackers[0],false).should.be.true;
            done();
        });
    });

    describe('#setStandardKeys', function(){
        var divID = null;
        var winningBidStub = null;
        var keyValuePairsStub = null;

        beforeEach(function(done) {
            winningBidStub = new bid('pubmatic', 'div1');
            winningBidStub.setGrossEcpm(2);
            winningBidStub.setDealID(null);
            winningBidStub.setDealChannel(0);
            winningBidStub.setAdHtml("adm");
            winningBidStub.setAdUrl("");
            winningBidStub.setWidth(300);
            winningBidStub.setHeight(250);
            keyValuePairsStub = {};
            done();
        });

        afterEach(function(done) {
            if (winningBidStub) {
                winningBidStub = null;
            }
            divID = null;
            keyValuePairsStub = null;
            done();
        });

        it('is a function', function(done) {
            BIDMgr.setStandardKeys.should.be.a('function');
            done();
        });

        it('do not generate keys for invalid winning bid object', function(done){
            var kvp = {a: 'a', b: 'b'};
            var old_kvp = {a: 'a', b: 'b'};
            var wb = null;
            BIDMgr.setStandardKeys(wb, kvp);
            kvp.should.deep.equal(old_kvp)
            done();
        });

        it('generate all keys, no deal-id if deal-id is null', function(done){
            BIDMgr.setStandardKeys(winningBidStub, keyValuePairsStub);
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID ].should.be.defined;
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS ].should.equal(winningBidStub.getStatus());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM ].should.equal(winningBidStub.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));
            (keyValuePairsStub.hasOwnProperty(CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID)).should.equal(false);
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID ].should.equal('pubmatic');
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID ].should.equal(CONFIG.getPublisherId());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID ].should.equal(CONFIG.getProfileID());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID ].should.equal(CONFIG.getProfileDisplayVersionID());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_SIZE ].should.equal(winningBidStub.width + 'x' + winningBidStub.height);
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PLATFORM_KEY ].should.equal((winningBidStub.getNative() ? CONSTANTS.PLATFORM_VALUES.NATIVE : CONSTANTS.PLATFORM_VALUES.DISPLAY));
            done();
        });

        it('generate all keys, no deal-id if deal-id is valid', function(done){
            winningBidStub.setDealID('DEAL_ID');
            BIDMgr.setStandardKeys(winningBidStub, keyValuePairsStub);
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID ].should.be.defined;
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS ].should.equal(winningBidStub.getStatus());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM ].should.equal(winningBidStub.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID ].should.equal('DEAL_ID');
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID ].should.equal('pubmatic');
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID ].should.equal(CONFIG.getPublisherId());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID ].should.equal(CONFIG.getProfileID());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID ].should.equal(CONFIG.getProfileDisplayVersionID());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_SIZE ].should.equal(winningBidStub.width + 'x' + winningBidStub.height);
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PLATFORM_KEY ].should.equal((winningBidStub.getNative() ? CONSTANTS.PLATFORM_VALUES.NATIVE : CONSTANTS.PLATFORM_VALUES.DISPLAY));
            done();
        });

        it('second argument object should also contain original key-values', function(done){
           winningBidStub.setDealID('DEAL_ID');
            keyValuePairsStub['test_key'] = 'hello world';
            keyValuePairsStub['another_test_key'] = 2019;
            BIDMgr.setStandardKeys(winningBidStub, keyValuePairsStub);
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ID ].should.be.defined;
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_STATUS ].should.equal(winningBidStub.getStatus());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ECPM ].should.equal(winningBidStub.getNetEcpm().toFixed(CONSTANTS.COMMON.BID_PRECISION));
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_DEAL_ID ].should.equal('DEAL_ID');
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_ADAPTER_ID ].should.equal('pubmatic');
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PUBLISHER_ID ].should.equal(CONFIG.getPublisherId());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_ID ].should.equal(CONFIG.getProfileID());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PROFILE_VERSION_ID ].should.equal(CONFIG.getProfileDisplayVersionID());
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.BID_SIZE ].should.equal(winningBidStub.width + 'x' + winningBidStub.height);
            keyValuePairsStub[ CONSTANTS.WRAPPER_TARGETING_KEYS.PLATFORM_KEY ].should.equal((winningBidStub.getNative() ? CONSTANTS.PLATFORM_VALUES.NATIVE : CONSTANTS.PLATFORM_VALUES.DISPLAY));
            keyValuePairsStub[ 'test_key' ].should.equal('hello world');
            keyValuePairsStub[ 'another_test_key' ].should.equal(2019);
            done();
        });
    });

    describe('Get Metadata function', function () {
        it('should get the metadata object', function () {
            const meta = {
                networkId: 'nwid',
                advertiserId: 'adid',
                networkName: 'nwnm',
                primaryCatId: 'pcid',
                advertiserName: 'adnm',
                agencyId: 'agid',
                agencyName: 'agnm',
                brandId: 'brid',
                brandName: 'brnm',
                dchain: 'dc',
                demandSource: 'ds',
                secondaryCatIds: ['secondaryCatIds']
            };
            const metadataObj = BIDMgr.getMetadata(meta);

            expect(metadataObj.nwid).to.equal('nwid');
            expect(metadataObj.adid).to.equal('adid');
            expect(metadataObj.nwnm).to.equal('nwnm');
            expect(metadataObj.pcid).to.equal('pcid');
            expect(metadataObj.adnm).to.equal('adnm');
            expect(metadataObj.agid).to.equal('agid');
            expect(metadataObj.agnm).to.equal('agnm');
            expect(metadataObj.brid).to.equal('brid');
            expect(metadataObj.brnm).to.equal('brnm');
            expect(metadataObj.dc).to.equal('dc');
            expect(metadataObj.ds).to.equal('ds');
            expect(metadataObj.scids).to.be.an('array').with.length.above(0);
            expect(metadataObj.scids[0]).to.equal('secondaryCatIds');
        });

        it('should return undefined if meta is null', function () {
            const meta = null;
            const metadataObj = BIDMgr.getMetadata(meta);
            expect(metadataObj).to.equal(undefined);
        });

        it('should return undefined if meta is a empty object', function () {
            const meta = {};
            const metadataObj = BIDMgr.getMetadata(meta);
            expect(metadataObj).to.equal(undefined);
        });

        it('should return undefined if meta object has different properties', function () {
            const meta = {
                a: 123,
                b: 456
            };
            const metadataObj = BIDMgr.getMetadata(meta);
            expect(metadataObj).to.equal(undefined);
        });
    });

	describe('#getBrowser', function() {
		var userAgent =  window.navigator.userAgent;
		it('is a function', function(done) {
            BIDMgr.getBrowser.should.be.a('function');
            done();
        });

		it('should return -1 when userAgent is null', function(done) {
			window.navigator.__defineGetter__('userAgent', function() {
				return null;
			});
            expect(BIDMgr.getBrowser()).to.equal(-1);
            done();
        });

		it('should return 0 when userAgent dose not match regex from CONSTANTS.REGEX_BROWSERS', function(done) {
			window.navigator.__defineGetter__('userAgent', function() {
				return 'xxx-xxxx-xxxx';
			});
            expect(BIDMgr.getBrowser()).to.equal(0);
            done();
        });

		it('should return value from CONSTANTS.BROWSER_MAPPING', function(done) {
			window.navigator.__defineGetter__('userAgent', function() {
				return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";
			});
            expect(BIDMgr.getBrowser()).to.equal(76);
            done();
        });

		it('should return integer value', function(done) {
			window.navigator.__defineGetter__('userAgent', function() {
				return userAgent;
			});
            expect(BIDMgr.getBrowser()).to.not.be.undefined;
            done();
        });

	})
});
