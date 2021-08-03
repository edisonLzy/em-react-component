const gulp = require('gulp');
const path = require('path');
const $ = require('gulp-load-plugins')();
const componentsGlob = {
  path: 'packages/**/src/*.tsx',
  styles: 'packages/**/style/*.less',
};

gulp.task('es', (done) => {
  return gulp
    .src(componentsGlob.path)
    .pipe(
      $.babel({
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
        ],
      })
    )
    .pipe(gulp.dest('lib/es'))
    .on('finish', done);
});

gulp.task('less', (done) => {
  return gulp
    .src(componentsGlob.styles)
    .pipe(
      $.less({
        javascriptEnabled: true,
      })
    )
    .pipe(gulp.dest('./'))
    .on('finish', done);
});

exports.build = gulp.series('es','less');
