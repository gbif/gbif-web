import React from 'react';
import { getComponents } from '../../../widgets/Filter/types/SuggestFilter';
import { suggestConfigs } from './suggest/suggestConfigs';
import displayValue from '../displayNames/displayValue';
const ScientificName = displayValue('scientificName').component;

// export default {
//   Button:  props => <Button  {...props} filterName="taxonKey" DisplayName={ScientificName} suggestConfig={suggestConfigs.scientificName} />,
//   Popover: props => <Popover {...props} filterName="taxonKey" DisplayName={ScientificName} suggestConfig={suggestConfigs.scientificName}/>
// }

export default getComponents({
  filterName: 'taxonKey',
  DisplayName: ScientificName,
  suggestConfig: suggestConfigs.scientificName,
  ariaLabel: 'Filter on scientific name'
})