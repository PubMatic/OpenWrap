'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');

gulp.task('clean', function(){
	return gulp.src(['dist/*.js'], {
		read: true
	})
	.pipe(clean());
});

gulp.task('prodcode', function(){
	var files = ['src/commonVariables.js'/*, 'src/util.js', 'src/adapterManager.js', 'src/bidManager.js'*/];
	var adapters = ['src/adapters/pubmatic.js'];
	files = files.concat(adapters);
	files = files.concat('src/controllers/gpt.js');
	
	return gulp.src(files)
	.pipe(insert.prepend('(function(){\n'))
	.pipe(insert.append('\n})();'))
	.pipe(concat('owt.combine.js'))
	//.pipe(uglify())
	.pipe(gulp.dest('dist/'));
});