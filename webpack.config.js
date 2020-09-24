var path = require('path');

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
