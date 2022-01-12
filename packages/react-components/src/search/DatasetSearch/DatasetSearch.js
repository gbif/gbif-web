import React from 'react';
import Table from './views/Table';
import predicateConfig from './config/predicateConfig';
import defaultFilterConfig from './config/filterConf';
import { default as StandardSearch } from '../Search';

function Search(props) {
  return <StandardSearch {...{ ...props, predicateConfig, defaultFilterConfig, Table }} />
}

export default Search;


// // this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement

// import { jsx } from '@emotion/react';
// import React, { useState, useContext } from 'react';
// import { useIntl } from 'react-intl';
// import PropTypes from 'prop-types';
// import Layout from '../StandardSearchLayout';
// import { FilterState } from "../../widgets/Filter/state";
// import { Root } from "../../components";
// import DatasetContext from '../SearchContext';
// import { ApiContext } from '../../dataManagement/api';
// import { commonLabels, config2labels } from '../../utils/labelMaker';
// import { getCommonSuggests, suggestStyle } from '../../utils/suggestConfig/getCommonSuggests';
// import { commonFilters, filterBuilder } from '../../utils/filterBuilder';
// import predicateConfig from './config/predicateConfig';
// import ThemeContext from '../../style/themes/ThemeContext';
// import Table from './views/Table';
// import defaultFilterConfig from './config/filterConf';
// import pick from 'lodash/pick';
// import pickBy from 'lodash/pickBy';
// import without from 'lodash/without';
// import { useUrlState } from '../../dataManagement/state/useUrlState';

// function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig, customConfig }, context) {
//   const { labels = {}, getSuggests = () => ({}), filters: customFilters = {}, adapters = {} } = customConfig;
//   const mergedLabels = { ...labelConfig, ...labels };
//   const mergedFilters = { ...filterWidgetConfig, ...customFilters };
//   const suggestConfigMap = getSuggestConfig({ context, suggestStyle });
//   const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
//   const mergedSuggest = { ...suggestConfigMap, ...suggestConfigMapCustom };
//   const labelMap = config2labels(mergedLabels, context.client);
//   const filters = filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context })
  
//   const includedFilters = without((customConfig.includedFilters || defaultFilterConfig.included), ...(customConfig.excludedFilters || []));
//   const highlightedFilters = customConfig.highlightedFilters || defaultFilterConfig.highlighted;
  
//   return {
//     labelMap,
//     suggestConfigMap,
//     filters: pickBy(pick(filters, includedFilters), e => !!e),
//     defaultVisibleFilters: highlightedFilters,
//     rootPredicate: customConfig.rootPredicate,
//     predicateConfig
//   }
// }

// function DatasetSearch({ config: customConfig = {}, ...props }) {
//   const theme = useContext(ThemeContext);
//   // const [filter, setFilter] = useState();
//   const [filter, setFilter] = useUrlState({param: 'filter', base64encode: true});
//   const apiContext = useContext(ApiContext);
//   const { formatMessage } = useIntl();
//   const [config] = useState(() => {
//     return buildConfig({
//       labelConfig: commonLabels,
//       getSuggestConfig: getCommonSuggests,
//       filterWidgetConfig: commonFilters,
//       customConfig
//     }, { client: apiContext, formatMessage });
//   });
  
//   return (
//     <Root dir={theme.dir}>
//       <DatasetContext.Provider value={config}>
//         <FilterState filter={filter} onChange={setFilter}>
//           <Layout pageLayout config={config} Table={Table} {...props}></Layout>
//         </FilterState>
//       </DatasetContext.Provider>
//     </Root>
//   );
// }


// export default DatasetSearch;