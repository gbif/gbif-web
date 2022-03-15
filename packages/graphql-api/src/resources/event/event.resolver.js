const { getGlobe } = require('../../util/globe');
const { getFacet, getStats, getCardinality } = require('./helpers/getMetrics');
const fieldsWithFacetSupport = require('./helpers/fieldsWithFacetSupport');
const fieldsWithStatsSupport = require('./helpers/fieldsWithStatsSupport');
const fieldsWithCardinalitySupport = require('./helpers/fieldsWithCardinalitySupport');
// const verbatimResolvers = require('./helpers/eventTerms');
const { formattedCoordinates, isEventSequenced } = require('../../util/utils');
const predicate2v1 = require('./helpers/predicate2v1');

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName);
  return dictionary;
};
const EventFacet = fieldsWithFacetSupport.reduce(facetReducer, {});

// there are also many fields that support stats. Generate them all.
const statsReducer = (dictionary, statsName) => {
  dictionary[statsName] = getStats(statsName);
  return dictionary;
};
const EventStats = fieldsWithStatsSupport.reduce(statsReducer, {});

// there are also many fields that support cardinality. Generate them all.
const cardinalityReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getCardinality(fieldName);
  return dictionary;
};
const EventCardinality = fieldsWithCardinalitySupport.reduce(cardinalityReducer, {});

const searchEvents = (parent, query, { dataSources }) => {
  return dataSources.eventAPI.searchEventDocuments({
    query: { predicate: parent._predicate, ...query }
  });
}

const facetEventSearch = (parent) => {
  return { _predicate: parent._predicate };
};

/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    eventSearch: (parent, args, { dataSources }) => {
      // dataSources.eventAPI.searchEvents({ query: args }),
      const v1Predicate = predicate2v1(args.predicate);
      return {
        _predicate: args.predicate,
        _downloadPredicate: v1Predicate,
        _v1PredicateHash: v1Predicate.predicate ? dataSources.eventAPI.registerPredicate({predicate: v1Predicate.predicate}) : null
      };
    },
    event: (parent, { key }, { dataSources }) =>
      dataSources.eventAPI.getEventByKey({ key }),
    globe: (parent, { cLat, cLon, pLat, pLon, sphere, graticule, land }) => {
      const roundedLat = Math.floor(pLat / 30) * 30;
      const simpleLat = Math.min(Math.max(roundedLat, -60), 60);
      const simpleLon = Math.round(pLon / 30) * 30;
      const lat = typeof cLat === 'number' ? cLat : simpleLat;
      const lon = typeof cLon === 'number' ? cLon : simpleLon;

      const svg = getGlobe({
        center: {
          lat,
          lng: lon
        },
        point: {
          lat: pLat,
          lng: pLon
        },
        options: {
          sphere, graticule, land
        }
      });
      return {
        svg,
        lat,
        lon
      }
    }
  },
  Event: {
    coordinates: ({ decimalLatitude, decimalLongitude }) => {
      if (typeof decimalLatitude === 'undefined') return null;
      // extract primary image. for now just any image
      return { lat: decimalLatitude, lon: decimalLongitude };
    },
    occurrenceCount: ({ eventID }, args, { dataSources }) => {
      if (typeof eventID === 'undefined') return null;
      return dataSources.occurrenceAPI
        .searchOccurrenceDocuments(
          { query: { predicate: { type: 'equals', key: 'eventId', value: eventID } } }
        )
        .then(response => response.total);
    },
    primaryImage: ({ media }) => {
      if (!Array.isArray(media)) return null;
      // extract primary image. for now just any image
      return media.find(x => x.type === 'StillImage');
    },
    stillImageCount: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter(x => x.type === 'StillImage').length;
    },
    movingImageCount: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter(x => x.type === 'MovingImage').length;
    },
    soundCount: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter(x => x.type === 'Sound').length;
    },
    stillImages: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter(x => x.type === 'StillImage');
    },
    movingImages: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter(x => x.type === 'MovingImage');
    },
    sounds: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter(x => x.type === 'Sound');
    },
    formattedCoordinates: ({ decimalLatitude, decimalLongitude }) => {
      return formattedCoordinates({ lat: decimalLatitude, lon: decimalLongitude });
    },
    dataset: (event, args, { dataSources }) => {
      return dataSources.datasetAPI.getDatasetByKey({ key: event.datasetKey });
    },
    institution: (event, args, { dataSources }) => {
      if (typeof event.institutionKey === 'undefined') return null;
      return dataSources.institutionAPI.getInstitutionByKey({ key: event.institutionKey });
    },
    collection: (event, args, { dataSources }) => {
      if (typeof event.collectionKey === 'undefined') return null;
      return dataSources.collectionAPI.getCollectionByKey({ key: event.collectionKey });
    },
    bionomia: (event, args, { dataSources }) => {
      return dataSources.eventAPI.getBionomia({ event });
    },
  },
  AssociatedID: {
    person: (parent, { expand }, { dataSources }) => {
      return dataSources.personAPI.getPersonByIdentifier({ type: parent.type, value: parent.value, dataSources, expand })
    },
    // person: (parent, query, { dataSources }) => {
    //   const key = parent.value.substr(parent.value.lastIndexOf('/') + 1);
    //   if (parent.type === 'ORCID') {
    //     return dataSources.personAPI.getPersonByKey({ orcid: key });
    //   } else if (parent.type === 'WIKIDATA') {
    //     return dataSources.personAPI.getPersonByKey({ wikidata: key });
    //   } else if (parent.type === 'OTHER' && parent.value.includes('viaf.org/viaf')) {
    //     return dataSources.personAPI.getPersonByKey({ viaf: key });
    //   }
    // }
  },
  EventSearchResult: {
    documents: searchEvents,
    // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
    facet: (parent) => {
      return { _predicate: parent._predicate };
    },
    stats: (parent) => {
      return { _predicate: parent._predicate };
    },
    cardinality: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.eventAPI.meta({
        query: { predicate: parent._predicate }
      });
    }
  },
  EventStats,
  EventFacet,
  EventCardinality,
  EventFacetResult_float: {
    events: facetEventSearch
  },
  EventFacetResult_string: {
    events: facetEventSearch
  },
  EventFacetResult_boolean: {
    events: facetEventSearch
  },
  EventFacetResult_dataset: {
    dataset: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.datasetAPI.getDatasetByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_node: {
    node: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.nodeAPI.getNodeByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_installation: {
    installation: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.installationAPI.getInstallationByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_taxon: {
    taxon: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.taxonAPI.getTaxonByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_network: {
    network: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.networkAPI.getNetworkByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_organization: {
    publisher: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_institution: {
    institution: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.institutionAPI.getInstitutionByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_collection: {
    collection: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.collectionAPI.getCollectionByKey({ key });
    },
    events: facetEventSearch
  },
  EventFacetResult_recordedBy: {
    events: facetEventSearch,
    eventsIdentifiedBy: (parent) => {
      const predicate = {
        type: 'equals',
        key: 'identifiedBy',
        value: parent.key
      };
      const joinedPredicate = parent._parentPredicate ?
        {
          type: 'and',
          predicates: [parent._parentPredicate, predicate]
        } :
        predicate;
      return { _predicate: joinedPredicate };
    }
  },
  EventFacetResult_identifiedBy: {
    events: facetEventSearch,
    eventsRecordedBy: (parent) => {
      const predicate = {
        type: 'equals',
        key: 'recordedBy',
        value: parent.key
      };
      const joinedPredicate = parent._parentPredicate ?
        {
          type: 'and',
          predicates: [parent._parentPredicate, predicate]
        } :
        predicate;
      return { _predicate: joinedPredicate };
    }
  }
};