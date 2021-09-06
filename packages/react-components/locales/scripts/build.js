'use strict';
const flatten = require('flat');
const path = require('path');
const translationBuilder = require('./stitchFile');
const fs = require('fs');
const _ = require('lodash');

module.exports = build;

function build(locales) {
  const targetDirectory = path.normalize(__dirname + '/../_build/');
  ensureDirectoryExistence(targetDirectory + 'translation.json');

  let enJson = translationBuilder({locale: 'en'});
  let developerEnglishJson = translationBuilder({
    locale: 'developer-english', folder: 'source', keepEmptyStrings: true
  });

  buildLocale({locale: 'en', enJson, developerEnglishJson, targetDirectory});
  locales.forEach(locale => buildLocale({locale, enJson, developerEnglishJson, targetDirectory}));
}


function buildLocale({locale, enJson, developerEnglishJson, targetDirectory}) {
  let localeJson = translationBuilder({locale});
  let mergedJson = _.merge({}, developerEnglishJson, enJson, localeJson);
  let flat = flatten(mergedJson);
  fs.writeFile(targetDirectory + locale + '.json', JSON.stringify(flat, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation files was succesfully build');
  });
}

function ensureDirectoryExistence(filePath) {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

