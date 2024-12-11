# gbif-react-components

## Quick start
The `.env`-file should be placed in root and can be found in `gbif-configuration/gbif-web`.

Make sure you have the correct version on Node installed. We manage node versions with [nvm](https://github.com/nvm-sh/nvm). Type `nvm use` to install the required version. You can also do so manually, see `.nvmrc` for the required version.

```
npm install
```

Start developing with
```
npm run start
```

During development it can be useful to serve and build translation files continously. To do so you should run `npm run watch-translations` and `npm run serve-translations`

# Build storybook
Build a static storybook version with `npm run build-storybook`

Run it with `npx http-server /storybook-static`.
Notice that `serve` instead of `http-server` doesn't really work. The previews do not show then.

## Attribution

**Icons**
<a href="https://www.flaticon.com/free-icons/empty-state" title="empty state icons">Empty state icons created by Freepik - Flaticon</a>
