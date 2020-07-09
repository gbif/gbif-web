import basisofRecord from '../../locales/enums/basisOfRecord.json';
import mediaTypes from '../../locales/enums/mediaTypes.json';

export const commonFilters = {
  taxonKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'taxonKey',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'canonicalName',
        translations: {
          count: 'filter.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.taxonKey.name',// translation path to a title for the popover and the button
          description: 'filter.taxonKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'taxonKey',
        id2labelHandle: 'taxonKey',
      }
    }
  },
  countryCode: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filter.countryCode.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.countryCode.name',// translation path to a title for the popover and the button
          description: 'filter.countryCode.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'countryCode',
      }
    }
  },
  datasetKey: {
    type: 'SUGGEST',
    config: {
      std: {
        translations: {
          count: 'filter.datasetKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.datasetKey.name',// translation path to a title for the popover and the button
          description: 'filter.datasetKey.description', // translation path for the filter description
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
          count: 'filter.publisherKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.publisherKey.name',// translation path to a title for the popover and the button
          description: 'filter.publisherKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'publisherKey',
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
          count: 'filter.year.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.year.name',// translation path to a title for the popover and the button
          description: 'filter.year.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'Range or single value'
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
          count: 'filter.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.basisOfRecord.name',// translation path to a title for the popover and the button
        }
      },
      specific: {
        options: Object.keys(basisofRecord),
        description: 'filter.basisOfRecord.description', // translation path for the filter description
      }
    }
  },
  mediaTypes: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'mediaTypes',
        id2labelHandle: 'mediaTypes',
        translations: {
          count: 'filter.mediaTypes.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.mediaTypes.name',// translation path to a title for the popover and the button
        }
      },
      specific: {
        options: Object.keys(mediaTypes),
        description: 'filter.mediaTypes.description', // translation path for the filter description
      }
    }
  }
}