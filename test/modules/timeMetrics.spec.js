const timeMetrics = require('../../src_new/modules/timeMetrics.js');

describe('TimeMetrics: ', function() {
    let metrics;

    beforeEach(function(done) {
        window.PWT = {
            metrics: {}
        };
        done();
    });

    afterEach(function(done) {
        window.PWT = undefined;
        done();
    });

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
            expect(window.PWT.metrics['testKey'].st).to.equal(100);
            done();
        });

        it('should record entry time for multiple keys', function(done) {
            timeMetrics.recordEntryTime(['key1', 'key2']);
            expect(window.PWT.metrics['key1'].st).to.equal(100);
            expect(window.PWT.metrics['key2'].st).to.equal(100);
            done();
        });
    });

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
            window.PWT.metrics['testKey'] = {
                st: 100,
                et: null,
                tt: null
            };
            timeMetrics.recordExitTime('testKey');
            expect(window.PWT.metrics['testKey'].et).to.equal(200);
            expect(window.PWT.metrics['testKey'].tt).to.equal(100);
            done();
        });

        it('should handle multiple keys', function(done) {
          window.PWT.metrics = {
            key1: { st: 1000, et: null, tt: null },
            key2: { st: 2000, et: null, tt: null }
          }
      
          timeMetrics.recordExitTime(['key1', 'key2']);
      
          expect(window.PWT.metrics['key1'].et).to.equal(clock.now);
          expect(window.PWT.metrics['key1'].tt).to.equal(clock.now - window.PWT.metrics['key1'].st);
      
          expect(window.PWT.metrics['key2'].et).to.equal(clock.now);
          expect(window.PWT.metrics['key2'].tt).to.equal(clock.now - window.PWT.metrics['key2'].st);
          done();
        });

        it('should update total time with defaultTotalTime if provided', function(done) {
          const defaultTotalTime = 500;
          window.PWT.metrics['testKey'] = { st: 1000, et: null, tt: null };
      
          timeMetrics.recordExitTime('testKey', defaultTotalTime);
      
          expect(window.PWT.metrics['testKey'].tt).to.equal(defaultTotalTime);
          expect(window.PWT.metrics['testKey'].et).to.be.null; 
          done();
        });
    });
});