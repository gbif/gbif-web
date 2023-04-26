import GeoJSON from 'ol/format/GeoJSON.js';
import WKT from 'ol/format/WKT.js';

const format = new WKT();

export default function getFeature(wktStr) {
  // https://openlayers.org/en/latest/examples/wkt.html
  // https://openlayers.org/en/latest/examples/geojson.html
  try {
    const feature = format.readFeature(wktStr);
    const geoJsonString = new GeoJSON().writeFeature(feature);
    return { geojson: geoJsonString };
  } catch (e) {
    return { geojson: null, error: e };
  }
}