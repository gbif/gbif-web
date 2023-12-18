import React from 'react';
import { NavLink } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DynamicLink } from '@/components/DynamicLink';
import { HeaderQuery, HeaderQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '../types';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';

type Props = {
  children: React.ReactNode;
};

export function GbifRootLayout({ children }: Props) {
  // const { data } = useTypedLoaderData(); // menu data

  return (
    <>
      <header style={{ display: 'flex', gap: '10px' }}>
        <LanguageSelector />
        <nav style={{ display: 'flex', gap: '10px' }}>
          <DynamicLink as={NavLink} to="/">
            Home
          </DynamicLink>
          <DynamicLink as={NavLink} to="/occurrence/search">
            Search
          </DynamicLink>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}

// load the navigation elements to be used in the header
export async function headerLoader({ request, config, locale }: LoaderArgs) {
  // first we need to load all the elements of the navigation
  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {},
    locale: locale.cmsLocale || locale.code,
  });
}

const { load, useTypedLoaderData } = createGraphQLHelpers<
  HeaderQuery,
  HeaderQueryVariables
>(/* GraphQL */ `
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
`);
