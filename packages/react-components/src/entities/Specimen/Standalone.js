import React, { useState } from "react";
import { Input } from "../../components";
import { Specimen } from './Specimen';
import StandaloneWrapper from '../../StandaloneWrapper';

function Standalone(props) {
  const options = [
    { value: 'B 10 0059081', label: 'BGBM' },
    { value: 'dcc04c84-1ed3-11e3-bfac-90b11c41863e', label: 'Specify' },
    { value: '4f6a6ac4-651b-4e8e-a1ee-45c459d29b99', label: 'Symbiota (Salix)' },
    { value: 'cd3fdc48-8047-4edd-bb04-e2c5ba229796', label: 'Symbiota (Myodes)' },
    { value: '5c488c08-8cab-444a-9598-806dd0abec85', label: 'Koldingensis' },
  ];
  const defaultNr = new URLSearchParams(window.location.search).get('cat');
  const [catalogueNumber, setCatalogueNumber] = useState(defaultNr ?? 'B 10 0059081');

  return <StandaloneWrapper>
    <div style={{ padding: 12, }}>
      <div style={{ marginBottom: 12, display: 'flex' }}>
        <select style={{ flex: '0 0 auto', border: '1px solid #88888855', marginRight: 12, padding: '0 8px' }} onChange={(e) => setCatalogueNumber(e.target.value)} value={catalogueNumber}>
          <option value="">Enter catalogue number</option>
          {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <Input style={{ flex: '1 1 auto' }} placeholder="Search by material entity id (or select from dropdown)" value={catalogueNumber} onChange={e => setCatalogueNumber(e.target.value)} />
      </div>
      {!catalogueNumber && <h2 style={{ color: '#aaa', padding: '0px 50px 500px 0px' }}>Please enter a catalogue number</h2>}
      {catalogueNumber && <Specimen id={catalogueNumber} />}
    </div>
  </StandaloneWrapper>
}

export default Standalone;
