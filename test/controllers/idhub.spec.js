/* global describe, it, sinon, beforeEach, afterEach */
// var sinon = require("sinon");
// var should = require("chai").should();
// var expect = require("chai").expect;
var CONF = require("../../src_new/conf.js");
var CONFIG = require("../../src_new/config.idhub.js");
var CONSTANTS = require("../../src_new/constants.js");
CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID] = "1";
CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] = "1";
CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SSO_ENABLED] = "1";
CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ADSERVER] = "IDHUB";
var pbNameSpace = CONFIG.isIdentityOnly() ? CONSTANTS.COMMON.IH_NAMESPACE : CONSTANTS.COMMON.PREBID_NAMESPACE;

var IDHUB = require("../../src_new/controllers/idhub.js");
var UTIL = require("../../src_new/util.js");
var CONFIG = require("../../src_new/config.js");

describe("CONTROLLER: IDHUB", function() {
	describe("#init", function() {

		beforeEach(function(done) {
			sinon.spy(UTIL, "isObject");
			sinon.spy(IDHUB, "initIdHub");
			done();
		});

		afterEach(function(done) {
			UTIL.isObject.restore();
			IDHUB.initIdHub.restore();
			done();
		});

		it("should return false when window object is null", function(done) {
			IDHUB.init(null).should.equal(false);
			done();
		});

		// it("should have called respective internal functions ", function(done) {
		// 	IDHUB.init(window).should.equal(true);
		// 	UTIL.isObject.called.should.be.true;
		// 	UTIL.isObject.returned(true).should.to.be.true;
		// 	IDHUB.initIdHub.called.should.be.true;
		// 	done();
		// });

		// it("should not proceed if passed window object is invalid", function (done) {
		// 	IDHUB.init("NonObject").should.be.false;
		// 	UTIL.isObject.called.should.be.true;
		// 	UTIL.isObject.returned(false).should.be.true;
		// 	UTIL.isObject.calledWith("NonObject").should.be.true;
		// 	IDHUB.initIdHub.called.should.be.false;
	
		// 	done();
		// });
	});
    
	describe("#initIdHub", function(){
		beforeEach(function(done){
			window.IHPWT = {};
			window.IHPWT.ssoEnabled = CONFIG.isSSOEnabled;
			window[pbNameSpace] = {
				'setConfig': function(){},
				'onSSOLogin': function onSSOLogin() {},
				'requestBids': function(){},
			}
			done();
		});

		afterEach(function(done){
			delete window.pbjs;
			done();
		});

		it("should not call prebid setConfig if identity is enabled and setConfig is not defined in window namespace object",function(done){
			window[pbNameSpace].setConfig = {};
			window['pbjs'] = {
				'que': [],
				'version': 'v2.18.0',
				onEvent: function(){}
			}
			utilMethod = sinon.spy(window[pbNameSpace], 'requestBids');
			sinon.stub(CONFIG, 'isSSOEnabled').returns(0);
			console.log(CONF.pwt)
			IDHUB.init(window);
			window['pbjs'].que[0]();
			utilMethod.should.not.be.called;
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SSO_ENABLED] = "1";
			CONFIG.isSSOEnabled.restore();
			done();
		});

		it("should call prebid setConfig if identity is enabled and CCPA is enabled",function(done){
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] = "0";
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] = "1";
			window['pbjs'] = {
				'que': [],
				'version': 'v2.18.0',
				onEvent: function(){}
			}
			utilMethod = sinon.spy(UTIL, 'addHookOnFunction');
			IDHUB.init(window);
			window['pbjs'].que[0]();
			utilMethod.should.have.been.called
			UTIL.addHookOnFunction.restore();	
			done();
		});

		it("should call prebid setConfig if identity is enabled and GDPR is enabled",function(done){
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] = "1";
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] = "0";
			window['pbjs'] = {
				'que': [],
				'version': 'v6.18.0',
				onEvent: function(){}
			}
			utilMethod = sinon.spy(UTIL, 'addHookOnFunction');
			IDHUB.init(window);
			window['pbjs'].que[0]();
			utilMethod.should.have.been.called
			UTIL.addHookOnFunction.restore();
			done();
		});

		it("should call prebid setConfig if identity is enabled and CCPA is enabled and version is higher than 3" ,function(done){
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] = "0";
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] = "1";
			window['pbjs'] = {
				'que': [],
				'version': 'v6.18.0',
				onEvent: function(){}
		    }	
			utilMethod = sinon.spy(window['pbjs'], 'onEvent');
			IDHUB.init(window);
			window['pbjs'].que[0]();
			utilMethod.should.have.been.calledTwice;
			window.pbjs.onEvent.restore()
			done();
		});
		
		it("should not call prebid setConfig and logs warning if windows pbjs object is not set" ,function(done){
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] = "0";
			CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] = "1";
			IDHUB.init(window);
			utilMethod = sinon.spy(UTIL, 'logWarning');
			utilMethod.should.have.been.called;
			done();
		});
	});
});
