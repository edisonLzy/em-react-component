import gulp from 'gulp';
import { default as loadPlugin } from 'gulp-load-plugins';
import merge2 from 'merge2';
import { output } from './utils/build';
import { buildType } from './utils/buildType';

const $: any = loadPlugin();

const componentsGlob = {
  path: 'packages/**/src/**/*.tsx',
  styles: 'packages/**/style/**/*.less',
  css: 'packages/**/lib/**/*.css',
};

gulp.task('es', () => {
  return merge2([
    gulp
      .src(componentsGlob.path)
      .pipe(
        $.babel({
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
              },
            ],
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
      .pipe(output('lib'))
      .pipe(buildType()),
    gulp.src(componentsGlob.path).pipe(buildType()),
  ]);
});

gulp.task('less', () => {
  return gulp
    .src(componentsGlob.styles)
    .pipe(
      $.less({
        javascriptEnabled: true,
      })
    )
    .pipe($.autoprefixer())
    .pipe(output('lib/style'));
});

export const build = gulp.series('es', 'less');

export const dev = gulp.task('dev', () => {
  return gulp.watch([componentsGlob.path, componentsGlob.styles], {}, build);
});
