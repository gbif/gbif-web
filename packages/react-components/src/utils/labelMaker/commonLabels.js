import { rangeOrEqualLabel } from './rangeOrEqualLabel';
import React from 'react';

export const commonLabels = {
  basisOfRecord: {
    type: 'TRANSLATION',
    template: id => `enums.basisOfRecord.${id}`
  },
  typeStatus: {
    type: 'TRANSLATION',
    template: id => `enums.typeStatus.${id}`
  },
  institutionCode: {
    type: 'TRANSLATION',
    template: id => id
  },
  mediaType: {
    type: 'TRANSLATION',
    template: id => `enums.mediaType.${id}`
  },
  occurrenceIssue: {
    type: 'TRANSLATION',
    template: id => `enums.occurrenceIssue.${id}`
  },
  countryCode: {
    type: 'TRANSLATION',
    template: id => `enums.countryCode.${id}`
  },
  number: {
    type: 'TRANSFORM',
    transform: ({ id, locale }) => id.toLocaleString(locale)
  },
  taxonKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      taxon(key: $id) {
        formattedName
      }
    }`,
    transform: result => ({ title: result.data.taxon.formattedName }),
    isHtmlResponse: true
  },
  q: {
    type: 'TRANSFORM',
    transform: ({ id, locale }) => `"${id}"`
  },
  canonicalName: {
    type: 'GQL',
    query: `query label($id: ID!){
      taxon(key: $id) {
        canonicalName
      }
    }`,
    transform: result => ({ title: result.data.taxon.canonicalName }),
  },
  publisherKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/organization/${id}`,
    transform: result => ({ title: result.title })
  },
  hostingOrganizationKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/organization/${id}`,
    transform: result => ({ title: result.title })
  },
  datasetKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      dataset(key: $id) {
        title
      }
    }`,
    transform: result => result.data.dataset,
  },
  year: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactTime')
  },
  coordinateUncertainty: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactMeters')
  },
  depth: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactMeters')
  },
  organismQuantity: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact')
  },
  sampleSizeValue: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact')
  },
  relativeOrganismQuantity: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compact')
  },
  month: {
    type: 'TRANSLATION',
    template: id => `enums.month.${id}`
  },
  continent: {
    type: 'TRANSLATION',
    template: id => `enums.continent.${id}`
  },
  protocol: {
    type: 'TRANSLATION',
    template: id => `enums.protocol.${id}`
  },
  literatureType: {
    type: 'TRANSLATION',
    template: id => `enums.literatureType.${id}`
  },
  establishmentMeans: {
    type: 'TRANSLATION',
    template: id => `enums.establishmentMeans.${id}`
  },
  establishmentMeansVocabulary: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/vocabularies/EstablishmentMeans/concepts/${id}`,
    transform: (result, { localeContext } = {}) => {
      const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
      return { title: result.label[vocabularyLocale] || result.label.en };
    }
  },
  catalogNumber: {
    type: 'TRANSLATION',
    template: id => id
  },
  recordNumber: {
    type: 'TRANSLATION',
    template: id => id
  },
  elevation: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('intervals.compactMeters')
  },
  occurrenceStatus: {
    type: 'TRANSLATION',
    template: id => `enums.occurrenceStatus.${id}`
  },
  gadmGid: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/geocode/gadm/${id}`,
    transform: result => ({ title: result.name })
  },
  isInCluster: {
    type: 'TRANSLATION',
    template: id => `enums.isInCluster.${id}`
  },
  datasetType: {
    type: 'TRANSLATION',
    template: id => `enums.datasetType.${id}`
  },
  datasetSubtype: {
    type: 'TRANSLATION',
    template: id => `enums.datasetSubtype.${id}`
  },
  institutionKey: {
    type: 'GQL',
    query: `query label($id: String!){
      institution(key: $id) {
        name
      }
    }`,
    transform: result => ({ title: result.data.institution.name })
  },
  networkKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/network/${id}`,
    transform: result => ({ title: result.title })
  },
  literatureType: {
    type: 'TRANSLATION',
    template: id => `enums.literatureType.${id}`
  },
  dwcaExtension: {
    type: 'TRANSLATION',
    template: id => `enums.dwcaExtension.${id}`
  },
  // -- Add labels above this line (required by plopfile.js) --
}