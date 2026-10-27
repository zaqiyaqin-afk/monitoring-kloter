import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/organic.css';
import './styles/app.css';
import AppLogic from './AppLogic.js';
import View from './View.jsx';
import { createHost } from './dc/runtime.js';
import { registerSW } from 'virtual:pwa-register';

async function mulai() {
  if (import.meta.env.DEV && localStorage.getItem('mk.mock') === '1') (await import('./dev/mockSheet.js')).pasangMock();
  const App = createHost(AppLogic, View);
  createRoot(document.getElementById('root')).render(<App />);
}

mulai();
registerSW({ immediate: true });
