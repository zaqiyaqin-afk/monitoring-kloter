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
import { mulaiSorot } from './sorot.js';

async function mulai() {
  terapkan();
  mulaiAkun();
  const App = createHost(AppLogic, View);
  createRoot(document.getElementById('root')).render(<Gerbang><App /></Gerbang>);
  mulaiSorot();
}

mulai();

// Pastikan PWA yang sudah terpasang di HP langsung memuat ulang otomatis begitu versi baru tersedia
if ('serviceWorker' in navigator) {
  let sedangMuatUlang = false;
  const sudahAdaPengendali = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!sudahAdaPengendali || sedangMuatUlang) return;
    sedangMuatUlang = true;
    location.reload();
  });
}

const perbaruiSW = registerSW({
  immediate: true,
  onNeedRefresh() { perbaruiSW(true); },
  onRegisteredSW(_url, reg) {
    if (!reg) return;
    reg.update().catch(() => {});
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {});
    });
  }
});
