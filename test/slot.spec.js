/* global describe, it, xit, sinon, expect */
// var sinon = require("sinon");
var should = require("chai").should();
var expect = require("chai").expect;

var CONSTANTS = require("../src_new/constants.js");
var SLOT = require("../src_new/slot.js").Slot;

var commonSlotName = "Slot_1";
var commonDivID = "DIV_1";
var commonAdUnitID = "ad_unit_id_1";
var commonAdUnitIndex = 2;
var commonSizes = [
    [450, 300],
    [90, 750]
];
var commonArguments = [1, 2, 3];



describe('Slot slotObject', function() {
    var slotObject = null;
    var name = null;

    beforeEach(function(done) {
        name = commonSlotName;
        slotObject = new SLOT(name);
        done();
    });

    afterEach(function(done) {
        slotObject = null;
        done();
    });

    describe('Slot', function() {

        it('is a function', function(done) {
            SLOT.should.be.a('function');
            done();
        });
    });


    describe('#getName', function() {

        it('is a function', function(done) {
            slotObject.getName.should.be.a('function');
            done();
        });

        it('returns slot name', function(done) {
            slotObject.getName().should.equal(slotObject.name);
            done();
        });
    });

    describe('#setStatus', function() {

        it('is a function', function(done) {
            slotObject.setStatus.should.be.a('function');
            done();
        });
    });

    describe('#getStatus', function() {

        it('is a function', function(done) {
            slotObject.getStatus.should.be.a('function');
            done();
        });

        it('returns slot status', function(done) {
            slotObject.getStatus().should.equal(slotObject.status);
            done();
        });
    });

    describe('#setDivID', function() {

        it('is a function', function(done) {
            slotObject.setDivID.should.be.a('function');
            done();
        });
    });

    describe('#getDivID', function() {

        it('is a function', function(done) {
            slotObject.getDivID.should.be.a('function');
            done();
        });

        it('returns slot div Id', function(done) {
            slotObject.setDivID(commonDivID);
            slotObject.getDivID().should.equal(commonDivID);
            done();
        });
    });

    describe('#setAdUnitID', function() {

        it('is a function', function(done) {
            slotObject.setAdUnitID.should.be.a('function');
            done();
        });
    });

    describe('#getAdUnitID', function() {

        it('is a function', function(done) {
            slotObject.getAdUnitID.should.be.a('function');
            done();
        });

        it('returns slot adUnitId', function(done) {
            slotObject.setAdUnitID(commonAdUnitID);
            slotObject.getAdUnitID().should.equal(commonAdUnitID);
            done();
        });
    });

    describe('#setAdUnitIndex', function() {

        it('is a function', function(done) {
            slotObject.setAdUnitIndex.should.be.a('function');
            done();
        });
    });

    describe('#getAdUnitIndex', function() {

        it('is a function', function(done) {
            slotObject.getAdUnitIndex.should.be.a('function');
            done();
        });

        it('returns slot adUnitIndex', function(done) {
            slotObject.setAdUnitIndex(commonAdUnitIndex);
            slotObject.getAdUnitIndex().should.equal(commonAdUnitIndex);
            done();
        });
    });

    describe('#setSizes', function() {

        it('is a function', function(done) {
            slotObject.setSizes.should.be.a('function');
            done();
        });
    });

    describe('#getSizes', function() {

        it('is a function', function(done) {
            slotObject.getSizes.should.be.a('function');
            done();
        });

        it('returns slot sizes', function(done) {
            slotObject.setSizes(commonSizes);
            slotObject.getSizes().should.equal(commonSizes);
            done();
        });
    });

    describe('#setKeyValue', function() {

        it('is a function', function(done) {
            slotObject.setKeyValue.should.be.a('function');
            done();
        });
    });

    describe('#setKeyValues', function() {

        it('is a function', function(done) {
            slotObject.setKeyValues.should.be.a('function');
            done();
        });
    });

    describe('#getkeyValues', function() {

        it('is a function', function(done) {
            slotObject.getkeyValues.should.be.a('function');
            done();
        });

        // TODO : ?
        it('returns slot\'s keyValues', function(done) {
            slotObject.keyValues.should.deep.equal({});
            var key = "key_1";
            var value = "value_1";
            var keyValPair = {

            };
            keyValPair[key] = value;
            slotObject.setKeyValues([keyValPair]).should.deep.equal(slotObject);
            slotObject.keyValues[0][key].should.equal(value);
            done();
        });
    });

    describe('#setArguments', function() {

        it('is a function', function(done) {
            slotObject.setArguments.should.be.a('function');
            done();
        });
    });

    describe('#getArguments', function() {

        it('is a function', function(done) {
            slotObject.getArguments.should.be.a('function');
            done();
        });


        it('returns slot arguments', function(done) {
            slotObject.setArguments(commonArguments);
            slotObject.getArguments().should.equal(commonArguments);
            done();
        });
    });

    describe('#setPubAdServerObject', function() {

        it('is a function', function(done) {
            slotObject.setPubAdServerObject.should.be.a('function');
            done();
        });
    });

    describe('#getPubAdServerObject', function() {
        it('is a function', function(done) {
            slotObject.getPubAdServerObject.should.be.a('function');
            done();
        });

        // TODO : ?
        it('returns slot pubAdServerObject', function(done) {
            var pubAdServerObject = {
                pub: "add",
                server: "object"
            };
            slotObject.setPubAdServerObject(pubAdServerObject);
            slotObject.getPubAdServerObject().should.equal(pubAdServerObject);
            done();
        });
    });

    describe('#setDisplayFunctionCalled', function() {

        it('is a function', function(done) {
            slotObject.setDisplayFunctionCalled.should.be.a('function');
            done();
        });
    });

    describe('#isDisplayFunctionCalled', function() {

        it('is a function', function(done) {
            slotObject.isDisplayFunctionCalled.should.be.a('function');
            done();
        });

        it('returns slot isDisplayFunctionCalled value', function(done) {
            slotObject.setDisplayFunctionCalled(true);
            slotObject.isDisplayFunctionCalled().should.equal(true);
            done();
        });
    });

    describe('#setRefreshFunctionCalled', function() {

        it('is a function', function(done) {
            slotObject.setRefreshFunctionCalled.should.be.a('function');
            done();
        });
    });

    describe('#isRefreshFunctionCalled', function() {

        it('is a function', function(done) {
            slotObject.isRefreshFunctionCalled.should.be.a('function');
            done();
        });

        it('returns slot isRefreshFunctionCalled value', function(done) {
            slotObject.setRefreshFunctionCalled(true);
            slotObject.isRefreshFunctionCalled().should.equal(true);
            done();
        });
    });

    describe('#updateStatusAfterRendering', function() {

        it('is a function', function(done) {
            slotObject.updateStatusAfterRendering.should.be.a('function');
            done();
        });

        it('set the status of slot as displyed and reset the arguments while setting refreshFunctionCalled to false when passed true', function(done) {
            var isRefreshaCalled = true;
            slotObject.updateStatusAfterRendering(isRefreshaCalled);
            slotObject.status.should.equal(CONSTANTS.SLOT_STATUS.DISPLAYED);
            slotObject.arguments.should.deep.equal([]);
            slotObject.refreshFunctionCalled.should.be.false;
            done();

        });

        it('set the status of slot as displyed and reset the arguments while setting displayFunctionCalled to false when passed false', function(done) {
            var isRefreshaCalled = false;
            slotObject.updateStatusAfterRendering(isRefreshaCalled);
            slotObject.status.should.equal(CONSTANTS.SLOT_STATUS.DISPLAYED);
            slotObject.arguments.should.deep.equal([]);
            slotObject.displayFunctionCalled.should.be.false;
            done();
        });
    });
});
