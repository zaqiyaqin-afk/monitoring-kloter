# Monitoring Kloter

Aplikasi monitoring ibadah kloter untuk **PPIH Bimbingan Ibadah Kloter**. Bisa dipakai tanpa internet: semua centang tersimpan di HP dan terkirim otomatis ke Google Sheet begitu ada sinyal.

> Panduan pemasangan lengkap untuk petugas kloter lain (Google Sheet, Netlify/GitHub Pages, APK) menyusul.

## Menjalankan untuk pengembangan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Untuk mencoba tanpa Google Sheet, pilih “Coba dulu dengan data contoh”.

Uji sinkron/offline tanpa menyentuh Google: di konsol browser jalankan `localStorage.setItem('mk.mock','1')`, muat ulang, lalu pakai `__mock.offline(true|false)` dan `__mock.gagal(true|false)`.

## Struktur

| Lokasi | Isi |
|---|---|
| `src/View.jsx` | Tampilan semua layar |
| `src/AppLogic.js` | Logika aplikasi: state, checklist, rekap, cetak |
| `src/data/sheetsApi.js` | Satu-satunya penghubung ke server (Google Sheet). Ganti file ini untuk Supabase. |
| `src/data/localStore.js` | Penyimpanan di HP (antrean ganda: localStorage + IndexedDB) |
| `apps-script/Code.gs` | Kode Google Apps Script untuk Sheet |

## Memperbarui Code.gs di Sheet yang sudah berjalan

1. Buka Sheet › Extensions › Apps Script, ganti seluruh isi `Code.gs` dengan [apps-script/Code.gs](apps-script/Code.gs), simpan.
2. Deploy › Manage deployments › edit (ikon pensil) › Version: **New version** › Deploy. URL `/exec` tetap sama.
3. Muat ulang Sheet, lalu menu **Monitoring Kloter › Atur kode rahasia** dan isi kode yang sama dengan yang dipakai di aplikasi.
   Kode rahasia tidak lagi ditulis di dalam `Code.gs`.
4. Jalankan **1. Siapkan sheet** sekali untuk membuat tab **Pengaturan** dan kolom **Petugas** di Log.

## Build

```bash
npm run build
```

Hasilnya di folder `dist/`, siap diunggah ke Netlify atau GitHub Pages.
