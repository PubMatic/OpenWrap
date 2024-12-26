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
        st: options.entryTime || null,
        et: options.exitTime || null,
        tt: options.duration || null
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


/**
 * Retrieves the duration of a specific keyName
 */
function getDurationOf(keyName) {
  var metrics = getMetrics(keyName);
  if (metrics) {
    return metrics.tt;
  }
  return null;
};
exports.getDurationOf = getDurationOf;
getGlobalOwObject().getDurationOf = getDurationOf;


// Function to record the entry time for one or multiple keys with defaultTotaltime
function recordEntryTime(keyNames, defaultTotalTime) {
  var currentTime = new Date().getTime();
  defaultTotalTime = defaultTotalTime || 0;
  
  keyNames = Array.isArray(keyNames) ? keyNames : [keyNames];

  keyNames.forEach(function(keyName) {
    // Record the metrics for each keyName, including the entry time and duration
    setMetrics({keyName: keyName, entryTime: currentTime, duration: defaultTotalTime});
  });
}
exports.recordEntryTime = recordEntryTime;
getGlobalOwObject().recordEntryTime = recordEntryTime;

// Function to record the exit time and total time for one or multiple keys
function recordExitTime(keyNames, defaultTotalTime) {
  var currentTime = new Date().getTime();
  defaultTotalTime = defaultTotalTime || 0;
  
  keyNames = Array.isArray(keyNames) ? keyNames : [keyNames];

  keyNames.forEach(function(keyName) {
    var metrics = getMetrics(keyName);
    if (metrics) {
      // Update total time based on whether a default total time is provided
      metrics.tt = defaultTotalTime || (metrics.et = currentTime, currentTime - metrics.st);
    }
  });
}
exports.recordExitTime = recordExitTime;
getGlobalOwObject().recordExitTime = recordExitTime;

// Initializing the module
exports.init = function() {}