import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';

export function HomePage(): React.ReactElement {
  const { locale } = useI18n();

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <p>Current language: {locale.code}</p>

      <p>This is a demo of the basic setup that can be used to create the new GBIF.org</p>

      <h2>This demo includes</h2>
      <ul>
        <li>Server side rendering</li>
        <li>Client side hydration with client side routing takeover</li>
        <li>I18n routing</li>
        <li>Right to left layout for Arabic</li>
        <li>Centralized data loading code that works on the frontend and backend</li>
        <li>Hot module replacement for fast feedback loop</li>
        <li>Pagination of occurrences</li>
        <li>Displaying occurrence in open layers map</li>
        <li>
          Easy config of HTML head element with{' '}
          <a target="_blank" href="https://www.npmjs.com/package/react-helmet-async">
            react-helmet-async
          </a>
        </li>
        <li>Global configurable occurrence predicate</li>
      </ul>

      <Button>This button has a theme</Button>
    </>
  );
}
