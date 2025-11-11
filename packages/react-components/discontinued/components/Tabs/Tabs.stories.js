import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Tabs } from './Tabs';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import { Button, Row, Col } from '../index';
import { MdMenu } from "react-icons/md";

const { TabList, Tab, TabPanel } = Tabs;

export default {
  title: 'Components/Tabs',
  component: Tabs,
};

export const Example = () => <>
  <Tabs defaultActiveId="table">
    <TabList aria-labelledby="My tabs">
      <Tab tabId="table">Table</Tab>
      <Tab tabId="map">Map</Tab>
      <Tab tabId="gallery">Gallery</Tab>
    </TabList>
    <TabPanel tabId="table">This component still needs accesability considerations. There seem to be great disagreement on the most friendly implementation of tabs</TabPanel>
    <TabPanel tabId="map">Tab content 2</TabPanel>
    <TabPanel tabId="gallery">Tab content 3</TabPanel>
  </Tabs>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'Tabs',
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
// {text('Text', 'Tabs text')}