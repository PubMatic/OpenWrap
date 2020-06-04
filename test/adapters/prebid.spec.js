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
var commonAdpterID = "pubmatic";
var commonDivID = "DIV_1";
var commonKGPV = "XYZ";
var isSingleImpressionSettingEnabled = 0;

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
        var bid = null, kgpv = null, errorBid = null;

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
                    "k1": "v1",
                    "hb_format": "native",
                    "hb_source": "client"
                },
                getCpmInNewCurrency: function(){
                    return this.cpm;
                },
                serverSideResponseTime: 5
            };
            errorBid = {
                bidderCode: "pubmatic",
                cpm: 0,
                dealId: "dealId" ,
                dealChannel: "sale" ,
                ad: "",
                adUrl: "",
                width: 210,
                height: 420,
                responseTimestamp: 1503321091079,
                adserverTargeting: {
                    "k1": "v1",
                    "hb_format": "native",
                    "hb_source": "client"
                },
                serverSideResponseTime: 5,
                pubmaticServerErrorCode: 1,
                getCpmInNewCurrency: function(){
                    return this.cpm;
                }
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
            theBid.getServerSideResponseTime().should.be.equal(bid.serverSideResponseTime);
            theBid.getKeyValuePairs().should.have.all.keys(["k1", "pwtdeal_pubmatic"]);
            done();
        });

        it('should handle pubmaticServerErrorCode correctly', function(done) {
            var theBid = PREBID.transformPBBidToOWBid(errorBid, kgpv);
            theBid.getDefaultBidStatus().should.be.equal(-1);
            theBid.getWidth().should.be.equal(0);
            theBid.getHeight().should.be.equal(0);

            errorBid.pubmaticServerErrorCode = 2;
            theBid = PREBID.transformPBBidToOWBid(errorBid, kgpv);
            theBid.getDefaultBidStatus().should.be.equal(-1);
            theBid.getWidth().should.be.equal(0);
            theBid.getHeight().should.be.equal(0);

            errorBid.pubmaticServerErrorCode = 4;
            theBid = PREBID.transformPBBidToOWBid(errorBid, kgpv);
            theBid.getDefaultBidStatus().should.be.equal(0);
            theBid.getWidth().should.be.equal(210);
            theBid.getHeight().should.be.equal(420);

            errorBid.pubmaticServerErrorCode = 3;
            theBid = PREBID.transformPBBidToOWBid(errorBid, kgpv);
            theBid.getDefaultBidStatus().should.be.equal(0);
            theBid.getPostTimeoutStatus().should.be.true;

            errorBid.pubmaticServerErrorCode = 5;
            theBid = PREBID.transformPBBidToOWBid(errorBid, kgpv);
            theBid.getDefaultBidStatus().should.be.equal(0);
            theBid.getPostTimeoutStatus().should.be.true;

            errorBid.pubmaticServerErrorCode = 11;
            theBid = PREBID.transformPBBidToOWBid(errorBid, kgpv);
            theBid.getDefaultBidStatus().should.be.equal(-1);
            theBid.getWidth().should.be.equal(0);
            theBid.getHeight().should.be.equal(0);

            errorBid.pubmaticServerErrorCode = 12;
            theBid = PREBID.transformPBBidToOWBid(errorBid, kgpv);
            theBid.getDefaultBidStatus().should.be.equal(-1);
            theBid.getWidth().should.be.equal(0);
            theBid.getHeight().should.be.equal(0);
            done();
        });

        it('should set regexPattern if regexPattern is passed',function(done){
            var regexPattern = ".*@.*@.*";
            var theBid = PREBID.transformPBBidToOWBid(bid, kgpv,regexPattern);
            theBid.getRegexPattern().should.be.equal(regexPattern);
            done();
        });

        it('should set native if native is present',function(done){
            bid.native = "somenativevalue";
            var theBid = PREBID.transformPBBidToOWBid(bid, kgpv);
            theBid.getNative().should.be.equal(bid.native);
            done();
        })
    });

    describe('#pbBidStreamHandler', function () {

        beforeEach(function(done){
            sinon.stub(BM, "setBidFromBidder").returns(true);
            PREBID.kgpvMap = {};
            PREBID.kgpvMap["DIV_1@pubmatic"] = {
                "kgpv": "kgpv_value",
                "divID": "DIV_1"
            };
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(0);
            PREBID.isSingleImpressionSettingEnabled = 0;
            sinon.spy(PREBID, "checkAndModifySizeOfKGPVIfRequired");
            sinon.stub(UTIL, "isOwnProperty").returns(true);
            
            done();
        });

        afterEach(function(done){
            BM.setBidFromBidder.restore();
            CONFIG.isSingleImpressionSettingEnabled.restore();
            PREBID.checkAndModifySizeOfKGPVIfRequired.restore();
            UTIL.isOwnProperty.restore();
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

        it('should call checkandmodifysizeofkgpv if single impression is turnedon', function(done){
            CONFIG.isSingleImpressionSettingEnabled.restore();
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            PREBID.kgpvMap["DIV_1"] = {
                kgpvs:[{
                    adapterID:"pubmatic",
                    kgpv:"somekgpvvalue"
                }]
            };
            var pbBid ={adUnitCode:'DIV_1', bidderCode: 'pubmatic'};
            PREBID.pbBidStreamHandler(pbBid);
            PREBID.checkAndModifySizeOfKGPVIfRequired.calledWith(pbBid,PREBID.kgpvMap["DIV_1"]).should.be.true;
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
                        serverSideResponseTime: 5,
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
                getGrossEcpm: function() {
                    return "getGrossEcpm";
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
                },
                setServerSideResponseTime: function() {
                    return 5;
                },
                setMi: function() {
                    return "setMi";
                },
                setOriginalCpm:function(){
                    return 5;
                },
                setOriginalCurrency: function(){
                    return 'USD';
                },
                setAnalyticsCpm: function(){
                    return 5;
                },
                setPbBid:function(){
                    return "thebid";
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
            sinon.spy(theBid, "setServerSideResponseTime");
            sinon.spy(theBid, "setOriginalCpm");
            sinon.spy(theBid, "setPbBid");

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
            theBid.setOriginalCpm.restore();

            theBid.setKeyValuePair.restore();
            theBid.setServerSideResponseTime.restore();

            theBid.setAdUrl.restore();
            theBid.setPbBid.restore();

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
            PREBID.kgpvMap = {};
            currentSlot = {
                getDivID: function() {
                    return commonDivID;
                },
                getSizes: function() {
                    return [
                        [340, 210],
                        [1024, 768]
                    ];
                },
                getAdUnitID:function(){
                    return "testAdUnit";
                },
                getAdUnitIndex :function(){
                    return "testAdUnitIndex";
                }
            };

            sinon.spy(currentSlot, "getDivID");
            sinon.spy(currentSlot, "getSizes");
            sinon.spy(currentSlot, "getAdUnitID");
            sinon.spy(currentSlot, "getAdUnitIndex");
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
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(0);
            PREBID.isSingleImpressionSettingEnabled = 0;            
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
            currentSlot.getAdUnitID.restore();
            currentSlot.getAdUnitIndex.restore();

            CONFIG.getProfileID.restore();
            CONFIG.getProfileDisplayVersionID.restore();
            CONFIG.isSingleImpressionSettingEnabled.restore();

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

        it('should have created bid object for pubmatic', function(done) {
            adapterID = "pubmatic";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(adUnits["DIV_1@pubmatic@340X210"]).to.exist;
            adUnits["DIV_1@pubmatic@340X210"].bids[0].bidder.should.be.equal("pubmatic");
            done();
        });

        it('should have created bid object for pubmatic2', function(done) {
            adapterID = "pubmatic2";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(adUnits["DIV_1@pubmatic2@340X210"]).to.exist;
            adUnits["DIV_1@pubmatic2@340X210"].bids[0].bidder.should.be.equal("pubmatic2");
            done();
        });

        it('should create adunit even if adUnits have different adapter code for same div',function(done){
            adapterID = "pubmatic";
            adUnits["DIV_1@appnexus@160X600"] = {
                "code":"DIV_1@appnexus@160X600",
                "mediaTypes":{"banner":{"sizes":[[728,90],[300,250],[160,600]]}},
                "sizes":[[728,90],[300,250],[160,600]],
                "bids":[{
                    "bidder":"appnexus",
                    "params":{
                        "placementId":"9880618",
                        "timeout":"5000",
                        "amp":0,
                        "video":0,
                        "in-app":0
                    }}],
                    "divID":"DIV_1"
            };
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(adUnits["DIV_1@pubmatic@340X210"]).to.exist;
            adUnits["DIV_1@pubmatic@340X210"].mediaTypes.should.be.an.object;
            done();
        });

        it('should have created bid object using currentSlot sizes', function(done) {
            adapterID = "pulsepoint";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            UTIL.forEachOnArray.calledWith(
               [[
                   340,210
               ]]
            ).should.be.true;
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

        it('ADG: should have created bid object with only one param using sizes passed if single Impression setting is enabled', function(done) {
            CONFIG.isSingleImpressionSettingEnabled.restore();            
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "adg";
            CONF.adapters['adg'] = {};
            var adapterConfig = CONF.adapters['adg'];
            var keyConfig = {
                id: '1234567'
            };
            var kgpConsistsWidthAndHeight = false;
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            adUnits["DIV_1"].bids[0].bidder.should.be.equal("adg");
            adUnits["DIV_1"].bids[0].params.should.be.deep.equal({
                id: '1234567',
                width: 340,
                height: 210
            });
            expect(adUnits["DIV_1"].bids[1]).to.be.undefined;
            done();
        });

        it('YieldLab: should have created bid object using sizes passed', function(done) {
            adapterID = "yieldlab";
            CONF.adapters['yieldlab'] = {};
            var adapterConfig = CONF.adapters['yieldlab'];
            var keyConfig = {
                id: '1234567'
            };
            var kgpConsistsWidthAndHeight = false;
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            adUnits["DIV_1@yieldlab"].bids[0].bidder.should.be.equal("yieldlab");
            adUnits["DIV_1@yieldlab"].bids[0].params.should.be.deep.equal({
                id: '1234567',
                adSize: "340x210"
            });
            adUnits["DIV_1@yieldlab"].bids[1].params.should.be.deep.equal({
                id: '1234567',
                adSize: "1024x768"
            });
            done();
        });


        it('YieldLab: should have created bid object with only one param using sizes passed if single Impression setting is enabled', function(done) {
            CONFIG.isSingleImpressionSettingEnabled.restore();            
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "yieldlab";
            CONF.adapters['yieldlab'] = {};
            var adapterConfig = CONF.adapters['yieldlab'];
            var keyConfig = {
                id: '1234567'
            };
            var kgpConsistsWidthAndHeight = false;
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            adUnits["DIV_1"].bids[0].bidder.should.be.equal("yieldlab");
            adUnits["DIV_1"].bids[0].params.should.be.deep.equal({
                id: '1234567',
                adSize: "340x210"
            });
            expect(adUnits["DIV_1"].bids[1]).to.be.undefined;
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
                "verId": "verId"
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
        

        // Single Impression Multi Size Feature is On STARTS
        it('should have created bid object for div if multiSizeSingleImpression is on', function(done) {
            CONFIG.isSingleImpressionSettingEnabled.restore();
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "pubmatic";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(adUnits["DIV_1"]).to.exist;
            adUnits["DIV_1"].bids[0].bidder.should.be.equal("pubmatic");
            done();
        });

        it('should not have pushed in adunit if adapter is already present', function(done) {
            CONFIG.isSingleImpressionSettingEnabled.restore();
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "pubmatic";
            adUnits["DIV_1"] = {
                bids: [{ bidder: adapterID, params: "someparams" }],
            }
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(adUnits["DIV_1"]).to.exist;
            expect(adUnits["DIV_1"].bids[1]).to.be.undefined;
            done();
        });

        it('should have pushed in adunit if adapter is not present', function(done) {
            CONFIG.isSingleImpressionSettingEnabled.restore();
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "appnexus";
            adUnits["DIV_1"] = {
                bids: [{ bidder: "pubmatic", params: "someparams" }],
            }
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(adUnits["DIV_1"]).to.exist;
            expect(adUnits["DIV_1"].bids[1]).to.exist;
            adUnits["DIV_1"].bids[1].bidder.should.be.equal("appnexus");
            done();
        });


        it('should generate kgpvmap consisting of kgpvs array',function(done){
            CONFIG.isSingleImpressionSettingEnabled.restore();
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "pubmatic";
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(PREBID.kgpvMap["DIV_1"]).to.exist;
            expect(PREBID.kgpvMap["DIV_1"].kgpvs).to.exist;
            PREBID.kgpvMap["DIV_1"].kgpvs[0].adapterID.should.be.equal("pubmatic");
            PREBID.kgpvMap["DIV_1"].kgpvs[0].kgpv.should.be.equal(generatedKey);
            done();
        });

        it('should push into kgpvs in kgpvmap only in case of unique',function(done){
            CONFIG.isSingleImpressionSettingEnabled.restore();
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "appnexus";
            PREBID.kgpvMap["DIV_1"] = {
                kgpvs:[{
                    adapterID:"pubmatic",
                    kgpv:generatedKey
                }]
            };
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(PREBID.kgpvMap["DIV_1"]).to.exist;
            expect(PREBID.kgpvMap["DIV_1"].kgpvs).to.exist;
            PREBID.kgpvMap["DIV_1"].kgpvs[1].adapterID.should.be.equal("appnexus");
            PREBID.kgpvMap["DIV_1"].kgpvs[1].kgpv.should.be.equal(generatedKey);
            done();
        });

        it('should not push into kgpvs in kgpvmap if adapter already exists',function(done){
            CONFIG.isSingleImpressionSettingEnabled.restore();
            sinon.stub(CONFIG, "isSingleImpressionSettingEnabled").returns(1);
            PREBID.isSingleImpressionSettingEnabled = 1;
            adapterID = "pubmatic";
            PREBID.kgpvMap["DIV_1"] = {
                kgpvs:[{
                    adapterID:"pubmatic",
                    kgpv:generatedKey
                }]
            };
            PREBID.generatedKeyCallback(adapterID, adUnits, adapterConfig, impressionID, generatedKey, kgpConsistsWidthAndHeight, currentSlot, keyConfig, currentWidth, currentHeight);
            expect(PREBID.kgpvMap["DIV_1"]).to.exist;
            expect(PREBID.kgpvMap["DIV_1"].kgpvs).to.exist;
            expect(PREBID.kgpvMap["DIV_1"].kgpvs[1]).to.be.undefined;
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
            sinon.stub(UTIL, 'logError');

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
            UTIL.logError.restore();
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

    describe("#assignSingleRequestConfigForBidders",function(){
        var prebidConfig = {};

        beforeEach(function(done) {
            sinon.stub(UTIL,"forEachOnObject").returns((function(){
                prebidConfig = {
                    "rubicon":{
                        singleRequest:true
                    },
                    "improvedigital":{
                        singleRequest:true
                    }
                }
            })());
            done();
        });

        afterEach(function(done){
            UTIL.forEachOnObject.restore();
            prebidConfig = {};
            done();
        });


        it('should assign config based on CONSTANTS.SRA_ENABLED_BIDDERS',function(done){
            var expectedResult ={
                "rubicon":{
                    singleRequest:true
                },
                "improvedigital":{
                    singleRequest:true
                }
            }
            PREBID.assignSingleRequestConfigForBidders(prebidConfig);
            UTIL.forEachOnObject.called.should.be.true;
            expectedResult.should.deep.equal(prebidConfig);
            done();
        });

        it('should not assign config if adapter is not present in adpaterconfig',function(done){
            var expectedResult ={}
            PREBID.assignSingleRequestConfigForBidders(prebidConfig);
            UTIL.forEachOnObject.called.should.be.true;
            prebidConfig = {};
            expectedResult.should.deep.equal(prebidConfig);
            done();
        })
    });

    describe('#fetchBids', function() {
        var activeSlots = null;
        var impressionID = null;
        var prebidConfig = {};

        beforeEach(function(done) {
            activeSlots = [new SLOT("Slot_1"), new SLOT("Slot_2")];
            impressionID = 123123123;
            sinon.spy(UTIL, 'log');
            sinon.spy(UTIL, 'logError');
            sinon.spy(UTIL, 'logWarning');
            sinon.stub(UTIL, 'isOwnProperty').returns(true);
            sinon.stub(UTIL, 'isFunction');
            sinon.stub(UTIL, 'isDebugLogEnabled');

            sinon.spy(CONFIG, 'forEachAdapter');
            sinon.spy(CONFIG, 'getCmpApi');
            sinon.spy(CONFIG, 'getGdprTimeout');
            sinon.spy(CONFIG, 'getAwc');
            sinon.stub(CONFIG, 'getGdpr').returns(true);

            sinon.spy(CONFIG, 'getCCPATimeout');
            sinon.stub(CONFIG, 'getCCPA').returns(true);

            sinon.stub(PREBID, 'generatePbConf');
            PREBID.generatePbConf.returns(true);
            window.owpbjs = {

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
            window["owpbjs"] = windowPbJS2Stub;

            sinon.stub(global.window || window, "pwtCreatePrebidNamespace", function pwtCreatePrebidNamespace(preBidNameSpace) {
                window["owpbjs"] = windowPbJS2Stub;
                window["owpbjs"].que = [];
                window["owpbjs"].setConfig = function (pbConfig) {
                   prebidConfig = pbConfig;
                  return true;
                };
                window["owpbjs"].getConfig = function(){
                    return prebidConfig;
                }
            });
            window.owpbjs = window.owpbjs || {};
            window.owpbjs.cmd = window.owpbjs.cmd || [];
            window["owpbjs"].setConfig = function (pbConfig) {
                prebidConfig = pbConfig;
               return true;
             };
             window["owpbjs"].getConfig = function(){
                 return prebidConfig;
             };
            done();
        });

        afterEach(function(done) {
            activeSlots = null;
            impressionID = null;
            UTIL.log.restore();
            UTIL.logError.restore();
            UTIL.logWarning.restore();
            UTIL.isOwnProperty.restore();
            UTIL.isFunction.restore();
            UTIL.isDebugLogEnabled.restore();

            CONFIG.forEachAdapter.restore();
            CONFIG.getGdpr.restore();
            CONFIG.getCmpApi.restore();
            CONFIG.getGdprTimeout.restore();

            CONFIG.getCCPA.restore();
            CONFIG.getCCPATimeout.restore();

            CONFIG.getAwc.restore();
            PREBID.generatePbConf.restore();

            AM.getRandomNumberBelow100.restore();
            AM.throttleAdapter.restore();
            AM.setInitTimeForSlotsForAdapter.restore();

            windowPbJS2Stub.onEvent.restore();

            if (global.window) {
                global.window.pwtCreatePrebidNamespace.restore();
            } else {
                window.pwtCreatePrebidNamespace.restore();
            }
            delete window.owpbjs;
            prebidConfig = {};
            done();
        });

        it('is a function', function(done) {
            PREBID.fetchBids.should.be.a('function');
            done();
        });

        it('has access to owpbjs namespace', function(done) {
            should.exist(window["owpbjs"]);
            done();
        });

        if('should return if owpbjs namespace is not defined',function(done){
            delete window.owpbjs;
            PREBID.fetchBids(activeSlots, impressionID);
            UTIL.logError.calledWith("PreBid js is not loaded").should.be.true;
            done();
        })

        // TODO: Need to fix this testcase somehow
        it('returns while logging it when Prebid js is not loaded', function(done) {
            // sinon.stub(global.window || window, "pwtCreatePrebidNamespace").withArgs("owpbjs").returns(true);
            PREBID.fetchBids(activeSlots, impressionID);
            // UTIL.log.calledWith("PreBid js is not loaded").should.be.true;
            CONFIG.forEachAdapter.called.should.be.false;
            done();
        });

        it('returns while logging when newly created namespace doenst have onEvent method', function (done) {
            UTIL.isFunction.returns(false);
            PREBID.fetchBids(activeSlots, impressionID);
            UTIL.logWarning.calledWith("PreBid js onEvent method is not available").should.be.true;
            done();
        });

        it('should have called setConfig method', function (done) {
            PREBID.fetchBids(activeSlots, impressionID);
            window.owpbjs = window.owpbjs || {};
            window.owpbjs.cmd = window.owpbjs.cmd || [];
            window.owpbjs.que = window.owpbjs.que || [];
            window.owpbjs.setConfig = function () {};
            window["owpbjs"].setConfig.should.be.called;
            CONFIG.getGdpr().should.be.true;
            CONFIG.getCmpApi().should.be.called;
            CONFIG.getGdprTimeout().should.be.called;
            CONFIG.getAwc().should.be.called;
            CONFIG.getCCPA().should.be.true;
            CONFIG.getCCPACmpApi().should.be.called;
            CONFIG.getCCPATimeout().should.be.called;
            done();
        });

        it('should have called onEvent with bidResponse and prebid bid handler', function (done) {
            UTIL.isFunction.returns(true);
            PREBID.fetchBids(activeSlots, impressionID);
            windowPbJS2Stub.onEvent.calledWith('bidResponse', PREBID.pbBidStreamHandler).should.be.true;
            done();
        });

        it('should have called generatePbConf if adapterID for current adapterConfig is not parentAdapterID', function(done) {
            UTIL.isFunction.returns(true);
            AM.throttleAdapter.returns(false);
            PREBID.fetchBids(activeSlots, impressionID);
            CONFIG.forEachAdapter.called.should.be.true;
            PREBID.generatePbConf.called.should.be.true;
            done();
        });

        it('should have logged when adapter is throttled', function(done) {
            UTIL.isFunction.returns(true);
            AM.throttleAdapter.returns(true);
            PREBID.fetchBids(activeSlots, impressionID);
            CONFIG.forEachAdapter.called.should.be.true;
            PREBID.generatePbConf.called.should.be.false;
            UTIL.log.calledWith("pubmatic" + CONSTANTS.MESSAGES.M2).should.be.true;
            done();
        });

        it('prebid logging is disabled by default', function(done) {
            UTIL.isFunction.returns(true);
            UTIL.isDebugLogEnabled.returns(false);
            window["owpbjs"].logging = false;
            PREBID.fetchBids(activeSlots, impressionID);
            window["owpbjs"].logging.should.be.false;
            done();
        });

        it('prebid logging is enabled when ', function(done) {
            UTIL.isFunction.returns(true);
            UTIL.isDebugLogEnabled.returns(true);
            window["owpbjs"].logging = false;
            window["owpbjs"].requestBids = function(){};
            PREBID.fetchBids(activeSlots, impressionID);
            window["owpbjs"].logging.should.be.true;
            done();
        });

        it('for serverSideEnabled, should have called generatePbConf even if adapterID is to be throttled', function(done) {
            var adapterID = "pubmatic";
            CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED] = '1';
            UTIL.isFunction.returns(true);
            AM.throttleAdapter.returns(true);
            PREBID.fetchBids(activeSlots, impressionID);
            CONFIG.forEachAdapter.called.should.be.true;
            PREBID.generatePbConf.called.should.be.true;
            delete CONF.adapters[adapterID][CONSTANTS.CONFIG.SERVER_SIDE_ENABLED];
            done();
        });

        it('should set config for single request partners present in constants',function(done){
            var expectedResult = {
                "rubicon":{
                    singleRequest:true
                },
                "improvedigital":{
                    singleRequest:true
                }
            }
            PREBID.fetchBids(activeSlots, impressionID);
            window["owpbjs"].setConfig(expectedResult).should.be.called;
            var prebidConfig = window["owpbjs"].getConfig();
            expectedResult.should.be.equal(prebidConfig);
            done();
        });

        it('should not have set config for single request parnter if it is not present for bidding',function(done){
            var expectedResult = {};
            PREBID.fetchBids(activeSlots, impressionID);
            window["owpbjs"].setConfig(expectedResult).should.be.called;
            var prebidConfig = window["owpbjs"].getConfig();
            expectedResult.should.be.equal(prebidConfig);
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
                ID: PREBID.getParenteAdapterID,
                sC: PREBID.setConfig
            });
            done();
        });
    });

    describe('checkAndModifySizeOfKGPVIfRequired',function(){
        var bid= {};
        var responseId;
        var kgpv = {};

        beforeEach(function(done){
            bid = {
                "bidderCode": "pubmatic",
                "width": 728,
                "height": 90,
                "statusMessage": "Bid available",
                "adId": "25799d56e271d8",
                "mediaType": "banner",
                "source": "client",
                "requestId": "25799d56e271d8",
                "ttl": 300,
                "ad": "html",
                "creativeId": 100002,
                "netRevenue": false,
                "cpm": 2.4,
                "currency": "USD",
                "referrer": "http://test.com/TestPages/multislot_multi_size.html",
                "auctionId": "7f5d0c6b-81ed-412d-91a9-900a62453c8c",
                "responseTimestamp": 1547807060472,
                "requestTimestamp": 1547807060456,
                "bidder": "pubmatic",
                "adUnitCode": "Div1",
                "timeToRespond": 16,
                "pbLg": "0.00",
                "pbMg": "0.00",
                "pbHg": "0.00",
                "pbAg": "0.00",
                "pbDg": "0.00",
                "pbCg": "",
                "adserverTargeting": {},
                getSize:function(){
                    return this.width + "x" + this.height;
                }
            };
            kgpv={
                "kgpvs":[{
                    "adapterID":"pubmatic",
                    "kgpv":"300x250@300X250:0",
                    "regexPattern": ".*@.*@.*"
                },{
                    "adapterID":"appnexus",
                    "kgpv":"/43743431/DMDemo@300X250",
                    "regexPattern": ".*@.*@.*"
                }],
                "divID":"Div1"
            };
            done();
        });

        afterEach(function(done){
            adUnits = {};
            responseId = null;
            kgpv = null;
            done();
        });

        it('should be a functiion',function(done){
            PREBID.checkAndModifySizeOfKGPVIfRequired.should.be.a('function');
            done();
        });

        //Test cases for different scenario
        it('should return modified kgpv as per winningKgpv',function(done){
            bid["adUnitCode"] = "Div1";
            var expectedResponseKgpv = {
                "responseKGPV":"728x90@728x90:0",
                "responseRegex":".*@.*@.*"
            }
            PREBID.checkAndModifySizeOfKGPVIfRequired(bid, kgpv).should.be.deep.equal(expectedResponseKgpv);
            done();
        });

        it('should return modified kgpv as per winningKgpv if kgp is div@size',function(done){
            bid["adUnitCode"] = "Div1";
            kgpv.kgpvs[0].kgpv = "Div1@300x250:0";
            var expectedResponseKgpv = {
                "responseKGPV":"Div1@728x90:0",
                "responseRegex":".*@.*@.*"
            }
            PREBID.checkAndModifySizeOfKGPVIfRequired(bid, kgpv).should.be.deep.equal(expectedResponseKgpv);
            done();
        });

        it('should return same kgpv if winning bid size is same of response size',function(done){
            // var expectedResponseKgpv = "728x90@728x90:0";
            kgpv.kgpvs[0].kgpv = "728x90@728x90:0";
            var expectedResponseKgpv = {
                "responseKGPV":"728x90@728x90:0",
                "responseRegex":".*@.*@.*"
            }
            PREBID.checkAndModifySizeOfKGPVIfRequired(bid, kgpv).should.be.deep.equal(expectedResponseKgpv);
            done();
        });

        it('should not modify kgpv in case of 0X0 bid if kgp if Div@Size',function(done){
            bid["width"] = 0;
            bid["height"] = 0;
            kgpv.kgpvs[0].kgpv = "Div1@728x90:0";
            // var expectedResponseKgpv = "Div1@728x90:0";
            var expectedResponseKgpv = {
                "responseKGPV":"Div1@728x90:0",
                "responseRegex":".*@.*@.*"
            }
            PREBID.checkAndModifySizeOfKGPVIfRequired(bid, kgpv).should.be.deep.equal(expectedResponseKgpv);
            done();
        });

        it('should not modify kgpv in case of 0X0 bid if kgp if Div@Size without index',function(done){
            bid["width"] = 0;
            bid["height"] = 0;
            kgpv.kgpvs[0].kgpv = "Div1@728x90";
            // var expectedResponseKgpv = "Div1@728x90";
            var expectedResponseKgpv = {
                "responseKGPV":"Div1@728x90",
                "responseRegex":".*@.*@.*"
            }
	        PREBID.checkAndModifySizeOfKGPVIfRequired(bid, kgpv).should.be.deep.equal(expectedResponseKgpv);
            done();
        });

        it('should not modify kgpv in case of 0X0 bid if kgp if AU@Size',function(done){
            bid["width"] = 0;
            bid["height"] = 0;
            kgpv.kgpvs[0].kgpv = "/43743431/DMDemo@300x250";
            // var expectedResponseKgpv = "/43743431/DMDemo@300x250";
            var expectedResponseKgpv = {
                "responseKGPV":"/43743431/DMDemo@300x250",
                "responseRegex":".*@.*@.*"
            }
            PREBID.checkAndModifySizeOfKGPVIfRequired(bid, kgpv).should.be.deep.equal(expectedResponseKgpv);
            done();
        });
    });

    describe('isAdUnitsCodeContainBidder',function(){
        var adUnits = {};
        var adapterID = "";
        var code = "";

        beforeEach(function(done){
            adapterID = "pubmatic";
            code = "DIV1";
            adUnits["DIV1"] = {
                "code":"DIV1",
                "bids":[{
                    "bidder":"pubmatic",
                }]
            };
            done();
        });

        afterEach(function(done){
            adUnits = {};
            adapterID = "";
            code = "";
            done();
        });

        it('should be a functiion',function(done){
            PREBID.isAdUnitsCodeContainBidder.should.be.a('function');
            done();
        });

        it('should return true if adUnit[code] bidder list contain bidder',function(done){
            var expectedResponseKgpv = true;
            expect(PREBID.isAdUnitsCodeContainBidder(adUnits, code, adapterID)).to.be.equal(expectedResponseKgpv);
            done();
        });

        it('should return false if adUnit[code] bidder list does contain bidder',function(done){
            var expectedResponseKgpv = false;
            adapterID = "appnexus";
            expect(PREBID.isAdUnitsCodeContainBidder(adUnits, code, adapterID)).to.be.equal(expectedResponseKgpv);
            done();
        });

    })

});
