import compress from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fsp from 'node:fs/promises';
import { createServer as createHttpServer } from 'node:http';
import { merge } from 'ts-deepmerge';
import { loadEnv } from 'vite';
import logger from './config/logger.mjs';
import { helmetConfig } from './helmetConfig.js';
import { register as registerRobots } from './routes/robots/index.mjs';
import { register as registerSitemaps } from './routes/sitemaps/endpoints.mjs';
import { register as registerUser } from './routes/user/endpoints.mjs';
import { register as registerProxies } from './routes/proxy/proxy.mjs';
import createGetRedirect from './middleware/redirects.mjs';
// Load environment variables from .env files and merge them with process.env.
const envFile = loadEnv('', process.cwd(), ['PUBLIC_']);
const env = merge(envFile, process.env);

const IS_PRODUCTION = env.NODE_ENV === 'production';
const PORT = parseInt(env.PORT || 3000);

const getRedirect = createGetRedirect(env);

async function main() {
  const app = express();
  // Share a single HTTP server between Express and Vite's HMR. Without this, Vite's
  // middleware mode spins up its own server for HMR on a different port, and the
  // browser-side HMR client can't reach it — repeated WS reconnect failures cause
  // @vite/client to fall back to full reloads in a loop when PORT is not the default.
  const httpServer = createHttpServer(app);

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

  const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  });

  app.use(morganMiddleware);

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
      env.PUBLIC_FEEDBACK_ENDPOINT,
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
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'custom',
      configFile: './gbif/vite.config.ts',
    });

    app.use(viteDevServer.middlewares);
  } else {
    app.use(express.static('dist/gbif/client', { index: false }));
    app.use(express.static('public', { index: false }));
  }

  registerUser(app);
  registerProxies(app);
  registerSitemaps(app);
  registerRobots(app);

  // add middleware to add referer as a short lived cookie (5 minutes)
  app.use('*/download/request', (req, res, next) => {
    // if there is a source query param, then use that as a fallback referer
    const referer = req.get('Referer');
    let source = req.query.source;
    if (referer && referer !== '') {
      try {
        // get domain from referer
        const refererUrl = new URL(referer);
        const refererDomain = refererUrl.hostname;
        source = refererDomain;
      } catch (e) {
        // do nothing
      }
    }

    if (source && source !== '') {
      res.cookie('refererSource', source, {
        maxAge: 5 * 60 * 1000,
        httpOnly: false,
        secure: false,
      });
    }
    next();
  });

  // Handle server-side rendering.
  app.use('*', async (req, res, next) => {
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
        const {
          appHtml,
          headHtml,
          htmlAttributes,
          bodyAttributes,
          statusCode,
          cacheControl,
          rootDir,
        } = await render(req);
        if (cacheControl) {
          res.set('Cache-Control', cacheControl);
        }
        if (req?.query?.preview === 'true') {
          res.set('Cache-Control', 'public, max-age=0, must-revalidate, no-cache, no-store');
        }

        const testClass = env.PUBLIC_TEST_SITE === 'true' ? 'gbif-test-site' : '';

        const html = template
          .replace(
            '<html class="g-m-0 g-p-0">',
            `<html ${htmlAttributes} class="g-m-0 g-p-0 ${testClass}">`
          )
          .replace(
            '<body style="margin: 0; padding: 0" class="gbif">',
            `<body ${bodyAttributes} style="margin: 0; padding: 0" class="gbif">`
          )
          .replace(
            '<div id="app" class="gbif">',
            `<div id="app" class="gbif" dir="${rootDir ?? 'ltr'}">`
          )
          .replace('<!--head-html-->', headHtml)
          .replace('<!--app-html-->', appHtml);

        res.setHeader('Content-Type', 'text/html');

        const redirectTo = getRedirect(req, res);

        if (statusCode === 404 && redirectTo) {
          // Handle list of redirects
          if (redirectTo) {
            res.redirect(302, redirectTo);
          }
        } else {
          res.status(statusCode).end(html);
        }
        // return statusCode === 404 ? res.status(statusCode).end(html);
      } catch (e) {
        // Handle possible redirections thrown by the render function.
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
          return res.redirect(e.status, e.headers.get('Location'));
        }

        // Try to extract a status property from the error. If no status is provided just fall back to status 500.
        let status = 500;
        if (
          typeof e === 'object' &&
          'status' in e &&
          typeof e.status === 'number' &&
          Number.isInteger(e.status)
        ) {
          status = e.status;
        }

        // Lazily load the fallback HTML only when render fails. Doing the read +
        // viteDevServer.transformIndexHtml on every request was wasted work on the happy path
        // and exposed a race with graphql-codegen --watch where the inline <style> block in
        // fallback.html is processed by PostCSS/Tailwind while a generated .json/.ts is being
        // rewritten — surfacing as "Failed to parse JSON file" mid-startup.
        let fallbackHtmlFile = await fsp.readFile(
          IS_PRODUCTION ? 'dist/gbif/client/gbif/fallback.html' : 'gbif/fallback.html',
          'utf8'
        );
        if (!IS_PRODUCTION) {
          fallbackHtmlFile = await viteDevServer.transformIndexHtml(url, fallbackHtmlFile);
        }

        res
          .setHeader('Content-Type', 'text/html')
          .setHeader('Cache-Control', 'no-cache')
          .status(status)
          .send(fallbackHtmlFile);

        return;
      }
    } catch (error) {
      // This catch block could be reached and is not a pretty view for the end user, but is i very unlikely as it will only happen if the build files can't be found.
      // This will never happen in real life once our end to end tests are in use as the entire site wouldn't work.

      if (!IS_PRODUCTION) {
        viteDevServer.ssrFixStacktrace(error);
      }

      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  httpServer.listen(PORT, () => {
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
