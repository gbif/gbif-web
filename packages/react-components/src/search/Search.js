// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
import React, { useMemo, useContext, useCallback, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import ComponentLayout from './StandardSearchLayout';
import PageLayout from './StandardSearchPageLayout';
import { FilterState } from "../widgets/Filter/state";
import { Root } from "../components";
import SearchContext from './SearchContext';
import { ApiContext } from '../dataManagement/api';
import LocaleContext from '../dataManagement/LocaleProvider/LocaleContext';
import ThemeContext from '../style/themes/ThemeContext';
import { buildConfig } from './buildSearchConfig';
import { useFilterParams } from '../dataManagement/state/useFilterParams';

// import { useQueryParams, StringParam, ArrayParam } from 'use-query-params';
// import { filter2v1 } from '../dataManagement/filterAdapter';

function Search({ config: customConfig = {}, predicateConfig, defaultFilterConfig, Table, pageLayout, ...props },) {
  const theme = useContext(ThemeContext);
  const localeSettings = useContext(LocaleContext);
  const [filter, setFilter, updateParams] = useFilterParams({predicateConfig});

  const apiContext = useContext(ApiContext);
  const intl = useIntl();
  const config = useMemo(() => {
    return buildConfig({
      customConfig,
      predicateConfig,
      defaultFilterConfig
    }, { client: apiContext, formatMessage: intl.formatMessage, localeSettings });
  }, [apiContext, intl]);
  
  const Layout = pageLayout ? PageLayout : ComponentLayout;

  return (
    <Root dir={theme.dir}>
      <SearchContext.Provider value={config}>
        <FilterState filter={filter} onChange={setFilter}>
          <Layout config={config} Table={Table} {...props} ></Layout>
        </FilterState>
      </SearchContext.Provider>
    </Root>
  );
}

export default Search;