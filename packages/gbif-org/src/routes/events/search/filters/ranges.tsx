import { DateLabel, SampleSizeValueLabel, YearLabel } from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterDateRangeConfig,
  filterRangeConfig,
} from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { termToGroup } from '../humboldtTerms';
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

export const humboldtSiteCountConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'humboldtSiteCount',
  displayName: SampleSizeValueLabel,
  filterTranslation: 'filters.siteCount.name',
  allowExistence: true,
  about: () => <Message id="filters.siteCount.description" />,
  group: termToGroup['siteCount'],
};

export const humboldtSamplingEffortValueConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'humboldtSamplingEffortValue',
  displayName: SampleSizeValueLabel,
  filterTranslation: 'filters.samplingEffortValue.name',
  allowExistence: true,
  about: () => <Message id="filters.samplingEffortValue.description" />,
  group: termToGroup['samplingEffortValue'],
};

export const humboldtTotalAreaSampledValueConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'humboldtTotalAreaSampledValue',
  displayName: SampleSizeValueLabel,
  filterTranslation: 'filters.totalAreaSampledValue.name',
  allowExistence: true,
  about: () => <Message id="filters.totalAreaSampledValue.description" />,
  group: termToGroup['totalAreaSampledValue'],
};
