/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;


var CONFIG = require("../../src_new/config.js");
var CONSTANTS = require("../../src_new/constants.js");
var BID = require("../../src_new/bid.js");
var UTIL = require("../../src_new/util.js");
var BM = require("../../src_new/bidManager.js");


var SLOT = require("../../src_new/slot.js").Slot;

var PREBID = require("../../src_new/adapters/prebid.js");

var parentAdapterID = "prebid";

var commonAdpterID = 'pubmatic';
var commonDivID = "DIV_1";
var commonKGPV = "XYZ";
// var kgpvMap = {};

// var commonActiveSlots = [new Slot("Slot_1"), new Slot("Slot_2")];

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


describe('ADAPTER: Prebid', function() {
	
    describe('#handleBidResponses', function() {
        var bidResponses = null, theBid = null;

        beforeEach(function (done) {
            bidResponses = {
                "DIV_1": {
                    "bids": [
                        {
                            bidderCode: "pulsepoint",
                            cpm: 0,
                            // ad: '<a id="aw0" onclick="ha('aw0')" onmouseover="ss('aw0')" onmousedown="st('aw0')"" href="http://www.googleadservices.com/pagead/aclk?sa=L&ai=CK7b0v3L_UefCMcq5igfJnYHAAt3X2IUDndattT3AjbcBEAEg0fv0CFDv-vz5-v____8BYOWCgIC8DqABw9iz3gPIAQLgAgCoAwHIA50EqgSTAU_Qwzp3CT6oJYbrzshQtFMB7rUGKBJO7Xs6mvz3XsycXn_AxTrZKhyHKjA2k2h44OdylJfUCBdmoQCv-9dEQWdzWiLucOpWTfWbQUgWXEcuW2K1OCGvIKJfs_4yvd8i6iHvJ5Qd3f-nV_G-yTQ-X9tjdwZvk6Uj56bvfun6fbhALaQBl1HGmLypN7rJ2l4men7QBuAEAYgGAaAGAoAHpafMIQ&num=1&cid=5Gj7aYzg3dHUFbEK-2-85FjM&sig=AOD64_2cCfX2QlpmV0FPZauMfRl1LZ2S8w&client=ca-pub-4798227666512375&adurl=http://www.junglee.com/Home-Cinema-TV-Video/b/802980031/%3Ftag%3Dgoogjudisp113239-21&nm=3" target="_top"><img class="img_ad" width="728" border="0" onload="" src="http://pagead2.googlesyndication.com/simgad/10320243368604073893"></a><iframe frameborder="0" allowtransparency="true" marginheight="0" marginwidth="0" width="0" hspace="0" vspace="0" height="0" style="height:0p;width:0p;display:none;" scrolling="no" src="http://haso.pubmatic.com/ads/9999/GRPBID/2.gif?trackid=12345"></iframe>',
                            ad: " html goes here",
                            width: "728",
                            height: "90:0",
                            responseTimestamp: 1500286874559,
                            adserverTargeting: {
                                "hb_adid" :"34c5f7266bb81a6",
                                "hb_bidder" :"pubmatic",
                                "hb_deal" :"PMERW36842",
                                "hb_pb" :"9.00",
                                "hb_size" :"728x90:0",
                            }
                        }
                    ]
                }
            };

            theBid = {
                setGrossEcpm: function () {
                    return "setGrossEcpm";
                },
                setDealID: function () {
                    return "setDealID";
                },
                setDealChannel: function () {
                    return "setDealChannel";
                },
                setAdHtml: function () {
                    return "setAdHtml";
                },
                setWidth: function () {
                    return "setWidth";
                },
                setHeight: function () {
                    return "setHeight";
                },
                setReceivedTime: function () {
                    return "setReceivedTime";
                },
                setKeyValuePair: function () {
                    return "setKeyValuePair";
                },
            };
            sinon.stub(UTIL, "isOwnProperty").returns(true);
            sinon.spy(UTIL, "forEachOnObject");

            sinon.spy(theBid, "setGrossEcpm");
            sinon.spy(theBid, "setDealID");
            sinon.spy(theBid, "setDealChannel");
            sinon.spy(theBid, "setAdHtml");
            sinon.spy(theBid, "setWidth");
            sinon.spy(theBid, "setHeight");
            sinon.spy(theBid, "setReceivedTime");

            sinon.spy(theBid, "setKeyValuePair");


            sinon.stub(BM, "setBidFromBidder").returns(true);

            PREBID.kgpvMap = {};
            PREBID.kgpvMap["DIV_1"] = {
                "kgpv": "kgpv_value" 
            };

            sinon.stub(BID, "createBid").returns(theBid);

            done();
        });

        afterEach(function (done) {

            UTIL.isOwnProperty.restore();
            UTIL.forEachOnObject.restore();

            theBid.setGrossEcpm.restore();
            theBid.setDealID.restore();
            theBid.setDealChannel.restore();
            theBid.setAdHtml.restore();
            theBid.setWidth.restore();
            theBid.setHeight.restore();
            theBid.setReceivedTime.restore();

            theBid.setKeyValuePair.restore();

            BM.setBidFromBidder.restore();
            BID.createBid.restore();
            done();
        });

        it('is a function', function(done) {
            PREBID.handleBidResponses.should.be.a('function');
            done();
        });

        it('should have called UTIL.isOwnProperty ', function (done) {
            PREBID.handleBidResponses(bidResponses);
            // console.log("UTIL.isOwnProperty.callCount ==>", UTIL.isOwnProperty.callCount);
            UTIL.isOwnProperty.called.should.be.true;
            done();
        });

        it('should have called bid Object\'s methods if it has bidderCode', function (done) {
            PREBID.handleBidResponses(bidResponses);
            theBid.setGrossEcpm.called.should.be.true;
            theBid.setDealID.called.should.be.true;
            theBid.setDealChannel.called.should.be.true;
            theBid.setAdHtml.called.should.be.true;
            theBid.setWidth.called.should.be.true;
            theBid.setHeight.called.should.be.true;
            theBid.setReceivedTime.called.should.be.true;
            done();
        });

        it('should have called bid manager\'s setBidFromBidder', function (done) {
            PREBID.handleBidResponses(bidResponses);
            BM.setBidFromBidder.called.should.be.true;
            UTIL.forEachOnObject.called.should.be.true;
            theBid.setKeyValuePair.called.should.be.true;
            done();
        });
    });

    describe('#generatedKeyCallback', function () {
        var adapterID = null, adUnits = null, adapterConfig = null, 
            impressionID = null, generatedKey = null, kgpConsistsWidthAndHeight = null, 
            currentSlot = null, keyConfig = null, currentWidth = null, currentHeight = null;

        beforeEach(function (done) {
            currentSlot = {
                getDivID: function () {
                    return commonDivID;
                },
                getSizes: function () {
                    return [[340, 210], [1024, 768]];
                }
            };

            sinon.spy(currentSlot, "getDivID");
            sinon.spy(currentSlot, "getSizes");
            adapterConfig = {
                "publisherId": 121
            };
            adapterID = commonAdpterID;
            generatedKey = "generatedKey_1";
            impressionID = 123123123;
            adUnits = {};

            sinon.stub(UTIL, "isOwnProperty").returns(false);
            sinon.spy(UTIL, "forEachOnObject");
            sinon.spy(UTIL, "forEachOnArray");

            sinon.stub(CONFIG, "getProfileID").returns("profId");
            sinon.stub(CONFIG, "getProfileDisplayVersionID").returns("verId");

            kgpConsistsWidthAndHeight = true;
            window.PWT = {
                udpv: {}
            };
            currentWidth = 340;
            currentHeight = 210;
            done();
        });

        afterEach(function (done) {

            UTIL.isOwnProperty.restore();
            UTIL.forEachOnObject.restore();
            UTIL.forEachOnArray.restore();
            

            currentSlot.getDivID.restore();
            currentSlot.getSizes.restore();

            CONFIG.getProfileID.restore();
            CONFIG.getProfileDisplayVersionID.restore();

            currentSlot = null;

            kgpConsistsWidthAndHeight = null;
            done();
        });

    	it('is a function', function (done) {
    		PREBID.generatedKeyCallback.should.be.a('function');
    		done();
    	});

        it('should have created bid object by composing from passed in params', function (done) {
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            CONFIG.getProfileID.called.should.be.true;
            CONFIG.getProfileDisplayVersionID.called.should.be.true;

            UTIL.forEachOnArray.called.should.be.false;
            done();
        });

        it('should have created bid object using sizes passed', function (done) {
            adapterID = "pulsepoint";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            UTIL.forEachOnArray.calledWith([[currentWidth, currentHeight]]).should.be.true;
            CONFIG.getProfileID.called.should.be.false;
            CONFIG.getProfileDisplayVersionID.called.should.be.false;
            done();
        });

        it('should have constructed proper slotParams', function (done) {
            kgpConsistsWidthAndHeight = false;
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            // sizes => [[340, 210], [1024, 768]]
            var slotParams = {
                "publisherId": 121,
                "adSlot": generatedKey,
                "wiid": impressionID,
                "profId": "profId",
                "verId": "verId",
            };
            adUnits[commonDivID].bids[0].should.be.deep.equal({bidder: adapterID, params: slotParams });
            done();
        });


        it('should have constructed proper slotParams', function (done) {
            kgpConsistsWidthAndHeight = false;
            adapterID = "different";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            adUnits[commonDivID].bids[0].should.be.deep.equal({bidder: adapterID, params: {} });
            done();
        });
    });

    describe('#generatePbConf', function() {
        var adapterID = null;
        var adapterConfig = null;
        var activeSlots = null;
        var adUnits = null;
        var impressionID = null;

        beforeEach(function(done) {
            adapterID = commonAdpterID;
            adapterConfig = {};
            activeSlots = [new SLOT("Slot_1"), new SLOT("Slot_2")];
            adUnits = "ad_unit_1";
            impressionID = 123123123;
            sinon.stub(UTIL, 'log');

            sinon.stub(UTIL, 'forEachGeneratedKey');
            done();
        });

        afterEach(function(done) {
            adapterID = null;
            adapterConfig = null;
            activeSlots = null;
            adUnits = null;
            impressionID = null;
            UTIL.log.restore();
            UTIL.forEachGeneratedKey.restore();
            done();
        });

        it('is a function', function(done) {
            PREBID.generatePbConf.should.be.a('function');
            done();
        });

        it('should have logged passed adapterID and return if adapterConfig is not valid', function(done) {
            adapterConfig = null;
            PREBID.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
            UTIL.log.calledWith(adapterID + CONSTANTS.MESSAGES.M1);
            UTIL.forEachGeneratedKey.called.should.be.false;
            done();
        });

        it('should have called UTIL.forEachGeneratedKey with proper input', function(done) {
        	adapterConfig = {};
        	adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN] = "value_1",
            adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] = "value_2",	
            PREBID.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
            UTIL.log.calledWith(adapterID + CONSTANTS.MESSAGES.M1);
            UTIL.forEachGeneratedKey.called.should.be.true;
            UTIL.forEachGeneratedKey.calledWith(adapterID,
                adUnits,
                adapterConfig,
                impressionID, [],
                activeSlots,
                adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN],
                adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || null,
                PREBID.generatedKeyCallback,
                true).should.be.true;
            done();
        });
    });

    describe('#fetchBids', function() {
        var activeSlots = null;
        var impressionID = null;

        beforeEach(function(done) {
            activeSlots = [new SLOT("Slot_1"), new SLOT("Slot_2")];
            impressionID = 123123123;
            sinon.spy(UTIL, 'log');
            sinon.spy(UTIL, 'isOwnProperty');
            sinon.spy(UTIL, 'isFunction');

            sinon.stub(CONFIG, 'forEachAdapter').returns(true);

            sinon.stub(PREBID, 'generatePbConf');
            PREBID.generatePbConf.returns(true);
            window.pbjs = {

            };
            done();
        });

        afterEach(function(done) {
            activeSlots = null;
            impressionID = null;
            UTIL.log.restore();
            UTIL.isOwnProperty.restore();
            UTIL.isFunction.restore();

            CONFIG.forEachAdapter.restore();
            PREBID.generatePbConf.restore();
            delete window.pbjs;
            done();
        });

        it('is a function', function(done) {
            PREBID.fetchBids.should.be.a('function');
            done();
        });

        it('returns while logging it when Prebid js is not loaded', function(done) {
            window.pbjs = null;
            PREBID.fetchBids(activeSlots, impressionID);
            UTIL.log.calledWith("PreBid js is not loaded").should.be.true;
            CONFIG.forEachAdapter.called.should.be.false;
            done();
        });

        // TODO : change TDD as predbi.js code has changed a bit
        it('should have called generatePbConf', function(done) {
            PREBID.fetchBids(activeSlots, impressionID);
            // UTIL.log.calledWith("PreBid js is not loaded").should.be.true;
            CONFIG.forEachAdapter.called.should.be.true;
            // PREBID.generatePbConf.called.should.be.true;
            done();
        });
    });

    describe('#getParenteAdapterID', function() {
        it('is a function', function(done) {
            PREBID.getParenteAdapterID.should.be.a('function');
            done();
        });

        it('returns parentAdapterID', function(done) {
            PREBID.getParenteAdapterID().should.equal(PREBID.parentAdapterID);
            done();
        });
    });

    describe('#register', function() {
        it('is a function', function(done) {
            PREBID.register.should.be.a('function');
            done();
        });

        it('returns object with methods to use', function(done) {
            PREBID.register().should.deep.equal({
                fB: PREBID.fetchBids,
                ID: PREBID.getParenteAdapterID
            });
            done();
        });
    });
});
