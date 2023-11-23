# New GBIF.org

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
type SourceRouteObject = Omit<RouteObject, 'loader' | 'children'> & {
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

### Theming

### Enabling/Disabeling routes

## Common Errors
Document any recurrent errors here, along with their solutions.