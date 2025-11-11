import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { ContactList } from './ContactList';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

const contacts = [
  {
    "key": 2241997,
    "type": "ORIGINATOR",
    "primary": true,
    "userId": [
      "http://orcid.org/0000-0003-4055-1096"
    ],
    "firstName": "Rannveig Margrete",
    "lastName": "Jacobsen",
    "position": [],
    "email": [
      "Rannveig.Jacobsen@nina.no"
    ],
    "phone": [],
    "homepage": [],
    "organization": "Norwegian Institute for Nature Research",
    "address": [],
    "createdBy": "crawler.gbif.org",
    "modifiedBy": "crawler.gbif.org",
    "created": "2020-12-03T09:57:09.178+00:00",
    "modified": "2020-12-03T09:57:09.178+00:00"
  },
  {
    "key": 2241998,
    "type": "METADATA_AUTHOR",
    "primary": true,
    "userId": [
      "http://orcid.org/0000-0002-4006-8689"
    ],
    "firstName": "Roald",
    "lastName": "Vang",
    "position": [],
    "email": [
      "rv@nina.no"
    ],
    "phone": [
      "91138256"
    ],
    "homepage": [],
    "organization": "Norsk institutt for naturforskning",
    "address": [
      "Postboks 5685 Sluppen"
    ],
    "city": "Trondheim",
    "country": "NO",
    "postalCode": "7485",
    "createdBy": "crawler.gbif.org",
    "modifiedBy": "crawler.gbif.org",
    "created": "2020-12-03T09:57:09.182+00:00",
    "modified": "2020-12-03T09:57:09.182+00:00"
  },
  {
    "key": 2241999,
    "type": "ADMINISTRATIVE_POINT_OF_CONTACT",
    "primary": true,
    "userId": [
      "http://orcid.org/0000-0003-4055-1096"
    ],
    "firstName": "Rannveig Margrete",
    "lastName": "Jacobsen",
    "position": [],
    "email": [
      "Rannveig.Jacobsen@nina.no"
    ],
    "phone": [],
    "homepage": [],
    "organization": "Norwegian Institute for Nature Research",
    "address": [],
    "createdBy": "crawler.gbif.org",
    "modifiedBy": "46fec380-8e1d-11dd-8679-b8a03c50a862",
    "created": "2020-12-03T09:57:09.184+00:00",
    "modified": "2022-02-08T17:25:12.342+00:00"
  }
];

export default {
  title: 'Components/ContactList',
  component: ContactList,
};

export const Example = () => <DocsWrapper>
  <div style={{ background: 'white', padding: '12px' }}>
    <ContactList contacts={contacts}/>
  </div>
  {/* <StyledProse source={readme}></StyledProse> */}
</DocsWrapper>;

Example.story = {
  name: 'ContactList',
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
// {text('Text', 'ContactList text')}