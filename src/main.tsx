import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "mapbox-gl/dist/mapbox-gl.css";
import './assets/index.css';

const rootElement = document.getElementById('root');
rootElement && ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
