const express = require('express');
const router = express.Router();
var Mustache = require('mustache');
// const satellite = require('./experiments/satellite');
const maptilerSatellite = require('./experiments/maptilerSatellite');
const hillshade = require('./experiments/hillshade');
const positron = require('./experiments/positron');
const positronMercator = require('./experiments/positron_mercator');
const positron4326 = require('./experiments/positron_4326');
const epsg4326 = require('./experiments/4326');

const gbifRaster3575 = require('./3575/gbif-raster');
const gbifRaster3031 = require('./3031/gbif-raster');
const gbifRaster3857 = require('./3857/gbif-raster');
const gbifRasterHillshade3857 = require('./3857/gbif-raster-hillshade');
const gbifRaster4326 = require('./4326/gbif-raster');

const satellite3031 = require('./3031/satellite');
const satellite3857_maptiler = require('./3857/satellite_maptiler');
const satellite3857_bing = require('./3857/satellite_bing');

const defaultValues = {
    pixelRatio: 1,
    projection: '3857',
    language: 'en',
    styleName: 'natural',
    background: encodeURIComponent('#e8e5d8'),
};

module.exports = function (app) {
    app.use('/unstable-api/map-styles', router);
};

function returnTemplate(req, res, next, template, defaultOverwrites) {
    const variables = Object.assign({}, defaultValues, defaultOverwrites, req.query);
    const renderedTemplate = Mustache.render(JSON.stringify(template), variables);
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

//Satellite
router.get('/3031/satellite', (req, res, next) => {
    returnTemplate(req, res, next, satellite3031);
});
router.get('/3857/satellite_maptiler', (req, res, next) => {
    returnTemplate(req, res, next, satellite3857_maptiler);
});
router.get('/3857/satellite_bing', (req, res, next) => {
    returnTemplate(req, res, next, satellite3857_bing);
});