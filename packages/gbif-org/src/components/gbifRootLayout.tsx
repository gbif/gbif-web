import React from 'react';
import { NavLink, ScrollRestoration } from 'react-router-dom';
import { Toaster } from './ui/toaster';
import { LanguageSelector } from '@/components/languageSelector';
import { DynamicLink } from '@/components/dynamicLink';
import { HeaderQuery, HeaderQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '../types';
import { NoscriptNotification } from './noscriptNotification';

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
      <header className="flex gap-3 fixed bg-white shadow-sm px-2 h-10 w-full z-10 items-center">
        <LanguageSelector />
        <nav className="flex gap-3">
          <DynamicLink as={NavLink} to="/">
            Home
          </DynamicLink>
          <DynamicLink as={NavLink} to="/occurrence/search">
            Search
          </DynamicLink>
        </nav>
      </header>
      {/* h-px is needed for the child element to use height: 100% https://stackoverflow.com/a/21836870/9188121 */}
      <main className="bg-background pt-10 min-h-screen h-px">
        <NoscriptNotification />
        <ScrollRestoration />
        {children}
        <Toaster />
      </main>
    </>
  );
}
