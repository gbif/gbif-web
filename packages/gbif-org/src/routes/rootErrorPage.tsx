import { ErrorPage } from '@/components/ErrorBoundary';
import { UnexpectedLoaderError } from '@/errors';
import { NotFoundPage } from '@/notFoundPage';
import React from 'react';
import { useRouteError } from 'react-router-dom';

export function RootErrorPage(): React.ReactElement {
  const error = useRouteError();

  if (error instanceof Error && error.message === '404') {
    return <NotFoundPage />;
  }

  if (error instanceof UnexpectedLoaderError) {
    // TODO: Handle
    console.error(error);
  }

  return <ErrorPage error={error} showStackTrace />;
}
