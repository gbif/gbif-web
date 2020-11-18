const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const tileHelper = require('./points/tileQuery');
const cors = require('cors');
const config = require('./config');

app.use(express.static('public'));

app.use(cors({
  methods: 'GET,POST,OPTIONS',
}));

app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(cookieParser());

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
      res.send(new Buffer.from(data, 'binary'));
    })
    .catch(function (err) {
      res.status(err.statusCode || 500);
      res.send(err.message || 'Internal server error');
    });
});

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);
