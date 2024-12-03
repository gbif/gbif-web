import { CoordinateUncertaintyLabel, DepthLabel, ElevationLabel, OrganismQuantityLabel, RelativeOrganismQuantityLabel, SampleSizeValueLabel, YearLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterRangeConfig } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';

export const yearConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'year',
  displayName: YearLabel,
  filterTranslation: 'filters.year.name',
  facetQuery: `
    query OccurrenceYearFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: year {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const coordinateUncertaintyConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'coordinateUncertainty',
  displayName: CoordinateUncertaintyLabel,
  filterTranslation: 'filters.coordinateUncertainty.name',
  facetQuery: `
    query OccurrenceCoordinateUncertaintyFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: coordinateUncertainty {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const depthConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'depth',
  displayName: DepthLabel,
  filterTranslation: 'filters.depth.name',
  facetQuery: `
    query OccurrenceDepthFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: depth {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const organismQuantityConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'organismQuantity',
  displayName: OrganismQuantityLabel,
  filterTranslation: 'filters.organismQuantity.name',
  facetQuery: `
    query OccurrenceOrganismQuantityFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: organismQuantity {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const sampleSizeValueConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'sampleSizeValue',
  displayName: SampleSizeValueLabel,
  filterTranslation: 'filters.sampleSizeValue.name',
  facetQuery: `
    query OccurrenceSampleSizeValueFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: sampleSizeValue {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const relativeOrganismQuantityConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'relativeOrganismQuantity',
  displayName: RelativeOrganismQuantityLabel,
  filterTranslation: 'filters.relativeOrganismQuantity.name',
  facetQuery: `
    query OccurrenceRelativeOrganismQuantityFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: relativeOrganismQuantity {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const elevationConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'elevation',
  displayName: ElevationLabel,
  filterTranslation: 'filters.elevation.name',
  facetQuery: `
    query OccurrenceElevationFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: elevation {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};
