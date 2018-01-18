var conf = require('./src_new/conf.js');
var StringReplacePlugin = require('string-replace-webpack-plugin');

var controllerPaths = {
	UAS: "./controllers/UAS/uas.js",
	DFP: "./controllers/gpt.js"
};

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
                        return controllerPaths[conf.pwt.adServer];
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
