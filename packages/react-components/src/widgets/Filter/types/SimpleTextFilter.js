/* @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from "react";
import PropTypes from 'prop-types';
import PopoverFilter from './PopoverFilter';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import unionBy from 'lodash/unionBy';
import { keyCodes } from '../../../utils/util';
import { Input } from '../../../components';
import { Option, Filter, SummaryBar, FilterBody, Footer, Exists } from '../utils';

export const FilterContent = ({ config = {}, LabelFromID, translations, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { placeholder = 'Input text' } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions);
  const [inputValue, setValue] = useState('');

  return <Filter
    labelledById={false}
    title={<FormattedMessage
      id={translations.name || `filter.${filterHandle}.name`}
      defaultMessage={'Loading'}
    />}
    aboutText="some help text" //this should be formated or be provided as such
    onFilterChange={onFilterChange}
    supportsExist={true}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      if (isExistenceFilter) {
        return <Exists {...{footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle}}/>
      }
      return <>
        <div style={{ margin: '10px', zIndex: 10, display: 'inline-block', position: 'relative' }}>
          <Input ref={focusRef}
            value={inputValue}
            onChange={e => {
              const value = e.target.value;
              setValue(value);
            }}
            placeholder={placeholder}
            onKeyPress={e => {
              const value = e.target.value;
              if (e.which === keyCodes.ENTER) {
                if (value === '') {
                  onApply({ filter, hide });
                } else {
                  setValue('');
                  const allOptions = [...new Set([value, ...options])]
                  setOptions(allOptions);
                  toggle(filterHandle, value);
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
                

                return <Option
                  key={option}
                  helpVisible={false}
                  label={option}
                  checked={checkedMap.has(option)}
                  onChange={() => toggle(filterHandle, option)}
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
  filterHandle: PropTypes.string
};

export function Popover({ filterHandle, LabelFromID, translations = {}, config, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent
        filterHandle={filterHandle}
        LabelFromID={LabelFromID}
        translations={translations}
        config={config} />}
    />
  );
}