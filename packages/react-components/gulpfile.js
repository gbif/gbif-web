const { src, dest, parallel } = require('gulp');
const replace = require('gulp-replace');
const gulpif = require('gulp-if');
const md5File = require('md5-file');
const env = require('./.env.json');

// we don't really care to index our storybook
function noIndex() {
  return src('dist/*.html')
    .pipe(replace('<head>', '<head><meta name="robots" content="noindex" />'))
    .pipe(dest('dist/'))
}

// add a file for the server to inject in the hosted portals as a script tag
async function include(cb) {
  // if no domain is specified, then assume this task can be ignored
  if (!env.DOMAIN) return cb();
  
  const hash = await md5File('dist/lib/gbif-react-components.js');

  return src('gbif-components.inc')
    .pipe(replace('{{VERSION}}', hash))
    .pipe(replace('{{DOMAIN}}', env.DOMAIN))
    .pipe(dest('dist/lib/'));
}

async function copyTranslations(cb) {
  src(['locales/dist/**/*']).pipe(dest('dist/lib/translations'));
}

exports.default = parallel(noIndex, include, copyTranslations);

