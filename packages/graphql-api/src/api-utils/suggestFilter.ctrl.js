/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import { Router } from 'express';
import { getSuggestions } from '#/helpers/suggest';
import colSuggest from '#/resources/gbif/taxon/colSuggest';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/suggest-occurrence-filter', async (req, res, next) => {
  const { lang = 'en', q, taxonKeys } = req.query;
  const result = await getSuggestions({ lang, q, taxonKeys });
  res.json(result);
});

router.get('/col-suggest', async (req, res, next) => {
  const { language = 'eng', q, taxonKeys } = req.query;
  const result = await colSuggest({ language, q, taxonKeys });
  // slim down for suggest
  result.map((x) => {
    let result = x;
    delete result.taxon;
    result.classification = result.taxonClassification.map((c) => c.name);
    delete result.taxonClassification;
  });
  res.json(result);
});
