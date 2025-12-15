import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceDownloadAbout } from './about';
import { OccurrenceDownloadPage } from './layout';
import { PredicateDownloadFlow } from '../../search/views/download/PredicateDownloadFlow';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { occurrenceDownloadAboutLoader } from './loader';
import { ProtectedForm } from '@/components/protectedForm';

export const occurrenceDownloadRequestRoute: RouteObjectWithPlugins = {
  path: 'occurrence/download/request',
  element: <OccurrenceDownloadPage />,
  children: [
    {
      index: true,
      // The page uses session storage and can therefore not be server side rendered
      element: (
        <PageContainer className="g-bg-slate-100">
          <div className="g-max-w-4xl g-mx-auto">
            <ProtectedForm
              className=""
              title="Please sign in"
              message="A user account is required to download occurrence data."
            >
              <PredicateDownloadFlow />
            </ProtectedForm>
          </div>
        </PageContainer>
      ),
    },
    {
      path: 'about',
      loader: occurrenceDownloadAboutLoader,
      element: <OccurrenceDownloadAbout />,
    },
  ],
};
