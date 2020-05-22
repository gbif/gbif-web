/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { TriggerButton } from '../utils/TriggerButton';
import { nanoid } from 'nanoid';
import { FilterContext } from '../state';
import get from 'lodash/get';
import union from 'lodash/union';
import { keyCodes } from '../../../utils/util';
import PopoverFilter from './PopoverFilter';

import { Suggest, Option, Filter, SummaryBar, FilterBody, Footer } from '../utils';

export const FilterContent = ({ suggestConfig, DisplayName, hide, onApply, onCancel, onFilterChange, focusRef, filterName, initFilter }) => {
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
          onKeyPress={e => e.which === keyCodes.ENTER ? onApply({ filter, hide }) : null}
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

export function Popover({ filterName, DisplayName, config, ...props }) {
  return (
    <PopoverFilter 
      {...props}
      content={<FilterContent
        filterName={filterName}
        DisplayName={DisplayName}
        suggestConfig={config} />}
    />
  );
}

export function Button({ filterName, DisplayName, config, ariaLabel, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  return <Popover ariaLabel={ariaLabel} filterName={filterName} DisplayName={DisplayName} config={config} modal>
    <TriggerButton {...props} filterName={filterName} DisplayName={DisplayName} options={get(currentFilterContext.filter, `must.${filterName}`, [])} />
  </Popover>
}

Button.propTypes = {
  filterName: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  DisplayName: PropTypes.elementType.isRequired,
  config: PropTypes.object.isRequired,
};