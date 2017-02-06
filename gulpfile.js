'use strict';

var gulp = require('gulp'),
    path = require('path'),
    eslint = require('gulp-eslint'),
    runSequence = require('gulp-run-sequence'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    browserSync = require('browser-sync').create(),
    partialify = require('partialify'),
    less = require('gulp-less'),
    shell = require('gulp-shell'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    dist = 'dist/public';

gulp.task('dist', ['less', 'copy:dependencies'], function() {
    return gulp.src('public/index.html')
        .pipe(gulp.dest(path.join(__dirname, dist)));
});

gulp.task('less', function () {
  return gulp.src('./public/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'public', 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/public/css'));
});

gulp.task('copy:dependencies', ['copy:js-dependencies']);

gulp.task('copy:js-dependencies', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js'])
        .pipe(gulp.dest(path.join(__dirname, dist, 'js')));
});

gulp.task('browserify', function() {
    var bundler = browserify('./public/js/script.js', {debug: true})
        .transform(partialify);
        
    return bundler.bundle()
        .on('error', function(err){ console.error(err); this.emit('end'); })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(path.join(__dirname, dist, 'js')));
});

gulp.task('lint', function() {
    return gulp.src(['public/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('browser-sync', function() {
    gulp.watch('./public/less/**/*', ['less']);
    gulp.watch('./public/js/**/*', ['browserify']);
    gulp.watch('./public/index.html', ['dist']);
});

gulp.task('clean', function() {
    return gulp.src('dist/*')
        .pipe(vinylPaths(del));
});

gulp.task('dev', function(callback) {
    runSequence('clean', 'lint', 'dist', 'browserify', 'browser-sync', callback);
});

gulp.task('quick', function(callback) {
   runSequence('clean', 'dist', 'browserify', 'browser-sync', callback); 
});