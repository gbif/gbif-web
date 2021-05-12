
import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import PopoverFilter from './PopoverFilter';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import { keyCodes } from '../../../utils/util';
import { Input, Switch } from '../../../components';
import { Option, Filter, SummaryBar, FilterBody, Footer, Exists, AdditionalControl } from '../utils';
import { useQuery } from '../../../dataManagement/api';
import SearchContext from '../../../search/SearchContext';
import union from 'lodash/union';
import hash from 'object-hash';

export const FilterContent = ({ config = {}, translations, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { data, error, loading, load } = useQuery(SEARCH, { lazyLoad: true, keepDataWhileLoading: true });
  const [size, setSize] = useState(10);
  const [q, setQ] = useState('');
  const { placeholder = 'Input text' } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions);
  const [inputValue, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState('');

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const predicates = [
        //rootPredicate // TODO the search function need to be defined in context
      ];
      if (q && q !== '') {
        predicates.push({
          "type": "like",
          "key": "recordedBy",
          "value": `${q}`
        });
      }

      load({
        variables: {
          key: id,
          size,
          predicate: {
            type: 'and',
            predicates: predicates
          }
        }
      });
    }
  }, [id, size, q]);

  const loadMore = useCallback(() => {
    setSize(size + 50);
  }, [size]);

  const search = useCallback((q) => {
    setSize(25);
    setQ(q);
    setShowSuggestions(true);
  }, []);

  const items = data?.occurrenceSearch?.facet?.recordedBy;


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
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      return <>
        <div style={{ zIndex: 10, display: 'inline-block', position: 'relative' }}>
          <div style={{margin: '10px'}}>
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
                  } else {
                    // trigger search
                    console.log('search for results for : ' + inputValue);
                    search(inputValue);
                  }
                }
              }}
            />
          </div>
        </div>
        {typeof isExistenceFilter !== 'undefined' && <>
          <AdditionalControl style={{marginTop: '-1em', marginBottom: 4}}  checked={showSuggestions} onChange={e => {
              if (showSuggestions) setValue('');
              if (!showSuggestions) search(inputValue);
              setShowSuggestions(!showSuggestions);
            }}>Show suggestions</AdditionalControl>
          <SummaryBar {...summaryProps} style={{ marginTop: 0 }} />
          <FilterBody style={{paddingTop: 0}}>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {showSuggestions && <>
                {items.map((option) => {
                  return <Option
                    key={option.key}
                    helpVisible={true}
                    helpText={`${option.count} records in total`}
                    label={option.key}
                    checked={checkedMap.has(option.key)}
                    onChange={() => {
                      toggle(filterHandle, option.key);
                      const allOptions = union(options, [option.key]);
                      setOptions(allOptions);
                    }}
                  />
                })}
              </>}

              {!showSuggestions && <>
                {options.length === 0 && <div>Nothing selected - Search using * as a wildcard and ? as single letter wildcard</div>}
                {options.map((option) => {
                  return <Option
                    key={option}
                    helpVisible={false}
                    label={option}
                    checked={checkedMap.has(option)}
                    onChange={() => toggle(filterHandle, option)}
                  />
                })}
              </>}
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

const SEARCH = `
query keywordSearch($predicate: Predicate, $size: Int){
  occurrenceSearch(predicate: $predicate) {
    facet {
      recordedBy(size: $size) {
        key
        count
      }
    }
  }
}
`;