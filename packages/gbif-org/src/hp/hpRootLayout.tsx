import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { ScrollRestoration } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export function HpRootLayout({ children }: Props) {
  return (
    <>
      <ScrollRestoration />
      <Toaster />
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
