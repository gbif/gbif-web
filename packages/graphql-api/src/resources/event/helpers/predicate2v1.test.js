/* eslint-env mocha */
const assert = require('assert');
const predicate2v1 = require('./predicate2v1');

describe('Array', function () {
  describe('#predicate2v1()', function () {
    it('should strip pointless nesting', function () {
      const p_in = {
        "type": "and",
        "predicates": [
          {
            "type": "in",
            "key": "issue",
            "values": [
              "ZERO_COORDINATE"
            ]
          }
        ]
      };
      const p_expected = {
        "err": null,
        "predicate": {
          "type": "in",
          "key": "ISSUE",
          "values": [
            "ZERO_COORDINATE"
          ]
        }
      };
      predicate2v1();
      assert.deepEqual(predicate2v1(p_in), p_expected);
    });
  });
});

describe('Array', function () {
  describe('#predicate2v1()', function () {
    it('should handle not', function () {
      const p_in = {
        "type": "not",
        "predicate": {
          "type": "in",
          "key": "issue",
          "values": [
            "ZERO_COORDINATE"
          ]
        }
      }
      const p_expected = {
        err: null,
        predicate: {
          "type": "not",
          "predicate": {
            "type": "in",
            "key": "ISSUE",
            "values": [
              "ZERO_COORDINATE"
            ]
          }
        }
      };
      predicate2v1();
      assert.deepEqual(predicate2v1(p_in), p_expected);
    });
  });
});

describe('Array', function () {
  describe('#predicate2v1()', function () {
    it('should convert range types to an AND predicate', function () {
      const p_in = {
        "type": "range",
        "key": "year",
        "value": {
          gte: 1900,
          lte: 2000
        }
      };
      const p_expected = {
        err: null,
        predicate: {
          "type": "and",
          "predicates": [
            {
              "type": "greaterThanOrEquals",
              "key": "YEAR",
              "value": 1900
            },
            {
              "type": "lessThanOrEquals",
              "key": "YEAR",
              "value": 2000
            },
          ]
        }
      };
      predicate2v1();
      assert.deepEqual(predicate2v1(p_in), p_expected);
    });
  });
});

describe('Array', function () {
  describe('#predicate2v1()', function () {
    it('should rename keys to CONSTANT_CASE', function () {
      const p_in = {
        "type": "equals",
        "key": "year",
        "value": "1900"
      };
      const p_expected = {
        err: null,
        predicate: {
          "type": "equals",
          "key": "YEAR",
          "value": "1900"
        }
      };
      predicate2v1();
      assert.deepEqual(predicate2v1(p_in), p_expected);
    });
  });
});

describe('Array', function () {
  describe('#predicate2v1()', function () {
    it('should refactor isNotNull predicates', function () {
      const p_in = {
        "type": "isNotNull",
        "key": "year"
      };
      const p_expected = {
        err: null,
        predicate: {
          "type": "isNotNull",
          "parameter": "YEAR"
        }
      };
      predicate2v1();
      assert.deepEqual(predicate2v1(p_in), p_expected);
    });
  });
});