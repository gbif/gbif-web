import { Skeleton } from '@/components/ui/skeleton';
import { Config, LanguageOption, useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { CANCEL_REQUEST } from '@/utils/fetchWithCancel';
import React, { useEffect } from 'react';
import { IntlShape, useIntl } from 'react-intl';

export type DisplayNameGetDataProps = {
  id: string | number | object;
  intl: IntlShape;
  config: Config;
  currentLocale: LanguageOption;
};

export type DisplayNameResponseType = {
  promise?: Promise<{
    title: string | number | React.ReactElement;
    description?: string | React.ReactElement;
  }>;
  cancel?: (reason: string) => void;
};

export default function DisplayName({
  getData,
  id,
  useHtml,
}: {
  getData: ({ id, intl, config }: DisplayNameGetDataProps) => DisplayNameResponseType;
  id: string | number | object;
  useHtml: boolean;
}) {
  const intl = useIntl();
  const { locale: currentLocale } = useI18n();
  const config = useConfig();
  const [title, setTitle] = React.useState<string | number | React.ReactElement | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (typeof id === 'undefined') return;
    setLoading(true);
    const { promise, cancel } = getData({ id, intl, config, currentLocale });

    if (promise) {
      promise
        .then((result) => {
          setLoading(false);
          if (result?.title) {
            setTitle(result.title);
          } else {
            setTitle('Unknown');
          }
        })
        .catch((err) => {
          if (err === CANCEL_REQUEST) return;
          setTitle(id?.toString() || 'Failed to load');
          setLoading(false);
        });
    } else {
      setTitle('Unknown');
    }

    return () => {
      if (typeof cancel === 'function') {
        cancel(CANCEL_REQUEST);
      }
      setTitle(undefined);
    };
  }, [id, useHtml, getData, config, intl, currentLocale]);

  if (loading) {
    return (
      <span style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <Skeleton className="g-inline-block">Loading ...</Skeleton>
      </span>
    );
  }

  if (title) {
    return useHtml ? (
      <span dangerouslySetInnerHTML={{ __html: title.toString() }}></span>
    ) : (
      <span>{title}</span>
    );
  }
  return <span className="g-text-red-700">{id?.toString() || 'Failed to load'}</span>;
}
