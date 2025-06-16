import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterSuggestConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';

export const projectIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'projectId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.projectId.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceProjectIdFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: projectId(size: 50) {
            name: key
            count
          }
        }
      }
    }
  `,
  allowExistence: true,
  about: () => <Message id="filters.projectId.description" />,
  group: 'provenance',
};

export const programmeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'programme',
  displayName: IdentityLabel,
  filterTranslation: 'filters.programme.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceProgrammeFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: programme(size: 50) {
            name: key
            count
          }
        }
      }
    }
  `,
  allowExistence: true,
  about: () => <Message id="filters.programme.description" />,
  group: 'provenance',
};

export const datasetNameConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'datasetName',
  displayName: IdentityLabel,
  filterTranslation: 'filters.datasetName.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceDatasetNameFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: datasetName(size: 50) {
            name: key
            count
          }
        }
      }
    }
  `,
  allowExistence: true,
  about: () => <Message id="filters.datasetName.description" />,
  group: 'record',
};

export const associatedSequencesConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'associatedSequences',
  displayName: IdentityLabel,
  filterTranslation: 'filters.associatedSequences.name',
  allowExistence: true,
  about: () => <Message id="filters.associatedSequences.description" />,
  group: 'materialEntity',
};

export const previousIdentificationsConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'previousIdentifications',
  displayName: IdentityLabel,
  filterTranslation: 'filters.previousIdentifications.name',
  allowExistence: true,
  about: () => <Message id="filters.previousIdentifications.description" />,
  group: 'organism',
};

export const recordedByIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'recordedById',
  displayName: IdentityLabel,
  filterTranslation: 'filters.recordedById.name',
  allowExistence: true,
  about: () => <Message id="filters.recordedById.description" />,
  group: 'occurrence',
};

export const identifiedByIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'identifiedById',
  displayName: IdentityLabel,
  filterTranslation: 'filters.identifiedById.name',
  allowExistence: true,
  about: () => <Message id="filters.identifiedById.description" />,
  group: 'identification',
};

export const occurrenceIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'occurrenceId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.occurrenceId.name',
  about: () => <Message id="filters.occurrenceId.description" />,
  group: 'occurrence',
};

export const organismIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'organismId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.organismId.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceOrganismIdFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: organismId(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  allowExistence: true,
  about: () => <Message id="filters.organismId.description" />,
  group: 'organism',
};

export const higherGeographyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'higherGeography',
  displayName: IdentityLabel,
  filterTranslation: 'filters.higherGeography.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceHigherGeographyFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: higherGeography(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  allowExistence: true,
  allowNegations: true,
  about: () => <Message id="filters.higherGeography.description" />,
  group: 'location',
};

export const eventIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'eventId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.eventId.name',
  allowExistence: true,
  allowNegations: true,
  about: () => <Message id="filters.eventId.description" />,
  facetQuery: /* GraphQL */ `
    query OccurrenceEventIdFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: eventId(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  group: 'event',
};

export const fieldNumberConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'fieldNumber',
  displayName: IdentityLabel,
  filterTranslation: 'filters.fieldNumber.name',
  allowExistence: true,
  allowNegations: true,
  about: () => <Message id="filters.fieldNumber.description" />,
  facetQuery: /* GraphQL */ `
    query OccurrenceFieldNumberFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: fieldNumber(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  group: 'event',
};

export const taxonIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.verbatimTaxonId.name',
  allowExistence: true,
  about: () => <Message id="filters.taxonId.description" />,
  group: 'taxon',
};

export const gbifIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.gbifId.name',
  allowExistence: false,
  about: () => <Message id="filters.gbifId.description" />,
  group: 'other',
};
