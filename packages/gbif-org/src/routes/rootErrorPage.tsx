import { NotFoundError, UnexpectedLoaderError } from '@/errors';
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
  }

  return (
    <>
      <h1>Oops an error occurred!</h1>
    </>
  );
}
