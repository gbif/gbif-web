/* there are various versions of the config in circulation. 
They should be changed at source, but to ease deployment, we will attempt to remap them here.
And to make it even easier we will log the corrected version to the console. 
That should make it easy to copy it to the source file for the user.
*/

import { Config } from '@/config/config';

export function configAdapter(config: object): Partial<Config> {
  if (config?.version === 3) {
    return config as Partial<Config>;
  } else {
    return convertedConfig(config);
  }
}

function convertedConfig(config: object): Partial<Config> {
  let pages;
  if (config?.routes?.enabledRoutes) {
    pages = config?.routes?.enabledRoutes.map((route: string) => {
      return { id: route };
    });
  }
  const newConfig: Partial<Config> = {
    version: 3,
    pages: pages,
    disableInlineTableFilterButtons: config?.disableInlineTableFilterButtons ?? false,
    theme: config?.theme,
    maps: {
      locale: config?.maps?.locale,
      mapStyles: {
        defaultProjection: config?.maps?.defaultProjection,
        defaultMapStyle: config?.maps?.defaultMapStyle,
        options: config?.maps?.mapStyles,
      },
      addMapStyles: config?.maps?.addMapStyles,
      styleLookup: config?.maps?.styleLookup,
    },
    languages: config.languages,
    occurrenceSearch: {
      scope: config?.occurrence?.rootPredicate,
      highlightedFilters: config?.occurrence?.highlightedFilters,
      excludedFilters: config?.occurrence?.excludedFilters,
      defaultEnabledTableColumns: config?.occurrence?.defaultTableColumns,
      // lowercase tab names
      tabs: config?.occurrence?.occurrenceSearchTabs?.map((tab: string) => tab.toLowerCase()),
    },
    collectionSearch: {
      scope: config?.collection?.rootFilter,
      highlightedFilters: config?.collection?.highlightedFilters,
      excludedFilters: config?.collection?.excludedFilters,
      defaultEnabledTableColumns: config?.collection?.defaultTableColumns,
    },
    institutionSearch: {
      scope: config?.institution?.rootFilter,
      highlightedFilters: config?.institution?.highlightedFilters,
      excludedFilters: config?.institution?.excludedFilters,
      defaultEnabledTableColumns: config?.institution?.defaultTableColumns,
    },
    datasetSearch: {
      scope: config?.dataset?.rootFilter,
      highlightedFilters: config?.dataset?.highlightedFilters,
      excludedFilters: config?.dataset?.excludedFilters,
      defaultEnabledTableColumns: config?.dataset?.defaultTableColumns,
    },
    publisherSearch: {
      scope: config?.publisher?.rootFilter,
      highlightedFilters: config?.publisher?.highlightedFilters,
      excludedFilters: config?.publisher?.excludedFilters,
      defaultEnabledTableColumns: config?.publisher?.defaultTableColumns,
    },
  };
  console.log('Converted config to version 3:');
  console.log(newConfig);
  return newConfig as Config;
}
