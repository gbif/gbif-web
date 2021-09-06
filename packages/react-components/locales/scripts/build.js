'use strict';
const flatten = require('flat');
const path = require('path');
const translationBuilder = require('./stitchFile');
const fs = require('fs');
const _ = require('lodash');
const hash = require('object-hash');

module.exports = build;

function build(locales) {
  const targetDirectory = path.normalize(__dirname + '/../_build/');
  ensureDirectoryExistence(targetDirectory + 'translation.json');

  let enJson = translationBuilder({ locale: 'en' });
  let developerEnglishJson = translationBuilder({
    locale: 'developer-english', folder: 'source', keepEmptyStrings: true
  });

  buildLocale({ locale: 'en', enJson, developerEnglishJson, targetDirectory });
  let translationVersions = {};
  locales
    .map(locale => buildLocale({ locale, enJson, developerEnglishJson, targetDirectory }))
    .forEach(item => translationVersions[item.locale] = `${item.locale}.json?v=${item.hash}`);
  console.log(translationVersions);
  
  fs.writeFile(targetDirectory + 'translations.json', JSON.stringify(translationVersions, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation mapping file created');
  });
}


function buildLocale({ locale, enJson, developerEnglishJson, targetDirectory }) {
  let localeJson = translationBuilder({ locale });
  let mergedJson = _.merge({}, developerEnglishJson, enJson, localeJson);
  let flat = flatten(mergedJson);
  fs.writeFile(targetDirectory + locale + '.json', JSON.stringify(flat, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation files was succesfully build');
  });
  return { locale, hash: hash(flat) };
}

function ensureDirectoryExistence(filePath) {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

