import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HomePage(): React.ReactElement {
  const { locale } = useI18n();

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="prose">
        <p>Current language: {locale.code}</p>
        <h2>This demo includes</h2>
        <ul>
          <li>
            <Link to="/resource/6qTuv5Xf1qa05arROvx7Y1">News (wip)</Link>
          </li>
          <li>
            <Link to="/resource/2NcRzaklrkf5X1mvyOvg5V">Data use (wip)</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
