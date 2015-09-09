'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var postcssSimpleVars = require("postcss-simple-vars");
var postcssMixins = require("postcss-mixins");
var postcssNested = require("postcss-nested");
var sourcemaps = require("gulp-sourcemaps");
var minifycss = require('gulp-minify-css');
var del = require('del');
var sprite = require('gulp-sprite-generator');
var dest = "dest/";

/**
 *  1. 清理文件夹
 *  需要del
 */
gulp.task('cleanup', function() {
    del('dest/*', function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task('cleanupcss', function() {
    del('dest/minified/css/*', function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task('cleanupjs', function() {
    del('dest/minified/js/*', function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

/**
 *  2. 合并压缩js 
 *  需要 gulp-uglify, gulp-concat, gulp-rename
 */
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dest/minified/js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dest/minified/js'));
});

/**
 *  3. 合并编译压缩css
 *  需要gulp-postcss, gulp-concat, gulp-minify-css
 */
// Css process.
gulp.task('postcss', function() {
    var processors = [
        postcssMixins,
        postcssSimpleVars,
        postcssNested,
        autoprefixer({
            browsers: ["Android 4.1", "iOS 7.1", "Chrome > 31", "ff > 31", "ie >= 10"]
        })
    ];

    return gulp.src(['src/css/*.css'])
        //.pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        .pipe(postcss(processors))
        .pipe(minifycss())
        //.pipe(sourcemaps.write("."))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('dest/minified/css'));
});

gulp.task('sprites', function() {

    del('dest/*', function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });

    var spriteOutput = gulp.src("src/css/bg.css")
        .pipe(sprite({
            baseUrl: "./",
            spriteSheetName: "sprite.png",
            spriteSheetPath: "dest/images"
        }));

    spriteOutput.css.pipe(gulp.dest("dest/css"));
    spriteOutput.img.pipe(gulp.dest("dest/images"));
});


var spriter = require('gulp-css-spriter');
gulp.task('spriter', function() {

    del('dest/*', function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });

    gulp.src('src/css/bg.css')
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': 'dest/images/spritesheet.png',
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png'
        }))
        .pipe(gulp.dest('dest/css'));
});
