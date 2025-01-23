import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterSuggestConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';

export const projectIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'projectId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.projectId.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceProjectIdFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: projectId(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  allowExistence: true,
  about: () => <Message id="filters.projectId.description" />,
};

export const recordedByIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'recordedById',
  displayName: IdentityLabel,
  filterTranslation: 'filters.recordedById.name',
  allowExistence: true,
  about: () => <Message id="filters.recordedById.description" />,
};

export const identifiedByIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'identifiedById',
  displayName: IdentityLabel,
  filterTranslation: 'filters.identifiedById.name',
  allowExistence: true,
  about: () => <Message id="filters.identifiedById.description" />,
};

export const occurrenceIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'occurrenceId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.occurrenceId.name',
  about: () => <Message id="filters.occurrenceId.description" />,
};

export const organismIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'organismId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.organismId.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceOrganismIdFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
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
};

export const higherGeographyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'higherGeography',
  displayName: IdentityLabel,
  filterTranslation: 'filters.higherGeography.name',
  facetQuery: /* GraphQL */ `
    query OccurrencehigherGeographyFacet($predicate: Predicate) {
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
  about: () => <Message id="filters.higherGeography.description" />,
};

export const eventIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'eventId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.eventId.name',
  allowExistence: true,
  about: () => <Message id="filters.eventId.description" />,
};
