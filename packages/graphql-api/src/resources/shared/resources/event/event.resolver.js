/* eslint-disable no-param-reassign */
import { formattedCoordinates, simplifyUrlObjectKeys } from '@/helpers/utils';
import fieldsWithFacetSupport from './helpers/fieldsWithFacetSupport';
import fieldsWithOccurrenceFacetSupport from './helpers/fieldsWithOccurrenceFacetSupport';
import fieldsWithStatsSupport from './helpers/fieldsWithStatsSupport';
import fieldsWithTemporalSupport from './helpers/fieldsWithTemporalSupport';
import {
  getCardinality,
  getFacet,
  getMultiFacet,
  getOccurrenceFacet,
  getStats,
  getTemporal,
} from './helpers/getMetrics';
// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName);
  return dictionary;
};
const EventFacet = fieldsWithFacetSupport.reduce(facetReducer, {});

const occurrenceFacetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getOccurrenceFacet(facetName);
  return dictionary;
};
const EventOccurrenceFacet = fieldsWithOccurrenceFacetSupport.reduce(
  occurrenceFacetReducer,
  {},
);

const temporalReducer = (dictionary, facetName) => {
  dictionary[facetName] = getTemporal(facetName);
  return dictionary;
};

const EventTemporal = fieldsWithTemporalSupport.reduce(temporalReducer, {});

// there are also many fields that support stats. Generate them all.
const statsReducer = (dictionary, statsName) => {
  dictionary[statsName] = getStats(statsName);
  return dictionary;
};
const EventStats = fieldsWithStatsSupport.reduce(statsReducer, {});

const facetEventSearch = (parent) => {
  return { _predicate: parent._predicate };
};

const temporalEventSearch = (parent) => {
  return { _predicate: parent._predicate };
};

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    eventSearch: (parent, { predicate, q, ...params }, { dataSources }) => {
      return {
        _predicate: predicate,
        _q: q,
        _params: params,
      };
    },
    event: (parent, { eventId, datasetKey }, { dataSources }) =>
      dataSources.eventAPI.getEventByKey({ eventId, datasetKey }),
    occurrences: (
      parent,
      { eventId, datasetKey, locationId, month, year, size, from },
      { dataSources },
    ) => {
      return dataSources.eventAPI.searchEventOccurrences({
        eventId,
        datasetKey,
        locationId,
        month,
        year,
        size,
        from,
      });
    },
    location: (parent, { locationId }, { dataSources }) =>
      dataSources.eventAPI.getLocation({ locationId }),
  },
  EventSearchResult: {
    documents: (parent, query, { dataSources }) => {
      return dataSources.eventAPI.searchEventDocuments({
        query: {
          predicate: parent._predicate,
          q: parent._q,
          ...parent._params,
          ...query,
        },
      });
    },
    occurrenceCount: (parent, query, { dataSources }) => {
      if (typeof query === 'undefined') return null;
      return dataSources.eventAPI
        .searchOccurrenceDocuments({ query, size: 1 })
        .then((response) => {
          return response.total;
        });
    },
    occurrenceFacet: (parent) => {
      return { _predicate: parent._predicate };
    },
    facet: (parent, { size, from }) => {
      return {
        size,
        from,
        _predicate: parent._predicate,
      };
    },
    multifacet: (parent, { size, from }) => {
      return {
        size,
        from,
        _predicate: parent._predicate,
      };
    },
    cardinality: (parent) => {
      return { _predicate: parent._predicate };
    },
    temporal: (parent) => {
      return { _predicate: parent._predicate };
    },
    stats: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.eventAPI.meta({
        query: { predicate: parent._predicate },
      });
    },
  },
  EventFacet,
  EventMultiFacet: {
    locationIdStateProvince: (parent, query, { dataSources }) => {
      const result = getMultiFacet(parent, query, {
        fields: ['locationId', 'stateProvince'],
        searchApi: dataSources.eventAPI.searchEvents,
      });
      return result;
    },
  },
  EventOccurrenceFacet,
  EventCardinality: {
    speciesKey: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'speciesKey',
        searchApi: dataSources.eventAPI.searchOccurrences,
      }),
    datasetKey: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'datasetKey',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    locationId: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'locationId',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    parentEventId: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'parentEventId',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    sampleSizeUnit: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'sampleSizeUnit',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    surveyId: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'surveyId',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    samplingProtocol: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'samplingProtocol',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    continent: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'samplingProtocol',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    locality: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'locality',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    dwcaExtension: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'dwcaExtension',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
  },
  EventStats,
  EventTemporal,
  Event: {
    extensions: (event) => {
      const extensions = {
        audubon: event?.extensions?.['http://rs.tdwg.org/ac/terms/Multimedia'],
        image: event?.extensions?.['http://rs.gbif.org/terms/1.0/Image'],
        humboldtEcologicalInventory:
          event?.extensions?.['http://rs.tdwg.org/eco/terms/Event'],
        measurementOrFact:
          event?.extensions?.['http://rs.tdwg.org/dwc/terms/MeasurementOrFact'],
        multimedia:
          event?.extensions?.['http://rs.gbif.org/terms/1.0/Multimedia'],
        extendedMeasurementOrFact:
          event?.extensions?.[
            'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact'
          ],
      };
      Object.keys(extensions).forEach((key) => {
        const extension = extensions[key];
        // remove empty and half empty values
        if (Array.isArray(extension) && extension.length > 0) {
          extensions[key] = extension
            .filter((x) => Object.keys(x).length > 0)
            .map(simplifyUrlObjectKeys);
          if (extensions[key].length === 0) delete extensions[key];
        } else {
          delete extensions[key];
        }
      });
      return extensions;
    },
    formattedCoordinates: ({ decimalLatitude, decimalLongitude }) => {
      return formattedCoordinates({
        lat: decimalLatitude,
        lon: decimalLongitude,
      });
    },
    parentEvent: (
      { datasetKey, parentEventId: key },
      query,
      { dataSources },
    ) => {
      if (typeof key === 'undefined' || key === null) return null;
      return dataSources.eventAPI.getEventByKey({ eventId: key, datasetKey });
    },
    dataset: ({ datasetKey }, query, { dataSources }) => {
      if (typeof datasetKey === 'undefined' || datasetKey === null) return null;
      return dataSources.eventAPI.getDatasetEML({ datasetKey });
    },
    speciesCount: ({ eventId }, query, { dataSources }) => {
      return getCardinality(
        { type: 'equals', key: 'eventHierarchy', value: eventId },
        query,
        {
          dataSources,
          field: 'speciesKey',
          searchApi: dataSources.eventAPI.searchOccurrences,
        },
      );
    },
    distinctTaxa: async ({ eventId }, query, { dataSources }) =>
      dataSources.eventAPI
        .searchOccurrences({
          query: {
            eventId,
            facet: 'acceptedUsageKey',
            size: 0,
          },
        })
        .then(({ aggregations }) =>
          aggregations.acceptedUsageKey_facet.buckets.map(
            async ({ key, doc_count: count }) => ({
              count,
              ...(await dataSources.taxonAPI.getTaxonByKey({ key })),
            }),
          ),
        ),
  },
  EventFacetResult_dataset: {
    datasetTitle: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.eventAPI
        .searchEventDocuments({ query: { datasetKey: key }, size: 1 })
        .then((response) => {
          return response.results[0].datasetTitle;
        });
    },
    occurrenceCount: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.eventAPI
        .searchOccurrenceDocuments({ query: { datasetKey: key }, size: 1 })
        .then((response) => {
          return response.total;
        });
    },
    extensions: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.eventAPI
        .searchEvents({
          query: {
            datasetKey: key,
            facet: 'extensions',
            size: 0,
          },
        })
        .then(({ aggregations }) =>
          aggregations.extensions_facet.buckets.map(
            ({ key: facetKey }) => facetKey,
          ),
        );
    },
    events: facetEventSearch,
    archive: ({ key }, args, { dataSources }) => {
      return dataSources.eventAPI.getArchive(key);
    },
  },
  EventFacetResult_string: {
    events: facetEventSearch,
  },
  EventFacetResult_float: {
    events: facetEventSearch,
  },
  EventTemporalResult_string: {
    events: temporalEventSearch,
  },
};
