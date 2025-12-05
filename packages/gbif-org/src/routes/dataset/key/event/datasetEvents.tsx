import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { DatasetQuery } from '@/gql/graphql';
import { EventSearchInner } from '@/routes/events/search/eventSearchPage';
import { searchConfig } from '@/routes/events/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { DatasetKeyContext } from '../datasetKey';
import EventList from './eventList';

const DatasetEvents = () => {
  const { data } = useLoaderData() as { data: DatasetQuery };
  const {
    dataset: { key, type },
  } = data;

  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const { datasetKey } = useContext(DatasetKeyContext);

  useEffect(() => {
    if (!datasetKey) return;

    const c = {
      ...baseConfig.eventSearch,
      scope: {
        type: 'equals',
        key: 'datasetKey',
        value: datasetKey,
      },
    };
    setConfig(c);
  }, [baseConfig, datasetKey]);

  if (
    type === 'SAMPLING_EVENT' &&
    import.meta.env.PUBLIC_ENABLE_SAMPLING_EVENT_BROWSER === 'enabled'
  ) {
    // If the dataset is of type sampling event, then show the event search with a dataset filter
    return (
      <ArticleContainer className="g-bg-slate-100">
        <ArticleTextContainer className="g-max-w-screen-xl">
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
        <EventList datasetKey={key} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
};

export default DatasetEvents;
