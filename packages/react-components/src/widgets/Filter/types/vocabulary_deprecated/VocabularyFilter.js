import React, { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from 'prop-types';
import { Popover } from '../../../../components';
import { Button, FilterButton } from '../../../../components/Button';
import { nanoid } from 'nanoid';
import { FilterContext } from '../../state';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';
// import formatters from '../displayNames/formatters';
import { getVocabulary } from './getVocabulary';
import { Option, Filter, FilterBody, SummaryBar, Footer } from '../../utils';

function PopupContent({ hide, onApply, onCancel, onFilterChange, focusRef, vocabulary, filterName, initFilter }) {
  const [id] = React.useState(nanoid);

  return <Filter
    onApply={onApply}
    onCancel={onCancel}
    title={vocabulary.label}
    aboutText={vocabulary.definition}
    hasHelpTexts={vocabulary.hasConceptDefinitions}
    onFilterChange={onFilterChange}
    filterName={filterName}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ helpVisible, toggle, filter, checkedMap, formId, summaryProps, footerProps }) => <>
      <SummaryBar {...summaryProps} />
      <FilterBody>
        <form id={formId} onSubmit={e => e.preventDefault()} >
          {vocabulary && vocabulary.concepts.map((concept, index) => {
            return <Option
              innerRef={index === 0 ? focusRef : null}
              key={concept.name}
              helpVisible={helpVisible}
              helpText={concept.definition}
              label={concept.label}
              checked={checkedMap.has(concept.name)}
              onChange={() => toggle(vocabulary.name, concept.name)}
            />
          })}
        </form>
      </FilterBody>
      <Footer {...footerProps} 
        onApply={() => onApply({filter, hide})}
        onCancel={() => onCancel({filter, hide})}
      />
    </>}
  </Filter>
}

PopupContent.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onFilterChange: PropTypes.func,
  hide: PropTypes.func,
  focusRef: PropTypes.any,
  vocabulary: PropTypes.object,
  initFilter: PropTypes.object,
  filterName: PropTypes.string
};

export const VocabularyFilter = ({ vocabularyName = 'BasisOfRecord', ...props }) => {
  const currentFilterContext = useContext(FilterContext);

  return <VocabularyFilterPopover modal vocabularyName={vocabularyName}>
    {({vocabulary}) => <Trigger {...props} vocabulary={vocabulary} onClear={()=>currentFilterContext.setField(vocabularyName, [])} filter={currentFilterContext.filter}></Trigger>}
  </VocabularyFilterPopover>
}

export const VocabularyFilterPopover = ({ vocabularyName = 'BasisOfRecord', children, modal, placement, ...props }) => {
  const currentFilterContext = useContext(FilterContext);
  const [vocabulary, setVocabulary] = useState();
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);

  getVocabulary(vocabularyName, 'eng')
    .then(v => setVocabulary(v))
    .catch(err => console.error(err));

  useEffect(() => {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filter]);

  const onApply = useCallback(({filter, hide}) => {
    currentFilterContext.setFilter(filter);
    hide();
  }, [currentFilterContext]);

  const onCancel = useCallback(({hide}) => {
    hide();
  }, []);

  const onFilterChange = useCallback(filter => {
    setFilter(filter);
  }, []);


  return (
    <Popover
      onClickOutside={popover => { currentFilterContext.setFilter(tmpFilter); popover.hide() }}
      style={{ width: '22em', maxWidth: '100%' }}
      aria-label={`Filter on ${vocabularyName}`}
      placement={placement}
      modal={modal}
      trigger={typeof children === 'function' ? children({vocabulary}) : children}
    >
      {({ hide, focusRef }) => {
        return (vocabulary && <PopupContent
          filterName={vocabularyName}
          vocabulary={vocabulary}
          hide={hide}
          onApply={onApply}
          onCancel={onCancel}
          onFilterChange={onFilterChange}
          initFilter={currentFilterContext.filter}
          focusRef={focusRef}
        />)
      }}
    </Popover>
  );
}
VocabularyFilter.propTypes = {
  vocabularyName: PropTypes.string,
  placement: PropTypes.string
};

const Trigger = React.forwardRef(({ filter, onClear, vocabulary, ...props }, ref) => {
  if (!vocabulary) return <Button appearance="primaryOutline" ref={ref} loading={true}>Loading</Button>

  const appliedFiltersSet = new Set(get(filter, `must.${vocabulary.name}`, []));
  if (appliedFiltersSet.size === 1) {
    const selected = keyBy(vocabulary.concepts, 'name')[filter.must[vocabulary.name][0]].label;
    return <FilterButton isActive {...props} ref={ref} onClearRequest={onClear}>{selected}</FilterButton>
  }
  if (appliedFiltersSet.size > 1) {
    return <FilterButton isActive onClearRequest={onClear} {...props} ref={ref}>{appliedFiltersSet.size} {vocabulary.label}s</FilterButton>
  }
  return <FilterButton {...props} ref={ref}>{vocabulary.label}</FilterButton>
});

Trigger.displayName = 'FilterButton';
Trigger.propTypes = {
  filter: PropTypes.object,
  vocabulary: PropTypes.object,
  onClear: PropTypes.func,
};