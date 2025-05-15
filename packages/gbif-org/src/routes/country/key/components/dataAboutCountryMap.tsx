import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { MapHeader } from './mapHeader';
import { MapWidget } from '@/components/maps/mapWidget';
import { CountryDetailAboutQuery, CountryDetailAboutQueryVariables } from '@/gql/graphql';
import { Country } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';

type DataAboutCountryMapProps = {
  countryCode: string;
};

export function DataAboutCountryMap({ countryCode }: DataAboutCountryMapProps) {
  const countryDetail = useQuery<CountryDetailAboutQuery, CountryDetailAboutQueryVariables>(
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
            <FormattedMessage id="TODO" defaultMessage="Data about Denmark" />
          </CardTitle>
          <MapHeader.Container>
            <MapHeader.Item pageId="occurrenceSearch" searchParams={{ country: countryCode }}>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutOccurrenceCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Occurrences" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutDatasetCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Datasets" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutCountryCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Countries and areas contribute data" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutPublisherCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="TODO" defaultMessage="Publishers" />
            </MapHeader.Item>
          </MapHeader.Container>
        </CardHeader>
        <MapWidget capabilitiesParams={{ country: countryCode }} />
      </Card>
    </section>
  );
}

const COUNTRY_DETAIL_QUERY = /* GraphQL */ `
  query CountryDetailAbout($isoCode: Country!) {
    countryDetail(isoCode: $isoCode) {
      aboutOccurrenceCount
      aboutDatasetCount
      aboutCountryCount
      aboutPublisherCount
    }
  }
`;
