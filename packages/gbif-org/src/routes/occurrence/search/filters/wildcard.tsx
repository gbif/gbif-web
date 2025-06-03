import { WildcardLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterWildcardConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';

export const waterBodyConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'waterBody',
  queryKey: 'waterBody',
  displayName: WildcardLabel,
  filterTranslation: 'filters.waterBody.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceWaterBodyFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: waterBody
        }
        facet {
          field: waterBody(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.waterBody.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const catalogNumberConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'catalogNumber',
  queryKey: 'catalogNumber',
  displayName: WildcardLabel,
  filterTranslation: 'filters.catalogNumber.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: catalogNumber
        }
        facet {
          field: catalogNumber(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.catalogNumber.description" />,
  group: 'occurrence',
};

export const preparationsConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'preparations',
  queryKey: 'preparations',
  displayName: WildcardLabel,
  filterTranslation: 'filters.preparations.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrencePreparationsFacet($predicate: Predicate, $size: Int, $include: String){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: preparations
        }
        facet {
          field: preparations(size: $size, include: $include) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.preparations.description" />,
  group: 'materialEntity',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const sampleSizeUnitConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'sampleSizeUnit',
  queryKey: 'sampleSizeUnit',
  displayName: WildcardLabel,
  filterTranslation: 'filters.sampleSizeUnit.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: sampleSizeUnit
        }
        facet {
          field: sampleSizeUnit(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.sampleSizeUnit.description" />,
  group: 'event',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const localityConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'locality',
  queryKey: 'locality',
  displayName: WildcardLabel,
  filterTranslation: 'filters.locality.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: locality
        }
        facet {
          field: locality(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.locality.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const stateProvinceConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'stateProvince',
  queryKey: 'stateProvince',
  displayName: WildcardLabel,
  filterTranslation: 'filters.stateProvince.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: stateProvince
        }
        facet {
          field: stateProvince(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.stateProvince.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const islandGroupConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'islandGroup',
  queryKey: 'islandGroup',
  displayName: WildcardLabel,
  filterTranslation: 'filters.islandGroup.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceIslandGroupFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: islandGroup
        }
        facet {
          field: islandGroup(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.islandGroup.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const islandConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'island',
  queryKey: 'island',
  displayName: WildcardLabel,
  filterTranslation: 'filters.island.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceIslandFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: island
        }
        facet {
          field: island(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.island.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const georeferencedByConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'georeferencedBy',
  queryKey: 'georeferencedBy',
  displayName: WildcardLabel,
  filterTranslation: 'filters.georeferencedBy.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceGeoreferencedByFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: georeferencedBy
        }
        facet {
          field: georeferencedBy(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.georeferencedBy.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const samplingProtocolConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'samplingProtocol',
  queryKey: 'samplingProtocol',
  displayName: WildcardLabel,
  filterTranslation: 'filters.samplingProtocol.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: samplingProtocol
        }
        facet {
          field: samplingProtocol(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.samplingProtocol.description" />,
  group: 'event',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const verbatimScientificNameConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'verbatimScientificName',
  queryKey: 'verbatimScientificName',
  displayName: WildcardLabel,
  filterTranslation: 'filters.verbatimScientificName.name',
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: verbatimScientificName
        }
        facet {
          field: verbatimScientificName(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.verbatimScientificName.description" />,
  group: 'identification',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const recordedByConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'recordedBy',
  queryKey: 'recordedBy',
  displayName: WildcardLabel,
  filterTranslation: 'filters.recordedBy.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int, $include: String){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: recordedBy
        }
        facet {
          field: recordedBy(size: $size, include: $include) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.recordedBy.description" />,
  group: 'occurrence',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const identifiedByConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'identifiedBy',
  queryKey: 'identifiedBy',
  displayName: WildcardLabel,
  filterTranslation: 'filters.identifiedBy.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceCatalogNumberFacet($predicate: Predicate, $size: Int, $include: String){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: identifiedBy
        }
        facet {
          field: identifiedBy(size: $size, include: $include) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.identifiedBy.description" />,
  group: 'identification',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const datasetIdConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'datasetId',
  queryKey: 'datasetId',
  displayName: WildcardLabel,
  filterTranslation: 'filters.datasetId.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query OccurrenceDatasetIdFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: datasetId
        }
        facet {
          field: datasetId(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.datasetId.description" />,
  group: 'record',
};
