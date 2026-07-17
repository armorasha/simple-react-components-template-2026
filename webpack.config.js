const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true } },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // Bakes ACTIVE_BASEMAP from the container's env (see .env / .env.example)
    // into the client bundle as process.env.ACTIVE_BASEMAP. Falls back to
    // 'natural_earth' when the var isn't set, so a build without a .env
    // still works instead of shipping 'undefined'.
    new webpack.EnvironmentPlugin({
      ACTIVE_BASEMAP: 'natural_earth',
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 3000,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    watchFiles: ['src/**/*'],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};
