
import { jsx } from '@emotion/react';
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import unionBy from 'lodash/unionBy';
import { keyCodes, hash } from '../../../utils/util';
import PopoverFilter from './PopoverFilter';
import { Input } from '../../../components';
import { Option, Filter, SummaryBar, FilterBody, Footer, Exists } from '../utils';
import { rangeOrTerm } from '../transform/rangeOrTerm';

/*
FilterContent component to show the header, menu search options. but not the apply and do not scope filter state
FilterPopover sets a tmp filter scope and adds a footer. inserts the content.
problem, the footer depends on the content and state (prose or not)
*/
export const FilterContent = ({ config = {}, translations, labelledById, LabelFromID, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { formatMessage } = useIntl();
  const { upperBound = 'lte', lowerBound = 'gte', placeholder = 'E.g. 100,200' } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions.filter(x => x.type !== 'isNotNull'));
  const [inputValue, setValue] = useState('');

  const formattedPlaceholder = formatMessage({id: placeholder});

  return <Filter
    labelledById={labelledById}
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
        return <Exists {...{footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle}}/>
      }
      return <>
        <div style={{ margin: '10px', zIndex: 10, display: 'inline-block', position: 'relative' }}>
          <Input ref={focusRef}
            value={inputValue}
            onChange={e => {
              const value = e.target.value;
              if (config.regex) {
                if(e.target.value.match(config.regex) !== null) {
                  setValue(value);
                }
              } else {
                setValue(value);
              }
            }}
            placeholder={formattedPlaceholder}
            onKeyPress={e => {
              const value = e.target.value;
              if (e.which === keyCodes.ENTER) {
                if (value === '') {
                  onApply({ filter, hide });
                } else {
                  const q = rangeOrTerm(value, upperBound, lowerBound);
                  setValue('');
                  const allOptions = unionBy([q], options, hash);
                  setOptions(allOptions);
                  toggle(filterHandle, q);
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
                    id={`intervals.description.e`}
                    defaultMessage={'Filter name'}
                    values={{ is: option.value }}
                  />
                } else {
                  helpText = <>
                    {option?.value && option?.value[lowerBound] && <FormattedMessage
                      id={`intervals.description.${lowerBound}`}
                      defaultMessage={'Filter name'}
                      values={{ from: option?.value[lowerBound] }}
                    />
                    }
                    {option?.value && option?.value[upperBound] && option?.value[lowerBound] && <>.&nbsp;</>}
                    {option?.value && option?.value[upperBound] && <FormattedMessage
                      id={`intervals.description.${upperBound}`}
                      defaultMessage={'Filter name'}
                      values={{ to: option?.value[upperBound] }}
                    />
                    }
                  </>
                }

                return <Option
                  key={hash(option)}
                  helpVisible={true}
                  label={<LabelFromID id={option} />}
                  helpText={helpText}
                  checked={checkedMap.has(hash(option))}
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

export function Popover({ filterHandle, LabelFromID, translations={}, config, ...props }) {
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
