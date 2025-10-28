import { Router } from 'express';
import axios from 'axios';
import { stringify } from 'wkt';
import mapshaper from 'mapshaper';

const router = Router();

export default (app) => {
  app.use('/unstable-api/geometry', router);
};

router.get('/simplify/gadm/:level/:id', async (req, res, next) => {
  try {
    const result = await simplifyGadm(
      req.params.level,
      req.params.id,
      req.query.format,
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/gadm2geojson', async (req, res, next) => {
  try {
    // first get all the gadmIds from the query param
    const gadmIds = req.query.gadmIds.split(',');
    const results = await Promise.all(
      gadmIds.map((id) => {
        // get level based on number of . in the id
        const level = id.split('.').length - 1;
        return simplifyGadm(level, id);
      }),
    );
    // group the results into a single geojson feature collection with all the features
    const features = results.flatMap((r) => r.features);
    const result = {
      type: 'FeatureCollection',
      features,
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/gadm2geojson.json', async (req, res, next) => {
  try {
    // first get all the gadmIds from the query param
    const gadmIds = req.query.gadmIds.split(',');
    const result = await Promise.all(
      gadmIds.map((id) => {
        const level = id.split('.').length - 1;
        return simplifyGadm(level, id);
      }),
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export async function gadmIds2GeoJSON(gadmIds) {
  const results = await Promise.all(
    gadmIds.map((id) => {
      const level = id.split('.').length - 1;
      return simplifyGadm(level, id);
    }),
  );
  return results;
}

function transformPolygonToPoint(geojson) {
  // Clone the input to avoid mutation
  const result = JSON.parse(JSON.stringify(geojson));

  if (result.type !== 'FeatureCollection') {
    throw new Error('Input must be a GeoJSON FeatureCollection');
  }

  // Transform each feature
  result.features = result.features.map((feature) => {
    // Check if feature has a polygon geometry
    if (
      feature.geometry.type !== 'Polygon' &&
      feature.geometry.type !== 'MultiPolygon'
    ) {
      return feature; // Return non-polygon features unchanged
    }

    // Create point feature
    const pointFeature = {
      ...feature,
      geometry: {
        type: 'Point',
        coordinates: getPointCoordinates(feature),
      },
    };

    return pointFeature;
  });

  return result;
}

/**
 * Gets point coordinates from a feature
 * Priority: 1) centroid_geom in properties, 2) calculate center
 */
function getPointCoordinates(feature) {
  // Try to use existing centroid from properties
  if (feature.properties?.centroid_geom?.coordinates) {
    return feature.properties.centroid_geom.coordinates;
  }

  // Otherwise calculate center from polygon coordinates
  return calculateCenter(feature.geometry);
}

/**
 * Calculates a simple center point from polygon coordinates
 */
function calculateCenter(geometry) {
  let allCoords = [];

  if (geometry.type === 'Polygon') {
    // Use first ring (exterior ring)
    const [firstRing = []] = geometry.coordinates || [];
    allCoords = firstRing;
  } else if (geometry.type === 'MultiPolygon') {
    // Use first polygon's first ring
    const [[firstRing = []] = []] = geometry.coordinates || [];
    allCoords = firstRing;
  }

  // Calculate average of all coordinates
  const sum = allCoords.reduce(
    (acc, coord) => {
      acc[0] += coord[0]; // longitude
      acc[1] += coord[1]; // latitude
      return acc;
    },
    [0, 0],
  );

  return [sum[0] / allCoords.length, sum[1] / allCoords.length];
}

export async function simplifyGadm(level, id) {
  const response = await axios.get(
    `https://api.gbif-uat.org/v1/geocode/feature/gadm${level}.json?id=${id}`,
  );
  const geojson = response.data;

  return transformPolygonToPoint(geojson);

  // const input = {
  //   'input.geojson': JSON.stringify(geojson),
  //   percentage: 0.1,
  // };
  // // return just the centroid as geojson instead of simplifying
  // // const centroid = geojson.features[0].properties.centroid_geom.coordinates; //  will return [lon, lat]

  // const cmd = '-i input.geojson -simplify resolution=100x100 -o output.geojson';

  // // using Promise
  // const output = await mapshaper.applyCommands(cmd, input);
  // const simplified = JSON.parse(output['output.geojson'].toString());

  // if (format === 'WKT') {
  //   const wktString = stringify(simplified.features[0].geometry);
  //   return { wkt: wktString };
  // }
  // return simplified;
}
