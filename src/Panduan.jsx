// Panduan memakai aplikasi dengan data asli kloter; dibuka dari Profil.
import React from 'react';

const fs = n => `calc(${n}px * var(--fs, 1))`;

const BAGIAN = [
  ['Sebelum berangkat', [
    'Masuk dengan akun Anda. Bila kloter Anda belum terdaftar, akun langsung aktif dan Anda menjadi ketua kloter. Petugas lain yang mendaftar ke kloter yang sama disetujui ketua kloter di Profil.',
    'Di Profil, periksa identitas pengguna dan isi tanggal berangkat kloter. Lansia (65 tahun ke atas) dihitung dari tanggal ini.',
    'Di Profil bagian Excel, ketuk Unduh Excel, lengkapi data jamaah (nama, nomor porsi, rombongan, regu, jenis kelamin, tanggal lahir), lalu ketuk Unggah Excel.',
    'Buka Jamaah dan cocokkan jumlah serta pembagian rombongan dan regu dengan manifes kloter.',
  ]],
  ['Mengatur tanggal kegiatan', [
    'Buka Checklist, pilih kegiatan, lalu ketuk Atur tanggal. Isi tanggal sesuai jadwal kloter.',
    'Kegiatan yang sudah bertanggal terkunci sampai tanggalnya tiba. Pada hari itu muncul tanda "hari ini".',
    'Sesudah tanggalnya lewat, kegiatan tetap bisa dicentang dan otomatis tercatat sebagai susulan.',
    'Kegiatan yang belum bertanggal mengikuti tanda "kegiatan yang sedang berlangsung" yang Anda pilih sendiri.',
  ]],
  ['Mencentang jamaah', [
    'Pilih cakupan Kloter, Rombongan, atau Regu, lalu centang nama jamaah yang sudah melaksanakan.',
    'Tombol Massal mencentang semua jamaah dalam cakupan yang dipilih sekaligus.',
    'Jamaah udzur, sakit, atau dibadalkan dicatat dari lembar jamaah supaya tidak terhitung tertinggal.',
    'Tanpa internet, centang tetap tersimpan di HP dan terkirim otomatis saat sinyal kembali. Ikon awan di kepala layar menunjukkan status kirim.',
  ]],
  ['Jadwal Raudhoh', [
    'Di Checklist Madinah, ketuk Tambah jadwal. Pilih Laki-laki atau Perempuan untuk jadwal rombongan, lalu pilih rombongannya.',
    'Untuk jamaah yang tertinggal dari jadwal rombongan, pilih Perorangan lalu cari dan pilih nama jamaahnya.',
    'Jadwal yang tanggalnya belum tiba bertanda gembok dan belum bisa dicentang.',
    'Jadwal bertuliskan "Tanpa tanggal" berarti tanggalnya belum terisi di data. Lengkapi lewat admin kloter.',
  ]],
  ['Kejadian, pesan, dan laporan', [
    'Kejadian: catat jamaah sakit, tersesat, atau kejadian lain beserta waktunya.',
    'Kirim: pilih templat pesan, isi bagian yang kosong, lalu bagikan ke grup WhatsApp.',
    'Rekap dan Cetak: lihat capaian per rombongan dan unduh PDF untuk laporan kloter.',
  ]],
  ['Menjaga data', [
    'Pasang PIN aplikasi supaya data jamaah aman bila HP dipinjam.',
    'Jangan membagikan tangkapan layar data pribadi jamaah di luar grup petugas.',
    'Sebelum sinyal hilang lama, buka aplikasi sebentar saat online supaya data terbaru tersimpan.',
  ]],
];

export default function Panduan({ kartu, judul }) {
  return (
    <div style={kartu}>
      <div style={judul}>Panduan penggunaan</div>
      {BAGIAN.map(([j, isi], i) => (
        <details key={j} style={{ borderTop: i ? '1px solid var(--m-garis-kartu)' : 0, paddingTop: i ? 8 : 0 }}>
          <summary style={{ cursor: 'pointer', padding: '12px 0', fontSize: fs(14), fontWeight: 500 }}>{j}</summary>
          <ol style={{ margin: '0 0 8px', paddingLeft: 20, display: 'grid', gap: 6, fontSize: fs(13.5), lineHeight: 1.5, color: 'var(--m-teks)' }}>
            {isi.map(x => <li key={x}>{x}</li>)}
          </ol>
        </details>
      ))}
    </div>
  );
}
