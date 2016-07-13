import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { SRC_DIR, BUILD_DIR } from './constants';
import config from '../config';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';

export default {
  cache: false,
  debug: false,
  entry: {
    app: [path.join(SRC_DIR, 'client/index.js')],
    static: [path.join(__dirname, 'build.js')],
  },
  module: {
    loaders: [{
      loader: 'url-loader?limit=10000',
      test: /.(jpg|gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.&]+)?$/,
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        plugins: ['transform-class-properties'],
        presets: ['es2015', 'react'],
      },
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
    }, {
      test: /\.json$/,
      include: path.resolve(__dirname, '../node_modules'),
      loader: 'json',
    }, {
      test: /\.json$/,
      exclude: path.resolve(__dirname, '../node_modules'),
      loader: `json-schema-example?${JSON.stringify(config)}!json-schema`,
    }],
  },
  output: {
    path: BUILD_DIR,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    libraryTarget: 'umd',
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
      clear: false,
    }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new ExtractTextPlugin('app-[hash].css', { allChunks: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  ],
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['src', 'node_modules'],
  },
  resolveLoader: {
    root: path.join(__dirname, '../node_modules'),
  },
};
