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
    clean = require('gulp-clean'), // 删除文件或文件夹
    cache = require('gulp-cache'), // 清除缓存
    del = require('del'),
    cp = require('child_process');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * file paths
 */
var paths = {
    css: {
        src: 'src/sass/**/*.scss',
        dest: 'assets/css/',
        watch: 'src/sass/**/*.scss'
    },
    js: {
        src: 'src/js/**/*.js',
        dest: 'assets/js/',
        watch: 'src/js/**/*.js'
    },
    img: {
        src: 'src/images/**/*.*',
        dest: 'assets/images/',
        watch: 'src/images/**/*.*'
    }
};

function errrHandler(e) {
    // 控制台发声,错误时beep一下
    gutil.beep();
    gutil.log(e);
    this.emit('end');
}

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', function (done) {
    return cp.spawn(jekyllCommand, ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', ['jekyll-build'], function () {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/*
 * Compile js file(bower_components into assets)
 */
gulp.task('bowerTask', ['clean'], function () {
    var jsFiles = ['assets/js/*'];
    var cssFiles = ['assets/css/*'];

    gulp.src(mainBowerFiles().concat(jsFiles))
        .pipe(gfilter('**/*.js'))
        // .pipe(concat('main.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
    gulp.src(mainBowerFiles().concat(cssFiles))
        .pipe(gfilter('**/*.css'))
        // .pipe(concat('main.min.css'))
        // .pipe(uglify())
        .pipe(gulp.dest('assets/css'));
});

/*
 * Compile SASS into CSS and minify CSS 
 */
gulp.task('sass', function () {
    gulp.src(paths.css.src)
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
    return gulp.src("src/js/pure.js")
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
    return gulp.src('assets/**/*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean-cache', function (done) { //清除缓存
    return cache.clearAll(done);
});

gulp.task('watch', function () {
    gulp.watch(paths.css.watch, ['sass', 'jekyll-rebuild']);
    gulp.watch(paths.js.watch, ['js']);
    gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], ['jekyll-rebuild']);
});

gulp.task('default', function (callback) {
    runSequence('clean', ['bowerTask', 'imagemin'], ['js', 'sass'],
        'browser-sync',
        'watch',
        callback);
});