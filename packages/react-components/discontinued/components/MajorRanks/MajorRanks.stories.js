import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { MajorRanks } from './MajorRanks';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/MajorRanks',
  component: MajorRanks,
};

const taxon = {
  "taxonKey": 5371709,
  "kingdomKey": 6,
  // "phylumKey": 7707728,
  "classKey": 220,
  "orderKey": 399,
  "familyKey": 2410,
  "genusKey": 3033821,
  "speciesKey": 5371709,
  "kingdom": "Plantae",
  // "phylum": "Tracheophyta",
  "order": "Ranunculales",
  "family": "Ranunculaceae",
  "genus": "Adonis",
  "species": "Adonis annua",
  "rank": "SPECIES",
}
export const Example = () => <>
  <MajorRanks taxon={taxon} showUnknownRanks/>
  <StyledProse source={readme}></StyledProse>
</>;

Example.story = {
  name: 'MajorRanks',
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
// {text('Text', 'MajorRanks text')}