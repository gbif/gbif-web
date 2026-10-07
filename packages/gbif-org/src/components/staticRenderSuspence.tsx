import { startTransition, Suspense, SuspenseProps, useEffect, useState } from 'react';

// Set once the first page has hydrated; components mounted after that render normally.
let appHydrated = false;

// renderToString cannot stream suspended content, so the server and the hydration pass render the
// fallback, and the children mount right after. Throwing on the server instead made React report
// error #419 on every page in production builds, where the message used to filter it is minified.
// The switch is a transition: a sync update would hit boundaries still hydrating (error #421).
export function StaticRenderSuspence({ children, ...props }: SuspenseProps) {
  const [hydrated, setHydrated] = useState(appHydrated);
  useEffect(() => {
    appHydrated = true;
    if (!hydrated) startTransition(() => setHydrated(true));
  }, [hydrated]);
  return <Suspense {...props}>{hydrated ? children : props.fallback}</Suspense>;
}
