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
        dataset: getFile(locale, `../${folder}/${locale}/components/dataset.json`),
        tableHeaders: getFile(locale, `../${folder}/${locale}/components/tableHeaders.json`),
        intervals: getFile(locale, `../${folder}/${locale}/components/intervals.json`),
        filters: getFile(locale, `../${folder}/${locale}/components/filters.json`),
        filterSupport: getFile(locale, `../${folder}/${locale}/components/filterSupport.json`),
        counts: getFile(locale, `../${folder}/${locale}/components/counts.json`),
        pagination: getFile(locale, `../${folder}/${locale}/components/pagination.json`),
      },
      enums: {
        basisOfRecord: getFile(locale, `../${folder}/${locale}/enums/basisOfRecord.json`),
        countryCode: getFile(locale, `../${folder}/${locale}/enums/countryCode.json`),
        mediaType: getFile(locale, `../${folder}/${locale}/enums/mediaType.json`),
        occurrenceIssue: getFile(locale, `../${folder}/${locale}/enums/occurrenceIssue.json`),
        typeStatus: getFile(locale, `../${folder}/${locale}/enums/typeStatus.json`),
        taxonRank: getFile(locale, `../${folder}/${locale}/enums/taxonRank.json`),
        taxonomicStatus: getFile(locale, `../${folder}/${locale}/enums/taxonomicStatus.json`),
        license: getFile(locale, `../${folder}/${locale}/enums/license.json`),
        month: getFile(locale, `../${folder}/${locale}/enums/month.json`),
        continent: getFile(locale, `../${folder}/${locale}/enums/continent.json`),
        endpointType: getFile(locale, `../${folder}/${locale}/enums/endpointType.json`),
        establishmentMeans: getFile(locale, `../${folder}/${locale}/enums/establishmentMeans.json`),
        occurrenceStatus: getFile(locale, `../${folder}/${locale}/enums/occurrenceStatus.json`),
        literatureType: getFile(locale, `../${folder}/${locale}/enums/literatureType.json`),
        role: getFile(locale, `../${folder}/${locale}/enums/role.json`),
        isInCluster: getFile(locale, `../${folder}/${locale}/enums/isInCluster.json`),
        datasetType: getFile(locale, `../${folder}/${locale}/enums/datasetType.json`),
        datasetSubtype: getFile(locale, `../${folder}/${locale}/enums/datasetSubtype.json`)
      }
    }
  );
  if (!keepEmptyStrings) {
    removeEmptyStrings(translations);
  }
  return translations;
}

function getFile(locale, file) {
  if (locale === 'developer-english' || fs.existsSync(path.join(__dirname, '..', `${file}.json`))) {
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
