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
  const mapStyle = theme.darkTheme ? 'dark-v9' : 'light-v9';

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [lng, lat],
      zoom: zoom
    });
    map.current.addControl(new mapboxgl.NavigationControl());
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

        map.current.addSource('event',
            {
              'type': 'geojson',
              'data': geojson
            });
        map.current.addLayer({
          'id': 'eventLayer',
          'type': 'fill',
          'source': 'event',
          'layout': {},
          'paint': {
            'fill-color': theme.primary,
            'fill-opacity': 0.5
          }
        });

        if (geojson.type == "Point"){
          new mapboxgl.Marker()
              .setLngLat([geojson.coordinates[0], geojson.coordinates[1]])
              .addTo(map.current);
          map.current.setCenter(geojson.coordinates);
          map.current.setZoom(6);

        } else {
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
        }

      } else {
        new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);

        map.current.setCenter([longitude, latitude]);
        map.current.setZoom(6);
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
