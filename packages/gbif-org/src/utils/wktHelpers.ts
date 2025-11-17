import { Feature } from 'ol';
import { GeoJSON, WKT } from 'ol/format';

const wktFormatter = new WKT();
const geoJsonFormatter = new GeoJSON();

/**
 * Convert an OpenLayers feature to WKT format
 */
export function getFeatureAsWKT(feature: Feature): string {
  const asGeoJson = geoJsonFormatter.writeFeature(feature, { rightHanded: true });
  const rightHandCorrectedFeature = geoJsonFormatter.readFeature(asGeoJson);
  const wkt = wktFormatter.writeFeature(rightHandCorrectedFeature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:4326',
    rightHanded: true,
    decimals: 5,
  });
  return wkt;
}

/**
 * Convert WKT strings to OpenLayers features
 */
export function getFeaturesFromWktList({ geometry }: { geometry: string[] }): Feature[] {
  const geometries: Feature[] = [];
  if (Array.isArray(geometry)) {
    for (let i = 0; i < geometry.length; i++) {
      try {
        geometries.push(
          wktFormatter.readFeature(geometry[i], {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326',
          })
        );
      } catch (error) {
        console.warn(`Failed to parse WKT geometry: ${geometry[i]}`, error);
      }
    }
  } else if (typeof geometry === 'string') {
    try {
      geometries.push(
        wktFormatter.readFeature(geometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326',
        })
      );
    } catch (error) {
      console.warn(`Failed to parse WKT geometry: ${geometry}`, error);
    }
  }
  return geometries;
}
