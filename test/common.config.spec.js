var CONF = require("../src_new/conf.js");
var CONSTANTS = require("../src_new/constants.js");
var COMMON_CONFIG = require("../src_new/common.config.js");
var expect = require("chai").expect;

describe('COMMON CONFIG FILE', function () {  
    describe('#getGdprActionTimeout', function () {
        it('is a function', function (done) {
            COMMON_CONFIG.getGdprActionTimeout.should.be.a('function');
            done();
        });

        it('should return 5000, as it is set to 5000 when getGdprActionTimeout is called', function (done) {
            CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT] = 5000;
            COMMON_CONFIG.getGdprActionTimeout().should.be.equal(5000);
            done();
        });

        it('should return default value for gdpr action timeout which is 0, as it is NOT set', function (done) {
            delete CONF[CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.GDPR_ACTION_TIMEOUT];
            COMMON_CONFIG.getGdprActionTimeout().should.be.equal(0);
            done();
        });
    });

    describe('setConsentConfig function', function () {
        var prebidConfig = {};
        var cmpApi = 'iab';
        var timeout = 2000;

        it('setConsentConfig a function', function (done) {
            COMMON_CONFIG.setConsentConfig.should.be.a('function');
            done();
        });

        it('should set consent management config  when its not present', function (done) {
            var expPrebidConfig = {
                consentManagement: {
                    gpp: {
                        cmpApi,
                        timeout
                    }
                }
            };
            const actPrebifConfig = COMMON_CONFIG.setConsentConfig(prebidConfig, 'gpp', cmpApi, timeout);
            expect(actPrebifConfig).to.be.deep.equal(expPrebidConfig);
            done();
        });

        it('should set consent management config  when its present', function (done) {
            var prebidConfig = {
                consentManagement: {
                    gdpr: {
                        cmpApi,
                        timeout
                    }
                }
            }
            var expPrebidConfig = {
                consentManagement: {
                    gdpr: {
                        cmpApi,
                        timeout
                    },
                    gpp: {
                        cmpApi,
                        timeout
                    }
                }
            };
            const actPrebifConfig = COMMON_CONFIG.setConsentConfig(prebidConfig, 'gpp', cmpApi, timeout);
            expect(actPrebifConfig).to.be.deep.equal(expPrebidConfig);
            done();
        });
    });
});

