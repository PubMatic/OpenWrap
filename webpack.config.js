var path = require('path');

var controllerPaths = {
	IDHUB: "./controllers/idhub.js",
	DFP: "./controllers/gpt.js",
	CUSTOM: "./controllers/custom.js"
};

module.exports = {
    devtool:false,
    mode: "production",
    output: {
        filename: 'owt.js'
    },
    entry: {
      app: './src_new/owt.js'
    },
    optimization: {
      minimize: true
    },
    performance: {
      hints: 'warning'
    },
    module: {
				rules: [
		      {
		        test: /(\.js)$/,
		        loader: 'babel-loader',
		        exclude: /(node_modules)/
		      }
		    ]
    }
};
