'use strict';
const flatten = require('flat');
const path = require('path');
const translationBuilder = require('./stitchFile');
const createPseudo = require('./createPseudo');
const localeMaps = require('./localeMaps');
const fs = require('fs');
const _ = require('lodash');
const hash = require('object-hash');
const env = require('../../.env.json');

module.exports = build;

function build(locales) {
  const targetDirectory = path.normalize(__dirname + '/../dist/');
  ensureDirectoryExistence(targetDirectory + 'translation.json');

  let enJson = translationBuilder({ locale: 'en' });
  let developerEnglishJson = translationBuilder({
    locale: 'en-developer', folder: 'source', keepEmptyStrings: true
  });

  buildLocale({ locale: 'en', enJson, developerEnglishJson, targetDirectory });

  let translationVersions = {};
  locales
    .map(locale => buildLocale({ locale, enJson, developerEnglishJson, targetDirectory }))
    .forEach(item => {
      translationVersions[getLocaleName(item.locale)] = {
        messages: `${env.TRANSLATIONS}/${item.locale}.json?v=${item.hash}`,
        localeMap: localeMaps[item.locale]
      }
    });

  fs.writeFile(targetDirectory + 'translations.json', JSON.stringify(translationVersions, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation mapping file created');
  });
}

function getLocaleName(locale) {
  if (locale === 'en-pseudo') {
    return 'en-ZZ';
  } else if (locale === 'en-developer') {
    return 'en-DK';
  }
  return locale;
}

function buildLocale({ locale, enJson, developerEnglishJson, targetDirectory }) {
  let localeJson;
  if (locale === 'en-pseudo') {
    localeJson = createPseudo(developerEnglishJson);
  } else if (locale === 'en-developer') {
    localeJson = developerEnglishJson;
  } else {
    localeJson = translationBuilder({ locale });
  }
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
