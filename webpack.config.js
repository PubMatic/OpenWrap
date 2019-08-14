var conf = require('./src_new/conf.js');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var path = require('path');
var json = require('json-loader');

var controllerPaths = {
  UAS: "./controllers/uas.js",
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
    loaders: [{
      test: /owt.js$/,
      include: /(src_new)/,
      loader: StringReplacePlugin.replace({
        replacements: [{
          pattern: /%%PATH_TO_CONTROLLER%%/g,
          replacement: function (match, p1, offset, string) {
            return controllerPaths[conf.pwt.adserver || "DFP"];
          }
        }]
      })
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }],
    rules: [{
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /(\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /(\.js)$/,
        include: new RegExp(`\\${path.sep}prebid\.js`),
        use: {
          loader: 'babel-loader',
          // presets and plugins for Prebid.js must be manually specified separate from your other babel rule.
          // this can be accomplished by requiring prebid's .babelrc.js file (requires Babel 7 and Node v8.9.0+)
          options: require('prebid.js/.babelrc.js')
        }
      }
    ]
  },
  plugins: [
    new StringReplacePlugin()
  ]
};