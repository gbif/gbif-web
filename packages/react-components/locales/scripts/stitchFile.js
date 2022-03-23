'use strict';
let _ = require('lodash');
let fs = require('fs');
let path = require('path');

let Reset = "\x1b[0m";
let FgRed = "\x1b[31m";
let FgYellow = "\x1b[33m";

module.exports = builder;

function builder({ locale = 'en', folder = 'translations', keepEmptyStrings = false }) {
  let translations = _.merge(
    {},
    {
      dataset: getFile(locale, `../${folder}/${locale}/components/dataset`),
      catalogues: getFile(locale, `../${folder}/${locale}/components/catalogues`),
      tableHeaders: getFile(locale, `../${folder}/${locale}/components/tableHeaders`),
      intervals: getFile(locale, `../${folder}/${locale}/components/intervals`),
      filters: getFile(locale, `../${folder}/${locale}/components/filters`),
      filterSupport: getFile(locale, `../${folder}/${locale}/components/filterSupport`),
      counts: getFile(locale, `../${folder}/${locale}/components/counts`),
      contact: getFile(locale, `../${folder}/${locale}/components/contact`),
      pagination: getFile(locale, `../${folder}/${locale}/components/pagination`),
      search: getFile(locale, `../${folder}/${locale}/components/search`),
      phrases: getFile(locale, `../${folder}/${locale}/components/phrases`),
      occurrenceFieldNames: getFile(locale, `../${folder}/${locale}/components/occurrenceFieldNames`),
      occurrenceDetails: getFile(locale, `../${folder}/${locale}/components/occurrenceDetails`),
      download: getFile(locale, `../${folder}/${locale}/components/download`),
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
        datasetSubtype: getFile(locale, `../${folder}/${locale}/enums/datasetSubtype`),
        dwcaExtension: getFile(locale, `../${folder}/${locale}/enums/dwcaExtension`),
  // -- Add enums above this line (required by plopfile.js) --
      }
    }
  );
  if (!keepEmptyStrings) {
    removeEmptyStrings(translations);
  }
  return translations;
}

function getFile(locale, file) {
  if (fs.existsSync(path.join(__dirname, `${file}.json`))) {
    return require(file);
  } else {
    if (locale === 'en-developer') {
      console.error(FgRed, `!The developers english version couldn't be found. Translation file ${file}.json not found. The file is referencing a not existing file. This should be fixed.`, Reset);
    } else {
      console.log(FgYellow, `!Warning: Translation file ${file}.json not found. The translation will fall back to english then the developers original text`, Reset);
    }
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
