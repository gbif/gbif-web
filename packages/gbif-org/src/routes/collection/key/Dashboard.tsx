import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { useCollectionKeyLoaderData } from '.';

export default function Dashboard() {
  const { data } = useCollectionKeyLoaderData();
  const predicate = {
    type: 'equals',
    key: 'collectionKey',
    value: data?.collection?.key,
  };
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-2 md:g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className="g-mb-2 g-text-slate-500">
          <FormattedMessage id="dashboard.metricsFromGbifData" />
        </div>
        <ClientSideOnly>
          <DashBoardLayout>
            <charts.OccurrenceSummary predicate={predicate} className="g-mb-2" />
            <charts.DataQuality predicate={predicate} className="g-mb-2" />
            <charts.EventDate
              predicate={predicate}
              options={['TIME']}
              interactive={false}
              className="g-mb-2"
            />
            <charts.Preparations
              predicate={predicate}
              visibilityThreshold={0}
              defaultOption="PIE"
              className="g-mb-2"
            />
            <charts.Taxa predicate={predicate} className="g-mb-2" />
            <charts.Iucn predicate={predicate} visibilityThreshold={0} className="g-mb-2" />
            <charts.IucnCounts predicate={predicate} visibilityThreshold={0} className="g-mb-2" />
            <charts.RecordedBy
              predicate={predicate}
              visibilityThreshold={0}
              defaultOption="TABLE"
              className="g-mb-2"
            />
            <charts.IdentifiedBy
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
