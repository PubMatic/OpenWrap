'use strict';

var argv = require('yargs').argv;
var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var karma = require('gulp-karma');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var opens = require('open');
var webserver = require('gulp-webserver');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var replace = require('gulp-replace');
var optimizejs = require('gulp-optimize-js');
var stripCode = require('gulp-strip-code');
var eslint = require('gulp-eslint');
var karmaServer = require('karma').Server;
var stripComments = require('gulp-strip-comments');

var CI_MODE = (argv.mode === 'test-build') ? true : false;

console.log("argv ==>", argv);

var prebidRepoPath = argv.prebidpath || "../Prebid.js/";

gulp.task('clean', function() {
    return gulp.src(['dist/**/*.js', 'build/'], {
            read: true
        })
        .pipe(clean());
});


// What all processing needs to be done ?
gulp.task('webpack', ['clean'], function() {

    webpackConfig.devtool = null;

    return gulp.src('src_new/owt.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(gulp.dest('build/dist'))
        .pipe(connect.reload())
    ;
});


gulp.task('devpack', function () {
  webpackConfig.devtool = 'source-map';
  
  return gulp.src('src_new/owt.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/dev'))
    .pipe(connect.reload());
});


// Test all code without private functions
gulp.task('test', ['unexpose'], function (done) {
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


// Task to build minified version of owt.js
gulp.task('bundle', function () {
    console.log("Executing build"); 
    return gulp.src(['prebid-header.js', prebidRepoPath + '/build/dist/prebid.js','prebid-footer.js','./build/dist/owt.js'])
        .pipe(concat('owt.min.js'))
        .pipe(gulp.dest('build'));
});


// Task to build non-minified version of owt.js
gulp.task('devbundle', function () {
    console.log("Executing Dev Build");
    return gulp.src(['prebid-header.js', prebidRepoPath + '/build/dev/prebid.js', 'prebid-footer.js', './build/dev/owt.js'])
        .pipe(concat('owt.js'))
        .pipe(gulp.dest('build'));
});
