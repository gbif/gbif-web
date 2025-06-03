import {
  CoordinateUncertaintyLabel,
  DateLabel,
  DepthLabel,
  distanceFromCentroidInMetersLabel,
  ElevationLabel,
  OrganismQuantityLabel,
  RelativeOrganismQuantityLabel,
  SampleSizeValueLabel,
  YearLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterDateRangeConfig,
  filterRangeConfig,
} from '@/components/filters/filterTools';
import { Message } from '@/components/message';

export const yearConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'year',
  displayName: YearLabel,
  filterTranslation: 'filters.year.name',
  allowExistence: true,
  about: () => <Message id="filters.year.description" />,
  rangeExample: () => <Message id="filterSupport.rangeHelpYear" />,
  group: 'event',
};

export const coordinateUncertaintyConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'coordinateUncertaintyInMeters',
  displayName: CoordinateUncertaintyLabel,
  filterTranslation: 'filters.coordinateUncertainty.name',
  about: () => <Message id="filters.coordinateUncertainty.description" />,
  group: 'location',
};

export const distanceFromCentroidInMetersConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'distanceFromCentroidInMeters',
  displayName: distanceFromCentroidInMetersLabel,
  filterTranslation: 'filters.distanceFromCentroidInMeters.name',
  about: () => <Message id="filters.distanceFromCentroidInMeters.description" />,
  group: 'location',
};

export const depthConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'depth',
  displayName: DepthLabel,
  filterTranslation: 'filters.depth.name',
  about: () => <Message id="filters.depth.description" />,
  group: 'location',
};

export const organismQuantityConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'organismQuantity',
  displayName: OrganismQuantityLabel,
  filterTranslation: 'filters.organismQuantity.name',
  about: () => <Message id="filters.organismQuantity.description" />,
  group: 'occurrence',
};

export const sampleSizeValueConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'sampleSizeValue',
  displayName: SampleSizeValueLabel,
  filterTranslation: 'filters.sampleSizeValue.name',
  about: () => <Message id="filters.sampleSizeValue.description" />,
  group: 'event',
};

export const relativeOrganismQuantityConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'relativeOrganismQuantity',
  displayName: RelativeOrganismQuantityLabel,
  filterTranslation: 'filters.relativeOrganismQuantity.name',
  about: () => <Message id="filters.relativeOrganismQuantity.description" />,
  group: 'occurrence',
};

export const elevationConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'elevation',
  displayName: ElevationLabel,
  filterTranslation: 'filters.elevation.name',
  about: () => <Message id="filters.elevation.description" />,
  group: 'location',
};

// date ranges
export const eventDateConfig: filterDateRangeConfig = {
  filterType: filterConfigTypes.DATE_RANGE,
  filterHandle: 'eventDate',
  displayName: DateLabel,
  filterTranslation: 'filters.eventDate.name',
  about: () => <Message id="filters.eventDate.description" />,
  group: 'event',
};

export const lastInterpretedConfig: filterDateRangeConfig = {
  filterType: filterConfigTypes.DATE_RANGE,
  filterHandle: 'lastInterpreted',
  displayName: DateLabel,
  filterTranslation: 'filters.lastInterpreted.name',
  about: () => <Message id="filters.lastInterpreted.description" />,
  group: 'other',
};
