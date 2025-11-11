
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

export const FilterContent = ({ config, radio, hide, onApply, onCancel, onFilterChange, focusRef, filterName, initFilter }) => {
  const [id] = React.useState(nanoid);
  const [vocabulary, setVocabulary] = useState();

  React.useEffect(() => {
    config.getVocabulary({ lang: 'eng', filter: initFilter })
      .then(v => setVocabulary(v))
      .catch(err => console.error(err));
  }, [initFilter, filterName, config.getVocabulary]);

  return <Filter
    onApply={onApply}
    onCancel={onCancel}
    title={vocabulary?.label}
    aboutText={vocabulary?.definition}
    hasHelpTexts={vocabulary?.hasConceptDefinitions}
    onFilterChange={onFilterChange}
    filterName={filterName}
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
              onChange={() => toggle(filterName, concept.name)}
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
  filterName: PropTypes.string
};

export function Popover({ filterName, DisplayName, config, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent
        filterName={filterName}
        config={config}
      />}
    />
  );
}

export function Button({ filterName, DisplayName, config, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  return <Popover filterName={filterName} DisplayName={DisplayName} config={config} modal>
    <TriggerButton {...props} filterName={filterName} DisplayName={DisplayName} options={get(currentFilterContext.filter, `must.${filterName}`, [])} />
  </Popover>
}

Button.propTypes = {
  filterName: PropTypes.string.isRequired,
  DisplayName: PropTypes.elementType.isRequired,
  config: PropTypes.object.isRequired,
};