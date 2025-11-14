import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceDownloadSqlAbout } from './about';
import { OccurrenceDownloadSqlPage } from './sql';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { SqlDownloadFlow } from '../../search/views/download/SqlDownloadFlow';
import { occurrenceDownloadSqlAboutLoader } from './loader';

export const occurrenceDownloadSqlRoute: RouteObjectWithPlugins = {
  id: 'occurrenceDownloadSql',
  path: 'occurrence/download/sql',
  element: <OccurrenceDownloadSqlPage />,
  children: [
    {
      index: true,
      element: (
        <PageContainer className="g-bg-slate-100">
          <SqlDownloadFlow />
        </PageContainer>
      ),
    },
    {
      path: 'about',
      loader: occurrenceDownloadSqlAboutLoader,
      element: <OccurrenceDownloadSqlAbout />,
    },
  ],
};
