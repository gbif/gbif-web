/* eslint-disable no-param-reassign */
import {
  getFacet,
  getStats,
  getTemporal,
  getCardinality,
} from './helpers/getMetrics';
import formattedCoordinates from './helpers/utils';
import fieldsWithTemporalSupport from './helpers/fieldsWithTemporalSupport';
import fieldsWithFacetSupport from './helpers/fieldsWithFacetSupport';
import fieldsWithStatsSupport from './helpers/fieldsWithStatsSupport';

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName);
  return dictionary;
};

const EventFacet = fieldsWithFacetSupport.reduce(facetReducer, {});

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

const facetEventSearch = (parent) => ({ _predicate: parent._predicate });
const temporalEventSearch = (parent) => ({ _predicate: parent._predicate });

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    eventSearch: (parent, { predicate, ...params }, { dataSources }) => {
      return {
        _predicate: predicate,
        _params: params,
        _tileServerToken: dataSources.eventAPI.registerPredicate({ predicate }),
      };
    },
    event: (parent, { eventID, datasetKey }, { dataSources }) =>
      dataSources.eventAPI.getEventByKey({ eventID, datasetKey }),
    location: (parent, { locationID }, { dataSources }) =>
      dataSources.eventAPI.getLocation({ locationID }),
  },
  EventSearchResult: {
    documents: (parent, query, { dataSources }) => {
      return dataSources.eventAPI.searchEventDocuments({
        query: { predicate: parent._predicate, ...parent._params, ...query },
      });
    },
    occurrenceCount: (parent, query, { dataSources }) => {
      if (typeof query === 'undefined') return null;
      return dataSources.occurrenceAPI
        .searchOccurrenceDocuments({ query, size: 1 })
        .then((response) => {
          return response.total;
        });
    },
    occurrenceFacet: (parent) => ({ _predicate: parent._predicate }),
    facet: (parent) => ({ _predicate: parent._predicate }),
    cardinality: (parent) => ({ _predicate: parent._predicate }),
    temporal: (parent) => ({ _predicate: parent._predicate }),
    stats: (parent) => ({ _predicate: parent._predicate }),
    _meta: (parent, query, { dataSources }) => {
      return dataSources.eventAPI.meta({
        query: { predicate: parent._predicate },
      });
    },
  },
  EventFacet,
  EventCardinality: {
    species: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'species',
        searchApi: dataSources.occurrenceAPI.searchOccurrences,
      }),
    datasetKey: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'datasetKey',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    locationID: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'locationID',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
    parentEventID: (parent, query, { dataSources }) =>
      getCardinality(parent._predicate, query, {
        field: 'parentEventID',
        searchApi: dataSources.eventAPI.searchEvents,
      }),
  },
  EventStats,
  EventTemporal,
  Event: {
    formattedCoordinates: ({ decimalLatitude, decimalLongitude }) => {
      return formattedCoordinates({
        lat: decimalLatitude,
        lon: decimalLongitude,
      });
    },
    parentEvent: (
      { datasetKey, parentEventID: key },
      query,
      { dataSources },
    ) => {
      if (typeof key === 'undefined' || key === null) return null;
      return dataSources.eventAPI.getEventByKey({ key, datasetKey });
    },
    dataset: ({ datasetKey }, query, { dataSources }) => {
      if (typeof datasetKey === 'undefined' || datasetKey === null) return null;
      return dataSources.eventAPI.getDatasetEML({ datasetKey });
    },
    occurrences: async ({ eventID }, query, { dataSources }) => {
      if (typeof eventID === 'undefined' || eventID === null) return null;
      return (
        await dataSources.occurrenceAPI.searchOccurrenceDocuments({
          query: {
            eventHierarchy: eventID,
            size: query.size,
          },
        })
      ).results;
    },
    speciesCount: ({ eventID }, query, { dataSources }) => {
      return getCardinality(
        { type: 'equals', key: 'eventHierarchy', value: eventID },
        query,
        {
          dataSources,
          field: 'species',
          searchApi: dataSources.occurrenceAPI.searchOccurrences,
        },
      );
    },
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
      return dataSources.occurrenceAPI
        .searchOccurrenceDocuments({ query: { datasetKey: key }, size: 1 })
        .then((response) => {
          return response.total;
        });
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
