import React, { PropTypes } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import Main from '../src/client/main';
import store from '../src/client/store';
import { Head } from 'doca-bootstrap-theme';
import config from '../config';

const Page = ({ hash, skipJS, skipCSS }) =>
  <html>
    <Head title={config.title} cssBundle={skipCSS ? '' : `app-${hash}.css`} />
    <body>
      <div id="app-root">
        <Provider store={store}><Main /></Provider>
      </div>
      {!skipJS && <script src={`app-${hash}.js`} type="text/javascript" />}
    </body>
  </html>;


Page.propTypes = {
  hash: PropTypes.string,
  skipJS: PropTypes.bool,
  skipCSS: PropTypes.bool,
};

export default (locals, callback) => {
  const skipCSS = !Object.keys(locals.webpackStats.compilation.assets)
    .some(val => val === `app-${locals.webpackStats.hash}.css`);
  callback(null, `<!DOCTYPE html>${ReactDOMServer.renderToStaticMarkup(
    <Page hash={locals.webpackStats.hash} skipJS={locals.skipJS} skipCSS={skipCSS}/>
  )}`);
};

