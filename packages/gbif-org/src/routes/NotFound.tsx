import React from 'react';
import { Helmet } from 'react-helmet-async';

export function NotFound(): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>Not found</title>
      </Helmet>

      <p>Page not found</p>
    </>
  );
}
