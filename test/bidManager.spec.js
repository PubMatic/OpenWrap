/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var BIDMgr = require('../src_new/bidManager');

var CONFIG = require("../src_new/config.js");

// console.log("CONFIG ==>", CONFIG.getTimeout);
var CONSTANTS = require("../src_new/constants.js");
var UTIL = require("../src_new/util.js");
var bmEntry = require("../src_new/bmEntry.js")


var bid = require('../src_new/bid.js').Bid;

var jsdom = require('jsdom').jsdom;
var exposedProperties = ['window', 'navigator', 'document'];

var commonAdpterID = 'pubmatic';
var commonDivID = "DIV_1";
var commonKGPV = "XYZ";
var commonBidID = '9886ade8a';
var conf = require("../src_new/conf");

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

describe('bidManager BIDMgr', function() {

    describe('#createBidEntry', function() {
        // var PWT = null;
        var divID = commonDivID;
        beforeEach(function(done) {
            window.PWT = {
                bidMap: {

                }
            };
            sinon.spy(UTIL, 'isOwnProperty');
            sinon.spy(bmEntry, 'createBMEntry');
            done();
        });

        afterEach(function(done) {
            done();
            UTIL.isOwnProperty.restore();
            bmEntry.createBMEntry.restore();
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
            done();
        });

        it('should not have called bmEntry.createBMEntry when given DivID is not present in global BidMap', function(done) {
            window.PWT.bidMap[divID] = bmEntry.createBMEntry(divID);
            BIDMgr.createBidEntry(divID);
            UTIL.isOwnProperty.calledOnce.should.be.true;
            // console.log("bmEntry.createBMEntry.called , bmEntry.createBMEntry.calledCount", bmEntry.createBMEntry.called, bmEntry.createBMEntry.callCount);
            bmEntry.createBMEntry.calledTwice.should.be.false;
            done();
        });
    });

    describe('#setSizes', function() {
        var divID = commonDivID;
        beforeEach(function(done) {
            window.PWT = {
                bidMap: {

                }
            };
            sinon.spy(BIDMgr, 'createBidEntry');
            done();
        });

        afterEach(function(done) {
            BIDMgr.createBidEntry.restore();
            done();
        });


        it('is a function', function(done) {
            BIDMgr.setSizes.should.be.a('function');
            done();
        });

        it('should have caled BIDMgr.createBidEntry', function(done) {
            BIDMgr.setSizes(divID, [
                [230, 450]
            ]);
            BIDMgr.createBidEntry.calledOnce.should.be.true;
            // console.log("window.PWT.bidMap[divID] ==>", window.PWT.bidMap[divID]);
            window.PWT.bidMap[divID].setSizes.should.be.a('function');
            // sinon.spy(new bmEntry(divID), 'setSizes'); // TODO 
            // window.PWT.bidMap[divID].setSizes.calledWith([[230, 45]]).should.be.true;
            // window.PWT.bidMap[divID].setSizes.calledOnce.should.be.true;
            done();

        });


    });


    describe('#setCallInitTime', function() {
        var adapterID = commonAdpterID;
        var divID = commonDivID;

        beforeEach(function(done) {
            sinon.spy(BIDMgr, 'createBidEntry');
            done();
        });

        afterEach(function(done) {
            BIDMgr.createBidEntry.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.setCallInitTime.should.be.a('function');
            done();
        });

        it('should have called BIDMgr.createBidEntry', function(done) {
            BIDMgr.setCallInitTime(divID, adapterID);
            BIDMgr.createBidEntry.calledOnce.should.be.true;
            done();
        });
    });



    describe('#setBidFromBidder', function() {
        var divID = null;
        var bidDetails = null;
        var adapterID = commonAdpterID;

        var kgpv = commonKGPV;

        // bidDetails = bid.createBid(adapterID, kgpv);
        bidDetails = new bid(adapterID, kgpv);

        beforeEach(function(done) {
            divID = commonDivID;
            // bidDetails = {};
            window.PWT = {
                bidMap: {

                }
            };
            // console.log("bidDetails ==>", bidDetails);
            // console.log("bidDetails.prototype ==>", bidDetails.prototype);
            sinon.spy(bidDetails, 'getAdapterID');
            sinon.spy(bidDetails, 'getBidID');
            // console.log("bidDetails.getBidID ==>", bidDetails);

            sinon.spy(UTIL, 'isOwnProperty');
            sinon.spy(UTIL, 'log');
            sinon.spy(CONFIG, 'getTimeout');
            // console.log("CONFIG.getTimeOut ==>", CONFIG.getTimeout);

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

            // console.log("obj.callCount ==>", obj.getCreationTime.callCount);
            window.PWT.bidMap[commonDivID].getCreationTime.calledTwice.should.be.true;
            // console.log("bidDetails.getReceivedTime.calledTwice ==>", bidDetails.getReceivedTime.callCount);
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

        it('should have called UTIL.vLogInfo when default bid status is 0', function(done) {
            BIDMgr.storeBidInBidMap(slotID, adapterID, theBid, latency);

            sinon.stub(theBid, 'getDefaultBidStatus');
            theBid.getDefaultBidStatus.returns(0);

            UTIL.vLogInfo.calledOnce.should.be.true;
            done();
        });
    });

    describe('#resetBid', function() {
        var divID = null;
        var impressionID = null;

        beforeEach(function(done) {
            impressionID = 123123123;
            divID = commonDivID;
            sinon.spy(BIDMgr, 'createBidEntry');
            sinon.spy(UTIL, 'vLogInfo');
            // BIDMgr.createBidEntry.returns;
            window.PWT = {
                bidMap: {
                    divID: {

                    }
                }
            }
            done();
        });

        afterEach(function(done) {
            impressionID = null;
            divID = null;
            BIDMgr.createBidEntry.restore();
            UTIL.vLogInfo.restore();
            done();
        });


        it('is a function', function(done) {
            BIDMgr.resetBid.should.be.a('function');
            done();
        });

        it('should have called UTIL.vLogInfo', function(done) {
            BIDMgr.resetBid(divID, impressionID);
            // sinon.spy(window.PWT.bidMap[divID], 'setImpressionID');

            BIDMgr.createBidEntry.called.should.be.true;
            UTIL.vLogInfo.calledWith(divID, { type: "hr" }).should.be.true;

            // console.log("window.PWT.bidMap[divID] ==>", window.PWT.bidMap[divID].setImpressionID.called);
            // window.PWT.bidMap[divID].setImpressionID.called.should.be.true;

            done();
        });
    });

    xdescribe('#auctionBids', function() {
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
            bmEntryObj.setNewBid(adapterID_1, theBid_1);

            theBid_2 = new bid(adapterID_2, kgpv);
            bmEntryObj.setNewBid(adapterID_2, theBid_2);

            // bmEntryObj.adapters = conf.adapters;
            // window.PWT.bidMap[divID] = bmEntry.createBMEntry(divID); 
            done();
        });

        afterEach(function(done) {
            bmEntryObj = null;
            divID = null;
            done();
        });

        it('is a function', function(done) {
            BIDMgr.auctionBids.should.be.a('function');
            console.log("bmEntryObj.adapters ==>", bmEntryObj.adapters);
            done();
        });

        it('should have called UTIL.forEachOnObject', function(done) {
            BIDMgr.auctionBids(bmEntryObj);

            UTIL.forEachOnObject.called.should.be.true;
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
                "key_2": "value2",


            }
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
            var result = BIDMgr.getBid(divID);

            result.should.deep.equal({ wb: null, kvp: null });
            UTIL.isOwnProperty.called.should.be.true;

            done();
        });

        it('should have called UTIL.isOwnProperty and return bid when bidMap have passed divID', function(done) {
            var result = BIDMgr.getBid(divID);
            // BIDMgr.auctionBids.calledOnce.should.be.true;

            result.should.deep.equal({ wb: winningBidObj.wb, kvp: winningBidObj.kvp });
            UTIL.isOwnProperty.called.should.be.true;

            done();
        });

        it('when bidMap have passed divID and winning  bid has ECPM greater than 0', function(done) {
            UTIL.isOwnProperty.restore();
            sinon.stub(UTIL, 'isOwnProperty');
            UTIL.isOwnProperty.withArgs(window.PWT.bidMap, divID).returns(true);
            // console.log("window.PWT.bidMap[divID] ==>", window.PWT.bidMap[divID]);
            var result = BIDMgr.getBid(divID);
            BIDMgr.auctionBids.calledOnce.should.be.true;

            winningBidObj.wb.setStatus.called.should.be.true;
            winningBidObj.wb.setWinningBidStatus.called.should.be.true;

            UTIL.vLogInfo.calledWith(divID, {
                type: "win-bid",
                bidDetails: winningBidObj.wb
            }).should.be.true;

            result.should.deep.equal({ wb: winningBidObj.wb, kvp: winningBidObj.kvp });
            UTIL.isOwnProperty.called.should.be.true;

            done();
        });

        it('when bidMap have passed divID and winning  bid has ECPM less than 0', function(done) {
            UTIL.isOwnProperty.restore();
            sinon.stub(winningBidObj.wb, 'getNetEcpm');
            winningBidObj.wb.getNetEcpm.returns(-1);
            sinon.stub(UTIL, 'isOwnProperty');
            UTIL.isOwnProperty.withArgs(window.PWT.bidMap, divID).returns(true);
            // console.log("window.PWT.bidMap[divID] ==>", window.PWT.bidMap[divID]);
            var result = BIDMgr.getBid(divID);
            BIDMgr.auctionBids.calledOnce.should.be.true;

            winningBidObj.wb.setStatus.called.should.be.false;
            winningBidObj.wb.setWinningBidStatus.called.should.be.false;

            UTIL.vLogInfo.calledWith(divID, {
                type: "win-bid-fail",
            }).should.be.true;

            result.should.deep.equal({ wb: winningBidObj.wb, kvp: winningBidObj.kvp });
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
            window.PWT.bidMap[divID].getBid.withArgs(adapterID, bidID)
                .onFirstCall().returns(theBid)
                // .onSecondCall().returns(null);

            done();
        });

        afterEach(function(done) {
            UTIL.isOwnProperty.restore();
            UTIL.log.restore();
            window.PWT.bidMap[divID].getBid.restore();
            done();
        });

        it('is a function', function(done) {
            BIDMgr.getBidById.should.be.a('function');
            done();
        });

        it('should return null while logging it when bidIdMap doesnt contains passed bidID', function(done) {

            should.not.exist(BIDMgr.getBidById(nonExistingBidID));
            UTIL.log.calledWith("Bid details not found for bidID: " + nonExistingBidID).should.be.true;
            done();
        });

        it('should return null when bidIdMap contains passed bidID but bidMap doenst have bid\'s divID', function(done) {
            window.PWT.bidIdMap[bidID].s = nonExistingDivID;
            should.not.exist(BIDMgr.getBidById(bidID));
            UTIL.log.calledWith("Bid details not found for bidID: " + bidID).should.be.true;
            done();
        });

        it('should return object containing bid and slot id when bid object is not null', function(done) {
            BIDMgr.getBidById(bidID).should.be.deep.equal({ bid: theBid, slotid: divID });

            UTIL.log.calledWith("BidID: " + bidID + ", DivID: " + divID + CONSTANTS.MESSAGES.M19 + adapterID).should.be.true;
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
            BIDMgr.executeMonetizationPixel.called.should.be.true;
            UTIL.displayCreative.called.should.be.true;
            UTIL.vLogInfo.called.should.be.true;
            UTIL.vLogInfo.calledWith(divID, { type: 'disp', adapter: adapterID })
            done();
        });


    });

    describe('#executeAnalyticsPixel', function() {
        it('is a function', function(done) {
            BIDMgr.executeAnalyticsPixel.should.be.a('function');
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

            sinon.spy(window, 'Image');

            window.PWT = {
                bidMap: {}
            };
            window.PWT.bidMap[slotID] = {
                getImpressionID: function() {
                    return impressionID;
                }
            };
            // console.log(window.PWT.bidMap);
            sinon.spy(window, 'encodeURIComponent');

            // sinon.spy(UTIL, 'getCurrentTimestamp');
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

            window.Image.restore();

            UTIL.getCurrentTimestamp.restore();

            BIDMgr.setImageSrcToPixelURL.restore();

            done();
        });


        it('is a function', function(done) {
            BIDMgr.executeMonetizationPixel.should.be.a('function');
            done();
        });

        it('should return when pixelURL is null, without calling any ', function(done) {
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


    describe('#setImageSrcToPixelURL', function() {
        var pixelURL = null;
        beforeEach(function(done) {
            pixelURL = "t.pubmatic.com/wt?pubid=9999&purl=undefined&tst=1499332621&iid=123123&bidid=784b05cc03a84a&pid=46&pdvid=4&slot=Slot_1&pn=null&en=0&eg=0&kgpv=XYZ";
            sinon.spy(window, 'Image');
            done();
        });

        afterEach(function(done) {
            pixelURL = null;
            window.Image.restore();
            done();
        });
        it('is a function', function(done) {
            BIDMgr.setImageSrcToPixelURL.should.be.a('function');
            done();
        });

        it('should have called window.Image while setting its src to the passed pixelURL', function(done) {
            BIDMgr.setImageSrcToPixelURL(pixelURL);
            window.Image.called.should.be.true;
            done();

        });
    });

});
