var CONSTANTS = require("./constants.js");

function Slot(name){
	this.name = name;
	this.displayFunctonCalled = false;
	this.refreshFunctionCalled = false;
	this.argumentsPassed = [];
	this.PubAdServerObject = null;
	this.status = CONSTANTS.SLOT_STATUS.CREATED;
	this.divID = "";
	this.AdUnitID = "";
	this.AdUnitIndex = 0;
	this.sizes = [];
	this.keyValues = null;
}



