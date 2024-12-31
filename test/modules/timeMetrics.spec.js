const timeMetrics = require('../../src_new/modules/timeMetrics.js');

describe('TimeMetrics: ', function() {
    // Setup and teardown
    beforeEach(function(done) {
      done(); 
    });
  
    afterEach(function(done) {
      done();
    });
  
    // Test recordEntryTime
    describe('#recordEntryTime', function() {
      beforeEach(function(done) {
        sinon.stub(Date.prototype, 'getTime').returns(100);
        done();
      });
  
      afterEach(function(done) {
        Date.prototype.getTime.restore();
        done();
      });
  
      it('should record entry time for single key', function(done) {
        timeMetrics.recordEntryTime('testKey');
        expect(timeMetrics.getMetricsObject()['testKey'].st).to.equal(100);
        done(); 
      });
  
      it('should record entry time for multiple keys', function(done) {
        timeMetrics.recordEntryTime(['key1', 'key2']);
        expect(timeMetrics.getMetricsObject()['key1'].st).to.equal(100);
        expect(timeMetrics.getMetricsObject()['key2'].st).to.equal(100);
        done();
      });
    });
  
    // Test recordExitTime
    describe('#recordExitTime', function() {
      beforeEach(function(done) {
        sinon.stub(Date.prototype, 'getTime').returns(200);
        done();
      });
  
      afterEach(function(done) {
        Date.prototype.getTime.restore();
        done();
      });
  
      it('should record exit time and calculate total time', function(done) {
        timeMetrics.getMetricsObject()['testKey'] = {
          st: 100,
          et: null,
          tt: null
        };
        timeMetrics.recordExitTime('testKey');
        expect(timeMetrics.getMetricsObject()['testKey'].et).to.equal(200);
        expect(timeMetrics.getMetricsObject()['testKey'].tt).to.equal(100);
        done();
      });
  
      it('should update total time with defaultTotalTime if provided', function(done) {
        const defaultTotalTime = 500;
        timeMetrics.getMetricsObject()['testKey'] = {
          st: 100,
          et: null,
          tt: null
        };
        timeMetrics.recordExitTime('testKey', defaultTotalTime);
        expect(timeMetrics.getMetricsObject()['testKey'].tt).to.equal(defaultTotalTime);
        expect(timeMetrics.getMetricsObject()['testKey'].et).to.be.null;
        done();
      });
    });
  });