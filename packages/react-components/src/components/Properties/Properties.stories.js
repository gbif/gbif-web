import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { Properties, Term, Value } from './Properties';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Properties',
  component: Properties,
};

export const Example = () => <>
  <Properties style={{fontSize: 13, maxWidth: 600}} horizontal={boolean("horizontal", true)}>
    <Term>Description</Term>
    <Value>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.
    </Value>

    <Term>Owner</Term>
    <Value>Don Hobern</Value>

    <Term>Image</Term>
    <Value><img style={{maxWidth: '100%'}} src="http://via.placeholder.com/640x360"/></Value>

    <Term>Rights</Term>
    <Value>No rights reserved</Value>

    <Term>Created</Term>
    <Value>12 Apr 2016, 12:21</Value>

    <Term>License</Term>
    <Value>CC0</Value>
    
    <Term>Catalogue number</Term>
    <Value>DMS-10073825</Value>

    <Term>Created</Term>
    <Value>12 Apr 2016, 12:21</Value>

    <Term>Location</Term>
    <Value>
      <Properties style={{maxWidth: '100%'}}>
        <Term>Continent</Term>
        <Value>Europe</Value>

        <Term>Country</Term>
        <Value>Denmark</Value>

        <Term>Municipality</Term>
        <Value>Copenhagen</Value>

        <Term>Locality</Term>
        <Value>Fælledparken</Value>
      </Properties>
    </Value>

    <Term>Location</Term>
    <Value>
      <Properties style={{maxWidth: '100%'}} horizontal>
        <Term>Continent</Term>
        <Value>Europe</Value>

        <Term>Country</Term>
        <Value>Denmark</Value>

        <Term>Municipality</Term>
        <Value>Copenhagen</Value>

        <Term>Locality</Term>
        <Value>Fælledparken</Value>
      </Properties>
    </Value>
  </Properties>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'Properties',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'Properties text')}