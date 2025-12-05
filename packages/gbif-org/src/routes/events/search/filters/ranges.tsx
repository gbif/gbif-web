import { DateLabel, SampleSizeValueLabel, YearLabel } from '@/components/filters/displayNames';
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

export const sampleSizeValueConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'sampleSizeValue',
  displayName: SampleSizeValueLabel,
  filterTranslation: 'filters.sampleSizeValue.name',
  about: () => <Message id="filters.sampleSizeValue.description" />,
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
