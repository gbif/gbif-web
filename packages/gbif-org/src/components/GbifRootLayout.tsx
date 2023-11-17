import React from 'react';
import { NavLink } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MyLink } from '@/components/MyLink';

type Props = {
  children: React.ReactNode;
};

export function GbifRootLayout({ children }: Props) {
  return (
    <>
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
