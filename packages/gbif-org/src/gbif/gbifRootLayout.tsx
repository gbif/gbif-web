import React from 'react';
import { Link, NavLink, ScrollRestoration, useLoaderData } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LanguageSelector } from '@/components/languageSelector';
import { DynamicLink } from '@/components/dynamicLink';
import { HeaderQuery, HeaderQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '../types';
import { NoscriptNotification } from '@/components/noscriptNotification';
import { MainNavigation } from './header/mainNav';
import { GbifLogoIcon } from '@/components/icons/icons';
import { MdMenu } from 'react-icons/md';
import { Header } from './header';

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
    <>
      <Header menu={data} />
      <main className="g-min-h-screen">
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
