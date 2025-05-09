import gulp from "gulp";
  import imagemin from "gulp-imagemin";

  gulp.task("default", () => {
    //Define Task
    return gulp
      .src("src/images/*", { encoding: false })
      .pipe(imagemin())
      .pipe(gulp.dest("dest/images/"));
  });