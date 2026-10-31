# Monitoring Kloter

Aplikasi monitoring ibadah kloter untuk **PPIH Bimbingan Ibadah Kloter**: checklist manasik haji, umrah, dan Raudhoh per jamaah, badal, udzur, catatan kejadian, rekap, dan cetak lembar. Data tersimpan di **Supabase**, dengan akun per petugas dan data terpisah per kloter.

**Bisa dipakai tanpa internet.** Semua centang, udzur, catatan, tanggal, miqat, dan foto tersimpan dulu di HP, lalu terkirim otomatis ke server begitu ada sinyal. Kiriman ulang tidak tercatat dua kali.

## Fitur

- Akun per petugas: daftar dengan email, aktif setelah disetujui admin; petugas hanya melihat kloternya sendiri
- Identitas petugas: Nama, Tusi (PPIH Bimbingan Ibadah Kloter), Kloter, Embarkasi, Gelombang
- Checklist per jamaah, per regu, per rombongan, atau seluruh kloter
- **Udzur**: tandai/hapus dengan alasan (boleh kosong), lengkap dengan riwayat
- **Tanggal jadwal** per kegiatan (Masehi) dan tanggal pelaksanaan per jamaah, **Susulan otomatis** bila dilaksanakan setelah jadwal
- **Miqat umrah**: otomatis dari gelombang (Gel. 1 Bir Ali, Gel. 2 Yalamlam), bisa diatur per kloter/rombongan/regu/jamaah
- **Foto kegiatan dan kejadian**: diperkecil otomatis, tersimpan di HP saat offline, lalu masuk penyimpanan kloter (tertutup)
- Badal, pendamping, ulang thawaf/sa'i, Safari Wukuf, Nafar Awwal/Tsani
- Rekap, grafik, kartu WhatsApp, cetak lembar per rombongan/regu, unggah/unduh Excel data jamaah
- PIN aplikasi, cadangan & pemulihan data, bisa dipasang di layar utama HP

---

## Panduan untuk petugas kloter

1. Buka alamat aplikasi di **Chrome** (Android) atau **Safari** (iPhone).
2. Ketuk **Daftar**, isi nama, email, kata sandi, kloter, embarkasi, dan gelombang. Tunggu admin menyetujui akun.
3. Setelah disetujui, **masuk**, lengkapi identitas, buat **PIN** 4 angka, lalu ketuk **Mulai**. Data jamaah kloter diunduh ke HP; internet hanya perlu saat ini.
4. **Pasang ke layar utama**: Android › tombol *Pasang aplikasi* di Beranda atau menu ⋮ › *Instal aplikasi*. iPhone › Safari › *Bagikan* › *Tambah ke Layar Utama*. Ini penting agar data di HP tidak dihapus otomatis.

HP yang dulu memakai Google Sheet: setelah masuk dengan akun, aplikasi pindah ke akun kloter. Perubahan yang belum terkirim tetap disimpan dan dikirim ke akun.

---

## Menerbitkan aplikasi (untuk pengelola)

Aplikasi berupa situs statis dan diterbitkan lewat **Vercel**.

1. Vercel › **Add New › Project** › pilih repo ini dari GitHub.
2. Isi *Environment Variables* `VITE_SUPABASE_URL` dan `VITE_SUPABASE_KEY` (lihat [.env.example](.env.example); hanya publishable key).
3. Vercel mengenali Vite otomatis (`npm run build`, folder `dist`); header cache di [vercel.json](vercel.json) › **Deploy**. Setiap perubahan di `main` terbit otomatis.

HP yang sudah memasang aplikasi menerima versi baru otomatis saat aplikasi dibuka dengan internet.

### Database

Skema, aturan akses per kloter (RLS), dan fungsi server ada di [supabase/migrations](supabase/migrations). Email admin pertama tidak ditulis di repo; diisi langsung ke tabel `private.admin_awal`.

---

## Pengembangan

```bash
npm install
cp .env.example .env   # isi URL dan publishable key Supabase
npm run dev            # http://localhost:5173
npm run build          # hasil di dist/
```

Tanpa `.env`, gerbang akun dilewati dan aplikasi hanya bisa dipakai dengan *data contoh*.

| Lokasi | Isi |
|---|---|
| `src/View.jsx` | Tampilan semua layar |
| `src/AppLogic.js` | Logika: state, checklist, udzur, tanggal, miqat, foto, rekap, cetak |
| `src/Gerbang.jsx` | Masuk, daftar, dan menunggu persetujuan admin |
| `src/identitas.js` | Identitas petugas, daftar embarkasi, miqat |
| `src/data/supabaseApi.js` | Penghubung ke Supabase (ambil data, kirim antrean, foto, impor jamaah) |
| `src/data/akun.js` | Sesi dan profil akun petugas |
| `src/data/localStore.js` | Penyimpanan di HP (antrean ganda localStorage + IndexedDB) |
| `src/data/fotoStore.js` | Kompres dan simpan foto di HP |
| `supabase/migrations/` | Skema database Supabase |

## Rencana

- Pengingat harian lewat email/notifikasi dari server
- Tampilan gabungan antarkloter
- Paket APK Android dari aplikasi yang sama
