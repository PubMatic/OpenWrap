var prebid = require('./package.json');
var path = require('path');

module.exports = {
    output: {
        filename: 'cerebro.js'
    },
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ['', 'node_modules', 'src_new']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules']
    },
    module: {}
};
