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
    - [`SourceRouteObject`](#sourcerouteobject)
    - [`configureRoutes`](#configureroutes)
    - [Example of a Custom Route Definition](#example-of-a-custom-route-definition)
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
  - [Common Errors](#common-errors)

## Get Up and Running

This project requires Node.js version `v20.7.0`.

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

Defines routes for gbif.org using a custom type `SourceRouteObject`, enabling additional properties beyond those supported by `react-router-dom`.

Routes are processed by `configureRoutes`, which, among other tasks, replicates routes for each language specified in `config.ts` and injects the config and locale into loader functions. The resulting output is compatible with `react-router-dom`.

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

Houses route definitions for hosted portals, utilizing a custom type `SourceRouteObject`, which accommodates additional properties not supported by `react-router-dom`.

Routes are processed by `configureRoutes`, duplicating routes for each language in `config.ts` and injecting the config and locale into loader functions. The final output is compatible with `react-router-dom`.

## Shared Code

Code not contained within the `gbif` or `hp` folders is or can be shared across the application.

## Routing

Handled by [react-router-dom version 6](https://reactrouter.com/en/main).

We utilize a custom type `SourceRouteObject` for route definition, enhancing standard functionalities.

`configureRoutes` transforms our custom route definitions into a format compatible with `react-router-dom`.

### `SourceRouteObject`

Our custom type for route definition, incorporating additional functionalities.

```ts
type SourceRouteObject = Omit<RouteObject, 'loader' | 'children' | 'lazy'> & {
  // 'key' is optionally used to activate or deactivate the route in the global configuration.
  key?: string;

  // 'loader' is an optional function that supersedes the default loader, adding unique functionality and parameters.
  loader?: (args: LoaderArgs) => Promise<any>;

  // 'loadingElement' is an optional React node rendered during the navigation process to this route.
  loadingElement?: React.ReactNode;

  // 'children' are SourceRouteObjects, allowing nested route definitions within this route object.
  children?: SourceRouteObject[];

  // 'gbifRedirect' is an optional function enabling redirection to gbif.org for routes not active on hosted portals.
  gbifRedirect?: (params: Record<string, string | undefined>) => string;

  // 'lazy' is a function for lazy loading the route's component, improving performance by loading the component only when required.
  lazy?: () => Promise<Pick<RouteObject, 'element'>>;
};
```

### `configureRoutes`

This function transforms our custom route definitions to a format compatible with `react-router-dom`. It performs the following operations:

- Duplicates each route for every language, appending a specific path prefix to differentiate them.
- Wraps the root routes with the `I18nProvider`, thereby making the locale accessible to the route and its child components.
- Injects the configuration and the selected locale into the loaders, customizing their behavior based on these settings.
- Removes any routes that are not enabled in the global configuration, ensuring only active routes are processed.
- Adds a `LoadingElementWrapper` to every route element. This wrapper enables the display of the `loadingElement` specified for the route currently being navigated to.
- Dispatches a `StartLoadingEvent` within the loader. This event informs the `LoadingElementContext` to display a loading element if one is available.
- Returns an array of routes that is compatible with `react-router-dom`, ensuring seamless integration with this library.
- Generates and returns a `RouteMetadata` array. This array facilitates access to some of the custom properties of the routes during runtime, using a context for dynamic retrieval.

### Example of a Custom Route Definition

```ts
{
  // A key identifying the page for enablement/disablement in the global config
  key: 'dataset-page',

  // The relative path of the route, considering parent route paths for absolute path determination
  path: 'dataset/:key',

  // A custom loader function receiving global config, selected locale, request, and parameters
  loader: datasetLoader,

  // A function generating a redirect link to gbif.org if disabled by the global config
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    return `https://www.gbif.org/dataset/${params.key}`;
  },

  // An element displayed during navigation to this route
  loadingElement: <DatasetLoadingPage />,

  // The primary element displayed upon loader completion
  element: <DatasetPage />,

  // An element displayed in case of loader or element errors
  errorElement: <DatasetErrorPage />,

  // Function for lazy loading the route component, improving performance by loading only when needed. 'element' should not be used in conjunction with 'lazy'
  async lazy: () {
    const { DatasetPage } = await import('@/routes/dataset/key/Page');
    return { element: <DatasetPage /> }
  }

  // Child routes for features like tabs, with the default route marked by { index: true }
  children: [
    {
      index: true,
      element: <DatasetAboutTab />,
    },
    {
      path: 'dashboard',
      element: <DatasetDashboardTab />,
    },
  ],
}
```

More on `react-router-dom` `RouteObject` options: [`Route`](https://reactrouter.com/en/main/route/route).

Note: Some example properties are custom or override the default `RouteObject`. Refer to the `SourceRouteObject` section above for all custom properties.

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

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';

/* 
This function generates helper utilities for efficient and type-safe data fetching, based on a GraphQL query. The preceding GraphQL comment ensures codegen generates relevant types for the query. During development, the codegen will monitor for changes and update types accordingly. It's essential to supply these generated types to the `createGraphQLHelpers` function for type safety. The `load` function enforces the use of all required variables with the correct types. The `useTypedLoaderData` hook ensures type safety for the query response, meaning you'll be aware of the response types and need to handle nullable values. The query must be uniquely named to facilitate the generation of type names.
*/
const { load, useTypedLoaderData } = createGraphQLHelpers<
  OccurrenceQuery,
  OccurrenceQueryVariables
>(/* GraphQL */ `
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
`);

// Example of a page component using data from the above query
export function DetailedOccurrencePage() {
  const { data } = useTypedLoaderData();

  if (data.occurrence == null) throw new Error('404');
  const occurrence = data.occurrence;

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

// Function for fetching data for this page, executed on the server (for SSR) and client (for CSR)
export async function detailedOccurrenceLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the URL');

  return load({
    endpoint: config.graphqlEndpoint,
    request,
    variables: {
      key,
    },
  });
}

// Optional component to display a page-specific loading screen during navigation. For building comprehensive loading screens, consider using the 'skeleton' component from shadcn/ui: https://ui.shadcn.com/docs/components/skeleton
export function DetailedOccurrencePageLoading() {
  return <div>Loading...</div>; // Placeholder text; replace with skeleton component as needed
}
```
#### Adding the Page to the Router

To integrate the newly created page into the application, it needs to be registered in the router configuration. This process involves updating two separate files: [Hosted Portals Routes](src/hp/routes.tsx) and [GBIF.org Routes](src/gbif/routes.tsx). If the new page is intended to be available on both Hosted Portals and GBIF.org, it must be added to both files.

Here's an example of adding the demo page:

```tsx
{
  key: 'occurrence-page',
  path: 'occurrence/:key',
  loader: detailedOccurrenceLoader,
  loadingElement: <DetailedOccurrencePageLoading />,
  element: <DetailedOccurrencePage />,
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
Lazy loading an entire page is a strategy to reduce the size of the main bundle, resulting in faster hydration processes. `react-router-dom` natively supports this feature.

Here's an example of how to lazy load a route:

```tsx
{
  key: 'occurrence-search-page',
  path: 'occurrence/search',
  async lazy: () {
    const { OccurrenceSearchPage } = await import('@/routes/occurrence/search/Page');
    return { element: <OccurrenceSearchPage /> }
  },
  loader: occurrenceSearchLoader,
  loadingElement: <OccurrenceSearchPageLoading />,
},
```

Note: To ensure proper code splitting, the `element` should be placed in a different file than the `loader` and `loadingElement`. This division allows the main bundle to remain smaller, accelerating the initial load. Additionally, the `loader` will load the necessary data concurrently while the JavaScript for the page is being loaded, optimizing resource utilization and improving user experience.

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

## Common Errors

Document any recurrent errors here, along with their solutions.
