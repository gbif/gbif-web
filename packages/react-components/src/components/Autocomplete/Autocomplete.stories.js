import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Autocomplete } from './Autocomplete';
import { Example } from './Example';
import { Suggest } from './Suggest';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete,
};

export const Example1 = () => <>
  <Example style={{ width: 350 }} />
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example1.story = {
  name: 'Autocomplete',
};

const BACKBONE_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';
async function getSuggestions({ q, axios }) {
  const response = await axios.get(`http://api.gbif.org/v1/species/suggest?datasetKey=${BACKBONE_KEY}&limit=20&q=${q}`);
  return response.data;
}

export const Suggester = () => {
  const [value, setValue] = React.useState('Puma concolor');
  const [item, setItem] = React.useState({key: 5, scientificName: 'Puma concolor 2'});

  /*
  placeholder
  
  // how to get the list of suggestion data
  getSuggestions

  // how to map the results to a single string value
  getValue

  // how to display the individual suggestions in the list
  render

  //called when the clear button is clicked
  onClear

  onBlur
  called when the user clicks outside the input

  // should the component take focus when mounted?
  autoFocus

  */

  return <>
  <div>Controlled</div>
    <Suggest
      style={{ width: 350 }}
      placeholderTranslationPath="Test placeholder"
      getSuggestions={getSuggestions}
      // itemFromId={async ({id, axios}) => axios.get(`http://api.gbif.org/v1/species/${id}`)}
      itemToString={item => item.scientificName}
      // defaultId="5"
      renderSuggestion={suggestion => <div style={{ maxWidth: '100%' }}>
        <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
          {suggestion.scientificName}
        </div>
      </div >}
      item={item}
      onSelect={(item) => {
        setValue(item?.scientificName ?? '');
        setItem(item);
      }} 
      value={value}
      onChange={setValue}
      allowClear={true}
      />
      {item && <pre>{JSON.stringify(item, null, 2)}</pre>}

    <div>Uncontrolled</div>
    <Suggest
      style={{ width: 350 }}
      placeholderTranslationPath="Test placeholder"
      getSuggestions={getSuggestions}
      // itemFromValue={async id => axios.get(`http://api.gbif.org/v1/species/${id}`)}
      itemToString={item => item.scientificName}
      // defaultValue="5"
      renderSuggestion={suggestion => <div style={{ maxWidth: '100%' }}>
        <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
          {suggestion.scientificName}
        </div>
      </div >}
      item={item}
      onSelect={(item) => {
        setItem(item);
      }} 
      allowClear={true}
      />
    {/* <StyledProse source={readme}></StyledProse> */}
  </>
};

Suggester.story = {
  name: 'Suggest',
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
// {text('Text', 'Autocomplete text')}