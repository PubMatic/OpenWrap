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
};

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
    if(this.isString(data)){
      console.log( constDebugInConsolePrependWith + data );
    }else{
      console.log(data);
    }
  }
};

exports.getCurrentTimestampInMs = function(){
  var date = new Date();
  return date.getTime();
};

exports.getCurrentTimestamp = function(){
  var date = new Date();
  return Math.round( date.getTime()/1000 );
};

var utilGetIncrementalInteger = (function() {
  var count = 0;
  return function() {
    count++;
    return count;
  };
})();

exports.getUniqueIdentifierStr = function() {
  return utilGetIncrementalInteger() + Math.random().toString(16).substr(2);
};

exports.copyKeyValueObject = function(copyTo, copyFrom){
  for(var key in copyFrom){    
    copyFrom[key] = this.isArray(copyFrom[key]) ? copyFrom[key] : [copyFrom[key]];
    if(this.isOwnProperty(copyFrom, key)){
      if(this.isOwnProperty(copyTo, key)){
        copyTo[key].push.apply(copyTo[key], copyFrom[key])  ;
      }else{
        copyTo[key] = copyFrom[key];
      }
    }
  }
};

exports.protocol = "https://"; //todo need a set method
exports.pageURL = "http://abc.com/ljljl/abc";

exports.getIncrementalInteger = (function() {
  var count = 0;
  return function() {
    count++;
    return count;
  };
})();

exports.generateUUID = function(){
    var d = new Date().getTime(),
      // todo: this.pageURL ???
      url = decodeURIComponent(this.pageURL).toLowerCase().replace(/[^a-z,A-Z,0-9]/gi, ''),
      urlLength = url.length
    ;

    //todo: uncomment it,  what abt performance
    //if(win.performance && this.isFunction(win.performance.now)){
    //    d += performance.now();
    //}

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-zzzzz'.replace(/[xyz]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        var op;
        switch(c){
          case 'x':
            op = r;
            break;
          case 'z':
            op = url[Math.floor(Math.random()*urlLength)];
            break;
          default:
            op = (r&0x3|0x8);
        }

        return op.toString(16);
    });

    return uuid;
};

var macroRegexFlag = macroRegexFlag;
var constCommonMacroForWidthRegExp = new RegExp(CONSTANTS.MACROS.WIDTH, macroRegexFlag);
var constCommonMacroForHeightRegExp = new RegExp(CONSTANTS.MACROS.HEIGHT, macroRegexFlag);
var constCommonMacroForAdUnitIDRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_ID, macroRegexFlag);
var constCommonMacroForAdUnitIndexRegExp = new RegExp(CONSTANTS.MACROS.AD_UNIT_INDEX, macroRegexFlag);
var constCommonMacroForIntegerRegExp = new RegExp(CONSTANTS.MACROS.INTEGER, macroRegexFlag);
var constCommonMacroForDivRegExp = new RegExp(CONSTANTS.MACROS.DIV, macroRegexFlag);

exports.generateSlotNamesFromPattern = function(activeSlot, pattern){  
  var slotNames = [],
    slotName,
    slotNamesObj = {},
    sizeArrayLength,
    i
  ;
  
  if(activeSlot && activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES]){
    sizeArrayLength = activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES].length;
    if( sizeArrayLength > 0){
      for(i = 0; i < sizeArrayLength; i++){
        if(activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][0] && activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][1]){

          slotName = pattern;
          slotName = slotName.replace(constCommonMacroForAdUnitIDRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_ID])
                    .replace(constCommonMacroForWidthRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][0])
                    .replace(constCommonMacroForHeightRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.SIZES][i][1])
                    .replace(constCommonMacroForAdUnitIndexRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.AD_UNIT_INDEX])
                    .replace(constCommonMacroForIntegerRegExp, this.getIncrementalInteger())
                    .replace(constCommonMacroForDivRegExp, activeSlot[CONSTANTS.SLOT_ATTRIBUTES.DIV_ID]);

          if(! this.isOwnProperty(slotNamesObj, slotName)){
            slotNamesObj[slotName] = '';
            slotNames.push(slotName);
          }
        }
      }
    }
  }

  return slotNames;
};

