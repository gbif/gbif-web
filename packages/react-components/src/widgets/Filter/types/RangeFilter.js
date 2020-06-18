/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import get from 'lodash/get';
import unionBy from 'lodash/unionBy';
import { keyCodes } from '../../../utils/util';
import PopoverFilter from './PopoverFilter';
import { Input } from '../../../components';
import { Option, Filter, SummaryBar, FilterBody, Footer } from '../utils';
import { rangeOrTerm } from '../transform/rangeOrTerm';

/*
FilterContent component to show the header, menu search options. but not the apply and do not scope filter state
FilterPopover sets a tmp filter scope and adds a footer. inserts the content.
problem, the footer depends on the content and state (prose or not)
*/
export const FilterContent = ({ config = {}, trName, labelledById, LabelFromID, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { upperBound = 'lte', lowerBound = 'gte', placeholder = 'E.g. 100,200' } = config;
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions);

  return <Filter
    labelledById={labelledById}
    title={<FormattedMessage
      id={trName || `filter.${filterHandle}.name`}
      defaultMessage={'Loading'}
    />}
    aboutText="some help text" //this should be formated or be provided as such
    onFilterChange={onFilterChange}
    filterName={filterHandle}
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
                  const allOptions = unionBy([q], options, '_id');
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
                  key={option._id}
                  helpVisible={true}
                  label={<LabelFromID id={option} />}
                  helpText={helpText}
                  checked={checkedMap.has(option._id)}
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
        trName={translations.name}
        config={config} />}
    />
  );
}
