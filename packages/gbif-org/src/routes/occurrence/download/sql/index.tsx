import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceDownloadSqlAbout, occurrenceDownloadSqlAboutLoader } from './about';
import { OccurrenceDownloadSqlCreate } from './create';
import { OccurrenceDownloadSqlPage } from './sql';

export const occurrenceDownloadSqlRoute: RouteObjectWithPlugins = {
  path: 'occurrence/download/sql',
  element: <OccurrenceDownloadSqlPage />,
  children: [
    {
      index: true,
      element: <OccurrenceDownloadSqlCreate />,
    },
    {
      path: 'about',
      loader: occurrenceDownloadSqlAboutLoader,
      element: <OccurrenceDownloadSqlAbout />,
    },
  ],
};
