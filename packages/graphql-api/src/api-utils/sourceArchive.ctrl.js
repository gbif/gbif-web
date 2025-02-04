/* eslint-disable */
import cors from 'cors';
import { Router } from 'express';
import https from 'https';
import config from '../config';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get(
  '/source-archive/:datasetKey/:fileName',
  cors(),
  function (req, res, next) {
    let url =
      config.sourceArchiveEndpoint +
      '/' +
      req.params.datasetKey +
      '/' +
      req.params.fileName;

    let newReq = https
      .request(url, function (newRes) {
        newRes.pipe(res);
      })
      .on('error', function (err) {
        next(err);
      });

    req.pipe(newReq);
  },
);
