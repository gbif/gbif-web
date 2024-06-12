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

  // for dev environments we want to use a timestamp instead of a hash since we do not have access to the hash as we are temporarily using dev to test the new library
  const isDev = env.DOMAIN.includes('-dev.org');

  if (isDev) {
    const timestamp = (new Date()).toISOString().replace(/[-\.:]/g, '');

    return src('new-gbif-components.inc')
    .pipe(rename(function (path) {
      // Updates the object in-place
      path.basename = "gbif-components";
    }))
    .pipe(replace('{{VERSION}}', timestamp))
    .pipe(dest('dist/lib/'));
  } else {
    return src('gbif-components.inc')
      .pipe(replace('{{VERSION}}', hash))
      .pipe(replace('{{DOMAIN}}', env.DOMAIN))
      .pipe(dest('dist/lib/'));
  }
}

async function copyTranslations(cb) {
  src(['locales/dist/**/*']).pipe(dest('dist/lib/translations'));
}

exports.default = parallel(noIndex, include, copyTranslations);

