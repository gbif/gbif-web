import React from 'react';
import { render } from 'react-dom';
import { createApp } from './createApp';
import { BrowserDataContext } from 'gbif-react-components';

const { App, props } = createApp();

const __APP_INITIAL_STATE__ = window.__APP_INITIAL_STATE__;

delete window.__APP_INITIAL_STATE__;

render(
  <BrowserDataContext initialData={__APP_INITIAL_STATE__}>
    <App {...props} />
  </BrowserDataContext>,
  document.getElementById('root')
);
