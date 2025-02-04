import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  HelpTextQuery,
  HelpTextQueryVariables,
  HelpTitleQuery,
  HelpTitleQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import React, { useEffect } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from './ui/skeleton';

export function HelpTitle({ id, ...props }: { id: string } & React.HTMLProps<HTMLDivElement>) {
  const { loading, title, error } = useHelp(id, { titleOnly: true });
  if (error) return <Failed />;
  if (loading || !title) return <Skeleton className="g-inline">Loading</Skeleton>;
  return <span dangerouslySetInnerHTML={{ __html: title }} {...props} />;
}

export function HelpTextSkeleton({ includeTitle }: { includeTitle?: boolean }) {
  return (
    <div className="g-animate-pulse g-flex g-space-x-4">
      <div className="g-flex-1 g-space-y-6 g-py-1">
        {includeTitle && <div className="g-h-2 g-bg-slate-200 g-rounded"></div>}
        <div className="g-space-y-3">
          <div className="g-grid g-grid-cols-3 g-gap-4">
            <div className="g-h-2 g-bg-slate-200 g-rounded g-col-span-2"></div>
            <div className="g-h-2 g-bg-slate-200 g-rounded g-col-span-1"></div>
          </div>
          <div className="g-h-2 g-bg-slate-200 g-rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function HelpText({
  identifier,
  includeTitle,
  children,
  ...props
}: {
  identifier: string;
  includeTitle?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const { title, body, error, loading } = useHelp(identifier);

  return (
    <div {...props}>
      {loading && <HelpTextSkeleton includeTitle={includeTitle} />}
      {!loading && error && (
        <div style={{ textAlign: 'center' }}>
          <div>
            <Failed />
          </div>
        </div>
      )}
      {!loading && !error && (
        <>
          {includeTitle && <h3 dangerouslySetInnerHTML={{ __html: title ?? '' }}></h3>}
          {children}
          {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
        </>
      )}
    </div>
  );
}

const HELP_TEXT = /* GraphQL */ `
  query HelpText($identifier: String!, $locale: String) {
    help(identifier: $identifier, locale: $locale) {
      id
      identifier
      title
      body
    }
  }
`;

const HELP_TITLE = /* GraphQL */ `
  query HelpTitle($identifier: String!, $locale: String) {
    help(identifier: $identifier, locale: $locale) {
      id
      identifier
      title
    }
  }
`;

export function useHelp(helpIdentifier: string, { titleOnly }: { titleOnly?: boolean } = {}) {
  const { data, error, loading, load } = useQuery<
    HelpTextQuery | HelpTitleQuery,
    HelpTextQueryVariables | HelpTitleQueryVariables
  >(titleOnly ? HELP_TITLE : HELP_TEXT, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (helpIdentifier) {
      load({ keepDataWhileLoading: false, variables: { identifier: helpIdentifier } });
    }
  }, [helpIdentifier]);

  const { title, identifier, id } = data?.help || {};
  const body = data?.help && 'body' in data.help ? data.help.body : null;

  if (error) {
    console.error(`Unable to load help text for ${helpIdentifier}`, error);
  }

  return { title, body, identifier, id, error, loading: loading || !data };
}

export function Failed() {
  return (
    <div className="g-bg-red-600 g-rounded g-text-white g-p-1 g-px-2">
      <FormattedMessage id="phrases.failedToLoadData" />
    </div>
  );
}

export function HelpLine({
  title,
  id,
  icon,
  children,
  className,
}: {
  id?: string;
  title?: React.ReactNode;
  icon?: boolean | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const hasTitle = title || id;
  return (
    <Popover>
      <PopoverTrigger>
        {hasTitle && <>{title || <HelpTitle id={id ?? ''} />} </>}
        {icon && (typeof icon === 'boolean' ? <MdInfoOutline /> : icon)}
      </PopoverTrigger>
      <PopoverContent className={cn('g-prose g-w-96', className)}>
        {id && <HelpText identifier={id} />}
        {!id && children}
      </PopoverContent>
    </Popover>
  );
}
