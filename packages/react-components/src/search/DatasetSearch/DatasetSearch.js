// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext } from 'react';
import { useIntl, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import Layout from './Layout';
import { FilterState } from "../../widgets/Filter/state";
import { Root } from "../../components";
import DatasetContext from './config/DatasetContext';
import { ApiContext } from '../../dataManagement/api';
import { commonLabels, config2labels } from '../../utils/labelMaker';
import { getCommonSuggests, suggestStyle } from '../../utils/suggestConfig/getCommonSuggests';
import { commonFilters, filterBuilder } from '../../utils/filterBuilder';
import predicateConfig from './config/predicateConfig';
import ThemeContext from '../../style/themes/ThemeContext';
// import history from './history';
// import qs from 'querystringify';


function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig, customConfig }, context) {
  const { labels = {}, getSuggests = () => ({}), filters: customFilters = {}, adapters = {} } = customConfig;
  const mergedLabels = { ...labelConfig, ...labels };
  const mergedFilters = { ...filterWidgetConfig, ...customFilters };
  const suggestConfigMap = getSuggestConfig({ context, suggestStyle });
  const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
  const mergedSuggest = { ...suggestConfigMap, ...suggestConfigMapCustom };
  const labelMap = config2labels(mergedLabels, context.client);
  const filters = filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context });
  
  return {
    labelMap,
    suggestConfigMap,
    filters,
    defaultVisibleFilters: ['publisherKey', 'hostKey', 'countryCode'],
    rootPredicate: { type: 'in', key: 'taxonKey', values: [4, 5, 7] },
    predicateConfig
  }
}

function DatasetSearch({ config: customConfig = {}, ...props }) {
  const theme = useContext(ThemeContext);
  const [filter, setFilter] = useState({ must: { taxonKey: [2609958] } });
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

  console.log(config);
  
  return (
    <Root dir={theme.dir}>
      <DatasetContext.Provider value={config}>
        <FilterState filter={filter} onChange={setFilter}>
          <Layout config={config} {...props}></Layout>
        </FilterState>
      </DatasetContext.Provider>
    </Root>
  );
}


export default DatasetSearch;