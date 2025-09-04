import render from './template.mjs';
export function register(app) {
  app.get('/robots.txt', function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.set('Content-Type', 'text/plain');
    res.send(render());
  });
}
