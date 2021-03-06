import { jsx } from '@emotion/react';
import React from "react";
import { Properties } from "../../../../components";
import { FormattedMessage, FormattedDate } from "react-intl";

const { Term: T, Value: V } = Properties;

export function GeographicCoverages({
  geographicCoverages,
  ...props
}) {
  return <>
    {geographicCoverages.map(coverage => <GeographicCoverage coverage={coverage} />)}
  </>
}

function GeographicCoverage({coverage}) {
  let geoJSON;
  if (coverage?.boundingBox?.minLatitude > -85 && coverage?.boundingBox?.maxLatitude < 85) {
    const { minLongitude, minLatitude, maxLongitude, maxLatitude } = coverage.boundingBox;
    geoJSON = {
      "type": "Polygon",
      "coordinates": [
        [
          [
            minLongitude,
            minLatitude
          ],
          [
            maxLongitude,
            minLatitude
          ],
          [
            maxLongitude,
            maxLatitude
          ],
          [
            minLongitude,
            maxLatitude
          ],
          [
            minLongitude,
            minLatitude
          ]
        ]
      ]
    };
  }
  return <Properties>
    <T>Description</T>
    <V>{coverage.description}</V>
    {geoJSON && <>
      <img style={{ marginTop: 24, maxWidth: '100%' }} src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/geojson(${encodeURIComponent(JSON.stringify(geoJSON))})/auto/600x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />
      <Properties horizontal>
        <T>Latitude</T>
        <V>From {coverage.boundingBox.minLatitude} to {coverage.boundingBox.maxLatitude}</V>
        <T>Longitude</T>
        <V>From {coverage.boundingBox.minLongitude} to {coverage.boundingBox.maxLongitude}</V>
      </Properties>
    </>}
  </Properties>
}
