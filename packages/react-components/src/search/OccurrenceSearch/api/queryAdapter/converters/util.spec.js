import expect from 'expect';
import bodybuilder from 'bodybuilder';

import { isRange, termFilter, rangeFilter, termOrRangeFilter } from './util';

describe('Filter utils', () => {
  it('can detect a range filter', () => {
    expect(isRange(2)).toEqual(false);
    expect(isRange({})).toEqual(false);
    expect(isRange({ something: 1 })).toEqual(false);
    expect(isRange({ gte: 1 })).toEqual(true);
    expect(isRange({ lt: 'str' })).toEqual(true);
  });

  it('can add term filters', () => {
    let builder = bodybuilder();
    termFilter('height')([2, 3], builder);
    const expected = {
      "query": {
        "bool": {
          "filter": {
            "terms": {
              "height": [2, 3]
            }
          }
        }
      }
    }
    expect(builder.build()).toEqual(expected);
  });

  it('can add range filters', () => {
    let builder = bodybuilder();
    rangeFilter('year')([{ gte: 1980, lt: 1990 }, { gte: 1930, lt: 1940 }], builder);
    const expected = {
      "query": {
        "bool": {
          "filter": {
            "bool": {
              "should": [
                {
                  "range": {
                    "year": {
                      "gte": 1980,
                      "lt": 1990
                    }
                  }
                },
                {
                  "range": {
                    "year": {
                      "gte": 1930,
                      "lt": 1940
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
    expect(builder.build()).toEqual(expected);
  });

  it('can add combine 2 filters', () => {
    let builder = bodybuilder();
    rangeFilter('year')([{ gte: 1980, lt: 1990 }], builder);
    termFilter('height')([2, 3], builder);
    const expected = {
      "query": {
        "bool": {
          "filter": {
            "bool": {
              "must": [
                {
                  "range": {
                    "year": {
                      "gte": 1980,
                      "lt": 1990
                    }
                  }
                },
                {
                  "terms": {
                    "height": [2, 3]
                  }
                }
              ]
            }
          }
        }
      }
    };
    expect(builder.build()).toEqual(expected);
  });

  it('can add handle mixed types', () => {
    let builder = bodybuilder();
    termOrRangeFilter('year')([1932, { gte: 1980, lt: 1990 }, { gte: 1930, lt: 1940 }], builder);
    const expected = {
      "query": {
        "bool": {
          "filter": {
            "bool": {
              "should": [
                {
                  "term": {
                    "year": 1932
                  }
                },
                {
                  "range": {
                    "year": {
                      "gte": 1980,
                      "lt": 1990
                    }
                  }
                },
                {
                  "range": {
                    "year": {
                      "gte": 1930,
                      "lt": 1940
                    }
                  }
                }
              ]
            }
          }
        }
      }
    };
    expect(builder.build()).toEqual(expected);
  });

})

