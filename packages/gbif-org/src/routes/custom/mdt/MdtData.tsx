import { MdtDatasetsQuery, MdtDatasetsQueryVariables } from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleIntro } from '@/routes/resource/key/components/articleIntro';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { createContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdtOccurrences } from './MdtOccurrences';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, Homepage } from '@/components/highlights';
import { Tabs } from '@/components/tabs';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MdLink } from 'react-icons/md';

const MDT_DATASETS = /* GraphQL */ `
  query MdtDatasets($predicate: Predicate) {
    installationSearch(type: "MDT_INSTALLATION", limit: 1000) {
      count
      limit
      results {
        key
        title
        description
        endpoints {
          url
          type
        }
        dataset(limit: 1000) {
          count
          results {
            title
            key
            occurrenceCount
          }
        }
      }
    }
    datasetSearchByPredicate(predicate: $predicate, size: 100, from: 0) {
      total
      results {
        key
        publishingOrganization {
          title
          key
        }
        occurrenceCount
      }
    }
  }
`;
export const MdtDataContext = createContext<{
  datasetKeys: string[];
  data: MdtDatasetsQuery | undefined;
}>({ datasetKeys: [], data: undefined });

const MdtData = () => {
  const { data, load, loading } = useQuery<MdtDatasetsQuery, MdtDatasetsQueryVariables>(
    MDT_DATASETS,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );

  const [datasetKeys, setDatasetKeys] = useState<string[]>([]);
  useEffect(() => {
    load({
      variables: {
        predicate: {
          type: 'or',
          predicates: [
            {
              type: 'in',
              key: 'key',
              values: [
                'b25f8b06-feca-4cdd-84a7-f69ecb7410f5',
                '39e50259-23e1-41e8-b885-2176d4e98854',
                'a77265a0-2ae0-4c84-84dd-fadb11e152be',
              ],
            },
            { type: 'like', key: 'q', value: 'converter' },
          ],
        },
      },
    });
  }, [load]);

  useEffect(() => {
    if (data) {
      const installationDatasetKeys = data.installationSearch?.results
        ?.flatMap((inst) => inst?.dataset?.results.map((ds) => ds?.key) || [])
        .filter((key): key is string => !!key);
      const datasetKeysFromPredicateSearch = data.datasetSearchByPredicate?.results
        .map((ds) => ds?.key)
        .filter((key): key is string => !!key);
      const allDatasetKeys = Array.from(
        new Set([...(installationDatasetKeys || []), ...(datasetKeysFromPredicateSearch || [])])
      );
      setDatasetKeys(allDatasetKeys);
    }
  }, [data]);

  const tabs = [
    {
      to: 'occurrences',
      children: <FormattedMessage id="dataset.tabs.occurrences" defaultMessage="Occurrences" />,
    },
    {
      to: 'installations',
      children: <FormattedMessage id="publisher.installations" defaultMessage="Installations" />,
    },
    {
      id: 'metabarcoding',
      to: '/metabarcoding',
      children: (
        <span>
          Metabarcoding data programme <MdLink />
        </span>
      ),
    },
  ];
  return (
    <article>
      <Helmet>
        <title>Metabarcoding Data Toolkit</title>
      </Helmet>

      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className=" g-max-w-screen-xl">
          <ArticleTitle>Metabarcoding Data Toolkit</ArticleTitle>
          <ArticlePreTitle>Data and Installations</ArticlePreTitle>

          <div className="g-border-b g-mt-4"></div>
          <Tabs links={tabs} />
        </ArticleTextContainer>
      </PageContainer>
      <MdtDataContext.Provider value={{ data, datasetKeys }}>
        <ErrorBoundary type="PAGE">
          <Outlet />
        </ErrorBoundary>
      </MdtDataContext.Provider>
    </article>
  );
};

export default MdtData;
