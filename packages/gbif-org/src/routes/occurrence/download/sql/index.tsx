import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceDownloadSqlAbout } from './about';
import { OccurrenceDownloadSqlPage } from './sql';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { SqlDownloadFlow } from '../../search/views/download/SqlDownloadFlow';
import { occurrenceDownloadSqlAboutLoader } from './loader';
import { ProtectedForm } from '@/components/protectedForm';

export const occurrenceDownloadSqlRoute: RouteObjectWithPlugins = {
  id: 'occurrenceDownloadSql',
  path: 'occurrence/download/sql',
  element: <OccurrenceDownloadSqlPage />,
  children: [
    {
      index: true,
      element: (
        <PageContainer className="g-bg-slate-100">
          <div className="g-max-w-4xl g-mx-auto">
            <ProtectedForm
              className=""
              title="Please sign in"
              message="A user account is required to download occurrence data."
            >
              <SqlDownloadFlow />
            </ProtectedForm>
          </div>
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
