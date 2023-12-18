import fsp from 'node:fs/promises';
import express from 'express';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || 3000);

async function main() {
  const app = express();

  // Disable the x-powered-by header as it can encourage Express specific attacks.
  app.disable('x-powered-by');

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
          .replace('<html>', `<html ${htmlAttributes}>`)
          .replace('<body>', `<body ${bodyAttributes}>`)
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
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
}

main();
