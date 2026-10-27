import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base './' agar jalan di Netlify, GitHub Pages (sub-folder) maupun APK.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon-192.png'],
      manifest: {
        name: 'Monitoring Kloter',
        short_name: 'Kloter',
        description: 'Monitoring ibadah kloter',
        id: './',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f2f4f3',
        theme_color: '#1e6b52',
        lang: 'id',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
        // Permintaan ke Google Apps Script selalu lewat jaringan; aplikasi sendiri menyimpan antrean.
        navigateFallbackDenylist: [/^\/macros\//]
      }
    })
  ],
  build: { chunkSizeWarningLimit: 1500 }
});
