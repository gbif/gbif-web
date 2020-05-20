/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext, useEffect, useCallback } from "react";
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

export function Popover({ filterName, DisplayName, suggestConfig, children, ...props }) {
  const child = React.Children.only(children);
  return (
    <PopoverFilter trigger={child} {...props}>
      <FilterContent
        filterName={filterName}
        DisplayName={DisplayName}
        suggestConfig={suggestConfig}
      />
    </PopoverFilter>
  );
}

export function Button({ filterName, DisplayName, suggestConfig, ariaLabel, ...props }) {
  console.log('ariaLabel provided to button ', ariaLabel);
  const currentFilterContext = useContext(FilterContext);
  return <Popover ariaLabel={ariaLabel} filterName={filterName} DisplayName={DisplayName} suggestConfig={suggestConfig} modal>
    <TriggerButton {...props} filterName={filterName} DisplayName={DisplayName} options={get(currentFilterContext.filter, `must.${filterName}`, [])} />
  </Popover>
}

export function getComponents(config) {
  const Btn = Button;
  const Popovr = Popover;
  console.log('ariaLabel in getComponents:', config.ariaLabel)
  return {
    // Button: props => <Button {...props} {...config} />,
    // Popover: props => <Popover {...props} {...config} />

    Button: props => {
      console.log(config);
      console.log(props);
      <Btn {...props} {...config} />
    },
    Popover: props => <Popovr {...props} {...config} />

    // Button1: props => <Button {...props} {...config} />,
    // Popover1: props => <Popover {...props} {...config} />

    // Button: props => <button>Button</button>,
    // Popover: props => <h2>popover</h2>
  }
}