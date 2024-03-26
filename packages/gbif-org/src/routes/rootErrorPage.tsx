import React from 'react';
import { useRouteError } from 'react-router-dom';

export function RootErrorPage(): React.ReactElement {
  const error = useRouteError() as Error;

  console.error(error);

  return (
    <>
      <h1>Oops an error occurred!</h1>
      <p>{error.message}</p>
    </>
  );
}
