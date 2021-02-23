'use strict';
console.time("Loading plugins");
var argv = require('yargs').argv;
var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace-task');
var config = require("./src_new/config.js");

// var replace = require('gulp-replace');
// var insert = require('gulp-insert');
// var uglify = require('gulp-uglify');
// var jshint = require('gulp-jshint');
// var jscs = require('gulp-jscs');
// var karma = require('gulp-karma');
// var mocha = require('gulp-mocha');
// var gutil = require('gulp-util');
// var opens = require('open');
// var webserver = require('gulp-webserver');
// var webpack = require('webpack-stream');
// var webpackConfig = require('./webpack.config.js');
// var replace = require('gulp-replace');
// var optimizejs = require('gulp-optimize-js');
// var stripCode = require('gulp-strip-code');
var eslint = require('gulp-eslint');
// var karmaServer = require('karma').Server;
// var stripComments = require('gulp-strip-comments');
console.timeEnd("Loading plugins");
var CI_MODE = (argv.mode === 'test-build') ? true : false;
var isIdentityOnly = config.isIdentityOnly();

var prebidRepoPath = argv.prebidpath || "../Prebid.js/";

gulp.task('clean', function() {
    var clean = require('gulp-clean');
    return gulp.src(['dist/**/*.js', 'build/'], {
            read: false,
            allowEmpty: true
        })
        .pipe(clean());
});


// What all processing needs to be done ?
gulp.task('webpack', ['clean'], function() {
    console.log("Executing webpack");
    var connect = require('gulp-connect');
    var uglify = require('gulp-uglify');
    var webpack = require('webpack-stream');
    var webpackConfig = require('./webpack.config.js');
    var optimizejs = require('gulp-optimize-js');
    var fsCache = require('gulp-fs-cache');
    var jsFsCache = fsCache('.tmp/jscache');
    webpackConfig.devtool = null;

    return gulp.src('src_new/owt.js')
        .pipe(webpack(webpackConfig))
        .pipe(jsFsCache)
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(jsFsCache.restore)
        .pipe(gulp.dest('build/dist'))
        .pipe(connect.reload())
    ;
});

// Run below task to create owt.js for creative
gulp.task('webpack-creative', ['clean'], function() {
    var connect = require('gulp-connect');
    var uglify = require('gulp-uglify');
    var webpack = require('webpack-stream');
    var webpackConfig = require('./webpack.config.js');
    var optimizejs = require('gulp-optimize-js');
    webpackConfig.devtool = null;

    return gulp.src('src_new/creative/owCreativeRenderer.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(gulp.dest('build/dist'))
        .pipe(connect.reload())
    ;
});


gulp.task('devpack', ['clean'],function () {
var connect = require('gulp-connect');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

  webpackConfig.devtool = 'source-map';

  return gulp.src('src_new/owt.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/dev'))
    .pipe(connect.reload());
});


// Test all code without private functions
gulp.task('test', ['unexpose'], function (done) {
    var karma = require('gulp-karma');
    var karmaServer = require('karma').Server;

    var defaultBrowsers = CI_MODE ? ['PhantomJS'] : ['Chrome'];
    new karmaServer({
        browsers: defaultBrowsers,
        basePath: './temp',
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (exitCode) {
        console.log("exitCode ==>", exitCode);
        gulp.src('temp', {
            read: true
        })
        .pipe(clean())
        .pipe(function () {
            if (exitCode != 0) {
                process.exit(exitCode);
            }
        });
    }).start();
});


// Test all code including private functions
gulp.task('testall', function (done) {
    var karma = require('gulp-karma');
    var karmaServer = require('karma').Server;
    var defaultBrowsers = CI_MODE ? ['PhantomJS'] : ['Chrome'];
    new karmaServer({
        browsers: defaultBrowsers,
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (exitCode) {
        console.log("exitCode ==>", exitCode);
        if (exitCode != 0) {
            process.exit(exitCode);
        }
    }).start();
});


// Small task to load coverage reports in the browser
gulp.task('coverage', function (done) {
var connect = require('gulp-connect');
var opens = require('open');

    var coveragePort = 1999;
    connect.server({
        port: 1999,
        root: 'build',
        livereload: false
    });
    opens('http://localhost:' + coveragePort + '/coverage/');
    done();
});


// Task to remove privately exposed functions as well as remove test cases which test private functions
gulp.task('unexpose', function() {
    var stripCode = require('gulp-strip-code');
    
    return gulp
        .src([
            'src_new/**/*.js',
            'test/**/*.js'
            ],
            { base: './' }
        )
        .pipe(stripCode({
            start_comment: "start-test-block",
            end_comment: "end-test-block"
        }))
        .pipe(gulp.dest('./temp/'));
});


// Code linting with eslint
gulp.task('lint', () => {
  return gulp.src([
        'src_new/**/*.js',
        'test/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});

gulp.task('change-prebid-keys', () => {
    // Note: we have to execute this only when we have to use PubMatic OW keys
    // todo: add gulp-json-editor entry in package.json and in backend build job?
    var prebidConstantsPath = prebidRepoPath + '/src';
    var jeditor = require("gulp-json-editor");
    return gulp.src(prebidConstantsPath + '/constants.json')
        .pipe(jeditor(function(json) {
            json.TARGETING_KEYS.BIDDER = "pwtpid"; // hb_bidder
            json.TARGETING_KEYS.AD_ID = "pwtsid"; // hb_adid
            json.TARGETING_KEYS.PRICE_BUCKET = "pwtecp"; // hb_pb
            json.TARGETING_KEYS.SIZE = "pwtsz"; // hb_size
            json.TARGETING_KEYS.DEAL = "pwtdeal"; // hb_deal
            json.TARGETING_KEYS.SOURCE = ""; // hb_source
            json.TARGETING_KEYS.FORMAT = "pwtplt"; // hb_format
            json.TARGETING_KEYS.UUID = ""; // hb_uuids
            json.TARGETING_KEYS.CACHE_ID = "pwtcid"; // hb_cache_id
            json.TARGETING_KEYS.CACHE_HOST = ""; // hb_cache_host
            return json;
        }))
        .pipe(gulp.dest(prebidConstantsPath));
});

// Task to build minified version of owt.js
gulp.task('bundle', ['update-adserver'], function () {
    console.log("Executing build");
    return gulp.src([prebidRepoPath + '/build/dist/prebid.js', './build/dist/owt.js'])
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('bundle-pb-keys', function(){
      return gulp.src('./build/owt.min.js')
      .pipe(replace({
        patterns: [
          {
            match: /"%%TG_KEYS%%"/g,
            replacement: {
                        "BIDDER": "hb_bidder",
                        "AD_ID": "hb_adid",
                        "PRICE_BUCKET": "hb_pb",
                        "SIZE": "hb_size",
                        "DEAL": "hb_deal",
                        "SOURCE": "hb_source",
                        "FORMAT": "hb_format",
                        "UUID": "hb_uuid",
                        "CACHE_ID": "hb_cache_id",
                        "CACHE_HOST": "hb_cache_host"
                }
          }
        ]
      }))
      .pipe(gulp.dest('build'));
});

gulp.task('bundle-pwt-keys', function(){
      return gulp.src('./build/owt.min.js')
      .pipe(replace({
        patterns: [
          {
            match: /"%%TG_KEYS%%"/g,
            replacement: { 
                "STATUS": "pwtbst",
                "BIDDER": "pwtpid",
                "AD_ID": "pwtsid",
                "PRICE_BUCKET": "pwtecp",
                "SIZE": "pwtsz",
                "DEAL": "pwtdeal",
                "DEAL_ID": "pwtdid",
                "SOURCE": "",
                "FORMAT": "pwtplt",
                "UUID": "pwtuuid",
                "CACHE_ID": "pwtcid",
                "CACHE_HOST": "pwtcurl"
            }
          }
        ]
      }))
      .pipe(gulp.dest('build'));
});

// Task to build minified version of owt.js
gulp.task('bundle-creative', function () {
    console.log("Executing creative-build");
    return gulp.src(['./build/dist/owt.js'])
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
});


// Task to build non-minified version of owt.js
gulp.task('devbundle',['devpack'], function () {
    console.log("Executing Dev Build");
    return gulp.src([prebidRepoPath + '/build/dev/prebid.js', './build/dev/owt.js'])
        .pipe(concat('owt.js'))
        .pipe(gulp.dest('build'));
});


gulp.task('bundle-prod',['webpack'], function () {
    console.log("Executing bundling");
    return gulp.src([prebidRepoPath + '/build/dist/prebid.js', './build/dist/owt.js'])
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('update-adserver', function(){
    console.log("In update-adserver isIdentityOnly = " + isIdentityOnly + " and mode = "+argv.mode);
    var fileSrc = (argv.mode === 'build-all') ? './build/owt.js' : './build/owt.min.js';
    if (isIdentityOnly) {
        console.log("Executing update-adserver - START");
        var result = gulp.src([fileSrc])
          .pipe(replace({
            patterns: [
              {
                match: /adserver:[\s]*['"]*DFP['"]*/,
                replacement: 'adserver:"IDHUB"'
              }
            ]
          }))
          .pipe(gulp.dest('./build/'));
        console.log("Executing update-adserver - END - in If ");

        return result;
    }
    console.log("Executing update-adserver - END - outside If");
});

gulp.task('build-gpt-prod',[''])
