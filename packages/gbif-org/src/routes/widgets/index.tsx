import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { LiteratureSearchPage } from './literature';
import { LiteratureButton } from './literatureButton';
export const literatureSearchWidgetRoute: RouteObjectWithPlugins = {
  id: 'literatureSearchWidget',
  path: 'api/widgets/literature/latest',
  element: <LiteratureSearchPage />,
};

export const literatureButtonWidgetRoute: RouteObjectWithPlugins = {
  id: 'literatureButtonWidget',
  path: 'api/widgets/literature/button',
  element: <LiteratureButton />,
};
