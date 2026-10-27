# Monitoring Kloter

Aplikasi monitoring ibadah kloter untuk **PPIH Bimbingan Ibadah Kloter**: checklist manasik haji, umrah, dan Raudhoh per jamaah, badal, udzur, rekap, dan cetak lembar. Data tersimpan di **Google Sheet milik petugas sendiri**.

**Bisa dipakai tanpa internet.** Semua centang, udzur, catatan, tanggal, miqat, dan foto tersimpan dulu di HP, lalu terkirim otomatis ke Google Sheet / Google Drive begitu ada sinyal. Kiriman ulang tidak tercatat dua kali.

## Fitur

- Identitas petugas wajib: Nama, Tusi (PPIH Bimbingan Ibadah Kloter), Kloter, Embarkasi, Gelombang
- Checklist per jamaah, per regu, per rombongan, atau seluruh kloter
- **Udzur**: tandai/hapus dari aplikasi dengan alasan (boleh kosong), riwayat lengkap di tab *Riwayat Udzur*
- **Tanggal jadwal** per kegiatan (Masehi) dan tanggal pelaksanaan per jamaah, **Susulan otomatis** bila dilaksanakan setelah jadwal
- **Miqat umrah**: otomatis dari gelombang (Gel. 1 Bir Ali, Gel. 2 Yalamlam), bisa diatur per kloter/rombongan/regu/jamaah
- **Foto kegiatan**: diperkecil otomatis, tersimpan di HP saat offline, lalu masuk Google Drive
- Badal, pendamping, ulang thawaf/sa'i, Safari Wukuf, Nafar Awwal/Tsani
- Rekap, grafik, kartu WhatsApp, cetak lembar per rombongan/regu, PDF laporan & email pengingat harian (dari Sheet)
- PIN aplikasi, cadangan & pemulihan data, bisa dipasang di layar utama HP

---

## Panduan pemasangan untuk petugas kloter

Setiap kloter memakai **Google Sheet sendiri**. Aplikasinya boleh sama untuk semua kloter: cukup buka alamat aplikasi yang sudah ada, lalu isi URL Sheet masing-masing. Memasang aplikasi sendiri (Langkah 3) hanya perlu bila ingin punya alamat sendiri.

### Langkah 1 · Siapkan Google Sheet (±10 menit, sekali saja)

1. Buka [sheets.new](https://sheets.new) untuk membuat Google Sheet baru, beri nama, misalnya *Monitoring SOC-27*.
2. Menu **Extensions › Apps Script**. Hapus semua isi `Code.gs`, tempel seluruh isi [apps-script/Code.gs](apps-script/Code.gs), lalu **Simpan**.
3. Kembali ke Sheet dan **muat ulang** halaman. Muncul menu **Monitoring Kloter**.
4. Pilih **Monitoring Kloter › 1. Siapkan sheet**. Saat diminta, izinkan akses (*Review permissions* › pilih akun › *Advanced* › *Go to … (unsafe)* › *Allow*; ini aman karena skripnya milik Anda sendiri).
5. Isi **kode rahasia** saat diminta (angka saja, minimal 4 angka). Kode ini nanti diisi di aplikasi.
6. Isi tab **Jamaah**. Cara cepat: *File › Import › Upload* [Template Jamaah.csv](apps-script/Template%20Jamaah.csv), pilih *Replace current sheet*, lalu ganti isinya dengan data jamaah. Kolom wajib: Nomor Porsi, Nama, Rombongan, Regu, Peran, Jenis Kelamin (L/P).
7. Pilih **Monitoring Kloter › 3. Periksa data jamaah** dan perbaiki bila ada catatan.

### Langkah 2 · Terbitkan sebagai Web App

1. Di Apps Script: **Deploy › New deployment** › ikon roda gigi › **Web app**.
2. *Execute as*: **Me** · *Who has access*: **Anyone** › **Deploy**.
3. Salin **Web app URL** yang berakhiran **`/exec`**.

> "Anyone" diperlukan agar HP bisa mengirim data tanpa login Google. Data tetap terlindungi kode rahasia, dan isi Sheet tidak bisa dibaca tanpa kode itu.

### Langkah 3 · Buka aplikasi di HP

1. Buka alamat aplikasi (lihat *Menerbitkan aplikasi* di bawah) di **Chrome** (Android) atau **Safari** (iPhone).
2. Isi **Identitas petugas**, lalu **Web App URL** dan **kode rahasia** dari Langkah 1–2, buat **PIN** 4 angka, tekan **Hubungkan ke Google Sheet**. Internet hanya diperlukan saat ini.
3. **Pasang ke layar utama**: Android › tombol *Pasang aplikasi* di Beranda atau menu ⋮ › *Instal aplikasi*. iPhone › Safari › *Bagikan* › *Tambah ke Layar Utama*. Ini penting agar data di HP tidak dihapus otomatis.

HP berikutnya cukup mengisi URL, kode, dan PIN; identitas terisi otomatis dari tab **Pengaturan**.

### Langkah 4 (opsional) · Rekap & pengingat otomatis

Menu **Monitoring Kloter › 5. Aktifkan rekap & pengingat otomatis**: rekap diperbarui tiap jam dan email berisi PDF laporan dikirim setiap hari. Jam pengingat bisa diubah dari aplikasi (Pengaturan › Pengaturan Sheet).

---

## Menerbitkan aplikasi (untuk pengelola)

Aplikasi berupa situs statis, jadi bisa diterbitkan gratis. Pilih salah satu:

### A. GitHub Pages

1. *Fork* atau unggah repo ini ke akun GitHub Anda.
2. **Settings › Pages › Build and deployment › Source: GitHub Actions**.
3. Workflow [deploy-pages.yml](.github/workflows/deploy-pages.yml) menguji `Code.gs`, membangun, dan menerbitkan aplikasi ke `https://<akun>.github.io/<nama-repo>/`. Saat ini workflow hanya berjalan manual (*Actions › Terbitkan ke GitHub Pages › Run workflow*). Untuk terbit otomatis setiap ada perubahan di `main`, hapus tanda `#` pada pemicu `push` di file tersebut. GitHub Pages gratis hanya untuk repo publik; untuk repo private pakai Netlify.

### B. Netlify

1. Netlify › **Add new site › Import an existing project** › pilih repo ini dari GitHub.
2. Pengaturan build dibaca otomatis dari [netlify.toml](netlify.toml) (`npm run build`, folder `dist`) › **Deploy**.

Setelah diperbarui, HP yang sudah memasang aplikasi menerima versi baru otomatis saat aplikasi dibuka dengan internet.

## Memperbarui Code.gs di Sheet yang sudah berjalan

1. Apps Script › ganti seluruh isi `Code.gs` dengan versi terbaru › Simpan.
2. **Deploy › Manage deployments** › ikon pensil › *Version*: **New version** › **Deploy**. URL `/exec` tetap sama, jadi HP tidak perlu diubah.
3. Muat ulang Sheet, lalu **Monitoring Kloter › 1. Siapkan sheet** sekali untuk menambah tab/kolom baru (Pengaturan, Riwayat Udzur, Foto, kolom Petugas, Tanggal, Miqat). Data lama tidak dihapus.
4. **Dari versi 1:** kode rahasia tidak lagi ditulis di dalam `Code.gs`. Pilih **Monitoring Kloter › Atur kode rahasia** dan isi kode yang sama dengan yang dipakai di aplikasi. Tanpa langkah ini, aplikasi ditolak server.

## Tab di Google Sheet

| Tab | Isi |
|---|---|
| Jamaah | Data jamaah; kolom Udzur dan Miqat diisi dari aplikasi |
| Log | Setiap centang: waktu, kegiatan, status, tanggal pelaksanaan, Susulan, Pilihan (mis. miqat), Petugas |
| Jadwal Kegiatan | Hari, Tempat, **Tanggal** per kegiatan; Tempat baris Umrah \| Miqat = miqat kloter |
| Riwayat Udzur | Setiap tanda/hapus udzur dengan alasan dan petugas |
| Foto | Daftar foto dan tautannya di Google Drive |
| Pengaturan | Nama PPIH, Kloter, Embarkasi, Gelombang, Jam Pengingat |
| Jadwal Raudhoh, Petugas, Rekap, Laporan | Seperti versi sebelumnya |

Foto tersimpan di Google Drive pemilik Sheet: **Foto Kegiatan · (nama Sheet) / (Kegiatan) / (Tanggal)**, tidak dibagikan ke siapa pun.

---

## Pengembangan

```bash
npm install
npm run dev       # http://localhost:5173
npm run uji:gs    # uji Code.gs tanpa Google
npm run build     # hasil di dist/
```

Coba tanpa Google Sheet: pilih *Coba dulu dengan data contoh*. Uji sinkron/offline: di konsol browser `localStorage.setItem('mk.mock','1')`, muat ulang, lalu `__mock.offline(true|false)` dan `__mock.gagal(true|false)`. Server tiruan ini hanya aktif saat `npm run dev`.

| Lokasi | Isi |
|---|---|
| `src/View.jsx` | Tampilan semua layar |
| `src/AppLogic.js` | Logika: state, checklist, udzur, tanggal, miqat, foto, rekap, cetak |
| `src/identitas.js` | Identitas petugas, daftar embarkasi, miqat |
| `src/data/sheetsApi.js` | Satu-satunya penghubung ke server. Untuk Supabase, buat file setara dengan fungsi yang sama. |
| `src/data/localStore.js` | Penyimpanan di HP (antrean ganda localStorage + IndexedDB) |
| `src/data/fotoStore.js` | Kompres dan simpan foto di HP |
| `apps-script/Code.gs` | Google Apps Script untuk Sheet |
| `apps-script/uji-lokal.mjs` | Uji Code.gs dengan tiruan Google di memori |

## Rencana

- Pindah penyimpanan ke Supabase (login per petugas, tampilan gabungan antarkloter)
- Paket APK Android dari aplikasi yang sama
