import { Feature } from 'ol';
import { GeoJSON, WKT } from 'ol/format';

const wktFormatter = new WKT();
const geoJsonFormatter = new GeoJSON();

/**
 * Cap latitude values to valid range [-90, 90]
 * Recursively processes all coordinate arrays in GeoJSON geometry
 */
function capLatitudeInCoordinates(coordinates: any): any {
  if (typeof coordinates[0] === 'number') {
    // This is a [longitude, latitude] pair
    const [lon, lat] = coordinates;
    const cappedLat = Math.max(-90, Math.min(90, lat));
    return [lon, cappedLat];
  }
  // Recursively process nested arrays
  return coordinates.map((coord: any) => capLatitudeInCoordinates(coord));
}

/**
 * Convert an OpenLayers feature to WKT format
 * Ensures latitude values are capped within valid range [-90, 90]
 */
export function getFeatureAsWKT(feature: Feature): string {
  const asGeoJson = geoJsonFormatter.writeFeature(feature, { rightHanded: true });
  const geoJsonObj = JSON.parse(asGeoJson);
  
  // Cap latitude values in the geometry coordinates
  if (geoJsonObj.geometry && geoJsonObj.geometry.coordinates) {
    geoJsonObj.geometry.coordinates = capLatitudeInCoordinates(geoJsonObj.geometry.coordinates);
  }
  
  const correctedGeoJson = JSON.stringify(geoJsonObj);
  const rightHandCorrectedFeature = geoJsonFormatter.readFeature(correctedGeoJson);
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

/**
 * Convert WKT string to GeoJSON feature object (for MapLibre)
 */
export function wktToGeoJSON(wktString: string): GeoJSON.Feature | null {
  try {
    const feature = wktFormatter.readFeature(wktString, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });
    const geoJsonFeature = geoJsonFormatter.writeFeatureObject(feature, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
      rightHanded: true,
      decimals: 5,
    });
    return geoJsonFeature as GeoJSON.Feature;
  } catch (error) {
    console.warn(`Failed to parse WKT geometry: ${wktString}`, error);
    return null;
  }
}

/**
 * Convert GeoJSON feature or geometry to WKT string (for MapLibre)
 */
export function geoJSONToWKT(geoJson: GeoJSON.Feature | GeoJSON.Geometry): string | null {
  try {
    // Read the GeoJSON as an OpenLayers feature
    const feature = geoJsonFormatter.readFeature(geoJson, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });

    // Convert to WKT with right-handed coordinate order
    const asGeoJson = geoJsonFormatter.writeFeature(feature, { rightHanded: true });
    const rightHandCorrectedFeature = geoJsonFormatter.readFeature(asGeoJson);
    const wkt = wktFormatter.writeFeature(rightHandCorrectedFeature, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
      rightHanded: true,
      decimals: 5,
    });
    return wkt;
  } catch (error) {
    console.warn('Failed to convert GeoJSON to WKT:', geoJson, error);
    return null;
  }
}
