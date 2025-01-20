import { Config } from './config';

export const configDefault: Partial<Config> = {
  openDrawerOnTableRowClick: true,
  availableCatalogues: [
    'OCCURRENCE',
    'INSTITUTION',
    'COLLECTION',
    'DATASET',
    'PUBLISHER',
    'TAXON',
    'LITERATURE',
  ],
  datasetSearch: {
    excludedFilters: [],
    highlightedFilters: ['q', 'type', 'publishingOrg', 'license'],
    queryType: 'V1',
  },
  datasetKey: {
    occurrenceSearch: {
      excludedFilters: ['datasetKey'],
      // availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
      // defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
      tabs: ['table', 'map', 'gallery', 'download'],
      defaultTab: 'table',
    },
    literatureSearch: {
      excludedFilters: ['gbifDatasetKey'],
    },
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
      tabs: ['table', 'map', 'gallery', 'clusters', 'download'],
      defaultTab: 'table',
    },
  },
  institutionSearch: {
    queryType: 'V1',
    highlightedFilters: ['q', 'code', 'country', 'numberSpecimens', 'occurrenceCount'],
  },
  institutionKey: {
    occurrenceSearch: {
      excludedFilters: ['institutionKey'],
      // availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
      // defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
      tabs: ['table', 'gallery', 'map', 'dashboard', 'clusters', 'download'],
      defaultTab: 'table',
    },
  },
  publisherSearch: {
    queryType: 'V1',
    highlightedFilters: ['q', 'country'],
  },
  taxonSearch: {
    queryType: 'V1',
    highlightedFilters: ['q', 'status', 'rank', 'higherTaxonKey'],
  },
  literatureSearch: {
    queryType: 'PREDICATE',
    highlightedFilters: ['q', 'year', 'countriesOfResearcher', 'gbifDatasetKey'],
  },
  occurrenceSearch: {
    queryType: 'PREDICATE',
    highlightedFilters: ['occurrenceStatus', 'taxonKey', 'year', 'country', 'issue', 'geometry'],
    tabs: ['table', 'gallery', 'map', 'dashboard', 'download'],
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
