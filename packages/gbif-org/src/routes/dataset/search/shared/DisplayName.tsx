import { Skeleton } from '@/components/ui/skeleton';
import { useConfig } from '@/contexts/config/config';
import React, { useEffect } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';

const CANCEL_REQUEST = 'CANCEL_REQUEST';

export function DisplayName({
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
  id: string | number;
  useHtml: boolean;
}) {
  const intl = useIntl();
  const { v1Endpoint, graphqlEndpoint } = useConfig();
  const [title, setTitle] = React.useState<string | number | React.ReactElement | undefined>(
    undefined
  );

  useEffect(() => {
    setTitle(undefined);
    const { promise, cancel } = getData({ id, intl, v1Endpoint, graphqlEndpoint });

    if (promise) {
      promise
        .then((result) => {
          if (result?.title) {
            setTitle(result.title);
          } else {
            setTitle('Unknown');
          }
        })
        .catch((err) => {
          if (err === CANCEL_REQUEST) return;
          setTitle('Unknown');
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

  return title ? (
    useHtml ? (
      <span dangerouslySetInnerHTML={{ __html: title.toString() }}></span>
    ) : (
      <span>{title}</span>
    )
  ) : (
    <span style={{ width: 100, display: 'inline-block', verticalAlign: 'top' }}>
      <Skeleton className="g-inline-block">Loading ...</Skeleton>
    </span>
  );
}

export function IdentityLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({ promise: Promise.resolve({ title: id.toString() }) })}
      id={id}
      useHtml={false}
    />
  );
}

function fetchWithCancel(url: string): {
  promise: Promise<Response>;
  cancel: (reason?: string) => void;
} {
  const controller = new AbortController();
  const signal = controller.signal;
  return {
    promise: fetch(url, { signal }),
    cancel: (reason?: string) => controller.abort(reason),
  };
}

export function PublisherLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id, graphqlEndpoint }) => {
        const { promise, cancel } = fetchWithCancel(`${graphqlEndpoint}?query=${encodeURIComponent(`query {item:organization(key: "${id}") {title}}`)}`);
        return {
          promise: promise
            .then((response) => response.json())
            .then((response) => ({ title: response.data.item.title })),
          cancel,
        };
      }}
      id={id}
      useHtml={false}
    />
  );
}

export function CountryLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({
        promise: Promise.resolve({
          title: <FormattedMessage id={`enums.countryCode.${id}`} defaultMessage={id.toString()} />,
        }),
      })}
      id={id}
      useHtml={false}
    />
  );
}

export function TypeStatusLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({
        promise: Promise.resolve({
          title: <FormattedMessage id={`enums.typeStatus.${id}`} defaultMessage={id.toString()} />,
        }),
      })}
      id={id}
      useHtml={false}
    />
  );
}

export function LicenceLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({
        promise: Promise.resolve({
          title: <FormattedMessage id={`enums.license.${id}`} defaultMessage={id.toString()} />,
        }),
      })}
      id={id}
      useHtml={false}
    />
  );
}

export function DatasetTypeLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({
        promise: Promise.resolve({
          title: <FormattedMessage id={`enums.datasetType.${id}`} defaultMessage={id.toString()} />,
        }),
      })}
      id={id}
      useHtml={false}
    />
  );
}
