import { DataHeader } from '@/components/dataHeader';
import {
  defaultDateFormatProps,
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
} from '@/components/headerComponents';
import {
  CitationIcon,
  FeatureList,
  GenericFeature,
  Homepage,
  OccurrenceIcon,
} from '@/components/highlights';
import { Tabs } from '@/components/tabs';
import { NetworkQuery, NetworkQueryVariables, PredicateType } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

const NETWORK_QUERY = /* GraphQL */ `
  query Network($key: ID!, $predicate: Predicate) {
    network(key: $key) {
      key
      title
      deleted
      created
      homepage
      prose {
        ...NetworkAboutTab
      }
      numConstituents
    }
    occurrenceSearch(predicate: $predicate) {
      documents(size: 0) {
        total
      }
    }
    literatureSearch(gbifNetworkKey: [$key]) {
      documents {
        total
      }
    }
  }
`;

export async function networkLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<NetworkQuery, NetworkQueryVariables>(NETWORK_QUERY, {
    key,
    predicate: { type: PredicateType.Equals, key: 'networkKey', value: key },
  });
}

export function NetworkPage() {
  const { data } = useLoaderData() as { data: NetworkQuery };

  if (data.network == null) throw new Error('404');
  const { network, occurrenceSearch, literatureSearch } = data;

  const deletedAt = network.deleted;
  const title = network?.prose?.title ?? network.title ?? 'No title provided';
  const homepage = network?.prose?.primaryLink?.url ?? network?.homepage?.[0];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={network?.key?.toString()} />}
      ></DataHeader>
      <article>
        <PageContainer topPadded className="g-bg-white">
          <ArticleTextContainer>
            <ArticlePreTitle
              secondary={
                <FormattedMessage
                  id="dataset.registeredDate"
                  values={{
                    DATE: (
                      <FormattedDate
                        value={network.created ?? undefined}
                        {...defaultDateFormatProps}
                      />
                    ),
                  }}
                />
              }
            >
              <FormattedMessage id={`network.network`} />
            </ArticlePreTitle>
            {/* it would be nice to know for sure which fields to expect */}
            <ArticleTitle testId="network-heading" dangerouslySetTitle={{ __html: title }} />

            {deletedAt && <DeletedMessage date={deletedAt} />}

            <HeaderInfo>
              <HeaderInfoMain>
                <FeatureList>
                  {homepage && <Homepage url={homepage} testId="network-homepage-link" />}
                  <GenericFeature testId="network-occurrence-count">
                    <OccurrenceIcon />
                    <FormattedMessage
                      id="counts.nOccurrences"
                      values={{ total: occurrenceSearch?.documents.total }}
                    />
                  </GenericFeature>
                  <GenericFeature testId="network-datset-count">
                    <FormattedMessage
                      id="counts.nDatasets"
                      values={{ total: network.numConstituents }}
                    />
                  </GenericFeature>
                  <GenericFeature testId="network-citation-count">
                    <CitationIcon />
                    <FormattedMessage
                      id="counts.nCitations"
                      values={{ total: literatureSearch?.documents.total }}
                    />
                  </GenericFeature>
                </FeatureList>
              </HeaderInfoMain>
            </HeaderInfo>
            <div className="g-border-b g-mt-4"></div>
            <Tabs
              links={[
                { to: '.', children: <FormattedMessage id="phrases.about" /> },
                { to: 'publisher', children: <FormattedMessage id="phrases.publishers" /> },
                { to: 'dataset', children: <FormattedMessage id="phrases.datasets" /> },
                { to: 'metrics', children: <FormattedMessage id="phrases.metrics" /> },
                // { to: 'citations', children: 'Citations' },
              ]}
            />
          </ArticleTextContainer>
        </PageContainer>

        <Outlet />
      </article>
    </>
  );
}

export const NetworkPageSkeleton = ArticleSkeleton;
