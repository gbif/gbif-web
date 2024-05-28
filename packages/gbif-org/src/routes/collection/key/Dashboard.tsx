import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { CollectionQuery } from '@/gql/graphql';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';

export default function Dashboard() {
  const { data } = useParentRouteLoaderData(RouteId.Collection) as { data: CollectionQuery };
  const predicate = {
    type: 'equals',
    key: 'collectionKey',
    value: data?.collection?.key,
  };
  return <ArticleContainer className="bg-slate-100 pt-2 md:pt-4">
  <ArticleTextContainer className="max-w-screen-xl">
    <ClientSideOnly>
      <DashBoardLayout>
        <charts.OccurrenceSummary predicate={predicate} className="mb-2" />
        <charts.DataQuality predicate={predicate} className="mb-2" />
        <charts.EventDate predicate={predicate} options={['TIME']} interactive={false} className="mb-2" />
        <charts.Preparations predicate={predicate} visibilityThreshold={0}  defaultOption="PIE" className="mb-2" />
        <charts.Taxa predicate={predicate}  className="mb-2" />
        <charts.Iucn predicate={predicate} visibilityThreshold={0}  className="mb-2" />
        <charts.IucnCounts predicate={predicate} visibilityThreshold={0}  className="mb-2" />
        <charts.RecordedBy predicate={predicate} visibilityThreshold={0}  defaultOption="TABLE" className="mb-2" />
        <charts.IdentifiedBy predicate={predicate} visibilityThreshold={0}  defaultOption="TABLE" className="mb-2" />
        <charts.Country predicate={predicate} visibilityThreshold={1}  options={['PIE', 'TABLE']} className="mb-2" />
      </DashBoardLayout>
    </ClientSideOnly>
  </ArticleTextContainer>
</ArticleContainer>
}
