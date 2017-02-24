// Karma configuration
// Generated on Thu Feb 23 2017 19:29:00 GMT+0530 (India Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'browserify'],


    // list of files / patterns to load in the browser
    files: [
        'dist/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'dist/*.js': [ 'browserify' ]
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
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['junit', 'progress', 'html', 'coverage'],

    // junit reporter config
    junitReporter: {
      outputDir: 'dist/coverage/',
      outputFile: 'abcd.xml',
      useBrowserName: false
    },

    // optionally, configure the reporter
    coverageReporter: {
      reporters: [
        { type: 'html', dir: './dist/coverage/' },
        { type: 'text', dir: './dist/coverage/' },
        { type: 'lcov', dir: './dist/coverage/lcov', subdir: '.' }
      ]
    },

    htmlReporter: {
      outputDir: 'dist/coverage/karma_html', // where to put the reports
      urlFriendlyName: true, // simply replaces spaces with _ for files/dirs
      reportName: 'report' // report summary filename; browser info by default
    },

    plugins: [
        'karma-browserify',
      'karma-coverage',
      'karma-mocha',      
      'karma-junit-reporter',
      'karma-html-reporter',
      'karma-chrome-launcher',      
      'karma-requirejs'
    ]

  })
}
