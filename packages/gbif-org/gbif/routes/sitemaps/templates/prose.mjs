import { publicEnv } from '../../../envConfig.mjs';

const domain = publicEnv.PUBLIC_BASE_URL;

const render = ({ pages }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map(
        (page) => `
        <url>
            <loc>${domain}${page._url}</loc>
            <changefreq>monthly</changefreq>
            <priority>${
              ['Programme', 'GbifProject', 'Article'].includes(page.__typename) ? 0.5 : 0.3
            }</priority>
        </url>
    `
      )
      .join('\n')}
</urlset>`;
};

export default render;
