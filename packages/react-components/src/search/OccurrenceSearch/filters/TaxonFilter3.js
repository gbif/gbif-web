/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import Popover from '../../../components/Popover/Popover';
import { Button } from '../../../components/Button';
import nanoid from 'nanoid';
import FilterContext from './state/FilterContext';
import get from 'lodash/get';
import union from 'lodash/union';
// import formatters from '../displayNames/formatters';

import { Option, Filter, SummaryBar, FilterBody, Footer } from '../../../widgets/Filter';
import { FilterSuggest, filterSuggestOption, Classification } from '../../../widgets/TaxonSuggest/FilterSuggest';
import axios from '../../../search/OccurrenceSearch/api/axios';
import ThemeContext from '../../../style/themes/ThemeContext';

function getData(q, options) {
  return axios.get(`//api.gbif.org/v1/species/suggest?datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=10&q=${q}`, options);
}

function PopupContent({ onApply, onCancel, onFilterChange, focusRef, filterName, initFilter }) {
  const [id] = React.useState(nanoid);
  const [searchOpen, setSearchOpen] = useState(false);
  const initialOptions = get(initFilter, `must.${filterName}`, []);
  const [options, setOptions] = useState(initialOptions);
  const theme = useContext(ThemeContext);

  return <Filter
    onApply={onApply}
    onCancel={onCancel}
    title="Scientific name"
    aboutText="some help text"
    onFilterChange={onFilterChange}
    filterName={filterName}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, checkedMap, selectedItems, formId, summaryProps, footerProps }) => {
      const options = union(initialOptions, selectedItems);
      return <>
        <FilterSuggest
          style={{margin: '0.5em 1.5em', fontSize: 14, marginBottom: searchOpen || options.length === 0 ? 5 : 0}}
          suggest={getData}
          keyBy="key"
          focusRef={focusRef}
          onStateChange={state => {setSearchOpen(state.isOpen)}}
          itemToString={item => item ? item.canonicalName : ''}
          selectedSet={checkedMap}
          itemRenderer={({ item, isHighlighted, selected }) => <div css={filterSuggestOption(theme, { isHighlighted, selected })}>
            <div>
              {item.canonicalName}
            </div>
            <div className="gbif-help-text">
              <Classification taxon={item} />
            </div>
          </div>
          }
          onSelect={item => {
            item ? toggle(filterName, item.key) : null;

          }}
        />
        {!searchOpen && options.length > 0 && <>
          <SummaryBar {...summaryProps} />
          <FilterBody>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((taxonKey) => {
                return <Option
                  key={taxonKey}
                  helpVisible={true}
                  helpText="needs writing"
                  label={taxonKey}
                  checked={checkedMap.has(taxonKey)}
                  onChange={() => toggle(filterName, taxonKey)}
                />
              })}
            </form>
          </FilterBody>
          <Footer {...footerProps} 
            onApply={() => onApply(filter)}
            onCancel={() => onCancel(filter)}
          />
        </>}
      </>
      }
    }
  </Filter>
}

PopupContent.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onFilterChange: PropTypes.func,
  focusRef: PropTypes.any,
  vocabulary: PropTypes.object,
  initFilter: PropTypes.object,
  filterName: PropTypes.string
};

export const TaxonomySearchBar = ({checkedMap, filterName, toggle, ...props}) => {
  const theme = useContext(ThemeContext);
  return <FilterSuggest
    {...props}
    suggest={getData}
    keyBy="key"
    itemToString={item => item.scientificName}
    selectedSet={checkedMap}
    itemRenderer={({ item, isHighlighted, selected }) => <div css={filterSuggestOption(theme, { isHighlighted, selected })}>
      <div>
        {item.scientificName}
      </div>
      <div className="gbif-help-text">
        <Classification taxon={item} />
      </div>
    </div>
    }
    onSelect={item => toggle(filterName, item.key)}
  />
}

export const TaxonFilter = ({ placement, ...props }) => {
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);

  return (
    <Popover
      onClickOutside={popover => { currentFilterContext.setFilter(tmpFilter); popover.hide() }}
      style={{ width: '22em', maxWidth: '100%' }}
      aria-label={`Filter on scientific name`}
      placement={placement}
      trigger={<FilterButton {...props} filterName="taxonKey" filter={currentFilterContext.filter}></FilterButton>}
    >
      {({ popover, focusRef }) => {
        return <PopupContent
          filterName="taxonKey"
          onApply={filter => { currentFilterContext.setFilter(filter); popover.hide() }}
          onCancel={() => { popover.hide(); }}
          focusRef={focusRef}
          onFilterChange={filter => setFilter(filter)}
          initFilter={currentFilterContext.filter}
        />
      }}
    </Popover>
  );
}
TaxonFilter.propTypes = {
  placement: PropTypes.string
};

const FilterButton = React.forwardRef(({ filter, filterName, ...props }, ref) => {
  const appliedFilters = get(filter, `must.${filterName}`, []);
  if (appliedFilters.length === 1) {
    const selected = filter.must[filterName][0];
    return <Button {...props} ref={ref}>{selected}</Button>
  }
  if (appliedFilters.length > 1) {
    return <Button {...props} ref={ref}>{appliedFilters.length} scientific names</Button>
  }
  return <Button appearance="primaryOutline" {...props} ref={ref}>Scientific name</Button>
});

FilterButton.displayName = 'FilterButton';
FilterButton.propTypes = {
  filter: PropTypes.object,
  filterName: PropTypes.string
};