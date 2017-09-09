// Karma configuration
// Generated on Thu Feb 23 2017 19:29:00 GMT+0530 (India Standard Time)
var webpackConfig = require('./webpack.config');
webpackConfig.module.postLoaders = [{
    test: /\.js$/,
    exclude: /(node_modules)|(test)|(integrationExamples)|(build)|polyfill.js|(src\/adapters\/analytics\/ga.js)/, // TODO: reg ex to exlcude src_new folder ?
    loader: 'istanbul-instrumenter'
}];
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'expect', 'sinon'],


        client: {
            mocha: {
                reporter: 'html'
            }
        },


        // list of files / patterns to load in the browser
        files: [
            "test/globals.js",
            'test/**/*.spec.js',
            'test/helpers/karma-init.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.spec.js': ['webpack'],
            '!test/**/*spec.js': ['webpack', 'coverage'],
            'src_new/**/*.js': ['webpack', 'coverage']
        },

        // WebPack Related
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // reporters: CI_MODE ? ['junit', 'coverage'] : ['progress', 'html', 'coverage'], // TODO : Do we need this CI_MODE feature ?
        reporters: ['progress', 'html', 'coverage'],

        // junit reporter config
        junitReporter: {
            outputDir: 'test'
        },

        // optionally, configure the reporter
        coverageReporter: {
            reporters: [
                { type: 'html', dir: './build/coverage/' },
                { type: 'text', dir: './build/coverage/' },
                { type: 'lcov', dir: './build/coverage/lcov', subdir: '.' }
            ]
        },

        htmlReporter: {
            outputDir: 'build/coverage/karma_html', // where to put the reports
            urlFriendlyName: true, // simply replaces spaces with _ for files/dirs
            reportName: 'report' // report summary filename; browser info by default
        },

        plugins: [
            'karma-coverage',
            'karma-mocha',
            'karma-junit-reporter',
            'karma-html-reporter',
            'karma-chrome-launcher',
            'karma-requirejs',
            'karma-es5-shim',
            'karma-mocha',
            'karma-sinon',
            'karma-expect',
            'karma-webpack',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher'
        ]

    })
}
