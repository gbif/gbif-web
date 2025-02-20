import { cn } from '@/utils/shadcn';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ErrorImage } from './icons/icons';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  invalidateOn?: string | number | boolean | object | null; // invalidate the error if this value change
  type?: 'PAGE' | 'BLOCK'; // PAGE will show a full page error, BLOCK will show a block error. Will default to PAGE
  className?: string;
  publicDescription?: string; // additional description of where the error happened. E.g. which component or section
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps | Readonly<ErrorBoundaryProps>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // We do not have a service to do client logging. Could be nice at some point.
    console.error(error, errorInfo);
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>) {
    // invalidate the error if the invalidateOn prop changes. Typical use will be the key of the item. Or a filter. Whatever would trigger a new fetch typically
    if (prevProps.invalidateOn !== this.props.invalidateOn) {
      this.setState({
        ...this.state,
        error: null,
      });
    }
  }

  render() {
    const { error } = this.state;

    // if there is no error then just return the children
    if (!error) {
      return this.props.children;
    }

    return (
      <ErrorComponent
        error={error}
        type={this.props.type ?? 'PAGE'}
        className={this.props.className}
        description={this.props.publicDescription}
      />
    );
  }
}

function ErrorComponent({
  error,
  type,
  className,
  description,
}: {
  error: Error;
  type: 'PAGE' | 'BLOCK';
  className?: string;
  description?: string;
}): React.ReactElement {
  // An error has occurred
  let errorMessage = `Thank you for reporting this issue. Please describe what happened.\n\n\n\n`;

  if (typeof error?.stack === 'string') {
    errorMessage += '\n**Error message for diagnostics**\n```\n' + error?.stack + '\n```';
  }

  if (typeof window !== 'undefined') {
    errorMessage += `\nLocation: ${window.location}`;
  }

  if (description) {
    errorMessage += `\nDescription: ${description}`;
  }

  if (type === 'BLOCK') {
    return <ErrorBlock errorMessage={errorMessage} className={className} />;
  }
  return <ErrorPage error={error} errorMessage={errorMessage} />;
}

function ErrorBlock({
  errorMessage,
  className,
}: {
  errorMessage: string;
  className?: string;
}): React.ReactElement {
  return (
    <div className={cn('g-flex g-gap-4 g-py-4', className)}>
      <ErrorImage className="g-w-24" />
      <div>
        <h1 className="g-mb-0 g-text-slate-500 g-font-bold">
          <FormattedMessage id="error.generic" defaultMessage="Something went wrong" />
        </h1>
        <a
          href=""
          onClick={() => {
            window?.location?.reload();
          }}
          className="g-mt-2 g-text-sm g-underline g-text-slate-500"
        >
          <FormattedMessage id="error.reloadPage" defaultMessage="Try to reload page" />
        </a>
      </div>
    </div>
  );
}

export function ErrorPage({
  error,
  errorMessage,
}: {
  error: Error;
  errorMessage: string;
}): React.ReactElement {
  const [showStack, setShowStack] = useState(false);

  return (
    <div className="g-flex g-flex-col g-items-center g-justify-center g-text-center g-w-full g-h-full g-py-48 g-px-2 g-min-h-[80dvh] g-bg-white">
      <ErrorImage className="g-w-72 g-max-w-full" />
      <h1 className="g-mb-0 g-text-slate-500 g-text-xl g-mt-4 g-font-bold">
        <FormattedMessage id="error.generic" defaultMessage="Something went wrong" />
      </h1>
      <div className="g-mt-4 g-mb-8">
        <Button asChild>
          <a
            target="_blank"
            href={`https://github.com/gbif/gbif-web/issues/new?body=${encodeURIComponent(
              errorMessage
            )}`}
          >
            <FormattedMessage id="error.report" defaultMessage="Report issue" />
          </a>
        </Button>
      </div>
      <Button
        variant="ghost"
        className="g-text-slate-500 g-mb-4"
        onClick={() => setShowStack(!showStack)}
      >
        <FormattedMessage
          id={showStack ? 'error.hideDetails' : 'error.showDetails'}
          defaultMessage={showStack ? 'Hide details' : 'Show details'}
        />
      </Button>
      {error?.stack && showStack && (
        <div className="g-flex g-flex-col g-text-start g-max-h-96 h-overflow-auto g-p-2 g-bg-white g-border g-rounded g-max-w-full">
          <h4 style={{ marginTop: 12 }}>
            {error?.message || (
              <FormattedMessage id="error.unknown" defaultMessage="Unknown error" />
            )}
          </h4>
          <pre className="g-text-sm" style={{ fontFamily: 'monospace' }}>
            {error?.stack}
          </pre>
        </div>
      )}
    </div>
  );
}

export { ErrorBoundary };
