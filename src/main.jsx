import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/organic.css';
import './styles/app.css';
import './styles/tema.css';
import AppLogic from './AppLogic.js';
import View from './View.jsx';
import Gerbang from './Gerbang.jsx';
import { createHost } from './dc/runtime.js';
import { terapkan } from './tampilan.js';
import { mulai as mulaiAkun } from './data/akun.js';
import { registerSW } from 'virtual:pwa-register';

async function mulai() {
  terapkan();
  if (import.meta.env.DEV && localStorage.getItem('mk.mock') === '1') (await import('./dev/mockSheet.js')).pasangMock();
  mulaiAkun();
  const App = createHost(AppLogic, View);
  createRoot(document.getElementById('root')).render(<Gerbang><App /></Gerbang>);
}

mulai();
registerSW({ immediate: true });
