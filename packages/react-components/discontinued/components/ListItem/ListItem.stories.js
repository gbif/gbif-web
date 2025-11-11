import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { ListItem } from './ListItem';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';
import { MdMail } from 'react-icons/md';
import Orcid from '../Orcid/Orcid';
export default {
  title: 'Components/ListItem',
  component: ListItem,
};

const Name2Avatar = ListItem.Name2Avatar;

export const Example = () => <DocsWrapper>
  <ListItem
    isCard
    style={{margin: 12}}
    title="Morten Hansen"
    avatar={<Name2Avatar first="Morten" last="Hansen"/>} 
    description="Chief Collection Manager">
    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
  </ListItem>
  <ListItem 
    isCard
    style={{margin: 12}}
    title="Gerard Thijsse"
    avatar={<Name2Avatar first="大" last="大" style={{background: 'tomato'}}/>} 
    description="Chief Collection Manager"
    footerActions={[
      <a href="mailto:gthijsse@example.com"><MdMail />gthijsse@example.com</a>
    ]}>
  </ListItem>
  <ListItem 
    style={{margin: 12}}
    title="Gerard Thijsse"
    avatar={<Name2Avatar first="Gerard" last="Thijsse"/>} 
    description="Chief Collection Manager"
    footerActions={[
      <Orcid href="https://orcid.org/0000-0003-0961-9152"/>,
      <a href="mailto:gthijsse@example.com"><MdMail />gthijsse@example.com</a>,
    ]}>
  </ListItem>
  <StyledProse source={readme}></StyledProse>
</DocsWrapper>;

Example.story = {
  name: 'ListItem',
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
// {text('Text', 'ListItem text')}