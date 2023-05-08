/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;
var OWIDHUBCOMMON = require("../src_new/owIdhubCommon");

describe('owIdhubCommon', function() {
  describe('setConsentConfig', function() {
    var prebidConfig = {};
    var cmpApi = 'iab';
    var timeout = 2000;

    it('setConsentConfig a function', function(done) {
      OWIDHUBCOMMON.setConsentConfig.should.be.a('function');
      done();
    });

    it('should set consent management config  when its not present', function(done) {
      var expPrebidConfig = {
        consentManagement: {
          gpp: {
            cmpApi,
            timeout
          }
        }
      };
      const actPrebifConfig = OWIDHUBCOMMON.setConsentConfig(prebidConfig, 'gpp', cmpApi, timeout);
      expect(actPrebifConfig).to.be.deep.equal(expPrebidConfig);
      done();
    });

    it('should set consent management config  when its present', function(done) {
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
      const actPrebifConfig = OWIDHUBCOMMON.setConsentConfig(prebidConfig, 'gpp', cmpApi, timeout);
      expect(actPrebifConfig).to.be.deep.equal(expPrebidConfig);
      done();
    });
  });
});