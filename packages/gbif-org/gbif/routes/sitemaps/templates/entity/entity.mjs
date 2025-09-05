const domain = process.env.PUBLIC_BASE_URL;

const render = ({ pages, path, changefreq, priority }) => {
  const pagesBlock = pages.results
    .map((page) =>
      page.type === 'COUNTRY'
        ? `<url>
                <loc>${domain}/country/${page.country}/summary</loc>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>
            <url>
                <loc>${domain}/country/${page.country}/participation</loc>
                <changefreq>${changefreq}</changefreq>
                <priority>0.8</priority>
            </url>`
        : `
        <url>
            <loc>${domain}/${path}/${page.key}</loc>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
        </url>
    `
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pagesBlock}
</urlset>`;
};

export default render;
