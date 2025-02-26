/* global describe, it, xit, sinon, expect */
var should = require("chai").should();
var expect = require("chai").expect;

var ConsentConfigResolver = require('../../src_new/modules/consentConfigResolver.js');
var COMMON_CONFIG = require("../../src_new/common.config.js");
var commonUtil = require("../../src_new/common.util.js");
var timeMetrics = require("../../src_new/modules/timeMetrics.js");

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
        //sandbox.stub(commonUtil, 'getGeoInfo');
        sandbox.stub(commonUtil, 'isNumber');
        //sandbox.stub(commonUtil, 'getGlobalOwObject');
        //sandbox.stub(commonUtil, 'getKeyByValue');
        
        // Stub time metrics
        sandbox.stub(timeMetrics, 'recordEntryTime');
        sandbox.stub(timeMetrics, 'recordExitTime');
        
        // Stub common config
        //sandbox.stub(COMMON_CONFIG, 'consentManagentEnabled');
        // sandbox.stub(COMMON_CONFIG, 'getCmpApi');
        // sandbox.stub(COMMON_CONFIG, 'getTimeout');

        var mockGeoData = {
          cc: 'US',
          sc: 'NY',
          gc: 1
        };

        var geoInfoSpy = sandbox.spy(function(source, callback) {
          callback('LS', mockGeoData);
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

    describe('Singleton Instance', function() {       
        it('is a singleton', function(done) {
            var instance1 = ConsentConfigResolver.getInstance();
            var instance2 = ConsentConfigResolver.getInstance();
            expect(instance1).to.equal(instance2);
            done();
        });

        it('initializes with default values', function(done) {
            var instance = ConsentConfigResolver.getInstance();
            expect(instance.getConsentManagementEnabled()).to.be.false;
            expect(instance.getComplianceSupport()).to.be.an('array').that.is.empty;
            expect(instance.getPrebidCMConfig()).to.be.an('object').that.is.empty;
            done();
        });
    });

    describe('Configuration Management', function() {
        let crConfig;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            done();
        });

        afterEach(function(done) {
            crConfig.reset();            
            done();
        });

        it('should set and get consent management enabled status', function(done) {
            crConfig.setConsentManagementEnabled(true);
            expect(crConfig.getConsentManagementEnabled()).to.be.true;
            
            crConfig.setConsentManagementEnabled(false);
            expect(crConfig.getConsentManagementEnabled()).to.be.false;
            done();
        });

        it('should set and get CMP presence', function(done) {
            crConfig.setCmpPresent(1);
            expect(crConfig.getProperties().ccmp).to.equal(1);
            
            crConfig.setCmpPresent(null);
            expect(crConfig.getProperties().ccmp).to.equal(0);
            done();
        });

        it('should set and get CMP ID', function(done) {
            crConfig.setCmpId(123);
            expect(crConfig.getProperties().ccmpid).to.equal(123);
            
            crConfig.setCmpId(null);
            expect(crConfig.getProperties().ccmpid).to.equal(0);
            done();
        });

        it('should handle compliance support', function(done) {
            crConfig.setComplianceSupport(1);
            expect(crConfig.getComplianceSupport()).to.include(1);
            
            crConfig.setComplianceSupport(2);
            expect(crConfig.getComplianceSupport()).to.include(2);
            done();
        });

        it('should set and get geo information', function(done) {
            var geoInfo = {
                cc: 'US',
                sc: 'CA',
                gc: 1,
                gsId: 'test123'
            };
            
            crConfig.setGeoInfo('LS', geoInfo);
            expect(crConfig.getProperties().csc).to.equal('CA');
            expect(crConfig.getProperties().crgdf).to.equal('LS');
            done();
        });

        it('should handle geo match with CMP', function(done) {
            crConfig.setComplianceSupport(1); // GDPR
            crConfig.setGeoInfo('LS', {
                cc: 'US',
                sc: 'CA',
                gc: 1
            });
            
            expect(crConfig.getProperties().cgm).to.equal(1); // Should match
            done();
        });
    });

    describe('CMP Detection', function() {
        let crConfig;
        let consentManagementEnabled;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            consentManagementEnabled = sandbox.stub(COMMON_CONFIG, 'consentManagentEnabled');
            consentManagementEnabled.returns(true);                       
            done();
        });

        afterEach(function(done) {
          crConfig.reset();
          done();
       });

        it('should detect GDPR CMP', function(done) {            
            window.__tcfapi = function(cmd, version, cb) {
                cb({ cmpId: 123 }, true);
            };
            
            ConsentConfigResolver.getConsentManagementConfig(function(){});
            
            //setTimeout(function() {
                expect(crConfig.getProperties().ccmp).to.equal(1);
                expect(crConfig.getProperties().ccmpid).to.equal(123);
                expect(crConfig.getComplianceSupport()).to.include(1);
                done();
            //}, 100);
        });

        it('should detect USP CMP', function(done) {
            window.__uspapi = function(cmd, version, cb) {
                cb({ uspString: '1YNN' }, true);
            };
            
            ConsentConfigResolver.getConsentManagementConfig(function(){});
            
            //setTimeout(function() {
                expect(crConfig.getProperties().ccmp).to.equal(1);
                expect(crConfig.getComplianceSupport()).to.include(2);
                done();
            //}, 100);
        });

        it('should detect GPP CMP', function(done) {
            window.__gpp = function(cmd, cb) {
                cb({ pingData: { cmpId: 456 } }, true);
            };
            
            ConsentConfigResolver.getConsentManagementConfig(function(){});
            
            // setTimeout(function() {
                expect(crConfig.getProperties().ccmp).to.equal(1);
                expect(crConfig.getProperties().ccmpid).to.equal(456);
                expect(crConfig.getComplianceSupport()).to.include(3);
                done();
            // }, 100);
        });
    });

    describe('Geo Information Handling', function() {
        let crConfig;
        //let getGeoInfo;

        beforeEach(function(done) {
            crConfig = ConsentConfigResolver.getInstance();
            //getGeoInfo = sandbox.stub(commonUtil, 'getGeoInfo');
            var mockGeoData = {
              cc: 'US',
              sc: 'NY',
              gc: 1
            };

            var geoInfoSpy = sandbox.spy(function(source, callback) {
              callback('LS', mockGeoData);
            });
            
            commonUtil.getGeoInfo = geoInfoSpy;
            done();
        });

        afterEach(function(done) {
          crConfig.reset();
          done();
        });

        it('should set geo information from service', function(done) {            
            
            ConsentConfigResolver.getGeoInfoWrapper();
                        
            expect(crConfig.getProperties().csc).to.equal('NY');
            expect(crConfig.getProperties().crgdf).to.equal('LS');
            done();
        });

        it('should record geo timing metrics', function(done) {
            ConsentConfigResolver.getGeoInfoWrapper();          

            expect(timeMetrics.recordEntryTime.calledWith('GEO_CALLING_TIME', 1500)).to.be.true;
            expect(timeMetrics.recordExitTime.calledWith('GEO_CALLING_TIME')).to.be.true;
            done();
        });
    });

    describe('Consent Management Config', function() {
        let callback;
        let consentManagementEnabled;
        let getGlobalOwObject;
        let getKeyByValue;        
        beforeEach(function(done) {
            callback = sandbox.spy();
            consentManagementEnabled = sandbox.stub(COMMON_CONFIG, 'consentManagentEnabled');
            getGlobalOwObject = sandbox.stub(commonUtil, 'getGlobalOwObject');        
            getKeyByValue = sandbox.stub(commonUtil, 'getKeyByValue');
            done();
        });

        it('should handle disabled consent management', function(done) {
            consentManagementEnabled.returns(false);
            ConsentConfigResolver.getConsentManagementConfig(callback);            
            expect(ConsentConfigResolver.getInstance().getConsentManagementEnabled()).to.be.false;
            expect(callback.calledOnce).to.be.true;            
            done();
        });

        it('should handle CMP timeout', function(done) {
            consentManagementEnabled.returns(true);
            commonUtil.isNumber.returns(true);
            getGlobalOwObject.returns({
                cmpLookUpTimeout: 50,
                CC: { gc: 1 },
                getDurationOf: function() {
                    return false;
                }
            });                  
            
            ConsentConfigResolver.getConsentManagementConfig(callback);            
            
            setTimeout(function() {                
                expect(timeMetrics.recordExitTime.calledWith('CMP_CALLING_TIME', 1500)).to.be.true;
                done();
            }, 100);
        });

    });
 
});