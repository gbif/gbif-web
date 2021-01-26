const { src, dest } = require('gulp');
const replace = require('gulp-replace');

exports.default = function() {
  return src('dist/*.html')
    .pipe(replace('<head>', '<head><meta name="robots" content="noindex" />'))
    .pipe(dest('dist/'));
}