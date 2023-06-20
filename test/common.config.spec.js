var CONF = require("../src_new/conf.js");
var CONSTANTS = require("../src_new/constants.js");
var COMMON_CONFIG = require("../src_new/common.config.js");

describe.only('COMMON CONFIG FILE', function () {  
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
});