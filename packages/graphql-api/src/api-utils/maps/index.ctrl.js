/* eslint-disable camelcase */
import { Router } from 'express';
import { render } from 'mustache';
// import satellitefrom './experiments/satellite';
// import maptilerSatellite from './experiments/maptilerSatellite';
// import hillshade from './experiments/hillshade';
// import positron from './experiments/positron';
// import positronMercator from './experiments/positron_mercator';
// import positron4326 from './experiments/positron_4326';
// import epsg4326 from './experiments/4326';

import gbifRaster3575 from './3575/gbif-raster';
import gbifRaster3031 from './3031/gbif-raster';
import gbifRaster3857 from './3857/gbif-raster';
import gbifRasterHillshade3857 from './3857/gbif-raster-hillshade';
import gbifRaster4326 from './4326/gbif-raster';

import satellite3031 from './3031/satellite';
import satellite3857_maptiler from './3857/satellite_maptiler';
import satellite3857_bing from './3857/satellite_bing';
import { getInstitutionsGeojson } from './institutions/institutions';

const router = Router();

const defaultValues = {
  pixelRatio: 1,
  projection: '3857',
  language: 'en',
  styleName: 'natural',
  background: encodeURIComponent('#e8e5d8'),
};

export default (app) => {
  app.use('/unstable-api/map-styles', router);
};

function returnTemplate(req, res, next, template, defaultOverwrites) {
  const variables = {
    ...defaultValues,
    ...defaultOverwrites,
    ...req.query,
  };
  const renderedTemplate = render(JSON.stringify(template), variables);
  res.json(JSON.parse(renderedTemplate));
}

// GBIF Natural
router.get('/3575/gbif-raster', (req, res, next) => {
  returnTemplate(req, res, next, gbifRaster3575);
});
router.get('/3031/gbif-raster', (req, res, next) => {
  returnTemplate(req, res, next, gbifRaster3031);
});
router.get('/4326/gbif-raster', (req, res, next) => {
  returnTemplate(req, res, next, gbifRaster4326);
});
router.get('/3857/gbif-raster', (req, res, next) => {
  returnTemplate(req, res, next, gbifRaster3857);
});
router.get('/3857/gbif-raster-hillshade', (req, res, next) => {
  returnTemplate(req, res, next, gbifRasterHillshade3857);
});

// Satellite
router.get('/3031/satellite', (req, res, next) => {
  returnTemplate(req, res, next, satellite3031);
});
router.get('/3857/satellite_maptiler', (req, res, next) => {
  returnTemplate(req, res, next, satellite3857_maptiler);
});
router.get('/3857/satellite_bing', (req, res, next) => {
  returnTemplate(req, res, next, satellite3857_bing);
});

// institutions
router.get('/3031/institutions.geojson', async (req, res, next) => {
  const institutions = await getInstitutionsGeojson(req.query, req);
  res.json(institutions);
});