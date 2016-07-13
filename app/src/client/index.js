import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import store from './store';
import { Provider } from 'react-redux';

const rootEl = document.getElementById('app-root');
ReactDOM.render(<Provider store={store}><Main /></Provider>, rootEl);
