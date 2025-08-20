import { ErrorComponent } from '@/components/ErrorBoundary';
import { useToast } from '@/components/ui/use-toast';
import { NotFoundLoaderResponse } from '@/errors';
import { NotFoundPage } from '@/notFoundPage';
import React, { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useRouteError } from 'react-router-dom';

export function RootErrorPage(): React.ReactElement {
  const error = useRouteError();

  if (error instanceof Error && error.message === '404') {
    return <NotFoundPage />;
  }

  if (typeof error === 'object' && error != null && 'status' in error && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <ErrorComponent
      error={error}
      type={'PAGE'}
      // title={this.props.title}
      errorMessage={error?.message}
      showReportButton={true}
      showStackTrace={true}
    />
  );
}

export function is404({
  path,
  errors,
}: {
  path: [string];
  errors?: Array<{ message?: string; path?: [string] }>;
}): boolean {
  if (!errors) return false;
  // check if the path match the error path and the message contains 404
  return errors?.some(
    (error) => error?.path?.join('.') === path.join('.') && error?.message?.includes('404')
  );
}

export function throwCriticalErrors({
  errors,
  requiredObjects,
  path404,
}: {
  errors?: Array<{ message?: string; path?: [string] }>;
  requiredObjects?: (object | null | undefined)[];
  path404: [string];
}) {
  if (is404({ path: path404, errors })) {
    throw new NotFoundLoaderResponse();
  }
  if (requiredObjects?.some((obj) => !obj)) {
    throw new Error('Required entities could not be loaded');
  }
}

// perhaps useful for error checking in components that does not use a data loader, but uses the usequery hook?
export function useErrorChecking({
  errors,
  requiredObjects,
  path404,
}: {
  errors: Array<{ message: string; path: [string] }>;
  requiredObjects?: (object | null | undefined)[];
  path404: [string];
}) {
  useEffect(() => {
    throwCriticalErrors({ errors, requiredObjects, path404 });
  }, [requiredObjects, errors, path404]);
}

let pathWhereUserWasLastNotified: string | undefined;

export function usePartialDataNotification() {
  const location = useLocation();
  const { toast } = useToast();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (location.pathname !== pathWhereUserWasLastNotified) {
      pathWhereUserWasLastNotified = undefined;
    }
  }, [location.pathname]);

  const notify = useCallback(() => {
    if (pathWhereUserWasLastNotified !== location.pathname) {
      pathWhereUserWasLastNotified = location.pathname;
      toast({
        title: formatMessage({ id: 'error.partialData' }),
        variant: 'destructive',
      });
    }
  }, [location.pathname, toast, formatMessage]);

  return notify;
}
