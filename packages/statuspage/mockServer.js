/*
A silly endpoint for running simple tests against
*/
const express = require('express');
const app = express();

app.get('/random', (req, res) => {
  res.json({random: Math.floor(Math.random()*100)});
});

app.listen({ port: 4015 }, () =>
  console.log(`🚀 Server ready at http://localhost:4015`)
);
