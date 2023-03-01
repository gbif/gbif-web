import React, { useState } from 'react';
import { text } from '@storybook/addon-knobs';
import { Specimen } from './Specimen';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import Standalone from './Standalone';
import { QueryParamProvider } from 'use-query-params';
import { Input } from '../../components';

export default {
  title: 'Entities/WIP/Specimen page',
  component: Specimen,
};

// const selectSpecimen = choice => {
//   const options = {
//     koldingensis: '5c488c08-8cab-444a-9598-806dd0abec85',
//     bgbm: 'B 10 0059081'
//   };
//   console.log('choice', choice);
//   return options[choice] ?? '5c488c08-8cab-444a-9598-806dd0abec85';
// }

export const Example = () => <Router initialEntries={[`/`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <div style={{ flex: '1 1 auto' }}></div>
    {/* Crustacea */}
    {/* <Specimen id="1d1393bd-7edd-46fe-a224-ac8ff8e38402" /> */}

    {/* kew */}
    {/* <Specimen id="dceb8d52-094c-4c2c-8960-75e0097c6861" /> */}

    {/* NY botanical garden */}
    {/* <Specimen id="b2190553-4505-4fdd-8fff-065c8ca26f72" /> */}

    {/* Entomology from Harvard University, Museum of Comparative Zoology */}
    {/* <Specimen id="42844cb6-421e-4bcf-bdeb-c56039bee08c" /> */}

    {/* Koldingensis */}
    {/* <Specimen id={text('specimenUUID', '5c488c08-8cab-444a-9598-806dd0abec85')} /> */}

    {/* BGBM */}
    {/* <Specimen id={text('specimenUUID', 'B 10 0059081')} /> */}
    
    {/* specify with image */}
    <Specimen id={text('specimenUUID', 'dcc04c84-1ed3-11e3-bfac-90b11c41863e')} />
    
    {/* Has 3d model */}
    {/* <Specimen id={text('specimenUUID', 'db1fdcde-1ed3-11e3-bfac-90b11c41863e')} /> */}
    
    {/* has genetic sequence */}
    {/* <Specimen id={text('specimenUUID', 'db46a51c-1ed3-11e3-bfac-90b11c41863e')} /> */}

    {/* <Switch>
      <Route
        path='/specimen/:key'
        render={routeProps => <Specimen id={routeProps.match.params.key} {...routeProps}/>}
      />
    </Switch> */}
  </QueryParamProvider>
</Router>;

Example.story = {
  name: 'Specimen page',
};

export const StandaloneExample = () => <Standalone id="40560"></Standalone>;

export const SearchSpecimenByCatalogueNumber = () => {
  const options = [
    { value: 'B 10 0059081', label: 'BGBM' },
    { value: '40560', label: 'Specify' },
  ];
  const [catalogueNumber, setCatalogueNumber] = useState(text('specimenUUID', 'dcc04c84-1ed3-11e3-bfac-90b11c41863e'));
  
  return <div style={{padding: 12, }}>
    <div style={{marginBottom: 12, display: 'flex'}}>
      <select style={{flex: '0 0 auto', border: '1px solid #88888855', marginRight: 12, padding: '0 8px'}} onChange={(e) => setCatalogueNumber(e.target.value)} value={catalogueNumber}>
        <option value="">Enter catalogue number</option>
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <Input style={{flex: '1 1 auto'}} placeholder="Search by catalog number (or select from dropdown)" value={catalogueNumber} onChange={e => setCatalogueNumber(e.target.value)} />
    </div>
    {!catalogueNumber && <h2 style={{color: '#aaa', padding: '0px 50px 500px 0px'}}>Please enter a catalogue number</h2>}
    {catalogueNumber && <Specimen id={catalogueNumber}/>}
  </div>
}