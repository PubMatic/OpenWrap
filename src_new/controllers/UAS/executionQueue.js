var UTIL = require("../../util.js");

exports.EexecutionQueue = function(){
	var Phoenix = window.Phoenix,
		internalQ = []
	;
					
	if( ! UTIL.isUndefined(Phoenix) && ! UTIL.isUndefined(Phoenix.EQ) ){				
		internalQ = Phoenix.EQ;
	}
	
	this.push = function( theFunction ){
		var Phoenix = window.Phoenix;					
		if(typeof theFunction === 'function'){
			if(UTIL.isUndefined(Phoenix) && UTIL.isUndefined(Phoenix.isJSLoaded)){
				// async case
				internalQ.push( theFunction );
			}else{
				//sync case
				theFunction();
			}
		}
	};
	
	this.executeQ = function(){
		var theFunction;
		while(theFunction = internalQ.shift()){
			theFunction();
		}
	};
};