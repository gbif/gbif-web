
import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import PopoverFilter from './PopoverFilter';
import { FormattedMessage } from 'react-intl';
import { MdSearch } from 'react-icons/md'
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import { keyCodes } from '../../../utils/util';
import { Input, Button } from '../../../components';
import { Option, OptionSkeleton, Filter, SummaryBar, FilterBody, Footer, Exists, AdditionalControl } from '../utils';
import { useQuery } from '../../../dataManagement/api';
import SearchContext from '../../../search/SearchContext';
import unionBy from 'lodash/unionBy';
import { hash } from '../../../utils/util';

const initialSize = 25;

export const FilterContent = ({ config = {}, translations, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { data, error, loading, load } = useQuery(config.query, { lazyLoad: true });
  const [size, setSize] = useState(initialSize);
  const [q, setQ] = useState('');
  const { queryKey, placeholder = 'Input text' } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions.filter(x => x.type !== 'isNotNull'));
  const [inputValue, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState('');
  const searchContext = useContext(SearchContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const predicates = [
         // TODO the search function need to be defined in context
      ];
      if (searchContext?.rootPredicate) {
        predicates.push(searchContext.rootPredicate);
      }
      if (q && q !== '') {
        predicates.push({
          "type": "like",
          "key": queryKey,
          "value": `${q}`
        });
      }

      const includePattern = q
        .replace(/\*/g, '.*')
        .replace(/\?/, '.')
        .replace(/([\?\+\|\{\}\[\]\(\)\"\\])/g, (m, p1) => '\\' + p1)
        .toLowerCase();
      load({
        keepDataWhileLoading: size > initialSize,
        variables: {
          size,
          include: includePattern,
          predicate: {
            type: 'and',
            predicates: predicates
          }
        }
      });
    }
  }, [size, q]);

  const loadMore = useCallback(() => {
    setSize(size + 50);
  }, [size]);

  const search = useCallback((q) => {
    setSize(initialSize);
    setQ(q);
    setShowSuggestions(true);
  }, []);

  const items = data?.occurrenceSearch?.facet?.[queryKey];


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
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      const cardinality = data?.occurrenceSearch?.cardinality?.[queryKey];
      const hasMoreSuggestions = cardinality ? items?.length <= cardinality : items?.length === size;
      return <>
        <div style={{ zIndex: 10, display: 'inline-block', position: 'relative' }}>
          <div style={{margin: '10px 10px 0 10px', display: 'flex'}}>
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
                  search(inputValue);
                  // if (value === '') {
                  //   onApply({ filter, hide });
                  // } else {
                  //   // trigger search
                  //   search(inputValue);
                  // }
                }
              }}
            />
            <Button onClick={() => search(inputValue)}>
              <MdSearch />
            </Button>
          </div>
        </div>
        {typeof isExistenceFilter !== 'undefined' && <>
          <AdditionalControl style={{marginBottom: 4}} checked={showSuggestions} onChange={e => {
              // if (showSuggestions) setValue('');
              if (!showSuggestions) search(inputValue);
              setShowSuggestions(!showSuggestions);
            }}>
              <FormattedMessage id="filterSupport.showSuggestions" defaultMessage="Show suggestions"/>
            </AdditionalControl>
          <SummaryBar {...summaryProps} style={{ marginTop: 0 }} />
          <FilterBody style={{paddingTop: 0}}>
            <form id={formId} onSubmit={e => e.preventDefault()} >

              {showSuggestions && <>
                {loading && !items && <>
                  <OptionSkeleton helpVisible />
                  <OptionSkeleton helpVisible />
                  <OptionSkeleton helpVisible />
                </>}
                {items && <>
                  {!config.disallowLikeFilters && q !== '' && <div style={{borderBottom: '1px solid #eee', marginBottom: 12, paddingBottom: 12}}>
                    <Option
                    key={q}
                    loading={loading}
                    helpVisible={true}
                    helpText={<FormattedMessage id="filterSupport.useWildcardPattern" defaultMessage="Search for the pattern" />}
                    label={q}
                    checked={checkedMap.has(hash({type: 'like', value: q}))}
                    onChange={() => {
                      const qString = {type: 'like', value: q};
                      toggle(filterHandle, qString);
                      const allOptions = unionBy(options, [qString], hash);
                      setOptions(allOptions);
                    }}
                  /></div>}
                  {items.map((option) => {
                    return <Option
                      key={option.key}
                      loading={loading}
                      helpVisible={true}
                      helpText={
                        <FormattedMessage id="counts.nRecordsTotal" defaultMessage="{total} records in total"
                          values={{total: option.count}}/>}
                      label={option.key}
                      checked={checkedMap.has(option.key)}
                      onChange={() => {
                        toggle(filterHandle, option.key);
                        const allOptions = unionBy(options, [option.key], hash);
                        setOptions(allOptions);
                      }}
                    />
                  })}
                  {hasMoreSuggestions && <div style={{fontSize: 12, marginLeft: 24, marginTop: 12}}><Button appearance="primaryOutline" onClick={loadMore}>
                      <FormattedMessage id="search.loadMore" defaultMessage="More"/>
                    </Button></div>}
                </>}
              </>}

              {!showSuggestions && <>
                {options.length === 0 && <div style={{margin: '12px 0', opacity: .7}}>
                  <FormattedMessage id="filterSupport.wildcardHelp" defaultMessage="More"/>
                  </div>}
                {options.map((option) => {
                  return <Option
                    key={hash(option)}
                    helpVisible={false}
                    // label={option}
                    label={typeof option === 'string' ? option : option.value}
                    checked={checkedMap.has(typeof option === 'string' ? option : hash(option))}
                    onChange={() => toggle(filterHandle, option)}
                  />
                })}
              </>}
            </form>
          </FilterBody>
          {options.length > 0 &&
            <Footer {...footerProps}
              onApply={() => onApply({ filter, hide })}
              onCancel={() => onCancel({ filter, hide })}
            />
          }
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
