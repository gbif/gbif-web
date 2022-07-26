import React, {Component, useContext, useEffect, useRef, useState} from "react";
import mapboxgl from 'mapbox-gl';
import env from '../../../../../.env.json';
import * as css from './map.styles';
import ThemeContext from "../../../../style/themes/ThemeContext";
import Wkt from 'wicket'

mapboxgl.accessToken = env.MAPBOX_KEY;

export default function Map({latitude, longitude, wkt}) {

  const theme = useContext(ThemeContext);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(longitude);
  const [lat, setLat] = useState(latitude);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    map.current.on('load', () => {

      if (wkt){
        let wicket = new Wkt.Wkt();

        // Read in any kind of WKT string
        wicket.read(wkt);

        let geojson = wicket.toJson();
        console.log(geojson)

        map.current.addSource('event',
            {
              'type': 'geojson',
              'data': geojson
            });
        map.current.addLayer({
          'id': 'eventLayer',
          'type': 'fill',
          'source': 'event', // reference the data source
          'layout': {},
          'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
          }
        });

        const coordinates = geojson.coordinates[0];

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(
            coordinates[0],
            coordinates[0]
        );

        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        for (const coord of coordinates) {
          bounds.extend(coord);
        }

        map.current.fitBounds(bounds, {
          padding: 30
        });

      } else {
        new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);
      }
    });
  });

  return (
      <div css={css.map({ theme })}>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container"  />
      </div>
  );
}
