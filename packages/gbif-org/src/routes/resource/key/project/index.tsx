import { ProjectDatasetsTabFragment, ProjectPageFragment } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { ProjectPage, projectPageLoader, ProjectPageSkeleton } from './project';
import { ProjectAboutTab } from './projectAboutTab';
import { ProjectDatasetsTab } from './projectDatasetsTab';
import {
  projectNewsAndEventsLoader,
  ProjectNewsAndEventsTab,
  ProjectNewsAndEventsTabSkeleton,
} from './projectNewsAndEventsTab';

const id = 'projectKey';

export const projectKeyRoute: RouteObjectWithPlugins = {
  id,
  path: 'project/:key',
  loader: projectPageLoader,
  loadingElement: <ProjectPageSkeleton />,
  element: <ProjectPage />,
  isSlugified: true,
  children: [
    {
      index: true,
      element: <ProjectAboutTab />,
    },
    {
      path: 'news',
      element: <ProjectNewsAndEventsTab />,
      loadingElement: <ProjectNewsAndEventsTabSkeleton />,
      loader: projectNewsAndEventsLoader,
    },
    {
      path: 'datasets',
      element: <ProjectDatasetsTab />,
    },
  ],
};

export function useProjectKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as {
    resource: ProjectPageFragment;
  } & ProjectDatasetsTabFragment;
}
