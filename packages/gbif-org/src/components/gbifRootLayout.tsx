import React from 'react';
import { NavLink } from 'react-router-dom';
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
      <header className='g-flex g-gap-3 g-fixed g-bg-white g-shadow-sm g-px-2 g-h-10 g-w-full g-z-10 g-items-center'>
        <LanguageSelector />
        <nav className='g-flex g-gap-3'>
          <DynamicLink as={NavLink} to="/">
            Home
          </DynamicLink>
          <DynamicLink as={NavLink} to="/occurrence/search">
            Search
          </DynamicLink>
        </nav>
      </header>
      <main className='g-bg-white g-pt-10'>
        <NoscriptNotification />
        {children}
      </main>
    </>
  );
}
