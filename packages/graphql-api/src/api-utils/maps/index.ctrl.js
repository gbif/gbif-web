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
import geology3857 from './experiments/geology_test';

import gbifRaster3575 from './3575/gbif-raster';
import gbifRaster3031 from './3031/gbif-raster';
import gbifRaster3857 from './3857/gbif-raster';
import gbifRasterHillshade3857 from './3857/gbif-raster-hillshade';
import gbifRaster4326 from './4326/gbif-raster';
import gbifRasterIUCN4326 from './4326/gbif-raster-iucn';

import satellite3031 from './3031/satellite';
import satellite3857_maptiler from './3857/satellite_maptiler';
import satellite3857_bing from './3857/satellite_bing';
import axios from 'axios';
import config from '../../config';

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
  const renderedTemplate =
    typeof template === 'function'
      ? template(variables)
      : render(JSON.stringify(template), variables);
  res.json(
    typeof renderedTemplate === 'string'
      ? JSON.parse(renderedTemplate)
      : renderedTemplate,
  );
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

// GBIF Raster IUCN
router.get('/4326/gbif-raster-iucn-volatile', async (req, res, next) => {
  const taxonKey = req.query.taxonKey;
  let query = { ...req.query };
  if (taxonKey && !query.iucnTaxonID) {
    try {
      // fetch the IUCN Redlist category, and from that the species entry. From there we can get to the taxonID that is used in the map tiles
      const iucnRedListCategory = (
        await axios.get(
          `${config.apiv1}/species/${taxonKey}/iucnRedListCategory`,
        )
      ).data;
      const iucnSpecies = (
        await axios.get(
          `${config.apiv1}/species/${iucnRedListCategory.usageKey}`,
        )
      ).data;
      const iucnTaxonID = iucnSpecies.taxonID;
      query.iucnTaxonID = iucnTaxonID;
    } catch (err) {
      console.log(err);
    }
  }
  returnTemplate(req, res, next, gbifRasterIUCN4326, query);
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

// geology test
router.get('/3857/geology', (req, res, next) => {
  returnTemplate(req, res, next, geology3857);
});
