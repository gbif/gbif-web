/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import { Router } from 'express';
import { getSuggestions } from '#/helpers/suggest';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/suggest-occurrence-filter', async (req, res, next) => {
  const { lang = 'en', q, taxonKeys } = req.query;
  const result = await getSuggestions({ lang, q, taxonKeys });
  res.json(result);
});
