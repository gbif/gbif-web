import React from 'react';
import { NavLink, useNavigation } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MyLink } from '@/components/MyLink';

type Props = {
  children: React.ReactNode;
};

export function GbifRootLayout({ children }: Props) {
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === 'loading' && <p>Loading...</p>}
      <header style={{ display: 'flex', gap: '10px' }}>
        <LanguageSelector />
        <nav style={{ display: 'flex', gap: '10px' }}>
          <MyLink as={NavLink} to="/">
            Home
          </MyLink>
          <MyLink as={NavLink} to="/occurrence/search">
            Search
          </MyLink>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
