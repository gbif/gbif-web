import { RouteObjectWithPlugins } from './reactRouterPlugins';

export function NotFoundPage() {
  return (
    <main className="g-h-full g-text-center">
      <h1 className="g-mt-48 g-text-4xl g-font-bold g-text-slate-400 g-min-h-[80dvh]">Not found</h1>
    </main>
  );
}

export const notFoundRoute: RouteObjectWithPlugins = {
  path: '*',
  element: <NotFoundPage />,
};
