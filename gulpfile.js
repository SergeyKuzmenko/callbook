var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css');

var jsfiles = [
  "js/jquery-3.1.1.min.js",
  "js/jquery.maskedinput.min.js",
  "js/jquery.maskedinput.min.js",
  "js/bootstrap.min.js",
  "js/mustache.min.js",
  "js/notify.min.js",
  "js/jquery.highlight.js",
  "js/app.js"
];

var cssfiles = [
  "css/bootstrap.min.css",
  "css/style.css"
];

gulp.task('styles', function() {
    return gulp.src(cssfiles)
    	  .pipe(concat('styles.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/css/'));
});

gulp.task('scripts', function() {
    return gulp.src(jsfiles)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/'));
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts');
});