import pager from './pager.mjs';
import prose from './prose.mjs';
import species from './species.mjs';
import entity from './templates/entity/entity.mjs';
import entityIndex from './templates/entity/index.mjs';
import renderIndex from './templates/index.mjs';
import renderProse from './templates/prose.mjs';
async function allSiteMapIndices() {
  const network = pager.network.intervals();
  const installation = pager.installation.intervals();
  const node = pager.node.intervals();
  const dataset = pager.dataset.intervals();
  const publisher = pager.publisher.intervals();
  const maps = await Promise.all([network, installation, node, dataset, publisher]);
  const context = {
    network: maps[0],
    installation: maps[1],
    node: maps[2],
    dataset: maps[3],
    publisher: maps[4],
  };
  return context;
}

function getIntervals(f, template, options) {
  return function (req, res, next) {
    res.set('Content-Type', 'text/xml');
    f()
      .then(function (pages) {
        res.set('Content-Type', 'text/xml');
        res.send(template({ pages, ...options }));
      })
      .catch(function (err) {
        log.error(err);
        next(err);
      });
  };
}

function getList(f, template, options) {
  return function (req, res, next) {
    res.set('Content-Type', 'text/xml');
    let query = {
      offset: req.params.offset,
      limit: req.params.limit,
    };
    f(query)
      .then(function (pages) {
        res.set('Content-Type', 'text/xml');
        res.send(template({ pages, ...options }));
      })
      .catch(function (err) {
        log.error(err);
        next(err);
      });
  };
}

export function register(app) {
  //  app.use('/');
  app.get('/sitemap.xml', function (req, res, next) {
    allSiteMapIndices()
      .then(function (context) {
        res.set('Content-Type', 'text/xml');
        res.send(renderIndex(context));
        // helper.renderPage(req, res, next, context, 'sitemaps/index');
      })
      .catch(function (err) {
        next(err);
      });
  });
  // prose
  app.get('/sitemap-prose.xml', function (req, res, next) {
    res.set('Content-Type', 'text/xml');
    prose
      .getAllProse()
      .then(function (pages) {
        res.set('Content-Type', 'text/xml');
        res.send(renderProse({ pages }));
      })
      .catch(function (err) {
        next(err);
      });
  });

  // networks
  app.get(
    '/sitemap-network.xml',
    getIntervals(pager.network.intervals, entityIndex, { path: 'sitemap/network' })
  );
  app.get(
    '/sitemap/network/:offset/:limit.xml',
    getList(pager.network.list, entity, { path: 'network', changefreq: 'weekly', priority: 0.3 })
  );

  // installation
  app.get(
    '/sitemap-installation.xml',
    getIntervals(pager.installation.intervals, entityIndex, { path: 'sitemap/installation' })
  );
  app.get(
    '/sitemap/installation/:offset/:limit.xml',
    getList(pager.installation.list, entity, {
      path: 'installation',
      changefreq: 'weekly',
      priority: 0.1,
    })
  );

  // node
  app.get(
    '/sitemap-node.xml',
    getIntervals(pager.node.intervals, entityIndex, { path: 'sitemap/node' })
  );
  app.get(
    '/sitemap/node/:offset/:limit.xml',
    getList(pager.node.list, entity, { path: 'node', changefreq: 'weekly', priority: 0.3 })
  );

  // dataset
  app.get(
    '/sitemap-dataset.xml',
    getIntervals(pager.dataset.intervals, entityIndex, { path: 'sitemap/dataset' })
  );
  app.get(
    '/sitemap/dataset/:offset/:limit.xml',
    getList(pager.dataset.list, entity, { path: 'dataset', changefreq: 'weekly', priority: 0.7 })
  );

  // publisher
  app.get(
    '/sitemap-publisher.xml',
    getIntervals(pager.publisher.intervals, entityIndex, { path: 'sitemap/publisher' })
  );
  app.get(
    '/sitemap/publisher/:offset/:limit.xml',
    getList(pager.publisher.list, entity, {
      path: 'publisher',
      changefreq: 'weekly',
      priority: 0.5,
    })
  );

  // species in backbone
  // app.get('/sitemap-species.xml', getIntervals(pager.species.intervals, 'sitemaps/species/index'));
  // app.get('/sitemap/species/:offset/:limit.xml', getList(pager.species.list, 'sitemaps/species/species'));
  // species in backbone
  app.get('/sitemap-species.xml', function (req, res, next) {
    species
      .getSpeciesSiteMapIndex()
      .then(function (sitemapIndex) {
        res.set('Content-Type', 'text/xml');
        res.send(sitemapIndex);
      })
      .catch(function (e) {
        next(e);
      });
  });
  app.get('/sitemap/species/:no.txt', function (req, res, next) {
    species
      .getSpeciesSiteMap(req.params.no)
      .then(function (sitemap) {
        res.set('Content-Type', 'text/plain');
        res.send(sitemap);
      })
      .catch(function (e) {
        next(e);
      });
  });
}
