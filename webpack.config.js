var conf = require('./src_new/conf.js');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var path = require('path');

var controllerPaths = {
	IDHUB: "./controllers/idhub.js",
	DFP: "./controllers/gpt.js",
	CUSTOM: "./controllers/custom.js"
};

module.exports = {
    output: {
        filename: 'owt.js'
    },
    devtool: 'source-map',
    resolve: {
				modules: [path.resolve('./node_modules'), path.resolve('./src_new')]
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
                        return controllerPaths[conf.pwt.adserver || 'DFP']
                      }
                    }
                  ]
                })
            }
        ],
				rules: [
		      {
		        test: /(\.js)$/,
		        loader: 'babel-loader',
		        exclude: /(node_modules)/
		      },
		      {
		        test: /(\.js)$/,
		        loader: 'eslint-loader',
		        exclude: /node_modules/
		      }
		    ]
    },
    plugins: [
        new StringReplacePlugin()
    ]
};
