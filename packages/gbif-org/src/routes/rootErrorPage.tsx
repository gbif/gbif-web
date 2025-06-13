import { ErrorImage } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { UnexpectedLoaderError } from '@/errors';
import { NotFoundPage } from '@/notFoundPage';
import React from 'react';
import { useRouteError } from 'react-router-dom';

export function RootErrorPage(): React.ReactElement {
  const error = useRouteError();

  if (error instanceof Error && error.message === '404') {
    return <NotFoundPage />;
  }

  if (error instanceof UnexpectedLoaderError) {
    // TODO: Handle
    console.error(error);
  }

  const url = typeof window !== 'undefined' ? window.location.href : 'Unknown URL';
  const body = `Thank you for reporting this issue. Please describe what happened..\n\n
\`\`\`
**Error message for diagnostics:**
URL: ${url}
\`\`\``;

  return (
    <div className="g-flex g-flex-col g-items-center g-justify-center g-text-center g-w-full g-h-full g-py-48 g-px-2 g-min-h-[80dvh] g-bg-white">
      <ErrorImage className="g-w-72 g-max-w-full g-mb-16" />
      <div className="g-max-w-full">
        <h1 className="g-mb-0 g-text-slate-500 g-font-bold g-text-lg">
          We're experiencing technical difficulties.
        </h1>

        <p className="g-text-slate-500 g-mt-2 g-w-[500px]">
          Our website is experiencing some unexpected downtime.
          <br />
          <br />
          We apologize for the inconvenience. We're working hard to get things back to normal as
          quickly as possible.
          {typeof window === 'object' && (
            <div className="g-mt-8">
              <Button asChild className="g-text-slate-500 g-mt-4">
                <a
                  target="_blank"
                  href={`https://github.com/gbif/gbif-web/issues/new?body=${encodeURIComponent(
                    body
                  )}`}
                >
                  Report the issue
                </a>
              </Button>
            </div>
          )}
        </p>
      </div>
    </div>
  );
}
