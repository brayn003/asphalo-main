var gulp = require('gulp'),
	sass = require('gulp-sass'),
	inject = require('gulp-inject'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync').create();

var path = {
	'bower' : 'bower_components/'
}
var resources = {
	'sass' : {
		'bootstrap' : [path.bower+'assets/bootstrap/']
	},
	'js' : [path.bower+'jquery/dist/jquery.js',
			path.bower+'bootstrap-sass/assets/javascripts/bootstrap.js']
}



gulp.task('html',function(){
	console.log("Html-ing ...");
	return gulp.src('./src/html/**/*.html')
	.pipe(gulp.dest('./dist'));
});

var injectFunc = function(){
	var vendorJs = gulp.src('vendor.js', {read: false}),
		appJs = gulp.src('app.js', {read: false}),
		cssStream = gulp.src('./dist/css/**/*.css', {read: false});  
	console.log("Funcing");
	return gulp.src('./dist/index.html')
  	.pipe(inject(gulp.src(['./dist/js/vendor.js','./dist/js/app.js','./dist/css/**/*.css'], {read: false}), {relative: true}))
  	.pipe(gulp.dest('./dist'));
}

// gulp.task('html',['html-dist'],function(){
// 	htmlFunc();
//   	browserSync.reload();
// });

gulp.task('sass', function(){
	console.log("Sassing Heavy ...");
	return gulp.src('./src/sass/**/*.scss')
	.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('vendor-js',function(){
	var jsFiles = resources.js.concat('./src/js/**/*.js');
	console.log('js-ing ...')
	return gulp.src(resources.js)
	// .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    // .pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/js'))
})

gulp.task('js',function(){
	return gulp.src('./src/js/**/*.js')
	.pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/js'))
})

gulp.task('build', ['sass','vendor-js','js','html'],function(){
	injectFunc();
});

gulp.task('serve', ['build'], function(){
	browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch("./src/sass/**/*.scss", ['sass']);
    gulp.watch("./src/js/**/*.js", ['js']).on('change', browserSync.reload);;
    gulp.watch("./src/html/**/*.html", ['html']);
});