import express from 'express';

const router = express.Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/test2', (req, res) => {
  res.send('hej2');
});
