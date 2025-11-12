import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceDownloadAbout, occurrenceDownloadAboutLoader } from './about';
import { OccurrenceDownloadPage } from './layout';
import { PredicateDownloadFlow } from '../../search/views/download/PredicateDownloadFlow';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Skeleton } from '@/components/ui/skeleton';

export const occurrenceDownloadRequestRoute: RouteObjectWithPlugins = {
  path: 'occurrence/download/request',
  element: <OccurrenceDownloadPage />,
  children: [
    {
      index: true,
      // The page uses session storage and can therefore not be server side rendered
      element: (
        <PageContainer className="g-bg-slate-100">
          <PredicateDownloadFlow />
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
