import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ContactUsPage, contactUsPageLoader } from './contactUs';
import { ContactUsTab } from './contactUsTab';
import { DirectoryTab } from './directoryTab';
import { ContactUsPageQuery } from '@/gql/graphql';

const id = 'contactUs';

export const contactUsRoute: RouteObjectWithPlugins = {
  id,
  path: 'contact-us',
  loader: contactUsPageLoader,
  loadingElement: <ArticleSkeleton />,
  element: <ContactUsPage />,
  children: [
    {
      index: true,
      element: <ContactUsTab />,
    },
    {
      path: 'directory',
      element: <DirectoryTab />,
    },
  ],
};

export function useContactUsLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: ContactUsPageQuery };
}
