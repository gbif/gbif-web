
import { jsx } from '@emotion/react';
import get from 'lodash/get';
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import PopoverFilter from './PopoverFilter';
import { keyCodes } from '../../../utils/util';

import { Option, Filter, SummaryBar, AdditionalControl, FilterBody, Footer, Exists } from '../utils';

export const FilterContent = ({ config, translations, LabelFromID, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = useState(nanoid);
  const options = config.options;

  let mustNotLength = get(initFilter, `must_not.${filterHandle}`, []).length;
  const [isNegated, setNegated] = useState(mustNotLength > 0 && config.supportsNegation);

  return <Filter
    labelledById={labelledById}
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={translations?.name || `filters.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    hasHelpTexts={config.hasOptionDescriptions}
    supportsExist={config.supportsExist}
    aboutText={translations.description && <FormattedMessage
      id={translations.description || `filters.${filterHandle}.description`}
      defaultMessage={translations.description}
    />}
    isNegated={isNegated}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
    defaultHelpVisible={config.showOptionHelp}
  >
    {({ helpVisible, negateField, toggle, setFullField, filter, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      return <>
        {config.supportsNegation && <AdditionalControl checked={isNegated} onChange={e => {
          negateField(filterHandle, !isNegated);
          setNegated(!isNegated);
        }}><FormattedMessage id="filterSupport.excludeSelected" defaultMessage="Exclude selected"/></AdditionalControl>}
        
        <SummaryBar {...summaryProps} />
        <FilterBody onKeyPress={e => {
          if (e.shiftKey && e.which === keyCodes.ENTER) onApply({ filter, hide });
        }}>
          <form id={formId}
            onSubmit={e => e.preventDefault()}
          // onKeyPress={e => e.which === keyCodes.ENTER ? onApply({ filter, hide }) : null}
          >
            {options.map((concept, index) => {
              return <Option
                isRadio={config.isRadio}
                innerRef={index === 0 ? focusRef : null}
                key={concept.key}
                helpVisible={helpVisible}
                helpText={concept.desc}
                label={<LabelFromID id={concept.key} />}
                // label={<LabelFromID id={concept.key} />}
                checked={checkedMap.has(concept.key)}
                onChange={() => {
                  if (config.isRadio) {
                    setFullField(filterHandle, [concept.key], !isNegated)
                  } else {
                    toggle(filterHandle, concept.key, !isNegated)
                  }
                }}
              />
            })}
          </form>
        </FilterBody>
        <Footer {...footerProps}
          onApply={() => onApply({ filter, hide })}
          onCancel={() => onCancel({ filter, hide })}
        />
      </>
    }}
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
