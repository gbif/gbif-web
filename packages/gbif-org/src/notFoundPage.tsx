// This page should not be added to the route config, as the alias handling route matches with a wildcard, and will render this page if no other route is found in contentful.

import { useConfig } from './config/config';
import { cn } from './utils/shadcn';

export function NotFoundPage() {
  const config = useConfig();
  return (
    <main
      className={cn(
        'g-h-full g-text-center g-relative g-w-full g-bg-contain g-bg-no-repeat g-bg-center',
        config?.notFoundPageImageUrl ? "g-bg-[url('/img/404.jpg')]" : ''
      )}
    >
      <h1 className="g-pt-12 g-text-4xl g-font-bold g-text-slate-400 g-min-h-[70dvh]">Not found</h1>
    </main>
  );
}
