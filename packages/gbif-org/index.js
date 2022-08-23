const express = require("express");
// var compression = require('compression')
const regeneratorRuntime = require("regenerator-runtime");
const React = require("react");
// const MyButton = require("my-button");
// const { Switch, Button, Checkbox, Root, OccurrenceSearch, Filter, GlobalNavLaptop } = require("gbif-react-components");
const { Button, Dataset, OccurrenceSearch } = require("gbif-react-components");

const renderToString = require("react-dom/server").renderToString;
const hbs = require("handlebars");

const app = express();
// app.use(compression())
const port = 3000;

app.get('/dataset/:key', (req, res) => {
  const theHtml = `
  <html>
  <head><title>My First SSR</title></head>
  <body>
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
  // const reactComp = renderToString(React.createElement(OccurrenceSearch,{
  //   style:{height: 'calc(100vh - 20px)'},
  //   siteConfig: {
  //     routes: {
  //       occurrenceSearch: {
  //         route: '/occurrence/search'
  //       }
  //     },
  //     occurrence: {
  //       occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP', 'DATASETS'],
  //     }
  //   }
  // }));
  // const reactComp = renderToString(React.createElement(Button,{}, 'GBIF test button'));
  const datasetKey = req.params.key;
  const reactComp = renderToString(React.createElement(Dataset,{
    id: datasetKey,
    siteConfig: {
      routes: {
        // basename: `/dataset/${datasetKey}`,
        datasetKey: {
          route: '/dataset/:key',
          isHref: true,
          url: ({key}) => {
            return `/dataset/${key}`; 
          },
        }
      },
      occurrence: {
        occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP', 'DATASETS'],
      }
    }
  }));
  const htmlToSend = hbsTemplate({ reactele: reactComp });
  res.send(htmlToSend);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))