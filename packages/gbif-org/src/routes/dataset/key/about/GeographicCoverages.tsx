import { HyperText } from '@/components/hyperText';
import Properties, { Term, Value } from '@/components/properties';
import { FormattedMessage } from 'react-intl';

export function GeographicCoverages({ geographicCoverages, ...props }) {
  return (
    <>
      {geographicCoverages.map((coverage, idx) => (
        <GeographicCoverage coverage={coverage} key={idx} />
      ))}
    </>
  );
}

function GeographicCoverage({ coverage }) {
  let geoJSON;
  if (
    coverage?.boundingBox?.minLatitude > -85 &&
    coverage?.boundingBox?.maxLatitude < 85 &&
    coverage?.boundingBox?.minLatitude < coverage?.boundingBox?.maxLatitude
  ) {
    const { minLongitude, minLatitude, maxLongitude, maxLatitude } = coverage.boundingBox;
    geoJSON = {
      type: 'Polygon',
      coordinates: [
        [
          [minLongitude, minLatitude],
          [maxLongitude, minLatitude],
          [maxLongitude, maxLatitude],
          [minLongitude, maxLatitude],
          [minLongitude, minLatitude],
        ],
      ],
    };
  }

  let Bbox;

  if (coverage?.boundingBox?.minLatitude) {
    const { minLongitude, minLatitude, maxLongitude, maxLatitude } = coverage.boundingBox;
    Bbox = (
      <Properties useDefaultTermWidths>
        <Term>
          <FormattedMessage id="dataset.latitude" />
        </Term>
        <Value>
          <FormattedMessage
            id="intervals.description.between"
            values={{ from: minLatitude, to: maxLatitude }}
          />
        </Value>
        <Term>
          <FormattedMessage id="dataset.longitude" />
        </Term>
        <Value>
          <FormattedMessage
            id="intervals.description.between"
            values={{ from: minLongitude, to: maxLongitude }}
          />
        </Value>
      </Properties>
    );
  } else {
    Bbox = null;
  }

  return (
    <Properties useDefaultTermWidths>
      <Term>
        <FormattedMessage id="dataset.description" />
      </Term>
      <Value>
        <HyperText className="g-prose" text={coverage.description} fallback />
      </Value>
      {geoJSON && (
        <>
          <Term></Term>
          <Value style={{ width: '100%' }}>
            <img
              style={{ marginTop: 24, maxWidth: '100%', marginBottom: 24 }}
              src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/geojson(${encodeURIComponent(
                JSON.stringify(geoJSON)
              )})/auto/600x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
            />
            {Bbox}
          </Value>
        </>
      )}
      {!geoJSON && (
        <>
          <Term>
            <FormattedMessage id="dataset.boundingBox" />
          </Term>
          <Value>{Bbox}</Value>
        </>
      )}
    </Properties>
  );
}
