import React, { useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from './ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/shadcn';
import { MdInfoOutline } from 'react-icons/md';

export function HelpTitle({
  id,
  ...props
}: { id: string;} & React.HTMLProps<HTMLDivElement>) {
  const { loading, title, error } = useHelp(id, {titleOnly: true});
  let renderedTitle = title;
  if (error) return <Failed />
  if (loading || !title) return <Skeleton className="inline">Loading</Skeleton>
  return <span dangerouslySetInnerHTML={{__html: renderedTitle}} {...props}></span>;
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
      {loading && (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      )}
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
          <div dangerouslySetInnerHTML={{ __html: body }}></div>
        </>
      )}
    </div>
  );
}

const HELP_TEXT = `
query HelpText($identifier: String!, $locale: String) {
  help(identifier: $identifier, locale: $locale) {
    title
    body
  }
}
`;

const HELP_TITLE = `
query HelpTitle($identifier: String!, $locale: String) {
  help(identifier: $identifier, locale: $locale) {
    title
  }
}
`;

export function useHelp(helpIdentifier: string, { titleOnly }: { titleOnly?: boolean } = {}) {
  const { data, error, loading, load } = useQuery(titleOnly ? HELP_TITLE : HELP_TEXT, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (helpIdentifier) {
      load({ keepDataWhileLoading: false, variables: { identifier: helpIdentifier } });
    }
  }, [helpIdentifier]);
  const { title, body, identifier, id } = data?.help || {};

  if (error) {
    console.error(`Unable to load help text for ${helpIdentifier}`, error);
  }

  return { title, body, identifier, id, error, loading: loading || !data };
}

export function Failed() {
  return (
    <div className="bg-red-600 rounded text-white p-1 px-2">
      <FormattedMessage id="phrases.failedToLoadData" />
    </div>
  );
}

export function HelpLine({
  title,
  id,
  icon,
  className
}: {
  id: string;
  title?: React.ReactNode;
  icon?: boolean | React.ReactNode;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        {title || <HelpTitle id={id} />} {icon && (typeof icon === 'boolean' ? <MdInfoOutline /> : icon)}
      </PopoverTrigger>
      <PopoverContent className={cn(
        "prose w-96",
        className
      )}
      >
        <HelpText identifier={id} />
      </PopoverContent>
    </Popover>
  );
}