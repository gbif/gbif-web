import { HelpText } from '@/components/helpText';
import { filterSuggestConfig, filterConfigTypes } from "@/components/filters/filterTools";
import { IdentityLabel } from '@/components/filters/displayNames';

export const projectIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'projectId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.projectId.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const recordedByIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'recordedById',
  displayName: IdentityLabel,
  filterTranslation: 'filters.recordedById.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const identifiedByIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'identifiedById',
  displayName: IdentityLabel,
  filterTranslation: 'filters.identifiedById.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const occurrenceIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'occurrenceId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.occurrenceId.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const organismIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'organismId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.organismId.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const higherGeographyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'higherGeography',
  displayName: IdentityLabel,
  filterTranslation: 'filters.higherGeography.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const eventIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'eventId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.eventId.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};
