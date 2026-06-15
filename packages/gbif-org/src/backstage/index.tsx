import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { NotFoundLoaderResponse } from '@/errors';
import { LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { BackstageLayout } from './BackstageLayout';

// The dashboard is loaded lazily so its code is split into its own chunk and is
// never part of the main site bundle — only fetched when an authorised user
// opens the backstage. Authorisation is enforced server-side by `backstageLoader`
// (below), which runs before the route renders.
const Dashboard = React.lazy(() => import('./Dashboard'));

// Server-authoritative admin gate. The loader probes `/api/admin/me`, which is
// protected by the same `requireAdmin` middleware as the rest of the admin API
// (allowlist + @gbif.org + REGISTRY_ADMIN). A non-admin — or a logged-out user —
// gets a 404 there, which we turn into a `NotFoundLoaderResponse` so the standard
// 404 page renders instead of the dashboard shell. This runs both during SSR (the
// session cookie is forwarded from the incoming request) and on client navigation
// (the same-origin cookie is sent automatically).
export async function backstageLoader({ request }: LoaderArgs) {
  const cookie = request.headers.get('cookie');
  const url = new URL('/api/admin/me', new URL(request.url).origin);
  const response = await fetch(url, cookie ? { headers: { cookie } } : undefined);
  if (!response.ok) throw new NotFoundLoaderResponse();
  return null;
}

export const backstageRoute: RouteObjectWithPlugins = {
  id: 'backstage',
  path: 'backstage',
  loader: backstageLoader,
  element: <BackstageLayout />,
  children: [
    {
      index: true,
      element: (
        <StaticRenderSuspence fallback={null}>
          <Dashboard />
        </StaticRenderSuspence>
      ),
    },
  ],
};
