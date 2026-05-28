/* eslint-env mocha */
import { deepEqual } from 'assert';
import predicate2v1 from './predicate2v1';

describe('Array', () => {
  describe('#predicate2v1()', () => {
    it('should strip pointless nesting', () => {
      const pIn = {
        type: 'and',
        predicates: [
          {
            type: 'in',
            key: 'issue',
            values: ['ZERO_COORDINATE'],
          },
        ],
      };
      const pExpected = {
        err: null,
        predicate: {
          type: 'in',
          key: 'ISSUE',
          values: ['ZERO_COORDINATE'],
        },
      };
      predicate2v1();
      deepEqual(predicate2v1(pIn), pExpected);
    });
  });
});

describe('Array', () => {
  describe('#predicate2v1()', () => {
    it('should handle not', () => {
      const pIn = {
        type: 'not',
        predicate: {
          type: 'in',
          key: 'issue',
          values: ['ZERO_COORDINATE'],
        },
      };
      const pExpected = {
        err: null,
        predicate: {
          type: 'not',
          predicate: {
            type: 'in',
            key: 'ISSUE',
            values: ['ZERO_COORDINATE'],
          },
        },
      };
      predicate2v1();
      deepEqual(predicate2v1(pIn), pExpected);
    });
  });
});

describe('Array', () => {
  describe('#predicate2v1()', () => {
    it('should convert range types to an AND predicate', () => {
      const pIn = {
        type: 'range',
        key: 'year',
        value: {
          gte: 1900,
          lte: 2000,
        },
      };
      const pExpected = {
        err: null,
        predicate: {
          type: 'and',
          predicates: [
            {
              type: 'greaterThanOrEquals',
              key: 'YEAR',
              value: 1900,
            },
            {
              type: 'lessThanOrEquals',
              key: 'YEAR',
              value: 2000,
            },
          ],
        },
      };
      predicate2v1();
      deepEqual(predicate2v1(pIn), pExpected);
    });
  });
});

describe('Array', () => {
  describe('#predicate2v1()', () => {
    it('should rename keys to CONSTANT_CASE', () => {
      const pIn = {
        type: 'equals',
        key: 'year',
        value: '1900',
      };
      const pExpected = {
        err: null,
        predicate: {
          type: 'equals',
          key: 'YEAR',
          value: '1900',
        },
      };
      predicate2v1();
      deepEqual(predicate2v1(pIn), pExpected);
    });
  });
});

describe('Array', () => {
  describe('#predicate2v1()', () => {
    it('should refactor isNotNull predicates', () => {
      const pIn = {
        type: 'isNotNull',
        key: 'year',
      };
      const pExpected = {
        err: null,
        predicate: {
          type: 'isNotNull',
          parameter: 'YEAR',
        },
      };
      predicate2v1();
      deepEqual(predicate2v1(pIn), pExpected);
    });
  });
});
