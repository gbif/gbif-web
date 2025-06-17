import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NoscriptNotification } from '@/components/noscriptNotification';
import { Toaster } from '@/components/ui/toaster';
import { HeaderQuery, HeaderQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import React from 'react';
import { ScrollRestoration, useLoaderData } from 'react-router-dom';
import { Header } from './header';
import { LoadingIndicator } from '@/components/loadingIndicator';
import { Footer } from './footer';
import { UserProvider } from '@/contexts/UserContext';

const HEADER_QUERY = /* GraphQL */ `
  query Header {
    gbifHome {
      title
      summary
      children {
        id
        externalLink
        link
        title
        children {
          id
          externalLink
          link
          title
          children {
            id
            externalLink
            link
            title
          }
        }
      }
    }
  }
`;

export function headerLoader({ graphql }: LoaderArgs) {
  return graphql.query<HeaderQuery, HeaderQueryVariables>(HEADER_QUERY, {});
}

type Props = {
  children: React.ReactNode;
};

export function GbifRootLayout({ children }: Props) {
  const { data } = useLoaderData() as { data: HeaderQuery };

  return (
    <UserProvider>
      <div className="g-flex g-flex-col g-min-h-[100dvh]">
        <LoadingIndicator />
        <Header menu={data} />
        <main className="g-flex-auto">
          <NoscriptNotification />
          <ScrollRestoration />
          <Toaster />
          <ErrorBoundary>{children}</ErrorBoundary>
          {/* Visualization of the table of contents IntersectionObserver area
          <div className="g-fixed g-pointer-events-none g-top-0 g-left-0 g-w-screen g-h-screen">
            <div className="g-mt-[200px] g-mb-[60%] g-bg-red-300 g-h-[calc(100vh-60%-200px)] g-opacity-10"></div>
          </div> */}
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}