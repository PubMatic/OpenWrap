/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CONFIG = require("../../src_new/config.js");
var CONSTANTS = require("../../src_new/constants.js");
var BID = require("../../src_new/bid.js");
var UTIL = require("../../src_new/util.js");
var BM = require("../../src_new/bidManager.js");
var CONF = require("../../src_new/conf.js");
var AM = require("../../src_new/adapterManager.js");
var SLOT = require("../../src_new/slot.js").Slot;
var PREBID = require("../../src_new/adapters/prebid.js");

var parentAdapterID = "prebid";
var commonAdpterID = 'pubmatic';
var commonDivID = "DIV_1";
var commonKGPV = "XYZ";

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

// global.window.pwtCreatePrebidNamespace = function(preBidNameSpace) {
//     window[preBidNameSpace] = window[preBidNameSpace] || {}; window[preBidNameSpace].que = window[preBidNameSpace].que || [];
// };


describe('ADAPTER: Prebid', function() {

    describe('#transformPBBidToOWBid', function () {
        var bid = null, kgpv = null;

        beforeEach(function (done) {
            bid = {
                bidderCode: "pubmatic",
                cpm: 10,
                dealId: "dealId" ,
                dealChannel: "sale" ,
                ad: "<body><h1>Ad goes here </h1></body>",
                adUrl: "http://dummy.url.com",
                width: 210,
                height: 420,
                responseTimestamp: 1503321091079,
                adserverTargeting: {
                    "k1": "v1"
                },
            };
            kgpv = commonKGPV;
            sinon.spy(UTIL, "forEachOnObject");
            done();
        });

        afterEach(function (done) {
            UTIL.forEachOnObject.restore();
            done();
        });

        it('is a function', function (done) {
            PREBID.transformPBBidToOWBid.should.be.a('function');
            done();
        });

        it('should return the bid object having properties of input bid object', function (done) {
            var theBid = PREBID.transformPBBidToOWBid(bid, kgpv);
            theBid.getGrossEcpm().should.be.equal(bid.cpm);
            theBid.getDealID().should.be.equal(bid.dealId);
            theBid.getDealChannel().should.be.equal(bid.dealChannel);
            theBid.getAdHtml().should.be.equal(bid.ad);
            theBid.getAdUrl().should.be.equal(bid.adUrl);
            theBid.getWidth().should.be.equal(bid.width);
            theBid.getHeight().should.be.equal(bid.height);
            theBid.getReceivedTime().should.be.equal(bid.responseTimestamp);
            theBid.getKeyValuePairs().should.have.all.keys(["k1", "pwtdeal_pubmatic"]);
            done();
        });
    });

    describe('#pbBidStreamHandler', function () {

        beforeEach(function(done){
            sinon.stub(BM, "setBidFromBidder").returns(true);
            PREBID.kgpvMap = {};
            PREBID.kgpvMap["DIV_1@pubmatic"] = {
                "kgpv": "kgpv_value",
                "divID": "DIV_1"
            };
            done();
        });

        afterEach(function(done){
            BM.setBidFromBidder.restore();
            done();
        });

        it('if a function', function (done) {
            PREBID.pbBidStreamHandler.should.be.a('function');
            done();
        });

        it('BM.setBidFromBidder should not be called if argument pbBid does not have adUnitCode set', function(done){
            PREBID.pbBidStreamHandler({});
            BM.setBidFromBidder.called.should.be.false;
            done();
        });

        it('BM.setBidFromBidder should not be called if argument pbBid.adUnitCode is not found in kgpvMap', function(done){
            PREBID.pbBidStreamHandler({adUnitCode:'happy'});
            BM.setBidFromBidder.called.should.be.false;
            done();
        });

        it('BM.setBidFromBidder should not be called if argument pbBid.bidderCode is not set', function(done){
            PREBID.pbBidStreamHandler({adUnitCode:'happy'});
            BM.setBidFromBidder.called.should.be.false;
            done();
        });

        it('BM.setBidFromBidder should be called with expected arguments for valid case', function(done){
            PREBID.pbBidStreamHandler({adUnitCode:'DIV_1@pubmatic', bidderCode: 'pubmatic'});
            BM.setBidFromBidder.called.should.be.true;
            done();
        });

        //todo update
        xit('for serverSideEnabled, BM.setBidFromBidder should NOT be called if pbBid._pmDivId is not set', function(done){
            var adapterID = 'pubmatic';
            CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
            PREBID.pbBidStreamHandler({adUnitCode:'happy', bidderCode: adapterID});
            BM.setBidFromBidder.called.should.be.false;
            delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
            done();
        });

        //todo update
        xit('for serverSideEnabled, BM.setBidFromBidder should NOT be called if pbBid._pmKgpv is not set', function(done){
            var adapterID = 'pubmatic';
            CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
            PREBID.pbBidStreamHandler({adUnitCode:'happy', bidderCode: adapterID});
            BM.setBidFromBidder.called.should.be.false;
            delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
            done();
        });

        //todo update
        xit('for serverSideEnabled, BM.setBidFromBidder should be called if pbBid._pmKgpv and _pmDivId are set', function(done){
            var adapterID = 'pubmatic';
            CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
            PREBID.pbBidStreamHandler({adUnitCode:'happy', bidderCode: adapterID, _pmKgpv: 'Div1', _pmDivId: 'Div1'});
            BM.setBidFromBidder.called.should.be.true;
            delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
            done();
        });

    });

    describe('#handleBidResponses', function() {
        var bidResponses = null,
            theBid = null;

        beforeEach(function(done) {
            bidResponses = {
                "DIV_1": {
                    "bids": [{
                        bidderCode: "pulsepoint",
                        cpm: 0,
                        // ad: '<a id="aw0" onclick="ha('aw0')" onmouseover="ss('aw0')" onmousedown="st('aw0')"" href="http://www.googleadservices.com/pagead/aclk?sa=L&ai=CK7b0v3L_UefCMcq5igfJnYHAAt3X2IUDndattT3AjbcBEAEg0fv0CFDv-vz5-v____8BYOWCgIC8DqABw9iz3gPIAQLgAgCoAwHIA50EqgSTAU_Qwzp3CT6oJYbrzshQtFMB7rUGKBJO7Xs6mvz3XsycXn_AxTrZKhyHKjA2k2h44OdylJfUCBdmoQCv-9dEQWdzWiLucOpWTfWbQUgWXEcuW2K1OCGvIKJfs_4yvd8i6iHvJ5Qd3f-nV_G-yTQ-X9tjdwZvk6Uj56bvfun6fbhALaQBl1HGmLypN7rJ2l4men7QBuAEAYgGAaAGAoAHpafMIQ&num=1&cid=5Gj7aYzg3dHUFbEK-2-85FjM&sig=AOD64_2cCfX2QlpmV0FPZauMfRl1LZ2S8w&client=ca-pub-4798227666512375&adurl=http://www.junglee.com/Home-Cinema-TV-Video/b/802980031/%3Ftag%3Dgoogjudisp113239-21&nm=3" target="_top"><img class="img_ad" width="728" border="0" onload="" src="http://pagead2.googlesyndication.com/simgad/10320243368604073893"></a><iframe frameborder="0" allowtransparency="true" marginheight="0" marginwidth="0" width="0" hspace="0" vspace="0" height="0" style="height:0p;width:0p;display:none;" scrolling="no" src="http://haso.pubmatic.com/ads/9999/GRPBID/2.gif?trackid=12345"></iframe>',
                        ad: " html goes here",
                        width: "728",
                        height: "90:0",
                        responseTimestamp: 1500286874559,
                        adserverTargeting: {
                            "hb_adid": "34c5f7266bb81a6",
                            "hb_bidder": "pubmatic",
                            "hb_deal": "PMERW36842",
                            "hb_pb": "9.00",
                            "hb_size": "728x90:0",
                        }
                    }]
                }
            };

            theBid = {
                setGrossEcpm: function() {
                    return "setGrossEcpm";
                },
                setDealID: function() {
                    return "setDealID";
                },
                setDealChannel: function() {
                    return "setDealChannel";
                },
                setAdHtml: function() {
                    return "setAdHtml";
                },
                setWidth: function() {
                    return "setWidth";
                },
                setHeight: function() {
                    return "setHeight";
                },
                setReceivedTime: function() {
                    return "setReceivedTime";
                },
                setKeyValuePair: function() {
                    return "setKeyValuePair";
                },
                setAdUrl: function() {
                    return "setAdUrl";
                }
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

            sinon.spy(theBid, "setAdUrl");


            sinon.stub(BM, "setBidFromBidder").returns(true);

            PREBID.kgpvMap = {};
            PREBID.kgpvMap["DIV_1"] = {
                "kgpv": "kgpv_value"
            };

            sinon.stub(BID, "createBid").returns(theBid);

            done();
        });

        afterEach(function(done) {

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

            theBid.setAdUrl.restore();

            BM.setBidFromBidder.restore();
            BID.createBid.restore();
            done();
        });

        it('is a function', function(done) {
            PREBID.handleBidResponses.should.be.a('function');
            done();
        });

        it('should have called UTIL.isOwnProperty ', function(done) {
            PREBID.handleBidResponses(bidResponses);
            // console.log("UTIL.isOwnProperty.callCount ==>", UTIL.isOwnProperty.callCount);
            UTIL.isOwnProperty.called.should.be.true;
            done();
        });

        it('should have called bid Object\'s methods if it has bidderCode', function(done) {
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

        it('should have called bid manager\'s setBidFromBidder', function(done) {
            PREBID.handleBidResponses(bidResponses);
            BM.setBidFromBidder.called.should.be.true;
            UTIL.forEachOnObject.called.should.be.true;
            theBid.setKeyValuePair.called.should.be.true;
            done();
        });
    });

    describe('#getPBCodeWithWidthAndHeight', function() {
        it('is a function', function(done) {
            PREBID.getPBCodeWithWidthAndHeight.should.be.a('function');
            done();
        });

        it('check output', function(done){
            PREBID.getPBCodeWithWidthAndHeight('pubmatic', 'DIV_1', 728, 90).should.be.equal('pubmatic@DIV_1@728X90');
            done();
        });
    });

    describe('#getPBCodeWithoutWidthAndHeight', function() {
        it('is a function', function(done) {
            PREBID.getPBCodeWithoutWidthAndHeight.should.be.a('function');
            done();
        });

        it('check output', function(done){
            PREBID.getPBCodeWithoutWidthAndHeight('pubmatic', 'DIV_1').should.be.equal('pubmatic@DIV_1');
            done();
        });
    });

    describe('#generatedKeyCallback', function() {
        var adapterID = null,
            adUnits = null,
            adapterConfig = null,
            impressionID = null,
            generatedKey = null,
            kgpConsistsWidthAndHeight = null,
            currentSlot = null,
            keyConfig = null,
            currentWidth = null,
            currentHeight = null;

        beforeEach(function(done) {
            currentSlot = {
                getDivID: function() {
                    return commonDivID;
                },
                getSizes: function() {
                    return [
                        [340, 210],
                        [1024, 768]
                    ];
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

            //sinon.stub(UTIL, "isOwnProperty").returns(false);
            //sinon.spy(UTIL, "forEachOnObject");
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

        afterEach(function(done) {

            //UTIL.isOwnProperty.restore();
            //UTIL.forEachOnObject.restore();
            UTIL.forEachOnArray.restore();

            currentSlot.getDivID.restore();
            currentSlot.getSizes.restore();

            CONFIG.getProfileID.restore();
            CONFIG.getProfileDisplayVersionID.restore();

            currentSlot = null;

            kgpConsistsWidthAndHeight = null;
            done();
        });

        it('is a function', function(done) {
            PREBID.generatedKeyCallback.should.be.a('function');
            done();
        });

        it('should have created bid object by composing from passed in params', function(done) {
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            CONFIG.getProfileID.called.should.be.true;
            CONFIG.getProfileDisplayVersionID.called.should.be.true;

            UTIL.forEachOnArray.called.should.be.false;
            done();
        });

        it('should have created bid object using sizes passed', function(done) {
            adapterID = "pulsepoint";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            UTIL.forEachOnArray.calledWith([
                [currentWidth, currentHeight]
            ]).should.be.true;
            CONFIG.getProfileID.called.should.be.false;
            CONFIG.getProfileDisplayVersionID.called.should.be.false;
            done();
        });

        it('ADG: should have created bid object using sizes passed', function(done) {
            adapterID = "adg";
            CONF.adapters['adg'] = {};
            var adapterConfig = CONF.adapters['adg'];
            var keyConfig = {
                id: '1234567'
            };
            var kgpConsistsWidthAndHeight = false;
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            adUnits["DIV_1@adg"].bids[0].bidder.should.be.equal("adg");
            adUnits["DIV_1@adg"].bids[0].params.should.be.deep.equal({
                id: '1234567',
                width: 340,
                height: 210
            });
            adUnits["DIV_1@adg"].bids[1].params.should.be.deep.equal({
                id: '1234567',
                width: 1024,
                height: 768
            });
            done();
        });

        it('should have constructed proper slotParams', function(done) {
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
            adUnits[commonDivID + "@" + adapterID].bids[0].should.be.deep.equal({ bidder: adapterID, params: slotParams });
            done();
        });

        it('should have constructed proper slotParams', function(done) {
            kgpConsistsWidthAndHeight = false;
            adapterID = "different";
            CONF.adapters[adapterID] = {};
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            adUnits[commonDivID + "@" + adapterID].bids[0].should.be.deep.equal({ bidder: adapterID, params: {} });
            done();
        });

		it('for serverSideEnabled, adUnits should be unchanged', function(done){
			CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
			kgpConsistsWidthAndHeight = false;
			PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
			// sizes => [[340, 210], [1024, 768]]
			adUnits.should.be.deep.equal({});
			delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
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

        it('for serverSideEnabled adpater, should have called UTIL.forEachGeneratedKey with last param set to true', function(done) {
            CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
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
            delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
            done();
        });

        // it('for serverSideEnabled adpater, should have called UTIL.forEachGeneratedKey with last param set to false', function(done) {
        //     CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
        //     adapterConfig = {};
        //     adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN] = "value_1",
        //         adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] = "value_2",
        //         PREBID.generatePbConf(adapterID, adapterConfig, activeSlots, adUnits, impressionID);
        //     UTIL.log.calledWith(adapterID + CONSTANTS.MESSAGES.M1);
        //     UTIL.forEachGeneratedKey.called.should.be.true;
        //     UTIL.forEachGeneratedKey.calledWith(adapterID,
        //         adUnits,
        //         adapterConfig,
        //         impressionID, [],
        //         activeSlots,
        //         adapterConfig[CONSTANTS.CONFIG.KEY_GENERATION_PATTERN],
        //         adapterConfig[CONSTANTS.CONFIG.KEY_LOOKUP_MAP] || null,
        //         PREBID.generatedKeyCallback,
        //         false).should.be.true;
        //     delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
        //     done();
        // });
    });

    describe('#fetchBids', function() {
        var activeSlots = null;
        var impressionID = null;

        beforeEach(function(done) {
            activeSlots = [new SLOT("Slot_1"), new SLOT("Slot_2")];
            impressionID = 123123123;
            sinon.spy(UTIL, 'log');
            sinon.stub(UTIL, 'isOwnProperty').returns(true);
            sinon.stub(UTIL, 'isFunction');
            sinon.stub(UTIL, 'isDebugLogEnabled');

            sinon.spy(CONFIG, 'forEachAdapter');

            sinon.stub(PREBID, 'generatePbConf');
            PREBID.generatePbConf.returns(true);
            window.pbjs = {

            };
            sinon.stub(AM, "getRandomNumberBelow100").returns(89);
            sinon.stub(AM, "throttleAdapter").returns(true);
            sinon.stub(AM, "setInitTimeForSlotsForAdapter").returns(true);
            windowPbJS2Stub = {
                onEvent: function () {
                    return "onEvent";
                }
            };
            sinon.spy(windowPbJS2Stub, "onEvent");
            window["pbjs2"] = windowPbJS2Stub;
            done();
        });

        afterEach(function(done) {
            activeSlots = null;
            impressionID = null;
            UTIL.log.restore();
            UTIL.isOwnProperty.restore();
            UTIL.isFunction.restore();
            UTIL.isDebugLogEnabled.restore();

            CONFIG.forEachAdapter.restore();
            PREBID.generatePbConf.restore();

            AM.getRandomNumberBelow100.restore();
            AM.throttleAdapter.restore();
            AM.setInitTimeForSlotsForAdapter.restore();

            windowPbJS2Stub.onEvent.restore();
            delete window.pbjs;
            done();
        });

        it('is a function', function(done) {
            PREBID.fetchBids.should.be.a('function');
            done();
        });

        it('returns while logging it when Prebid js is not loaded', function(done) {
            sinon.stub(global.window || window, "pwtCreatePrebidNamespace").withArgs("pbjs0").returns(true);
            PREBID.fetchBids(activeSlots, impressionID);
            UTIL.log.calledWith("PreBid js is not loaded").should.be.true;
            CONFIG.forEachAdapter.called.should.be.false;
            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            done();
        });

        it('returns while logging when newly created namespace doenst have onEvent method', function (done) {
            UTIL.isFunction.returns(false);
            PREBID.fetchBids(activeSlots, impressionID);
            UTIL.log.calledWith("PreBid js onEvent method is not available").should.be.true;
            done();
        });

        it('should have called onEvent with bidResponse and prebid bid handler', function (done) {
            UTIL.isFunction.returns(true);
            sinon.stub(global.window || window, "pwtCreatePrebidNamespace", function pwtCreatePrebidNamespace(preBidNameSpace) {
                window["pbjs2"] = windowPbJS2Stub;
                window["pbjs2"].que = [];
            });
            PREBID.fetchBids(activeSlots, impressionID);
            windowPbJS2Stub.onEvent.calledWith('bidResponse', PREBID.pbBidStreamHandler).should.be.true;
            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            done();
        });

        it('should have called generatePbConf if adapterID for current adapterConfig is not parentAdapterID', function(done) {
            UTIL.isFunction.returns(true);
            sinon.stub(global.window || window, "pwtCreatePrebidNamespace", function pwtCreatePrebidNamespace(preBidNameSpace) {
                window["pbjs3"] = windowPbJS2Stub;
                window["pbjs3"].que = [];
            });
            AM.throttleAdapter.returns(false);
            PREBID.fetchBids(activeSlots, impressionID);
            CONFIG.forEachAdapter.called.should.be.true;
            PREBID.generatePbConf.called.should.be.true;
            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            done();
        });

        it('should have logged when adapter is throttled', function(done) {
            UTIL.isFunction.returns(true);
            sinon.stub(global.window || window, "pwtCreatePrebidNamespace", function pwtCreatePrebidNamespace(preBidNameSpace) {
                window["pbjs4"] = windowPbJS2Stub;
                window["pbjs4"].que = [];
            });
            AM.throttleAdapter.returns(true);
            PREBID.fetchBids(activeSlots, impressionID);
            CONFIG.forEachAdapter.called.should.be.true;
            PREBID.generatePbConf.called.should.be.false;
            UTIL.log.calledWith("pubmatic" + CONSTANTS.MESSAGES.M2).should.be.true;
            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            done();
        });

        it('prebid logging is disabled by default', function(done) {
            UTIL.isFunction.returns(true);
            UTIL.isDebugLogEnabled.returns(false);
            sinon.stub(global.window || window, "pwtCreatePrebidNamespace", function pwtCreatePrebidNamespace(preBidNameSpace) {
                window["pbjs5"] = windowPbJS2Stub;
                window["pbjs5"].que = [];
                window["pbjs5"].logging = false;
            });
            PREBID.fetchBids(activeSlots, impressionID);
            window["pbjs5"].logging.should.be.false;
            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            done();
        });

        it('prebid logging is enabled when ', function(done) {
            UTIL.isFunction.returns(true);
            UTIL.isDebugLogEnabled.returns(true);
            sinon.stub(global.window || window, "pwtCreatePrebidNamespace", function pwtCreatePrebidNamespace(preBidNameSpace) {
                window["pbjs6"] = windowPbJS2Stub;
                window["pbjs6"].que = [];
                window["pbjs6"].logging = false;
                window["pbjs6"].requestBids = function(){};
            });
            PREBID.fetchBids(activeSlots, impressionID);
            window["pbjs6"].logging.should.be.true;
            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            done();
        });

        it('for serverSideEnabled, should have called generatePbConf even if adapterID is to be throttled', function(done) {
            var adapterID = "pubmatic";
            CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
            UTIL.isFunction.returns(true);
            sinon.stub(global.window || window, "pwtCreatePrebidNamespace", function pwtCreatePrebidNamespace(preBidNameSpace) {
                window["pbjs7"] = windowPbJS2Stub;
                window["pbjs7"].que = [];
            });
            AM.throttleAdapter.returns(true);
            PREBID.fetchBids(activeSlots, impressionID);
            CONFIG.forEachAdapter.called.should.be.true;
            PREBID.generatePbConf.called.should.be.true;
            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
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
