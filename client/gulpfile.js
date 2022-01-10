var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var cssnano = require("gulp-cssnano");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var useref = require("gulp-useref");
var concat = require("gulp-concat");
var sassGlob = require("gulp-sass-glob");
var cleanCSS = require("gulp-clean-css");
var wait = require("gulp-wait");

gulp.task("sass", function () {
  return gulp
    .src("./src/scss/main.scss")
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./src/dist/css"));
});

gulp.task(
  "watch",
  gulp.series("sass", function () {
    gulp.watch("src/scss/**/*.scss", gulp.series(["sass"]));
    // Other watchers
  })
);
