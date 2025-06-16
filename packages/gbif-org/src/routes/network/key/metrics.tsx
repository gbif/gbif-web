import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { MapWidget } from '@/components/maps/mapWidget';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { useNetworkKeyLoaderData } from '.';

export function NetworkKeyMetrics() {
  const { data } = useNetworkKeyLoaderData();
  const predicate = {
    type: 'equals',
    key: 'networkKey',
    value: data?.network?.key,
  };
  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className="g-mb-2 g-text-slate-500">
          <FormattedMessage id="dashboard.metricsFromGbifData" />
        </div>
        <ClientSideOnly>
          <MapWidget
            className="g-mb-4"
            capabilitiesParams={{ networkKey: data?.network?.key }}
            mapStyle="CLASSIC_HEX"
          />
          <DashBoardLayout>
            <charts.OccurrenceSummary predicate={predicate} className="g-mb-2" />
            <charts.DataQuality predicate={predicate} className="g-mb-2" />
            <charts.EventDate
              predicate={predicate}
              options={['TIME']}
              interactive={false}
              className="g-mb-2"
            />
            <charts.Licenses
              predicate={predicate}
              visibilityThreshold={0}
              defaultOption="PIE"
              className="g-mb-2"
            />
            <charts.Taxa predicate={predicate} className="g-mb-2" />
            <charts.Iucn predicate={predicate} visibilityThreshold={0} className="g-mb-2" />
            <charts.IucnCounts predicate={predicate} visibilityThreshold={0} className="g-mb-2" />
            <charts.BasisOfRecord
              predicate={predicate}
              visibilityThreshold={0}
              defaultOption="PIE"
              className="g-mb-2"
            />
            <charts.OccurrenceIssue
              predicate={predicate}
              visibilityThreshold={0}
              defaultOption="TABLE"
              className="g-mb-2"
            />
            <charts.Country
              predicate={predicate}
              visibilityThreshold={1}
              options={['PIE', 'TABLE']}
              className="g-mb-2"
            />
          </DashBoardLayout>
        </ClientSideOnly>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
