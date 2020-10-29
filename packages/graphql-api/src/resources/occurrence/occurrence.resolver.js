const { getGlobe } = require('../../util/globe');
const { getFacet, getStats } = require('./helpers/getMetrics');
const fieldsWithFacetSupport = require('./helpers/fieldsWithFacetSupport');
const fieldsWithStatsSupport = require('./helpers/fieldsWithStatsSupport');
// const verbatimResolvers = require('./helpers/occurrenceTerms');
const { formattedCoordinates, isOccurrenceSequenced } = require('../../util/utils');
const groupResolvers = require('./helpers/groups/occurrenceGroups');

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName);
  return dictionary;
};
const OccurrenceFacet = fieldsWithFacetSupport.reduce(facetReducer, {});

// there are also many fields that support stats. Generate them all.
const statsReducer = (dictionary, statsName) => {
  dictionary[statsName] = getStats(statsName);
  return dictionary;
};
const OccurrenceStats = fieldsWithStatsSupport.reduce(statsReducer, {});

const searchOccurrences = (parent, query, { dataSources }) => {
  return dataSources.occurrenceAPI.searchOccurrenceDocuments({
    query: { predicate: parent._predicate, ...query }
  });
}

const facetOccurrenceSearch = (parent) => {
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
    occurrenceSearch: (parent, args) => {
      // dataSources.occurrenceAPI.searchOccurrences({ query: args }),
      return { _predicate: args.predicate };
    },
    occurrence: (parent, { key }, { dataSources }) =>
      dataSources.occurrenceAPI.getOccurrenceByKey({ key }),
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
  Occurrence: {
    coordinates: ({ decimalLatitude, decimalLongitude }) => {
      if (typeof decimalLatitude === 'undefined') return null;
      // extract primary image. for now just any image
      return {lat: decimalLatitude, lon: decimalLongitude};
    },
    primaryImage: ({ media }) => {
      if (typeof media === 'undefined') return null;
      // extract primary image. for now just any image
      return media.find(x => x.type === 'StillImage');
    },
    stillImageCount: ({ media }) => {
      if (typeof media === 'undefined') return null;
      return media.filter(x => x.type === 'StillImage').length;
    },
    movingImageCount: ({ media }) => {
      if (typeof media === 'undefined') return null;
      return media.filter(x => x.type === 'MovingImage').length;
    },
    soundCount: ({ media }) => {
      if (typeof media === 'undefined') return null;
      return media.filter(x => x.type === 'Sound').length;
    },
    stillImages: ({ media }) => {
      if (typeof media === 'undefined') return null;
      return media.filter(x => x.type === 'StillImage');
    },
    movingImages: ({ media }) => {
      if (typeof media === 'undefined') return null;
      return media.filter(x => x.type === 'MovingImage');
    },
    sounds: ({ media }) => {
      if (typeof media === 'undefined') return null;
      return media.filter(x => x.type === 'Sound');
    },
    formattedCoordinates: ({ decimalLatitude, decimalLongitude }) => {
      return formattedCoordinates({lat: decimalLatitude, lon: decimalLongitude});
    },
    volatile: (occurrence) => occurrence,
    related: ({ key }, args, { dataSources }) => {
      return dataSources.occurrenceAPI.getRelated({ key })
        .then(response => response.relatedOccurrences);
    },
    groups: (occurrence) => occurrence
  },
  OccurrenceSearchResult: {
    documents: searchOccurrences,
    // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
    facet: (parent) => {
      return { _predicate: parent._predicate };
    },
    stats: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.occurrenceAPI.meta({
        query: { predicate: parent._predicate }
      });
    }
  },
  OccurrenceNameUsage: {
    formattedName: ({ key }, args, { dataSources }) =>
      dataSources.taxonAPI.getParsedName({ key }),
  },
  OccurrenceStats,
  OccurrenceFacet,
  OccurrenceFacetResult_float: {
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_string: {
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_boolean: {
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_dataset: {
    dataset: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.datasetAPI.getDatasetByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_node: {
    node: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.nodeAPI.getNodeByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_installation: {
    installation: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.installationAPI.getInstallationByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_taxon: {
    taxon: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.taxonAPI.getTaxonByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_network: {
    network: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.networkAPI.getNetworkByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_organization: {
    publisher: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  Globe: {
    
  },
  VolatileOccurrenceData: {
    features: (occurrence) => occurrence,
    globe: ({ decimalLatitude, decimalLongitude }, { sphere, graticule, land }) => {
      const roundedLat = Math.floor(decimalLatitude / 15) * 15;
      const lat = Math.min(Math.max(roundedLat, -60), 60);
      const lon = Math.round(decimalLongitude / 15) * 15;

      const svg = getGlobe({
        center: {
          lat: lat,
          lng: lon
        },
        point: {
          lat: decimalLatitude,
          lng: decimalLongitude
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
  OccurrenceFeatures: {
    isSpecimen: ({ basisOfRecord }) => {
      return basisOfRecord === 'MATERIAL_SAMPLE' || basisOfRecord === 'PRESERVED_SPECIMEN' || basisOfRecord === 'LIVING_SPECIMEN' || basisOfRecord === 'FOSSIL_SPECIMEN';
    },
    // plazi this won't work in other environments than prod for now. all in all we should have a better way to detect treatments
    isTreament: ({ publishingOrganizationKey }) => publishingOrganizationKey === '7ce8aef0-9e92-11dc-8738-b8a03c50a862',
    isClustered: ({ key }, args, { dataSources }) => {
      return dataSources.occurrenceAPI.getRelated({ key })
        .then(response => response.relatedOccurrences.length > 0);
    },
    isSequenced: (occurrence, args, { dataSources }) => {
      return dataSources.occurrenceAPI.getFragment({key: occurrence.key })
        .then(fragment => isOccurrenceSequenced({occurrence, fragment}));
    },
    isSamplingEvent: (occurrence) => !!occurrence.eventId && !!occurrence.samplingProtocol
  },
  RelatedOccurrence: {
    occurrence: (related, args, { dataSources }) => dataSources.occurrenceAPI
      .getOccurrenceByKey({key: related.occurrence.key })
  },
  TermGroups: {
    Occurrence: groupResolvers.Occurrence,
    Record: groupResolvers.Record,
    Organism: groupResolvers.Organism,
    MaterialSample: groupResolvers.MaterialSample,
    Event: groupResolvers.Event,
    Location: groupResolvers.Location,
    GeologicalContext: groupResolvers.GeologicalContext,
    Identification: groupResolvers.Identification,
    Taxon: groupResolvers.Taxon,
    Dataset: groupResolvers.Dataset,
    Crawling: groupResolvers.Crawling
  }
};

// var ggbn = ['Amplification', 'MaterialSample', 'Permit', 'Preparation', 'Preservation'];
//   vm.isSequenced = function(extensions) {
//     if (!extensions) return false;
//     for (var i = 0; i < ggbn.length; i++) {
//       var ext = extensions['http://data.ggbn.org/schemas/ggbn/terms/' + ggbn[i]];
//       if (ext && ext.length > 0) return true;
//     }
//     return false;
//   };
