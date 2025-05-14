import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useParams } from 'react-router-dom';
import { DataFromCountryMap } from './components/dataFromCountryMap';
import { FormattedMessage } from 'react-intl';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Trends } from './components/trends';
import { OccurrencesPerKingdom } from './components/kingdoms/occurrencesPerKingdom';
import { useMemo } from 'react';
import { ClientSideOnly } from '@/components/clientSideOnly';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import * as charts from '@/components/dashboard';

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

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataFromCountryMap countryCode={countryCode} />

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
            <FormattedMessage
              // TODO: add i18n key
              id="countryKey.publishingTrends"
              defaultMessage="Publishing trends"
            />
          </CardTitle>
        </CardHeader>

        <Trends type="publishedBy" countryCode={countryCode} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
