const path = require('path');

module.exports = {
  entry: {
    'gbif': './src/index.js',
    'ala': './src/ala-react-components.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/lib'),
    filename: '[name]-react-components.js',
    library: '[name]ReactComponents',
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