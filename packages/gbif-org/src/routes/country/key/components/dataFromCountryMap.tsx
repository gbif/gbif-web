import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { MapHeader } from './mapHeader';
import { MapWidget } from '@/components/maps/mapWidget';
import { Country, CountryDetailFromQuery, CountryDetailFromQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';

type DataFromCountryMapProps = {
  countryCode: string;
};

export function DataFromCountryMap({ countryCode }: DataFromCountryMapProps) {
  const countryDetail = useQuery<CountryDetailFromQuery, CountryDetailFromQueryVariables>(
    COUNTRY_DETAIL_QUERY,
    {
      variables: { isoCode: countryCode as Country },
      forceLoadingTrueOnMount: true,
    }
  );

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="g-pb-4">
            <FormattedMessage id="TODO" defaultMessage="Data from Denmark" />
          </CardTitle>
          <MapHeader.Container>
            <MapHeader.Item
              pageId="occurrenceSearch"
              searchParams={{ publishingCountry: countryCode }}
            >
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.fromOccurrenceCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Occurrences" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.fromDatasetCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Datasets" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.fromCountryCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Countries and areas contribute data" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.fromPublisherCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Publishers" />
            </MapHeader.Item>
          </MapHeader.Container>
        </CardHeader>
        <MapWidget capabilitiesParams={{ publishingCountry: countryCode }} />
      </Card>
    </section>
  );
}

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
