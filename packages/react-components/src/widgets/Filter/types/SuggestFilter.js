
import { jsx } from '@emotion/react';
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
import { Prose } from '../../../components/typography/Prose';
import { FilterBodyDescription } from '../utils/misc';

import { Suggest, Option, Filter, SummaryBar, FilterBody, Footer, Exists, AdditionalControl } from '../utils';

export const FilterContent = ({ config, translations, labelledById, LabelFromID, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = React.useState(nanoid);
  const mustOptions = get(initFilter, `must.${filterHandle}`, []);
  const mustNotOptions = get(initFilter, `must_not.${filterHandle}`, []);

  const initialOptions = mustOptions.concat(mustNotOptions);
  const [options, setOptions] = useState(initialOptions.filter(x => x.type !== 'isNotNull'));

  let mustNotLength = get(initFilter, `must_not.${filterHandle}`, []).length;
  const [isNegated, setNegated] = useState(mustNotLength > 0 && config.supportsNegation);

  const suggestConfig = config.suggestConfig;
  const singleSelect = config.singleSelect;
  const Label = config.LabelFromID || LabelFromID;

  const aboutText = translations.description && <FormattedMessage
    id={translations.description || `filters.${filterHandle}.description`}
    defaultMessage={translations.description}
  />;

  return <Filter
    labelledById={labelledById}
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={translations?.name || `filters.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    aboutText={aboutText}
    isNegated={isNegated}
    supportsExist={config.supportsExist}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, negateField, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      // if there is both must and must_not filters, then we cannot show it. Simply tell the user that it is a complex filter and provide the option to clear it
      // at some point it would be nice to allow the user to edit the filter, but that is a bit more complex. Could perhaps just be as a json/text editor
      if (mustOptions.length > 0 && mustNotOptions.length > 0) {
        return <Prose as={FilterBodyDescription}>
          <FormattedMessage id="filterSupport.complexFilter" defaultMessage="This filter is more complex than what the UI support. Please clear it to edit it." />
        </Prose>
      }
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      return <>
        <Suggest
          {...suggestConfig}
          allowEmptyQueries={config?.specific?.allowEmptyQueries}
          focusRef={focusRef}
          onKeyPress={e => e.which === keyCodes.ENTER ? onApply({ filter, hide }) : null}
          /*onKeyPress={e => {
            if (e.which === keyCodes.ENTER) {
              if (e.target.value === '') {
                onApply({ filter, hide });
              } else {
                const val = e.target.value;
                const allOptions = union(options, [val]);
                setOptions(allOptions);
                toggle(filterHandle, val);
              }
            }
          }}*/
          onSuggestionSelected={({ item }) => {
            if (!item) return;
            const allOptions = union(options, [item.key]);
            setOptions(allOptions);
            if (singleSelect) {
              setOptions([item.key]);
              setFullField(filterHandle, [item.key], [])
                .then(responseFilter => onApply({ filter: responseFilter, hide }))
                .catch(err => console.log(err));
            } else {
              toggle(filterHandle, item.key, !isNegated);
            }
          }}
        />
        
        {config.supportsNegation && <AdditionalControl checked={isNegated} onChange={e => {
          negateField(filterHandle, !isNegated);
          setNegated(!isNegated);
        }}><FormattedMessage id="filterSupport.excludeSelected" defaultMessage="Exclude selected"/></AdditionalControl>}

        {options.length === 0 && config.showAboutAsDefault && typeof aboutText !== 'undefined' && <Prose as={FilterBodyDescription}>
          {aboutText}
        </Prose>}
        {options.length > 0 && <>
          <SummaryBar {...summaryProps} style={{ marginTop: 4 }} />
          <FilterBody>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((key) => {
                return <Option
                  key={key}
                  helpVisible={true}
                  label={<Label id={key} />}
                  checked={checkedMap.has(key)}
                  onChange={() => {
                    toggle(filterHandle, key, !isNegated)
                  }}
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

export function Popover({ filterHandle, LabelFromID, config, translations = {}, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent
        filterHandle={filterHandle}
        translations={translations}
        LabelFromID={LabelFromID}
        config={config} />}
    />
  );
}
