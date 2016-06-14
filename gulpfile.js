const gulp = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const flatten = require('gulp-flatten')
const standard = require('gulp-standard')
const browserSync = require('browser-sync').create()
const historyApiFallback = require('connect-history-api-fallback')
const browserify = require('browserify')
const stringify = require('stringify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const components = [
  './src/components/csp-action-link/CspActionLink.js'
]

gulp.task('default', ['html', 'styles', 'scripts', 'components', 'component-styles'], function () {
  browserSync.init({
    server: {
      baseDir: './dist',
      middleware: [ historyApiFallback() ]
    }
  })

  gulp.watch('./src/index.html', ['html']).on('change', browserSync.reload)
  gulp.watch('./src/scripts/**/*.js', ['standard', 'scripts'])
  gulp.watch('./src/components/**/*', ['standard', 'components'])
  gulp.watch('./src/styles/**/*.scss', ['styles'])
  gulp.watch('./src/components/**/*.scss', ['component-styles'])
})

gulp.task('html', function () {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('scripts', function () {
  browserify({entries: './src/scripts/app.js'})
  .transform(babelify, {presets: ["es2015"]})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/scripts'))
})

gulp.task('standard', function () {
  gulp.src('./src/**/*.js')
    .pipe(standard())
		.pipe(standard.reporter('default', { breakOnError: true}))
})

gulp.task('styles', function () {
	gulp.src('./src/styles/main.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 2 versions']}))
		.pipe(gulp.dest('./dist/styles'))
		.pipe(browserSync.stream())
})

gulp.task('component-styles', function () {
	gulp.src('./src/components/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(concat('components.css'))
		.pipe(gulp.dest('./dist/styles'))
		.pipe(browserSync.stream())
})

gulp.task('components', function () {
  components.forEach(function (file) {

      browserify({entries: file})
        .transform(babelify, {presets: ["es2015"]})
        .transform(stringify, {appliesTo: { includeExtensions: ['.html'] }})
        .bundle()
        .pipe(source(file))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(flatten())
        .pipe(gulp.dest('./dist/components'))
    })
})
