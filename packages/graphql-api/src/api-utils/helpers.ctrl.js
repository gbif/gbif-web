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

  // post to https://api.gbif.org/v1/occurrence/download/request/validate to validate the sql
  const validation = await fetch(
    'https://api.gbif.org/v1/occurrence/download/request/validate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, format: 'SQL_TSV_ZIP' }),
    },
  ).then((response) => response.json());

  console.log(sql);
  res.json({
    error,
    sql,
    inlineSql: sql.replace(/\n/g, ' '),
    validationResponse: validation,
  });
});
