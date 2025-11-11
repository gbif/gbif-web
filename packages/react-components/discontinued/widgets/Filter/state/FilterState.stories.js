import React from 'react';
import FilterState from './FilterState';
import FilterContext from './FilterContext';
import readme from './README.md';
import { StyledProse } from '../../../components/typography/StyledProse';

export default {
  title: 'Widgets/Filters',
  component: FilterState
};

export const Example = () => {
  return <FilterState>
    <FilterContext.Consumer>
      {({ setFilter, setField, add, remove, toggle, filter }) =>  <>
          <button onClick={() => toggle('someField', 'AAA')}>Toggle 'AAA'</button><br />
          <button onClick={() => toggle('someField', 'BBB')}>Toggle 'BBB'</button><br />
          <button onClick={() => add('someField', 'CCC')}>Add 'CCC'</button><br />
          <button onClick={() => remove('someField', 'CCC')}>Remove 'CCC'</button><br />
          <button onClick={() => setField('someField', [1,2,3,4])}>Set field to: [1,2,3,4]</button><br />
          <button onClick={() => setField('someField')}>Clear field</button><br />
          <button onClick={() => setFilter({do: 'anything'})}>Set filter as you like</button><br />
          <pre>{JSON.stringify(filter, null, 2)}</pre>
          <StyledProse source={readme}></StyledProse>
        </>
      }
    </FilterContext.Consumer>
  </FilterState>
};

Example.story = {
  name: 'State',
};
