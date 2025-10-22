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
  console.log(gadmIds);
  const results = await Promise.all(
    gadmIds.map((id) => {
      const level = id.split('.').length - 1;
      return simplifyGadm(level, id);
    }),
  );
  return results;
}

export async function simplifyGadm(level, id, format) {
  const response = await axios.get(
    `https://api.gbif-uat.org/v1/geocode/feature/gadm${level}.json?id=${id}`,
  );
  const geojson = response.data;

  const input = {
    'input.geojson': JSON.stringify(geojson),
    percentage: 0.1,
  };
  const cmd = '-i input.geojson -simplify resolution=100x100 -o output.geojson';

  // using Promise
  const output = await mapshaper.applyCommands(cmd, input);
  const simplified = JSON.parse(output['output.geojson'].toString());

  if (format === 'WKT') {
    const wktString = stringify(simplified.features[0].geometry);
    return { wkt: wktString };
  }
  return simplified;
}
