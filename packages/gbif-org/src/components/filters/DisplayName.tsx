import { Skeleton } from '@/components/ui/skeleton';
import { useConfig } from '@/config/config';
import { CANCEL_REQUEST } from '@/utils/fetchWithCancel';
import React, { useEffect } from 'react';
import { IntlShape, useIntl } from 'react-intl';

export default function DisplayName({
  getData,
  id,
  useHtml,
}: {
  getData: ({
    id,
    intl,
    v1Endpoint,
    graphqlEndpoint,
  }: {
    id: string | number | object;
    intl: IntlShape;
    v1Endpoint: string;
    graphqlEndpoint: string;
  }) => {
    promise?: Promise<{
      title: string | number | React.ReactElement;
      description?: string | React.ReactElement;
    }>;
    cancel?: (reason: string) => void;
  };
  id: string | number | object;
  useHtml: boolean;
}) {
  const intl = useIntl();
  const { v1Endpoint, graphqlEndpoint } = useConfig();
  const [title, setTitle] = React.useState<string | number | React.ReactElement | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (typeof id === 'undefined') return;
    setLoading(true);
    const { promise, cancel } = getData({ id, intl, v1Endpoint, graphqlEndpoint });

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
          setTitle('Unknown');
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
  }, [id, useHtml, intl, getData, v1Endpoint, graphqlEndpoint]);

  if (loading) {
    return (
      <span style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <Skeleton className="g-inline-block">Loading ...</Skeleton>
      </span>
    );
  }

  if (title) {
    return (
      useHtml ? (
        <span dangerouslySetInnerHTML={{ __html: title.toString() }}></span>
      ) : (
        <span>{title}</span>
      )
    )
  }
  return <span className="g-text-red-700">
    {id.toString()}
  </span>
}
