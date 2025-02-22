/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import { getSql } from '#/helpers/generateSql';
import { Router } from 'express';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
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
