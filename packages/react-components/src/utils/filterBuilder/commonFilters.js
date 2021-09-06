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
// -- Add imports above this line (required by plopfile.js) --

export const commonFilters = {
  taxonKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'taxonKey',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'canonicalName',
        translations: {
          count: 'components.filters.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.taxonKey.name',// translation path to a title for the popover and the button
          description: 'components.filters.taxonKey.description', // translation path for the filter description
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
          count: 'components.filters.occurrenceCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.occurrenceCountry.name',// translation path to a title for the popover and the button
          description: 'components.filters.occurrenceCountry.description', // translation path for the filter description
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
          count: 'components.filters.occurrenceCountry.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.occurrenceCountry.name',// translation path to a title for the popover and the button
          description: 'components.filters.occurrenceCountry.description', // translation path for the filter description
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
          count: 'components.filters.countriesOfCoverage.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.countriesOfCoverage.name',// translation path to a title for the popover and the button
          description: 'components.filters.countriesOfCoverage.description', // translation path for the filter description
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
          count: 'components.filters.countriesOfResearcher.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.countriesOfResearcher.name',// translation path to a title for the popover and the button
          description: 'components.filters.countriesOfResearcher.description', // translation path for the filter description
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
          count: 'components.filters.publishingCountryCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.publishingCountryCode.name',// translation path to a title for the popover and the button
          description: 'components.filters.publishingCountryCode.description', // translation path for the filter description
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
          count: 'components.filters.datasetKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.datasetKey.name',// translation path to a title for the popover and the button
          description: 'components.filters.datasetKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'datasetKey',
      }
    }
  },
  publisherKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'components.filters.publisherKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.publisherKey.name',// translation path to a title for the popover and the button
          description: 'components.filters.publisherKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
      }
    }
  },
  institutionCode: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'components.filters.institutionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.institutionCode.name',// translation path to a title for the popover and the button
          description: 'components.filters.institutionCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'institutionCode',
      }
    }
  },
  catalogNumber: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'components.filters.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.catalogNumber.name',// translation path to a title for the popover and the button
          description: 'components.filters.catalogNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'catalogNumber'
      }
    }
  },
  hostingOrganizationKey: {
    type: 'SUGGEST',
    config: {
      std: {
        id2labelHandle: 'publisherKey',
        translations: {
          count: 'components.filters.hostingOrganizationKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.hostingOrganizationKey.name',// translation path to a title for the popover and the button
          description: 'components.filters.hostingOrganizationKey.description', // translation path for the filter description
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
          count: 'components.filters.year.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.year.name',// translation path to a title for the popover and the button
          description: 'components.filters.year.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
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
          count: 'components.filters.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.basisOfRecord.name',// translation path to a title for the popover and the button
          description: 'components.filters.basisOfRecord.description', // translation path for the filter description
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
          count: 'components.filters.typeStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.typeStatus.name',// translation path to a title for the popover and the button
          description: 'components.filters.typeStatus.description', // translation path for the filter description
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
          count: 'components.filters.occurrenceIssue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.occurrenceIssue.name',// translation path to a title for the popover and the button
          description: 'components.filters.occurrenceIssue.description', // translation path for the filter description
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
          count: 'components.filters.mediaType.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.mediaType.name',// translation path to a title for the popover and the button
          description: 'components.filters.mediaType.description', // translation path for the filter description
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
          count: 'components.filters.sampleSizeUnit.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.sampleSizeUnit.name',// translation path to a title for the popover and the button
          description: 'components.filters.sampleSizeUnit.description', // translation path for the filter description
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
          count: 'components.filters.license.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.license.name',// translation path to a title for the popover and the button
          description: 'components.filters.license.description', // translation path for the filter description
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
          count: 'components.filters.coordinateUncertainty.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.coordinateUncertainty.name',// translation path to a title for the popover and the button
          description: 'components.filters.coordinateUncertainty.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
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
          count: 'components.filters.depth.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.depth.name',// translation path to a title for the popover and the button
          description: 'components.filters.depth.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
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
          count: 'components.filters.organismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.organismQuantity.name',// translation path to a title for the popover and the button
          description: 'components.filters.organismQuantity.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
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
          count: 'components.filters.sampleSizeValue.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.sampleSizeValue.name',// translation path to a title for the popover and the button
          description: 'components.filters.sampleSizeValue.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
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
          count: 'components.filters.relativeOrganismQuantity.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.relativeOrganismQuantity.name',// translation path to a title for the popover and the button
          description: 'components.filters.relativeOrganismQuantity.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
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
          count: 'components.filters.month.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.month.name',// translation path to a title for the popover and the button
          description: 'components.filters.month.description', // translation path for the filter description
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
          count: 'components.filters.continent.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.continent.name',// translation path to a title for the popover and the button
          description: 'components.filters.continent.description', // translation path for the filter description
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
          count: 'components.filters.protocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.protocol.name',// translation path to a title for the popover and the button
          description: 'components.filters.protocol.description', // translation path for the filter description
        }
      },
      specific: {
        options: endpointType,
      }
    }
  },
  establishmentMeans: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'establishmentMeans',
        id2labelHandle: 'establishmentMeans',
        translations: {
          count: 'components.filters.establishmentMeans.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.establishmentMeans.name',// translation path to a title for the popover and the button
          description: 'components.filters.establishmentMeans.description', // translation path for the filter description
        }
      },
      specific: {
        options: establishmentMeans,
      }
    }
  },
  catalogNumber: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'catalogNumber',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'catalogNumber',
        translations: {
          count: 'components.filters.catalogNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.catalogNumber.name',// translation path to a title for the popover and the button
          description: 'components.filters.catalogNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'catalogNumber',
        id2labelHandle: 'catalogNumber',
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
          count: 'components.filters.recordedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.recordedBy.name',// translation path to a title for the popover and the button
          description: 'components.filters.recordedBy.description', // translation path for the filter description
        },
      },
      specific: {
        // suggestHandle: 'recordedBy',
        // suggestHandle: 'recordedByWildcard',
        id2labelHandle: 'recordedBy',
        placeholder: 'Search by recorded by',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
              cardinality {
                recordedBy
              }
              facet {
                recordedBy(size: $size) {
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
          count: 'components.filters.recordNumber.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.recordNumber.name',// translation path to a title for the popover and the button
          description: 'components.filters.recordNumber.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'recordNumber',
        id2labelHandle: 'recordNumber',
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
          count: 'components.filters.collectionCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.collectionCode.name',// translation path to a title for the popover and the button
          description: 'components.filters.collectionCode.description', // translation path for the filter description
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
          count: 'components.filters.recordedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.recordedById.name',// translation path to a title for the popover and the button
          description: 'components.filters.recordedById.description', // translation path for the filter description
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
          count: 'components.filters.identifiedById.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.identifiedById.name',// translation path to a title for the popover and the button
          description: 'components.filters.identifiedById.description', // translation path for the filter description
        },
      },
      specific: {
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
          count: 'components.filters.occurrenceId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.occurrenceId.name',// translation path to a title for the popover and the button
          description: 'components.filters.occurrenceId.description', // translation path for the filter description
        },
      },
      specific: {
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
          count: 'components.filters.organismId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.organismId.name',// translation path to a title for the popover and the button
          description: 'components.filters.organismId.description', // translation path for the filter description
        },
      },
      specific: {
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
          count: 'components.filters.locality.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.locality.name',// translation path to a title for the popover and the button
          description: 'components.filters.locality.description', // translation path for the filter description
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
          count: 'components.filters.waterBody.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.waterBody.name',// translation path to a title for the popover and the button
          description: 'components.filters.waterBody.description', // translation path for the filter description
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
          count: 'components.filters.stateProvince.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.stateProvince.name',// translation path to a title for the popover and the button
          description: 'components.filters.stateProvince.description', // translation path for the filter description
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
          count: 'components.filters.eventId.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.eventId.name',// translation path to a title for the popover and the button
          description: 'components.filters.eventId.description', // translation path for the filter description
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
          count: 'components.filters.samplingProtocol.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.samplingProtocol.name',// translation path to a title for the popover and the button
          description: 'components.filters.samplingProtocol.description', // translation path for the filter description
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
          count: 'components.filters.elevation.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.elevation.name',// translation path to a title for the popover and the button
          description: 'components.filters.elevation.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value',
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
            count: 'components.filters.occurrenceStatus.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'components.filters.occurrenceStatus.name',// translation path to a title for the popover and the button
            description: 'components.filters.occurrenceStatus.description', // translation path for the filter description
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
          count: 'components.filters.gadmGid.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.gadmGid.name',// translation path to a title for the popover and the button
          description: 'components.filters.gadmGid.description', // translation path for the filter description
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
          count: 'components.filters.identifiedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.identifiedBy.name',// translation path to a title for the popover and the button
          description: 'components.filters.identifiedBy.description', // translation path for the filter description
        },
      },
      specific: {
        placeholder: 'Search by identified by',
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
            count: 'components.filters.isInCluster.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'components.filters.isInCluster.name',// translation path to a title for the popover and the button
            description: 'components.filters.isInCluster.description', // translation path for the filter description
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
            count: 'components.filters.datasetType.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'components.filters.datasetType.name',// translation path to a title for the popover and the button
            description: 'components.filters.datasetType.description', // translation path for the filter description
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
            count: 'components.filters.datasetSubtype.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'components.filters.datasetSubtype.name',// translation path to a title for the popover and the button
            description: 'components.filters.datasetSubtype.description', // translation path for the filter description
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
          count: 'components.filters.institutionKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.institutionKey.name',// translation path to a title for the popover and the button
          description: 'components.filters.institutionKey.description', // translation path for the filter description
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
          count: 'components.filters.name.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.name.name',// translation path to a title for the popover and the button
          description: 'components.filters.name.description', // translation path for the filter description
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
          count: 'components.filters.city.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.city.name',// translation path to a title for the popover and the button
          description: 'components.filters.city.description', // translation path for the filter description
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
          count: 'components.filters.code.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.code.name',// translation path to a title for the popover and the button
          description: 'components.filters.code.description', // translation path for the filter description
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
          count: 'components.filters.verbatimScientificName.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.verbatimScientificName.name',// translation path to a title for the popover and the button
          description: 'components.filters.verbatimScientificName.description', // translation path for the filter description
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
          count: 'components.filters.networkKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.networkKey.name',// translation path to a title for the popover and the button
          description: 'components.filters.networkKey.description', // translation path for the filter description
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
            count: 'components.filters.literatureType.count', // translation path to display names with counts. e.g. "3 scientific names"
            name: 'components.filters.literatureType.name',// translation path to a title for the popover and the button
            description: 'components.filters.literatureType.description', // translation path for the filter description
          }
        },
        specific: {
          options: literatureType,
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
          count: 'components.filters.q.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'components.filters.q.name',// translation path to a title for the popover and the button
          description: 'components.filters.q.description', // translation path for the filter description
        },
      },
      specific: {
        description: 'components.filters.q.description',
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
  //         count: 'components.filters.sampleSize.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'components.filters.sampleSize.name',// translation path to a title for the popover and the button
  //         description: 'components.filters.sampleSize.description', // translation path for the filter description
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
  //         description: 'components.filters.random.description', // translation path for the filter description
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