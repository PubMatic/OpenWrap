var conf = require('./src_new/conf.js');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var path = require('path');
var argv = require('yargs').argv;

var controllerPaths = {
	IDHUB: "./controllers/idhub.js",
	DFP: "./controllers/gpt.js",
	CUSTOM: "./controllers/custom.js"
};

module.exports = {
  mode: 'development',
    output: {
        filename: 'owt.js'
    },
    devtool: 'source-map',
    resolve: {
				modules: [path.resolve('./node_modules'), path.resolve('./src_new')]
    },
    module: {
      rules: [
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
        },
        {
          test: /(\.js)$/,
          loader: 'babel-loader',
          exclude: /(node_modules)/
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)|(test)|(integrationExamples)|(build)|polyfill.js|(src\/adapters\/analytics\/ga.js)/, // TODO: reg ex to exlcude src_new folder ?
          use: () => 
            argv.mode == "test-build1" ? "istanbul-instrumenter-loader" : []
        }
		  ]
    },
    plugins: [
        new StringReplacePlugin()
    ]
};
