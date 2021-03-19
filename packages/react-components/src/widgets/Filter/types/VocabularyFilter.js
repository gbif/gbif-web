
import { jsx } from '@emotion/react';
import React, { useContext, useState } from "react";
import PropTypes from 'prop-types';
import { TriggerButton } from '../utils/TriggerButton';
import { nanoid } from 'nanoid';
import { FilterContext } from '../state';
import get from 'lodash/get';
import PopoverFilter from './PopoverFilter';
import { keyCodes } from '../../../utils/util';

import { Option, Filter, SummaryBar, FilterBody, Footer } from '../utils';

export const FilterContent = ({ config, radio, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = React.useState(nanoid);
  const [vocabulary, setVocabulary] = useState();

  React.useEffect(() => {
    config.getVocabulary({ lang: 'eng' })
      .then(v => setVocabulary(v))
      .catch(err => console.error(err));
  }, [initFilter, filterHandle, config.getVocabulary]);

  return <Filter
    labelledById={labelledById}
    onApply={onApply}
    onCancel={onCancel}
    title={vocabulary?.label}
    aboutText={vocabulary?.definition}
    hasHelpTexts={vocabulary?.hasConceptDefinitions}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ helpVisible, setField, toggle, filter, checkedMap, formId, summaryProps, footerProps }) => <>
      <SummaryBar {...summaryProps} />
      <FilterBody>
        <form id={formId}
          onSubmit={e => e.preventDefault()}
        // onKeyPress={e => e.which === keyCodes.ENTER ? onApply({ filter, hide }) : null}
        >
          {vocabulary?.concepts && vocabulary.concepts.map((concept, index) => {
            return <Option
              innerRef={index === 0 ? focusRef : null}
              key={concept.name}
              helpVisible={helpVisible}
              helpText={concept.definition}
              label={concept.label}
              checked={checkedMap.has(concept.name)}
              onChange={() => toggle(filterHandle, concept.name)}
            />
          })}
        </form>
      </FilterBody>
      <Footer {...footerProps}
        onApply={() => onApply({ filter, hide })}
        onCancel={() => onCancel({ filter, hide })}
      />
    </>}
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
        config={config}
      />}
    />
  );
}