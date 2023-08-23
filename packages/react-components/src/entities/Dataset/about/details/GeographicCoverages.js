import { jsx } from "@emotion/react";
import React from "react";
import { Properties, HyperText } from "../../../../components";
import { FormattedMessage, FormattedDate } from "react-intl";
import * as sharedStyles from '../../../shared/styles';

const { Term: T, Value: V } = Properties;

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
    const {
      minLongitude,
      minLatitude,
      maxLongitude,
      maxLatitude,
    } = coverage.boundingBox;
    geoJSON = {
      type: "Polygon",
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
    const {
      minLongitude,
      minLatitude,
      maxLongitude,
      maxLatitude,
    } = coverage.boundingBox;
    Bbox = <Properties horizontal>
      <T><FormattedMessage id="dataset.latitude" /></T>
      <V>
        <FormattedMessage id="intervals.description.between" values={{ from: minLatitude, to: maxLatitude }} />
      </V>
      <T><FormattedMessage id="dataset.longitude" /></T>
      <V>
        <FormattedMessage id="intervals.description.between" values={{ from: minLongitude, to: maxLongitude }} />
      </V>
    </Properties>
  } else {
    Bbox = null;
  }

  return (
    <Properties css={sharedStyles.cardProperties}>
      <T><FormattedMessage id="dataset.description" /></T>
      <V><HyperText text={coverage.description} /></V>
      {geoJSON && (
        <>
          <T></T>
          <V style={{ width: "100%" }}>
            <img
              style={{ marginTop: 24, maxWidth: "100%" }}
              src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/geojson(${encodeURIComponent(
                JSON.stringify(geoJSON)
              )})/auto/600x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
            />
            {Bbox}
          </V>
        </>
      )}
      {!geoJSON && <>
        <T><FormattedMessage id="dataset.boundingBox" /></T>
        <V>{Bbox}</V>
      </>}
    </Properties>
  );
}
