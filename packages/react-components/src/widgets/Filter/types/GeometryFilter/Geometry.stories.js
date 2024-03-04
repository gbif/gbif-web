import React, { useState } from 'react';
import { FilterContent as GeometryFilter } from './GeometryFilter.js';
import { FilterContext, FilterState } from '../../state/index.js';

export default {
  title: 'Widgets/Filters/GeometryFilter',
  component: GeometryFilter
};

export const Example = () => {
  const [filter, setFilter] = useState({must: {geometry: ['MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,10 30,10 10,30 5,45 20,20 35),(30 20,20 15,20 25,30 20)))']}});
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
