import { MapWidget } from '@/components/maps/mapWidget';
import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Country, CountryDetailAboutQuery, CountryDetailAboutQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage } from 'react-intl';
import { MapHeader } from './mapHeader';

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
            <FormattedMessage
              id="country.dataAboutCountry"
              values={{
                TRANSLATED_COUNTRY: <FormattedMessage id={`enums.countryCode.${countryCode}`} />,
              }}
            />
          </CardTitle>
          <MapHeader.Container>
            <MapHeader.Item pageId="occurrenceSearch" searchParams={{ country: countryCode }}>
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutOccurrenceCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text
                id="country.counts.occurrences"
                values={{
                  NUMBER: countryDetail.data?.countryDetail?.aboutOccurrenceCount,
                }}
              />
            </MapHeader.Item>

            <MapHeader.Item
              pageId="occurrenceSearch"
              searchParams={{
                view: 'dashboard',
                country: countryCode,
                layout: 'W1t7ImlkIjoiNjR6NXQiLCJwIjp7fSwidCI6ImRhdGFzZXRLZXkifV1d',
              }}
            >
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutDatasetCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text
                id="country.counts.datasets"
                values={{
                  NUMBER: countryDetail.data?.countryDetail?.aboutDatasetCount,
                }}
              />
            </MapHeader.Item>

            <MapHeader.Item
              pageId="occurrenceSearch"
              searchParams={{
                view: 'dashboard',
                country: countryCode,
                layout:
                  'W1t7ImlkIjoidjF5bmwiLCJwIjp7InZpZXciOiJUQUJMRSJ9LCJ0cmFuc2xhdGlvbiI6ImZpbHRlcnMucHVibGlzaGluZ0NvdW50cnlDb2RlLm5hbWUiLCJ0IjoicHVibGlzaGluZ0NvdW50cnkifV1d',
              }}
            >
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutCountryCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text id="country.counts.countriesAndAreasContributeData" />
            </MapHeader.Item>

            <MapHeader.Item
              pageId="occurrenceSearch"
              searchParams={{
                view: 'dashboard',
                country: countryCode,
                layout:
                  'W1t7ImlkIjoiZnBtNDEiLCJwIjp7fSwidHJhbnNsYXRpb24iOiJmaWx0ZXJzLnB1Ymxpc2hlcktleS5uYW1lIiwidCI6InB1Ymxpc2hpbmdPcmcifV1d',
              }}
            >
              <MapHeader.Count
                value={countryDetail.data?.countryDetail?.aboutPublisherCount}
                loading={countryDetail.loading}
              />
              <MapHeader.Text
                id="country.counts.publishers"
                values={{
                  NUMBER: countryDetail.data?.countryDetail?.aboutPublisherCount,
                }}
              />
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
