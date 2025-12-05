import React from 'react';
import { Input } from '../../components';

import basisofRecord from '../../enums/basic/basisOfRecord.json';
import collectionContentType from '../../enums/basic/collectionContentType.json';
import continent from '../../enums/basic/continent.json';
import datasetSubtype from '../../enums/basic/datasetSubtype.json';
import datasetType from '../../enums/basic/datasetType.json';
import discipline from '../../enums/basic/discipline.json';
import dwcaExtension from '../../enums/basic/dwcaExtension.json';
import endpointType from '../../enums/basic/endpointType.json';
import establishmentMeans from '../../enums/basic/establishmentMeans.json';
import institutionType from '../../enums/basic/institutionType.json';
import iucnRedListCategory from '../../enums/basic/iucnRedListCategory.json';
import license from '../../enums/basic/license.json';
import mediaType from '../../enums/basic/mediaType.json';
import month from '../../enums/basic/month.json';
import occurrenceIssue from '../../enums/basic/occurrenceIssue.json';
import occurrenceStatus from '../../enums/basic/occurrenceStatus.json';
import preservationType from '../../enums/basic/preservationType.json';
import literatureType from '../../enums/cms/literatureType.json';
import relevance from '../../enums/cms/relevance.json';
import topics from '../../enums/cms/topics.json';
// -- Add imports above this line (required by plopfile.js) --

export const commonFilters = {
  taxonKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'taxonKey', // if nothing else provided, then this is the filterName used
        id2labelHandle: 'canonicalName',
        translations: {
          count: 'filters.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.taxonKey.name', // translation path to a title for the popover and the button
          description: 'filters.taxonKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'taxonKey',
        id2labelHandle: 'taxonKey',
      },
    },
  },
  taxonKeyGrSciColl: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'canonicalName',
        translations: {
          count: 'filters.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.taxonKey.name', // translation path to a title for the popover and the button
          description: 'filters.taxonKeyGrSciColl.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'taxonKey',
        id2labelHandle: 'taxonKey',
        showAboutAsDefault: true,
      },
    },
  },
  geoDistance: {
    type: 'GEO_DISTANCE',
    config: {
      std: {
        id2labelHandle: 'geoDistance',
        translations: {
          count: 'filters.geoDistance.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.geoDistance.name', // translation path to a title for the popover and the button
          description: 'filters.geoDistance.description', // translation path for the filter description
        },
      },
      specific: {
        // These are far from precise, but they can help the user avoid the worst mistakes i hope
        latRegex: /^([1-9]{1})?[0-9]{0,1}((\.)[0-9]{0,8})?$/,
        lonRegex: /^([1]{1})?[0-9]{0,2}((\.)[0-9]{0,8})?$/,
        kmRegex: /^[0-9]*((\.)[0-9]{0,8})?$/,
        placeholderLat: 'filters.geoDistance.placeholderLat',
        placeholderLon: 'filters.geoDistance.placeholderLon',
        placeholderDist: 'filters.geoDistance.placeholderDist',
        singleSelect: true,
      },
    },
  },
  country: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.occurrenceCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceCountry.name', // translation path to a title for the popover and the button
          description: 'filters.occurrenceCountry.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      },
    },
  },
  countrySingle: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.occurrenceCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceCountry.name', // translation path to a title for the popover and the button
          description: 'filters.occurrenceCountry.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
        singleSelect: true,
      },
    },
  },
  countryGrSciColl: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.occurrenceCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceCountry.name', // translation path to a title for the popover and the button
          description: 'filters.grsciCollCountry.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      },
    },
  },
  countriesOfCoverage: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.countriesOfCoverage.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.countriesOfCoverage.name', // translation path to a title for the popover and the button
          description: 'filters.countriesOfCoverage.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      },
    },
  },
  collectionDescriptorCountry: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.collectionDescriptorCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.collectionDescriptorCountry.name', // translation path to a title for the popover and the button
          description: 'filters.collectionDescriptorCountry.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
        showAboutAsDefault: true,
      },
    },
  },
  geometry: {
    type: 'GEOMETRY',
    config: {
      std: {
        id2labelHandle: 'geometry',
        translations: {
          count: 'filters.geometry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.geometry.name', // translation path to a title for the popover and the button
          description: 'filters.geometry.description', // translation path for the filter description
        },
      },
      specific: {},
    },
  },
  countriesOfResearcher: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.countriesOfResearcher.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.countriesOfResearcher.name', // translation path to a title for the popover and the button
          description: 'filters.countriesOfResearcher.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      },
    },
  },
  publishingCountryCode: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.publishingCountryCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.publishingCountryCode.name', // translation path to a title for the popover and the button
          description: 'filters.publishingCountryCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      },
    },
  },
  datasetKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filters.datasetKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.datasetKey.name', // translation path to a title for the popover and the button
          description: 'filters.datasetKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'datasetKeyFromOccurrenceIndex',
        allowEmptyQueries: true,
      },
    },
  },
  eventDatasetKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'datasetKey',
        id2labelHandle: 'eventDatasetKey',
        translations: {
          count: 'filters.datasetKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.datasetKey.name', // translation path to a title for the popover and the button
          description: 'filters.datasetKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'datasetKeyFromEventIndex',
        allowEmptyQueries: true,
      },
    },
  },
  publisherKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filters.publisherKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.publisherKey.name', // translation path to a title for the popover and the button
          description: 'filters.publisherKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKeyFromOccurrenceIndex',
        allowEmptyQueries: true,
      },
    },
  },
  anyPublisherKey: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'publisherKey',
        translations: {
          count: 'filters.publisherKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.publisherKey.name', // translation path to a title for the popover and the button
          description: 'filters.publisherKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
        allowEmptyQueries: true,
      },
    },
  },
  gbifPublisherKey: {
    // same as any publisher, but with a more explicit naming
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'publisherKey',
        translations: {
          count: 'filters.gbifPublisherKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.gbifPublisherKey.name', // translation path to a title for the popover and the button
          description: 'filters.gbifPublisherKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
        allowEmptyQueries: true,
      },
    },
  },
  institutionCode: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filters.institutionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.institutionCode.name', // translation path to a title for the popover and the button
          description: 'filters.institutionCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'institutionCode',
        supportsExist: true,
      },
    },
  },
  catalogNumber: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'catalogNumber', // if nothing else provided, then this is the filterName used
        id2labelHandle: 'wildcard',
        translations: {
          count: 'filters.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.catalogNumber.name', // translation path to a title for the popover and the button
          description: 'filters.catalogNumber.description', // translation path for the filter description
        },
      },
      specific: {
        id2labelHandle: 'wildcard',
        placeholder: 'search.placeholders.wildcard',
        supportsExist: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              cardinality {
                catalogNumber
              }
              facet {
                catalogNumber(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'catalogNumber',
      },
    },
    // type: 'SUGGEST',
    // config: {
    //   std: {
    //     translations: {
    //       count: 'filters.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
    //       name: 'filters.catalogNumber.name',// translation path to a title for the popover and the button
    //       description: 'filters.catalogNumber.description', // translation path for the filter description
    //     },
    //   },
    //   specific: {
    //     suggestHandle: 'catalogNumber',
    //     supportsExist: true,
    //   }
    // }
  },
  // catalogNumber: {
  //   type: 'SUGGEST',
  //   config: {
  //     std: {
  //       filterHandle: 'catalogNumber',// if nothing else provided, then this is the filterName used
  //       id2labelHandle: 'catalogNumber',
  //       translations: {
  //         count: 'filters.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'filters.catalogNumber.name',// translation path to a title for the popover and the button
  //         description: 'filters.catalogNumber.description', // translation path for the filter description
  //       },
  //     },
  //     specific: {
  //       suggestHandle: 'catalogNumber',
  //       id2labelHandle: 'catalogNumber',
  //     }
  //   }
  // },
  hostingOrganizationKey: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'publisherKey',
        translations: {
          count: 'filters.hostingOrganizationKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.hostingOrganizationKey.name', // translation path to a title for the popover and the button
          description: 'filters.hostingOrganizationKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
        id2labelHandle: 'publisherKey',
      },
    },
  },
  year: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'year',
        id2labelHandle: 'year',
        translations: {
          count: 'filters.year.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.year.name', // translation path to a title for the popover and the button
          description: 'filters.year.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        supportsExist: true,
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/,
      },
    },
  },
  specimensInGbif: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'specimensInGbif',
        id2labelHandle: 'interval',
        translations: {
          count: 'filters.specimensInGbif.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.specimensInGbif.name', // translation path to a title for the popover and the button
          description: 'filters.specimensInGbif.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        supportsExist: true,
        singleSelect: true,
        regex: /^((-)?[0-9]{0,12})(,)?((-)?[0-9]{0,12})$/,
      },
    },
  },
  basisOfRecord: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'basisOfRecord',
        id2labelHandle: 'basisOfRecord',
        translations: {
          count: 'filters.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.basisOfRecord.name', // translation path to a title for the popover and the button
          description: 'filters.basisOfRecord.description', // translation path for the filter description
        },
      },
      specific: {
        options: basisofRecord,
        supportsInverse: true,
      },
    },
  },
  relevance: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'relevance',
        id2labelHandle: 'relevance',
        translations: {
          count: 'filters.relevance.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.relevance.name', // translation path to a title for the popover and the button
          description: 'filters.relevance.description', // translation path for the filter description
        },
      },
      specific: {
        options: relevance,
        supportsInverse: true,
      },
    },
  },
  topics: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'topics',
        id2labelHandle: 'topics',
        translations: {
          count: 'filters.topics.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.topics.name', // translation path to a title for the popover and the button
          description: 'filters.topics.description', // translation path for the filter description
        },
      },
      specific: {
        options: topics,
        supportsInverse: true,
      },
    },
  },
  // typeStatus: {
  //   type: 'ENUM',
  //   config: {
  //     std: {
  //       filterHandle: 'typeStatus',
  //       id2labelHandle: 'typeStatus',
  //       translations: {
  //         count: 'filters.typeStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'filters.typeStatus.name',// translation path to a title for the popover and the button
  //         description: 'filters.typeStatus.description', // translation path for the filter description
  //       }
  //     },
  //     specific: {
  //       options: typeStatus,
  //       supportsInverse: true,
  //     }
  //   }
  // },
  typeStatus: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'typeStatus',
        id2labelHandle: 'typeStatusVocabulary',
        translations: {
          count: 'filters.typeStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.typeStatus.name', // translation path to a title for the popover and the button
          description: 'filters.typeStatus.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'typeStatusVocab',
        id2labelHandle: 'typeStatusVocabulary',
        allowEmptyQueries: true,
      },
    },
  },
  occurrenceIssue: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'occurrenceIssue',
        id2labelHandle: 'occurrenceIssue',
        translations: {
          count: 'filters.occurrenceIssue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceIssue.name', // translation path to a title for the popover and the button
          description: 'filters.occurrenceIssue.description', // translation path for the filter description
        },
      },
      specific: {
        options: occurrenceIssue,
        supportsNegation: true,
        supportsExist: true,
        supportsInverse: true,
      },
    },
  },
  mediaType: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'mediaType',
        id2labelHandle: 'mediaType',
        translations: {
          count: 'filters.mediaType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.mediaType.name', // translation path to a title for the popover and the button
          description: 'filters.mediaType.description', // translation path for the filter description
        },
      },
      specific: {
        options: mediaType,
      },
    },
  },
  sampleSizeUnit: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'sampleSizeUnit',
        translations: {
          count: 'filters.sampleSizeUnit.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.sampleSizeUnit.name', // translation path to a title for the popover and the button
          description: 'filters.sampleSizeUnit.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'search.placeholders.wildcard',
        disallowLikeFilters: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              cardinality {
                sampleSizeUnit
              }
              facet {
                sampleSizeUnit(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'sampleSizeUnit',
      },
    },
  },
  license: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'license',
        id2labelHandle: 'license',
        translations: {
          count: 'filters.license.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.license.name', // translation path to a title for the popover and the button
          description: 'filters.license.description', // translation path for the filter description
        },
      },
      specific: {
        options: license,
        supportsInverse: true,
      },
    },
  },
  coordinateUncertainty: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'coordinateUncertainty',
        id2labelHandle: 'coordinateUncertainty',
        translations: {
          count: 'filters.coordinateUncertainty.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.coordinateUncertainty.name', // translation path to a title for the popover and the button
          description: 'filters.coordinateUncertainty.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/,
      },
    },
  },
  depth: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'depth',
        id2labelHandle: 'depth',
        translations: {
          count: 'filters.depth.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.depth.name', // translation path to a title for the popover and the button
          description: 'filters.depth.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/,
      },
    },
  },
  organismQuantity: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'organismQuantity',
        id2labelHandle: 'organismQuantity',
        translations: {
          count: 'filters.organismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.organismQuantity.name', // translation path to a title for the popover and the button
          description: 'filters.organismQuantity.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/,
      },
    },
  },
  sampleSizeValue: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'sampleSizeValue',
        id2labelHandle: 'sampleSizeValue',
        translations: {
          count: 'filters.sampleSizeValue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.sampleSizeValue.name', // translation path to a title for the popover and the button
          description: 'filters.sampleSizeValue.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/,
      },
    },
  },
  relativeOrganismQuantity: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'relativeOrganismQuantity',
        id2labelHandle: 'relativeOrganismQuantity',
        translations: {
          count: 'filters.relativeOrganismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.relativeOrganismQuantity.name', // translation path to a title for the popover and the button
          description: 'filters.relativeOrganismQuantity.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^[0-9,\.]{0,10}$/,
      },
    },
  },
  month: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'month',
        id2labelHandle: 'month',
        translations: {
          count: 'filters.month.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.month.name', // translation path to a title for the popover and the button
          description: 'filters.month.description', // translation path for the filter description
        },
      },
      specific: {
        options: month,
        supportsExist: true,
        supportsInverse: true,
      },
    },
  },
  continent: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'continent',
        id2labelHandle: 'continent',
        translations: {
          count: 'filters.continent.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.continent.name', // translation path to a title for the popover and the button
          description: 'filters.continent.description', // translation path for the filter description
        },
      },
      specific: {
        options: continent,
        supportsInverse: true,
      },
    },
  },
  protocol: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'protocol',
        id2labelHandle: 'protocol',
        translations: {
          count: 'filters.protocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.protocol.name', // translation path to a title for the popover and the button
          description: 'filters.protocol.description', // translation path for the filter description
        },
      },
      specific: {
        options: endpointType,
        supportsInverse: true,
      },
    },
  },
  establishmentMeans: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'establishmentMeans',
        id2labelHandle: 'establishmentMeansVocabulary',
        translations: {
          count: 'filters.establishmentMeans.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.establishmentMeans.name', // translation path to a title for the popover and the button
          description: 'filters.establishmentMeans.description', // translation path for the filter description
        },
      },
      specific: {
        options: establishmentMeans,
        suggestHandle: 'establishmentMeans',
        id2labelHandle: 'establishmentMeansVocabulary',
        allowEmptyQueries: true,
      },
    },
  },
  eventType: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'eventType',
        id2labelHandle: 'identityFn',
        translations: {
          count: 'filters.eventType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.eventType.name', // translation path to a title for the popover and the button
          description: 'filters.eventType.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
            query keywordSearch($predicate: Predicate, $size: Int){
              suggestions: eventSearch(predicate: $predicate) {
                facet {
                  eventType(size: $size) {
                    key
                    count
                  }
                }
              }
            }
        `,
        queryKey: 'eventType',
        keepCase: true,
      },
    },
  },
  recordedBy: {
    // type: 'SUGGEST',
    type: 'KEYWORD_SEARCH', //KEYWORD_SEARCH | SUGGEST
    config: {
      std: {
        filterHandle: 'recordedBy', // if nothing else provided, then this is the filterName used
        id2labelHandle: 'wildcard', //'recordedBy',
        translations: {
          count: 'filters.recordedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.recordedBy.name', // translation path to a title for the popover and the button
          description: 'filters.recordedBy.description', // translation path for the filter description
        },
      },
      specific: {
        // suggestHandle: 'recordedBy',
        // suggestHandle: 'recordedByWildcard',
        placeholder: 'search.placeholders.wildcard',
        supportsExist: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int, $include: String){
            suggestions: occurrenceSearch(predicate: $predicate) {
              facet {
                recordedBy(size: $size, include: $include) {
                  key
                  count
                }
              }
            }
          }
        `,
        // keepCase: true,
        queryKey: 'recordedBy',
      },
    },
  },
  recordedByFreeText: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        id2labelHandle: 'recordedBy',
        translations: {
          count: 'filters.recordedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.recordedBy.name', // translation path to a title for the popover and the button
          description: 'filters.recordedBy.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by collector name',
        supportsExist: false,
      },
    },
  },
  higherGeography: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        id2labelHandle: 'higherGeography',
        translations: {
          count: 'filters.higherGeography.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.higherGeography.name', // translation path to a title for the popover and the button
          description: 'filters.higherGeography.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: false,
      },
    },
  },
  recordNumber: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'recordNumber', // if nothing else provided, then this is the filterName used
        id2labelHandle: 'recordNumber',
        translations: {
          count: 'filters.recordNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.recordNumber.name', // translation path to a title for the popover and the button
          description: 'filters.recordNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'recordNumber',
        id2labelHandle: 'recordNumber',
        supportsExist: true,
      },
    },
  },
  collectionCode: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'collectionCode',
        id2labelHandle: 'collectionCode',
        translations: {
          count: 'filters.collectionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.collectionCode.name', // translation path to a title for the popover and the button
          description: 'filters.collectionCode.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by collection code',
        supportsExist: true,
      },
    },
  },
  projectId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'projectId',
        id2labelHandle: 'projectId',
        translations: {
          count: 'filters.projectId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.projectId.name', // translation path to a title for the popover and the button
          description: 'filters.projectId.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by project ID',
        supportsExist: true,
      },
    },
  },
  recordedById: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'recordedById',
        id2labelHandle: 'recordedById',
        translations: {
          count: 'filters.recordedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.recordedById.name', // translation path to a title for the popover and the button
          description: 'filters.recordedById.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'Example: https://orcid.org/0000-1111-2222-3333',
      },
    },
  },
  identifiedById: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'identifiedById',
        id2labelHandle: 'identifiedById',
        translations: {
          count: 'filters.identifiedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.identifiedById.name', // translation path to a title for the popover and the button
          description: 'filters.identifiedById.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'Example: https://orcid.org/0000-1111-2222-3333',
      },
    },
  },
  occurrenceId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'occurrenceId',
        id2labelHandle: 'occurrenceId',
        translations: {
          count: 'filters.occurrenceId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceId.name', // translation path to a title for the popover and the button
          description: 'filters.occurrenceId.description', // translation path for the filter description
        },
      },
      specific: {
        supportsNegation: true,
        placeholder: 'Search by Occurrence identifier',
      },
    },
  },
  organismId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'organismId',
        id2labelHandle: 'organismId',
        translations: {
          count: 'filters.organismId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.organismId.name', // translation path to a title for the popover and the button
          description: 'filters.organismId.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'Search by Organism identifier',
      },
    },
  },
  locality: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'locality',
        id2labelHandle: 'locality',
        translations: {
          count: 'filters.locality.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.locality.name', // translation path to a title for the popover and the button
          description: 'filters.locality.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              cardinality {
                locality
              }
              facet {
                locality(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'locality',
      },
    },
  },
  waterBody: {
    type: 'KEYWORD_SEARCH', // SIMPLE_TEXT
    config: {
      std: {
        filterHandle: 'waterBody',
        id2labelHandle: 'waterBody',
        translations: {
          count: 'filters.waterBody.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.waterBody.name', // translation path to a title for the popover and the button
          description: 'filters.waterBody.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              cardinality {
                waterBody
              }
              facet {
                waterBody(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'waterBody',
      },
    },
  },
  stateProvince: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'stateProvince',
        id2labelHandle: 'stateProvince',
        translations: {
          count: 'filters.stateProvince.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.stateProvince.name', // translation path to a title for the popover and the button
          description: 'filters.stateProvince.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              cardinality {
                stateProvince
              }
              facet {
                stateProvince(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'stateProvince',
      },
    },
  },
  eventStateProvince: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'eventStateProvince',
        id2labelHandle: 'stateProvince',
        translations: {
          count: 'filters.stateProvince.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.stateProvince.name', // translation path to a title for the popover and the button
          description: 'filters.stateProvince.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: eventSearch(predicate: $predicate) {
              facet {
                stateProvince(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'stateProvince',
      },
    },
  },
  eventId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'eventId',
        id2labelHandle: 'eventId',
        translations: {
          count: 'filters.eventId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.eventId.name', // translation path to a title for the popover and the button
          description: 'filters.eventId.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by Event identifier',
        supportsExist: true,
      },
    },
  },
  parentEventId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'parentEventId',
        id2labelHandle: 'parentEventId',
        translations: {
          count: 'filters.parentEventId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.parentEventId.name', // translation path to a title for the popover and the button
          description: 'filters.parentEventId.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by parent event identifier',
        supportsExist: true,
      },
    },
  },
  samplingProtocol: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'samplingProtocol',
        id2labelHandle: 'samplingProtocol',
        translations: {
          count: 'filters.samplingProtocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.samplingProtocol.name', // translation path to a title for the popover and the button
          description: 'filters.samplingProtocol.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              facet {
                samplingProtocol(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'samplingProtocol',
      },
    },
  },
  eventSamplingProtocol: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'samplingProtocol',
        id2labelHandle: 'samplingProtocol',
        translations: {
          count: 'filters.samplingProtocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.samplingProtocol.name', // translation path to a title for the popover and the button
          description: 'filters.samplingProtocol.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int, $include: String){
            suggestions: eventSearch(predicate: $predicate) {
              facet {
                samplingProtocol(size: $size, include: $include) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'samplingProtocol',
      },
    },
  },
  elevation: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'elevation',
        id2labelHandle: 'elevation',
        translations: {
          count: 'filters.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.elevation.name', // translation path to a title for the popover and the button
          description: 'filters.elevation.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^[0-9,\.]{0,10}$/,
      },
    },
  },
  occurrenceStatus: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'occurrenceStatus',
        id2labelHandle: 'occurrenceStatus',
        translations: {
          count: 'filters.occurrenceStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceStatus.name', // translation path to a title for the popover and the button
          description: 'filters.occurrenceStatus.description', // translation path for the filter description
        },
      },
      specific: {
        options: occurrenceStatus,
      },
    },
  },
  gadmGid: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'gadmGid',
        id2labelHandle: 'gadmGid',
        translations: {
          count: 'filters.gadmGid.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.gadmGid.name', // translation path to a title for the popover and the button
          description: 'filters.gadmGid.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'gadmGid',
        id2labelHandle: 'gadmGid',
        showAboutAsDefault: true,
        supportsExist: true,
      },
    },
  },
  identifiedBy: {
    type: 'KEYWORD_SEARCH', // SIMPLE_TEXT
    config: {
      std: {
        filterHandle: 'identifiedBy',
        id2labelHandle: 'identifiedBy',
        translations: {
          count: 'filters.identifiedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.identifiedBy.name', // translation path to a title for the popover and the button
          description: 'filters.identifiedBy.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        supportsExist: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              cardinality {
                identifiedBy
              }
              facet {
                identifiedBy(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'identifiedBy',
      },
    },
  },
  isInCluster: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'isInCluster',
        id2labelHandle: 'isInCluster',
        translations: {
          count: 'filters.isInCluster.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.isInCluster.name', // translation path to a title for the popover and the button
          description: 'filters.isInCluster.description', // translation path for the filter description
        },
      },
      specific: {
        options: ['true', 'false'],
        isRadio: true,
      },
    },
  },
  isSequenced: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'isSequenced',
        id2labelHandle: 'yesNo',
        translations: {
          count: 'filters.isSequenced.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.isSequenced.name', // translation path to a title for the popover and the button
          description: 'filters.isSequenced.description', // translation path for the filter description
        },
      },
      specific: {
        options: ['true', 'false'],
        isRadio: true,
      },
    },
  },
  active: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'active',
        id2labelHandle: 'yesNo',
        translations: {
          count: 'filters.active.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.active.name', // translation path to a title for the popover and the button
          description: 'filters.active.description', // translation path for the filter description
        },
      },
      specific: {
        options: ['true', 'false'],
        isRadio: true,
      },
    },
  },
  personalCollection: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'personalCollection',
        id2labelHandle: 'yesNo',
        translations: {
          count: 'filters.personalCollection.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.personalCollection.name', // translation path to a title for the popover and the button
          description: 'filters.personalCollection.description', // translation path for the filter description
        },
      },
      specific: {
        options: ['true', 'false'],
        isRadio: true,
      },
    },
  },
  datasetType: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'datasetType',
        id2labelHandle: 'datasetType',
        translations: {
          count: 'filters.datasetType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.datasetType.name', // translation path to a title for the popover and the button
          description: 'filters.datasetType.description', // translation path for the filter description
        },
      },
      specific: {
        options: datasetType,
      },
    },
  },
  datasetSubtype: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'datasetSubtype',
        id2labelHandle: 'datasetSubtype',
        translations: {
          count: 'filters.datasetSubtype.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.datasetSubtype.name', // translation path to a title for the popover and the button
          description: 'filters.datasetSubtype.description', // translation path for the filter description
        },
      },
      specific: {
        options: datasetSubtype,
      },
    },
  },
  institutionKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'institutionKey',
        id2labelHandle: 'institutionKey',
        translations: {
          count: 'filters.institutionKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.institutionKey.name', // translation path to a title for the popover and the button
          description: 'filters.institutionKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'institutionKey',
        id2labelHandle: 'institutionKey',
        supportsExist: true,
      },
    },
  },
  collectionKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'collectionKey',
        id2labelHandle: 'collectionKey',
        translations: {
          count: 'filters.collectionKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.collectionKey.name', // translation path to a title for the popover and the button
          description: 'filters.collectionKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'collectionKey',
        id2labelHandle: 'collectionKey',
        supportsExist: true,
      },
    },
  },
  institutionKeySingle: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'institutionKeySingle',
        id2labelHandle: 'institutionKey',
        translations: {
          count: 'filters.institutionKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.institutionKey.name', // translation path to a title for the popover and the button
          description: 'filters.institutionKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'institutionKey',
        id2labelHandle: 'institutionKey',
        singleSelect: true,
      },
    },
  },
  name: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'name',
        id2labelHandle: 'name',
        translations: {
          count: 'filters.name.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.name.name', // translation path to a title for the popover and the button
          description: 'filters.name.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'filters.name.searchPlaceholder',
        singleSelect: true,
      },
    },
  },
  city: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'city',
        id2labelHandle: 'city',
        translations: {
          count: 'filters.city.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.city.name', // translation path to a title for the popover and the button
          description: 'filters.city.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by institution city',
        singleSelect: true,
      },
    },
  },
  code: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'code',
        id2labelHandle: 'code',
        translations: {
          count: 'filters.code.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.code.name', // translation path to a title for the popover and the button
          description: 'filters.code.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by institution code',
        singleSelect: true,
      },
    },
  },
  eventTaxonKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'eventTaxonKey',
        id2labelHandle: 'taxonKey',
        translations: {
          count: 'filters.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.taxonKey.name', // translation path to a title for the popover and the button
          description: 'filters.taxonKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'eventTaxonKey',
        id2labelHandle: 'id2labelHandle',
      },
    },
  },
  verbatimScientificName: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'verbatimScientificName',
        id2labelHandle: 'verbatimScientificName',
        translations: {
          count: 'filters.verbatimScientificName.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.verbatimScientificName.name', // translation path to a title for the popover and the button
          description: 'filters.verbatimScientificName.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            suggestions: occurrenceSearch(predicate: $predicate) {
              cardinality {
                verbatimScientificName
              }
              facet {
                verbatimScientificName(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'verbatimScientificName',
      },
    },
  },
  networkKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'networkKey',
        id2labelHandle: 'networkKey',
        translations: {
          count: 'filters.networkKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.networkKey.name', // translation path to a title for the popover and the button
          description: 'filters.networkKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'networkKey',
        id2labelHandle: 'networkKey',
      },
    },
  },
  literatureType: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'literatureType',
        id2labelHandle: 'literatureType',
        translations: {
          count: 'filters.literatureType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.literatureType.name', // translation path to a title for the popover and the button
          description: 'filters.literatureType.description', // translation path for the filter description
        },
      },
      specific: {
        options: literatureType,
        supportsInverse: true,
      },
    },
  },
  dwcaExtension: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'dwcaExtension',
        id2labelHandle: 'dwcaExtension',
        translations: {
          count: 'filters.dwcaExtension.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.dwcaExtension.name', // translation path to a title for the popover and the button
          description: 'filters.dwcaExtension.description', // translation path for the filter description
        },
      },
      specific: {
        options: dwcaExtension,
        supportsInverse: true,
      },
    },
  },
  numberSpecimens: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'numberSpecimens',
        id2labelHandle: 'numberSpecimens',
        translations: {
          count: 'filters.numberSpecimens.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.numberSpecimens.name', // translation path to a title for the popover and the button
          description: 'filters.numberSpecimens.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Range or single value',
        singleSelect: true,
      },
    },
  },
  measurementOrFactTypes: {
    type: 'KEYWORD_SEARCH', // SIMPLE_TEXT
    config: {
      std: {
        filterHandle: 'measurementOrFactTypes',
        id2labelHandle: 'measurementOrFactTypes',
        translations: {
          count: 'filters.measurementOrFactTypes.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.measurementOrFactTypes.name', // translation path to a title for the popover and the button
          description: 'filters.measurementOrFactTypes.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.wildcard',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int, $include: String){
            suggestions: eventSearch(predicate: $predicate) {
              facet {
                measurementOrFactTypes(size: $size, include: $include) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'measurementOrFactTypes',
        keepCase: true,
      },
    },
  },
  measurementOrFactCount: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'measurementOrFactCount',
        id2labelHandle: 'measurementOrFactCount',
        translations: {
          count: 'filters.measurementOrFactCount.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.measurementOrFactCount.name', // translation path to a title for the popover and the button
          description: 'filters.measurementOrFactCount.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,10})(,)?((-)?[0-9]{0,10})$/,
      },
    },
  },
  occurrenceCount: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'occurrenceCount',
        id2labelHandle: 'measurementOrFactCount',
        translations: {
          count: 'filters.occurrenceCount.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceCount.name', // translation path to a title for the popover and the button
          description: 'filters.occurrenceCount.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,10})(,)?((-)?[0-9]{0,10})$/,
      },
    },
  },
  locationId: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'locationId',
        id2labelHandle: 'locationId',
        translations: {
          count: 'filters.locationId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.locationId.name', // translation path to a title for the popover and the button
          description: 'filters.locationId.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        suggestHandle: 'eventLocationId',
        id2labelHandle: 'locationId',
      },
    },
  },
  iucnRedListCategory: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'iucnRedListCategory',
        id2labelHandle: 'iucnRedListCategory',
        translations: {
          count: 'filters.iucnRedListCategory.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.iucnRedListCategory.name', // translation path to a title for the popover and the button
          description: 'filters.iucnRedListCategory.description', // translation path for the filter description
        },
      },
      specific: {
        options: iucnRedListCategory,
        supportsInverse: true,
      },
    },
  },
  alternativeCode: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'alternativeCode',
        id2labelHandle: 'alternativeCode',
        translations: {
          count: 'filters.alternativeCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.alternativeCode.name', // translation path to a title for the popover and the button
          description: 'filters.alternativeCode.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'E.g. NHM-K',
        singleSelect: true,
      },
    },
  },
  identifier: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'identifier',
        id2labelHandle: 'identifier',
        translations: {
          count: 'filters.identifier.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.identifier.name', // translation path to a title for the popover and the button
          description: 'filters.identifier.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: '264378',
        singleSelect: true,
      },
    },
  },
  institutionType: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'institutionType',
        id2labelHandle: 'institutionTypeVocabulary',
        translations: {
          count: 'filters.institutionType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.institutionType.name', // translation path to a title for the popover and the button
          description: 'filters.institutionType.description', // translation path for the filter description
        },
      },
      specific: {
        options: institutionType,
        suggestHandle: 'institutionType',
        id2labelHandle: 'institutionTypeVocabulary',
        allowEmptyQueries: true,
      },
    },
  },
  discipline: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'discipline',
        id2labelHandle: 'disciplineVocabulary',
        translations: {
          count: 'filters.disciplineType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.discipline.name', // translation path to a title for the popover and the button
          description: 'filters.discipline.description', // translation path for the filter description
        },
      },
      specific: {
        options: discipline,
        suggestHandle: 'discipline',
        id2labelHandle: 'disciplineVocabulary',
        allowEmptyQueries: true,
      },
    },
  },
  // discipline: {
  //   type: 'ENUM',
  //   config: {
  //     std: {
  //       filterHandle: 'discipline',
  //       id2labelHandle: 'discipline',
  //       translations: {
  //         count: 'filters.discipline.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'filters.discipline.name',// translation path to a title for the popover and the button
  //         description: 'filters.discipline.description', // translation path for the filter description
  //       }
  //     },
  //     specific: {
  //       options: discipline,
  //       supportsInverse: true,
  //     }
  //   }
  // },
  collectionContentType: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'collectionContentType',
        id2labelHandle: 'collectionContentTypeVocabulary',
        translations: {
          count: 'filters.collectionContentType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.collectionContentType.name', // translation path to a title for the popover and the button
          description: 'filters.collectionContentType.description', // translation path for the filter description
        },
      },
      specific: {
        options: collectionContentType,
        suggestHandle: 'collectionContentType',
        id2labelHandle: 'collectionContentTypeVocabulary',
        allowEmptyQueries: true,
      },
    },
  },
  preservationType: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'preservationType',
        id2labelHandle: 'preservationTypeVocabulary',
        translations: {
          count: 'filters.preservationType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.preservationType.name', // translation path to a title for the popover and the button
          description: 'filters.preservationType.description', // translation path for the filter description
        },
      },
      specific: {
        options: preservationType,
        suggestHandle: 'preservationType',
        id2labelHandle: 'preservationTypeVocabulary',
        allowEmptyQueries: true,
      },
    },
  },
  // -- Add filters above this line (required by plopfile.js) --
  q: {
    type: 'CUSTOM_STANDARD',
    config: {
      std: {
        filterHandle: 'q', // if nothing else provided, then this is the filterName used
        translations: {
          count: 'filters.q.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.q.name', // translation path to a title for the popover and the button
          description: 'filters.q.description', // translation path for the filter description
        },
      },
      specific: {
        description: 'filters.q.description',
        component: ({
          standardComponents,
          summaryProps,
          filterHandle,
          setFullField,
          toggle,
          focusRef,
          footerProps,
          onApply,
          filter,
          onCancel,
          hide,
          ...props
        }) => {
          const { Footer, SummaryBar, FilterBody } = standardComponents;
          return (
            <>
              <div style={{ margin: '10px' }}>
                <Input
                  ref={focusRef}
                  value={filter?.must?.q?.length ? filter.must.q[0] : ''}
                  onChange={(e) => {
                    setFullField('q', [e.target.value]);
                  }}
                  onKeyPress={(e) => (e.which === 13 ? onApply({ filter, hide }) : null)}
                />
              </div>
              <Footer
                {...footerProps}
                onApply={() => onApply({ filter, hide })}
                onCancel={() => onCancel({ filter, hide })}
              />
            </>
          );
        },
      },
    },
  },
  // sampleSize: {
  //   type: 'CUSTOM_STANDARD',
  //   config: {
  //     std: {
  //       filterHandle: 'sampleSize',// if nothing else provided, then this is the filterName used
  //       translations: {
  //         count: 'filters.sampleSize.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'filters.sampleSize.name',// translation path to a title for the popover and the button
  //         description: 'filters.sampleSize.description', // translation path for the filter description
  //       },
  //     },
  //     specific: {
  //       component: ({ standardComponents, summaryProps, filterHandle, setFullField, toggle, focusRef, footerProps, onApply, filter, onCancel, hide, ...props }) => {
  //         const { Footer, SummaryBar, FilterBody } = standardComponents;
  //         return <>
  //           <div style={{ margin: '10px' }} >
  //             <Input
  //               placeholder=""
  //               ref={focusRef}
  //               value={filter?.must?.q?.length ? filter.must.q[0] : ''}
  //               onChange={e => {
  //                 setFullField('q', [e.target.value])
  //               }}
  //               onKeyPress={e => e.which === 13 ? onApply({ filter, hide }) : null}
  //             />
  //           </div>
  //           <Footer {...footerProps}
  //             onApply={() => onApply({ filter, hide })}
  //             onCancel={() => onCancel({ filter, hide })}
  //           />
  //         </>
  //       },
  //     }
  //   }
  // },
  // evenMoreFreedom: {
  //   type: 'CUSTOM_STANDARD',
  //   config: {
  //     std: {
  //       filterHandle: 'taxonKey',// if nothing else provided, then this is the filterName used
  //       // id2labelHandle: 'canonicalName',
  //       id2label: ({ id }) => `taxonKey: ${id}`, // just define the label here. With no chance to reuse it elsewhere
  //       translations: {
  //         count: '{num, plural, one {random taxon} other {# random taxa}}', // Should really point to the translation file, but as it falls back to the string it can be used as the main entry
  //         name: 'Randomizer',// translation path to a title for the popover and the button - in this case the path does not exist and so it falls back to the string provided
  //         description: 'filters.random.description', // translation path for the filter description
  //       },
  //     },
  //     specific: {
  //       dontWrapInStdFilter: true,
  //       component: ({ FilterContext, filter, ...props }) => {
  //         return <FilterContext.Consumer>
  //           {({ setFullField, filter }) => {
  //             return <div style={{ padding: 20, background: 'pink', maxHeight: '100%', overflow: 'auto' }}>
  //               <button style={{ background: 'yellow', display: 'block', width: '100%' }}
  //                 onClick={() => setFullField('taxonKey', [Math.floor(Math.random() * 100)])}>I feel lucky - choose random taxonKey between 0 and 100</button>
  //               <pre>{JSON.stringify(filter, null, 2)}</pre>
  //             </div>
  //           }}
  //         </FilterContext.Consumer>
  //       },
  //     }
  //   }
  // },
};
