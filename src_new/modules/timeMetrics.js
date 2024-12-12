var { getGlobalOwObject } = require('../common.util.js');

// Get a metrics object within PWT
function getMetricsObject() {
  getGlobalOwObject().metrics = getGlobalOwObject().metrics || {};
  return getGlobalOwObject().metrics;
}

// Function to set entry and exit times for a specific module and/or function
function setMetrics(options) {
  if (options.moduleName) {
    if (!getMetricsObject()[options.moduleName]) {
      getMetricsObject()[options.moduleName] = {};
    }
    if (options.functionName) {
      getMetricsObject()[options.moduleName][options.functionName] = {
        entryTime: options.entryTime || null,
        exitTime: options.exitTime || null
      };
    } else {
      getMetricsObject()[options.moduleName] = {
        entryTime: options.entryTime || null,
        exitTime: options.exitTime || null
      };
    }
  } else if (options.functionName) {
    getMetricsObject()[options.functionName] = {
      entryTime: options.entryTime || null,
      exitTime: options.exitTime || null
    };
  }
}

// Function to get metrics for a specific module and/or function
function getMetrics(moduleName, functionName) {
  if (moduleName && functionName) {
    return (getMetricsObject()[moduleName] && getMetricsObject()[moduleName][functionName]) || null;
  } else if (moduleName) {
    return getMetricsObject()[moduleName] || null;
  } else if (functionName) {
    return getMetricsObject()[functionName] || null;
  }
  return null;
}

// Function to record entry time
exports.recordEntryTime = function(moduleName, functionName) {
  var currentTime = new Date().getTime();
  setMetrics({ moduleName: moduleName, functionName: functionName, entryTime: currentTime });
}

// Function to record exit time
exports.recordExitTime = function(moduleName, functionName) {
  var currentTime = new Date().getTime();
  var metrics = getMetrics(moduleName, functionName);
  if (metrics) {
    metrics.exitTime = currentTime;
  }
}