import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('excerpts-root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

