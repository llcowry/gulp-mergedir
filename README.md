# gulp-mergedir

Merge code by directory.


### Install

``` bash
$ npm install gulp-mergedir --save-dev
```

### Usage

``` js
var gulp = require('gulp');
var mergedir = require('gulp-mergedir');

gulp.task('mergedir', function() {
	return gulp
		.src('src/scripts/**/*.js')
		.pipe(mergedir({
			ext: '.js' // 输出合并的文件后缀
			mergeCommon: 'common.js', // 合并公共文件到每个子目录
			mergeFirst: true, // 是否把合并的公共文件列为首位
			sourceComments: true // 是否显示源文件信息
		}))
		.pipe(gulp.dest('dist/scripts'));
});
```

### License

MIT.
