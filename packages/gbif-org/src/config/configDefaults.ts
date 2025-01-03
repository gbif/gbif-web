import { Config } from './config';

export const configDefault: Partial<Config> = {
  datasetSearch: {
    excludedFilters: [],
    highlightedFilters: ['q', 'type', 'publishingOrg', 'license'],
    queryType: 'V1',
  },
  collectionSearch: {
    queryType: 'V1',
    highlightedFilters: [
      'q',
      'code',
      'country',
      'numberSpecimens',
      'occurrenceCount',
      'taxonKey',
      'descriptorCountry',
    ],
  },
  collectionKey: {
    occurrenceSearch: {
      // availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
      // defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
      tabs: ['table', 'map', 'media', 'clusters', 'download'],
      defaultTab: 'table',
    },
  },
  institutionSearch: {
    queryType: 'V1',
    highlightedFilters: ['q', 'code', 'country', 'numberSpecimens', 'occurrenceCount'],
  },
  publisherSearch: {
    queryType: 'V1',
    highlightedFilters: ['q', 'country'],
  },
  taxonSearch: {
    queryType: 'V1',
    highlightedFilters: ['q', 'status', 'rank'],
  },
  literatureSearch: {
    queryType: 'PREDICATE',
    highlightedFilters: ['q', 'year', 'countriesOfResearcher', 'gbifDatasetKey'],
  },
  occurrenceSearch: {
    queryType: 'PREDICATE',
    highlightedFilters: ['occurrenceStatus', 'taxonKey', 'year', 'country', 'issue', 'geometry'],
    tabs: ['table', 'media', 'map', 'dashboard', 'download'],
    defaultEnabledTableColumns: [
      'scientificName',
      'features',
      'country',
      'coordinates',
      'year',
      'eventDate',
      'dataset',
      'recordedBy',
      'identifiedBy',
      'typeStatus',
      'preparations',
      'catalogNumber',
      'establishmentMeans',
      'iucnRedListCategory',
    ],
  },
  maps: {
    locale: 'en',
    mapStyles: {
      defaultProjection: 'MERCATOR',
      defaultMapStyle: 'NATURAL',
      options: {
        ARCTIC: ['NATURAL', 'BRIGHT'],
        PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
        MERCATOR: ['NATURAL', 'BRIGHT', 'SATELLITE', 'DARK'],
        ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
      },
    },
  },
};
