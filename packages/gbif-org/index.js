const express = require("express");
const { engine } = require('express-handlebars');

var compression = require('compression')
const regeneratorRuntime = require("regenerator-runtime");
const React = require("react");
// const MyButton = require("my-button");
// const { Switch, Button, Checkbox, Root, OccurrenceSearch, Filter, GlobalNavLaptop } = require("gbif-react-components");
const { Dataset, Institution, Collection, createServerContext } = require("gbif-react-components");

const renderToString = require("react-dom/server").renderToString;
const hbs = require('handlebars');
hbs.registerHelper('json', function (context) {
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


app.get('/collection/:key', (req, res) => {
  let currentKey = req.params.key;
  let props = {
    id: currentKey,
    siteConfig: {
      routes: {
        ssr_location: `/collection/${currentKey}`,
        collectionKey: {
          route: '/collection/:key',
          isHref: true,
          url: ({ key }) => {
            return `/collection/${key}`;
          },
        }
      }
    }
  };

  return render(req, res, {
    componentName: 'Collection',
    props,
    component: Collection
  });
});

app.get('/institution/:key', (req, res) => {
  let currentKey = req.params.key;
  let props = {
    id: currentKey,
    siteConfig: {
      routes: {
        ssr_location: `/institution/${currentKey}`,
        collectionKey: {
          route: '/institution/:key',
          isHref: true,
          url: ({ key }) => {
            return `/institution/${key}`;
          },
        }
      }
    }
  };

  return render(req, res, {
    componentName: 'Institution',
    props,
    component: Institution
  });
});

app.get('/dataset/:key', (req, res) => {
  let currentKey = req.params.key;
  let props = {
    id: currentKey,
    siteConfig: {
      routes: {
        ssr_location: `/dataset/${currentKey}`,
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

  return render(req, res, {
    componentName: 'Dataset',
    props,
    component: Dataset
  });
});

app.get('/dataset/:key/citations', (req, res) => {
  let currentKey = req.params.key;
  let props = {
    id: currentKey,
    siteConfig: {
      routes: {
        ssr_location: `/dataset/${currentKey}/citations`,
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

  return render(req, res, {
    componentName: 'Dataset',
    props,
    component: Dataset
  });
});

app.get('/dataset/:key/download', (req, res) => {
  let currentKey = req.params.key;
  let props = {
    id: currentKey,
    siteConfig: {
      routes: {
        ssr_location: `/dataset/${currentKey}/download`,
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

  return render(req, res, {
    componentName: 'Dataset',
    props,
    component: Dataset
  });
});

async function render(req, res, { componentName, props, component, timeout = 500 }) {
  try {
    const app = React.createElement(component, props);
    const { ServerDataContext, resolveData } = createServerContext();
    // first pass just to trigger the API calls
    renderToString(React.createElement(ServerDataContext, {}, app));

    // Wait for all effects to finish
    const data = await resolveData(timeout);

    // TODO check if there is any errors and if so make sure it isn't cached or at least has a short cache.
    // Possible log it

    // Now render it again, but with the API calls prefetched and used as initial data
    const reactComp = renderToString(React.createElement(ServerDataContext, { initialState: data }, app));

    res.render('home', {
      context: {
        // insert the rendered html into our template
        appHtml: reactComp,
        // render the browser component with the same props as on the server
        props: JSON.stringify(props, null, 2),
        // Name of the component to render
        componentName,
        // And then render the browser components with same initial data as we used to render server side
        initialData: data
      }
    });
  } catch(error) {
    res.send(500);
    console.error(error);
  }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))