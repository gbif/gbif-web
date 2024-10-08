import { FormattedMessage } from "react-intl";
import DisplayName from "./displayName";
import { fetchWithCancel } from "@/utils/fetchWithCancel";

export function IdentityLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({ promise: Promise.resolve({ title: id.toString() }) })}
      id={id}
      useHtml={false}
    />
  );
}

export function PublisherLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id, graphqlEndpoint }) => {
        const { promise, cancel } = fetchWithCancel(
          `${graphqlEndpoint}?query=${encodeURIComponent(
            `query {item:organization(key: "${id}") {title}}`
          )}`
        );
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
