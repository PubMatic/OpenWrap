var util = require('../src_new/util');
var assert = require('assert');


describe('Util', function() {
    var obj_function = function() {};
    describe('isFunction', function() {
        it('isFunction checks whether passed object is function or not', function(done) {
            var output = util.isFunction(obj_function);
            assert.deepEqual(output, true);
            done();
        });
    });

    /* start-test-block */
    describe('isA', function () {
        it('isA checks whether passed entity is object or now', function (done) {
            var output = util.isFunction(obj_function);
            assert.deepEqual(output, true);
            done();
        });
    });
    /* end-test-block */
});


/* start-test-block */

var lorem = "lorem  ipsum";

/* end-test-block */