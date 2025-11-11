import React from 'react';
import Table from './views/Table';
import predicateConfig from './config/predicateConfig';
import defaultFilterConfig from './config/filterConf';
import { default as StandardSearch } from '../Search';

function Search(props) {
  return <StandardSearch {...{ ...props, predicateConfig, defaultFilterConfig, Table }} />
}

export default Search;
