'use strict';
let _ = require('lodash');
let fs = require('fs');
let path = require('path');

module.exports = builder;

function builder({ locale = 'en', folder = 'translations', keepEmptyStrings = false }) {
  let translations = _.merge(
    {},
    {
      components: {
        dataset: getFile(locale, `../${folder}/${locale}/components/dataset`),
        tableHeaders: getFile(locale, `../${folder}/${locale}/components/tableHeaders`),
        intervals: getFile(locale, `../${folder}/${locale}/components/intervals`),
        filters: getFile(locale, `../${folder}/${locale}/components/filters`),
        filterSupport: getFile(locale, `../${folder}/${locale}/components/filterSupport`),
        counts: getFile(locale, `../${folder}/${locale}/components/counts`),
        pagination: getFile(locale, `../${folder}/${locale}/components/pagination`),
      },
      enums: {
        basisOfRecord: getFile(locale, `../${folder}/${locale}/enums/basisOfRecord`),
        countryCode: getFile(locale, `../${folder}/${locale}/enums/countryCode`),
        mediaType: getFile(locale, `../${folder}/${locale}/enums/mediaType`),
        occurrenceIssue: getFile(locale, `../${folder}/${locale}/enums/occurrenceIssue`),
        typeStatus: getFile(locale, `../${folder}/${locale}/enums/typeStatus`),
        taxonRank: getFile(locale, `../${folder}/${locale}/enums/taxonRank`),
        taxonomicStatus: getFile(locale, `../${folder}/${locale}/enums/taxonomicStatus`),
        license: getFile(locale, `../${folder}/${locale}/enums/license`),
        month: getFile(locale, `../${folder}/${locale}/enums/month`),
        continent: getFile(locale, `../${folder}/${locale}/enums/continent`),
        endpointType: getFile(locale, `../${folder}/${locale}/enums/endpointType`),
        establishmentMeans: getFile(locale, `../${folder}/${locale}/enums/establishmentMeans`),
        occurrenceStatus: getFile(locale, `../${folder}/${locale}/enums/occurrenceStatus`),
        literatureType: getFile(locale, `../${folder}/${locale}/enums/literatureType`),
        role: getFile(locale, `../${folder}/${locale}/enums/role`),
        isInCluster: getFile(locale, `../${folder}/${locale}/enums/isInCluster`),
        datasetType: getFile(locale, `../${folder}/${locale}/enums/datasetType`),
        datasetSubtype: getFile(locale, `../${folder}/${locale}/enums/datasetSubtype`)
      }
    }
  );
  if (!keepEmptyStrings) {
    removeEmptyStrings(translations);
  }
  return translations;
}

function getFile(locale, file) {
  if (locale === 'developer-english' || fs.existsSync(path.join(__dirname, `${file}.json`))) {
    return require(file);
  } else {
    console.log(`!Warning: Translation file ${file}.json not found. The translation will fall back to english then the developers original text`);
    return {};
  }
}

function removeEmptyStrings(obj) {
  _.each(obj, (val, key) => {
    if (typeof val === 'string' && val === '') {
      delete obj[key];
    } else if (typeof (val) === 'object') {
      removeEmptyStrings(obj[key]);
    }
  });
  return obj;
}
