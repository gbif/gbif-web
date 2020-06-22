/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext, useCallback } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import { FilterContext } from '../../state';
import get from 'lodash/get';
import union from 'lodash/union';
import { keyCodes } from '../../../../utils/util';
import PopoverFilter from '../PopoverFilter';
import OccurrenceContext from '../../../../search/OccurrenceSearch/config/OccurrenceContext';
import { Input, Button } from '../../../../components';
import { Button as ButtonA11y } from "reakit/Button";
import { FilterBox, Header, Filter, SummaryBar, FilterBody, Footer } from '../../utils';
import Suggest from './Suggest';

function Option({ label, ...props }) {
  return <div style={{ padding: '10px 20px', fontSize: '1em', borderTop: '1px solid #eee' }} {...props}>
    <div>{label}</div>
  </div>
}

function getSuggestConfig({ options }) {
  return {
    //What placeholder to show
    placeholder: 'Search for filters',
    // how to get the list of suggestion data
    getSuggestions: ({ q }) => options.filter(x => x.displayName.toLowerCase().indexOf(q) === 0).map(x => ({ ...x, key: x.filterHandle })),
    // how to map the results to a single string value
    getValue: suggestion => suggestion.displayName,
    // how to display the individual suggestions in the list
    render: function DatasetSuggestItem(suggestion) {
      return <div>{suggestion.displayName}</div>
    },
    delay: 10
  }
};

export const FilterContent = ({ focusRef, ...props }) => {
  const ref = React.useRef();
  const { filters } = useContext(OccurrenceContext);
  const [CurrentFilter, selectedFilter] = useState();
  const [options] = useState(() => Object.keys(filters).map(filterHandle => ({ filterHandle, displayName: filters[filterHandle].displayName })));
  const [suggestConfig] = useState(() => getSuggestConfig({ options }));get
  const [value, setValue] = useState('');

  React.useEffect(() => {
    if (CurrentFilter) {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [CurrentFilter]);
  
  return <>
    {!CurrentFilter && <FilterBox>
      {/* <Header>
        Search filters
      </Header> */}
      <>
        <Suggest
          value={value}
          initSuggestions={options}
          getSuggestions={suggestConfig.getSuggestions}
          onChange={(event, { newValue }) => setValue(newValue)}
          focusRef={focusRef}
          render={suggestConfig.render}
          getValue={suggestConfig.getValue}
          onSuggestionSelected={({ item, value }) => {
            setValue('');
            selectedFilter(() => filters[item.filterHandle].Content);
          }}
          delay={10}
        />
      </>
      {value === '' && <FilterBody style={{ padding: 0 }}>
        {options.map(x => <div key={x.filterHandle}>
          <Option
            label={x.displayName}
            onClick={() => selectedFilter(() => filters[x.filterHandle].Content)} />
        </div>)}
      </FilterBody>}
    </FilterBox>}
    {CurrentFilter && <CurrentFilter {...props} focusRef={ref} />}
  </>
};

FilterContent.propTypes = {
  // onApply: PropTypes.func,
  // onCancel: PropTypes.func,
  // onFilterChange: PropTypes.func,
  // hide: PropTypes.func,
  // focusRef: PropTypes.any,
  // vocabulary: PropTypes.object,
  // initFilter: PropTypes.object,
  // filterHandle: PropTypes.string
};

export function Popover({ config, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent />}
    />
  );
}

export function Trigger(props) {
  return <Popover modal>
    <Button appearance="primaryOutline">
      <FormattedMessage id="moreFilters" />
    </Button>
  </Popover>
}