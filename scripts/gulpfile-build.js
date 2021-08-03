const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const { output } = require('./utils/build');
const componentsGlob = {
  path: 'packages/**/src/*.tsx',
  styles: 'packages/**/style/*.less',
  css: 'packages/**/lib/**/*.css',
};

gulp.task('es', (done) => {
  return (
    gulp
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
      // 类型输出
      .pipe(output('lib'))
      .on('finish', done)
  );
});

gulp.task('less', (done) => {
  return gulp
    .src(componentsGlob.styles)
    .pipe(
      $.less({
        javascriptEnabled: true,
      })
    )
    .pipe(output('lib/style'))
    .on('finish', done);
});

exports.build = gulp.series('es', 'less');
