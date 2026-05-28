import { Alert } from '@/components/ui/alert';
import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { EventSearchInner } from '@/routes/event/search/eventSearchPage';
import { searchConfig } from '@/routes/event/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useState } from 'react';
import { useDatasetKeyContext } from '../../datasetKey';
import InferredEventList from '../inferredFromOccurrence/inferredEventList';

/**
 * Event list for datasets of type SAMPLING_EVENT.
 *
 * When the new event browser feature is enabled it uses the event search API
 * (full filtering & tabular view). When the feature is disabled (env or
 * config flag off) it falls back to the same occurrence-derived table the
 * inferred view uses — without the inferred-events notice, since the dataset
 * IS a real sampling event dataset.
 */
export default function SamplingEventDatasetEvents() {
  const baseConfig = useConfig();
  const { datasetKey } = useDatasetKeyContext();

  const samplingEventBrowserEnabled =
    import.meta.env.PUBLIC_ENABLE_SAMPLING_EVENT_BROWSER === 'enabled' &&
    baseConfig.experimentalFeatures?.eventCoreEnabled;

  if (samplingEventBrowserEnabled) {
    return <SamplingEventBrowser />;
  }

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <InferredEventList datasetKey={datasetKey} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

function SamplingEventBrowser() {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const { datasetKey } = useDatasetKeyContext();

  useEffect(() => {
    const c = {
      ...baseConfig.eventSearch,
      scope: {
        datasetKey,
      },
    };
    setConfig(c);
  }, [baseConfig, datasetKey]);

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <SamplingEventExperimentalAlert />
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

export function SamplingEventExperimentalAlert() {
  const baseConfig = useConfig();
  if (!baseConfig.experimentalFeatures?.eventCoreEnabled) {
    return null;
  }
  return (
    <Alert variant="warning" className="g-mb-4">
      This is an experimental feature under active development.
    </Alert>
  );
}
