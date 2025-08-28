'use strict';

const publicPath = "./dist";
const resourcesPath = "./assets";

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass')(require('sass')); // dart-sass
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Compile SCSS with sourcemaps
function compileSass() {
  return gulp.src(`${resourcesPath}/scss/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('../sourcemaps'))
    .pipe(gulp.dest(`${publicPath}/css`));
}

// Optimize images
function optimizeImages() {
  return gulp.src(`${resourcesPath}/images/**/*`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${publicPath}/images`));
}

// Watch SCSS and images
function watchFiles() {
  gulp.watch(`${resourcesPath}/scss/**/*.scss`, compileSass);
  gulp.watch(`${resourcesPath}/images/**/*`, optimizeImages);
}

// Define tasks
exports.sass = compileSass;
exports.imagemin = optimizeImages;
exports.watch = watchFiles;
exports.deploy = gulp.series(optimizeImages, compileSass);
exports.default = gulp.series(compileSass, watchFiles);
