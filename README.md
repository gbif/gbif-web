# GBIF-web
This is a monorepo intended to group GBIF web components and API wrappers that serve UI specific needs.

<!-- TOC -->
- [Packages](#packages)
  - [React Components](./packages/react-components/README.md)
- [Adding packages](#adding-packages)
- [License](#license)
  <!-- /TOC -->

## Adding packages

To add another package create a new directory in the packages folder. Since we are using Lerna all package scripts are available from the root by running lerna run {script_name}

### You found a bug or want to propose a feature?

- Be aware that this is work in progress, but ideas are welcomed.
- File an issue here on [GitHub](https://github.com/gbif/gbif-web/issues/new).

### Using Lerna to link packages
`npx lerna bootstrap`
React throws an invalid hook call exception when linking packages unless the dependencies are hoisted.

`npx lerna bootstrap --hoist` will help but then babel fails when running `gbif-react-components`. The simplest seem to be to install `react`and `react-dom` in project root and then delete it from the projects in `packages`. 

See https://github.com/facebook/react/issues/15097#issuecomment-549576675 and https://github.com/facebook/react/issues/14257 and https://github.com/storybookjs/storybook/issues/10347

I would be happy to have a better solution, so ideas are very much welcomed.

## License

This repository is published under the [Apache License 2.0](LICENSE.md).