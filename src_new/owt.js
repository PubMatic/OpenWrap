var CONSTANTS = require('./constants.js');
var util = require('./util.js');
var controller = require('./controllers/gpt.js');

util.enableDebugLog();

window.PWT = window.PWT || {};
controller.init({}, window);