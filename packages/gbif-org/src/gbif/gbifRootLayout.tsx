import React from 'react';
import { NavLink, ScrollRestoration } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LanguageSelector } from '@/components/languageSelector';
import { DynamicLink } from '@/components/dynamicLink';
import { HeaderQuery, HeaderQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '../types';
import { NoscriptNotification } from '@/components/noscriptNotification';

const HEADER_QUERY = /* GraphQL */ `
  query Header {
    gbifHome {
      title
      summary
      children {
        externalLink
        link
        title
        children {
          externalLink
          link
          title
          children {
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
  // const { data } = useTypedLoaderData(); // menu data

  return (
    <>
      <header className="g-flex g-gap-3 g-fixed g-bg-white g-shadow-sm g-px-2 g-h-10 g-w-full g-z-10 g-items-center">
        <LanguageSelector />
        <nav className="g-flex g-gap-3">
          <DynamicLink as={NavLink} to="/">
            Home
          </DynamicLink>
          <DynamicLink as={NavLink} to="/occurrence/search">
            Search
          </DynamicLink>
        </nav>
      </header>
      <main className="g-pt-10 g-min-h-screen">
        <NoscriptNotification />
        <ScrollRestoration />
        <Toaster />
        {children}
        {/* Visualization of the table of contents IntersectionObserver area
        <div className="g-fixed g-pointer-events-none g-top-0 g-left-0 g-w-screen g-h-screen">
          <div className="g-mt-[200px] g-mb-[60%] g-bg-red-300 g-h-[calc(100vh-60%-200px)] g-opacity-10"></div>
        </div> */}
      </main>
    </>
  );
}
