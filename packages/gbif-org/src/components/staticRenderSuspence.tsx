import { Suspense, SuspenseProps } from 'react';

export function StaticRenderSuspence({ children, ...props }: SuspenseProps) {
  return (
    <Suspense {...props}>
      <SuspenseContent>{children}</SuspenseContent>
    </Suspense>
  );
}

// We use renderToString on the server, so we can't stream the content of suspended components.
// Instead, we throw an error to render the fallback on the server.
// https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content
function SuspenseContent({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    throw new Error('This component should not be rendered on the server.');
  }

  return children;
}
