var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cp = require('child_process');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('bundle', 'exec jekyll build --config _config.yml,_config_dev.yml'.split(' '), {
    stdio: 'inherit'
  }).on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync.init({
    server: {
      baseDir: '_site',
    },
    open: false
  });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function() {
  return gulp.src('assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['assets/scss'],
      outputStyle: "compact",
      onError: browserSync.notify
    }))
    .on('error', onError)
    .pipe(prefix(['last 3 versions', '> 1%'], {
      cascade: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css'))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
 gulp.task('watch', ['watch-sass', 'watch-jekyll']);

 gulp.task('watch-sass', function() {
   gulp.watch('assets/scss/**/*.scss', ['sass']);
 });

 gulp.task('watch-jekyll', function() {
   gulp.watch([
     '**/*',
     '!assets/css/**/*',
     '!assets/scss/**/*',
     '!node_modules/**/*',
     '!_site/**/*',
     '!facebook-sync/**/*',
     '!*',
     '*.html',
     '*.yml',
   ], ['jekyll-rebuild']);
 });

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

function onError(err) {
  console.error(err.stack);
  this.emit('end');
}
