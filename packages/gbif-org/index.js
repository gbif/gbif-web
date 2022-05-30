const express = require("express");
// var compression = require('compression')
const regeneratorRuntime = require("regenerator-runtime");
// const MyButton = require("my-button");
// const { Switch, Button, Checkbox, Root, OccurrenceSearch, Filter, GlobalNavLaptop } = require("gbif-react-components");
const { Button, Dataset } = require("gbif-react-components");
// const Button = require("reakit").Button;
const React = require("react");
const renderToString = require("react-dom/server").renderToString;
const hbs = require("handlebars");

const app = express();
// app.use(compression())
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
  // const reactComp = renderToString(React.createElement(Button,{},'My Button'));
  // const reactComp = renderToString(React.createElement(Root,{}, React.createElement(Checkbox,{})));
  // const reactComp = renderToString(React.createElement(Switch,{style:{padding: 20}}));

  // const reactComp = renderToString(React.createElement(Root,{}, React.createElement(GlobalNavLaptop,{style:{padding: 20}})));
  // const reactComp = renderToString(React.createElement(OccurrenceSearch,{style:{height: 'calc(100vh - 20px)'}}));
  // const reactComp = renderToString(React.createElement(Button,{}, 'GBIF test button'));
  const reactComp = renderToString(React.createElement(Dataset,{id: '2985efd1-45b1-46de-b6db-0465d2834a5a'}));
  const htmlToSend = hbsTemplate({ reactele: reactComp });
  res.send(htmlToSend);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))