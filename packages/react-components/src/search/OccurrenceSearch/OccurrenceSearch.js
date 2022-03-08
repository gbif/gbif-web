// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement

import { jsx } from '@emotion/react';
import React, { useState, useMemo, useContext } from 'react';
import { useIntl, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import ComponentLayout from './Layout';
import PageLayout from './PageLayout';
import { FilterState } from "../../widgets/Filter/state";
import { Root } from "../../components";
import OccurrenceContext from '../SearchContext';
import LocaleContext from '../../dataManagement/LocaleProvider/LocaleContext';
import { ApiContext } from '../../dataManagement/api';
import { commonLabels, config2labels } from '../../utils/labelMaker';
import { getCommonSuggests, suggestStyle } from '../../utils/suggestConfig/getCommonSuggests';
import { commonFilters, filterBuilder } from '../../utils/filterBuilder';
import predicateConfig from './config/predicateConfig';
import ThemeContext from '../../style/themes/ThemeContext';
import Base64JsonParam from '../../dataManagement/state/base64JsonParam';
import { useFilterParams } from '../../dataManagement/state/useFilterParams';
import { useQueryParam, JsonParam } from 'use-query-params';
import defaultFilterConfig from './config/filterConf';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import without from 'lodash/without';
import { tableConfig } from './config/tableConfig';

function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig, customConfig }, context) {
  const {
    labels = {},
    getSuggests = () => ({}),
    filters: customFilters = {},
    adapters = {} } = customConfig;
  const mergedLabels = { ...labelConfig, ...labels };
  const mergedFilters = { ...filterWidgetConfig, ...customFilters };
  const suggestConfigMap = getSuggestConfig({ context, suggestStyle, rootPredicate: customConfig.rootPredicate });
  const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
  const mergedSuggest = { ...suggestConfigMap, ...suggestConfigMapCustom };
  const labelMap = config2labels(mergedLabels, context.client, context.localeSettings);
  const filters = filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context });

  const includedFilters = without((customConfig.includedFilters || defaultFilterConfig.included), ...(customConfig.excludedFilters || []));
  const highlightedFilters = customConfig.highlightedFilters || defaultFilterConfig.highlighted;

  return {
    labelMap,
    suggestConfigMap,
    filters: pickBy(pick(filters, includedFilters), e => !!e),
    defaultVisibleFilters: highlightedFilters,
    // rootPredicate: { type: 'in', key: 'basisOfRecord', values: ['PRESERVED_SPECIMEN', 'FOSSIL_SPECIMEN', 'MATERIAL_SAMPLE', 'LIVING_SPECIMEN'] },
    rootPredicate: customConfig.rootPredicate,//{ type: 'isNotNull', key: 'typeStatus' },
    // rootPredicate: { type: 'in', key: 'taxonKey', values: [4, 5, 7] },
    // rootPredicate: { type: 'equals', key: 'taxonKey', value: 44 },
    // rootPredicate: { type: 'and', predicates: [
    //   {type: 'equals', key: 'taxonKey', value: 44},
    //   {type: 'not', predicate: {type: 'equals', key: 'taxonKey', value: 212}}
    // ] },
    predicateConfig,
    availableCatalogues: customConfig.availableCatalogues,
    tableConfig,
    defaultTableColumns: customConfig.defaultTableColumns,
    more: customConfig
  }
}

function OccurrenceSearch({ config: customConfig = {}, pageLayout, ...props }) {
  const theme = useContext(ThemeContext);
  const localeSettings = useContext(LocaleContext);
  // const [filter, setFilter] = useState();//useUrlState({param: 'filter', base64encode: true});
  // const [filter, setFilter] = useState({ must: { taxonKey: [2609958] } });

  // const [filter, setFilter] = useQueryParam('filter', Base64JsonParam);
  const [filter, setFilter] = useFilterParams({predicateConfig});

  const Layout = pageLayout ? PageLayout : ComponentLayout;
  // let filter = { must: { taxonKey: [2609958] } };
  // const setFilter = () => {};

  const apiContext = useContext(ApiContext);
  const intl = useIntl();
  const enrichedConfig = useMemo(() => {
    return buildConfig({
      labelConfig: commonLabels,
      getSuggestConfig: getCommonSuggests,
      filterWidgetConfig: commonFilters,
      customConfig
    }, { client: apiContext, formatMessage: intl.formatMessage, localeSettings });
  }, [apiContext, intl, localeSettings]);

  //   console.log(`%c 
  //  ,_,
  // (O,O)
  // (   )  Powered by GBIF
  // -"-"-

  // All GBIF mediated data is freely available through our APIs. 
  // https://www.gbif.org/developer/summary

  // All GBIF source code is open source.
  // https://github.com/gbif

  // If your interest is the rendered HTML, then you might be developing a plugin. Let us know if you need custom markup, we would love to know what you are building.
  // helpdesk@gbif.org
  // `, 'color: green; font-weight: bold;');

  // const esQuery = compose(filter).build();

  // it is already wrapped in locale provider and an rtl provider and a theme provider.
  // add an api context, a prefilter and configuration of custom filters
  // the API context caries information about endpoints
  return (
    <Root dir={theme.dir}>
      <OccurrenceContext.Provider value={enrichedConfig}>
        <FilterState filter={filter || {}} onChange={setFilter}>
          <Layout config={enrichedConfig} {...props} tabs={customConfig.occurrenceSearchTabs}></Layout>
        </FilterState>
      </OccurrenceContext.Provider>
    </Root>
  );
}

export default OccurrenceSearch;
