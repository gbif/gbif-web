import React, { Component, useEffect } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';

export function DisplayName({
  getData,
  id,
  useHtml,
}: {
  getData: ({ id, intl }: { id: string | number, intl: IntlShape }) => {
    promise?: Promise<{ title: string; description?: React.ReactElement }>;
    result?: { title: string | number; description?: React.ReactElement };
    cancel?: () => void;
  };
  id: string | number;
  useHtml: boolean;
}) {
  const intl = useIntl();
  const [title, setTitle] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    let canceled = false;
    let { promise, result, cancel } = getData({ id, intl });

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
  }, [id, useHtml, intl, getData]);

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

export function IdentityLabel({ id }: { id: string }) {
  return (
    <DisplayName getData={({ id }) => ({result: {title: id}})}
      id={id}
      useHtml={false}
    />
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

export function LicenceLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({result: {title: <FormattedMessage id={`enums.license.${id}`} defaultMessage={id} />}})}
      id={id}
      useHtml={false}
    />
  );
}

export function DatasetTypeLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({result: {title: <FormattedMessage id={`enums.datasetType.${id}`} defaultMessage={id} />}})}
      id={id}
      useHtml={false}
    />
  );
}