import express from 'express';
import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import configDev from './config.dev.babel';

const app = express();
const compiler = webpack(configDev);

app.use(webpackDev(compiler, {
  publicPath: configDev.output.publicPath,
}));

app.use(webpackHot(compiler));

app.listen(configDev.hotPort, () => {
  console.log('Dev server started at port %d', configDev.hotPort); // eslint-disable-line
});
