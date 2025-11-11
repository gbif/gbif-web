import React from 'react';
import { rangeOrEqualLabel } from './rangeOrEqualLabel';

export const commonLabels = {
  basisOfRecord: {
    type: 'TRANSLATION',
    template: (id) => `enums.basisOfRecord.${id}`,
  },
  topics: {
    type: 'TRANSLATION',
    template: (id) => `enums.topics.${id}`,
  },
  relevance: {
    type: 'TRANSLATION',
    template: (id) => `enums.relevance.${id}`,
  },
  typeStatus: {
    type: 'TRANSLATION',
    template: (id) => `enums.typeStatus.${id}`,
  },
  institutionCode: {
    type: 'TRANSLATION',
    template: (id) => id,
  },
  mediaType: {
    type: 'TRANSLATION',
    template: (id) => `enums.mediaType.${id}`,
  },
  occurrenceIssue: {
    type: 'TRANSLATION',
    template: (id) => `enums.occurrenceIssue.${id}`,
  },
  countryCode: {
    type: 'TRANSLATION',
    template: (id) => `enums.countryCode.${id}`,
  },
  number: {
    type: 'TRANSFORM',
    transform: ({ id, locale }) => id.toLocaleString(locale),
  },
  taxonKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      taxon(key: $id) {
        formattedName
      }
    }`,
    transform: (result) => ({ title: result.data.taxon.formattedName }),
    isHtmlResponse: true,
  },
  q: {
    type: 'TRANSFORM',
    transform: ({ id, locale }) => `"${id}"`,
  },
  canonicalName: {
    type: 'GQL',
    query: `query label($id: ID!){
      taxon(key: $id) {
        canonicalName
        scientificName
      }
    }`,
    transform: (result) => ({
      title: result.data.taxon.canonicalName || result.data.taxon.scientificName,
    }),
  },
  publisherKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/organization/${id}`,
    transform: (result) => ({ title: result.title }),
  },
  hostingOrganizationKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/organization/${id}`,
    transform: (result) => ({ title: result.title }),
  },
  eventDatasetKey: {
    type: 'GQL',
    query: `query label($id: JSON!){
      eventSearch(predicate: {type:equals, key: "datasetKey", value: $id}) {
        documents(size: 1) {
          results {
            datasetTitle
          }
        }
      }
    }`,
    transform: (result) => ({ title: result.data.eventSearch.documents.results[0].datasetTitle }),
  },
  datasetKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      dataset(key: $id) {
        title
      }
    }`,
    transform: (result) => result.data.dataset,
  },
  year: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactTime'),
  },
  coordinateUncertainty: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactMeters'),
  },
  depth: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactMeters'),
  },
  interval: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact'),
  },
  measurementOrFactCount: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact'),
  },
  organismQuantity: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact'),
  },
  sampleSizeValue: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact'),
  },
  relativeOrganismQuantity: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact'),
  },
  month: {
    type: 'TRANSLATION',
    template: (id) => `enums.month.${id}`,
  },
  continent: {
    type: 'TRANSLATION',
    template: (id) => `enums.continent.${id}`,
  },
  protocol: {
    type: 'TRANSLATION',
    template: (id) => `enums.protocol.${id}`,
  },
  establishmentMeans: {
    type: 'TRANSLATION',
    template: (id) => `enums.establishmentMeans.${id}`,
  },
  establishmentMeansVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/EstablishmentMeans/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  typeStatusVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/TypeStatus/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  eventTypeVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/EventType/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  institutionalGovernanceVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) =>
      `${api.v1.endpoint}/vocabularies/InstitutionalGovernance/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  disciplineVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/Discipline/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  institutionTypeVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/InstitutionType/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  accessionStatusVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/AccessionStatus/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  collectionContentTypeVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) =>
      `${api.v1.endpoint}/vocabularies/CollectionContentType/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  preservationTypeVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/PreservationType/concepts/${id}`,
    transform: getVocabularyLabel,
  },
  catalogNumber: {
    type: 'TRANSLATION',
    template: (id) => id,
  },
  recordNumber: {
    type: 'TRANSLATION',
    template: (id) => id,
  },
  elevation: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactMeters'),
  },
  occurrenceStatus: {
    type: 'TRANSLATION',
    template: (id) => `enums.occurrenceStatus.${id}`,
  },
  gadmGid: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/geocode/gadm/${id}`,
    transform: (result) => ({ title: result.name }),
  },
  isInCluster: {
    type: 'TRANSLATION',
    template: (id) => `enums.isInCluster.${id}`,
  },
  yesNo: {
    type: 'TRANSLATION',
    template: (id) => `enums.yesNo.${id}`,
  },
  datasetType: {
    type: 'TRANSLATION',
    template: (id) => `enums.datasetType.${id}`,
  },
  datasetSubtype: {
    type: 'TRANSLATION',
    template: (id) => `enums.datasetSubtype.${id}`,
  },
  iucnRedListCategory: {
    type: 'TRANSLATION',
    template: (id) => `enums.iucnRedListCategory.${id}`,
  },
  institutionKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      institution(key: $id) {
        name
      }
    }`,
    transform: (result) => ({ title: result.data.institution.name }),
  },
  collectionKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      collection(key: $id) {
        name
      }
    }`,
    transform: (result) => ({ title: result.data.collection.name }),
  },
  networkKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/network/${id}`,
    transform: (result) => ({ title: result.title }),
  },
  literatureType: {
    type: 'TRANSLATION',
    template: (id) => `enums.literatureType.${id}`,
  },
  dwcaExtension: {
    type: 'TRANSLATION',
    template: (id) => `enums.dwcaExtension.${id}`,
  },
  locationId: {
    type: 'TRANSFORM',
    transform: ({ id }) => id,
  },
  numberSpecimens: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact'),
  },
  // geoDistance: {
  //   type: 'TRANSLATION_VALUES',
  //   template: 'intervals.geoDistance.short'
  // },
  geoDistance: {
    type: 'CUSTOM',
    component: ({ id }) => {
      const { distance, latitude, longitude } = id;
      return formatCoordinates({ lat: latitude, lng: longitude, locale: 'en' }) + ' ±' + distance;
    },
  },
  identityFn: {
    type: 'TRANSFORM',
    transform: ({ id }) => id.value || id,
  },
  wildcard: {
    type: 'CUSTOM',
    component: ({ id }) => {
      const value = id?.value || id;
      const trimmed = value.trim();
      const displayValue = trimmed.length !== value.length ? `"${value}"` : value;

      if (id.type === 'like' && typeof id.value === 'string') {
        return <i>{displayValue}</i>;
      }

      return displayValue;
    },
  },
  threatStatus: {
    type: 'TRANSLATION',
    template: (id) => `enums.threatStatus.${id}`,
  },
  collectionContentType: {
    type: 'TRANSLATION',
    template: (id) => `enums.collectionContentType.${id}`,
  },
  preservationType: {
    type: 'TRANSLATION',
    template: (id) => `enums.preservationType.${id}`,
  },
  // -- Add labels above this line (required by plopfile.js) --
};

function getVocabularyLabel(result, { localeContext } = {}) {
  const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';

  // transform result labels to an object with language as keys
  const labels = result.label.reduce((acc, label) => {
    acc[label.language] = label.value;
    return acc;
  }, {});

  let title = labels[vocabularyLocale] || labels.en || result.name || 'Unknown';
  return { title };
}

function formatCoordinates({ lat, lng, locale }) {
  if (isNaN(lat) || isNaN(lng)) {
    return 'Invalid coordinates';
  } else {
    // return as formatted number
    const latString = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
      Number(lat),
    );
    const lngString = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
      Number(lng),
    );
    const la = latString + (lat < 0 ? 'S' : 'N');
    var lo = lngString + (lng < 0 ? 'W' : 'E');
    return la + ', ' + lo;
  }
}
