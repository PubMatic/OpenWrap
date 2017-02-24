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


gulp.task('clean', function(){
	return gulp.src(['dist/**/*.js'], {
		read: true
	})
	.pipe(clean());
});

gulp.task('prodcode', function(){
	var files = ['src/commonVariables.js', 'src/util.js', 'src/adapterManager.js', 'src/bidManager.js'];
	var adapters = ['src/adapters/pubmatic.js'];
	files = files.concat(adapters);
	files = files.concat(['src/controllers/gpt.js', 'src/owt.js', 'test/util.spec.js']);
	
	var files = ['src/commonVariables.js', 'src/util.js', 'test/util.spec.js']

	return gulp.src(files)
	.pipe(concat('owt.combine.js'))
	.pipe(insert.prepend('(function(){\n'))
	.pipe(insert.append('\n})();'))
	//.pipe(uglify())
	.pipe(gulp.dest('dist/'));
});

gulp.task('jshint', function () {
  return gulp.src('dist/*.js')
    .pipe(jshint('.jshintconf'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
  return gulp.src('dist/*.js')
    .pipe(jscs({
      configPath: '.jscsconfig'
    }))
    .pipe(jscs.reporter());
});

gulp.task('test', function () {
	var defaultBrowsers = ['Chrome'];

	return gulp.src('lookAtKarmaConfJS')
		.pipe(karma({
			browsers: defaultBrowsers,
			configFile: 'karma.conf.js',
			action: 'run'
		}));
});

gulp.task('mocha', function() {
    return gulp.src(['dist/*.js'], { read: false })
        .pipe(mocha({
          reporter: 'spec',
          globals: {
            expect: require('chai').expect,
            window: {}
          }
        }))
        .on('error', gutil.log);
});

gulp.task('coverage', function (done) {
  /*var coveragePort = 1999;
  connect.server({
    port: coveragePort,
    root: 'dist/coverage/',
    base: 'http://localhost',
    livereload: true
  });
  opens('http://localhost:' + coveragePort + '/coverage/');
  done();*/

  gulp.src(['dist/coverage'])
	.pipe(webserver({
	  livereload: true,
	  directoryListing: true,
	  open: true
	}));

});