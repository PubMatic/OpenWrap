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

var CI_MODE = process.env.NODE_ENV === 'ci';


gulp.task('clean', function() {
    return gulp.src(['dist/**/*.js', 'build/'], {
            read: true
        })
        .pipe(clean());
});


// What all processing needs to be done ?
gulp.task('webpack', ['clean'], function() {

    // change output filename if argument --tag given
    if (argv.tag && argv.tag.length) {
        webpackConfig.output.filename = 'owt.' + argv.tag + '.js';
    }

    webpackConfig.devtool = null;

    return gulp.src('src_new/owt.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(gulp.dest('build/dist'))
        // .pipe(connect.reload())
    ;
});


// Test all code without private functions
gulp.task('test', ['unexpose'], function (done) {
    var defaultBrowsers = CI_MODE ? ['PhantomJS'] : ['Chrome'];
    new karmaServer({
        browsers: defaultBrowsers,
        configFile: __dirname + '/karma.conf.dev.js',
        singleRun: true
    }, function (done) {
        gulp.src('temp', {
            read: true
        })
        .pipe(clean())
    }).start();
});


// Test all code including private functions
gulp.task('testall', function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
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


gulp.task('buildcerebro', function () {
    console.log("Executing buildcerebro"); 
    return gulp.src(['cerebroheader.js','prebid.js','./build/dist/owt.js'])
        .pipe(concat('cerebro.js'))
        .pipe(gulp.dest('build'));
});