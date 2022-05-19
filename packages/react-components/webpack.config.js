const path = require('path');
const pkg = require('./package.json');

const browserConfig = {
  name: 'browser',
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
};

const nodeConfig = {
  name: 'node',
  target: 'node',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build/esm'),
    filename: 'index.js',
    library: 'gbifReactComponents',
    libraryTarget: 'commonjs2',
  },
  externals: {
    'react': 'React', // Case matters here 
    'react-dom': 'ReactDOM', // Case matters here
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
};

module.exports = [browserConfig, nodeConfig];