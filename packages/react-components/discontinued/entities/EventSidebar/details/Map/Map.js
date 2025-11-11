import React, {useContext, useEffect, useRef, useState} from "react";
import mapboxgl from 'mapbox-gl';
import env from '../../../../../.env.json';
import * as css from './map.styles';
import ThemeContext from "../../../../style/themes/ThemeContext";

mapboxgl.accessToken = env.MAPBOX_KEY;

export default function Map({latitude, longitude}) {

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

    new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
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
