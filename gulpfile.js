import * as dartSass from "sass";
import gulp from "gulp";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import rename from "gulp-rename";

const sass = gulpSass(dartSass);
const paths = {
  styles: {
    src: "./src/style/**/*.scss",
    main: "./src/style/main.scss",
    dest: "./build/css",
  },
  scripts: {
    src: "./src/script/**/*.js",
    main: "./src/script/app.js",
    dest: "./build/js",
  },
};

function buildStyles() {
  return gulp
    .src(paths.styles.main)
    .pipe(sass({ silenceDeprecations: ["import"] }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.dest));
}

function minifyJs() {
  return gulp
    .src(paths.scripts.main, { allowEmpty: true })
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watchFiles() {
  gulp.watch(paths.styles.src, buildStyles);
  gulp.watch(paths.scripts.src, minifyJs);
}

export const build = gulp.series(buildStyles, minifyJs);
export const watch = gulp.series(buildStyles, watchFiles);

export default gulp.series(build, watch);
