
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

import { Suggest, Option, Filter, SummaryBar, FilterBody, Footer, Exists } from '../utils';

export const FilterContent = ({ config, translations, labelledById, LabelFromID, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(initialOptions.filter(x => x.type !== 'isNotNull'));

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
    supportsExist={config.supportsExist}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
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
              toggle(filterHandle, item.key);
            }
          }}
        />
        {options.length === 0 && config.showAboutAsDefault && typeof aboutText !== 'undefined' && <Prose as={FilterBodyDescription}>
          {aboutText}
        </Prose>}
        {options.length > 0 && <>
          <SummaryBar {...summaryProps} style={{ marginTop: 0 }} />
          <FilterBody>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((key) => {
                return <Option
                  key={key}
                  helpVisible={true}
                  label={<Label id={key} />}
                  checked={checkedMap.has(key)}
                  onChange={() => toggle(filterHandle, key)}
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
