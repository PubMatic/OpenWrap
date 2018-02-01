var UTIL = require("../../util.js");

exports.EexecutionQueue = function(win){
	this.Phoenix = win.Phoenix;
	this.internalQ = [];

	if(!UTIL.isUndefined(this.Phoenix) && !UTIL.isUndefined(this.Phoenix.EQ)){
		this.internalQ = this.Phoenix.EQ;
	}

	this.push = function( theFunction ){
		var oThis = this;

		if(UTIL.isFunction(theFunction)){
			if(UTIL.isUndefined(oThis.Phoenix) && UTIL.isUndefined(oThis.Phoenix.isJSLoaded)){
				// async case
				oThis.internalQ.push( theFunction );
			} else {
				//sync case
				theFunction();
			}
		}
	};

	this.executeQ = function(){
		var theFunction;
		while(theFunction = this.internalQ.shift()){
			theFunction();
		}
	};
};
