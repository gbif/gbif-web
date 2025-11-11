import { src, dest, parallel } from 'gulp';
import replace from 'gulp-replace';
import env from './.env.json' with { type: 'json' };

// add a file for the server to inject in the hosted portals as a script tag
async function include(cb) {
  // if no domain is specified, then assume this task can be ignored
  return src('gbif-components.inc')
    .pipe(replace('{{VERSION}}', 'deprecated'))
    .pipe(replace('{{DOMAIN}}', env.DOMAIN))
    .pipe(dest('dist/lib/'));
}

// add a file for the server to inject in the hosted portals as a script tag
async function includeJsModule(cb) {
  // if no domain is specified, then assume this task can be ignored
  const timestamp = new Date().toISOString().replace(/[-\.:]/g, '');
  return src('gbif-components-js-module.inc')
    .pipe(replace('{{VERSION}}', timestamp))
    .pipe(replace('{{LIB_DOMAIN}}', env.LIB_DOMAIN))
    .pipe(dest('dist/lib/'));
}

// add a file for the server to inject in the hosted portals as a script tag
async function includeCss(cb) {
  // if no domain is specified, then assume this task can be ignored
  const timestamp = new Date().toISOString().replace(/[-\.:]/g, '');

  return src('gbif-components-css.inc')
    .pipe(replace('{{VERSION}}', timestamp))
    .pipe(replace('{{LIB_DOMAIN}}', env.LIB_DOMAIN))
    .pipe(dest('dist/lib/'));
}

// copy over deprecated static library files
async function copyDeprecatedStaticLibraryFiles(cb) {
  return src('static-lib/**/*').pipe(dest('dist/lib/'));
}

export default parallel(include, includeJsModule, includeCss, copyDeprecatedStaticLibraryFiles);
