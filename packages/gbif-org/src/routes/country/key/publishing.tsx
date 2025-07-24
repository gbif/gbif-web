import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import {
  DataFromCountryMapPresentation,
  useFromCountryDetails,
} from './components/dataFromCountryMap';
import { EmptyCountryTab } from './components/emptyCountryTab';
import { OccurrencesPerKingdom } from './components/kingdoms/occurrencesPerKingdom';
import { Trends } from './components/trends';

export function CountryKeyPublishing() {
  const { countryCode } = useParams();
  if (!countryCode) throw new Error('Country code is required');

  const predicate = useMemo(() => {
    return {
      type: 'equals',
      key: 'publishingCountry',
      value: countryCode,
    };
  }, [countryCode]);

  const { data, loading } = useFromCountryDetails(countryCode);

  if (!loading && (data?.countryDetail == null || data.countryDetail.fromPublisherCount === 0)) {
    return (
      <EmptyCountryTab
        title={<FormattedMessage id="country.noDataPublishingActivity" />}
        description={<FormattedMessage id="country.noInstitutionsHavePublished" />}
      />
    );
  }

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataFromCountryMapPresentation
          countryCode={countryCode}
          fromCountryDetails={data?.countryDetail}
          isLoading={loading}
        />

        <OccurrencesPerKingdom type="publishedBy" countryCode={countryCode} />

        <ClientSideOnly>
          <DashBoardLayout>
            <charts.Months
              predicate={predicate}
              defaultOption="COLUMN"
              visibilityThreshold={0}
              interactive={false}
            />
            <charts.EventDate
              predicate={predicate}
              visibilityThreshold={1}
              options={['TIME']}
              interactive={false}
            />
            <charts.BasisOfRecord
              predicate={predicate}
              visibilityThreshold={0}
              defaultOption="PIE"
            />
            <charts.Licenses predicate={predicate} visibilityThreshold={0} defaultOption="PIE" />
            <charts.Country
              predicate={predicate}
              visibilityThreshold={1}
              defaultOption="TABLE"
              options={['PIE', 'TABLE']}
            />
            <charts.Datasets predicate={predicate} visibilityThreshold={0} defaultOption="TABLE" />
          </DashBoardLayout>
        </ClientSideOnly>

        <CardHeader>
          <CardTitle>
            <FormattedMessage id="country.publishingTrends" />
          </CardTitle>
        </CardHeader>

        <Trends path={`country/${countryCode}/publishedBy`} countryCode={countryCode} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
