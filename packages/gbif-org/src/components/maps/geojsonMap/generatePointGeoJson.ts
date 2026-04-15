/**
 * Generate a GeoJSON Point feature from latitude and longitude coordinates
 * @param lat - Latitude in decimal degrees
 * @param lon - Longitude in decimal degrees
 * @param properties - Optional properties to include in the feature
 * @returns GeoJSON Point feature
 */
export function generatePointGeoJson({
  lat,
  lon,
  properties = {},
}: {
  lat: number;
  lon: number;
  properties?: Record<string, any>;
}): GeoJSON.Feature {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat], // GeoJSON uses [longitude, latitude]
    },
    properties: properties,
  };
}
