var CONSTANTS = require('./constants.js');

var debugLogIsEnabled = false;
var typeArray = 'Array';
var typeString = 'String';
var typeFunction = 'Function';
var typeNumber = 'Number';
var toString = Object.prototype.toString;

function isA(object, testForType) {
  return toString.call(object) === '[object ' + testForType + ']';
}

exports.isFunction = function (object) {
  return isA(object, typeFunction);
};

exports.isString = function (object) {
  return isA(object, typeString);
};

exports.isArray = function (object) {
  return isA(object, typeArray);
};

exports.isNumber = function(object) {
  return isA(object, typeNumber);
};

exports.isOwnProperty = function(theObject, proertyName){
  if(theObject.hasOwnProperty){
    return theObject.hasOwnProperty(proertyName);	
  }
  return false;
};

exports.isUndefined = function(object){
  return typeof object === "undefined";
}

exports.getTimeout = function(config){

  var defaultTimeout = 1000;

  if( this.isOwnProperty(config, CONSTANTS.CONFIG.GLOBAL) 
    && this.isOwnProperty(config[CONSTANTS.CONFIG.GLOBAL], CONSTANTS.CONFIG.COMMON ) 
    && this.isOwnProperty(config[CONSTANTS.CONFIG.GLOBAL][CONSTANTS.CONFIG.COMMON], CONSTANTS.CONFIG.TIMEOUT) ){

    return parseInt(config[CONSTANTS.CONFIG.GLOBAL][CONSTANTS.CONFIG.COMMON][CONSTANTS.CONFIG.TIMEOUT]) || defaultTimeout;
  }

  return defaultTimeout;
};

exports.enableDebugLog = function(){
  debugLogIsEnabled = true;
};

//todo: move...
var constDebugInConsolePrependWith = '-------------------------';

exports.log = function(data){
  if( debugLogIsEnabled && console && this.isFunction(console.log) ){
    this.isString(data) ? console.log( constDebugInConsolePrependWith + data ) : console.log(data);
  }
};