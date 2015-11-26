/**
 * Created by nabrol on 11/25/15.
 */
var gulp       = require('gulp');
var jspm       = require('jspm');
var conf       = require('./gulp.conf');
var nodemon    = require('gulp-nodemon');
var tslint     = require('gulp-tslint');
var rev        = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var revDel     = require('rev-del');
var del        = require('del');
var uglify     = require('gulp-uglify');
var $          = require('gulp-load-plugins')({lazy: true});


var tsProject = $.typescript.createProject({
    declarationFiles: true,
    noExternalResolve: true,
    module: 'amd',
    typescript: require('typescript'),
    target: 'ES5'
});

/**
 * tslint
 */

gulp.task('tslint', function(){
      gulp.src(conf.src.tslint)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

/**
 * Compilation / Copying Tasks
 */
gulp.task('typescript', function () {
    var tsResult = gulp.src(conf.src.ts)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.sourcemaps.write('./', {
            includeContent: true
        }))
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('scss', function () {
    return gulp.src(conf.src.scss)
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('copy-fonts', function() {
    return gulp.src('./app/font/**')
        .pipe(gulp.dest('./.tmp/styles/font'))
        .pipe(gulp.dest('./dist/font'));
});

gulp.task('copy-images', function() {
    return gulp.src('./app/img/**')
        .pipe(gulp.dest('./.tmp/img'))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('rev-assets', function(){
    return gulp.src(['.tmp/main.css', './dist/bundle.js'])
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'));
});

gulp.task('rev-replace', ['rev-assets'], function(){
    var manifest = gulp.src('dist/rev-manifest.json');
    return gulp.src('dist/index.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', ['rev-replace'], function(){
    return gulp.src(['dist/*.css'])
        .pipe($.minifyCss())
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', ['rev-replace'], function(){
    return gulp.src(['dist/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('dist-app', ['minify-js', 'minify-css', 'copy-fonts', 'copy-images'], function(){
    del('./dist/bundle.js');
});


gulp.task('templatecache', function () {
    return gulp.src(conf.src.html)
        .pipe($.angularTemplatecache({standalone: true}))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('dist-index-html', function () {
    return gulp.src('app/index.html')
        .pipe($.htmlReplace({
            'js':'' ,
            'module-import': 'bundle.js'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist-js', function (cb) {
    jspm.bundleSFX('.tmp/main', 'dist/bundle.js', { mangle: false }).then(function () {
        console.log('------>', 'JSPM bundled');
        gulp.start('dist-app');

    }, function (msg) {
        var err = new $.util.PluginError('JSPM', {
            message: 'The jspm bundle failed: ' + msg
        });
        cb(err);
    });
});

gulp.task('dist-templates', function () {

    gulp.src('.tmp/templates.js')
        .pipe(gulp.dest('dist'));
});


/**
 * Watcher Tasks
 */
gulp.task('typescript-watcher', function () {
    return gulp.watch(conf.src.ts, function () {
        gulp.start('typescript');
    });
});

gulp.task('scss-watcher', function () {
    return gulp.watch('app/scss/**/*.scss', function () {
        gulp.start('scss');
    });
});

gulp.task('html-watcher', function () {
    return gulp.watch(conf.src.html, function () {
        gulp.start('templatecache');
    });
});


gulp.task('serve-proxy', function () {
  nodemon({
    script: 'server/server.js',
    args: ['proxy'],
    ext: 'js html'
  });
});
/**
 * Main Tasks
 */
gulp.task('watch', [
    'typescript-watcher',
    'html-watcher',
    'scss-watcher'
]);

gulp.task('dev-no-watch', [
    'typescript',
    'templatecache',
    'scss'
]);


gulp.task('dev-proxy', ['dev-no-watch'], function () {
    gulp.start('serve-proxy');
    gulp.start('watch');
});

gulp.task('build', ['dev-no-watch'], function () {
    //gulp.start('tslint');
    del('./dist');
    gulp.start('dist-index-html');
    gulp.start('dist-js');
    gulp.start('dist-templates');
});



