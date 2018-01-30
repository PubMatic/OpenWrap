var UTIL = require("../../util.js");

exports.EexecutionQueue = function(){
	var Phoenix = window.Phoenix;
	this.internalQ = [];

	if( ! UTIL.isUndefined(Phoenix) && ! UTIL.isUndefined(Phoenix.EQ) ){
		this.internalQ = Phoenix.EQ;
	}

	this.push = function( theFunction ){
		var Phoenix = window.Phoenix;
		if(typeof theFunction === "function"){
			if(UTIL.isUndefined(Phoenix) && UTIL.isUndefined(Phoenix.isJSLoaded)){
				// async case
				this.internalQ.push( theFunction );
			}else{
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
