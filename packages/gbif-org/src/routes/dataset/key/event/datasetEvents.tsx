import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { EventSearchInner } from '@/routes/events/search/eventSearchPage';
import { searchConfig } from '@/routes/events/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useState } from 'react';
import { useDatasetKeyContext } from '../datasetKey';
import EventList from './eventList';
import { Alert } from '@/components/ui/alert';
import EmptyTab from '@/components/EmptyTab';

const DatasetEvents = () => {
  const { showEventsTab } = useDatasetKeyContext();
  if (showEventsTab) return <NoneEmptyTab />;
  return <EmptyTab />;
};

const NoneEmptyTab = () => {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const { datasetKey, datasetType } = useDatasetKeyContext();

  useEffect(() => {
    const c = {
      ...baseConfig.eventSearch,
      scope: {
        datasetKey,
      },
    };
    setConfig(c);
  }, [baseConfig, datasetKey]);

  if (
    datasetType === 'SAMPLING_EVENT' &&
    import.meta.env.PUBLIC_ENABLE_SAMPLING_EVENT_BROWSER === 'enabled' &&
    baseConfig.experimentalFeatures?.eventCoreEnabled
  ) {
    // If the dataset is of type sampling event, then show the event search with a dataset filter
    return (
      <ArticleContainer className="g-bg-slate-100">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ExperimentalAlert />
          {config && (
            <SearchContextProvider searchContext={config}>
              <FilterProvider filter={filter} onChange={setFilter}>
                <EventSearchInner />
              </FilterProvider>
            </SearchContextProvider>
          )}
        </ArticleTextContainer>
      </ArticleContainer>
    );
  }

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <EventList datasetKey={datasetKey} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
};

export default DatasetEvents;

export function ExperimentalAlert() {
  const baseConfig = useConfig();
  if (!baseConfig.experimentalFeatures?.eventCoreEnabled) {
    return null;
  }
  return (
    <Alert variant="info" className="g-mb-4">
      This is an experimental feature under active development.
    </Alert>
  );
}
