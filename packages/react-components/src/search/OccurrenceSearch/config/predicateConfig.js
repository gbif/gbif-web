import get from 'lodash/get';
// import snakeCase from 'lodash/snakeCase';
// const enum_case = str => snakeCase(str || '').toUpperCase();

const filterConf = {
  preFilterTransform: filter => {
    const negativeIssues = filter?.must_not?.occurrenceIssue;
    if (negativeIssues && negativeIssues.every(i => (typeof i === "string"))) {
      return {
        must: {
          ...filter.must,
          notIssues: negativeIssues
        },
        must_not: {
          ...filter.must_not,
          occurrenceIssue: undefined
        },
      }
    }
    return filter;
  },
  fields: {
    coordinateUncertainty: {
      defaultKey: 'coordinateUncertaintyInMeters'
    },
    publisherKey: {
      defaultKey: 'publishingOrganizationKey'
    },
    recordedById: {
      defaultKey: 'recordedByIds_value'
    },
    identifiedById: {
      defaultKey: 'identifiedByIds_value'
    },
    occurrenceIssue: {
      defaultKey: 'issues'
    },
    geometry: {
      defaultType: 'within'
    },
    basisOfRecord: {
      defaultNegationKey: 'not_basisOfRecord'
      // preFilterTransform: ({ must, must_not }) => {
      //   const { negatedStrings, other } = partition(must_not, x => typeof x === 'string');
      //   const negated = negatedStrings.length > 0 ? { key: 'not_basisOfRecord', type: 'in', values: negatedStrings } : [];
      //   return {
      //     must: [...must, negated],
      //     must_not: other
      //   }
      // }
    }
  }
}

export default filterConf;