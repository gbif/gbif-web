import React, { useState, useRef } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Popper } from './Popper';
import readme from './README.md';
import { StyledProse } from '../../typography/StyledProse';
import { Button } from '/components/Button';
import { DemoOne } from './Modal';
import { Filter, FilterBody, Option } from '../../widgets/Filter';
import { TaxonFilterContent } from '../../search/OccurrenceSearch/filters/TaxonFilter4/TaxonFilter';

export default {
  title: 'Components/Popper',
  component: Popper,
};

export const Example2 = () => {
  return <DemoOne />
};

export const Example = () => {
  const innerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  return <>
    {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p> */}
    <button onClick={() => setVisible(!visible)}>Toggle visiblity</button>
    {/* {visible && <div style={{background: 'pink', border: '1px solid black', display: 'inline-block', width:300, overflow: 'hidden'}}><TaxonFilterContent /></div>}
    <TaxonFilterContent /> */}
    <Popper
      focusRef={innerRef}
      visible={visible}
      onBackdrop={() => setVisible(false)}
      trigger={<Button onClick={() => setVisible(!visible)} style={{marginLeft: 250}}>Trigger</Button>}
      content={<div style={{display: 'inline-block', width:300}}>
        <FilterExample innerRef={innerRef}/>
      </div>}
      >
    </Popper>
    
    {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p> */}
    {/* <StyledProse source={readme}></StyledProse> */}
  </>
};

Example.story = {
  name: 'Popper',
};


const FilterExample = props => {
  const filterName = 'BasisOfRecord';

  return <Filter
    onApply={filter => console.log(filter)}
    onCancel={() => console.log('cancel')}
    title="Basis of record"
    aboutText="som elonger piece of text "
    hasHelpTexts={true}
    filterName={filterName}
    onAboutChange={e => console.log(e)}
    onHelpChange={e => console.log(e)}
    onFilterChange={e => console.log(e)}
    style={{background: 'white'}}
  >
    {({ helpVisible, toggle, checkedMap }) => <>
      <FilterBody>
        {['HumanObservation', 'MachineObservation', 'LivingSpecimen', 'something', 'sdfg', 'absdef', 'defgh', 'ihjk', '765', '09874', 'nbvr7', 'mnb765', 'ggjj'].map((e, i) => {
          return <Option
            ref={i === 0 ? props.innerRef : null}
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