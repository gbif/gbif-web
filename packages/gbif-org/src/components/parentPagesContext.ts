import { PageConfig } from '@/config/config';
import { createContext } from 'react';

/**
 * Parent pages of the route rendered inside a StandaloneWrapper, so links
 * rendered by DynamicLink can resolve paths relative to the embedding page.
 *
 * This lives in its own module rather than in standaloneWrapper.tsx because
 * DynamicLink — used by nearly every component that renders a link — only
 * needs the context. standaloneWrapper.tsx additionally imports
 * `applyReactRouterPlugins`, whose plugin chain reaches the whole route tree
 * (dashboards, map views, clusters, phylogenies), so importing the context
 * from there pulled Highcharts, MapLibre, d3 and phylotree into any bundle
 * containing a link.
 */
export const ParentPagesContext = createContext<PageConfig[]>(null!);
