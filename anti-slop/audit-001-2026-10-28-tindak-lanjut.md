# Tindak lanjut audit antislop 001 · 28 Oktober 2026

- Mode: AFTER. Nomor yang disetujui pemilik: semua, 1 sampai 16. Dial disetujui: ENERGY 2 / RHYTHM 2 / MOTION 1.
- Belum ada commit. Diuji di pratinjau lokal (mode uji tanpa akun, data contoh), bukan di HP asli.

## Permintaan pemilik

- A. Teks Arab memakai Noto Nastaliq Urdu, disimpan di aplikasi (`src/styles/fonts/nastaliq-arab.woff2`, 156 KB, subset Arab) dan ikut tersimpan untuk pemakaian tanpa internet. Juga dipakai di layar masuk akun.
- B. Arti memakai Fraunces miring asli (`fraunces-miring.woff2`, 41 KB). Sebelumnya miringnya buatan browser.
- C. Tidak ada tulisan "Kata mutiara"; hiasan "✦ ❖ ✦" juga dihapus (temuan 12).
- D. `View.jsx` (3.062 baris) dipecah menjadi 14 file di `src/layar/` dengan memindahkan baris apa adanya (jumlah baris dicocokkan: 3.006 = 3.006), urutan tumpuk dialog dipertahankan. `AppLogic.js` hanya berubah pada teks dan nilai warna (lihat bawah); tidak ada logika yang diubah.

## Yang dikerjakan per nomor

1. 14 elemen klik bukan-tombol menjadi `<button>`. Baris yang berisi tombol lain disusun ulang supaya tidak ada tombol di dalam tombol. 32 latar gelap di belakang lembar tetap bisa diketuk sebagai cara tambahan; panelnya diberi `role="dialog"`.
2. Escape menutup lembar/dialog paling atas (`src/layar/escape.js`). Dicoba: lembar jamaah, pelaksana badal, sinkron, atur tanggal, atur miqat, galeri foto, rekap WhatsApp (semua tertutup).
3. Placeholder ke `--color-neutral-600` (5,53:1). Ditemukan dan diperbaiki juga: jam WIB di kepala halaman (2,69:1 menjadi 5,54:1), label bilah bawah tidak aktif (3,67:1 menjadi 5,53:1), teks oranye di Badal (3,11:1 menjadi 5,68:1).
4. Mode gelap: teks di atas isian hijau/merah/emas memakai token `--on-accent`, `--on-red`, `--on-emas`, `--on-isi` (putih di mode terang, gelap di mode gelap). Layar PIN memakai latar `--hero` di kedua mode.
5. Semua kontrol minimal 44 px (tombol, chip, kolom isian, tombol rombongan R1–R9, tautan "Hubungi").
6. Tanda — diganti "-" (penanda kosong, diganti serentak termasuk perbandingannya) atau titik/koma di kalimat.
7. Lingkaran hitung mundur, nama dan jam lima waktu, dan label titik perjalanan ikut `--fs`.
8. Semua `<img>` punya `width`/`height`.
9. Panah dihapus dari "Buka checklist", kartu Pilih ibadah, dan kotak ringkasan jamaah. Dipertahankan: "‹" kembali, "›" di baris daftar templat dan chip "n jamaah".
10. Bayangan kartu biasa diganti garis tepi tipis; `--kartu-bayang: none`. Bayangan tetap di lembar/dialog, bilah bawah, tombol tengah, tombol melayang, dan satu kartu ringkasan per menu.
11. Label kapital berjarak dihapus di Pengaturan dan Menu; dipertahankan di judul kecil kartu Home dan Pilih ibadah (alasan dicatat di DESIGN.md).
12. Hiasan "✦ ❖ ✦" dihapus.
13. Satu gradasi `SOROTAN` untuk kartu teks Arab dan "Sedang berlangsung"; kartu waktu sholat rata; merah dan emas hanya status.
14. Cincin cahaya titik "Sedang berlangsung" dihapus, titiknya tetap.
15. Hex lepas di `HomeAtas.jsx` dan `PilihIbadah.jsx` diganti token bernama di `tema.css` (`--emas-*`, `--kartu-*`, `--teks-gelap-*`, `--hijau-*`, `--merah-*`).
16. Komentar pemisah hias di `organic.css` dan `AppLogic.js` menjadi satu baris biasa.

Tambahan dari klik-uji: kolom tanggal dan kolom pencarian diberi nama aksesibel; gaya dasar `cursor: pointer`, keadaan ditekan, dan "kurangi gerakan" ditambahkan di `tema.css`.

## Perubahan di AppLogic.js (hanya teks dan warna)

- 15 tanda "—" menjadi "-"; satu kalimat "… massal — tandai …" menjadi "… massal. Tandai …".
- 13 `'#fff'` (teks di atas chip berwarna) menjadi `var(--on-isi)`; 2 menjadi `var(--on-accent)`.
- `#C77700` sebagai warna teks menjadi `#8A5300` (warna grafik tetap).
- Warna label tab aktif dan tanda ✓ di Cetak menjadi `var(--color-accent-700)`.
- Satu komentar pemisah.

## Delivery Gate

### Blok 1: Hard Gate

- R-02 PASS: `grep "—"` di `src/` (selain `src/dev/`) = 0; teks halaman diperiksa per menu: tidak ada "—".
- R-03 PASS: pada lebar 375 px dan 768 px, ukuran huruf 1,0 dan 1,3, `main.scrollWidth - clientWidth = 0` di 10 layar; tidak ada kontrol di bawah 44 px (pemeriksaan otomatis per layar dan lembar).
- R-17, R-18, R-28, R-36, R-38 PASS: tidak ada angka, testimoni, FAQ, atau klaim baru. Angka di layar berasal dari data (contoh di pratinjau).
- R-23 PASS: tidak ada logo, avatar, atau aset baru selain dua font yang diminta pemilik.
- R-24, R-26 PASS: semua tombol bilah bawah dan Menu membuka layar yang ada (Home, Menu, Massal, Kirim, Profil, Jamaah, Ibadah, Badal, Rekap, Cetak, Catatan Kejadian).
- R-25 PASS untuk teks di atas warna polos: pemeriksaan otomatis 10 layar + lembar sinkron, mode terang dan gelap, tidak ada yang di bawah 4,5:1 (3:1 untuk teks besar). Teks di atas gradasi/foto kartu Home dihitung manual untuk pasangan utama (mis. `#9fb8aa` di `#13291f` 7,26:1; putih di `#1c7a56` 5,29:1).
- R-27 PASS (tidak berubah): status kosong/gagal/sinkron yang sudah ada tetap tampil ("Belum ada jadwal", "Gagal sinkron · data tetap aman di perangkat", "0 antre").
- R-32 PASS: semua kontrol kini `<button>`/`<a>`/`<input>`; `:focus-visible` 2 px tersedia; Escape menutup lembar (diuji dengan tombol Escape sungguhan dan event).
- R-33 PASS: tidak ada skrip patch yang tertinggal di repo. Pemindahan baris dan penggantian massal dikerjakan dengan perintah sekali jalan di sesi ini, hasilnya kode sumber biasa.
- R-34 PASS: mode terang dan gelap diperiksa di semua menu (kontras otomatis + tangkapan layar Home).
- R-35 PASS SEBAGIAN: build sukses; klik-uji tercatat: 5 tab bawah, 6 item Menu, kartu Haji/Umrah, lembar jamaah, pelaksana badal, sinkron, atur tanggal, atur miqat, ambil foto (pemilih berkas), galeri, simpan PDF, rekap WhatsApp; semua terbuka dan tertutup. Belum diuji: aksi yang menulis data (centang, simpan udzur, sinkron ke Google Sheet) dan pemakaian di HP asli.
- R-37 PASS: arah dari DESIGN.md (Emas Klasik), dial disetujui.
- R-39 PASS: `cursor: pointer` di lapisan dasar, nama aksesibel di semua kontrol (pemeriksaan otomatis: 0 tanpa nama), `alt` di semua gambar, gerakan berhenti saat "kurangi gerakan".
- R-40 PASS untuk mekanisme: semua `<img>` berukuran. Kinerja tidak diukur.

### Blok 2: Purpose-Gate

R-01, R-04, R-06, R-08, R-09, R-12, R-13, R-14, R-19 PASS: alasan setiap teknik yang dipertahankan ditulis di DESIGN.md bagian "Alasan keputusan". R-07, R-10, R-22: tidak dipakai.

### Blok 3: Liveliness

Dial ditetapkan (2/2/1). Titik fokus per layar: kartu teks Arab di Home, kartu kegiatan di Checklist. Aksen: emas. Motif identitas: gambar garis tempat suci dan bingkai emas. Gerak hanya umpan balik sentuh, sesuai MOTION 1.

### Blok 4: Craftsmanship

C-1 sampai C-5 dan R-05, R-11, R-15, R-16, R-20, R-21, R-29, R-30, R-31 tidak ada pelanggaran yang tersisa dari audit.

## Belum dikerjakan atau belum terbukti

- Uji di HP asli dan di aplikasi yang terpasang (PWA).
- Aksi yang menulis data dan sinkron ke Google Sheet tidak dijalankan di pengujian ini (logikanya tidak diubah).
- Kinerja tidak diukur.
