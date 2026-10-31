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
      includeAssets: ['favicon-48.png', 'apple-touch-icon.png', 'icon-192.png', 'emblem-256.png'],
      manifest: {
        name: 'Monitoring Kloter',
        short_name: 'Kloter',
        description: 'Monitoring ibadah kloter',
        id: './',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b2a1f',
        theme_color: '#0f3d2e',
        lang: 'id',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
        // Permintaan ke Google Apps Script selalu lewat jaringan; aplikasi sendiri menyimpan antrean.
        navigateFallbackDenylist: [/^\/macros\//]
      }
    })
  ],
  build: { chunkSizeWarningLimit: 1500 }
});
