
import { css, jsx } from '@emotion/react';
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import PopoverFilter from './PopoverFilter';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import { keyCodes } from '../../../utils/util';
import { Input } from '../../../components';
import { AdditionalControl, Option, Filter, SummaryBar, FilterBody, Footer, Exists } from '../utils';

export const FilterContent = ({ config = {}, translations, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { placeholder = 'Input text' } = config;
  const [id] = React.useState(nanoid);
  const [options, setOptions] = useState([]);
  const [inputValue, setValue] = useState('');

  let mustNotLength = get(initFilter, `must_not.${filterHandle}`, []).length;
  const [isNegated, setNegated] = useState(mustNotLength > 0 && config.supportsNegation);
  const [isComplex, setComplex] = useState(false);

  useEffect(() => {
    const initialMustOptions = get(initFilter, `must.${filterHandle}`, []);
    const initialMustNotOptions = get(initFilter, `must_not.${filterHandle}`, []);
    const notNullFilters = initialMustOptions.filter(x => x.type === 'isNotNull');
    const nullFilters = initialMustNotOptions.filter(x => x.type === 'isNotNull');
    const typeCount = [initialMustOptions, initialMustNotOptions, notNullFilters, nullFilters].reduce((prev, curr) => {
      prev += curr.length > 0 ? 1 : 0;
      return prev;
    }, 0);
    setComplex(typeCount > 1);
    if (typeCount < 2) {
      setOptions(initialMustOptions.length > 0 ? initialMustOptions : initialMustNotOptions);
    }
  }, [initFilter]);

  if (isComplex) {
    console.log('Complexity above what filter supports. Show dump of filter instead.');
  }

  const singleSelect = config.singleSelect;

  const pattern = config.restrictWildcards ? /^(?![\*\?]).*/g : undefined;
  return <Filter
    labelledById={false}
    title={<FormattedMessage
      id={translations?.name || `filters.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    aboutText={translations.description && <FormattedMessage
      id={translations.description || `filters.${filterHandle}.description`}
      defaultMessage={translations.description}
    />}
    onFilterChange={onFilterChange}
    supportsExist={config.supportsExist}
    filterName={filterHandle}
    isNegated={isNegated}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, negateField, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      return <>
        <div css={inputStyle}>
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
                  const params = isNegated ? [filterHandle, [], [value]] : [filterHandle, [value], []];
                  setFullField(...params)
                    .then(responseFilter => onApply({ filter: responseFilter, hide }))
                    .catch(err => console.log(err));
                } else {
                  setValue('');
                  const allOptions = [...new Set([value, ...options])]
                  setOptions(allOptions);
                  toggle(filterHandle, value, !isNegated);
                }
              }
            }}
          />
        </div>

        {typeof isExistenceFilter !== 'undefined' && config.supportsNegation && <AdditionalControl checked={isNegated} onChange={e => {
          negateField(filterHandle, !isNegated);
          setNegated(!isNegated);
        }}><FormattedMessage id="filterSupport.excludeSelected" defaultMessage="Exclude selected" /></AdditionalControl>}
        {options.length > 0 && typeof isExistenceFilter !== 'undefined' && <>
          <SummaryBar {...summaryProps} />
          <FilterBody>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((option) => {
                return <Option
                  key={option}
                  helpVisible={false}
                  label={option}
                  checked={checkedMap.has(option)}
                  onChange={() => toggle(filterHandle, option, !isNegated)}
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

export const inputStyle = css`
  margin: 10px;
  z-index: 10;
  display: inline-block;
  position: relative;
  & + div {
    margin-top: 0;
    >div {
      margin-top: 0;
    }
  }
`;