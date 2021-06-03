import React from 'react';

import { MemoryRouter } from 'react-router-dom';

export default function EnsureRouter({children}) {
  let hasRouter;
  try {
    hasRouter = true;
  } catch(err) {
    console.log('No router context found, so creating a MemoryRouter for the component');
    hasRouter = false;
  }
  return hasRouter ? <>{children}</> : <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
}