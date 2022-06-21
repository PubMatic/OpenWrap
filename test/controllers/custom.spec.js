/* global describe, it, xit, expect, sinon, beforeEach, afterEach */
// var sinon = require("sinon");
//var should = require("chai").should();
var CUSTOM = require("../../src_new/controllers/custom.js");
var UTIL = require("../../src_new/util.js");
var CONFIG = require("../../src_new/config.js");
var BM = require("../../src_new/bidManager.js");
var BID = require("../../src_new/bid.js");
var CONSTANTS = require("../../src_new/constants.js");
var PREBID = require("../../src_new/adapters/prebid.js");

describe("CONTROLLER: CUSTOM", function() {

	describe("#setWindowReference()", function() {
		var nonObject = 0;

		beforeEach(function (done) {
			sinon.spy(UTIL, "isObject");
			done();
		});

		afterEach(function (done) {
			UTIL.isObject.restore();
			done();
		});

		it("should not set WindowReference if argument is not object", function(done) {
			CUSTOM.setWindowReference(nonObject);
			expect(CUSTOM.getWindowReference() === null).to.equal(true);
			UTIL.isObject.returned(false).should.be.true;
			UTIL.isObject.calledOnce.should.be.true;
			done();
		});

		it("should set WindowReference if argument is object", function(done) {
			CUSTOM.setWindowReference(window);
			CUSTOM.getWindowReference().should.be.deep.equal(window);
			UTIL.isObject.calledOnce.should.be.true;
			UTIL.isObject.returned(true).should.be.true;
			done();
		});
	});

	describe("#getWindowReference", function () {
		it("is a function", function (done) {
			CUSTOM.getWindowReference.should.be.a("function");
			done();
		});

		it("should return the window object reference", function (done) {
			CUSTOM.setWindowReference(window);
			CUSTOM.getWindowReference().should.deep.equal(window);
			done();
		});
	});

	describe("#getAdUnitIndex()", function() {
		var random = null;
		var currentGoogleSlotStub = null;

		beforeEach(function (done) {
			random = Math.floor(Math.random() * 100);
			currentGoogleSlotStub = {
				getSlotId: function() {
					return this;
				},
				getId: function() {
					return "abcd_" + random;
				}
			};
			sinon.spy(currentGoogleSlotStub, "getSlotId");
			sinon.spy(currentGoogleSlotStub, "getId");
			done();
		});

		afterEach(function (done) {
			currentGoogleSlotStub.getSlotId.restore();
			currentGoogleSlotStub.getId.restore();
			random = null;
			currentGoogleSlotStub = null;
			done();
		});


		it("should return 0 when the object passed is null ", function(done) {
			CUSTOM.getAdUnitIndex(null).should.equal(0);
			done();
		});

		it("should return 0 when the object passed is number ", function(done) {
			CUSTOM.getAdUnitIndex(0).should.equal(0);
			done();
		});

		it("should return 0 when the object passed is empty string ", function(done) {
			CUSTOM.getAdUnitIndex("").should.equal(0);
			done();
		});

		it("should return 0 when the object passed is not empty string ", function(done) {
			CUSTOM.getAdUnitIndex("abcd").should.equal(0);
			done();
		});

		it("should return 0 when the object passed does not have required method ", function(done) {
			CUSTOM.getAdUnitIndex({}).should.equal(0);
			done();
		});


		it("should return random when the object passed does have required method ", function(done) {
			CUSTOM.getAdUnitIndex(currentGoogleSlotStub).should.equal(random);
			currentGoogleSlotStub.getSlotId.calledOnce.should.be.true;
			currentGoogleSlotStub.getId.calledOnce.should.be.true;
			done();
		});
	});

	describe("#defineWrapperTargetingKey()", function() {

		beforeEach(function (done) {
			sinon.spy(UTIL, "isObject");
			done();
		});

		afterEach(function (done) {
			UTIL.isObject.restore();
			done();
		});

		it("is a function", function(done) {
			CUSTOM.defineWrapperTargetingKey.should.be.a("function");
			done();
		});

		it("set wrapper Targeting Key's value to empty string", function(done) {
			CUSTOM.defineWrapperTargetingKey("DIV_1");
			CUSTOM.wrapperTargetingKeys["DIV_1"].should.equal("");
			done();
		});


		it("initialize wrapperTargetingKeys if its not been initialized", function(done) {
			CUSTOM.wrapperTargetingKeys = null;
			CUSTOM.defineWrapperTargetingKey("DIV_2");
			CUSTOM.wrapperTargetingKeys["DIV_2"].should.equal("");
			Object.keys(CUSTOM.wrapperTargetingKeys).length.should.be.equal(1);
			UTIL.isObject.returned(false).should.be.true;
			done();
		});
	});

	describe("#defineWrapperTargetingKeys()", function() {

		it("should return empty object when empty object is passed", function(done) {
			CUSTOM.defineWrapperTargetingKeys({}).should.deep.equal({});
			done();
		});

		describe("When object with keys n values is passed", function() {
			beforeEach(function(done) {
				sinon.spy(UTIL, "forEachOnObject");
				done();
			});

			afterEach(function(done) {
				UTIL.forEachOnObject.restore();
				done();
			});

			var inputObject = {
				"key1": "value1",
				"key2": "value2"
			};

			var outputObject = {
				"value1": "",
				"value2": ""
			};

			it("should return empty object when given input object doesnt have any key value pairs", function (done) {
				CUSTOM.defineWrapperTargetingKeys({}).should.deep.equal({});
				done();
			});

			it("should return object with values as keys and respective value should be empty strings", function(done) {
				CUSTOM.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
				done();
			});

			it("should have called util.forEachOnObject", function(done) {
				CUSTOM.defineWrapperTargetingKeys(inputObject).should.deep.equal(outputObject);
				UTIL.forEachOnObject.calledOnce.should.equal(true);
				done();
			});
		});
	});

	describe("#initSafeFrameListener", function () {
		var theWindow = null;

		beforeEach(function (done) {
			sinon.stub(UTIL, "addMessageEventListenerForSafeFrame").returns(true);
			theWindow = {
				PWT: {
					safeFrameMessageListenerAdded: true
				}
			};
			done();
		});

		afterEach(function (done) {
			UTIL.addMessageEventListenerForSafeFrame.restore();
			theWindow = null;
			done();
		});

		it("is a function", function (done) {
			CUSTOM.initSafeFrameListener.should.be.a("function");
			done();
		});


		it("should do nothing if message listener for safe frame is already added", function (done) {
			CUSTOM.initSafeFrameListener(theWindow);
			UTIL.addMessageEventListenerForSafeFrame.called.should.be.false;
			theWindow.PWT.safeFrameMessageListenerAdded.should.be.true;
			done();
		});


		it("should add message listener for safe frame if not added", function (done) {
			theWindow.PWT.safeFrameMessageListenerAdded = false;
			CUSTOM.initSafeFrameListener(theWindow);
			UTIL.addMessageEventListenerForSafeFrame.calledOnce.should.be.true;
			theWindow.PWT.safeFrameMessageListenerAdded.should.be.true;
			done();
		});
	});

	describe("#validateAdUnitObject", function () {
		var validObject = null;
		beforeEach(function(done){
			validObject = {
				code: "some-pub-friendly-unique-name",
				divId: "div-id-where-slot-will-render",
				adUnitId: "ad_unit-id-from-DFP",
				adUnitIndex: "ad-unit-index",
				mediaTypes: {
					banner: {
						sizes: [ [300, 250], [300, 300] ]
					}
				}
			};
			done();
		});

		it("is a function", function(done) {
			CUSTOM.validateAdUnitObject.should.be.a("function");
			done();
		});

		it("should return false when passed argument is not an object", function (done) {
			CUSTOM.validateAdUnitObject().should.be.false;
			done();
		});

		it("should return false if adUnit.code is not string", function (done) {
			validObject.code = undefined;
			CUSTOM.validateAdUnitObject(validObject).should.be.false;
			done();
		});

		it("should return false if adUnit.divId is not string", function (done) {
			validObject.divId = undefined;
			CUSTOM.validateAdUnitObject(validObject).should.be.false;
			done();
		});

		it("should return false if adUnit.adUnitId is not string", function (done) {
			validObject.adUnitId = undefined;
			CUSTOM.validateAdUnitObject(validObject).should.be.false;
			done();
		});

		it("should return false if adUnit.adUnitIndex is not string", function (done) {
			validObject.adUnitIndex = undefined;
			CUSTOM.validateAdUnitObject(validObject).should.be.false;
			done();
		});

		it("should return false if adUnit.mediaTypes is not object", function (done) {
			validObject.mediaTypes = undefined;
			CUSTOM.validateAdUnitObject(validObject).should.be.false;
			done();
		});

		it("should return false if adUnit.mediaTypes.banner is not object", function (done) {
			validObject.mediaTypes.banner = undefined;
			CUSTOM.validateAdUnitObject(validObject).should.be.false;
			done();
		});

		it("should return false if adUnit.mediaTypes.banner.sizes is not array", function (done) {
			validObject.mediaTypes.banner.sizes = undefined;
			CUSTOM.validateAdUnitObject(validObject).should.be.false;
			done();
		});

		it("should return true if adUnit is valid", function (done) {
			CUSTOM.validateAdUnitObject(validObject).should.be.true;
			done();
		});
	});

	describe("#getAdSlotSizesArray()", function() {

		var validInput = null;
		beforeEach(function(done){
			validInput = {
				mediaTypes: {
					banner: {
						sizes: [[300, 250]]
					}
				}
			};
			done();
		});

		it("is a function", function(done) {
			CUSTOM.getAdSlotSizesArray.should.be.a("function");
			done();
		});

		it("return empty array on invalid input: argument not passed", function(done){
			CUSTOM.getAdSlotSizesArray().should.deep.equal([]);
			done();
		});

		it("return empty array on invalid input: key mediaTypes is not present", function(done){
			delete validInput.mediaTypes;
			CUSTOM.getAdSlotSizesArray(validInput).should.deep.equal([]);
			done();
		});

		it("return empty array on invalid input: key mediaTypes.banner is not present", function(done){
			delete validInput.mediaTypes.banner;
			CUSTOM.getAdSlotSizesArray(validInput).should.deep.equal([]);
			done();
		});

		it("return empty array on invalid input: key mediaTypes.banner.sizes is not present", function(done){
			delete validInput.mediaTypes.banner.sizes;
			CUSTOM.getAdSlotSizesArray(validInput).should.deep.equal([]);
			done();
		});

		it("return sizes array on valid input", function(done){
			CUSTOM.getAdSlotSizesArray(validInput).should.deep.equal(validInput.mediaTypes.banner.sizes);
			done();
		});
	});

	describe("#findWinningBidAndGenerateTargeting", function () {
		var dataStub = null;
		var winningBidStub = null;
		var keyValuePairsStub = null;

		it("is a function", function(done) {
			CUSTOM.findWinningBidAndGenerateTargeting.should.be.a("function");
			done();
		});

		it("proper key value pairs are generated", function(done){            
			winningBidStub = BID.createBid("pubmatic", "div_1");
			winningBidStub.setStatus(1);
			winningBidStub.setGrossEcpm(1.0);
			winningBidStub.setDealID("deal-id");
			winningBidStub.setAdHtml("Hello World!");
			winningBidStub.setWidth(728);
			winningBidStub.setHeight(90);
			keyValuePairsStub = {
				"key1": ["V1", "V2"],
				"key2": ["V11", "V22"]
			};
			dataStub = {
				wb: winningBidStub,
				kvp: keyValuePairsStub
			};
			sinon.stub(BM, "getBid").returns(dataStub);
			var a = CUSTOM.findWinningBidAndGenerateTargeting("div1");
			a.wb.adHtml.should.equal(winningBidStub.getAdHtml());
			a.wb.adapterID.should.equal(winningBidStub.getAdapterID());
			a.wb.width.should.equal(winningBidStub.getWidth());
			a.wb.height.should.equal(winningBidStub.getHeight());
			a.wb.grossEcpm.should.equal(winningBidStub.getGrossEcpm());
			a.wb.netEcpm.should.equal(winningBidStub.getNetEcpm());
			a.kvp["key1"].should.deep.equal(keyValuePairsStub["key1"]);
			a.kvp["key2"].should.deep.equal(keyValuePairsStub["key2"]);
			//todo: compare other key value pairs as well
			a.kvp[CONSTANTS.WRAPPER_TARGETING_KEYS.PLATFORM_KEY].should.equal(CONSTANTS.PLATFORM_VALUES.DISPLAY);
			BM.getBid.restore();
			done();
		});

		it("object with wb and kvp set to null is returned if there is no winning bid", function(done){
			winningBidStub = null;
			keyValuePairsStub = null;
			dataStub = {
				wb: winningBidStub,
				kvp: keyValuePairsStub
			};
			sinon.stub(BM, "getBid").returns(dataStub);
			var a = CUSTOM.findWinningBidAndGenerateTargeting("div1");        
			(a.wb === null).should.equal(true);
			(a.kvp === null).should.equal(true);
			BM.getBid.restore();
			done();
		});

		it("object with wb is set but kvp set to null is returned if winning bid has ecpm 0", function(done){
			winningBidStub = BID.createBid("pubmatic", "div_1");
			winningBidStub.setStatus(1);
			winningBidStub.setGrossEcpm(0);
			winningBidStub.setDealID("deal-id");
			winningBidStub.setAdHtml("Hello World!");
			winningBidStub.setWidth(728);
			winningBidStub.setHeight(90);
			keyValuePairsStub = null;
			dataStub = {
				wb: winningBidStub,
				kvp: keyValuePairsStub
			};
			sinon.stub(BM, "getBid").returns(dataStub);
			var a = CUSTOM.findWinningBidAndGenerateTargeting("div1");
			a.wb.adHtml.should.equal(winningBidStub.getAdHtml());
			a.wb.adapterID.should.equal(winningBidStub.getAdapterID());
			a.wb.width.should.equal(winningBidStub.getWidth());
			a.wb.height.should.equal(winningBidStub.getHeight());
			a.wb.grossEcpm.should.equal(winningBidStub.getGrossEcpm());
			a.wb.netEcpm.should.equal(winningBidStub.getNetEcpm());
			(a.kvp === null).should.equal(true);
			BM.getBid.restore();
			done();
		});
	});

	describe("#customServerExposedAPI", function () {
		it("is a function", function(done) {
			CUSTOM.customServerExposedAPI.should.be.a("function");
			done();
		});

		it("should call callback if first array is not array", function(done){
			var flag = false;
			var myCallback = function(){
				flag = true;
			};
			CUSTOM.customServerExposedAPI("", myCallback);
			setTimeout(function(){
				flag.should.equal(true);
				done();
			}, 10);
		});

		it("should not alter array in the first argument if callback function is not passed", function(done){
			var firstArg = [ {a:1}, {a:10}];
			CUSTOM.customServerExposedAPI(firstArg);
			firstArg.should.equal(firstArg);
			done();
		});

		it("it should call addpter-manager", function(done){
			sinon.stub(PREBID, 'fetchBids', function(){});
			sinon.stub(CONFIG, "getTimeout");
			sinon.stub(CONFIG, "getLoggerTimeoutDuration").returns(2000);
			CONFIG.getTimeout.returns(10);
			var flag = false;
			CUSTOM.customServerExposedAPI([{
				code: "some-pub-friendly-unique-name",
				divId: "div-id-where-slot-will-render",
				adUnitId: "ad_unit-id-from-DFP",
				adUnitIndex: "ad-unit-index",
				mediaTypes: {
					banner: {
						sizes: [ [300, 250], [300, 300] ]
					}
				}
			}], function(){
				flag = true;
			});
			
			setTimeout(function(){
				PREBID.fetchBids.restore();
				CONFIG.getTimeout.restore();
				flag.should.equal(true);
				CONFIG.getLoggerTimeoutDuration.restore();
				done();
			}, 200);
		});

		it("should call the callback postimeout if allBid status is false everytime",function(done){
			sinon.stub(BM,"getAllPartnersBidStatuses").returns(false);
			sinon.stub(PREBID, 'fetchBids', function(){});
			sinon.stub(CONFIG, "getTimeout");
			sinon.stub(CONFIG, "getLoggerTimeoutDuration").returns(2000);
			CONFIG.getTimeout.returns(10);
			BM.getAllPartnersBidStatuses.restore();
			var flag = false;
			CUSTOM.customServerExposedAPI([{
				code: "some-pub-friendly-unique-name",
				divId: "div-id-where-slot-will-render",
				adUnitId: "ad_unit-id-from-DFP",
				adUnitIndex: "ad-unit-index",
				mediaTypes: {
					banner: {
						sizes: [ [300, 250], [300, 300] ]
					}
				}
			}], function(){
				flag = true;
			});
			setTimeout(function(){
				flag.should.equal(true);
				PREBID.fetchBids.restore();
				CONFIG.getTimeout.restore();
				CONFIG.getLoggerTimeoutDuration.restore();
				done();
			}, 200);
		});

		// Uncomment below test case when change from Phantom to ChromeHeadless
		xit("should not call the callback before timeout if allBid status is false ecverytime",function(done){
			sinon.stub(BM,"getAllPartnersBidStatuses").returns(false);
			sinon.stub(PREBID, 'fetchBids', function(){});
			sinon.stub(CONFIG, "getTimeout");
			CONFIG.getTimeout.returns(60);
			BM.getAllPartnersBidStatuses.restore();
			var flag = false;
			CUSTOM.customServerExposedAPI([{
				code: "some-pub-friendly-unique-name",
				divId: "div-id-where-slot-will-render",
				adUnitId: "ad_unit-id-from-DFP",
				adUnitIndex: "ad-unit-index",
				mediaTypes: {
					banner: {
						sizes: [ [300, 250], [300, 300] ]
					}
				}
			}], function(){
				flag = true;
			});
			setTimeout(function(){
				flag.should.equal(false);
				PREBID.fetchBids.restore();
				CONFIG.getTimeout.restore();
				done();
			}, 5);
		});

	});

	describe("#generateConfForGPT", function () {
		it("is a function", function(done) {
			CUSTOM.generateConfForGPT.should.be.a("function");
			done();
		});

		it("return empty array if first argument is not an array", function(done){
			CUSTOM.generateConfForGPT().should.deep.equal([]);
			done();
		});

		it("correct config should be generated", function(done){
			var googleSlot1 = {
				getAdUnitPath: function(){
					return "1234";
				},
				getSlotId: function(){
					return {
						getDomId: function(){
							return "div_1";
						},
						getAdUnitPath: function(){
							return "1234";
						},
						getId: function(){
							return "1234_0";
						}
					};
				},
				getSizes: function(){
					return [
						{
							getWidth: function(){
								return 728;
							},
							getHeight: function(){
								return 90;
							}
						}
					];
				}
			};
			var googleSlot2 = {
				getAdUnitPath: function(){
					return "9876";
				},
				getSlotId: function(){
					return {
						getDomId: function(){
							return "div_2";
						},
						getAdUnitPath: function(){
							return "9876";
						},
						getId: function(){
							return "9876_0";
						}
					};
				},
				getSizes: function(){
					return [
						{
							getWidth: function(){
								return 300;
							},
							getHeight: function(){
								return 250;
							}
						}
					];
				}
			};

			var op = CUSTOM.generateConfForGPT([googleSlot1, googleSlot2]);		
			op[0].should.deep.equal({
				code: googleSlot1.getSlotId().getDomId(),
				divId: googleSlot1.getSlotId().getDomId(),
				adUnitId: googleSlot1.getAdUnitPath(),
				adUnitIndex: "0",
				mediaTypes: {
					banner: {
						sizes: [[728, 90]]
					}
				},
				sizes:[[728, 90]]
			});
			op[1].should.deep.equal({
				code: googleSlot2.getSlotId().getDomId(),
				divId: googleSlot2.getSlotId().getDomId(),
				adUnitId: googleSlot2.getAdUnitPath(),
				adUnitIndex: "0",
				mediaTypes: {
					banner: {
						sizes: [[300, 250]]
					}
				},
				sizes: [[300, 250]]
			});
			done();
		});
	});

	describe("#addKeyValuePairsToGPTSlots", function () {
		it("is a function", function(done) {
			CUSTOM.addKeyValuePairsToGPTSlots.should.be.a("function");
			done();
		});

		it("should add passed key-value pairs on respective GPT slots", function(done){

			var currentGoogleSlotStub_1 = {
				keyValuePairs: {
					"k1": "v1",
					"k2": "v2",
					"pk1": "pv1",
					"pk2": "pv2",
				},
				getTargetingKeys: function() {
					return Object.keys(this.keyValuePairs);
				},
				getTargeting: function(key) {
					return this.keyValuePairs[key];
				},
				clearTargeting: function() {
					this.keyValuePairs = {};
				},
				setTargeting: function(key, value) {
					return this.keyValuePairs[key] = value;
				},
				getSlotId: function () {
					return {
						getDomId: function () {
							return "DIV_1";
						}
					};
				},
				getAdUnitPath: function () {
					return "getAdUnitPath";
				},
				setSizes: function () {
					return "setSizes";
				}
			};

			var currentGoogleSlotStub_2 = {
				keyValuePairs: {
					"k11": "v11",
					"k22": "v22",
					"pk11": "pv11",
					"pk22": "pv22",
				},
				getTargetingKeys: function() {
					return Object.keys(this.keyValuePairs);
				},
				getTargeting: function(key) {
					return this.keyValuePairs[key];
				},
				clearTargeting: function() {
					this.keyValuePairs = {};
				},
				setTargeting: function(key, value) {
					return this.keyValuePairs[key] = value;
				},
				getSlotId: function () {
					return {
						getDomId: function () {
							return "DIV_2";
						}
					};
				},
				getAdUnitPath: function () {
					return "getAdUnitPath";
				},
				setSizes: function () {
					return "setSizes";
				}
			};

			window.googletag = {
				pubads: function(){
					return {
						getSlots: function(){
							return [currentGoogleSlotStub_1, currentGoogleSlotStub_2];
						}
					};
				}
			};

			CUSTOM.addKeyValuePairsToGPTSlots([
				{
					divId: "DIV_1",
					bidData: {
						wb: {}, 
						kvp: {
							pwtsid: "12345"
						}
					}
				},
				{
					divId: "DIV_2",
					bidData: {
						wb: {}, 
						kvp: {
							pwtsid: "98765"
						}
					}
				},
			]);
			currentGoogleSlotStub_1.keyValuePairs["pwtsid"].should.deep.equal(["12345"]);
			currentGoogleSlotStub_2.keyValuePairs["pwtsid"].should.deep.equal(["98765"]);
			done();
		});
	});

	describe("#removeKeyValuePairsFromGPTSlots", function () {
		it("is a function", function(done) {
			CUSTOM.removeKeyValuePairsFromGPTSlots.should.be.a("function");
			done();
		});

		it("remove the wrappre targetings", function(done){

			var currentGoogleSlotStub_1 = {
				keyValuePairs: {
					"k1": "v1",
					"k2": "v2",
					"pk1": "pv1",
					"pk2": "pv2",
					"pwtsid": "1234"
				},
				getTargetingKeys: function() {
					return Object.keys(this.keyValuePairs);
				},
				getTargeting: function(key) {
					return this.keyValuePairs[key];
				},
				clearTargeting: function() {
					this.keyValuePairs = {};
				},
				setTargeting: function(key, value) {
					return this.keyValuePairs[key] = value;
				},
				getSlotId: function () {
					return "slot_1";
				},
				getAdUnitPath: function () {
					return "getAdUnitPath";
				},
				setSizes: function () {
					return "setSizes";
				}
			};

			var currentGoogleSlotStub_2 = {
				keyValuePairs: {
					"k11": "v11",
					"k22": "v22",
					"pk11": "pv11",
					"pk22": "pv22",
					"pwtsid": "9876"
				},
				getTargetingKeys: function() {
					return Object.keys(this.keyValuePairs);
				},
				getTargeting: function(key) {
					return this.keyValuePairs[key];
				},
				clearTargeting: function() {
					this.keyValuePairs = {};
				},
				setTargeting: function(key, value) {
					return this.keyValuePairs[key] = value;
				},
				getSlotId: function () {
					return {
						getDomId: function () {
							return "DIV_2";
						}
					};
				},
				getAdUnitPath: function () {
					return "getAdUnitPath";
				},
				setSizes: function () {
					return "setSizes";
				}
			};
			(currentGoogleSlotStub_1.keyValuePairs["pwtsid"] === "1234").should.equal(true);
			(currentGoogleSlotStub_2.keyValuePairs["pwtsid"] === "9876").should.equal(true);
			CUSTOM.removeKeyValuePairsFromGPTSlots([currentGoogleSlotStub_1, currentGoogleSlotStub_2]);
			(currentGoogleSlotStub_1.keyValuePairs["pwtsid"] === undefined).should.equal(true);
			(currentGoogleSlotStub_2.keyValuePairs["pwtsid"] === undefined).should.equal(true);
			done();
		});
	});

	describe("#init", function() {

		var input = null;

		beforeEach(function (done) {
			sinon.spy(UTIL, "isObject");
			sinon.spy(CUSTOM, "setWindowReference");
			sinon.spy(CUSTOM, "defineWrapperTargetingKeys");
			sinon.spy(CUSTOM, "initSafeFrameListener");
			done();
		});

		afterEach(function (done) {
			UTIL.isObject.restore();
			CUSTOM.setWindowReference.restore();
			CUSTOM.defineWrapperTargetingKeys.restore();
			CUSTOM.initSafeFrameListener.restore();
			done();
		});

		it("is a function", function(done) {
			CUSTOM.init.should.be.a("function");
			done();
		});

		it("should return false when window object is null", function(done) {
			CUSTOM.init(input).should.equal(false);
			done();
		});

		it("should have called respective internal functions ", function(done) {
			window.PWT = {};
			CUSTOM.init(window).should.equal(true);
			UTIL.isObject.called.should.be.true;
			UTIL.isObject.returned(true).should.to.be.true;
			CUSTOM.setWindowReference.called.should.be.true;
			CUSTOM.defineWrapperTargetingKeys.called.should.be.true;
			done();
		});

		it("should not proceed if passed window object is invalid", function (done) {
			CUSTOM.init("NonObject").should.be.false;
			UTIL.isObject.called.should.be.true;
			UTIL.isObject.returned(false).should.be.true;
			UTIL.isObject.calledWith("NonObject").should.be.true;
			CUSTOM.setWindowReference.called.should.be.false;
			CUSTOM.defineWrapperTargetingKeys.called.should.be.false;
			done();
		});
	});
});
