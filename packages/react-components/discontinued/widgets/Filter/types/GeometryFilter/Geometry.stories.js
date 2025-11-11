import React, { useState } from 'react';
import { FilterContent as GeometryFilter } from './GeometryFilter.js';
import { FilterContext, FilterState } from '../../state/index.js';

export default {
  title: 'Widgets/Filters/GeometryFilter',
  component: GeometryFilter
};

export const Example = () => {
  const [filter, setFilter] = useState({must: {geometry: ['POLYGON((-6.55197 5.73624,-7.99805 28.30627,-27.68143 10.74738,-6.55197 5.73624))']}});
  return <div style={{padding: 48}}>
    <FilterState filter={filter} onChange={setFilter}>
      <FilterContext.Consumer>
        {({ setFilter, setField, add, remove, toggle, filter }) => {
          const properties = {
            config: {},
            translations: {},
            // LabelFromID, 
            hide: console.log,
            // labelledById, 
            onApply: (filter) => setFilter(filter),
            onCancel: console.log,
            onFilterChange: (filter) => setFilter(filter),
            filterHandle: 'geometry',
            initFilter: filter
          }
          return <>
            <div style={{ width: 400 }}>
              <GeometryFilter {...properties} />
            </div>
            <pre>{JSON.stringify(filter, null, 2)}</pre>
          </>
        }
        }
      </FilterContext.Consumer>
    </FilterState>
    <pre>{JSON.stringify(filter)}</pre>
  </div>
};

Example.story = {
  name: 'Filter',
};
