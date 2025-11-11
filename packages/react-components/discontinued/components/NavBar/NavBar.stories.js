import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { NavBar, NavItem } from './NavBar';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';
import { MemoryRouter as Router, Route } from "react-router-dom";

export default {
  title: 'Components/Navigation bar',
  component: NavBar,
};

export const Example = () => <Router initialEntries={[`/`]}>
  <DocsWrapper>
    <NavBar>
      <NavItem
        label="About"
        to="/about"
        data-targetid="save"
      >
        About
      </NavItem>
      <NavItem
        label="Metrics"
        to="/metrics"
        data-targetid="upload"
      >
        Metrics
      </NavItem>
      <NavItem
        label="Occurrences"
        to="/occurrences"
        data-targetid="download"
      >
        Occurrences
      </NavItem>
      <NavItem
        label="Downloads"
        to="/downloads"
        data-targetid="send"
      >
        Downloads
      </NavItem>
      <NavItem
        label="Oooooooverflowing title"
        to="/funders"
        data-targetid="star"
        data-inmenu="true"
      >
        Funders
      </NavItem>
      <NavItem
        label="API"
        to="/api"
        data-targetid="archive"
        data-inmenu="true"
      >
        API
      </NavItem>
      <NavItem
        label="Help"
        onClick={() => alert('You can also trigger events instead of using routes')}
        data-inmenu="true"
        data-targetid="delete"
      >
        Help
      </NavItem>
    </NavBar>
  </DocsWrapper>
</Router>;

Example.story = {
  name: 'Nav bar',
};
