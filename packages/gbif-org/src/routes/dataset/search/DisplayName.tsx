import React, { Component, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export function DisplayName({
  getData,
  id,
  useHtml,
}: {
  getData: ({ id }: { id: string | number }) => {
    promise?: Promise<{ title: string; description: React.ReactElement }>;
    result?: { title: string; description: React.ReactElement };
    cancel: Function;
  };
  id: string | number;
  useHtml: boolean;
}) {
  const intl = useIntl();
  const [title, setTitle] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    let canceled = false;
    let { promise, result, cancel } = getData({ id });

    if (promise) {
      promise
        .then((result) => {
          if (canceled) return;
          if (result?.title) {
            setTitle(result.title);
          } else {
            setTitle('unknown');
          }
        })
        .catch((err) => {
          if (canceled) return;
          setTitle('unknown');
        });
    } else if (result) {
      setTitle(result.title);
    } else {
      setTitle('unknown');
    }

    return () => {
      if (typeof cancel === 'function') {
        cancel();
      }
    };
  }, [id, useHtml]);

  return title ? (
    useHtml ? (
      <span dangerouslySetInnerHTML={{ __html: title }}></span>
    ) : (
      <span>{title}</span>
    )
  ) : (
    <span style={{ width: 100, display: 'inline-block', verticalAlign: 'top' }}>
      <span>loading...</span>
    </span>
  );
}

export function PublisherLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({
        promise: fetch(`https://api.gbif.org/v1/organization/${id}`)
          .then((response) => response.json())
          .then((response) => ({ title: response.title })),
        cancel: () => {},
      })}
      id={id}
      useHtml={false}
    />
  );
}

export function CountryLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({result: {title: <FormattedMessage id={`enums.countryCode.${id}`} defaultMessage={id} />}})}
      id={id}
      useHtml={false}
    />
  );
}

export function TypeStatusLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({result: {title: <FormattedMessage id={`enums.typeStatus.${id}`} defaultMessage={id} />}})}
      id={id}
      useHtml={false}
    />
  );
}