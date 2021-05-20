// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement

import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Layout from '../StandardSearchLayout';
import { FilterState } from "../../widgets/Filter/state";
import { Root } from "../../components";
import SearchContext from '../SearchContext';
import { ApiContext } from '../../dataManagement/api';
import { commonLabels, config2labels } from '../../utils/labelMaker';
import { getCommonSuggests, suggestStyle } from '../../utils/suggestConfig/getCommonSuggests';
import { commonFilters, filterBuilder } from '../../utils/filterBuilder';
import predicateConfig from './config/predicateConfig';
import ThemeContext from '../../style/themes/ThemeContext';
import merge from 'lodash/merge';
import Table from './views/Table';

function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig, customConfig }, context) {
  const { labels = {}, getSuggests = () => ({}), filters: customFilters = {}, adapters = {} } = customConfig;
  const mergedLabels = { ...labelConfig, ...labels };
  const mergedFilters = { 
    country: merge(filterWidgetConfig.country, {config: {singleSelect: true}}),
    q: filterWidgetConfig.q, 
  };
  const suggestConfigMap = getSuggestConfig({ context, suggestStyle });
  const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
  const mergedSuggest = { ...suggestConfigMap, ...suggestConfigMapCustom };
  const labelMap = config2labels(mergedLabels, context.client);
  const filters = {
    ...filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context })
  };
  
  return {
    labelMap,
    suggestConfigMap,
    filters: filters,
    defaultVisibleFilters: ['q', 'country'],
    rootPredicate: {  },
    predicateConfig
  }
}

function PublisherSearch({ config: customConfig = {}, ...props }) {
  const theme = useContext(ThemeContext);
  const [filter, setFilter] = useState();
  const apiContext = useContext(ApiContext);
  const { formatMessage } = useIntl();
  const [config] = useState(() => {
    return buildConfig({
      labelConfig: commonLabels,
      getSuggestConfig: getCommonSuggests,
      filterWidgetConfig: commonFilters,
      customConfig
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


export default PublisherSearch;