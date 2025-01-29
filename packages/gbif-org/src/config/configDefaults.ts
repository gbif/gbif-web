import { Config } from './config';

export const configDefault: Partial<Config> = {
  hardcodedKeys: {
    OBISKey: 'ba0670b9-4186-41e6-8e70-f9cb3065551a',
    taiwanNodeidentifier: '239',
  },
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
  dataHeader: {
    enableApiPopup: true,
    enableInfoPopup: true,
  },
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
      highlightedFilters: ['q', 'year', 'countriesOfResearcher', 'dataset'],
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
      excludedFilters: [
        'occurrenceStatus',
        'networkKey',
        'hostingOrganizationKey',
        'protocol',
        'publishingCountryCode',
        'institutionCode',
        'institutionKey',
        'collectionCode',
        'collectionKey',
      ],
      highlightedFilters: [
        'taxonKey',
        'verbatimScientificName',
        'catalogNumber',
        'recordedBy',
        'identifiedBy',
      ],
      defaultEnabledTableColumns: [
        'features',
        'catalogNumber',
        'country',
        'year',
        'recordedBy',
        'identifiedBy',
      ],
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
