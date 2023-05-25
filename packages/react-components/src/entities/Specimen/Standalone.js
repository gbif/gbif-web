import React, { useState } from "react";
import { Input } from "../../components";
import { Specimen } from './Specimen';
import StandaloneWrapper from '../../StandaloneWrapper';
import { useQueryParam, StringParam } from 'use-query-params';

function Standalone(props) {
  return <StandaloneWrapper>
    <Content {...props} />
  </StandaloneWrapper>
}

function Content(props) {
  const options = [
    { value: 'B 10 0059081', label: 'BGBM' },
    { value: 'dcc04c84-1ed3-11e3-bfac-90b11c41863e', label: 'Specify' },
    { value: '4f6a6ac4-651b-4e8e-a1ee-45c459d29b99', label: 'Symbiota (Salix)' },
    { value: 'cd3fdc48-8047-4edd-bb04-e2c5ba229796', label: 'Symbiota (Myodes)' },
    { value: '5c488c08-8cab-444a-9598-806dd0abec85', label: 'Koldingensis' },
    { value: 'id.gbif.ch/989939123', label: 'SwissCollNet (example 1)' },
    { value: 'id.gbif.ch/737579597', label: 'SwissCollNet (example 2)' },
    { value: 'id.gbif.ch/2062472674', label: 'SwissCollNet (example 3)' },
    { value: 'https://arctos.database.museum/guid/MSB:Host:20914', label: 'Arctos (Gyraulus parvus)' },
    { value: 'https://arctos.database.museum/guid/MSB:Para:19028', label: 'Arctos (Apicomplexa)' },
    { value: 'c4c44c9970ff46014801f0ef53b1c62043b996f7', label: 'Conabio Bees (Bombus ephippiatus)' },
    { value: '005c81149104777d30b2b1ec6331391e', label: 'Conabio Agro (Zea mays ssp. mays)' },
  ];
  const [entityId = 'https://arctos.database.museum/guid/MSB:Host:20914', setEntityId] = useQueryParam('entityId', StringParam);

  return <div style={{ padding: 12, }}>
    <div style={{ marginBottom: 12, display: 'flex' }}>
      <select style={{ flex: '0 0 auto', border: '1px solid #88888855', marginRight: 12, padding: '0 8px' }} onChange={(e) => setEntityId(e.target.value)} value={entityId}>
        <option value="">Enter entity ID</option>
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <Input style={{ flex: '1 1 auto' }} placeholder="Search by material entity id (or select from dropdown)" value={entityId} onChange={e => setEntityId(e.target.value)} />
    </div>
    {!entityId && <h2 style={{ color: '#aaa', padding: '0px 50px 500px 0px' }}>Please enter an entity ID</h2>}
    {entityId && <Specimen id={entityId} />}
  </div>
}

export default Standalone;
