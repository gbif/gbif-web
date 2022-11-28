/* eslint-disable no-param-reassign */
import _ from 'lodash';
import getGlobe from '#/helpers/globe';
import {
  getFacet,
  getStats,
  getCardinality,
  getHistogram,
  getAutoDateHistogram,
} from './helpers/getMetrics';
import {
  facetFields,
  statsFields,
  cardinalityFields,
  histogramFields,
  dateHistogramFields,
} from './helpers/fields';
import { formattedCoordinates, isOccurrenceSequenced } from '#/helpers/utils';
import groupResolver from './helpers/groups/occurrenceGroups';
import termResolver from './helpers/terms/occurrenceTerms';
import predicate2v1 from './helpers/predicate2v1';
import getLongitudeBounds from './helpers/longitudeBounds';

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName);
  return dictionary;
};
const OccurrenceFacet = facetFields.reduce(facetReducer, {});

// there are also many fields that support stats. Generate them all.
const statsReducer = (dictionary, statsName) => {
  dictionary[statsName] = getStats(statsName);
  return dictionary;
};
const OccurrenceStats = statsFields.reduce(statsReducer, {});

// there are also many fields that support cardinality. Generate them all.
const cardinalityReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getCardinality(fieldName);
  return dictionary;
};
const OccurrenceCardinality = cardinalityFields.reduce(cardinalityReducer, {});

// there are also many fields that support histograms. Generate them all.
const histogramReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getHistogram(fieldName);
  return dictionary;
};
const OccurrenceHistogram = histogramFields.reduce(histogramReducer, {});

// there are also many fields that support date histograms. Generate them all.
const autoDateHistogramReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getAutoDateHistogram(fieldName);
  return dictionary;
};
const OccurrenceAutoDateHistogram = dateHistogramFields.reduce(
  autoDateHistogramReducer,
  {},
);

const searchOccurrences = (parent, query, { dataSources }) => {
  return dataSources.occurrenceAPI.searchOccurrenceDocuments({
    query: { predicate: parent._predicate, ...query },
  });
};

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
export default {
  Query: {
    occurrenceSearch: (_parent, args, { dataSources }) => {
      // dataSources.occurrenceAPI.searchOccurrences({ query: args }),
      const v1Predicate = predicate2v1(args.predicate);
      const v1PredicateQStripped = predicate2v1(args.predicate, {
        shouldRemoveFullTextPredicates: true,
      });
      return {
        _predicate: args.predicate,
        _downloadPredicate: v1Predicate,
        _v1PredicateHash: v1PredicateQStripped.predicate
          ? dataSources.occurrenceAPI.registerPredicate({
              predicate: v1PredicateQStripped.predicate,
            })
          : null,
      };
    },
    occurrenceClusterSearch: (
      _parent,
      { predicate, ...query },
      { dataSources },
    ) => {
      // custom cluster search
      const nodes = [];
      const links = [];
      return dataSources.occurrenceAPI
        .searchOccurrenceDocuments({
          query: {
            predicate: {
              type: 'and',
              predicates: [
                {
                  type: 'equals',
                  key: 'isInCluster',
                  value: true,
                },
                predicate,
              ],
            },
            ...query,
          },
        })
        .then((response) => {
          console.log(response);
          return {
            nodes: [],
            links: [{ source: 'hej', target: 'goddag' }],
          };
        });
    },
    occurrence: (_parent, { key }, { dataSources }) =>
      dataSources.occurrenceAPI.getOccurrenceByKey({ key }),
    globe: (_parent, { cLat, cLon, pLat, pLon, sphere, graticule, land }) => {
      const roundedLat = Math.floor(pLat / 30) * 30;
      const simpleLat = Math.min(Math.max(roundedLat, -60), 60);
      const simpleLon = Math.round(pLon / 30) * 30;
      const lat = typeof cLat === 'number' ? cLat : simpleLat;
      const lon = typeof cLon === 'number' ? cLon : simpleLon;

      const svg = getGlobe({
        center: {
          lat,
          lng: lon,
        },
        point: {
          lat: pLat,
          lng: pLon,
        },
        options: {
          sphere,
          graticule,
          land,
        },
      });
      return {
        svg,
        lat,
        lon,
      };
    },
  },
  Occurrence: {
    coordinates: ({ decimalLatitude, decimalLongitude }) => {
      if (typeof decimalLatitude === 'undefined') return null;
      // extract primary image. for now just any image
      return { lat: decimalLatitude, lon: decimalLongitude };
    },
    primaryImage: ({ media }) => {
      if (!Array.isArray(media)) return null;
      // extract primary image. for now just any image
      return media.find((x) => x.type === 'StillImage');
    },
    stillImageCount: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter((x) => x.type === 'StillImage').length;
    },
    movingImageCount: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter((x) => x.type === 'MovingImage').length;
    },
    soundCount: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter((x) => x.type === 'Sound').length;
    },
    stillImages: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter((x) => x.type === 'StillImage');
    },
    movingImages: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter((x) => x.type === 'MovingImage');
    },
    sounds: ({ media }) => {
      if (!Array.isArray(media)) return null;
      return media.filter((x) => x.type === 'Sound');
    },
    formattedCoordinates: ({ decimalLatitude, decimalLongitude }) => {
      return formattedCoordinates({
        lat: decimalLatitude,
        lon: decimalLongitude,
      });
    },
    volatile: (occurrence) => occurrence,
    related: ({ key }, { from = 0, size = 20 }, { dataSources }) => {
      return dataSources.occurrenceAPI.getRelated({ key }).then((response) => {
        return {
          size,
          from,
          count: response.relatedOccurrences.length,
          relatedOccurrences: response.relatedOccurrences.slice(
            from,
            from + size,
          ),
        };
      });
    },
    groups: (occurrence, _args, { dataSources }) => {
      return dataSources.occurrenceAPI
        .getVerbatim({ key: occurrence.key })
        .then((verbatim) => groupResolver({ occurrence, verbatim }));
    },
    hasTaxonIssues: ({ issues = [] }) => {
      return (
        _.intersection(issues, [
          'TAXON_MATCH_FUZZY',
          'TAXON_MATCH_HIGHERRANK',
          'TAXON_MATCH_AGGREGATE',
          'TAXON_MATCH_NONE',
        ]).length > 0
      );
    },
    terms: (occurrence, _args, { dataSources }) => {
      return dataSources.occurrenceAPI
        .getVerbatim({ key: occurrence.key })
        .then((verbatim) => termResolver({ occurrence, verbatim }));
    },
    dataset: (occurrence, _args, { dataSources }) => {
      return dataSources.datasetAPI.getDatasetByKey({
        key: occurrence.datasetKey,
      });
    },
    institution: (occurrence, _args, { dataSources }) => {
      if (!occurrence.institutionKey) return null;
      return dataSources.institutionAPI.getInstitutionByKey({
        key: occurrence.institutionKey,
      });
    },
    collection: (occurrence, _args, { dataSources }) => {
      if (!occurrence.collectionKey) return null;
      return dataSources.collectionAPI.getCollectionByKey({
        key: occurrence.collectionKey,
      });
    },
    bionomia: (occurrence, _args, { dataSources }) => {
      return dataSources.occurrenceAPI.getBionomia({ occurrence });
    },
  },
  BionomiaOccurrence: {
    recorded: (bionomiaOccurrence) => {
      return bionomiaOccurrence.dataFeedElement[0].item.recorded.map((x) => {
        return {
          name: x.name,
          reference: x['@id'],
        };
      });
      // return bionomiaOccurrence.dataFeedElement[0].item.recorded.map(x => {
      //   if (x.sameAs.includes('wikidata')) {
      //     return {
      //       type: 'WIKIDATA',
      //       value: x.sameAs
      //     }
      //   } else if (x.sameAs.includes('orcid')) {
      //     return {
      //       type: 'ORCID',
      //       value: x.sameAs
      //     }
      //   } else {
      //     return {
      //       type: 'OTHER',
      //       value: x.sameAs
      //     }
      //   }
      // });
    },
    identified: (bionomiaOccurrence) => {
      return bionomiaOccurrence.dataFeedElement[0].item.identified.map((x) => {
        return {
          name: x.name,
          reference: x['@id'],
        };
      });
    },
  },
  AssociatedID: {
    person: (parent, { expand }, { dataSources }) => {
      return dataSources.personAPI.getPersonByIdentifier({
        type: parent.type,
        value: parent.value,
        dataSources,
        expand,
      });
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
  OccurrenceSearchResult: {
    documents: searchOccurrences,
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
    histogram: (parent) => {
      return { _predicate: parent._predicate };
    },
    autoDateHistogram: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, _query, { dataSources }) => {
      return dataSources.occurrenceAPI.meta({
        query: { predicate: parent._predicate },
      });
    },
  },
  OccurrenceNameUsage: {
    formattedName: ({ key }, _args, { dataSources }) =>
      dataSources.taxonAPI.getParsedName({ key }),
  },
  OccurrenceStats,
  OccurrenceFacet,
  OccurrenceCardinality,
  OccurrenceHistogram,
  OccurrenceAutoDateHistogram,
  OccurrenceFacetResult_float: {
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_string: {
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_boolean: {
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_dataset: {
    dataset: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.datasetAPI.getDatasetByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_node: {
    node: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.nodeAPI.getNodeByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_installation: {
    installation: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.installationAPI.getInstallationByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_taxon: {
    taxon: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.taxonAPI.getTaxonByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_network: {
    network: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.networkAPI.getNetworkByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_organization: {
    publisher: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_institution: {
    institution: ({ key }, _args, { dataSources }) => {
      if (!key) return null;
      return dataSources.institutionAPI.getInstitutionByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_collection: {
    collection: ({ key }, _args, { dataSources }) => {
      if (!key) return null;
      return dataSources.collectionAPI.getCollectionByKey({ key });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_recordedBy: {
    occurrences: facetOccurrenceSearch,
    occurrencesIdentifiedBy: (parent) => {
      const predicate = {
        type: 'equals',
        key: 'identifiedBy',
        value: parent.key,
      };
      const joinedPredicate = parent._parentPredicate
        ? {
            type: 'and',
            predicates: [parent._parentPredicate, predicate],
          }
        : predicate;
      return { _predicate: joinedPredicate };
    },
  },
  OccurrenceFacetResult_identifiedBy: {
    occurrences: facetOccurrenceSearch,
    occurrencesRecordedBy: (parent) => {
      const predicate = {
        type: 'equals',
        key: 'recordedBy',
        value: parent.key,
      };
      const joinedPredicate = parent._parentPredicate
        ? {
            type: 'and',
            predicates: [parent._parentPredicate, predicate],
          }
        : predicate;
      return { _predicate: joinedPredicate };
    },
  },
  Globe: {},
  VolatileOccurrenceData: {
    features: (occurrence) => occurrence,
    globe: (
      { decimalLatitude, decimalLongitude },
      { sphere, graticule, land },
    ) => {
      if (typeof decimalLatitude === 'undefined') return null;

      const roundedLat = Math.floor(decimalLatitude / 15) * 15;
      const lat = Math.min(Math.max(roundedLat, -60), 60);
      const lon = Math.round(decimalLongitude / 15) * 15;

      const svg = getGlobe({
        center: {
          lat,
          lng: lon,
        },
        point: {
          lat: decimalLatitude,
          lng: decimalLongitude,
        },
        options: {
          sphere,
          graticule,
          land,
        },
      });
      return {
        svg,
        lat,
        lon,
      };
    },
  },
  OccurrenceFeatures: {
    isSpecimen: ({ basisOfRecord }) => {
      return (
        basisOfRecord === 'MATERIAL_SAMPLE' ||
        basisOfRecord === 'PRESERVED_SPECIMEN' ||
        basisOfRecord === 'LIVING_SPECIMEN' ||
        basisOfRecord === 'FOSSIL_SPECIMEN'
      );
    },
    // plazi this won't work in other environments than prod for now. all in all we should have a better way to detect treatments
    isTreament: ({ publishingOrgKey }) =>
      publishingOrgKey === '7ce8aef0-9e92-11dc-8738-b8a03c50a862',
    isClustered: ({ key }, _args, { dataSources }) => {
      return dataSources.occurrenceAPI
        .getRelated({ key })
        .then((response) => response.relatedOccurrences.length > 0);
    },
    isSequenced: (occurrence, _args, { dataSources }) => {
      return dataSources.occurrenceAPI
        .getVerbatim({ key: occurrence.key })
        .then((verbatim) => isOccurrenceSequenced({ occurrence, verbatim }));
    },
    isSamplingEvent: (occurrence) =>
      !!occurrence.eventId && !!occurrence.samplingProtocol,
  },
  RelatedOccurrence: {
    occurrence: (related, _args, { dataSources }) =>
      dataSources.occurrenceAPI.getOccurrenceByKey({
        key: related.occurrence.gbifId,
      }),
    stub: (related) => related.occurrence,
  },
  LongitudeHistogram: {
    bounds: ({ buckets, interval }) => {
      return getLongitudeBounds(buckets, interval);
    },
  },
  // TermGroups: (occurrence, args, { dataSources }) => {
  //   console.log('get verbatim');
  //   return dataSources.occurrenceAPI.getVerbatim({key: occurrence.key })
  //     .then(verbatim => {
  //       console.log('sdf');
  //       groupResolver({occurrence, verbatim})
  //     });
  // }
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
