import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { MapHeader } from './mapHeader';
import { MapWidget } from '@/components/maps/mapWidget';

type DataAboutCountryMapProps = {
  countryCode: string;
};

export function DataAboutCountryMap({ countryCode }: DataAboutCountryMapProps) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="g-pb-4">
            <FormattedMessage id="TODO" defaultMessage="Data about Denmark" />
          </CardTitle>
          <MapHeader.Container>
            <MapHeader.Item pageId="occurrenceSearch" searchParams={{ country: countryCode }}>
              <MapHeader.Count value={58836117} />
              <MapHeader.Text id="TODO" defaultMessage="Occurrences" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count value={1441} />
              <MapHeader.Text id="TODO" defaultMessage="Datasets" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count value={43} />
              <MapHeader.Text id="TODO" defaultMessage="Countries and areas contribute data" />
            </MapHeader.Item>

            <MapHeader.Item>
              <MapHeader.Count value={480} />
              <MapHeader.Text id="TODO" defaultMessage="Publishers" />
            </MapHeader.Item>
          </MapHeader.Container>
        </CardHeader>
        <MapWidget capabilitiesParams={{ country: countryCode }} />
      </Card>
    </section>
  );
}

const OCCURRENCE_COUNT_WITHIN_COUNTRY = /* GraphQL */ `
  query OccurrenceCountWithinCountry($countryCode: JSON!) {
    occurrenceSearch(predicate: { type: equals, value: $countryCode, key: "countryCode" }) {
      documents(size: 0) {
        total
      }
    }
  }
`;
