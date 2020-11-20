const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const tileHelper = require('./points/tileQuery');

const app = express();
app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
  // compression isn't enabled per default for all content types, so we need a custom filter
  // https://github.com/expressjs/compression/issues/119
  if (res.get('Content-Type') === 'application/octet-stream') {
    return true;
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

app.use(express.static('public'));

app.use(cors({
  methods: 'GET,OPTIONS',
}));

app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.get('/api/tile/point/:x/:y/:z.mvt', function (req, res) {
  let filter = req.query.filter,
    resolution = req.query.resolution,
    x = parseInt(req.params.x),
    y = parseInt(req.params.y),
    z = parseInt(req.params.z);

  try {
    filter = JSON.parse(filter);
  } catch (err) {
    filter = undefined;
  }

  tileHelper
    .getTile(x, y, z, filter, resolution, req)
    .then(function (data) {
      res.setHeader('Cache-Control', 'public, max-age=' + 600); // unit seconds
      res.type('application/octet-stream')
      res.send(new Buffer.from(data, 'binary'));
    })
    .catch(function (err) {
      res.setHeader('Cache-Control', 'public, max-age=' + 30); // unit seconds
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal server error';
      res.status(statusCode);
      res.json({ message, statusCode });
    });
});

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);
