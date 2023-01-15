import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reset-css';
import App from './App';
import { AMAP_CODE } from './constants';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
