import { Router } from 'express';
import axios from 'axios';

const router = Router();

export default (app) => {
  app.use('/unstable-api/geometry', router);
};

// mapshaper (~70ms) and wkt are only needed when this endpoint is hit.
// Defer to first call to keep startup cheap.
let geomModulePromise;
const loadGeomDeps = () => {
  if (!geomModulePromise) {
    geomModulePromise = Promise.all([import('mapshaper'), import('wkt')]).then(
      ([mapshaper, wkt]) => ({
        applyCommands: mapshaper.applyCommands,
        stringify: wkt.stringify,
      }),
    );
  }
  return geomModulePromise;
};

// GBIF Natural
router.get('/simplify/gadm/:level/:id', async (req, res, next) => {
  try {
    const { applyCommands, stringify } = await loadGeomDeps();

    const response = await axios.get(
      `https://api.gbif-uat.org/v1/geocode/feature/gadm${req.params.level}.json?id=${req.params.id}`,
    );
    const geojson = response.data;

    const input = {
      'input.geojson': JSON.stringify(geojson),
      percentage: 0.1,
    };
    const cmd =
      '-i input.geojson -simplify resolution=100x100 -o output.geojson';

    // using Promise
    const output = await applyCommands(cmd, input);
    const simplified = JSON.parse(output['output.geojson'].toString());

    if (req.query.format === 'WKT') {
      const wktString = stringify(simplified.features[0].geometry);
      res.json({ wkt: wktString });
    } else {
      res.json(simplified);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
