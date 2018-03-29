var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var tsify = require('tsify');
var uglify = require('uglifyify');
var runSequence = require('run-sequence');
var peg = require('gulp-peg');
var gutil = require('gulp-util');

gulp.task('.bower.install', function () {
    var bower = require('gulp-bower');
    return bower();
});

gulp.task('.bower.clean', function (cb) {
    var del = require('del');
    del(['lib/'], cb);
});

gulp.task('.npm.clean', function (cb) {
    var del = require('del');
    del(['node_modules/'], cb);
});

gulp.task('watch', function () {
    var bundler = watchify(browserify({ debug: true })
        .add('synthesizer.ts')
        .plugin(tsify)
        .transform(browserifyShader));

    bundler.on('update', rebundle)

    function rebundle() {
        return bundler.bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('.'))
    }

    return rebundle();
});

gulp.task('.peg', function () {
    return gulp.src("eisen-script.peg")
        .pipe(peg().on("error", gutil.log))
        .pipe(gulp.dest('.'))
});

gulp.task('.examples', function (cb) {
    var exec = require('child_process').exec;
    exec('bash ./pack-examples.sh > examples-generated.ts', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('.ui', function () {
    var bundler = browserify({ debug: true })
        .add('./mega-structure.ts')
        .plugin(tsify)
        .transform('brfs')

    return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('.synth', function () {
    var bundler = browserify({ debug: true })
        .add('./synthesizer-webworker.ts')
        .plugin(tsify)

    return bundler.bundle()
        .pipe(source('synthesizer-webworker.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('.ui.release', function () {
    var bundler = browserify()
        .add('./mega-structure.ts')
        .plugin(tsify)
        .transform('brfs')
        .transform(uglify);

    return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('.synth.release', function () {
    var bundler = browserify()
        .add('./synthesizer-webworker.ts')
        .plugin(tsify)
        .transform(uglify);

    return bundler.bundle()
        .pipe(source('synthesizer-webworker.js'))
        .pipe(gulp.dest('.'));
});


gulp.task('default', function (callback) {
    runSequence('.bower.install',
        '.peg',
        '.examples',
        '.ui.release',
        '.synth.release',
        callback);
});


