import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Message } from './Message';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/Message',
  component: Message,
};

export const Example = () => <DocsWrapper>
  <StyledProse source={readme}></StyledProse>
  <div style={{padding: 12, border: '1px solid pink', margin: 12}}>
    <Message id="some.id" defaultMessage='Standard react-intl FormattedMessage'/>
  </div>
  <div style={{padding: 12, border: '1px solid pink', margin: 12}}>
    <Message id="some.id" defaultMessage='Standard react-intl FormattedMessage with {VAR}' values={{VAR: 4}} />
  </div>
  <div style={{padding: 12, border: '1px solid pink', margin: 12}}>
    <Message id="some.id2" allowNewLines defaultMessage="some{br}new{br}line"/>
  </div>
  <div style={{padding: 12, border: '1px solid pink', margin: 12}}>
    <Message id="some.id3" allowedTags={['i', 'h2']} defaultMessage='<i>Italics</i> no more, but <h2 style="color: red;">headline</h2>'/>
  </div>
  <div style={{padding: 12, border: '1px solid pink', margin: 12}}>
    <Message id="some.id3" isHTML defaultMessage='<i onclick="alert(123);">Italics</i> no <br /><input /> more, but <h2 style="color: red;">headline</h2> ans has onclick event'/>
  </div>
  <div style={{padding: 12, border: '1px solid pink', margin: 12}}>
    <Message id="some.id3" allowedTags={['i', 'h2']} allowedAttr={['style']} defaultMessage='<i style="color: red;" onclick="alert(123);">Italics</i> no <br /><input /> more, but <h2>headline</h2>'/>
  </div>
</DocsWrapper>;

Example.story = {
  name: 'Message',
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
// {text('Text', 'Eyebrow text')}