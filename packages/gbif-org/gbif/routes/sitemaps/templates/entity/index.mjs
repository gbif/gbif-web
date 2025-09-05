const domain = process.env.PUBLIC_BASE_URL;

const render = ({ pages, path }) => {
  const pagesBlock = pages
    .map(
      (page) => `
        <sitemap>
            <loc>${domain}/${path}/${page.offset}/${page.limit}.xml</loc>
        </sitemap>
    `
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pagesBlock}
</sitemapindex>`;
};

export default render;
