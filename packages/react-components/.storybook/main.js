const path = require('path');
const fs = require('fs')

let envFile = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}.json`);
if (!fs.existsSync(envFile)) {
  console.warn("Cannot find env file: "+ envFile );
  envFile = path.resolve(__dirname, "../.env.json");
}
console.log("Storybook starts with env: " + envFile);

module.exports = {
  stories: ['../intro/**/*.stories.js', '../src/**/*.stories.js'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-a11y/register', '@storybook/addon-storysource'],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'Env': envFile,
    };
    return config;
  }
};