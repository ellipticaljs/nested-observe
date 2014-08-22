

var gulp = require('gulp'),
    gulputil=require('gulp-util'),
    path=require('path'),
    fs = require('fs-extra'),
    concat=require('gulp-concat'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    build=require('./build.json'),
    release=require('./build/dist.json'),
    src='./src',
    dist='./dist';


gulp.task('default', ['lint', 'test']);

var mocha = require('gulp-mocha');
gulp.task('test', function() {
  return gulp.src(['!test/coverage/**', 'test/**/*.js'], { read: false })
             .pipe(mocha({
               reporter: 'spec'
             }))
});

var eslint = require('gulp-eslint');
gulp.task('lint', function() {
  return gulp.src(['lib/**/*.js', '!test/coverage/**', 'test/**/*.js', 'gulpfile.js'])
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failOnError())
});

var istanbul = require('gulp-istanbul');
gulp.task('coverage', function(done) {
  gulp.src(['lib/**/*.js'])
      .pipe(istanbul())
      .on('finish', function () {
        gulp.src(['!test/coverage/**', 'test/**/*.js'])
          .pipe(mocha(), { read: false })
          .pipe(istanbul.writeReports({
            dir: './test/coverage'
          }))
          .on('end', done)
      })
});

var coveralls = require('gulp-coveralls');
gulp.task('coveralls', ['coverage'], function() {
  return gulp.src('test/coverage/**/lcov.info')
             .pipe(coveralls())
});




gulp.task('build',function(){

    var build_=libStream()
        .pipe(concat('nested-observe.js'))
        .pipe(gulp.dest(src));

    var release_=releaseStream()
        .pipe(concat('nested-observe.js'))
        .pipe(gulp.dest(dist));

    return merge(build_, release_);

});

gulp.task('minify',function(){

    var build_=libStream()
        .pipe(concat('nested-observe.js'))
        .pipe(gulp.dest(src));

    var minify_=releaseStream()
        .pipe(concat('nested-observe.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist));

    return merge(build_, minify_);
});

function libStream(){
    return gulp.src(build);
}

function releaseStream(){
    return gulp.src(release);
}
