/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Popover as BasePopover } from '../../../components';
import { TriggerButton } from '../utils/TriggerButton';
import { nanoid } from 'nanoid';
import { FilterContext } from '../state';
import get from 'lodash/get';
import union from 'lodash/union';
import { keyCodes } from '../../../utils/util';
import getPopover from './PopoverFilter';

import { Suggest, Option, Filter, SummaryBar, FilterBody, Footer } from '../utils';

export const FilterContent = ({ hide, DisplayName, suggestConfig, onApply, onCancel, onFilterChange, focusRef, filterName, initFilter }) => {
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterName}`, []);
  const [options, setOptions] = useState(initialOptions);

  return <Filter
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={`filterName.${filterName}`}
      defaultMessage={'Loading'}
    />} //this should be formated or be provided as such
    aboutText="some help text"
    onFilterChange={onFilterChange}
    filterName={filterName}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, checkedMap, formId, summaryProps, footerProps }) => {
      return <>
        <Suggest
          {...suggestConfig}
          focusRef={focusRef}
          onKeyPress={e => e.which === keyCodes.ENTER ? onApply({filter, hide}) : null}
          onSuggestionSelected={({ item }) => {
            if (!item) return;
            const allOptions = union(options, [item.key]);
            setOptions(allOptions);
            toggle(filterName, item.key);
          }} />
        {options.length > 0 && <>
          <SummaryBar {...summaryProps} style={{ marginTop: 0 }} />
          <FilterBody>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((key) => {
                return <Option
                  key={key}
                  helpVisible={true}
                  label={<DisplayName id={key} />}
                  checked={checkedMap.has(key)}
                  onChange={() => toggle(filterName, key)}
                />
              })}
            </form>
          </FilterBody>
          <Footer {...footerProps}
            onApply={() => onApply({ filter, hide })}
            onCancel={() => onCancel({ filter, hide })}
          />
        </>}
      </>
    }
    }
  </Filter>
};

FilterContent.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onFilterChange: PropTypes.func,
  hide: PropTypes.func,
  focusRef: PropTypes.any,
  vocabulary: PropTypes.object,
  initFilter: PropTypes.object,
  filterName: PropTypes.string
};

// const Popover = getPopover({
//   ariaLabel: 'Filter on scientific names', 
//   Content: FilterContent
// });

/**
 * Popover filter for fields that need an autocomplete
 * @filterName {string} name of the filter (used to map to a field filter)
 * @DisplayName {Component} component that takes an id as a prop and displays a formatted name. E.g. id=uuid and it will display a title.
 * @placement {string} to which direction should the popover show? Availabel strings defined in popper js docs
 * @modal {boolean} should the popover show as a modal or as the next element
 * @suggestConfig {object} Configuration for how the suggest input box should work. Used by suggest wrapper that use the Autocomplete
 */
export function Popover({ filterName, DisplayName, placement, modal, suggestConfig, children }) {
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);
  const child = React.Children.only(children);

  useEffect(() => {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filter]);

  const onApply = useCallback(({ filter, hide }) => {
    currentFilterContext.setFilter(filter);
    hide();
  }, [currentFilterContext]);

  const onCancel = useCallback(({ hide }) => {
    hide();
  }, []);

  const onFilterChange = useCallback(filter => {
    setFilter(filter);
  }, []);

  return (
    <BasePopover
      onClickOutside={popover => { currentFilterContext.setFilter(tmpFilter); popover.hide() }}
      style={{ width: '22em', maxWidth: '100%' }}
      aria-label={`Filter on scientific name`} //todo, this should either point to a tag or be dynamic
      placement={placement}
      trigger={child}
      modal={modal}
    >
      <FilterContent
        filterName={filterName}
        DisplayName={DisplayName}
        suggestConfig={suggestConfig}
        onApply={onApply}
        onCancel={onCancel}
        onFilterChange={onFilterChange}
        initFilter={currentFilterContext.filter}
      />
    </BasePopover>
  );
}

/**
 * Popover filter for fields that need an autocomplete
 * @filterName {string} name of the filter (used to map to a field filter)
 * @DisplayName {Component} component that takes an id as a prop and displays a formatted name. E.g. id=uuid and it will display a title.
 * @displayValueAs {string} component that takes an id as a prop and displays a formatted name. E.g. id=uuid and it will display a title.
 * @placement {string} to which direction should the popover show? Availabel strings defined in popper js docs
 * @modal {boolean} should the popover show as a modal or as the next element
 * @suggestConfig {object} Configuration for how the suggest input box should work. Used by suggest wrapper that use the Autocomplete
 */
export function Button({ filterName, DisplayName, displayValueAs, suggestConfig, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  return <Popover filterName={filterName} DisplayName={DisplayName} suggestConfig={suggestConfig} modal>
    <TriggerButton {...props} filterName={filterName} DisplayName={DisplayName} options={get(currentFilterContext.filter, `must.${filterName}`, [])} />
  </Popover>
}