/* eslint-disable no-param-reassign */
import interpretationRemark from '#/helpers/enums/interpretationRemark';
import getFeedbackOptions from '#/helpers/feedback';
import getGlobe from '#/helpers/globe';
import {
  formattedCoordinates,
  getFirstIIIFImage,
  simplifyUrlObjectKeys,
} from '#/helpers/utils';
import _ from 'lodash';
import md5 from 'md5';
import config from '../../../config';
import {
  getAutoDateHistogram,
  getCardinality,
  getFacet,
  getHistogram,
  getStats,
} from '../getMetrics';
import getVernacularNames from '../taxon/getVernacularNames';
import {
  cardinalityFields,
  dateHistogramFields,
  facetFields,
  histogramFields,
  statsFields,
} from './helpers/fields';
import groupResolver from './helpers/groups/occurrenceGroups';
import getLongitudeBounds from './helpers/longitudeBounds';
import predicate2v1 from './helpers/predicate2v1';
import termResolver from './helpers/terms/occurrenceTerms';

const issueSeverityMap = interpretationRemark.reduce((acc, issue) => {
  acc[issue.id] = issue.severity;
  return acc;
}, {});

const getSourceSearch = (dataSources) => (args) =>
  dataSources.occurrenceAPI.searchOccurrences.call(
    dataSources.occurrenceAPI,
    args,
  );

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName, getSourceSearch);
  return dictionary;
};
const OccurrenceFacet = facetFields.reduce(facetReducer, {});

// there are also many fields that support stats. Generate them all.
const statsReducer = (dictionary, statsName) => {
  dictionary[statsName] = getStats(statsName, getSourceSearch);
  return dictionary;
};
const OccurrenceStats = statsFields.reduce(statsReducer, {});

// there are also many fields that support cardinality. Generate them all.
const cardinalityReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getCardinality(fieldName, getSourceSearch);
  return dictionary;
};
const OccurrenceCardinality = cardinalityFields.reduce(cardinalityReducer, {});

// there are also many fields that support histograms. Generate them all.
const histogramReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getHistogram(fieldName, getSourceSearch);
  return dictionary;
};
const OccurrenceHistogram = histogramFields.reduce(histogramReducer, {});

// there are also many fields that support date histograms. Generate them all.
const autoDateHistogramReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getAutoDateHistogram(fieldName, getSourceSearch);
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
      // return dataSources.occurrenceAPI.searchOccurrences({ query: args });
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
  MultimediaItem: {
    thumbor: (
      { identifier, type, occurrenceKey },
      { fitIn, width = '', height = '' },
    ) => {
      if (!identifier) return null;
      if (type !== 'StillImage') return null;
      if (!occurrenceKey) return null;
      // do not use the thumbor service.
      // for occurrences we have a special url format for the occurrence images. This is in preparation for the new image service that will disable any unsafe urls
      // it also has a different cache purge strategy
      // see also https://github.com/gbif/gbif-web/issues/303
      try {
        const url = `${config.occurrenceImageCache}/${
          fitIn ? 'fit-in/' : ''
        }${width}x${height}/occurrence/${occurrenceKey}/media/${md5(
          identifier ?? '',
        )}`;
        return url;
      } catch (err) {
        return identifier;
      }
    },
  },
  Occurrence: {
    coordinates: ({ decimalLatitude, decimalLongitude }) => {
      if (typeof decimalLatitude === 'undefined') return null;
      // extract primary image. for now just any image
      return { lat: decimalLatitude, lon: decimalLongitude };
    },
    media: ({ key, media }) => {
      // add occurrence key to the media objects
      return media.map((x) => {
        return { ...x, occurrenceKey: key };
      });
    },
    primaryImage: ({ key, media }) => {
      if (!Array.isArray(media)) return null;
      // extract primary image. for now just any image
      const img = media.find((x) => x.type === 'StillImage');
      if (img) {
        return { ...img, occurrenceKey: key };
      }
      return null;
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
    stillImages: ({ media, key }) => {
      if (!Array.isArray(media)) return null;
      return (
        media
          .filter((x) => x.type === 'StillImage')
          // this isn't ideal. I would prefer to keep the order from the API. But the API do not reflect the order the publisher provided. So for now sorting by date is probably preferable.
          .sort((a, b) => {
            // sort by created if available. Else just keep the order
            if (a.created && b.created) {
              // just compare them as strings
              return a.created.localeCompare(b.created);
            }
            return 0;
          })
          .map((x) => {
            return { ...x, occurrenceKey: key };
          })
      );
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
    issues: ({ issues }, { types }) => {
      if (!issues) return null;
      if (!types) return issues;
      // remove issues that are not of the specific types based on the interpretation remarks that classify issues into types
      const filteredIssues = issues.filter((issue) => {
        const issueType = issueSeverityMap[issue];
        if (issueType) {
          // remove issues that are not of the specific types
          return types.includes(issueType);
        }
        return false;
      });
      return filteredIssues;
    },
    acceptedTaxon: ({ acceptedTaxonKey }, _args, { dataSources }) => {
      if (!acceptedTaxonKey) return null;
      return dataSources.taxonAPI.getTaxonByKey({ key: acceptedTaxonKey });
    },
    taxon: ({ taxonKey }, _args, { dataSources }) => {
      if (!taxonKey) return null;
      return dataSources.taxonAPI.getTaxonByKey({ key: taxonKey });
    },
    volatile: (occurrence) => occurrence,
    related: ({ key }, { from = 0, size = 20 }, { dataSources }) => {
      return dataSources.occurrenceAPI.getRelated({ key }).then((response) => {
        return {
          size,
          from,
          count: response.relatedOccurrences.length,
          currentOccurrence: response.currentOccurrence,
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
    extensions: (occurrence) => {
      const extensions = {
        audubon:
          occurrence?.extensions?.['http://rs.tdwg.org/ac/terms/Multimedia'],
        amplification:
          occurrence?.extensions?.[
            'http://data.ggbn.org/schemas/ggbn/terms/Amplification'
          ],
        germplasmAccession:
          occurrence?.extensions?.[
            'http://purl.org/germplasm/germplasmTerm#GermplasmAccession'
          ],
        germplasmMeasurementScore:
          occurrence?.extensions?.[
            'http://purl.org/germplasm/germplasmTerm#MeasurementScore'
          ],
        germplasmMeasurementTrait:
          occurrence?.extensions?.[
            'http://purl.org/germplasm/germplasmTerm#MeasurementTrait'
          ],
        germplasmMeasurementTrial:
          occurrence?.extensions?.[
            'http://purl.org/germplasm/germplasmTerm#MeasurementTrial'
          ],
        identification:
          occurrence?.extensions?.[
            'http://rs.tdwg.org/dwc/terms/Identification'
          ],
        identifier:
          occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/Identifier'],
        image: occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/Image'],
        measurementOrFact:
          occurrence?.extensions?.[
            'http://rs.tdwg.org/dwc/terms/MeasurementOrFact'
          ],
        multimedia:
          occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/Multimedia'],
        reference:
          occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/Reference'],
        eolReference:
          occurrence?.extensions?.['http://eol.org/schema/reference/Reference'],
        resourceRelationship:
          occurrence?.extensions?.[
            'http://rs.tdwg.org/dwc/terms/ResourceRelationship'
          ],
        cloning:
          occurrence?.extensions?.[
            'http://data.ggbn.org/schemas/ggbn/terms/Cloning'
          ],
        gelImage:
          occurrence?.extensions?.[
            'http://data.ggbn.org/schemas/ggbn/terms/GelImage'
          ],
        loan: occurrence?.extensions?.[
          'http://data.ggbn.org/schemas/ggbn/terms/Loan'
        ],
        materialSample:
          occurrence?.extensions?.[
            'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample'
          ],
        permit:
          occurrence?.extensions?.[
            'http://data.ggbn.org/schemas/ggbn/terms/Permit'
          ],
        preparation:
          occurrence?.extensions?.[
            'http://data.ggbn.org/schemas/ggbn/terms/Preparation'
          ],
        preservation:
          occurrence?.extensions?.[
            'http://data.ggbn.org/schemas/ggbn/terms/Preservation'
          ],
        extendedMeasurementOrFact:
          occurrence?.extensions?.[
            'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact'
          ],
        chronometricAge:
          occurrence?.extensions?.[
            'http://rs.tdwg.org/chrono/terms/ChronometricAge'
          ],
        dnaDerivedData:
          occurrence?.extensions?.[
            'http://rs.gbif.org/terms/1.0/DNADerivedData'
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
    formattedName: (
      { key, name },
      { useFallback = false },
      { dataSources },
    ) => {
      return dataSources.taxonAPI
        .getParsedName({ key })
        .then((formattedName) => {
          return formattedName;
        })
        .catch((err) => {
          if (useFallback) {
            return name;
          }
          throw err;
        });
    },
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
  OccurrenceFacetResult_establishmentMeans: {
    concept: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.vocabularyAPI.getConcept({
        vocabulary: 'establishmentMeans',
        concept: key,
      });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_gadm: {
    gadm: ({ key }, _args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.gadmAPI.getGadmById({ id: key });
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
  OccurrenceFacetResult_typeStatus: {
    concept: ({ key }, _args, { dataSources }) => {
      if (!key) return null;
      return dataSources.vocabularyAPI.getConcept({
        vocabulary: 'typeStatus',
        concept: key,
      });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_sex: {
    concept: ({ key }, _args, { dataSources }) => {
      if (!key) return null;
      return dataSources.vocabularyAPI.getConcept({
        vocabulary: 'Sex',
        concept: key,
      });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_pathway: {
    concept: ({ key }, _args, { dataSources }) => {
      if (!key) return null;
      return dataSources.vocabularyAPI.getConcept({
        vocabulary: 'Pathway',
        concept: key,
      });
    },
    occurrences: facetOccurrenceSearch,
  },
  OccurrenceFacetResult_degreeOfEstablishment: {
    concept: ({ key }, _args, { dataSources }) => {
      if (!key) return null;
      return dataSources.vocabularyAPI.getConcept({
        vocabulary: 'DegreeOfEstablishment',
        concept: key,
      });
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
    vernacularNames: (
      { taxonKey },
      { limit = 10, offset = 0, language, source, removeDuplicates },
      { dataSources },
    ) => {
      return getVernacularNames({
        taxonKey,
        limit,
        offset,
        language,
        source,
        dataSources,
        removeDuplicates,
      });
    },
    features: (occurrence) => occurrence,
    globe: (
      { decimalLatitude, decimalLongitude },
      { sphere, graticule, land },
    ) => {
      if (
        typeof decimalLatitude !== 'number' ||
        typeof decimalLongitude !== 'number'
      )
        return null;

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
    feedback: (occurrence, _args, { dataSources }) => {
      return getFeedbackOptions({ occurrence, dataSources });
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
    isClustered: ({ isInCluster }) => {
      return isInCluster;
    },
    isSequenced: ({ isSequenced }) => {
      return isSequenced;
    },
    isSamplingEvent: (occurrence) =>
      !!occurrence.eventId && !!occurrence.samplingProtocol,
    firstIIIF: (occurrence) => {
      return getFirstIIIFImage({ occurrence });
    },
  },
  RelatedOccurrence: {
    occurrence: (related, _args, { dataSources }) =>
      dataSources.occurrenceAPI
        .getOccurrenceByKey({
          key: related.occurrence.gbifId,
        })
        .then((occurrence) => {
          return occurrence;
        })
        .catch((err) => {
          // if a 404 error, then just ignore. it is expected that some related occurrences are not found as they can have been deleted
          if (err?.extensions?.response?.status === 404) {
            return null;
          }
          throw err;
        }),
    stub: (related) => related.occurrence,
  },
  RelatedCurrentOccurrence: {
    occurrence: (current, _args, { dataSources }) =>
      dataSources.occurrenceAPI.getOccurrenceByKey({
        key: current.gbifId,
      }),
    stub: (current) => current,
  },
  LongitudeHistogram: {
    bounds: ({ buckets, interval }) => {
      return getLongitudeBounds(buckets, interval);
    },
  },
};
