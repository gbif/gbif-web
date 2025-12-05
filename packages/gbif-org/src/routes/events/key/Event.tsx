import { DataHeader } from '@/components/dataHeader';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, GenericFeature, Location } from '@/components/highlights';
import { GeoJsonMap } from '@/components/maps/geojsonMap';
import { FormattedDateRange } from '@/components/message';
import Properties, { Property } from '@/components/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useMemo } from 'react';
import { MdEvent, MdLocationOn } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

interface EventProps {
  getEventLink: (datasetKey: string, eventId: string) => string;
  getSearchPageLink?: string;
  event: {
    eventID: ID;
    parentEventID?: ID;
    eventType?: {
      concept: string;
    };
    eventName?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
    countryCode?: string;
    datasetKey: ID;
    datasetTitle?: string;
    year?: number;
    month?: number;
    eventDate?: string;
    occurrenceCount?: number;
    measurementOrFactTypes?: string[];
    sampleSizeUnit?: string;
    sampleSizeValue?: number;
    samplingProtocol?: string;
    eventTypeHierarchyJoined?: string;
    eventHierarchyJoined?: string;
    eventTypeHierarchy?: string[];
    eventHierarchy?: string[];
    decimalLatitude?: number;
    decimalLongitude?: number;
    locality?: string;
    stateProvince?: string;
    locationID?: string;
    wktConvexHull?: string;
    temporalCoverage?: {
      gte?: string;
      lte?: string;
    };
  };
  eventSearch?: {
    facet: {
      eventTypeHierarchyJoined: Array<{
        key: string;
        count: number;
      }>;
    };
  };
}

const AboutContent = () => (
  <div>
    <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
      <h3>What is a sampling event?</h3>
      <p>
        A sampling event represents a specific occurrence in time and space where biological
        sampling activities took place. Events can be hierarchical and may contain multiple
        occurrences or sub-events.
      </p>
    </div>
  </div>
);

// Helper function to parse WKT geometry (supports both POINT and POLYGON)
function parseWktGeometry(
  wkt: string
): { type: 'Point' | 'Polygon'; coordinates: number[] | number[][][] } | null {
  try {
    // Check if it's a POINT
    const pointMatch = wkt.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (pointMatch) {
      const [, x, y] = pointMatch;
      return {
        type: 'Point',
        coordinates: [Number(x), Number(y)],
      };
    }

    // Check if it's a POLYGON
    const polygonMatch = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i);
    if (polygonMatch) {
      const coordsString = polygonMatch[1];
      const coordPairs = coordsString.split(',').map((pair) => {
        const [x, y] = pair.trim().split(/\s+/).map(Number);
        return [x, y];
      });

      return {
        type: 'Polygon',
        coordinates: [coordPairs],
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing WKT geometry:', error);
    return null;
  }
}

const ApiContent = ({ eventID, datasetKey }: { eventID?: string; datasetKey?: string }) => (
  <div className="g-text-sm g-prose">
    <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
      <h3>API Access</h3>
      <p>Access event data programmatically through the GBIF API.</p>
    </div>
    <h4>Examples</h4>
    <Card className="g-p-2 g-mb-2">
      Single event <br />
      <a href={`https://api.gbif.org/v1/event/${eventID}?datasetKey=${datasetKey}`}>
        https://api.gbif.org/v1/event/{eventID}?datasetKey={datasetKey}
      </a>
    </Card>
    <Card className="g-p-2 g-mb-2">
      Search events <br />
      <a href={`https://api.gbif.org/v1/event/search?datasetKey=${datasetKey}`}>
        https://api.gbif.org/v1/event/search?datasetKey={datasetKey}
      </a>
    </Card>
  </div>
);

export function Event({ event, eventSearch, getEventLink }: EventProps) {
  // Create title from eventType and eventID
  const eventTypeDisplay = event.eventType?.concept || 'Event';
  const title = `${eventTypeDisplay}: ${event.eventID}`;

  const geoJson = useMemo(() => {
    const wktGeometry = event.wktConvexHull ? parseWktGeometry(event.wktConvexHull) : null;

    if (wktGeometry) {
      return {
        type: 'Feature',
        geometry: wktGeometry,
        properties: {},
      };
    }

    if (event.decimalLatitude && event.decimalLongitude) {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.decimalLongitude, event.decimalLatitude],
        },
        properties: {},
      };
    }

    return null;
  }, [event.wktConvexHull, event.decimalLatitude, event.decimalLongitude]);

  return (
    <article>
      {/* <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent eventID={event.eventID} datasetKey={event.datasetKey} />}
      /> */}

      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle
            secondary={
              event.eventDate ? (
                <FormattedDateRange date={event.eventDate} />
              ) : (
                <FormattedMessage id="phrases.unknownDate" />
              )
            }
          >
            <FormattedMessage id="event.header.event" defaultMessage="Event" />
          </ArticlePreTitle>

          <ArticleTitle>{title}</ArticleTitle>

          {event.eventName && (
            <div className="g-text-lg g-text-slate-600 g-mb-4">{event.eventName}</div>
          )}

          <HeaderInfo>
            <HeaderInfoMain>
              <FeatureList>
                {event.eventDate && (
                  <GenericFeature>
                    <MdEvent />
                    <FormattedDateRange date={event.eventDate} />
                  </GenericFeature>
                )}

                {event.countryCode && (
                  <Location countryCode={event.countryCode} city={event.stateProvince} />
                )}

                {event.locality && (
                  <GenericFeature>
                    <MdLocationOn />
                    <span>{event.locality}</span>
                  </GenericFeature>
                )}

                {event.occurrenceCount !== undefined && event.occurrenceCount > 0 && (
                  <GenericFeature>
                    <span>
                      <FormattedMessage
                        id="counts.nOccurrences"
                        values={{ total: event.occurrenceCount }}
                        defaultMessage="{total} occurrences"
                      />
                    </span>
                  </GenericFeature>
                )}

                {/* {event.datasetTitle && (
                  <GenericFeature>
                    <MdDataset />
                    <span>{event.datasetTitle}</span>
                  </GenericFeature>
                )} */}
              </FeatureList>
            </HeaderInfoMain>
          </HeaderInfo>
        </ArticleTextContainer>
      </PageContainer>

      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <Card className="g-mb-4">
            <CardHeader>
              <CardTitle>
                <FormattedMessage
                  id="phrases.headers.eventDetails"
                  defaultMessage="Event Details"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Properties>
                <Property labelId="occurrenceFieldNames.eventID" value={event.eventID} />

                {event.parentEventID && (
                  <Property
                    labelId="occurrenceFieldNames.parentEventID"
                    value={event.parentEventID}
                    formatter={(value) => (
                      <Link
                        to={getEventLink(event.datasetKey, event.parentEventID)}
                        className="g-text-blue-600 g-underline"
                      >
                        {value}
                      </Link>
                    )}
                  />
                )}

                {event.eventType?.concept && (
                  <Property labelId="Event type" value={event.eventType.concept} />
                )}

                {event.eventTypeHierarchy && event.eventTypeHierarchy.length > 0 && (
                  <Property
                    labelId="Event type hierarchy"
                    value={event.eventTypeHierarchy.join(' > ')}
                  />
                )}

                {event.temporalCoverage && (
                  <Property
                    labelId="Temporal coverage"
                    value={`${event.temporalCoverage.gte || ''} - ${
                      event.temporalCoverage.lte || ''
                    }`.trim()}
                  />
                )}

                {(event.sampleSizeValue || event.sampleSizeUnit) && (
                  <Property
                    labelId="occurrenceFieldNames.sampleSize"
                    value={`${event.sampleSizeValue || ''} ${event.sampleSizeUnit || ''}`.trim()}
                  />
                )}
              </Properties>

              <div className="g-mt-6">
                <Button variant="outline" asChild>
                  <EventLink eventId={event.eventID} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="g-mb-4">
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="phrases.headers.location" defaultMessage="Location" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Map component */}
              <div className="g-mb-6">
                {geoJson ? (
                  <GeoJsonMap
                    geoJson={geoJson}
                    initialCenter={[0, 0]}
                    initialZoom={6}
                    rasterStyle="gbif-natural"
                    height="350px"
                  />
                ) : (
                  <div className="g-h-64 g-bg-gray-100 g-rounded g-flex g-items-center g-justify-center g-text-gray-500">
                    <span>No location data available</span>
                  </div>
                )}
              </div>

              <Properties>
                <Property labelId="occurrenceFieldNames.locationID" value={event.locationID} />

                {event.countryCode && (
                  <Property labelId="occurrenceFieldNames.country" value={event.countryCode}>
                    <FormattedMessage
                      id={`enums.countryCode.${event.countryCode}`}
                      defaultMessage={event.countryCode}
                    />
                  </Property>
                )}

                <Property
                  labelId="occurrenceFieldNames.stateProvince"
                  value={event.stateProvince}
                />

                <Property labelId="occurrenceFieldNames.locality" value={event.locality} />

                <Property
                  labelId="occurrenceFieldNames.decimalLatitude"
                  value={event.decimalLatitude}
                />

                <Property
                  labelId="occurrenceFieldNames.decimalLongitude"
                  value={event.decimalLongitude}
                />
              </Properties>
            </CardContent>
          </Card>
        </ArticleTextContainer>
      </ArticleContainer>
    </article>
  );
}

// a component to take the current url, but remove the entity search parameter and add the eventId parameter
export function EventLink({ eventId, className }: { eventId?: string; className?: string }) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('entity');
  if (eventId) {
    searchParams.set('eventId', eventId);
  }

  return (
    <Link
      to={{
        pathname: window.location.pathname,
        search: searchParams.toString(),
      }}
      className={className}
    >
      <FormattedMessage id="event.viewEvent" defaultMessage="View child events" />
    </Link>
  );
}
