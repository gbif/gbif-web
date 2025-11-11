
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, Properties, Accordion } from "../../../components";
import {HyperText} from '../../../components';
import { FormattedDate } from 'react-intl';

const { Term: T, Value: V } = Properties;

export function Intro({
  data = {},
  loading,
  error,
  ...props
}) {
  const theme = useContext(ThemeContext);

  const { dataset } = data;
 // if (loading || !dataset) return <h1>Loading</h1>;

  return data?.dataset ?  <Accordion summary="About" defaultOpen={true}>
        <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
          {dataset.description && <>
            <T>Description</T><V><HyperText text={dataset.description}/></V>
          </>}
          {dataset?.temporalCoverages?.length > 0 && <>
            <T>Temporal scope</T><V>{dataset.temporalCoverages.map(temporalCoverage)}</V>
          </>}
          {dataset?.geographicCoverages?.length > 0 && <>
            <T>Geographic scope</T><V>{dataset.geographicCoverages.map(geographicCoverage)}</V>
          </>}
        </Properties>
      </Accordion> : null
      
           
   
};

function geographicCoverage(coverage) {
  let geoJSON;
  if (coverage?.boundingBox?.minLatitude) {
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

function temporalCoverage(period) {
  return <Properties>
    <T>{period.type}</T>
    {period['@type'] == 'range' && <V>
    <FormattedDate value={period.start}
      year="numeric"
      month="long"
      day="2-digit" /> - <FormattedDate value={period.end}
      year="numeric"
      month="long"
      day="2-digit" />
    </V>}
    {period['@type'] == 'single' && <V>
    <FormattedDate value={period.date}
      year="numeric"
      month="long"
      day="2-digit" />
    </V>}
    {period['@type'] == 'verbatim' && <V>
      {period.period}
    </V>}
  </Properties>
}
