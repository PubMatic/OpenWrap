/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var BIDMgr = require('../src_new/bidManager');
var CONFIG = require("../src_new/config.js");
var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");
var bmEntry = require("../src_new/bmEntry.js");
var bmEntryContstuctor = require("../src_new/bmEntry.js").BMEntry;
var AdapterEntry = require("../src_new/adapterEntry").AdapterEntry;
var bid = require('../src_new/bid.js').Bid;
var conf = require("../src_new/conf");

var commonAdpterID = 'pubmatic';
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
            window.PWT.bidMap[divID].should.have.all.keys("adapters", "analyticsEnabled","creationTime","expired","impressionID","name","sizes");
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
            sinon.spy(CONFIG, 'getTimeout');

            sinon.stub(BIDMgr, 'storeBidInBidMap');
            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            UTIL.log.restore();
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
            UTIL.log.calledWith(CONSTANTS.MESSAGES.M18).should.be.true;
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
                UTIL.log.calledWith(CONSTANTS.MESSAGES.M23).should.be.true;
                UTIL.log.calledWith(CONSTANTS.MESSAGES.M12 + lastBid.getNetEcpm() + CONSTANTS.MESSAGES.M13 + bidDetails.getNetEcpm() + CONSTANTS.MESSAGES.M14);
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
                s2s: CONFIG.isServerSideAdapter(adapterID)
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

            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            divID = null;
            winningBidObj = null;
            BIDMgr.auctionBids.restore();
            UTIL.vLogInfo.restore();
            window.PWT = {};
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
                bidDetails: winningBidObj.wb
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

            var timeNow = new Date().getTime();
            sinon.stub(UTIL, "getCurrentTimestamp").returns(timeNow);

            sinon.spy(UTIL, "forEachOnObject");

            window.PWT = {
                bidMap: {
                }
            };

            slotID_1 = "Slot_1";
            bmEntryStub_1 = new bmEntryContstuctor(slotID_1);
            slotID_2 = "Slot_2";
            bmEntryStub_2 = new bmEntryContstuctor(slotID_2);

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

            UTIL.getCurrentTimestamp.restore();
            UTIL.forEachOnObject.restore();
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
            CONFIG.getPublisherId.called.should.be.false;
            done();
        });

        it('should have called CONFIG functions to generate output Object', function(done) {
            BIDMgr.executeAnalyticsPixel();

            CONFIG.getPublisherId.called.should.be.true;
            CONFIG.getTimeout.called.should.be.true;
            CONFIG.getProfileID.called.should.be.true;
            CONFIG.getProfileDisplayVersionID.called.should.be.true;

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
        var adapterID = null;
        var theBid = null;
        var latency = null;
        var kgpv = commonKGPV;
        var impressionID = 123123;
        var origImage = null;

        beforeEach(function(done) {
            slotID = "Slot_1";
            theBid = new bid(adapterID, kgpv);
            sinon.spy(CONFIG, 'getMonetizationPixelURL');
            sinon.spy(CONFIG, 'getPublisherId');
            sinon.spy(CONFIG, 'getProfileID');
            sinon.spy(CONFIG, 'getProfileDisplayVersionID');
            sinon.stub(theBid, 'getBidID');
            theBid.getBidID.returns('784b05cc03a84a');
            sinon.spy(theBid, 'getAdapterID');
            sinon.spy(theBid, 'getNetEcpm');
            sinon.spy(theBid, 'getGrossEcpm');
            sinon.spy(theBid, 'getKGPV');

            origImage = window.Image;
            window.Image = sinon.stub();
            window.Image.returns({});

            window.PWT = {
                bidMap: {}
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
            window.encodeURIComponent.restore();

            theBid.getBidID.restore();
            theBid.getAdapterID.restore();
            theBid.getNetEcpm.restore();
            theBid.getGrossEcpm.restore();
            theBid.getKGPV.restore();
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

            CONFIG.getPublisherId.called.should.be.false;
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


        it('should have generated pixel url with all necessary calls', function(done) {
            BIDMgr.executeMonetizationPixel(slotID, theBid);

            CONFIG.getMonetizationPixelURL.called.should.be.true;
            CONFIG.getPublisherId.called.should.be.true;
            CONFIG.getProfileID.called.should.be.true;
            CONFIG.getProfileDisplayVersionID.called.should.be.true;

            theBid.getBidID.called.should.be.true;
            theBid.getAdapterID.called.should.be.true;
            theBid.getNetEcpm.called.should.be.true;
            theBid.getGrossEcpm.called.should.be.true;
            theBid.getKGPV.called.should.be.true;

            window.Image.called.should.be.true;
            UTIL.getCurrentTimestamp.called.should.be.true;
            window.encodeURIComponent.callCount.should.be.equal(10);

            done();
        });

        it('should generate proper pixelURL ', function(done) {

            var pixelURL = CONFIG.getMonetizationPixelURL();
            pixelURL += "pubid=" + CONFIG.getPublisherId();
            pixelURL += "&purl=" + window.encodeURIComponent(UTIL.metaInfo.pageURL);
            pixelURL += "&tst=" + UTIL.getCurrentTimestamp();
            pixelURL += "&iid=" + window.encodeURIComponent(window.PWT.bidMap[slotID].getImpressionID());
            pixelURL += "&bidid=" + window.encodeURIComponent(theBid.getBidID());
            pixelURL += "&pid=" + window.encodeURIComponent(CONFIG.getProfileID());
            pixelURL += "&pdvid=" + window.encodeURIComponent(CONFIG.getProfileDisplayVersionID());
            pixelURL += "&slot=" + window.encodeURIComponent(slotID);
            pixelURL += "&pn=" + window.encodeURIComponent(theBid.getAdapterID());
            pixelURL += "&en=" + window.encodeURIComponent(theBid.getNetEcpm());
            pixelURL += "&eg=" + window.encodeURIComponent(theBid.getGrossEcpm());
            pixelURL += "&kgpv=" + window.encodeURIComponent(theBid.getKGPV());


            BIDMgr.executeMonetizationPixel(slotID, theBid);

            BIDMgr.setImageSrcToPixelURL.calledWith(pixelURL).should.be.true;

            done();
        });
    });

    describe('#analyticalPixelCallback', function() {
        var slotID = null,
            bmEntryObj = null,
            impressionIDMap = null;
        var theBid = null;

        beforeEach(function(done) {
            slotID = "Slot_1";
            bmEntryObj = new bmEntryContstuctor("pubmatic");


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
            impressionIDMap = {};
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

            theBid.getDefaultBidStatus.calledOnce.should.be.true;
            theBid.getKGPV.calledOnce.should.be.true;
            theBid.getWidth.calledOnce.should.be.true;
            theBid.getHeight.calledOnce.should.be.true;
            theBid.getGrossEcpm.calledOnce.should.be.true;
            theBid.getNetEcpm.calledOnce.should.be.true;
            theBid.getDealID.calledOnce.should.be.true;
            theBid.getDealChannel.calledOnce.should.be.true;
            theBid.getPostTimeoutStatus.calledOnce.should.be.true;
            theBid.getWinningBidStatus.calledOnce.should.be.true;

            done();
        });

        it('should have added impressionIDMap with the generated slotObject', function(done) {
            bmEntryObj.getAnalyticEnabledStatus.returns(true);
            bmEntryObj.setAdapterEntry(commonAdpterID);
            bmEntryObj.setNewBid(commonAdpterID, theBid);
            CONFIG.getBidPassThroughStatus.returns(2);

            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);

            impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].should.have.all.keys("pn", "bidid", "db", "kgpv", "psz", "eg", "en", "di", "dc", "l1", "l2", "t", "wb");
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
            theBid.setWinningBidStatus();
            bmEntryObj.setNewBid("audienceNetwork", theBid);
            CONFIG.getBidPassThroughStatus.returns(2);
            BIDMgr.analyticalPixelCallback(slotID, bmEntryObj, impressionIDMap);
            impressionIDMap[bmEntryObj.getImpressionID()][0]["ps"][0].should.have.all.keys("pn", "bidid", "db", "kgpv", "psz", "eg", "en", "di", "dc", "l1", "l2", "t", "wb");
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
            imageObjStub.src.should.equal(UTIL.metaInfo.protocol + pixelURL);
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
});
