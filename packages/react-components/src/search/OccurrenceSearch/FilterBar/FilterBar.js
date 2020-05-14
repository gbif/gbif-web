/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import withContext from '../state/withContext';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { VocabularyFilter } from '../filters/VocabularyFilter';
import { TaxonFilter as TaxonFilter4 } from '../filters/TaxonFilter4/TaxonFilter';
import { SuggestFilterButton } from '../filters/suggest/SuggestFilter';
import { suggestConfigs } from '../filters/suggest/suggestConfigs';
import displayValue from '../displayNames/displayValue';
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
    <div><TaxonFilter4 css={css`margin-right: 4px; margin-bottom: 4px;`} /></div>
    <div><SuggestFilterButton DisplayName={DatasetTitle} filterName="datasetKey" displayValueAs='datasetTitle' suggestConfig={suggestConfigs.datasetTitle} css={css`margin-right: 4px; margin-bottom: 4px;`} /></div>
    <div><VocabularyFilter css={css`margin-right: 4px; margin-bottom: 4px;`} /></div>
    <div><VocabularyFilter vocabularyName="Country" css={css`margin-right: 4px; margin-bottom: 4px;`} /></div>
  </div>
}

FilterBar.propTypes = {
}

export const style = (theme) => css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const mapContextToProps = ({ filter, stateApi }) => ({ filter, stateApi });
export default withContext(mapContextToProps)(FilterBar);