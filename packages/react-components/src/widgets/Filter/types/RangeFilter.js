/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { TriggerButton } from '../utils/TriggerButton';
import { nanoid } from 'nanoid';
import { FilterContext } from '../state';
import get from 'lodash/get';
import unionBy from 'lodash/unionBy';
import { keyCodes } from '../../../utils/util';
import PopoverFilter from './PopoverFilter';
import { Input } from '../../../components';

import { Option, Filter, SummaryBar, FilterBody, Footer } from '../utils';
import { rangeOrTerm } from '../transform/rangeOrTerm';

export const FilterContent = ({ config = {}, DisplayName, hide, onApply, onCancel, onFilterChange, focusRef, filterName, initFilter }) => {
  const { upperBound = 'lte', lowerBound = 'gte', placeholder = 'E.g. 100,200' } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterName}`, []);
  const [options, setOptions] = useState(initialOptions);

  return <Filter
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={`filterName.${filterName}`}
      // defaultMessage={`[${filterName}]`}
    />} //this should be formated or be provided as such
    aboutText="some help text"
    onFilterChange={onFilterChange}
    filterName={filterName}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, checkedMap, formId, summaryProps, footerProps }) => {
      return <>
        <div style={{ margin: '10px', zIndex: 10, display: 'inline-block', position: 'relative' }}>
          <Input ref={focusRef}
            placeholder={placeholder}
            onKeyPress={e => {
              const value = e.target.value;
              if (e.which === keyCodes.ENTER) {
                if (value === '') {
                  onApply({ filter, hide });
                } else {
                  const q = rangeOrTerm(value, upperBound, lowerBound);
                  e.target.value = '';
                  const allOptions = unionBy([q], options, 'key');
                  setOptions(allOptions);
                  toggle(filterName, q);
                }
              }
            }}
          />
        </div>
        {options.length > 0 && <>
          <SummaryBar {...summaryProps} style={{ marginTop: 0 }} />
          <FilterBody>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((option) => {
                let helpText;
                if (option.type === 'equals') {
                  helpText = <FormattedMessage
                    id={`interval.description.e`}
                    defaultMessage={'Filter name'}
                    values={{ is: option.value }}
                  />
                } else {
                  helpText = <>
                    {option?.value[lowerBound] && <FormattedMessage
                      id={`interval.description.${lowerBound}`}
                      defaultMessage={'Filter name'}
                      values={{ from: option?.value[lowerBound] }}
                    />
                    }
                    {option?.value[upperBound] && option?.value[lowerBound] && <>.&nbsp;</>}
                    {option?.value[upperBound] && <FormattedMessage
                      id={`interval.description.${upperBound}`}
                      defaultMessage={'Filter name'}
                      values={{ to: option?.value[upperBound] }}
                    />
                    }
                  </>
                }

                return <Option
                  key={option.key}
                  helpVisible={true}
                  label={<DisplayName id={option} />}
                  helpText={helpText}
                  checked={checkedMap.has(option.key)}
                  onChange={() => toggle(filterName, option)}
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
        config={config} />}
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