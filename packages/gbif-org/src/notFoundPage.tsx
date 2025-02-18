// This page should not be added to the route config, as the alias handling route matches with a wildcard, and will render this page if no other route is found in contentful.

export function NotFoundPage() {
  return (
    <main className="g-h-full g-text-center">
      <h1 className="g-pt-48 g-text-4xl g-font-bold g-text-slate-400 g-min-h-[80dvh]">Not found</h1>
    </main>
  );
}
