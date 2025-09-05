const domain = process.env.PUBLIC_BASE_URL;

const render = ({ network, node, installation, publisher, dataset }) => {
  const networkBlock = network
    .map(
      (page) => `
    <sitemap>
        <loc>${domain}/sitemap/network/${page.offset}/${page.limit}.xml</loc>
    </sitemap>
  `
    )
    .join('\n');
  const nodeBlock = node
    .map(
      (page) => `
    <sitemap>
        <loc>${domain}/sitemap/node/${page.offset}/${page.limit}.xml</loc>
    </sitemap>
  `
    )
    .join('\n');
  const installationBlock = installation
    .map(
      (page) => `
    <sitemap>
        <loc>${domain}/sitemap/installation/${page.offset}/${page.limit}.xml</loc>
    </sitemap>
  `
    )
    .join('\n');
  const publisherBlock = publisher
    .map(
      (page) => `
    <sitemap>
        <loc>${domain}/sitemap/publisher/${page.offset}/${page.limit}.xml</loc>
    </sitemap>
  `
    )
    .join('\n');
  const datasetBlock = dataset
    .map(
      (page) => `
    <sitemap>
        <loc>${domain}/sitemap/dataset/${page.offset}/${page.limit}.xml</loc>
    </sitemap>
  `
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${domain}/sitemap-prose.xml</loc>
    </sitemap>
    ${networkBlock}
    ${nodeBlock}
    ${installationBlock}
    ${publisherBlock}
    ${datasetBlock}
</sitemapindex>`;
};

export default render;
