import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { MapWidget } from '@/components/maps/mapWidget';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { PublisherCountsQuery, PublisherCountsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

export function PublisherKeyMetrics() {
  const { key } = useParams();
  const { load, data, loading, error } = useQuery<
    PublisherCountsQuery,
    PublisherCountsQueryVariables
  >(PUBISHER_COUNTS, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    if (typeof key !== 'undefined') {
      load({
        variables: {
          key,
          jsonKey: key,
        },
      });
    }
  }, [key]);

  const literaturePredicate = {
    type: 'equals',
    key: 'publishingOrganizationKey',
    value: key,
  };

  const occurrencePredicate = {
    type: 'equals',
    key: 'publishingOrg',
    value: key,
  };

  const hasOccurrenceData = data?.occurrenceSearch?.documents?.total > 0;
  const hasLiteratureData = data?.literatureSearch?.documents?.total > 0;

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <ClientSideOnly>
          {!hasOccurrenceData && !hasLiteratureData && !loading && <div>No data to show</div>}
          <MapWidget
            className="g-mb-4"
            capabilitiesParams={{ publishingOrg: key }}
            mapStyle="CLASSIC_HEX"
          />
          {hasLiteratureData && (
            <section>
              <CardHeader>
                <CardTitle>
                  <span className="g-me-2">
                    <FormattedMessage id="phrases.citationMetrics" />
                  </span>
                </CardTitle>
              </CardHeader>
              <DashBoardLayout>
                <charts.LiteratureCreatedAt
                  visibilityThreshold={1}
                  predicate={literaturePredicate}
                />
                <charts.LiteratureTopics visibilityThreshold={1} predicate={literaturePredicate} />
                <charts.LiteratureRelevance
                  visibilityThreshold={1}
                  predicate={literaturePredicate}
                />
                <charts.LiteratureCountriesOfCoverage
                  visibilityThreshold={1}
                  predicate={literaturePredicate}
                />
                <charts.LiteratureCountriesOfResearcher
                  visibilityThreshold={1}
                  predicate={literaturePredicate}
                />
                <charts.LiteratureType visibilityThreshold={1} predicate={literaturePredicate} />
              </DashBoardLayout>
            </section>
          )}

          {hasOccurrenceData && (
            <section>
              <CardHeader>
                <CardTitle>
                  <span className="g-me-2">
                    <FormattedMessage id="phrases.occurrenceMetrics" />
                  </span>
                </CardTitle>
              </CardHeader>
              <DashBoardLayout>
                <charts.DataQuality visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.OccurrenceSummary visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.Licenses visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.DwcaExtension visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.Iucn visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.IucnCounts visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.Country visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.BasisOfRecord visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.Taxa visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.Datasets visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.Collections visibilityThreshold={0} predicate={occurrencePredicate} />
                <charts.Institutions visibilityThreshold={0} predicate={occurrencePredicate} />
              </DashBoardLayout>
            </section>
          )}
        </ClientSideOnly>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

const PUBISHER_COUNTS = /* GraphQL */ `
  query PublisherCounts($key: ID!, $jsonKey: JSON!) {
    occurrenceSearch(predicate: { type: equals, key: "publishingOrg", value: $jsonKey }) {
      documents(size: 0) {
        total
      }
    }
    hostedDatasets: datasetSearch(hostingOrg: [$key]) {
      count
    }
    literatureSearch(publishingOrganizationKey: [$key]) {
      documents {
        total
      }
    }
  }
`;
