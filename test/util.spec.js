
var should = require('chai').should();

describe('util', function() {
  describe('#utilHasOwnProperty()', function() {
    it('should return true when the key is present', function() {
      utilHasOwnProperty({a:1}, 'a').should.equal(true);
    });
  });
});

/*
var should = require('chai').should();

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});
*/