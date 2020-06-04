/*
A simple server that can be used to test how well components respond to errors of various sorts
*/

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const port = 4003;
const app = express();
app.use(bodyParser.json())

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Request headers that we allow
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  // Pass to next layer of middleware
  next();
});


app.get('/graphql', function(req, res, next) {
  // res.status(503).json({error: 'message goes here'});
  // res.status(400).json({unknownQueryId: true});
  setTimeout(() => {
    res.json({data: Math.random()});
  }, 3000);
});

app.post('/graphql', function(req, res, next) {
  setTimeout(() => {
    res.json({data: Math.random()});
  }, 3000);
  // res.status(503).json({error: 'message goes here'});
});

app.listen({ port: port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`)
);


const datasetSearchResult = {
  "data": {
    "datasetSearch": {
      "results": [
        {
          "title": "EOD - eBird Observation Dataset"
        },
        {
          "title": "GBIF Backbone Taxonomy"
        },
        {
          "title": "Catalogue of Life"
        }
      ]
    }
  }
};
