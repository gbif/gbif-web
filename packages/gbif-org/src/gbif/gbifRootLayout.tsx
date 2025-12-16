import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingIndicator } from '@/components/loadingIndicator';
import { NoscriptNotification } from '@/components/noscriptNotification';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { HeaderQuery, HomePageQuery } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import React from 'react';
import { json, ScrollRestoration, useLoaderData } from 'react-router-dom';
import { Footer } from './footer';
import { Header } from './header';
import { GDPR } from '@/components/gdpr';
import toolsRedirects from './toolsRedirects';
// eslint-disable-next-line
import { HEADER_QUERY } from './header/query.mjs'; // only imported to generate types

export async function headerLoader({ locale }: LoaderArgs) {
  const apiUrl = `${import.meta.env.PUBLIC_BASE_URL}/unstable-api/cached-response/header?locale=${
    locale.cmsLocale ?? 'en'
  }`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    // just swallow errors here and let the page render with partial data
    return json(
      { error: 'Failed to load header data' },
      {
        headers: {
          'GBIF-Cache-Control': 'NONE', // option are listed in gbif/entry.server but vite builds fails if trying to export/import things into the server file or vica versa
        },
      }
    ) as HomePageQuery;
  }

  return { data: await response.json() };
}

type Props = {
  children: React.ReactNode;
};

export function GbifRootLayout({ children }: Props) {
  const { data } = useLoaderData() as { data: HeaderQuery };

  return <LayoutInner data={data}>{children}</LayoutInner>;
}

const redirectTools = (data) => {
  const toolsRoot = data?.gbifHome?.children?.find((c) => c.id === '6NBwCayI3rNgZdzgqeMnCX');
  if (toolsRoot) {
    toolsRoot.children?.forEach((section) => {
      if (section.children) {
        section.children.forEach((tool) => {
          if (toolsRedirects?.[tool.link]) {
            tool.externalLink = true;
            tool.link = toolsRedirects?.[tool.link];
          }
        });
      }
    });
  }
  return data;
};

const LayoutInner = React.memo(
  ({ children, data }: { children: React.ReactNode; data: HeaderQuery }) => {
    return (
      <UserProvider>
        <div className="g-flex g-flex-col g-min-h-[100dvh]">
          <LoadingIndicator />
          <Header menu={redirectTools(data)} />
          <main className="g-flex-auto">
            <NoscriptNotification />
            <ScrollRestoration />
            <Toaster />
            <GDPR />
            <ErrorBoundary>{children}</ErrorBoundary>
            {/* Visualization of the table of contents IntersectionObserver area
          <div className="g-fixed g-pointer-events-none g-top-0 g-left-0 g-w-screen g-h-screen">
            <div className="g-mt-[200px] g-mb-[60%] g-bg-red-300 g-h-[calc(100vh-60%-200px)] g-opacity-10"></div>
          </div> */}
          </main>
          <Footer />
        </div>
        {import.meta.env.PUBLIC_STATUS_PAGE_URL && (
          <script async src={`${import.meta.env.PUBLIC_STATUS_PAGE_URL}/embed/script.js`}></script>
        )}
      </UserProvider>
    );
  }
);
