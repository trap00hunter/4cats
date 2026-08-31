import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 🐾 4cats Pinas — entry point
// Mounts the app and sets the Manila-time-aware document title so the
// browser tab always reads like a tiny weather ticker.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "4cats Pinas couldn't find #root in index.html — did the mount div get renamed?"
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);