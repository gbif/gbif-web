import { Skeleton } from '@/components/ui/skeleton';
import { Config, LanguageOption, useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { CANCEL_REQUEST } from '@/utils/fetchWithCancel';
import pkg from 'isomorphic-dompurify';
import React, { useEffect } from 'react';
import { IntlShape, useIntl } from 'react-intl';
const { sanitize } = pkg;

// Titles rendered as HTML are scientific names and similar, so only inline formatting is kept.
const TITLE_SANITIZE_OPTIONS = {
  ALLOWED_TAGS: ['i', 'em', 'b', 'strong', 'span'],
  ALLOWED_ATTR: [],
};

export type DisplayNameGetDataProps = {
  id: string | number | object;
  checklistKey?: string;
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
  checklistKey,
}: {
  getData: ({ id, intl, checklistKey, config }: DisplayNameGetDataProps) => DisplayNameResponseType;
  id: string | number | object;
  useHtml: boolean;
  checklistKey?: string;
}) {
  const intl = useIntl();
  const { locale: currentLocale } = useI18n();
  const config = useConfig();
  const [title, setTitle] = React.useState<string | number | React.ReactElement | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  // When the lookup fails we show the raw id, which must never be treated as HTML
  const [failed, setFailed] = React.useState<boolean>(false);

  useEffect(() => {
    if (typeof id === 'undefined') return;
    setLoading(true);
    setFailed(false);
    const { promise, cancel } = getData({ id, intl, checklistKey, config, currentLocale });

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
          setFailed(true);
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
  }, [id, useHtml, getData, checklistKey, config, intl, currentLocale]);

  if (loading) {
    return (
      <span style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <Skeleton className="g-inline-block">Loading ...</Skeleton>
      </span>
    );
  }

  if (title) {
    return useHtml && !failed && typeof title !== 'object' ? (
      <span
        dangerouslySetInnerHTML={{ __html: sanitize(title.toString(), TITLE_SANITIZE_OPTIONS) }}
      ></span>
    ) : (
      <span>{title}</span>
    );
  }
  return <span className="g-text-red-700">{id?.toString() || 'Failed to load'}</span>;
}
