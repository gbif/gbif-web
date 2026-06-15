/**
 * Bundled fallback data used when the live endpoints are unreachable.
 *
 * The site loads its translations from a remote endpoint and its header/menu
 * from the GraphQL endpoint. If either is down (network outage, deploy, upstream
 * downtime) the site should still be able to render a usable front page, menu
 * and translated strings. The committed snapshots in this directory provide
 * that safety net.
 *
 * These files are generated and refreshed by `npm run update-fallbacks`. They
 * are intentionally stale-but-good: the live data is always preferred and only
 * falls back to these when a fetch fails.
 */
import type { HeaderQuery } from '@/gql/graphql';
import fallbackHeader from './header.en.json';
import fallbackTranslationsEntry from './translations.json';

export { fallbackTranslationsEntry };

export const fallbackHeaderData = fallbackHeader as unknown as HeaderQuery;

// Lazily load the per-locale message files so they are split into their own
// chunks and only ever fetched from the bundle when a translation load fails.
// documentation https://vite.dev/guide/features#glob-import
const messageModules = import.meta.glob<{ default: Record<string, string> }>('./messages/*.json');

export async function loadFallbackMessages(localeCode: string): Promise<Record<string, string>> {
  const loader =
    messageModules[`./messages/${localeCode}.json`] ?? messageModules['./messages/en.json'];

  if (!loader) return {};

  const mod = await loader();
  return mod.default ?? (mod as unknown as Record<string, string>);
}
