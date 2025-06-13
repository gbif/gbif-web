import {
  CoordinateUncertaintyLabel,
  DateLabel,
  DepthLabel,
  distanceFromCentroidInMetersLabel,
  ElevationLabel,
  EndDayOfYearLabel,
  GeologicalTimeLabel,
  OrganismQuantityLabel,
  RelativeOrganismQuantityLabel,
  SampleSizeValueLabel,
  StartDayOfYearLabel,
  YearLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterDateRangeConfig,
  filterGeologicalTimeConfig,
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

export const startDayOfYearConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'startDayOfYear',
  displayName: StartDayOfYearLabel,
  filterTranslation: 'filters.startDayOfYear.name',
  about: () => <Message id="filters.startDayOfYear.description" />,
  group: 'event',
};

export const endDayOfYearConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'endDayOfYear',
  displayName: EndDayOfYearLabel,
  filterTranslation: 'filters.endDayOfYear.name',
  about: () => <Message id="filters.endDayOfYear.description" />,
  group: 'event',
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

// geological time ranges
export const geologicalTimeConfig: filterGeologicalTimeConfig = {
  filterType: filterConfigTypes.GEOLOGICAL_TIME,
  filterHandle: 'geologicalTime',
  displayName: GeologicalTimeLabel,
  filterTranslation: 'filters.geologicalTime.name',
  about: () => <Message id="filters.geologicalTime.description" />,
  group: 'geologicalContext',
};
