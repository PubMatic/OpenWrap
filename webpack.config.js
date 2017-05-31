var prebid = require('./package.json');
var path = require('path');

module.exports = {
    output: {
        filename: 'owt.js'
    },
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ['', 'node_modules', 'src_new']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [{
            test: /\.js$/,
            include: /(src_new|test)/,
            exclude: path.resolve(__dirname, 'node_modules'),
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['es2015']
            }
        }]
    }
};
