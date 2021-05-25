
import { jsx } from '@emotion/react';
import React, { useState } from "react";
import PropTypes from 'prop-types';
import PopoverFilter from './PopoverFilter';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import { keyCodes } from '../../../utils/util';
import { Input } from '../../../components';
import { Option, Filter, SummaryBar, FilterBody, Footer, Exists } from '../utils';

export const FilterContent = ({ config = {}, translations, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { placeholder = 'Input text' } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions.filter(x => x.type !== 'isNotNull'));
  const [inputValue, setValue] = useState('');

  const singleSelect = config.singleSelect;

  const pattern = config.restrictWildcards ? /^(?![\*\?]).*/g : undefined;
  return <Filter
    labelledById={false}
    title={<FormattedMessage
      id={translations?.name || `filter.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    aboutText={translations.description && <FormattedMessage
      id={translations.description || `filter.${filterHandle}.description`}
      defaultMessage={translations.description}
    />}
    onFilterChange={onFilterChange}
    supportsExist={config.supportsExist}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      // if (typeof isExistenceFilter === 'undefined') {
      //   return <div>loading</div>;//TODO create a loader component for these kind of usages
      // }
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      return <>
        <div style={{ margin: '10px', zIndex: 10, display: 'inline-block', position: 'relative' }}>
          <Input ref={focusRef}
            value={inputValue}
            onChange={e => {
              const value = e.target.value;
              if (pattern) {
                if (value.match(pattern) !== null) {
                  setValue(value);
                }
              } else {
                setValue(value);
              }
            }}
            placeholder={placeholder}
            onKeyPress={e => {
              const value = e.target.value;
              if (e.which === keyCodes.ENTER) {
                if (value === '') {
                  onApply({ filter, hide });
                } else if (singleSelect) {
                  setOptions([value]);
                  setFullField(filterHandle, [value], [])
                    .then(responseFilter => onApply({ filter: responseFilter, hide }))
                    .catch(err => console.log(err));
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
        {options.length > 0 && typeof isExistenceFilter !== 'undefined' && <>
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