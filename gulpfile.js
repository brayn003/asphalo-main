var gulp = require('gulp'),
	sass = require('gulp-sass'),
	inject = require('gulp-inject'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	uglifyCss = require('gulp-uglifycss'),
	browserSync = require('browser-sync').create();

var path = {
	'bower' : 'bower_components/'
}
var resources = {
	'css' 	: [	path.bower+'animate.css/animate.css'],
	'js' 	: [	path.bower+'jquery/dist/jquery.js',
				path.bower+'bootstrap-sass/assets/javascripts/bootstrap.js'],
	'fonts' : [	path.bower+'bootstrap-sass/assets/fonts/**/*']
}



gulp.task('html',function(){
	// console.log("Html-ing ...");
	return gulp.src('./src/html/**/*.html')
	.pipe(gulp.dest('./dist'));
});

var injectFunc = function(){
}

// gulp.task('html',['html-dist'],function(){
// 	htmlFunc();
//   	browserSync.reload();
// });

gulp.task('inject',['html'],function(){
	// var vendorJs = gulp.src('vendor.js', {read: false}),
	// 	appJs = gulp.src('app.js', {read: false}),
	// 	vendorCss = gulp.src('./dist/css/vendor.css', {read: false}),  
	// 	appCss = gulp.src('./dist/css/app.css', {read: false});  
	// console.log("Funcing");
	return gulp.src('./dist/index.html')
  	.pipe(inject(gulp.src([	'./dist/js/vendor.js',
  							'./dist/js/app.js',
  							'./dist/css/vendor.css',
  							'./dist/css/asphalo.css'],
  							{read: false}), {relative: true}))
  	.pipe(gulp.dest('./dist'));
});

gulp.task('vendor-css', function(){
	return gulp.src(resources.css)
	.pipe(sourcemaps.init())
    .pipe(concat('vendor.css'))
	.pipe(uglifyCss())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/css'))
});

gulp.task('sass', function(){
	// console.log("Sassing Heavy ...");
	return gulp.src('./src/sass/**/*.scss')
	.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('vendor-js',function(){
	var jsFiles = resources.js.concat('./src/js/**/*.js');
	// console.log('js-ing ...')
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
});

gulp.task('asset-fonts',function(){
	gulp.src(resources.fonts)
	.pipe(gulp.dest('./dist/assets/fonts'))
});

gulp.task('asset-img',function(){
	gulp.src('./src/assets/img/**/*')
	.pipe(gulp.dest('./dist/assets/img'))
});



gulp.task('build', ['vendor-css','sass','vendor-js','js','asset-fonts','asset-img','inject']);

gulp.task('reload', function(){
	return browserSync.reload();		
})

gulp.task('inject-reload', ['inject'], function(){
	return browserSync.reload();
})

gulp.task('serve', ['build'], function(){
	browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch("./src/sass/**/*.scss", ['sass']);
    gulp.watch("./src/sass/**/*.sass", ['sass']);
    gulp.watch("./src/assets/img/**/*", ['asset-img','reload']);
    gulp.watch("./src/assets/fonts/**/*", ['asset-fonts','reload']);
    gulp.watch("./src/js/**/*.js", ['js','reload']);
    gulp.watch("./src/html/**/*.html", ['inject-reload']);
});