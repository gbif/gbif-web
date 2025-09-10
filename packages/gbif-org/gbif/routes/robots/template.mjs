import { publicEnv } from '../../envConfig.mjs';

const domain = publicEnv.PUBLIC_BASE_URL;

const render = () =>
  'User-agent: *\n' +
  (domain !== 'https://www.gbif.org'
    ? 'Disallow: /'
    : `
Disallow: /user/
Disallow: /*/user/
Disallow: /search/
Disallow: /*/search/
Disallow: /occurrence/
Disallow: /*/occurrence/
Allow: /occurrence/download/*
Allow: /*/occurrence/download/*
Disallow: /species/search
Disallow: /*/species/search
Disallow: /dataset/search
Disallow: /*/dataset/search
Disallow: /publisher/search
Disallow: /*/publisher/search
Disallow: /grscicoll/collection/search
Disallow: /*/grscicoll/collection/search
Disallow: /grscicoll/institution/search
Disallow: /*/grscicoll/institution/search
Disallow: /grscicoll/person/search
Disallow: /*/grscicoll/person/search
crawl-delay: 0.1

User-agent: Twitterbot
Allow: /occurrence/
Disallow: /*/occurrence/
Disallow: /*/occurrence/search

Sitemap: ${domain}/sitemap.xml
Sitemap: ${domain}/sitemap-dataset.xml
Sitemap: ${domain}/sitemap-publisher.xml
Sitemap: ${domain}/sitemap-node.xml
Sitemap: ${domain}/sitemap-network.xml
Sitemap: ${domain}/sitemap-installation.xml
Sitemap: ${domain}/sitemap-species.xml
`);

export default render;
