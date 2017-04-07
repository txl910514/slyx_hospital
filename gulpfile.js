// 引入 gulp
var gulp = require('gulp'),
	yargs = require('yargs').argv, //获取gulp命令后传入的参数
	template = require('gulp-template'), // 模板
	livereload = require('gulp-livereload'), //与服务器同步刷新
	browserSync = require('browser-sync'), // 启动服务 文件修改实时同步到浏览器
	pkg = require('gulp-packages')(gulp, [
		'autoprefixer', //浏览器前缀
		'cache', //缓存
		'clean-css', //压缩css
		'file-include',
		'filter',
		'htmlmin',
		'if',
		'imagemin', //压缩图片
		'main-bower-files',
		'match',
		'plumber',
		'rename', //重命名
		'rev',
		'rev-replace',
		'sass',
		'uglify', //压缩js
		'notify',
		'useref'
	]),
	Q = require('q'),
	del = require('del'),
	pathConfig = {
		src: 'src/',
		rev: 'rev'
	},
	manifest = {
		vendor: 'manifest.vendor.json',
		html: 'manifest.html.json',
		css: 'manifest.css.json',
		img: 'manifest.img.json',
		js: 'manifest.js.json'
	},
	compress = false,
	img = false,
	js = false,
	version = new Date().getTime(),
	api = require('./url.json'),
	mkRev = function (stream, manifest) {
		return stream
			.pipe(pkg.rev())
			.pipe(pkg.rename(function (file) {
				file.extname += '?rev=' + version + /\-(\w+)(\.|$)/.exec(file.basename)[1];
				if (/\-(\w+)\./.test(file.basename)) {
					file.basename = file.basename.replace(/\-(\w+)\./, '.');
				};
				if (/\-(\w+)$/.test(file.basename)) {
					file.basename = file.basename.replace(/\-(\w+)$/, '');
				};
			}))
			.pipe(pkg.rev.manifest(manifest, {
				merge: true
			}))
			.pipe(gulp.dest("./rev"));
	};
if (yargs.pub) {
	switch (yargs.pub) {
		// 正式环境
		case "url":
			pathConfig.dist = 'hos_dp/';
			break;
		//测试环境
		case "test":
			pathConfig.dist = 'hos_dp/';
			break;
	}
};
var condition = function (file) {
	// TODO: add business logic
	var file_path = file.history[0].replace(file.cwd+'/', '');
	if(file_path === pathConfig.src + 'js/jslib/underscore.js') {
		return false;
	}
	else {
		return true;
	}
};
var js_uglify = function(file) {
	if (yargs.pub === 'url') {
		var file_path = file.history[0].replace(file.cwd+'/', '');
		var indexOf =  file_path.indexOf('.json');
		if(indexOf > -1) {
			return false;
		}
		else {
			return true;
		}
	}
	else {
		return false;
	}

};
gulp.task('server', function () {
	console.log(yargs.p);
	yargs.p = yargs.p || 3000;
	browserSync.init({
		server: {
			baseDir: pathConfig.dist,
			index: 'index.html'
		},
		port: yargs.p,
		browser: ["chrome"]
	});
});
gulp.task('setValue', function () {
	if (yargs.pub) {
		switch (yargs.pub) {
			// 正式环境
			case "url":
				console.log('开始代码压缩');
				compress = true;
				img = true;
				js = true;
				api = require('./url.json');
				break;
				//测试环境
			case "test":
				api = require('./testurl.json');
				break;
		}
	};
	if (yargs.w) {
		gulp.start('watch');
	};
	if (yargs.s) {
		gulp.start('server');
	};
});
gulp.task('del-dist', function () {
	return del([
		pathConfig.dist,
		pathConfig.dist + 'index.html',
		pathConfig.rev
	]);
});
gulp.task('build-dist-img', function () {
	return mkRev(gulp.src([pathConfig.src + "**/images/*.*", pathConfig.src + "**/images/**/*.*"])
		.pipe(pkg.cache(pkg.if(img, pkg.imagemin({
			progressive: true,
			interlaced: true
		}))))
		.pipe(gulp.dest(pathConfig.dist))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(pkg.rename(function (file) {
			file.dirname = file.dirname;
		})), manifest.img);
});
// 编译Sass
gulp.task('build-dist-sass', function () {
	return mkRev(gulp.src(pathConfig.src + "**/css/*.scss")
		.pipe(pkg.sass({
			outputStyle: compress ? 'compressed' : 'nested'
		}))
		.pipe(pkg.plumber({
			errorHandler: pkg.notify.onError('Error: <%= error.message %>')
		}))
		.pipe(pkg.autoprefixer({
			browsers: [ 'last 3 versions', '> 1%',  'Firefox ESR', 'Opera 12.1']
		}))
		.pipe(pkg.revReplace({
			manifest: gulp.src("./rev/manifest.img.json")
		}))
		.pipe(gulp.dest(pathConfig.dist))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(pkg.rename(function (file) {
			file.dirname = file.dirname;
		})), manifest.css);
});
// 编译Html
gulp.task('build-dist-html', function () {
	// var deferred = Q.defer();
	mkRev(gulp.src(pathConfig.src + '**/*.html', {
			base: pathConfig.src
		})
		.pipe(pkg.plumber())
		.pipe(pkg.fileInclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(pkg.htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest(pathConfig.dist))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(pkg.rename(function (file) {
			file.dirname = file.dirname;
		})), manifest.html);
});
// 编译Js

gulp.task('build-dist-js', function () {
	return mkRev(gulp.src([pathConfig.src + 'js/**/*.*'])
		.pipe(pkg.if(condition, template(api)))
		.pipe(pkg.if(js_uglify, pkg.uglify().on('error', function(err){
			console.log(err);
		})))
		.pipe(gulp.dest(pathConfig.dist))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(pkg.rename(function (file) {
			file.dirname = file.dirname;
		})), manifest.js);
});
//合并
gulp.task('build-rep-rev', ['build-dist-html', 'build-dist-js'], function () {
	return gulp.src([
			pathConfig.dist + '**/*.html'
		])
		.pipe(pkg.revReplace({
			manifest: gulp.src("./rev/*.*")
		}))
		.pipe(gulp.dest(pathConfig.dist));
});
gulp.task('default', ['setValue', 'build-dist-img', 'build-dist-sass', 'build-dist-js', 'build-dist-html']);
gulp.task('default1', ['setValue', 'build-dist-sass', 'build-rep-rev']);
gulp.task('rev', ['del-dist','build-dist-img'], function () {
	gulp.start('default1');
});
gulp.task('watch', function () {
	gulp.watch(pathConfig.src + 'css/*.*', ['build-dist-sass']);
	gulp.watch(pathConfig.src + '**/*.html', ['build-dist-html']);
	gulp.watch(pathConfig.src + 'js/**/*.*', ['build-dist-js']);
});