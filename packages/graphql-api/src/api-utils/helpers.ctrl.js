/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import { Router } from 'express';
import { getSql } from '#/helpers/generateSql';
import searchAll from '#/helpers/omniSearch/omniSearch';
import getNetworkCounts from './networkStats/networkCounts';

const router = Router();

export default (app, server) => {
  app.use('/unstable-api', router);

  router.get('/cross-content-search', async (req, res) => {
    try {
      const response = await searchAll({
        query: req.query.q,
        server,
        languageCode: req.query.languageCode ?? 'eng',
        locale: req.query.locale ?? 'en',
      });
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

router.get('/generate-sql', async (req, res) => {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = await getSql({ query: req.query });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate-sql', async (req, res) => {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = await getSql({ query: req.body });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/network-stats', async (req, res) => {
  try {
    const response = await getNetworkCounts();
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
