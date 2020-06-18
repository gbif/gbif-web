/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '../../../components';
import { nanoid } from 'nanoid';
import { FilterContext } from '../state';
import get from 'lodash/get';
import union from 'lodash/union';
import { keyCodes } from '../../../utils/util';
import PopoverFilter from './PopoverFilter';
import OccurrenceContext from '../../../search/OccurrenceSearch/config/OccurrenceContext';
import { Input } from '../../../components';

import { FilterBox, Header, Suggest, Option, Filter, SummaryBar, FilterBody, Footer } from '../utils';

export const FilterContent = ({ focusRef, ...props }) => {
  const ref = React.useRef();
  const { filters } = useContext(OccurrenceContext);
  const [CurrentFilter, selectedFilter] = useState();
  const [options] = useState(() => Object.keys(filters).map(filterHandle => ({ filterHandle, displayName: filters[filterHandle].displayName })));
  const [q, setQ] = useState('');

  React.useEffect(() => {
    if (CurrentFilter) {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [CurrentFilter]);

  return <>
    {!CurrentFilter && <FilterBox>
      <Header>
        Search filters
    </Header>
      <div style={{ margin: '10px', zIndex: 10, display: 'inline-block', position: 'relative' }}>
        <Input ref={focusRef}
          placeholder="Search"
          value={q}
          onChange={e => {
            setQ(('' + e.target.value).toLowerCase());
          }}
        />
      </div>
      <FilterBody>
        {q}
        {options.filter(x => x.displayName.toLowerCase().indexOf(q) === 0).map(x => <div key={x.filterHandle}>
          <button onClick={() => selectedFilter(() => filters[x.filterHandle].Content)}>{x.displayName}</button>
        </div>)}
      </FilterBody>
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