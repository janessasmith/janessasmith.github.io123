var gulp = require('gulp'), // 基础库
    csso = require('gulp-csso'), // CSS压缩
    uglify = require('gulp-uglify'), // JS压缩
    concat = require('gulp-concat'), // 文件合并
    sass = require('gulp-sass'), // SASS文件解析成CSS文件
    imagemin = require('gulp-imagemin'), // 图片压缩(JPEG、PNG、GIF、SVG)
    pngquant = require('imagemin-pngquant'), //图片深入压缩
    imageminJpegtran = require('imagemin-jpegtran'), // JPEG图片深入压缩
    imageminGifsicle = require('imagemin-gifsicle'), // GIF图片深入压缩
    imageminOptipng = require('imagemin-optipng'), // PNG图片深入压缩
    imageminSvgo = require('imagemin-svgo'), // SVG图片深入压缩
    plumber = require('gulp-plumber'), // 检测错误
    gutil = require('gulp-util'), // 自定义方法，本配置文件仅用到其日志打印功能
    gfilter = require('gulp-filter'), // 筛选符合条件的文件对象并进行排除
    runSequence = require('run-sequence'), // 按顺序运行多个或多组gulp任务
    browserSync = require('browser-sync'), // 监听项目源文件变更，同步刷新浏览器，支持多浏览器或设置终端
    mainBowerFiles = require('main-bower-files'), // 通过读取并分析bower.json文件里override属性里main路径下定义的插件及相关依赖
    cache = require('gulp-cache'), // 清除缓存
    del = require('del'), // 删除文件或文件夹
    cp = require('child_process');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * file paths
 */
var paths = {
    css: {
        src: 'src/sass',
        dest: 'assets/css',
        watch: 'src/sass'
    },
    js: {
        src: 'src/js',
        dest: 'assets/js',
        watch: 'src/js'
    },
    img: {
        src: 'src/images/**/*.*',
        dest: 'assets/images/',
        watch: 'src/images/**/*.*'
    }
};

/**
 * 
 * @param {*} e error log
 */
function errrHandler(e) {
    // 控制台发声,错误时beep一下
    gutil.beep();
    gutil.log(e);
    this.emit('end');
}

/**
 * Add indicator messages for when build tasks are running
 */
var messages = {
    jekyllDev: 'Running: $ jekyll build for dev',
    jekyllProd: 'Running: $ jekyll build for prod'
};

/**
 * Build the Jekyll Site in development mode
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-dev', function (done) {
    browserSync.notify(messages.jekyllDev);
    return cp.spawn('jekyll', ['build', 'bower.json', '_config.yml'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

/**
 * Build the Jekyll Site in production mode
 */
gulp.task('jekyll-prod', function (done) {
    browserSync.notify(messages.jekyllProd);
    return cp.spawn('jekyll', ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

/*
 * Rebuild Jekyll & reload the page
 */
gulp.task('jekyll-rebuild', ['jekyll-dev'], function () {
    browserSync.reload();
});

/*
 * Build the Jekyll Site and launch browser - sync
 * Wait for jekyll-dev task to complete, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-dev'], function () {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/*
 * Compile js file(bower_components into assets)
 */
gulp.task('bower', function () {
    gulp.src(mainBowerFiles().concat(paths.js.dest))
        .pipe(gfilter('**/*.js'))
        // .pipe(concat('libs.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest));
    gulp.src(mainBowerFiles().concat(paths.css.dest))
        .pipe(gfilter('**/*.css'))
        // .pipe(concat('libs.min.css'))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.css.dest));
});

/*
 * Compile SASS into CSS and minify CSS 
 */
gulp.task('sass', function () {
    gulp.src(paths.css.src + '/pure.scss')
        .pipe(plumber({
            errorHandler: errrHandler
        }))
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest(paths.css.dest));
});

/**
 * Compile and minify JS
 */
gulp.task('js', function () {
    return gulp.src(paths.js.src + '/pure.js')
        .pipe(plumber({
            errorHandler: errrHandler
        }))
        .pipe(concat('pure.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest));
});

/**
 * Minify images
 */
gulp.task('imagemin', function () {
    gulp.src(paths.img.src)
        .pipe(plumber({
            errorHandler: errrHandler
        }))
        .pipe(cache(imagemin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片          
            svgoPlugins: [{
                removeViewBox: false
            }], //不要移除svg的viewbox属性
            use: [pngquant(), imageminJpegtran({
                progressive: true
            }), imageminGifsicle({
                interlaced: true
            }), imageminOptipng({
                optimizationLevel: 3
            }), imageminSvgo()] //使用pngquant深度压缩png图片的imagemin插件          
        })))
        .pipe(gulp.dest(paths.img.dest));
});

/**
 * Removes assets files and folders
 */
gulp.task('clean', function () {
    return del('assets/**/*');
});

/**
 * Watch scss files for changes & recompile.Watch html/md files, run Jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.css.watch + '/**/*.scss', ['sass', 'jekyll-rebuild']);
    gulp.watch(paths.js.watch + '/**/*.js', ['js']);
    gulp.watch(['*html', '_includes/*html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task
 * Running just gulp will compile the js、sass
 * Compile the Jekyll site, launch BrowserSync & watch files
 */
gulp.task('default', function (callback) {
    runSequence('clean', ['bower', 'imagemin'], ['js', 'sass'],
        'browser-sync',
        'watch',
        callback);
});

/**
 * Build task
 * Run using gulp build to compile Sass and Javascript ready for deployment.
 */
gulp.task('build', function (callback) {
    runSequence('clean', ['bower', 'imagemin'], ['js', 'sass'],
        'jekyll-prod',
        callback);
});