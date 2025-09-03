'use strict';
const _ = require('lodash');
const { validatePredicate } = require('./validatePredicate');
const { wktPolygonToCoordinates, wktToGeoJson } = require('../util/geoHelper');
const { ResponseError } = require('../../resources/errorHandler');

function predicate2esQuery(predicate, config, q) {
  // attach the q as a predicate
  const qEnrichedPredicate = getEnrichedPredicate(predicate, q);
  if (!qEnrichedPredicate) return;
  const { error } = validatePredicate(qEnrichedPredicate, config);
  if (error) {
    throw new ResponseError(400, 'BAD_REQUEST', error.message);
  }
  return transform(qEnrichedPredicate, config, true);
}

function groupPredicates(predicates, isRootQuery) {
  //split list of ands into type not and other.
  //the not part can just be concatenated as a list
  let must = [],
    filterCandidates = [],
    must_not = [];
  predicates.forEach((p) => {
    switch (p.type) {
      case 'not': {
        must_not.push(p);
        break;
      }
      case 'fuzzy': {
        if (isRootQuery) must.push(p);
        else filterCandidates.push(p);
        break;
      }
      default: {
        filterCandidates.push(p);
      }
    }
  });
  // we could remove this part and just use filters instead of splitting into SHOULD,
  // it might be easier to read the code, but it makes for flatter es queries to split them
  // only split if it isn't root level as we want it executed in a filter context (not scored)
  const [should, filterWithoutShould] = _.partition(
    filterCandidates,
    (x) => x.type === 'or' && !isRootQuery,
  );
  const hasOneShould = should.length === 1;
  return {
    must,
    must_not,
    filter: hasOneShould ? filterWithoutShould : filterCandidates,
    should: hasOneShould ? should[0].predicates : [],
  };
}

function transform(p, config, isRootQuery) {
  const fieldName = getFieldName(p.key, p.type, config);

  // for handling joins records
  if (config?.options?.[p.key]?.join) {
    return {
      has_child: {
        type: config.options[p.key].join,
        query: transform(p, config.options[p.key].config),
      },
    };
  }
  // for making nested fields easier to query
  if (config?.options?.[p.key]?.type === 'flatNested') {
    return {
      nested: {
        path: fieldName,
        query: {
          bool: {
            must: [transform(p, config?.options?.[p.key]?.config)],
          },
        },
      },
    };
  }

  switch (p.type) {
    case 'and': {
      // bool queries is essentially an AND of: must, filter, mut_not and should (if minimum_should_match set to 1)
      // so to avoid insane ES nesting  we can flatten ANDs - it isn't necessary, but it makes them easier to read.
      // the most relevant question is to test if it matters for performance though.
      //
      // TODO: test if nesting or not influence query performance

      //group predicates by their ES bool type
      const { must, filter, must_not, should } = groupPredicates(p.predicates, isRootQuery);
      return {
        bool: _.omitBy(
          {
            must: must.map((p) => transform(p, config)),
            filter: filter.map((p) => transform(p, config)),
            must_not: must_not.map((p) => p.predicate).map((p) => transform(p, config)),
            should: should.map((p) => transform(p, config)),
            ...(should.length > 0 && { minimum_should_match: 1 }), //akward to read, but only add minimum_should_match=1 if there is any elements in should
          },
          (x) => x.length === 0,
        ),
      };
    }
    case 'or': {
      return {
        bool: {
          should: p.predicates.map((p) => transform(p, config)),
          minimum_should_match: 1, // shouldn't matter as there is no other bool types, but for clarity we add it
        },
      };
    }
    case 'not': {
      return {
        bool: {
          must_not: transform(p.predicate, config),
        },
      };
    }
    case 'equals': {
      // if (config.options[p.key].join) {
      //   return {
      //     has_child: {
      //       type: config.options[p.key].join,
      //       query: {
      //         term: {
      //           [fieldName]: p.value
      //         }
      //       }
      //     }
      //   }
      // }
      return {
        term: {
          [fieldName]: p.value,
        },
      };
    }
    case 'in': {
      return {
        terms: {
          [fieldName]: p.values,
        },
      };
    }
    case 'range': {
      return {
        range: {
          [fieldName]: p.value,
        },
      };
    }
    case 'like': {
      return {
        wildcard: {
          [fieldName]: p.value,
        },
      };
    }
    case 'isNotNull': {
      return {
        exists: {
          field: fieldName,
        },
      };
    }
    case 'isNull': {
      return {
        bool: {
          must_not: [
            {
              exists: {
                field: fieldName,
              },
            },
          ],
        },
      };
    }
    case 'within': {
      const geojson = wktToGeoJson(p.value);
      if (!['MultiPolygon', 'Polygon'].includes(geojson.type)) {
        throw new ResponseError(
          400,
          'BAD_REQUEST',
          'Only WKT polygons, and multipolygons are supported',
        );
      }
      return {
        geo_shape: {
          [fieldName]: {
            shape: {
              type: geojson.type,
              coordinates: geojson.coordinates,
            },
            relation: 'within',
          },
        },
      };
    }
    case 'geoDistance': {
      return {
        geo_distance: {
          distance: p.distance,
          [fieldName]: {
            lat: p.latitude,
            lon: p.longitude,
          },
        },
      };
    }
    case 'fuzzy': {
      return {
        simple_query_string: {
          default_operator: 'and',
          query: p.value,
        },
      };
    }
    case 'nested': {
      return {
        nested: {
          path: fieldName,
          query: transform(p.predicate, config.options[p.key].config),
        },
      };
    }
    case 'join': {
      return {
        has_child: {
          type: 'occurrence',
          query: transform(p.predicate, config.options[p.key].config),
        },
      };
    }
    default: {
      return;
    }
  }
}

function getFieldName(key, type, config) {
  if (!key && !['geoDistance'].includes(type)) return;

  const fieldKey = key || type;
  return config.prefix
    ? `${config.prefix}.${config.options[fieldKey].field}`
    : config.options[fieldKey].field;
}

function getEnrichedPredicate(predicate, q) {
  const qPredicate = {
    type: 'fuzzy',
    key: 'q',
    value: q,
  };
  if (!predicate && !q) return;
  if (!q) return predicate;
  if (!predicate) return qPredicate;
  // predicate and q is provided
  if (predicate.type === 'and') {
    return {
      type: 'and',
      predicates: [...predicate.predicates, qPredicate],
    };
  }
  return {
    type: 'and',
    predicates: [predicate, qPredicate],
  };
}

module.exports = {
  predicate2esQuery,
};
