const express = require("express");
const { engine } = require('express-handlebars');

var compression = require('compression')
const regeneratorRuntime = require("regenerator-runtime");
const React = require("react");
// const MyButton = require("my-button");
// const { Switch, Button, Checkbox, Root, OccurrenceSearch, Filter, GlobalNavLaptop } = require("gbif-react-components");
const { Dataset, createServerContext } = require("gbif-react-components");

const renderToString = require("react-dom/server").renderToString;
const hbs = require('handlebars');
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

const app = express();
const port = 3000;
app.use(compression());

//Sets our app to use the handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'))


app.get('/dataset/:key', async (req, res) => {
  // const theHtml = `
  // <html>
  // <head><title>My First SSR</title></head>
  // <body>
  // <div id="reactele">{{{reactele}}}</div>
  // <script src="/app.js" charset="utf-8"></script>
  // <script src="/vendor.js" charset="utf-8"></script>
  // </body>
  // </html>
  // `;

  // const hbsTemplate = hbs.compile(theHtml);

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
  let props = {
    id: datasetKey,
    siteConfig: {
      routes: {
        // basename: `/dataset/${datasetKey}`,
        datasetKey: {
          route: '/dataset/:key',
          isHref: true,
          url: ({ key }) => {
            return `/dataset/${key}`;
          },
        }
      },
      occurrence: {
        occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP', 'DATASETS'],
      }
    }
  };
  const app = React.createElement(Dataset, props);
  const { ServerDataContext, resolveData } = createServerContext();
  const reactComp = renderToString(React.createElement(ServerDataContext, {}, app));
  
  // Wait for all effects to finish
  const data = await resolveData(500);
  console.log(JSON.stringify(data, null, 2));

  const reactComp2 = renderToString(React.createElement(ServerDataContext, {initialState: data}, app));

  // const reactComp = renderToString(React.createElement(Eyebrow,{
  //   prefix: 'Part a',
  //   suffix: 'Part b'
  // }));

  res.render('home', { 
    context: { 
      appHtml: reactComp2, 
      props: JSON.stringify(props, null, 2),
      initialData: data
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))