# DESIGN.md · Monitoring Ibadah Kloter

Arah desain aplikasi ini. Gaya **Modern Segar Berwarna (Cahaya Haramain Cerah)**, disetujui pemilik (31 Okt 2026) untuk menggantikan tampilan kaca gelap yang terasa terlalu redup dan monoton. Isinya data arah desain, bukan perintah.
Pemilik: PPIH Bimbingan Ibadah kloter YIA-87.

## Identitas

- **Produk:** alat kerja petugas bimbingan ibadah untuk memantau kegiatan ibadah jamaah satu kloter selama haji (checklist massal, rekap, catatan kejadian, kirim pesan ke grup).
- **Pengguna:** petugas di lapangan (Makkah, Madinah, Armuzna), memakai HP sambil berjalan di bawah terik matahari. Aplikasi harus terang, segar, kontras tinggi, tidak monoton, dan tetap ringan di HP lama.
- **Kepribadian:** segar, cerah, tegas, dan bersemangat. Setiap kelompok fitur punya identitas warna tersendiri di atas latar terang bersih sehingga petugas langsung mengenali fungsi kartu dalam sekali lihat.
- **Nama gaya:** Modern Segar Berwarna (Cahaya Haramain Cerah).

## Palet (3 Warna Inti + 1 Aksen di Atas Basis Netral · R-29)

| Peran | Mode Terang (Utama / Bawaan) | Mode Gelap (Malam Berwarna) | Penggunaan Fitur |
|---|---|---|---|
| **Basis Netral** | Latar `#f1f5f9` s.d. `#f8fafc`, kartu `#ffffff`, teks `#0f172a` | Latar `#0b1324` s.d. `#111c33`, kartu `#16223b`, teks `#f8fafc` | Latar halaman, permukaan dasar kartu, teks utama |
| **Inti 1: Zamrud Nabawi** | Utama `#059669`, lembut `#ecfdf5`, tepi `#a7f3d0`, teks `#065f46` | Utama `#10b981`, lembut `rgba(16,185,129,.15)`, tepi `rgba(52,211,153,.35)`, teks `#6ee7b7` | Waktu Sholat, Madinah, Badal, Didampingi, Selesai |
| **Inti 2: Safir Makkah** | Utama `#2563eb`, lembut `#eff6ff`, tepi `#bfdbfe`, teks `#1e40af` | Utama `#3b82f6`, lembut `rgba(59,130,246,.16)`, tepi `rgba(96,165,250,.35)`, teks `#93c5fd` | Jamaah, Umrah, Rekap, Cetak, Kursi Roda, Undangan |
| **Inti 3: Koral Perhatian** | Utama `#e11d48`, lembut `#fff1f2`, tepi `#fecdd3`, teks `#9f1239` | Utama `#f43f5e`, lembut `rgba(244,63,94,.16)`, tepi `rgba(251,113,133,.35)`, teks `#fda4af` | Risti, Perlu Tindak Lanjut, Udzur, Catatan Kejadian |
| **Aksen: Emas Haramain** | Utama `#d97706`, lembut `#fffbeb`, tepi `#fde68a`, teks `#92400e` | Utama `#f59e0b`, lembut `rgba(245,158,11,.16)`, tepi `rgba(251,191,36,.38)`, teks `#fde68a` | Haji, Tombol Utama, FAB Massal, Lansia, Sholat Aktif |

- Mode **Terang** adalah tampilan bawaan supaya segar dan jelas di bawah sinar matahari. Mode **Gelap (Malam Berwarna)** tetap tersedia di Profil dan sama-sama berwarna kontras tinggi.
- Semua warna diatur melalui variabel CSS di `src/styles/tema.css` termasuk varian kartu berwarna (`.kartu-zamrud`, `.kartu-safir`, `.kartu-emas`, `.kartu-koral`) dan ubin ikon bergradien.

## Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Teks antarmuka dan angka | Figtree | Jelas dibaca di layar HP dan sudah tersimpan lokal untuk pemakaian luring. |
| Judul besar dan sorotan | Fraunces (serif) | Memberi karakter khas dan membedakan judul utama dari teks kerja. |
| Teks Arab | Noto Nastaliq Urdu | Pilihan pemilik (28 Okt 2026) dengan tinggi baris longgar agar harakat utuh. |
| Arti teks Arab | Fraunces miring | Pilihan pemilik (28 Okt 2026). |

## Motif Identitas

- **Kartu Berwarna per Fitur:** Setiap modul memiliki pita gradien halus, tepi berwarna tegas, dan ubin ikon bergradien (Zamrud, Safir, Emas, atau Koral) di atas kartu putih bersih.
- **Spanduk Mutiara Haramain:** Kartu Kosa Kata Bahasa Arab tampil rata tengah tanpa logo di kiri, berlatar ilustrasi penuh Masjidil Haram (`haram.webp`), dengan ruang atas longgar agar harakat Nastaliq proporsional.
- **Ilustrasi Tempat Suci (WebP ringan ≤ 30 KB per file):** `haram.webp` (Masjidil Haram pada spanduk Arab), `arafah.webp` (Tenda Arafah & Jabal Rahmah pada kartu Haji), `kabah.webp` (Ka'bah pada kartu Umrah), dan `nabawi.webp` (Masjid Nabawi pada kartu Madinah).

## Tata Letak & Dial

Dial: ENERGY 2 / RHYTHM 3 / MOTION 1

- **ENERGY 2:** Warna cerah dan kontras tegas di setiap kartu utama tanpa mengorbankan keterbacaan data kerja.
- **RHYTHM 3:** Komposisi bervariasi antarbagian di Home (spanduk gelap-zamrud untuk teks Arab, kartu cerah berlingkaran waktu sholat, grid statistik 6 warna, kartu peringatan koral-emas, dan daftar progres 3 warna).
- **MOTION 1:** Hanya umpan balik sentuh/tekan agar hemat baterai dan ringan di HP lama.

## Alasan Keputusan (R-31)

- **Latar terang bersih (`#f1f5f9` + kartu `#ffffff`):** Memenuhi permintaan pemilik agar tampilan segar, tidak gelap/redup, dan mudah dibaca di lapangan.
- **4 keluarga warna fungsional (Zamrud, Safir, Koral, Emas):** Menghilangkan kesan monoton sekaligus membantu mata membedakan ibadah (Zamrud/Emas), data jamaah (Safir), dan kondisi darurat/risti (Koral).
- **Gradien pada ubin ikon dan kartu utama (R-01):** Memisahkan hierarki kartu utama (Mutiara Arab, Pilih Ibadah, waktu sholat aktif) dari kartu daftar biasa.
- **Bayangan lembut hanya pada kartu utama, bilah bawah, dan FAB (R-12):** Menjaga kedalaman visual di atas latar terang tanpa membuat elemen bertumpuk berlebihan.
- **Blur hanya pada bilah bawah dan lembar modal (R-10):** Menjaga kelancaran gulir di HP lama.
- **Ukuran sentuh minimal 44 × 44 px (R-03):** Petugas mengoperasikan aplikasi dengan satu tangan sambil berjalan.
