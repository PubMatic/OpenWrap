var conf = require('./src_new/conf.js');
var StringReplacePlugin = require('string-replace-webpack-plugin');

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
        loaders: [
            {
                test: /owt.js$/,
                include: /(src_new)/,
                loader: StringReplacePlugin.replace({
                  replacements: [
                    {
                      pattern: /%%PATH_TO_CONTROLLER%%/g,
                      replacement: function (match, p1, offset, string) {
                        return conf.controllerPath;
                      }
                    }
                  ]
                })
            }
        ]
    },
    plugins: [
        new StringReplacePlugin()
    ]
};
