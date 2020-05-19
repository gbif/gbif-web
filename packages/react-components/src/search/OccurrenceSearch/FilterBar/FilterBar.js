/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { withFilter } from '../../..//widgets/Filter/state';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { VocabularyFilter } from '../../../widgets/Filter/types/vocabulary/VocabularyFilter';
import { Button as SuggestButton } from '../../../widgets/Filter/types/SuggestFilter';
import { suggestConfigs } from '../filters/suggest/suggestConfigs';
import displayValue from '../displayNames/displayValue';
import taxonFilter from '../filters/taxonFilter';
const ScientificName = displayValue('scientificName').component;
const DatasetTitle = displayValue('datasetTitle').component;

const FilterBar = ({
  className = '',
  stateApi,
  filter,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'filterBar';
  return <div className={`${className} ${prefix}-${elementName}`}
    css={css`${style(theme)}`} {...props}>
    <div><SuggestButton DisplayName={ScientificName} filterName="taxonKey" suggestConfig={suggestConfigs.scientificName} /></div>
    <div><SuggestButton DisplayName={DatasetTitle} filterName="datasetKey" suggestConfig={suggestConfigs.datasetTitle} /></div>
    <div><VocabularyFilter /></div>
    <div><VocabularyFilter vocabularyName="Country" /></div>
    {/* <div><VocabularyFilter filterName="country" vocabularyName="Country" /></div> */}
    {/* filterName vocabularyName vocabularyEndpoint getVocabulary */}
  </div>
}

FilterBar.propTypes = {
}

export const style = (theme) => css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  >div {
    max-width: 100%;
    margin-right: 4px; 
    margin-bottom: 4px;
  }
`;

const mapContextToProps = ({ filter, stateApi }) => ({ filter, stateApi });
export default withFilter(mapContextToProps)(FilterBar);