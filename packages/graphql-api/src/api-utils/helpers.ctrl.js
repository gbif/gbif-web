/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import { Router } from 'express';
import generateSql from '#/helpers/generateSql';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/generate-sql', async (req, res, next) => {
  const { error, sql } = await generateSql(req.query);
  res.json({ error, sql });
});
