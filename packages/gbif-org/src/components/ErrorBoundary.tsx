import { cn } from '@/utils/shadcn';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ErrorImage } from './icons/icons';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  invalidateOn?: string | number | boolean | object | null;
  type?: 'PAGE' | 'BLOCK';
  className?: string;
  title?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showReportButton?: boolean;
  showStackTrace?: boolean;
  debugTitle?: string;
  additionalDebugInfo?: string;
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
        title={this.props.title}
        errorMessage={this.props.errorMessage}
        showReportButton={this.props.showReportButton}
        showStackTrace={this.props.showStackTrace}
        debugTitle={this.props.debugTitle}
        additionalDebugInfo={this.props.additionalDebugInfo}
      />
    );
  }
}

export function ErrorComponent({
  error,
  type,
  className,
  title,
  errorMessage,
  additionalDebugInfo,
  showReportButton = true,
  showStackTrace,
  debugTitle,
}: Omit<ErrorBoundaryProps, 'invalidateOn' | 'children'> & { error: Error }): React.ReactElement {
  const [showStack, setShowStack] = useState(false);
  const displayTitle = title ?? (
    <FormattedMessage id="error.generic" defaultMessage="Something went wrong" />
  );
  let displayDescription = errorMessage;
  if (!displayDescription && type === 'PAGE') {
    displayDescription = (
      <FormattedMessage
        id="error.genericDescription"
        defaultMessage="An unexpected error occurred. Please try again later."
      />
    );
  }

  const commonContent = (
    <div className="g-max-w-full">
      <h1 className="g-mb-0 g-text-slate-500 g-font-bold">{displayTitle}</h1>
      {displayDescription && (
        <p className="g-text-slate-500 g-mt-2 g-text-sm">{displayDescription}</p>
      )}
      <div className="g-flex g-flex-row g-gap-2 g-my-4">
        {showReportButton && (
          <Button asChild size="sm">
            <a
              target="_blank"
              href={`https://github.com/gbif/gbif-web/issues/new?body=${encodeURIComponent(
                generateGithubIssueBody(error, debugTitle, additionalDebugInfo)
              )}`}
            >
              <FormattedMessage id="error.report" defaultMessage="Report issue" />
            </a>
          </Button>
        )}
        <Button variant="ghost" size="sm" className="g-text-slate-500" asChild>
          <a
            href=""
            onClick={() => {
              window?.location?.reload();
            }}
            className="g-text-sm g-text-slate-500"
          >
            <FormattedMessage id="error.reloadPage" defaultMessage="Try to reload page" />
          </a>
        </Button>
        {showStackTrace && (
          <Button
            variant="ghost"
            size="sm"
            className="g-text-slate-500"
            onClick={() => setShowStack(!showStack)}
          >
            <FormattedMessage
              id={showStack ? 'error.hideDetails' : 'error.showDetails'}
              defaultMessage={showStack ? 'Hide details' : 'Show details'}
            />
          </Button>
        )}
      </div>
      {error?.stack && showStack && (
        <div className="g-max-w-full g-flex g-flex-col g-text-start g-max-h-96 h-overflow-auto g-p-2 g-bg-slate-50 g-border g-rounded">
          <h4 className="g-my-4">
            {error?.message || (
              <FormattedMessage id="error.unknown" defaultMessage="Unknown error" />
            )}
          </h4>
          <pre className="g-text-sm g-overflow-auto" style={{ fontFamily: 'monospace' }}>
            {error?.stack}
          </pre>
        </div>
      )}
    </div>
  );

  if (type === 'BLOCK') {
    return (
      <div className={cn('g-flex g-gap-4 g-py-4 g-items-start g-p-2', className)}>
        <ErrorImage className="g-w-24 g-flex-none" />
        <div className="g-flex-1 g-w-96">{commonContent}</div>
      </div>
    );
  }

  return (
    <div className="g-flex g-flex-col g-items-center g-justify-center g-text-center g-w-full g-h-full g-py-48 g-px-2 g-min-h-[80dvh] g-bg-white">
      <ErrorImage className="g-w-72 g-max-w-full" />
      {commonContent}
    </div>
  );
}

function generateGithubIssueBody(error: Error, title?: string, additionalInfo?: string): string {
  const url = window?.location?.href || 'Unknown URL';
  return `Thank you for reporting this issue. Please describe what happened..



  
  -----------
\n\n\`\`\`
**Error message for diagnostics:**
${title ?? 'Unknown error'}
${error.message ?? 'No message'}

${error.stack || 'No stack trace available'}
\`\`\`

**Additional Info:**
${additionalInfo || 'No additional information provided.'}

**URL:**
${url}

**Note:** Please do not delete the stack trace or additional information when submitting this issue.`;
}

export function ErrorBlock(props) {
  return <ErrorComponent {...props} type="BLOCK" />;
}

export function ErrorPage(props) {
  return <ErrorComponent {...props} type="PAGE" />;
}

export { ErrorBoundary };
