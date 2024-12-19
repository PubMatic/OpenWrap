var { getGlobalOwObject } = require('../common.util.js');

// Get a metrics object within PWT
function getMetricsObject() {
  getGlobalOwObject().metrics = getGlobalOwObject().metrics || {};
  return getGlobalOwObject().metrics;
}

// Function to set entry and exit times for a specific module and/or function
function setMetrics(options) {
  if (options.keyName) {
    if (!getMetricsObject()[options.keyName]) {
      getMetricsObject()[options.keyName] = {
        entryTime: options.entryTime || null,
        exitTime: options.exitTime || null,
        duration: options.duration || null
      };
    }
  }
}

// Function to get metrics for a specific module and/or function
function getMetrics(keyName) {
  if (keyName) {
    return getMetricsObject()[keyName] || null;
  }
  return null;
}

// Function to record entry time
getGlobalOwObject().recordEntryTime = function(keyName) {
  var currentTime = new Date().getTime();
  setMetrics({ keyName: keyName, entryTime: currentTime });
}

// Function to record exit time
getGlobalOwObject().recordExitTime = function(keyName) {
  var currentTime = new Date().getTime();
  var metrics = getMetrics(keyName);
  if (metrics) {
    metrics.exitTime = currentTime;
    metrics.duration = currentTime - metrics.entryTime;
  }
}

exports.init = function() {}
