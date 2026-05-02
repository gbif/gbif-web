/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import { Router } from 'express';
import { isbot } from 'isbot';
import { getSql } from '@/helpers/generateSql';
import searchAll from '@/helpers/omniSearch/omniSearch';
import getNetworkCounts from './networkStats/networkCounts';
import validateDownloadPredicate from '@/helpers/validateDownloadPredicate';
import { blastBatch } from './blast/blast';

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

router.post('/validate-download-predicate', async (req, res) => {
  try {
    const response = await validateDownloadPredicate(req.body.predicate);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error:
        "Unable to validate download predicate currently. This doesn't mean that it is INVALID.",
    });
  }
});

function sendUpstreamError(res, err) {
  // Log the full upstream payload server-side; never return it to the client
  // (it can include internal hostnames, stack traces, etc).
  console.error('BLAST proxy error:', err?.message, err?.body);
  if (res.headersSent) return;
  const statusCode = typeof err?.statusCode === 'number' ? err.statusCode : 502;
  res
    .status(statusCode)
    .json({ error: err?.message || 'BLAST request failed' });
}

function rejectBots(req, res) {
  if (isbot(req.get('user-agent'))) {
    res
      .status(418)
      .send(
        'Thirdparty endpoints are not available for bots to avoid overloading external services.',
      );
    return true;
  }
  return false;
}

router.post('/sequence/blast/batch', async (req, res) => {
  if (rejectBots(req, res)) return;
  try {
    const response = await blastBatch(req.body, {
      verbose: req.query.verbose === 'true',
    });
    res.json(response);
  } catch (err) {
    sendUpstreamError(res, err);
  }
});
