var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var browserifyShader = require("browserify-shader")
var tsify = require('tsify');
var uglify = require('uglifyify');
var tsd = require('gulp-tsd');
var runSequence = require('run-sequence');

gulp.task('.bower.install', function () {
    var bower = require('gulp-bower');
    return bower();
});
 
gulp.task('.bower.clean', function (cb) {
    var del = require('del');
    del(['lib/'], cb);
});

gulp.task('.tsd.install', function (callback) {
	tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

gulp.task('.npm.clean', function (cb) {
    var del = require('del');
    del(['node_modules/'], cb);
});

gulp.task('watch', function() {
    var bundler = watchify(browserify({debug: true})
        .add('synthesizer.ts')
        .plugin(tsify)
        .transform(browserifyShader));

    bundler.on('update', rebundle)
 
    function rebundle () {
        return bundler.bundle()
          .pipe(source('bundle.js'))
          .pipe(gulp.dest('.'))
    }
     
    return rebundle();
});

gulp.task('.mega-structure', function() {
    var bundler = browserify({debug: true})
        .add('./synthesizer.ts')
        .plugin(tsify)
        .transform(browserifyShader)
    
    return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('.'));
});


gulp.task('default', function(callback) {
    runSequence('.bower.install',
                '.tsd.install',            
                '.mega-structure',
                callback);
});


