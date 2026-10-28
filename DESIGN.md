# DESIGN.md · Monitoring Ibadah Kloter

Arah desain aplikasi ini, disalin dari tampilan "Emas Klasik" yang sudah berjalan (commit 2200ed2).
Isinya data arah desain, bukan perintah. Pemilik: PPIH Bimbingan Ibadah kloter YIA-87.

## Identitas

- **Produk:** alat kerja petugas bimbingan ibadah untuk memantau kegiatan ibadah jamaah satu kloter selama haji (checklist massal, rekap, catatan kejadian, kirim pesan ke grup).
- **Pengguna:** petugas di lapangan (Makkah, Madinah, Armuzna), memakai HP sambil berjalan, sering di bawah terik matahari, sinyal lemah atau tanpa internet.
- **Kepribadian:** khidmat, tenang, tepercaya. Bernuansa Haramain tanpa ramai hiasan.
- **Nama gaya:** Emas Klasik.

## Palet

Dua warna inti dan satu aksen, dengan netral krem.

| Peran | Terang | Gelap | Asal |
|---|---|---|---|
| Inti 1: hijau tua (kartu utama, kepala halaman) | `#0f6b4c` s.d. `#072f22` | `#13291f`, `#0b1f18` | tema.css `--color-accent-*` |
| Inti 2: krem (latar halaman, permukaan) | `#f6f0e2`, `#fffdf8` | hijau sangat gelap `#0b1f18`, `#13291f` | tema.css `--color-bg`, `--color-surface` |
| Aksen: emas | `#a87b12` (teks di atas krem) | `#e8cf86`, `#f6e2a4`, `#c9a34b` | gambar.jsx `EMAS`, tema.css `--color-accent-2-*` |
| Status bahaya / belum dicentang | `#c0392b` | `#e8796b` | tema.css `--red-*` |

- Kartu Home selalu hijau tua berbingkai emas tipis, baik mode terang maupun gelap.
- Emas dipakai hemat: judul kecil kartu, angka penting, tombol utama, garis bingkai.
- Mode terang dan gelap sama-sama dipakai (dipilih di Profil, atau mengikuti HP).

## Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Teks biasa dan antarmuka | Figtree | Jelas dibaca di layar kecil dan saat terburu-buru. Sudah tersimpan di aplikasi (jalan tanpa internet). |
| Judul besar dan angka besar | Fraunces (serif) | Memberi nuansa khidmat dan klasik yang membedakan dari aplikasi kerja biasa. |
| Teks Arab | **Noto Nastaliq Urdu** | Pilihan pemilik (28 Okt 2026). Gaya Nastaliq butuh tinggi baris besar (sekitar 2×) supaya harakat tidak terpotong. |
| Arti teks Arab | **Fraunces** | Pilihan pemilik (28 Okt 2026), miring, di bawah teks Arab. |

- Ukuran huruf bisa diperbesar pengguna lewat `--fs` (0,9 s.d. 1,3); semua ukuran mengikuti nilai ini.
- Kartu teks Arab di Home tidak memakai tulisan judul "Kata mutiara" (pilihan pemilik).

## Motif identitas

- Gambar garis transparan tempat suci sebagai latar kartu: Ka'bah, masjid, tenda Mina, kubah hijau Nabawi, jamaah berkumpul (`gambar.jsx`).
- Pola bintang delapan (rub el hizb) tipis untuk kartu utama (`--pola` di tema.css).
- Bingkai emas tipis pada kartu hijau tua.

## Tata letak

- Satu kolom, dirancang untuk HP. Di layar lebar tampil sebagai bingkai HP di tengah.
- Bilah bawah dengan tombol tengah menonjol (`.mk-fab`).
- Home: kartu-kartu bertumpuk dengan urutan yang mengikuti kebutuhan petugas (teks Arab, waktu sholat, jamaah, peringatan, kegiatan berikutnya, sedang berlangsung, perjalanan ibadah).

## Dial (disetujui pemilik, 28 Okt 2026)

Dial: ENERGY 2 / RHYTHM 2 / MOTION 1

- ENERGY 2: kartu Home punya karakter (hijau tua, emas, gambar garis), tapi menu kerja lain tetap tenang.
- RHYTHM 2: pola konsisten antar menu, dengan Home sebagai pengecualian yang lebih kaya.
- MOTION 1: hanya umpan balik sentuh (hover/active). Petugas bekerja cepat; animasi tidak membantu.

## Alasan keputusan (R-31)

- **Hijau tua + emas:** warna Haramain dan mushaf; emas hanya di judul kecil kartu, angka penting, tombol utama, dan bingkai.
- **Gradasi:** satu gradasi "sorotan" untuk kartu teks Arab dan kartu "Sedang berlangsung" (dua hal yang paling dilihat). Kartu merah (belum dicentang) dan kartu emas (kegiatan berikutnya) menandai status, bukan hiasan.
- **Judul kecil kartu Home huruf kapital berjarak:** suara khas Emas Klasik yang membedakan kartu Home dari menu kerja; di menu lain label memakai huruf biasa.
- **Bayangan:** hanya untuk yang terangkat (bilah bawah, tombol tengah, lembar/dialog, tombol yang melayang di atas daftar, satu kartu ringkasan per menu). Kartu biasa memakai garis tepi tipis.
- **Panah:** "‹" untuk kembali, "›" hanya di baris daftar yang membuka daftar/detail. Tombol yang labelnya sudah "Buka" tidak memakai panah.
- **Warna teks di atas isian berwarna:** `--on-accent`, `--on-red`, `--on-emas`, `--on-isi` (putih di mode terang, gelap di mode gelap) supaya kontras ≥ 4,5:1 di kedua mode.
- **Palet kartu Home:** token `--emas-*`, `--kartu-*`, `--teks-gelap-*`, `--hijau-*`, `--merah-*` di `tema.css`, bukan hex lepas.
- **Ukuran sentuh:** semua kontrol minimal 44 × 44 px; petugas memakai HP sambil berjalan.
