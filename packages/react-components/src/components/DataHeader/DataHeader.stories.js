import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { DataHeader } from './DataHeader';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';
import { MemoryRouter as Router, Route } from "react-router-dom";
import { NavBar, NavItem } from '../NavBar/NavBar';
import { MdFileDownload, MdInfo, MdCode, MdChevronLeft } from 'react-icons/md';

export default {
  title: 'Components/DataHeader',
  component: DataHeader,
};

const style = {
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: 4,
  padding: '0 12px'
};

export const Example = () => {
  const [active, setActive] = useState('table');
  const right = <>
    <MdFileDownload style={{ margin: '0 6px' }} />
    <MdInfo style={{ margin: '0 6px' }} />
    <MdCode style={{ margin: '0 6px' }} />
  </>
  return <Router initialEntries={[`/occurrence/search`]}>
    <DocsWrapper>
      <DataHeader right={right} style={style}>
        <NavBar>
          <NavItem label="Table" data-targetid="table" onClick={e => setActive('table')} isActive={active === 'table'} />
          <NavItem label="Gallery" data-targetid="gallery" onClick={e => setActive('gallery')} isActive={active === 'gallery'} />
          <NavItem label="Map" to="/map" data-targetid="map" />
          <NavItem label="Breakdown" to="/dashboard" data-targetid="dashboard" />
        </NavBar>
      </DataHeader>

      <DataHeader style={{...style, margin: '24px 0'}} right={right} availableCatalogues={['OCCURRENCE', 'DATASET', 'COLLECTION']}>
        <NavBar>
          <NavItem label="Table" data-targetid="table" onClick={e => setActive('table')} isActive={active === 'table'} />
          <NavItem label="Gallery" data-targetid="gallery" onClick={e => setActive('gallery')} isActive={active === 'gallery'} />
          <NavItem label="Map" to="/map" data-targetid="map" />
          <NavItem label="Breakdown" to="/dashboard" data-targetid="dashboard" />
        </NavBar>
      </DataHeader>

      <DataHeader left={<div><MdChevronLeft /> All occurrences</div>} right={<>
          <MdFileDownload style={{ margin: '0 6px' }} />
          <MdInfo style={{ margin: '0 6px' }} />
        </>} style={{...style, margin: '24px 0'}}></DataHeader>

      <StyledProse source={readme}></StyledProse>
    </DocsWrapper>
  </Router>
};

Example.story = {
  name: 'DataHeader',
};