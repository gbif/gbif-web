import { expect, test } from 'vitest';
import { filter2v1 } from './filter2v1';
import { PredicateType } from '@/gql/graphql';

test('is handles basic arrays', () => {
  expect(
    filter2v1(
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
    filter: {
      taxonKey: [1, 2, 3],
    },
  });
});

test('it can map to single values', () => {
  expect(
    filter2v1(
      {
        must: {
          taxonKey: [1],
        },
      },
      {
        fields: {
          taxonKey: {
            singleValue: true,
          },
        },
      }
    )
  ).toEqual({
    filter: {
      taxonKey: 1,
    },
  });
});

test('it can handle strings and numbers and booleans', () => {
  expect(
    filter2v1(
      {
        must: {
          taxonKey: [1],
          datasetKey: ['abc', 'def'],
          repatriated: [true],
        },
      },
      {
        fields: {
          repatriated: {
            singleValue: true,
          },
        },
      }
    )
  ).toEqual({
    filter: {
      taxonKey: [1],
      datasetKey: ['abc', 'def'],
      repatriated: true,
    },
  });
});

test('it can rename fields', () => {
  expect(
    filter2v1(
      {
        must: {
          publisher: ['abc'],
        },
      },
      {
        fields: {
          publisher: {
            defaultKey: 'publishingOrgKey',
          },
        },
      }
    )
  ).toEqual({
    errors: undefined,
    filter: {
      publishingOrgKey: ['abc'],
    },
  });
});

test('it can handle ranges', () => {
  expect(
    filter2v1(
      {
        must: {
          year: [{ value: { gte: 2000, lte: 2010 } }],
        },
      },
      {
        fields: {
          year: {
            defaultType: PredicateType.Range,
            v1: {
              supportedTypes: ['range'],
            },
          },
        },
      }
    )
  ).toEqual({
    filter: {
      year: ['2000,2010'],
    },
  });

  expect(
    filter2v1(
      {
        must: {
          year: [{ value: { gte: 2000 } }],
        },
      },
      {
        fields: {
          year: {
            defaultType: PredicateType.Range,
            v1: {
              supportedTypes: ['range'],
            },
          },
        },
      }
    )
  ).toEqual({
    errors: undefined,
    filter: {
      year: ['2000,*'],
    },
  });

  expect(
    filter2v1(
      {
        must: {
          year: [1900],
        },
      },
      {
        fields: {
          year: {
            defaultType: PredicateType.Range,
            v1: {
              supportedTypes: ['range'],
            },
          },
        },
      }
    )
  ).toEqual({
    errors: undefined,
    filter: {
      year: [1900],
    },
  });
});

test('it can handle like filters', () => {
  expect(
    filter2v1(
      {
        must: {
          recordedBy: ['abc', { type: PredicateType.Like, value: 'def*' }],
        },
      },
      {
        fields: {
          recordedBy: {
            v1: {
              supportedTypes: ['equals', 'like'],
            },
          },
        },
      }
    )
  ).toEqual({
    errors: undefined,
    filter: {
      recordedBy: ['abc', 'def*'],
    },
  });
});

test('it can handle geoDistance filter', () => {
  expect(
    filter2v1(
      {
        must: {
          fromPoint: [
            { type: PredicateType.GeoDistance, latitude: 1, longitude: 2, distance: 100 },
          ],
        },
      },
      {
        fields: {
          fromPoint: {
            defaultKey: 'geoPoint',
            defaultType: PredicateType.GeoDistance,
            v1: {
              supportedTypes: ['geoDistance'],
            },
          },
        },
      }
    )
  ).toEqual({
    errors: undefined,
    filter: {
      geoPoint: ['1,2,100'],
    },
  });
});

test('it will fail on unknown types', () => {
  expect(
    filter2v1(
      {
        must: {
          taxonKey: [{ test: 5 }],
        },
      },
      {
        fields: {
          taxonKey: {
            // ignore typescript warning in next line as it is intended to be an invalid type
            // @ts-ignore
            defaultType: 'someType',
          },
        },
      }
    )
  ).toEqual({
    errors: [
      {
        errorType: 'INVALID_PREDICATE_TYPE',
        filterName: 'taxonKey',
        type: 'someType',
      },
    ],
    filter: {},
  });

  expect(
    filter2v1({
      must: {
        // ignore typescript warning in next line as it is intended to be an invalid type
        // @ts-ignore
        taxonKey: [{ type: 'someType', test: 5 }],
      },
    })
  ).toEqual({
    errors: [
      {
        errorType: 'INVALID_PREDICATE_TYPE',
        filterName: 'taxonKey',
        type: 'someType',
      },
    ],
    filter: {},
  });
});
