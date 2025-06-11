import { MapWidget } from '@/components/maps/mapWidget';
import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Country, CountryDetailFromQuery, CountryDetailFromQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage } from 'react-intl';
import { MapHeader } from './mapHeader';

const COUNTRY_DETAIL_QUERY = /* GraphQL */ `
  query CountryDetailFrom($isoCode: Country!) {
    countryDetail(isoCode: $isoCode) {
      fromOccurrenceCount
      fromDatasetCount
      fromCountryCount
      fromPublisherCount
    }
  }
`;

export function useFromCountryDetails(countryCode: string) {
  return useQuery<CountryDetailFromQuery, CountryDetailFromQueryVariables>(COUNTRY_DETAIL_QUERY, {
    variables: { isoCode: countryCode as Country },
    forceLoadingTrueOnMount: true,
  });
}

type DataFromCountryMapPresentationProps = {
  countryCode: string;
  fromCountryDetails: CountryDetailFromQuery['countryDetail'];
  isLoading: boolean;
};

export function DataFromCountryMapPresentation({
  countryCode,
  fromCountryDetails,
  isLoading,
}: DataFromCountryMapPresentationProps) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="g-pb-4">
            <FormattedMessage
              id="country.dataFrom"
              values={{
                TRANSLATED_COUNTRY: <FormattedMessage id={`enums.countryCode.${countryCode}`} />,
              }}
            />
          </CardTitle>
          <MapHeader.Container>
            <MapHeader.Item
              pageId="occurrenceSearch"
              searchParams={{ publishingCountry: countryCode }}
            >
              <MapHeader.Count
                value={fromCountryDetails?.fromOccurrenceCount}
                loading={isLoading}
              />
              <MapHeader.Text
                id="country.counts.publishedOccurrences"
                values={{
                  NUMBER: fromCountryDetails?.fromOccurrenceCount,
                }}
              />
            </MapHeader.Item>

            <MapHeader.Item
              pageId="datasetSearch"
              searchParams={{ publishingCountry: countryCode }}
            >
              <MapHeader.Count value={fromCountryDetails?.fromDatasetCount} loading={isLoading} />
              <MapHeader.Text
                id="country.counts.publishedDatasets"
                values={{
                  NUMBER: fromCountryDetails?.fromDatasetCount,
                }}
              />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count value={fromCountryDetails?.fromCountryCount} loading={isLoading} />
              <MapHeader.Text
                id="country.counts.countriesAndAreasCoveredByDataFrom"
                values={{
                  TRANSLATED_COUNTRY: <FormattedMessage id={`enums.countryCode.${countryCode}`} />,
                }}
              />
            </MapHeader.Item>

            <MapHeader.Item pageId="publisherSearch" searchParams={{ country: countryCode }}>
              <MapHeader.Count value={fromCountryDetails?.fromPublisherCount} loading={isLoading} />
              <MapHeader.Text
                id="country.counts.publishersFrom"
                values={{
                  TRANSLATED_COUNTRY: <FormattedMessage id={`enums.countryCode.${countryCode}`} />,
                }}
              />
            </MapHeader.Item>
          </MapHeader.Container>
        </CardHeader>
        <MapWidget capabilitiesParams={{ publishingCountry: countryCode }} />
      </Card>
    </section>
  );
}

type DataFromCountryMapProps = {
  countryCode: string;
};

export function DataFromCountryMap({ countryCode }: DataFromCountryMapProps) {
  const { data, loading } = useFromCountryDetails(countryCode);

  return (
    <DataFromCountryMapPresentation
      countryCode={countryCode}
      fromCountryDetails={data?.countryDetail}
      isLoading={loading}
    />
  );
}
