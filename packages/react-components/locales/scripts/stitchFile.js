'use strict';
let _ = require('lodash');
let fs = require('fs');
let path = require('path');

let Reset = '\x1b[0m';
let FgRed = '\x1b[31m';
let FgYellow = '\x1b[33m';

module.exports = builder;

function builder({ locale = 'en', folder = 'translations', keepEmptyStrings = false }) {
  let translations = _.merge(
    {},
    {
      dataset: getFile(locale, `../${folder}/${locale}/components/dataset`),
      apiHelp: getFile(locale, `../${folder}/${locale}/components/apiHelp`),
      publisher: getFile(locale, `../${folder}/${locale}/components/publisher`),
      collection: getFile(locale, `../${folder}/${locale}/components/collection`),
      installation: getFile(locale, `../${folder}/${locale}/components/installation`),
      network: getFile(locale, `../${folder}/${locale}/components/network`),
      grscicoll: getFile(locale, `../${folder}/${locale}/components/grscicoll`),
      institution: getFile(locale, `../${folder}/${locale}/components/institution`),
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
      taxon: getFile(locale, `../${folder}/${locale}/components/taxon`),
      footer: getFile(locale, `../${folder}/${locale}/components/footer`).footer,
      resourceSearch: getFile(locale, `../${folder}/${locale}/components/resourceSearch`)
        .resourceSearch,
      gbifNetwork: getFile(locale, `../${folder}/${locale}/components/gbifNetwork`).gbifNetwork,
      downloadKey: getFile(locale, `../${folder}/${locale}/components/downloads`).downloadKey,
      participant: getFile(locale, `../${folder}/${locale}/components/participant`).participant,
      customSqlDownload: getFile(locale, `../${folder}/${locale}/components/downloads`)
        .customSqlDownload,
      homepage: getFile(locale, `../${folder}/${locale}/components/homepage`).homepage,

      occurrenceFieldNames: getFile(
        locale,
        `../${folder}/${locale}/components/occurrenceFieldNames`,
      ),
      occurrenceDetails: getFile(locale, `../${folder}/${locale}/components/occurrenceDetails`),
      eventDetails: getFile(locale, `../${folder}/${locale}/components/eventDetails`),
      download: getFile(locale, `../${folder}/${locale}/components/download`),
      map: getFile(locale, `../${folder}/${locale}/components/map`),
      images: getFile(locale, `../${folder}/${locale}/components/images`),
      error: getFile(locale, `../${folder}/${locale}/components/error`),
      dashboard: getFile(locale, `../${folder}/${locale}/components/dashboard`),
      cms: getFile(locale, `../${folder}/${locale}/components/cms`),
      enums: {
        basisOfRecord: getFile(locale, `../${folder}/${locale}/enums/basisOfRecord`),
        countryCode: getFile(locale, `../${folder}/${locale}/enums/countryCode`),
        clusterReasons: getFile(locale, `../${folder}/${locale}/enums/clusterReasons`), // sourced from https://github.com/gbif/pipelines/blob/dev/sdks/core/src/main/java/org/gbif/pipelines/core/parsers/clustering/RelationshipAssertion.java#L16C1-L36C4
        downloadFormat: getFile(locale, `../${folder}/${locale}/enums/downloadFormat`)
          .downloadFormat,
        mediaType: getFile(locale, `../${folder}/${locale}/enums/mediaType`),
        occurrenceIssue: getFile(locale, `../${folder}/${locale}/enums/occurrenceIssue`),
        typeStatus: getFile(locale, `../${folder}/${locale}/enums/typeStatus`),
        taxonRank: getFile(locale, `../${folder}/${locale}/enums/taxonRank`),
        taxonomicStatus: getFile(locale, `../${folder}/${locale}/enums/taxonomicStatus`),
        taxonIssue: getFile(locale, `../${folder}/${locale}/enums/taxonIssue`),
        license: getFile(locale, `../${folder}/${locale}/enums/license`),
        issueHelp: getFile(locale, `../${folder}/${locale}/enums/issueHelp`),
        discipline: getFile(locale, `../${folder}/${locale}/enums/discipline`),
        institutionalGovernance: getFile(
          locale,
          `../${folder}/${locale}/enums/institutionalGovernance`,
        ),
        institutionType: getFile(locale, `../${folder}/${locale}/enums/institutionType`),
        month: getFile(locale, `../${folder}/${locale}/enums/month`),
        continent: getFile(locale, `../${folder}/${locale}/enums/continent`),
        language: getFile(locale, `../${folder}/${locale}/enums/language`),

        endpointType: getFile(locale, `../${folder}/${locale}/enums/endpointType`),
        installationType: getFile(locale, `../${folder}/${locale}/enums/installationType`),
        establishmentMeans: getFile(locale, `../${folder}/${locale}/enums/establishmentMeans`),
        occurrenceStatus: getFile(locale, `../${folder}/${locale}/enums/occurrenceStatus`),
        literatureType: getFile(locale, `../${folder}/${locale}/enums/literatureType`),
        role: getFile(locale, `../${folder}/${locale}/enums/role`),
        gbifRole: getFile(locale, `../${folder}/${locale}/enums/gbifRole`).gbifRole,
        isInCluster: getFile(locale, `../${folder}/${locale}/enums/isInCluster`),
        datasetType: getFile(locale, `../${folder}/${locale}/enums/datasetType`),
        datasetSubtype: getFile(locale, `../${folder}/${locale}/enums/datasetSubtype`),
        dwcaExtension: getFile(locale, `../${folder}/${locale}/enums/dwcaExtension`),
        identifierType: getFile(locale, `../${folder}/${locale}/enums/identifierType`),
        yesNo: getFile(locale, `../${folder}/${locale}/enums/yesNo`),
        threatStatus: getFile(locale, `../${folder}/${locale}/enums/threatStatus`),
        region: getFile(locale, `../${folder}/${locale}/enums/gbifRegion`).gbifRegion,
        iucnRedListCategory: getFile(locale, `../${folder}/${locale}/enums/iucnRedListCategory`),
        relevance: getFile(locale, `../${folder}/${locale}/enums/relevance`),
        topics: getFile(locale, `../${folder}/${locale}/enums/topics`),
        audiences: getFile(locale, `../${folder}/${locale}/enums/audiences`),
        purposes: getFile(locale, `../${folder}/${locale}/enums/purposes`),
        collectionContentType: getFile(
          locale,
          `../${folder}/${locale}/enums/collectionContentType`,
        ),
        preservationType: getFile(locale, `../${folder}/${locale}/enums/preservationType`),
        cms: getFile(locale, `../${folder}/${locale}/enums/cms`),
        // -- Add enums above this line (required by plopfile.js) --
      },
    },
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
      console.error(
        FgRed,
        `!The developers english version couldn't be found. Translation file ${file}.json not found. The file is referencing a not existing file. This should be fixed.`,
        Reset,
      );
    } else {
      console.log(
        FgYellow,
        `!Warning: Translation file ${file}.json not found. The translation will fall back to english then the developers original text`,
        Reset,
      );
    }
    return {};
  }
}

function removeEmptyStrings(obj) {
  _.each(obj, (val, key) => {
    if (typeof val === 'string' && val === '') {
      delete obj[key];
    } else if (typeof val === 'object') {
      removeEmptyStrings(obj[key]);
    }
  });
  return obj;
}
