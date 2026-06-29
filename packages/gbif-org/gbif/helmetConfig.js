export const helmetConfig = {
  referrerPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        'maxcdn.bootstrapcdn.com',
        'cdn.jsdelivr.net/codemirror.spell-checker/',
        `'self'`,
        `*.gbif.org`,
        `*.gbif-uat.org`,
        `*.gbif-test.org`,
        `*.gbif-dev.org`,
        `*.gbif-lab.org`,
        `*.gbif-staging.org`,
        `*.gbif-preview.org`,
        '*.google.com',
        '*.google-analytics.com',
        'plausible.io',
        'fonts.gstatic.com',
        'images.ctfassets.net',
        'data:',
        'api.mapbox.com',
        '*.tiles.mapbox.com',
        '*.vimeo.com',
        'vimeo.com',
        'eepurl.com',
        'gbif.us18.list-manage.com',
        'zenodo.org',
        '*.youtube.com',
        'phttj8y9mw9t.statuspage.io', // prod - our specific statuspage domain, could also allow all subdomains of statuspage.io
        'tpr241s1tthg.statuspage.io', // test
        'openmaptiles.github.io',
        'api.maptiler.com',
        'localhost:*',
      ],
      scriptSrc: [
        `'self'`,
        `'unsafe-inline'`,
        `'unsafe-eval'`,
        `*.gbif.org`,
        `*.gbif-uat.org`,
        `*.gbif-test.org`,
        `*.gbif-dev.org`,
        `*.gbif-lab.org`,
        `*.gbif-staging.org`,
        `*.gbif-preview.org`,
        '*.google-analytics.com',
        'plausible.io',
        'api.mapbox.com',
        'unpkg.com/react@17/umd/react.production.min.js',
        'unpkg.com/react-dom@17/umd/react-dom.production.min.js',
      ],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        '*.googleapis.com',
        'cdnjs.cloudflare.com/ajax/libs/mapbox-gl/*.css',
        'api.mapbox.com',
        'maxcdn.bootstrapcdn.com',
        // Used to load Inter font
        'rsms.me',
      ],
      mediaSrc: ['*'],
      imgSrc: ['*', 'data:'],
      workerSrc: ['blob:', `'self'`],
      upgradeInsecureRequests: process.env.DISABLE_HTTPS_UPGRADE ? null : [], // this is useful for testing a prod build over http in docker
      // frameAncestors is intentionally absent here. Helmet refuses to send both
      // X-Frame-Options and frame-ancestors simultaneously (they conflict). X-Frame-Options is by default SAMEORIGIN.
      // Widget routes that need iframe embedding handle frame-ancestors in a dedicated middleware in
      // server.js (see the /api/widgets handler) which runs after helmet and overrides
      // X-Frame-Options for those paths only.
    },
  },
  hsts: {
    maxAge: 600,
    includeSubDomains: true,
  },
};
