/* eslint global-require: 0 */

import { createStore } from 'redux';
import docs from './reducers/index';
import schemas from '../../schemas';
import { ACTIONS } from './constants';

function configureStore(reducer, initialState) {
  const store = createStore(reducer, initialState,
    (typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined') ?
        window.devToolsExtension() : f => f
  );
  return store;
}

const store = configureStore(docs, { schemas });
export default store;

if (module.hot) {
  module.hot.accept('../../schemas', () => {
    store.dispatch({
      type: ACTIONS.REINIT_SCHEMAS,
      payload: require('../../schemas').default,
    });
  });
}
