// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement

import { commonLabels as labelConfig, config2labels } from '../utils/labelMaker';
import { getCommonSuggests as getSuggestConfig, suggestStyle } from '../utils/suggestConfig/getCommonSuggests';
import { commonFilters as filterWidgetConfig, filterBuilder } from '../utils/filterBuilder';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import without from 'lodash/without';
import intersection from 'lodash/intersection';
import merge from 'lodash/merge';

export function buildConfig({ customConfig, predicateConfig, defaultFilterConfig }, context) {
  const { labels = {}, getSuggests = () => ({}), filters: customFilters = {}, adapters = {} } = customConfig;
  const mergedLabels = { ...labelConfig, ...labels };
  const mergedFilters = { ...filterWidgetConfig, ...customFilters };
  // for each of the custom filters, check if there is a merge: true flag. If so, merge the individual configs with the default ones
  Object.keys(customFilters).forEach(key => {
    if (customFilters[key].merge) {
      mergedFilters[key] = merge(filterWidgetConfig[key], customFilters[key]);
    }
  });
  const suggestConfigMap = getSuggestConfig({ context, suggestStyle, rootPredicate: customConfig.rootPredicate });
  const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
  const mergedSuggest = merge(suggestConfigMap, suggestConfigMapCustom);
  const labelMap = config2labels(mergedLabels, context.client, context.localeSettings);
  const filters = filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context });
  
  const includedFilters = without([...(customConfig.includedFilters || defaultFilterConfig.included), ...(customConfig?.additionalFilters || [])], ...(customConfig.excludedFilters || []));
  const highlightedFilters = customConfig.highlightedFilters || defaultFilterConfig.highlighted;
  const initialVisibleFilters = intersection(highlightedFilters, includedFilters);

  return {
    labelMap,
    suggestConfigMap,
    filters: pickBy(pick(filters, includedFilters), e => !!e),
    defaultVisibleFilters: initialVisibleFilters,
    rootPredicate: customConfig.rootFilter || customConfig.rootPredicate,
    availableCatalogues: customConfig.availableCatalogues,
    queryConfig: customConfig.queries,
    sidebarConfig: customConfig.sidebar,
    tableConfig: customConfig.tableConfig,
    predicateConfig,
    defaultTableColumns: customConfig.defaultTableColumns,
    more: customConfig
  }
}