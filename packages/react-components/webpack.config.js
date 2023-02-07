const path = require('path');
const fs = require("fs");

module.exports = (env, argv) => {
  //Use .env.json if no mode is found in argv and env
  const mode = argv.mode || env?.NODE_ENV || '';
  let envFile = path.resolve(__dirname, `.env.${mode ? mode+".json" : "json"}`);
  if (!fs.existsSync(envFile)) {
    console.warn("Cannot find env file: "+ envFile );
    envFile = path.resolve(__dirname, ".env.json");
  }
  console.log("Webpack is building with env: " + envFile);

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/lib'),
      filename: 'gbif-react-components.js',
      library: 'gbifReactComponents',
      libraryTarget: 'var'
    },
    devtool: 'source-map',
    externals: {
      'react': 'React', // Case matters here
      'react-dom': 'ReactDOM', // Case matters here
    },
    resolve: {
      alias: {
        'Env': envFile
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: ['transform-react-remove-prop-types', '@babel/plugin-transform-runtime'],
              presets: ["@babel/preset-env", "@babel/preset-react", "@emotion/babel-preset-css-prop"]
            }
          }
        }
      ]
    }
  }
};