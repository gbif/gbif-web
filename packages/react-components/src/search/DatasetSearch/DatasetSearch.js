// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement

import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Layout from '../StandardSearchLayout';
import { FilterState } from "../../widgets/Filter/state";
import { Root } from "../../components";
import DatasetContext from '../SearchContext';
import { ApiContext } from '../../dataManagement/api';
import { commonLabels, config2labels } from '../../utils/labelMaker';
import { getCommonSuggests, suggestStyle } from '../../utils/suggestConfig/getCommonSuggests';
import { commonFilters, filterBuilder } from '../../utils/filterBuilder';
import predicateConfig from './config/predicateConfig';
import ThemeContext from '../../style/themes/ThemeContext';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import Table from './views/Table';

// import { datasetFilters } from './config/datasetFilters';
const defaultAvailableFilters = ['publisherKey', 'hostKey', 'publishingCountryCode', 'datasetType', 'datasetSubtype', 'q'];

function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig, customConfig }, context) {
  const { labels = {}, getSuggests = () => ({}), filters: customFilters = {}, adapters = {} } = customConfig;
  const mergedLabels = { ...labelConfig, ...labels };
  const mergedFilters = { ...filterWidgetConfig, ...customFilters };
  const suggestConfigMap = getSuggestConfig({ context, suggestStyle });
  const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
  const mergedSuggest = { ...suggestConfigMap, ...suggestConfigMapCustom };
  const labelMap = config2labels(mergedLabels, context.client);
  const filters = {
    ...filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context }),
    // ...datasetFilters
  };
  
  return {
    labelMap,
    suggestConfigMap,
    filters: pickBy(pick(filters, defaultAvailableFilters), e => !!e),
    defaultVisibleFilters: ['q', 'publisherKey', 'datasetType'],
    rootPredicate: { type: ['CHECKLIST'] },
    predicateConfig
  }
}

function DatasetSearch({ config: customConfig = {}, ...props }) {
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
      <DatasetContext.Provider value={config}>
        <FilterState filter={filter} onChange={setFilter}>
          <Layout config={config} Table={Table} {...props}></Layout>
        </FilterState>
      </DatasetContext.Provider>
    </Root>
  );
}


export default DatasetSearch;