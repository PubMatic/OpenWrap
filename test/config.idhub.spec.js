var CONF = require("../src_new/conf.js");
var CONSTANTS = require("../src_new/constants.js");
var CONFIG = require("../src_new/config.idhub.js");


describe('CONFIG IDHUB FILE', function () {
    describe('#getGdpr', function () {
        it('is a function', function (done) {
            CONFIG.getGdpr.should.be.a('function');
            done();
        });

        it('should return true, as it is set to "1"', function (done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT] = "1";
            CONFIG.getGdpr().should.be.true;
            done();
        });

        it('should return default value for gdpr which is ' + (CONSTANTS.CONFIG.DEFAULT_GDPR_CONSENT === "1") + ', as it is NOT set', function (done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CONSENT];
            CONFIG.getGdpr().should.be.equal((CONSTANTS.CONFIG.DEFAULT_GDPR_CONSENT === "1"));
            done();
        });
    });

    describe('#getCmpApi', function () {
        it('is a function', function (done) {
            CONFIG.getCmpApi.should.be.a('function');
            done();
        });

        it('should return iab, as it is set to iab', function (done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CMPAPI] = 'iab';
            CONFIG.getCmpApi().should.be.equal('iab');
            done();
        });

        it('should return default cpm which is ' + CONSTANTS.CONFIG.DEFAULT_GDPR_CMPAPI + ', as it is NOT set', function (done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_CMPAPI];
            CONFIG.getCmpApi().should.be.equal(CONSTANTS.CONFIG.DEFAULT_GDPR_CMPAPI);
            done();
        });
    });

    describe('#getGdprTimeout', function () {
        it('is a function', function (done) {
            CONFIG.getGdprTimeout.should.be.a('function');
            done();
        });

        it('should return 5000, as it is set to 5000', function (done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_TIMEOUT] = 5000;
            CONFIG.getGdprTimeout().should.be.equal(5000);
            done();
        });

        it('should return default value for gdpr timeout which is ' + CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT + ', as it is NOT set', function (done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_TIMEOUT];
            CONFIG.getGdprTimeout().should.be.equal(CONSTANTS.CONFIG.DEFAULT_GDPR_TIMEOUT);
            done();
        });
    });

    describe('#getAwc', function () {
        it('is a function', function (done) {
            CONFIG.getAwc.should.be.a('function');
            done();
        });

        it('should return 1, as it is set to 1', function (done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_AWC] = "1";
            CONFIG.getAwc().should.be.true;
            done();
        });

        it('should return default value which is ' + (CONSTANTS.CONFIG.DEFAULT_GDPR_AWC === "0") + ', as it is NOT set', function (done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_AWC];
            CONFIG.getAwc().should.be.equal((CONSTANTS.CONFIG.DEFAULT_GDPR_AWC === "1"));
            done();
        });
    });

    describe('#isUserIdModuleEnabled',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID];
            done();
        })
        it('is a function', function(done) {
            CONFIG.isUserIdModuleEnabled.should.be.a('function');
            done();
        });

        it('should return 1 by reading from config', function(done) {
            var expectedResult = 1;
            CONFIG.isUserIdModuleEnabled().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return 0 if isUserIdModuleEnabled is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.ENABLE_USER_ID];
            expect(CONFIG.isUserIdModuleEnabled()).to.equal(0);
            done();
        });
    });

    describe('#isIdentityOnly',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY];
            done();
        })
        it('is a function', function(done) {
            CONFIG.isIdentityOnly.should.be.a('function');
            done();
        });

        it('should return 1 by reading from config', function(done) {
            var expectedResult = 1;
            CONFIG.isIdentityOnly().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return 0 if isIdentityOnly is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY];
            expect(CONFIG.isIdentityOnly()).to.equal(0);
            done();
        });

        it('should return 0 if isIdentityOnly set to "0"', function(done) {
            var expectedResult = 0;
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_ONLY] = "0";
            CONFIG.isIdentityOnly().should.be.deep.equal(expectedResult);
            done();
        });
    });

    describe('#getIdentityPartners',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS] = {
                pubCommonId: {
                    name: "pubCommonId",
                    "storage.type": "cookie",
                    "storage.name": "_pubCommonId", 
                    "storage.expires": "1825"               
                },
                digitrust: {
                    "name":"digitrust",
                    "params.init.member": "nQjyizbdyF",
                    "params.init.site":"FL6whbX1IW",
                    "redirects": "true",
                    "storage.type": "cookie",
                    "storage.name": "somenamevalue",
                    "storage.expires":"60"
                }
            };
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS];
            done();
        })
        it('is a function', function(done) {
            CONFIG.getIdentityPartners.should.be.a('function');
            done();
        });

        it('should return expected config by reading from config', function(done) {
            var expectedResult = {
                pubCommonId: {
                    name: "pubCommonId",
                    "storage.type": "cookie",
                    "storage.name": "_pubCommonId", 
                    "storage.expires": "1825"               
                },
                digitrust: {
                    "name":"digitrust",
                    "params.init.member": "nQjyizbdyF",
                    "params.init.site":"FL6whbX1IW",
                    "redirects": "true",
                    "storage.type": "cookie",
                    "storage.name": "somenamevalue",
                    "storage.expires":"60"
                }
            };
            CONFIG.getIdentityPartners().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return undefined if identityPartners is not present',function(done){
            delete CONF[CONSTANTS.COMMON.IDENTITY_PARTNERS];
            expect(CONFIG.getIdentityPartners()).to.be.undefined;
            done();
        });
    });

    describe('#getIdentityConsumers',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS] = "EB,TAM,Prebid";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS];
            done();
        })
        it('is a function', function(done) {
            CONFIG.getIdentityConsumers.should.be.a('function');
            done();
        });

        it('should return "eb,tam,prebid" by reading from config', function(done) {
            var expectedResult = "eb,tam,prebid";
            CONFIG.getIdentityConsumers().should.be.deep.equal(expectedResult);
            done();
        });

        it('should return "" if isIdentityOnly is not present',function(done){
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.COMMON.IDENTITY_CONSUMERS];
            expect(CONFIG.getIdentityConsumers()).to.be.equal("");
            done();
        });
    });


    describe('#getCCPA', function() {
        it('is a function', function(done) {
            CONFIG.getCCPA.should.be.a('function');
            done();
        });

        it('should return true, as it is set to "1"', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT] = "1";
            CONFIG.getCCPA().should.be.true;
            done();
        });

        it('should return default value for ccpa which is '+(CONSTANTS.CONFIG.DEFAULT_CCPA_CONSENT === "1")+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CONSENT];
            CONFIG.getCCPA().should.be.equal((CONSTANTS.CONFIG.DEFAULT_CCPA_CONSENT === "1"));
            done();
        });
    });

    describe('#getCCPACmpApi', function() {
        it('is a function', function(done) {
            CONFIG.getCCPACmpApi.should.be.a('function');
            done();
        });

        it('should return iab, as it is set to iab', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CMPAPI] = 'iab';
            CONFIG.getCCPACmpApi().should.be.equal('iab');
            done();
        });

        it('should return default cpm which is '+CONSTANTS.CONFIG.DEFAULT_CCPA_CMPAPI+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_CMPAPI];
            CONFIG.getCCPACmpApi().should.be.equal(CONSTANTS.CONFIG.DEFAULT_CCPA_CMPAPI);
            done();
        });
    });

    describe('#getCCPATimeout', function() {
	it("is a function", function(done) {
            CONFIG.getCCPATimeout.should.be.a('function');
            done();
        });

        it('should return 5000, as it is set to 5000', function(done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_TIMEOUT] = 5000;
            CONFIG.getCCPATimeout().should.be.equal(5000);
            done();
        });

        it('should return default value for ccpa timeout which is '+CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT+', as it is NOT set', function(done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.CCPA_TIMEOUT];
            CONFIG.getCCPATimeout().should.be.equal(CONSTANTS.CONFIG.DEFAULT_CCPA_TIMEOUT);
	done();
        });
    });

    describe('#getProfileID', function() {

        beforeEach(function(done) {
            done();
        });

        afterEach(function(done) {
            done();
        });


        it('is a function', function(done) {
            CONFIG.getProfileID.should.be.a('function');
            done();
        });

        it('should return profile id', function(done) {
            CONFIG.getProfileID().should.be.equal(CONF.pwt.pid);
            done();
        });

        it('should return zero when profile id is not present in conf', function(done) {
            delete CONF.pwt.pid;
            CONFIG.getProfileID().should.be.equal("0");
            done();
        });
    });

    describe('#getProfileDisplayVersionID', function() {
        beforeEach(function(done) {
            done();
        });

        afterEach(function(done) {
            done();
        });

        it('is a function', function(done) {
            CONFIG.getProfileDisplayVersionID.should.be.a('function');
            done();
        });

        it('should return trimmed Profile Display Version ID', function(done) {
            CONFIG.getProfileDisplayVersionID().should.be.equal(CONF.pwt.pdvid);
            done();
        });

        it('should return zero when Profile Display Version ID is not present in conf', function(done) {
            delete CONF.pwt.pdvid;
            CONFIG.getProfileDisplayVersionID().should.be.equal("0");
            done();
        });
    });

    describe('#isSSOEnabled',function(){
        beforeEach(function(done){
            CONF[CONSTANTS.CONFIG.SSO_ENABLED] = "1";
            done();
        });

        afterEach(function(done){
            delete CONF[CONSTANTS.CONFIG.SSO_ENABLED];
            done();
        })

        it('Should returned true if SSO ENABLED IS CONFIGURED AS 1 in CONF.PWT ',function(){
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.SSO_ENABLED] = 1;
            CONFIG.isSSOEnabled().should.be.true
        })
    });
});
