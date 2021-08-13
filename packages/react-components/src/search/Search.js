// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
import React, { useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import Layout from './StandardSearchLayout';
import { FilterState } from "../widgets/Filter/state";
import { Root } from "../components";
import SearchContext from './SearchContext';
import { ApiContext } from '../dataManagement/api';
import ThemeContext from '../style/themes/ThemeContext';
import { buildConfig } from './buildSearchConfig';

function Search({ config: customConfig = {}, predicateConfig, defaultFilterConfig, Table, ...props },) {
  const theme = useContext(ThemeContext);
  const [filter, setFilter] = useState();
  const apiContext = useContext(ApiContext);
  const { formatMessage } = useIntl();
  const [config] = useState(() => {
    return buildConfig({
      customConfig,
      predicateConfig,
      defaultFilterConfig
    }, { client: apiContext, formatMessage });
  });
  
  return (
    <Root dir={theme.dir}>
      <SearchContext.Provider value={config}>
        <FilterState filter={filter} onChange={setFilter}>
          <Layout config={config} Table={Table} {...props}></Layout>
        </FilterState>
      </SearchContext.Provider>
    </Root>
  );
}

export default Search;