var GPT = require('../../src_new/controllers/gpt.js');

var should = require('chai').should();

describe('CONTROLLER: GPT', function() {

  describe('#getAdUnitIndex()', function() {

    it('should return 0 when the object passed is null ', function() {
      GPT.getAdUnitIndex(null).should.equal(0);
    });

    it('should return 0 when the object passed is number ', function() {
      GPT.getAdUnitIndex(0).should.equal(0);
    });

    it('should return 0 when the object passed is empty string ', function() {
      GPT.getAdUnitIndex('').should.equal(0);
    });

    it('should return 0 when the object passed is not empty string ', function() {
      GPT.getAdUnitIndex('abcd').should.equal(0);
    });

    it('should return 0 when the object passed does not have required method ', function() {
      GPT.getAdUnitIndex({}).should.equal(0);
    });

    var random = Math.floor(Math.random()*100);
    var test = {
    	getSlotId: function(){
    		return this;
    	},
    	getId: function(){
    		return 'abcd_'+random;
    	}
    };

	it('should return '+random+' when the object passed does have required method ', function() {
      GPT.getAdUnitIndex(test).should.equal(random);
    });

  });


  describe('#defineWrapperTargetingKeys()', function() {


  });


});