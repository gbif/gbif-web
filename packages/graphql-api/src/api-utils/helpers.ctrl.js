/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import { Router } from 'express';
import generateSql from '#/helpers/generateSql';
import config from '#/config';

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

async function getSql({ query }) {
  const { error, sql } = await generateSql(query);
  if (error) {
    return { error, sql };
  }

  // post to https://api.gbif.org/v1/occurrence/download/request/validate to validate the sql
  const validation = await fetch(
    `${config.apiv1}/occurrence/download/request/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, format: 'SQL_TSV_ZIP' }),
    },
  ).then((response) => response.json());

  if (!validation.sql) {
    return {
      error: 'Validation failed',
      validationResponse: validation,
    };
  }
  return {
    comment:
      'This is an experimental endpoint to generate SQL queries for the occurrence download service. Currently filters (WHERE) is hardcoded and is waiting for https://github.com/gbif/occurrence/issues/356',
    error,
    sql,
    validationResponse: validation,
  };
}
