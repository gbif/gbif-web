import { Root } from '@/components/root';
import { gbifConfig } from '@/gbif/config';
import { createGbifRoutes } from '@/gbif/routes';
import { extractLocaleFromPathname } from '@/reactRouterPlugins/i18n/extractLocaleFromURL';
import {
  getMessagesForLocale,
  loadMessagesFromUrl,
  mergeCustomMessages,
} from '@/reactRouterPlugins/i18n/loadMessages';
import { MessagesProvider } from '@/reactRouterPlugins/i18n/messagesContext';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouteObject, RouterProvider } from 'react-router-dom';

declare global {
  interface Window {
    // The versioned, cacheable messages path the server used for SSR (e.g. `/en.json?v=<hash>`).
    // Inlined by gbif/server.js; the client prepends its own translation endpoint and fetches the
    // exact same file before hydration.
    __I18N_MESSAGES_PATH__?: string;
    // The translation fetch the server kicks off from <head>, awaited here instead of starting our
    // own after the route bundle loads. Resolves to the parsed messages, or null on failure.
    __I18N_MESSAGES_PROMISE__?: Promise<Record<string, string> | null>;
  }
}

hydrate();

async function hydrate() {
  // Configure the routes
  const routes = createGbifRoutes(gbifConfig);

  // Load lazy routes and the translation messages concurrently. Messages must be present before we
  // hydrate IntlProvider, otherwise the client's first render would not match the SSR HTML.
  const [, messages] = await Promise.all([loadLazyRoutes(routes), loadInitialMessages()]);

  const router = createBrowserRouter(routes);

  const root = document.getElementById('app');
  if (root == null) throw new Error("Couldn't find root element");

  hydrateRoot(
    root,
    <Root config={gbifConfig}>
      <MessagesProvider messages={messages}>
        <RouterProvider router={router} fallbackElement={null} />
      </MessagesProvider>
    </Root>,
    {
      onRecoverableError: (error) => {
        // Ignore intentional suspense errors. See staticRenderSuspence.tsx for more context.
        if (
          error instanceof Error &&
          error.message === 'This component should not be rendered on the server.'
        ) {
          return;
        }

        console.error(error);
      },
    }
  );
}

// Load the per-locale messages. Prefer the URL inlined by the server so
// we fetch the exact same versioned (cacheable) file; fall back to resolving it from the entry file
// if the global is missing. loadMessagesFromUrl/getMessagesForLocale already degrade to bundled
// fallback messages on failure.
async function loadInitialMessages(): Promise<Record<string, string>> {
  const defaultLanguage = gbifConfig.languages.find((l) => l.default) ?? gbifConfig.languages[0];
  const localeCode = extractLocaleFromPathname(
    window.location.pathname,
    gbifConfig.languages.map((l) => l.code),
    defaultLanguage.code
  );
  const matchedLanguage =
    gbifConfig.languages.find((l) => l.code === localeCode) ?? defaultLanguage;

  // Prefer the fetch the server already started in <head>; on failure (null) fall through to the
  // path-based load below, which has its own bundled fallback.
  const inflight = window.__I18N_MESSAGES_PROMISE__;
  if (inflight) {
    const messages = await inflight;
    if (messages) return mergeCustomMessages(gbifConfig, matchedLanguage, messages);
  }

  // Prepend the client's own translation endpoint to the inlined path so we hit the exact same
  // versioned file the server rendered with (server/client endpoints can differ - docker SSR split).
  const inlinedPath = window.__I18N_MESSAGES_PATH__;
  if (inlinedPath) {
    return loadMessagesFromUrl(
      gbifConfig,
      matchedLanguage,
      `${gbifConfig.translationsEntryEndpoint}${inlinedPath}`
    );
  }
  return getMessagesForLocale(gbifConfig, matchedLanguage);
}

// This function will allow us to use lazy routes
// Read more about lazy routes here: https://reactrouter.com/en/main/route/lazy
async function loadLazyRoutes(routes: RouteObject[]) {
  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => typeof m.route.lazy === 'function'
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy!();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      })
    );
  }
}
