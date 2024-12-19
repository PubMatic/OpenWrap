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
});