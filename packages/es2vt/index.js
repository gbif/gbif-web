const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const tileHelper = require("./points/tileQuery");
const cors = require('cors');
const config = require('./config');
//const significantTile = require("./points/significant");
//const tileDecorator = require("./decorator/tileDecorator");

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

app.get("/api/tile/point/:x/:y/:z.mvt", function (req, res) {
  let filter = req.query.filter,
    url = req.query.url,
    countBy = req.query.countBy,
    field = req.query.field,
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
    .getTile(x, y, z, filter, countBy, url, resolution, field)
    .then(function (data) {
      res.send(new Buffer(data, "binary"));
    })
    .catch(function (err) {
      res.status(500);
      console.log(err);
      res.send(err.message);
    });
});

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);
