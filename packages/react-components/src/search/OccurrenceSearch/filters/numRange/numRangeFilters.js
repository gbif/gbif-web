import React from 'react';
import { Button, Popover } from '../../../../widgets/Filter/types/RangeFilter';
import displayValue from '../../displayNames/displayValue';

export function generateFilter(config) {
  return {
    Button: props => <Button {...config} {...props} />,
    Popover: props => <Popover {...config} {...props} />,
    DisplayName: config.DisplayName
  }
}

export const yearFilter = generateFilter({
  filterName: 'year',
  DisplayName: displayValue('year').component,
  config: {
    placeholder: 'Year range or single value'
  },
  ariaLabel: 'Filter on year',
});

export const elevationFilter = generateFilter({
  filterName: 'elevation',
  DisplayName: displayValue('elevation').component,
  config: {
    placeholder: 'Elevation in meters. E.g. 100,200'
  },
  ariaLabel: 'Filter on elevation',
});