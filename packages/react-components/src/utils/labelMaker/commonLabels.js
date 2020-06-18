import { rangeOrEqualLabel } from './rangeOrEqualLabel';

export const commonLabels = {
  basisOfRecord: {
    type: 'TRANSLATION',
    template: id => `enums.basisOfRecord.${id}`
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