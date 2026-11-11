/* eslint-disable */
import cors from 'cors';
import { Router } from 'express';
import https from 'https';
import config from '../config';
import { sourceArchiveUrl } from './sourceArchiveUrl';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/source-archive/:datasetKey/:fileName', cors(), function (req, res, next) {
  const url = sourceArchiveUrl(config.sourceArchiveEndpoint, req.params.datasetKey, req.params.fileName);
  if (!url) {
    res.status(400).send('Invalid dataset key or file name');
    return;
  }

  let newReq = https
    .request(url, function (newRes) {
      newRes.pipe(res);
    })
    .on('error', function (err) {
      next(err);
    });

  req.pipe(newReq);
});
