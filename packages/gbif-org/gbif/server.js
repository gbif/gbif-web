import compress from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import fsp from 'node:fs/promises';
import { merge } from 'ts-deepmerge';
import { loadEnv } from 'vite';
import logger from './config/logger.mjs';
import { helmetConfig } from './helmetConfig.js';
import { register as registerUser } from './routes/user/endpoints.mjs';

// Load environment variables from .env files and merge them with process.env.
const envFile = loadEnv('', process.cwd(), ['PUBLIC_']);
const env = merge(envFile, process.env);

const IS_PRODUCTION = env.NODE_ENV === 'production';
const PORT = parseInt(env.PORT || 3000);

async function main() {
  const app = express();

  // Add middleware for parsing requests
  app.use(
    express.json({
      limit: '1mb',
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());

  // Middleware to set default Cache-Control header
  app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=600, must-revalidate'); // Default cache for 10 minutes
    next();
  });

  // Middleware to set shorter cache for responses with status code above 400
  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
      if (res.statusCode >= 400) {
        res.set('Cache-Control', 'public, max-age=10, must-revalidate'); // Short cache for 10 seconds
      }
      originalSend.call(this, body);
    };
    next();
  });

  if (IS_PRODUCTION) {
    const environmentEndpoints = [
      env.PUBLIC_BASE_URL,
      env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT,
      env.PUBLIC_COUNT_ENDPOINT,
      env.PUBLIC_V1_ENDPOINT,
      env.PUBLIC_GRAPHQL_ENDPOINT,
      env.PUBLIC_GRAPHQL_ENDPOINT_CLIENT,
      env.PUBLIC_FORMS_ENDPOINT,
      env.PUBLIC_FORMS_ENDPOINT_CLIENT,
    ].filter((endpoint) => typeof endpoint === 'string');

    helmetConfig.contentSecurityPolicy.directives.defaultSrc.push(...environmentEndpoints);

    app.use(helmet(helmetConfig));
  }

  // Set up middleware based on the environment.
  let viteDevServer;

  if (!IS_PRODUCTION) {
    const vite = await import('vite');
    viteDevServer = await vite.createServer({
      root: process.cwd(),
      server: { middlewareMode: true },
      appType: 'custom',
      configFile: './gbif/vite.config.ts',
    });

    app.use(viteDevServer.middlewares);
  } else {
    app.use(express.static('dist/gbif/client', { index: false }));
    app.use(express.static('public', { index: false }));
  }

  registerUser(app);

  // Handle server-side rendering.
  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      let template;
      let render;

      if (!IS_PRODUCTION) {
        template = await fsp.readFile('gbif/index.html', 'utf8');
        template = await viteDevServer.transformIndexHtml(url, template);
        render = (await viteDevServer.ssrLoadModule('src/gbif/entry.server.tsx')).render;
      } else {
        template = await fsp.readFile('dist/gbif/client/gbif/index.html', 'utf8');
        render = (await import('../dist/gbif/server/entry.server.js')).render;
      }

      try {
        const { appHtml, headHtml, htmlAttributes, bodyAttributes } = await render(req);

        const html = template
          .replace('<html class="g-m-0 g-p-0">', `<html ${htmlAttributes} class="g-m-0 g-p-0">`)
          .replace(
            '<body style="margin: 0; padding: 0" class="gbif">',
            `<body ${bodyAttributes} style="margin: 0; padding: 0" class="gbif">`
          )
          .replace('<!--head-html-->', headHtml)
          .replace('<!--app-html-->', appHtml);

        res.setHeader('Content-Type', 'text/html');

        return res.status(200).end(html);
      } catch (e) {
        // Handle possible redirections thrown by the render function.
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
          return res.redirect(e.status, e.headers.get('Location'));
        }

        throw e;
      }
    } catch (error) {
      if (!IS_PRODUCTION) {
        viteDevServer.ssrFixStacktrace(error);
      }

      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  app.listen(PORT, () => {
    logger.info('Server started successfully', { port: PORT, environment: env.NODE_ENV });
  });

  process.on('unhandledRejection', function (reason, p) {
    logger.logError(new Error('Unhandled Promise Rejection'), {
      reason: reason?.toString(),
      promise: p?.toString(),
    });
    // There is not much else to do here. Keep track of the logs and make sure this never happens. There should be no unhandled rejections.
  });
  process.on('uncaughtException', function (err) {
    // eslint-disable-next-line no-console
    console.error('FATAL: Uncaught exception.');
    console.error(err.stack || err);
    setTimeout(function () {
      process.exit(1);
    }, 200);
    // log.error('FATAL: Uncaught exception.');
    // log.error(err.stack || err);
  });
}

main();
