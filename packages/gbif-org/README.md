# New GBIF.org

## Table of Contents

- [New GBIF.org](#new-gbiforg)
  - [Table of Contents](#table-of-contents)
  - [Get Up and Running](#get-up-and-running)
    - [How to Start the New GBIF.org in Development Mode](#how-to-start-the-new-gbiforg-in-development-mode)
    - [How to Build and Run the New GBIF.org](#how-to-build-and-run-the-new-gbiforg)
    - [How to Test the Code in an Environment Simulating the Hosted Portals](#how-to-test-the-code-in-an-environment-simulating-the-hosted-portals)
  - [Environment Variables](#environment-variables)
    - [Exposing Environment Variables to the Client](#exposing-environment-variables-to-the-client)
  - [GBIF.org Specific Code](#gbiforg-specific-code)
    - [In /gbif, you will find:](#in-gbif-you-will-find)
      - [`index.html`:](#indexhtml)
      - [`server.js`:](#serverjs)
      - [`vite.config.ts`](#viteconfigts)
    - [In /src/gbif, you will find:](#in-srcgbif-you-will-find)
      - [`config.ts`](#configts)
      - [`entry.client.tsx`](#entryclienttsx)
      - [`entry.server.tsx`](#entryservertsx)
      - [`routes.tsx`](#routestsx)
  - [Hosted Portal Specific Code](#hosted-portal-specific-code)
    - [In /hp, you will find:](#in-hp-you-will-find)
      - [`index.html`](#indexhtml-1)
      - [`server.js`](#serverjs-1)
      - [`vite.config.ts`](#viteconfigts-1)
    - [In /src/hp, you will find:](#in-srchp-you-will-find)
      - [`entry.tsx`](#entrytsx)
      - [`routes.tsx`](#routestsx-1)
  - [Shared Code](#shared-code)
  - [Routing](#routing)
    - [`RouteObjectWithPlugins`](#routeobjectwithplugins)
    - [`LoaderArgs`](#loaderargs)
    - [`applyReactRouterPlugins`](#applyreactrouterplugins)
    - [Example of a route definition](#example-of-a-route-definition)
  - [Styling](#styling)
    - [Conditionally Adding Classes Based on State](#conditionally-adding-classes-based-on-state)
    - [Using Plain Old CSS](#using-plain-old-css)
  - [The Global Config](#the-global-config)
  - [How to](#how-to)
    - [Add a New Route with Server-Side and Client-Side Rendering](#add-a-new-route-with-server-side-and-client-side-rendering)
      - [Creating the Page](#creating-the-page)
      - [Adding the Page to the Router](#adding-the-page-to-the-router)
    - [Add a New Route with Only Client-Side Rendering](#add-a-new-route-with-only-client-side-rendering)
    - [Code-Split a Section of the App](#code-split-a-section-of-the-app)
    - [Lazy Load a Page](#lazy-load-a-page)
  - [Code Formatting](#code-formatting)
  - [ESLint](#eslint)
  - [Known Issues](#known-issues)
    - [Loading Screens](#loading-screens)

## Get Up and Running

This project requires the Node.js version specified in [`.nvmrc`](./.nvmrc). Node versions are managed with [nvm](https://github.com/nvm-sh/nvm) — run `nvm use` to switch to it.

Before starting, place an `.env` file in the package root. The canonical configuration lives in `gbif-configuration/gbif-web`. The app also needs the [GraphQL server](https://github.com/gbif/gbif-web/tree/master/packages/graphql-api) and the translations endpoints to be reachable, either running locally or pointing at a deployed instance.

Install dependencies:

```
npm install
```

### How to Start the New GBIF.org in Development Mode

To initiate development mode, execute `npm run develop`.

### How to Build and Run the New GBIF.org

1. Build: Run `npm run build`.
2. Start: Run `npm run start`.

### How to Test the Code in an Environment Simulating the Hosted Portals

1. Build for Hosted Portals: Run `npm run build:hp`.
2. Start for Hosted Portals: Run `npm run start:hp`.

## Environment Variables

Environment variables are sourced from various `.env` files, depending on the running environment.  
The `.env` files' loading is managed by Vite. For comprehensive information on Vite's handling of environment variables, visit: [Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html#env-files).

The `.env` files for this project are located here: [gbif-configuration](https://github.com/gbif/gbif-configuration/tree/master/gbif-web/gbif-org).

### Exposing Environment Variables to the Client

Environment variables starting with `PUBLIC_` are accessible in the client-side build. It is crucial to **NEVER** prefix sensitive variables, such as private API keys, with `PUBLIC_`.

## GBIF.org Specific Code

GBIF.org leverages both server-side rendering and client-side hydration.

Files specific to GBIF.org are found in the root at [/gbif](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/gbif) and in the src folder at [/src/gbif](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/src/gbif).

### In [/gbif](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/gbif), you will find:

#### `index.html`:

This file, loaded by `server.js`, is populated by the server-side rendered app corresponding to the requested route. It also initiates the client-side build for client-side takeover through hydration.

#### `server.js`:

This script manages the production and development server for GBIF.org, loading `index.html` and a render function that will a server-side the appication based on the incoming request.

#### `vite.config.ts`

A Vite configuration file for GBIF.org. For detailed configuration options, see: [Configuring Vite](https://vitejs.dev/config/).

Note: Some configuration options are superseded by `build:client`, `build:server` scripts, and the `server.js` file.

### In [/src/gbif](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/src/gbif), you will find:

#### `config.ts`

A configuration file modifying shared code functionalities, such as root predicates, theming, internationalization, etc. This configuration is injected in a context near the root and accessible through a hook called `useConfig`.

#### `entry.client.tsx`

The entry script for the client build, responsible for hydrating the server-side rendered application.

#### `entry.server.tsx`

The server-side entry script, exposing a `render` function for application rendering based on a Express request.

This function renders the HTML of the app and acquires `headHtml`, `htmlAttributes`, and `bodyAttributes` using `react-helmet-async`. These are then injected into `index.html` by `server.js`, forming the HTML sent to the client.

#### `routes.tsx`

Defines routes for gbif.org using a custom type `RouteObjectWithPlugins`, enabling additional properties beyond those supported by `react-router-dom`.

Routes are assembled in `createGbifRoutes(config)` and processed by `applyReactRouterPlugins`, which, among other tasks, replicates routes for each language specified in `config.ts` and injects the config and locale into loader functions. The resulting output is compatible with `react-router-dom`.

## Hosted Portal Specific Code

The Hosted Portal build only leverage client-side rendering, intended for integration within hosted portals.

Files specific to Hosted Portals are located in the root at [/hp](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/hp) and in the src folder at [/src/hp](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/src/hp).

### In [/hp](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/hp), you will find:

#### `index.html`

This file is instrumental for testing the Hosted Portal code. It loads the Hosted Portal build, rendering the application with an included configuration. This file serves as a prototype for demonstrating the Hosted Portal build's utilization and does not mirror the final build on the Hosted Portals.

#### `server.js`

Utilizes `index.html` to demonstrate the Hosted Portal build, employed by the `npm run start:hp` script.

#### `vite.config.ts`

The Vite configuration file for the Hosted Portal build. This configuration remains unaltered by any scripts or files.

### In [/src/hp](https://github.com/gbif/gbif-web/tree/master/packages/gbif-org/src/hp), you will find:

#### `entry.tsx`

The entry file for the Hosted Portal build, rendering the application client-side as per the provided configuration.
This script exports a `render` function that takes a `rootElement` and a `config`.

#### `routes.tsx`

Houses route definitions for hosted portals, utilizing a custom type `RouteObjectWithPlugins`, which accommodates additional properties not supported by `react-router-dom`.

Routes are processed by `applyReactRouterPlugins`, duplicating routes for each language in `config.ts` and injecting the config and locale into loader functions. The final output is compatible with `react-router-dom`.

## Shared Code

Code not contained within the `gbif` or `hp` folders is or can be shared across the application.

## Routing

Handled by [react-router-dom version 6](https://reactrouter.com/en/main).

Routes are declared with a custom type, `RouteObjectWithPlugins`, which extends the standard `react-router-dom` `RouteObject` with a few extra properties. The whole route tree is then passed through `applyReactRouterPlugins`, which transforms it into a plain `RouteObject[]` that `react-router-dom` understands. For GBIF.org this happens in `createGbifRoutes(config)` (see `src/gbif/routes.tsx`); the Hosted Portal build does the equivalent in `src/hp/routes.tsx`. Both the type and the plugins live in [`src/reactRouterPlugins`](src/reactRouterPlugins).

### `RouteObjectWithPlugins`

Our custom route type adds the following properties on top of a `react-router-dom` `RouteObject`:

```ts
type RouteObjectWithPlugins = {
  // Optional human-readable description of the route.
  description?: string;

  // An element rendered while navigating to this route.
  loadingElement?: JSX.Element;

  // A loader that receives the extended `LoaderArgs` (see below) rather than the
  // plain react-router-dom loader arguments.
  loader?: (args: LoaderArgs) => unknown;

  // A partial config merged over the global config for this route and its children.
  overrideConfig?: Partial<Config>;

  // Returns a gbif.org URL to redirect to when the route is not enabled on a
  // hosted portal (or null to skip the redirect).
  gbifRedirect?: (
    params: Record<string, string | undefined>,
    locale: LanguageOption,
    searchParams?: ParamQuery
  ) => string | null;

  isCustom?: boolean;
  isSlugified?: boolean;
} & RouteObject; // plus all standard RouteObject properties; `children` is typed as RouteObjectWithPlugins[]
```

### `LoaderArgs`

Loaders do not receive the raw `react-router-dom` arguments. The plugin pipeline wraps every loader and injects extra values, so a loader is called with:

```ts
type LoaderArgs = LoaderFunctionArgs & {
  locale: LanguageOption;  // the locale resolved from the URL
  config: Config;          // the global config (with any route `overrideConfig` applied)
  graphql: GraphQLService; // a GraphQL client scoped to the request and locale
  isPreview: boolean;      // true when the URL contains ?preview=true
};
```

### `applyReactRouterPlugins`

`applyReactRouterPlugins(routes, config)` runs the route tree through a pipeline of plugins (each lives in its own folder under `src/reactRouterPlugins`):

- **Page paths** — applies config-driven path overrides and exposes the active page paths through a context, allowing a hosted portal to customise or exclude individual pages.
- **Extra occurrence search pages** — injects additional occurrence-search routes derived from the config.
- **i18n** — duplicates the route tree for every language in `config.languages`, prefixing non-default languages with their language code, and wraps the tree in an `I18nProvider` so the locale is available to routes and their children.
- **Slugified** — adds slugified path handling.
- **Extended loader** — wraps each route's `loader` so it receives the extended `LoaderArgs` (locale, config, graphql, isPreview) described above, and applies any `overrideConfig`.

The function returns a `RouteObject[]` array compatible with `react-router-dom`.

### Example of a route definition

A route is a `RouteObjectWithPlugins`. Page components are typically lazy-loaded with `React.lazy` and rendered inside a Suspense boundary:

```tsx
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';

const DatasetPage = React.lazy(() => import('./datasetKey'));

export const datasetRoute: RouteObjectWithPlugins = {
  // Identifies the route (used by react-router-dom and for page configuration).
  id: 'dataset',

  // The relative path; absolute paths are derived from the parent route paths.
  path: 'dataset/:key',

  // A loader receiving the extended LoaderArgs (config, locale, graphql, isPreview).
  loader: datasetLoader,

  // A redirect to gbif.org when the route is disabled on a hosted portal.
  gbifRedirect: (params) => `https://www.gbif.org/dataset/${params.key}`,

  // An element shown while navigating to this route.
  loadingElement: <DatasetSkeleton />,

  // The element displayed once the loader resolves.
  element: <DatasetLayout />,

  // Child routes for features like tabs; the default tab is marked { index: true }.
  children: [
    {
      index: true,
      element: (
        <StaticRenderSuspence fallback={<DatasetSkeleton />}>
          <DatasetPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'dashboard',
      element: <DatasetDashboardTab />,
    },
  ],
};
```

More on `react-router-dom` `RouteObject` options: [`Route`](https://reactrouter.com/en/main/route/route).

Note: Some example properties are custom additions to the default `RouteObject`. Refer to the `RouteObjectWithPlugins` section above for all custom properties.

## Styling

Styling in this project is implemented using [tailwindcss](https://tailwindcss.com/).

Additionally, we utilize the component library [shadcn/ui](https://ui.shadcn.com/), which enables us to add components incrementally and provides full flexibility to modify these components as needed.

### Conditionally Adding Classes Based on State

Classes can be conditionally added to an element by using the `cn` function from `'@/utils/shadcn'`.

Here is an example of how to use the function:

```ts
import { cn } from '@/utils/shadcn';

const isActive = true;
const className = cn('border', { 'text-sky-500': isActive });

console.log(className === 'border text-sky-500'); // true
```

### Using Plain Old CSS

CSS modules can also be utilized by creating a file ending in `.module.css`.

Such a file can be imported as follows:

```ts
import styles from 'myStyles.module.css';

function Component() {
  return <p className={styles.myClassName}>Test</p>;
}
```

The class names in a `module.css` file are transformed to be scoped specifically to that file.

To define a class without transforming the class name, you can do so in the following manner:

```css
:global {
  .my-class {
    background-color: green;
  }
}
```

For using CSS pre-processors like `.scss`, `.sass`, `.less`, or `.styl`, they can easily be integrated following this guide: [CSS Pre-processors](https://vitejs.dev/guide/features#css-pre-processors).

## The Global Config

The global configuration is essential for customizing the shared code across GBIF.org and the Hosted Portals.

In GBIF.org, the configuration is incorporated into the final bundle and can be found here: [config.ts](src/gbif/config.ts).

Each Hosted Portal embeds its specific configuration at the initiation of its code on the respective Hosted Portal.

Here is a detailed example of a configuration object that utilizes the full range of configuration options:

```ts
export const config: Config = {
  // The default title for the browser tab, serving as a fallback when a page lacks a specific title
  defaultTitle: 'GBIF',
  // The GraphQL endpoint for fetching data displayed on the site
  graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
  // The set of languages available on the site
  languages: [
    {
      // Language code for the 'lang' attribute in the HTML document and URL prefix (unless it's the default language)
      code: 'en',
      // The human-readable label for the language
      label: 'English',
      // Indicates the default language, available at the root URL '/'
      default: true,
      // Text direction, either 'ltr' (left-to-right) or 'rtl' (right-to-left)
      textDirection: 'ltr',
    },
    {
      code: 'ar',
      label: 'العربية',
      // As a non-default language, its code is used as a URL prefix
      default: false,
      textDirection: 'rtl',
    },
  ],
  // The root occurrence predicate for the site, detailed documentation available at https://www.gbif.org/developer/occurrence#predicates
  occurrencePredicate: {
    type: 'and',
    predicates: [
      {
        type: 'range',
        key: 'year',
        value: {
          gte: '2012',
        },
      },
    ],
  },
  // Configuration for the site's theme
  theme: {
    colors: {
      // The primary color, used in elements like buttons
      primary: 'hsl(104 57.0% 36.5%)',
      // Foreground color for primary-colored elements; defaults to black or white for optimal contrast
      primaryForeground: 'black',
    },
    // Border radius for elements such as cards and buttons, measured in rem
    borderRadius: 0.5,
  },
};
```

## How to

### Add a New Route with Server-Side and Client-Side Rendering

#### Creating the Page

A page is made of a **loader** that fetches the data and a **component** that renders it. The loader receives a `graphql` client (already scoped to the request and locale) and runs during both server-side rendering and client-side navigation. GraphQL types are generated by [graphql-codegen](https://the-guild.dev/graphql/codegen) from the `/* GraphQL */`-tagged query strings — run `npm run codegen` once, or `npm run develop`, which watches for changes. Each query must be uniquely named.

```tsx
import { useConfig } from '@/config/config';
import { OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { throwCriticalErrors, useNotifyOfPartialDataIfErrors } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';

// The /* GraphQL */ comment lets codegen discover the query and generate the
// `OccurrenceQuery` / `OccurrenceQueryVariables` types imported above.
const OCCURRENCE_QUERY = /* GraphQL */ `
  query Occurrence($key: ID!) {
    occurrence(key: $key) {
      eventDate
      scientificName
      coordinates
      dataset {
        key
        title
      }
    }
  }
`;

// Fetches the data for this page. Runs on the server (SSR) and on the client
// (client-side navigation). `graphql`, `config`, `locale` and `isPreview` are
// injected by the route plugins; see the Routing section.
export async function occurrenceLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(OCCURRENCE_QUERY, {
    key,
  });
  const { errors, data } = await response.json();

  // Throw a 404/critical error if a required object is missing.
  throwCriticalErrors({ path404: ['occurrence'], errors, requiredObjects: [data?.occurrence] });

  return { errors, occurrence: data.occurrence! };
}

export type OccurrenceLoaderResult = Awaited<ReturnType<typeof occurrenceLoader>>;

// The page component reads the loader result via `useLoaderData`.
export function OccurrencePage() {
  const { occurrence, errors } = useLoaderData() as OccurrenceLoaderResult;
  useNotifyOfPartialDataIfErrors(errors);
  const config = useConfig();

  return (
    <>
      {/* Helmet modifies the document head based on the current page. More info: https://www.npmjs.com/package/react-helmet-async */}
      <Helmet>
        <title>{occurrence.scientificName}</title>
      </Helmet>

      <h1>{occurrence.scientificName}</h1>
    </>
  );
}
```

To fetch additional, non-critical data on the client after the initial render (for example slow metrics), use the `useQuery` hook from `@/hooks/useQuery` inside the component instead of the loader:

```tsx
import useQuery from '@/hooks/useQuery';

const { data, load } = useQuery<MetricsQuery, MetricsQueryVariables>(METRICS_QUERY, {
  lazyLoad: true, // don't run until `load` is called
  notifyOnErrors: true,
  throwAllErrors: false,
});
```

#### Adding the Page to the Router

To integrate the newly created page into the application, register it in the router configuration. This involves updating two separate files: [Hosted Portals Routes](src/hp/routes.tsx) and [GBIF.org Routes](src/gbif/routes.tsx). If the page should be available on both Hosted Portals and GBIF.org, add it to both.

Here's an example of registering the demo page:

```tsx
{
  id: 'occurrence-page',
  path: 'occurrence/:key',
  loader: occurrenceLoader,
  // Optional: shown while navigating to this route. A shadcn/ui 'skeleton' is a
  // good fit here (https://ui.shadcn.com/docs/components/skeleton).
  loadingElement: <OccurrencePageSkeleton />,
  element: <OccurrencePage />,
}
```

For more information about configuring individual routes, refer to the [Routing](#routing) section.

### Add a New Route with Only Client-Side Rendering
Currently, a standard method for adding client-side only routes hasn't been established. However, the approach is similar to server-side routes, excluding the `loadingElement` and `loader`. Data fetching and loading state management should be handled directly within the component. 

### Code-Split a Section of the App
Code splitting can make sense when a specific part of your application is large or not immediately necessary, thereby improving the initial load performance. Vite will automatically create a new bundle for the code that is lazy loaded, ensuring that these larger or less critical components don't affect the initial page load speed.

```tsx
import { Suspense, lazy } from 'react';
const MyLazyComponent = lazy(() => import('@/components/MyLazyComponent'));

function Component() {
  return (
    <>
      <p>This text will be there when the component renders</p>

      <Suspense fallback={<p>MyLazyComponent is loading...</p>}>
        <MyLazyComponent />
      </Suspense>
    </>
  );
}
```

This approach is particularly beneficial for large components or features that are not essential to the initial user experience, allowing the primary content to load quickly while deferring the loading of these components until they are needed.

It could make sense to wrap a `Suspense` component with an `ErrorBoundary` to handle scenarios where the dynamically imported component fails to load. This approach provides a robust error handling mechanism, ensuring that your application can gracefully manage loading errors and enhance the overall user experience.

By implementing an `ErrorBoundary` around `Suspense`, you can effectively catch and handle any unexpected issues that might arise during the lazy loading of components, maintaining application stability even in the face of unforeseen errors.

### Lazy Load a Page
Lazy loading an entire page reduces the size of the main bundle, resulting in faster hydration. Page components are loaded with `React.lazy` and rendered inside a Suspense boundary (`StaticRenderSuspence`), so the page's code is split into its own bundle and only fetched when the route is visited.

Here's an example of how to lazy load a page:

```tsx
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';

const OccurrenceSearchPage = React.lazy(() => import('@/routes/occurrence/search/Page'));

export const occurrenceSearchRoute: RouteObjectWithPlugins = {
  id: 'occurrence-search-page',
  path: 'occurrence/search',
  loader: occurrenceSearchLoader,
  loadingElement: <OccurrenceSearchPageSkeleton />,
  element: (
    <StaticRenderSuspence fallback={<OccurrenceSearchPageSkeleton />}>
      <OccurrenceSearchPage />
    </StaticRenderSuspence>
  ),
};
```

Note: To ensure proper code splitting, keep the lazily-imported page `element` in a different file from the `loader` and `loadingElement`. This keeps the main bundle smaller and accelerates the initial load. The `loader` also fetches the necessary data concurrently while the JavaScript for the page is still downloading.

> **Consequence for server-side rendering:** the server renders with `renderToString`, which cannot suspend, so `StaticRenderSuspence` deliberately renders its `fallback` on the server instead of the lazy component (see `src/components/staticRenderSuspence.tsx`). A lazily-loaded page is therefore **not server-rendered** — the initial HTML contains only the skeleton, and the real content is loaded and rendered on the client after hydration. This is a good trade for interactive or low-traffic pages (tools, tabs), but for pages where server-rendered content matters for SEO or first contentful paint (for example dataset, species and occurrence detail pages), prefer loading the page eagerly.
>
> **Splitting without breaking SSR:** if you need both code splitting *and* server-rendered content, use react-router-dom's native route-level `lazy` instead of `React.lazy`. It is resolved before rendering on both ends: the server builds its routes with `createStaticHandler` (see `src/gbif/entry.server.tsx`), which resolves a matched route's `lazy` import before `renderToString` runs, and the client pre-resolves the matched `lazy` routes in `loadLazyRoutes` before `hydrateRoot` (see `src/gbif/entry.client.tsx`), so the server-rendered content hydrates synchronously without a mismatch.
>
> Keep the route's `loader` defined **statically** on the route (do not return it from `lazy`). The route plugins wrap the loader at build time to inject `config`, `locale`, `graphql` and `isPreview`, and a loader returned from `lazy` would bypass that injection. Keeping the loader out of the split chunk also lets it start fetching in parallel while the element chunk downloads.

```tsx
{
  id: 'occurrence-search-page',
  path: 'occurrence/search',
  lazy: async () => {
    const { OccurrenceSearchPage } = await import('@/routes/occurrence/search/Page');
    return { element: <OccurrenceSearchPage /> };
  },
  loader: occurrenceSearchLoader,
  loadingElement: <OccurrenceSearchPageLoading />,
}
```

Note: `lazy` returns only the `element`; the `loader` stays defined on the route so the plugins still inject its arguments and it can fetch in parallel.

## Code Formatting

Code formatting within this project is managed using Prettier. To ensure consistency across the codebase, you are encouraged to install the Prettier extension in your code editor. Ideally, enable the 'format on save' feature for automatic formatting. The project's root directory contains a Prettier configuration file, which specifies the formatting rules to be applied. Adhering to these guidelines will help maintain a uniform coding style throughout the project.

## ESLint

This project employs ESLint to enforce coding standards and ensure high-quality code contributions. To facilitate adherence to these standards, it's recommended that you install the ESLint extension in your code editor. This will enable real-time linting, alerting you to any violations of the ESLint rules as you code.

The root directory of the project contains an ESLint configuration file which outlines the specific rules to be followed. By integrating this tool into your development workflow, you can contribute code that consistently meets the project's quality and style guidelines.

## Known Issues

### Loading Screens

Loading screens are displayed only when navigating between routes, not during the initial rendering. This leads to a suboptimal experience for the Hosted Portals where server-side rendering is not utilized.

The loading screens are shown while technically still on the route being navigated away from. This means that the URL in the browser will still reflect the previous route while the new one is loading.

Loading screens do not apply when navigating to the same route with different parameters.
