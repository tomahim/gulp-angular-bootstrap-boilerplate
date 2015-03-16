'use strict';

var gulp = require('gulp'), //
minifyCss = require('gulp-minify-css'), //
usemin = require('gulp-usemin'), //
uglify = require('gulp-uglify'), //
minifyHtml = require('gulp-minify-html'), //
livereload = require('gulp-livereload'), //
ngmin = require('gulp-ng-annotate'), //
connect = require('gulp-connect'), //
proxy = require('proxy-middleware'), //
flatten = require('gulp-flatten'), //
clean = require('gulp-clean'), //
replace = require('gulp-replace'), //
bower = require('gulp-bower');

var yeoman = {
	app : 'src/main/web/',
	dist : 'target/gulp-dist/',
	// test: 'src/test/web/spec/',
	tmp : 'target/.tmp/'
};

gulp.task('clean', function() {
	return gulp.src(yeoman.dist, {
		read : false
	}).pipe(clean());
});

gulp.task('clean:tmp', function() {
	return gulp.src(yeoman.tmp, {
		read : false
	}).pipe(clean());
});

gulp.task('fonts', [ 'clean' ], function() {
	return gulp.src(yeoman.app + 'bower_components/**/*.{woff,svg,ttf,eot}').pipe(flatten()).pipe(gulp.dest(yeoman.dist + 'fonts'));
});

gulp.task('images', [ 'clean' ], function() {
	return gulp.src(yeoman.app + 'images/**')
	// .pipe(imagemin({optimizationLevel: 5}))
	.pipe(gulp.dest(yeoman.dist + 'images'));
});

gulp.task('styles', [ 'clean' ], function() {
	return gulp.src(yeoman.app + '{,*/}*.css').pipe(gulp.dest(yeoman.tmp));
});

gulp.task('watch', function() {
	livereload.listen();
	// gulp.watch(yeoman.app + '**/*.html');
	gulp.watch([ yeoman.app + '**/**', '!' + yeoman.app + 'bower_components/**' ]).on('change', livereload.changed);

});

gulp.task('server', [ 'watch' ], function() {
	connect.server({	
		port : 9000,
		root : [ yeoman.app],
		livereload : true
	});
});

gulp.task('server:dist', [ 'build' ], function() {
	connect.server({
		root : [ yeoman.dist ],
		port : 9000
	});
});

gulp.task('build', [ 'usemin' ]);

gulp.task('usemin', [ 'clean', 'fonts', 'images', 'styles'], function() {
	return gulp.src([ yeoman.app + '{,**/}*.jsp', yeoman.app + '{,**/}*.html', '!' + yeoman.app + 'bower_components/{,**/}*.html' ]).pipe(usemin({
		css : [
			// replace(/[0-9a-zA-Z\-_\s\.\/]*\/([a-zA-Z\-_\.0-9]*\.(woff|eot|ttf|svg))/g,
			// '../fonts/$1'),
			minifyCss(), 'concat' 
		],
		html : [ minifyHtml({
			empty : true,
			conditionals : true,
			spare : true,
			quotes : true
		}) ],
		js_vendor : [ 'concat' ],
		js : [ ngmin(), uglify(), 'concat' ]
	})).pipe(gulp.dest(yeoman.dist));
});

gulp.task('bower', function() {
	return bower();
});

gulp.task('default', ['build']);