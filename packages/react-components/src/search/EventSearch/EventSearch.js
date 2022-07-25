import React from 'react';
import List from './views/List';
import Table from './views/Table';
import Sites from './views/Sites';
import Map from './views/Map';
import Download from './views/Download';
import predicateConfig from './config/predicateConfig';
import defaultFilterConfig from './config/filterConf';
import { default as StandardSearch } from '../Search';
import EventLayout from './EventSearchPageLayout';
import { AuthProvider } from "react-oidc-context";
import env from '../../../.env.json';

const oidcConfig = {
  authority: env.OIDC_AUTHORITY,
  client_id: env.OIDC_CLIENT_ID,
  redirect_uri: env.OIDC_REDIRECT_URI,
  client_secret: env.OIDC_CLIENT_SECRET,
  onSigninCallback: (user) => {
    console.log(user);
    window.history.replaceState({path: '/'}, '', '/');
  }
};

function Search(props) {
  return <AuthProvider {...oidcConfig}>
     <StandardSearch {...{ ...props, predicateConfig, defaultFilterConfig, List, Table, Sites, Map, Download }} layout={EventLayout} />
  </AuthProvider>
}

export default Search;