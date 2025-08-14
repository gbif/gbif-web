import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { redirectDocument } from 'react-router-dom';
import { GlobalAnalyticsPage } from './global';
import { RegionAnalyticsPage, regionLoader } from './region';

export const analyticsRoute: RouteObjectWithPlugins = {
  id: 'analytics',
  path: 'analytics',
  children: [
    {
      index: true,
      loader: () => redirectDocument('./global'),
    },
    {
      path: 'global',
      element: <GlobalAnalyticsPage />,
    },
    {
      path: 'region/:regionKey',
      loader: regionLoader,
      element: <RegionAnalyticsPage />,
    },
  ],
};
