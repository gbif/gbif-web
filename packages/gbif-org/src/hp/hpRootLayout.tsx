import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { useI18n } from '@/reactRouterPlugins';
import { useEffect } from 'react';
import { ScrollRestoration, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  disableScrollRestoration?: boolean;
};

export function HpRootLayout({ children, disableScrollRestoration = false }: Props) {
  return (
    <>
      <UrlChangeNotifier />
      {!disableScrollRestoration && <ScrollRestoration />}
      <Toaster />
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}

// Used by the hosted portals to update the url's in the language selector
function UrlChangeNotifier() {
  const location = useLocation();
  const { localizeLink } = useI18n();

  useEffect(() => {
    const url = location.pathname + (location.search ?? '');

    window.dispatchEvent(
      new CustomEvent('gbifUrlChange', {
        detail: { url, localizeLink },
      })
    );
  }, [location]);
  return null;
}
