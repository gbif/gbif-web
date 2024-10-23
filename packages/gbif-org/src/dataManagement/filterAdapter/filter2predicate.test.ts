import { expect, test } from 'vitest';
import { filter2predicate } from './filter2predicate';
import { PredicateType } from '@/gql/graphql';

test('is handles basic arrays', () => {
  expect(
    filter2predicate(
      {
        must: {
          taxonKey: [1, 2, 3],
        },
      },
      {
        fields: {
          taxonKey: {
            defaultKey: 'taxonKey',
          },
        },
      }
    )
  ).toEqual({
    key: 'taxonKey',
    type: 'in',
    values: [1, 2, 3],
  });

  expect(
    filter2predicate(
      {
        must: {
          datasetKey: ['asd', 'fgh'],
        },
      },
      {
        fields: {
          taxonKey: {
            defaultKey: 'taxonKey',
          },
        },
      }
    )
  ).toEqual({
    key: 'datasetKey',
    type: 'in',
    values: ['asd', 'fgh'],
  });
});

test('it has sensible defaults if no config provided', () => {
  expect(
    filter2predicate(
      {
        must: {
          taxonKey: [1, 2, 3],
        },
      }
    )
  ).toEqual({
    key: 'taxonKey',
    type: 'in',
    values: [1, 2, 3],
  });
});

test('it defaults to field name fore predicate keys', () => {
  expect(
    filter2predicate(
      {
        must: {
          datasetKey: ['asd', 'fgh'],
        },
      }
    )
  ).toEqual({
    key: 'datasetKey',
    type: 'in',
    values: ['asd', 'fgh'],
  });
});

test('it allows renaming the field name', () => {
  expect(
    filter2predicate(
      {
        must: {
          datasetKey: ['asd', 'fgh'],
        },
      },
      {
        fields: {
          datasetKey: {
            defaultKey: 'DATASET_KEY',
          },
        },
      }
    )
  ).toEqual({
    key: 'DATASET_KEY',
    type: 'in',
    values: ['asd', 'fgh'],
  });
});

test('it can default to a predicate type based on config', () => {
  expect(
    filter2predicate(
      {
        must: {
          recordedBy: ['tim', 'robert'],
        },
      },
      {
        fields: {
          recordedBy: {
            defaultType: PredicateType.Like,
          },
        },
      }
    )
  ).toEqual({
    type: 'or',
    predicates: [
      {
        key: 'recordedBy',
        type: 'like',
        value: 'tim',
      },
      {
        key: 'recordedBy',
        type: 'like',
        value: 'robert',
      },
    ],
  });
});

test('it can mix plain values with objects', () => {
  expect(
    filter2predicate(
      {
        must: {
          recordedBy: ['tim', { type: PredicateType.Like, value: 'robert' }],
        },
      }
    )
  ).toEqual({
    type: 'or',
    predicates: [
      {
        key: 'recordedBy',
        type: 'equals', // one is equal as that is the default
        value: 'tim',
      },
      {
        key: 'recordedBy',
        type: 'like', // the other a like because an explicit type was provided in the filter
        value: 'robert',
      },
    ],
  });
});

test('it can transform values', () => {
  expect(
    filter2predicate(
      {
        must: {
          basisOfRecord: ['human_observation', 'fossil_specimen'],
        },
      },
      {
        fields: {
          basisOfRecord: {
            transformValue: (v) => v.toUpperCase(),
          },
        },
      }
    )
  ).toEqual({
    key: 'basisOfRecord',
    type: 'in',
    values: ['HUMAN_OBSERVATION', 'FOSSIL_SPECIMEN'],
  });
});

test('it can define a custom serializer', () => {
  expect(
    filter2predicate(
      {
        must: {
          notIssues: ['wrong_location', 'wrong_taxon'],
        },
      },
      {
        fields: {
          notIssues: { // normally this would turn into an 'in' predicate. So an OR of the valuesm but we want an AND in this example
            serializer: ({values}) => ({
              type: PredicateType.And, predicates: values.map(x => ({ type: PredicateType.Equals, key: 'notIssues', value: x }))
            })
          }
        },
      }
    )
  ).toEqual({
    type: 'and',
    predicates: [
      {
        type: 'equals',
        key: 'notIssues',
        value: 'wrong_location',
      },
      {
        type: 'equals',
        key: 'notIssues',
        value: 'wrong_taxon',
      },
    ]
  });
});

test('it can do pre transformations of the filter', () => {
  expect(
    filter2predicate(
      {
        must: {
          taxonKey: [1],
        },
      },
      {
        preFilterTransform: (filter) => {
          return {
            must: {
              ...filter.must,
              customField: ['always_there'],
            },
            mustNot: {
              ...filter.mustNot,
            },
          };
        },
        fields: {
          noMatter: {},
        },
      }
    )
  ).toEqual({
    type: 'and',
    predicates: [
      {
        key: 'taxonKey',
        type: 'in',
        values: [1],
      },
      {
        key: 'customField',
        type: 'in',
        values: ['always_there'],
      },
    ],
  });
});

// TODO: we need tests (and code) for isNull, isNotNull, geometry, ranges, booleans, negations.
// But it doens't make sense to write them until we have migrated the search to use the 
// predicate structure we have in the official API
