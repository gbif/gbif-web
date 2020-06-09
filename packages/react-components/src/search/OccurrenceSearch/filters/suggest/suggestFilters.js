import React from 'react';
import { Button, Popover } from '../../../../widgets/Filter/types/SuggestFilter';
import { suggestConfigs } from './suggestConfigs';
import displayValue from '../../displayNames/displayValue';

export function generateFilter(config) {
  return {
    Button: props => <Button {...config} {...props} />,
    Popover: props => <Popover {...config} {...props} />,
    DisplayName: config.DisplayName
  }
}

export const taxonFilter = generateFilter({
  filterName: 'taxonKey',// if nothing else provided, then this is the filterName used
  trKey: 'filter.taxonKey',
  DisplayName: displayValue('scientificName').component,
  config: suggestConfigs.scientificName,
  ariaLabel: 'Filter on scientific name'
});

export const datasetFilter = generateFilter({
  filterName: 'datasetKey',
  DisplayName: displayValue('datasetTitle').component,
  config: suggestConfigs.datasetTitle,
  ariaLabel: 'Filter on dataset'
});

export const publisherFilter = generateFilter({
  filterName: 'publisherKey',
  DisplayName: displayValue('publisherTitle').component,
  config: suggestConfigs.publisherTitle,
  ariaLabel: 'Filter on publisher'
});