/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { withFilter } from '../../..//widgets/Filter/state';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { VocabularyFilter } from '../../../widgets/Filter/types/vocabulary/VocabularyFilter';
import { taxonFilter, datasetFilter, publisherFilter } from '../filters/suggest/suggestFilters';
import { borFilter, countryFilter, typeStatusFilter } from '../filters/vocabulary/vocabularyFilters';

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
    <div><taxonFilter.Button /></div>
    <div><datasetFilter.Button /></div>
    {/* <div><publisherFilter.Button /></div> */}
    <div><borFilter.Button /></div>
    <div><typeStatusFilter.Button /></div>
    <div><countryFilter.Button /></div>
    {/* <div><VocabularyFilter /></div>
    <div><VocabularyFilter vocabularyName="Country" /></div> */}
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