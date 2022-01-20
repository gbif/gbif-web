// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement

import { commonLabels as labelConfig, config2labels } from '../utils/labelMaker';
import { getCommonSuggests as getSuggestConfig, suggestStyle } from '../utils/suggestConfig/getCommonSuggests';
import { commonFilters as filterWidgetConfig, filterBuilder } from '../utils/filterBuilder';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import without from 'lodash/without';
import intersection from 'lodash/intersection';

export function buildConfig({ customConfig, predicateConfig, defaultFilterConfig }, context) {
  const { labels = {}, getSuggests = () => ({}), filters: customFilters = {}, adapters = {} } = customConfig;
  const mergedLabels = { ...labelConfig, ...labels };
  const mergedFilters = { ...filterWidgetConfig, ...customFilters };
  const suggestConfigMap = getSuggestConfig({ context, suggestStyle });
  const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
  const mergedSuggest = { ...suggestConfigMap, ...suggestConfigMapCustom };
  const labelMap = config2labels(mergedLabels, context.client, context.localeSettings);
  const filters = filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context });
  
  const includedFilters = without((customConfig.includedFilters || defaultFilterConfig.included), ...(customConfig.excludedFilters || []));
  const highlightedFilters = customConfig.highlightedFilters || defaultFilterConfig.highlighted;
  const initialVisibleFilters = intersection(highlightedFilters, includedFilters);

  return {
    labelMap,
    suggestConfigMap,
    filters: pickBy(pick(filters, includedFilters), e => !!e),
    defaultVisibleFilters: initialVisibleFilters,
    rootPredicate: customConfig.rootFilter,
    availableCatalogues: customConfig.availableCatalogues,
    predicateConfig
  }
}