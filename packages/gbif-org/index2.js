import express from "express";
// import regeneratorRuntime from "regenerator-runtime";
import React from "react";
import * as ReactDOMServer from 'react-dom/server';
import hbs from "handlebars";

import { Button } from "gbif-react-components";
// import { Button } from "ariakit/button";
// import pkg from 'gbif-react-components';
// const { Button } = pkg;

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const theHtml = `
  <html>
  <head><title>My First SSR</title></head>
  <body>
  <h1>My First Server Side Render</h1>
  <div id="reactele">{{{reactele}}}</div>
  <script src="/app.js" charset="utf-8"></script>
  <script src="/vendor.js" charset="utf-8"></script>
  </body>
  </html>
  `;

  const hbsTemplate = hbs.compile(theHtml);
  const reactComp = ReactDOMServer.renderToString(React.createElement(Button,{}, 'GBIF test button'));
  // const reactComp = ReactDOMServer.renderToString(React.createElement('button',{}, 'GBIF test button'));

  const htmlToSend = hbsTemplate({ reactele: reactComp });
  res.send(htmlToSend);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))