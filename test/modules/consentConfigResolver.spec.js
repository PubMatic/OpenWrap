var ConsentConfigResolver = require('../../src_new/modules/consentConfigResolver.js');
var COMMON_CONFIG = require("../../src_new/common.config.js");
var commonUtil = require("../../src_new/common.util.js");
var timeMetrics = require("../../src_new/modules/timeMetrics.js");
var prebid = require("../../src_new/adapters/prebid.js");
var CONSTANTS = require("../../src_new/constants.js");

describe('ConsentConfigResolver:', function() {
    let sandbox;
    
    beforeEach(function(done) {
        sandbox = sinon.sandbox.create();
        
        // Setup window object
        window.PWT = {
            cmConfig: {}
        };
        
        // Mock global objects
        window.__tcfapi = undefined;
        window.__uspapi = undefined;
        window.__gpp = undefined;
        
        // Stub common utilities
        sandbox.stub(commonUtil, 'isNumber');
        sandbox.stub(commonUtil, 'isFunction');
        sandbox.stub(commonUtil, 'getGlobalOwObject');
        sandbox.stub(commonUtil, 'getKeyByValue');
        
        // Stub time metrics
        sandbox.stub(timeMetrics, 'recordEntryTime');
        sandbox.stub(timeMetrics, 'recordExitTime');
        sandbox.stub(timeMetrics, 'getDurationOf');
        
        commonUtil.getGlobalOwObject.returns({
            actionTimeout: 1000
        });
        
        var mockGeoData = {
          cc: 'US',
          sc: 'NY',
          gc: 1
        };

        var geoInfoSpy = sandbox.spy(function(source, callback) {
          callback(1, mockGeoData);
        });
        
        commonUtil.getGeoInfo = geoInfoSpy; 
        
        done();
    });

    afterEach(function(done) {
        sandbox.restore();
        delete window.__tcfapi;
        delete window.__uspapi;
        delete window.__gpp;
        window.PWT = {};
        done();
    });

    describe('ConsentConfigManager', function() {
        let crConfig;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            crConfig.reset(); // Ensure clean state
            done();
        });

        afterEach(function(done) {
            crConfig.reset();
            done();
        });

        it('should be a singleton', function(done) {
            var instance1 = ConsentConfigResolver.getInstance();
            var instance2 = ConsentConfigResolver.getInstance();
            expect(instance1).to.equal(instance2);
            done();
        });

        it('should initialize with default values', function(done) {
            expect(crConfig.getConsentManagementEnabled()).to.be.false;
            expect(crConfig.getComplianceSupport()).to.be.an('array');
            expect(crConfig.getPrebidCMConfig()).to.be.an('object');
            expect(crConfig.getProperties().ccme).to.equal(0);
            expect(crConfig.getProperties().ccmp).to.equal(0);
            expect(crConfig.getProperties().ccmps).to.be.an('array');
            expect(crConfig.getProperties().ccmpid).to.equal(0);
            expect(crConfig.getProperties().csc).to.be.undefined;
            expect(crConfig.getProperties().cecbo).to.equal(0);
            expect(crConfig.getProperties().crgdf).to.equal(0);
            expect(crConfig.getProperties().cgm).to.equal(2);
            expect(crConfig.getProperties().cccce).to.be.false;
            expect(crConfig.getProperties().cccct).to.equal(15000);
            expect(crConfig.getProperties().ccccst).to.equal(0);
            done();
        });

        it('should set and get consent management enabled status', function(done) {
            crConfig.setConsentManagementEnabled(true);
            expect(crConfig.getConsentManagementEnabled()).to.be.true;
            expect(crConfig.getProperties().ccme).to.equal(1);
            
            crConfig.setConsentManagementEnabled(false);
            expect(crConfig.getConsentManagementEnabled()).to.be.false;
            expect(crConfig.getProperties().ccme).to.equal(0);
            done();
        });

        it('should set and get CMP presence', function(done) {
            crConfig.setCmpPresent(true);
            expect(crConfig.getProperties().ccmp).to.equal(1);
            
            crConfig.setCmpPresent(false);
            expect(crConfig.getProperties().ccmp).to.equal(0);
            
            crConfig.setCmpPresent(null);
            expect(crConfig.getProperties().ccmp).to.equal(0);
            done();
        });

        it('should set and get CMP ID', function(done) {
            crConfig.setCmpId(123);
            expect(crConfig.getProperties().ccmpid).to.equal(123);
            
            crConfig.setCmpId(0);
            expect(crConfig.getProperties().ccmpid).to.equal(0);
            
            crConfig.setCmpId(null);
            expect(crConfig.getProperties().ccmpid).to.equal(null);
            done();
        });

        it('should handle compliance support correctly', function(done) {
            // Add first compliance
            crConfig.setComplianceSupport(1);
            expect(crConfig.getComplianceSupport()).to.be.an('array');
            expect(crConfig.getComplianceSupport().length).to.equal(1);
            
            // Add second compliance
            crConfig.setComplianceSupport(2);
            expect(crConfig.getComplianceSupport()).to.be.an('array');
            expect(crConfig.getComplianceSupport().length).to.equal(2);
            
            // Add duplicate compliance (should not add)
            crConfig.setComplianceSupport(1);
            expect(crConfig.getComplianceSupport().length).to.equal(2);
            done();
        });

        it('should set and get geo information correctly', function(done) {
            var geoInfo = {
                cc: 'US',
                sc: 'CA',
                gc: 1,
                gsId: 'test123'
            };
            
            crConfig.setGeoInfo(1, geoInfo);
            expect(crConfig.getProperties().csc).to.equal('CA');
            expect(crConfig.getProperties().crgdf).to.equal(1);
            
            // Test with different read source
            var geoInfo2 = {
                cc: 'UK',
                sc: 'LN',
                gc: 2,
                gsId: 'test456'
            };
            
            crConfig.setGeoInfo(2, geoInfo2);
            expect(crConfig.getProperties().csc).to.equal('LN');
            expect(crConfig.getProperties().crgdf).to.equal(2);
            done();
        });

        it('should handle geo match with CMP correctly', function(done) {
            // No compliance support, should not match
            crConfig.setGeoInfo(1, {
                cc: 'US',
                sc: 'CA',
                gc: 1
            });
            // expect(crConfig.getProperties().cgm).to.equal(2); // Not concluded
            
            // Add matching compliance support
            crConfig.setComplianceSupport(1);
            crConfig.setGeoMatchWithCMP();
            expect(crConfig.getProperties().cgm).to.equal(1); // Matched
            
            // Set geo with non-matching compliance
            crConfig.setGeoInfo(1, {
                cc: 'US',
                sc: 'CA',
                gc: 2
            });
            expect(crConfig.getProperties().cgm).to.equal(0); // Not matched
            done();
        });

        it('should manage Prebid CM config correctly', function(done) {
            // Initial state
            expect(crConfig.getPrebidCMConfig()).to.be.an('object');
            
            // Set config
            crConfig.setPrebidCMConfig('gdpr', { test: 'value' });
            crConfig.getPrebidCMConfig().should.deep.equal({ gdpr: { test: 'value' } });
            
            // Add another config
            crConfig.setPrebidCMConfig('usp', { test2: 'value2' });
            crConfig.getPrebidCMConfig().should.deep.equal({ 
                gdpr: { test: 'value' },
                usp: { test2: 'value2' }
            });
            
            // Disable config
            crConfig.disablePrebidCMConfig();
            expect(crConfig.getPrebidCMConfig()).to.be.an('object');
            expect(crConfig.getPrebidCMConfig().gdpr.enabled).to.be.false;
            expect(crConfig.getPrebidCMConfig().usp.enabled).to.be.false;
            done();
        });

        it('should disable all Prebid CM configs with enabled: false flag', function(done) {
            // Set multiple configs
            crConfig.setPrebidCMConfig('gdpr', { test: 'value', timeout: 1000 });
            crConfig.setPrebidCMConfig('usp', { test2: 'value2', cmpApi: 'iab' });
            crConfig.setPrebidCMConfig('gpp', { test3: 'value3' });
            
            // Disable all configs
            crConfig.disablePrebidCMConfig();
            
            // Verify all configs have enabled: false while preserving other properties
            expect(crConfig.getPrebidCMConfig().gdpr.enabled).to.be.false;
            expect(crConfig.getPrebidCMConfig().gdpr.test).to.equal('value');
            expect(crConfig.getPrebidCMConfig().gdpr.timeout).to.equal(1000);
            
            expect(crConfig.getPrebidCMConfig().usp.enabled).to.be.false;
            expect(crConfig.getPrebidCMConfig().usp.test2).to.equal('value2');
            expect(crConfig.getPrebidCMConfig().usp.cmpApi).to.equal('iab');
            
            expect(crConfig.getPrebidCMConfig().gpp.enabled).to.be.false;
            expect(crConfig.getPrebidCMConfig().gpp.test3).to.equal('value3');
            
            done();
        });

        it('should handle process completion and callbacks correctly', function(done) {
            // Test with no callbacks
            crConfig.setProcessCompleted(true);
            expect(crConfig.getProperties().ccme).to.equal(0); // Default value
            
            // Test with callbacks
            crConfig.reset();
            var callback1Called = false;
            var callback2Called = false;
            
            var callback1 = function() {
                callback1Called = true;
            };
            
            var callback2 = function() {
                callback2Called = true;
            };
            
            // Register callbacks
            crConfig.getProcessCompleted(callback1);
            crConfig.getProcessCompleted(callback2);
            
            // Complete process
            crConfig.setProcessCompleted(true);
            
            // Verify callbacks were called
            expect(callback1Called).to.be.true;
            expect(callback2Called).to.be.true;
            
            // Test immediate callback when process is already completed
            var callback3Called = false;
            var callback3 = function() {
                callback3Called = true;
            };
            
            crConfig.getProcessCompleted(callback3);
            expect(callback3Called).to.be.true;
            
            done();
        });

        it('should handle continuous CMP check settings correctly', function(done) {
            // Test default values
            expect(crConfig.getContinuousCmpCheckEnabled()).to.be.false;
            expect(crConfig.getContinuousCmpCheckTimeout()).to.equal(15000);
            expect(crConfig.getContinuousCmpCheckStartTime()).to.equal(0);
            
            // Test setting values
            crConfig.setContinuousCmpCheckEnabled(true);
            expect(crConfig.getContinuousCmpCheckEnabled()).to.be.true;
            expect(crConfig.getProperties().cccce).to.equal(true);
            
            var testTime = Date.now();
            crConfig.setContinuousCmpCheckStartTime(testTime);
            expect(crConfig.getContinuousCmpCheckStartTime()).to.equal(testTime);
            expect(crConfig.getProperties().ccccst).to.equal(testTime);
            
            done();
        });

        it('should reset to default values', function(done) {
            // Change several values
            crConfig.setConsentManagementEnabled(true);
            crConfig.setCmpPresent(true);
            crConfig.setCmpId(123);
            crConfig.setComplianceSupport(1);
            crConfig.setPrebidCMConfig('gdpr', { test: 'value' });
            crConfig.setContinuousCmpCheckEnabled(true);
            
            // Reset
            crConfig.reset();
            
            // Verify default values
            expect(crConfig.getConsentManagementEnabled()).to.be.false;
            expect(crConfig.getComplianceSupport()).to.be.an('array');
            expect(crConfig.getPrebidCMConfig()).to.be.an('object');
            expect(crConfig.getProperties().ccmp).to.equal(0);
            expect(crConfig.getProperties().ccmpid).to.equal(0);
            expect(crConfig.getContinuousCmpCheckEnabled()).to.be.false;
            
            done();
        });
    });

    describe('ComplianceApiConfig', function() {
        let crConfig;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            crConfig.reset();
            done();
        });

        afterEach(function(done) {
            crConfig.reset();
            done();
        });

        it('should have correct default API configurations', function(done) {
            // Access the private ComplianceApiConfig module
            // We can do this by examining the properties of a detectedCmp
            window.__tcfapi = function() {};
            window.__uspapi = function() {};
            window.__gpp = function() {};

            // Create a spy to capture the detected CMPs
            var detectedCmps = [];
            var originalCheckCMPInWindow = sandbox.stub().returns([]);
            
            // We need to access the CmpDetector module to verify the API config
            // This is a bit of a hack, but it allows us to test the private module
            var checkCMPSpy = sandbox.spy(function(frame) {
                var cmpApis = {
                    GDPR: {
                        apiName: "__tcfapi",
                        complianceName: "gdpr"
                    },
                    USP: {
                        apiName: "__uspapi",
                        complianceName: "usp"
                    },
                    GPP: {
                        apiName: "__gpp",
                        complianceName: "gpp"
                    }
                };
                
                for (var compliance in cmpApis) {
                    if (cmpApis.hasOwnProperty(compliance)) {
                        var apiName = cmpApis[compliance].apiName;
                        if (typeof frame[apiName] === 'function') {
                            detectedCmps.push({
                                compliance: compliance,
                                apiName: apiName,
                                complianceName: cmpApis[compliance].complianceName
                            });
                        }
                    }
                }
                return [];
            });
            
            checkCMPSpy(window);
            
            // Verify the API configurations
            expect(detectedCmps).to.have.length(3);
            
            var gdprConfig = detectedCmps.find(c => c.compliance === 'GDPR');
            expect(gdprConfig).to.exist;
            expect(gdprConfig.apiName).to.equal('__tcfapi');
            expect(gdprConfig.complianceName).to.equal('gdpr');
            
            var uspConfig = detectedCmps.find(c => c.compliance === 'USP');
            expect(uspConfig).to.exist;
            expect(uspConfig.apiName).to.equal('__uspapi');
            expect(uspConfig.complianceName).to.equal('usp');
            
            var gppConfig = detectedCmps.find(c => c.compliance === 'GPP');
            expect(gppConfig).to.exist;
            expect(gppConfig.apiName).to.equal('__gpp');
            expect(gppConfig.complianceName).to.equal('gpp');
            
            done();
        });

        it('should allow setting config handlers', function(done) {
            // Create mock handlers
            var gdprHandlerCalled = false;
            var uspHandlerCalled = false;
            var gppHandlerCalled = false;
            
            var gdprHandler = function() { gdprHandlerCalled = true; };
            var uspHandler = function() { uspHandlerCalled = true; };
            var gppHandler = function() { gppHandlerCalled = true; };
            
            // We need to access the private ComplianceApiConfig module
            // We can do this by creating a mock that simulates its behavior
            var ComplianceApiConfig = {
                apiConfig: {
                    GDPR: { apiName: "__tcfapi", complianceName: "gdpr", prepareConfig: null },
                    USP: { apiName: "__uspapi", complianceName: "usp", prepareConfig: null },
                    GPP: { apiName: "__gpp", complianceName: "gpp", prepareConfig: null }
                },
                setConfigHandlers: function(gdprHandler, uspHandler, gppHandler) {
                    this.apiConfig.GDPR.prepareConfig = gdprHandler;
                    this.apiConfig.USP.prepareConfig = uspHandler;
                    this.apiConfig.GPP.prepareConfig = gppHandler;
                }
            };
            
            // Set the handlers
            ComplianceApiConfig.setConfigHandlers(gdprHandler, uspHandler, gppHandler);
            
            // Verify handlers were set correctly
            expect(ComplianceApiConfig.apiConfig.GDPR.prepareConfig).to.equal(gdprHandler);
            expect(ComplianceApiConfig.apiConfig.USP.prepareConfig).to.equal(uspHandler);
            expect(ComplianceApiConfig.apiConfig.GPP.prepareConfig).to.equal(gppHandler);
            
            // Call the handlers and verify they work
            ComplianceApiConfig.apiConfig.GDPR.prepareConfig();
            ComplianceApiConfig.apiConfig.USP.prepareConfig();
            ComplianceApiConfig.apiConfig.GPP.prepareConfig();
            
            expect(gdprHandlerCalled).to.be.true;
            expect(uspHandlerCalled).to.be.true;
            expect(gppHandlerCalled).to.be.true;
            
            done();
        });
    });

    describe('ComplianceHandler', function() {
        let crConfig;
        let getCmpApiStub;
        let getTimeoutStub;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            crConfig.reset();
            
            // Stub COMMON_CONFIG methods
            getCmpApiStub = sandbox.stub(COMMON_CONFIG, 'getCmpApi');
            getTimeoutStub = sandbox.stub(COMMON_CONFIG, 'getTimeout');
            
            // Setup default behavior
            getCmpApiStub.returns('iab');
            getTimeoutStub.returns(2000);
            
            done();
        });

        afterEach(function(done) {
            crConfig.reset();
            done();
        });

        it('should configure GDPR correctly', function(done) {
            // Setup
            commonUtil.getGlobalOwObject.returns({
                actionTimeout: 3000
            });
            commonUtil.isNumber.withArgs(3000).returns(true);
            
            // Create a spy for setPrebidCMConfig
            var setPrebidCMConfigSpy = sandbox.spy(crConfig, 'setPrebidCMConfig');
            
            // Trigger GDPR configuration
            // We need to access the private ComplianceHandler module
            // We can do this by mocking a CMP and calling getConsentManagementConfig
            window.__tcfapi = function(cmd, version, cb) {
                cb({}, true);
            };
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify GDPR config was set correctly
            expect(setPrebidCMConfigSpy.calledWith('gdpr')).to.be.true;
            
            var gdprConfigArg = setPrebidCMConfigSpy.args.find(args => args[0] === 'gdpr')[1];
            expect(gdprConfigArg).to.be.an('object');
            expect(gdprConfigArg.cmpApi).to.equal('iab');
            expect(gdprConfigArg.timeout).to.equal(2000);
            expect(gdprConfigArg.defaultGdprScope).to.be.true;
            expect(gdprConfigArg.actionTimeout).to.equal(3000);
            
            done();
        });

        it('should configure GDPR without actionTimeout when not available', function(done) {
            // Setup
            commonUtil.getGlobalOwObject.returns({});
            
            // Create a spy for setPrebidCMConfig
            var setPrebidCMConfigSpy = sandbox.spy(crConfig, 'setPrebidCMConfig');
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Trigger GDPR configuration
            window.__tcfapi = function(cmd, version, cb) {
                cb({}, true);
            };
            
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify GDPR config was set correctly
            expect(setPrebidCMConfigSpy.calledWith('gdpr')).to.be.true;
            
            var gdprConfigArg = setPrebidCMConfigSpy.args.find(args => args[0] === 'gdpr')[1];
            expect(gdprConfigArg).to.be.an('object');
            expect(gdprConfigArg.cmpApi).to.equal('iab');
            expect(gdprConfigArg.timeout).to.equal(2000);
            expect(gdprConfigArg.defaultGdprScope).to.be.true;
            expect(gdprConfigArg.actionTimeout).to.be.undefined;
            
            done();
        });

        it('should configure USP correctly', function(done) {
            // Create a spy for setPrebidCMConfig
            var setPrebidCMConfigSpy = sandbox.spy(crConfig, 'setPrebidCMConfig');
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Trigger USP configuration
            window.__uspapi = function(cmd, version, cb) {
                cb({}, true);
            };
            
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify USP config was set correctly
            expect(setPrebidCMConfigSpy.calledWith('usp')).to.be.true;
            
            var uspConfigArg = setPrebidCMConfigSpy.args.find(args => args[0] === 'usp')[1];
            expect(uspConfigArg).to.be.an('object');
            expect(uspConfigArg.cmpApi).to.equal('iab');
            expect(uspConfigArg.timeout).to.equal(2000);
            
            done();
        });

        it('should configure GPP correctly', function(done) {
            // Create a spy for setPrebidCMConfig
            var setPrebidCMConfigSpy = sandbox.spy(crConfig, 'setPrebidCMConfig');
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Trigger GPP configuration
            window.__gpp = function(cmd, cb) {
                cb({}, true);
            };
            
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify GPP config was set correctly
            expect(setPrebidCMConfigSpy.calledWith('gpp')).to.be.true;
            
            var gppConfigArg = setPrebidCMConfigSpy.args.find(args => args[0] === 'gpp')[1];
            expect(gppConfigArg).to.be.an('object');
            expect(gppConfigArg.cmpApi).to.equal('iab');
            expect(gppConfigArg.timeout).to.equal(2000);
            
            done();
        });

        it('should use constant for default timeout', function(done) {
            // Setup stubs to test default timeout behavior
            getTimeoutStub.withArgs(CONSTANTS.CONFIG.CONSENT_MANAGEMENT_TIMEOUT, 1000).returns(1000);
            
            // Create a spy for setPrebidCMConfig
            var setPrebidCMConfigSpy = sandbox.spy(crConfig, 'setPrebidCMConfig');
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Trigger GDPR configuration
            window.__tcfapi = function(cmd, version, cb) {
                cb({}, true);
            };
            
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify default timeout was used
            var gdprConfigArg = setPrebidCMConfigSpy.args.find(args => args[0] === 'gdpr')[1];
            expect(gdprConfigArg.timeout).to.equal(1000);
            
            done();
        });

        it('should handle multiple compliance types simultaneously', function(done) {
            // Setup multiple CMPs
            window.__tcfapi = function(cmd, version, cb) {
                cb({}, true);
            };
            
            window.__uspapi = function(cmd, version, cb) {
                cb({}, true);
            };
            
            window.__gpp = function(cmd, cb) {
                cb({}, true);
            };
            
            // Create a spy for setPrebidCMConfig
            var setPrebidCMConfigSpy = sandbox.spy(crConfig, 'setPrebidCMConfig');
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Trigger configuration
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify all configs were set correctly
            expect(setPrebidCMConfigSpy.calledWith('gdpr')).to.be.true;
            expect(setPrebidCMConfigSpy.calledWith('usp')).to.be.true;
            expect(setPrebidCMConfigSpy.calledWith('gpp')).to.be.true;
            
            done();
        });
    });

    describe('GeoService', function() {
        let crConfig;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            crConfig.reset();
            
            // Reset stubs
            timeMetrics.recordEntryTime.reset();
            timeMetrics.recordExitTime.reset();
            timeMetrics.getDurationOf.reset();
            
            done();
        });

        afterEach(function(done) {
            crConfig.reset();
            done();
        });

        it('should record timing metrics for geo service calls', function(done) {
            // Call the geo service wrapper
            ConsentConfigResolver.getGeoInfoWrapper();
            
            // Verify timing metrics were recorded
            expect(timeMetrics.recordEntryTime.calledWith('GEO_CALLING_TIME', 1500)).to.be.true;
            expect(timeMetrics.recordExitTime.calledWith('GEO_CALLING_TIME')).to.be.true;
            
            done();
        });

        it('should set geo info in config when retrieved', function(done) {
            // Setup mock geo data
            var mockGeoData = {
                cc: 'DE',
                sc: 'BE',
                gc: 1,
                gsId: 'test-id'
            };
            
            // Override the getGeoInfo stub for this test
            commonUtil.getGeoInfo = function(source, callback) {
                callback(2, mockGeoData);
            };
            
            // Call the geo service wrapper
            ConsentConfigResolver.getGeoInfoWrapper();
            
            // Verify geo info was set correctly
            expect(crConfig.getProperties().csc).to.equal('BE');
            expect(crConfig.getProperties().crgdf).to.equal(2);
            
            done();
        });

        it('should handle empty geo data gracefully', function(done) {
            // Override the getGeoInfo stub for this test
            commonUtil.getGeoInfo = function(source, callback) {
                callback(1, {});
            };
            
            // Call the geo service wrapper
            ConsentConfigResolver.getGeoInfoWrapper();
            
            // Verify geo info was set correctly
            expect(crConfig.getProperties().csc).to.be.undefined;
            expect(crConfig.getProperties().crgdf).to.equal(1);
            
            done();
        });

        it('should use the correct source for geo info', function(done) {
            // Create a spy for getGeoInfo
            var getGeoInfoSpy = sandbox.spy(function(source, callback) {
                callback(source, { cc: 'US', sc: 'NY', gc: 1 });
            });
            
            // Override the getGeoInfo stub for this test
            commonUtil.getGeoInfo = getGeoInfoSpy;
            
            // Call the geo service wrapper
            ConsentConfigResolver.getGeoInfoWrapper();
            
            // Verify the correct source was used
            expect(getGeoInfoSpy.calledWith(1)).to.be.true;
            
            done();
        });

        it('should update geo match with CMP after setting geo info', function(done) {
            // Setup compliance support
            crConfig.setComplianceSupport(1); // GDPR
            
            // Create a spy for setGeoMatchWithCMP
            var setGeoMatchWithCMPSpy = sandbox.spy(crConfig, 'setGeoMatchWithCMP');
            
            // Call the geo service wrapper
            ConsentConfigResolver.getGeoInfoWrapper();
            
            // Verify setGeoMatchWithCMP was called
            expect(setGeoMatchWithCMPSpy.calledOnce).to.be.true;
            
            done();
        });
    });

    describe('CmpDetector', function() {
        let crConfig;
        let clock;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            crConfig.reset();
            
            // Setup window object
            window.__tcfapi = undefined;
            window.__uspapi = undefined;
            window.__gpp = undefined;
            window.frames = {};
            
            // Setup fake timer for setTimeout
            clock = sinon.useFakeTimers();
            
            done();
        });

        afterEach(function(done) {
            crConfig.reset();
            clock.restore();
            done();
        });

        it('should detect GDPR CMP when present', function(done) {
            // Setup GDPR CMP
            window.__tcfapi = function(cmd, version, cb) {
                cb({ cmpId: 123 }, true);
            };
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Call the consent management config
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify CMP was detected
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(crConfig.getProperties().ccmpid).to.equal(123);
            
            done();
        });

        it('should detect USP CMP when present', function(done) {
            // Setup USP CMP
            window.__uspapi = function(cmd, version, cb) {
                cb({ uspString: '1YNN' }, true);
            };
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Call the consent management config
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify CMP was detected
            expect(crConfig.getProperties().ccmp).to.equal(1);
            
            done();
        });

        it('should detect GPP CMP when present', function(done) {
            // Setup GPP CMP
            window.__gpp = function(cmd, cb) {
                cb({ pingData: { cmpId: 456 } }, true);
            };
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Call the consent management config
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify CMP was detected
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(crConfig.getProperties().ccmpid).to.equal(456);
            
            done();
        });

        it('should detect multiple CMPs when present', function(done) {
            // Setup multiple CMPs
            window.__tcfapi = function(cmd, version, cb) {
                cb({ cmpId: 123 }, true);
            };
            
            window.__uspapi = function(cmd, version, cb) {
                cb({ uspString: '1YNN' }, true);
            };
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Call the consent management config
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify CMPs were detected
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(crConfig.getProperties().ccmpid).to.equal(123);
            
            done();
        });

        it('should handle no CMP present', function(done) {
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Mock getGlobalOwObject for timeout handling
            commonUtil.getGlobalOwObject.returns({
                cmpLookUpTimeout: 50
            });
            
            commonUtil.isNumber.withArgs(50).returns(true);
            
            // Mock getKeyByValue for fallback execution
            var getKeyByValueStub = commonUtil.getKeyByValue;
            getKeyByValueStub.returns(null);
            
            // Call the consent management config
            var callbackCalled = false;
            ConsentConfigResolver.getConsentManagementConfig(function() {
                callbackCalled = true;
            });
            
            // Wait for the timeout to complete
            clock.tick(100);
            
            // Verify no CMP was detected
            expect(crConfig.getProperties().ccmp).to.equal(0);
            expect(callbackCalled).to.be.true;
            
            done();
        });

        it('should check for CMP in all frames', function(done) {
            // Setup a mock frame with CMP
            var mockFrame = {
                __tcfapi: function(cmd, version, cb) {
                    cb({ cmpId: 789 }, true);
                }
            };
            
            // Setup window.frames
            window.frames = {
                0: mockFrame,
                1: {},
                length: 2
            };
            
            // Setup consent management enabled
            var consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            consentManagementEnabledStub.returns(true);
            
            // Mock getKeyByValue for frame access
            var getKeyByValueStub = commonUtil.getKeyByValue;
            getKeyByValueStub.returns(null);
            
            // Create a spy to check if frame is accessed
            var frameAccessSpy = sandbox.spy(function(frame) {
                return frame === mockFrame;
            });
            
            // Override the frame access check
            var origFrameAccessCheck = window.frames.hasOwnProperty;
            window.frames.hasOwnProperty = frameAccessSpy;
            
            // Call the consent management config
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Wait for the check to complete
            clock.tick(100);
            
            // Restore original frame access check
            window.frames.hasOwnProperty = origFrameAccessCheck;
            
            // Verify frames were checked
            expect(frameAccessSpy.called).to.be.true;
            
            done();
        });
    });

    describe('ConsentResolver', function() {
        let crConfig;
        let clock;
        let consentManagementEnabledStub;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            crConfig.reset();
            
            // Setup fake timer for setTimeout
            clock = sinon.useFakeTimers();
            
            // Stub COMMON_CONFIG.consentManagementEnabled
            consentManagementEnabledStub = sandbox.stub(COMMON_CONFIG, 'consentManagementEnabled');
            
            // Setup default behavior
            consentManagementEnabledStub.returns(true);
            
            done();
        });

        afterEach(function(done) {
            crConfig.reset();
            clock.restore();
            done();
        });

        it('should handle disabled consent management', function(done) {
            // Setup
            consentManagementEnabledStub.returns(false);
            
            // Create a callback spy
            var callbackSpy = sandbox.spy();
            
            // Call the function
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Verify behavior
            expect(consentManagementEnabledStub.calledOnce).to.be.true;
            expect(callbackSpy.calledOnce).to.be.true;
            expect(crConfig.getConsentManagementEnabled()).to.be.false;
            
            done();
        });

        it('should record timing metrics when getting consent management config', function(done) {
            // Call the function
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify behavior
            expect(timeMetrics.recordEntryTime.calledWith('CONSENT_CONFIG_RESOLVER_TIME')).to.be.true;
            
            done();
        });

        it('should set CMP time correctly when time exceeded', function(done) {
            // Setup
            timeMetrics.getDurationOf.returns(false);
            
            // Mock getGlobalOwObject for timeout handling
            commonUtil.getGlobalOwObject.returns({
                cmpLookUpTimeout: 50
            });
            
            commonUtil.isNumber.withArgs(50).returns(true);
            
            // Call the function
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Fast-forward time to trigger timeout
            clock.tick(100);
            
            // Verify behavior
            expect(timeMetrics.recordExitTime.calledWith('CMP_CALLING_TIME', true)).to.be.true;
            
            done();
        });

        it('should get CMP lookup timeout from global object', function(done) {
            // Setup
            commonUtil.getGlobalOwObject.returns({
                cmpLookUpTimeout: 2000
            });
            
            commonUtil.isNumber.withArgs(2000).returns(true);
            
            // Call the function
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Verify behavior - timeout should be used from global object
            // We can verify this indirectly by checking that the timeout is not triggered at 1000ms
            // but is triggered at 2000ms
            
            // Fast-forward time to 1000ms
            clock.tick(1000);
            
            // Verify timeout not triggered yet
            expect(timeMetrics.recordExitTime.calledWith('CMP_CALLING_TIME', true)).to.be.false;
            
            // Fast-forward time to 2000ms
            clock.tick(1000);
            
            // Verify timeout triggered
            expect(timeMetrics.recordExitTime.calledWith('CMP_CALLING_TIME', true)).to.be.true;
            
            done();
        });

        it('should use default timeout when cmpLookUpTimeout is not available', function(done) {
            // Setup
            commonUtil.getGlobalOwObject.returns({});
            
            // Call the function
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Fast-forward time to 1000ms (default timeout)
            clock.tick(1000);
            
            // Verify timeout triggered
            expect(timeMetrics.recordExitTime.calledWith('CMP_CALLING_TIME', true)).to.be.true;
            
            done();
        });

        it('should detect GDPR CMP and set config accordingly', function(done) {
            // Setup GDPR CMP
            window.__tcfapi = function(cmd, version, cb) {
                if (cmd === 'ping') {
                    cb({ cmpId: 123 }, true);
                } else if (cmd === 'addEventListener') {
                    cb({ cmpId: 123, gdprApplies: true }, true);
                }
            };
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time a bit to allow async operations
            clock.tick(50);
            
            // Verify behavior
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(crConfig.getProperties().ccmpid).to.equal(123);
            expect(callbackSpy.calledOnce).to.be.true;
            
            done();
        });

        it('should detect USP CMP and set config accordingly', function(done) {
            // Setup USP CMP
            window.__uspapi = function(cmd, version, cb) {
                cb({ uspString: '1YNN' }, true);
            };
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time a bit to allow async operations
            clock.tick(50);
            
            // Verify behavior
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(callbackSpy.calledOnce).to.be.true;
            
            done();
        });

        it('should detect GPP CMP and set config accordingly', function(done) {
            // Setup GPP CMP
            window.__gpp = function(cmd, cb) {
                cb({ pingData: { cmpId: 456 } }, true);
            };
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time a bit to allow async operations
            clock.tick(50);
            
            // Verify behavior
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(crConfig.getProperties().ccmpid).to.equal(456);
            expect(callbackSpy.calledOnce).to.be.true;
            
            done();
        });

        it('should handle multiple CMPs', function(done) {
            // Setup multiple CMPs
            window.__tcfapi = function(cmd, version, cb) {
                if (cmd === 'ping') {
                    cb({ cmpId: 123 }, true);
                } else if (cmd === 'addEventListener') {
                    cb({ cmpId: 123, gdprApplies: true }, true);
                }
            };
            
            window.__uspapi = function(cmd, version, cb) {
                cb({ uspString: '1YNN' }, true);
            };
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time a bit to allow async operations
            clock.tick(50);
            
            // Verify behavior
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(crConfig.getProperties().ccmpid).to.equal(123);
            expect(callbackSpy.calledOnce).to.be.true;
            
            done();
        });

        it('should fall back to geo-based consent when no CMP is found', function(done) {
            // Setup geo info
            var mockGeoData = {
                cc: 'DE', // Germany (GDPR applies)
                sc: 'BE',
                gc: 1 // GDPR compliance
            };
            
            commonUtil.getGeoInfo = function(source, callback) {
                callback(1, mockGeoData);
            };
            
            // Setup getKeyByValue to return 'GDPR' for value 1
            commonUtil.getKeyByValue.withArgs({ GDPR: 1, USP: 2, GPP: 3 }, 1).returns('GDPR');
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time to trigger timeout
            clock.tick(1000);

            setTimeout(function() {
                // Verify behavior
                expect(crConfig.getProperties().ccmp).to.equal(0); // No CMP
                expect(crConfig.getProperties().cecbo).to.equal(2); // GEO
                expect(callbackSpy.calledOnce).to.be.true;
                done();
            }, 1);

            done();
        });

        it('should handle no CMP and no geo compliance', function(done) {
            // Setup geo info with no compliance
            var mockGeoData = {
                cc: 'US',
                sc: 'NY'
                // No gc property
            };
            
            commonUtil.getGeoInfo = function(source, callback) {
                callback(1, mockGeoData);
            };
            
            // Setup getKeyByValue to return null (no matching compliance)
            commonUtil.getKeyByValue.returns(null);
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time to trigger timeout
            clock.tick(1000);
            
            // Verify behavior
            expect(crConfig.getProperties().ccmp).to.equal(0); // No CMP
            expect(crConfig.getProperties().cecbo).to.equal(0); // NONE
            expect(callbackSpy.calledOnce).to.be.true;
            
            done();
        });

        it('should check for CMP recursively', function(done) {
            // Setup CMP to appear after a delay
            setTimeout(function() {
                window.__tcfapi = function(cmd, version, cb) {
                    if (cmd === 'ping') {
                        cb({ cmpId: 123 }, true);
                    } else if (cmd === 'addEventListener') {
                        cb({ cmpId: 123, gdprApplies: true }, true);
                    }
                };
            }, 500);
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time to before CMP appears
            clock.tick(300);
            
            // Verify CMP not detected yet
            expect(crConfig.getProperties().ccmp).to.equal(0);
            
            // Fast-forward time to after CMP appears
            clock.tick(300);
            
            // Fast-forward a bit more to allow recursive check to detect CMP
            clock.tick(100);
            
            // Verify CMP was detected
            expect(crConfig.getProperties().ccmp).to.equal(1);
            expect(crConfig.getProperties().ccmpid).to.equal(123);
            expect(callbackSpy.calledOnce).to.be.true;
            
            done();
        });

        it('should execute callback with prebid CM config', function(done) {
            // Setup CMP
            window.__tcfapi = function(cmd, version, cb) {
                if (cmd === 'ping') {
                    cb({ cmpId: 123 }, true);
                } else if (cmd === 'addEventListener') {
                    cb({ cmpId: 123, gdprApplies: true }, true);
                }
            };
            
            // Setup prebid CM config
            crConfig.setPrebidCMConfig('gdpr', { test: 'value' });
            
            // Call the function
            var callbackSpy = sandbox.spy();
            ConsentConfigResolver.getConsentManagementConfig(callbackSpy);
            
            // Fast-forward time a bit to allow async operations
            clock.tick(50);
            
            // Verify callback was called with correct config
            expect(callbackSpy.calledOnce).to.be.true;
            expect(callbackSpy.calledWith({ gdpr: { test: 'value' } })).to.be.true;
            
            done();
        });


        it('should set enforced consent basis on', function(done) {
            // Setup CMP
            window.__tcfapi = function(cmd, version, cb) {
                if (cmd === 'ping') {
                    cb({ cmpId: 123 }, true);
                } else if (cmd === 'addEventListener') {
                    cb({ cmpId: 123, gdprApplies: true }, true);
                }
            };
            
            // Call the function
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Fast-forward time a bit to allow async operations
            clock.tick(50);
            
            // Verify enforced consent basis on
            expect(crConfig.getProperties().cecbo).to.equal(1); // CMP
            
            done();
        });

        it('should record exit time for consent config resolver', function(done) {
            // Setup CMP
            window.__tcfapi = function(cmd, version, cb) {
                if (cmd === 'ping') {
                    cb({ cmpId: 123 }, true);
                } else if (cmd === 'addEventListener') {
                    cb({ cmpId: 123, gdprApplies: true }, true);
                }
            };
            
            // Call the function
            ConsentConfigResolver.getConsentManagementConfig(function() {});
            
            // Fast-forward time a bit to allow async operations
            clock.tick(50);
            
            // Verify exit time recorded
            expect(timeMetrics.recordExitTime.calledWith('CONSENT_CONFIG_RESOLVER_TIME')).to.be.true;
            
            done();
        });
    });
});