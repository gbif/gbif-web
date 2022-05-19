import React from 'react';
import { Input } from '../../components';

import basisofRecord from '../../enums/basic/basisOfRecord.json';
import mediaType from '../../enums/basic/mediaType.json';
import occurrenceIssue from '../../enums/basic/occurrenceIssue.json';
import typeStatus from '../../enums/basic/typeStatus.json';
import license from '../../enums/basic/license.json';
import month from '../../enums/basic/month.json';
import continent from '../../enums/basic/continent.json';
import endpointType from '../../enums/basic/endpointType.json';
import establishmentMeans from '../../enums/basic/establishmentMeans.json';
import occurrenceStatus from '../../enums/basic/occurrenceStatus.json';
import datasetType from '../../enums/basic/datasetType.json';
import datasetSubtype from '../../enums/basic/datasetSubtype.json';
import literatureType from '../../enums/cms/literatureType.json';
import dwcaExtension from '../../enums/basic/dwcaExtension.json';
// -- Add imports above this line (required by plopfile.js) --

export const commonFilters = {
  taxonKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'taxonKey',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'canonicalName',
        translations: {
          count: 'filters.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.taxonKey.name',// translation path to a title for the popover and the button
          description: 'filters.taxonKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'taxonKey',
        id2labelHandle: 'taxonKey'
      }
    }
  },
  country: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.occurrenceCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceCountry.name',// translation path to a title for the popover and the button
          description: 'filters.occurrenceCountry.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      }
    }
  },
  countrySingle: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.occurrenceCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceCountry.name',// translation path to a title for the popover and the button
          description: 'filters.occurrenceCountry.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
        singleSelect: true
      }
    }
  },
  countriesOfCoverage: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.countriesOfCoverage.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.countriesOfCoverage.name',// translation path to a title for the popover and the button
          description: 'filters.countriesOfCoverage.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      }
    }
  },
  countriesOfResearcher: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.countriesOfResearcher.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.countriesOfResearcher.name',// translation path to a title for the popover and the button
          description: 'filters.countriesOfResearcher.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      }
    }
  },
  publishingCountryCode: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'countryCode',
        translations: {
          count: 'filters.publishingCountryCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.publishingCountryCode.name',// translation path to a title for the popover and the button
          description: 'filters.publishingCountryCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode'
      }
    }
  },
  datasetKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filters.datasetKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.datasetKey.name',// translation path to a title for the popover and the button
          description: 'filters.datasetKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'datasetKeyFromOccurrenceIndex',
        allowEmptyQueries: true
      }
    }
  },
  publisherKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filters.publisherKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.publisherKey.name',// translation path to a title for the popover and the button
          description: 'filters.publisherKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKeyFromOccurrenceIndex',
        allowEmptyQueries: true
      }
    }
  },
  institutionCode: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filters.institutionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.institutionCode.name',// translation path to a title for the popover and the button
          description: 'filters.institutionCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'institutionCode',
      }
    }
  },
  catalogNumber: {
    type: 'KEYWORD_SEARCH',//KEYWORD_SEARCH | SUGGEST
    config: {
      std: {
        filterHandle: 'catalogNumber',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'catalogNumber',
        translations: {
          count: 'filters.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.catalogNumber.name',// translation path to a title for the popover and the button
          description: 'filters.catalogNumber.description', // translation path for the filter description
        },
      },
      specific: {
        id2labelHandle: 'catalogNumber',
        placeholder: 'Search for a catalog number',
        supportsExist: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
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
        queryKey: 'catalogNumber'
      }
    }
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
          name: 'filters.hostingOrganizationKey.name',// translation path to a title for the popover and the button
          description: 'filters.hostingOrganizationKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
        id2labelHandle: 'publisherKey',
      }
    }
  },
  year: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'year',
        id2labelHandle: 'year',
        translations: {
          count: 'filters.year.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.year.name',// translation path to a title for the popover and the button
          description: 'filters.year.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range',
        supportsExist: true,
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  basisOfRecord: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'basisOfRecord',
        id2labelHandle: 'basisOfRecord',
        translations: {
          count: 'filters.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.basisOfRecord.name',// translation path to a title for the popover and the button
          description: 'filters.basisOfRecord.description', // translation path for the filter description
        }
      },
      specific: {
        options: basisofRecord,
      }
    }
  },
  typeStatus: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'typeStatus',
        id2labelHandle: 'typeStatus',
        translations: {
          count: 'filters.typeStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.typeStatus.name',// translation path to a title for the popover and the button
          description: 'filters.typeStatus.description', // translation path for the filter description
        }
      },
      specific: {
        options: typeStatus,
      }
    }
  },
  occurrenceIssue: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'occurrenceIssue',
        id2labelHandle: 'occurrenceIssue',
        translations: {
          count: 'filters.occurrenceIssue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceIssue.name',// translation path to a title for the popover and the button
          description: 'filters.occurrenceIssue.description', // translation path for the filter description
        }
      },
      specific: {
        options: occurrenceIssue,
        supportsNegation: true,
        supportsExist: true
      }
    }
  },
  mediaType: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'mediaType',
        id2labelHandle: 'mediaType',
        translations: {
          count: 'filters.mediaType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.mediaType.name',// translation path to a title for the popover and the button
          description: 'filters.mediaType.description', // translation path for the filter description
        }
      },
      specific: {
        options: mediaType,
      }
    }
  },
  sampleSizeUnit: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'sampleSizeUnit',
        translations: {
          count: 'filters.sampleSizeUnit.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.sampleSizeUnit.name',// translation path to a title for the popover and the button
          description: 'filters.sampleSizeUnit.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Units of sample size',
        disallowLikeFilters: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
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
        queryKey: 'sampleSizeUnit'
      }
    }
  },
  license: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'license',
        id2labelHandle: 'license',
        translations: {
          count: 'filters.license.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.license.name',// translation path to a title for the popover and the button
          description: 'filters.license.description', // translation path for the filter description
        }
      },
      specific: {
        options: license,
      }
    }
  },
  coordinateUncertainty: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'coordinateUncertainty',
        id2labelHandle: 'coordinateUncertainty',
        translations: {
          count: 'filters.coordinateUncertainty.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.coordinateUncertainty.name',// translation path to a title for the popover and the button
          description: 'filters.coordinateUncertainty.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  depth: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'depth',
        id2labelHandle: 'depth',
        translations: {
          count: 'filters.depth.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.depth.name',// translation path to a title for the popover and the button
          description: 'filters.depth.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  organismQuantity: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'organismQuantity',
        id2labelHandle: 'organismQuantity',
        translations: {
          count: 'filters.organismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.organismQuantity.name',// translation path to a title for the popover and the button
          description: 'filters.organismQuantity.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  sampleSizeValue: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'sampleSizeValue',
        id2labelHandle: 'sampleSizeValue',
        translations: {
          count: 'filters.sampleSizeValue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.sampleSizeValue.name',// translation path to a title for the popover and the button
          description: 'filters.sampleSizeValue.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/
      }
    }
  },
  relativeOrganismQuantity: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'relativeOrganismQuantity',
        id2labelHandle: 'relativeOrganismQuantity',
        translations: {
          count: 'filters.relativeOrganismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.relativeOrganismQuantity.name',// translation path to a title for the popover and the button
          description: 'filters.relativeOrganismQuantity.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^[0-9,\.]{0,10}$/
      }
    }
  },
  month: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'month',
        id2labelHandle: 'month',
        translations: {
          count: 'filters.month.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.month.name',// translation path to a title for the popover and the button
          description: 'filters.month.description', // translation path for the filter description
        }
      },
      specific: {
        options: month,
        supportsExist: true,
      }
    }
  },
  continent: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'continent',
        id2labelHandle: 'continent',
        translations: {
          count: 'filters.continent.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.continent.name',// translation path to a title for the popover and the button
          description: 'filters.continent.description', // translation path for the filter description
        }
      },
      specific: {
        options: continent,
      }
    }
  },
  protocol: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'protocol',
        id2labelHandle: 'protocol',
        translations: {
          count: 'filters.protocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.protocol.name',// translation path to a title for the popover and the button
          description: 'filters.protocol.description', // translation path for the filter description
        }
      },
      specific: {
        options: endpointType,
      }
    }
  },
  establishmentMeans: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'establishmentMeans',
        id2labelHandle: 'establishmentMeansVocabulary',
        translations: {
          count: 'filters.establishmentMeans.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.establishmentMeans.name',// translation path to a title for the popover and the button
          description: 'filters.establishmentMeans.description', // translation path for the filter description
        }
      },
      specific: {
        options: establishmentMeans,
        suggestHandle: 'establishmentMeans',
        id2labelHandle: 'establishmentMeansVocabulary',
        allowEmptyQueries: true
      }
    }
  },
  recordedBy: {
    type: 'KEYWORD_SEARCH',//KEYWORD_SEARCH | SUGGEST
    config: {
      std: {
        filterHandle: 'recordedBy',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'recordedBy',
        translations: {
          count: 'filters.recordedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.recordedBy.name',// translation path to a title for the popover and the button
          description: 'filters.recordedBy.description', // translation path for the filter description
        },
      },
      specific: {
        // suggestHandle: 'recordedBy',
        // suggestHandle: 'recordedByWildcard',
        id2labelHandle: 'recordedBy',
        placeholder: 'Search by recorded by',
        supportsExist: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int, $include: String){
            occurrenceSearch(predicate: $predicate) {
              facet {
                recordedBy(size: $size, include: $include) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'recordedBy'
      }
    }
  },
  recordNumber: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'recordNumber',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'recordNumber',
        translations: {
          count: 'filters.recordNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.recordNumber.name',// translation path to a title for the popover and the button
          description: 'filters.recordNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'recordNumber',
        id2labelHandle: 'recordNumber',
        supportsExist: true,
      }
    }
  },
  collectionCode: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'collectionCode',
        id2labelHandle: 'collectionCode',
        translations: {
          count: 'filters.collectionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.collectionCode.name',// translation path to a title for the popover and the button
          description: 'filters.collectionCode.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by collection code'
      }
    }
  },
  recordedById: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'recordedById',
        id2labelHandle: 'recordedById',
        translations: {
          count: 'filters.recordedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.recordedById.name',// translation path to a title for the popover and the button
          description: 'filters.recordedById.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'Example: https://orcid.org/0000-1111-2222-3333'
      }
    }
  },
  identifiedById: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'identifiedById',
        id2labelHandle: 'identifiedById',
        translations: {
          count: 'filters.identifiedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.identifiedById.name',// translation path to a title for the popover and the button
          description: 'filters.identifiedById.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'Example: https://orcid.org/0000-1111-2222-3333'
      }
    }
  },
  occurrenceId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'occurrenceId',
        id2labelHandle: 'occurrenceId',
        translations: {
          count: 'filters.occurrenceId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.occurrenceId.name',// translation path to a title for the popover and the button
          description: 'filters.occurrenceId.description', // translation path for the filter description
        },
      },
      specific: {
        supportsNegation: true,
        placeholder: 'Search by Occurrence identifier'
      }
    }
  },
  organismId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'organismId',
        id2labelHandle: 'organismId',
        translations: {
          count: 'filters.organismId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.organismId.name',// translation path to a title for the popover and the button
          description: 'filters.organismId.description', // translation path for the filter description
        },
      },
      specific: {
        supportsExist: true,
        placeholder: 'Search by Organism identifier'
      }
    }
  },
  locality: {
    type: 'KEYWORD_SEARCH',//KEYWORD_SEARCH | SUGGEST | SIMPLE_TEXT
    config: {
      std: {
        filterHandle: 'locality',
        id2labelHandle: 'locality',
        translations: {
          count: 'filters.locality.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.locality.name',// translation path to a title for the popover and the button
          description: 'filters.locality.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by locality',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
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
        queryKey: 'locality'
      }
    }
  },
  waterBody: {
    type: 'KEYWORD_SEARCH', // SIMPLE_TEXT
    config: {
      std: {
        filterHandle: 'waterBody',
        id2labelHandle: 'waterBody',
        translations: {
          count: 'filters.waterBody.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.waterBody.name',// translation path to a title for the popover and the button
          description: 'filters.waterBody.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by water body',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
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
        queryKey: 'waterBody'
      }
    }
  },
  stateProvince: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'stateProvince',
        id2labelHandle: 'stateProvince',
        translations: {
          count: 'filters.stateProvince.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.stateProvince.name',// translation path to a title for the popover and the button
          description: 'filters.stateProvince.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by state province',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
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
        queryKey: 'stateProvince'
      }
    }
  },
  eventId: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'eventId',
        id2labelHandle: 'eventId',
        translations: {
          count: 'filters.eventId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.eventId.name',// translation path to a title for the popover and the button
          description: 'filters.eventId.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by Event identifier',
        supportsExist: true
      }
    }
  },
  samplingProtocol: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'samplingProtocol',
        id2labelHandle: 'samplingProtocol',
        translations: {
          count: 'filters.samplingProtocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.samplingProtocol.name',// translation path to a title for the popover and the button
          description: 'filters.samplingProtocol.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by sampling protocol',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
              cardinality {
                samplingProtocol
              }
              facet {
                samplingProtocol(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'samplingProtocol'
      }
    }
  },
  elevation: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'elevation',
        id2labelHandle: 'elevation',
        translations: {
          count: 'filters.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.elevation.name',// translation path to a title for the popover and the button
          description: 'filters.elevation.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range',
        regex: /^[0-9,\.]{0,10}$/
      }
    }
  },
  occurrenceStatus: {
      type: 'ENUM',
      config: {
        std: {
          filterHandle: 'occurrenceStatus',
          id2labelHandle: 'occurrenceStatus',
          translations: {
            count: 'filters.occurrenceStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filters.occurrenceStatus.name',// translation path to a title for the popover and the button
            description: 'filters.occurrenceStatus.description', // translation path for the filter description
          }
        },
        specific: {
          options: occurrenceStatus,
        }
      }
    },
  gadmGid: {
      type: 'SUGGEST',
      config: {
        std: {
        filterHandle: 'gadmGid',
        id2labelHandle: 'gadmGid',
        translations: {
          count: 'filters.gadmGid.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.gadmGid.name',// translation path to a title for the popover and the button
          description: 'filters.gadmGid.description', // translation path for the filter description
        },
      },
        specific: {
          suggestHandle: 'gadmGid',
          id2labelHandle: 'gadmGid',
          showAboutAsDefault: true,
          supportsExist: true
        }
      }
    },
  identifiedBy: {
    type: 'KEYWORD_SEARCH', // SIMPLE_TEXT
    config: {
      std: {
        filterHandle: 'identifiedBy',
        id2labelHandle: 'identifiedBy',
        translations: {
          count: 'filters.identifiedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.identifiedBy.name',// translation path to a title for the popover and the button
          description: 'filters.identifiedBy.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by identified by',
        supportsExist: true,
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
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
        queryKey: 'identifiedBy'
      }
    }
  },
  isInCluster: {
      type: 'ENUM',
      config: {
        std: {
          filterHandle: 'isInCluster',
          id2labelHandle: 'isInCluster',
          translations: {
            count: 'filters.isInCluster.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filters.isInCluster.name',// translation path to a title for the popover and the button
            description: 'filters.isInCluster.description', // translation path for the filter description
          }
        },
        specific: {
          options: ['true', 'false'],
          isRadio: true
        }
      }
    },
  datasetType: {
      type: 'ENUM',
      config: {
        std: {
          filterHandle: 'datasetType',
          id2labelHandle: 'datasetType',
          translations: {
            count: 'filters.datasetType.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filters.datasetType.name',// translation path to a title for the popover and the button
            description: 'filters.datasetType.description', // translation path for the filter description
          }
        },
        specific: {
          options: datasetType,
        }
      }
    },
  datasetSubtype: {
      type: 'ENUM',
      config: {
        std: {
          filterHandle: 'datasetSubtype',
          id2labelHandle: 'datasetSubtype',
          translations: {
            count: 'filters.datasetSubtype.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filters.datasetSubtype.name',// translation path to a title for the popover and the button
            description: 'filters.datasetSubtype.description', // translation path for the filter description
          }
        },
        specific: {
          options: datasetSubtype,
        }
      }
    },
  institutionKey: {
      type: 'SUGGEST',
      config: {
        std: {
        filterHandle: 'institutionKey',
        id2labelHandle: 'institutionKey',
        translations: {
          count: 'filters.institutionKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.institutionKey.name',// translation path to a title for the popover and the button
          description: 'filters.institutionKey.description', // translation path for the filter description
        },
      },
        specific: {
          suggestHandle: 'institutionKey',
          id2labelHandle: 'institutionKey',
        }
      }
    },
  name: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'name',
        id2labelHandle: 'name',
        translations: {
          count: 'filters.name.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.name.name',// translation path to a title for the popover and the button
          description: 'filters.name.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by institution name',
        singleSelect: true
      }
    }
  },
  city: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'city',
        id2labelHandle: 'city',
        translations: {
          count: 'filters.city.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.city.name',// translation path to a title for the popover and the button
          description: 'filters.city.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by institution city',
        singleSelect: true
      }
    }
  },
  code: {
    type: 'SIMPLE_TEXT',
    config: {
      std: {
        filterHandle: 'code',
        id2labelHandle: 'code',
        translations: {
          count: 'filters.code.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.code.name',// translation path to a title for the popover and the button
          description: 'filters.code.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by institution code',
        singleSelect: true
      }
    }
  },
  verbatimScientificName: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'verbatimScientificName',
        id2labelHandle: 'verbatimScientificName',
        translations: {
          count: 'filters.verbatimScientificName.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.verbatimScientificName.name',// translation path to a title for the popover and the button
          description: 'filters.verbatimScientificName.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Example: Felis concolor',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
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
        queryKey: 'verbatimScientificName'
      }
    }
  },
  networkKey: {
      type: 'SUGGEST',
      config: {
        std: {
        filterHandle: 'networkKey',
        id2labelHandle: 'networkKey',
        translations: {
          count: 'filters.networkKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.networkKey.name',// translation path to a title for the popover and the button
          description: 'filters.networkKey.description', // translation path for the filter description
        },
      },
        specific: {
          suggestHandle: 'networkKey',
          id2labelHandle: 'networkKey',
        }
      }
    },
  literatureType: {
      type: 'ENUM',
      config: {
        std: {
          filterHandle: 'literatureType',
          id2labelHandle: 'literatureType',
          translations: {
            count: 'filters.literatureType.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filters.literatureType.name',// translation path to a title for the popover and the button
            description: 'filters.literatureType.description', // translation path for the filter description
          }
        },
        specific: {
          options: literatureType,
        }
      }
    },
  dwcaExtension: {
      type: 'ENUM',
      config: {
        std: {
          filterHandle: 'dwcaExtension',
          id2labelHandle: 'dwcaExtension',
          translations: {
            count: 'filters.dwcaExtension.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'filters.dwcaExtension.name',// translation path to a title for the popover and the button
            description: 'filters.dwcaExtension.description', // translation path for the filter description
          }
        },
        specific: {
          options: dwcaExtension
        }
      }
    },
  // -- Add filters above this line (required by plopfile.js) --
  q: {
    type: 'CUSTOM_STANDARD',
    config: {
      std: {
        filterHandle: 'q',// if nothing else provided, then this is the filterName used
        translations: {
          count: 'filters.q.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filters.q.name',// translation path to a title for the popover and the button
          description: 'filters.q.description', // translation path for the filter description
        },
      },
      specific: {
        description: 'filters.q.description',
        component: ({ standardComponents, summaryProps, filterHandle, setFullField, toggle, focusRef, footerProps, onApply, filter, onCancel, hide, ...props }) => {
          const { Footer, SummaryBar, FilterBody } = standardComponents;
          return <>
            <div style={{ margin: '10px' }} >
              <Input
                ref={focusRef}
                value={filter?.must?.q?.length ? filter.must.q[0] : ''}
                onChange={e => {
                  setFullField('q', [e.target.value])
                }}
                onKeyPress={e => e.which === 13 ? onApply({ filter, hide }) : null}
              />
            </div>
            <Footer {...footerProps}
              onApply={() => onApply({ filter, hide })}
              onCancel={() => onCancel({ filter, hide })}
            />
          </>
        },
      }
    }
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
}