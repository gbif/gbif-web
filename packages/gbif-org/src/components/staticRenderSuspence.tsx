import { startTransition, Suspense, SuspenseProps, useEffect, useState } from 'react';

// renderToString cannot stream suspended content, so the server and the hydration pass render the
// fallback, and the children mount right after. Throwing on the server instead made React report
// error #419 on every page in production builds, where the message used to filter it is minified.
// Every instance starts on the fallback, even after the first page has hydrated: an instance in a
// boundary that hydrates later must match the server HTML too. The switch is a transition: a sync
// update would hit boundaries still hydrating (error #421).
export function StaticRenderSuspence({ children, ...props }: SuspenseProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => startTransition(() => setMounted(true)), []);
  return <Suspense {...props}>{mounted ? children : props.fallback}</Suspense>;
}
