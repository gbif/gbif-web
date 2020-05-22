import { getComponents } from '../../../../widgets/Filter/types/SuggestFilter';
import { suggestConfigs } from './suggestConfigs';
import displayValue from '../../displayNames/displayValue';

export const taxonFilter = getComponents({
  filterName: 'taxonKey',
  DisplayName: displayValue('scientificName').component,
  config: suggestConfigs.scientificName,
  ariaLabel: 'Filter on scientific name'
});

export const datasetFilter = getComponents({
  filterName: 'datasetKey',
  DisplayName: displayValue('datasetTitle').component,
  config: suggestConfigs.datasetTitle,
  ariaLabel: 'Filter on dataset'
});

export const publisherFilter = getComponents({
  filterName: 'publisherKey',
  DisplayName: displayValue('publisherTitle').component,
  config: suggestConfigs.publisherTitle,
  ariaLabel: 'Filter on publisher'
});