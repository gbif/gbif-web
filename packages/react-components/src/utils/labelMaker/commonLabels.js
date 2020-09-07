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
  catalogNumber: {
    type: 'TRANSLATION',
    template: id => id
  },
  mediaTypes: {
    type: 'TRANSLATION',
    template: id => `enums.mediaTypes.${id}`
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
    query: `query label($id: Int!){
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
    query: `query label($id: Int!){
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
  hostKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/organization/${id}`,
    transform: result => ({ title: result.title })
  },
  datasetKey: {
    type: 'GQL',
    query: `query label($id: String!){
      dataset(key: $id) {
        title
      }
    }`,
    transform: result => result.data.dataset,
  },
  year: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('interval.year')
  },
}