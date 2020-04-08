/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import Popover from '../../../../components/Popover/Popover';
import { TriggerButton } from '../TriggerButton';
import nanoid from 'nanoid';
import FilterContext from '../state/FilterContext';
import get from 'lodash/get';
import union from 'lodash/union';
import displayValue from '../../displayNames/displayValue';
import { keyCodes } from '../../../../utils/util';

import { Option, Filter, SummaryBar, FilterBody, Footer } from '../../../../widgets/Filter';
import Suggest from '../suggest/Suggest';
import { suggestConfigs } from '../suggest/suggestConfigs';

const ScientificName = displayValue('scientificName').component;

export const PopupContent = ({ hide, onApply, onCancel, onFilterChange, focusRef, filterName, initFilter }) => {
  const [id] = React.useState(nanoid);
  const initialOptions = get(initFilter, `must.${filterName}`, []);
  const [options, setOptions] = useState(initialOptions);

  return <Filter
    onApply={onApply}
    onCancel={onCancel}
    title="Scientific name"
    aboutText="some help text"
    onFilterChange={onFilterChange}
    filterName={filterName}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, checkedMap, formId, summaryProps, footerProps }) => {
      return <>
        <Suggest 
          {...suggestConfigs.scientificName}
          focusRef={focusRef} 
          onKeyPress={e => e.which === keyCodes.ENTER ? onApply(filter) : null}
          onSuggestionSelected={({ item }) => {
            const allOptions = union(options, [item.key]);
            setOptions(allOptions);
            toggle(filterName, item.key);
          }} />
        {options.length > 0 && <>
          <SummaryBar {...summaryProps} style={{ marginTop: 0 }} />
          <FilterBody onKeyPress={e => e.which === keyCodes.ENTER ? onApply(filter) : null}>
            <form id={formId} onSubmit={e => e.preventDefault()} >
              {options.map((taxonKey) => {
                return <Option
                  key={taxonKey}
                  helpVisible={true}
                  label={<ScientificName id={taxonKey} />}
                  checked={checkedMap.has(taxonKey)}
                  onChange={() => toggle(filterName, taxonKey)}
                />
              })}
            </form>
          </FilterBody>
          <Footer {...footerProps}
            onApply={() => onApply({filter, hide})}
            onCancel={() => onCancel({filter, hide})}
          />
        </>}
      </>
    }
    }
  </Filter>
};

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

export const TaxonFilterContent = ({ placement, modal, children }) => {
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);

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

  return <PopupContent
    filterName="taxonKey"
    hide={() => console.log('hide')}
    onApply={onApply}
    onCancel={onCancel}
    onFilterChange={onFilterChange}
    initFilter={currentFilterContext.filter}
  />
}

export const TaxonFilterPopover = ({ placement, modal, children }) => {
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);

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
      aria-label={`Filter on scientific name`}
      placement={placement}
      trigger={children}
      modal={modal}
    >
      {({ hide, focusRef }) => {
        return <PopupContent
          filterName="taxonKey"
          // onApply={filter => { currentFilterContext.setFilter(filter) }}
          // onCancel={emptyFunc}
          // onFilterChange={emptyFunc}
          // initFilter={currentFilterContext.filter}
          hide={hide}
          onApply={onApply}
          onCancel={onCancel}
          onFilterChange={onFilterChange}
          initFilter={currentFilterContext.filter}
          focusRef={focusRef}
        />
      }}
    </Popover>
  );
}

export const TaxonFilter = ({ ...props }) => {
  const currentFilterContext = useContext(FilterContext);
  const filterName = 'taxonKey';

  return <TaxonFilterPopover modal>
    <TriggerButton {...props} filterName={filterName} displayValueAs="canonicalName" options={get(currentFilterContext.filter, `must.${filterName}`)} />
  </TaxonFilterPopover>
}