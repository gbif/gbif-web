import { type Row, testRows } from '../../pageRows';

// One row per page type: rendered server-side, hydrated, showing its own content. Keys exist in
// production so the recordings resolve; expected text comes from the recordings.
const ROWS: Row[] = [
  { id: 'home', url: '/', title: 'GBIF', h1: 'Free and open access to biodiversity data' },
  {
    id: 'occurrenceSearch',
    url: '/occurrence/search',
    title: 'Occurrence search',
    resultCount: /^[\d,]+ results$/,
  },
  {
    id: 'occurrenceKey',
    url: '/occurrence/5938027305',
    title: 'Euphagus cyanocephalus (Wagler, 1829)',
    h1: /^Euphagus cyanocephalus \(Wagler, 1829\)/,
  },
  {
    id: 'datasetSearch',
    url: '/dataset/search',
    title: 'Dataset search',
    resultCount: /^[\d,]+ datasets$/,
  },
  {
    id: 'datasetKey',
    url: '/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7',
    title: 'iNaturalist Research-grade Observations',
    h1: 'iNaturalist Research-grade Observations',
  },
  {
    id: 'publisherSearch',
    url: '/publisher/search',
    title: 'Publisher search',
    resultCount: /^[\d,]+ publishers$/,
  },
  {
    id: 'publisherKey',
    url: '/publisher/28eb1a3f-1c15-4a95-931a-4af90ecb574d',
    title: 'iNaturalist.org',
    h1: 'iNaturalist.org',
  },
  {
    id: 'taxonSearch',
    url: '/taxon/search',
    title: 'Taxon search',
    resultCount: /^[\d,]+ results$/,
  },
  {
    id: 'taxonKey',
    url: '/taxon/4DXXM',
    title: 'Passer domesticus',
    h1: 'Passer domesticus (Linnaeus, 1758)',
  },
  {
    id: 'installationKey',
    url: '/installation/a3c51b22-e3ff-4ddf-a82e-13f442763e86',
    title: 'ServCat U.S. Fish and Wildlife Service',
    h1: 'ServCat U.S. Fish and Wildlife Service',
  },
  {
    id: 'networkKey',
    url: '/network/2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6',
    title: 'Ocean Biodiversity Information System (OBIS)',
    h1: 'Ocean Biodiversity Information System (OBIS)',
  },
  { id: 'countryKey', url: '/country/DK/summary', title: 'Denmark', h1: 'Denmark' },
  {
    id: 'downloadKey',
    url: '/occurrence/download/0012986-260928105237408',
    title: 'Download 2026-10-06T16:00:51.881+00:00',
    h1: '4,225 occurrences downloaded',
  },
  {
    id: 'literatureSearch',
    url: '/literature/search',
    title: 'Literature search',
    resultCount: /^[\d,]+ results$/,
  },
  {
    id: 'resourceSearch',
    url: '/resource/search',
    title: 'Resource search',
    resultCount: /^[\d,]+ results$/,
  },
  {
    id: 'news-key',
    url: '/news/5Rlq6vQWmgOAxRtNZYvsGc',
    title: '2026 CESP projects improve biodiversity capacity across the GBIF network',
    h1: '2026 CESP projects improve biodiversity capacity across the GBIF network',
  },
  {
    // Has a URL alias; the page redirects to it client-side.
    id: 'article-key',
    url: '/article/4KY2Ct5v60rocbbjEiwlRN',
    title: 'Official Rules: 2026 GBIF Ebbe Nielsen Challenge',
    h1: 'Official Rules: 2026 GBIF Ebbe Nielsen Challenge',
  },
  {
    id: 'event-key',
    url: '/event/d30f82-61d1-4364-b7ca-05fb6fb',
    title: 'Data Use Club practical session: Sequence data on the new GBIF.org',
    h1: 'Data Use Club practical session: Sequence data on the new GBIF.org',
  },
  {
    id: 'data-use-key',
    url: '/data-use/5rs8KeqPgGg8w1yl5xeaX3',
    title: 'Combined impact assessment modelling shows limits of single-policy conservation',
    h1: 'Combined impact assessment modelling shows limits of single-policy conservation',
  },
  {
    id: 'programme-key',
    url: '/programme/3ilFFs3JdY2SqmyCuac0uc',
    title: 'Northern Eurasia',
    h1: 'Northern Eurasia',
  },
  {
    id: 'project-key',
    url: '/project/BID-REG2025-081',
    title:
      'Increasing open biodiversity information in Central America through digitized collections',
    h1: 'Increasing open biodiversity information in Central America through digitized collections',
  },
  { id: 'tool-key', url: '/tool/6RMOeNBhe6gcxxDC1KZVsg', title: 'PhyloNext', h1: 'PhyloNext' },
  {
    id: 'document-key',
    url: '/document/3zlBKROKrqfTJlWo5PNtBi',
    title: 'Multi-Factor Authentication (MFA) for Fluxx',
    h1: 'Multi-Factor Authentication (MFA) for Fluxx',
  },
  {
    id: 'the-gbif-network',
    url: '/the-gbif-network',
    title: 'The Participant network',
    h1: 'The Participant network',
  },
  {
    id: 'analytics',
    url: '/analytics/global',
    title: 'Global data trends',
    h1: 'Global data trends',
  },
  { id: 'omniSearch', url: '/search?q=puma', title: 'Search', h1: 'Search' },
  { id: 'contactUs', url: '/contact-us', title: 'Contacts', h1: 'Contacts' },
  { id: 'faq', url: '/faq', title: 'FAQ', h1: 'FAQ' },
  {
    id: 'speciesLookup',
    url: '/tools/species-lookup',
    title: 'Species Matching',
    h1: 'Species Matching',
  },
  { id: 'nameParser', url: '/tools/name-parser', title: 'Name Parser', h1: 'Name Parser' },
  {
    // No CMS entry in production; the page falls back to its built-in title.
    id: 'sequenceId',
    url: '/tools/sequence-id',
    title: 'Sequence ID',
    h1: 'Sequence ID',
  },
  {
    id: 'occurrence-snapshots',
    url: '/occurrence-snapshots',
    title: 'Occurrence snapshots',
    h1: 'Occurrence snapshots',
  },
  { id: 'user-login', url: '/user/login', title: 'Login', h1: 'Welcome back' },
  { id: '404', url: '/this-page-does-not-exist', title: 'GBIF', h1: '404', status: 404 },
];

testRows(ROWS);
