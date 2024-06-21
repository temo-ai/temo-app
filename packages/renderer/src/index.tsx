import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'jotai';
import {store} from './utils/atoms';
import '../index.css';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </React.StrictMode>,
);
