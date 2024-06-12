const { src, dest, parallel } = require('gulp');
const replace = require('gulp-replace');
var rename = require("gulp-rename");
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

// add a file for the server to inject in the hosted portals as a script tag
async function includeJsModule(cb) {
  // if no domain is specified, then assume this task can be ignored
  if (!env.DOMAIN) return cb();
  const timestamp = (new Date()).toISOString().replace(/[-\.:]/g, '');

  return src('gbif-components-js-module.inc')
    .pipe(replace('{{VERSION}}', timestamp))
    .pipe(replace('{{LIB_DOMAIN}}', env.LIB_DOMAIN))
    .pipe(dest('dist/lib/'));
}

// add a file for the server to inject in the hosted portals as a script tag
async function includeCss(cb) {
  // if no domain is specified, then assume this task can be ignored
  if (!env.DOMAIN) return cb();
  const timestamp = (new Date()).toISOString().replace(/[-\.:]/g, '');

  return src('gbif-components-css.inc')
    .pipe(replace('{{VERSION}}', timestamp))
    .pipe(replace('{{LIB_DOMAIN}}', env.LIB_DOMAIN))
    .pipe(dest('dist/lib/'));
}

async function copyTranslations(cb) {
  src(['locales/dist/**/*']).pipe(dest('dist/lib/translations'));
}

exports.default = parallel(noIndex, include, includeJsModule, includeCss, copyTranslations);

