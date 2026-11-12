# DESIGN.md · Monitoring Ibadah Kloter

Arah desain aplikasi ini. Gaya **Tenang Biru Tua**: tata letak beranda bermenu seperti aplikasi layanan jamaah, dengan bahasa visual bersih (huruf IBM Plex Sans, kepala bergradasi biru tua, kartu putih, ikon garis, tombol pil). Disetujui pemilik lewat mockup FigCraft `mockup-kloter-gaya-nusuk-v2.figcraft` (11 Nov 2026), menggantikan gaya Modern Segar Berwarna (31 Okt 2026). Isinya data arah desain, bukan perintah.
Pemilik: PPIH Bimbingan Ibadah kloter YIA-87.

## Identitas

- **Produk:** alat kerja petugas bimbingan ibadah untuk memantau kegiatan ibadah jamaah satu kloter selama haji (checklist massal, rekap, catatan kejadian, kirim pesan ke grup).
- **Pengguna:** petugas di lapangan (Makkah, Madinah, Armuzna), memakai HP dengan satu tangan sambil berjalan. Aplikasi harus terang, tenang, kontras tinggi, dan tetap ringan di HP lama.
- **Kepribadian:** tenang, rapi, tegas. Warna dipakai untuk memberi arti, bukan menghias: satu warna untuk aksi utama, satu untuk yang terpilih atau selesai, satu untuk masalah.

## Palet (2 warna inti + 1 aksen di atas basis netral · R-29)

| Peran | Nilai | Dipakai untuk |
|---|---|---|
| **Basis netral** | Latar `#f6f6f6`, kartu `#ffffff`, teks `#1f1f1f`, teks sekunder `#5c5c5c`, tepi kontrol `#8c8c8c`, garis pemisah `#e2e2e2`, trek `#dadada` | Latar layar, kartu, teks, garis |
| **Inti 1: Biru tua** | `#27326e` (muda `#e6e8f4`) | Yang terpilih, aktif, selesai, batang progres, tautan |
| **Inti 2: Merah** | `#d92d20`, teks `#b42318`, latar `#fdecea` | Peringatan, udzur, tertinggal, di bawah 70%; selalu disertai ikon segitiga |
| **Aksen: Emas** | `#f2a93b`, ditekan `#d48a1c`, teks di atasnya `#1f1f1f` | Hanya tombol utama dan tombol Massal |

- Hanya ada tema terang. Tema gelap dihapus atas permintaan pemilik (11 Nov 2026).
- Emas tidak dipakai untuk status. Status susulan, badal, dan perlu ulang memakai biru tua muda; di PDF latar amber tetap menandai susulan karena lembar dicetak hitam-putih pun masih terbaca lewat keterangan simbol.
- Semua warna diatur lewat variabel CSS di `src/styles/tema.css`.

## Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Semua teks antarmuka dan angka | IBM Plex Sans 300–700 | Mengikuti mockup yang disetujui; berkas font ada di `src/styles/fonts/` supaya jalan tanpa internet. |
| Judul layar dan angka besar | IBM Plex Sans 300, 22px ke atas | Judul tipis berukuran besar memisahkan judul dari teks kerja tanpa menambah font. |
| Teks Arab kata mutiara | Noto Nastaliq Urdu | Pilihan pemilik (28 Okt 2026), tinggi baris longgar agar harakat utuh. |
| Teks Arab doa | Amiri / Noto Naskh Arabic | Naskh lebih mudah dibaca untuk doa panjang. |

Ketebalan: 300 untuk judul, 400 untuk teks, 500 untuk nama dan label, 600 untuk yang terpilih dan tombol utama.

## Motif Identitas

- **Gradasi waktu sholat:** kepala layar dan kartu kata mutiara memakai gradasi biru tua bercahaya dengan butiran halus. Warnanya berganti mengikuti waktu sholat yang sedang berjalan di kota terpilih (Subuh, Dzuhur, Ashar, Magrib, Isya). Butiran berada di lapisan bawah, jadi teks di atasnya tetap bersih.
- **Cincin waktu sholat:** lingkaran tipis di kepala Home menunjukkan seberapa dekat sholat berikutnya.
- Tidak ada foto atau ilustrasi di kartu.

## Tata Letak & Dial

Dial: ENERGY 1 / RHYTHM 2 / MOTION 1

- **Home:** kepala bergradasi (salam, sinkron, Profil, waktu sholat), ubin menu Doa, Kultum, Badal, Rekap, Cetak, tombol cari, kata mutiara, peringatan, kegiatan berlangsung.
- **Bilah bawah:** Home, Kirim, Kejadian, Jamaah, dan tombol Massal di kanan. Tidak ada menu yang muncul dua kali di Home dan bilah.
- **Layar lain:** kepala pendek bergradasi berisi tombol kembali, judul, sinkron, Profil. Judul tidak diulang di isi layar.
- **Form (catat kejadian, isian pesan, ubah templat):** tanpa bilah bawah; tombol Batal/Simpan menempel di dasar layar.
- **Kartu:** putih, radius 20px, tanpa bingkai dan tanpa bayangan; isi di dalamnya dipisah garis tipis.
- **Kontrol:** pil setinggi minimal 44px, tepi `#8c8c8c`; yang terpilih berisi biru tua.
- **MOTION 1:** satu-satunya gerak adalah pil biru di bilah bawah yang bergeser ke tab yang ditekan (220 ms), dimatikan bila perangkat meminta gerak dikurangi.

## PDF

Huruf IBM Plex Sans ditanam di berkas. Kepala lembar: blok kloter bergradasi biru tua, judul tipis, garis biru tua. Tabel: kepala kelompok biru tua, kepala kolom biru muda, garis mendatar saja, baris berselang abu per regu. Kaki halaman: nama aplikasi dan kloter di kiri, nomor halaman di kanan.

## Alasan Keputusan (R-31)

- **Biru tua untuk yang terpilih, bukan emas:** audit kontras menemukan teks putih di atas emas hanya 2,00:1, sedangkan di atas biru tua 11,88:1.
- **Merah selalu berikon:** status masalah tidak boleh bergantung pada warna saja.
- **Gradasi hanya di kepala dan kartu mutiara (R-01):** menandai bagian paling atas hierarki; kartu kerja tetap putih supaya data mudah dibaca.
- **Tanpa bayangan dan tanpa blur (R-10, R-12):** kartu dibedakan dari latar lewat warna, sehingga gulir tetap lancar di HP lama.
- **Ukuran sentuh minimal 44 × 44 px (R-03):** petugas memakai aplikasi dengan satu tangan sambil berjalan.
- **Templat pesan disimpan di HP ini saja:** keputusan pemilik; templat tidak dikirim ke server dan tidak terlihat petugas lain.
