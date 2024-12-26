var UTIL = require("../src_new/common.util.js");
var CONFIG = require("../src_new/config.js");
var expect = require("chai").expect;

describe('COMMON UTIL', function() {

    describe('#getGeoInfo', function() {
        var pbNameSpace;
        
        beforeEach(function(done) {
            // Mock the namespace based on identity only flag
            pbNameSpace = "owpbjs"; // or "ihowpbjs" based on identity flag
            window[pbNameSpace] = {
                getDataFromLocalStorage: function() {},
                detectLocation: function() {},
                setAndStringifyToLocalStorage: function() {}
            };
            done();
        });

        afterEach(function(done) {
            window[pbNameSpace] = undefined;
            done();
        });

        it('should fetch geo data from localStorage if valid data exists', function(done) {
            var mockGeoData = {
                cc: "US"
            };
            sinon.stub(window[pbNameSpace], 'getDataFromLocalStorage').returns(JSON.stringify(mockGeoData));
            
            UTIL.getGeoInfo();
            expect(window.PWT.CC).to.deep.equal(mockGeoData);
            window[pbNameSpace].getDataFromLocalStorage.restore();
            done();
        });

        it('should fetch geo data from API if localStorage data is invalid', function(done) {
            sinon.stub(window[pbNameSpace], 'getDataFromLocalStorage').returns(null);
            sinon.stub(window[pbNameSpace], 'detectLocation').returns({ cc: "US" });
            
            UTIL.getGeoInfo();
            expect(window.PWT.CC).to.deep.equal({cc: "US"});
            
            window[pbNameSpace].getDataFromLocalStorage.restore();
            window[pbNameSpace].detectLocation.restore();
            done();
        });
    });

    describe('#shouldThrottle', function() {
        beforeEach(function(done) {
            sinon.stub(Math, 'random');
            sinon.stub(Math, 'floor');
            done();
        });
    
        afterEach(function(done) {
            Math.random.restore();
            Math.floor.restore();
            done();
        });
    
        it('is a function', function(done) {
            UTIL.shouldThrottle.should.be.a('function');
            done();
        });
    
        it('should return true when random value is greater than throttle rate', function(done) {
            Math.random.returns(0.9);
            Math.floor.returns(90);
            UTIL.shouldThrottle(80).should.be.true;
            done();
        });
    
        it('should return false when random value is less than throttle rate', function(done) {
            Math.random.returns(0.5);
            Math.floor.returns(50);
            UTIL.shouldThrottle(80).should.be.false;
            done();
        });
    
        it('should use default maxRandomValue when not provided', function(done) {
            Math.random.returns(0.5);
            Math.floor.returns(50);
            UTIL.shouldThrottle(30);
            Math.random.calledOnce.should.be.true;
            Math.floor.calledWith(50).should.be.true;
            done();
        });
    
        it('should use provided maxRandomValue', function(done) {
            Math.random.returns(0.5);
            Math.floor.returns(25);
            UTIL.shouldThrottle(30, 50);
            Math.random.calledOnce.should.be.true;
            Math.floor.calledWith(25).should.be.true;
            done();
        });
    });
});