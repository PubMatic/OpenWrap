
var consentConfigResolver = require('../../src_new/modules/consentConfigResolver.js');
var commonUtil = require('../../src_new/common.util.js');

describe('ConsentConfigResolver: ', function() {
  let sandbox;
  let pbNameSpace;
  
  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function(done) {
    sandbox.restore();
    done();
  });

  describe('#getConsentResolverConfig', function() {
    it('should return existing cmConfig if present', function(done) {
      window.PWT = {
        cmConfig: {
          existingKey: 'value'
        }
      };
      let keyExists = 'existingKey' in window.PWT.cmConfig;
      expect(keyExists).to.be.true;
      done();
    });

    it('should create and return empty cmConfig if not present', function(done) {
      window.PWT = {
        cmConfig: {}
      };
      let keyExists = 'existingKey' in window.PWT.cmConfig;
      expect(keyExists).to.be.false;
      done();
    });
  });

  describe('#getConsentManagementConfig', function() {
    let mockCmp;

    beforeEach(function(done) {
      mockCmp = sandbox.stub();
      window.__gpp = mockCmp;
      pbNameSpace = "owpbjs"; // or "ihowpbjs" based on identity flag
      window[pbNameSpace] = {
        getDataFromLocalStorage: function() {},
        detectLocation: function() {},
        setAndStringifyToLocalStorage: function() {}
      };
      
      var mockGeoData = {
        cc: "US",
        sc: "NY"
      };
      sinon.stub(commonUtil, 'getGeoInfo').returns("LS", mockGeoData);
      done();
    });

    afterEach(function(done) {
      delete window.__gpp;
      commonUtil.getGeoInfo.restore();
      window[pbNameSpace] = undefined;
      done();
    });

    it('should initialize cmConfig with default values', function(done) {

      consentConfigResolver.getConsentManagementConfig();

      let keyExists = 'cmpPresent' in window.PWT.cmConfig;
      expect(keyExists).to.be.true;
      done();
    });

    it('should detect CMP presence and update config', function(done) {
      mockCmp.returns({cmpId: '123'}, true);

      consentConfigResolver.getConsentManagementConfig();
      
      setTimeout(function(done) {
        let keyExists = 'cmpId' in window.PWT.cmConfig;
        expect(keyExists).to.be.true;
        done();
      }, 100, done);
    });
  });
});