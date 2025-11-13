import { flatten } from 'flat';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import translationBuilder from './stitchFile.js';
import createPseudo from './createPseudo.js';
import fs, { readFileSync } from 'fs';
import _ from 'lodash';
import hash from 'object-hash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localeMaps = JSON.parse(readFileSync(join(__dirname, './localeMaps.json'), 'utf8'));
const env = JSON.parse(readFileSync(join(__dirname, '../../.env.json'), 'utf8'));

function build(locales) {
  const targetDirectory = path.normalize(__dirname + '/../../dist/lib/translations/');
  ensureDirectoryExistence(targetDirectory + 'translation.json');

  let enJson = translationBuilder({ locale: 'en' });
  let developerEnglishJson = translationBuilder({
    locale: 'en-developer',
    folder: 'source',
    keepEmptyStrings: true,
  });

  buildLocale({ locale: 'en', enJson, developerEnglishJson, targetDirectory });

  let translationVersions = {};

  // iterate over locales except 'en-developer', 'en-pseudo', 'en'
  const fullLocales = ['en-developer', 'en-pseudo', 'en'];
  locales
    .map((locale) =>
      buildLocale({
        locale,
        enJson,
        developerEnglishJson,
        targetDirectory,
        onlyIncludeExstingKeys: !fullLocales.includes(locale),
      }),
    )
    .forEach((item) => {
      translationVersions[getLocaleName(item.locale)] = {
        messages: `${env.TRANSLATIONS}/${item.locale}.json?v=${item.hash}`,
        localeMap: localeMaps[item.locale],
      };
    });

  fs.writeFile(
    targetDirectory + 'translations.json',
    JSON.stringify(translationVersions, null, 2),
    function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('Translation mapping file created');
    },
  );
}

function getLocaleName(locale) {
  if (locale === 'en-pseudo') {
    return 'en-ZZ';
  } else if (locale === 'en-developer') {
    return 'en-DK';
  }
  return locale;
}

function buildLocale({
  locale,
  enJson,
  developerEnglishJson,
  targetDirectory,
  onlyIncludeExstingKeys,
}) {
  let localeJson;
  if (locale === 'en-pseudo') {
    localeJson = createPseudo(developerEnglishJson);
  } else if (locale === 'en-developer') {
    localeJson = developerEnglishJson;
  } else {
    localeJson = translationBuilder({ locale });
  }
  let flat = _.merge({}, flatten(developerEnglishJson), flatten(enJson), flatten(localeJson));

  // use lodash to pick only keys that exist in enJson and developerEnglishJson. it has to exist in both of them
  if (onlyIncludeExstingKeys) {
    let en_flat = flatten(enJson);
    let developerEnglish_flat = flatten(developerEnglishJson);
    flat = _.pickBy(flat, (value, key) => {
      return en_flat.hasOwnProperty(key) && developerEnglish_flat.hasOwnProperty(key);
    });
    flat = _.merge({}, developerEnglish_flat, en_flat, flat);
  }

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

export default build;
