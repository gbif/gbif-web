// This page should not be added to the route config, as the alias handling route matches with a wildcard, and will render this page if no other route is found in contentful.

import { useConfig } from './config/config';
import { useDynamicNavigate } from '@/reactRouterPlugins';
import { SearchInputPresentation } from '@/routes/omniSearch/SearchInput';
import { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Message } from '@/components/message';

export function NotFoundPage() {
  const config = useConfig();
  const dynamicNavigate = useDynamicNavigate();
  const { formatMessage } = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="g-min-h-[70dvh] g-flex g-flex-col g-items-center g-pt-8 g-pb-16 g-px-4">
      {/* Image */}
      {config?.notFoundPageImageUrl && (
        <div className="g-w-full g-max-w-md">
          <img src={config.notFoundPageImageUrl} alt="" className="g-w-full g-h-auto" />
        </div>
      )}

      {/* Content */}
      <div className="g-max-w-lg g-text-center g-mt-2">
        <h1 className="g-text-5xl g-font-bold g-text-slate-300 g-mb-4">404</h1>
        <Message
          id="phrases.404Text"
          className="g-text-slate-600 g-text-base g-leading-relaxed [&_a]:g-text-primary-500 [&_a]:g-underline [&_a]:g-underline-offset-2 hover:[&_a]:g-text-primary-600"
        />

        {/* Search bar */}
        <form
          className="g-mt-8 g-w-full"
          onSubmit={(e) => {
            e.preventDefault();
            dynamicNavigate({
              pageId: 'omniSearch',
              searchParams: { q: inputRef.current?.value || '' },
            });
          }}
        >
          <SearchInputPresentation
            ref={inputRef}
            placeholder={formatMessage({ id: 'search.crossContentSearch.placeholder' })}
            className="g-text-base"
          />
        </form>
      </div>
    </main>
  );
}
