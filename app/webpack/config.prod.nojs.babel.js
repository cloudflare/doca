import StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin';
import config from './config.prod.babel.js';
import webpack from 'webpack';

config.plugins.unshift(
  new webpack.DefinePlugin({
    IS_JAVASCRIPT: false,
    LAST_MODIFIED: Date.now(),
  })
);

config.plugins.unshift(
  new StaticSiteGeneratorPlugin('static', ['/index.html'], { skipJS: true })
);

export default config;
