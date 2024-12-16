import { WildcardLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterWildcardConfig } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';

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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};
