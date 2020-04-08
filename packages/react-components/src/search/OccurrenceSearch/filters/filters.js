import { SuggestFilterButton, SuggestFilterPopover } from './suggest/SuggestFilter';
import { suggestConfigs } from './suggest/suggestConfigs';
import displayValue from '../displayNames/displayValue';
// const ScientificName = displayValue('scientificName').component;
const DatasetTitle = displayValue('datasetTitle').component;

export function TaxonFilter(){
  return <SuggestFilterPopover 
}

export function TaxonFilterButton(){
  return <SuggestFilterButton DisplayName={DatasetTitle} filterName="datasetKey" displayValueAs='datasetTitle' suggestConfig={suggestConfigs.datasetTitle} css={css`margin-right: 4px; margin-bottom: 4px;`} />
}