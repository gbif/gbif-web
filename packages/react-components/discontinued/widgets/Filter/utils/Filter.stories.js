import React from 'react';
import readme from './README.md';
import { StyledProse } from '../../../components/typography/StyledProse';
import { Filter, FilterBody, Option } from './index';

export default {
  title: 'Widgets/Filters/Filter',
  component: Filter,
};

export const About = () => <StyledProse source={readme}></StyledProse>

export const Example = () => {
  const filterName = 'BasisOfRecord';
  
  return <Filter
    onApply={filter => console.log(filter)}
    onCancel={() => console.log('cancel')}
    title="Basis of record"
    aboutText="some longer piece of text "
    hasHelpTexts={true}
    filterName={filterName}
    onAboutChange={e => console.log(e)}
    onHelpChange={e => console.log(e)}
    onFilterChange={e => console.log(e)}
    style={{height: 300, background: 'white'}}
  >
    {({ helpVisible, toggle, checkedMap }) => <>
      <FilterBody>
        {['HumanObservation', 'MachineObservation', 'LivingSpecimen', 'something', 'sdfg', 'absdef', 'defgh', 'ihjk'].map(e => {
          return <Option 
            key={e} 
            helpVisible={helpVisible} 
            helpText="some help text" 
            label={e} 
            checked={checkedMap.has(e)} onChange={() => toggle(filterName, e)}
            />})
        }
      </FilterBody>
    </>}
  </Filter>;
}

Example.story = {
  name: 'Filter',
};
